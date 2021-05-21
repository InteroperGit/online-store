const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');

const USER_IS_NOT_AUTHORIZED = 'Пользователь не авторизован';

module.exports = function(req, res, next) {
    if (req.method === 'OPTIONS') {
        next();
    }

    try {
        const token = req.headers.authorization 
            ? req.headers.authorization.split(' ')[1]
            : undefined;
        if (!token || token === 'null') {
            return res.status(httpStatus.UNAUTHORIZED).json({ message: USER_IS_NOT_AUTHORIZED });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } 
    catch (error) {
        console.error(error);
        return res.status(httpStatus.UNAUTHORIZED).json({ message: USER_IS_NOT_AUTHORIZED });
    }
}