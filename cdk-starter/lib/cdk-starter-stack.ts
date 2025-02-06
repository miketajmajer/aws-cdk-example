import * as cdk from 'aws-cdk-lib';
import { Bucket, CfnBucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

// How to create an L3 Construct
class L3Bucket extends Construct {
  constructor(scope: Construct, id: string, expiration: number) {
    super(scope, id);

    new Bucket(this, id, {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      lifecycleRules: [{
        expiration: cdk.Duration.days(expiration),
      }]
    });
  }
}

export class CdkStarterStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Parameters for this CloudFormation Stck
    const durationParamater = new cdk.CfnParameter(this, 'duration', {
      type: 'Number',
      default: 6,
      minValue: 1,
      maxValue: 10,
    });

    // Create an S3 Bucket via L1
    const cnfBucket = new CfnBucket(this, 'MyL1Bucket', {
      lifecycleConfiguration: {
        rules: [{
          expirationInDays: durationParamater.valueAsNumber,
          status: 'Enabled',
        }]
      }
    });
    // CnfBucket must set policy after creation
    cnfBucket.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

    // Create an S3 Bucket via L2 (more generic)
    const l2Bucket = new Bucket(this, 'MyL2Bucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      lifecycleRules: [{
        expiration: cdk.Duration.days(durationParamater.valueAsNumber),
      }]
    });

    // name must be unique!
    new cdk.CfnOutput(this, 'MyL2BucketName', {
      value: l2Bucket.bucketName,
    })

    // Create an S3 Bucket via L3
    new L3Bucket(this, 'MyL3Bucket', durationParamater.valueAsNumber);
  }
}
