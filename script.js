/* =============================================
   SAMANTHA SUN PORTFOLIO - script.js
   ============================================= */

(function () {
  'use strict';

  /* ─── Hero Typewriter ────────────────────── */
  const typewriterEl = document.getElementById('typewriter-text');
  if (typewriterEl) {
    const message = "Hi, I'm Sam!";
    const typeSpeed = 100;
    const deleteSpeed = 60;
    const holdDelay = 1500;
    const restartDelay = 500;

    const type = (i = 0) => {
      typewriterEl.textContent = message.slice(0, i);
      if (i < message.length) {
        setTimeout(() => type(i + 1), typeSpeed);
      } else {
        setTimeout(() => erase(message.length), holdDelay);
      }
    };

    const erase = (i) => {
      typewriterEl.textContent = message.slice(0, i);
      if (i > 0) {
        setTimeout(() => erase(i - 1), deleteSpeed);
      } else {
        setTimeout(() => type(0), restartDelay);
      }
    };

    type();
  }

  /* ─── Scroll Reveal (IntersectionObserver) ── */
  const revealEls = document.querySelectorAll(
    '.fade-up, .fade-in, .slide-left, .slide-right, .grow-in'
  );

  if (revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('is-visible', entry.isIntersecting);
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px',
      }
    );
    revealEls.forEach((el) => observer.observe(el));
  }

  /* ─── Navbar Scroll Behaviour ────────────── */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  /* ─── Timeline Track + Scroll Progress ──── */
  const timelineEl = document.querySelector('.timeline');
  const timelineTrackEl = document.querySelector('.timeline-track');
  const timelineProgressEl = document.querySelector('.timeline-progress');
  if (timelineEl && timelineTrackEl && timelineProgressEl) {
    let trackHeight = 0;
    let dotOffsets = [];
    const dots = timelineEl.querySelectorAll('.timeline-dot');

    const measureTrack = () => {
      if (!dots.length) return;
      const timelineRect = timelineEl.getBoundingClientRect();
      dotOffsets = Array.from(dots).map((dot) => {
        const dotRect = dot.getBoundingClientRect();
        return (dotRect.top + dotRect.height / 2) - timelineRect.top - 10;
      });
      trackHeight = dotOffsets[dotOffsets.length - 1];
      timelineTrackEl.style.height = `${trackHeight}px`;
    };

    const updateTimelineProgress = () => {
      const rect = timelineEl.getBoundingClientRect();
      const viewportCenter = window.innerHeight * 0.5;
      const doc = document.documentElement;
      const atPageBottom = window.scrollY + window.innerHeight >= doc.scrollHeight - 2;
      const progressPx = atPageBottom
        ? trackHeight
        : Math.min(trackHeight, Math.max(0, viewportCenter - rect.top - 10));
      timelineProgressEl.style.height = `${progressPx}px`;
      dots.forEach((dot, i) => {
        dot.classList.toggle('is-active', progressPx >= dotOffsets[i]);
      });
    };

    const remeasure = () => {
      measureTrack();
      updateTimelineProgress();
    };

    remeasure();
    window.addEventListener('scroll', updateTimelineProgress, { passive: true });
    window.addEventListener('resize', remeasure);
    window.addEventListener('load', remeasure);
    if (window.ResizeObserver) {
      new ResizeObserver(remeasure).observe(timelineEl);
    }
  }

  /* ─── Image Lightbox (click to enlarge) ─── */
  const lightboxTriggers = document.querySelectorAll('.solution-image');
  if (lightboxTriggers.length) {
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';

    const img = document.createElement('img');
    img.className = 'lightbox-image';

    const closeBtn = document.createElement('div');
    closeBtn.className = 'lightbox-close';
    closeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';

    overlay.appendChild(img);
    overlay.appendChild(closeBtn);
    document.body.appendChild(overlay);

    const closeLightbox = () => overlay.classList.remove('is-open');

    overlay.addEventListener('click', closeLightbox);
    img.addEventListener('click', (e) => e.stopPropagation());

    lightboxTriggers.forEach((el) => {
      el.addEventListener('click', () => {
        img.src = el.currentSrc || el.src;
        img.alt = el.alt || '';
        img.style.background = getComputedStyle(el).backgroundColor;
        overlay.classList.add('is-open');
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  /* ─── Mobile Menu Toggle ─────────────────── */
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileMenu = document.querySelector('.nav-mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);

      const icon = hamburger.querySelector('i');
      if (icon) {
        icon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
      }
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        const icon = hamburger.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        const icon = hamburger.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
      }
    });
  }

  /* ─── Works Dropdown (desktop) ───────────── */
  const navDropdown = document.querySelector('.nav-dropdown');
  const navDropdownTrigger = document.querySelector('.nav-dropdown-trigger');

  if (navDropdown && navDropdownTrigger) {
    navDropdownTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navDropdown.classList.toggle('open');
      navDropdownTrigger.setAttribute('aria-expanded', isOpen);
    });

    document.addEventListener('click', (e) => {
      if (!navDropdown.contains(e.target)) {
        navDropdown.classList.remove('open');
        navDropdownTrigger.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        navDropdown.classList.remove('open');
        navDropdownTrigger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ─── Works Dropdown (mobile) ────────────── */
  const navMobileDropdown = document.querySelector('.nav-mobile-dropdown');
  const navMobileDropdownTrigger = document.querySelector('.nav-mobile-dropdown-trigger');

  if (navMobileDropdown && navMobileDropdownTrigger) {
    navMobileDropdownTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navMobileDropdown.classList.toggle('open');
      navMobileDropdownTrigger.setAttribute('aria-expanded', isOpen);
    });
  }

  /* ─── Active Nav Link ────────────────────── */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile-links a').forEach((link) => {
    const href = link.getAttribute('href');
    if (href && href !== '#' && !href.startsWith('#')) {
      const linkFile = href.split('/').pop().split('#')[0];
      if (linkFile === currentPath || (currentPath === '' && linkFile === 'index.html')) {
        link.classList.add('active');
      }
    }
  });

  if (document.querySelector('.nav-dropdown-menu a.active')) {
    navDropdownTrigger && navDropdownTrigger.classList.add('active');
  }
  if (document.querySelector('.nav-mobile-dropdown-menu a.active')) {
    navMobileDropdownTrigger && navMobileDropdownTrigger.classList.add('active');
  }

  /* ─── Contact Modal ──────────────────────── */
  const contactLinks = document.querySelectorAll('a[href$="#contact"]');
  if (contactLinks.length) {
    const emailAddress = 'samantha.sun89@gmail.com';

    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'contact-modal-overlay';
    modalOverlay.innerHTML = `
      <div class="contact-modal" role="dialog" aria-modal="true" aria-labelledby="contact-modal-heading">
        <button class="contact-modal-close" type="button" aria-label="Close">
          <i class="fa-solid fa-xmark"></i>
        </button>
        <h3 id="contact-modal-heading" class="contact-modal-heading">Let's talk</h3>
        <p class="contact-modal-subtext">Feel free to reach out anytime</p>
        <div class="contact-modal-email-row">
          <i class="fa-solid fa-envelope contact-modal-email-icon" aria-hidden="true"></i>
          <span class="contact-modal-email">${emailAddress}</span>
          <button class="contact-modal-copy-btn" type="button" aria-label="Copy email address">
            <i class="fa-solid fa-copy"></i>
          </button>
        </div>
        <p class="contact-modal-connect-label">Or connect with me here</p>
        <div class="contact-modal-social">
          <a href="https://www.instagram.com/samw.ise_/" class="contact-modal-social-link" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
            <img src="assets/icons/instagram.svg" alt="" class="contact-modal-social-icon" />
          </a>
          <a href="https://www.linkedin.com/in/samantha-sun-a6a9158a/" class="contact-modal-social-link" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
            <img src="assets/icons/linkedin.svg" alt="" class="contact-modal-social-icon" />
          </a>
        </div>
      </div>
    `;
    document.body.appendChild(modalOverlay);

    const closeBtn = modalOverlay.querySelector('.contact-modal-close');
    const copyBtn = modalOverlay.querySelector('.contact-modal-copy-btn');
    const copyIcon = copyBtn.querySelector('i');
    let copyResetTimer = null;

    const openModal = () => {
      modalOverlay.classList.add('is-open');
      document.body.classList.add('modal-open');
    };

    const closeModal = () => {
      modalOverlay.classList.remove('is-open');
      document.body.classList.remove('modal-open');
    };

    contactLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
      });
    });

    closeBtn.addEventListener('click', closeModal);

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('is-open')) {
        closeModal();
      }
    });

    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(emailAddress);
      } catch (err) {
        const tempInput = document.createElement('input');
        tempInput.value = emailAddress;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      }

      clearTimeout(copyResetTimer);
      copyBtn.classList.add('is-copied');
      copyBtn.setAttribute('aria-label', 'Copied!');
      copyIcon.className = 'fa-solid fa-check';

      copyResetTimer = setTimeout(() => {
        copyBtn.classList.remove('is-copied');
        copyBtn.setAttribute('aria-label', 'Copy email address');
        copyIcon.className = 'fa-solid fa-copy';
      }, 2000);
    });
  }

  /* ─── Footer Email Copy ──────────────────── */
  document.querySelectorAll('.footer-email-copy').forEach((copyEl) => {
    const tooltip = copyEl.closest('.footer-email-copy-wrap').querySelector('.footer-email-tooltip');
    let tooltipResetTimer = null;

    copyEl.addEventListener('click', async () => {
      const email = copyEl.dataset.email;

      try {
        await navigator.clipboard.writeText(email);
      } catch (err) {
        const tempInput = document.createElement('input');
        tempInput.value = email;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      }

      clearTimeout(tooltipResetTimer);
      tooltip.classList.add('is-visible');

      tooltipResetTimer = setTimeout(() => {
        tooltip.classList.remove('is-visible');
      }, 2000);
    });
  });

  /* ─── Smooth Scrolling for Anchor Links ──── */
  document.querySelectorAll('a[href^="#"]:not([href="#contact"])').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = 72;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ─── Architecture Carousel ──────────────── */
  const track = document.querySelector('.carousel-track');
  const prevBtn = document.querySelector('.carousel-btn-prev');
  const nextBtn = document.querySelector('.carousel-btn-next');

  if (track) {
    const scrollAmount = 300;

    const updateButtons = () => {
      if (prevBtn) prevBtn.disabled = track.scrollLeft <= 0;
      if (nextBtn)
        nextBtn.disabled =
          track.scrollLeft >= track.scrollWidth - track.clientWidth - 1;
    };

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      });
    }

    track.addEventListener('scroll', updateButtons, { passive: true });
    updateButtons();

    /* Keyboard support */
    track.setAttribute('tabindex', '0');
    track.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    });

    /* Touch / swipe support */
    let touchStartX = 0;
    let touchStartScrollLeft = 0;

    track.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartScrollLeft = track.scrollLeft;
    }, { passive: true });

    track.addEventListener('touchmove', (e) => {
      const dx = touchStartX - e.touches[0].clientX;
      track.scrollLeft = touchStartScrollLeft + dx;
    }, { passive: true });

    track.addEventListener('touchend', updateButtons, { passive: true });
  }

  /* ─── Page Transition on Link Click ─────── */
  document.querySelectorAll('a[href]').forEach((link) => {
    const href = link.getAttribute('href');
    // Only internal page links (not anchors, not external)
    if (
      href &&
      !href.startsWith('#') &&
      !href.startsWith('http') &&
      !href.startsWith('mailto') &&
      href.endsWith('.html')
    ) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        document.body.classList.add('page-out');
        setTimeout(() => {
          window.location.href = href;
        }, 200);
      });
    }
  });

})();
