const express = require("express")
const {getUsers, getAUser, updateUser, deleteUser} = require("../../controllers/usersController")

router = express.Router();

router.route("/")
    .get(getUsers)
    
    
router.route("/:id")
    .get(getAUser)
    .delete(deleteUser)
    .put(updateUser)

module.exports = router;