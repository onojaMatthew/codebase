const winston = require( 'winston' );
require( 'winston-mongodb' );
require( "dotenv" ).config();

let db_url;
const env = process.env.NODE_ENV || 'development';
if ( env === "development" ) {
  db_url = process.env.DEV_DB;
} else {
  db_url = process.env.PROD_DB;
}

// module.exports = function () {
//   winston.unhandleExceptions(
//     new winston.transports.File( { filename: 'uncaughtException.log' } ),
//     new winston.transports.Console( { 
//       colorize: true, format: winston.format.json(), prettyPrint: true } )
//   )

//   process.on( 'unhandledRejection', ( ex ) => {
//     throw ex;
//   } );

//   new winston.transports.File({ filename: 'error.log', level: 'error' });
//   new winston.transports.File({ filename: 'combined.log' });
//   winston.add( new winston.transports.MongoDB, {
//     db: "mongodb+srv://onthemoovadmin:eMCBEdhbkaFUKfNR@onthemoov.2lvgp.mongodb.net/onthemoovadmin?retryWrites=true&w=majority",
//     level: 'info'
//   } );
// }

 
const logger = winston.createLogger({
  level: 'info',
  // format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.MongoDB({ db: db_url, level: 'info' })
  ],
});
 
//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}