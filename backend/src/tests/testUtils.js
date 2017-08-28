const request = require('supertest');
const mongoose = require('mongoose');
const assert = require('assert');
const should = require('should');

const config = require('../config/config');
const log = require("../config/log")("api-test");

const Client = require('../model/Client');


async function sendStatus(app, key, value) {
    let resp = await request(app)
        .post('/api/update-status')
        .send({
            status: [
                {
                    namespace: "test",
                    key: key,
                    value: value,
                    description: "some value"
                }
            ]
        })
        .set('Accept', 'application/json')
        .set('X-Api-Key', 'TESTS_API_KEY')
        .expect(200)
        .expect('Content-Type', /json/);
    return resp.body;
}

async function recreateTestDb() {

    await mongoose.connection.db.dropDatabase();
    var client = new Client({
        apiKey: "TESTS_API_KEY",
        namespaceRestrictions: ""
    });
    await client.save();

}

async function sendPost(app, url, body) {
    let resp = await request(app)
        .post(url)
        .send(body)
        .set('Accept', 'application/json')
        .set('X-Api-Key', 'TESTS_API_KEY')
        .expect(200)
        .expect('Content-Type', /json/);
    return resp.body;
}

module.exports = {sendStatus, sendPost, recreateTestDb};