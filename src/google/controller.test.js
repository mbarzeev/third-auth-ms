const { getGoogleClientId } = require('./controller');

describe('Controller', () => {
    describe('getGoogleClientId method', () => {
        it('should return an Object', () => {
            const result = getGoogleClientId();
            expect(typeof result).toEqual('object')
        })

        it('should return the Google client id set on the process.env', () => {
            const result = getGoogleClientId();
            expect(result.googleClientId).toEqual('mock-google-client-id');
        })
    })
})