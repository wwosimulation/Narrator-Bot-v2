import { CommandInteraction } from "discord.js";
import Command = require("../config/classes/command");
import player from "../schemas/player";
import { ExtendedClient } from "../server";
import { Utils } from "../config/Utils";

let command = new Command({
    commandObject: {
        name: "profile",
        description: "Display some information about your/another user.",
        options: [
            {
                name: "user",
                description: "The user to display information about. Default is yourself.",
                type: "USER",
                required: false,
            },
            {
                name: "part",
                description: "The part of the profile to display. Default is \"profile-card\"",
                type: "STRING",
                required: false,
                choices: [
                    { name: "badges", value: "badges" },
                    { name: "inventory", value: "inventory" },
                    { name: "stats", value: "stats" },
                    { name: "profile-card", value: "profile" },
                ]
            }
        ]
    },
    run: async (interaction: CommandInteraction, client: ExtendedClient) => {
        let user = interaction.options.getUser("user") ?? interaction.user;
        let part = interaction.options.getString("part") ?? "profile-card";
        let guy = await player.findOne({ user: user.id }) || await player.create({ user: user.id });
        console.log(guy);
        await guy.updateOne({$set: {badges: [{name: "test", unlockedAt: new Date()}]}});

        switch (part) {
            case "badges":
                let description = "";
                for (let badge of guy.badges) {
                    description +=  `[${badge.name}] - ${Utils.getDateString(badge.unlockedAt)}\n`;
                }
                description = description.length > 0 ? "```scss\n" + description + "```": "*No badges yet.*";

                let embed = {
                    title: `Badges for ${user.username}`,
                    description,
                    color: 5793266,
                    timestamp: new Date(),
                }
                interaction.reply({ embeds: [embed] });
                break;
            case "inventory":
                break;
            case "stats":
                break;
            case "profile":
                break;
            default:
                interaction.reply("Invalid part.");
                return;
        }
    }
});

module.exports = command;