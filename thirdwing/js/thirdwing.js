/**
 * @file
 * Thirdwing D11 Theme - Main JavaScript functionality
 * Progressive enhancement and accessibility features
 */

(function (Drupal, once) {
  'use strict';

  /**
   * Initialize Thirdwing theme functionality
   */
  Drupal.behaviors.thirdwingInit = {
    attach: function (context, settings) {
      // Add theme-specific classes
      once('thirdwing-init', 'body', context).forEach(function (body) {
        body.classList.add('thirdwing-js-enabled');
        
        // Detect touch devices
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
          body.classList.add('touch-device');
        } else {
          body.classList.add('no-touch');
        }
        
        // Detect reduced motion preference
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          body.classList.add('reduce-motion');
        }
        
        // Detect high contrast preference
        if (window.matchMedia && window.matchMedia('(prefers-contrast: high)').matches) {
          body.classList.add('high-contrast');
        }
        
        // Detect dark mode preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          body.classList.add('dark-mode');
        }
      });
    }
  };

  /**
   * Enhanced focus management for accessibility
   */
  Drupal.behaviors.thirdwingFocus = {
    attach: function (context, settings) {
      // Track keyboard navigation
      once('focus-management', document, context).forEach(function () {
        let isUsingKeyboard = false;
        
        document.addEventListener('keydown', function (e) {
          if (e.key === 'Tab') {
            isUsingKeyboard = true;
            document.body.classList.add('using-keyboard');
          }
        });
        
        document.addEventListener('mousedown', function () {
          isUsingKeyboard = false;
          document.body.classList.remove('using-keyboard');
        });
        
        // Enhanced focus indicators
        document.addEventListener('focusin', function (e) {
          if (isUsingKeyboard) {
            e.target.classList.add('keyboard-focused');
          }
        });
        
        document.addEventListener('focusout', function (e) {
          e.target.classList.remove('keyboard-focused');
        });
      });
    }
  };

  /**
   * Image lazy loading and optimization
   */
  Drupal.behaviors.thirdwingImages = {
    attach: function (context, settings) {
      // Lazy load images
      const images = context.querySelectorAll('img[data-src]');
      
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function (entries, observer) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              const img = entry.target;
              img.src = img.dataset.src;
              img.classList.remove('lazy');
              img.classList.add('loaded');
              observer.unobserve(img);
            }
          });
        });
        
        images.forEach(function (img) {
          imageObserver.observe(img);
        });
      } else {
        // Fallback for older browsers
        images.forEach(function (img) {
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          img.classList.add('loaded');
        });
      }
      
      // Add zoom functionality to gallery images
      const galleryImages = context.querySelectorAll('.gallery-grid img, .field-multiple.field-type-image img');
      
      galleryImages.forEach(function (img) {
        once('image-zoom', img).forEach(function (element) {
          element.addEventListener('click', function (e) {
            e.preventDefault();
            openImageModal(element);
          });
          
          // Add keyboard support
          element.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              openImageModal(element);
            }
          });
          
          // Make images focusable
          element.setAttribute('tabindex', '0');
          element.setAttribute('role', 'button');
          element.setAttribute('aria-label', 'Open image in full size');
        });
      });
    }
  };

  /**
   * Enhanced form functionality
   */
  Drupal.behaviors.thirdwingForms = {
    attach: function (context, settings) {
      // Auto-resize textareas
      const textareas = context.querySelectorAll('textarea');
      
      textareas.forEach(function (textarea) {
        once('auto-resize', textarea).forEach(function (element) {
          function resizeTextarea() {
            element.style.height = 'auto';
            element.style.height = element.scrollHeight + 'px';
          }
          
          element.addEventListener('input', resizeTextarea);
          element.addEventListener('paste', function () {
            setTimeout(resizeTextarea, 10);
          });
          
          // Initial resize
          resizeTextarea();
        });
      });
      
      // Enhanced file upload
      const fileInputs = context.querySelectorAll('input[type="file"]');
      
      fileInputs.forEach(function (fileInput) {
        once('file-upload-enhancement', fileInput).forEach(function (element) {
          const wrapper = document.createElement('div');
          wrapper.className = 'file-upload-wrapper';
          
          const label = document.createElement('label');
          label.className = 'file-upload-label';
          label.setAttribute('for', element.id || 'file-' + Math.random().toString(36).substr(2, 9));
          
          const icon = document.createElement('span');
          icon.className = 'file-upload-icon';
          icon.textContent = '📁';
          
          const text = document.createElement('span');
          text.className = 'file-upload-text';
          text.textContent = 'Choose file...';
          
          label.appendChild(icon);
          label.appendChild(text);
          
          element.parentNode.insertBefore(wrapper, element);
          wrapper.appendChild(element);
          wrapper.appendChild(label);
          
          element.addEventListener('change', function () {
            if (element.files.length > 0) {
              text.textContent = element.files[0].name;
              wrapper.classList.add('has-file');
            } else {
              text.textContent = 'Choose file...';
              wrapper.classList.remove('has-file');
            }
          });
        });
      });
      
      // Form validation enhancement
      const forms = context.querySelectorAll('form');
      
      forms.forEach(function (form) {
        once('form-validation', form).forEach(function (element) {
          const requiredFields = element.querySelectorAll('[required]');
          
          requiredFields.forEach(function (field) {
            field.addEventListener('blur', function () {
              validateField(field);
            });
            
            field.addEventListener('input', function () {
              if (field.classList.contains('error')) {
                validateField(field);
              }
            });
          });
          
          element.addEventListener('submit', function (e) {
            let isValid = true;
            
            requiredFields.forEach(function (field) {
              if (!validateField(field)) {
                isValid = false;
              }
            });
            
            if (!isValid) {
              e.preventDefault();
              // Focus first invalid field
              const firstInvalid = element.querySelector('.error');
              if (firstInvalid) {
                firstInvalid.focus();
              }
            }
          });
        });
      });
    }
  };

  /**
   * Progressive enhancement for content
   */
  Drupal.behaviors.thirdwingContent = {
    attach: function (context, settings) {
      // Add read time estimation
      const articles = context.querySelectorAll('.node-full .node-content');
      
      articles.forEach(function (article) {
        once('read-time', article).forEach(function (element) {
          const text = element.textContent || element.innerText || '';
          const words = text.trim().split(/\s+/).length;
          const readTime = Math.ceil(words / 200); // Average reading speed
          
          if (readTime > 1) {
            const readTimeElement = document.createElement('div');
            readTimeElement.className = 'read-time';
            readTimeElement.textContent = readTime + ' min read';
            
            const header = element.closest('.node').querySelector('.node-header');
            if (header) {
              header.appendChild(readTimeElement);
            }
          }
        });
      });
      
      // Enhanced video embeds
      const videoEmbeds = context.querySelectorAll('.field-type-video iframe');
      
      videoEmbeds.forEach(function (iframe) {
        once('video-enhancement', iframe).forEach(function (element) {
          const wrapper = element.closest('.field-type-video');
          if (wrapper) {
            const playButton = document.createElement('button');
            playButton.className = 'video-play-button';
            playButton.innerHTML = '<span class="play-icon">▶</span>';
            playButton.setAttribute('aria-label', 'Play video');
            
            wrapper.appendChild(playButton);
            wrapper.classList.add('video-preview');
            
            playButton.addEventListener('click', function () {
              wrapper.classList.remove('video-preview');
              wrapper.classList.add('video-playing');
              playButton.remove();
              
              // Auto-play if YouTube
              if (element.src.includes('youtube.com')) {
                element.src = element.src.replace('autoplay=0', 'autoplay=1');
                if (!element.src.includes('autoplay=')) {
                  element.src += (element.src.includes('?') ? '&' : '?') + 'autoplay=1';
                }
              }
            });
          }
        });
      });
      
      // Add print functionality
      const printButtons = context.querySelectorAll('.print-button, [data-print]');
      
      printButtons.forEach(function (button) {
        once('print-functionality', button).forEach(function (element) {
          element.addEventListener('click', function (e) {
            e.preventDefault();
            window.print();
          });
        });
      });
    }
  };

  /**
   * Search enhancement
   */
  Drupal.behaviors.thirdwingSearch = {
    attach: function (context, settings) {
      const searchForms = context.querySelectorAll('.search-form, form[id*="search"]');
      
      searchForms.forEach(function (form) {
        once('search-enhancement', form).forEach(function (element) {
          const searchInput = element.querySelector('input[type="search"], input[name*="search"]');
          
          if (searchInput) {
            // Add search suggestions (if API available)
            let searchTimeout;
            
            searchInput.addEventListener('input', function () {
              clearTimeout(searchTimeout);
              const query = searchInput.value.trim();
              
              if (query.length > 2) {
                searchTimeout = setTimeout(function () {
                  // Implement search suggestions here
                  showSearchSuggestions(searchInput, query);
                }, 300);
              } else {
                hideSearchSuggestions(searchInput);
              }
            });
            
            // Hide suggestions on blur
            searchInput.addEventListener('blur', function () {
              setTimeout(function () {
                hideSearchSuggestions(searchInput);
              }, 200);
            });
          }
        });
      });
    }
  };

  /**
   * Accessibility enhancements
   */
  Drupal.behaviors.thirdwingAccessibility = {
    attach: function (context, settings) {
      // Add skip links for keyboard navigation
      const mainContent = context.querySelector('#main-content, main, .main-content');
      if (mainContent && !document.querySelector('.skip-to-content')) {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-to-content sr-only-focusable';
        skipLink.textContent = 'Skip to main content';
        document.body.insertBefore(skipLink, document.body.firstChild);
      }
      
      // Enhance tables for screen readers
      const tables = context.querySelectorAll('table');
      
      tables.forEach(function (table) {
        once('table-accessibility', table).forEach(function (element) {
          // Add table caption if missing
          if (!element.querySelector('caption') && element.querySelector('th')) {
            const caption = document.createElement('caption');
            caption.className = 'sr-only';
            caption.textContent = 'Data table';
            element.insertBefore(caption, element.firstChild);
          }
          
          // Add scope attributes to headers
          const headers = element.querySelectorAll('th');
          headers.forEach(function (header) {
            if (!header.hasAttribute('scope')) {
              const parent = header.parentElement;
              const isFirstRow = parent === parent.parentElement.firstElementChild;
              header.setAttribute('scope', isFirstRow ? 'col' : 'row');
            }
          });
        });
      });
      
      // Enhance form labels
      const inputs = context.querySelectorAll('input, select, textarea');
      
      inputs.forEach(function (input) {
        once('input-labels', input).forEach(function (element) {
          if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
            const label = element.closest('.form-item, .form-group')?.querySelector('label');
            if (label && !label.getAttribute('for')) {
              const id = element.id || 'input-' + Math.random().toString(36).substr(2, 9);
              element.id = id;
              label.setAttribute('for', id);
            }
          }
        });
      });
    }
  };

  /**
   * Performance optimizations
   */
  Drupal.behaviors.thirdwingPerformance = {
    attach: function (context, settings) {
      // Lazy load iframes (maps, videos, etc.)
      const iframes = context.querySelectorAll('iframe[data-src]');
      
      if ('IntersectionObserver' in window) {
        const iframeObserver = new IntersectionObserver(function (entries, observer) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              const iframe = entry.target;
              iframe.src = iframe.dataset.src;
              observer.unobserve(iframe);
            }
          });
        });
        
        iframes.forEach(function (iframe) {
          iframeObserver.observe(iframe);
        });
      }
      
      // Preload critical resources on hover
      const importantLinks = context.querySelectorAll('a[href*="/node/"], .read-more-link');
      
      importantLinks.forEach(function (link) {
        once('link-preload', link).forEach(function (element) {
          element.addEventListener('mouseenter', function () {
            const href = element.getAttribute('href');
            if (href && !document.querySelector(`link[href="${href}"]`)) {
              const preloadLink = document.createElement('link');
              preloadLink.rel = 'prefetch';
              preloadLink.href = href;
              document.head.appendChild(preloadLink);
            }
          });
        });
      });
    }
  };

  // Helper functions
  function validateField(field) {
    const value = field.value.trim();
    const isValid = field.checkValidity && field.checkValidity();
    
    field.classList.toggle('error', !isValid);
    field.classList.toggle('valid', isValid);
    
    // Remove existing error message
    const existingError = field.parentElement.querySelector('.field-error');
    if (existingError) {
      existingError.remove();
    }
    
    // Add error message if invalid
    if (!isValid) {
      const errorMessage = document.createElement('div');
      errorMessage.className = 'field-error';
      errorMessage.textContent = field.validationMessage || 'This field is required.';
      field.parentElement.appendChild(errorMessage);
    }
    
    return isValid;
  }

  function openImageModal(img) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
      <div class="image-modal-backdrop"></div>
      <div class="image-modal-content">
        <button class="image-modal-close" aria-label="Close">&times;</button>
        <img src="${img.src}" alt="${img.alt || ''}" />
      </div>
    `;
    
    document.body.appendChild(modal);
    document.body.classList.add('modal-open');
    
    // Focus management
    const closeButton = modal.querySelector('.image-modal-close');
    closeButton.focus();
    
    function closeModal() {
      document.body.removeChild(modal);
      document.body.classList.remove('modal-open');
      img.focus(); // Return focus to original image
    }
    
    // Close handlers
    closeButton.addEventListener('click', closeModal);
    modal.querySelector('.image-modal-backdrop').addEventListener('click', closeModal);
    
    document.addEventListener('keydown', function escapeHandler(e) {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', escapeHandler);
      }
    });
  }

  function showSearchSuggestions(input, query) {
    // Implement search suggestions based on your needs
    console.log('Search suggestions for:', query);
  }

  function hideSearchSuggestions(input) {
    const suggestions = input.parentElement.querySelector('.search-suggestions');
    if (suggestions) {
      suggestions.remove();
    }
  }

})(Drupal, once);