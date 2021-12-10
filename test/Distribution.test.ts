import * as cdk from '@aws-cdk/core';
import { Template } from '@aws-cdk/assertions';
import { Distribution } from '../lib/pattern/Distribution';
import config from '../config.json';

describe('Distribution Pattern', () => {
   let app: cdk.App, stack: cdk.Stack;
   let template: Template;

   beforeEach(() => {
      app = new cdk.App();
      stack = new cdk.Stack(app, 'TopicsStack');

      new Distribution(stack, 'Cloud-Distribution', {
         account: stack.account,
         region: config.settings.region,
         locations: config.settings.locations,
         domainName: config.settings.domainName,
         hostedZoneId: config.settings.hostedZoneId,
      });

      template = Template.fromStack(stack);
   });

   it('Bucket', () => {
      template.hasResourceProperties('AWS::S3::Bucket', {
         BucketName: config.settings.domainName,
         PublicAccessBlockConfiguration: {
            BlockPublicAcls: true,
            BlockPublicPolicy: true,
            IgnorePublicAcls: true,
            RestrictPublicBuckets: true,
         },
      });
   });

   it('Waf ACL', () => {
      template.hasResourceProperties('AWS::WAFv2::WebACL', {
         Scope: 'CLOUDFRONT',
         VisibilityConfig: {
            SampledRequestsEnabled: false,
            CloudWatchMetricsEnabled: true,
         },
      });
   });

   it('Dns Certificate', () => {
      template.hasResourceProperties('AWS::CloudFormation::CustomResource', {
         Region: config.settings.region,
         DomainName: config.settings.domainName,
         HostedZoneId: config.settings.hostedZoneId,
      });
   });

   it('CloudFront Cache', () => {
      template.hasResourceProperties('AWS::CloudFront::CachePolicy', {
         CachePolicyConfig: {
            DefaultTTL: 300,
            MaxTTL: 300,
            MinTTL: 180,
         },
      });
   });

   it('Cloud Distribution', () => {
      template.hasResourceProperties('AWS::CloudFront::Distribution', {
         DistributionConfig: {
            Aliases: [config.settings.domainName],
            DefaultCacheBehavior: {
               Compress: true,
               ViewerProtocolPolicy: 'redirect-to-https',
            },

            DefaultRootObject: 'index.html',
            Enabled: true,
            HttpVersion: 'http2',
            IPV6Enabled: true,

            Restrictions: {
               GeoRestriction: {
                  Locations: config.settings.locations,
                  RestrictionType: 'whitelist',
               },
            },

            ViewerCertificate: {
               MinimumProtocolVersion: 'TLSv1.2_2019',
               SslSupportMethod: 'sni-only',
            },
         },
      });
   });

   it('Route53 RecordSet', () => {
      template.hasResourceProperties('AWS::Route53::RecordSet', {
         Type: 'A',
         Name: `${config.settings.domainName}.`,
         HostedZoneId: config.settings.hostedZoneId,
      });
   });
});
