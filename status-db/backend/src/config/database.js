const mongoose = require("mongoose");
const config = require("./config");

async function init() {
    mongoose.Promise = global.Promise;
    let connection = await mongoose.connect(config("mongo-connection-string"), { useMongoClient: true });
    return connection;
}

module.exports = { init };