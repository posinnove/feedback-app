import { DataTypes, Model } from 'sequelize';
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import { sequelize } from '../config/db.ts';

// Forward-declare Feedback to avoid circular imports
interface FeedbackShape {
  id: number;
  companyId: number;
  title: string;
  description: string | null;
  status: string;
  upvotes: number;
  downvotes: number;
  createdAt: Date;
  updatedAt: Date;
}

export class Company extends Model<
  InferAttributes<Company>,
  InferCreationAttributes<Company>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare slug: string;
  declare email: string;
  declare password: string;
  declare location: CreationOptional<string | null>;
  declare website: CreationOptional<string | null>;
  declare description: CreationOptional<string | null>;
  declare logoUrl: CreationOptional<string | null>;
  declare isEmailVerified: CreationOptional<boolean>;
  declare emailVerificationToken: CreationOptional<string | null>;
  declare emailVerificationExpires: CreationOptional<Date | null>;
  declare passwordResetToken: CreationOptional<string | null>;
  declare passwordResetExpires: CreationOptional<Date | null>;
  declare emailNotifications: CreationOptional<boolean>;
  declare weeklyDigest: CreationOptional<boolean>;
  declare publicProfile: CreationOptional<boolean>;
  declare themeMode: CreationOptional<'system' | 'light' | 'dark'>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare followerCount?: number;

  // Associations (populated via include)
  declare feedbacks?: FeedbackShape[];
}

Company.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    logoUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'logo_url',
    },
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_email_verified',
    },
    emailVerificationToken: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'email_verification_token',
    },
    emailVerificationExpires: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'email_verification_expires',
    },
    passwordResetToken: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'password_reset_token',
    },
    passwordResetExpires: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'password_reset_expires',
    },
    emailNotifications: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'email_notifications',
    },
    weeklyDigest: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'weekly_digest',
    },
    publicProfile: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'public_profile',
    },
    themeMode: {
      type: DataTypes.ENUM('system', 'light', 'dark'),
      allowNull: false,
      defaultValue: 'system',
      field: 'theme_mode',
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'companies',
    timestamps: true,
    underscored: true,
  },
);
