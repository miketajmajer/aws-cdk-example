import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { AuthService } from "./authService";
import { SpaceEntry } from "../components/model/model";
import { configuration } from "../configuration";

export class DataService {
  private readonly authService: AuthService;
  private readonly awsRegion = configuration.awsRegion;
  private s3Client: S3Client | undefined;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public reserveSpace(_spaceId: string) {
    return "123";
  }

  public async getSpaces(): Promise<SpaceEntry[]> {
    const getSpacesResult = await fetch(configuration.spacesUrl, {
      method: "GET",
      headers: {
        Authorization: this.authService.jwtToken!,
      },
    });
    const getSpacesResultJson = await getSpacesResult.json();
    return getSpacesResultJson;
  }

  public async createSpace(name: string, location: string, photo?: File) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const space = {} as any;
    space.name = name;
    space.location = location;
    if (photo) {
      const uploadUrl = await this.uploadPublicFile(photo);
      space.photoUrl = uploadUrl;
    }
    const postResult = await fetch(configuration.spacesUrl, {
      method: "POST",
      body: JSON.stringify(space),
      headers: {
        Authorization: this.authService.jwtToken!,
      },
    });
    const postResultJSON = await postResult.json();
    return postResultJSON.id;
  }

  private async uploadPublicFile(file: File) {
    const credentials = await this.authService.getTemporaryCredentials();
    if (!this.s3Client) {
      this.s3Client = new S3Client({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        credentials: credentials as any,
        region: this.awsRegion,
      });
    }
    const command = new PutObjectCommand({
      Bucket: configuration.DataStack.SpaceFinderPhotosBucketName,
      Key: file.name,
      ACL: "public-read",
      Body: file,
    });
    await this.s3Client.send(command);
    return `https://${command.input.Bucket}.s3.${this.awsRegion}.amazonaws.com/${command.input.Key}`;
  }

  public isAuthorized() {
    return this.authService.isAuthorized();
  }
}
