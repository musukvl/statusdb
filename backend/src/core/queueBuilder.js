const bluebird = require('bluebird');

const mongoose = require('mongoose');
const mongoDbQueue = require('mongodb-queue');


function createQueue(collectionName) {

    let queue = mongoDbQueue(mongoose.connection, collectionName);

    queue.add = bluebird.promisify(queue.add);
    queue.get = bluebird.promisify(queue.get);
    queue.ack = bluebird.promisify(queue.ack);
    queue.total = bluebird.promisify(queue.total);
    queue.size = bluebird.promisify(queue.size);
    queue.done = bluebird.promisify(queue.done);
    queue.clean = bluebird.promisify(queue.clean);
    return queue;
}

module.exports = createQueue;
