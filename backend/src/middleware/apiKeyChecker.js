const Client = require('../model/Client');


async function apiKeyChecker (req, res, next) {
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
}

module.exports = apiKeyChecker;