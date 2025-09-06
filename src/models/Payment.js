const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Payment = sequelize.define('Payment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    monthly_bill_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'monthly_bills',
            key: 'id'
        }
    },
    payer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    receiver_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    payment_type: {
        type: DataTypes.ENUM('deposit', 'monthly', 'service', 'deposit_refund'),
        allowNull: false,
        defaultValue: 'monthly'
    },
    amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
    },
    method: {
        type: DataTypes.ENUM('cash', 'bank_transfer', 'momo', 'zalopay', 'other'),
        allowNull: false,
        defaultValue: 'cash'
    },
    status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'rejected'),
        allowNull: false,
        defaultValue: 'pending'
    },
    transaction_ref: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    receipt_image: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    paid_at: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'payments',
    timestamps: true
});

module.exports = Payment;