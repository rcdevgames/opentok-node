const fs = require('fs');

if (!fs.existsSync('./node_modules')) {
    throw new Error("Please run `npm install or yarn` first!");
}

if (!fs.existsSync('./.env')) {
    throw new Error("Please file .env not found, please create once from .env.example");
}
