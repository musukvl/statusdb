const Status = require('../model/Status');
const StatusHistory = require('../model/StatusHistory');
const hash = require('object-hash');
const moment = require('moment');

const QueueService = require('./QueueService');

class StatusDbService {

    constructor(){
        this._queueService = new QueueService();
    }

    async getNamespaceStatus(namespace) {
        let status = await Status
            .find({namespace: namespace})
            .sort({key: 1})
            .exec();
        return status;
    }

    async getStatus(namespace, key) {
        let status = await Status
            .findOne({namespace: namespace, key: key})
            .exec();
        return status;
    }

    async getStatusHistory(namespace, key) {
        let history = await StatusHistory.find({namespace: namespace, key: key})
            .sort({changed: 1})
            .exec();
        return history;
    }

    /**
     *
     * @param statuses : array
     * @returns {Promise.<void>}
     */
    async updateStatus(statusList) {
        //TODO: bulk update
        let statusToUpdate = [];
        let statusToInsert = [];
        let historyToInsert = [];
        let statusUpdateQueueMessages = [];
        for (let status of statusList) {
            status.valueHash = status.valueHash ? status.valueHash : this.getValueHash(status.value);

            let existedStatus = await Status.findOne({namespace: status.namespace, key: status.key});
            let createNewStatus = !existedStatus;
            let statusChangedOrCreated = createNewStatus || status.valueHash !== existedStatus.valueHash;
            status.date = status.date ? status.date : moment.utc();

            if (createNewStatus) {
                existedStatus = new Status({
                    namespace: status.namespace,
                    key: status.key
                });
            }
            if (statusChangedOrCreated) {
                existedStatus.value = status.value;
                existedStatus.valueHash = status.valueHash;
                existedStatus.description = status.description;
                existedStatus.changed = status.date;

                //create history record only if status was changed or created
                let history = {
                    namespace: existedStatus.namespace,
                    key: existedStatus.key,
                    value: existedStatus.value,
                    valueHash: existedStatus.valueHash,
                    description: existedStatus.description,
                    changed: existedStatus.changed
                };
                let historyRecord = new StatusHistory(history);
                historyToInsert.push(historyRecord);
                this._queueService.stashMessage(history);
            }
            existedStatus.lastCheck = status.date ? status.date : moment.utc();

            if (createNewStatus) {
                statusToInsert.push(existedStatus);
            } else {
                statusToUpdate.push(existedStatus);
            }
        }

        if (historyToInsert.length) {
            await StatusHistory.insertMany(historyToInsert);
        }
        if (statusToInsert) {
            await Status.insertMany(statusToInsert);
        }
        if (statusToUpdate.length) {
            await Promise.all(statusToUpdate.map((x) => x.save()));
        }
        await this._queueService.addStashedMessages();
    }

    getValueHash(value) {
        return hash(value);
    }
}

module.exports = new StatusDbService();