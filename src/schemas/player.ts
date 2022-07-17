import { model, Schema } from "mongoose";

var schema = new Schema({
    user: { type: String, unique: true, required: true }, //UserID
    inventory: {
        currencies: {
            coins: { type: Number, default: 25 },
            roses: { type: Number, default: 0 },
            gems: { type: Number, default: 0 },
        },
        items: {
            bouquet: { type: Number, default: 0 },
            lootbox: { type: Number, default: 0 },
            roses: { type: Number, default: 0 },
            other: { type: Array, default: [] }, // {name, amount}
        },
        badges: { type: Array, default: [] },
        privateChannel: { type: String, default: null },
        customRole: { type: String, default: null },
        autoReact: { type: Boolean, default: false },
        daily: {
            last: { type: Date, default: null },
            day: { type: Number, default: 0 },
        },
    },
    profile: {
        xp: { type: Number, default: 0 },
        level: { type: Number, default: 0 },
        unlocked: { type: Boolean, default: false },
        description: { type: String, default: null },
        icon: { type: String, default: null },
        createdAt: { type: Date, default: Date.now() },
    },
    stats: {
        wov: {
            tie: { type: Number, default: 0 },
            flee: { type: Number, default: 0 },
            winStreak: { type: Number, default: 0 },
            village: {
                win: { type: Number, default: 0 },
                lose: { type: Number, default: 0 },
            },
            werewolf: {
                win: { type: Number, default: 0 },
                lose: { type: Number, default: 0 },
            },
            couple: {
                win: { type: Number, default: 0 },
                lose: { type: Number, default: 0 },
            },
            sect: {
                win: { type: Number, default: 0 },
                lose: { type: Number, default: 0 },
            },
            zombie: {
                win: { type: Number, default: 0 },
                lose: { type: Number, default: 0 },
            },
            bandit: {
                win: { type: Number, default: 0 },
                lose: { type: Number, default: 0 },
            },
            solovoting: {
                win: { type: Number, default: 0 },
                lose: { type: Number, default: 0 },
            },
            solokiller: {
                win: { type: Number, default: 0 },
                lose: { type: Number, default: 0 },
            },
            modded: {
                win: { type: Number, default: 0 },
                lose: { type: Number, default: 0 },
            },
        },
        salem: { type: Object, default: {} },
    },
    settings: {
        language: { type: String, default: "en-US" },
        private: { type: Boolean, default: false },
    },
    moderation: {
        warns: { type: Array, default: [] },
        ban: { type: Object, default: null },
    }
});

export default model("players", schema)