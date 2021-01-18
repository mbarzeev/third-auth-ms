require('dotenv').config();
const PORT = process.env.PORT;
const HOST = process.env.HOST;
const CERT_PASSPHRASE = process.env.CERT_PASSPHRASE;
const KEY_PEM_FILE_PATH = process.env.KEY_PEM_FILE_PATH;
const CERT_PEM_FILE_PATH = process.env.CERT_PEM_FILE_PATH;

const fs = require('fs');
const cors = require('cors');

async function build() {
    const fastify = require('fastify')({
        logger: true,
        http2: true,
        https: {
            allowHTTP1: true, // fallback support for HTTP1
            // eslint-disable-next-line security/detect-non-literal-fs-filename
            key: fs.readFileSync(KEY_PEM_FILE_PATH),
            // eslint-disable-next-line security/detect-non-literal-fs-filename
            cert: fs.readFileSync(CERT_PEM_FILE_PATH),
            passphrase: CERT_PASSPHRASE,
        },
    });

    // Parsers
    fastify.register(require('fastify-formbody'));

    // CORS support
    await fastify.register(require('middie'));
    fastify.use(cors());

    // Routes
    // TODO: add route to get all the client IDs available
    require('./google/routes.js')(fastify);
    require('./github/routes.js')(fastify);

    return fastify;
}

// Run the server!
const start = async () => {
    const fastify = await build();

    try {
        process.on('SIGINT', closeGracefully);
        process.on('SIGTERM', closeGracefully);

        await fastify.listen(PORT, HOST);
        fastify.log.info(`server listening on ${fastify.server.address().port}`);
    } catch (err) {
        fastify.log.error(err);
        process.exitCode = 1;
        throw err;
    }

    async function closeGracefully(signal) {
        console.log(`Received signal to terminate: ${signal}`);

        await fastify.close();
        /* eslint-disable no-process-exit */
        process.exit();
    }
};
start();