import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from "aws-lambda";
import { v4 } from "uuid";

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  console.warn(`be careful, here comes the event data!`);
  console.log(event);
  return {
    statusCode: 200,
    body: JSON.stringify({ message: `Hello World! My table is '${process.env.TABLE_NAME}' a uuid is ${v4()}` }),
  } as APIGatewayProxyResult;
}

export { handler };