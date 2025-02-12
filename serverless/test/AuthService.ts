import { Amplify } from "aws-amplify";
import { SignInOutput, fetchAuthSession, signIn } from "@aws-amplify/auth";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";

const awsRegion = "us-east-1";
const awsUserPoolId = "us-east-1_wFFkzqFBH";
const awsIdentityPoolId = "us-east-1:29bfe108-e0e0-4ca9-bc67-2a00270a94f2";
const awsUserPoolClientId = "120roe2g6emr15vl8bs1u4tlhs";

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
