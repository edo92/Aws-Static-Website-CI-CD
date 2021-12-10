import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import * as cloudFront from '@aws-cdk/aws-cloudfront';

import { Invalidation } from './script';
import { DistributionConfig, CloudFrontProps } from './config';

interface DistributionProps extends CloudFrontProps {
   webAclId?: string;
}

export class CloudDistribution extends cloudFront.Distribution {
   public readonly cacheInvalidation: Invalidation;
   public readonly distributionIdOutput: cdk.CfnOutput;
   public readonly distributionArnOutput: cdk.CfnOutput;

   constructor(scope: cdk.Construct, id: string, props: DistributionProps) {
      /**
       *
       * Distirbution Configuration
       */
      const config = new DistributionConfig(scope, props);

      /**
       *
       * Input option
       */
      const clientOption = {
         webAclId: props.webAclId,
         domainNames: [props.domainName],
         certificate: props.certificate,
      };

      /**
       *
       * Instance
       */
      super(scope, id, Object.assign(clientOption, config));

      /**
       *
       * Cache invalidation codebuild shell
       */
      this.cacheInvalidation = new Invalidation(this, 'Invalidation', {
         distributionId: this.distributionId,
      });

      /**
       *
       * Cache invalidation policy
       */
      this.cacheInvalidation.addToRolePolicy(
         new iam.PolicyStatement({
            actions: ['cloudfront:CreateInvalidation'],
            resources: [
               `arn:aws:cloudfront::${props.account}:distribution/${this.distributionId}`,
            ],
         })
      );
   }
}
