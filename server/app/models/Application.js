const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Project = require('./Project');
const User = require('./User');

const Application = sequelize.define('Application', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  projectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'project_id',
    references: {
      model: Project,
      key: 'id'
    }
  },
  applicantId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'applicant_id',
    references: {
      model: User,
      key: 'id'
    }
  },
  inviterId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'inviter_id',
    references: {
      model: User,
      key: 'id'
    }
  },
  reasonText: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'reason_text'
  },
  type: {
    type: DataTypes.ENUM('apply', 'invite'),
    defaultValue: 'apply',
    field: 'type'
  },
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
    defaultValue: 'pending'
  },
  appliedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'applied_at'
  }
}, {
  tableName: 'applications',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['project_id', 'applicant_id']
    }
  ]
});

Application.belongsTo(Project, { foreignKey: 'projectId' });
Application.belongsTo(User, { foreignKey: 'applicantId', as: 'applicant' });
Application.belongsTo(User, { foreignKey: 'inviterId', as: 'inviter' });

module.exports = Application;
