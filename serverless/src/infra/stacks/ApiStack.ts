import { Resource, Stack, StackProps } from 'aws-cdk-lib'
import { AuthorizationType, CognitoUserPoolsAuthorizer, Cors, LambdaIntegration, MethodOptions, ResourceOptions, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { IUserPool } from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';

interface ApiStackProps extends StackProps {
    spacesLambdaIntegration: LambdaIntegration;
    userPool: IUserPool;
}

export class ApiStack extends Stack {

    constructor(scope: Construct, id: string, props: ApiStackProps) {
        super(scope, id, props);

        const api = new RestApi(this, 'SpacesApi');

        const idTokenAuthorizer = new CognitoUserPoolsAuthorizer(this, 'SpacesApiAuthorizer', {
          cognitoUserPools: [props.userPool],
          identitySource: 'method.request.header.Authorization',
        });
        idTokenAuthorizer._attachToApi(api);

        const optionsWithAuth: MethodOptions = {
          authorizationType: AuthorizationType.COGNITO,
          authorizer: {
            authorizerId: idTokenAuthorizer.authorizerId,
          },
        };

        // const optionsWithAuthIAM: MethodOptions = {
        //   authorizationType: AuthorizationType.IAM,
        //   authorizer: {
        //     authorizerId: idTokenAuthorizer.authorizerId,
        //   },
        // };

        const optionsWithCors: ResourceOptions = {
          defaultCorsPreflightOptions: {
            allowOrigins: Cors.ALL_ORIGINS,
            allowMethods: Cors.ALL_METHODS,
            allowHeaders: ['*'],
          }
        };

        const spacesResource = api.root.addResource('spaces', optionsWithCors);
        spacesResource.addMethod('GET', props.spacesLambdaIntegration, optionsWithAuth);
        spacesResource.addMethod('POST', props.spacesLambdaIntegration, optionsWithAuth);
        spacesResource.addMethod('PUT', props.spacesLambdaIntegration, optionsWithAuth);
        spacesResource.addMethod('DELETE', props.spacesLambdaIntegration, optionsWithAuth);
    }
}