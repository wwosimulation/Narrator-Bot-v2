var mongoose = require("mongoose")

var schema = new mongoose.Schema({
    index: {
        type: Number,
        index: true,
        unique: true,
        default: () => {
            db.set("gamewarnIndex", db.get("gamewarnIndex") + 1)
            return db.get("gamewarnIndex")
        },
    },
    user: { type: String, required: true },
    reason: { type: String, default: "*No reason given*" },
    gamecode: { type: String, default: "*No game code given*" },
    date: {
        type: Date,
        default: () => {
            return new Date().getTime()
        },
    },
})

module.exports = mongoose.model("gamewarns", schema)
