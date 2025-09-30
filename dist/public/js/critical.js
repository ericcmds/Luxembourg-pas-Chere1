/**
 * Luxembourg Pas Chere - Enhanced Critical JavaScript
 * Critical JavaScript for initial page render with advanced performance optimizations
 * Version 2.0
 */

// Performance metrics logging
const PERFORMANCE_METRICS = {
  startTime: window.performance.now(),
  DOMContentLoaded: null,
  loaded: null,
  firstPaint: null,
  firstContentfulPaint: null,
  timeToInteractive: null
};

// Initialize performance observer for modern browsers
if ('PerformanceObserver' in window) {
  try {
    // Create an observer for paint timing
    const paintObserver = new PerformanceObserver((entries) => {
      entries.getEntries().forEach((entry) => {
        if (entry.name === 'first-paint') {
          PERFORMANCE_METRICS.firstPaint = entry.startTime;
        } else if (entry.name === 'first-contentful-paint') {
          PERFORMANCE_METRICS.firstContentfulPaint = entry.startTime;
          // Remove the loading overlay more quickly after FCP
          fadeOutLoadingOverlay();
        }
      });
    });
    paintObserver.observe({ entryTypes: ['paint'] });

    // Create an observer for long tasks
    const longTaskObserver = new PerformanceObserver((entries) => {
      // Log long tasks for performance debugging
      entries.getEntries().forEach((entry) => {
        console.debug('Long task detected:', 
          Math.round(entry.duration) + 'ms', 
          entry.attribution[0]?.name || 'unknown source');
      });
    });
    longTaskObserver.observe({ entryTypes: ['longtask'] });
  } catch (e) {
    console.warn('PerformanceObserver not fully supported in this browser');
  }
}

// Initial execution before DOM is fully loaded
(function() {
  // Add page loading class to body
  document.documentElement.classList.add('is-loading');
  
  // Detect crucial browser features
  detectFeatures();
  
  // Register event listeners for performance metrics
  window.addEventListener('DOMContentLoaded', () => {
    PERFORMANCE_METRICS.DOMContentLoaded = window.performance.now();
    initializeCriticalFeatures();
  });
  
  window.addEventListener('load', () => {
    PERFORMANCE_METRICS.loaded = window.performance.now();
    initializeDeferredFeatures();
    
    // Set a timeout to ensure we calculate TTI even if the page never becomes "quiet"
    setTimeout(() => {
      if (!PERFORMANCE_METRICS.timeToInteractive) {
        PERFORMANCE_METRICS.timeToInteractive = window.performance.now();
        console.debug('Time to Interactive (fallback):', 
          Math.round(PERFORMANCE_METRICS.timeToInteractive - PERFORMANCE_METRICS.startTime) + 'ms');
      }
    }, 5000);
  });
})();

/**
 * Detect and add browser feature classes
 */
