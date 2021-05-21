const { Sequelize } = require('sequelize');
const cls = require('cls-hooked');
const namespace = cls.createNamespace(process.env.CLS);
Sequelize.useCLS(namespace);

module.exports = new Sequelize(
	process.env.DB_NAME,
	process.env.DB_USER,
	process.env.DB_PASSWORD,
	{
		dialect: 'postgres',
		dialectOptions: {
			useUTC: false, // for reading from database
		},
		timezone: "+03:00",
		host: process.env.DB_HOST,
		port: process.env.DB_PORT
	}
);