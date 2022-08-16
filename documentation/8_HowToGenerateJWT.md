## How to Generate JWT Token using Auth0 UI

Signup in `https://auth0.com` (I used my personal google account to login)

Steps:

1. Create API

Navigate to : Applications -> APIs

Click on : Create API

Identifier = http://localhost:3000/

Signing Algorithm = RS256

Click on “Create”



2. Grab the authority

Navigate to the API settings of the newly created API

Settings -> Quick Start 

Under “2. Configuring your API to accept RS256 signed tokens”,

Choose Node.js.

Copy the URL given in the token “jwksUri”

eg., https://dev-xxxxxxx.us.auth0.com

Copy this URL in `config.ts` in the code

Sample snippet:

```JS
conf.jwtTokens = {

  audience: `http://localhost:${conf.server.port}/`,

  authority:

    process.env.JWT_TOKENS_AUTHORITY ?? 'https://dev-xxxxxxx.us.auth0.com/',

}
```

3. Go to Test tab

Copy the JWT Token, example `ey...`

Append token with `Bearer ey..`

and put it in headers, screenshot is in `Headers.png` under the screenshots folder