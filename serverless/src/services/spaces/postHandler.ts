import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { v4 } from "uuid";
import { validateAsSpaceEntry } from "../shared/spaceValidator";
import { parseJSON } from "../shared/utils";
import { hasGroup, SpacesGroups } from "../../infra/Utils";

async function postHandler(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {
  const isAuthorised = hasGroup(event, SpacesGroups.users);
  if (!isAuthorised) {
    return {
      statusCode: 403,
      body: JSON.stringify('forbidden'),
    } as APIGatewayProxyResult;
  }

  const randomId = v4();
  const item = parseJSON(event.body ?? ''); // the empty string will cause a JSONParseError
  item.id = randomId;

  if (validateAsSpaceEntry(item)) {
    await ddbClient.send(new PutItemCommand({
      TableName: process.env.TABLE_NAME,
      Item: marshall({
        id: item.id,
        name: item.name,
        protoUrl: item.protoUrl ?? '',
        location: item.location,
      })
    }));

    return {
      statusCode: 201,
      body: JSON.stringify({ id: item.id }),
    } as APIGatewayProxyResult;
  }
  // noop
  throw new Error('Invalid Space Entry');
}

export { postHandler };