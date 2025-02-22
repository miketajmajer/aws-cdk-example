import * as path from 'path';
import * as fs from 'fs';

// extract data from output.json and create a value.ts file for use in the test code
const deploymnetOutput = require(path.join(__dirname, '..', 'outputs.json'));

const dataSet = {
  awsRegion: 'us-east-1',
  spacesApiEndpoint: '',
  awsUserPoolId: '',
  awsIdentityPoolId: '',
  awsUserPoolClientId: '',
};

dataSet.spacesApiEndpoint = deploymnetOutput.ApiStack[Object.keys(deploymnetOutput.ApiStack)[0]];
dataSet.awsUserPoolId = deploymnetOutput.AuthStack.SpaceUserPoolId;
dataSet.awsIdentityPoolId = deploymnetOutput.AuthStack.SpacesIdentityPoolId;
dataSet.awsUserPoolClientId = deploymnetOutput.AuthStack.SpaceUserPoolClientId;

const valueFile = path.join(__dirname, '..', 'src', 'values.ts');
fs.writeFileSync(valueFile, `// Stack Values
export const awsRegion = '${dataSet.awsRegion}';
export const spacesApiEndpoint = '${dataSet.spacesApiEndpoint}';

export const awsUserPoolId = '${dataSet.awsUserPoolId}';
export const awsIdentityPoolId = '${dataSet.awsIdentityPoolId}';
export const awsUserPoolClientId = '${dataSet.awsUserPoolClientId}';`);
