import { client } from "../server";

export = {
    name: "ready",
    once: true,
    run: async () => {
        client.info.branch = require("child_process").execSync("git rev-parse --abbrev-ref HEAD").toString().trim();
        client.info.commit = require("child_process").execSync("git rev-parse --short HEAD").toString().trim();
        console.log(`${client.user.tag} is online!`);
        await require("../handlers/commands");
        console.log("----------------\nCommands updated\n----------------");
        console.log(client.commands.size + " commands loaded");
    }
}