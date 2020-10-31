require('dotenv').config();
const PORT = process.env.PORT;
const HOST = process.env.HOST;
const CERT_PASSPHRASE = process.env.CERT_PASSPHRASE;
const KEY_PEM_FILE_PATH = process.env.KEY_PEM_FILE_PATH;
const CERT_PEM_FILE_PATH = process.env.CERT_PEM_FILE_PATH;

const fs = require('fs');

const fastify = require('fastify')({
    logger: true,
    http2: true,
    https: {
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        key: fs.readFileSync(KEY_PEM_FILE_PATH),
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        cert: fs.readFileSync(CERT_PEM_FILE_PATH),
        passphrase: CERT_PASSPHRASE,
    },
});

// Parsers
fastify.register(require('fastify-formbody'));

// Routes
require('./google/routes.js')(fastify);
require('./github/routes.js')(fastify);

// Run the server!
const start = async () => {
    try {
        await fastify.listen(PORT, HOST);
        fastify.log.info(`server listening on ${fastify.server.address().port}`);
    } catch (err) {
        fastify.log.error(err);
        process.exitCode1 = 1;
        throw err;
    }
};
start();
