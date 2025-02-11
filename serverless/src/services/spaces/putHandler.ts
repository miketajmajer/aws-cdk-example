import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { hasGroup, SpacesGroups } from "../shared/utils";

async function putHandler(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {
  const isAuthorised = hasGroup(event, SpacesGroups.users);
  if (!isAuthorised) {
    return {
      statusCode: 403,
      body: JSON.stringify('forbidden'),
    } as APIGatewayProxyResult;
  }

  const id = event?.queryStringParameters?.id;
  if (!id || !event.body) {
    return {
      statusCode: 422,
      body: JSON.stringify({ message: 'id parameter not provided' }),
    } as APIGatewayProxyResult;
  }

  const obj = JSON.parse(event.body);
  const itemKey = Object.keys(obj)[0];
  const itemValue = obj[itemKey];

  if (!itemKey || !itemValue) {
    return {
      statusCode: 422,
      body: JSON.stringify('request body is not correct'),
    } as APIGatewayProxyResult;
  }

  const result = await ddbClient.send(new UpdateItemCommand({
    TableName: process.env.TABLE_NAME,
    Key: marshall({ id }),
    UpdateExpression: 'SET #prop = :newValue',
    ExpressionAttributeValues: marshall({ ':newValue': itemValue }),
    ExpressionAttributeNames: {'#prop': itemKey},
    ReturnValues: 'UPDATED_NEW',
  }));

  return {
    statusCode: 202, // accepted, returning a 204 does not return the body
    body: JSON.stringify(result.Attributes),
  } as APIGatewayProxyResult;
}

export { putHandler };