import { Stack, StackProps } from 'aws-cdk-lib';
import { RestApi, LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';

export interface ApiStackProps extends StackProps {
  lambdaIntegration: LambdaIntegration;
  name: string;
}

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const api = new RestApi(this, `${props.name}Api`);
    const resource = api.root.addResource(props.name);
    resource.addMethod('GET', props.lambdaIntegration);
    resource.addMethod('POST', props.lambdaIntegration);
  }
}
