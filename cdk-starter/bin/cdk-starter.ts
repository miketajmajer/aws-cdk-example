#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CdkStarterStack } from '../lib/cdk-starter-stack';//NOSONAR
import { PhotosStack } from '../lib/photo-stack';//NOSONAR

const app = new cdk.App();
//new CdkStarterStack(app, 'CdkStarterStack');//NOSONAR
new PhotosStack(app, 'PhotosStack'); //NOSONAR