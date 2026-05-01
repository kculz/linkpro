import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Document extends Model {
  public id!: string;
  public name!: string;
  public type!: 'LEASE' | 'RECEIPT' | 'BLUEPRINT' | 'ID' | 'CONTRACT' | 'OTHER';
  public fileUrl!: string;
  public fileType!: string;
  public fileSize!: number;
  public targetId!: string;
  public targetType!: 'PROPERTY' | 'PROJECT' | 'TENANT' | 'UNIT' | 'TRANSACTION' | 'GENERAL';
  public uploadedBy!: string;
  public metadata?: any;

  static associate(models: any) {
    Document.belongsTo(models.User, { foreignKey: 'uploadedBy', as: 'uploader' });
  }
}

Document.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    type: { 
      type: DataTypes.ENUM('LEASE', 'RECEIPT', 'BLUEPRINT', 'ID', 'CONTRACT', 'OTHER'), 
      defaultValue: 'OTHER' 
    },
    fileUrl: { type: DataTypes.STRING, allowNull: false },
    fileType: { type: DataTypes.STRING, allowNull: false },
    fileSize: { type: DataTypes.INTEGER, allowNull: false },
    targetId: { type: DataTypes.UUID, allowNull: true },
    targetType: { 
      type: DataTypes.ENUM('PROPERTY', 'PROJECT', 'TENANT', 'UNIT', 'TRANSACTION', 'GENERAL'), 
      defaultValue: 'GENERAL' 
    },
    uploadedBy: { type: DataTypes.UUID, allowNull: false },
    metadata: { type: DataTypes.JSONB, allowNull: true },
  },
  { sequelize, modelName: 'Document', tableName: 'Documents', timestamps: true }
);

export default Document;
