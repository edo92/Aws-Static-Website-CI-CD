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

export class CdkPipeline extends cdk.Construct {
   constructor(scope: cdk.Construct, id: string, props: CdkPipelineProps) {
      super(scope, id);

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
      const Synthesize = new pipelines.ShellStep(`Synth-${id}`, {
         input: sourceCode,
         commands: props.commands || DefaultOptions.commands,
      });

      /**
       *
       * Cdk code pipeline
       */
      new pipelines.CodePipeline(this, `Cdk-${id}`, {
         synth: Synthesize,
         pipelineName: props.pipelineName || DefaultOptions.pipelineName,
      });
   }
}
