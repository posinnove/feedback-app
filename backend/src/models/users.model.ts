import { DataTypes, Model } from 'sequelize';
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import { sequelize } from '../config/db.ts';

export class Users extends Model<
  InferAttributes<Users>,
  InferCreationAttributes<Users>
> {
  declare id: CreationOptional<number>;
  declare isAdmin: CreationOptional<boolean>;
  declare firstName: string;
  declare lastName: string;
  declare email: string;
  declare password: string;
  declare avatarUrl: CreationOptional<string | null>;
  declare phoneNumber: CreationOptional<string | null>;
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
}

Users.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'first_name',
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'last_name',
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
    avatarUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'avatar_url',
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      field: 'phone_number',
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
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_admin',
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    underscored: true,
  },
);
