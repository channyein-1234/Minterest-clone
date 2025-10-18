'use client';

import { useEffect, useState } from 'react';

export default function PWARegister() {
  const [showReload, setShowReload] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      process.env.NODE_ENV === 'production'
    ) {
      console.log('🔧 Service Worker support detected (production mode)');

      // Manual service worker registration (workbox-window not needed)
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((registration) => {
          console.log('✅ Service Worker registered successfully');

          // Check for updates periodically
          setInterval(() => {
            registration.update();
          }, 60000); // Check every minute

          // Handle updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            console.log('🔄 New service worker found, state:', newWorker?.state);

            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                console.log('🔄 Service Worker state changed to:', newWorker.state);
                
                if (newWorker.state === 'installed') {
                  if (navigator.serviceWorker.controller) {
                    // New service worker available
                    console.log('🔄 New service worker installed, update available');
                    setShowReload(true);
                    setWaitingWorker(newWorker);
                  } else {
                    // First install
                    console.log('✅ Service worker installed for the first time');
                  }
                }
              });
            }
          });

          // Check if there's already a waiting worker
          if (registration.waiting) {
            console.log('🔄 Service worker already waiting');
            setShowReload(true);
            setWaitingWorker(registration.waiting);
          }

          // Check if active
          if (registration.active) {
            console.log('✅ Service worker is active');
          }
        })
        .catch((error) => {
          console.error('❌ Service Worker registration failed:', error);
        });

      // Listen for controller change (when new SW takes over)
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('✅ Service Worker controller changed, reloading page');
        window.location.reload();
      });

      // Check current service worker status
      navigator.serviceWorker.ready.then((registration) => {
        console.log('✅ Service Worker is ready');
        if (registration.active) {
          console.log('✅ Active service worker:', registration.active.scriptURL);
        }
      });

      // Log current controller
      if (navigator.serviceWorker.controller) {
        console.log('✅ Page is controlled by service worker');
      } else {
        console.log('⚠️ Page is NOT controlled by a service worker yet (first load)');
      }
    } else if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log('ℹ️ PWA is disabled in development mode');
    } else if (typeof window !== 'undefined') {
      console.error('❌ Service Worker is not supported in this browser');
    }
  }, []);

  const reloadPage = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    }
    setShowReload(false);
  };

  if (!showReload) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white p-4 rounded-lg shadow-lg max-w-sm">
      <p className="font-semibold mb-2">Update Available!</p>
      <p className="text-sm mb-3">A new version of the app is ready.</p>
      <button
        onClick={reloadPage}
        className="bg-white text-blue-600 px-4 py-2 rounded font-medium hover:bg-gray-100 transition-colors"
      >
        Update Now
      </button>
    </div>
  );
}
