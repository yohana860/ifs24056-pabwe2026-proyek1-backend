import { migrate, migrator } from "./migrator.js";
import { seedDatabase } from "./seed.js";
import { sequelize } from "../models/index.js";

afterAll(() => sequelize.close());

describe("migrasi dan seed", () => {
  it("membuat tabel, mengisi data contoh, lalu mengembalikan (down)", async () => {
    await migrate();
    const qi = sequelize.getQueryInterface();
    expect((await qi.showAllTables()).sort()).toEqual(expect.arrayContaining(["Favorites", "Items", "Users"]));

    expect(await seedDatabase()).toEqual({ users: 2, items: 12 });
    expect(await seedDatabase()).toEqual({ users: 2, items: 12 });

    await migrator.down({ to: 0 });
    expect(await qi.showAllTables()).not.toContain("Items");
  });
});
