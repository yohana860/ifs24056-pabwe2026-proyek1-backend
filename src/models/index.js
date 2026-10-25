import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

export const User = sequelize.define("User", {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  province: { type: DataTypes.STRING, allowNull: false, defaultValue: "" },
  city: { type: DataTypes.STRING, allowNull: false, defaultValue: "" },
  district: { type: DataTypes.STRING, allowNull: false, defaultValue: "" },
  address: { type: DataTypes.TEXT, allowNull: false, defaultValue: "" },
});

export const Item = sequelize.define("Item", {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false, defaultValue: "" },
  price: { type: DataTypes.INTEGER, allowNull: false },
  category: { type: DataTypes.STRING, allowNull: false },
  condition: { type: DataTypes.STRING, allowNull: false },
  province: { type: DataTypes.STRING, allowNull: false, defaultValue: "" },
  city: { type: DataTypes.STRING, allowNull: false, defaultValue: "" },
  district: { type: DataTypes.STRING, allowNull: false, defaultValue: "" },
  address: { type: DataTypes.TEXT, allowNull: false, defaultValue: "" },
  image: { type: DataTypes.TEXT, allowNull: false, defaultValue: "" },
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: "available" },
});

export const Favorite = sequelize.define("Favorite", {
  userId: { type: DataTypes.INTEGER, primaryKey: true },
  itemId: { type: DataTypes.INTEGER, primaryKey: true },
});

User.hasMany(Item, { foreignKey: { name: "sellerId", allowNull: false }, as: "items", onDelete: "CASCADE" });
Item.belongsTo(User, { foreignKey: "sellerId", as: "seller" });
Favorite.belongsTo(User, { foreignKey: "userId", as: "user", onDelete: "CASCADE" });
Favorite.belongsTo(Item, { foreignKey: "itemId", as: "item", onDelete: "CASCADE" });

export const sellerInclude = { model: User, as: "seller", attributes: ["id", "name", "email", "province", "city", "address"] };
export { sequelize };
