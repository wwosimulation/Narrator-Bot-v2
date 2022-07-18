import { BaseInteraction, ChatInputCommandInteraction, CommandInteraction } from "discord.js";
import i18n from "../../i18n";
import { DBUser } from "../types";

export class ExtendedInteraction extends BaseInteraction {
    dbUser: DBUser;
    i18n(key: string, replaceData?: object, language?: string): string {
        return i18n(key, language ?? this.locale, replaceData);
    } 
}

export class ExtendedCommandInteraction extends ChatInputCommandInteraction {
    dbUser: DBUser;
    i18n(key: string, replaceData?: object, language?: string): string {
        return i18n(key, language ?? this.dbUser.settings.language ?? this.locale ?? "en-US", replaceData);
    } 
}