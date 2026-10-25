import { Sequelize } from "sequelize";
import sqlite3 from "sqlite3"; // Import sqlite3 secara langsung

const storage = process.env.NODE_ENV === "production" 
  ? ":memory:" 
  : (process.env.DB_STORAGE || "./database.sqlite");

const sequelize = new Sequelize({ 
  dialect: "sqlite", 
  storage, 
  logging: false,
  dialectOptions: {
    // Paksa Sequelize menggunakan modul sqlite3 yang sudah diimpor
    mode: sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  },
  // Teruskan modul sqlite3 secara eksplisit ke Sequelize
  dialectModule: sqlite3, 
});

export default sequelize;