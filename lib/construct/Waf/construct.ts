import * as cdk from '@aws-cdk/core';
import * as wafv2 from '@aws-cdk/aws-wafv2';

import * as config from './config';

type ScopeType = 'CLOUDFRONT' | 'LOCAL';
type RuleType = (wafv2.CfnWebACL.RuleProperty | cdk.IResolvable) | cdk.IResolvable;

interface IRule {
   rule: RuleType;
}

interface WafProps {
   rules: IRule[];
   scope: ScopeType;
   defaultAction?: config.IDefaultAction;
   visibilityConfig?: config.IVisibilityConfig;
}

export class WAFSecurity extends wafv2.CfnWebACL {
   constructor(scope: cdk.Construct, id: string, props: WafProps) {
      super(scope, id, props);
   }
}
