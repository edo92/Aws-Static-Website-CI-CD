export interface IVisibilityConfig {
   metricName?: string;
   sampledRequestsEnabled?: boolean;
   cloudWatchMetricsEnabled?: boolean;
}

export interface IDefaultAction {
   allow: Record<string | number, string | number>;
}

export class DefaultOptions {
   static defaultAction: {
      // eslint-disable-next-line @typescript-eslint/ban-types
      allow: {};
   };

   static visibilityConfig = {
      metricName: 'Waf-Monitoring',
      sampledRequestsEnabled: false,
      cloudWatchMetricsEnabled: true,
   };
}
