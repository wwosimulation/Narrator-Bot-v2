import { Role } from "discord.js";
import { ExtendedClient } from "./classes/client";
import Command = require("./classes/command");
import { ExtendedInteraction, ExtendedCommandInteraction } from "./classes/extendedInteraction";
import { DBUser, Interactions, UserResolvables, aura, team } from "./types";
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
    Role
}

// Types
export {
    DBUser,
    Interactions,
    UserResolvables,
    aura,
    team
}