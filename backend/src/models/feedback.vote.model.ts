import { DataTypes, Model } from 'sequelize';
import type {
  CreationOptional,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import { sequelize } from '../config/db.ts';
import { Feedback } from './feedback.model.ts';
import type { AuthEntityType } from '../utils/token.ts';

export type VoteDirection = 'up' | 'down';

export class FeedbackVote extends Model<
  InferAttributes<FeedbackVote>,
  InferCreationAttributes<FeedbackVote>
> {
  declare id: CreationOptional<number>;
  declare feedbackId: ForeignKey<Feedback['id']>;
  declare voterId: number;
  declare voterType: AuthEntityType;
  declare direction: VoteDirection;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

FeedbackVote.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    feedbackId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'feedback_id',
    },
    voterId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'voter_id',
    },
    voterType: {
      type: DataTypes.ENUM('user', 'company'),
      allowNull: false,
      field: 'voter_type',
    },
    direction: {
      type: DataTypes.ENUM('up', 'down'),
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'feedback_votes',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['feedback_id'] },
      { fields: ['voter_id', 'voter_type'] },
      { unique: true, fields: ['feedback_id', 'voter_id', 'voter_type'] },
    ],
  },
);

FeedbackVote.belongsTo(Feedback, { foreignKey: 'feedbackId', as: 'feedback' });
Feedback.hasMany(FeedbackVote, { foreignKey: 'feedbackId', as: 'votes' });
