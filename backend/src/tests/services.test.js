const mongoose = require('mongoose');
const assert = require('assert');
const should = require('should');
const request = require('supertest');

const config = require('../config/config');
const log = require("../config/log")("api-test");
const database = require("../config/database");
const express = require("../config/express");

const Status = require('../model/Status');
const StatusHistory = require('../model/StatusHistory');
const Client = require('../model/Client');

const QueueService = require("../services/QueueService");
const StatusDbService = require("../services/StatusDbService");

describe('#services test', () => {

    before(async () => {
        log.info(`Config loaded with "${config('NODE_ENV')}" environment`);

        log.info("Connecting to database...");
        await database.init();
        await mongoose.connection.db.dropDatabase();

        log.info("Populate test data.");

        let client = new Client({
            apiKey: "TESTS_API_KEY",
            namespaceRestrictions: ""
        });
        await client.save();

        log.info("Before tests done");
    });


    it('testQueueService', async () => {
        let queueService = new QueueService();

        queueService.stashMessage({text: "test1"});
        queueService.stashMessage({text: "test2"});

        await queueService.addStashedMessages();

        let messages = await queueService.get(2);
        let payloads = messages.map(x => x.payload);

        payloads.length.should.be.equal(2, "Queue items were not created");

        await queueService.ack(messages);
        messages = await queueService.get(2);
        messages.length.should.be.equal(0, "Queue items were not ack");
        await queueService.clean();
    });


    after(async () => {
        await mongoose.connection.close();
    });

});
