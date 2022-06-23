/*
Copyright Shadow Development, April 2020
This script gets all the js files in the schemas folder
and maps each of them as a database schema.
These schemas are then exported from this file in an object.

Usage: 

const { botban } = require("./db.ts")
let ban = await botban.findOne({user: message.author.id}).exec()
message.channel.send(ban)

*/

import { readdirSync } from "fs"
import * as db from "quick.db";



//mongoose.connect(process.env.MONGODB, {})

module.exports = {}

let routeFiles = readdirSync(__dirname + "/schemas").filter((file: string) => file.endsWith(".ts"))
for (let file of routeFiles) {
    let route = require(`./schemas/${file}`)
    module.exports[`${file.split(`.`).shift()}`] = route
}

Object().filter = (obj, predicate) =>
    Object.keys(obj)
        .filter((key) => predicate(obj[key]))
        .reduce((res, key) => ((res[key] = obj[key]), res), {})

let x = { index: -1 }
setTimeout(async () => {
    x = db.get("gamewarnIndex") || (await module.exports.gamewarn.findOne({}).sort({ index: -1 }))
    await db.set("gamewarnIndex", x.index)
}, 1000)
