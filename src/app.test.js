import request from "supertest";
import app from "./app.js";
import { Item, sequelize } from "./models/index.js";
import { migrate } from "./db/migrator.js";

const valid = {
  title: "Sepatu Bekas",
  price: 50000,
  category: "Fashion",
  condition: "Baik",
  province: "Sumatera Utara",
  city: "Kabupaten Toba",
  district: "Balige",
  address: "Jl. Patuan Nagari No. 10",
  image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
};
const as = (t) => ({ Authorization: `Bearer ${t}` });
let tokenA;
let tokenB;
let itemId;

beforeAll(async () => { await migrate(); });
afterAll(() => sequelize.close());

describe("health, 404, dan error handler", () => {
  it("GET /api/health", async () => {
    expect((await request(app).get("/api/health")).body.status).toBe("ok");
  });
  it("404 untuk endpoint tak dikenal", async () => {
    expect((await request(app).get("/api/xyz")).status).toBe(404);
  });
  it("500 bila terjadi kesalahan tak terduga", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(Item, "findAll").mockRejectedValueOnce(new Error("db mati"));
    expect((await request(app).get("/api/items")).status).toBe(500);
  });
});

describe("auth", () => {
  it("menolak registrasi tidak lengkap", async () => {
    expect((await request(app).post("/api/auth/register").send({ name: "A" })).status).toBe(400);
  });
  it("registrasi sukses, duplikat ditolak", async () => {
    const a = await request(app).post("/api/auth/register").send({
      name: "Ani",
      email: "a@x.id",
      password: "secret1",
      province: "Sumatera Utara",
      city: "Kabupaten Toba",
      address: "Jl. Sisingamangaraja",
    });
    expect(a.status).toBe(201);
    expect(a.body.user.province).toBe("Sumatera Utara");
    tokenA = a.body.token;
    const b = await request(app).post("/api/auth/register").send({
      name: "Budi",
      email: "b@x.id",
      password: "secret1",
      city: "Medan",
    });
    tokenB = b.body.token;
    expect((await request(app).post("/api/auth/register").send({ name: "Ani", email: "a@x.id", password: "secret1" })).status).toBe(409);
  });
  it("login benar dan salah", async () => {
    expect((await request(app).post("/api/auth/login").send({ email: "a@x.id", password: "secret1" })).status).toBe(200);
    expect((await request(app).post("/api/auth/login").send({ email: "a@x.id", password: "salah" })).status).toBe(401);
    expect((await request(app).post("/api/auth/login").send({})).status).toBe(401);
  });
  it("me: tanpa token 401, dengan token 200", async () => {
    expect((await request(app).get("/api/auth/me")).status).toBe(401);
    expect((await request(app).get("/api/auth/me").set(as(tokenA))).body.user.email).toBe("a@x.id");
  });
  it("me: token milik pengguna yang sudah terhapus", async () => {
    const u = await request(app).post("/api/auth/register").send({ name: "C", email: "c@x.id", password: "secret1" });
    await sequelize.models.User.destroy({ where: { email: "c@x.id" } });
    expect((await request(app).get("/api/auth/me").set(as(u.body.token))).status).toBe(401);
  });
});

describe("items", () => {
  it("membuat barang dan menolak data tidak valid atau tanpa login", async () => {
    expect((await request(app).post("/api/items").send(valid)).status).toBe(401);
    expect((await request(app).post("/api/items").set(as(tokenA)).send({ ...valid, price: -1 })).status).toBe(400);
    expect((await request(app).post("/api/items").set(as(tokenA)).send({ price: 1000, category: "Fashion", condition: "Baik" })).status).toBe(400);
    const r = await request(app).post("/api/items").set(as(tokenA)).send(valid);
    expect(r.status).toBe(201);
    expect(r.body.image).toContain("base64");
    expect(r.body.province).toBe("Sumatera Utara");
    expect(r.body.address).toBe("Jl. Patuan Nagari No. 10");
    itemId = r.body.id;
    await request(app).post("/api/items").set(as(tokenB)).send({ ...valid, title: "Meja Kayu", price: 200000, category: "Furniture", description: "Meja jati" });
  });
  it("daftar dengan pencarian, filter, dan urutan", async () => {
    expect((await request(app).get("/api/items")).body).toHaveLength(2);
    expect((await request(app).get("/api/items?q=jati")).body).toHaveLength(1);
    expect((await request(app).get("/api/items?category=Fashion&condition=Baik")).body).toHaveLength(1);
    expect((await request(app).get("/api/items?min=100000&max=300000")).body[0].title).toBe("Meja Kayu");
    expect((await request(app).get("/api/items?max=60000")).body).toHaveLength(1);
    expect((await request(app).get("/api/items?sort=cheap")).body[0].price).toBe(50000);
    expect((await request(app).get("/api/items?sort=pricey")).body[0].price).toBe(200000);
  });
  it("detail dan 404", async () => {
    const detail = (await request(app).get(`/api/items/${itemId}`)).body;
    expect(detail.seller.name).toBe("Ani");
    expect(detail.image).toContain("base64");
    expect((await request(app).get("/api/items/99999")).status).toBe(404);
    expect((await request(app).get("/api/items/abc")).status).toBe(404);
  });
  it("barang saya", async () => {
    expect((await request(app).get("/api/items/mine").set(as(tokenA))).body).toHaveLength(1);
  });
  it("ubah data oleh pemilik; ditolak untuk orang lain atau data salah", async () => {
    expect((await request(app).put(`/api/items/${itemId}`).set(as(tokenB)).send({ status: "sold" })).status).toBe(404);
    expect((await request(app).put(`/api/items/${itemId}`).set(as(tokenA)).send({ status: "rusak" })).status).toBe(400);
    const r = await request(app).put(`/api/items/${itemId}`).set(as(tokenA)).send({ status: "sold", price: "60000" });
    expect(r.body.status).toBe("sold");
    expect(r.body.price).toBe(60000);
    expect((await request(app).get("/api/items")).body.pop().status).toBe("sold");
  });
});

describe("favorites", () => {
  it("toggle, daftar, dan 404", async () => {
    expect((await request(app).get("/api/favorites/ids")).status).toBe(401);
    expect((await request(app).post(`/api/favorites/${itemId}`).set(as(tokenB))).body.ids).toEqual([itemId]);
    expect((await request(app).get("/api/favorites").set(as(tokenB))).body[0].id).toBe(itemId);
    expect((await request(app).get("/api/favorites/ids").set(as(tokenB))).body.ids).toEqual([itemId]);
    expect((await request(app).post(`/api/favorites/${itemId}`).set(as(tokenB))).body.ids).toEqual([]);
    expect((await request(app).post("/api/favorites/99999").set(as(tokenB))).status).toBe(404);
    expect((await request(app).post("/api/favorites/abc").set(as(tokenB))).status).toBe(404);
  });
});

describe("hapus barang", () => {
  it("hanya pemilik yang bisa menghapus", async () => {
    expect((await request(app).delete(`/api/items/${itemId}`).set(as(tokenB))).status).toBe(404);
    expect((await request(app).delete(`/api/items/${itemId}`).set(as(tokenA))).body.ok).toBe(true);
  });
});
