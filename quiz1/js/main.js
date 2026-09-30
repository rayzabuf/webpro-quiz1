/**
 * WEB PROGRAMMING (D) - QUIZ 1 JAVASCRIPT
 * Author: Muhammad Rayza Buftiem (NRP: 5025251262)
 * Department of Informatics - Institut Teknologi Sepuluh Nopember (ITS)
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initModals();
  initFilters();
  initClipboard();
  initLiveClock();
  initScrollEffects();
});

/* ==========================================================================
   1. Theme Toggle (Dark / Light Mode)
   ========================================================================== */
function initTheme() {
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const savedTheme = localStorage.getItem('webpro_theme') || 'dark';

  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
    updateThemeIcons(true);
  } else {
    document.body.classList.remove('light-theme');
    updateThemeIcons(false);
  }

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const isLight = document.body.classList.toggle('light-theme');
      localStorage.setItem('webpro_theme', isLight ? 'light' : 'dark');
      updateThemeIcons(isLight);
      showToast(isLight ? 'Switched to Light Theme' : 'Switched to Dark Theme');
    });
  });
}

function updateThemeIcons(isLight) {
  const icons = document.querySelectorAll('.theme-toggle-btn i');
  icons.forEach(icon => {
    if (isLight) {
      icon.className = 'fa-solid fa-moon';
    } else {
      icon.className = 'fa-solid fa-sun';
    }
  });
}

/* ==========================================================================
   2. Responsive Navigation & Mobile Drawer
   ========================================================================== */
function initNavigation() {
  const header = document.querySelector('.site-header');
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const drawerCloseBtn = document.querySelector('.drawer-close-btn');
  const mobileOverlay = document.querySelector('.mobile-nav-overlay');

  // Sticky header shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, { passive: true });

  // Open / Close Drawer
  function openDrawer() {
    mobileOverlay?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileOverlay?.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburgerBtn?.addEventListener('click', openDrawer);
  drawerCloseBtn?.addEventListener('click', closeDrawer);

  mobileOverlay?.addEventListener('click', (e) => {
    if (e.target === mobileOverlay) {
      closeDrawer();
    }
  });

  // Highlight active link based on current path
  const currentPath = window.location.pathname.replace(/\/$/, '');
  const allNavLinks = document.querySelectorAll('.nav-link, .drawer-link');

  allNavLinks.forEach(link => {
    const linkPath = new URL(link.href, window.location.origin).pathname.replace(/\/$/, '');
    if (currentPath === linkPath || (linkPath.endsWith('/quiz1') && (currentPath.endsWith('/quiz1') || currentPath.endsWith('/quiz1/index.html')))) {
      link.classList.add('active');
    }
  });
}

/* ==========================================================================
   3. Interactive Filter Tabs (Culinary & Tourist Places)
   ========================================================================== */
function initFilters() {
  const filterContainers = document.querySelectorAll('.filter-container');

  filterContainers.forEach(container => {
    const filterBtns = container.querySelectorAll('.filter-btn');
    const targetGridId = container.getAttribute('data-target-grid');
    const targetGrid = document.getElementById(targetGridId);

    if (!targetGrid) return;
    const items = targetGrid.querySelectorAll('.filter-item');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        items.forEach(item => {
          const category = item.getAttribute('data-category');
          if (filterValue === 'all' || category === filterValue || category?.includes(filterValue)) {
            item.style.display = '';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'translateY(0) scale(1)';
            }, 20);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'translateY(15px) scale(0.96)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 250);
          }
        });
      });
    });
  });
}

/* ==========================================================================
   4. Modal Dialogs (Food details & Tourist spot virtual postcard)
   ========================================================================== */
function initModals() {
  const modalTriggers = document.querySelectorAll('[data-modal-target]');
  const modalOverlays = document.querySelectorAll('.modal-overlay');

  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = trigger.getAttribute('data-modal-target');
      const targetModal = document.getElementById(targetId);
      if (targetModal) {
        targetModal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  modalOverlays.forEach(overlay => {
    const closeBtn = overlay.querySelector('.modal-close-btn');
    
    function closeModal() {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    closeBtn?.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal();
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modalOverlays.forEach(overlay => overlay.classList.remove('open'));
      document.body.style.overflow = '';
    }
  });
}

/* ==========================================================================
   5. Clipboard Copy Utility & Toast Notification
   ========================================================================== */
function initClipboard() {
  const copyButtons = document.querySelectorAll('[data-copy]');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`Copied to clipboard: ${textToCopy}`);
      }).catch(() => {
        showToast('Failed to copy to clipboard');
      });
    });
  });
}

function showToast(message) {
  let toast = document.querySelector('.toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<i class="fa-solid fa-circle-check text-accent"></i> <span>${message}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/* ==========================================================================
   6. Live Jakarta Time & Weather Simulator
   ========================================================================== */
function initLiveClock() {
  const clockElement = document.getElementById('jakarta-clock');
  const tempElement = document.getElementById('jakarta-temp');

  if (!clockElement) return;

  function updateClock() {
    const now = new Date();
    // Jakarta is UTC+7
    const options = {
      timeZone: 'Asia/Jakarta',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    clockElement.textContent = new Intl.DateTimeFormat('en-US', options).format(now) + ' WIB';
  }

  updateClock();
  setInterval(updateClock, 1000);
}

/* ==========================================================================
   7. Scroll Reveal & Intersection Observers
   ========================================================================== */
function initScrollEffects() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-visible'));
  }
}
