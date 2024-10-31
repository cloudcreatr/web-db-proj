/// <reference lib="WebWorker" />
import {
  EnhancedCache,
  clearUpOldCaches,
  type DefaultFetchHandler,
} from "@remix-pwa/sw";
import { type NotificationObject } from "@remix-pwa/push";

const version = "v3";

const ASSET_CACHE_NAME = `asset-cache`;
declare let self: ServiceWorkerGlobalScope;

const assetCache = new EnhancedCache(ASSET_CACHE_NAME, {
  version,
  strategy: "CacheFirst",
  strategyOptions: {
    maxAgeSeconds: 60 * 60 * 24 * 90, // 90 days
    maxEntries: 20000,
  },
});
self.addEventListener("install", (event) => {
  console.log("🔧 Service worker installation started");

  event.waitUntil(
    (async () => {
      try {
        console.log("📥 Attempting to fetch cachea.json");
        const response = await fetch("/cachea.json");
        
        if (response.ok) {
          console.log("✅ cachea.json fetch successful, status:", response.status);
          const files = await response.json();
          
          // Only filter out the "assets" directory entry
          const cleanedFiles = files.filter(file => file !== "assets");

          console.log("⏳ Starting pre-cache operation");
          await assetCache.preCacheUrls(cleanedFiles);
          console.log("✅ Pre-caching completed successfully");
        } else {
          console.warn("⚠️ cachea.json not found, status:", response.status);
        }
      } catch (error) {
        console.error("❌ Error during installation:", error);
        console.log("🔍 Error details:", {
          message: error.message,
          stack: error.stack
        });
      }
      console.log("⏭️ Calling skipWaiting()");
      await self.skipWaiting();
      console.log("✅ Service worker installation completed");
    })()
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(Promise.all([
    clearUpOldCaches([ASSET_CACHE_NAME], version).then(() => {
      console.log('Old caches cleared');
      self.clients.claim();
    })
  ]));
});

export const defaultFetchHandler: DefaultFetchHandler = async ({ context }) => {
  const request = context.event.request;
  const startTime = performance.now();

  const match = await assetCache.match(request);
  if (match) {
    console.log(`Cache hit: ${request.url} took ${performance.now() - startTime}ms`);
    return match;
  }

  console.log("Cache miss, fetching from network:", request.url);
  const response = await fetch(request);
  return response;
};
import { PushManager } from "@remix-pwa/push/client";

export const pushManager = new PushManager({
  handlePushEvent: async (event) => {
    // Handle incoming push event
    const msg = event.data?.json() as NotificationObject;
    console.log("push event", msg);
    await self.registration.showNotification(msg.title, {
      body: msg.options[0].body,
    });
  },
  handleNotificationClick: (event) => {
    // Handle notification click event
  },
  handleNotificationClose: (event) => {
    // Handle notification close event
  },
  handleNotificationError: (event) => {
    // Handle notification error event
  },
});
