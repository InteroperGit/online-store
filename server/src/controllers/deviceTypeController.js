const { Op } = require('sequelize');
const { DeviceType } = require('../models/index');
const DbError = require('../errors/dbError');
const ApiError = require('../errors/apiError');
const ControllerBase = require('./controllerBase');

const TYPE_NAME_UNDEFINED = 'Название типа устройства не определено';
const TYPE_ID_UNDEFINED = 'ID типа устройства не определено';
const TYPE_ID_IS_NOT_FOUND = 'Тип устройства не найден';
const TYPE_NAME_EQUALS_EXIST = 'Название типа устройства совпадает с существующим';
const DEFAULT_LIMIT = 9;
const INIT_PAGE = 1;
const EMPTY_STRING = '';

/**
 * Контроллер для типа DeviceType (тип устройства)
 */
class DeviceTypeController extends ControllerBase {
    /**
     * Создать запись Тип устройства
     * @param {Request} req 
     * @param {Response} res 
     * @param {Function} next 
     */
    async create(req, res, next) {
        const blFunc = async () => {
            const { name } = req.body;
            if (!name) {
                throw new DbError(TYPE_NAME_UNDEFINED);
            }

            const [ type, created ] = await DeviceType.findOrCreate({
                where: { name }
            });

            if (!created) {
                throw new DbError(TYPE_NAME_EQUALS_EXIST);
            }

            return type;
        };

        this.modify(req, res, next, blFunc, 'DeviceTypeController.create');
    }

    /**
     * Обновить запись Тип устройства
     * @param {Request} req 
     * @param {Response} res 
     * @param {Function} next 
     */
    async update(req, res, next) {
        const blFunc = async () => {
            const { id, name } = req.body;
            
            if (!id) {
                throw new DbError(TYPE_ID_UNDEFINED);
            }
            
            if (!name || name === EMPTY_STRING) {
                throw new DbError(TYPE_NAME_UNDEFINED);
            }

            let type = await DeviceType.findOne({ where: { id } });

            if (!type) {
                throw new DbError(TYPE_ID_IS_NOT_FOUND);
            }

            type = await DeviceType.findOne({ where: { name } });

            if (type && type.name === name) {
                throw new DbError(TYPE_NAME_EQUALS_EXIST);
            }

            return await DeviceType.update({ name }, { where: { id } });
        };

        const resultFunc = (result) => {
            return {
                count: result,
                message: `${result} rows was updated`
            }
        }

        this.modify(req, res, next, blFunc, 'DeviceTypeController.update', resultFunc);
    }

    /**
     * Удалить запись Тип устройства
     * @param {Request} req 
     * @param {Response} res 
     * @param {Function} next 
     */
    async delete(req, res, next) {
        const blFunc = async () => {
            const { id } = req.body;

            if (!id) {
                throw new DbError(TYPE_ID_UNDEFINED);
            }

            const rowsCountDeleted = await DeviceType.destroy({ where: { id } });

            if (rowsCountDeleted === 0) {
                throw new DbError(TYPE_ID_IS_NOT_FOUND);
            }

            return rowsCountDeleted;
        }

        const resultFunc = (result) => {
            return {
                count: result,
                message: `${result} rows was deleted`
            }
        }

        this.modify(req, res, next, blFunc, 'DeviceTypeController.delete', resultFunc);
    }

    /**
     * Получить все записи Тип устройства
     * @param {Request} req 
     * @param {Response} res 
     */
    async getAll (req, res, next) {
        const { filter, orderKey = 'name', orderDirection = 'ASC', 
                limit = DEFAULT_LIMIT, page = INIT_PAGE } = req.query;
        const offset = page * limit - limit;
        let findOptions = { limit, offset };
        if (filter) {
            findOptions['where'] = {
                name: {
                    [Op.like]: `%${filter}%`
                }
            }
        }
        findOptions['order'] = [[orderKey, orderDirection]];

        try {
            const types = await DeviceType.findAndCountAll(findOptions);
            return res.json(types);
        } 
        catch (error) {
            console.error(`[DeviceTypeController] ${error}, ${error.stack}`);
            next(ApiError.internal(error.message));
        }
    }
}

module.exports = new DeviceTypeController();