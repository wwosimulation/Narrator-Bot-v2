import { Command, ExtendedCommandInteraction, ExtendedClient } from "../config";

let command = new Command({
    commandObject: {
        name: "suggestion",
        description: "Suggest a new feature for the bot.",
        options: [
            {
                type: 3, // "STRING"
                name: "title",
                description: "A short fitting title for this suggestion",
                required: true,
            },
            {
                type: 3, // "STRING"
                name: "description",
                description: "A detailed description of the suggestion including information and reasons",
                required: true,
            },
            {
                type: 3, // "STRING"
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
                type: 3, // "STRING"
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
                type: 3, // "STRING"
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
    run: async (interaction: ExtendedCommandInteraction, client: ExtendedClient) => {
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
        interaction.reply({ content: interaction.i18n("github.suggestion", {url: done.url}), ephemeral: true });
    }
});

module.exports = command;