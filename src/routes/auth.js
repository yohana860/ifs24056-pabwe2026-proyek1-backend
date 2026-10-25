import { Router } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/index.js";
import { asyncHandler, auth, sign } from "../middleware.js";

const router = Router();
const publicUser = ({ id, name, email, city, province, district, address }) => ({
  id,
  name,
  email,
  city,
  province,
  district,
  address,
});

router.post("/register", asyncHandler(async (req, res) => {
  const { name, email, password, city, province, district, address } = req.body;
  if (!name || !email || !password || password.length < 6) {
    return res.status(400).json({ error: "Nama, email, dan kata sandi (min. 6 karakter) wajib diisi" });
  }
  if (await User.findOne({ where: { email } })) return res.status(409).json({ error: "Email sudah terdaftar" });
  const user = await User.create({
    name,
    email,
    password: bcrypt.hashSync(password, 8),
    city: city || "",
    province: province || "",
    district: district || "",
    address: address || "",
  });
  res.status(201).json({ token: sign(user), user: publicUser(user) });
}));

router.post("/login", asyncHandler(async (req, res) => {
  const { email = "", password = "" } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: "Email atau kata sandi salah" });
  }
  res.json({ token: sign(user), user: publicUser(user) });
}));

router.get("/me", auth, asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.userId);
  if (!user) return res.status(401).json({ error: "Pengguna tidak ditemukan" });
  res.json({ user: publicUser(user) });
}));

export default router;
