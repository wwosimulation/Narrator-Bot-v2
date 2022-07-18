import { aura, team, WOVRole } from "../types"

// Base class for all roles
class Role {
    private name: string;
    private aura: aura;
    private team: team;

    constructor(name: string, aura: aura, team: team) {
        this.name = name;
        this.aura = aura;
        this.team = team;
    }

    public getName(): string {
        return this.name;
    }

    public getAura(): aura {
        return this.aura;
    }

    public getTeam(): team {
        return this.team;
    }

    public check(): Object {
        return {
            name: this.name,
            aura: this.aura,
            team: this.team
        }
    }

    static getRoleInfo(name: string): WOVRole {
        name = name.replace(/\s+/g, "").toLocaleLowerCase();
        let roles: WOVRole[] = require("../roles.json");
        return roles.find(role => role.name.replace(/\s+/g, "").toLowerCase() === name ||
            role.aliases.find(alias => alias.replace(/\s+/g, "").toLowerCase() === name)) ?? { name: "Unknown Role", aliases: [], description: "Unable to find that role", icon: "https://cdn.discordapp.com/emojis/424929422190182422.png?v=1", aura: "unknown", team: "solo" };

    }

    static filterRoles(name: string): WOVRole[] {
        name = name.replace(/\s+/g, "").toLocaleLowerCase();
        let roles: WOVRole[] = require("../roles.json");
        let r = roles.filter(role => role.name.replace(/\s+/g, "").toLowerCase().startsWith(name) ||
            role.aliases.some(alias => alias.replace(/\s+/g, "").toLowerCase().startsWith(name)) ||
            role.name.replace(/\s+/g, "").toLowerCase().includes(name) ||
            role.aliases.some(alias => alias.replace(/\s+/g, "").toLowerCase().includes(name)));
        return r.length > 0 ? r : (name.length > 0 ? [] : roles)
    }
}

export { Role };