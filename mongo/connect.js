const mongoose = require("mongoose")
mongoose.connect("mongodb+srv://arbaz:1234@cluster0.wi54m.mongodb.net/qavm?retryWrites=true&w=majority")
module.exports = mongoose