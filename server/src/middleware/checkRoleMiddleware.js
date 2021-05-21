const httpStatus = require('http-status');
const USER_IS_NOT_AUTHORIZED = 'Пользователь не авторизован';
const USER_ACCESS_DENIED = 'Нет доступа';

module.exports = function(role) {
    return function(req, res, next) {
        if (req.method === 'OPTIONS') {
            next();
        }
    
        try {
            const user = req.user;

            if (!user || !user.role) {
                return res.status(httpStatus.UNAUTHORIZED).json({ message: USER_IS_NOT_AUTHORIZED });
            }

            if (user.role !== role) {
                return res.status(httpStatus.FORBIDDEN).json({ message: USER_ACCESS_DENIED });
            }

            next();
        } 
        catch (error) {
            console.error(error);
            return res.status(httpStatus.UNAUTHORIZED).json({ message: USER_IS_NOT_AUTHORIZED });
        }
    }
}