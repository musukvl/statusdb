const express = require("express");
const router = express.Router();
const Client = require('../model/Client');
const apiKeyChecker = require('../middleware/apiKeyChecker');
const utils = require("../core/routeHelper");

const statusDbService = require('../services/StatusDbService');

async function test(req, res) {
    res.json({"text": "test"});
}

async function updateStatus(req, res) {
    let statusList = req.body.status;
    if (!statusList) {
        res.status(400).end('Status not provided.');
    }

    if (!(statusList instanceof Array)) {
        statusList = [statusList];
    }
    await statusDbService.updateStatus(statusList);
    res.json({"text": "test"});
}

router.use(apiKeyChecker);

router.get("/test", test);
router.post("/status", utils.safe(updateStatus));

module.exports = router;