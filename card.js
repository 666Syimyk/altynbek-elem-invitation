(() => {
  'use strict';
  const welcome = document.getElementById('welcome');
  const invitation = document.getElementById('invitation');
  const audio = document.getElementById('music');
  const toggle = document.getElementById('music-toggle');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const card = document.querySelector('.invitation-card');
  let opening = false, playingRequest = false;
  document.body.classList.add('motion-ready');
  welcome.hidden = false;
  invitation.hidden = true;
  audio.volume = 0.48;

  // Decorative light stays at the paper's edges, away from the invitation text.
  const particles = document.createElement('div');
  particles.className = 'ambient-particles';
  particles.setAttribute('aria-hidden', 'true');
  for (let index = 0; index < 32; index++) {
    const particle = document.createElement('i');
    particle.style.left = (index % 2 ? 94 + index % 4 : 2 + index % 4) + '%';
    particle.style.top = (9 + (index * 23) % 83) + '%';
    particle.style.setProperty('--light-duration', (6 + index % 5) + 's');
    particle.style.setProperty('--light-delay', -(index % 8) + 's');
    particle.style.setProperty('--light-drift', (index % 2 ? -9 : 9) + 'px');
    particles.append(particle);
  }
  card.append(particles);
  function updateMusic() {
    const playing = !audio.paused && !audio.ended;
    toggle.setAttribute('aria-pressed', String(playing));
    toggle.setAttribute('aria-label', playing ? 'Музыканы өчүрүү' : 'Музыканы күйгүзүү');
  }
  async function playMusic() {
    if (playingRequest) return;
    playingRequest = true;
    try { await audio.play(); } catch { /* A fresh music-button tap retries playback. */ }
    finally { playingRequest = false; updateMusic(); }
  }
  ['play', 'pause', 'error'].forEach(event => audio.addEventListener(event, updateMusic));
  toggle.addEventListener('click', () => audio.paused ? playMusic() : audio.pause());
  document.getElementById('open-invitation').addEventListener('click', () => {
    if (opening) return;
    opening = true;
    playMusic();
    // The entire card enters together; no content is paged or replaced.
    invitation.hidden = false;
    toggle.hidden = false;
    document.body.classList.add('invitation-open');
    welcome.inert = true;
    welcome.classList.add('is-opening');
    if (reducedMotion.matches) welcome.hidden = true;
    else setTimeout(() => { welcome.hidden = true; }, 650);
    document.getElementById('card-names').focus({ preventScroll: true });
  });
  document.addEventListener('visibilitychange', () => {
    document.body.classList.toggle('motion-paused', document.hidden);
  });
})();
