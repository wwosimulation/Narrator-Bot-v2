import { model, Schema } from "mongoose"
import { set, get } from "quick.db"

var schema = new Schema({
    index: {
        type: Number,
        index: true,
        unique: true,
        default: () => {
            set("gamewarnIndex", get("gamewarnIndex") + 1)
            return get("gamewarnIndex")
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

export default model("gamewarns", schema)
