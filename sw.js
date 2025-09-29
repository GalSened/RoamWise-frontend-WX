/**
 * RoamWise Service Worker
 * Provides offline functionality and PWA features
 */

const CACHE_NAME = 'roamwise-v2.0.0';
const STATIC_CACHE_NAME = 'roamwise-static-v2.0.0';
const DYNAMIC_CACHE_NAME = 'roamwise-dynamic-v2.0.0';

// Core app files to cache for offline functionality
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/app.js',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap'
];

// API endpoints and dynamic content patterns
const DYNAMIC_URLS = [
  '/weather',
  '/places', 
  '/route',
  '/autocomplete',
  '/think'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('🔧 RoamWise Service Worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('📦 Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('✅ Static assets cached successfully');
        return self.skipWaiting(); // Activate immediately
      })
      .catch((error) => {
        console.error('❌ Failed to cache static assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🚀 RoamWise Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME &&
                cacheName.startsWith('roamwise-')) {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ RoamWise Service Worker activated and ready');
        return self.clients.claim(); // Take control immediately
      })
  );
});

// Fetch event - handle network requests
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Skip cross-origin requests except for fonts and known APIs
  if (url.origin !== location.origin && 
      !url.hostname.includes('fonts.g') && 
      !url.hostname.includes('premium-hybrid-473405-g7.uc.r.appspot.com')) {
    return;
  }
  
  event.respondWith(handleFetchRequest(event.request));
});

async function handleFetchRequest(request) {
  const url = new URL(request.url);
  
  try {
    // Strategy 1: Cache First for static assets (app files, fonts)
    if (isStaticAsset(url)) {
      return await cacheFirst(request);
    }
    
    // Strategy 2: Network First for API calls with fallback
    if (isApiRequest(url)) {
      return await networkFirstWithFallback(request);
    }
    
    // Strategy 3: Stale While Revalidate for HTML pages
    if (request.headers.get('accept')?.includes('text/html')) {
      return await staleWhileRevalidate(request);
    }
    
    // Default: Network with cache fallback
    return await networkWithCacheFallback(request);
    
  } catch (error) {
    console.error('❌ Fetch error:', error);
    return await getOfflineFallback(request);
  }
}

// Cache strategies
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    console.log('📋 Serving from cache:', request.url);
    return cachedResponse;
  }
  
  const networkResponse = await fetch(request);
  if (networkResponse.ok) {
    const cache = await caches.open(STATIC_CACHE_NAME);
    cache.put(request, networkResponse.clone());
  }
  return networkResponse;
}

async function networkFirstWithFallback(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful API responses for offline access
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
      console.log('🌐 API response cached:', request.url);
    }
    
    return networkResponse;
  } catch (error) {
    console.log('📋 Network failed, trying cache for:', request.url);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline API response
    return getOfflineApiResponse(request);
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  const networkResponsePromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => null);
  
  return cachedResponse || await networkResponsePromise || await getOfflineFallback(request);
}

async function networkWithCacheFallback(request) {
  try {
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || await getOfflineFallback(request);
  }
}

// Helper functions
function isStaticAsset(url) {
  return url.pathname.includes('.js') || 
         url.pathname.includes('.css') || 
         url.pathname.includes('.woff') ||
         url.pathname === '/' ||
         url.pathname === '/index.html' ||
         url.hostname.includes('fonts.g');
}

function isApiRequest(url) {
  return DYNAMIC_URLS.some(pattern => url.pathname.includes(pattern)) ||
         url.hostname.includes('premium-hybrid-473405-g7.uc.r.appspot.com');
}

async function getOfflineFallback(request) {
  if (request.headers.get('accept')?.includes('text/html')) {
    return await caches.match('/') || new Response('RoamWise - Offline Mode', {
      status: 200,
      headers: { 'Content-Type': 'text/html' }
    });
  }
  
  return new Response('Offline', {
    status: 503,
    statusText: 'Service Unavailable'
  });
}

function getOfflineApiResponse(request) {
  const url = new URL(request.url);
  
  // Provide offline responses for different API endpoints
  if (url.pathname.includes('/weather')) {
    return new Response(JSON.stringify({
      temperature: 20,
      description: 'Weather unavailable offline',
      offline: true,
      message: 'Connect to internet for current weather'
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'X-Served-By': 'ServiceWorker-Offline'
      }
    });
  }
  
  if (url.pathname.includes('/places')) {
    return new Response(JSON.stringify({
      places: [],
      offline: true,
      message: 'Connect to internet to search places. Your favorites are still available!'
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'X-Served-By': 'ServiceWorker-Offline'
      }
    });
  }
  
  return new Response(JSON.stringify({
    error: 'Service unavailable offline',
    offline: true
  }), {
    status: 503,
    headers: { 'Content-Type': 'application/json' }
  });
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('🔄 Background sync triggered:', event.tag);
  
  if (event.tag === 'sync-favorites') {
    event.waitUntil(syncFavorites());
  }
});

async function syncFavorites() {
  console.log('💾 Syncing favorites...');
  // Favorites are handled via localStorage, so this is mainly for future server sync
}

console.log('🌟 RoamWise Service Worker loaded and ready!');
