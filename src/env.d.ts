/// <reference types="astro/client" />

declare const __ANALYTICS_CONFIG__: Readonly<{
  measurementId: string | null;
  required: boolean;
}>;

declare const __BUILD_METADATA__: Readonly<{
  service: "FundraisingDirectory.net";
  version: string;
  buildTime: string;
  statusCode: 200;
  status: "OK";
  location: "production" | "preview" | "development";
  packageVersion: string;
}>;
