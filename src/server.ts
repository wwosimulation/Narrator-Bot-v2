console.log("Booting bot...");
require("dotenv").config();

var fs = require("fs");
var db = require("quick.db");

const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");

if(db.get("emergencystop")) {
    setTimeout(() => {
        console.log("Emergency stop detected, exiting...");
        process.exit(0);
    })
}

const mongo = require("./db.ts")
var { Client } = require("discord.js")
const client = new Client({ intents: ["GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "DIRECT_MESSAGES", "GUILDS", "GUILD_MEMBERS", "GUILD_BANS", "GUILD_EMOJIS_AND_STICKERS", "GUILD_PRESENCES"] })
client.db = db
client.dbs = mongo
client.Sentry = Sentry
