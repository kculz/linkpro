import Property from './Property.js';
import Unit from './Unit.js';
import Project from './Project.js';
import Task from './Task.js';
import User from './User.js';

const models = {
  Property,
  Unit,
  Project,
  Task,
  User
};

export const initAssociations = () => {
  // Call associate methods for all models
  Property.associate(models);
  Unit.associate(models);
  Project.associate(models);
  Task.associate(models);
  User.associate(models);
};
