const PORT = process.env.PORT;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const { OAuth2Client } = require('google-auth-library');

module.exports.getGoogleClientId = () => {
    return { "googleClientId": GOOGLE_CLIENT_ID };
}

module.exports.getAuthPayloadByIdToken = async (idToken) => {
    let authPayload = null;
    const googleAuth2Client = new OAuth2Client(GOOGLE_CLIENT_ID);
    const ticket = await googleAuth2Client.verifyIdToken({
        idToken,
        audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    const clientid = payload['aud'];

    if (userid && clientid === GOOGLE_CLIENT_ID) {
        const { locale, name, email, email_verified, given_name, family_name, picture } = payload;
        authPayload = { userid, locale, name, email, email_verified, given_name, family_name, picture };
    }

    return authPayload;
}

module.exports.getMainDoc = () => (`
    <html>
        <head>
            <meta name="google-signin-client_id" content="${GOOGLE_CLIENT_ID}">

            <style>
                html, body {
                    height: 100%;
                    display:flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }

                .auth-result {
                    width: 500px;
                    margin-top: 20px;
                }
            </style>
            
            <script src="https://apis.google.com/js/platform.js" async defer></script>

            <script>
            function onSignIn(googleUser) {
                const id_token = googleUser.getAuthResponse().id_token;
                const xhr = new XMLHttpRequest();
                xhr.open('POST', 'https://localhost:${PORT}/auth/google/validate-token');
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                xhr.onload = function() {
                    document.querySelector('.auth-result').textContent = xhr.responseText
                };
                xhr.send('idtoken=' + id_token);
            }
            </script>
        </head>
        <body>
            <div class="main">
                <h1>Google auth demo</h1>
            </div>
            <div class="g-signin2" data-onsuccess="onSignIn"></div>
            <br>
            <div>
                <textarea class="auth-result" rows="10" cols="33">...</textarea>
            </div>
        </body>
    </html>
`);