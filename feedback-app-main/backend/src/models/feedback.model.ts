import { DataTypes, Model } from "sequelize";
import type {
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    ForeignKey,
} from "sequelize";
import { sequelize } from "../config/db.ts";
import { Company } from "./company.model.ts";

export type FeedbackStatus =
    | "planned"
    | "in-progress"
    | "completed"
    | "under-review"
    | "rejected";

export class Feedback extends Model<
    InferAttributes<Feedback>,
    InferCreationAttributes<Feedback>
> {
    declare id: CreationOptional<number>;
    declare companyId: ForeignKey<Company["id"]>;
    declare title: string;
    declare description: CreationOptional<string | null>;
    declare status: CreationOptional<FeedbackStatus>;
    declare upvotes: CreationOptional<number>;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}

Feedback.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        companyId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            field: "company_id",
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM(
                "planned",
                "in-progress",
                "completed",
                "under-review",
                "rejected"
            ),
            allowNull: false,
            defaultValue: "planned",
        },
        upvotes: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        sequelize,
        tableName: "feedbacks",
        timestamps: true,
        underscored: true,
    }
);

// Associations
Feedback.belongsTo(Company, { foreignKey: "companyId", as: "company" });
Company.hasMany(Feedback, { foreignKey: "companyId", as: "feedbacks" });
