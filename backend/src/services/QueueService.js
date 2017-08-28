const config = require("../config/config");
const queueBuilder = require('../core/queueBuilder');


class QueueService {
    constructor() {
        let queueName = config("status-update-queue");
        if (queueName) {
            this._updateQueue = queueBuilder(queueName);
        }
        this._stash = [];
    }

    async add(messages) {
        if (!this._updateQueue) {
            return;
        }
        if (!(messages instanceof Array)) {
            this._updateQueue.add(messages);
        }
        else if (messages && messages.length) {
            await Promise.all(messages.map((x) => this._updateQueue.add(x)));
        }
    }

    async get(count) {
        if (!this._updateQueue) {
            return;
        }

        if (!count || count === 1) {
            let message = await this._updateQueue.get();
            return [message];
        }

        let result = [];
        for (let i = 0; i < count; i++) {
            result.push(this._updateQueue.get())
        }
        result = await Promise.all(result);
        return result.filter(x => x);
    }

    async stashMessage(message) {
        this._stash.push(message);
    }

    async addStashedMessages() {
        await this.add(this._stash);
        this._stash = [];
    }

    async ack(messages) {
        if (!this._updateQueue || !messages) {
            return;
        }

        if (!(messages instanceof Array)) {
            let ack = typeof msg === "string" ? msg : msg.ack;
            return await this._updateQueue.ack(ack);
        }
        else {
            return await Promise.all(messages.map(msg => {
                let ack = typeof msg === "string" ? msg : msg.ack;
                return this._updateQueue.ack(ack);
            }));
        }
    }

    async clean() {
        if (!this._updateQueue) {
            return;
        }
        await this._updateQueue.clean();
    }
}

module.exports = QueueService;