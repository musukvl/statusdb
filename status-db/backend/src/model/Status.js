const mongoose = require("mongoose");
const { toJsonOptions } = require("./modelUtils");
const moment = require('moment');

const Schema = mongoose.Schema;

const schema = new Schema({
    namespace: { type: String, required: true, trim: true, unique: false },
    key: { type: String, required: true, trim: true, unique: false },
    value: {type: Schema.Types.Mixed, required: false},
    valueHash:  { type: String, required: true, trim: true, unique: false },
    description: {type: Schema.Types.Mixed, required: false},
    changed : {type: Date, required: true, default: moment.utc },
    lastCheck: {type: Date, required: true, default: moment.utc }
});

schema.index({namespace: 1, key: 1}, {unique: true});
schema.set("toJSON", toJsonOptions);

const Status = mongoose.model("Status", schema);

module.exports = Status;
