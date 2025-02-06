import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class DataStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // const table = new Table(this, 'Table', {
    //   partitionKey: { name: 'id', type: AttributeType.STRING },
    //   removalPolicy: RemovalPolicy.DESTROY,
    // });

    // new CfnOutput(this, 'TableName', { value: table.tableName });
  }
}
