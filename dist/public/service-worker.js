/**
 * Luxembourg Pas Chere - Enhanced Service Worker
 * Provides offline functionality, caching strategies, and background sync
 * Version 2.0 - Enhanced Performance & Reliability
 */

// Cache names for different types of assets
const CACHE_NAMES = {
  static: 'lpc-static-assets-v2',
  dynamic: 'lpc-dynamic-content-v2',
  images: 'lpc-images-v2',
  pages: 'lpc-pages-v2',
  api: 'lpc-api-responses-v2'
};

const OFFLINE_URL = '/offline.html';

// Core assets that must be cached for offline functionality
const CORE_ASSETS = [
  '/',
  OFFLINE_URL,
  '/css/critical.css',
  '/js/critical.js',
  '/images/logo.svg',
  '/images/favicon.svg',
  '/images/icons/icon-192x192.png',
  '/manifest.json'
];

// Additional assets that should be cached but are not critical for offline functionality
const ADDITIONAL_ASSETS = [
  '/css/styles.css',
  '/css/home.css',
  '/js/main.js',
  '/images/book-cover.svg',
  '/images/hero-background.svg',
  '/images/about-image.svg',
  '/images/press/rtl.svg',
  '/images/press/wort.svg',
  '/images/press/paperjam.svg'
];

// Combine all assets for initial caching
const ASSETS_TO_CACHE = [...CORE_ASSETS, ...ADDITIONAL_ASSETS];

// Cache expiration settings (in milliseconds)
const EXPIRATION_TIMES = {
  static: 30 * 24 * 60 * 60 * 1000, // 30 days
  dynamic: 2 * 24 * 60 * 60 * 1000, // 2 days
  images: 7 * 24 * 60 * 60 * 1000,  // 7 days
  api: 30 * 60 * 1000               // 30 minutes
};

// Database name and version
const DB_NAME = 'luxembourg-pas-chere-db';
const DB_VERSION = 2;

// Helper function to check cache expiration
const isExpired = (cachedResponse, cacheType) => {
  if (!cachedResponse || !cachedResponse.headers.has('sw-cache-date')) {
    return true;
  }
  
  const cacheDate = new Date(cachedResponse.headers.get('sw-cache-date')).getTime();
  const now = Date.now();
  const maxAge = EXPIRATION_TIMES[cacheType];
  
  return (now - cacheDate) > maxAge;
};

// Helper function to add timestamp to responses
const addTimestamp = response => {
  if (!response || !response.body) return response;
  
  const clonedResponse = response.clone();
  const headers = new Headers(clonedResponse.headers);
  headers.append('sw-cache-date', new Date().toISOString());
  
  return new Response(clonedResponse.body, {
    status: clonedResponse.status,
    statusText: clonedResponse.statusText,
    headers
  });
};

