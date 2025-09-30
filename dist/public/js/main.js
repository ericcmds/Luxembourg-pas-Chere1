/**
 * Luxembourg Pas Chere - Main JavaScript
 * Main JavaScript functionality for the website
 */

// Execute when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components
  initMobileMenu();
  initSmoothScroll();
  initLazyLoading();
  initScrollAnimations();
  initFilterSystem();
  
  // Initialize all forms
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    initContactForm(contactForm);
  }
  
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    initNewsletter(newsletterForm);
  }
});

/**
 * Initialize the mobile menu functionality
 */
function initMobileMenu() {
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const navigation = document.querySelector('.main-navigation');
  
  if (!menuToggle || !navigation) return;
  
  menuToggle.addEventListener('click', function() {
    const expanded = this.getAttribute('aria-expanded') === 'true' || false;
    this.setAttribute('aria-expanded', !expanded);
    navigation.classList.toggle('active');
    document.body.classList.toggle('menu-open', !expanded);
    
    // Announce to screen readers
    const status = !expanded ? 'geöffnet' : 'geschlossen';
    announceToScreenReader(`Menü ${status}`);
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', function(event) {
    if (
      navigation.classList.contains('active') && 
      !navigation.contains(event.target) && 
      !menuToggle.contains(event.target)
    ) {
      menuToggle.setAttribute('aria-expanded', 'false');
      navigation.classList.remove('active');
      document.body.classList.remove('menu-open');
    }
  });
  
  // Handle ESC key
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && navigation.classList.contains('active')) {
      menuToggle.setAttribute('aria-expanded', 'false');
      navigation.classList.remove('active');
      document.body.classList.remove('menu-open');
      
      // Return focus to the toggle button
      menuToggle.focus();
    }
  });
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initSmoothScroll() {
  const scrollLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
  
  scrollLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        e.preventDefault();
        
        // Respect reduced motion preferences
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (prefersReducedMotion) {
          // Instant scroll for users who prefer reduced motion
          targetElement.scrollIntoView();
        } else {
          // Smooth scroll with animation
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
        
        // Update URL without scrolling
        history.pushState(null, null, targetId);
        
        // Set focus to the target for accessibility
        targetElement.setAttribute('tabindex', '-1');
        targetElement.focus();
        
        // Announce to screen readers
        const sectionName = targetElement.getAttribute('aria-label') || 
                          targetElement.querySelector('h1, h2, h3, h4, h5, h6')?.textContent ||
                          targetId.substring(1);
        announceToScreenReader(`Navigiert zu Abschnitt: ${sectionName}`);
      }
    });
  });
}

/**
 * Initialize lazy loading for images
 */
function initLazyLoading() {
  // Check if native lazy loading is supported
  if ('loading' in HTMLImageElement.prototype) {
    // Use native lazy loading
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
      if (img.dataset.srcset) {
        img.srcset = img.dataset.srcset;
      }
      img.loading = 'lazy';
      img.classList.add('loaded');
    });
  } else {
    // Fallback to Intersection Observer API
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            if (img.dataset.srcset) {
              img.srcset = img.dataset.srcset;
            }
            img.classList.add('loaded');
            imageObserver.unobserve(img);
          }
        });
      });
      
      const lazyImages = document.querySelectorAll('img[data-src]');
      lazyImages.forEach(img => {
        imageObserver.observe(img);
      });
    } else {
      // Fallback for older browsers
      let lazyLoadThrottleTimeout;
      
      function lazyLoad() {
        if (lazyLoadThrottleTimeout) {
          clearTimeout(lazyLoadThrottleTimeout);
        }
        
        lazyLoadThrottleTimeout = setTimeout(function() {
          const scrollTop = window.scrollY;
          const lazyImages = document.querySelectorAll('img[data-src]');
          
          lazyImages.forEach(function(img) {
            if (img.offsetTop < window.innerHeight + scrollTop) {
              img.src = img.dataset.src;
              if (img.dataset.srcset) {
                img.srcset = img.dataset.srcset;
              }
              img.classList.add('loaded');
            }
          });
          
          if (lazyImages.length === 0) { 
            document.removeEventListener('scroll', lazyLoad);
            window.removeEventListener('resize', lazyLoad);
            window.removeEventListener('orientationChange', lazyLoad);
          }
        }, 20);
      }
      
      document.addEventListener('scroll', lazyLoad);
      window.addEventListener('resize', lazyLoad);
      window.addEventListener('orientationChange', lazyLoad);
      
      // Initial load
      lazyLoad();
    }
  }
}

/**
 * Initialize animations on scroll
 */
