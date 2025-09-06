const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Room = sequelize.define('Room', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    landlord_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'users',
            key: 'id'
        },
    },
    room_code: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    room_fee: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    room_area: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    room_status: {
        type: DataTypes.ENUM('available','pending', 'occupied', 'maintenance'),
        defaultValue: 'available',
        allowNull: false
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
    tableName: 'rooms',
    timestamps: false
})

module.exports = Room;