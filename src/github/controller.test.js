const { getGithubClientId } = require('./controller');

describe('Controller', () => {
    describe('getGithubClientId method', () => {
        it('should return an Object', () => {
            const result = getGithubClientId();
            expect(typeof result).toEqual('object')
        })

        it('should return the GitHub client id set on the process.env', () => {
            const result = getGithubClientId();
            expect(result.githubClientId).toEqual('mock-github-client-id');
        })
    })
})