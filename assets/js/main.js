/**
 * STRATA PLY & LAMINATES — Main interactions
 */
(function () {
  'use strict';

  const STORAGE_THEME = 'strata-theme';
  const STORAGE_RTL = 'strata-rtl';

  /* ——— Theme ——— */
  function initTheme() {
    const saved = localStorage.getItem(STORAGE_THEME);
    if (saved === 'dark' || saved === 'light') {
      document.documentElement.setAttribute('data-theme', saved);
    }
    updateThemeIcon();
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(STORAGE_THEME, next);
    updateThemeIcon();
  }

  function updateThemeIcon() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const sunSvg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.5 1.5M18.7 5.3l-1.5 1.5M5.3 18.7l1.5-1.5M18.7 18.7l-1.5-1.5"/></svg>';
    const moonSvg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    document.querySelectorAll('[data-theme-icon]').forEach((el) => {
      el.innerHTML = isDark ? moonSvg : sunSvg;
    });
  }

  /* ——— RTL ——— */
  function initRTL() {
    const saved = localStorage.getItem(STORAGE_RTL);
    if (saved === 'rtl') {
      document.documentElement.setAttribute('dir', 'rtl');
    }
    updateRTLLabel();
  }

  function toggleRTL() {
    const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
    const drawer = document.getElementById('mobile-drawer');
    if (drawer) drawer.style.display = 'none'; // prevent transition flash across screen
    document.documentElement.setAttribute('dir', isRtl ? 'ltr' : 'rtl');
    localStorage.setItem(STORAGE_RTL, isRtl ? 'ltr' : 'rtl');
    updateRTLLabel();
    if (drawer) {
      requestAnimationFrame(() => {
        drawer.style.display = '';
      });
    }
  }

  function updateRTLLabel() {
    const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
    document.querySelectorAll('[data-rtl-label]').forEach((el) => {
      el.textContent = isRtl ? 'LTR' : 'RTL';
    });
    document.querySelectorAll('[data-toggle-rtl]').forEach((btn) => {
      btn.setAttribute('aria-pressed', isRtl ? 'true' : 'false');
      btn.classList.toggle('active', isRtl);
    });
  }

  /* ——— Navbar scroll ——— */
  function initNavbar() {
    const header = document.querySelector('.site-header');
    if (!header) return;
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const page = document.body.dataset.page;
    document.querySelectorAll('.nav-links a[data-nav], .drawer-nav a[data-nav]').forEach((link) => {
      if (link.dataset.nav === page || (link.dataset.nav === 'home' && (page === 'home' || page === 'home-2'))) {
        link.classList.add('active');
      }
    });
  }

  /* ——— Mobile drawer ——— */
  function initMobileNav() {
    const drawer = document.getElementById('mobile-drawer');
    const hamburger = document.querySelector('.hamburger');
    if (!drawer || !hamburger) return;

    const open = () => {
      drawer.classList.add('open');
      hamburger.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    };
    const close = () => {
      drawer.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };

    hamburger.addEventListener('click', () => {
      drawer.classList.contains('open') ? close() : open();
    });
    drawer.querySelector('.drawer-backdrop')?.addEventListener('click', close);
    drawer.querySelector('.drawer-close')?.addEventListener('click', close);

    // Support expandable dropdowns inside drawer
    drawer.querySelectorAll('.drawer-dropdown-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const parent = btn.closest('.drawer-dropdown');
        if (parent) {
          const isOpen = parent.classList.toggle('open');
          btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        }
      });
    });

    // Close on regular link click, but not on dropdown toggle buttons
    drawer.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', close);
    });
  }

  /* ——— Scroll reveal ——— */
  function initReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach((el) => io.observe(el));
  }

  /* ——— Modal ——— */
  let activeModal = null;

  function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    activeModal = modal;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const first = modal.querySelector('input, select, textarea, button');
    if (first) setTimeout(() => first.focus(), 100);
  }

  function closeModal(modal) {
    if (!modal) modal = activeModal;
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    activeModal = null;
  }

  function initModals() {
    document.querySelectorAll('[data-modal-open]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(btn.dataset.modalOpen);
        const plan = btn.dataset.plan;
        if (plan) {
          const modalId = btn.dataset.modalOpen;
          const modal = document.getElementById(modalId);
          const sel = modal?.querySelector('select[name="plan"]');
          if (sel) sel.value = plan;
        }
      });
    });
    document.querySelectorAll('.modal-close, .modal-backdrop').forEach((el) => {
      el.addEventListener('click', () => closeModal(el.closest('.modal-root')));
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && activeModal) closeModal(activeModal);
    });
  }

  /* ——— Goal selector (home) ——— */
  const goalRecommendations = {
    'contractor': { title: '710 BWP Plywood + Matte Laminates', pct: 85 },
    'retail': { title: 'Decorative Laminates + Edge Bands', pct: 72 },
    'project': { title: 'Bulk Calibrated Ply + High Gloss', pct: 90 },
    'furniture': { title: 'MR Grade Ply + Woodgrain Finish', pct: 78 },
    'kitchen': { title: 'BWP Ply + Heat-Resistant Laminates', pct: 88 },
    'export': { title: 'Certified Ply + Premium Collections', pct: 95 },
  };

  function initGoalSelector() {
    const panel = document.getElementById('goal-recommendation');
    const bar = document.getElementById('goal-progress');
    if (!panel) return;

    document.querySelectorAll('.goal-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.goal-chip').forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
        const key = chip.dataset.goal;
        const rec = goalRecommendations[key] || goalRecommendations.contractor;
        panel.querySelector('[data-rec-title]').textContent = rec.title;
        if (bar) {
          bar.style.width = '0';
          requestAnimationFrame(() => {
            bar.style.width = rec.pct + '%';
          });
        }
      });
    });

    document.querySelector('.goal-chip')?.click();
  }

  /* ——— Product filters ——— */
  function initProductFilters() {
    const thicknessBtns = document.querySelectorAll('.filter-bar[aria-label="Thickness filters"] .filter-btn');
    const finishBtns = document.querySelectorAll('.filter-bar[aria-label="Finish filters"] .filter-btn');
    const items = document.querySelectorAll('.product-item');
    if (!thicknessBtns.length) return;

    let thickness = 'all';
    let finish = 'all';

    function applyFilters() {
      items.forEach((item) => {
        const tMatch = thickness === 'all' || item.dataset.thickness === thickness;
        const fMatch = finish === 'all' || item.dataset.finish === finish;
        item.classList.toggle('hidden', !(tMatch && fMatch));
      });
    }

    thicknessBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        thicknessBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        thickness = btn.dataset.filter;
        applyFilters();
      });
    });

    finishBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const wasActive = btn.classList.contains('active');
        finishBtns.forEach((b) => b.classList.remove('active'));
        if (wasActive) {
          finish = 'all';
        } else {
          btn.classList.add('active');
          finish = btn.dataset.filter;
        }
        applyFilters();
      });
    });
  }

  /* ——— Form validation ——— */
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePhone(phone) {
    return phone.replace(/\D/g, '').length >= 10;
  }

  function initForms() {
    document.querySelectorAll('[data-validate-form]').forEach((form) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        let valid = true;

        form.querySelectorAll('.form-group').forEach((g) => g.classList.remove('error'));

        form.querySelectorAll('[required]').forEach((field) => {
          const group = field.closest('.form-group');
          const val = field.value.trim();
          if (!val) {
            group?.classList.add('error');
            valid = false;
          }
          if (field.type === 'email' && val && !validateEmail(val)) {
            group?.classList.add('error');
            valid = false;
          }
          if (field.name === 'phone' && val && !validatePhone(val)) {
            group?.classList.add('error');
            valid = false;
          }
        });

        if (!valid) return;

        const success = form.querySelector('.form-success');
        if (success) {
          success.hidden = false;
          form.reset();
          setTimeout(() => {
            success.hidden = true;
            if (form.closest('.modal-root')) closeModal(form.closest('.modal-root'));
          }, 2800);
        }
      });
    });

    document.querySelectorAll('[data-newsletter]').forEach((form) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = form.querySelector('input[type="email"]');
        const msg = form.querySelector('.newsletter-msg');
        if (!input || !validateEmail(input.value.trim())) {
          if (msg) {
            msg.textContent = 'Please enter a valid email address.';
            msg.style.color = '#c0392b';
          }
          return;
        }
        if (msg) {
          msg.textContent = 'Thank you — you are subscribed to trade updates.';
          msg.style.color = 'var(--accent)';
        }
        input.value = '';
      });
    });
  }

  /* ——— Counter animation ——— */
  function initCounters() {
    document.querySelectorAll('[data-counter]').forEach((el) => {
      const target = parseInt(el.dataset.counter, 10);
      const io = new IntersectionObserver(
        (entries) => {
          if (!entries[0].isIntersecting) return;
          let start = 0;
          const dur = 1200;
          const t0 = performance.now();
          const step = (t) => {
            const p = Math.min((t - t0) / dur, 1);
            el.textContent = Math.floor(start + (target - start) * (1 - Math.pow(1 - p, 3)));
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          io.disconnect();
        },
        { threshold: 0.5 }
      );
      io.observe(el);
    });
  }

  /* ——— Magnetic buttons (subtle) ——— */
  function initMagnetic() {
    document.querySelectorAll('.btn-magnetic').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.08;
        const y = (e.clientY - r.top - r.height / 2) * 0.08;
        btn.style.transform = `translate(${x}px, ${y}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* ——— Home 2: Hero Swatch Switcher ——— */
  function initHeroSwatches() {
    const heroImg = document.getElementById('dorby-hero-img');
    const heroLabel = document.getElementById('dorby-hero-label');
    const pills = document.querySelectorAll('.swatch-pill[data-swatch-img]');
    if (!heroImg || !pills.length) return;

    pills.forEach((pill) => {
      pill.addEventListener('click', () => {
        pills.forEach((p) => p.classList.remove('active'));
        pill.classList.add('active');
        heroImg.style.opacity = '0.35';
        setTimeout(() => {
          heroImg.src = pill.dataset.swatchImg;
          if (pill.dataset.swatchAlt) heroImg.alt = pill.dataset.swatchAlt;
          if (heroLabel && pill.dataset.swatchCode) {
            heroLabel.textContent = pill.dataset.swatchCode;
          }
          heroImg.style.opacity = '1';
        }, 180);
      });
    });
  }

  /* ——— Home 2: Space Application Visualizer ——— */
  const spaceData = {
    kitchen: {
      img: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=1200&q=80',
      alt: 'Modern modular kitchen with matte acrylic and walnut laminate cabinetry',
      substrate: 'IS:710 Calibrated BWP (18mm)',
      surface: 'Vibron 6H Acrylic + Mark-Free Matte',
      edge: 'Dorby Edge 1.3mm Super-Matte PVC',
    },
    wardrobe: {
      img: 'https://images.unsplash.com/photo-1540518614846-7ede433c4573?auto=format&fit=crop&w=1200&q=80',
      alt: 'Floor-to-ceiling walk-in wardrobe in synchronized walnut woodgrain',
      substrate: 'Pro Calibrated Plywood (19mm)',
      surface: 'Design Yatra 1.25mm Sync Woodgrain',
      edge: 'Dorby Edge 2.0mm Registered Grain',
    },
    wall: {
      img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      alt: 'Architectural feature wall with fluted louvers and stone laminate panels',
      substrate: 'Edge MR / BWR Backing (12mm)',
      surface: 'Canvas Fluted & Calacatta Stone HPL',
      edge: 'Dorby Edge Digital Stone Match',
    },
    commercial: {
      img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      alt: 'Executive commercial workspace with acoustic wood panels and anti-fingerprint desks',
      substrate: 'Fire-Retardant & Calibrated Ply (18mm)',
      surface: 'Unicore 1.0mm Anti-Fingerprint HPL',
      edge: 'Dorby Edge Heavy-Duty 2.0mm ABS',
    },
  };

  function initSpaceVisualizer() {
    const tabs = document.querySelectorAll('.space-tab[data-space]');
    const img = document.getElementById('space-stage-img');
    const subEl = document.getElementById('spec-substrate');
    const surfEl = document.getElementById('spec-surface');
    const edgeEl = document.getElementById('spec-edge');
    if (!tabs.length || !img) return;

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
        const data = spaceData[tab.dataset.space] || spaceData.kitchen;
        img.style.opacity = '0.3';
        setTimeout(() => {
          img.src = data.img;
          img.alt = data.alt;
          if (subEl) subEl.textContent = data.substrate;
          if (surfEl) surfEl.textContent = data.surface;
          if (edgeEl) edgeEl.textContent = data.edge;
          img.style.opacity = '1';
        }, 160);
      });
    });
  }

  /* ——— Smart Woodgrain SVG Fallback for Images ——— */
  function initImageFallbacks() {
    document.querySelectorAll('img').forEach((img) => {
      img.addEventListener('error', function () {
        if (this.dataset.fallbackApplied) return;
        this.dataset.fallbackApplied = 'true';
        const label = (this.alt || 'STRATA Surface Decor').replace(/[<>&"']/g, '');
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
          <defs>
            <linearGradient id="wg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#3a2a1d"/>
              <stop offset="50%" stop-color="#5c4028"/>
              <stop offset="100%" stop-color="#2b1e14"/>
            </linearGradient>
          </defs>
          <rect width="800" height="600" fill="url(#wg)"/>
          <path d="M0 120 Q 200 90, 400 120 T 800 110 M0 240 Q 250 210, 450 250 T 800 230 M0 380 Q 180 350, 420 390 T 800 370 M0 490 Q 220 470, 480 500 T 800 480" stroke="rgba(196,165,116,0.22)" stroke-width="2" fill="none"/>
          <rect x="40" y="40" width="720" height="520" fill="none" stroke="rgba(196,165,116,0.35)" stroke-width="1"/>
          <text x="400" y="305" text-anchor="middle" fill="#f5f0e8" font-family="Georgia, serif" font-size="24">${label}</text>
        </svg>`;
        this.src = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
      });
    });
  }

  /* ——— Dorby Category Showcase Tabs ——— */
  function initDorbyShowcase() {
    const tabBtns = document.querySelectorAll('.cat-tab-btn[data-cat-target]');
    const blocks = document.querySelectorAll('.dorby-gallery-block[data-category]');
    if (!tabBtns.length || !blocks.length) return;

    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        tabBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const target = btn.dataset.catTarget;

        blocks.forEach((block) => {
          if (target === 'all' || block.dataset.category === target) {
            block.style.display = 'block';
            block.style.opacity = '0';
            setTimeout(() => {
              block.style.transition = 'opacity 0.4s ease';
              block.style.opacity = '1';
            }, 50);
          } else {
            block.style.display = 'none';
          }
        });
      });
    });
  }

  /* ——— Video Features (Home 1 & Home 2) ——— */
  function initHeroVideoToggle() {
    const btn = document.querySelector('[data-hero-video-toggle]');
    const video = document.querySelector('.hero-bg-video');
    if (!video) return;

    // Autoplay unlock
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        const unlock = () => {
          video.play().catch(() => {});
          document.removeEventListener('click', unlock);
          document.removeEventListener('touchstart', unlock);
          document.removeEventListener('scroll', unlock);
        };
        document.addEventListener('click', unlock, { once: true });
        document.addEventListener('touchstart', unlock, { once: true });
        document.addEventListener('scroll', unlock, { once: true });
      });
    }

    if (!btn) return;
    btn.addEventListener('click', () => {
      if (video.paused) {
        video.play();
        btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg><span>Pause Motion</span>';
      } else {
        video.pause();
        btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg><span>Play Motion</span>';
      }
    });
  }

  function initFilmstripReels() {
    const cards = document.querySelectorAll('.filmstrip-card');
    cards.forEach((card) => {
      const video = card.querySelector('.filmstrip-video');
      const playBtn = card.querySelector('.filmstrip-play-btn');
      if (!video) return;

      const togglePlay = () => {
        if (video.paused) {
          video.play();
          if (playBtn) playBtn.style.opacity = '0';
        } else {
          video.pause();
          if (playBtn) playBtn.style.opacity = '0.9';
        }
      };

      if (playBtn) playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePlay();
      });

      card.addEventListener('mouseenter', () => {
        if (video.paused) {
          video.play().catch(() => {});
          if (playBtn) playBtn.style.opacity = '0';
        }
      });

      card.addEventListener('mouseleave', () => {
        video.pause();
        if (playBtn) playBtn.style.opacity = '0.85';
      });
    });
  }

  function initStudioTheater() {
    const section = document.querySelector('.section-theater');
    if (!section) return;

    const masterVideo = section.querySelector('.theater-master-video');
    const playBtn = section.querySelector('[data-theater-play]');
    const muteBtn = section.querySelector('[data-theater-mute]');
    const fullBtn = section.querySelector('[data-theater-fullscreen]');
    const timecode = section.querySelector('.theater-timecode');
    const titleEl = section.querySelector('.theater-scene-title');
    const hudEl = section.querySelector('.theater-scene-hud');
    const channelCards = section.querySelectorAll('.channel-card');

    if (!masterVideo) return;

    const fmt = (s) => {
      if (isNaN(s)) return '00:00';
      const m = Math.floor(s / 60);
      const sec = Math.floor(s % 60);
      return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    };

    masterVideo.addEventListener('timeupdate', () => {
      if (timecode) {
        timecode.textContent = `${fmt(masterVideo.currentTime)} / ${fmt(masterVideo.duration)}`;
      }
    });

    if (playBtn) {
      playBtn.addEventListener('click', () => {
        if (masterVideo.paused) {
          masterVideo.play();
          playBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
        } else {
          masterVideo.pause();
          playBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
        }
      });
    }

    if (muteBtn) {
      muteBtn.addEventListener('click', () => {
        masterVideo.muted = !masterVideo.muted;
        muteBtn.innerHTML = masterVideo.muted
          ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>'
          : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>';
      });
    }

    if (fullBtn) {
      fullBtn.addEventListener('click', () => {
        if (masterVideo.requestFullscreen) {
          masterVideo.requestFullscreen();
        } else if (masterVideo.webkitRequestFullscreen) {
          masterVideo.webkitRequestFullscreen();
        }
      });
    }

    channelCards.forEach((card) => {
      card.addEventListener('click', () => {
        const src = card.dataset.videoSrc;
        const title = card.dataset.videoTitle;
        const hud = card.dataset.videoHud;

        if (src && masterVideo.getAttribute('src') !== src) {
          masterVideo.src = src;
          masterVideo.load();
          masterVideo.play().catch(() => {});
          if (playBtn) {
            playBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
          }
        }
        if (titleEl && title) titleEl.textContent = title;
        if (hudEl && hud) hudEl.textContent = hud;

        channelCards.forEach((c) => c.classList.remove('active'));
        card.classList.add('active');
      });
    });
  }

  /* ——— Back to top floating button ——— */
  function initBackToTop() {
    if (document.querySelector('.back-to-top')) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 15l-6-6-6 6"/></svg>`;
    document.body.appendChild(btn);

    const onScroll = () => {
      btn.classList.toggle('visible', window.scrollY > 300);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    onScroll();
  }

  /* ——— FAQ Accordion ——— */
  function initFAQ() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.faq-btn, .faq-question');
      if (!btn) return;
      e.preventDefault();
      const card = btn.closest('.faq-card, .faq-item');
      if (!card) return;
      const isOpen = card.classList.contains('open');
      card.classList.toggle('open', !isOpen);
      btn.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
    });
  }

  /* ——— Init ——— */
  document.querySelectorAll('[data-toggle-theme]').forEach((btn) => {
    btn.addEventListener('click', toggleTheme);
  });
  document.querySelectorAll('[data-toggle-rtl]').forEach((btn) => {
    btn.addEventListener('click', toggleRTL);
  });

  initTheme();
  initRTL();
  initNavbar();
  initMobileNav();
  initBackToTop();
  initFAQ();
  initReveal();
  initModals();
  initGoalSelector();
  initProductFilters();
  initForms();
  initCounters();
  initMagnetic();
  initHeroSwatches();
  initSpaceVisualizer();
  initDorbyShowcase();
  initHeroVideoToggle();
  initFilmstripReels();
  initStudioTheater();
  initImageFallbacks();

  window.strataOpenModal = openModal;
})();
