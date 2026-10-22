/**
 * HARIKZ LUXURY BANQUET COUNTERS - MASTER APP JS
 * 1. Living Sky (Dawn -> Day -> Sunset -> Night) & Parallax Road Engine
 * 2. Real Delivery Lorry with Auto-Chroma Canvas & Rotating Wheel Rims
 * 3. HUD Odometer & Active Stop Tracker
 * 4. Customer Satisfaction Counter Animation Suite (Odometers, Joy Tally, Confetti, Web Audio Chime)
 * 5. Authentic Masterpiece Photo Gallery & Fullscreen Lightbox
 * 6. Instant Commercial RFQ Estimator & WhatsApp Proposal Generator
 */

const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

/* ==========================================================================
   1. LIVING SKY & ATMOSPHERIC DYNAMICS (HARIKZ ENGINE)
   ========================================================================== */
const starsEl = $('#stars');
const small = window.innerWidth < 768;

if (starsEl) {
  for (let i = 0; i < (small ? 35 : 65); i++) {
    const s = document.createElement('i');
    s.style.left = Math.random() * 100 + '%';
    s.style.top = Math.random() * 70 + '%';
    s.style.animationDelay = Math.random() * 3 + 's';
    s.style.transform = `scale(${0.6 + Math.random() * 1.4})`;
    starsEl.appendChild(s);
  }
}

const fliesEl = $('#flies');
if (fliesEl) {
  for (let i = 0; i < (small ? 8 : 16); i++) {
    const f = document.createElement('i');
    f.style.left = Math.random() * 100 + '%';
    f.style.top = 40 + Math.random() * 40 + '%';
    f.style.animationDelay = -Math.random() * 9 + 's';
    f.style.animationDuration = 6 + Math.random() * 6 + 's';
    fliesEl.appendChild(f);
  }
}

const flyersEl = $('#flyers');
const progEl = $('#progress');
const lorryEl = $('#lorry');

// Time-of-day keyframes (Dawn Gold -> Radiant Day Gold -> Molten Sunset Gold -> Midnight Gold Gala)
const KEYS = [
  { p: 0.00, sky1: '#dfaf42', sky2: '#fbf0d5', ink: '#1c1409', h1: '#b8891f', h2: '#946c10', h3: '#6b4c04' },
  { p: 0.28, sky1: '#f3c754', sky2: '#fffbeb', ink: '#161108', h1: '#caa032', h2: '#9e7a1b', h3: '#73570a' },
  { p: 0.58, sky1: '#cf8e14', sky2: '#fde592', ink: '#1f1304', h1: '#b57609', h2: '#8c5803', h3: '#613b00' },
  { p: 0.82, sky1: '#261b07', sky2: '#573d0e', ink: '#fff5d6', h1: '#3d2b09', h2: '#2c1e05', h3: '#1c1303' },
  { p: 1.00, sky1: '#0e0b04', sky2: '#221908', ink: '#fff8e1', h1: '#261a06', h2: '#1b1204', h3: '#100a02' }
];

const hexToRgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const mixHex = (a, b, t) => '#' + hexToRgb(a).map((v, i) => Math.round(v + (hexToRgb(b)[i] - v) * t).toString(16).padStart(2, '0')).join('');
const clampVal = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));

function getSkyPalette(p) {
  let i = 0;
  while (i < KEYS.length - 2 && p > KEYS[i + 1].p) i++;
  const a = KEYS[i], b = KEYS[i + 1], t = clampVal((p - a.p) / (b.p - a.p));
  const out = {};
  ['sky1', 'sky2', 'ink', 'h1', 'h2', 'h3'].forEach(k => out[k] = mixHex(a[k], b[k], t));
  return out;
}

const rootStyle = document.documentElement.style;
const sunEl = $('#sun'), moonEl = $('#moon'), cloudsEl = $('#clouds');
const l1El = $('#l1'), l2El = $('#l2'), l3El = $('#l3'), roadEl = $('#road');
const w1El = $('#w1'), w2El = $('#w2'), beamEl = $('#beam'), lampEl = $('#lamp'), roadLightEl = $('#roadlight');
const kmEl = $('#hud-km'), stopEl = $('#hud-stop'), hudCounterEl = $('#hud-counter-num');
const skyEl = $('#sky'), sceneEl = $('.scene');

