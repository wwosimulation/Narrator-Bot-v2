import { client } from "../server";
import { ExtendedInteraction } from "../config/classes/extendedInteraction";
import Utils from "../config/Utils";
import player from "../schemas/player";
import i18n from "../i18n";
import { InteractionType } from "discord.js";

export = {
    name: "interactionCreate",
    run: async (interaction: ExtendedInteraction) => {

        interaction.i18n = (key: string, replaceData = {}, language = interaction?.dbUser?.settings?.language ?? "en-US"): string => {
            if(!language) language = "en-US";
            let string = i18n(key, language, replaceData);
            return string
        }
        interaction.dbUser = await player.findOne({ user: interaction.user.id });
        if (!interaction.dbUser) {
            let locale = interaction.locale ?? "en-US";
            if(!require("../i18n/allLangs").includes(locale)) locale = "en-US";
            interaction.dbUser = await player.create({ user: interaction.user.id, "settings.language": locale }).then((player) => {
                interaction.user.send({ content: interaction.i18n("welcome", { botName: interaction.client.user.username, langauage: locale }, locale) });
                return player;
            });
        }

        // splitting events up
        if (interaction.isChatInputCommand()) {
            let file = client.commands.get(interaction.command.name);

            // check if the user is allowed to use the command
            if (file.beta && !await Utils.isBeta(interaction)) {
                interaction.reply({ content: interaction.i18n("no_access.beta"), ephemeral: true });
                return;
            }
            if (file.devOnly && !Utils.isDev(interaction.user)) {
                interaction.reply(interaction.i18n("noAcccess.dev"));
                return;
            }
            if (file.gameOnly && !Utils.isInGame(interaction.user)) {
                interaction.reply(interaction.i18n("no_access.game"));
                return;
            }

            file.run(interaction, client);
        } else if (interaction.type === 4) { // Autocomplete
            // autocomplete
            // do something
        } else if (interaction.isButton()) {
            // button
            // do something
        } else if (interaction.isMessageContextMenuCommand()) {
            // context menu
            // do something
        } else if (interaction.type === 5) { // ModalSubmit
            // modal submit
            // do something
        }
    }
}