const User = require('../models/User');
const jwt = require('jsonwebtoken');
require("dotenv").config();

const handleRefreshToken = async (req, res) => {
    // check for the presence of a cookie
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401); //unAuthorized
    const refreshToken = cookies.jwt;

    // find the user using refresh token
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) return res.sendStatus(403); //Forbidden 
    // evaluate jwt 
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.username !== decoded.UserInfo.username) return res.sendStatus(403);

            // create a new access token
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "id": decoded.UserInfo.id,
                        "username": decoded.UserInfo.username,
                        "accountNumber": decoded.UserInfo.accountNumber
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30m' }
            );
            res.json({ accessToken })
        }
    );
}

module.exports = { handleRefreshToken }