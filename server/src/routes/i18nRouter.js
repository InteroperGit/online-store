const Router = require('express');
const router = Router();
const i18nController = require('../controllers/i18nController');

router.use('/setLocale/:locale', i18nController.setLocale.bind(i18nController));

module.exports = router;

