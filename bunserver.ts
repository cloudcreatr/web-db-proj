import { createRequestHandler } from '@remix-run/node';
import { serve } from 'bun';
import fs from 'fs';

const port = Number(process.env.PORT || 3000);

import * as serverBuild from './build/server/index.js';

console.log('serverBuild:', serverBuild);

const remixHandler = createRequestHandler({
  build: serverBuild,
  mode: process.env.NODE_ENV,
});

serve({
  port,
  fetch: async (request) => {
    const url = new URL(request.url);
    const pathname = url.pathname;

    console.log(`${request.method} ${pathname}`);

    // Serve static assets
    try {
      const filePath = `./public${pathname}`;
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const file = await Bun.file(filePath);
        return new Response(file, {
          headers: {
            'Content-Type': Bun.mime.getType(filePath) || 'application/octet-stream',
            'Cache-Control': 'public, max-age=3600',
          },
        });
      }
    } catch {
      // File not found; proceed to Remix handler
    }

    // Handle SSR requests
    return remixHandler(request);
  },
});

console.log(`Bun server listening at http://localhost:${port}`);