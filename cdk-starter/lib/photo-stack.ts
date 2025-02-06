import { Construct } from "constructs";
import * as cdk from 'aws-cdk-lib';
import { Bucket, CfnBucket } from "aws-cdk-lib/aws-s3";
import { Fn } from "aws-cdk-lib";

export class PhotosStack extends cdk.Stack {
    private stackSuffix: string;
    public readonly photosBucketArn: string;

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        this.initializeSuffix();

        const myBucket = new Bucket(this, 'PhotosBucket2', { // construct id
            bucketName: `photos-bucket-${this.stackSuffix}`, // physical id
        });
        // save the arn (unique id for the aws resource)
        this.photosBucketArn = myBucket.bucketArn;

        // logical id
        //(myBucket.node.defaultChild as CfnBucket).overrideLogicalId('PhotosBucket2234kj34')

        /*
        export reference for use in other stack (via the Fn.importValue) for the same AWS account and region

        new cdk.CfnOutput(this, 'photos-bucket-arn', {
          value: myBucket.bucketArn,
          exportName: 'photos-bucket-arn',
        });

        const refBucket = Fn.importValue('photos-bucket-arn');
        */
    }

    private initializeSuffix() {
      const shortStackId = Fn.select(2, Fn.split('/', this.stackId));
      this.stackSuffix = Fn.select(4, Fn.split('-', shortStackId));
    }
}