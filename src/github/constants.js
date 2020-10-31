module.exports = {
    GITHUB_ACCESS_TOKEN_URI: 'https://github.com/login/oauth/access_token',
    GITHUB_GRAPHQL_URI: 'https://api.github.com/graphql',
    GITHUB_USER_DETAILS_QUERY: `
        query {
            viewer {
                id
                name
                location
                avatarUrl
                email
            }
        }
    `,
};
