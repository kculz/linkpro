import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Task extends Model {
  public id!: string;
  public title!: string;
  public description?: string;
  public status!: 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
  public priority!: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  public dueDate?: Date;
  public projectId!: string;
  public assigneeId?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    Task.belongsTo(models.Project, { foreignKey: 'projectId', as: 'project' });
    Task.belongsTo(models.User, { foreignKey: 'assigneeId', as: 'assignee' });
  }
}

Task.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    status: { 
      type: DataTypes.ENUM('BACKLOG', 'TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'), 
      defaultValue: 'BACKLOG' 
    },
    priority: { 
      type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT'), 
      defaultValue: 'MEDIUM' 
    },
    dueDate: { type: DataTypes.DATE, allowNull: true },
    projectId: { 
      type: DataTypes.UUID, 
      allowNull: false, 
      references: { model: 'Projects', key: 'id' },
      onDelete: 'CASCADE'
    },
    assigneeId: { 
      type: DataTypes.UUID, 
      allowNull: true, 
      references: { model: 'Users', key: 'id' } 
    },
  },
  { sequelize, modelName: 'Task', tableName: 'Tasks', timestamps: true }
);

export default Task;
