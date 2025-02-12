import { ListBucketsCommand, S3Client } from "@aws-sdk/client-s3";
import { AuthService } from "./AuthService";


async function testAuth() {
    const service = new AuthService();
    const loginResult = await service.login(
        process.env["aws_username"] ?? 'none',
        process.env["aws_password"] ?? 'none',
    );
    console.log(`loginResult: ${JSON.stringify(loginResult)}`);
    console.log('\n*****');

    const idToken = await service.getIdToken();
    console.log(`token: ${idToken}`);
    console.log('\n*****');

    const delegatedToken = await service.generateTemporaryCredentials();
    console.log(`delegatedToken: ${JSON.stringify(delegatedToken)}`);
    console.log('\n*****');

    const buckets = await listBuckets(delegatedToken);
    console.log(buckets);
    console.log('\n*****');
}

async function listBuckets(creds: any) {
  const client = new S3Client({
    credentials: creds,
  });
  const command = new ListBucketsCommand({});
  const result = await client.send(command);
  return result;
}

testAuth().then(() => console.log('done'));