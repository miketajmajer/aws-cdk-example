# AWS AccessToken vs idToken

Note: this [article about Fine-grained access control in API Gateway with Cognito access token and scopes](https://medium.com/theburningmonk-com/fine-grained-access-control-in-api-gateway-with-cognito-access-token-and-scopes-bef054e4dece) has good info too!

Taken from: https://stackoverflow.com/questions/50404761/aws-api-gateway-using-access-token-with-cognito-user-pool-authorizer

If anyone was curious how to accomplish this in CDK, here’s how I managed to create an API that accepts an auth token as part of the Authorization header. There's some good information above on how it works conceptually. As the AWS CDK documentation was inevitably lacking, I figured out the CDK way by looking for constructs that mapped to the concepts mentioned above and iteratively adding the right constructs to the api and user pools.

Create a user pool

const userPool = new cognito.UserPool(this, "****");
Create a resource server and scopes. These scopes will be important later when assigning custom scopes to api methods. Identifier - AWS recommends using the domain name

```
const apiScope = new cognito.ResourceServerScope({
  scopeName: '**',
  scopeDescription: '**'
});

const userServer = userPool.addResourceServer('**', {
  identifier: props.subdomain,
  scopes: [apiScope]
});
```
Create a hosted UI domain. Users will log into the Hosted UI to get an auth code to use in the auth code authentication flow and receive id/access tokens.
```
userPool.addDomain('**', {
  cognitoDomain: {
    domainPrefix: '**',
  },
});
```
Create the client, configure the desired auth flows, and assign the oauth scopes you want to allow for users.

```
const userPoolClient = userPool.addClient('**', {
  authFlows: {
    adminUserPassword: true
  },
  supportedIdentityProviders: [
    cognito.UserPoolClientIdentityProvider.COGNITO
  ],
  oAuth: {
    flows: {
      authorizationCodeGrant: true,
      implicitCodeGrant: true
    },
    scopes: [
      cognito.OAuthScope.resourceServer(userServer, apiScope),
      cognito.OAuthScope.OPENID,
      cognito.OAuthScope.COGNITO_ADMIN
    ]
  },
  refreshTokenValidity: Duration.days(10)
});
```
You can deploy the app at this point and see the scopes in the AWS console under User Pools -> User Pool Name -> App Integration -> App client list -> App client name -> Hosted UI -> Custom Scopes. Scopes are a combination of the resource server id and the scope name.

Create a Cognito user pools authorizer for the user pool

```
const authorizer = new apigateway.CognitoUserPoolsAuthorizer(this, '**', {
  cognitoUserPools: [userPool]
});
```
Add authorizer to the appropriate method of your API. Make sure to add the correct authorization scopes.

```
const api = new apigateway.RestApi(this, '***', {
  ...options
});
const resource = api.root.addResource('resource');

resource.addMethod('POST', integration, {
  authorizer,
  authorizationScopes: [
    <scope names>
  ]
});
```
Adding the correct authorization scopes was crucial, and where I got tripped up for a while. This needs to match at least one of the custom resource server scopes created above.