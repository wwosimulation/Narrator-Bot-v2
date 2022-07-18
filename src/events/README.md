# Events
Every TypeScript file in this folder is considered as event file and should follow a special synatx so the events get executed correctly.

## Head
Each event file should start with the basic imports.
```ts
import { client } from "../server";
```
These are very likely do be way more and differnt from the other files.

## Body
The event files start directly with the `export` keyword which is used to export the event object. It consists of a `name` and a `run` function:
```ts
export = {
    name: "",
    run: async (...parameters?: any) => {
        // Code
    }
}
```

## Template
```ts
import { client } from "../server";

export = {
    name: "",
    run: async (...parameters?: any) => {
        // Code
    }
}
```