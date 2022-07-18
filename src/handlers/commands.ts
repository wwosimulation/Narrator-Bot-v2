import { ApplicationCommand, Guild, Collection } from "discord.js";
import { readdirSync } from "fs";
import { Command } from "../config/classes/command";
import { client } from "../server";

// Get commands
let commandsPath = __dirname + "/../commands/";
let commandFiles = readdirSync(commandsPath).filter((file: string) => file.endsWith(".ts"));

commandFiles.forEach((file: string) => {
    let filePath = commandsPath + "/" + file;
    let command = require(filePath);
    client.commands.set(command.name, command);
});

// Update command list
client.commands.each((command: Command) => {
    client.application.commands.fetch().then((cmds: Collection<string, ApplicationCommand>) => {
        let cmd = cmds.find((cmd: ApplicationCommand) => cmd.name === command.name);
        // create command if it doesn't exist
        if (!cmd) {
            if (command.guildOnly) {
                client.guilds.cache.each((guild: Guild) => {
                    guild.commands.create(command.commandObject);
                });
            } else {
                client.application.commands.create(command.commandObject);
            }
            console.log(`Created command ${command.name}`);
        }
        // edit command if it does exist
        else {
            if (!cmd.equals(command.commandObject)) {
                // edit command
                if (command.guildOnly) {
                    client.guilds.cache.each((guild: Guild) => {
                        guild.commands.cache.find((cmd: ApplicationCommand) => cmd.name === command.name).edit(command.commandObject);
                    });
                } else {
                    client.application.commands.cache.find((cmd: ApplicationCommand) => cmd.name === command.name).edit(command.commandObject);
                }
                console.log(`Edited command ${command.name}`);
            }
        }
    });
});
// Delete commands that aren't in the command list (global)
client.application.commands.fetch().then((commands: Collection<string, ApplicationCommand>) => {
    commands.each((command: ApplicationCommand) => {
        if (!client.commands.has(command.name)) {
            command.delete().then((cmd: ApplicationCommand) => {
                console.log(`Deleted command ${cmd.name} (global)`);
            });
        }
    });
});
// Delete commands that aren't in the command list (guild)
client.guilds.cache.each((guild: Guild) => {
    guild.commands.fetch().then((commands: Collection<string, ApplicationCommand>) => {
        commands.each((command: ApplicationCommand) => {
            if (!client.commands.has(command.name)) {
                command.delete().then((cmd: ApplicationCommand) => {
                    console.log(`Deleted command ${cmd.name} in ${guild.name} (${guild.id})`);
                });
            }
        });
    })
});