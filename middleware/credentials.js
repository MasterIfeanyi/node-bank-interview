const allowedOrigins = require("../config/allowedOrigins");

const credentials = (req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) { // if the origin that made the request, set these headers
        res.set({
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Credentials": true
        })
    }
    next();
}

module.exports = credentials