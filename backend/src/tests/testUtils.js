const request = require('supertest');

async function sendStatus(app, key, value) {
    return await request(app)
        .post('/api/status?api_key=TESTS_API_KEY')
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
}

async function sendPost(app, url, body) {
    return await request(app)
        .post(url)
        .send(body)
        .set('Accept', 'application/json')
        .set('X-Api-Key', 'TESTS_API_KEY')
        .expect(200)
        .expect('Content-Type', /json/);
}

module.exports = {sendStatus, sendPost};