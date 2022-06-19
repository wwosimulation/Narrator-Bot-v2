import { ChatInputApplicationCommandData, PermissionResolvable } from "discord.js"

export = class Command {
    name: String
    run: Function
    beta: Boolean
    permissions: Array<PermissionResolvable>
    constructor(object: {commandObject: ChatInputApplicationCommandData, run: Function, beta?: Boolean, permissions?: Array<PermissionResolvable>}) {
        this.name = object.commandObject.name
        this.run = object.run
        this.beta = object.beta ?? false
        this.permissions = object.permissions ?? []
    }
}