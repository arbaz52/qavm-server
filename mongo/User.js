var mongoose = require("./connect")

var Schema = mongoose.Schema

var User = new Schema({
    username: {
        required: true,
        type: String,
    },
    callerId: {
        required: false,
        type: String
    }
})

module.exports = mongoose.model("User", User)