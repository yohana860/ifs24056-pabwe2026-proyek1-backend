import { Router } from "express";
import { Favorite, Item, sellerInclude } from "../models/index.js";
import { asyncHandler, auth } from "../middleware.js";

const router = Router();
const idsOf = async (userId) => (await Favorite.findAll({ where: { userId } })).map((f) => f.itemId);

router.use(auth);

router.get("/ids", asyncHandler(async (req, res) => res.json({ ids: await idsOf(req.userId) })));

router.get("/", asyncHandler(async (req, res) => {
  const rows = await Favorite.findAll({
    where: { userId: req.userId },
    include: [{ model: Item, as: "item", include: [sellerInclude] }],
    order: [["createdAt", "DESC"]],
  });
  res.json(rows.map((r) => r.item));
}));

router.post("/:id", asyncHandler(async (req, res) => {
  const itemId = parseInt(req.params.id, 10) || 0;
  const userId = req.userId;
  if (!(await Item.findByPk(itemId))) return res.status(404).json({ error: "Barang tidak ditemukan" });
  const removed = await Favorite.destroy({ where: { userId, itemId } });
  if (!removed) await Favorite.create({ userId, itemId });
  res.json({ ids: await idsOf(userId) });
}));

export default router;
