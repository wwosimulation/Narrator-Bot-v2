import { AutocompleteInteraction } from "discord.js";
import { ExtendedClient, WOVRole, Role, AutoComplete } from "../config";

let auto = new AutoComplete({
    name: "roleinfo",
    run: async (interaction: AutocompleteInteraction, client: ExtendedClient) => {
        switch (interaction.options.getSubcommand(true)) {
            case "wov":
                var role = interaction.options.getString("role");
                var filtered: WOVRole[] = Role.filterRoles(role)
                var res = [];
                filtered.forEach(role => {
                    if (res.length < 25) {
                        res.push({ name: role.name, value: role.name });
                    }
                });
                interaction.respond(res);
                break;
            default:
                interaction.respond([]);
                break;
        }
    },
});

module.exports = auto;