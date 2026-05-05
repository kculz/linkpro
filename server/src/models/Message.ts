import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Message extends Model {
  public id!: string;
  public senderId!: string;
  public receiverId!: string;
  public conversationId!: string;
  public content!: string;
  public read!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    Message.belongsTo(models.User, { foreignKey: 'senderId', as: 'sender' });
    Message.belongsTo(models.User, { foreignKey: 'receiverId', as: 'receiver' });
  }

  /** Deterministic conversation ID from two user IDs */
  static buildConversationId(userA: string, userB: string): string {
    return [userA, userB].sort().join('-');
  }
}

Message.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    senderId: { type: DataTypes.UUID, allowNull: false },
    receiverId: { type: DataTypes.UUID, allowNull: false },
    conversationId: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    read: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    sequelize,
    modelName: 'Message',
    tableName: 'Messages',
    timestamps: true,
    indexes: [
      { fields: ['conversationId'] },
      { fields: ['senderId'] },
      { fields: ['receiverId'] },
      { fields: ['read'] },
    ],
  }
);

export default Message;
