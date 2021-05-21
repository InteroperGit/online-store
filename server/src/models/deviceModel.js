const sequelize = require('../handlers/db');
const { DataTypes } = require('sequelize');

const Device = sequelize.define('Devices', {
        id: { type: DataTypes.INTEGER, field: 'Id', primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING, field: 'DeviceName', unique: true, allowNull: false},
        price: { type: DataTypes.FLOAT, field: 'Price' },
        rating: { type: DataTypes.INTEGER, field: 'Rating', validate: { isIn: { args: [[1, 2, 3, 4, 5]] } }  },
        image: { type: DataTypes.STRING, field: 'Image' },
        imageUrl: { type: DataTypes.STRING, field: 'ImageUrl' }
    },
    {
        createdAt: 'CreatedAt',
        updatedAt: 'UpdatedAt'
    }
);

module.exports = {
    Device
}