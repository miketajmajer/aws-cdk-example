#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CdkStarterStack } from '../lib/cdk-starter-stack';
import { PhotosStack } from '../lib/photo-stack';
import { PhotosHandlerStack } from '../lib/photo-handler-stack';
import { BucketTagger } from './tagger';

const app = new cdk.App();
//new CdkStarterStack(app, 'CdkStarterStack');
const photoBucket = new PhotosStack(app, 'PhotosStack');
new PhotosHandlerStack(app, 'PhotosHandlerStack', {
  targetBucketArn: photoBucket.photosBucketArn,
});

// build tagger and run it across the app - use for linter (cdk-nag for example) or other tool
const taggeer = new BucketTagger('level', 'test');
cdk.Aspects.of(app).add(taggeer);