import { App } from "aws-cdk-lib";
import { DataStack } from "./stacks/DataStack";
import { LambdaStack } from "./stacks/LambdaStack";
import { ApiStack } from "./stacks/ApiStack";

const app = new App();
const dataTable = new DataStack(app, "DataStack");
const lambda = new LambdaStack(app, "LambdaStack", {
  dataTable: dataTable.table,
});
new ApiStack(app, "HelloApi", {
  helloLambdaIntegration: lambda.helloIntegration
});