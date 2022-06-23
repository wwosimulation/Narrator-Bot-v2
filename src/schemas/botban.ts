import { model, Schema } from "mongoose"

var schema = new Schema({
    user: { type: String }, // id of user that is banned
    reason: { type: String }, // reason user is banned
    mod: { type: String }, // mod who banned them
    date: { type: Date, default: Date.now }, // time they were banned
})

export default model("botban", schema)