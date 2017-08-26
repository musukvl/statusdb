const mongoose = require("mongoose");
const config = require("../config/config");
const log = require("../config/log")("queue-cleaner");
const queueBuilder = require("./queueBuilder");

async function start() {

    let queueName = config("status-update-queue");
    if (!queueName) {
        log.info('Queue settings not found. Queue not created');
        return;
    }
    let queue = queueBuilder(queueName);
    let queueCleanupInterval = config("queue-cleanup-interval");
    if (!queueCleanupInterval) {
        log.info(`"queue-cleanup-interval" setting not found. Queue cleaner not created.`);
        return;
    }
    setInterval(async () => {
        try {
            await queue.clean();
            log.info('Queue has been cleaned.');
        }
        catch(e) {
            log.error('Queue cleaning failed.', e);
        }
    }, queueCleanupInterval);
}

module.exports = { start };