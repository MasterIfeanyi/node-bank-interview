const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401); // unAuthorized
    const token = authHeader.split(" ")[1];
    jwt.verify(
        // verify the token we receive against the secret
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.sendStatus(403); //invalid token
            req.user = decoded.UserInfo.username;
            req.id = decoded.UserInfo.id;
            req.accountNumber = decoded.UserInfo.accountNumber;
            req.accountHistoryId = "";
            next();
        }
    )
}

module.exports = verifyJWT;