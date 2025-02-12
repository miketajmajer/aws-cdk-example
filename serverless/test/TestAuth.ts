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
}

testAuth().then(() => console.log('done'));