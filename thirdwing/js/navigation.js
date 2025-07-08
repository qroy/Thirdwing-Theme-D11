/**
 * @file
 * Thirdwing D11 Theme - Navigation JavaScript
 * Handles mobile menu toggle and accessibility
 */

(function (Drupal, once) {
  'use strict';

  /**
   * Mobile Menu Toggle Functionality
   */
  Drupal.behaviors.thirdwingNavigation = {
    attach: function (context, settings) {
      // Mobile menu toggle
      const menuToggle = context.querySelector('.menu-toggle');
      const primaryMenu = context.querySelector('.primary-menu');
      const navigation = context.querySelector('.main-navigation');
      
      if (menuToggle && primaryMenu) {
        once('mobile-menu', menuToggle).forEach(function (element) {
          element.addEventListener('click', function (e) {
            e.preventDefault();
            
            const isExpanded = element.getAttribute('aria-expanded') === 'true';
            const newState = !isExpanded;
            
            // Update ARIA attributes
            element.setAttribute('aria-expanded', newState);
            
            // Toggle menu visibility
            primaryMenu.classList.toggle('is-active', newState);
            navigation.classList.toggle('menu-open', newState);
            
            // Focus management
            if (newState) {
              // Menu is opening - focus first link
              const firstLink = primaryMenu.querySelector('a');
              if (firstLink) {
                firstLink.focus();
              }
            }
          });
        });
      }
      
      // Close menu when clicking outside
      once('menu-outside-click', document).forEach(function () {
        document.addEventListener('click', function (e) {
          if (!navigation || !navigation.contains(e.target)) {
            if (primaryMenu && primaryMenu.classList.contains('is-active')) {
              primaryMenu.classList.remove('is-active');
              navigation.classList.remove('menu-open');
              if (menuToggle) {
                menuToggle.setAttribute('aria-expanded', 'false');
              }
            }
          }
        });
      });
      
      // Handle escape key
      once('menu-escape', document).forEach(function () {
        document.addEventListener('keydown', function (e) {
          if (e.key === 'Escape' && primaryMenu && primaryMenu.classList.contains('is-active')) {
            primaryMenu.classList.remove('is-active');
            navigation.classList.remove('menu-open');
            if (menuToggle) {
              menuToggle.setAttribute('aria-expanded', 'false');
              menuToggle.focus();
            }
          }
        });
      });
      
      // Handle window resize
      once('menu-resize', window).forEach(function () {
        window.addEventListener('resize', function () {
          if (window.innerWidth >= 980) { // Desktop breakpoint
            if (primaryMenu && primaryMenu.classList.contains('is-active')) {
              primaryMenu.classList.remove('is-active');
              navigation.classList.remove('menu-open');
              if (menuToggle) {
                menuToggle.setAttribute('aria-expanded', 'false');
              }
            }
          }
        });
      });
    }
  };

  /**
   * Submenu Handling for Desktop
   */
  Drupal.behaviors.thirdwingSubmenus = {
    attach: function (context, settings) {
      const menuItems = context.querySelectorAll('.primary-menu li');
      
      menuItems.forEach(function (item) {
        const submenu = item.querySelector('ul');
        if (submenu) {
          once('submenu-toggle', item).forEach(function (element) {
            const link = element.querySelector('a');
            
            // Add dropdown indicator
            if (link && !link.querySelector('.dropdown-indicator')) {
              const indicator = document.createElement('span');
              indicator.className = 'dropdown-indicator';
              indicator.setAttribute('aria-hidden', 'true');
              indicator.textContent = ' ▼';
              link.appendChild(indicator);
            }
            
            // Handle hover for desktop
            if (window.innerWidth >= 980) {
              element.addEventListener('mouseenter', function () {
                submenu.style.display = 'flex';
              });
              
              element.addEventListener('mouseleave', function () {
                submenu.style.display = 'none';
              });
            }
            
            // Handle focus for keyboard navigation
            link.addEventListener('focus', function () {
              if (window.innerWidth >= 980) {
                submenu.style.display = 'flex';
              }
            });
            
            // Handle blur to close submenu
            element.addEventListener('focusout', function (e) {
              if (window.innerWidth >= 980) {
                setTimeout(function () {
                  if (!element.contains(document.activeElement)) {
                    submenu.style.display = 'none';
                  }
                }, 100);
              }
            });
          });
        }
      });
    }
  };

  /**
   * Mobile Submenu Toggle
   */
  Drupal.behaviors.thirdwingMobileSubmenus = {
    attach: function (context, settings) {
      const menuItems = context.querySelectorAll('.primary-menu li');
      
      menuItems.forEach(function (item) {
        const submenu = item.querySelector('ul');
        if (submenu) {
          once('mobile-submenu', item).forEach(function (element) {
            const link = element.querySelector('a');
            
            // Create toggle button for mobile
            const toggleButton = document.createElement('button');
            toggleButton.className = 'submenu-toggle';
            toggleButton.setAttribute('aria-expanded', 'false');
            toggleButton.setAttribute('aria-controls', 'submenu-' + Math.random().toString(36).substr(2, 9));
            toggleButton.innerHTML = '<span class="sr-only">Toggle submenu</span><span aria-hidden="true">+</span>';
            
            submenu.setAttribute('id', toggleButton.getAttribute('aria-controls'));
            
            // Insert toggle button after link
            link.parentNode.insertBefore(toggleButton, link.nextSibling);
            
            // Handle toggle click
            toggleButton.addEventListener('click', function (e) {
              e.preventDefault();
              e.stopPropagation();
              
              const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
              const newState = !isExpanded;
              
              toggleButton.setAttribute('aria-expanded', newState);
              toggleButton.querySelector('[aria-hidden]').textContent = newState ? '−' : '+';
              
              submenu.style.display = newState ? 'block' : 'none';
            });
            
            // Hide submenu by default on mobile
            if (window.innerWidth < 980) {
              submenu.style.display = 'none';
            }
          });
        }
      });
    }
  };

  /**
   * Smooth Scroll for Anchor Links
   */
  Drupal.behaviors.thirdwingSmoothScroll = {
    attach: function (context, settings) {
      const anchorLinks = context.querySelectorAll('a[href^="#"]');
      
      anchorLinks.forEach(function (link) {
        once('smooth-scroll', link).forEach(function (element) {
          element.addEventListener('click', function (e) {
            const targetId = element.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
              e.preventDefault();
              
              // Close mobile menu if open
              const primaryMenu = document.querySelector('.primary-menu');
              const menuToggle = document.querySelector('.menu-toggle');
              const navigation = document.querySelector('.main-navigation');
              
              if (primaryMenu && primaryMenu.classList.contains('is-active')) {
                primaryMenu.classList.remove('is-active');
                navigation.classList.remove('menu-open');
                if (menuToggle) {
                  menuToggle.setAttribute('aria-expanded', 'false');
                }
              }
              
              // Smooth scroll to target
              const headerHeight = document.querySelector('.header').offsetHeight;
              const targetPosition = targetElement.offsetTop - headerHeight - 20;
              
              window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
              });
              
              // Focus target element for accessibility
              targetElement.focus();
            }
          });
        });
      });
    }
  };

  /**
   * Skip to Content Link
   */
  Drupal.behaviors.thirdwingSkipLink = {
    attach: function (context, settings) {
      const skipLink = context.querySelector('.skip-link');
      
      if (skipLink) {
        once('skip-link', skipLink).forEach(function (element) {
          element.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = element.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
              targetElement.focus();
              targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              });
            }
          });
        });
      }
    }
  };

})(Drupal, once);