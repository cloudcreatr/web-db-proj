/// <reference lib="WebWorker" />
import {
  EnhancedCache,
  clearUpOldCaches,
  type DefaultFetchHandler,
} from '@remix-pwa/sw'


const version = 'v1'





const ASSET_CACHE_NAME = `asset-cache`;
declare let self: ServiceWorkerGlobalScope;



const assetCache = new EnhancedCache(ASSET_CACHE_NAME, {
  version,
  strategy: 'CacheFirst',
  strategyOptions: {
    maxAgeSeconds: 60 * 60 * 24 * 90, // 90 days
    maxEntries: 100,
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
  const url = new URL(request.url)

 
  if (self.__workerManifest.assets.includes(url.pathname)) {
    return assetCache.handleRequest(request)
  }

  return fetch(request)
}