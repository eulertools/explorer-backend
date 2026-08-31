#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { BackendPipelinesStack } from "../lib/service-backend-pipeline";

const app = new cdk.App();

const branch = process.env.CDK_DEFAULT_ACCOUNT == process.env.CDK_DEV_ACCOUNT ? 'development' : 'main';

new BackendPipelinesStack(app, 'ExplorerBackend', {
  branchName: branch,
  description: "Creates ECR Images from Github for the service-explorers-backend",
  env: {account: process.env.CDK_DEFAULT_ACCOUNT, region: 'eu-west-1'},
});
