const DEFAULT_OPTIONS = { 
	day: 'numeric', 
	month: '2-digit', 
	year: 'numeric', 
	hour: 'numeric', 
	minute: 'numeric',
	second: 'numeric'
};

const DEFAULT_LOCALE = "ru-RU";

const getCurrentDateTime = (locale = DEFAULT_LOCALE, options = DEFAULT_OPTIONS) => `${new Date().toLocaleDateString(locale, options)}`;

module.exports = {
    getCurrentDateTime: getCurrentDateTime
};