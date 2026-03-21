import { DataTypes, Model } from 'sequelize';
import type {
  CreationOptional,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import { sequelize } from '../config/db.ts';
import { FeedbackReply } from './feedback.reply.model.ts';
import type { AuthEntityType } from '../utils/token.ts';

export type ReplyVoteDirection = 'up' | 'down';

export class FeedbackReplyVote extends Model<
  InferAttributes<FeedbackReplyVote>,
  InferCreationAttributes<FeedbackReplyVote>
> {
  declare id: CreationOptional<number>;
  declare replyId: ForeignKey<FeedbackReply['id']>;
  declare voterId: number;
  declare voterType: AuthEntityType;
  declare direction: ReplyVoteDirection;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

FeedbackReplyVote.init(
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
    tableName: 'feedback_reply_votes',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['reply_id'] },
      { fields: ['voter_id', 'voter_type'] },
      { unique: true, fields: ['reply_id', 'voter_id', 'voter_type'] },
    ],
  },
);

FeedbackReplyVote.belongsTo(FeedbackReply, {
  foreignKey: 'replyId',
  as: 'reply',
});
FeedbackReply.hasMany(FeedbackReplyVote, {
  foreignKey: 'replyId',
  as: 'votes',
});
