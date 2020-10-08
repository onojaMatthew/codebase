const winston = require('winston');
require('winston-mongodb');
require("dotenv");

let db_url;
const env = process.env.NODE_ENV || 'development';
if (env === "development") {
  db_url = process.env.DEV_DB;
} else {
  db_url = process.env.PROD_DB;
}

module.exports = function () {
  winston.handleExceptions(
    new winston.transports.File({ filename: 'uncaughtException.log' }),
    new winston.transports.Console({ colorize: true, prettyPrint: true })
  )

  process.on( 'unhandledRejection', (ex) => {
    throw ex;
  });

  winston.add(winston.transports.File, { filename: 'logFile.log' });
  winston.add(winston.transports.MongoDB, {
    db: db_url,
    level: 'info'
  });
}