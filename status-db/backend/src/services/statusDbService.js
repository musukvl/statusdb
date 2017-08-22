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
        for (let status of statusList) {
            status.valueHash = status.valueHash ? status.valueHash : this.getValueHash(status.value);

            let existedStatus = await Status.findOne({namespace: status.namespace, key: status.key});
            let statusChanged = !existedStatus || status.valueHash !== existedStatus.valueHash;

            // create new status
            if (!existedStatus) {
                existedStatus = new Status({
                    namespace: status.namespace,
                    key: status.key,
                    value: status.value,
                    valueHash: status.valueHash
                });
            } else {
                existedStatus.value = status.value;
                existedStatus.valueHash = status.valueHash;
                existedStatus.updated = moment.utc();
            }

            //create history record only if valueHash was changed
            if (statusChanged) {
                let historyRecord = new StatusHistory({
                    namespace: existedStatus.namespace,
                    key: existedStatus.key,
                    value: existedStatus.value,
                    valueHash: existedStatus.valueHash,
                    updated: existedStatus.updated
                });
                await historyRecord.save();
            }
            existedStatus.lastCheck = moment.utc();
            await existedStatus.save();
        }
    }

    getValueHash(value) {
        return hash(value);
    }
}

module.exports = new StatusDbService();