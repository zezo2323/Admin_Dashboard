import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import bcrypt from 'bcryptjs';
import { BusinessEntity } from './BusinessEntity';

// Define the User attributes interface
interface UserAttributes {
  id: number;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the User creation attributes (excluding auto-generated fields)
interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt' | 'isActive'> {}

// Define the User model class
export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;
  public firstName!: string;
  public lastName!: string;
  public role!: string;
  public isActive!: boolean;
  public createdAt!: Date;
  public updatedAt!: Date;

  // Define associations
  public readonly businessEntities?: BusinessEntity[];

  // Hash password before saving
  public async hashPassword(): Promise<void> {
    this.password = await bcrypt.hash(this.password, 10);
  }

  // Compare password with hash
  public async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
}

// Initialize the User model
User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      // Add index for faster lookups
      set(this: User, val: string) {
        this.setDataValue('username', val.toLowerCase());
      }
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      // Add index for faster lookups
      set(this: User, val: string) {
        this.setDataValue('email', val.toLowerCase());
      },
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      // Add index for faster searches
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      // Add index for faster searches
    },
    role: {
      type: DataTypes.ENUM('admin', 'user', 'manager'),
      defaultValue: 'user',
      // Add index for role-based queries
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      // Add index for status filtering
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    tableName: 'users',
    sequelize, // passing the sequelize instance
    indexes: [
      // Add indexes for common search operations
      { fields: ['username'] },
      { fields: ['email'] },
      { fields: ['firstName'] },
      { fields: ['lastName'] },
      { fields: ['role'] },
      { fields: ['isActive'] },
      { fields: ['createdAt'] },
      // Composite indexes for common queries
      { fields: ['role', 'isActive'] },
      { fields: ['firstName', 'lastName'] },
    ],
    hooks: {
      beforeCreate: async (user: User) => {
        await user.hashPassword();
      },
      beforeUpdate: async (user: User) => {
        if (user.changed('password')) {
          await user.hashPassword();
        }
      },
    },
  }
);

