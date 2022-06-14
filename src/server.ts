console.log("Booting bot...");
require("dotenv").config();

import db = require("quick.db");

if(db.get("emergencystop")) {
    setTimeout(() => {
        console.log("Emergency stop detected, exiting...");
        process.exit(0);
    })
}