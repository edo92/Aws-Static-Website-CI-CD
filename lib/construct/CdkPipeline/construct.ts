import * as types from '@types';
import * as cdk from '@aws-cdk/core';
import * as pipelines from '@aws-cdk/pipelines';

interface CdkPipelineProps {
   github: types.IGithub;
   pipelineName?: string;
   commands?: string[];
}

class DefaultOptions {
   static pipelineName = 'Cdk-Pipeline';
   static commands = ['npm install', 'npm run build', 'npx cdk synth'];
}

export class Pipeline extends pipelines.CodePipeline {
   constructor(scope: cdk.Construct, id: string, props: CdkPipelineProps) {
      /**
       *
       * Github source code for pipeline
       */
      const sourceCode = pipelines.CodePipelineSource.gitHub(
         `${props.github.owner}/${props.github.repo}`,
         props.github.branch,
         { authentication: cdk.SecretValue.secretsManager(props.github.secretToken) }
      );

      /**
       *
       * Synthesize command shell
       */
      const synthesize = new pipelines.ShellStep('Cdk-Synthesize', {
         input: sourceCode,
         commands: props.commands || DefaultOptions.commands,
      });

      /**
       *
       * Cdk code pipeline instance
       */
      super(scope, id, {
         synth: synthesize,
         pipelineName: props.pipelineName || DefaultOptions.pipelineName,
      });
   }
}
