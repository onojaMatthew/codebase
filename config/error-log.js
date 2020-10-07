const winston = require( 'winston' );
require( 'winston-mongodb' );
require( "dotenv" );

let db_url;
const env = process.env.NODE_ENV || 'development';
if ( env === "development" ) {
  db_url = process.env.DBURL;
} else {
  db_url = process.env.PROD_DB;
}

// module.exports = function () {
//   winston.handleExceptions(
//     new winston.transports.File( { filename: 'uncaughtException.log' } ),
//     new winston.transports.Console( { colorize: true, prettyPrint: true } )
//   )

//   process.on( 'unhandledRejection', ( ex ) => {
//     throw ex;
//   } );

//   winston.add( winston.transports.File, { filename: 'logFile.log' } );
//   winston.add( winston.transports.MongoDB, {
//     db: db_url,
//     level: 'info'
//   } );
// }

 
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
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