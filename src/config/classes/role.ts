import { aura, team } from "../types"

// Base class for all roles
class Role {
    private name: string;
    private aura: aura;
    private team: team;
    aliases: string[];

    constructor(name: string, aura: aura, team: team) {
        this.name = name;
        this.aura = aura;
        this.team = team;
        console.log(`Created role ${name}`);
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
}
