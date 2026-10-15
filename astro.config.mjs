// @ts-check
import { defineConfig } from 'astro/config';
import { readFileSync } from 'node:fs';
import { createBuildMetadata } from './scripts/build-metadata.mjs';

const packageMetadata = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));
const buildMetadata = createBuildMetadata({ packageVersion: packageMetadata.version });

// https://astro.build/config
export default defineConfig({
  vite: {
    define: {
      __BUILD_METADATA__: JSON.stringify(buildMetadata),
    },
  },
});
