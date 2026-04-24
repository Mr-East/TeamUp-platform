const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Project = require('./Project');
const User = require('./User');

const ProjectMember = sequelize.define('ProjectMember', {
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
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
    references: {
      model: User,
      key: 'id'
    }
  },
  role: {
    type: DataTypes.STRING(50),
    defaultValue: 'member'
  },
  joinDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'join_date'
  },
  status: {
    type: DataTypes.ENUM('accepted', 'pending'),
    defaultValue: 'pending'
  }
}, {
  tableName: 'project_members',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['project_id', 'user_id']
    }
  ]
});

ProjectMember.belongsTo(Project, { foreignKey: 'projectId' });
ProjectMember.belongsTo(User, { foreignKey: 'userId' });

module.exports = ProjectMember;
