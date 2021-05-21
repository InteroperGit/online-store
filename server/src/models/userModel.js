const sequelize = require('../handlers/db');
const { DataTypes } = require('sequelize');

const User = sequelize.define('Users', {
        id: { type: DataTypes.INTEGER, field: 'Id', primaryKey: true, autoIncrement: true },
        fullName: { type: DataTypes.STRING, field: 'FullName' },
        nickName: { type: DataTypes.STRING, field: 'Nickname' },
        email: { type: DataTypes.STRING, field: 'Email', unique: true, validate: { isEmail: true } },
        password: { type: DataTypes.STRING, field: 'Password' },
        birthDay: { type: DataTypes.DATEONLY, field: 'Birthday' },
        role: { type: DataTypes.STRING, field: 'Role', defaultValue: 'USER' } 
    },
    {
        createdAt: 'CreatedAt',
        updatedAt: 'UpdatedAt'
    }
);

module.exports = {
    User
};