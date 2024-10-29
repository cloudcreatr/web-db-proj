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
          src: "/img.png",
          sizes: "768x684",
          type: "image/png"
        },{
          src: "/img.png",
          sizes: "192x192",
          type: "image/png"
        },
        {
          src: "/img.png",
          sizes: "512x512",
          type: "image/png"
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
