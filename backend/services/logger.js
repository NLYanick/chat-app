const fs = require('fs');
const path = require('path');

module.exports = class Logger {
    static LOGS_DIRECTORY = path.join(__dirname, '..', 'logs');

    constructor() {
        if (!fs.existsSync(Logger.LOGS_DIRECTORY)) {
            fs.mkdirSync(Logger.LOGS_DIRECTORY);
        }
    }

    static logError(error) {
        const logMessage = `[${new Date().toISOString()}] ${error.stack || error}\n`;
        fs.appendFileSync(path.join(Logger.LOGS_DIRECTORY, 'error-logs.txt'), logMessage);
    }
    
    static logInfo(info) {
        const logMessage = `[${new Date().toISOString()}] ${info}\n`;
        fs.appendFileSync(path.join(Logger.LOGS_DIRECTORY, 'info-logs.txt'), logMessage);
    }
}
