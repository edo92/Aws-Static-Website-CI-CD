import * as cdk from '@aws-cdk/core';
import { Template } from '@aws-cdk/assertions';
import { expect as expectCdk, haveResourceLike } from '@aws-cdk/assert';
import { Pipeline } from '../lib/construct/CdkPipeline';
import config from '../config.json';

describe('Infrastructure Pipeline', () => {
   let app: cdk.App, stack: cdk.Stack;
   let template: Template;
   const github = config.cdk_source;

   beforeEach(() => {
      app = new cdk.App();
      stack = new cdk.Stack(app, 'TopicsStack');

      new Pipeline(stack, 'Cdk-SelfMulate', { github });
      template = Template.fromStack(stack);
   });

   it('CodePipeline', () => {
      expectCdk(template.toJSON()).to(
         haveResourceLike('AWS::CodePipeline::Pipeline', {
            Stages: [
               {
                  Name: 'Source',
                  Actions: [
                     {
                        ActionTypeId: {
                           Category: 'Source',
                           Owner: 'ThirdParty',
                           Provider: 'GitHub',
                           Version: '1',
                        },
                        Configuration: {
                           Owner: github.owner,
                           Repo: github.repo,
                           Branch: github.branch,
                           OAuthToken: `{{resolve:secretsmanager:${github.secretToken}:SecretString:::}}`,
                           PollForSourceChanges: false,
                        },
                        Name: `${github.owner}_${github.repo}`,
                        RunOrder: 1,
                     },
                  ],
               },
               {
                  Name: 'Build',
                  Actions: [
                     {
                        Name: 'Cdk-Synthesize',
                        RunOrder: 1,
                        ActionTypeId: {
                           Category: 'Build',
                           Owner: 'AWS',
                           Provider: 'CodeBuild',
                           Version: '1',
                        },
                     },
                  ],
               },
               {
                  Name: 'UpdatePipeline',
                  Actions: [
                     {
                        Name: 'SelfMutate',
                        RunOrder: 1,
                        ActionTypeId: {
                           Category: 'Build',
                           Owner: 'AWS',
                           Provider: 'CodeBuild',
                           Version: '1',
                        },
                     },
                  ],
               },
            ],
         })
      );
   });

   it('Github WebHook', () => {
      template.hasResourceProperties('AWS::CodePipeline::Webhook', {
         Authentication: 'GITHUB_HMAC',
         AuthenticationConfiguration: {
            SecretToken: `{{resolve:secretsmanager:${github.secretToken}:SecretString:::}}`,
         },
         TargetAction: `${github.owner}_${github.repo}`,
      });
   });
});
