import * as types from '@types';
import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codepipeline from '@aws-cdk/aws-codepipeline';

import * as projectPipeline from '@construct/ProjectPipeline';
import * as pipelineActions from './actions';

interface PipelineProps {
   region: string;
   account: string;
   bucket: s3.Bucket;
   github: types.IGithub;
   cache: codebuild.PipelineProject;
}

export class Pipeline extends cdk.Construct {
   public readonly pipeline: codepipeline.Pipeline;
   public readonly buildArtifact: codepipeline.Artifact;
   public readonly sourceArtifact: codepipeline.Artifact;

   constructor(scope: cdk.Construct, id: string, props: PipelineProps) {
      super(scope, id);

      /**
       *
       * Project build artifacts
       */
      this.buildArtifact = new codepipeline.Artifact();
      this.sourceArtifact = new codepipeline.Artifact();

      /**
       *
       * Project
       */
      const project = new projectPipeline.PipelineProject(this, 'Project-Pipeline', {
         region: props.region,
         account: props.account,
      });

      /**
       *
       * Project pipeline stage actions
       */
      const actions = new pipelineActions.PipelineActions(this, 'Pipeline-Actions', {
         project,
         cache: props.cache,
         github: props.github,
         bucket: props.bucket,
         buildArtifact: this.buildArtifact,
         sourceArtifact: this.sourceArtifact,
      });

      /**
       *
       * Project Pipeline stages
       */
      this.pipeline = new codepipeline.Pipeline(this, 'Pipeline-Stage', {
         pipelineName: 'Project-Pipeline',
         stages: [
            {
               stageName: 'Source',
               actions: [actions.sourceAction],
            },
            {
               stageName: 'Build',
               actions: [actions.buildAction],
            },
            {
               stageName: 'Deploy',
               actions: [actions.deployAction],
            },
            {
               stageName: 'Cache',
               actions: [actions.invalidateAction],
            },
         ],
      });
   }
}
