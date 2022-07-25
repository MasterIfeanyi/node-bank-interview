const mongoose = require("mongoose");
const schema = mongoose.Schema;

const historySchema = schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Account"
    },
    statement: {
        type: String
    }
})


module.exports = mongoose.model("history", historySchema)
