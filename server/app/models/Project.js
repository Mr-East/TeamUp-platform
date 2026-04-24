const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  competitionName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'competition_name'
  },
  competitionType: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'competition_type'
  },
  deadline: {
    type: DataTypes.DATE,
    allowNull: false
  },
  peopleNeeded: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'people_needed'
  },
  skills: {
    type: DataTypes.JSON,
    allowNull: true
  },
  verificationRequired: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'verification_required'
  },
  coverImage: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'cover_image'
  },
  status: {
    type: DataTypes.ENUM('active', 'closed'),
    defaultValue: 'active'
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'created_by',
    references: {
      model: User,
      key: 'id'
    }
  }
}, {
  tableName: 'projects',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

Project.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

module.exports = Project;