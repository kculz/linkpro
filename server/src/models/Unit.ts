import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Unit extends Model {
  public id!: string;
  public propertyId!: string;
  public unitNumber!: string;
  public type!: 'STUDIO' | '1BHK' | '2BHK' | '3BHK' | 'OFFICE' | 'RETAIL';
  public floorArea!: number;
  public rent!: number;
  public status!: 'VACANT' | 'OCCUPIED' | 'MAINTENANCE';
  public tenantId?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Unit.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    propertyId: { type: DataTypes.UUID, allowNull: false, references: { model: 'Properties', key: 'id' } },
    unitNumber: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.ENUM('STUDIO', '1BHK', '2BHK', '3BHK', 'OFFICE', 'RETAIL'), defaultValue: 'STUDIO' },
    floorArea: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    rent: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    status: { type: DataTypes.ENUM('VACANT', 'OCCUPIED', 'MAINTENANCE'), defaultValue: 'VACANT' },
    tenantId: { type: DataTypes.UUID, allowNull: true, references: { model: 'Users', key: 'id' } },
  },
  { sequelize, modelName: 'Unit', tableName: 'Units', timestamps: true }
);

export default Unit;
