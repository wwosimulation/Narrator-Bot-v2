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
        let part = interaction.options.getString("part") ?? "profile";
        let guy = await player.findOne({ user: user.id }) || await player.create({ user: user.id });

        switch (part) {
            case "badges":
                let description = "";
                for (let badge of guy.badges) {
                    description += `[${badge.name}] - ${Utils.getDateString(badge.unlockedAt)}\n`;
                }
                description = description.length > 0 ? "```scss\n" + description + "```" : "*No badges yet.*";

                let embed_badges = {
                    title: `Badges for ${user.username}`,
                    description,
                    color: 5793266,
                    timestamp: new Date(),
                }
                interaction.reply({ embeds: [embed_badges] });
                break;
            case "inventory":
                let embed_inv = {
                    title: `Inventory for ${user.username}`,
                    description: "**Currencies:**",
                    fields: [
                        { name: "Coins", value: `${guy.coins} ${Utils.getEmoji("coins", client)}`, inline: true },
                        { name: "Gems", value: `${guy.gems} ${Utils.getEmoji("gems", client)}`, inline: true },
                        { name: "Roses", value: `${guy.roses} ${Utils.getEmoji("rose", client)}`, inline: true },
                        { name: "Items:", value: `Roses: ${guy.inventory.rose} ${Utils.getEmoji("rose", client)}\nBouquets: ${guy.inventory.bouquet} ${Utils.getEmoji("bouquet", client)}\nLootboxes: ${guy.inventory.lootbox} ${Utils.getEmoji("lootbox", client)}` },
                    ],
                    color: 5793266,
                    timestamp: new Date(),
                    author: {
                        name: `${user.tag}`,
                        icon_url: user.avatarURL(),
                    }
                }
                interaction.reply({ embeds: [embed_inv] });
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