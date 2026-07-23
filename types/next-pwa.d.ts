declare module "next-pwa" {
  import { NextConfig } from "next";

  interface WithPWAConfig {
    /**
     * @default 'public'
     */
    dest?: string;
    /**
     * @default true
     */
    register?: boolean;
    /**
     * @default true
     */
    skipWaiting?: boolean;
    /**
     * @default false
     */
    disable?: boolean;
    /**
     * @default {}
     */
    workboxOptions?: any; // You can refine this with Workbox types if you need
    /**
     * A path to a custom service worker file.
     * @default 'service-worker.js'
     */
    sw?: string; // This is a bit of a guess, based on how people configure it
    /**
     * @default null
     */
    buildExcludes?: (string | RegExp)[];
    /**
     * @default null
     */
    runtimeCaching?: any[]; // You can refine this if needed
    /**
     * @default false
     */
    subdomain?: boolean;

    // More options might be available, check next-pwa documentation for a full list
  }

  type WithPWA = (
    pluginOptions: WithPWAConfig,
  ) => (nextConfig: NextConfig) => NextConfig;

  const withPWA: WithPWA;
  export = withPWA;
}
