const express = require("express");
const router = express.Router();
const Client = require('../model/Client');

const statusDbService = require('../services/statusDbService');

async function test(req, res) {
    res.json({"text": "test"});
}

async function updateStatus(req, res) {
    let statusList = req.body.status;
    if (!(statusList instanceof Array)) {
        statusList = [statusList];
    }
    await statusDbService.updateStatus(statusList);
    res.json({"text": "test"});
}

router.use(async function (req, res, next) {
    let apiKey = req.get('X-Api-Key');
    if (!apiKey) {
        apiKey = req.query["api_key"];
    }
    if (!apiKey) {
        apiKey = req.body["api_key"];
    }
    if (!apiKey) {
        res.status(400).end('API key required. Use api_key query parameter or X-Api-Key header.');
        return;
    }
    let client = await Client.findOne({apiKey: apiKey});
    if (!client) {
        res.status(400).end('Wrong api key.');
        return;
    }
    req.client = client;
    req.apiKey = apiKey;

    next();
});

router.get("/test", test);
router.post("/status", updateStatus);

module.exports = router;