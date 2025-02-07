import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from "aws-lambda";
import { v4 } from "uuid";
import { S3Client, ListBucketsCommand } from '@aws-sdk/client-s3';

const client = new S3Client({});

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

  const command = new ListBucketsCommand({});
  const listBucketsResult = (await client.send(command)).Buckets;
  console.info(`Buckets: ${JSON.stringify(listBucketsResult)}`);

  console.warn(`be careful, here comes the event data!`);
  console.log(event);
  return {
    statusCode: 200,
    body: JSON.stringify({ message: `Hello World! My table is '${process.env.TABLE_NAME}' a uuid is ${v4()} and I have `
      + `${listBucketsResult?.length} buckets named: '${JSON.stringify(listBucketsResult ?? [])}'` }),
  } as APIGatewayProxyResult;
}

export { handler };