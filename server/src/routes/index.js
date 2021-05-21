const Router = require('express');
const router = Router();
const userRouter = require('./userRouter');
const deviceTypeRouter = require('./deviceTypeRouter');
const deviceBrandRouter = require('./deviceBrandRouter');
const deviceRouter = require('./deviceRouter');
const basketRouter = require('./basketRouter');
const i18nRouter = require('./i18nRouter');

router.use('/user', userRouter);
router.use('/devicetype', deviceTypeRouter);
router.use('/devicebrand', deviceBrandRouter);
router.use('/device', deviceRouter);
router.use('/basket', basketRouter);
router.use('/i18n/', i18nRouter);

module.exports = router;