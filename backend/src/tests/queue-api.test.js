const mongoose = require('mongoose');
const assert = require('assert');
const should = require('should');
const request = require('supertest');
const config = require('../config/config');
const log = require("../config/log")("api-test");
const database = require("../config/database");
const express = require("../config/express");

const Client = require('../model/Client');

const testUtils = require('./testUtils');

describe('#queue api test', () => {
    var app = {};
    before(async () => {

        log.info(`Config loaded with "${config('NODE_ENV')}" environment`);

        log.info("Connecting to database...");
        await database.init();
        await mongoose.connection.db.dropDatabase();

        log.info("Creating express app...");
        app = await express.init();
        log.info("Populate test data.");

        var client = new Client({
            apiKey: "TESTS_API_KEY",
            namespaceRestrictions: ""
        });
        await client.save();
        log.info("Before tests done");
    });


    it('queue common usage flow', async () => {
        await testUtils.sendStatus(app, "queue-common-useage-1", 1);
        await testUtils.sendStatus(app, "queue-common-useage-2", 2);
        let resp = await testUtils.sendPost(app, '/api/queue/get', { count : 10 });
        resp.body.length.should.be.equal(2, "Queue items were not created");

        let ack = resp.body.map(x =>  x.ack);
        resp = await testUtils.sendPost(app, '/api/queue/ack', ack);
    });


    after(async () => {
        await mongoose.connection.close();
        //log.info("Database closed")
    });

});