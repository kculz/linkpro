import Property from './Property.js';
import Unit from './Unit.js';
import Project from './Project.js';
import Task from './Task.js';
import User from './User.js';
import Activity from './Activity.js';
import Tenant from './Tenant.js';
import MaintenanceRequest from './MaintenanceRequest.js';
import Transaction from './Transaction.js';
import Document from './Document.js';
import Vendor from './Vendor.js';
import Notification from './Notification.js';
import Message from './Message.js';
import Template from './Template.js';

const models = {
  Property,
  Unit,
  Project,
  Task,
  User,
  Activity,
  Tenant,
  MaintenanceRequest,
  Transaction,
  Document,
  Vendor,
  Notification,
  Message,
  Template
};

export const initAssociations = () => {
  // Call associate methods for all models
  Property.associate(models);
  Unit.associate(models);
  Project.associate(models);
  Task.associate(models);
  User.associate(models);
  Activity.associate(models);
  Tenant.associate(models);
  MaintenanceRequest.associate(models);
  Transaction.associate(models);
  Document.associate(models);
  Vendor.associate(models);
  Notification.associate(models);
  Message.associate(models);
};
