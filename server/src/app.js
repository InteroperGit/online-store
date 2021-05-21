const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const router = require('./routes');
const errorHandler = require('./middleware/errorHandlingMiddleware');
const path = require('path');
const i18n = require('./handlers/i18n');
var cookieParser = require('cookie-parser')
var cookieSession = require('cookie-session')
const uuid = require('uuid');

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(cookieSession({ secret: uuid.v4() }));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, '..', 'static')));
app.use(i18n.init);
app.use((req, res, next) => {
    if (req.session.locale) {
        if (req.session.locale !== i18n.getLocale()) {
            i18n.setLocale(req.session.locale);
        }
    }
    next();
});
app.use(fileUpload({}));
app.use('/api', router);
app.use(errorHandler);

app.get('/', (req, res) => {
    console.log(`Current locale: ${req.session.locale}`);
	res.status(200).json({ message: i18n.__('Working') });
});

module.exports = app;