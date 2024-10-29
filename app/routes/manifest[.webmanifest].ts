import type { WebAppManifest } from '@remix-pwa/dev';
import { json } from '@remix-run/node';

export const loader = () => {
  return json(
    {
      short_name: 'PWA',
      name: 'Remix PWA',
      start_url: '/',
      display: 'standalone',
      background_color: '#d3d7dd',
      theme_color: '#c34138',
      display_override: ["window-controls-overlay"],
      icons: [
        {
          src: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
          sizes: "192x192",
          type: "image/svg+xml"
        }
      ]
    } as WebAppManifest,
    {
      headers: {
        'Cache-Control': 'public, max-age=600',
        'Content-Type': 'application/manifest+json',
      },
    }
  );
};
