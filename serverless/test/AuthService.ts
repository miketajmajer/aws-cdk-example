import { Amplify } from "aws-amplify";
import { SignInOutput, fetchAuthSession, signIn } from "@aws-amplify/auth";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";

export const awsRegion = "us-east-1";
export const spacesApiEndpoint = 'https://lki9rp3gpe.execute-api.us-east-1.amazonaws.com/prod/';

const awsUserPoolId = "us-east-1_wdmTGT2BZ";
const awsIdentityPoolId = "us-east-1:768704ec-3208-4d88-8789-9afaa15caec7";
const awsUserPoolClientId = "34bfom4jb4cdqpngp05msqlskb";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: awsUserPoolId,
      userPoolClientId: awsUserPoolClientId,
      identityPoolId: awsIdentityPoolId,
    },
  },
});

export class AuthService {
  public async login(userName: string, password: string) {
    const signInOutput: SignInOutput = await signIn({
      username: userName,
      password: password,
      options: {
        authFlowType: "USER_PASSWORD_AUTH",
      },
    });
    return signInOutput;
  }

  /**
   * call only after login
   */
  public async getIdToken() {
    const authSession = await fetchAuthSession();
    return authSession.tokens?.idToken?.toString();
  }

  public async generateTemporaryCredentials() {
    const idToken = await this.getIdToken();
    const cognitoUserPool = `cognito-idp.${awsRegion}.amazonaws.com/${awsUserPoolId}`;
    const cognitoIdentity = new CognitoIdentityClient({
      credentials: fromCognitoIdentityPool({
        identityPoolId: awsIdentityPoolId,
        logins: {
          [cognitoUserPool]: idToken!,
        },
      }),
    });
    // "iss": "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_wFFkzqFBH",
    const credentials = await cognitoIdentity.config.credentials();
    return credentials;
  }
}
