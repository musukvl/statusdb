const express = require("express");
const router = express.Router();
const apiKeyChecker = require('../middleware/apiKeyChecker');
const utils = require("../core/routeHelper");
const log = require("../config/log")("ApiController");

const statusDbService = require('../services/StatusDbService');

async function test(req, res) {
    res.json({"text": "test"});
}

async function updateStatus(req, res) {
    let statusList = req.body.status;
    log.debug("update status: ", statusList);
    if (!statusList) {
        res.status(400).end('Status not provided.');
        return;
    }

    if (!(statusList instanceof Array)) {
        statusList = [statusList];
    }

    await statusDbService.updateStatus(statusList);
    res.json({"result": "ok"});
}

async function getStatus(req ,res) {
    let namespace = utils.getParam(req, "namespace");
    let key = utils.getParam(req, "key");
    let status = await statusDbService.getStatus(namespace, key);
    res.json(status);
}

async function getNamespaceStatus(req ,res) {
    let namespace = utils.getParam(req, "namespace");
    let status = await statusDbService.getNamespaceStatus(namespace);
    res.json(status);
}

async function getStatusHistory(req ,res) {
    let namespace = utils.getParam(req, "namespace");
    let key = utils.getParam(req, "key");
    let status = await statusDbService.getStatusHistory(namespace, key);
    res.json(status);
}

router.use(apiKeyChecker);

router.get("/test", test);
router.post("/update-status", utils.safe(updateStatus));
router.post("/get-status", utils.safe(getStatus));
router.post("/get-namespace-status", utils.safe(getNamespaceStatus));
router.post("/get-status-history", utils.safe(getStatusHistory));

module.exports = router;