const nconf = require('nconf');

let config = nconf
        .argv({
            "p": {
                alias: 'PORT',
                describe: 'Port to run node app'
            },
            "e": {
                alias: 'NODE_ENV',
                describe: 'Node environment: develop, test or else'
            }
        })
        .env()
        .defaults({
            'NODE_ENV': 'develop'
        });

let env = nconf.get('NODE_ENV');
if (env) {
    nconf.file(`./config.${env}.json`);
}
nconf.file('defaults1', `./config.json`);

function getConfigParam(param) {
    return config.get(param);
}

module.exports = getConfigParam;