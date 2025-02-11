# Second example for using AccessTokens

## Key Concepts:
	1.	Cognito User Pool – Manages authentication.
	2.	Cognito User Pool Client – Enables authentication for applications.
	3.	Cognito Resource Server & Scopes – Defines API permissions.
	4.	API Gateway Cognito Authorizer – Validates Access Tokens.
	5.	Scopes in API Gateway (authorizationScopes) – Restricts API access based on token permissions.

## Code
```
import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';

export class SecureApiWithScopesStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // ✅ Create a Cognito User Pool
    const userPool = new cognito.UserPool(this, 'MyUserPool', {
      selfSignUpEnabled: true,
      userPoolName: 'MySecureUserPool',
      signInAliases: { email: true },
    });

    // ✅ Define a Cognito Resource Server with Scopes
    const resourceServer = new cognito.UserPoolResourceServer(this, 'MyResourceServer', {
      userPool,
      identifier: 'https://myapi.example.com', // Unique API identifier
      userPoolResourceServerName: 'MyAPIResourceServer',
      scopes: [
        new cognito.ResourceServerScope({ scopeName: 'read', scopeDescription: 'Read access' }),
        new cognito.ResourceServerScope({ scopeName: 'write', scopeDescription: 'Write access' }),
      ],
    });

    // ✅ Create a Cognito User Pool Client and Attach Scopes
    const userPoolClient = new cognito.UserPoolClient(this, 'MyUserPoolClient', {
      userPool,
      generateSecret: false,
      authFlows: { userPassword: true },
      oAuth: {
        scopes: [
          cognito.OAuthScope.resourceServer(resourceServer, 'read'),
          cognito.OAuthScope.resourceServer(resourceServer, 'write'),
        ],
        callbackUrls: ['https://example.com/callback'], // Replace with actual callback URL
        logoutUrls: ['https://example.com/logout'],
      },
    });

    // ✅ Create an API Gateway
    const api = new apigateway.RestApi(this, 'SecureApi', {
      restApiName: 'SecureApiWithCognitoScopes',
      description: 'API secured using Cognito Access Token and Scopes',
    });

    // ✅ Create a Cognito Authorizer for API Gateway
    const authorizer = new apigateway.CognitoUserPoolsAuthorizer(this, 'CognitoAuthorizer', {
      cognitoUserPools: [userPool],
    });

    // ✅ Define API Resources
    const resource = api.root.addResource('secure-endpoint');

    // ✅ Attach Methods with Authorization and Scopes
    resource.addMethod('GET', new apigateway.MockIntegration(), {
      authorizer,
      authorizationType: apigateway.AuthorizationType.COGNITO,
      authorizationScopes: [`https://myapi.example.com/read`], // Requires 'read' scope
    });

    resource.addMethod('POST', new apigateway.MockIntegration(), {
      authorizer,
      authorizationType: apigateway.AuthorizationType.COGNITO,
      authorizationScopes: [`https://myapi.example.com/write`], // Requires 'write' scope
    });

    // ✅ Output API Gateway URL & Cognito Info
    new cdk.CfnOutput(this, 'ApiGatewayUrl', {
      value: api.url ?? 'Error getting API URL',
    });

    new cdk.CfnOutput(this, 'UserPoolId', {
      value: userPool.userPoolId,
    });

    new cdk.CfnOutput(this, 'UserPoolClientId', {
      value: userPoolClient.userPoolClientId,
    });
  }
}
```

## How This Works
	1.	Cognito User Pool – Users authenticate here.
	2.	Cognito Resource Server – Defines scopes (read and write) for API access.
	3.	Cognito User Pool Client – Associates the scopes with OAuth.
	4.	API Gateway – Protects endpoints with Cognito Authorizer.
	5.	API Methods with Scopes:
	•	GET /secure-endpoint requires read scope.
	•	POST /secure-endpoint requires write scope.

