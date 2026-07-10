const fs = require('fs');
const path = require('path');

module.exports = class Logger {
    static LOGS_DIRECTORY = path.join(__dirname, '..', 'logs');

    constructor() {
        Logger.addDirectory();
    }

    static logError(error) {
        Logger.addDirectory();
        const logMessage = `[${new Date().toISOString()}] ${error.stack || error}\n`;
        fs.appendFileSync(path.join(Logger.LOGS_DIRECTORY, 'error-logs.txt'), logMessage);
    }
    
    static logInfo(info) {
        Logger.addDirectory();
        const logMessage = `[${new Date().toISOString()}] ${info}\n`;
        fs.appendFileSync(path.join(Logger.LOGS_DIRECTORY, 'info-logs.txt'), logMessage);
    }

    static addDirectory() {
        if (!fs.existsSync(Logger.LOGS_DIRECTORY)) {
            fs.mkdirSync(Logger.LOGS_DIRECTORY);
        }
    }
}
