import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as cloudFront from '@aws-cdk/aws-cloudfront';
import * as origin from '@aws-cdk/aws-cloudfront-origins';
import * as certificate from '@aws-cdk/aws-certificatemanager';

interface CustomOption {
   comment?: string;
   rootObject?: string;
}

export interface CloudFrontProps extends CustomOption {
   account: string;
   bucket: s3.Bucket;
   domainName: string;
   locations: string[];
   certificate: certificate.DnsValidatedCertificate;
}

export class DistributionConfig {
   private cachePolicy: cloudFront.CachePolicy;

   /**
    *
    * Restriction
    */
   public get geoRestriction(): cloudFront.GeoRestriction {
      return cloudFront.GeoRestriction.allowlist(...this.props.locations);
   }

   /**
    *
    * Root File
    */
   public get defaultRootObject(): string {
      return this.props.rootObject || 'index.html';
   }

   /**
    *
    * Behavior
    */
   public get defaultBehavior() {
      return {
         cachePolicy: this.cachePolicy,
         origin: new origin.S3Origin(this.props.bucket),
         viewerProtocolPolicy: cloudFront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      };
   }

   /**
    *
    * Cache Policy
    */
   constructor(scope: cdk.Construct, private props: CloudFrontProps) {
      this.cachePolicy = new cloudFront.CachePolicy(scope, 'Cache-Policy', {
         comment: props.comment,
         minTtl: cdk.Duration.minutes(3),
         maxTtl: cdk.Duration.minutes(5),
         defaultTtl: cdk.Duration.minutes(5),
      });
   }
}
