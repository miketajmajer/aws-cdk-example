import { Stack, StackProps } from 'aws-cdk-lib';
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { Code, Function as LambdaFunction, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { join } from 'path';

export interface LambdaStackProps extends StackProps {
  dataTable: ITable;
}

export class LambdaStack extends Stack {
  public readonly helloLambdaIntegration;
  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    const helloLambda = new LambdaFunction(this, 'HelloLambda', {
      runtime: Runtime.NODEJS_22_X,
      handler: 'hello.main',
      code: Code.fromAsset(join(__dirname, '..', '..', 'services')),
      environment: {
        TABLE_NAME: props.dataTable.tableName,
      }
    });

    this.helloLambdaIntegration = new LambdaIntegration(helloLambda);
  }
}