let maxScroll = 1, viewW = window.innerWidth, viewH = window.innerHeight;
let tileWidths = [600, 600, 600], lastSkyQuant = -1;

function measureViewport() {
  viewW = window.innerWidth;
  viewH = window.innerHeight;
  maxScroll = Math.max(1, document.documentElement.scrollHeight - viewH);
  tileWidths = [l1El, l2El, l3El].map(el => el ? el.offsetWidth / 2 : 600);
}

const setTransform = (el, val) => {
  if (el && el._t !== val) {
    el._t = val;
    el.style.transform = val;
  }
};

function renderAtmosphericFrame() {
  const y = window.scrollY;
  const p = maxScroll > 0 ? clampVal(y / maxScroll) : 0;

  // Sky and landscape colors
  const quant = Math.round(p * 80);
  if (quant !== lastSkyQuant) {
    lastSkyQuant = quant;
    const c = getSkyPalette(quant / 80);
    if (skyEl) {
      skyEl.style.setProperty('--sky1', c.sky1);
      skyEl.style.setProperty('--sky2', c.sky2);
    }
    if (sceneEl) {
      sceneEl.style.setProperty('--h1', c.h1);
      sceneEl.style.setProperty('--h2', c.h2);
      sceneEl.style.setProperty('--h3', c.h3);
    }
  }

  // Sun and Moon celestial arcs
  const ts = clampVal(p / 0.72);
  if (sunEl) {
    setTransform(sunEl, `translate3d(${(0.08 + 0.84 * ts) * viewW}px, ${(0.58 - Math.sin(Math.PI * ts) * 0.46) * viewH}px, 0) translate(-50%,-50%)`);
    sunEl.style.opacity = (1 - clampVal((p - 0.62) / 0.1)).toFixed(2);
  }

  const tm = clampVal((p - 0.70) / 0.30);
  if (moonEl) {
    setTransform(moonEl, `translate3d(${(0.16 + 0.68 * tm) * viewW}px, ${(0.46 - Math.sin(Math.PI * tm) * 0.28) * viewH}px, 0) translate(-50%,-50%)`);
    moonEl.style.opacity = clampVal((p - 0.70) / 0.08).toFixed(2);
  }

  if (starsEl) starsEl.style.opacity = clampVal((p - 0.72) / 0.16).toFixed(2);
  if (cloudsEl) cloudsEl.style.opacity = (1 - clampVal((p - 0.68) / 0.2) * 0.85).toFixed(2);

  // Parallax landscape scrolling
  [[l1El, 0.10], [l2El, 0.22], [l3El, 0.42]].forEach(([el, factor], idx) => {
    if (el) setTransform(el, `translate3d(${-((y * factor) % tileWidths[idx])}px,0,0)`);
  });

  if (roadEl) {
    roadEl.style.setProperty('--rx', -(y * 0.9 % 80) + 'px');
  }

  // Wheel rotation driven by scroll velocity
  const rotDeg = `rotate(${(y * 0.9) % 360}deg)`;
  if (w1El) setTransform(w1El, rotDeg);
  if (w2El) setTransform(w2El, rotDeg);

  // Headlight beam, flare, and road light active at dusk/night
  const beamOpacity = (clampVal((p - 0.66) / 0.14) * 0.96).toFixed(2);
  if (beamEl) beamEl.style.opacity = beamOpacity;
  if (lampEl) lampEl.style.opacity = beamOpacity;
  if (roadLightEl) roadLightEl.style.opacity = beamOpacity;

  // HUD Odometer: Distance & Counter crafted index
  const kmVal = String(Math.round(p * 1480)).padStart(4, '0');
  if (kmEl && kmEl.textContent !== kmVal) kmEl.textContent = kmVal;

  const craftedNum = 582 + Math.floor(p * 28);
  if (hudCounterEl) hudCounterEl.textContent = `#0${craftedNum}`;

  // Progress Bar
  if (progEl) setTransform(progEl, `scaleX(${p.toFixed(4)})`);

  // Floating fireflies and daylight flyers
  const fliesOp = clampVal((p - 0.74) / 0.12);
  if (fliesEl) {
    fliesEl.style.opacity = fliesOp.toFixed(2);
    fliesEl.style.visibility = fliesOp > 0 ? 'visible' : 'hidden';
  }
  const flyersOp = 1 - clampVal((p - 0.62) / 0.15);
  if (flyersEl) {
    flyersEl.style.opacity = flyersOp.toFixed(2);
    flyersEl.style.visibility = flyersOp > 0 ? 'visible' : 'hidden';
  }
}