function detectFeatures() {
  const features = {
    'js': true,
    'touch': 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    'webp': false, // Will be tested async
    'webgl': (() => {
      try {
        const canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && 
          (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
      } catch(e) {
        return false;
      }
    })(),
    'motion-reduction': window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    'high-contrast': window.matchMedia('(forced-colors: active)').matches || 
                     window.matchMedia('(-ms-high-contrast: active)').matches
  };
  
  // Remove no-js class
  document.documentElement.classList.remove('no-js');
  
  // Add feature classes
  Object.keys(features).forEach(feature => {
    if (features[feature]) {
      document.documentElement.classList.add('has-' + feature);
    } else {
      document.documentElement.classList.add('no-' + feature);
    }
  });
  
  // WebP detection (async)
  testWebP(hasWebP => {
    document.documentElement.classList.add(hasWebP ? 'has-webp' : 'no-webp');
    features.webp = hasWebP;
  });
}

/**
 * Test for WebP support
 */
function testWebP(callback) {
  const webP = new Image();
  webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  webP.onload = webP.onerror = () => {
    callback(webP.height === 2);
  };
}

/**
 * Initialize all critical features needed for basic interaction
 */
function initializeCriticalFeatures() {
  // Initialize critical components
  initAccessibility();
  checkNetworkStatus();
  initPerformance();
  initMobileNavigation();
  
  // Preload assets needed for first interaction
  preloadCriticalAssets();
  
  // Remove loading class from body
  document.documentElement.classList.remove('is-loading');
  document.documentElement.classList.add('is-interactive');
}

/**
 * Initialize deferred features that can wait until after critical rendering
 */
function initializeDeferredFeatures() {
  // Mark document as fully loaded
  document.documentElement.classList.add('is-loaded');
  
  // Initialize service worker only after page has loaded
  initServiceWorker();
  
  // Initialize non-critical UI components
  initLanguageSelector();
  initCookieConsent();
  initBootstrapComponents();
  
  // If we have performance metrics, calculate and potentially report time to interactive
  if (!PERFORMANCE_METRICS.timeToInteractive) {
    PERFORMANCE_METRICS.timeToInteractive = window.performance.now();
  }
}

/**
 * Initialize accessibility features
 */
function initAccessibility() {
  // Add focus styles for keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-navigation');
    }
  });
  
  document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
  });
  
  // Create screen reader announcer if not exists
  if (!document.getElementById('screen-reader-announcer')) {
    const announcer = document.createElement('div');
    announcer.id = 'screen-reader-announcer';
    announcer.className = 'sr-only';
    announcer.setAttribute('aria-live', 'assertive');
    announcer.setAttribute('aria-atomic', 'true');
    document.body.appendChild(announcer);
  }
}

/**
 * Initialize service worker for PWA functionality
 */
function initServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/service-worker.js')
        .then(function(registration) {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
          
          // Handle service worker updates
          registration.addEventListener('updatefound', function() {
            const newWorker = registration.installing;
            
            newWorker.addEventListener('statechange', function() {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                showUpdateNotification();
              }
            });
          });
        })
        .catch(function(error) {
          console.error('ServiceWorker registration failed: ', error);
        });
      
      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener('message', function(event) {
        const data = event.data;
        
        if (data.type === 'CONTACT_SYNC_COMPLETE') {
          showSyncNotification('Kontaktformular', data.successCount, data.remainingCount);
        } else if (data.type === 'NEWSLETTER_SYNC_COMPLETE') {
          showSyncNotification('Newsletter', data.successCount, data.remainingCount);
        }
      });
    });
  }
}

/**
 * Show update notification when a new service worker is available
 */
function showUpdateNotification() {
  // Create notification container if not exists
  let notification = document.getElementById('update-notification');
  
  if (!notification) {
    notification = document.createElement('div');
    notification.id = 'update-notification';
    notification.className = 'update-notification';
    notification.innerHTML = `
      <div class="update-notification-content">
        <p>Es ist eine neue Version der Website verfügbar.</p>
        <button id="update-app" class="update-button">Jetzt aktualisieren</button>
        <button id="dismiss-update" class="dismiss-button">Später</button>
      </div>
    `;
    document.body.appendChild(notification);
    
    // Add event listeners
    document.getElementById('update-app').addEventListener('click', function() {
      window.location.reload();
    });
    
    document.getElementById('dismiss-update').addEventListener('click', function() {
      notification.classList.remove('visible');
    });
  }
  
  // Show notification
  setTimeout(function() {
    notification.classList.add('visible');
  }, 1000);
}

/**
 * Show notification when background sync completes
 */
function showSyncNotification(type, successCount, remainingCount) {
  if (successCount <= 0) return;
  
  // Create notification container if not exists
  let notification = document.getElementById('sync-notification');
  
  if (!notification) {
    notification = document.createElement('div');
    notification.id = 'sync-notification';
    notification.className = 'sync-notification';
    document.body.appendChild(notification);
  }
  
  // Set notification content
  let message = `${successCount} ${type}-Daten wurden erfolgreich synchronisiert.`;
  
  if (remainingCount > 0) {
    message += ` ${remainingCount} stehen noch aus.`;
  }
  
  notification.innerHTML = `
    <div class="sync-notification-content">
      <p>${message}</p>
      <button class="dismiss-button">Schließen</button>
    </div>
  `;
  
  // Add event listener to dismiss button
  notification.querySelector('.dismiss-button').addEventListener('click', function() {
    notification.classList.remove('visible');
  });
  
  // Show notification
  notification.classList.add('visible');
  
  // Hide notification after 5 seconds
  setTimeout(function() {
    notification.classList.remove('visible');
  }, 5000);
}

