const Logger = require("../services/logger");
const { saveParseJson } = require("../utils");

function verifyApiKey(req, res, next) {
    const apiKey = req.headers['x-api-key'];

    if (checkApiKey(apiKey)) 
        next();
    else if (typeof req.body === 'string') {
        const parsedBody = saveParseJson(req.body);
        if (parsedBody && parsedBody['x-api-key'] && checkApiKey(parsedBody['x-api-key'])) {
            req.body = parsedBody; // Replace the raw text body with the parsed JSON object
            next();
        } else {
            res.status(401).json({ error: "Unauthorized: You need the API-key" }); 
        }
    }
    else 
        res.status(401).json({ error: "Unauthorized: You need the API-key" }); 
}

function checkApiKey(apiKey) {
    return apiKey && apiKey === process.env.API_KEY;
}

function handleError(err, req, res, next) {
    console.error(err);

    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    Logger.logError(err);

    if(err.status && err.status < 500) {
        res.status(err.status).send({ error: err.message, success: false });
    } else {
        res.status(500).send({ error: err.message || "Internal Server Error", success: false });
    }
}

module.exports = {
    verifyApiKey,
    handleError
}