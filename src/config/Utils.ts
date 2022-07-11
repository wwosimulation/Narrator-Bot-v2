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


import { Collection, Emoji, Interaction, Message, MessageActionRow, MessageButton, Snowflake, User, Util } from "discord.js";
import players from "../schemas/player";
import { client, ExtendedClient } from "../server";

// Types
import { UserResolvables } from "./types";

class Utils {
    static util = Util;
    private constructor() { }
    static months: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

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

    // Check if a user is in the beta group
    static async isBeta(user: UserResolvables): Promise<boolean> {
        let userId = this.resolveUserId(user);
        if (!userId) return false;
        let player = await players.findOne({ user: userId });
        if (player?.badges?.includes("beta")) return true;
        else return false;
    }

    static async isDev(user: UserResolvables): Promise<boolean> {
        let userId = this.resolveUserId(user);
        if (!userId) return false;
        let player = await players.findOne({ user: userId });
        if (player?.badges?.some((element: string) => /dev/g.test(element))) return true;
        else return false;
    }

    static async isStaff(user: UserResolvables): Promise<boolean> {
        let userId = this.resolveUserId(user);
        if (!userId) return false;
        let player = await players.findOne({ user: userId });
        if (player?.badges?.includes("staff")) return true;
        else return false;
    }

    static async isNarrator(user: UserResolvables): Promise<boolean> {
        let userId = this.resolveUserId(user);
        if (!userId) return false;
        let player = await players.findOne({ user: userId });
        if (player?.badges?.some((element: string) => /narrator/g.test(element))) return true;
        else return false;
    }

    static sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    static getEmoji(name: string, client: ExtendedClient): Emoji {
        return client.emojis.cache.find(emoji => emoji.name.toLowerCase() == name.toLowerCase() && emoji.available) ?? client.emojis.cache.find(emoji => emoji.name.toLowerCase() == "error")
    }

    static capitalizeFirstLetter(string: string): string {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    static capitalizeAll(string: string): string {
        return string.split(" ").map(word => this.capitalizeFirstLetter(word)).join(" ");
    }

    static randomWeight(options: Object[]): Snowflake {
        let i = 0;
        let weights = [];
        for (i = 0; i < options.length; i++) {
            weights[i] = (Object.values(options[i])) + (weights[i - 1] ?? 0);
        }

        let random = Math.floor(Math.random() * weights[weights.length - 1]);
        for (i = 0; i < weights.length; i++) {
            if (random < weights[i]) break;
        }
        return Object.keys(options[i])[0]
    }

    static disableButtons(message: Message) {
        message.components.forEach(component => {
            component.components.forEach(button => {
                button.setDisabled(true);
            });
        });

        return {
            content: message.content ||  null,
            embeds: message.embeds || [],
            components: message.components || []
        };
    }

    static getDateString(date: Date): string {
        // add st, nd, rd etc to the end of the day
        let day = date.getUTCDate();
        let suffix = "th";
        if (day < 4 || day > 20) {
            switch (day % 10) {
                case 1:
                    suffix = "st";
                    break;
                case 2:
                    suffix = "nd";
                    break;
                case 3:
                    suffix = "rd";
                    break;
                default:
                    suffix = "th";
                    break;
            }
        }
        return `${date.getUTCDate()}${suffix} ${this.months[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
    }
}

export default Utils;
export { Utils };