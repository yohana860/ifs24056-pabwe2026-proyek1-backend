import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import itemRoutes from "./routes/items.js";
import favoriteRoutes from "./routes/favorites.js";
import { errorHandler, notFound } from "./middleware.js";

const app = express();
app.use(cors(), express.json({ limit: "10mb" }), express.urlencoded({ extended: true, limit: "10mb" }));

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api", notFound);
app.use(errorHandler);

export default app;