/**
 * Check and monitor network status
 */
function checkNetworkStatus() {
  const updateNetworkStatus = function() {
    const isOnline = navigator.onLine;
    document.body.classList.toggle('is-offline', !isOnline);
    
    // Show offline banner if offline
    let offlineBanner = document.getElementById('offline-banner');
    
    if (!offlineBanner) {
      offlineBanner = document.createElement('div');
      offlineBanner.id = 'offline-banner';
      offlineBanner.className = 'offline-banner';
      offlineBanner.innerHTML = 'Sie sind offline. Einige Funktionen sind möglicherweise eingeschränkt.';
      document.body.insertBefore(offlineBanner, document.body.firstChild);
    }
    
    offlineBanner.classList.toggle('visible', !isOnline);
    
    // Announce status change to screen readers
    const announcer = document.getElementById('screen-reader-announcer');
    if (announcer) {
      announcer.textContent = isOnline 
        ? 'Sie sind wieder online. Alle Funktionen sind verfügbar.' 
        : 'Sie sind offline. Einige Funktionen sind möglicherweise eingeschränkt.';
    }
  };
  
  // Initial check
  updateNetworkStatus();
  
  // Add event listeners for online/offline events
  window.addEventListener('online', updateNetworkStatus);
  window.addEventListener('offline', updateNetworkStatus);
}

/**
 * Initialize performance optimizations
 */
function initPerformance() {
  // First apply immediate optimizations
  applyImmediateOptimizations();
  
  // Then schedule deferred optimizations with requestIdleCallback
  scheduleNextOptimization();
}

/**
 * Apply immediate performance optimizations
 */
function applyImmediateOptimizations() {
  // Preconnect to important origins right away to save DNS and TCP connection time
  const criticalOrigins = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://cdnjs.cloudflare.com'
  ];
  
  criticalOrigins.forEach(origin => {
    if (!document.querySelector(`link[rel="preconnect"][href="${origin}"]`)) {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = origin;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    }
  });

  // Use Resource Hints API for critical resources
  if ('connection' in navigator) {
    // For slow connections, prioritize critical resources and defer non-critical ones
    // @ts-ignore (TS doesn't have NetworkInformation API typing)
    if (navigator.connection.saveData || navigator.connection.effectiveType.includes('2g')) {
      document.documentElement.classList.add('save-data');
      
      // Disable any animations that aren't necessary
      document.querySelectorAll('.animated:not(.critical-animation)').forEach(el => {
        el.classList.add('animation-disabled');
      });
    }
  }
  
  // Throttle scroll events for better performance
  let lastScrollTime = 0;
  const scrollThreshold = 50; // ms
  
  const throttledScrollHandler = () => {
    const now = performance.now();
    if (now - lastScrollTime > scrollThreshold) {
      lastScrollTime = now;
      window.dispatchEvent(new CustomEvent('optimized-scroll'));
    }
  };
  
  // Replace scroll listeners with throttled version
  window.addEventListener('scroll', throttledScrollHandler, { passive: true });
}

/**
 * Schedule performance optimizations using requestIdleCallback or fallback
 */
function scheduleNextOptimization() {
  const performDeferredOptimizations = (deadline) => {
    // If we have enough time or we must complete this task
    if (deadline.timeRemaining() > 10 || deadline.didTimeout) {
      // Optimize lazy loading
      setupLazyLoading();
      
      // Schedule image optimization
      scheduleNextTask(optimizeImages);
    } else {
      // Not enough time, reschedule for later
      scheduleNextTask(performDeferredOptimizations);
    }
  };
  
  scheduleNextTask(performDeferredOptimizations);
}

