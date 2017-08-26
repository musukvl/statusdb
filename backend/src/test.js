const os = require('os');
const bluebird = require('bluebird');

const mongoose = require('mongoose');
const log = require("./config/log")("main");
const config = require("./config/config");
const database = require("./config/database");
const mongoDbQueue = require('mongodb-queue');


async function main(){
    console.log("in main");
}

console.log(main());

/*
async function main() {

    log.info(`Configuration loaded for "${config("NODE_ENV")}" environment. App port is ${config("PORT")}`);

    log.info("Connecting to database...");
    let db = await database.init();

    let queue = mongoDbQueue(db, 'my-queue');

    queue.add = bluebird.promisify(queue.add);
    queue.get = bluebird.promisify(queue.get);
    queue.ack = bluebird.promisify(queue.ack);

    let id = await queue.add('Hello, World!');
    console.log(`added=${id}`);

    let msg = await queue.get();
    console.log('msg.id=' + msg.id);
    console.log('msg.ack=' + msg.ack);
    console.log('msg.payload=' + msg.payload); // 'Hello, World!'
    console.log('msg.tries=' + msg.tries);

    //id = await queue.ack(msg.ack);

    await mongoose.connection.close();


}

main()
    .catch(err => log.error(err));
*/