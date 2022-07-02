import { CommandInteraction } from "discord.js";
import Command = require("../config/classes/command");
import { ExtendedClient } from "../server";

let command = new Command({
    commandObject: {
        name: "suggestion",
        description: "Suggest a new feature for the bot.",
        options: [
            {
                type: "STRING",
                name: "title",
                description: "A short fitting title for this suggestion",
                required: true,
            },
            {
                type: "STRING",
                name: "description",
                description: "A detailed description of the suggestion including all neccessary information and a reason to implement it",
                required: true,
            },
            {
                type: "STRING",
                name: "part",
                description: "The part of the bot that the suggestion is related to",
                required: true,
                choices: [
                    { name: "Game - Narrator", value: "Game - Narrator" },
                    { name: "Game - Player", value: "Game - Player" },
                    { name: "Economy", value: "Economy" },
                    { name: "Other (include in the description)", value: "Other" },
                ],
            }, {
                type: "STRING",
                name: "game",
                description: "The game that the bug is related to",
                required: true,
                choices: [
                    { name: "Wolvesville", value: "Wolvesville" },
                    { name: "Towwn of Salem", value: "Towwn of Salem" },
                    { name: "none", value: "none" },
                ]
            },
            {
                type: "STRING",
                name: "origin",
                description: "Where is this suggestion from?",
                required: true,
                choices: [
                    { name: "Staff Vote", value: "Staff Vote" },
                    { name: "Community Vote", value: "Community Vote" },
                    { name: "Dev Assistant", value: "Dev Assistant" },
                    { name: "Member", value: "Member" },
                    { name: "Other", value: "Other" },
                ],
            },
        ],
    },
    run: async (interaction: CommandInteraction, client: ExtendedClient) => {
        let body = `**Title:** ${interaction.options.getString("title")}

### What is the suggestion?

${interaction.options.getString("description")}

### What is the part of the bot that this suggestion is related to?

${interaction.options.getString("part")}

### Where is this suggestion from?

${interaction.options.getString("origin")}

<hr>

The above suggestion was suggested by ${interaction.user.tag}
User ID: ${interaction.user.id}
`
        let labels = ["Suggestion", "Unapproved"];
        if (interaction.options.getString("game") !== "none") {
            labels.push(interaction.options.getString("game"));
        }
        if (interaction.options.getString("part") == "Economy") {
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
        interaction.reply({ content: `Feature suggested! Thank you for your contribution! You can view it here: <${done.data.html_url}>\n Any additional information and pictures can be commented there too.`, ephemeral: true });
    }
});

module.exports = command;