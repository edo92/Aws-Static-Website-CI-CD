import * as types from '@types';
import * as cdk from '@aws-cdk/core';
import * as cdkPipeline from '@construct/CdkPipeline';

interface CdkPipelineProps {
   github: types.IGithub;
}

export class CdkPipeline extends cdk.Construct {
   public readonly pipeline: cdkPipeline.Pipeline;

   constructor(scope: cdk.Construct, id: string, props: CdkPipelineProps) {
      super(scope, id);

      this.pipeline = new cdkPipeline.Pipeline(this, 'Cdk-Pipeline', {
         github: props.github,
      });
   }
}
