import { IAspect } from "aws-cdk-lib";
import { CfnBucket } from "aws-cdk-lib/aws-s3";
import { IConstruct } from "constructs";

export class BucketTagger implements IAspect {
  private readonly key: string;
  private readonly value: string;

  constructor(key: string, value: string) {
    this.key = key;
    this.value = value;
  }

  // iterate through all resources in the stack
  public visit(node: IConstruct): void {
    console.log(`tagger: ${node.node.id}`);
    if (node instanceof CfnBucket) {
      node.tags.setTag(this.key, this.value);
    }
  }
}