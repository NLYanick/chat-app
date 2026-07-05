const jwt = require("jsonwebtoken");
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

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) return res.status(401).json({ message: "Not authenticated", error: "No authorization token provided", success: false });

  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.userId = payload.uid;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token", error: "Invalid or expired token", success: false });
  }
}

module.exports = {
    verifyApiKey,
    handleError,
    requireAuth
}