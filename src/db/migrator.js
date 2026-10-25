import { SequelizeStorage, Umzug } from "umzug";
import sequelize from "../config/database.js";
import * as init from "./migrations/20261024000000-init.js";

export const migrator = new Umzug({
  migrations: [{ name: "20261024000000-init", up: ({ context }) => init.up(context), down: ({ context }) => init.down(context) }],
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: undefined,
});

export const migrate = () => migrator.up();
