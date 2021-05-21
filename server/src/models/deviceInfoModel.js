const sequelize = require('../handlers/db');
const { DataTypes } = require('sequelize');

const DeviceInfo = sequelize.define('DeviceInfos', {
        id: { type: DataTypes.INTEGER, field: 'Id', primaryKey: true, autoIncrement: true },
        title: { type: DataTypes.STRING, field: 'Title', unique: false, allowNull: false },
        description: { type: DataTypes.STRING, field: 'Description', unique: false, allowNull: false },
    },
    {
        createdAt: 'CreatedAt',
        updatedAt: 'UpdatedAt'
    }
);

module.exports = {
    DeviceInfo
}