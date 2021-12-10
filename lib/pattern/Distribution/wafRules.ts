export default [
   {
      rule: {
         name: 'AWSManagedRuleLinux',
         priority: 50,
         visibilityConfig: {
            sampledRequestsEnabled: true,
            cloudWatchMetricsEnabled: true,
            metricName: 'AWSManagedRuleLinux',
         },

         overrideAction: {
            none: {},
         },

         statement: {
            managedRuleGroupStatement: {
               vendorName: 'AWS',
               name: 'AWSManagedRulesLinuxRuleSet',
               excludedRules: [],
            },
         },
      },
   },
];
