const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Room = require('./Room');
const Contract = sequelize.define('Contract', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    contract_code: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true
    },
    room_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'rooms',
            key: 'id'
        }
    },
    tenant_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    landlord_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    monthly_fee: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false
    },
    electric_fee: {
        type: DataTypes.DECIMAL(6, 2),
        allowNull: false
    },
    water_fee: {
        type: DataTypes.DECIMAL(9, 2),
        allowNull: false
    },
    water_type: {
        type: DataTypes.ENUM('meter', 'person'),
        allowNull: false,
        defaultValue: 'meter'
    },
    service_fee: {
        type: DataTypes.DECIMAL(9, 2),
        allowNull: false
    },
    deposit_amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'payment_pending', 'active', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending'
    },
    terms: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    payment_due_day: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 5
    },
    notes: {
        type: DataTypes.TEXT,
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
    tableName: 'contracts',
    timestamps: true
});

Contract.belongsTo(User, { as: 'landlord', foreignKey: 'landlord_id' });
Contract.belongsTo(User, { as: 'tenant', foreignKey: 'tenant_id' });
Contract.belongsTo(Room, { as: 'room', foreignKey: 'room_id' });
module.exports = Contract;