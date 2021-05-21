const sequelize = require('../handlers/db');
const { DataTypes } = require('sequelize');

const DeviceBrand = sequelize.define('DeviceBrands', {
        id: { type: DataTypes.INTEGER, field: 'Id', primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING, field: 'DeviceBrandName', unique: true, allowNull: false }
    },
    {
        createdAt: 'CreatedAt',
        updatedAt: 'UpdatedAt'
    }
);

module.exports = {
    DeviceBrand
}