function initScrollAnimations() {
  // Check if Intersection Observer is supported
  if ('IntersectionObserver' in window) {
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    // Early return if no elements to animate
    if (!animateElements.length) return;
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      // If user prefers reduced motion, show all elements without animation
      animateElements.forEach(el => {
        el.classList.add('animated');
      });
      return;
    }
    
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add animated class with delay based on data attribute
          const element = entry.target;
          const delay = element.dataset.delay || 0;
          
          setTimeout(() => {
            element.classList.add('animated');
          }, delay);
          
          // Unobserve element after animation is triggered
          observer.unobserve(element);
        }
      });
    }, options);
    
    // Observe all animate elements
    animateElements.forEach(element => {
      observer.observe(element);
    });
  } else {
    // Fallback for browsers that don't support Intersection Observer
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      el.classList.add('animated');
    });
  }
}

/**
 * Initialize the offer filtering system
 */
function initFilterSystem() {
  const filterForm = document.querySelector('.filter-form');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const offerItems = document.querySelectorAll('.offer-item');
  
  if (!filterForm || !offerItems.length) return;
  
  // Initialize filter state based on URL parameters
  initializeFiltersFromUrl();
  
  // Add event listeners to filter buttons
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      const filterValue = this.dataset.filter;
      
      // Toggle active state
      if (filterValue === 'all') {
        // When 'all' is clicked, deactivate other filters
        filterButtons.forEach(btn => {
          btn.setAttribute('aria-pressed', btn === this);
          btn.classList.toggle('active', btn === this);
        });
      } else {
        // Toggle the clicked filter
        const isActive = this.getAttribute('aria-pressed') === 'true';
        this.setAttribute('aria-pressed', !isActive);
        this.classList.toggle('active');
        
        // Deactivate 'all' button if any other filter is active
        const allButton = document.querySelector('.filter-btn[data-filter="all"]');
        if (allButton) {
          allButton.setAttribute('aria-pressed', 'false');
          allButton.classList.remove('active');
        }
      }
      
      // Apply the filters
      applyFilters();
      
      // Update URL with current filters
      updateUrlWithFilters();
      
      // Announce filter changes to screen readers
      const activeFilters = getActiveFilters();
      const filterDescription = activeFilters.length ? 
        `Filter angewendet: ${activeFilters.join(', ')}` : 
        'Alle Filter zurückgesetzt';
      
      announceToScreenReader(filterDescription);
    });
  });
  
  // Handle form submission
  filterForm.addEventListener('submit', function(e) {
    e.preventDefault();
    applyFilters();
  });
  
  // Function to apply current filters
  function applyFilters() {
    const activeFilters = getActiveFilters();
    
    // Show all items if 'all' is selected or no filters are active
    const showAll = activeFilters.length === 0 || activeFilters.includes('all');
    
    offerItems.forEach(item => {
      const categories = item.dataset.categories.split(',');
      const location = item.dataset.location;
      const price = parseFloat(item.dataset.price);
      
      let shouldShow = showAll;
      
      if (!showAll) {
        // Check if any of the item's categories match the active filters
        const categoryMatch = activeFilters.some(filter => 
          categories.includes(filter) || 
          filter === location
        );
        
        // Check price range if price filter is active
        const priceFilter = document.getElementById('price-range');
        const maxPrice = priceFilter ? parseFloat(priceFilter.value) : 100;
        const priceMatch = price <= maxPrice;
        
        shouldShow = categoryMatch && priceMatch;
      }
      
      // Show or hide the item
      item.classList.toggle('hidden', !shouldShow);
      
      // Ensure proper accessibility
      if (shouldShow) {
        item.removeAttribute('aria-hidden');
        item.querySelector('a, button')?.removeAttribute('tabindex');
      } else {
        item.setAttribute('aria-hidden', 'true');
        item.querySelector('a, button')?.setAttribute('tabindex', '-1');
      }
    });
    
    // Check if no results are shown
    updateNoResultsMessage();
  }
  
  // Function to get active filters
  function getActiveFilters() {
    return Array.from(document.querySelectorAll('.filter-btn[aria-pressed="true"]'))
      .map(btn => btn.dataset.filter);
  }
  
  // Function to initialize filters from URL
  function initializeFiltersFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const filterParam = params.get('filter');
    
    if (filterParam) {
      const filters = filterParam.split(',');
      
      // Activate buttons based on URL parameters
      filterButtons.forEach(button => {
        const isActive = filters.includes(button.dataset.filter);
        button.setAttribute('aria-pressed', isActive);
        button.classList.toggle('active', isActive);
      });
      
      // Apply the filters
      applyFilters();
    } else {
      // By default, activate the 'all' button
      const allButton = document.querySelector('.filter-btn[data-filter="all"]');
      if (allButton) {
        allButton.setAttribute('aria-pressed', 'true');
        allButton.classList.add('active');
      }
    }
  }
  
  // Function to update URL with current filters
  function updateUrlWithFilters() {
    const activeFilters = getActiveFilters();
    const url = new URL(window.location);
    
    if (activeFilters.length === 0 || (activeFilters.length === 1 && activeFilters[0] === 'all')) {
      url.searchParams.delete('filter');
    } else {
      url.searchParams.set('filter', activeFilters.join(','));
    }
    
    history.replaceState(null, '', url);
  }
  
  // Function to update no results message
  function updateNoResultsMessage() {
    const visibleItems = document.querySelectorAll('.offer-item:not(.hidden)');
    const noResultsMessage = document.querySelector('.no-results-message');
    
    if (noResultsMessage) {
      noResultsMessage.classList.toggle('hidden', visibleItems.length > 0);
      
      if (visibleItems.length === 0) {
        // Announce no results to screen readers
        announceToScreenReader('Keine Ergebnisse gefunden. Bitte passen Sie Ihre Filter an.');
      }
    }
  }
  
  // Initialize price range input if present
  const priceRange = document.getElementById('price-range');
  const priceValue = document.getElementById('price-value');
  
  if (priceRange && priceValue) {
    // Update the price display when range is changed
    priceRange.addEventListener('input', function() {
      priceValue.textContent = this.value + '€';
    });
    
    // Apply filters when range is changed
    priceRange.addEventListener('change', function() {
      applyFilters();
      updateUrlWithFilters();
      
      // Announce price change to screen readers
      announceToScreenReader(`Preis gefiltert auf maximal ${this.value} Euro`);
    });
  }
}

