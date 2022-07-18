import Command = require("../config/classes/command");
import { ExtendedCommandInteraction } from "../config/classes/extendedInteraction";
import { ExtendedClient } from "../server";

let command = new Command({
    commandObject: {
        name: "bug",
        description: "Report a bug",
        options: [
            {
                type: 3, // "STRING"
                name: "title",
                description: "A short fitting title for the bug",
                required: true
            }, {
                type: 3, // "STRING"
                name: "description",
                description: "A detailed description of the bug and steps how to reproduce it",
                required: true
            }, {
                type: 3, // "STRING"
                name: "part",
                description: "The part of the bot that the bug is related to",
                required: true,
                choices: [
                    { name: "Game - Narrator", value: "Game - Narrator" },
                    { name: "Game - Player", value: "Game - Player" },
                    { name: "Economy", value: "Economy" },
                    { name: "General", value: "General" },
                ]
            }, {
                type: 3, // "STRING"
                name: "game",
                description: "The game that the bug is related to",
                required: true,
                choices: [
                    { name: "Wolvesville", value: "Wolvesville" },
                    { name: "Towwn of Salem", value: "Towwn of Salem" },
                    { name: "none", value: "none" },
                ]
            }, {
                type: 3, // "STRING"
                name: "gamecode",
                description: "The gamecode of the game in case the bug happened in a game",
                required: false
            }
        ]
    },
    run: async (interaction: ExtendedCommandInteraction, client: ExtendedClient) => {
        let body = `**Title:** ${interaction.options.getString("title")}
**Branch:** [${client.info.branch}](https://github.com/wwosimulation/Narrator-Bot-v2/tree/${client.info.branch})
**Commit:** [${client.info.commit}](https://gitbub.com/wwosimulation/Narrator-Bot-v2/commit/${client.info.commit})
${interaction.options.getString("game") ? `**Game:** ${interaction.options.getString("game")}` : ""} ${interaction.options.getString("gamecode") ? `\`(${interaction.options.getString("gamecode")})\`` : ""}

**Description:** ${interaction.options.getString("description")}
**Part:** ${interaction.options.getString("part")}

<hr>

The above bug was reported by ${interaction.user.tag}
User ID: ${interaction.user.id}
`
        let labels = ["Bug", "Unverified"];
        if(interaction.options.getString("game") !== "none") {
            labels.push(interaction.options.getString("game"));
        }
        if(interaction.options.getString("part") == "Economy") {
            labels.push("Economy");
        }

        let issue = {
            title: `BUG: ${interaction.options.getString("title") ?? "N/A"}`,
            body,
            labels,
            owner: client.config.github.owner, 
            repo: client.config.github.repo
        }

        let done = await client.github.request(`POST /repos/${client.config.github.owner}/${client.config.github.repo}/issues`, issue);
        interaction.reply({content: interaction.i18n("github.bug", {url: done.url}), ephemeral: true});

    }

});

module.exports = command;