import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Activity extends Model {
  public id!: string;
  public userId!: string;
  public type!: 'CREATE' | 'UPDATE' | 'DELETE' | 'STATUS_CHANGE' | 'ASSIGNMENT';
  public description!: string;
  public targetId!: string;
  public targetType!: 'PROPERTY' | 'PROJECT' | 'TASK' | 'UNIT' | 'TENANT' | 'TRANSACTION' | 'MAINTENANCE' | 'GENERAL';
  public metadata?: any;
  public readonly createdAt!: Date;

  static associate(models: any) {
    Activity.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  }
}

Activity.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false },
    type: { 
      type: DataTypes.ENUM('CREATE', 'UPDATE', 'DELETE', 'STATUS_CHANGE', 'ASSIGNMENT'), 
      allowNull: false 
    },
    description: { type: DataTypes.STRING, allowNull: false },
    targetId: { type: DataTypes.UUID, allowNull: false },
    targetType: { 
      type: DataTypes.ENUM('PROPERTY', 'PROJECT', 'TASK', 'UNIT', 'TENANT', 'TRANSACTION', 'MAINTENANCE', 'GENERAL'), 
      allowNull: false 
    },
    metadata: { type: DataTypes.JSONB, allowNull: true },
  },
  { sequelize, modelName: 'Activity', tableName: 'Activities', timestamps: true, updatedAt: false }
);

export default Activity;
