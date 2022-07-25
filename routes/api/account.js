const express = require("express")
const {getAllAccounts, createNewAccount, withdraw, deposit, getAccountBalance} = require("../../controllers/accountController")

router = express.Router();

router.route("/")
    .get(getAllAccounts)
    .post(createNewAccount)
    
    
router.route("/:id")
    .get(getAccountBalance)

router.put("/deposit/:id", deposit);

router.put("/withdraw/:id", withdraw)

module.exports = router;