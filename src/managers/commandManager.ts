import { readdirSync} from "fs";
import { client } from "../server";

let commandsPath = __dirname + "/../commands/";
let commandFiles = readdirSync(commandsPath).filter((file: string) => file.endsWith(".ts"));

commandFiles.forEach((file: string) => {
    let filePath = commandsPath + "/" + file;
    let command = require(filePath);
    console.log(command)
    client.commands.set(command.name, command);
});