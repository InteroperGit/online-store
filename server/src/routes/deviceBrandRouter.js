const Router = require('express');
const router = Router();
const deviceBrandController = require('../controllers/deviceBrandController');
const MiddlewareChainFactory = require('../middleware/middlewareChainFactory');
const middlewareChain = MiddlewareChainFactory.getCheckAdminRoleMiddlewareChain();

router.post('/', ...[middlewareChain], deviceBrandController.create.bind(deviceBrandController));

router.put('/', ...[middlewareChain], deviceBrandController.update.bind(deviceBrandController));

router.delete('/', ...[middlewareChain], deviceBrandController.delete.bind(deviceBrandController));

router.get('/', deviceBrandController.getAll);

module.exports = router;