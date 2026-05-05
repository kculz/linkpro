import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Project extends Model {
  declare id: string;
  declare name: string;
  declare description: string | undefined;
  declare type: 'DEVELOPMENT' | 'RENOVATION' | 'MAINTENANCE';
  declare status: 'PLANNING' | 'IN_PROGRESS' | 'ON_TRACK' | 'DELAYED' | 'COMPLETED';
  declare budget: number;
  declare spent: number;
  declare progress: number;
  declare startDate: Date;
  declare dueDate: Date;
  declare propertyId: string | undefined;
  declare managerId: string;
  declare image: string | undefined;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  static associate(models: any) {
    Project.belongsTo(models.Property, { foreignKey: 'propertyId', as: 'property' });
    Project.belongsTo(models.User, { foreignKey: 'managerId', as: 'manager' });
    Project.hasMany(models.Task, { foreignKey: 'projectId', as: 'tasks' });
  }
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
