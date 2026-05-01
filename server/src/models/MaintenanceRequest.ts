import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class MaintenanceRequest extends Model {
  public id!: string;
  public tenantId!: string;
  public unitId!: string;
  public propertyId!: string;
  public title!: string;
  public description!: string;
  public category!: 'PLUMBING' | 'ELECTRICAL' | 'HVAC' | 'GENERAL' | 'SECURITY';
  public priority!: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  public status!: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  public vendorId?: string;
  public metadata?: any;

  static associate(models: any) {
    MaintenanceRequest.belongsTo(models.Tenant, { foreignKey: 'tenantId', as: 'tenant' });
    MaintenanceRequest.belongsTo(models.Unit, { foreignKey: 'unitId', as: 'unit' });
    MaintenanceRequest.belongsTo(models.Property, { foreignKey: 'propertyId', as: 'property' });
    MaintenanceRequest.belongsTo(models.Vendor, { foreignKey: 'vendorId', as: 'vendor' });
  }
}

MaintenanceRequest.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    tenantId: { type: DataTypes.UUID, allowNull: true },
    unitId: { type: DataTypes.UUID, allowNull: false },
    propertyId: { type: DataTypes.UUID, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    category: { 
      type: DataTypes.ENUM('PLUMBING', 'ELECTRICAL', 'HVAC', 'GENERAL', 'SECURITY'), 
      defaultValue: 'GENERAL' 
    },
    priority: { 
      type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT'), 
      defaultValue: 'MEDIUM' 
    },
    status: { 
      type: DataTypes.ENUM('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'), 
      defaultValue: 'OPEN' 
    },
    vendorId: { type: DataTypes.UUID, allowNull: true },
    metadata: { type: DataTypes.JSONB, allowNull: true },
  },
  { sequelize, modelName: 'MaintenanceRequest', tableName: 'MaintenanceRequests', timestamps: true }
);

export default MaintenanceRequest;
