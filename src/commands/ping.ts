import { CommandInteraction } from "discord.js";
import Command = require("../config/classes/command");
import { ExtendedClient } from "../server";

let command = new Command({
    commandObject: {
        name: "ping",
        description: "Pong! Returns the latency of the bot.",
    },
    run: async (interaction: CommandInteraction, client: ExtendedClient) => {
        interaction.reply({content: `Pong! ${client.ws.ping}ms`});
    }
});

module.exports = command;