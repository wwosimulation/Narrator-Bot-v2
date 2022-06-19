import { client } from "../server";
import { readdirSync} from "fs";

let eventsPath = __dirname + "/../events/";
let eventFiles = readdirSync(eventsPath).filter((file: string) => file.endsWith(".ts"));

for (let file of eventFiles) {
	let filePath = eventsPath + "/" + file;
	let event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args: any) => event.run(...args));
	} else {
		client.on(event.name, (...args: any) => event.run(...args));
	}
}
