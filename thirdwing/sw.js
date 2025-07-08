/**
 * @file
 * Thirdwing Service Worker for PWA functionality
 * Provides offline caching and background sync
 */

const CACHE_NAME = 'thirdwing-v1.0.0';
const OFFLINE_URL = '/offline';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/offline',
  '/themes/custom/thirdwing/assets/css/base/normalize.css',
  '/themes/custom/thirdwing/assets/css/base/typography.css',
  '/themes/custom/thirdwing/assets/css/layout/layout.css',
  '/themes/custom/thirdwing/assets/css/layout/grid.css',
  '/themes/custom/thirdwing/assets/css/components/navigation.css',
  '/themes/custom/thirdwing/assets/css/components/buttons.css',
  '/themes/custom/thirdwing/assets/css/components/content.css',
  '/themes/custom/thirdwing/assets/css/theme/colors.css',
  '/themes/custom/thirdwing/assets/js/thirdwing.js',
  '/themes/custom/thirdwing/assets/js/navigation.js',
  '/themes/custom/thirdwing/assets/images/favicon-32x32.png',
  '/themes/custom/thirdwing/assets/images/apple-touch-icon.png'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker installed successfully');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip requests to other origins
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Skip admin and API requests
  if (event.request.url.includes('/admin/') || 
      event.request.url.includes('/api/') ||
      event.request.url.includes('/user/login')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Return cached version if available
        if (cachedResponse) {
          console.log('Serving from cache:', event.request.url);
          return cachedResponse;
        }

        // Otherwise fetch from network
        return fetch(event.request)
          .then(response => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            // Cache successful responses
            caches.open(CACHE_NAME)
              .then(cache => {
                // Only cache certain content types
                const contentType = response.headers.get('content-type');
                if (shouldCache(event.request.url, contentType)) {
                  console.log('Caching:', event.request.url);
                  cache.put(event.request, responseToCache);
                }
              });

            return response;
          })
          .catch(() => {
            // If network fails, try to serve offline page for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match(OFFLINE_URL);
            }
            
            // For other requests, try to find a fallback in cache
            return caches.match('/') || new Response('Offline', {
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
      })
  );
});

// Background sync for form submissions
self.addEventListener('sync', event => {
  if (event.tag === 'contact-form') {
    event.waitUntil(sendPendingMessages());
  }
});

// Push notification handler
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/themes/custom/thirdwing/assets/images/icon-192x192.png',
      badge: '/themes/custom/thirdwing/assets/images/favicon-32x32.png',
      vibrate: [200, 100, 200],
      data: {
        url: data.url || '/'
      },
      actions: [
        {
          action: 'view',
          title: 'View',
          icon: '/themes/custom/thirdwing/assets/images/favicon-16x16.png'
        },
        {
          action: 'dismiss',
          title: 'Dismiss'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'Thirdwing', options)
    );
  }
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'view') {
    const urlToOpen = event.notification.data.url || '/';
    
    event.waitUntil(
      clients.matchAll({ type: 'window' })
        .then(clientList => {
          // Try to focus existing window
          for (const client of clientList) {
            if (client.url.includes(urlToOpen) && 'focus' in client) {
              return client.focus();
            }
          }
          
          // Open new window if none found
          if (clients.openWindow) {
            return clients.openWindow(urlToOpen);
          }
        })
    );
  }
});

// Helper functions
function shouldCache(url, contentType) {
  // Cache HTML pages
  if (contentType && contentType.includes('text/html')) {
    return true;
  }
  
  // Cache CSS and JS
  if (url.includes('.css') || url.includes('.js')) {
    return true;
  }
  
  // Cache images
  if (contentType && contentType.startsWith('image/')) {
    return true;
  }
  
  // Cache fonts
  if (contentType && contentType.includes('font')) {
    return true;
  }
  
  return false;
}

async function sendPendingMessages() {
  try {
    const cache = await caches.open('contact-forms');
    const requests = await cache.keys();
    
    for (const request of requests) {
      try {
        const response = await fetch(request);
        if (response.ok) {
          await cache.delete(request);
          console.log('Successfully sent pending form submission');
        }
      } catch (error) {
        console.error('Failed to send pending form:', error);
      }
    }
  } catch (error) {
    console.error('Error processing pending messages:', error);
  }
}

// Handle messages from the main thread
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('Thirdwing Service Worker loaded successfully');