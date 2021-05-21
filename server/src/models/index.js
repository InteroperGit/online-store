const { User } = require('./userModel');
const { Basket } = require('./basketModel');
const { BasketDevice } = require('./basketDeviceModel');
const { Device } = require('./deviceModel');
const { DeviceType } = require('./deviceTypeModel');
const { DeviceBrand } = require('./deviceBrandModel');
const { DeviceInfo } = require('./deviceInfoModel');
const { Rating } = require('./ratingModel');
const { DeviceTypeBrand } = require('./deviceTypeBrandModel');

User.hasOne(Basket, {
    foreignKey: {
        allowNull: false,
        field: 'UserId',
        name: 'userId'
    },
    onDelete: 'restrict',
    as: 'basket'
});
Basket.belongsTo(User)

User.hasMany(Rating, {
    foreignKey: {
        allowNull: false,
        field: 'UserId',
        name: 'userId'
    },
    onDelete: 'restrict',
    as: 'rating'
});
Rating.belongsTo(User);

Basket.hasMany(BasketDevice, {
    foreignKey: {
        allowNull: false,
        field: 'BasketId',
        name: 'basketId'
    },
    onDelete: 'restrict',
    as: 'basketDevices'
});
BasketDevice.belongsTo(Basket);

Device.hasMany(BasketDevice, {
    foreignKey: {
        allowNull: false,
        field: 'DeviceId',
        name: 'deviceId'
    },
    onDelete: 'restrict'
})
BasketDevice.belongsTo(Device, { as: 'device' });

DeviceType.hasMany(Device, {
    foreignKey: {
        allowNull: false,
        field: 'DeviceTypeId',
        name: 'deviceTypeId'
    },
    onDelete: 'restrict',
});
Device.belongsTo(DeviceType, { as: 'deviceType' });

DeviceBrand.hasMany(Device, {
    foreignKey: {
        allowNull: false,
        field: 'DeviceBrandId',
        name: 'deviceBrandId'
    },
    onDelete: 'restrict',
});
Device.belongsTo(DeviceBrand, { as: 'deviceBrand' });

Device.hasMany(DeviceInfo, { 
    as: 'info' ,
    foreignKey: {
        allowNull: false,
        field: 'DeviceId',
        name: 'deviceId'
    },
    onDelete: 'restricted',
});
DeviceInfo.belongsTo(Device);

Device.hasMany(Rating, {
    foreignKey: {
        allowNull: false,
        field: 'DeviceId',
        name: 'deviceId'
    },
    onDelete: 'restricted'
});
Rating.belongsTo(Device);

DeviceType.belongsToMany(DeviceBrand, { through: DeviceTypeBrand });
DeviceBrand.belongsToMany(DeviceType, { through: DeviceTypeBrand });

module.exports = {
    User,
    Basket,
    BasketDevice,
    Device,
    DeviceType,
    DeviceBrand,
    DeviceInfo,
    Rating
}