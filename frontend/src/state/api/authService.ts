import { type CognitoUser } from '@aws-amplify/auth';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';
import { Auth } from 'aws-amplify';
//import { Amplify, Auth } from 'aws-amplify';

import { selectIdToken } from '../slices/authSlice';
import { configuration } from '../../configuration';
import { RootState } from '../store/store';
import { createAsyncThunk } from '@reduxjs/toolkit';

// Amplify.configure({
//   Auth: {
//       mandatorySignIn: false,
//       region: configuration.awsRegion,
//       userPoolId: configuration.AuthStack.SpaceUserPoolId,
//       userPoolWebClientId: configuration.AuthStack.SpaceUserPoolClientId,
//       identityPoolId: configuration.AuthStack.SpacesIdentityPoolId,
//       authenticationFlowType: 'USER_PASSWORD_AUTH'
//   }
// });

async function cognitoLogin(args: {userName: string, password: string}) {
  try {
    // this will trigger the Hub in the slice
    const data = await Auth.signIn(args.userName, args.password) as CognitoUser;
    return data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error in login', error);
    throw error;
  }
}

// // use this with the slice (should be a better experience!)
// const cognitoLoginThunk = createAsyncThunk(
//   'auth/cognitoLogin',
//   async (args: {userName: string, password: string}, thunkApi) => {
//     try {
//       return cognitoLogin(args);
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     } catch (error: any) {
//       return thunkApi.rejectWithValue(error.message);
//     }
//   }
// );

const generateTemporaryCredentialsThunk = createAsyncThunk(
  'auth/generateTemporaryCredentials',
  async (_, thunkApi) => {
    try {
      // Should we pass the idToken into the thunk? which is a better practice?
      const idToken = selectIdToken(thunkApi.getState() as RootState)!;
      const cognitoIdentityPool = `cognito-idp.${configuration.awsRegion}.amazonaws.com/${configuration.AuthStack.SpaceUserPoolId}`;
      const cognitoIdentity = new CognitoIdentityClient({
          credentials: fromCognitoIdentityPool({
              clientConfig: {
                  region: configuration.awsRegion
              },
              identityPoolId: configuration.AuthStack.SpacesIdentityPoolId,
              logins: {
                  [cognitoIdentityPool]: idToken,
              }
          })
      });
      return cognitoIdentity.config.credentials();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

export { cognitoLogin, generateTemporaryCredentialsThunk };
