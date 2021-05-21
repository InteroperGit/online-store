const httpStatus = require('http-status');

class ApiError extends Error {
    constructor(status, message) {
        super();
        this.status = status;
        this.message = message;
    }

    static badRequest(message) {
        return new ApiError(httpStatus.NOT_FOUND, message);
    }

    static internal(message) {
        return new ApiError(httpStatus.INTERNAL_SERVER_ERROR, message);
    }

    static forbidden(message) {
        return new ApiError(httpStatus.FORBIDDEN, message);
    }
}

module.exports = ApiError;