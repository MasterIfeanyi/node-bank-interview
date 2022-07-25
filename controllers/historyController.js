const Account = require("../models/Account");
const User = require("../models/User");
const History = require("../models/History");


// get all transaction history for accounts attached to a user
const getAllTransactionHistory = async (req, res) => {
    try {
        const result = await History.find({ user: req.id });
        if (!result) return res.status(200).json({ "message": "No such user found" });
        res.status(200).json({result});
    } catch (err) {
        return res.status(500).json({ "msg": err.message });
    }
}


// get account transaction history
const getAccountTransactionHistory = async (req, res) => {
    if (!req?.params) return res.status(400).json({ "message": "parameters are required" });
    const {accountId} = req.params
    try {
        // find the account
        const account = await Account.findById(accountId);
        if (!account) return res.status(400).json({ "message": "Account not found" });

        // find user that made request
        const user = await User.findById(req.id);
        if (!user) return res.status(400).json({ "message": "User not found" }); // check for user

        // make sure the logged in user matches the account ref user
        if (account.user.toString() !== user.id) return res.status(401).json({ "message": "User not authorized" });

        // find the user transaction history to send to the front-end
        const result = await History.find({user: account._id});
        if (!result) return res.status(200).json({ "message": "Account balance not found" });
        res.status(200).json({ result });
    } catch (err) {
        return res.status(500).json({ "msg": err.message });
    }
}

module.exports = {
    getAllTransactionHistory,
    getAccountTransactionHistory
}