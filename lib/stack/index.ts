import * as cdk from '@aws-cdk/core';
import * as distribution from '@pattern/Distribution';
import * as cdkPipeline from '@pattern/CdkPipeline';
import * as projectPipeline from '@pattern/ProjectPipeline';
import config from '@config';

export class Infrastructure extends cdk.Stack {
   constructor(scope: cdk.Construct, id: string) {
      super(scope, id);

      /**
       *
       * Hosting Distribution
       */
      const dist = new distribution.Distribution(this, 'Cloud-Distribution', {
         account: this.account,
         region: config.settings.region,
         locations: config.settings.locations,
         domainName: config.settings.domainName,
         hostedZoneId: config.settings.hostedZoneId,
      });

      /**
       *
       * Project pipeline
       */
      new projectPipeline.Pipeline(this, 'Project-Pipeline', {
         bucket: dist.bucket,
         region: this.region,
         account: this.account,
         github: config.project_source,
         cache: dist.cloudDistribute.cacheInvalidation,
      });

      /**
       *
       * Cdk pipeline
       */
      new cdkPipeline.Pipeline(this, 'Cdk-Pipeline', {
         github: config.cdk_source,
      });
   }
}
