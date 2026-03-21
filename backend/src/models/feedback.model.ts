import { DataTypes, Model } from "sequelize";
import type {
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    ForeignKey,
} from "sequelize";
import { sequelize } from "../config/db.ts";
import { Company } from "./company.model.ts";

import { Users } from "./users.model.ts";

export type FeedbackStatus =
    | "OPEN"
    | "PLANNED"
    | "IN_PROGRESS"
    | "COMPLETED";

export class Feedback extends Model<
    InferAttributes<Feedback>,
    InferCreationAttributes<Feedback>
> {
    declare id: CreationOptional<number>;
    declare companyId: ForeignKey<Company["id"]>;
    declare createdBy: ForeignKey<Users["id"]>;
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
        createdBy: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            field: "created_by",
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
                "OPEN",
                "PLANNED",
                "IN_PROGRESS",
                "COMPLETED"
            ),
            allowNull: false,
            defaultValue: "OPEN",
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

Feedback.belongsTo(Users, { foreignKey: "createdBy", as: "author" });
Users.hasMany(Feedback, { foreignKey: "createdBy", as: "feedbacks" });