// Install event - cache assets with an optimized strategy
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing Service Worker v2');
  
  event.waitUntil(
    Promise.all([
      // Cache core assets first (critical for offline functionality)
      caches.open(CACHE_NAMES.static).then((cache) => {
        console.log('[Service Worker] Caching core assets');
        return cache.addAll(CORE_ASSETS);
      }),
      
      // Cache additional assets in parallel
      caches.open(CACHE_NAMES.static).then((cache) => {
        console.log('[Service Worker] Caching additional assets');
        // We don't wait for this to complete before considering installation successful
        cache.addAll(ADDITIONAL_ASSETS).catch(error => {
          console.warn('[Service Worker] Failed to cache some additional assets:', error);
          // Non-critical, continue installation
        });
      }),
      
      // Create image cache
      caches.open(CACHE_NAMES.images),
      
      // Create dynamic content cache
      caches.open(CACHE_NAMES.dynamic),
      
      // Create API response cache
      caches.open(CACHE_NAMES.api)
    ])
    .then(() => {
      console.log('[Service Worker] All critical caches initialized');
      return self.skipWaiting();
    })
    .catch(error => {
      console.error('[Service Worker] Installation failed:', error);
      // Allow installation to proceed anyway
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches and claim clients immediately
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating Service Worker v2');
  
  // List of valid cache names
  const validCacheNames = Object.values(CACHE_NAMES);
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.filter(cacheName => {
            // Check if this cache name should be deleted
            return !validCacheNames.includes(cacheName);
          }).map(cacheName => {
            console.log('[Service Worker] Removing old cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
      }),
      
      // Clear expired items from caches
      ...Object.entries(CACHE_NAMES).map(([type, cacheName]) => {
        return caches.open(cacheName).then(cache => {
          return cache.keys().then(requests => {
            return Promise.all(
              requests.map(request => {
                return cache.match(request).then(response => {
                  if (isExpired(response, type)) {
                    console.log(`[Service Worker] Removing expired item from ${cacheName}:`, request.url);
                    return cache.delete(request);
                  }
                  return Promise.resolve();
                });
              })
            );
          });
        });
      }),
      
      // Initialize or upgrade IndexedDB if needed
      new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          
          // Create or update object stores
          if (!db.objectStoreNames.contains('contact-store')) {
            db.createObjectStore('contact-store', { keyPath: 'id' });
          }
          
          if (!db.objectStoreNames.contains('newsletter-store')) {
            db.createObjectStore('newsletter-store', { keyPath: 'id' });
          }
          
          // Add cache metadata store
          if (!db.objectStoreNames.contains('cache-metadata')) {
            const metadataStore = db.createObjectStore('cache-metadata', { keyPath: 'url' });
            metadataStore.createIndex('timestamp', 'timestamp', { unique: false });
          }
        };
        
        request.onsuccess = () => resolve();
        request.onerror = (error) => {
          console.error('[Service Worker] IndexedDB upgrade failed:', error);
          resolve(); // Continue activation even if IDB fails
        };
      })
    ])
    .then(() => {
      console.log('[Service Worker] Activation complete');
      // This ensures the service worker takes control of all clients immediately
      return self.clients.claim();
    })
  );
});

// Fetch event - enhanced resource handling with smart caching strategies
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests to avoid CORS issues
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Don't cache or handle POST/PUT/DELETE requests - pass through to network
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Parse URL to help determine caching strategy
  const url = new URL(event.request.url);
  
  // Determine resource type for appropriate caching strategy
  const resourceType = getResourceType(event.request);
  
  // Choose caching strategy based on resource type
  switch (resourceType) {
    case 'api':
      // API requests - network first, cached fallback with short expiration
      event.respondWith(apiStrategy(event.request));
      break;
      
    case 'page':
      // HTML/Page requests - network first with offline page fallback
      event.respondWith(pageStrategy(event.request));
      break;
      
    case 'image':
      // Images - cache first with network fallback and longer expiry
      event.respondWith(imageStrategy(event.request));
      break;
      
    case 'static':
      // Static assets (CSS, JS, fonts) - cache first, infrequently update
      event.respondWith(staticAssetStrategy(event.request));
      break;
      
    default:
      // Everything else - stale-while-revalidate approach
      event.respondWith(staleWhileRevalidateStrategy(event.request));
      break;
  }
});

// Helper to determine resource type from request
function getResourceType(request) {
  const url = new URL(request.url);
  
  // API endpoints
  if (url.pathname.includes('/api/')) {
    return 'api';
  }
  
  // HTML pages
  if (request.mode === 'navigate' || 
      (request.method === 'GET' && 
       request.headers.get('accept')?.includes('text/html'))) {
    return 'page';
  }
  
  // Images
  if (request.destination === 'image' || 
      url.pathname.match(/\.(jpe?g|png|gif|svg|webp)$/i)) {
    return 'image';
  }
  
  // Static assets
  if (url.pathname.match(/\.(css|js|woff2?|ttf|otf|eot)$/i) || 
      request.destination === 'style' || 
      request.destination === 'script' || 
      request.destination === 'font') {
    return 'static';
  }
  
  // Default: dynamic content
  return 'dynamic';
}

