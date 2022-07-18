/*
Any custom types used in this project can be added here.
Export them in the following way:
>   export type [type name] = [type definition]

And use them in the following way:
>   import { [type name] } from "[path]/types"
*/

import { BaseInteraction, User, UserResolvable } from "discord.js";
import { ExtendedInteraction, ExtendedCommandInteraction } from ".";

export type Interactions = BaseInteraction | ExtendedInteraction | ExtendedCommandInteraction;
export type UserResolvables = User | UserResolvable | string | Interactions;
export type aura = "evil" | "good" | "unknown";
export type team = "village" | "werewolves" | "solo killer" | "solo voting" | "sect" | "zombies" | "couple" | "solo";
export interface DBUser {
    user: string; inventory: {
        currencies: { coins: number; roses: number; gems: number; }; items: { bouquet: number; lootbox: number; roses: number; other: Array<{ name: string; amount: number }>; }; badges: Array<{ name: string; unlockedAt: Date }>; privateChannel?: string; customRole?: string; autoReact: boolean; daily: { last?: Date; day: number; };
    };
    profile: { xp: number; level: number; unlocked: boolean; description?: string; icon?: string; createdAt: Date; };
    stats: { wov: { tie: number; flee: number; winStreak: number; village: { win: number; lose: number; }; werewolf: { win: number; lose: number; }; couple: { win: number; lose: number; }; sect: { win: number; lose: number; }; zombie: { win: number; lose: number; }; bandit: { win: number; lose: number; }; solovoting: { win: number; lose: number; }; solokiller: { win: number; lose: number; }; }; salem: object; }; 
    settings: { language: string; private: boolean; };
    moderation: {
        warns: Array<{ date: Date; reason: string; moderator: string }>; ban: { date: Date; reason: string; moderator: string; };
    };
}