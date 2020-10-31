const {getMainDoc, getAuthPayloadBySessionCode, getGithubClientId} = require('./controller');

module.exports = (fastify) => {
    fastify.route({
        method: 'GET',
        url: '/auth/github/client-id',
        handler: (request, reply) => {
            const githubClientId = getGithubClientId();
            reply.type('application/json');
            reply.send(githubClientId);
        },
    });

    fastify.route({
        method: 'POST',
        url: '/auth/github/validate-session-code',
        handler: async (request, reply) => {
            const sessionCode = request.body.sessionCode;
            const authPayload = await getAuthPayloadBySessionCode(sessionCode);
            reply.type('text/json');
            reply.send(authPayload);
        },
    });

    fastify.route({
        method: 'GET',
        url: '/auth/github/demo',
        handler: (request, reply) => {
            const doc = getMainDoc();
            reply.type('text/html');
            reply.send(doc);
        },
    });
};
