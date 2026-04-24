const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TalentProfile = sequelize.define('TalentProfile', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  targetTrack: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  skills: {
    type: DataTypes.JSON,
    allowNull: false
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING(50),
    defaultValue: 'active'
  }
}, {
  tableName: 'talent_profiles',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = TalentProfile;