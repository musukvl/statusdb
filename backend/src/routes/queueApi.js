const express = require("express");
const router = express.Router();
const utils = require('../core/routeHelper');
const apiKeyChecker = require('../middleware/apiKeyChecker');
const log = require("../config/log")("QueueApiController");

const QueueService = require("../services/QueueService");

class QueueApiController {

    constructor() {
        this._queueService = new QueueService();
    }

    async getQueueMessage(req, res) {
        let count = utils.getParam(req, 'count');
        log.debug("getQueueMessages count=" + count);
        let messages = await this._queueService.get(count);
        res.json(messages);
    }

    async ackQueueMessage(req, res) {
        let ackMessages = utils.getParam(req, 'ack');
        log.debug("ackQueueMessage" + ackMessages);
        await this._queueService.ack(ackMessages);
        res.json({"status": "test"});
    }


}
router.use(apiKeyChecker);


let queueApiController = new QueueApiController();

router.post("/queue/get", utils.safe(queueApiController.getQueueMessage.bind(queueApiController)));
router.post("/queue/ack", utils.safe(queueApiController.ackQueueMessage.bind(queueApiController)));
module.exports = router;