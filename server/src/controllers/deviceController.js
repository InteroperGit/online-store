const uuid = require('uuid');
const awsS3Client = require('../ext/aws/awsS3Client');
const { Op } = require('sequelize');
const { Device, DeviceInfo, DeviceBrand, DeviceType, BasketDevice } = require('../models/index');
const ControllerBase = require('./controllerBase');
const DbError = require('../errors/dbError');
const ApiError = require('../errors/apiError');

const DEFAULT_LIMIT = 9;
const INIT_PAGE = 1;
const BRAND_ID_IS_NOT_FOUND = 'Бренд устройства не найден';
const TYPE_ID_IS_NOT_FOUND = 'Тип устройства не найден';
const DEVICE_ALREADY_EXISTS = 'Устройство уже существует';
const DEVICE_IS_NOT_DEFINED = 'Устройства не существует';

const createFullFileName = (brandName, typeName) => {
    const fileName = `${uuid.v4()}.jpg`;
    return `${brandName}/${typeName}/${fileName}`;
}

class DeviceController extends ControllerBase {
    async create(req, res, next) {
        const blFunc = async () => {  
            const { name, price, rating, brandId, typeId, info } = req.body;
            const { img } = req.files || {};

            const foundDevice = await Device.findOne({ where: { name } });

            if (foundDevice) {
                throw new DbError(DEVICE_ALREADY_EXISTS);
            }

            let createOptions = {
                name,
                price,
                rating,
                deviceBrandId: brandId,
                deviceTypeId: typeId
            }

            if (img) {
                const brand = await DeviceBrand.findOne({where: { id: brandId }});

                if (!brand) {
                    throw new DbError(BRAND_ID_IS_NOT_FOUND);
                }
    
                const type = await DeviceType.findOne({where: { id: typeId }})
    
                if (!type) {
                    throw new DbError(TYPE_ID_IS_NOT_FOUND);
                }
    
                const fullFileName = createFullFileName(brand.name, type.name);
    
                const params = { 
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: fullFileName,
                    Body: img.data
                };
    
                const puttedObject = await awsS3Client.putObject(params);

                createOptions = { ...createOptions, image: fullFileName, imageUrl: puttedObject.objectUri };
            }

            const device = await Device.create(createOptions);

            if (info) {
                const parsedInfo = JSON.parse(info);
                await DeviceInfo.bulkCreate(parsedInfo.map(item => { 
                    return {
                        title: item.title,
                        description: item.description,
                        deviceId: device.id
                    };
                }));
            }

            return device;
        }

        this.modify(req, res, next, blFunc, 'DeviceController.create');
    }

    async update(req, res, next) {
        const blFunc = async () => { 
            const { id, name, price, rating, brandId, typeId, info } = req.body;
            const { img } = req.files || {};

            const existDevice = await Device.findOne({ where: { name } });
            if (existDevice && existDevice.id !== parseInt(id)) {
                throw new DbError(DEVICE_ALREADY_EXISTS);
            }

            const brand = await DeviceBrand.findOne({where: { id: brandId }});

            if (!brand) {
                throw new DbError(BRAND_ID_IS_NOT_FOUND);
            }

            const type = await DeviceType.findOne({where: { id: typeId }})

            if (!type) {
                throw new DbError(TYPE_ID_IS_NOT_FOUND);
            }

            const include = [{
                model: DeviceBrand,
                attributes: ['name'],
                as: 'deviceBrand'
            }, {
                model: DeviceType,
                attributes: ['name'],
                as: 'deviceType'
            }];

            const device = await Device.findOne({ where: { id }, include });
            if (!device) {
                throw new DbError(DEVICE_IS_NOT_DEFINED);
            }

            //Удаляем старую фотографию
            const fullFileName = createFullFileName(device.deviceBrand.name, device.deviceType.name);

            const params = { 
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: fullFileName
            };

            await awsS3Client.deleteObject(params);

            //Удаляем доп. информацию
            await DeviceInfo.destroy({ where: { deviceId: id } });

            //Добавляем новую фотографию
            if (img) {
                const fullFileName = createFullFileName(brand.name, type.name);

                const params = { 
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: fullFileName,
                    Body: img.data
                };

                const puttedObject = await awsS3Client.putObject(params);
            }
            
            let updateObject = {};
            if (device.name !== name) {
                updateObject.name = name;
            }

            if (device.price !== parseInt(price)) {
                updateObject.price = price;
            }

            if (device.rating !== parseInt(rating)) {
                updateObject.rating = rating;
            }

            if (device.deviceBrandId !== brand.id) {
                updateObject.deviceBrandId = brand.id;
            }

            if (device.deviceTypeId !== type.id) {
                updateObject.deviceTypeId = type.id;
            }

            const updated = await Device.update(updateObject,
            {
                where: { id }
            });

            if (info) {
                const parsedInfo = JSON.parse(info);
                for (const item of parsedInfo) {
                    await DeviceInfo.create({
                        title: item.title,
                        description: item.description,
                        deviceId: device.id
                    })
                }
            }

            return updated;
        }

        const resultFunc = (result) => {
            return `${result} rows was updated`;
        }

        this.modify(req, res, next, blFunc, 'DeviceController.update', resultFunc);
    }

