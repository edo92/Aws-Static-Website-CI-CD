import * as cdk from '@aws-cdk/core';
import * as hosting from '@pattern/Distribution';
import config from '@config';

export class Infrastructure extends cdk.Stack {
   constructor(scope: cdk.Construct, id: string) {
      super(scope, id);

      /**
       *
       * Hosting Distribution
       */
      new hosting.Distribution(this, 'Hosting-Distribution', {
         domainName: config.settings.domainName,
      });
   }
}
