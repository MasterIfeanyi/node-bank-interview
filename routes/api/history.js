const express = require("express")
const { getAllTransactionHistory, getAccountTransactionHistory} = require("../../controllers/historyController")

router = express.Router();

router.get("/", getAllTransactionHistory)      
    
router.get("/:accountId", getAccountTransactionHistory)


module.exports = router;