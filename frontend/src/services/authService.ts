import { type CognitoUser } from '@aws-amplify/auth';
import { Amplify, Auth } from 'aws-amplify';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';

import { configuration } from '../configuration';

Amplify.configure({
    Auth: {
        mandatorySignIn: false,
        region: configuration.awsRegion,
        userPoolId: configuration.AuthStack.SpaceUserPoolId,
        userPoolWebClientId: configuration.AuthStack.SpaceUserPoolClientId,
        identityPoolId: configuration.AuthStack.SpacesIdentityPoolId,
        authenticationFlowType: 'USER_PASSWORD_AUTH'
    }
});

export class AuthService {

    private user: CognitoUser | undefined;
    public jwtToken: string | undefined;
    private temporaryCredentials: object | undefined;

    public isAuthorized(){
        if (this.user) {
            return true;
        }
        return false;
    }


    public async login(userName: string, password: string): Promise<object | undefined> {
        try {
            this.user = await Auth.signIn(userName, password) as CognitoUser;
            this.jwtToken = this.user?.getSignInUserSession()?.getIdToken().getJwtToken();
            return this.user;
        } catch (error) {
            console.error(error);
            return undefined
        }
    }

    public async getTemporaryCredentials(){
        if (this.temporaryCredentials) {
            return this.temporaryCredentials;
        }
        this.temporaryCredentials = await this.generateTemporaryCredentials();
        return this.temporaryCredentials;
    }

    public getUserName() {
        return this.user?.getUsername();
    }

    private async generateTemporaryCredentials() {
        const cognitoIdentityPool = `cognito-idp.${configuration.awsRegion}.amazonaws.com/${configuration.AuthStack.SpaceUserPoolId}`;
        const cognitoIdentity = new CognitoIdentityClient({
            credentials: fromCognitoIdentityPool({
                clientConfig: {
                    region: configuration.awsRegion
                },
                identityPoolId: configuration.AuthStack.SpacesIdentityPoolId,
                logins: {
                    [cognitoIdentityPool]: this.jwtToken!
                }
            })
        });
        const credentials = await cognitoIdentity.config.credentials();
        return credentials;
    }
}