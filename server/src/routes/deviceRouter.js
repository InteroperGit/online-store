const Router = require('express');
const router = Router();
const deviceController = require('../controllers/deviceController');
const MiddlewareChainFactory = require('../middleware/middlewareChainFactory');
const middlewareChain = MiddlewareChainFactory.getCheckAdminRoleMiddlewareChain();

router.post('/', ...[middlewareChain], deviceController.create.bind(deviceController));

router.put('/', ...[middlewareChain], deviceController.update.bind(deviceController));

router.delete('/', ...[middlewareChain], deviceController.delete.bind(deviceController));

router.get('/', deviceController.getAll);

router.get('/:id', deviceController.get);

module.exports = router;