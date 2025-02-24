import { CfnOutput, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib'
import { AttributeType, ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { Bucket, HttpMethods, IBucket, ObjectOwnership } from 'aws-cdk-lib/aws-s3';
import { getSuffixFromStack } from '../Utils';


export class DataStack extends Stack {

    public readonly spacesTable: ITable
    public readonly deploymentBucket: IBucket;
    public readonly photosBucket: IBucket;

    constructor(scope: Construct, id: string, props?: StackProps) {
      super(scope, id, props);

      const suffix = getSuffixFromStack(this);

      this.photosBucket = new Bucket(this, 'SpaceFinderPhotos', {
        bucketName: `space-finder-photos-${suffix}`,
        cors: [{
            allowedMethods: [
                HttpMethods.HEAD,
                HttpMethods.GET,
                HttpMethods.PUT
            ],
            allowedOrigins: ['*'],
            allowedHeaders: ['*']
        }],
        // accessControl: BucketAccessControl.PUBLIC_READ,
        objectOwnership: ObjectOwnership.OBJECT_WRITER,
        blockPublicAccess: {
            blockPublicAcls: false,
            blockPublicPolicy: false,
            ignorePublicAcls: false,
            restrictPublicBuckets: false,
        },
        removalPolicy: RemovalPolicy.DESTROY,
      });
      new CfnOutput(this, 'SpaceFinderPhotosBucketName', {
          value: this.photosBucket.bucketName
      });

      this.deploymentBucket = new Bucket(this, 'SpaceFinderFrontend', {
        bucketName: `space-finder-frontend-${suffix}`,
        publicReadAccess: true,
        blockPublicAccess: {
          blockPublicAcls: false,
          blockPublicPolicy: false,
          ignorePublicAcls: false,
          restrictPublicBuckets: false
        },
        websiteIndexDocument: 'index.html',
        removalPolicy: RemovalPolicy.DESTROY,
      });

      this.spacesTable = new Table(this, 'SpacesTable', {
          partitionKey : {
              name: 'id',
              type: AttributeType.STRING
          },
          tableName: `SpaceTable-${suffix}`
      });
    }
}