const i18n = require('../handlers/i18n');
const ApiError = require('../errors/apiError');

class I18nController {
    setLocale(req, res, next) {
        try {
            req.session.locale = req.params.locale;
            i18n.setLocale(req.params.locale);
            res.json({ message: `locale was successfully changed to ${req.params.locale}` });
        } 
        catch (error) {
            console.log(error.message, error.stack);
            next(ApiError.badRequest('Failed change locale'));
        }
    }
}

module.exports = new I18nController();