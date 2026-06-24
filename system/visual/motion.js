/**
 * MOTION — rAF-driven world breathing (60fps stable)
 */

import { getWorldState, WORLD_STATE } from '../world_engine/state_machine.js';

let ticking = false;
let tick = 0;
let particleRaf = 0;

const BREATH_BY_STATE = {
  [WORLD_STATE.REST]: { amp: 0.02, rate: 0.7, base: 0.42 },
  [WORLD_STATE.PERCEPTION]: { amp: 0.035, rate: 0.95, base: 0.55 },
  [WORLD_STATE.REVELATION]: { amp: 0.055, rate: 1.35, base: 0.78 },
  [WORLD_STATE.TRANSITION]: { amp: 0.012, rate: 0.45, base: 0.28 }
};

export function startMotion(update) {
  if (ticking) return;
  ticking = true;

  const page = document.body && document.body.getAttribute('data-page');
  const canvas = document.getElementById('world-particles');
  if (canvas && page === 'landing') initParticles(canvas);

  function loop() {
    tick += 1;
    update();
    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}

export function updateFog() {
  const t = tick * 0.016;
  const mist = document.querySelector('.world-layer__mist');
  if (mist) {
    mist.style.transform =
      'translate(' + (Math.sin(t * 0.35) * 2) + '%, ' + (Math.cos(t * 0.28) * -1.4) + '%) scale(' +
      (1 + Math.sin(t * 0.2) * 0.02) + ')';
    mist.style.opacity = String(0.72 + Math.sin(t * 0.18) * 0.06);
  }

  const noiseFog = document.querySelector('.world-layer__noise-fog');
  if (noiseFog && document.body && document.body.getAttribute('data-page') === 'landing') {
    noiseFog.style.backgroundPosition =
      (Math.sin(t * 0.12) * 24) + 'px ' + (Math.cos(t * 0.1) * 18) + 'px';
  }

  if (document.body && document.body.getAttribute('data-page') === 'explore') {
    let sheet = document.getElementById('world-motion-fog');
    if (!sheet) {
      sheet = document.createElement('style');
      sheet.id = 'world-motion-fog';
      document.head.appendChild(sheet);
    }
    sheet.textContent =
      'body[data-page="explore"]::after{transform:translate(' +
      (Math.sin(t * 0.35) * 1.6) + '%,' + (Math.cos(t * 0.28) * -1.1) +
      '%) scale(1.02);opacity:' + (0.66 + Math.sin(t * 0.18) * 0.06) + ';}';
  }
}

export function updateLight() {
  const state = getWorldState();
  const profile = BREATH_BY_STATE[state] || BREATH_BY_STATE[WORLD_STATE.REST];
  const breath = 0.5 + 0.5 * Math.sin(tick * 0.016 * profile.rate);
  const scale = 1 + breath * profile.amp;
  const field = document.querySelector('.revelation-core__field');
  const ring = document.querySelector('.revelation-core__ring');
  const onLanding = document.body && document.body.getAttribute('data-page') === 'landing';

  if (field && !onLanding) {
    field.style.transform = 'scale(' + scale + ')';
    field.style.transformOrigin = '50% 50%';
  }
  if (ring) {
    ring.style.transform = 'scale(' + (scale * 0.98) + ')';
    ring.style.transformOrigin = '50% 50%';
  }

  if (state === WORLD_STATE.REVELATION) {
    const pulse = 1.1 + Math.sin(tick * 0.024) * 0.08;
    if (field) field.style.filter = 'brightness(' + pulse + ')';
    if (ring) {
      ring.style.boxShadow =
        '0 0 ' + (40 + Math.sin(tick * 0.02) * 12) + 'px var(--light-gold-soft), inset 0 0 ' +
        (22 + Math.sin(tick * 0.016) * 8) + 'px var(--light-gold-core)';
    }
  }
}

export function updateStars() {
  const state = getWorldState();
  const profile = BREATH_BY_STATE[state] || BREATH_BY_STATE[WORLD_STATE.REST];
  const stars = document.querySelector('.world-layer__stars');
  if (!stars) return;
  if (tick % 6 !== 0) return;
  const noise = (Math.random() - 0.5) * 0.1;
  stars.style.opacity = String(Math.max(0.28, Math.min(0.98, profile.base + noise)));
}

export function bindExploreCardMotion() {
  const cards = document.querySelectorAll('.world-container .stream-item, .world-container .card');
  cards.forEach(function (card) {
    card.style.transition = 'transform 0.55s ease, box-shadow 0.55s ease';
    card.addEventListener('mouseenter', function onEnter() {
      card.style.transform = 'translateY(-3px)';
      card.style.boxShadow = '0 8px 32px var(--shadow-deep), 0 0 28px rgba(120, 168, 228, 0.14), 0 0 20px var(--shadow-gold)';
    }, { once: false });
    card.addEventListener('mouseleave', function onLeave() {
      card.style.transform = '';
      card.style.boxShadow = '';
    }, { once: false });
  });
}

function particleFillStyle(alpha) {
  const base = getComputedStyle(document.documentElement).getPropertyValue('--particle-color').trim();
  if (!base) return 'rgba(198, 210, 224, ' + alpha + ')';
  const m = base.match(/rgba?\(([^)]+)\)/);
  if (!m) return base;
  const parts = m[1].split(',').map(function (s) { return s.trim(); });
  return 'rgba(' + parts[0] + ', ' + parts[1] + ', ' + parts[2] + ', ' + alpha + ')';
}

function initParticles(canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  let w = 0;
  let h = 0;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function seed() {
    const count = Math.min(40, Math.floor((w * h) / 22000));
    particles = [];
    for (let i = 0; i < count; i += 1) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1 + 0.2,
        vx: (Math.random() - 0.5) * 0.028,
        vy: (Math.random() - 0.5) * 0.018,
        a: Math.random() * 0.2 + 0.06
      });
    }
  }

  function tickParticles() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(function (p) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = particleFillStyle(p.a);
      ctx.fill();
    });
    particleRaf = requestAnimationFrame(tickParticles);
  }

  resize();
  seed();
  cancelAnimationFrame(particleRaf);
  tickParticles();
  window.addEventListener('resize', function () { resize(); seed(); });
}
