/**
 * REVELATION_ENGINE — revelation degree controller
 */

export function triggerRevelationBurst() {
  const core = document.querySelector('.revelation-core');
  document.body.classList.add('state-reveal');

  if (core) {
    core.style.transition = 'transform 900ms ease, opacity 900ms ease, filter 900ms ease';
    core.style.transform = 'scale(1.15)';
    core.style.opacity = '1';
    core.style.filter = 'blur(0px)';
  }

  increaseLightDensity();
  increaseParticleFlow();
}

function increaseLightDensity() {
  const root = document.documentElement;
  root.setAttribute('data-revelation-degree', 'burst');
  root.style.setProperty('--world-revelation-intensity', '1');
  root.style.setProperty('--world-field-energy', '0.88');

  const field = document.querySelector('.revelation-core__field');
  const ring = document.querySelector('.revelation-core__ring');
  const stars = document.querySelector('.world-layer__stars');
  const mist = document.querySelector('.world-layer__mist');

  if (field) {
    field.style.transition = 'opacity 900ms ease, transform 900ms ease, filter 900ms ease';
    field.style.opacity = '1';
    field.style.transform = 'scale(1.1)';
    field.style.filter = 'brightness(1.15)';
  }
  if (ring) {
    ring.style.transition = 'opacity 900ms ease, box-shadow 900ms ease';
    ring.style.opacity = '0.9';
    ring.style.boxShadow = '0 0 48px var(--light-gold-soft), inset 0 0 28px var(--light-gold-core)';
  }
  if (stars) {
    stars.style.transition = 'opacity 1200ms ease';
    stars.style.opacity = '0.85';
  }
  if (mist) {
    mist.style.transition = 'opacity 1200ms ease, transform 1200ms ease, filter 1200ms ease';
    mist.style.opacity = '0.78';
    mist.style.transform = 'translate(1.5%, -1.8%) scale(1.06)';
    mist.style.filter = 'blur(16px)';
  }
}

function increaseParticleFlow() {
  document.documentElement.style.setProperty('--particle-density', '1.35');
  const canvas = document.getElementById('world-particles');
  if (canvas) {
    canvas.style.transition = 'opacity 900ms ease';
    canvas.style.opacity = '0.62';
  }
}

export function clearRevelationState() {
  document.body.classList.remove('state-reveal');
  document.documentElement.removeAttribute('data-revelation-degree');
}
