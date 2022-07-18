/*
This file is for all functions we need to use in the project.
The usage is other files the following:
>   import { Utils } from "[path]/Utils"
>   ...
>   Utils.[function name](...[arguments])

To create new functions you need the keyword *static* infornt of the method. 
This means that the function is not a method of the class but a static function 
and can be used without creating an instance of the class:
>   static [function name](...[arguments]): [type] {...}

*/

import { BaseInteraction, ButtonInteraction, Emoji, GuildMember, InteractionCollector, Message, Snowflake, ThreadMember, User } from "discord.js";
import { ExtendedCommandInteraction, ExtendedClient } from ".";
import i18n from "../i18n";
import players from "../schemas/player";
import { client } from "../server";

// Types
import { DBUser, UserResolvables } from "./types";

class Utils {
    static months: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    static allLanguages: Array<any> = require("../i18n/allLangs")

    // Get the user id from a user
    static resolveUserId(user: UserResolvables): string {
        if (user instanceof User || user instanceof ThreadMember || user instanceof GuildMember) {
            return user.id;
        } else if (user instanceof BaseInteraction) {
            return user.user.id;
        } else if (user instanceof Message) {
            return user.author.id;
        } else {
            // Typeof User is string
            let target = client.users.resolve(user) ??
                client.users.cache.find(u => u.tag === user) ??
                client.users.cache.find(u => u.username === user);

            if (!target) throw new Error("not_found.user");
            return target.id;
        }
    }

    // check if a object of the type DBUser has a badge
    static async hasBadge(user: UserResolvables, badge: string): Promise<boolean> {
        let dbUser: DBUser = await players.findOne({ user: this.resolveUserId(user) });
        if (!dbUser) return false;
        var has = false;
        dbUser.inventory.badges.forEach((b) => {
            if (b.name.toLowerCase() === badge.toLocaleLowerCase()) has = true;
        });
        return has;
    }

    // Check if a user is in the beta group

    static async isBeta(user: UserResolvables): Promise<boolean> {
        return this.hasBadge(user, "beta");
    }

    static async isDev(user: UserResolvables): Promise<boolean> {
        return this.hasBadge(user, "dev");
    }

    static async isStaff(user: UserResolvables): Promise<boolean> {
        return this.hasBadge(user, "staff");
    }

    static async isNarrator(user: UserResolvables): Promise<boolean> {
        let userId = this.resolveUserId(user);
        if (!userId) return false;
        let player: DBUser = await players.findOne({ user: userId });
        if (player.inventory.badges.some((element) => /narrator/g.test(element.name))) return true;
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

    static disableButtons(message: Message | any) {
        message.components.forEach(component => {
            component.components.forEach(button => {
                button.disabled = true;
            });
        });

        return {
            content: message.content || null,
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

    /**
     * 
     * @todo These functions
     */
    static isInGame(user: UserResolvables): Boolean {
        return false
    }

    static getPossibleValues(setting: any) {
        switch (setting.name) {
            case "language":
                return this.allLanguages.map(lang => {
                    return {
                        name: lang.name,
                        value: lang.code,
                        emoji: lang.emoji
                    }
                });
            default:
                return [];
        }
    }

    static async buttonPaginator(interaction: ExtendedCommandInteraction, data: { embed: any, components?: any }[], page: number = 0, idle = 10000) {
        let activeRow = { type: 1, components: [] };
        let embed = data[page].embed;
        let componentRow = data?.[page].components ? [...data[page].components] : [];

        activeRow.components.push(
            { type: 2, style: 3, emoji: "⏪", custom_id: "paginator_begin" },
            { type: 2, style: 3, emoji: "◀", custom_id: "paginator_previous" },
            { type: 2, style: 3, emoji: "▶", custom_id: "paginator_next" },
            { type: 2, style: 3, emoji: "⏩", custom_id: "paginator_end" }
        )
        componentRow.push(activeRow);

        let x = await interaction.editReply({ embeds: [embed], components: componentRow });

        let coll = new InteractionCollector(client, { componentType: 2, idle: 10000, message: x, filter: (i:ButtonInteraction) => i.customId.startsWith("paginator_") });
        coll.on("collect", async (collected: ButtonInteraction) => {
            //if(!collected.isButton()) return;
            if (collected.user.id != interaction.user.id) {
                collected.reply({content: await this.i18n("no_access.paginator", collected.user.id), ephemeral: true});
            }
            let edited
            if(collected.message[collected.message instanceof Message ? "editedAt" : "edited_timestamp"] > (edited || 0)) return;
            switch (collected.customId) {
                case "paginator_begin":
                    page = 0;
                    break;
                case "paginator_previous":
                    if (page != 0) page--;
                    else page = data.length - 1;
                    break;
                case "paginator_next":
                    if (page != data.length - 1) page++;
                    else page = 0;
                    break;
                case "paginator_end":
                    page = data.length - 1;
                    break;
            }
            await collected.update({ embeds: [data[page].embed], components: componentRow.length == 1 ? componentRow : [...data[page].components, activeRow] });
            edited = Date.now();
        })
        coll.on("end", async () => {
            interaction.editReply(this.disableButtons(await interaction.fetchReply()));
            return;
        })
    }

    static async i18n(key: string, userId: string, replaceData?: object): Promise<string> {
        let p: DBUser = await players.findOne({ user: userId })
        let lang = p?.settings?.language ?? "en-US";
        return i18n(key, lang, replaceData);
    }
}

export default Utils;
export { Utils };
