import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { v4 } from "uuid";

async function postHandler(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {
  const randomId = v4();
  const item = JSON.parse(event.body ?? '{}');
  item.id = randomId;

  await ddbClient.send(new PutItemCommand({
    TableName: process.env.TABLE_NAME,
    Item: marshall({
      id: item.id,
      location: item.location,
    })
  }));

  return {
    statusCode: 201,
    body: JSON.stringify({ id: item.id }),
  } as APIGatewayProxyResult;
}

export { postHandler };