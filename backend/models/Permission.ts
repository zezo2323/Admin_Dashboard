import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface PermissionAttributes {
  id: number;
  name: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PermissionCreationAttributes extends Optional<PermissionAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class Permission extends Model<PermissionAttributes, PermissionCreationAttributes> implements PermissionAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Permission.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    tableName: 'permissions',
    sequelize,
  }
);

// Define associations later if needed