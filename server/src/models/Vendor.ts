import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Vendor extends Model {
  public id!: string;
  public name!: string;
  public email!: string;
  public phone!: string;
  public category!: 'PLUMBING' | 'ELECTRICAL' | 'HVAC' | 'GENERAL' | 'SECURITY' | 'LANDSCAPING';
  public status!: 'ACTIVE' | 'INACTIVE';
  public rating!: number;
  public metadata?: any;

  static associate(models: any) {
    Vendor.hasMany(models.MaintenanceRequest, { foreignKey: 'vendorId', as: 'requests' });
  }
}

Vendor.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    phone: { type: DataTypes.STRING, allowNull: false },
    category: { 
      type: DataTypes.ENUM('PLUMBING', 'ELECTRICAL', 'HVAC', 'GENERAL', 'SECURITY', 'LANDSCAPING'), 
      defaultValue: 'GENERAL' 
    },
    status: { 
      type: DataTypes.ENUM('ACTIVE', 'INACTIVE'), 
      defaultValue: 'ACTIVE' 
    },
    rating: { type: DataTypes.FLOAT, defaultValue: 5.0 },
    metadata: { type: DataTypes.JSONB, allowNull: true },
  },
  { sequelize, modelName: 'Vendor', tableName: 'Vendors', timestamps: true }
);

export default Vendor;
