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
import * as mongoose from "mongoose";


mongoose.connect(process.env.MONGODB, {}).then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.log("Error connecting to MongoDB");
    console.log(err);
});

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