// Static Asset Strategy - Cache First with Infrequent Updates
async function staticAssetStrategy(request) {
  const cacheName = CACHE_NAMES.static;
  
  try {
    // Try to get from cache first
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    // If we have a valid, non-expired cached response, use it
    if (cachedResponse && !isExpired(cachedResponse, 'static')) {
      // Asynchronously check for updates in the background
      refreshCacheInBackground(request, cacheName, 'static');
      return cachedResponse;
    }
    
    // Otherwise, fetch from network
    const networkResponse = await fetch(request);
    
    // Cache the new response with timestamp
    if (networkResponse.ok) {
      const responseToCache = addTimestamp(networkResponse.clone());
      cache.put(request, responseToCache);
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[Service Worker] Static asset fetch failed:', error);
    
    // Last resort - check cache again without expiration check
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If all else fails, return an appropriate error
    return new Response('Failed to load resource', {
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

// Image Strategy - Cache First with Optimized Handling
async function imageStrategy(request) {
  const cacheName = CACHE_NAMES.images;
  
  try {
    // Try to get from cache first
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    // If we have a valid cached response, use it immediately
    if (cachedResponse && !isExpired(cachedResponse, 'images')) {
      // Refresh cache in background occasionally
      refreshCacheInBackground(request, cacheName, 'images', 0.1); // 10% chance to refresh
      return cachedResponse;
    }
    
    // Otherwise, fetch from network
    const networkResponse = await fetch(request);
    
    // Cache the new response with timestamp
    if (networkResponse.ok) {
      const responseToCache = addTimestamp(networkResponse.clone());
      cache.put(request, responseToCache);
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[Service Worker] Image fetch failed:', error);
    
    // Last resort - check cache again without expiration check
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return placeholder image if available
    const placeholderResponse = await caches.match('/images/placeholder.svg');
    if (placeholderResponse) {
      return placeholderResponse;
    }
    
    // If all else fails, return an appropriate error
    return new Response('Image not available', {
      status: 404,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

// API Strategy - Network First with Short Cache
async function apiStrategy(request) {
  const cacheName = CACHE_NAMES.api;
  
  try {
    // Always try network first for API calls
    const networkResponse = await fetch(request);
    
    // Cache the new response with timestamp
    if (networkResponse.ok) {
      const responseToCache = addTimestamp(networkResponse.clone());
      const cache = await caches.open(cacheName);
      cache.put(request, responseToCache);
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[Service Worker] API fetch failed:', error);
    
    // If network fails, try to get from cache
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse && !isExpired(cachedResponse, 'api')) {
      // Return cached data with warning header
      const headers = new Headers(cachedResponse.headers);
      headers.append('X-Cache-Warning', 'Data may be outdated');
      
      return new Response(cachedResponse.body, {
        status: cachedResponse.status,
        statusText: cachedResponse.statusText + ' (offline)',
        headers
      });
    }
    
    // If not in cache or expired, return an appropriate error
    return new Response(JSON.stringify({
      error: 'Network error occurred. You appear to be offline.',
      offline: true,
      timestamp: new Date().toISOString()
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Page Strategy - Network First with Offline Fallback
async function pageStrategy(request) {
  const cacheName = CACHE_NAMES.pages;
  
  try {
    // Always try network first for pages
    const networkResponse = await fetch(request);
    
    // Cache the new response
    if (networkResponse.ok) {
      const responseToCache = addTimestamp(networkResponse.clone());
      const cache = await caches.open(cacheName);
      cache.put(request, responseToCache);
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[Service Worker] Page fetch failed:', error);
    
    // If network fails, try to get from cache
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      // Add offline indicator to cached page response
      const originalBody = await cachedResponse.text();
      let body = originalBody;
      
      // Insert offline notification banner if HTML
      if (cachedResponse.headers.get('Content-Type')?.includes('text/html')) {
        const offlineNotification = `
          <div class="offline-notification" style="
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: #e31837;
            color: white;
            text-align: center;
            padding: 8px 16px;
            font-family: sans-serif;
            z-index: 9999;
            display: flex;
            justify-content: space-between;
            align-items: center;
          ">
            <span>Sie sind offline. Einige Inhalte sind möglicherweise veraltet.</span>
            <button onclick="this.parentElement.style.display='none'" style="
              background: white;
              border: none;
              border-radius: 4px;
              padding: 4px 8px;
              margin-left: 16px;
              cursor: pointer;
              color: #e31837;
              font-weight: bold;
            ">Schließen</button>
          </div>
        `;
        
        // Insert before the closing body tag
        body = body.replace('</body>', `${offlineNotification}</body>`);
      }
      
      return new Response(body, {
        status: cachedResponse.status,
        statusText: cachedResponse.statusText + ' (offline)',
        headers: cachedResponse.headers
      });
    }
    
    // If not in cache, return the offline page
    console.log('[Service Worker] Serving offline page');
    const offlinePage = await caches.match(OFFLINE_URL);
    return offlinePage || new Response('You are offline. Please try again when you have internet connection.', {
      status: 503,
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

// Stale-While-Revalidate Strategy for dynamic content
async function staleWhileRevalidateStrategy(request) {
  const cacheName = CACHE_NAMES.dynamic;
  
  // Try to get from cache first
  const cachedResponse = await caches.match(request);
  
  // Initiate network fetch regardless of cache status
  const fetchPromise = fetch(request)
    .then(async networkResponse => {
      if (networkResponse.ok) {
        // Update the cache with new response
        const responseToCache = addTimestamp(networkResponse.clone());
        const cache = await caches.open(cacheName);
        cache.put(request, responseToCache);
      }
      return networkResponse;
    })
    .catch(error => {
      console.error('[Service Worker] Fetch failed in stale-while-revalidate:', error);
      // Fallback to cached response if network fails, will be handled below
      throw error;
    });
  
  // Return cached response immediately if available, otherwise wait for network
  return cachedResponse || fetchPromise.catch(() => {
    // Last attempt to get from cache if network fails
    return caches.match(request).then(response => {
      return response || new Response('Resource unavailable while offline', {
        status: 503,
        headers: { 'Content-Type': 'text/plain' }
      });
    });
  });
}

// Helper function to refresh cache in the background
// probability parameter (0-1) controls how often refresh happens
function refreshCacheInBackground(request, cacheName, cacheType, probability = 1) {
  // Only refresh some percentage of the time to reduce network traffic
  if (Math.random() > probability) return;
  
  setTimeout(() => {
    fetch(request)
      .then(response => {
        if (response.ok) {
          const responseToCache = addTimestamp(response.clone());
          caches.open(cacheName).then(cache => {
            cache.put(request, responseToCache);
            console.log(`[Service Worker] Background refresh: ${request.url}`);
          });
        }
      })
      .catch(error => {
        // Silent fail for background refresh
        console.debug('[Service Worker] Background refresh failed:', error);
      });
  }, 1000); // Delay by 1 second
}

// Background sync for form submissions
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background Sync:', event.tag);
  
  if (event.tag === 'sync-contact') {
    event.waitUntil(syncContactData());
  }
  
  if (event.tag === 'sync-newsletter') {
    event.waitUntil(syncNewsletterData());
  }
});

// Sync contact form data
async function syncContactData() {
  const contactData = await getStoredContactData();
  
  if (!contactData.length) {
    return;
  }
  
  let successCount = 0;
  let remainingCount = contactData.length;
  
  for (const data of contactData) {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        await removeStoredContactData(data.id);
        successCount++;
        remainingCount--;
      }
    } catch (error) {
      console.error('[Service Worker] Contact sync failed:', error);
    }
  }
  
  // Notify the client about the sync results
  if (successCount > 0) {
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'CONTACT_SYNC_COMPLETE',
        successCount,
        remainingCount
      });
    });
  }
}

// Sync newsletter form data
async function syncNewsletterData() {
  const newsletterData = await getStoredNewsletterData();
  
  if (!newsletterData.length) {
    return;
  }
  
  let successCount = 0;
  let remainingCount = newsletterData.length;
  
  for (const data of newsletterData) {
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        await removeStoredNewsletterData(data.id);
        successCount++;
        remainingCount--;
      }
    } catch (error) {
      console.error('[Service Worker] Newsletter sync failed:', error);
    }
  }
  
  // Notify the client about the sync results
  if (successCount > 0) {
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'NEWSLETTER_SYNC_COMPLETE',
        successCount,
        remainingCount
      });
    });
  }
}

// Get stored contact data from IndexedDB
function getStoredContactData() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('luxembourg-pas-chere-db', 1);
    
    request.onerror = () => {
      console.error('[Service Worker] IndexedDB open failed');
      resolve([]);
    };
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      if (!db.objectStoreNames.contains('contact-store')) {
        db.createObjectStore('contact-store', { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains('newsletter-store')) {
        db.createObjectStore('newsletter-store', { keyPath: 'id' });
      }
    };
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction('contact-store', 'readonly');
      const store = transaction.objectStore('contact-store');
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = () => {
        resolve(getAllRequest.result);
      };
      
      getAllRequest.onerror = () => {
        console.error('[Service Worker] Get contact data failed');
        resolve([]);
      };
    };
  });
}

// Remove stored contact data from IndexedDB
function removeStoredContactData(id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('luxembourg-pas-chere-db', 1);
    
    request.onerror = () => {
      console.error('[Service Worker] IndexedDB open failed');
      resolve(false);
    };
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction('contact-store', 'readwrite');
      const store = transaction.objectStore('contact-store');
      const deleteRequest = store.delete(id);
      
      deleteRequest.onsuccess = () => {
        resolve(true);
      };
      
      deleteRequest.onerror = () => {
        console.error('[Service Worker] Delete contact data failed');
        resolve(false);
      };
    };
  });
}

