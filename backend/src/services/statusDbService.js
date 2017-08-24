const Status = require('../model/Status');
const StatusHistory = require('../model/StatusHistory');
const hash = require('object-hash');
const moment = require('moment');

class StatusDbService {

    constructor(){
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
                let historyRecord = new StatusHistory({
                    namespace: existedStatus.namespace,
                    key: existedStatus.key,
                    value: existedStatus.value,
                    valueHash: existedStatus.valueHash,
                    description: existedStatus.description,
                    changed: existedStatus.changed
                });
                historyToInsert.push(historyRecord);
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
    }

    getValueHash(value) {
        return hash(value);
    }
}

module.exports = new StatusDbService();