const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  avatar: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  college: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  major: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  grade: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'grade'
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  skills: {
    type: DataTypes.JSON,
    allowNull: true
  },
  competitionTypes: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'competition_types'
  },
  verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  notificationEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'notification_enabled'
  }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = User;
