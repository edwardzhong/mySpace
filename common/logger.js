const log4js = require('log4js');
const config = require('../config/log4js');

log4js.configure(config);

let levels = {
    'trace': log4js.levels.TRACE,
    'debug': log4js.levels.DEBUG,
    'info': log4js.levels.INFO,
    'warn': log4js.levels.WARN,
    'error': log4js.levels.ERROR,
    'fatal': log4js.levels.FATAL
};

exports.logger = function (level) {
    var logger = log4js.getLogger('systemInfo');
    logger.setLevel(levels[level] || levels['debug']);
    return logger;
};

exports.conectLog=function(level){
    var logger = log4js.getLogger('accessInfo');
    logger.setLevel(levels[level] || levels['debug']);
    return logger;
}