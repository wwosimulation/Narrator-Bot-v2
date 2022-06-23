console.log("Booting bot...");
require("dotenv").config();

import * as db from "quick.db";
import { Octokit } from "@octokit/core";
import { createAppAuth } from "@octokit/auth-app";
import { readFileSync } from "fs"

if(db.get("emergencystop")) {
    setTimeout(() => {
        console.log("Emergency stop detected, exiting...");
        process.exit(0);
    }, 5000);
}

import { Client, Collection } from "discord.js";
import Command = require("./config/classes/command");

class ExtendedClient extends Client {
    config: any;
    events: Collection<String, File>;
    info: { branch: string; commit: string; }; // Set in the ready event
    github: Octokit;
    commands: Collection<String, Command>;

    constructor() {
        super({intents: [
            "GUILDS",
            "GUILD_EMOJIS_AND_STICKERS",
            "GUILD_SCHEDULED_EVENTS",
            "DIRECT_MESSAGES",
            "GUILD_MEMBERS"
        ], allowedMentions: {
            parse: ["roles", "users"]
        }});

        this.config = require("./config")
        this.events = new Collection();
        this.github = new Octokit({
            authStrategy: createAppAuth,
            auth: {
                appId: this.config.github.appId,
                privateKey: readFileSync("./github-private-key.pem"),
                clientSecret: process.env.GITHUB_APP_SECRET,
                installationId: this.config.github.installationId
            }
        })
        this.info = { branch: "", commit: "" };
        this.commands = new Collection();
    }
}

let client = new ExtendedClient();
require("./managers/eventManager");
//require("./managers/commandManager");
client.login(process.env.DISCORD_TOKEN);
export { ExtendedClient, client };