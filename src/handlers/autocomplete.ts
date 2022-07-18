import { readdirSync } from "fs";
import { client } from "../server";

// Get AutoCompletes
let autoPath = __dirname + "/../autocompletes/";
let autoFile = readdirSync(autoPath).filter((file: string) => file.endsWith(".ts"));

autoFile.forEach((file: string) => {
    let filePath = autoPath + "/" + file;
    let auto = require(filePath);
    client.autocompletes.set(auto.name, auto);
});