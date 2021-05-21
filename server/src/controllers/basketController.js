const { BasketDevice, Basket, Device, DeviceBrand, DeviceType } = require('../models/index');
const DbError = require('../errors/dbError');
const ControllerBase = require('./controllerBase');
const i18n = require('../handlers/i18n');
const ApiError = require('../errors/apiError');

const DEVICE_UNDEFINED = 'Устройство для добавления в корзину не задано';
const BASKET_UNDEFINED = 'Корзина не найдена';
const USER_UNDEFINED = 'Пользователь не определен';
const DEVICE_ALREADY_EXISTS = 'Устройство уже добавлено в корзину';
const DEVICE_IS_NOT_FOUND = 'Устройство не найдено';
const DEFAULT_LIMIT = 9;
const INIT_PAGE = 1;

/**
 * Контроллер для работы с типом DeviceBrand
 */
class BasketController extends ControllerBase {
    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     */
    async addDeviceToBasket(req, res, next) {
        const blFunc = async () => {
            const { deviceId, amount = 1 } = req.body;
            const user = req.user;

            if (!deviceId) {
                throw ApiError.internal(DEVICE_UNDEFINED);
            }

            if (!user) {
                throw ApiError.internal(USER_UNDEFINED);
            }

            const basket = await Basket.findOne({ where: { userId: user.id } });

            if (!basket) {
                throw ApiError.internal(BASKET_UNDEFINED);
            }

            const [ basketDevice, created ] = await BasketDevice.findOrCreate({
                where: { 
                    basketId: basket.id, 
                    deviceId,
                    amount 
                }
            });

            if (!created) {
                throw new DbError(DEVICE_ALREADY_EXISTS);
            }

            const device = await Device.findOne({
                where: {
                    id: deviceId
                },
                attributes: ['id', 'name', 'price'],
                include: [{
                    model: DeviceBrand,
                    as: 'deviceBrand',
                    attributes: ['name']
                }, {
                    model: DeviceType,
                    as: 'deviceType',
                    attributes: ['name']
                }]
            });

            const result = {
                id: basketDevice.id,
                amount: basketDevice.amount,
                device
            }

            return result;
        };

        this.modify(req, res, next, blFunc, 'BasketController.addDeviceToBasket');
    }

    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @param {Function} next 
     */
    async deleteDeviceFromBasket(req, res, next) {
        const blFunc = async () => {
            const { basketDeviceId: id } = req.body;

            if (!id) {
                throw ApiError.internal(DEVICE_UNDEFINED);
            }

            const rowsCountDeleted = await BasketDevice.destroy({ where: { id } });

            if (rowsCountDeleted === 0) {
                throw new DbError(DEVICE_IS_NOT_FOUND);
            }

            return rowsCountDeleted;
        };

        const resultFunc = (result) => {
            return `${result} rows was deleted`;
        }

        this.modify(req, res, next, blFunc, 'DeviceBrandController.update', resultFunc);
    }

    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @param {Function} next 
     */
    async fetchBasket(req, res, next) {
        const user = req.user;

        if (!user) {
            next(ApiError.internal(USER_UNDEFINED));
            return;
        }

        try {
            const basket = await Basket.findOne({ 
                where: { userId: user.id },
                include: [{
                    model: BasketDevice,
                    attributes: ['id', 'deviceId', 'amount'],
                    as: 'basketDevices'
                }]
            });

            if (!basket) {
                next(ApiError.internal(BASKET_UNDEFINED));
            }

            const deviceIds = basket.basketDevices.map(item => item.deviceId);

            const devices = await Device.findAll({
                where: {
                    id: deviceIds
                },
                attributes: ['id', 'name', 'price'],
                include: [{
                    model: DeviceBrand,
                    as: 'deviceBrand',
                    attributes: ['name']
                }, {
                    model: DeviceType,
                    as: 'deviceType',
                    attributes: ['name']
                }]
            });

            let data = basket.basketDevices.map(basketDevice => {
                const device = devices.find(device => device.id === basketDevice.deviceId);
                const result = {
                    id: basketDevice.id,
                    amount: basketDevice.amount
                }

                if (device) {
                    result['device'] = device;
                }
                
                return result;
            });

            data = {
                count: data.length,
                rows: data
            }

            return res.json(data);
        }
        catch (error) {
            console.error(`[BasketController] ${error}, ${error.stack}`);
            next(ApiError.internal(error.message));
        }
    }

    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     */
    async fetchBasketAmount (req, res, next) {
        const user = req.user;

        if (!user) {
            next(ApiError.internal(USER_UNDEFINED));
            return;
        }

        try {
            const basket = await Basket.findOne({ 
                where: { userId: user.id },
                include: [{
                    model: BasketDevice,
                    attributes: ['id'],
                    as: 'basketDevices'
                }]
            });

            if (!basket) {
                next(ApiError.internal(BASKET_UNDEFINED));
            }

            return res.json({ amount : basket.basketDevices.length });
        } 
        catch (error) {
            console.error(`[BasketController] ${error}, ${error.stack}`);
            next(ApiError.internal(error.message));
        }
    }

    async checkDevice(req, res, next) {
        const { deviceId = 0 } = req.query;
        const user = req.user;

        if (!user) {
            next(ApiError.internal(USER_UNDEFINED));
            return;
        }

        try {
            const basket = await Basket.findOne({ 
                where: { userId: user.id }
            });

            if (!basket) {
                next(ApiError.internal(BASKET_UNDEFINED));
            }

            const count = await BasketDevice.count({ 
                where: { 
                    basketId: basket.id,
                    deviceId 
                } 
            });

            return res.json({ exists: count && count > 0 });
        } 
        catch (error) {
            console.error(`[BasketController] ${error}, ${error.stack}`);
            next(ApiError.internal(error.message));
        }
    }
}

module.exports = new BasketController();