let scrollTicking = false;
window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    scrollTicking = true;
    requestAnimationFrame(() => {
      renderAtmosphericFrame();
      scrollTicking = false;
    });
  }
}, { passive: true });

window.addEventListener('resize', () => {
  measureViewport();
  renderAtmosphericFrame();
});

window.addEventListener('load', () => {
  measureViewport();
  renderAtmosphericFrame();
});

/* ==========================================================================
   2. REAL ROYAL DELIVERY LORRY CANVAS TRANSPARENCY
   ========================================================================== */
(function initLorryCanvas() {
  const cv = document.getElementById('lorryimg');
  if (!cv) return;
  const img = new Image();
  img.src = 'assets/images/lorry-counter.jpg';
  img.onload = () => {
    const ctx = cv.getContext('2d', { willReadFrequently: true });
    const sc = Math.min(1, 950 / img.naturalWidth);
    const w = Math.round(img.naturalWidth * sc);
    const h = Math.round(img.naturalHeight * sc);
    cv.width = w;
    cv.height = h;
    ctx.drawImage(img, 0, 0, w, h);

    const imgData = ctx.getImageData(0, 0, w, h);
    const d = imgData.data;
    const seen = new Uint8Array(w * h);
    const stack = [];

    const isNeutralBg = (r, g, b) => {
      if (r > 200 && g > 200 && b > 200) return true;
      if (r > 125 && g > 125 && b > 125) {
        const diff = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b));
        if (diff < 24) return true;
      }
      return false;
    };

    const isBg = i => isNeutralBg(d[i * 4], d[i * 4 + 1], d[i * 4 + 2]);

    const push = i => {
      if (!seen[i] && isBg(i)) {
        seen[i] = 1;
        stack.push(i);
      }
    };

    // Seed flood-fill from edges
    for (let x = 0; x < w; x++) {
      push(x);
      push((h - 1) * w + x);
    }
    for (let y = 0; y < h; y++) {
      push(y * w);
      push(y * w + w - 1);
    }

    while (stack.length) {
      const i = stack.pop();
      const x = i % w, y = (i / w) | 0;
      d[i * 4 + 3] = 0;
      if (x > 0) push(i - 1);
      if (x < w - 1) push(i + 1);
      if (y > 0) push(i - w);
      if (y < h - 1) push(i + w);
    }

    // Clean ground shadow beneath tire bottoms
    const tireBottomY = 0.872 * h;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = y * w + x;
        if (d[i * 4 + 3] === 0) continue;
        if (y >= tireBottomY) {
          d[i * 4 + 3] = 0;
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);
  };
})();

/* ==========================================================================
   3. SCROLL REVEAL & HUD STOP TRACKER
   ========================================================================== */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('on');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

$$('.rv').forEach((el, idx) => {
  el.style.transitionDelay = (idx % 4) * 90 + 'ms';
  revealObserver.observe(el);
});

const stopObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && stopEl && entry.target.dataset.stop) {
      stopEl.textContent = entry.target.dataset.stop;
    }
  });
}, { rootMargin: '-40% 0px -50% 0px' });

$$('[data-stop]').forEach(s => stopObserver.observe(s));

/* ==========================================================================
   6. CUSTOMER SATISFACTION COUNTER ANIMATION SUITE
   ========================================================================== */
// Web Audio Harmonic Chime for Delightful Feedback
let audioCtx = null;
function playSatisfactionChime() {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.08);

      gain.gain.setValueAtTime(0, audioCtx.currentTime + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.18, audioCtx.currentTime + idx * 0.08 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.08 + 0.45);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(audioCtx.currentTime + idx * 0.08);
      osc.stop(audioCtx.currentTime + idx * 0.08 + 0.5);
    });
  } catch (err) {
    // Audio fallback
  }
}

// Animated Rolling Odometers
const countUpObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 2200;
      const startTime = performance.now();

      function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(ease * target);
        el.textContent = current.toLocaleString('en-IN') + suffix;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = target.toLocaleString('en-IN') + suffix;
        }
      }

      requestAnimationFrame(update);
      countUpObserver.unobserve(el);
    }
  });
}, { threshold: 0.2 });

$$('.count-up').forEach(num => countUpObserver.observe(num));

// Customer satisfaction rolling odometers active via IntersectionObserver

