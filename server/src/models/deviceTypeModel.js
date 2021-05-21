const sequelize = require('../handlers/db');
const { DataTypes } = require('sequelize');

const DeviceType = sequelize.define('DeviceTypes', {
        id: { type: DataTypes.INTEGER, field: 'Id', primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING, field: 'DeviceTypeName', unique: true, allowNull: false }
    },
    {
        createdAt: 'CreatedAt',
        updatedAt: 'UpdatedAt'
    }
);

module.exports = {
    DeviceType
}