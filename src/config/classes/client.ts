import { createAppAuth } from "@octokit/auth-app";
import { Octokit } from "@octokit/core";
import { Client, Collection } from "discord.js";
import { readFileSync } from "fs";
import { AutoComplete, Command } from "..";


export class ExtendedClient extends Client {
    config: any;
    events: Collection<String, File>;
    info: { branch: string; commit: string; }; // Set in the ready event
    github: Octokit;
    commands: Collection<String, Command>;
    autocompletes: Collection<String, AutoComplete>;
    mongo: any;

    constructor() {
        super({intents: [
            1, //"GUILDS",
            2, //"GUILD_MEMBERS",
            8, //"GUILD_EMOJIS_AND_STICKERS",
            4096, //"GUILD_MESSAGES",
            65536, //"GUILD_SCHEDULED_EVENTS",
        ], allowedMentions: {
            parse: ["roles", "users"]
        }});

        this.config = require("../index")
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
        this.autocompletes = new Collection();
    }
}