/* ════════════════════════════════════════════
   BIRTHDAY SURPRISE — script.js
   Clean, well-commented, pure JS
════════════════════════════════════════════ */

'use strict';

// ── Globals ──────────────────────────────────
const audio      = document.getElementById('bgMusic');
const musicFab   = document.getElementById('musicFab');
const musicIcon  = document.getElementById('musicIcon');
let   musicOn    = false;
let   currentScreen = 'screen-welcome';

// ── Slide captions ────────────────────────────
const captions = [
  "Our beautiful memories... 💖",
  "Every moment with you 🌸",
  "You light up my world ☀️",
  "My favourite person 🖤",
  "Always in my heart 💫",
  "Smiling because of you 🌹",
  "Together is my favourite place 🌙",
  "You make everything better ✨",
  "Cherished forever 💕",
  "Happy Birthday, Unique 🖤"
];

/* ════════════════════════════════════════════
   CUSTOM CURSOR
════════════════════════════════════════════ */
const cursor      = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');

document.addEventListener('mousemove', e => {
  cursor.style.left      = e.clientX + 'px';
  cursor.style.top       = e.clientY + 'px';
  cursorTrail.style.left = e.clientX + 'px';
  cursorTrail.style.top  = e.clientY + 'px';
  spawnSparkle(e.clientX, e.clientY);
});

function spawnSparkle(x, y) {
  if (Math.random() > 0.18) return;
  const s = document.createElement('div');
  s.className = 'sparkle';
  s.textContent = ['✨','💫','⭐','🌟'][Math.floor(Math.random()*4)];
  s.style.left = (x + (Math.random()*20-10)) + 'px';
  s.style.top  = (y + (Math.random()*20-10)) + 'px';
  s.style.position = 'fixed';
  s.style.zIndex = 9990;
  s.style.pointerEvents = 'none';
  document.body.appendChild(s);
  setTimeout(() => s.remove(), 900);
}

/* ════════════════════════════════════════════
   SCREEN TRANSITION
════════════════════════════════════════════ */
function goTo(targetId, delay = 0) {
  setTimeout(() => {
    const current = document.querySelector('.screen.active');
    const target  = document.getElementById(targetId);
    if (!target) return;

    if (current) {
      current.classList.add('exit');
      setTimeout(() => {
        current.classList.remove('active', 'exit');
      }, 900);
    }

    setTimeout(() => {
      target.classList.add('active');
      currentScreen = targetId;
      onScreenEnter(targetId);
    }, 400);
  }, delay);
}

function onScreenEnter(id) {
  switch (id) {
    case 'screen-welcome':   initStars();              break;
    case 'screen-loading':   runLoading();             break;
    case 'screen-quotes':    runQuotes();              break;
    case 'screen-wishes':    runWishes();              break;
    case 'screen-timeline':  initTimeline();           break;
    case 'screen-letter':    spawnHearts('letterHearts'); break;
    case 'screen-slideshow': initSlideshow();          break;
    case 'screen-finale':    runFinale();              break;
    case 'screen-question':  initQuestion();           break;
    case 'screen-thankyou':  runThankyou();            break;
  }
}

/* ════════════════════════════════════════════
   WELCOME SCREEN
════════════════════════════════════════════ */
document.getElementById('btnYesMusic').addEventListener('click', () => {
  musicOn = true;
  audio.volume = 0.55;
  audio.play().catch(() => {});
  musicFab.style.display = 'flex';
  updateMusicIcon();
  goTo('screen-loading');
});

document.getElementById('btnNoMusic').addEventListener('click', () => {
  musicFab.style.display = 'flex';
  goTo('screen-loading');
});

musicFab.addEventListener('click', () => {
  if (musicOn) { audio.pause(); musicOn = false; }
  else         { audio.play().catch(()=>{}); musicOn = true; }
  updateMusicIcon();
});

function updateMusicIcon() {
  musicIcon.textContent = musicOn ? '🎵' : '🔇';
}