/**
 * Cross-browser scheduling of low-priority tasks
 */
function scheduleNextTask(callback) {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(callback, { timeout: 1000 });
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(() => callback({
      timeRemaining: () => 10,
      didTimeout: false
    }), 1);
  }
}

/**
 * Set up lazy loading for non-critical resources
 */
function setupLazyLoading() {
  if ('IntersectionObserver' in window) {
    // Lazy load CSS files
    const lazyStyles = document.querySelectorAll('link[rel="stylesheet"][data-lazy]');
    lazyStyles.forEach(link => {
      link.setAttribute('rel', 'preload');
      link.setAttribute('as', 'style');
      link.setAttribute('onload', "this.onload=null;this.rel='stylesheet'");
    });
    
    // Lazy load JavaScript files
    const lazyScripts = document.querySelectorAll('script[data-src]');
    lazyScripts.forEach(script => {
      script.src = script.getAttribute('data-src');
      script.removeAttribute('data-src');
    });
    
    // Set up lazy loading for images with IntersectionObserver
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          
          if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
            img.removeAttribute('data-srcset');
          }
          
          // Add loaded class for animations
          img.classList.add('loaded');
          
          // Stop observing this element
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '100px 0px', // Start loading when image is 100px from viewport
      threshold: 0.01 // Trigger when just 1% is visible
    });
    
    // Start observing images
    document.querySelectorAll('img[data-src], img[data-srcset]').forEach(img => {
      imageObserver.observe(img);
    });
  } else {
    // Fallback for browsers without IntersectionObserver
    document.querySelectorAll('link[rel="stylesheet"][data-lazy]').forEach(link => {
      link.setAttribute('rel', 'stylesheet');
    });
    
    document.querySelectorAll('script[data-src]').forEach(script => {
      script.src = script.getAttribute('data-src');
      script.removeAttribute('data-src');
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  }
}

/**
 * Optimize images on the page (run after critical rendering is complete)
 */
function optimizeImages() {
  // Add blur-up loading styles for image placeholders
  document.querySelectorAll('.image-wrapper').forEach(wrapper => {
    const img = wrapper.querySelector('img');
    
    if (img && img.complete && img.naturalWidth > 0) {
      wrapper.classList.add('image-loaded');
    } else if (img) {
      img.onload = () => wrapper.classList.add('image-loaded');
    }
  });
}

/**
 * Preload critical assets for the current page
 */
function preloadCriticalAssets() {
  // Key assets to preload - add specific critical assets based on current page
  const criticalAssets = [
    // Images used in hero and above-the-fold content
    { url: '/images/hero-background.svg', type: 'image' },
    { url: '/images/logo.svg', type: 'image' },
    // Critical fonts
    { url: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@700&display=swap', type: 'style' }
  ];
  
  // Dynamic preloading - only preload what's needed for the current page
  const currentPath = window.location.pathname;
  
  // Add path-specific assets
  if (currentPath === '/' || currentPath === '/index.html') {
    criticalAssets.push({ url: '/images/book-cover.svg', type: 'image' });
  } else if (currentPath.includes('/contact')) {
    criticalAssets.push({ url: '/js/form-validation.js', type: 'script' });
  }
  
  // Create and append preload tags
  criticalAssets.forEach(asset => {
    // Skip if already preloaded
    if (document.querySelector(`link[rel="preload"][href="${asset.url}"]`)) {
      return;
    }
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = asset.url;
    
    // Set correct 'as' attribute based on asset type
    switch (asset.type) {
      case 'image':
        link.as = 'image';
        break;
      case 'style':
        link.as = 'style';
        break;
      case 'script':
        link.as = 'script';
        break;
      case 'font':
        link.as = 'font';
        link.crossOrigin = 'anonymous';
        break;
    }
    
    document.head.appendChild(link);
  });
}

/**
 * Handle the loading overlay removal with smooth transition
 */
function fadeOutLoadingOverlay() {
  const pageLoading = document.querySelector('.page-loading');
  if (!pageLoading) return;
  
  // Check if First Contentful Paint happened
  const removeLoading = () => {
    // Add loaded class to trigger CSS transition
    pageLoading.classList.add('loaded');
    
    // Clean up after transition completes
    setTimeout(() => {
      if (document.body.contains(pageLoading)) {
        pageLoading.remove();
      }
      
      // Report performance metrics
      reportPerformanceMetrics();
    }, 300); // Match transition duration
  };
  
  // First try to use the native entry if available
  if (PERFORMANCE_METRICS.firstContentfulPaint) {
    removeLoading();
  } else {
    // Fallback - remove loading screen after fixed timeout if FCP wasn't detected
    const loadingTimeout = setTimeout(() => {
      removeLoading();
    }, 800); // Conservative default
    
    // If FCP happens during this time, clear the timeout and remove immediately
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((entries) => {
          entries.getEntries().forEach((entry) => {
            if (entry.name === 'first-contentful-paint') {
              clearTimeout(loadingTimeout);
              removeLoading();
              observer.disconnect();
            }
          });
        });
        observer.observe({ entryTypes: ['paint'] });
      } catch (e) {
        // Keep the fallback timeout if observer fails
      }
    }
  }
}

