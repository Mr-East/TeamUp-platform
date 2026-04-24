const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Project = require('./Project');
const User = require('./User');

const Comment = sequelize.define('Comment', {
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
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  likesCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'likes_count'
  },
  parentCommentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'parent_comment_id',
    references: {
      model: 'comments',
      key: 'id'
    }
  }
}, {
  tableName: 'comments',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

Comment.belongsTo(Project, { foreignKey: 'projectId' });
Comment.belongsTo(User, { foreignKey: 'userId' });
Comment.belongsTo(Comment, { foreignKey: 'parentCommentId', as: 'parent' });
Comment.hasMany(Comment, { foreignKey: 'parentCommentId', as: 'replies' });

module.exports = Comment;