    async delete(req, res, next) {
        const blFunc = async (t) => { 
            const { id } = req.body;

            const include = [{
                model: DeviceBrand,
                attributes: ['name'],
                as: 'deviceBrand'
            }, {
                model: DeviceType,
                attributes: ['name'],
                as: 'deviceType'
            }];

            const device = await Device.findOne({ where: { id }, include });
            if (!device) {
                throw new DbError(DEVICE_IS_NOT_DEFINED);
            }

            const fullFileName = createFullFileName(device.deviceBrand.name, device.deviceType.name);

            const params = { 
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: fullFileName,
            };

            await awsS3Client.deleteObject(params);
            await DeviceInfo.destroy({ where: { deviceId: id } });
            await BasketDevice.destroy({ where: { deviceId: id } });
            const deleted = Device.destroy({ where: { id: id } });

            return deleted;
        }

        const resultFunc = (result) => {
            return `${result} rows was deleted`;
        }

        this.modify(req, res, next, blFunc, 'DeviceController.delete', resultFunc);
    }

    async get (req, res, next) {
        try {
            const { id } = req.params;
            const include = [{
                model: DeviceBrand,
                attributes: ['name'],
                as: 'deviceBrand'
            }, {
                model: DeviceType,
                attributes: ['name'],
                as: 'deviceType'
            }, { 
                model: DeviceInfo, 
                as: 'info' 
            }];
            const device = await Device.findOne({
                where: { id },
                include
            });

            res.json(device);
        } 
        catch (error) {
            console.error(error.message, error.stack);
            next(ApiError.internal(error.message));
        }
    }

    async getAll (req, res) {
        const { filter, orderKey = 'name', orderDirection = 'ASC',
                deviceBrandId, deviceTypeId, 
                limit = DEFAULT_LIMIT, page = INIT_PAGE } = req.query;

        let offset = limit * (page  - 1);
        let where = {};

        if (deviceBrandId && !deviceTypeId) {
            where = { deviceBrandId: deviceBrandId };
        }
        else if (!deviceBrandId && deviceTypeId) {
            where = { deviceTypeId: deviceTypeId }
        }
        else if (deviceBrandId && deviceTypeId) {
            where = { 
                deviceBrandId: deviceBrandId, 
                deviceTypeId: deviceTypeId 
            }
        }

        if (filter) {
            where.name = {
                [Op.like]: `%${filter}%`
            }
        }

        const order = [[orderKey, orderDirection]];

        const include = [{
            model: DeviceBrand,
            attributes: ['name'],
            as: 'deviceBrand'
        }, {
            model: DeviceType,
            attributes: ['name'],
            as: 'deviceType'
        }, { 
            model: DeviceInfo, 
            as: 'info' 
        }];

        try {
            const devices = await Device.findAll({
                where,
                order,
                include,
                limit,
                offset
            });

            const deviceCount = await Device.count({ where });

            return res.json({ 
                count: deviceCount,
                rows: devices
            });
        } 
        catch (error) {
            console.error(error.message, error.stack);
            next(ApiError.internal(error.message));
        }
    }
}

module.exports = new DeviceController();