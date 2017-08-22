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

        var client = new Client({
            apiKey: "TESTS_API_KEY",
            namespaceRestrictions: ""
        });
        await client.save();

        log.info("Before tests done");
    });


    it('create new status', async () => {
        await request(app)
            .post('/api/status?api_key=TESTS_API_KEY')
            .send({
                status: [
                    {
                        namespace: "test",
                        key: "new-status",
                        value: "1"
                    }
                ]
            })
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', /json/);

        let statusList = await Status.find({namespace: "test", key: "new-status"});
        statusList.length.should.be.equal(1, "Status was not created");
        statusList[0].value.should.be.equal("1", "Status value was not updated");

        let statusHistoryList = await StatusHistory.find({namespace: "test", key: "new-status"});
        statusHistoryList.length.should.be.equal(1, "Status History was not created");
        statusHistoryList[0].value.should.be.equal("1", "Status History value was not updated");

    });


    it('update status', async () => {

        await request(app)
            .post('/api/status')
            .send({
                api_key: "TESTS_API_KEY",
                status: [
                    {
                        namespace: "test",
                        key: "update-status",
                        value: "1"
                    }
                ]
            })
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', /json/);

        let statusList = await Status.find({namespace: "test", key: "update-status"});
        statusList.length.should.be.equal(1, "Status was not created");
        statusList[0].value.should.be.equal("1", "Status value was not updated");

        await request(app)
            .post('/api/status')
            .send({
                status: [
                    {
                        namespace: "test",
                        key: "update-status",
                        value: "2"
                    }
                ]
            })
            .set('X-Api-Key', 'TESTS_API_KEY')
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', /json/);


        statusList = await Status.find({namespace: "test", key: "update-status"});
        statusList.length.should.be.equal(1, "Status duplication");
        statusList[0].value.should.be.equal("2", "Status value was not updated");


        let statusHistoryList = await StatusHistory.find({namespace: "test", key: "update-status"});
        statusHistoryList.length.should.be.equal(2, "Status History was not created");
    });


    after(async () => {
        await mongoose.connection.close();
        log.info('Db connection closed');

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