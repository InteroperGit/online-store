const sequelize = require('../handlers/db');
const { DataTypes } = require('sequelize');

const Rating = sequelize.define('Ratings', {
        id: { type: DataTypes.INTEGER, field: 'Id', primaryKey: true, autoIncrement: true },
        rate: { type: DataTypes.INTEGER, field: 'Rate', unique: false, allowNull: false }
    },
    {
        createdAt: 'CreatedAt',
        updatedAt: 'UpdatedAt'
    }
);

module.exports = {
    Rating
}