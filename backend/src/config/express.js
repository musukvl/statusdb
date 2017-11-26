const express = require('express');
//const favicon = require('serve-favicon');
const log = require('./log')("express");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const partials = require('express-partials');
const config = require('./config');

const indexRouter = require('../routes/index');
const apiRouter = require('../routes/api');
const queueApiRouter = require("../routes/queueApi");
const cors = require('cors');

async function init() {
    var app = express();

    // view engine setup
    app.set('views', 'src/views');
    app.use(partials());
    app.set('view engine', 'ejs');
    app.set('view options', {
        layout: 'layout'
    });

    // uncomment after placing your favicon in /public
    //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
    //app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static('public'));

    // CORS:
    app.use(cors());
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    app.use((req, res, next) => {
        req.rawUrl = `${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`;

        var originEnd = res.end;
        res.end = function (chunk, encoding) {
            res.end = originEnd;

            if (res.statusCode == 200) {
                log.info(`${req.rawUrl} -> OK`);
            }

            res.end(chunk, encoding);
        };
        next();

    });


    app.use('/', indexRouter);
    app.use('/api', apiRouter);
    app.use('/api', queueApiRouter);


    // catch 404 and forward to error handler
    app.use((req, res, next) => {
        let err = new Error('Not Found');
        err.status = 404;
        //
        next(err);
    });

    // error handler
    // eslint-disable-next-line no-unused-vars
    app.use((err, req, res, next) => {
        const status = err.status || 500;
        log.debug(`${req.rawUrl} -> ${status} ${err.message}`);
        if (status === 500) {
            log.error(err);
            res.status(500).json(err);
        }
        else {
            res.status(status).json({ error: err.message })
        }
    });


    return app;
}

module.exports = { init };