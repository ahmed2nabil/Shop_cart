'use strict'
const Logger = require('../services/loggerService');

const logger = new Logger('errorMiddleware');
module.exports = (err, req, res, next) => {
    logger.error('500 error', JSON.stringify(err.message));
    res.status(500).json({
        err : err.message
    })
}