const os = require('os');

const log = require("./config/log")("main");
const config = require("./config/config");
const database = require("./config/database");
const express = require("./config/express");
const server = require("./config/server");
const queueCleander = require("./core/queueCleaner");


async function main() {

    log.info(`Configuration loaded for "${config("NODE_ENV")}" environment. App port is ${config("PORT")}`);

    log.info("Connecting to database...");
    await database.init()

    log.info("Creating express app...");
    let app = await express.init();

    log.info("Run http server...");
    await server.init(app);

    log.info("Queue cleaner started...");
    await queueCleander.start();

    log.info("Application startup is done.");
}

module.exports = main()
    .catch(err => log.error(err));

