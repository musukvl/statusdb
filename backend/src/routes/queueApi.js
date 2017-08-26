const express = require("express");
const router = express.Router();
const Client = require('../model/Client');
const utils = require('../core/routeHelper');
const apiKeyChecker = require('../middleware/apiKeyChecker');

const QueueService = require("../services/QueueService");

class QueueApiController {

    constructor() {
        this._queueService = new QueueService();
    }

    async getQueueMessage(req, res) {
        let count = utils.getParam(req, 'count');
        let messages = await this._queueService.get(count);
        res.json(messages);
    }

    async ackQueueMessage(req, res) {
        let ackMessages = utils.getParam(req, 'ack');
        await this._queueService.ack(ackMessages);
        res.json({"text": "test"});
    }


}
router.use(apiKeyChecker);


let queueApiController = new QueueApiController();

router.post("/queue/get", utils.safe(queueApiController.getQueueMessage.bind(queueApiController)));
router.post("/queue/ack", utils.safe(queueApiController.ackQueueMessage.bind(queueApiController)));
module.exports = router;