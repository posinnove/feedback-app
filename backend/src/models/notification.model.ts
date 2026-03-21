import { DataTypes, Model } from 'sequelize';
import type {
  CreationOptional,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import { sequelize } from '../config/db.ts';
import { Feedback } from './feedback.model.ts';
import { FeedbackReply } from './feedback.reply.model.ts';

export type NotificationType =
  | 'feedback_created'
  | 'reply_created'
  | 'reply_to_your_reply'
  | 'feedback_status_changed';

export class Notification extends Model<
  InferAttributes<Notification>,
  InferCreationAttributes<Notification>
> {
  declare id: CreationOptional<number>;
  declare recipientId: number;
  declare recipientType: 'user' | 'company';
  declare type: NotificationType;
  declare title: string;
  declare message: CreationOptional<string | null>;
  declare feedbackId: number;
  declare relatedReplyId: CreationOptional<number | null>;
  declare isRead: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare feedback?: Feedback;
  declare relatedReply?: FeedbackReply;
}

Notification.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    recipientId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'recipient_id',
    },
    recipientType: {
      type: DataTypes.ENUM('user', 'company'),
      allowNull: false,
      field: 'recipient_type',
    },
    type: {
      type: DataTypes.ENUM(
        'feedback_created',
        'reply_created',
        'reply_to_your_reply',
        'feedback_status_changed',
      ),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    feedbackId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'feedback_id',
    },
    relatedReplyId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      field: 'related_reply_id',
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_read',
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'notifications',
    timestamps: true,
    underscored: true,
  },
);

// Associations
Notification.belongsTo(Feedback, {
  foreignKey: 'feedbackId',
  as: 'feedback',
});
Feedback.hasMany(Notification, {
  foreignKey: 'feedbackId',
  as: 'notifications',
});

Notification.belongsTo(FeedbackReply, {
  foreignKey: 'relatedReplyId',
  as: 'relatedReply',
});
FeedbackReply.hasMany(Notification, {
  foreignKey: 'relatedReplyId',
  as: 'notifications',
});

export default Notification;
