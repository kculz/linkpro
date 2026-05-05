import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Template extends Model {
  public id!: string;
  public name!: string;
  public type!: 'LEASE' | 'CONTRACT' | 'QUOTATION' | 'INVOICE' | 'OTHER';
  public content!: string; // HTML or Markdown with placeholders
  public description?: string;
  public createdBy!: string;

  static associate(models: any) {
    Template.belongsTo(models.User, { foreignKey: 'createdBy', as: 'creator' });
  }
}

Template.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    type: { 
      type: DataTypes.ENUM('LEASE', 'CONTRACT', 'QUOTATION', 'INVOICE', 'OTHER'), 
      defaultValue: 'LEASE' 
    },
    content: { type: DataTypes.TEXT, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: true },
    createdBy: { type: DataTypes.UUID, allowNull: false },
  },
  { sequelize, modelName: 'Template', tableName: 'Templates', timestamps: true }
);

export default Template;
