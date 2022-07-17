module.exports = []
import { readdirSync } from "fs";

const languageFiles = readdirSync(__dirname).filter((file) => file.endsWith(".json") && !file.startsWith("package"))
for (const file of languageFiles) {
    module.exports.push({code:`${file.split(`.`).shift()}`, name: require(`./${file}`)._meta.name, emoji: require(`./${file}`)._meta.emoji})
}
Object().filter = (obj, predicate) =>
    Object.keys(obj)
        .filter((key) => predicate(obj[key]))
        .reduce((res, key) => ((res[key] = obj[key]), res), {})
