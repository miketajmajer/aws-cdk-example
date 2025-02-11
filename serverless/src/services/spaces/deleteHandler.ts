import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DeleteItemCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { hasGroup, SpacesGroups } from "../shared/utils";

async function deleteHandler(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {
  const isAuthorised = hasGroup(event, SpacesGroups.admins);
  if (!isAuthorised) {
    return {
      statusCode: 403,
      body: JSON.stringify('forbidden'),
    } as APIGatewayProxyResult;
  }

  const id = event?.queryStringParameters?.id;
  if (!id) {
    return {
      statusCode: 422,
      body: JSON.stringify('id parameter not provided'),
    } as APIGatewayProxyResult;
  }

  await ddbClient.send(new DeleteItemCommand({
    TableName: process.env.TABLE_NAME,
    Key: marshall({ id }),
  }));

  return {
    statusCode: 200, // could be a 204, but we want to show the result body
    body: JSON.stringify(`deleted ${id}`),
  } as APIGatewayProxyResult;
}

export { deleteHandler };