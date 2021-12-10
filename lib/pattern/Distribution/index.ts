import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as route53 from '@aws-cdk/aws-route53';
import * as routeTargets from '@aws-cdk/aws-route53-targets';
import * as certmanager from '@aws-cdk/aws-certificatemanager';

import * as waf from '@construct/Waf';
import * as distribution from '@construct/Distribution';
import securityRules from './wafRules';

interface IResources {
   domainName: string;
   hostedZoneId: string;
}

interface DistributionProps extends IResources {
   region: string;
   account: string;
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
       * Waf security
       */
      const wafAcl = new waf.WAFSecurity(this, 'Waf-Security', {
         rules: securityRules,
         scope: waf.Scope.CLOUDFRONT,
         name: `${props.domainName}-Security`,
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
         webAclId: wafAcl.attrArn,
         account: props.account,
         locations: props.locations,
         domainName: props.domainName,
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
