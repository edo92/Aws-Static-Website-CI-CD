import * as cdk from '@aws-cdk/core';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as pipelineActions from '@aws-cdk/aws-codepipeline-actions';

import { CachePolicy } from './policy';
import { Invalidation } from './script';

interface CacheInvalidationProps {
   account: string;
   distributionId: string;
   artifact: codepipeline.Artifact;
}

export class CacheInvalidation extends cdk.Construct {
   public readonly invalidateAction: pipelineActions.CodeBuildAction;

   constructor(scope: cdk.Construct, id: string, props: CacheInvalidationProps) {
      super(scope, id);

      /**
       *
       *
       */
      const invalidateBuildProject = new Invalidation(this, 'Invalidation', {
         distributionId: props.distributionId,
      });

      /**
       *
       *
       */
      invalidateBuildProject.addToRolePolicy(
         new CachePolicy({
            account: props.account,
            distributionId: props.distributionId,
         })
      );

      /**
       *
       *
       */
      this.invalidateAction = new pipelineActions.CodeBuildAction({
         actionName: 'InvalidateCache',
         input: props.artifact,
         project: invalidateBuildProject,
      });
   }
}
