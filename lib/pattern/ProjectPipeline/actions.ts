import * as types from '@types';
import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as pipelineActions from '@aws-cdk/aws-codepipeline-actions';
//
import * as pipelineProject from '@construct/ProjectPipeline';

interface PipelineActionsProps {
   bucket: s3.IBucket;
   github: types.IGithub;
   buildArtifact: codepipeline.Artifact;
   sourceArtifact: codepipeline.Artifact;
   project: pipelineProject.PipelineProject;
   cache: codebuild.PipelineProject;
}

export class PipelineActions extends cdk.Construct {
   public readonly buildAction: pipelineActions.CodeBuildAction;
   public readonly deployAction: pipelineActions.S3DeployAction;
   public readonly sourceAction: pipelineActions.GitHubSourceAction;
   public readonly invalidateAction: pipelineActions.CodeBuildAction;

   constructor(scope: cdk.Construct, id: string, props: PipelineActionsProps) {
      super(scope, id);

      /**
       *
       * Source Action
       */
      this.sourceAction = new pipelineActions.GitHubSourceAction({
         actionName: 'GitHub',
         repo: props.github.repo,
         owner: props.github.owner,
         branch: props.github.branch,
         output: props.sourceArtifact,
         oauthToken: cdk.SecretValue.secretsManager(props.github.secretToken),
      });

      /**
       *
       * Build action
       */
      this.buildAction = new pipelineActions.CodeBuildAction({
         actionName: 'Project-Build',
         project: props.project,
         input: props.sourceArtifact,
         outputs: [props.buildArtifact],
      });

      /**
       *
       * Deploy action
       */
      this.deployAction = new pipelineActions.S3DeployAction({
         bucket: props.bucket,
         input: props.buildArtifact,
         actionName: 'Project-Deployment',
      });

      /**
       *
       * Invalidate action
       */
      this.invalidateAction = new pipelineActions.CodeBuildAction({
         project: props.cache,
         input: props.buildArtifact,
         actionName: 'InvalidateCache',
      });
   }
}
