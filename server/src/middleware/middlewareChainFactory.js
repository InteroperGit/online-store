const auth = require('./authMiddleware');
const checkRole = require('./checkRoleMiddleware');

/**
 * Фабрика цепочек middleware
 */
class MiddlewareChainFactory {
    static getCheckAdminRoleMiddlewareChain() {
        return [auth, checkRole('ADMIN')];
    }

    static getAuthMiddlewareChain() {
        return [auth];
    }
}

module.exports = MiddlewareChainFactory;