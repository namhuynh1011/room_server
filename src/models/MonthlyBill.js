const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const MonthlyBill = sequelize.define('MonthlyBill', {
    id:{ 
        type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    contract_id:{ 
        type: DataTypes.INTEGER, allowNull: false, 
        references: { model: 'contracts', key: 'id' }},
    room_id:{ 
        type: DataTypes.INTEGER, allowNull: false, 
        references: { model: 'rooms', key: 'id' }},
    month_year:{ 
        type: DataTypes.STRING(7), allowNull: false },
    room_fee:{ 
        type: DataTypes.DECIMAL(10,2), allowNull: false },
    electricity_fee:{ 
        type: DataTypes.DECIMAL(10,2), allowNull: false },
    water_fee:{ 
        type: DataTypes.DECIMAL(10,2), allowNull: false },
    other_fee:{ 
        type: DataTypes.DECIMAL(10,2), defaultValue: 0 },
    total_amount:{ 
        type: DataTypes.DECIMAL(12,2), allowNull: false },
    status:{ 
        type: DataTypes.ENUM('pending', 'paid', 'overdue'),
        defaultValue: 'pending'
    }
}, {
    tableName: 'monthly_bills',
    timestamps: true
});
module.exports = MonthlyBill;