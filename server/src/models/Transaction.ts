import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Transaction extends Model {
  public id!: string;
  public tenantId!: string;
  public propertyId!: string;
  public unitId!: string;
  public amount!: number;
  public type!: 'RENT' | 'DEPOSIT' | 'MAINTENANCE' | 'OTHER';
  public status!: 'PAID' | 'PENDING' | 'OVERDUE' | 'FAILED';
  public paymentMethod?: string;
  public dueDate!: Date;
  public paidDate?: Date;
  public metadata?: any;

  static associate(models: any) {
    Transaction.belongsTo(models.Tenant, { foreignKey: 'tenantId', as: 'tenant' });
    Transaction.belongsTo(models.Property, { foreignKey: 'propertyId', as: 'property' });
    Transaction.belongsTo(models.Unit, { foreignKey: 'unitId', as: 'unit' });
  }
}

Transaction.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    tenantId: { type: DataTypes.UUID, allowNull: false },
    propertyId: { type: DataTypes.UUID, allowNull: false },
    unitId: { type: DataTypes.UUID, allowNull: false },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    type: { 
      type: DataTypes.ENUM('RENT', 'DEPOSIT', 'MAINTENANCE', 'OTHER'), 
      defaultValue: 'RENT' 
    },
    status: { 
      type: DataTypes.ENUM('PAID', 'PENDING', 'OVERDUE', 'FAILED'), 
      defaultValue: 'PENDING' 
    },
    paymentMethod: { type: DataTypes.STRING, allowNull: true },
    dueDate: { type: DataTypes.DATE, allowNull: false },
    paidDate: { type: DataTypes.DATE, allowNull: true },
    metadata: { type: DataTypes.JSONB, allowNull: true },
  },
  { sequelize, modelName: 'Transaction', tableName: 'Transactions', timestamps: true }
);

export default Transaction;
