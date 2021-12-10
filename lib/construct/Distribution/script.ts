import * as cdk from '@aws-cdk/core';
import * as codebuild from '@aws-cdk/aws-codebuild';

interface InvalidationProps {
   distributionId: string;
}

export class Invalidation extends codebuild.PipelineProject {
   public readonly invalidation: codebuild.PipelineProject;

   constructor(scope: cdk.Construct, id: string, props: InvalidationProps) {
      super(scope, id, {
         buildSpec: codebuild.BuildSpec.fromObject({
            version: '0.2',
            phases: {
               build: {
                  commands: [
                     // eslint-disable-next-line max-len
                     'aws cloudfront create-invalidation --distribution-id ${CLOUDFRONT_ID} --paths "/*"',
                  ],
               },
            },
         }),
         environmentVariables: {
            CLOUDFRONT_ID: { value: props.distributionId },
         },
      });
   }
}