/**
 * Initialize the newsletter signup form
 */
function initNewsletter(form) {
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Get form data
    const email = form.querySelector('input[name="email"]').value;
    const name = form.querySelector('input[name="name"]')?.value || '';
    const language = document.documentElement.lang || 'de';
    
    // Validate email
    if (!validateEmail(email)) {
      showFormMessage(form, 'Bitte geben Sie eine gültige E-Mail-Adresse ein.', 'error');
      return;
    }
    
    // Check for online status
    if (!navigator.onLine) {
      // Store the data for later if offline
      storeNewsletterData({ email, name, language });
      
      showFormMessage(form, 'Ihre Anmeldung wird gespeichert und gesendet, sobald Sie wieder online sind.', 'warning');
      
      // Request to sync when back online
      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        try {
          const registration = await navigator.serviceWorker.ready;
          await registration.sync.register('sync-newsletter');
        } catch (error) {
          console.error('Background sync could not be registered:', error);
        }
      }
      
      return;
    }
    
    // Submit the form
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, name, language })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Success
        showFormMessage(form, 'Vielen Dank für Ihre Anmeldung zum Newsletter!', 'success');
        form.reset();
        
        // Announce success to screen readers
        announceToScreenReader('Newsletter-Anmeldung erfolgreich. Vielen Dank!');
      } else {
        // API error
        showFormMessage(form, data.message || 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.', 'error');
      }
    } catch (error) {
      // Network error
      showFormMessage(form, 'Verbindungsfehler. Bitte überprüfen Sie Ihre Internetverbindung.', 'error');
      console.error('Newsletter submission error:', error);
    }
  });
}

/**
 * Initialize the contact form
 */
function initContactForm(form) {
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(form);
    const formObject = Object.fromEntries(formData.entries());
    
    // Validate form data
    if (!validateContactForm(formObject, form)) {
      return;
    }
    
    // Check for online status
    if (!navigator.onLine) {
      // Store the data for later if offline
      storeContactData(formObject);
      
      showFormMessage(form, 'Ihre Nachricht wird gespeichert und gesendet, sobald Sie wieder online sind.', 'warning');
      
      // Request to sync when back online
      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        try {
          const registration = await navigator.serviceWorker.ready;
          await registration.sync.register('sync-contact');
        } catch (error) {
          console.error('Background sync could not be registered:', error);
        }
      }
      
      return;
    }
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Wird gesendet...';
    
    // Submit the form
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formObject)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Success
        showFormMessage(form, 'Vielen Dank für Ihre Nachricht! Wir werden uns so schnell wie möglich bei Ihnen melden.', 'success');
        form.reset();
        
        // Announce success to screen readers
        announceToScreenReader('Formular erfolgreich gesendet. Vielen Dank für Ihre Nachricht!');
      } else {
        // API error
        showFormMessage(form, data.message || 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.', 'error');
      }
    } catch (error) {
      // Network error
      showFormMessage(form, 'Verbindungsfehler. Bitte überprüfen Sie Ihre Internetverbindung.', 'error');
      console.error('Contact form submission error:', error);
    } finally {
      // Reset button state
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  });
  
  // Live validation
  const inputs = form.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('blur', function() {
      validateInput(this, form);
    });
    
    input.addEventListener('input', function() {
      // Remove error state as user types
      this.classList.remove('error');
      const errorElement = document.getElementById(`${this.id}-error`);
      if (errorElement) {
        errorElement.textContent = '';
        errorElement.setAttribute('aria-hidden', 'true');
      }
    });
  });
}