/* ── Starry canvas ── */
function initStars() {
  const canvas = document.getElementById('starsCanvas');
  const ctx    = canvas.getContext('2d');
  let W, H, stars = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    stars = Array.from({length:180}, () => ({
      x: Math.random()*W, y: Math.random()*H,
      r: Math.random()*1.8+0.3,
      a: Math.random(), da: (Math.random()*.02+.005)*(Math.random()<.5?1:-1)
    }));
  }
  resize();
  window.addEventListener('resize', resize);

  (function draw() {
    if (currentScreen !== 'screen-welcome') return;
    ctx.clearRect(0, 0, W, H);
    stars.forEach(s => {
      s.a = Math.max(0.1, Math.min(1, s.a + s.da));
      if (s.a <= 0.1 || s.a >= 1) s.da *= -1;
      ctx.globalAlpha = s.a;
      ctx.fillStyle   = '#fff';
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  })();

  spawnHearts('welcomeHearts');
}

/* ════════════════════════════════════════════
   FLOATING HEARTS HELPER
════════════════════════════════════════════ */
function spawnHearts(containerId, count = 12) {
  const c = document.getElementById(containerId);
  if (!c) return;
  c.innerHTML = '';
  const emojis = ['❤️','💖','💕','💗','🌸','✨','💫','🌹'];
  for (let i = 0; i < count; i++) {
    const h = document.createElement('div');
    h.className = 'fheart';
    h.textContent = emojis[Math.floor(Math.random()*emojis.length)];
    h.style.left     = Math.random()*100 + '%';
    h.style.fontSize = (Math.random()*.8+.6) + 'rem';
    h.style.animationDuration  = (Math.random()*8+6) + 's';
    h.style.animationDelay     = (Math.random()*5) + 's';
    c.appendChild(h);
  }
}

/* ════════════════════════════════════════════
   LOADING SCREEN
════════════════════════════════════════════ */
function runLoading() {
  // Build sparkle ring
  const ring = document.getElementById('sparkleRing');
  ring.innerHTML = '';
  for (let i = 0; i < 8; i++) {
    const sp = document.createElement('span');
    sp.style.cssText = `
      position:absolute; font-size:.9rem;
      top:50%; left:50%;
      transform-origin:0 0;
      transform: rotate(${i*45}deg) translateX(42px) translateY(-50%);
    `;
    sp.textContent = '✨';
    ring.appendChild(sp);
  }
  setTimeout(() => goTo('screen-quotes'), 3200);
}

/* ════════════════════════════════════════════
   INTRO QUOTES — typewriter
════════════════════════════════════════════ */
const QUOTES = [
  "Some people make life more beautiful.",
  "Some smiles can brighten even the darkest days.",
  "Some hearts are truly irreplaceable.",
  "Today is the birthday of someone incredibly special.",
  "And that someone is you. 🖤"
];

function runQuotes() {
  spawnHearts('quotesHearts', 8);
  let qi = 0;
  const el     = document.getElementById('quoteText');
  const cursor = document.getElementById('quoteCursor');

  function typeQuote(text, cb) {
    el.textContent = '';
    let i = 0;
    const iv = setInterval(() => {
      el.textContent += text[i++];
      if (i >= text.length) { clearInterval(iv); setTimeout(cb, 1800); }
    }, 55);
  }
  function eraseQuote(cb) {
    let t = el.textContent;
    const iv = setInterval(() => {
      t = t.slice(0, -1);
      el.textContent = t;
      if (!t.length) { clearInterval(iv); cb(); }
    }, 28);
  }
  function nextQuote() {
    if (qi >= QUOTES.length) { goTo('screen-wishes'); return; }
    typeQuote(QUOTES[qi++], () => eraseQuote(nextQuote));
  }
  nextQuote();
}

/* ════════════════════════════════════════════
   WISH WINDOWS
════════════════════════════════════════════ */
function runWishes() {
  const slides = document.querySelectorAll('.wish-slide');
  let wi = 0;

  // particle canvas
  const canvas = document.getElementById('wishCanvas');
  const ctx    = canvas.getContext('2d');
  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;
  window.addEventListener('resize', () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  const particles = Array.from({length:60}, () => makeParticle(W, H));
  function makeParticle(W, H) {
    return { x:Math.random()*W, y:Math.random()*H,
      vx:(Math.random()-.5)*.4, vy:-(Math.random()*.5+.2),
      r:Math.random()*3+1, life:Math.random(), decay:Math.random()*.008+.003,
      color:['#ff6b9d','#ffd700','#e8a598','#9c27b0'][Math.floor(Math.random()*4)] };
  }
  (function animP() {
    if (currentScreen !== 'screen-wishes') return;
    ctx.clearRect(0,0,W,H);
    particles.forEach((p,i) => {
      p.x += p.vx; p.y += p.vy; p.life -= p.decay;
      if (p.life <= 0) particles[i] = makeParticle(W,H);
      ctx.globalAlpha = p.life;
      ctx.fillStyle   = p.color;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(animP);
  })();

  function showWish(index) {
    slides.forEach(s => s.classList.remove('active'));
    if (index < slides.length) {
      slides[index].classList.add('active');
      setTimeout(() => {
        wi++;
        if (wi < slides.length) showWish(wi);
        else goTo('screen-timeline', 400);
      }, 3800);
    }
  }
  showWish(0);
}

/* ════════════════════════════════════════════
   TIMELINE
════════════════════════════════════════════ */
function initTimeline() {
  spawnHearts('timelineHearts', 10);
  const items = document.querySelectorAll('.timeline-item');
  items.forEach((item, i) => {
    setTimeout(() => item.classList.add('visible'), 400 + i*250);
  });
}

document.getElementById('btnToLetter').addEventListener('click', () => goTo('screen-letter'));

/* ════════════════════════════════════════════
   LETTER
════════════════════════════════════════════ */
document.getElementById('btnToSlideshow').addEventListener('click', () => goTo('screen-slideshow'));

/* ════════════════════════════════════════════
   SLIDESHOW
════════════════════════════════════════════ */
let slideIndex    = 0;
let slideTimer    = null;
const SLIDE_DELAY = 3800;

function initSlideshow() {
  const slides = document.querySelectorAll('.slide');
  const dotsEl = document.getElementById('slideshowDots');
  const capEl  = document.getElementById('captionText');
  spawnHearts('slideshowHearts', 8);

  // build dots
  dotsEl.innerHTML = '';
  slides.forEach((_, i) => {
    const d = document.createElement('div');
    d.className = 'dot' + (i===0?' active':'');
    dotsEl.appendChild(d);
  });

  function showSlide(idx) {
    slides.forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));
    slides[idx].classList.add('active');
    document.querySelectorAll('.dot')[idx].classList.add('active');
    capEl.textContent = captions[idx] || '';
  }

  showSlide(0);
  slideTimer = setInterval(() => {
    slideIndex = (slideIndex + 1) % slides.length;
    showSlide(slideIndex);
    if (slideIndex === slides.length - 1) {
      setTimeout(() => goTo('screen-finale'), SLIDE_DELAY + 600);
      clearInterval(slideTimer);
    }
  }, SLIDE_DELAY);
}

/* ════════════════════════════════════════════
   FINALE — Fireworks + Confetti
════════════════════════════════════════════ */
function runFinale() {
  spawnHearts('finaleHearts', 16);
  launchConfetti('confettiContainer', 120);
  initFireworks();
}

document.getElementById('btnToQuestion').addEventListener('click', () => goTo('screen-question'));

function launchConfetti(containerId, count) {
  const c = document.getElementById(containerId);
  if (!c) return;
  const colors = ['#ff6b9d','#ffd700','#e8a598','#9c27b0','#ff4081','#fff','#ffb347'];
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const p = document.createElement('div');
      p.className = 'confetti-piece';
      p.style.left            = Math.random()*100 + '%';
      p.style.background      = colors[Math.floor(Math.random()*colors.length)];
      p.style.width           = (Math.random()*8+4) + 'px';
      p.style.height          = (Math.random()*8+4) + 'px';
      p.style.borderRadius    = Math.random()>.5 ? '50%' : '2px';
      p.style.animationDuration = (Math.random()*3+2.5) + 's';
      p.style.animationDelay  = '0s';
      c.appendChild(p);
      setTimeout(() => p.remove(), 6000);
    }, Math.random()*3000);
  }
}

