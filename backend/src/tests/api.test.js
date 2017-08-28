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
const testUtils = require('./testUtils');

describe('#status api text', () => {
    var app = {};
    before(async () => {

        log.info(`Config loaded with "${config('NODE_ENV')}" environment`);

        log.info("Connecting to database...");
        await database.init();
        await mongoose.connection.db.dropDatabase();

        log.info("Creating express app...");
        app = await express.init();
        log.info("Populate test data.");

        await testUtils.recreateTestDb();

        log.info("Before tests done");
    });


    it('queue common usage flow', async () => {
        await testUtils.recreateTestDb();

        await testUtils.sendStatus(app, "queue-common-useage-1", 1);
        await testUtils.sendStatus(app, "queue-common-useage-2", 2);
        let messages = await testUtils.sendPost(app, '/api/queue/get', { count : 10 });
        messages.length.should.be.equal(2, "Queue items were not created");

        let ack = messages.map(x =>  x.ack);
        await testUtils.sendPost(app, '/api/queue/ack', {ack: ack});
    });

    it('create new status', async () => {

        await testUtils.sendStatus(app, "new-status", "1");
        let createdStatus = await testUtils.sendPost(app, "/api/get-status", {namespace: "test", key: "new-status"});
        should.exist(createdStatus, "Created status not found");
        createdStatus.value.should.be.equal("1", "Status value was not updated");

        let statusHistoryList = await testUtils.sendPost(app, "/api/get-status-history", {namespace: "test", key: "new-status"});
        statusHistoryList.length.should.be.equal(1, "Status History was not created");
        statusHistoryList[0].value.should.be.equal("1", "Status History value was not updated");

    });


    it('update status', async () => {

        await testUtils.sendStatus(app, "update-status", "1");

        let status = await testUtils.sendPost(app, "/api/get-status", {namespace: "test", key: "update-status"});
        should.exist(status, "Created status not found");
        status.value.should.be.equal("1", "Status value was not updated");

        await testUtils.sendStatus(app, "update-status", "2");

        status = await testUtils.sendPost(app, "/api/get-status", {namespace: "test", key: "update-status"});
        should.exist(status, "Created status not found");
        status.value.should.be.equal("2", "Status value was not updated");


        let statusHistoryList = await testUtils.sendPost(app, "/api/get-status-history", {namespace: "test", key: "update-status"});
        statusHistoryList.length.should.be.equal(2, "Status History was not created");
    });


    it('namespace test', async () => {

        await testUtils.sendPost(app, "/api/update-status", {
                status: [
                    {
                        namespace: "namespace-test",
                        key: `key1`,
                        value: 1
                    },
                    {
                        namespace: "namespace-test",
                        key: `key2`,
                        value: 1
                    }
                ]
            }
            );

        let status = await testUtils.sendPost(app, "/api/get-namespace-status", {namespace: "namespace-test"});
        status.length.should.be.equal(2, "Status value was not updated");
    });


    it('create multiple statuses', async () => {

        let statuses = [];
        let requestCount = 300;
        for (let i = 0; i < requestCount; i++) {
            statuses.push({
                namespace: "test-multiple",
                key: `many-status-${i}`,
                value: i,
                description: "some value " + i
            });
        }

        await testUtils.sendPost(app, "/api/update-status", { status: statuses });

        statuses = statuses.map(x => {x.value = x.value + 1000; return x;});

        await testUtils.sendPost(app, "/api/update-status", { status: statuses });

        let statusList = await Status.find({namespace: "test-multiple"});
        statusList.length.should.be.equal(requestCount, "Status was not created");

        let statusHistoryList = await StatusHistory.find({namespace: "test-multiple"});
        statusHistoryList.length.should.be.equal(requestCount * 2, "Status History was not created");


    });




    after(async () => {
        await mongoose.connection.close();
    });

});



/*
async function main1() {
   await database.init();



   var event = new Status({
       namespace: "test",
       key: "test-key5",
       value : {some: "object", some1: "data"},
       valueHash: 1
   });
   var x = await event.save();


    let result = await Status
        .find({namespace: "test"})
        .sort({key: 1});

    console.log(result);
    mongoose.connection.close();

};

*/