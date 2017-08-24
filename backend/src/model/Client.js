const mongoose = require("mongoose");
const { toJsonOptions } = require("./modelUtils");
const moment = require("moment");
const Schema = mongoose.Schema;

const schema = new Schema({
    name : { type: String, required: false, trim: true, unique: false },
    description : { type: String, required: false, trim: true, unique: false },
    apiKey: { type: String, required: true, trim: true, unique: true },
    namespaceRestrictions : { type: String, required: false, trim: true, unique: false },
    createdAt: { type: Date, required: true, default: moment.utc }
});

schema.set("toJSON", toJsonOptions);

const Client = mongoose.model("Client", schema);

module.exports = Client;
