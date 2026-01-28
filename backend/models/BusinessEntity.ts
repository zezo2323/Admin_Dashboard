import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import { User } from './User';

interface BusinessEntityAttributes {
  id: number;
  name: string;
  description: string | null;
  status: string;
  value: number;
  ownerId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface BusinessEntityCreationAttributes
  extends Optional<
    BusinessEntityAttributes,
    'id' | 'createdAt' | 'updatedAt'
  > {}

export class BusinessEntity
  extends Model<
    BusinessEntityAttributes,
    BusinessEntityCreationAttributes
  >
  implements BusinessEntityAttributes
{
  public id!: number;
  public name!: string;
  public description!: string | null;
  public status!: string;
  public value!: number;
  public ownerId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly owner?: User;
}

BusinessEntity.init(
  {
    id: {
      type: DataTypes.INTEGER, // ✅ بدون UNSIGNED
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM(
        'active',
        'pending',
        'completed',
        'cancelled'
      ),
      allowNull: false,
      defaultValue: 'pending',
    },

    value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },

    ownerId: {
      type: DataTypes.INTEGER, // ✅ بدون UNSIGNED
      allowNull: false,
      references: {
        model: 'users', // ✅ اسم الجدول
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },

    createdAt: {
      type: DataTypes.DATE,
    },

    updatedAt: {
      type: DataTypes.DATE,
    },
  },

  {
    sequelize,
    tableName: 'business_entities',
    timestamps: true,

    indexes: [
      { fields: ['name'] },
      { fields: ['status'] },
      { fields: ['ownerId'] },
      { fields: ['createdAt'] },
    ],
  }
);
