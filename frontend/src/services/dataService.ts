import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { AuthService } from "./authService";
import { DataStack, ApiStack } from '../../../serverless/outputs.json';
import { SpaceEntry } from "../components/model/model";

const spacesUrl = ApiStack.SpacesApiEndpoint36C4F3B6 + 'spaces'


export class DataService {

    private authService: AuthService;
    private s3Client: S3Client | undefined;
    private awsRegion = 'eu-west-1';

    constructor(authService: AuthService) {
        this.authService = authService;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public reserveSpace(_spaceId: string) {
        return '123';
    }

    public async getSpaces():Promise<SpaceEntry[]>{
        const getSpacesResult = await fetch(spacesUrl, {
            method: 'GET',
            headers: {
                'Authorization': this.authService.jwtToken!
            }
        });
        const getSpacesResultJson = await getSpacesResult.json();
        return getSpacesResultJson;
    }


    public async createSpace(name: string, location:string, photo?: File){
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const space = {} as any;
        space.name = name;
        space.location = location
        if (photo) {
            const uploadUrl = await this.uploadPublicFile(photo);
            space.photoUrl = uploadUrl
        }
        const postResult = await fetch(spacesUrl, {
            method: 'POST',
            body: JSON.stringify(space),
            headers: {
                'Authorization': this.authService.jwtToken!
            }
        });
        const postResultJSON = await postResult.json();
        return postResultJSON.id
    }

    private async uploadPublicFile(file: File){
        const credentials = await this.authService.getTemporaryCredentials();
        if (!this.s3Client) {
            this.s3Client = new S3Client({
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                credentials: credentials as any,
                region: this.awsRegion
            });
        }
        const command = new PutObjectCommand({
            Bucket: DataStack.SpaceFinderPhotosBucketName,
            Key: file.name,
            ACL: 'public-read',
            Body: file
        });
        await this.s3Client.send(command);
        return `https://${command.input.Bucket}.s3.${this.awsRegion}.amazonaws.com/${command.input.Key}`
    }

    public isAuthorized(){
        return this.authService.isAuthorized();
    }
}