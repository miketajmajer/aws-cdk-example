import { AuthService } from "./AuthService";


async function testAuth() {
    const service = new AuthService();
    const loginResult = await service.login(
        process.env["aws_username"] ?? 'none',
        process.env["aws_password"] ?? 'none',
    );
    console.log(`loginResult: ${JSON.stringify(loginResult)}`);
    const idToken = await service.getIdToken();
    console.log(`token: ${idToken}`);
}

testAuth().then(() => console.log('done'));