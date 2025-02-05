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