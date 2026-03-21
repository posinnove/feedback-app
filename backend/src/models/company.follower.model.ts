import { DataTypes, Model } from 'sequelize';
import type {
  CreationOptional,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import { sequelize } from '../config/db.ts';
import { Company } from './company.model.ts';
import type { AuthEntityType } from '../utils/token.ts';

export class CompanyFollower extends Model<
  InferAttributes<CompanyFollower>,
  InferCreationAttributes<CompanyFollower>
> {
  declare id: CreationOptional<number>;
  declare companyId: ForeignKey<Company['id']>;
  declare followerId: number;
  declare followerType: AuthEntityType;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

CompanyFollower.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    companyId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'company_id',
    },
    followerId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'follower_id',
    },
    followerType: {
      type: DataTypes.ENUM('user', 'company'),
      allowNull: false,
      field: 'follower_type',
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'company_followers',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['company_id'] },
      { fields: ['follower_id', 'follower_type'] },
      { unique: true, fields: ['company_id', 'follower_id', 'follower_type'] },
    ],
  },
);

CompanyFollower.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });
Company.hasMany(CompanyFollower, { foreignKey: 'companyId', as: 'followers' });
