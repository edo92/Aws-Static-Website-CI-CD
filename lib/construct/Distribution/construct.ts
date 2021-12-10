import * as cdk from '@aws-cdk/core';
import * as cloudFront from '@aws-cdk/aws-cloudfront';
import { DistributionConfig, CloudFrontProps } from './config';

interface DistributionProps extends CloudFrontProps {
   webAclId?: string;
}

export class CloudDistribution extends cloudFront.Distribution {
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
   }
}
