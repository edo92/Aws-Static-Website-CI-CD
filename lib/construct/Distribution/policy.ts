import * as iam from '@aws-cdk/aws-iam';

interface CachePolicyProps {
   account: string;
   distributionId: string;
}

export class CachePolicy extends iam.PolicyStatement {
   constructor(props: CachePolicyProps) {
      // eslint-disable-next-line max-len
      const distributionArn = `arn:aws:cloudfront::${props.account}:distribution/${props.distributionId}`;

      super({
         resources: [distributionArn],
         actions: ['cloudfront:CreateInvalidation'],
      });
   }
}