/**
 * Validate an individual form input
 */
function validateInput(input, form) {
  const errorElement = document.getElementById(`${input.id}-error`) || 
                      document.createElement('div');
  
  // Configure error element if it doesn't exist
  if (!document.getElementById(`${input.id}-error`)) {
    errorElement.id = `${input.id}-error`;
    errorElement.className = 'error-message';
    errorElement.setAttribute('aria-live', 'polite');
    input.parentNode.appendChild(errorElement);
  }
  
  // Check for required fields
  if (input.required && !input.value.trim()) {
    input.classList.add('error');
    errorElement.textContent = 'Dieses Feld ist erforderlich.';
    errorElement.setAttribute('aria-hidden', 'false');
    return false;
  }
  
  // Check email format
  if (input.type === 'email' && input.value && !validateEmail(input.value)) {
    input.classList.add('error');
    errorElement.textContent = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
    errorElement.setAttribute('aria-hidden', 'false');
    return false;
  }
  
  // Add more validation rules as needed
  
  // Clear error state if valid
  input.classList.remove('error');
  errorElement.textContent = '';
  errorElement.setAttribute('aria-hidden', 'true');
  return true;
}

/**
 * Validate the entire contact form
 */
function validateContactForm(formData, form) {
  let isValid = true;
  
  // Validate each required field
  form.querySelectorAll('[required]').forEach(input => {
    if (!validateInput(input, form)) {
      isValid = false;
    }
  });
  
  return isValid;
}

/**
 * Helper function to validate email format
 */
function validateEmail(email) {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).toLowerCase());
}

/**
 * Helper function to show form messages
 */
function showFormMessage(form, message, type) {
  let messageElement = form.querySelector('.form-message');
  
  if (!messageElement) {
    messageElement = document.createElement('div');
    messageElement.className = 'form-message';
    messageElement.setAttribute('aria-live', 'assertive');
    form.appendChild(messageElement);
  }
  
  messageElement.textContent = message;
  messageElement.className = `form-message ${type}`;
  messageElement.setAttribute('aria-hidden', 'false');
  
  // Scroll to message
  messageElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  
  // Clear success message after some time
  if (type === 'success') {
    setTimeout(() => {
      messageElement.textContent = '';
      messageElement.setAttribute('aria-hidden', 'true');
    }, 5000);
  }
}

/**
 * Store newsletter data for offline submission
 */
function storeNewsletterData(data) {
  if ('indexedDB' in window) {
    const request = indexedDB.open('luxembourg-pas-chere-db', 1);
    
    request.onupgradeneeded = event => {
      const db = event.target.result;
      
      if (!db.objectStoreNames.contains('newsletter-store')) {
        db.createObjectStore('newsletter-store', { keyPath: 'id' });
      }
    };
    
    request.onsuccess = event => {
      const db = event.target.result;
      const transaction = db.transaction('newsletter-store', 'readwrite');
      const store = transaction.objectStore('newsletter-store');
      
      store.add({
        id: Date.now(),
        data: data,
        timestamp: new Date().toISOString()
      });
    };
  }
}

/**
 * Store contact form data for offline submission
 */
function storeContactData(data) {
  if ('indexedDB' in window) {
    const request = indexedDB.open('luxembourg-pas-chere-db', 1);
    
    request.onupgradeneeded = event => {
      const db = event.target.result;
      
      if (!db.objectStoreNames.contains('contact-store')) {
        db.createObjectStore('contact-store', { keyPath: 'id' });
      }
    };
    
    request.onsuccess = event => {
      const db = event.target.result;
      const transaction = db.transaction('contact-store', 'readwrite');
      const store = transaction.objectStore('contact-store');
      
      store.add({
        id: Date.now(),
        data: data,
        timestamp: new Date().toISOString()
      });
    };
  }
}

/**
 * Helper function to announce messages to screen readers
 */
function announceToScreenReader(message) {
  let announcer = document.getElementById('screen-reader-announcer');
  
  if (!announcer) {
    announcer = document.createElement('div');
    announcer.id = 'screen-reader-announcer';
    announcer.className = 'sr-only';
    announcer.setAttribute('aria-live', 'assertive');
    announcer.setAttribute('aria-atomic', 'true');
    document.body.appendChild(announcer);
  }
  
  // Set the message text
  announcer.textContent = message;
  
  // Clear the announcer after a delay
  setTimeout(() => {
    announcer.textContent = '';
  }, 3000);
}