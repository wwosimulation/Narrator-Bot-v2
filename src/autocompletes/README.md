# Autocomplete Syntax
Every autocomplete file in this folder should follow a special synatx so the autocompletes get executed correctly.

## Head
Each autocomplete file should start with the basic imports.
```ts
import { AutocompleteInteraction } from "discord.js";
import { ExtendedClient, AutoComplete } from "../config";
```
You might also add other imports if needed.

## Body
We start by creating a new `AutoComplete` which takes multiple parameters.
```ts
let autocomplete = new AutoComplete({
    autocompleteObject: {
        name: "",
        run: async (interaction: AutocompleteInteraction, client: ExtendedClient) => {
            interaction.respond([]);
        }
    }
});
```
The `name` is the slash command name which is used to trigger the autocomplete. And the `run` function is the function which is executed when the autocomplete is triggered.

In the end we are just exporting the whole object using `module.exports`
```ts
module.exports = autocomplete;
```

## Template
```ts
import { AutocompleteInteraction } from "discord.js";
import { ExtendedClient, AutoComplete } from "../config";

let autocomplete = new AutoComplete({
    autocompleteObject: {
        name: "",
        run: async (interaction: AutocompleteInteraction, client: ExtendedClient) => {
            interaction.respond([]);
        }
    }
});

module.exports = autocomplete
```