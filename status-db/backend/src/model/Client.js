const mongoose = require("mongoose");
const { toJsonOptions } = require("./modelUtils");

const Schema = mongoose.Schema;

const schema = new Schema({
  createdAt: { type: Date, required: true, default: Date.now },
  apiKey: { type: String, required: true, trim: true, unique: true },
  namespaceRestrictions : { type: String, required: false, trim: true, unique: false }
});

schema.set("toJSON", toJsonOptions);

const Client = mongoose.model("Client", schema);

module.exports = Client;
