const mongoose = require("mongoose");
const { toJsonOptions } = require("./modelUtils");
const moment = require('moment');

const Schema = mongoose.Schema;

const schema = new Schema({
    namespace: { type: String, required: true, trim: true, unique: false },
    key: { type: String, required: true, trim: true, unique: false },
    value: {type: Schema.Types.Mixed, required: false},
    valueHash:  { type: String, required: true, trim: true, unique: false },
    updated : {type: Date, required: true, default: moment.utc }
});

schema.index({namespace: 1, key: 1}, {unique: false});
schema.set("toJSON", toJsonOptions);
schema.set('collection', 'status_history');


const StatusHistory = mongoose.model("StatusHistory", schema);

module.exports = StatusHistory;
