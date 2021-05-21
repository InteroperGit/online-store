const ApiError = require('../errors/apiError');
const httpStatus = require('http-status');

const UNHANDLED_ERROR = 'Непредвиденная ошибка';

module.exports = function(err, req, res, next) {
    return err instanceof ApiError
        ? res.status(err.status).json({ message: err.message })
        : res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: UNHANDLED_ERROR });
}