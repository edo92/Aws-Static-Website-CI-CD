import * as cdk from '@aws-cdk/core';
import * as distribution from '@pattern/Distribution';
import config from '@config';

export class Infrastructure extends cdk.Stack {
   constructor(scope: cdk.Construct, id: string) {
      super(scope, id);

      /**
       *
       * Hosting Distribution
       */
      new distribution.Distribution(this, 'Hosting-Distribution', {
         locations: ['US'],
         region: config.settings.region,
         domainName: config.settings.domainName,
         hostedZoneId: config.settings.hostedZoneId,
      });
   }
}
