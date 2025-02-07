import { Stack, StackProps } from 'aws-cdk-lib';
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path';

export interface LambdaStackProps extends StackProps {
  dataTable: ITable;
}

export class LambdaStack extends Stack {
  public readonly helloIntegration;
  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    const helloLambda = new NodejsFunction(this, 'HelloLambda', {
      runtime: Runtime.NODEJS_22_X,
      handler: 'handler',
      entry: (join(__dirname, '..', '..','services', 'hello', 'hello.ts')),
      bundling: { minify: true, sourceMap: true },
      environment: {
        TABLE_NAME: props.dataTable.tableName,
        NODE_OPTIONS: '--enable-source-maps',
      }
    });

    helloLambda.addToRolePolicy(new PolicyStatement({
      effect: Effect.ALLOW,
      actions: [
        's3:ListAllMyBuckets',
        's3:ListBucket',
      ],
      resources: ['*'], // bad!
    }));

    this.helloIntegration = new LambdaIntegration(helloLambda);
  }
}