/**
 * Report collected performance metrics
 */
function reportPerformanceMetrics() {
  // Calculate elapsed times
  const timings = {
    fcp: PERFORMANCE_METRICS.firstContentfulPaint - PERFORMANCE_METRICS.startTime,
    dcl: PERFORMANCE_METRICS.DOMContentLoaded - PERFORMANCE_METRICS.startTime,
    load: PERFORMANCE_METRICS.loaded - PERFORMANCE_METRICS.startTime
  };
  
  // Log to console in development
  if (window.location.hostname === 'localhost' || window.location.hostname.includes('repl.it')) {
    console.debug('%c📊 Performance Metrics', 'font-weight: bold; color: #00A4E0;');
    console.debug(`First Contentful Paint: ${Math.round(timings.fcp)}ms`);
    console.debug(`DOMContentLoaded: ${Math.round(timings.dcl)}ms`);
    console.debug(`Load: ${Math.round(timings.load)}ms`);
  }
  
  // If analytics or monitoring available, send the metrics
  if (window.dataLayer) {
    window.dataLayer.push({
      event: 'performance',
      performance_metrics: {
        fcp: Math.round(timings.fcp),
        dcl: Math.round(timings.dcl),
        load: Math.round(timings.load)
      }
    });
  }
}

/**
 * Initialize mobile navigation
 */
function initMobileNavigation() {
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const overlay = document.querySelector('.mobile-menu-overlay');
  
  if (!menuToggle || !mobileMenu) return;
  
  // Create overlay if it doesn't exist
  if (!overlay) {
    const newOverlay = document.createElement('div');
    newOverlay.className = 'mobile-menu-overlay';
    document.body.appendChild(newOverlay);
  }
  
  menuToggle.addEventListener('click', function() {
    const isExpanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', !isExpanded);
    
    mobileMenu.classList.toggle('active');
    document.querySelector('.mobile-menu-overlay').classList.toggle('active');
    document.body.classList.toggle('menu-open');
    
    // Announce to screen readers
    const announcer = document.getElementById('screen-reader-announcer');
    if (announcer) {
      announcer.textContent = !isExpanded ? 'Mobiles Menü geöffnet' : 'Mobiles Menü geschlossen';
    }
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
    if (
      mobileMenu.classList.contains('active') && 
      !mobileMenu.contains(e.target) && 
      !menuToggle.contains(e.target)
    ) {
      menuToggle.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('active');
      document.querySelector('.mobile-menu-overlay').classList.remove('active');
      document.body.classList.remove('menu-open');
    }
  });
  
  // Close menu with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
      menuToggle.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('active');
      document.querySelector('.mobile-menu-overlay').classList.remove('active');
      document.body.classList.remove('menu-open');
      
      // Return focus to toggle button
      menuToggle.focus();
    }
  });
}

