const Router = require('express');
const basketController = require('../controllers/basketController');
const router = Router();
const MiddlewareChainFactory = require('../middleware/middlewareChainFactory');
const middlewareChain = MiddlewareChainFactory.getAuthMiddlewareChain();

router.post('/', ...middlewareChain, basketController.addDeviceToBasket.bind(basketController));

router.delete('/', ...middlewareChain, basketController.deleteDeviceFromBasket.bind(basketController));

router.get('/', ...middlewareChain, basketController.fetchBasket.bind(basketController));

router.get('/amount', ...middlewareChain, basketController.fetchBasketAmount.bind(basketController));

router.get('/check', ...middlewareChain, basketController.checkDevice.bind(basketController));

module.exports = router;