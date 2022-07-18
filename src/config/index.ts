import { ExtendedClient } from "./classes/client";
import { AutoComplete, Command } from "./classes/command";
import { ExtendedInteraction, ExtendedCommandInteraction } from "./classes/extendedInteraction";
import { Role } from "./classes/role";
import { DBUser, Interactions, UserResolvables, aura, team, WOVRole } from "./types";
import { Utils } from "./Utils";

let github = {
    appId: 120523,
    installationId: 17541999,
    owner: "wwosimulation",
    repo: "Narrator-Bot-v2",
}

export { github };

// Classes
export {
    Utils,
    ExtendedClient,
    ExtendedInteraction,
    ExtendedCommandInteraction,
    Command,
    Role,
    AutoComplete,
}

// Types
export {
    Interactions,
    UserResolvables,
    aura,
    team
}

// Interfaces
export {
    DBUser,
    WOVRole
}