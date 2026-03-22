import { DataTypes, Model } from 'sequelize';
import type {
  CreationOptional,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import { sequelize } from '../config/db.ts';
import type { AuthEntityType } from '../utils/token.ts';
import { Feedback } from './feedback.model.ts';

export class FeedbackReply extends Model<
  InferAttributes<FeedbackReply>,
  InferCreationAttributes<FeedbackReply>
> {
  declare id: CreationOptional<number>;
  declare feedbackId: ForeignKey<Feedback['id']>;
  declare parentReplyId: ForeignKey<FeedbackReply['id']> | null;
  declare authorId: number | null;
  declare authorType: AuthEntityType | null;
  declare isAnonymous: CreationOptional<boolean>;
  declare upvotes: CreationOptional<number>;
  declare downvotes: CreationOptional<number>;
  declare content: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

FeedbackReply.init(
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
    parentReplyId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      field: 'parent_reply_id',
    },
    authorId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      field: 'author_id',
    },
    authorType: {
      type: DataTypes.ENUM('user', 'company'),
      allowNull: true,
      field: 'author_type',
    },
    isAnonymous: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_anonymous',
    },
    upvotes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    downvotes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'feedback_replies',
    timestamps: true,
    underscored: true,
  },
);

FeedbackReply.belongsTo(Feedback, {
  foreignKey: 'feedbackId',
  as: 'feedback',
});
Feedback.hasMany(FeedbackReply, {
  foreignKey: 'feedbackId',
  as: 'replies',
});
FeedbackReply.belongsTo(FeedbackReply, {
  foreignKey: 'parentReplyId',
  as: 'parentReply',
});
FeedbackReply.hasMany(FeedbackReply, {
  foreignKey: 'parentReplyId',
  as: 'childReplies',
});
