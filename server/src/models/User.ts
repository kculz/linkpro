import { DataTypes, Model } from 'sequelize';
import sequelize from '@config/database.js';

class User extends Model {
  declare public id: string;
  declare public name: string;
  declare public email: string;
  declare public password: string;
  declare public role: 'ADMIN' | 'PM' | 'CLIENT' | 'TENANT';
  declare public isVerified: boolean;
  declare public avatar?: string;
  declare public phone?: string;
  declare public readonly createdAt: Date;
  declare public readonly updatedAt: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('ADMIN', 'PM', 'CLIENT', 'TENANT'),
      defaultValue: 'CLIENT',
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    timestamps: true,
  }
);

export default User;
