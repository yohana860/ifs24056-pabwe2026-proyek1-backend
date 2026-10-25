import { Sequelize } from "sequelize";

// Kita paksa selalu menggunakan :memory: jika dijalankan di server (bukan lokal)
// atau jika tidak ada file database yang ditentukan.
// Ini mencegah error "read-only file system" di SnapDeploy.
const isProduction = process.env.NODE_ENV === "production" || process.env.SNAPDEPLOY === "true";

const storage = isProduction 
  ? ":memory:" 
  : (process.env.DB_STORAGE || "./database.sqlite");

const sequelize = new Sequelize({ 
  dialect: "sqlite", 
  storage, 
  logging: false,
  // Hapus dialectOptions dan dialectModule karena SnapDeploy 
  // biasanya sudah menangani sqlite3 dengan benar.
});

export default sequelize;