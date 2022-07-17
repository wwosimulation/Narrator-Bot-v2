import { readdirSync } from "fs";
import * as stringTemplate from "string-template";


let languages = {}

const languageFiles = readdirSync(__dirname).filter((file) => file.endsWith(".json") && !file.startsWith("package"))
for (const file of languageFiles) {
    const language = require(`./${file}`)
    languages[`${file.split(`.`).shift()}`] = language
}

Object().filter = (obj, predicate) =>
    Object.keys(obj)
        .filter((key) => predicate(obj[key]))
        .reduce((res, key) => ((res[key] = obj[key]), res), {})

export default (key: string, language: string, replaceData = {}) => {
    let chosenL = languages[language]
    if (!chosenL) chosenL = languages["en-US"]
    let string = getSubString(key, chosenL) ?? null
    if (!string) string = getSubString(key, languages["en-US"])
    if (!string) return "N/A"
    string = stringTemplate(string, replaceData)
    return string
}


function getSubString(key: string, lang: JSON) {
    let current = lang
    let search = true
    while(key.includes(".") && search) {
        let split = key.split(".")
        current = current[split[0]]
        key = split.slice(1).join(".")
        if(typeof current != "object" || typeof current[key] == "string") {
            search = false
        }
    }
    return current?.[key]
}