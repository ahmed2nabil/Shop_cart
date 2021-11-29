'use strict'
const Logger = require('../services/loggerService');

const logger = new Logger('NotFoundMiddlware');
module.exports = (req, res) => {
    logger.error('404 NOT FOUND ');
    res.status(404).json({
        err : "Not Found"
    })
}