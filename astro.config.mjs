// @ts-check
import { defineConfig } from 'astro/config';
import { readFileSync } from 'node:fs';
import { loadEnv } from 'vite';
import { createAnalyticsBuildConfig } from './scripts/analytics-config.mjs';
import { createBuildMetadata } from './scripts/build-metadata.mjs';

const packageMetadata = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));
const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env };
const buildMetadata = createBuildMetadata({ env, packageVersion: packageMetadata.version });
const analyticsConfig = createAnalyticsBuildConfig({ env, location: buildMetadata.location });

// https://astro.build/config
export default defineConfig({
  vite: {
    define: {
      __ANALYTICS_CONFIG__: JSON.stringify(analyticsConfig),
      __BUILD_METADATA__: JSON.stringify(buildMetadata),
    },
  },
});
