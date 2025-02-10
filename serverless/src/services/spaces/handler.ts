import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { getHandler } from "./getHandler";
import { postHandler } from "./postHandler";

const ddbClient = new DynamoDBClient({ region: 'us-east-1' });

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  let result: APIGatewayProxyResult = {
    statusCode: 400,
    body: JSON.stringify({ message: 'Invalid Verb' }),
  };

  try {
    switch(event.httpMethod) {
      case 'GET':
        result = await getHandler(event, ddbClient);
        break;
      case 'POST':
        result = await postHandler(event, ddbClient);
        break;
    }
  } catch (error: any) {
    result = {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }

  return result
}

export { handler };