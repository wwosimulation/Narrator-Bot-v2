import Command = require("../config/classes/command");
import player from "../schemas/player";
import { Utils } from "../config/Utils";
import { ExtendedCommandInteraction } from "../config/classes/extendedInteraction";
import { DBUser } from "../config/types";
import { ExtendedClient } from "../config";

let command = new Command({
    commandObject: {
        name: "profile",
        description: "Display some information about you/another user.",
        options: [
            {
                type: 1, // "SUB_COMMAND"
                name: "badges",
                description: "Display the badges of a user.",
                options: [
                    {
                        name: "user",
                        description: "The user to display information about. Pasting userID also works.",
                        type: 6, // "USER"
                        required: false,
                    },
                ],
            },
            {
                type: 1, // "SUB_COMMAND"
                name: "inventory",
                description: "Display the inventory of a user.",
                options: [
                    {
                        name: "user",
                        description: "The user to display information about. Pasting userID also works.",
                        type: 6, // "USER"
                        required: false,
                    },
                ],
            },
            {
                type: 1, // "SUB_COMMAND"
                name: "card",
                description: "Display the profile card of a user.",
                options: [
                    {
                        name: "user",
                        description: "The user to display information about. Pasting userID also works.",
                        type: 6, // "USER"
                        required: false,
                    },
                ],
            },
            {
                type: 1, // "SUB_COMMAND"
                name: "stats",
                description: "Display the stats of a user.",
                options: [
                    {
                        name: "game",
                        description: "The game to display information about.",
                        type: 3, // "STRING"
                        required: true,
                        choices: [
                            { name: "WOV", value: "wov" }
                        ]
                    },
                    {
                        name: "user",
                        description: "The user to display information about. Pasting userID also works.",
                        type: 6, // "USER"
                        required: false,
                    }
                ],
            }
        ]
    },
    run: async (interaction: ExtendedCommandInteraction, client: ExtendedClient) => {
        let user = interaction.options.getUser("user") ?? interaction.user;
        let sub = interaction.options.getSubcommand(true)
        let guy: DBUser = await player.findOne({ user: user.id })
        if (!guy) {
            interaction.reply({ content: interaction.i18n("not_found.user"), ephemeral: true });
            return;
        }

        // check for private profile
        if (guy.settings.private && interaction.user.id !== guy.user && !await Utils.isDev(interaction) && !await Utils.isStaff(interaction) && !await Utils.isNarrator(interaction)) {
            interaction.reply({ content: interaction.i18n("no_access.private"), ephemeral: true });
            return;
        }

        switch (sub) {
            case "badges":
                var description = "";
                guy.inventory.badges.forEach((badge) => {
                    description += `[${badge.name}] - ${Utils.getDateString(badge.unlockedAt)}\n`;
                })
                description = description.length > 0 ? "```scss\n" + description + "```" : interaction.i18n("inventory.no_badges");

                let embed_badges = {
                    title: `${user.tag}: ${interaction.i18n("inventory.badges")}`,
                    description,
                    color: 5793266,
                    timestamp: new Date().toISOString(),
                }
                interaction.reply({ embeds: [embed_badges] });
                break;
            case "inventory":
                let embed_inv = {
                    title: `${user.username}: ${interaction.i18n("inventory.inventory")}`,
                    description: `**${Utils.capitalizeFirstLetter(interaction.i18n("inventory.currencies"))}**`,
                    fields: [
                        { name: Utils.capitalizeFirstLetter(interaction.i18n("inventory.coins")), value: `${guy.inventory.currencies.coins} ${Utils.getEmoji("coins", client)}`, inline: true },
                        { name: Utils.capitalizeFirstLetter(interaction.i18n("inventory.gems")), value: `${guy.inventory.currencies.gems} ${Utils.getEmoji("gems", client)}`, inline: true },
                        { name: Utils.capitalizeFirstLetter(interaction.i18n("inventory.roses")), value: `${guy.inventory.currencies.roses} ${Utils.getEmoji("rose", client)}`, inline: true },
                        {
                            name: `**${Utils.capitalizeFirstLetter(interaction.i18n("inventory.items"))}:**`, value: `${Utils.capitalizeFirstLetter(interaction.i18n("inventory.roses"))}: ${guy.inventory.items.roses} ${Utils.getEmoji("rose", client)}\n` +
                                `${Utils.capitalizeFirstLetter(interaction.i18n("inventory.bouquets"))}: ${guy.inventory.items.bouquet} ${Utils.getEmoji("bouquet", client)}\n` +
                                `${Utils.capitalizeFirstLetter(interaction.i18n("inventory.lootboxes"))}: ${guy.inventory.items.lootbox} ${Utils.getEmoji("lootbox", client)}`
                        },
                    ],
                    color: 5793266,
                    timestamp: new Date().toISOString(),
                    author: {
                        name: `${user.tag}`,
                        icon_url: user.avatarURL(),
                    }
                }
                interaction.reply({ embeds: [embed_inv] });
                break;
            case "stats":
                let data = guy.stats[interaction.options.getString("game")];
                let totalWin = 0
                let totalLoss = 0
                let fields = []
                let color = 0x00ffff
                let footer = { text: "Requested by " + interaction.user.tag }

                Object.entries(data)
                    .filter((a) => typeof a[1] == "object")
                    .forEach((team: any) => {
                        let obj = { name: Utils.capitalizeFirstLetter(team[0]), value: `Wins: ${team[1].win}\nLosses: ${team[1].lose}`, inline: true }
                        totalWin += team[1].win
                        totalLoss += team[1].lose
                        fields.push(obj)
                    })

                data.tie = data.tie ?? 0
                let total = totalLoss + totalWin + data.tie
                var description = `Win Streak: ${data.winStreak}\nGames played: ${total}\n\nTotal Wins: ${totalWin}\nTotal Losses: ${totalLoss}\nTies: ${data.tie}\nFlees: ${data.flee}\n\nWinrate: ${((totalWin / total) * 100 + "").slice(0, 5)}%`
                let title = client.users.cache.get(guy.user).tag + "'s Stats"

                let embed = { description, fields, color, title, timestamp: new Date().toISOString(), footer, thumbnail: { url: interaction.user.avatarURL() } }
                interaction.reply({ embeds: [embed] })

                break;
            case "card":
                interaction.reply({ content: "Coming soon!" })
                break;
            default:
                interaction.reply("Invalid part.");
                return;
        }
    }
});

module.exports = command;