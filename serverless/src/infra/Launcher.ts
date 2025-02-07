import { App } from "aws-cdk-lib";
import { DataStack } from "./stacks/DataStack";
import { LambdaStack } from "./stacks/HelloLambdaStack";
import { ApiStack } from "./stacks/ApiStack";
import { SpacesLambdaStack } from "./stacks/SpacesLambdaStack";

const app = new App();
const dataTable = new DataStack(app, "DataStack");
const lambda = new LambdaStack(app, "LambdaStack", {
  dataTable: dataTable.table,
});
const spacesLambda = new SpacesLambdaStack(app, "SpacesLambdaStack", {
  dataTable: dataTable.table,
});
new ApiStack(app, "HelloApi", {
  name: 'hello',
  lambdaIntegration: lambda.helloIntegration
});
new ApiStack(app, "SpacesApi", {
  name: 'spaces',
  lambdaIntegration: spacesLambda.spacesIntegration
});