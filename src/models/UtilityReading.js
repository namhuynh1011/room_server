const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const UtilityReading = sequelize.define('UtilityReading', {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true },
    contract_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: { model: 'contracts', key: 'id' } },
    room_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: { model: 'rooms', key: 'id' } },
    month_year: { 
        type: DataTypes.STRING(7), 
        allowNull: false },
    electricity_old: { 
        type: DataTypes.DECIMAL(8, 2), 
        allowNull: false },
    electricity_new: { 
        type: DataTypes.DECIMAL(8, 2), 
        allowNull: false },
    water_old: { 
        type: DataTypes.DECIMAL(8, 2), 
        allowNull: false },
    water_new: { 
        type: DataTypes.DECIMAL(8, 2), 
        allowNull: false },
    num_people: { 
        type: DataTypes.INTEGER, 
        allowNull: true 
    }, 
}, {
    tableName: 'utility_readings',
    timestamps: true
});
module.exports = UtilityReading;