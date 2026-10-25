import { Router } from "express";
import { Op } from "sequelize";
import { Item, sellerInclude } from "../models/index.js";
import { asyncHandler, auth } from "../middleware.js";
import { CATEGORIES, CONDITIONS, STATUSES } from "../constants.js";

const router = Router();
const include = [sellerInclude];
const FIELDS = ["title", "description", "price", "category", "condition", "province", "city", "district", "address", "image", "status"];
const idOf = (req) => parseInt(req.params.id, 10) || 0;

const rules = {
  title: (v) => typeof v === "string" && v.trim() !== "",
  price: (v) => Number.isInteger(v) && v >= 0,
  category: (v) => CATEGORIES.includes(v),
  condition: (v) => CONDITIONS.includes(v),
  status: (v) => STATUSES.includes(v),
};
const required = ["title", "price", "category", "condition"];

const validate = (data, partial) => Object.entries(rules).every(([key, ok]) => {
  if (data[key] === undefined) return partial || !required.includes(key);
  return ok(data[key]);
});

const pick = (body) => {
  const data = {};
  FIELDS.forEach((k) => { if (body[k] !== undefined) data[k] = k === "price" ? Number(body[k]) : body[k]; });
  return data;
};

router.get("/", asyncHandler(async (req, res) => {
  const { q, category, condition, min, max, sort } = req.query;
  const price = {};
  if (min) price[Op.gte] = Number(min);
  if (max) price[Op.lte] = Number(max);
  const where = {
    ...(q && { [Op.or]: [{ title: { [Op.like]: `%${q}%` } }, { description: { [Op.like]: `%${q}%` } }] }),
    ...(category && { category }),
    ...(condition && { condition }),
    ...(min || max ? { price } : {}),
  };
  const second = { cheap: ["price", "ASC"], pricey: ["price", "DESC"] }[sort] || ["id", "DESC"];
  res.json(await Item.findAll({ where, include, order: [["status", "ASC"], second] }));
}));

router.get("/mine", auth, asyncHandler(async (req, res) => {
  res.json(await Item.findAll({ where: { sellerId: req.userId }, include, order: [["id", "DESC"]] }));
}));

router.get("/:id", asyncHandler(async (req, res) => {
  const item = await Item.findByPk(idOf(req), { include });
  if (!item) return res.status(404).json({ error: "Barang tidak ditemukan" });
  res.json(item);
}));

router.post("/", auth, asyncHandler(async (req, res) => {
  const data = pick(req.body);
  if (!validate(data, false)) {
    return res.status(400).json({ error: "Judul, harga, kategori, dan kondisi wajib diisi dengan benar" });
  }
  const created = await Item.create({ ...data, sellerId: req.userId });
  res.status(201).json(await Item.findByPk(created.id, { include }));
}));

router.put("/:id", auth, asyncHandler(async (req, res) => {
  const item = await Item.findOne({ where: { id: idOf(req), sellerId: req.userId } });
  if (!item) return res.status(404).json({ error: "Barang tidak ditemukan atau bukan milikmu" });
  const data = pick(req.body);
  if (!validate(data, true)) return res.status(400).json({ error: "Data barang tidak valid" });
  await item.update(data);
  res.json(await Item.findByPk(item.id, { include }));
}));

router.delete("/:id", auth, asyncHandler(async (req, res) => {
  const count = await Item.destroy({ where: { id: idOf(req), sellerId: req.userId } });
  if (!count) return res.status(404).json({ error: "Barang tidak ditemukan atau bukan milikmu" });
  res.json({ ok: true });
}));

export default router;
