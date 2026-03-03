import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db";

export interface FeedbackReplyAttributes {
  id: number;
  feedbackId: number;
  companyId: number;
  author: "COMPANY" | "USER";
  message: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface FeedbackReplyCreationAttributes
  extends Optional<FeedbackReplyAttributes, "id" | "author"> {}

export class FeedbackReply
  extends Model<FeedbackReplyAttributes, FeedbackReplyCreationAttributes>
  implements FeedbackReplyAttributes
{
  public id!: number;
  public feedbackId!: number;
  public companyId!: number;
  public author!: "COMPANY" | "USER";
  public message!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

FeedbackReply.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    feedbackId: { type: DataTypes.INTEGER, allowNull: false },
    author: {
      type: DataTypes.ENUM("COMPANY", "USER"),
      allowNull: false,
      defaultValue: "COMPANY",
    },
    companyId: { type: DataTypes.INTEGER, allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
  },
  {
    sequelize,
    tableName: "feedback_replies",
    timestamps: true,
  }
);