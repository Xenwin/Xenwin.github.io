if (typeof Lenis !== "undefined") {
  const lenis = new Lenis({
    duration: 2.5,            // big glide effect
    easing: t => 1 - Math.pow(1 - t, 4), // strong ease-out
    smoothWheel: true,        // smooth mousewheel
    smoothTouch: true,        // smooth trackpad / touch
    wheelMultiplier: 1.2,     // increase scroll distance
    touchMultiplier: 2        // increase touch/trackpad scroll
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
}

const toggleBtn = document.getElementById('darkModeToggle');
const emojis = ['🌙', '☀️', '✨', '🔥'];
let currentIndex = 0;

toggleBtn.innerHTML = `<span aria-hidden="true">${emojis[currentIndex]}</span>`;

toggleBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % emojis.length;
  toggleBtn.innerHTML = `<span aria-hidden="true">${emojis[currentIndex]}</span>`;
});

const typewriter = document.getElementById('typewriter');
const words = ['developer.', 'gamer.', 'learner.'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
  const currentWord = words[wordIndex];
  const displayed = currentWord.substring(0, charIndex);
  typewriter.textContent = displayed;

  if (!isDeleting && charIndex < currentWord.length) {
    charIndex++;
    setTimeout(type, 120);
  } else if (isDeleting && charIndex > 0) {
    charIndex--;
    setTimeout(type, 60);
  } else {
    isDeleting = !isDeleting;
    if (!isDeleting) wordIndex = (wordIndex + 1) % words.length;
    setTimeout(type, isDeleting ? 1500 : 500);
  }
}
window.addEventListener('load', type);

const sections = document.querySelectorAll('section');

function isInViewport(el) {
  const rect = el.getBoundingClientRect();
  return rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8;
}

function checkSections() {
  sections.forEach(section => {
    if (isInViewport(section)) {
      section.classList.add('visible');
    }
  });
}
window.addEventListener('scroll', checkSections);
window.addEventListener('load', checkSections);

const navbar = document.querySelector('.navbar');

function handleNavbarScroll() {
  if (window.scrollY > 10) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}
window.addEventListener('scroll', handleNavbarScroll);
window.addEventListener('load', handleNavbarScroll);

const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let scrollPos = window.scrollY + window.innerHeight / 3;

  sections.forEach((section, index) => {
    if (
      section.offsetTop <= scrollPos &&
      section.offsetTop + section.offsetHeight > scrollPos
    ) {
      navLinks.forEach(link => link.classList.remove('active'));
      if (section.id) navLinks[index - 1]?.classList.add('active');
    }
  });
});

window.addEventListener('load', () => {
  const skillLevels = document.querySelectorAll('.skill-level');
  skillLevels.forEach(bar => {
    const widthMatch = bar.getAttribute('style').match(/width:\s*(\d+)%/);
    if (!widthMatch) return;
    const width = widthMatch[1] + '%';
    bar.style.width = '0';
    setTimeout(() => {
      bar.style.transition = 'width 3s ease-in-out';
      bar.style.width = width;
    }, 300);
  });
});

const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  formStatus.textContent = 'Sending...';
  formStatus.style.color = '#a86cd1';

  const formData = {
    name: contactForm.name.value.trim(),
    email: contactForm.email.value.trim(),
    message: contactForm.message.value.trim(),
  };

  if (!formData.name || !formData.email || !formData.message) {
    formStatus.textContent = 'Please fill out all fields.';
    formStatus.style.color = 'red';
    return;
  }

  try {
    await new Promise(resolve => setTimeout(resolve, 1000));

    formStatus.textContent = 'Message sent successfully! Thank you.';
    formStatus.style.color = 'green';
    contactForm.reset();
  } catch (error) {
    formStatus.textContent = 'Error sending message. Please try again later.';
    formStatus.style.color = 'red';
  }
});

