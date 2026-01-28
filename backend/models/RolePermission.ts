import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import { Role } from './Role';
import { Permission } from './Permission';

interface RolePermissionAttributes {
  id: number;
  roleId: number;
  permissionId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface RolePermissionCreationAttributes extends Optional<RolePermissionAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class RolePermission extends Model<RolePermissionAttributes, RolePermissionCreationAttributes> implements RolePermissionAttributes {
  public id!: number;
  public roleId!: number;
  public permissionId!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
}

RolePermission.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    roleId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Role,
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    permissionId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Permission,
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    tableName: 'role_permissions',
    sequelize,
  }
);

// Define associations later if needed