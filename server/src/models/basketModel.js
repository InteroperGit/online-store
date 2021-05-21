const sequelize = require('../handlers/db');
const { DataTypes } = require('sequelize');

const Basket = sequelize.define('Baskets', {
        id: { type: DataTypes.INTEGER, field: 'Id', primaryKey: true, autoIncrement: true }
    },
    {
        createdAt: 'CreatedAt',
        updatedAt: 'UpdatedAt'
    }
);

module.exports = {
    Basket
};