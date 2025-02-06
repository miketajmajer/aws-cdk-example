import { CfnOutput, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { AttributeType, ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { getSuffixFromStack } from '../Utils';

export class DataStack extends Stack {
  public readonly table: ITable;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const suffix = getSuffixFromStack(this);

    this.table = new Table(this, 'LambdaTable', {
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING
      },
      tableName: `DataStack-${suffix}`,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    new CfnOutput(this, 'TableName', { value: this.table.tableName });
  }
}
