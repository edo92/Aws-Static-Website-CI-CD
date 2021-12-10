import * as types from '@types';
import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as pipelineProject from './project';

interface PipelineProjectProps {
   region: string;
   account: string;
   bucketName: string;
   github: types.IGithub;
}

export class ProjectPipeline extends cdk.Construct {
   public readonly bucket: s3.IBucket;
   public readonly buildArtifact: codepipeline.Artifact;
   public readonly sourceArtifact: codepipeline.Artifact;
   public readonly project: pipelineProject.PipelineProject;

   constructor(scope: cdk.Construct, id: string, props: PipelineProjectProps) {
      super(scope, id);

      /**
       *
       * Source artifacts
       */
      this.buildArtifact = new codepipeline.Artifact();
      this.sourceArtifact = new codepipeline.Artifact();

      /**
       *
       * Bucket
       */
      this.bucket = s3.Bucket.fromBucketName(this, 'SourceCode-Bucket', props.bucketName);

      /**
       *
       * Project
       */
      this.project = new pipelineProject.PipelineProject(this, 'Project-Pipeline', {
         region: props.region,
         account: props.account,
      });
   }
}
