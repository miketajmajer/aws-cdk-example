import * as cdk from 'aws-cdk-lib';
import { Bucket, CfnBucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

// How to create an L3 Construct
class L3Bucket extends Construct {
  constructor(scope: Construct, id: string, expiration: number) {
    super(scope, id);

    new Bucket(this, id, {
      lifecycleRules: [{
        expiration: cdk.Duration.days(expiration),
      }]
    });
  }
}

export class CdkStarterStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) { //NOSONAR
    super(scope, id, props);

    // Create an S3 Bucket via L1
    new CfnBucket(this, 'MyL1Bucket', {
      lifecycleConfiguration: {
        rules: [{
          expirationInDays: 2,
          status: 'Enabled',
        }]
      }
    });

    // Create an S3 Bucket via L2 (more generic)
    const b1 = new Bucket(this, 'MyL2Bucket', {
      lifecycleRules: [{
        expiration: cdk.Duration.days(2),
      }]
    });
    // name must be unique!
    new cdk.CfnOutput(this, 'MyL2BucketName', { //NOSONAR
      value: b1.bucketName,
    })

    // Create an S3 Bucket via L3
    new L3Bucket(this, 'MyL3Bucket', 2); //NOSONAR
  }
}
