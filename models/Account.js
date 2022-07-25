const mongoose = require("mongoose");
const schema = mongoose.Schema;

const accountSchema = schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    balance: {
        type: Number, 
        required: [true, "Please enter a value"]
    },
    accountNumber: {
        type: Number, 
        required: [true, "Please enter a value"]
    },
    name: {
        type: String,
    },
    phone: {
        required: true,
        type: String
    },
    age: {
        required: true,
        type: String
    },
    occupation: {
        required: true,
        type: String
    },
})


module.exports = mongoose.model("account", accountSchema)
