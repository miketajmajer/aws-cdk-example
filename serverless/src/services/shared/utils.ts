import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export class JSONParseError extends Error {
  constructor(message: string) {
    super(`JSON.parse Error: ${message}`);
  }
}

export function parseJSON(arg: string): any {
  try {
    return JSON.parse(arg);
  } catch (error: any) {
    throw new JSONParseError(error.message);
  }
}

export enum SpacesGroups {
  admins = 'admins',
  users = 'users',
}

export function hasGroup(event: APIGatewayProxyEvent, group: SpacesGroups): boolean {
  const groups = event?.requestContext?.authorizer?.claims['cognito:groups'];
  if (!groups) {
    return false;
  }
  return groups.includes(SpacesGroups[group]);
}

export function addCorsHeader(arg: APIGatewayProxyResult) {
  if (!arg.headers) {
    arg.headers = {};
  }
  arg.headers = {
    'Access-Control-Allow-Origin': '*', // Any website can use our service!
    'Access-Control-Allow-Methods': '*', // Any HTTP method is allowed!
    'Access-Control-Allow-Credentials': true, // pass creds though as well
  };
}
