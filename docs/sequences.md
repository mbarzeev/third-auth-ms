## Sequence flows

To be used with https://sequencediagram.org/

```
title High level 3rd-party sign-in sequence flow

Client -> web-ms: GET sign-in doc
web-ms -> third-auth-ms:GET get-client-id
third-auth-ms --> web-ms:client-id
note over web-ms:Generate sign-in doc
web-ms --> Client: doc

Client -> 3rd-party sign-in vendor: POST authenticate
3rd-party sign-in vendor -->Client: id_token
Client->web-ms:POST validate-token
web-ms->third-auth-ms:POST validate-token
third-auth-ms ->3rd-party sign-in vendor: POST validate token
3rd-party sign-in vendor -->third-auth-ms: auth-payload
third-auth-ms-->web-ms:auth-payload
web-ms->session-ms:GET get-session
session-ms --> web-ms:session-JWT
web-ms-->Client:session-JWT
```