const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate JWT
const generateJWT = (username, id) => {
    return jwt.sign(
        {
            "UserInfo": {
                id,
                username
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "2m" }
    )
}


const handleNewUser = async (req, res) => {
    const { user, pwd } = req.body;

    if (!user || !pwd) res.status(400).json({ "message": "Username and password are required." });

    // check for duplicate usernames in the db
    const duplicate = await User.findOne({ username: user }).exec();
    if (duplicate) return res.sendStatus(409); // user already exists

    try {
        //encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10);

        // create and store the password
        let newUser = await User.create({
            "username": user,
            "password": hashedPwd
        })

        // create JWTs
        const accessToken = generateJWT(newUser.username, newUser._id);

        const refreshToken = jwt.sign(
            {
                "UserInfo": {
                    "id": newUser._id,
                    "username": newUser.username
                }
            },
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: "10m"}
        )

        // Saving refreshToken with current user
        newUser.refreshToken = refreshToken;
        await newUser.save();
        console.log(newUser);

        if (newUser) {
            // saving refresh token in a cookie
            res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: "None", maxAge: 24 * 60 * 60 * 1000 });
            res.status(201).json({ accessToken });
        }

    } catch (err) {
        res.status(500).json({ "message": err.message });
    }
}


module.exports = {handleNewUser}