/* ==========================================================================
   7. MASTERPIECE PHOTO GALLERY & FULLSCREEN LIGHTBOX
   ========================================================================== */
const galleryItems = [
  {
    title: 'The Imperial 32ft Royal Hall Buffet Line',
    category: 'buffet',
    img: 'assets/images/counter-grand-hall.jpg',
    badge: 'Grand Installation',
    model: 'CC-IMP-32',
    specs: '32ft Linear • 16 Backlit Geometrics • 600+ Guests',
    desc: 'Continuous illuminated modular run stretching 32 feet with floor reflection radiance and zero LED hotspots.'
  },
  {
    title: 'Sugar Qubes Signature Luxury Dessert Bar',
    category: 'dessert',
    img: 'assets/images/counter-sugar-qubes-wide.jpg',
    badge: 'Dessert Architecture',
    model: 'CC-DS-QUBES',
    specs: 'Golden Pyramids • Neon Halos • Acrylic Tier Risers',
    desc: 'Custom dessert presentation station featuring tiered golden pyramids, glowing halo rings, and crystal accents.'
  },
  {
    title: 'Royal Chafer Station Suite with Roll-Tops',
    category: 'buffet',
    img: 'assets/images/counter-buffet-closeup.jpg',
    badge: 'Chafer Lineup',
    model: 'CC-BUF-CHAF',
    specs: 'Roll-Top Warmers • Zero-Glare Diffuser • Food Safe SS-304',
    desc: 'High-capacity catering setup engineered for heavy food warmers, electric bain-maries, and continuous banquet service.'
  },
  {
    title: 'Heritage Arc-Lamp Live Gourmet Counter',
    category: 'live',
    img: 'assets/images/counter-arc-lamps.jpg',
    badge: 'Live Gourmet',
    model: 'CC-LIV-ARC',
    specs: 'Integrated Arc Lamps • Stepped Pyramid Brass • Live Plating',
    desc: 'Equipped with triple curved brass floor lamps, fabric shades, and stepped triangular stands for live chaat and appetizers.'
  },
  {
    title: 'Architectural Ginkgo Grand Banquet Setup',
    category: 'buffet',
    img: 'assets/images/counter-buffet-wide.jpg',
    badge: 'Full Hall Integration',
    model: 'CC-WALL-BUF',
    specs: 'Full Wall Integration • 3000K Lighting • Multi-Course Run',
    desc: 'Banquet wall integration with matching illuminated fascia and embossed ginkgo leaf panelling.'
  },

  {
    title: 'Imperial 4-Module Island Station',
    category: 'live',
    img: 'assets/images/counter-island-luxury.jpg',
    badge: 'Modular Island',
    model: 'CC-ISL-08',
    specs: '8ft Island Setup • 4 Backlit Panels • 360° Service Flow',
    desc: 'Compact standalone island counter, ideal for VIP welcome drinks, mocktails, sushi counters, or centerpiece dessert podiums.'
  },
  {
    title: 'Royal Birdcage Dessert & Pastry Podium',
    category: 'dessert',
    img: 'assets/images/counter-dessert-quells.jpg',
    badge: 'Dessert Details',
    model: 'CC-DS-CAGE',
    specs: 'Gold Birdcages • Ambient Neon Halos • Tiered Crystal',
    desc: 'Geometric gold birdcage stands combined with luminous neon halo accents for unforgettable photography moments.'
  }
];

// Populate and Filter Gallery
const galleryGrid = $('#galleryGrid');
let currentActiveFilter = 'all';

function renderGallery(filter = 'all') {
  if (!galleryGrid) return;
  currentActiveFilter = filter;
  galleryGrid.innerHTML = '';

  const filtered = filter === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === filter);

  filtered.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'g-card-polaroid rv on';
    card.innerHTML = `
      <div class="g-card-inner">
        <span class="washi-tape"></span>
        <div class="g-img-frame" onclick="openLightbox(${galleryItems.indexOf(item)})">
          <span class="g-badge-tag">${item.badge}</span>
          <img src="${item.img}" alt="${item.title}" loading="lazy">
          <div class="g-zoom-hint">
            <span>🔍 Expand Full View</span>
          </div>
        </div>
        <div class="g-card-meta">
          <span class="g-model-id">${item.model}</span>
          <h3 class="g-title">${item.title}</h3>
          <p class="g-desc">${item.desc}</p>
          <div class="g-specs-pill">${item.specs}</div>
          <div class="g-card-actions">
            <button type="button" class="btn-g-view" onclick="openLightbox(${galleryItems.indexOf(item)})">🔍 Full Photo</button>
            <a href="https://wa.me/918592809092?text=Hello%20HARIKZ,%20I%20am%20interested%20in%20model%20${encodeURIComponent(item.model)}%20(${encodeURIComponent(item.title)})" target="_blank" rel="noopener" class="btn-g-wa">💬 WhatsApp</a>
          </div>
        </div>
      </div>
    `;
    galleryGrid.appendChild(card);
  });
}

