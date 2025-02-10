import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient, GetItemCommand, ScanCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

async function getHandler(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {
  const id = event?.queryStringParameters?.id;
  if (id) {
    const result = await ddbClient.send(new GetItemCommand({
      TableName: process.env.TABLE_NAME,
      Key: marshall({ id }),
    }));
    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify('id not found'),
      } as APIGatewayProxyResult;
    }
    return {
      statusCode: 200,
      body: JSON.stringify(unmarshall(result.Item)),
    } as APIGatewayProxyResult;
  } else {
    const result = await ddbClient.send(new ScanCommand({
      TableName: process.env.TABLE_NAME,
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(result.Items?.map((m) => unmarshall(m))),
    } as APIGatewayProxyResult;
  }
}

export { getHandler };