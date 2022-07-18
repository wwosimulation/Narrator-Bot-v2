import { Command, ExtendedClient, ExtendedCommandInteraction, WOVRole, Role, Utils } from "../config";

let command = new Command({
    commandObject: {
        name: "roleinfo",
        description: "Get information about a role.",
        options: [
            {
                type: 1,
                name: "wov",
                description: "Get information about a WOV role.",
                options: [
                    {
                        type: 3, 
                        name: "role",
                        description: "The role to get information about.",
                        required: true,
                        autocomplete: true,
                    },
                ],
            },
        ],
    },
    run: async (interaction: ExtendedCommandInteraction, client: ExtendedClient) => {
        switch(interaction.options.getSubcommand(true)) {
            case "wov":
                var role: WOVRole = Role.getRoleInfo(interaction.options.getString("role"));
                var embed = {
                    title: role.name,
                    description: role.description,
                    fields: [
                        { name: "Aura", value: Utils.capitalizeFirstLetter(role.aura), inline: true },
                        { name: "Team", value: Utils.capitalizeFirstLetter(role.team), inline: true },
                        { name: "Aliases", value: role.aliases.length > 0 ? role.aliases.join(", ") : "*No aliases*", inline: true },
                    ],
                    thumbnail: {
                        url: role.icon,
                    },
                    timestam: new Date().toISOString(),
                    color: 0x5865F2,
                };
                interaction.reply({ embeds: [embed] });
                break;
            default:
                interaction.reply({ content: interaction.i18n("error.unknown") });
        }


    }
});


module.exports = command;