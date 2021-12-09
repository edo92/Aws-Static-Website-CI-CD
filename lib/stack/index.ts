import * as cdk from '@aws-cdk/core';
import * as hosting from '../construct/Hosting';

export class Infrastructure extends cdk.Stack {
   constructor(scope: cdk.Construct, id: string) {
      super(scope, id);

      /**
       *
       * Hosting Distribution
       */
      new hosting.HostingDistribution(this, 'Hosting-Distribution', {
         domainName: '',
      });
   }
}
