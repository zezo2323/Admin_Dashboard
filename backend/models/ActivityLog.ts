import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import { User } from './User';

interface ActivityLogAttributes {
  id: number;
  userId: number;
  action: string;
  entity: string;
  entityId: number;
  details: string;
  ipAddress: string;
  userAgent: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ActivityLogCreationAttributes extends Optional<ActivityLogAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class ActivityLog extends Model<ActivityLogAttributes, ActivityLogCreationAttributes> implements ActivityLogAttributes {
  public id!: number;
  public userId!: number;
  public action!: string;
  public entity!: string;
  public entityId!: number;
  public details!: string;
  public ipAddress!: string;
  public userAgent!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

ActivityLog.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    action: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    entity: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    entityId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true, // Some actions might not be related to a specific entity
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ipAddress: {
      type: DataTypes.STRING(45), // IPv6 addresses can be up to 45 characters
      allowNull: true,
    },
    userAgent: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    tableName: 'activity_logs',
    sequelize,
  }
);

// Define associations later if needed