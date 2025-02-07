import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from "aws-lambda";

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  let message: string = "none";
  switch(event.httpMethod) {
    case 'GET':
      message = "Hello from GET";
      break;
    case 'POST':
      message = "Hello from POST";
      break;
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message }),
  } as APIGatewayProxyResult;
}

export { handler };