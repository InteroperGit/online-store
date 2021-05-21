const sequelize = require('../handlers/db');
const { DataTypes } = require('sequelize');

const BasketDevice = sequelize.define('BasketDevices', {
        id: { type: DataTypes.INTEGER, field: 'Id', primaryKey: true, autoIncrement: true },
        amount: { type: DataTypes.INTEGER, field: 'Amount', allowNull: false, defaultValue: 1 }
    },
    {
        createdAt: 'CreatedAt',
        updatedAt: 'UpdatedAt'
    }
);

module.exports = {
    BasketDevice
}