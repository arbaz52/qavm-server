var mongoose = require("./connect")

var Schema = mongoose.Schema

var Meeting = new Schema({
    title: {
        required: true,
        type: String,
    },
    creator: {
        required: false,
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    room_name: {
        required: true,
        type: String
    }
})

module.exports = mongoose.model("Meeting", Meeting)