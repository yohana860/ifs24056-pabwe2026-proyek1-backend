import jwt from "jsonwebtoken";

export const sign = (user) => jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });
export const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

export const auth = (req, res, next) => {
  try {
    req.userId = jwt.verify((req.headers.authorization || "").slice(7), process.env.JWT_SECRET).id;
    next();
  } catch {
    res.status(401).json({ error: "Silakan masuk terlebih dahulu" });
  }
};

export const notFound = (req, res) => res.status(404).json({ error: "Endpoint tidak ditemukan" });

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Terjadi kesalahan pada server" });
};
