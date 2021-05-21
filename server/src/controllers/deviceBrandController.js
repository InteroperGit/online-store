const { DeviceBrand } = require('../models/index');
const { Op } = require('sequelize');
const DbError = require('../errors/dbError');
const ControllerBase = require('./controllerBase');
const i18n = require('../handlers/i18n');

const BRAND_NAME_UNDEFINED = 'Название бренда устройства не определено';
const BRAND_ID_UNDEFINED = 'ID бренда устройства не определено';
const BRAND_ID_IS_NOT_FOUND = 'Бренд устройства не найден';
const BRAND_NAME_EQUALS_EXIST = 'Название бренда устройства совпадает с существующим';
const EMPTY_STRING = '';
const DEFAULT_LIMIT = 9;
const INIT_PAGE = 1;

/**
 * Контроллер для работы с типом DeviceBrand
 */
class DeviceBrandController extends ControllerBase {
    /**
     * Создать тип DeviceBrand
     * @param {Request} req 
     * @param {Response} res 
     */
    async create(req, res, next) {
        const blFunc = async () => {
            const { name } = req.body;
            if (!name) {
                throw new DbError(BRAND_NAME_UNDEFINED);
            }

            const [ type, created ] = await DeviceBrand.findOrCreate({
                where: { name }
            });

            if (!created) {
                throw new DbError(BRAND_NAME_EQUALS_EXIST);
            }

            return type;
        };

        this.modify(req, res, next, blFunc, 'DeviceBrandController.create');
    }

    /**
     * Обновить запись DeviceBrand
     * @param {Request} req 
     * @param {Response} res 
     * @param {Function} next 
     */
    async update(req, res, next) {
        const blFunc = async () => {
            const { id, name } = req.body;
            
            if (!id) {
                return next(ApiError.internal(i18n.__('BrandIdIsUndefined')));
            }
            
            if (!name || name === EMPTY_STRING) {
                return next(ApiError.internal(BRAND_NAME_UNDEFINED));
            }

            let type = await DeviceBrand.findOne({ where: { id } });

            if (!type) {
                throw new DbError(BRAND_ID_IS_NOT_FOUND);
            }

            type = await DeviceBrand.findOne({ where: { name } });

            if (type && type.name === name) {
                throw new DbError(BRAND_NAME_EQUALS_EXIST);
            }

            return await DeviceBrand.update({ name }, { where: { id } });
        };

        const resultFunc = (result) => {
            return `${result} rows was updated`;
        }

        this.modify(req, res, next, blFunc, 'DeviceBrandController.update', resultFunc);
    }

    /**
     * Удалить запись DeviceBrand
     * @param {Request} req 
     * @param {Response} res 
     * @param {Function} next 
     */
    async delete(req, res, next) {
        const blFunc = async () => {
            const { id } = req.body;

            if (!id) {
                throw new DbError(BRAND_ID_UNDEFINED);
            }

            const rowsCountDeleted = await DeviceBrand.destroy({ where: { id } });

            if (rowsCountDeleted === 0) {
                throw new DbError(BRAND_ID_IS_NOT_FOUND);
            }

            return rowsCountDeleted;
        }

        const resultFunc = (result) => {
            return `${result} rows was deleted`;
        }

        this.modify(req, res, next, blFunc, 'DeviceBrandController.delete', resultFunc);
    }

    /**
     * Получить все типы DeviceBrand
     * @param {Request} req 
     * @param {Response} res 
     */
    async getAll (req, res) {
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
            const brands = await DeviceBrand.findAndCountAll(findOptions);
            return res.json(brands);
        } 
        catch (error) {
            console.error(`[DeviceBrandController] ${error}, ${error.stack}`);
            next(ApiError.internal(error.message));
        }
    }
}

module.exports = new DeviceBrandController();