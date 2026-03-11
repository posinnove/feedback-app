import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db";

export interface FeedbackAttributes {
  id: number;
  title: string;
  description: string;
  category: string;
  status: "open" | "reviewed" | "resolved";
  companyId: number;
  postType: "company" | "user";
  linkUrl?: string | null;
  imageUrl?: string | null;
  videoUrl?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface FeedbackCreationAttributes
  extends Optional<
    FeedbackAttributes,
    "id" | "status" | "postType" | "linkUrl" | "imageUrl" | "videoUrl"
  > {}

export class Feedback
  extends Model<FeedbackAttributes, FeedbackCreationAttributes>
  implements FeedbackAttributes
{
  public id!: number;
  public title!: string;
  public description!: string;
  public category!: string;
  public status!: "open" | "reviewed" | "resolved";
  public companyId!: number;
  public postType!: "company" | "user";
  public linkUrl!: string | null;
  public imageUrl!: string | null;
  public videoUrl!: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Feedback.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("open", "reviewed", "resolved"),
      allowNull: false,
      defaultValue: "open",
    },

    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    postType: {
      type: DataTypes.ENUM("company", "user"),
      allowNull: false,
      defaultValue: "company",
    },

    linkUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    imageUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    videoUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "feedback",
    timestamps: true,
  }
);