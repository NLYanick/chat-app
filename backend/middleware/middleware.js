
function verifyApiKey(req, res, next) {
    const apiKey = req.headers['x-api-key'];

    if (apiKey && apiKey === process.env.API_KEY) 
        next();
    else 
        res.status(401).json({ error: "Unauthorized: You need the API-key" }); 
}

function handleError(err, req, res, next) {
    console.error(err);

    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    if(err.status && err.status < 500) {
        res.status(err.status).send({ error: err.message });
    } else {
        res.status(500).send({ error: "Internal Server Error" });
    }
}

module.exports = {
    verifyApiKey,
    handleError
}