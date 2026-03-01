import { DataTypes, Model, ModelStatic } from "sequelize";
import type { InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import { sequelize } from "../config/db.ts";

// Define the User model class
export class Users extends Model<InferAttributes<Users>, InferCreationAttributes<Users>> {
  declare id: CreationOptional<number>;
  declare userName: string;
  declare email: string;
  declare password: string;
  declare accountType: "admin" | "company" | "user";
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  // Optional: associations
  static associate(_models: Record<string, ModelStatic<Model>>) {
    // e.g., Users.hasMany(models.Post);
  }
}

// Initialize the model
Users.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: "user_name",
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    accountType: {
      type: DataTypes.ENUM("admin", "company", "user"),
      allowNull: false,
      defaultValue: "user",
      field: "account_type",
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "users",
    timestamps: true,
    underscored: true,
  }
);

// Sync function
export async function syncUsersModel(options = {}) {
  await Users.sync(options);
}
