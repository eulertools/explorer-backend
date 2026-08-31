import { Duration, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ecr from "aws-cdk-lib/aws-ecr";
import * as ssm from "aws-cdk-lib/aws-ssm";
import * as s3 from "aws-cdk-lib/aws-s3";
import { GithubEcrPipeline } from "./constructs/github-ecr-pipeline-construct/github-ecr-construct";

export interface PipelineStackProps extends StackProps {
  branchName: string;
}

export class BackendPipelinesStack extends Stack {
  constructor(scope: Construct, id: string, props?: PipelineStackProps) {
    super(scope, id, props);

    const {branchName} = props!;

    const bucketName = ssm.StringParameter.fromStringParameterName(this, 'BucketName', `SharedArtifactsBucket`).stringValue
    const bucket = s3.Bucket.fromBucketName(this, 'ArtifactsBucket', bucketName)

    const repository = new ecr.Repository(this, 'ExplorerBackend', {
      removalPolicy: RemovalPolicy.DESTROY,
    });

    repository.addLifecycleRule({tagPrefixList: ['prod'], maxImageCount: 60});
    repository.addLifecycleRule({maxImageAge: Duration.days(30)});

    new GithubEcrPipeline(this, "github-ecr-explorer-backend", {
      ecrRepository: repository,
      githubRepo: "service-explorer-backend",
      branchName: branchName,
      directoryName: "services",
      artifactBucket: bucket,
      pipelineName: 'backend-services'
    });

    new ssm.StringParameter(this, 'SsmBackend', {
      parameterName: `/repositories/explorer-backend`,
      stringValue: repository.repositoryName
    })

    const nginxRepository = new ecr.Repository(this, 'ExplorerNginx', {
      removalPolicy: RemovalPolicy.DESTROY,
    });
    nginxRepository.addLifecycleRule({tagPrefixList: ['prod'], maxImageCount: 60});
    nginxRepository.addLifecycleRule({maxImageAge: Duration.days(30)});

    new GithubEcrPipeline(this, "github-ecr-explorer-nginx", {
      ecrRepository: nginxRepository,
      githubRepo: "service-explorer-backend",
      branchName: branchName,
      directoryName: "nginx-proxy",
      artifactBucket: bucket,
      pipelineName: 'backend-services-nginx-proxy'
    });

    new ssm.StringParameter(this, 'SsmNginx', {
      parameterName: `/repositories/explorer-backend-nginx`,
      stringValue: nginxRepository.repositoryName
    })
  }
}
