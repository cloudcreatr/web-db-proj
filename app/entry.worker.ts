/// <reference lib="WebWorker" />
import {
  EnhancedCache,
  clearUpOldCaches,
  type DefaultFetchHandler,
} from '@remix-pwa/sw'
import { type NotificationObject } from '@remix-pwa/push';

const version = 'v1'





const ASSET_CACHE_NAME = `asset-cache`;
declare let self: ServiceWorkerGlobalScope;



const assetCache = new EnhancedCache(ASSET_CACHE_NAME, {
  version,
  strategy: 'CacheFirst',
  strategyOptions: {
    maxAgeSeconds: 60 * 60 * 24 * 90, // 90 days
    maxEntries: 20000,
  }
})




self.addEventListener('install', event => {
  console.log('Service worker installed');

  event.waitUntil(self.skipWaiting());
});





self.addEventListener('activate', event => {
  console.log('Service worker activated')

  event.waitUntil(Promise.all([

    clearUpOldCaches([ASSET_CACHE_NAME], version),
    self.clients.claim(),
  ]))
})

export const defaultFetchHandler: DefaultFetchHandler = async ({ context }) => {
  const request = context.event.request






  return fetch(request)
}



import { PushManager } from '@remix-pwa/push/client';

export const pushManager = new PushManager({
  handlePushEvent: async (event) => {
    // Handle incoming push event
    const msg = event.data?.json() as NotificationObject
    console.log("push event", msg)
    await self.registration.showNotification(msg.title, {
      body: msg.options[0].body,
    })
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