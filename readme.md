# AWS & Typescript Masterclass - CDK, Serverless, React

## Notes

From: https://www.udemy.com/course/aws-typescript-cdk-serverless-react

node: 23.7

aws-cli: aws-cli/2.23.12

Created an IAM user aws-cli with access key (not the IAM Identity Center!)

Created user, set to us-east-1/json and ready to go!

## Setup

We don't have a package.json, so we install the packages globally.

```
npm i -g typescript
npm i -g ts-node
npm i -g aws-cdk
```

## Doco

[CDK Documentation](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-construct-library.html)

##

Commands:
1. cdk init app --language typescript - build a new project
1. cdk bootstrap - add the CDK metadata to the CloudFormation Stacks (Each AWS account and region needs to be bootstrapped only once)
1. cdk deploy [stack name] - build (cdk.out) and deploy the new stack
1. cdk synth - regenerate the cdk.out folder (not deploy)
1. cdk diff - compare deployed stack with current state
1. cdk list - list the stacks
1. cdk doctor - check for problems
1. cdk destroy - delete everything

##

Removed this import for simple query service:
```
// https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_sqs-readme.html
import * as sqs from 'aws-cdk-lib/aws-sqs'; //NOSONAR
```

## Patameters

```
    const durationParamater = new cdk.CfnParameter(this, 'duration', {
      type: 'Number',
      default: 6,
      minValue: 1,
      maxValue: 10,
    });
```
```
cdk deploy --parameters duration=5
```

## Secrets

https://medium.com/@davidkelley87/deploying-secrets-with-aws-cdk-f6728352c9d9

```
const parameterName = new CfnParameter(this, 'apiKey', {
  type: 'String',
  noEcho: true
});

const apiKeySecret = new secrets.Secret(this, 'API Key', {
  secretName: 'apiKey',
  secretStringValue: SecretValue.unsafePlainText(
    secretApiKey.valueAsString
  ),
});

npx cdk deploy --parameters apiKey=1234567890
```

Better way is to use the AWS Lambda Parameter Store Extension:

```
// CDK code
const layerVersionArn = 'arn:aws:lambda:us-east-1:177933569100:layer:AWS-Parameters-and-Secrets-Lambda-Extension:4';

// note: The AWS Parameters and Secrets Lambda Extension is a cache that stores
// parameters and secrets for AWS Lambda functions. It's a Lambda layer that can be added to
// new or existing Lambda functions.

const lambdaFunction = new lambda.Function(this, 'MyLambdaFunction', {
  code: lambda.Code.fromAsset('lambda'),
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_18_X,
  layers: [
    lambda.LayerVersion.fromLayerVersionArn(this, 'Layer', layerVersionArn)
  ]
});

apiKeySecret.grantRead(lambdaFunction);

lambdaFunction.addToRolePolicy(
  new iam.PolicyStatement({
    actions: ['ssm:GetParameter'],
    resources: ['*']
  })
);
```

And in the Lambda:
```
import { URL } from 'node:url';

secretPath = new URL('/systemsmanager/parameters/get', 'http://localhost:2772');

secretPath.searchParams.set('name', '/aws/reference/secretsmanager/apiKey');

const secretValue = await fetch(secretPath.toString(), {
  headers: {
    'X-Aws-Parameters-Secrets-Token': process.env.AWS_SESSION_TOKEN
  }
}).then((res) => res.text()))

export const handler = async () => {
    return { secretValue };
};
```

This way the secret is pulled from the AWS Secrets Manager, and never
visiable in the CDK and only accessable due to the explicet granting access to the lambda service.

## Cognito Authorization

# How to fix a user
```
aws cognito-idp admin-set-user-password --user-pool-id "pool id" --username "user name" --password "password here" --permanent
```

# How to capture outputs from deploy
```
cdk deploy --all --outputs-file outputs.json
```

# IAM policy Conditions

This is needed to map a token to a set of IAM policies for access to resources (via delegation or normal).

[Fine-grained access control](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/specifying-conditions.html)

```json
"Condition":{
    "ForAllValues:StringEquals":{
        "dynamodb:LeadingKeys":[
            "${www.amazon.com:user_id}"
        ],
        "dynamodb:Attributes":[
            "UserId",
            "GameTitle",
            "Wins",
            "Losses",
            "TopScore",
            "TopScoreDateTime"
        ]
    },
    "StringEqualsIfExists":{
        "dynamodb:Select":"SPECIFIC_ATTRIBUTES"
    }
}
```

Also see:
1. ForAllValues:StringNotLike
1. ForAllValues:StringNotEquals
1. StringNotEqualsIgnoreCase
1. ForAllValues

[Stack Overflow](https://stackoverflow.com/questions/46062084/how-to-provide-multiple-stringnotequals-conditions-in-aws-policy)

# If AWS caches the web deployment

run:
```bash
aws cloudfront create-invalidation --distribution-id The-S3-Distribution-ID --paths "/*"
```

The ID is findable in the UiDeploymentStack SpacesFinderDistributionNNNN -> Physical ID
