import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Property extends Model {
  public id!: string;
  public name!: string;
  public type!: 'RESIDENTIAL' | 'COMMERCIAL' | 'INDUSTRIAL' | 'MIXED_USE';
  public address!: string;
  public city!: string;
  public state!: string;
  public totalUnits!: number;
  public occupiedUnits!: number;
  public image?: string;
  public monthlyIncome!: number;
  public status!: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
  public ownerId!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Property.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.ENUM('RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL', 'MIXED_USE'), defaultValue: 'RESIDENTIAL' },
    address: { type: DataTypes.STRING, allowNull: false },
    city: { type: DataTypes.STRING, allowNull: false },
    state: { type: DataTypes.STRING, allowNull: false },
    totalUnits: { type: DataTypes.INTEGER, defaultValue: 1 },
    occupiedUnits: { type: DataTypes.INTEGER, defaultValue: 0 },
    image: { type: DataTypes.STRING, allowNull: true },
    monthlyIncome: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
    status: { type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'MAINTENANCE'), defaultValue: 'ACTIVE' },
    ownerId: { type: DataTypes.UUID, allowNull: false },
  },
  { sequelize, modelName: 'Property', tableName: 'Properties', timestamps: true }
);

export default Property;
