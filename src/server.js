import "dotenv/config";
import "./config/defaults.js";
import app from "./app.js";
import { migrate } from "./db/migrator.js";
import { seedDatabase } from "./db/seed.js";
import { User } from "./models/index.js";

// Pastikan skema database dan seed data terisi saat server start (khususnya saat :memory: di production/SnapDeploy/Vercel)
try {
  await migrate();
  const userCount = await User.count().catch(() => 0);
  if (userCount === 0) {
    await seedDatabase();
  }
} catch (err) {
  console.error("Gagal inisialisasi database saat start:", err);
}

// SnapDeploy memberikan PORT melalui environment variable.
// Jika tidak ada, gunakan 4000 sebagai fallback untuk lokal.
const PORT = process.env.PORT || 4000;

// WAJIB: Listen di 0.0.0.0 agar bisa diakses dari luar container SnapDeploy
app.listen(PORT, "0.0.0.0", () => {
  console.log(`NextOwner API berjalan di port ${PORT}`);
});