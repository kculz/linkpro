import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Project extends Model {
  public id!: string;
  public name!: string;
  public description?: string;
  public type!: 'DEVELOPMENT' | 'RENOVATION' | 'MAINTENANCE';
  public status!: 'PLANNING' | 'IN_PROGRESS' | 'ON_TRACK' | 'DELAYED' | 'COMPLETED';
  public budget!: number;
  public spent!: number;
  public progress!: number; // 0-100
  public startDate!: Date;
  public dueDate!: Date;
  public propertyId?: string;
  public managerId!: string;
  public image?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Project.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    type: { type: DataTypes.ENUM('DEVELOPMENT', 'RENOVATION', 'MAINTENANCE'), defaultValue: 'DEVELOPMENT' },
    status: { type: DataTypes.ENUM('PLANNING', 'IN_PROGRESS', 'ON_TRACK', 'DELAYED', 'COMPLETED'), defaultValue: 'PLANNING' },
    budget: { type: DataTypes.DECIMAL(14, 2), allowNull: false, defaultValue: 0 },
    spent: { type: DataTypes.DECIMAL(14, 2), allowNull: false, defaultValue: 0 },
    progress: { type: DataTypes.INTEGER, defaultValue: 0, validate: { min: 0, max: 100 } },
    startDate: { type: DataTypes.DATEONLY, allowNull: false },
    dueDate: { type: DataTypes.DATEONLY, allowNull: false },
    propertyId: { type: DataTypes.UUID, allowNull: true, references: { model: 'Properties', key: 'id' } },
    managerId: { type: DataTypes.UUID, allowNull: false, references: { model: 'Users', key: 'id' } },
    image: { type: DataTypes.STRING, allowNull: true },
  },
  { sequelize, modelName: 'Project', tableName: 'Projects', timestamps: true }
);

export default Project;
