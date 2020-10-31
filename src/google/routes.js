const { getMainDoc, getGoogleClientId,  getAuthPayloadByIdToken } = require('./controller');

module.exports = fastify => {
    fastify.route({
        method: 'GET',
        url: '/auth/google/client-id',
        handler: (request, reply) => {
            const googleClientId = getGoogleClientId();
            reply.type('application/json');
            reply.send(googleClientId);
        }
    })

    fastify.route({
        method: 'POST',
        url: '/auth/google/validate-token',
        schema: {
            body: {
                idtoken: { type: 'string' },
            },
        },
        handler: async (request, reply) => {
            const idToken = request.body.idtoken;
            const usersDetails = await getAuthPayloadByIdToken(idToken).catch(error => {
                request.log.error(error);
                reply.send(new Error('Could not get usre details by ID token'));
            });
            if (usersDetails) {
                reply.type('application/json');
                reply.send({ usersDetails });
            }
        }
    });

    fastify.route({
        method: 'GET',
        url: '/auth/google/demo',
        handler: (request, reply) => {
            const doc = getMainDoc();
            reply.type('text/html');
            reply.send(doc);
        }
    })
}