(() => {
  'use strict';

  const wrapper = document.querySelector('.header-hero-wrapper');
  if (!wrapper) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'bg-lines';
  Object.assign(canvas.style, {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    zIndex: '-1',
    pointerEvents: 'none'
  });
  wrapper.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let w, h, dpr = Math.max(1, window.devicePixelRatio || 1);

  function resize() {
    w = wrapper.clientWidth;
    h = wrapper.clientHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  const trailLen = 24;
  const trail = Array.from({ length: trailLen }, () => ({ x: w / 2, y: h / 2, vx: 0, vy: 0 }));
  const mouse = { x: w / 2, y: h * 0.35, inside: false };
  const target = { x: mouse.x, y: mouse.y };

  wrapper.addEventListener('mousemove', e => {
    const r = wrapper.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
    mouse.inside = true;
  });
  wrapper.addEventListener('mouseleave', () => (mouse.inside = false));

  function step() {
    const spring = 0.12;
    const friction = 0.92;
    const jitter = 0.12;

    // Smooth the target toward the mouse to reduce jitter
    const mx = mouse.inside ? mouse.x : w * 0.5;
    const my = mouse.inside ? mouse.y : h * 0.35;
    target.x += (mx - target.x) * 0.12;
    target.y += (my - target.y) * 0.12;

    const tx = target.x;
    const ty = target.y;

    let px = tx, py = ty;
    for (let i = 0; i < trailLen; i++) {
      const p = trail[i];
      const dx = px - p.x;
      const dy = py - p.y;
      p.vx = (p.vx + dx * spring) * friction;
      p.vy = (p.vy + dy * spring) * friction;

      // Clamp velocity to avoid runaway motion
      p.vx = Math.max(-3, Math.min(3, p.vx));
      p.vy = Math.max(-3, Math.min(3, p.vy));

      p.x += p.vx + (Math.random() - 0.5) * jitter;
      p.y += p.vy + (Math.random() - 0.5) * jitter;
      px = p.x; py = p.y;
    }

    ctx.clearRect(0, 0, w, h);

    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgba(168,108,209,0.45)';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    for (let i = 0; i < trailLen; i++) ctx.lineTo(trail[i].x, trail[i].y);
    ctx.stroke();

    for (let k = 1; k <= 2; k++) {
      ctx.strokeStyle = k === 2 ? 'rgba(135,221,254,0.22)' : 'rgba(172,170,255,0.16)';
      ctx.lineWidth = 1 + (2 - k) * 0.4;
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      for (let i = 0; i < trailLen; i++) {
        const p = trail[i];
        ctx.lineTo(p.x + k * 2, p.y - k * 1.5);
      }
      ctx.stroke();
    }

    requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
})();

// Dotted rotating globe next to About
(() => {
  'use strict';
  const canvas = document.getElementById('about-globe');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const DPR = Math.max(1, window.devicePixelRatio || 1);
  let W, H, R;

  function resize() {
    const b = canvas.getBoundingClientRect();
    const size = Math.min(b.width, 420);
    canvas.width = Math.floor(size * DPR);
    canvas.height = Math.floor(size * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    W = canvas.width / DPR;
    H = canvas.height / DPR;
    R = Math.min(W, H) * 0.46;
  }
  resize();
  window.addEventListener('resize', resize);

  const N = 900;
  const phi = Math.PI * (3 - Math.sqrt(5));
  const pts = [];
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const a = i * phi;
    pts.push({ x: Math.cos(a) * r, y, z: Math.sin(a) * r });
  }

  let t = 0;
  const light = norm(-0.2, -0.6, 0.7);
  function norm(x, y, z) { const m = Math.hypot(x, y, z) || 1; return { x: x / m, y: y / m, z: z / m }; }
  function ry(p, a) { const c = Math.cos(a), s = Math.sin(a); return { x: p.x * c - p.z * s, y: p.y, z: p.x * s + p.z * c }; }
  function rx(p, a) { const c = Math.cos(a), s = Math.sin(a); return { x: p.x, y: p.y * c - p.z * s, z: p.y * s + p.z * c }; }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const cx = W / 2, cy = H / 2;

    const grad = ctx.createRadialGradient(cx, cy, R * 0.55, cx, cy, R);
    grad.addColorStop(0, 'rgba(255,255,255,0.08)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();

    const rxA = -0.18 + Math.sin(t) * 0.02;
    const ryA = t * 0.4;

    const projected = pts.map(p => {
      let v = ry(p, ryA); v = rx(v, rxA);
      const f = 420, scale = f / (f + v.z * 220);
      return { sx: cx + v.x * R * scale, sy: cy + v.y * R * scale, n: v, sc: scale };
    }).sort((a, b) => a.n.z - b.n.z);

    for (const m of projected) {
      const n = norm(m.n.x, m.n.y, m.n.z);
      const lum = Math.max(0.15, n.x * light.x + n.y * light.y + n.z * light.z);
      ctx.fillStyle = `rgba(255,255,255,${0.25 + lum * 0.6})`;
      const r = 1.0 * m.sc + 0.5;
      ctx.beginPath(); ctx.arc(m.sx, m.sy, r, 0, Math.PI * 2); ctx.fill();
    }

    t += 0.005;
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();