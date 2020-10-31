# third-auth-ms
A micro-service for delegating authentication to 3rd party vendors.  

We know today that creating your own authentication mechanism involves a lot of work and exposes you system to attacks due to breaches you are not aware of or did not handle correctly.  
On the other hand, there are 3rd-party vendors which have very solid, tested and trust-worthy authentication mechanisms you can use to you own application benefit, such as Google, Github, etc.

This micro-service aims to help you integrate with those 3rd-party authenticators.

## What does it do?
Once set up and triggered this micro-service initiates an authentication flow which validates the user against the 3rd-party authentication vendor, and if valid, returns the user's approved details to share with your application.

## How does it do that?
Every respectable authentication vendor has means to preform authentication. This micro-service simply consolidates the different vendors and eposes an abstraction API to work with them. 

This micro-service is intended to work with other micro-services which participate in your application.
Common flow of integrating the third-auth-ms in your system can be:
![Common flow of integrating the third-auth-ms in your system](./assets/sequence-diagram-1.png)

## Currently supported vendors
* Google
* GitHub
* More to come... :)

## Usage
Create a `.env` file where you will put the following details.  
**Note** that vendor related variables are needed according to the vendor you wish to use.
| KEY                 | Context  | Description   |  
|-                      |- |:-             |
| PORT                  | Server | The port the micro-service server is going to run on |
| HOST                  | Server | The host IP the micro-service server is going to run on, default is 0.0.0.0|
| CERT_PASSPHRASE       | Server | HTTPS certificate pass-phrase              |
| KEY_PEM_FILE_PATH     | Server | HTTPS certificate encryption key file path             |
| CERT_PEM_FILE_PATH    | Server | HTTPS certificate file path             |
| GOOGLE_CLIENT_ID      | Google | Your Google application client ID, if you want to authenticate using Google |
| GOOGLE_CLIENT_SECRET  | Google | Your Google application client secret, if you want to authenticate using Google |
| GITHUB_CLIENT_ID  | GitHub | Your GitHub application client ID, if you want to authenticate using GitHub |
| GITHUB_CLIENT_SECRET  | GitHub | Your GitHub application client secret, if you want to authenticate using GitHub |


## Demos
### Google
Given that you have Google client ID and Google client secret
(If you don't know what these are please see here: https://developers.google.com/identity/sign-in/web/sign-in) -  
Launch the server by running `npm start` and navigate to `https://localhost:<port>/auth/google/demo`  
You will see a Google sign-in button. Clicking this button will initiate an authentication process with Google. If the authentication was successful you will get the authenticated user's detail displayed in the textarea below.

### GitHub
Given that you have GitHub client ID and GitHub client secret
(If you don't what these are please see here: https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/) -  
Launch the server by running `npm start` and navigate to `https://localhost:<port>/auth/github/demo` 
You will see a GitHub sign-in button
The GitHub demo page performs authentication and then redirects back to demo page since this is the **callback URI**, and only then it validates the auth token with this micro-service to  display the result on the demo page.
The developer needs to define the **callback URI** on GitHub applcation settings for this demo to work.