function initFireworks() {
  const canvas = document.getElementById('fireworksCanvas');
  const ctx    = canvas.getContext('2d');
  let W = canvas.width  = window.innerWidth;
  let H = canvas.height = window.innerHeight;
  window.addEventListener('resize', () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  const fwColors = ['#ff6b9d','#ffd700','#e8a598','#9c27b0','#ff4081','#ffffff','#ffb347'];
  let particles = [];

  function explode(x, y) {
    const color = fwColors[Math.floor(Math.random()*fwColors.length)];
    for (let i = 0; i < 60; i++) {
      const angle = (Math.PI*2/60)*i;
      const speed = Math.random()*3+1;
      particles.push({ x, y,
        vx: Math.cos(angle)*speed, vy: Math.sin(angle)*speed,
        life:1, decay:Math.random()*.02+.012, color, r:Math.random()*2+1 });
    }
  }

  function fw() {
    if (currentScreen !== 'screen-finale') return;
    ctx.fillStyle = 'rgba(10,0,16,0.18)';
    ctx.fillRect(0,0,W,H);
    particles.forEach((p,i) => {
      p.x += p.vx; p.y += p.vy;
      p.vy += 0.04; p.life -= p.decay;
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle   = p.color;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
    });
    particles = particles.filter(p => p.life > 0);
    ctx.globalAlpha = 1;
    requestAnimationFrame(fw);
  }

  // auto-launch every 1.2s
  explode(Math.random()*W, Math.random()*H*.6);
  const fwTimer = setInterval(() => {
    if (currentScreen !== 'screen-finale') { clearInterval(fwTimer); return; }
    explode(Math.random()*W, Math.random()*H*.65);
  }, 1200);

  fw();
}

/* ════════════════════════════════════════════
   QUESTION — runaway No button
════════════════════════════════════════════ */
const escapeMsgs = [
  "Nice try 😜", "No escaping from saying yes! 🖤",
  "Catch me if you can! 🏃", "Nope! 😏", "Try again! 💖"
];

function initQuestion() {
  spawnHearts('questionHearts', 10);
  const noBtn    = document.getElementById('btnNoLike');
  const msgEl    = document.getElementById('escapeMsg');
  const container = document.querySelector('#screen-question .question-btns');

  noBtn.style.position = 'fixed';
  noBtn.style.zIndex   = '20';
  placeNoBtnRandom();

  function placeNoBtnRandom() {
    const margin = 80;
    const x = margin + Math.random()*(window.innerWidth - margin*2);
    const y = margin + Math.random()*(window.innerHeight - margin*2);
    noBtn.style.left = x + 'px';
    noBtn.style.top  = y + 'px';
    noBtn.style.transform = 'translate(-50%,-50%)';
    msgEl.textContent = escapeMsgs[Math.floor(Math.random()*escapeMsgs.length)];
  }

  noBtn.addEventListener('mousemove', placeNoBtnRandom);
  noBtn.addEventListener('touchstart', e => { e.preventDefault(); placeNoBtnRandom(); }, {passive:false});
  noBtn.addEventListener('click', placeNoBtnRandom);

  document.getElementById('btnYesLike').addEventListener('click', () => {
    noBtn.style.display = 'none';
    heartBurst(window.innerWidth/2, window.innerHeight/2);
    goTo('screen-thankyou', 600);
  });
}

/* heart burst on click */
function heartBurst(x, y) {
  for (let i = 0; i < 18; i++) {
    const h = document.createElement('div');
    h.style.cssText = `
      position:fixed; left:${x}px; top:${y}px; font-size:${Math.random()*16+12}px;
      pointer-events:none; z-index:9999;
      transition: all 1.2s ease;
      transform: translate(-50%,-50%);
    `;
    h.textContent = '❤️';
    document.body.appendChild(h);
    const angle = Math.random()*Math.PI*2;
    const dist  = Math.random()*120+60;
    requestAnimationFrame(() => {
      h.style.left    = (x + Math.cos(angle)*dist) + 'px';
      h.style.top     = (y + Math.sin(angle)*dist - 60) + 'px';
      h.style.opacity = '0';
    });
    setTimeout(() => h.remove(), 1300);
  }
}

/* ════════════════════════════════════════════
   THANK YOU
════════════════════════════════════════════ */
function runThankyou() {
  spawnHearts('thankyouHearts', 20);
  launchConfetti('thankConfetti', 80);
}

document.getElementById('btnReplay').addEventListener('click', () => {
  // reset slide index
  slideIndex = 0;
  if (slideTimer) clearInterval(slideTimer);
  // reset no button position
  const noBtn = document.getElementById('btnNoLike');
  if (noBtn) noBtn.style.display = '';
  goTo('screen-welcome');
  if (musicOn) { audio.pause(); audio.currentTime = 0; musicOn = false; updateMusicIcon(); }
});

/* ════════════════════════════════════════════
   INIT
════════════════════════════════════════════ */
window.addEventListener('load', () => {
  onScreenEnter('screen-welcome');
});
