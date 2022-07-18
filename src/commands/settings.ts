import { ButtonInteraction, InteractionCollector, SelectMenuInteraction } from "discord.js";
import { Command, DBUser, ExtendedClient, ExtendedCommandInteraction, Utils } from "../config";
import player from "../schemas/player";

let _settings = [
    {
        name: "language",
        db: "language",
        title: "In what language would you like the bot to answer?",
        description: "The bot supports multiple languages. Everything that is not translated yet will be in English.\nThe bot automatically detected your language. If you used an unsupported language, the bot set it to `English (US)`.",
        type: 3, // "STRING"
        default: "en-US",
        possible: require("../i18n/allLangs")
    }, {
        name: "privacy",
        db: "private",
        title: "Should your profile be private?",
        description: "If you set this to `true`, your profile will be hidden from other users.\nIf you set this to `false`, your profile will be visible to other users.",
        type: "boolean",
        default: false,
    }
]

let command = new Command({
    commandObject: {
        name: "settings",
        description: "Change your settings.",
        options: [
            {
                type: 1, // "SUB_COMMAND"
                name: "edit",
                description: "Edit your settings.",
                options: [
                    {
                        type: 3, // "STRING"
                        name: "setting",
                        description: "The setting to edit.",
                        required: true,
                        choices: [
                            { name: "language", value: "language" },
                            { name: "privacy", value: "private" },
                        ]
                    },
                ]
            },
            {
                type: 1, // "SUB_COMMAND"
                name: "view",
                description: "View your settings.",
            }
        ],
    },
    run: async (interaction: ExtendedCommandInteraction, client: ExtendedClient) => {
        let sub = interaction.options.getSubcommand(true)

        // create embeds for each setting
        let settingEmbeds = _settings.map((s, i) => {
            return {
                title: s.title,
                description: s.description,
                fields: [
                    {
                        name: "Current value",
                        value: `${interaction.dbUser.settings[s.db] ?? s.default}`,
                        inline: true,
                    },
                    {
                        name: "Default value",
                        value: `${s.default}`,
                        inline: true,
                    }
                ],
                color: 0x5865F2,
                footer: {
                    text: "Page " + (i + 1) + " of " + _settings.length,
                }
            }
        })

        switch (sub) {
            case "edit":
                let setting = _settings.find(s => s.db == interaction.options.getString("setting"));
                if (!setting) {
                    interaction.reply({ content: interaction.i18n("not_found.setting") });
                    return;
                }


                let allData = _settings.map((s, i) => {
                    var edit_embed = settingEmbeds[i];
                    var row = {
                        type: 1,
                        components: []
                    }
                    var dropdown = {
                        type: 3,
                        custom_id: "settings_" + interaction.user.id + "_" + s.db,
                        options: []
                    }
                    // make buttons for each setting
                    if (s.type == "boolean") {
                        row.components.push({
                            type: 2,
                            label: "True",
                            custom_id: "settings_" + interaction.user.id + "_" + s.db + "_true",
                            style: interaction.dbUser.settings[s.db] == true ? 1 : 2,
                        }, {
                            type: 2,
                            label: "False",
                            custom_id: "settings_" + interaction.user.id + "_" + s.db + "_false",
                            style: interaction.dbUser.settings[s.db] == false ? 1 : 2,
                        })
                    }
                    else {
                        let possible = Utils.getPossibleValues(s)
                        possible.forEach(p => {
                            dropdown.options.push({
                                label: p.name,
                                value: p.value,
                                emoji: p.emoji || null,
                                default: interaction.dbUser.settings[s.db] == p.value,
                            });
                        });
                    }
                    if (dropdown.options.length > 0) {
                        row.components.push(dropdown);
                    }

                    return {
                        embed: edit_embed,
                        components: [row],
                    }

                });
                await interaction.deferReply();
                let y = await interaction.editReply({ embeds: [allData[_settings.findIndex(s => s.db == interaction.options.getString("setting"))].embed] });
                Utils.buttonPaginator(interaction, allData, _settings.findIndex(s => s.db == interaction.options.getString("setting")), 30_000);

                let coll = new InteractionCollector(client, { message: y, filter: (i: ButtonInteraction | SelectMenuInteraction) => i.customId.startsWith("settings_") });
                coll.on("collect", async (int: ButtonInteraction | SelectMenuInteraction) => {
                    console.log(int.customId);
                    let value = null
                    let se: any;

                    se = _settings.find(s => s.db == int.customId.split("_")[2]);
                    if (int instanceof ButtonInteraction) {
                        if (int.customId.endsWith("true")) {
                            value = true;
                        } else if (int.customId.endsWith("false")) {
                            value = false;
                        }
                    } else if (int instanceof SelectMenuInteraction) {
                        value = int.values[0]
                    }
                    let sett = {}
                    sett["settings." + se.db] = value;
                    await player.updateOne({ user: interaction.user.id }, { $set: sett })
                    let old = interaction.dbUser.settings[se.db];
                    let new_: DBUser = await player.findOne({ user: interaction.user.id })
                    int.reply({ content: interaction.i18n("settings.updated", { setting: se.name, new: new_.settings[se.db], old: old }, new_.settings.language), ephemeral: true });

                });
                break;
            case "view":
                await interaction.deferReply();
                Utils.buttonPaginator(interaction, settingEmbeds.map(e => { return { embed: e } }), 0);
                break;
        }
    }
});


module.exports = command;