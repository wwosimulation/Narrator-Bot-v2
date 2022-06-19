import { Interaction } from "discord.js";
import { client } from "../server";


export = {
    name: "interactionCreate",
    run: async (interaction: Interaction) => {
        // splitting events up
        if(interaction.isApplicationCommand()) {
            let file = client.commands.get(interaction.command.name);
            file.run(interaction, client);
        } else if (interaction.isAutocomplete()) {
            // autocomplete
            // do something
        } else if (interaction.isButton()) {
            // button
            // do something
        } else if (interaction.isContextMenu()) {
            // context menu
            // do something
        } else if (interaction.isModalSubmit()) {
            // modal submit
            // do something
        }
    }
}