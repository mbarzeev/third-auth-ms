const jwt = require('jsonwebtoken');
const {generateKeyPairSync} = require('crypto');

class JwtService {
    constructor() {
        // Generate the kwy pair for JWT once in the life time of this micro-service
        const {publicKey, privateKey} = generateKeyPairSync('rsa', {
            modulusLength: 4096,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem',
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
                cipher: 'aes-256-cbc',
                passphrase: 'top secret',
            },
        });

        this._publicKey = publicKey;
        this._privateKey = privateKey;
    }

    get publicKey() {
        return this._publicKey;
    }

    signPayload(payload) {
        const token = jwt.sign(payload, this._privateKey);
        return token;
    }
}

let instance = null;

function getJwtService() {
    if (!instance) {
        instance = new JwtService();
    }
    return instance;
}

module.exports = getJwtService;
