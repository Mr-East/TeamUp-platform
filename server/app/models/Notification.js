const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  receiverId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'receiver_id',
    references: {
      model: User,
      key: 'id'
    }
  },
  senderId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'sender_id',
    references: {
      model: User,
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM(
      'application',      // 申请加入项目
      'invite',           // 邀请加入项目
      'application_approved',   // 申请已通过
      'application_rejected',  // 申请被拒绝
      'invite_accepted',      // 邀请已接受
      'invite_rejected',      // 邀请被拒绝
      'reminder',        // 提醒
      'system'          // 系统通知
    ),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  relatedId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'related_id',
    comment: '关联的业务ID，如项目ID、申请ID等'
  },
  relatedType: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'related_type',
    comment: '关联的业务类型，如project、application等'
  },
  link: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: '点击通知后跳转的链接'
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_read'
  }
}, {
  tableName: 'notifications',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

Notification.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });
Notification.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });

module.exports = Notification;
