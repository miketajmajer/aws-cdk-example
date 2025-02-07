import { Stack, StackProps } from 'aws-cdk-lib';
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path';

export interface SpacesLambdaStackProps extends StackProps {
  dataTable: ITable;
}

export class SpacesLambdaStack extends Stack {
  public readonly spacesIntegration;
  constructor(scope: Construct, id: string, props: SpacesLambdaStackProps) {
    super(scope, id, props);

    const helloLambda = new NodejsFunction(this, 'SpacesLambda', {
      runtime: Runtime.NODEJS_22_X,
      handler: 'handler',
      entry: (join(__dirname, '..', '..','services', 'spaces', 'spaces.ts')),
      bundling: { minify: true, sourceMap: true },
      environment: {
        TABLE_NAME: props.dataTable.tableName,
        NODE_OPTIONS: '--enable-source-maps',
      }
    });

    this.spacesIntegration = new LambdaIntegration(helloLambda);
  }
}
