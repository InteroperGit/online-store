const Router = require('express');
const router = Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const MiddlewareChainFactory = require('../middleware/middlewareChainFactory');
const middlewareChain = MiddlewareChainFactory.getCheckAdminRoleMiddlewareChain();

router.post('/registration', userController.registration.bind(userController));

router.post('/login', userController.login.bind(userController));

router.get('/auth', authMiddleware, userController.check.bind(userController));

router.post('/', ...middlewareChain, userController.create.bind(userController));

router.put('/', ...middlewareChain, userController.update.bind(userController));

router.delete('/', ...middlewareChain, userController.delete.bind(userController));

router.get('/', ...middlewareChain, userController.getAll);

module.exports = router;