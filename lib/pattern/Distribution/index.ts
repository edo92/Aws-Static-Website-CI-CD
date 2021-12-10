import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';

interface DistributionProps {
   domainName: string;
}

export class Distribution extends cdk.Construct {
   public readonly bucket: s3.Bucket;

   constructor(scope: cdk.Stack, id: string, props: DistributionProps) {
      super(scope, id);

      /**
       *
       * Project source code bucket
       */
      this.bucket = new s3.Bucket(this, 'Client-Bucket', {
         bucketName: props.domainName,
         blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      });
   }
}
