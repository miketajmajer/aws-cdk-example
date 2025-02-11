import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { getHandler } from "./getHandler";
import { postHandler } from "./postHandler";
import { putHandler } from "./putHandler";
import { deleteHandler } from "./deleteHandler";
import { MissingFieldError } from "../shared/spaceValidator";
import { JSONParseError } from "../shared/utils";

const ddbClient = new DynamoDBClient({ region: 'us-east-1' });

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  let result: APIGatewayProxyResult = {
    statusCode: 400,
    body: 'Invalid Verb',
  };

  try {
    switch(event.httpMethod) {
      case 'GET':
        result = await getHandler(event, ddbClient);
        break;
      case 'POST':
        result = await postHandler(event, ddbClient);
        break;
      case 'PUT':
        result = await putHandler(event, ddbClient);
        break;
      case 'DELETE':
        result = await deleteHandler(event, ddbClient);
        break;
    }
  } catch (error: any) {
    if (error instanceof MissingFieldError) {
      result = {
        statusCode: 400,
        body: error.message,
      };
    } else if (error instanceof JSONParseError) {
      result = {
        statusCode: 422,
        body: error.message,
      };
    } else {
      result = {
        statusCode: 500,
        body: error.message,
      };
    }
  }

  return result
}

export { handler };