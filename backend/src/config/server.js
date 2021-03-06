const config = require('./config');
const logger = require('./log')("server");
const http = require('http');

class Server {
    constructor(app) {
        this._app = app;

        this._port = this.normalizePort(config('PORT'));
        app.set('port', this._port);

        this._server = http.createServer(app);
        this._server.listen(this._port);
        logger.info(`Listening port: ${this._port}`);
        this._server.on('error', (error) => this.onError(error) );
        this._server.on('listening', () => this.onListening());
    }

    /**
     * Event listener for HTTP server "error" event.
     */
    onError(error) {
        if (error.syscall !== 'listen') {
            throw error;
        }

        let bind = typeof this._port === 'string'
            ? 'Pipe ' + this._port
            : 'Port ' + this._port;

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                logger.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                logger.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    }

    onListening() {
        var self = this;
        return () => {
            var addr = server.address();
            var bind = typeof addr === 'string'
                ? 'pipe ' + addr
                : 'port ' + addr.port;
            logger('Listening on ' + bind);
        }
    }

    normalizePort(val) {
        let port = parseInt(val, 10);

        if (isNaN(port)) {
            // named pipe
            return val;
        }
        if (port >= 0) {
            // port number
            return port;
        }
        return false;
    }
}

function init(app) {
    let server = new Server(app);
    return server;
}

module.exports = { init };