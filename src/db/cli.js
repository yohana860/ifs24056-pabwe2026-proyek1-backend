import "dotenv/config";
import "../config/defaults.js";
import sequelize from "../config/database.js";
import { migrate } from "./migrator.js";
import { seedDatabase } from "./seed.js";

const command = process.argv[2];
if (["migrate", "setup"].includes(command)) {
  await migrate();
  console.log("Migrasi selesai");
}
if (["seed", "setup"].includes(command)) {
  const result = await seedDatabase();
  console.log(`Seed selesai: ${result.users} pengguna, ${result.items} barang`);
}
await sequelize.close();
