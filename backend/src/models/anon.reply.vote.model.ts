import { DataTypes, Model } from 'sequelize';
import type {
  CreationOptional,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import { sequelize } from '../config/db.ts';
import { FeedbackReply } from './feedback.reply.model.ts';

export type AnonReplyVoteDirection = 'up' | 'down';

export class AnonReplyVote extends Model<
  InferAttributes<AnonReplyVote>,
  InferCreationAttributes<AnonReplyVote>
> {
  declare id: CreationOptional<number>;
  declare replyId: ForeignKey<FeedbackReply['id']>;
  /** SHA-256 hex of the anon token jti */
  declare fingerprint: string;
  declare direction: AnonReplyVoteDirection;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

AnonReplyVote.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    replyId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'reply_id',
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
    tableName: 'anon_reply_votes',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['reply_id'] },
      { fields: ['fingerprint'] },
      { unique: true, fields: ['reply_id', 'fingerprint'] },
    ],
  },
);

AnonReplyVote.belongsTo(FeedbackReply, {
  foreignKey: 'replyId',
  as: 'reply',
});
FeedbackReply.hasMany(AnonReplyVote, {
  foreignKey: 'replyId',
  as: 'anonVotes',
});
