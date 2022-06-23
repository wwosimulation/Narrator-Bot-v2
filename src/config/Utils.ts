/*
This file is for all functions we need to use in the project.
The usage is other files the following:
>   import { Utils } from "[path]/Utils"
>   ...
>   Utils.[function name](...[arguments])

Utils form the discord.js library are used like this:
>   Utils.util.[function name](...[arguments])

To create new functions you need the keyword *static* infornt of the method. 
This means that the function is not a method of the class but a static function 
and can be used without creating an instance of the class:
>   static [function name](...[arguments]): [type] {...}

*/


import { Interaction, User, Util } from "discord.js";
import players from "../schemas/player";
import { client } from "../server";

// Types
import { UserResolvables } from "./types";

class Utils {
    static util = Util;
    private constructor() { }

    // Check if a user is in the beta group
    static async isBeta(user: UserResolvables): Promise<boolean> {
        let userId = this.resolveUserId(user);
        if(!userId) return false;
        let player = await players.findOne({ user: userId });
        if (player?.badges?.includes("beta")) return true;
        else return false;
    }

    // Get the user id from a user
    static resolveUserId(user: UserResolvables): string {
        if (user instanceof User) {
            return user.id;
        } else if (user instanceof Interaction) {
            return user.user.id;
        } else {
            // Typeof User is string
            let target = client.users.resolve(user) ??
                client.users.cache.find(u => u.tag === user) ??
                client.users.cache.find(u => u.username === user);

            if (!target) throw new Error(`Could not resolve user ${user}`);
            return target.id;
        }
    }

}