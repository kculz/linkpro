import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Notification extends Model {
  public id!: string;
  public userId!: string;
  public title!: string;
  public message!: string;
  public type!: 'INFO' | 'WARNING' | 'URGENT' | 'SUCCESS';
  public read!: boolean;
  public link?: string;
  public metadata?: any;

  static associate(models: any) {
    Notification.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  }
}

Notification.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    type: { 
      type: DataTypes.ENUM('INFO', 'WARNING', 'URGENT', 'SUCCESS'), 
      defaultValue: 'INFO' 
    },
    read: { type: DataTypes.BOOLEAN, defaultValue: false },
    link: { type: DataTypes.STRING, allowNull: true },
    metadata: { type: DataTypes.JSONB, allowNull: true },
  },
  { sequelize, modelName: 'Notification', tableName: 'Notifications', timestamps: true }
);

export default Notification;
