import { Command, ExtendedClient, ExtendedCommandInteraction } from "../config";

let command = new Command({
    commandObject: {
        name: "version",
        description: "Get all information about the bot's current version",
    },
    run: async (interaction: ExtendedCommandInteraction, client: ExtendedClient) => {
        // Get the version of the bot
        let version = {
            branch: client.info.branch,
            commit: client.info.commit,
            uptime: client.uptime,
            version: require(process.cwd() + "/package.json").version,
            commitMessage: require("child_process").execSync("git log -1 --pretty=%B").toString().trim(),
        }

        // Create an embed with the version information
        let embed = {
            title: "Version Information",
            fields: [
                { name: "Version", value: version.version },
                { name: "Branch", value: version.branch },
                { name: "Commit (use this for bug reports)", value: version.commit},
                { name: "Commit Message", value: version.commitMessage },
                { name: "Uptime", value: `<t:${((Date.now() - client.uptime)/1000).toFixed()}:R>` },                
            ],
            timestamp: new Date().toISOString(),
            color: 5793266 // Blurple
        }
        interaction.reply({ embeds: [embed] });
    }
});



module.exports = command;