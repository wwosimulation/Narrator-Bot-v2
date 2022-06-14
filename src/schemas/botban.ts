var mongoose = require("mongoose")

var schema = new mongoose.Schema({
    user: { type: String }, // id of user that is banned
    reason: { type: String }, // reason user is banned
    mod: { type: String }, // mod who banned them
    date: { type: Date, default: Date.now }, // time they were banned
})

module.exports = mongoose.model("botban", schema)