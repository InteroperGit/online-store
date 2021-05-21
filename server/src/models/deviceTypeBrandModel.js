const sequelize = require('../handlers/db');
const { DataTypes } = require('sequelize');
const { model } = require('../handlers/db');

const DeviceTypeBrand = sequelize.define('DeviceTypes_DeviceBrands', {
        id: { type: DataTypes.INTEGER, field: 'Id', primaryKey: true, autoIncrement: true }
    },
    {
        createdAt: 'CreatedAt',
        updatedAt: 'UpdatedAt'
    }
);

module.exports = {
    DeviceTypeBrand
}