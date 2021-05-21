const Router = require('express');
const router = Router();
const deviceTypeController = require('../controllers/deviceTypeController');
const MiddlewareChainFactory = require('../middleware/middlewareChainFactory');
const middlewareChain = MiddlewareChainFactory.getCheckAdminRoleMiddlewareChain();

router.post('/', ...[middlewareChain], deviceTypeController.create.bind(deviceTypeController));

router.put('/', ...[middlewareChain], deviceTypeController.update.bind(deviceTypeController));

router.delete('/', ...[middlewareChain], deviceTypeController.delete.bind(deviceTypeController));

router.get('/', deviceTypeController.getAll.bind(deviceTypeController));

module.exports = router;