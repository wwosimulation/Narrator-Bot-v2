console.log("Booting bot...");
require("dotenv").config();

import * as db from "quick.db";
import * as Sentry from "@sentry/node";
import { ExtendedClient } from "./config";

if(db.get("emergencystop")) {
    setTimeout(() => {
        console.log("Emergency stop detected, exiting...");
        process.exit(0);
    }, 5000);
}

let client = new ExtendedClient();

require("./handlers/events");
require("./db");

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
});

client.login(process.env.DISCORD_TOKEN);

export { client };