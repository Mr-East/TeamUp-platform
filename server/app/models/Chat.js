const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Chat = sequelize.define('Chat', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  type: {
    type: DataTypes.ENUM('private', 'group'),
    defaultValue: 'private'
  },
  lastMessage: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'last_message'
  },
  participantIds: {
    type: DataTypes.JSON,
    allowNull: false,
    field: 'participant_ids'
  }
}, {
  tableName: 'chats',
  timestamps: true,
  createdAt: false,
  updatedAt: 'updated_at'
});

module.exports = Chat;
