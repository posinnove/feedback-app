import { DataTypes, Model } from 'sequelize';
import type {
  CreationOptional,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import { sequelize } from '../config/db.ts';
import { Feedback } from './feedback.model.ts';

export type AnonVoteDirection = 'up' | 'down';

export class AnonFeedbackVote extends Model<
  InferAttributes<AnonFeedbackVote>,
  InferCreationAttributes<AnonFeedbackVote>
> {
  declare id: CreationOptional<number>;
  declare feedbackId: ForeignKey<Feedback['id']>;
  /** SHA-256 hex of the anon token jti */
  declare fingerprint: string;
  declare direction: AnonVoteDirection;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

AnonFeedbackVote.init(
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
    fingerprint: {
      type: DataTypes.STRING(64),
      allowNull: false,
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
    tableName: 'anon_feedback_votes',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['feedback_id'] },
      { fields: ['fingerprint'] },
      { unique: true, fields: ['feedback_id', 'fingerprint'] },
    ],
  },
);

AnonFeedbackVote.belongsTo(Feedback, {
  foreignKey: 'feedbackId',
  as: 'feedback',
});
Feedback.hasMany(AnonFeedbackVote, {
  foreignKey: 'feedbackId',
  as: 'anonVotes',
});
