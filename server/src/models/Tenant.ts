import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Tenant extends Model {
  public id!: string;
  public name!: string;
  public email!: string;
  public phone!: string;
  public unitId!: string;
  public leaseStart!: Date;
  public leaseEnd!: Date;
  public rentAmount!: number;
  public status!: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'EVICTED';
  public metadata?: any;

  static associate(models: any) {
    Tenant.belongsTo(models.Unit, { foreignKey: 'unitId', as: 'unit' });
  }
}

Tenant.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    phone: { type: DataTypes.STRING, allowNull: false },
    unitId: { type: DataTypes.UUID, allowNull: false },
    leaseStart: { type: DataTypes.DATE, allowNull: false },
    leaseEnd: { type: DataTypes.DATE, allowNull: false },
    rentAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    status: { 
      type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'PENDING', 'EVICTED'), 
      defaultValue: 'ACTIVE' 
    },
    metadata: { type: DataTypes.JSONB, allowNull: true },
  },
  { sequelize, modelName: 'Tenant', tableName: 'Tenants', timestamps: true }
);

export default Tenant;
