const { I18n } = require('i18n');
const path = require('path');

const i18n = new I18n({
    locales: ['en', 'ru'],
    directory: path.join(__dirname, '..', '..', 'locales'),
    header: 'Accept-Language',
    autoReload: true,
    updateFiles: true,
    syncFiles: true
});

module.exports = i18n;