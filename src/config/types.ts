/*
Any custom types used in this project can be added here.
Export them in the following way:
>   export type [type name] = [type definition]

And use them in the following way:
>   import { [type name] } from "[path]/types"
*/

import { Interaction, User, UserResolvable } from "discord.js";

export type UserResolvables = User | UserResolvable | string | Interaction;
export type aura = "evil" | "good" | "unknown";
export type team = "village" | "werewolves" | "solo killer" | "solo voting" | "sect" | "zombies" | "couple" | "solo";