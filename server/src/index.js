require('dotenv').config();

const app = require('./app');
const { getCurrentDateTime } = require('./libs/date');
const sequelize = require('./handlers/db');

const PORT = process.env.PORT || 5000;

const start = async () => {
	try {
		await sequelize.authenticate();
		await sequelize.sync({ alter: true });
		app.listen(PORT, () => console.log(`[INFO] [${getCurrentDateTime()}] ` +
 	 		`Server was started on port ${PORT}`));
	}
	catch(e) {
		console.log(`[ERROR] [${getCurrentDateTime()}] ${e}`);
	}
} 

start();

