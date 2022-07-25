const Account = require("../models/Account");
const User = require("../models/User");
const History = require("../models/History");
const {parseISO, sub, formatDistanceToNow} = require("date-fns")

// get all account attached to a user
const getAllAccounts = async (req, res) => {
    const account = await Account.find({ user: req.id });
    if (!account) return res.status(200).json({ "message": "No such user found" });
    res.status(200).json(account);
}


// create new account 
const createNewAccount = async (req, res) => {
    if (!req?.body) return res.status(400).json({ "message": "body is required" });
    const { name, amount, phone, age, occupation } = req.body;
    console.log(req.id);
    try {
        const newAccount = await Account.create({
            balance: amount,
            user: req.id,
            accountNumber: phone,
            phone,
            age,
            occupation,
            name
        })


        // save transaction history with time stamp
        let timeAgo = "";
        let timestamp = new Date();
        if (timestamp) {
            const date = timestamp.toLocaleDateString("en-NG");
            const timePeriod = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: "2-digit" });
            timeAgo = `${date} at ${timePeriod}`
        }

        await History.create({
            statement: `Welcome, You created your account on ${timeAgo}, your bank balance is ${Number(amount).toLocaleString("en-US")}`,
            user: newAccount._id
        })
        
        // find all the user account to send to the front-end
        res.status(201).json({"message": newAccount}); // everything was okay
    } catch (err) {
        return res.status(500).json({ "msg": err.message });
    }
}


// deposit money
const deposit = async (req, res) => {
    if (!req?.body) return res.status(400).json({ "message": "body is required" });
    const {amount} = req.body
    const accountId = req.params.id
    try {
        // find the account
        const account = await Account.findById(accountId);
        if (!account) return res.status(400).json({ "message": "Account not found" });

        // transaction history
        const history = await History.findOne({ user: accountId }).exec();
        if(!history) return res.status(400).json({"message": "No History"})

        // find user that made the request
        const user = await User.findById(req.id);
        if (!user) return res.status(400).json({ "message": "User not found" }); // check for user
        
        // make sure the logged in user matches the account ref user
        if (account.user.toString() !== user.id) return res.status(401).json({ "message": "User not authorized" }); //unAuthorized
        
        const newBalance = await Account.findByIdAndUpdate(accountId, {$inc: {balance: amount}}, {new: true});

        // save transaction history with time stamp
        let timeAgo = "";
        let timestamp = new Date();
        if (timestamp) {
            const date = timestamp.toLocaleDateString("en-NG");
            const timePeriod = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: "2-digit" });
            timeAgo = `${date} at ${timePeriod}`
        }

        await History.create({
            statement: `You deposited ${Number(amount).toLocaleString("en-US")} on ${timeAgo}, your bank balance is ${Number(newBalance.balance).toLocaleString("en-US")}`,
            user: account._id
        })
        
        // find the user balance to send to the front-end
        res.status(200).json(newBalance)
    } catch (err) {
        return res.status(500).json({ "message": err.message });
    }
}


// withdraw money
const withdraw = async (req, res) => {
    if (!req?.body) return res.status(400).json({ "message": "body is required" });
    const {amount} = req.body
    const accountId = req.params.id
    try {
        // find the account
        const account = await Account.findById(accountId);
        if (!account) return res.status(400).json({ "message": "Account not found" });

        // transaction history
        const history = await History.findOne({ user: accountId }).exec();
        if(!history) return res.status(400).json({"message": "No History"})

        // find user that made the request
        const user = await User.findById(req.id);
        if (!user) return res.status(400).json({ "message": "User not found" }); // check for user
        
        // make sure the logged in user matches the account ref user
        if (account.user.toString() !== user.id) return res.status(401).json({ "message": "User not authorized" }); //unAuthorized
        
        if (amount > account.balance) return res.sendStatus(403);
        const newBalance = await Account.findByIdAndUpdate(accountId, { $inc: {balance: -amount}}, {new: true});


        // save transaction history with time stamp
        let timeAgo = "";
        let timestamp = new Date();
        if (timestamp) {
            const date = timestamp.toLocaleDateString("en-NG");
            const timePeriod = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: "2-digit" });
            timeAgo = `${date} at ${timePeriod}`
        }

        let statement = `You withdrew ${Number(amount).toLocaleString("en-US")} on ${timeAgo}, your bank balance is ${Number(newBalance.balance).toLocaleString("en-US")}`;

        await History.create({
            statement,
            user: account._id
        })

        // find the user balance to send to the front-end
        res.status(200).json(newBalance)
    } catch (err) {
        return res.status(500).json({ "message": err.message });
    }
}

// get account balance
const getAccountBalance = async (req, res) => {
    if (!req?.params) return res.status(400).json({ "message": "parameters are required" });
    const accountId = req.params.id
    try {
        // find the account
        const account = await Account.findById(accountId);
        if (!account) return res.status(400).json({ "message": "Account not found" });

        // find user that made request
        const user = await User.findById(req.id);
        if (!user) return res.status(400).json({ "message": "User not found" }); // check for user

        // make sure the logged in user matches the account ref user
        if (account.user.toString() !== user.id) return res.status(401).json({ "message": "User not authorized" });

        // find the user balance to send to the front-end
        const result = await Account.findById(accountId);
        if (!result) return res.status(200).json({ "message": "Account balance not found" });
        res.status(200).json({ result });
    } catch (err) {
        return res.status(500).json({ "msg": err.message });
    }
}

module.exports = {
    getAllAccounts,
    createNewAccount,
    withdraw,
    deposit,
    getAccountBalance
}