// Category Tabs
$$('.g-tab-btn').forEach(tab => {
  tab.addEventListener('click', () => {
    $$('.g-tab-btn').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    renderGallery(tab.dataset.filter);
  });
});

renderGallery('all');

// Lightbox Modal
let currentLightboxIdx = 0;
const lightboxModal = $('#lightboxModal');
const lbImg = $('#lightboxImg');
const lbTitle = $('#lightboxTitle');
const lbDesc = $('#lightboxDesc');
const lbModel = $('#lightboxModel');
const lbSpecs = $('#lightboxSpecs');
const lbWaBtn = $('#lightboxWaBtn');

window.openLightbox = function (idx) {
  currentLightboxIdx = idx;
  const item = galleryItems[idx];
  if (!item || !lightboxModal) return;

  lbImg.src = item.img;
  lbTitle.textContent = item.title;
  lbDesc.textContent = item.desc;
  lbModel.textContent = `Model: ${item.model}`;
  lbSpecs.textContent = item.specs;
  lbWaBtn.href = `https://wa.me/918289850605?text=Hello%20COUNTER%20CRAFT,%20I%20am%20interested%20in%20booking%20${encodeURIComponent(item.title)}%20(Model:%20${encodeURIComponent(item.model)})`;

  lightboxModal.classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.closeLightbox = function () {
  if (!lightboxModal) return;
  lightboxModal.classList.remove('active');
  document.body.style.overflow = '';
};

window.prevLightbox = function () {
  currentLightboxIdx = (currentLightboxIdx - 1 + galleryItems.length) % galleryItems.length;
  window.openLightbox(currentLightboxIdx);
};

window.nextLightbox = function () {
  currentLightboxIdx = (currentLightboxIdx + 1) % galleryItems.length;
  window.openLightbox(currentLightboxIdx);
};

// Keyboard navigation
window.addEventListener('keydown', e => {
  if (!lightboxModal || !lightboxModal.classList.contains('active')) return;
  if (e.key === 'Escape') window.closeLightbox();
  if (e.key === 'ArrowLeft') window.prevLightbox();
  if (e.key === 'ArrowRight') window.nextLightbox();
});



// Boarding Pass Reservation -> WhatsApp (Exact Harikz Pattern)
const bookingForm = $('#booking-form');
if (bookingForm) {
  bookingForm.addEventListener('submit', e => {
    e.preventDefault();
    const v = id => encodeURIComponent(document.querySelector(id)?.value || '');
    const msg = `Hello COUNTER CRAFT, I want to reserve a luxury counter setup!%0A✦ Host/Caterer: ${v('#b-name')}%0A✦ Destination: ${v('#b-place')}%0A✦ Event Date: ${v('#b-date')}%0A✦ Counter Setup: ${v('#b-seat')}%0A✦ Dispatch: All Over Kerala 🌴`;
    window.open('https://wa.me/918289850605?text=' + msg, '_blank');
  });
}

// Reservation Atelier Form fallback
const customOrderForm = $('#customOrderForm');
if (customOrderForm) {
  customOrderForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = encodeURIComponent($('#orderName')?.value || 'Client');
    const phone = encodeURIComponent($('#orderPhone')?.value || '');
    const venue = encodeURIComponent($('#orderVenue')?.value || '');
    const model = encodeURIComponent($('#orderModel')?.value || 'Imperial Suite');
    const msg = `Hello COUNTER CRAFT,%0AI would like to place a custom order!%0A- Name: ${name}%0A- Phone: ${phone}%0A- Venue/City: ${venue}%0A- Counter Model: ${model}%0APlease reach out with blueprints and CAD drawings.`;
    window.open('https://wa.me/918289850605?text=' + msg, '_blank');
  });
}
