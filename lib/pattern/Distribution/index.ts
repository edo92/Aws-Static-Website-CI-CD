import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as route53 from '@aws-cdk/aws-route53';
import * as routeTargets from '@aws-cdk/aws-route53-targets';
import * as certmanager from '@aws-cdk/aws-certificatemanager';
import * as distribution from '@construct/Distribution';

interface IResources {
   region: string;
   domainName: string;
   hostedZoneId: string;
}

interface DistributionProps extends IResources {
   locations: string[];
}

export class Distribution extends cdk.Construct {
   public readonly bucket: s3.Bucket;
   public readonly cloudDistribute: distribution.CloudDistribution;

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

      /**
       *
       * Hosted zone route53
       */
      const zone = route53.PublicHostedZone.fromHostedZoneAttributes(this, 'Hosted-Zone', {
         zoneName: props.domainName,
         hostedZoneId: props.hostedZoneId,
      });

      /**
       *
       * Certificate
       */
      const certificate = new certmanager.DnsValidatedCertificate(this, 'Dns-Certificate', {
         hostedZone: zone,
         region: props.region,
         domainName: props.domainName,
      });

      /**
       *
       * Distribution
       */
      this.cloudDistribute = new distribution.CloudDistribution(this, 'Client-Distribution', {
         certificate,
         bucket: this.bucket,
         account: scope.account,
         domainName: props.domainName,
         locations: props.locations,
      });

      /**
       *
       * A Reacord
       */
      new route53.ARecord(this, 'Record-Target', {
         zone,
         recordName: props.domainName,
         target: route53.RecordTarget.fromAlias(
            new routeTargets.CloudFrontTarget(this.cloudDistribute)
         ),
      });
   }
}
