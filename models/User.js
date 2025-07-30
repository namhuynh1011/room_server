const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  phone: {
    type: DataTypes.STRING(20)
  },
  full_name: {
    type: DataTypes.STRING(100)
  },
  role: {
    type: DataTypes.ENUM('tenant', 'landlord', 'admin'),
    defaultValue: 'tenant',
    allowNull: false
  },
  profile_picture: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: 'NULL'
  },
  zalo:{
    type: DataTypes.STRING(20),
    allowNull: true
  },
  facebook:{
    type: DataTypes.STRING(100),
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'users',
  timestamps: false
});

module.exports = User;