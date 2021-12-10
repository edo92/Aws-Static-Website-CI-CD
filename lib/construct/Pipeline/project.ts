import * as types from '@types';
import * as cdk from '@aws-cdk/core';
import * as codebuild from '@aws-cdk/aws-codebuild';

interface Options {
   privileged?: boolean;
   timeout?: cdk.Duration;
   buildSpec?: codebuild.BuildSpec;
   buildImage?: codebuild.LinuxBuildImage;
   environmentVariables?: types.IEnv;
}

interface PipelineProps extends Options {
   account: string;
   region: string;
}

/**
 *
 * Base default options
 */
export class DefaultOptions {
   public static timeout = cdk.Duration.minutes(15);
   public static buildImage = codebuild.LinuxBuildImage.STANDARD_4_0;
   public static buildSpec = codebuild.BuildSpec.fromSourceFilename('buildspec.yml');
}

/**
 *
 * Pipeline Project with codebuild
 */
export class PipelineProject extends codebuild.PipelineProject {
   constructor(scope: cdk.Construct, id: string, props: PipelineProps) {
      super(scope, id, {
         timeout: Object.assign(DefaultOptions.timeout, props.timeout),
         buildSpec: Object.assign(DefaultOptions.buildSpec, props.buildSpec),

         environment: {
            privileged: props.privileged || true,
            buildImage: Object.assign(DefaultOptions.buildImage, props.buildImage),
         },

         environmentVariables: {
            AWS_ACCOUNT_ID: { value: props.account },
            AWS_DEFAULT_REGION: { value: props.region },
            ...props.environmentVariables,
         },
      });
   }
}