/**
 * Initialize language selector
 */
function initLanguageSelector() {
  const languageButton = document.querySelector('.language-selector button');
  const languageDropdown = document.querySelector('.language-dropdown');
  
  if (!languageButton || !languageDropdown) return;
  
  languageButton.addEventListener('click', function(e) {
    e.preventDefault();
    const expanded = this.getAttribute('aria-expanded') === 'true' || false;
    this.setAttribute('aria-expanded', !expanded);
    languageDropdown.classList.toggle('active');
    
    // Handle click outside
    const closeDropdown = function(event) {
      if (!languageButton.contains(event.target)) {
        languageButton.setAttribute('aria-expanded', 'false');
        languageDropdown.classList.remove('active');
        document.removeEventListener('click', closeDropdown);
      }
    };
    
    if (!expanded) {
      // Add click outside listener with a delay
      setTimeout(() => {
        document.addEventListener('click', closeDropdown);
      }, 0);
    } else {
      document.removeEventListener('click', closeDropdown);
    }
  });
  
  // Add keyboard support
  languageButton.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      this.setAttribute('aria-expanded', 'false');
      languageDropdown.classList.remove('active');
    } else if (e.key === 'ArrowDown' && this.getAttribute('aria-expanded') === 'true') {
      e.preventDefault();
      const firstLink = languageDropdown.querySelector('a');
      if (firstLink) firstLink.focus();
    }
  });
  
  // Add keyboard navigation within dropdown
  const languageLinks = languageDropdown.querySelectorAll('a');
  languageLinks.forEach(function(link, index) {
    link.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        languageButton.setAttribute('aria-expanded', 'false');
        languageDropdown.classList.remove('active');
        languageButton.focus();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextLink = languageLinks[index + 1] || languageLinks[0];
        nextLink.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevLink = languageLinks[index - 1] || languageLinks[languageLinks.length - 1];
        prevLink.focus();
      }
    });
  });
}

/**
 * Initialize cookie consent
 */
function initCookieConsent() {
  // Check if user has already made a choice
  if (localStorage.getItem('cookie-consent')) {
    return;
  }
  
  const cookieBanner = document.querySelector('.cookie-banner');
  if (!cookieBanner) return;
  
  // Show cookie banner
  setTimeout(function() {
    cookieBanner.classList.add('active');
    
    // Announce to screen readers
    const announcer = document.getElementById('screen-reader-announcer');
    if (announcer) {
      announcer.textContent = 'Cookie-Einwilligung erforderlich. Bitte treffen Sie eine Auswahl.';
    }
  }, 1000);
  
  // Handle cookie consent actions
  const acceptButton = cookieBanner.querySelector('.accept-cookies');
  const essentialButton = cookieBanner.querySelector('.essential-cookies');
  
  if (acceptButton) {
    acceptButton.addEventListener('click', function() {
      localStorage.setItem('cookie-consent', 'all');
      cookieBanner.classList.remove('active');
    });
  }
  
  if (essentialButton) {
    essentialButton.addEventListener('click', function() {
      localStorage.setItem('cookie-consent', 'essential');
      cookieBanner.classList.remove('active');
    });
  }
}

/**
 * Register service worker if supported
 */
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/service-worker.js')
        .then(function(registration) {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        })
        .catch(function(error) {
          console.error('ServiceWorker registration failed: ', error);
        });
    });
  }
}

/**
 * Initialize Bootstrap components 
 */
function initBootstrapComponents() {
  // Initialize all Bootstrap tooltips
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
  
  // Initialize all Bootstrap popovers
  const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
  popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl);
  });
  
  // Ensure navbar toggler works correctly
  const navbarToggler = document.querySelector('.navbar-toggler');
  if (navbarToggler) {
    navbarToggler.addEventListener('click', function() {
      const targetId = this.getAttribute('data-bs-target');
      if (targetId) {
        const navbarCollapse = document.querySelector(targetId);
        if (navbarCollapse) {
          navbarCollapse.classList.toggle('show');
        }
      }
    });
  }
}