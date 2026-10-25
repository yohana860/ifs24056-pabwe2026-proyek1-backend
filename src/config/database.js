import { Sequelize } from "sequelize";

// Jika di Vercel (production), gunakan in-memory database.
// Jika di laptop (development), gunakan file database.sqlite.
const storage = process.env.NODE_ENV === "production" 
  ? ":memory:" 
  : (process.env.DB_STORAGE || "./database.sqlite");

const sequelize = new Sequelize({ 
  dialect: "sqlite", 
  storage, 
  logging: false 
});

export default sequelize;