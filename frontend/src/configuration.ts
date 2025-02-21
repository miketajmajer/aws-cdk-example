import { ApiStack, AuthStack, DataStack } from '../../serverless/outputs.json';

const awsRegion = 'eu-east-1';
const spacesUrl = ApiStack.SpacesApiEndpoint36C4F3B6 + 'spaces'

export const configuration = {
  ApiStack,
  AuthStack,
  awsRegion,
  DataStack,
  spacesUrl,
};