# Command Syntax
Every slash comman file in this folder should follow a special synatx so the slash command handler is able to create, update and delete commands. 

## Head
Each command file should start with the basic imports.
```ts
import { CommandInteraction } from "discord.js";
import Command = require("../config/classes/command");
import { ExtendedClient } from "../server";
```
You might also add other imports if needed.


## Body 
We start by creating a new `Command` which takes multiple parameters.
```ts
let command = new Command({
    commandObject: {
        name: "ping",
        description: "Pong! Returns the latency of the bot.",
    },
```
The parameter commandObject is the resolvable for Discord for the SlashCommandObject.

There are also optional parameters defining who is able to use the commands or where they are created.
```ts
    guildOnly: true, // Creates guild commands
    devOnly: true,
    staffOnly: true
    betaOnly: true,
```

We also need to execute some code after an interaction was created. Therefore we use a `run` fuction with a `CommandInteraction` and the `client` as parameters.
```ts
    run: async (interaction: CommandInteraction, client: ExtendedClient) => {
        interaction.reply({content: `Pong! ${client.ws.ping}ms`});
    }
});
```
In the end we are just exporting the whole object using `module.exports`
```ts
module.exports = command;
```

## Template
```ts
import { CommandInteraction } from "discord.js";
import Command = require("../config/classes/command");
import { ExtendedClient } from "../server";

let command = new Command({
    commandObject: {
        name: "",
        description: "",
    },
    run: async (interaction: CommandInteraction, client: ExtendedClient) => {
        interaction.reply({content: ""});
    }
});


module.exports = command;
```