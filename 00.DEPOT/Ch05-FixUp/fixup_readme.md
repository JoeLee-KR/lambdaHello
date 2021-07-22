https://ask.csdn.net/questions/4539703



**Word of warning, I am a beginner so take what I have said with a grain of salt, I encourage you to look online to validate my claims**

I have discovered an issue on the lambda code that causes it not to interact with the above code, the reason I believe is that the code example in the book and the repository is out of date as Auth0 has updated the way it does the authentication

**Authors intended design** The authors design was that when you login into the website using a social provider such as google, auth0 would return an **id token** and then your website would store it. Once the user clicks on the profile picture it was supposed to hit your API gateway which would then forward your Authorization token to the User-profile get resource. The user-profile lambda would then verify the id token using the node js package 'jsonwebtoken' which locally verifies the token using the secrete key and the ' **hs256**' algorithm (Not 100% sure about the algorithm part).



### Why the incompatibility

#### Website end

In the above comment, the 'on' method gives you back an access token not an id token and as [this](https://auth0.com/blog/why-should-use-accesstokens-to-secure-an-api/) blog says, you need an id token to verify but you will need an access token to get information from your social provider like email address, profile pictures etc.

#### Lambda end

1. Then id token that auth0 now returns is encrypted using 'rs256' and not 'hs256' so the verify method keeps failing
2. The request to 'https://' + process.env.DOMAIN + '/tokeninfo' no longer works

### Fix

#### Website end

1.Request for the access token and id token 2. When making a request to the user-profile resource on aws append the access token in the authorization header along with the id token

#### Lambda

1.Seperate the id token from the access token 2. Verify the id token with a public key instead of the secrete key. To get the key make a call to the following url https://[your_domain].auth0.com/pem . Once you have downloaded the pem key copy the contents in between '-----BEGIN CERTIFICATE-----' and '-----END CERTIFICATE-----' (You will need to append these two back inside the code). Take extracted content and put it into an environment variable 3.Call /userinfo instead of /tokeninfo. To use /userinfo you need to pass in the access token into the **Authorization header** and not into the body