// Get stored newsletter data from IndexedDB
function getStoredNewsletterData() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('luxembourg-pas-chere-db', 1);
    
    request.onerror = () => {
      console.error('[Service Worker] IndexedDB open failed');
      resolve([]);
    };
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      if (!db.objectStoreNames.contains('newsletter-store')) {
        db.createObjectStore('newsletter-store', { keyPath: 'id' });
      }
    };
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction('newsletter-store', 'readonly');
      const store = transaction.objectStore('newsletter-store');
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = () => {
        resolve(getAllRequest.result);
      };
      
      getAllRequest.onerror = () => {
        console.error('[Service Worker] Get newsletter data failed');
        resolve([]);
      };
    };
  });
}

// Remove stored newsletter data from IndexedDB
function removeStoredNewsletterData(id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('luxembourg-pas-chere-db', 1);
    
    request.onerror = () => {
      console.error('[Service Worker] IndexedDB open failed');
      resolve(false);
    };
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction('newsletter-store', 'readwrite');
      const store = transaction.objectStore('newsletter-store');
      const deleteRequest = store.delete(id);
      
      deleteRequest.onsuccess = () => {
        resolve(true);
      };
      
      deleteRequest.onerror = () => {
        console.error('[Service Worker] Delete newsletter data failed');
        resolve(false);
      };
    };
  });
}

// Listen for push notifications
self.addEventListener('push', (event) => {
  let notificationData = {};
  
  try {
    notificationData = event.data.json();
  } catch (e) {
    notificationData = {
      title: 'Nouvelle notification',
      message: event.data ? event.data.text() : 'No data'
    };
  }
  
  const title = notificationData.title || 'Luxembourg Pas Chère';
  const options = {
    body: notificationData.message || 'Vous avez une nouvelle notification',
    icon: '/images/icons/icon-192x192.png',
    badge: '/images/icons/icon-96x96.png',
    data: notificationData.data || {},
    actions: notificationData.actions || []
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const urlToOpen = event.notification.data.url || '/';
  
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clientList) => {
      // Check if a window is already open
      for (const client of clientList) {
        if (client.url.includes(urlToOpen) && 'focus' in client) {
          return client.focus();
        }
      }
      // If no window is open, open a new one
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }
    })
  );
});