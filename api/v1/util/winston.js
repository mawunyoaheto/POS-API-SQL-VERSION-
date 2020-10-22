var appRoot = require('app-root-path');
var winston = require('winston');
require('winston-daily-rotate-file');

const logger = winston.createLogger({
  level: 'info',
  transports: [
    //
    // - Write to all logs with level `info` and below to `PiClock.log`
    //
    new winston.transports.DailyRotateFile({
      filename: `${appRoot}/logs/app-%DATE%.log`,
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD hh:mm:ss A ZZ'
        }),
        winston.format.json()
      ),
      handleExceptions: true
    }),
    new winston.transports.Console({
           format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD hh:mm:ss A ZZ'
        }),
        winston.format.json()
      ),
      handleExceptions: true
    })
  ]
});
// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write: function(message, encoding) {
    // use the 'info' log level so the output will be picked up by both transports (file and console)
    logger.info(message);
  },
};

module.exports = logger;