import { DataTypes, Model } from "sequelize";
import type {
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    ForeignKey,
    NonAttribute,
} from "sequelize";
import { sequelize } from "../config/db.ts";
import { Users } from "./users.model.ts";

// Forward-declare Feedback to avoid circular imports
// The actual Feedback model is loaded in feedback.model.ts
interface FeedbackShape {
    id: number;
    companyId: number;
    title: string;
    description: string | null;
    status: string;
    upvotes: number;
    createdAt: Date;
    updatedAt: Date;
}

export class Company extends Model<
    InferAttributes<Company>,
    InferCreationAttributes<Company>
> {
    declare id: CreationOptional<number>;
    declare userId: ForeignKey<Users["id"]>;
    declare name: string;
    declare slug: string;
    declare description: CreationOptional<string | null>;
    declare logoUrl: CreationOptional<string | null>;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    // Associations (populated via include)
    declare owner?: NonAttribute<Users>;
    declare feedbacks?: NonAttribute<FeedbackShape[]>;
}

Company.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            field: "user_id",
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        slug: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        logoUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        sequelize,
        tableName: "companies",
        timestamps: true,
        underscored: true,
    }
);

// Associations
Company.belongsTo(Users, { foreignKey: "userId", as: "owner" });
Users.hasOne(Company, { foreignKey: "userId", as: "company" });
