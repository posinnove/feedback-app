import { DataTypes, Model } from 'sequelize';
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from 'sequelize';
import { sequelize } from '../config/db.ts';
import { Company } from './company.model.ts';
import { FeedbackType } from './feedback.type.model.ts';
import { Users } from './users.model.ts';

export type FeedbackStatus =
  | 'planned'
  | 'in-progress'
  | 'completed'
  | 'under-review'
  | 'rejected';

export class Feedback extends Model<
  InferAttributes<Feedback>,
  InferCreationAttributes<Feedback>
> {
  declare id: CreationOptional<number>;
  declare companyId: ForeignKey<Company['id']>;
  declare requesterUserId: ForeignKey<Users['id']> | null;
  declare isAnonymous: CreationOptional<boolean>;
  declare feedbackTypeId: ForeignKey<FeedbackType['id']> | null;
  declare title: string;
  declare description: CreationOptional<string | null>;
  declare status: CreationOptional<FeedbackStatus>;
  declare upvotes: CreationOptional<number>;
  declare downvotes: CreationOptional<number>;
  declare viewCount: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare company?: Company;
  declare feedbackType?: FeedbackType;
  declare requester?: Users;
}

Feedback.init(
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
    requesterUserId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      field: 'requester_user_id',
    },
    isAnonymous: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_anonymous',
    },
    feedbackTypeId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      field: 'feedback_type_id',
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(
        'planned',
        'in-progress',
        'completed',
        'under-review',
        'rejected',
      ),
      allowNull: false,
      defaultValue: 'planned',
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
    viewCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'view_count',
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'feedbacks',
    timestamps: true,
    underscored: true,
  },
);

// Associations
Feedback.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });
Company.hasMany(Feedback, { foreignKey: 'companyId', as: 'feedbacks' });
Feedback.belongsTo(FeedbackType, {
  foreignKey: 'feedbackTypeId',
  as: 'feedbackType',
});
FeedbackType.hasMany(Feedback, {
  foreignKey: 'feedbackTypeId',
  as: 'feedbacks',
});
Feedback.belongsTo(Users, {
  foreignKey: 'requesterUserId',
  as: 'requester',
});
Users.hasMany(Feedback, {
  foreignKey: 'requesterUserId',
  as: 'requestedFeedbacks',
});
