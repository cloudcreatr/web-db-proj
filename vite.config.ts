import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { remixPWA } from '@remix-pwa/dev'

declare module "@remix-run/node" {
  interface Future {
    v3_singleFetch: true;
  }
}

export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
      },
    }),
    remixPWA(),
    tsconfigPaths(),
    
  ],
  optimizeDeps: {
    exclude: ['drizzle-orm']
  },
  build: {
    commonjsOptions: {
      exclude: ['drizzle-orm']
    }
  },
  resolve: {
    alias: {
      'node:events': 'events'
    }
  }
});
declare module "@remix-run/server-runtime" {
  // or cloudflare, deno, etc.
  interface Future {
    v3_singleFetch: true;
  }
}
