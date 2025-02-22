import { ListBucketsCommand, S3Client } from "@aws-sdk/client-s3";
import { SignatureV4 } from "@aws-sdk/signature-v4";
import { Sha256 } from "@aws-crypto/sha256-js";
import { defaultProvider } from "@aws-sdk/credential-provider-node";
import { AuthService } from "./AuthService";
import { HttpRequest } from "@aws-sdk/types";
import { awsRegion, spacesApiEndpoint } from "../src/values";

async function testAuth() {
    const service = new AuthService();
    const loginResult = await service.login(
        process.env["aws_username"] ?? 'none',
        process.env["aws_password"] ?? 'none',
    );
    console.log(`loginResult: ${JSON.stringify(loginResult)}`);
    console.log('*****\n');

    const idToken = await service.getIdToken();
    console.log(`token: ${idToken}`);
    console.log('*****\n');

    const delegatedToken = await service.generateTemporaryCredentials();
    console.log(`delegatedToken: ${JSON.stringify(delegatedToken)}`);
    console.log('*****\n');

    const buckets = await listBuckets(delegatedToken);
    console.log(JSON.stringify(buckets.Buckets));
    console.log('*****\n');

    // Not working?
    // const spaces = await listSpaces(delegatedToken);
    // console.log(JSON.stringify(spaces));
    // console.log('*****\n');
}

async function listBuckets(creds: any) {
  const client = new S3Client({
    credentials: creds,
  });
  const command = new ListBucketsCommand({});
  const result = await client.send(command);
  return result;
}

async function signRequest(method: string, url: string) {
  const endpoint = new URL(url);

  const signer = new SignatureV4({
      service: "execute-api",
      region: awsRegion,
      credentials: defaultProvider(),
      sha256: Sha256,
  });

  const signedRequest = await signer.sign({
      method,
      hostname: endpoint.host,
      path: endpoint.pathname + endpoint.search,
      headers: {
          "host": endpoint.host
      }
  } as any as HttpRequest);

  return signedRequest.headers;
}

async function listSpaces(creds: any) {
  try {
    const signedHeaders = await signRequest("GET", spacesApiEndpoint + 'spaces');

    const response = await fetch(spacesApiEndpoint, { headers: signedHeaders });
    console.log("API Response:", await response.json());
  } catch (error: any) {
      console.error("API call failed:", error.response ? error.response.data : error);
  }
}

testAuth().then(() => console.log('done'));