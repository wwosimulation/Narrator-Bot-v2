import { ChatInputApplicationCommandData, PermissionResolvable } from "discord.js"

export = class Command {
    name: String
    run: Function
    beta: Boolean
    permissions: Array<PermissionResolvable>
    commandObject: ChatInputApplicationCommandData
    guildOnly: Boolean
    gameOnly: Boolean
    constructor(object: {commandObject: ChatInputApplicationCommandData, run: Function, beta?: Boolean, permissions?: Array<PermissionResolvable>, guildOnly?: Boolean, gameOnly?: Boolean}) {
        this.name = object.commandObject.name
        this.run = object.run
        this.beta = object.beta ?? false
        this.permissions = object.permissions ?? []
        this.commandObject = object.commandObject
        this.guildOnly = object.guildOnly ?? false
        this.gameOnly = object.gameOnly ?? false
    }
}