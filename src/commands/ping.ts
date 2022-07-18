import { CommandInteraction } from "discord.js";
import { Command, ExtendedClient, ExtendedCommandInteraction } from "../config";


let command = new Command({
    commandObject: {
        name: "ping",
        description: "Pong! Returns the latency of the bot.",
    },
    run: async (interaction: ExtendedCommandInteraction, client: ExtendedClient) => {
        interaction.reply({ content: interaction.i18n("ping", { latency: client.ws.ping }) });
    }
});

module.exports = command;