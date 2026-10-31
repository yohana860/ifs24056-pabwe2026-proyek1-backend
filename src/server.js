import "dotenv/config";
import "./config/defaults.js";
import app from "./app.js";

// SnapDeploy memberikan PORT melalui environment variable.
// Jika tidak ada, gunakan 4000 sebagai fallback untuk lokal.
const PORT = process.env.PORT || 4000;

// WAJIB: Listen di 0.0.0.0 agar bisa diakses dari luar container SnapDeploy
app.listen(PORT, "0.0.0.0", () => {
  console.log(`NextOwner API berjalan di port ${PORT}`);
});