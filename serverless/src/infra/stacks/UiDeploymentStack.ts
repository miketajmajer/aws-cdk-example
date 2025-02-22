import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
// import { Distribution, OriginAccessIdentity } from "aws-cdk-lib/aws-cloudfront";
// import { S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import { IBucket } from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";
import { existsSync } from "fs";
import { join } from "path";

interface UiDeploymentStackProps extends StackProps {
    deploymentBucket: IBucket;
}

export class UiDeploymentStack extends Stack {

    constructor(scope: Construct, id: string, props: UiDeploymentStackProps) {
        super(scope, id, props);

        const uiDir = join(__dirname, '..', '..', '..', '..', 'frontend', 'dist');

        if (existsSync(uiDir)) {
            new BucketDeployment(this, 'space-finder-ui-deployment', {
                destinationBucket: props.deploymentBucket,
                sources: [
                    Source.asset(uiDir)
                ]
            });

            new CfnOutput(this, 'space-finder-ui-deploymentS3Url', {
                value: props.deploymentBucket.bucketWebsiteUrl
            });

            // const originAccessIdentity = new OriginAccessIdentity(this, 'OriginAccessIdentity');
            // props.deploymentBucket.grantRead(originAccessIdentity);

            // const distribution = new Distribution(this, 'space-finder-ui-distribution', {
            //   defaultRootObject: 'index.html',
            //   defaultBehavior: {
            //     origin: new S3Origin(props.deploymentBucket, {
            //         originAccessIdentity
            //     })
            //   }
            // });
            // new CfnOutput(this, 'space-finder-ui-distributionUrl', {
            //   value: distribution.distributionDomainName,
            // });
        } else {
            console.warn('Ui directory not found: ' + uiDir)
        }

    }
}