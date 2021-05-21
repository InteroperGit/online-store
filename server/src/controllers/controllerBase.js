const sequelize = require('../handlers/db');
const ApiError = require('../errors/apiError');
const DbError = require('../errors/dbError');

const COMMON_ERROR = 'Внутренняя ошибка сервера';

const DEFAULT_RESULT_FUNC = (result) => result;

/**
 * Базовый класс Controller
 */
class ControllerBase {
    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @param {Function} next 
     * @param {Function} modifyFunc 
     * @param {String} modifyFuncName 
     */
    async modify(req, res, next, modifyFunc, modifyFuncName, resultFunc = DEFAULT_RESULT_FUNC) {
        try {
            const modifyResult = await sequelize.transaction(async (t) => modifyFunc(t));
            const result = resultFunc(modifyResult);
            
            return typeof(result) === 'string'
                ? res.json({ message: result })
                : res.json(result);
        } 
        catch (error) {
            console.error(`[${modifyFuncName}] ${error}, ${error.stack}`);
            if (error instanceof DbError) {
                next(ApiError.internal(error.message));
            }
            else {
                next(ApiError.internal(COMMON_ERROR));
            }
        }
    }
}

module.exports = ControllerBase;