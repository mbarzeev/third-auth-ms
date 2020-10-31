require('dotenv').config();
const PORT = process.env.PORT;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const fetch = require('node-fetch');
const {GITHUB_USER_DETAILS_QUERY, GITHUB_ACCESS_TOKEN_URI, GITHUB_GRAPHQL_URI} = require('./constants');

module.exports.getGithubClientId = () => {
    return {githubClientId: GITHUB_CLIENT_ID};
};

module.exports.getAuthPayloadBySessionCode = async (sessionCode) => {
    // Obtain the access token
    const body = {
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code: sessionCode,
    };

    const response = await fetch(GITHUB_ACCESS_TOKEN_URI, {
        method: 'post',
        body: JSON.stringify(body),
        headers: {'Content-Type': 'application/json', Accept: 'application/json'},
    });
    const authResponse = await response.json();

    // Fetch user's details
    const userInfoResponse = await fetch(GITHUB_GRAPHQL_URI, {
        method: 'post',
        body: JSON.stringify({query: GITHUB_USER_DETAILS_QUERY}),
        headers: {Authorization: `bearer ${authResponse.access_token}`},
    });

    const userInfo = await userInfoResponse.json();
    const {id, name, email, location, avatarUrl} = userInfo.data.viewer;
    const authPayload = {userid: id, locale: location, name, email, picture: avatarUrl};

    return {authPayload};
};

module.exports.getMainDoc = () => `
<html>
    <head>
        <style>
            html, body {
                height: 100%;
                display:flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }

            a.auth-btn{
                display:inline-block;
                padding:0.7em 1.7em;
                margin:0 0.3em 0.3em 0;
                border-radius:0.2em;
                box-sizing: border-box;
                text-decoration:none;
                font-family:'Roboto',sans-serif;
                font-weight:400;
                color:#FFFFFF;
                background-color:#3369ff;
                box-shadow:inset 0 -0.6em 1em -0.35em rgba(0,0,0,0.17),inset 0 0.6em 2em -0.3em rgba(255,255,255,0.15),inset 0 0 0em 0.05em rgba(255,255,255,0.12);
                text-align:center;
                position:relative;
            }
            a.auth-btn:active{
                box-shadow:inset 0 0.6em 2em -0.3em rgba(0,0,0,0.15),inset 0 0 0em 0.05em rgba(255,255,255,0.12);
            }
            @media all and (max-width:30em){
                a.auth-btn{
                    display:block;
                    margin:0.4em auto;
                }
            }
            .auth-result {
                width: 500px;
                margin-top: 20px;
            }
        </style
    </head>
    <body>
        <div class="main">
            <h1>GitHub auth demo</h1>
        </div>
        
        <a class="auth-btn" href="https://github.com/login/oauth/authorize?scope=user:email%20read:user&client_id=${GITHUB_CLIENT_ID}&redirect_uri=https://localhost:${PORT}/auth/github/demo">Sign-in</a>

        <div>
            <textarea class="auth-result" rows="10  " cols="33">...</textarea>
        </div>

        <script>
            window.addEventListener('load', (event) => {
                // Check if the page has a auth code on it and if so validate it against the sign in micro-service
                const url = new URL(window.location);
                const hasSessionCode = new URLSearchParams(url.search).has('code');
                if (hasSessionCode) {
                    const sessionCode = url.searchParams.get('code');
                    fetch('https://localhost:${PORT}/auth/github/validate-session-code', {
                        method: 'post',
                        body: JSON.stringify({sessionCode}),
                        headers: {'Content-Type': 'application/json', Accept: 'application/json'},
                    })
                    .then(response => response.json())
                    .then(data => {
                        document.querySelector('.auth-result').textContent = JSON.stringify(data);
                    })
                }
            });
        </script>
    </body>
</html>
`;
