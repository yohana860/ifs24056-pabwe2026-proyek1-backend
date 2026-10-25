import { DataTypes } from "sequelize";

const timestamps = {
  createdAt: { type: DataTypes.DATE, allowNull: false },
  updatedAt: { type: DataTypes.DATE, allowNull: false },
};
const text = (defaultValue) => ({ type: DataTypes.STRING, allowNull: false, defaultValue });
const longText = (defaultValue) => ({ type: DataTypes.TEXT, allowNull: false, defaultValue });

export async function up(qi) {
  await qi.createTable("Users", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    province: text(""),
    city: text(""),
    district: text(""),
    address: longText(""),
    ...timestamps,
  });
  await qi.createTable("Items", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    sellerId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "Users", key: "id" }, onDelete: "CASCADE" },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false, defaultValue: "" },
    price: { type: DataTypes.INTEGER, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    condition: { type: DataTypes.STRING, allowNull: false },
    province: text(""),
    city: text(""),
    district: text(""),
    address: longText(""),
    image: longText(""),
    status: text("available"),
    ...timestamps,
  });
  await qi.createTable("Favorites", {
    userId: { type: DataTypes.INTEGER, primaryKey: true, references: { model: "Users", key: "id" }, onDelete: "CASCADE" },
    itemId: { type: DataTypes.INTEGER, primaryKey: true, references: { model: "Items", key: "id" }, onDelete: "CASCADE" },
    ...timestamps,
  });
}

export async function down(qi) {
  await qi.dropTable("Favorites");
  await qi.dropTable("Items");
  await qi.dropTable("Users");
}
