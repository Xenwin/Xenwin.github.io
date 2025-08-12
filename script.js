 

 
const PREFERS_REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const NAV_ACTIVE_OFFSET_FRACTION = 1 / 3; 

 
const TYPE_SPEED_MS = 120;        
const DELETE_SPEED_MS = 60;       
const WORD_HOLD_MS = 1500;         
const SWITCH_PAUSE_MS = 500;      

 
const SECTION_THRESHOLD = 0.1;     
const SECTION_ROOT_MARGIN = '0px 0px -50px 0px';

 
const STATS_STEPS = 50;           
const STATS_INTERVAL_MS = 50;
const STATS_STAGGER_MS = 200;

 
const SERVICE_STAGGER_MS = 150;
const PROJECT_STAGGER_MS = 200;

 
if (!PREFERS_REDUCED_MOTION && typeof Lenis !== "undefined") {
  const initLenis = () => {
    const lenis = new Lenis({
      duration: 2.5,
      easing: t => 1 - Math.pow(1 - t, 4),
      smoothWheel: true,
      smoothTouch: true,
      wheelMultiplier: 1.2,
      touchMultiplier: 2
    });
    function onAnimationFrame(time) {
      if (document.hidden) return requestAnimationFrame(onAnimationFrame);
      lenis.raf(time);
      requestAnimationFrame(onAnimationFrame);
    }
    requestAnimationFrame(onAnimationFrame);
  };
  if ('requestIdleCallback' in window) requestIdleCallback(initLenis);
  else setTimeout(initLenis, 0);
}

 
const darkModeButton = document.getElementById('darkModeToggle');
const themeEmojis = ['🌙', '☀️', '✨', '🔥'];
let emojiIndex = Number(localStorage.getItem('emojiIndex') || 0) % themeEmojis.length;

darkModeButton.innerHTML = `<span aria-hidden="true">${themeEmojis[emojiIndex]}</span>`;

darkModeButton.addEventListener('click', () => {
  emojiIndex = (emojiIndex + 1) % themeEmojis.length;
  darkModeButton.innerHTML = `<span aria-hidden="true">${themeEmojis[emojiIndex]}</span>`;
  darkModeButton.setAttribute('aria-pressed', darkModeButton.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
  localStorage.setItem('emojiIndex', String(emojiIndex));

  darkModeButton.style.transform = 'scale(0.9)';
  setTimeout(() => { darkModeButton.style.transform = 'scale(1)'; }, 150);
});

 
const typewriterTarget = document.getElementById('typewriter');
const typewriterWords = ['developer.', 'gamer.', 'learner.', 'creator.'];
let typewriterWordIndex = 0;
let typewriterCharIndex = 0;
let typewriterIsDeleting = false;

function runTypewriter() {
  if (!typewriterTarget) return;
  const currentWord = typewriterWords[typewriterWordIndex];
  typewriterTarget.textContent = currentWord.substring(0, typewriterCharIndex);

  if (!typewriterIsDeleting && typewriterCharIndex < currentWord.length) {
    typewriterCharIndex++;
    setTimeout(runTypewriter, TYPE_SPEED_MS);
  } else if (typewriterIsDeleting && typewriterCharIndex > 0) {
    typewriterCharIndex--;
    setTimeout(runTypewriter, DELETE_SPEED_MS);
  } else {
    typewriterIsDeleting = !typewriterIsDeleting;
    if (!typewriterIsDeleting) typewriterWordIndex = (typewriterWordIndex + 1) % typewriterWords.length;
    setTimeout(runTypewriter, typewriterIsDeleting ? WORD_HOLD_MS : SWITCH_PAUSE_MS);
  }
}

 

const sections = document.querySelectorAll('section');
 
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      
      if (entry.target.id === 'stats') animateStats();
      if (entry.target.id === 'services') revealServiceCards();
      if (entry.target.id === 'projects') revealProjectCards();
    }
  });
}, { threshold: SECTION_THRESHOLD, rootMargin: SECTION_ROOT_MARGIN });

sections.forEach(section => {
  sectionObserver.observe(section);
});
// I watched interstellar imax again absolute fucking cinema anyways lets go

 
function animateStats() {
  const stats = document.querySelectorAll('.stat-number');
  stats.forEach((stat, i) => {
    setTimeout(() => {
      const final = stat.textContent;
      const target = parseInt(final);
      let current = 0;
      const step = target / STATS_STEPS;
      
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          stat.textContent = final;
          clearInterval(timer);
        } else {
          stat.textContent = Math.floor(current) + (final.includes('+') ? '+' : '');
        }
      }, STATS_INTERVAL_MS);
    }, i * STATS_STAGGER_MS);
  });
}

 
function revealServiceCards() {
  const cards = document.querySelectorAll('.service-card');
  cards.forEach((card, i) => {
    setTimeout(() => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      card.style.transition = 'all 0.6s ease';
      
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 100);
    }, i * SERVICE_STAGGER_MS);
  });
}

 
function revealProjectCards() {
  const cards = document.querySelectorAll('.project-card');
  cards.forEach((card, i) => {
    setTimeout(() => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      card.style.transition = 'all 0.6s ease';
      
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 100);
    }, i * PROJECT_STAGGER_MS);
  });
}
const navbar = document.querySelector('.navbar');

 
function updateNavbarOnScroll() {
  if (window.scrollY > 10) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', updateNavbarOnScroll);
window.addEventListener('load', updateNavbarOnScroll);

 
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  const scrollPos = window.scrollY + window.innerHeight * NAV_ACTIVE_OFFSET_FRACTION;
  sections.forEach((section) => {
    if (section.offsetTop <= scrollPos && section.offsetTop + section.offsetHeight > scrollPos) {
      navLinks.forEach(link => { link.classList.remove('active'); link.removeAttribute('aria-current'); });
      if (section.id) {
        const correspondingLink = document.querySelector(`a[href="#${section.id}"]`);
        if (correspondingLink) {
          correspondingLink.classList.add('active');
          correspondingLink.setAttribute('aria-current', 'page');
        }
      }
    }
  });
});

// my shotgun looking mad sexy rn 
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const submitBtn = document.querySelector('.btn-submit');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';

  const formData = {
    name: contactForm.name.value.trim(),
    email: contactForm.email.value.trim(),
    message: contactForm.message.value.trim(),
  };

  if (!formData.name || !formData.email || !formData.message) {
    formStatus.textContent = 'Please fill out all fields.';
    formStatus.style.color = '#ff6b6b';
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
    return;
  }

  try {
    await new Promise(resolve => setTimeout(resolve, 1500));

    formStatus.textContent = 'Message sent successfully! Thank you.';
    formStatus.style.color = '#51cf66';
    contactForm.reset();
    
    submitBtn.innerHTML = '<span>Sent!</span><i class="fas fa-check"></i>';
    submitBtn.style.background = 'linear-gradient(135deg, #51cf66, #40c057)';
    
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
      submitBtn.style.background = 'linear-gradient(135deg, #a86cd1, #7f53ac)';
      formStatus.textContent = '';
    }, 2000);
    
  } catch (error) {
    formStatus.textContent = 'Error sending message. Please try again later.';
    formStatus.style.color = '#ff6b6b';
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
  }
});

document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-8px) scale(1.02)';
  });
  
  card.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0) scale(1)';
  });
});

document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-8px) scale(1.02)';
  });
  
  card.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0) scale(1)';
  });
});

 
if (!PREFERS_REDUCED_MOTION) {
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
      hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
  });
}

// wow so cool look at me im so cool
 
(() => {
  if (PREFERS_REDUCED_MOTION) return;

  const headerHeroWrapper = document.querySelector('.header-hero-wrapper');
  if (!headerHeroWrapper) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'cursor-glow';
  Object.assign(canvas.style, {
    position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', zIndex: '-1', pointerEvents: 'none'
  });
  headerHeroWrapper.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let width, height, dpr = Math.max(1, window.devicePixelRatio || 1);

  function resizeCanvas() {
    width = headerHeroWrapper.clientWidth;
    height = headerHeroWrapper.clientHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
// gonna continue after eating here or will not probaly since i am adding a reminder here hehe
  const glowColors = [
    { r: 168, g: 108, b: 209, a: 0.3 },
    { r: 255, g: 78, b: 205, a: 0.25 },
    { r: 94, g: 234, b: 212, a: 0.2 },
    { r: 96, g: 165, b: 250, a: 0.15 }
  ];

  const mouseState = { x: width / 2, y: height / 2, inside: false };
  const glowTarget = { x: mouseState.x, y: mouseState.y };
  let elapsedTime = 0;

  headerHeroWrapper.addEventListener('mousemove', e => {
    const r = headerHeroWrapper.getBoundingClientRect();
    mouseState.x = e.clientX - r.left;
    mouseState.y = e.clientY - r.top;
    mouseState.inside = true;
  });
  headerHeroWrapper.addEventListener('mouseleave', () => (mouseState.inside = false));

  function renderFrame() {
     
    if (document.hidden) return requestAnimationFrame(renderFrame);
    elapsedTime += 0.016; // ~60fps

    const mx = mouseState.inside ? mouseState.x : width * 0.5;
    const my = mouseState.inside ? mouseState.y : height * 0.5;
    glowTarget.x += (mx - glowTarget.x) * 0.1;
    glowTarget.y += (my - glowTarget.y) * 0.1;

    ctx.clearRect(0, 0, width, height);

    if (mouseState.inside) {
      glowColors.forEach((color, index) => {
        const baseSize = 80 + index * 40;
        const pulse = Math.sin(elapsedTime * 2 + index) * 0.1 + 0.9;
        const currentSize = baseSize * pulse;
        const gradient = ctx.createRadialGradient(glowTarget.x, glowTarget.y, 0, glowTarget.x, glowTarget.y, currentSize);
        gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`);
        gradient.addColorStop(0.6, `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a * 0.5})`);
        gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(glowTarget.x, glowTarget.y, currentSize, 0, Math.PI * 2);
        ctx.fill();
      });

      
      for (let i = 0; i < 6; i++) {
        const angle = (elapsedTime * 0.5 + i * Math.PI / 3) % (Math.PI * 2);
        const distance = 60 + Math.sin(elapsedTime * 3 + i) * 10;
        const sparkleX = glowTarget.x + Math.cos(angle) * distance;
        const sparkleY = glowTarget.y + Math.sin(angle) * distance;
        const sparkleSize = 2 + Math.sin(elapsedTime * 4 + i) * 1;
        ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + Math.sin(elapsedTime * 2 + i) * 0.2})`;
        ctx.beginPath();
        ctx.arc(sparkleX, sparkleY, sparkleSize, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    requestAnimationFrame(renderFrame);
  }
  requestAnimationFrame(renderFrame);
})();
// i am never writing js ever fucking again
const particleColors = [
  'rgba(168, 108, 209, 0.4)',
  'rgba(255, 78, 205, 0.4)',
  'rgba(94, 234, 212, 0.4)',
  'rgba(96, 165, 250, 0.4)'
];

(function initParticles() {
  if (PREFERS_REDUCED_MOTION) return;
  const container = document.createElement('div');
  container.className = 'particles';
  document.body.appendChild(container);
  const count = 80;
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'particle';
    el.style.left = Math.random() * 100 + '%';
    el.style.opacity = (Math.random() * 0.6 + 0.4).toFixed(2);
    el.style.animationDelay = (Math.random() * 16).toFixed(2) + 's';
    el.style.animationDuration = (Math.random() * 10 + 12).toFixed(2) + 's';
    const randomColor = particleColors[Math.floor(Math.random() * particleColors.length)];
    el.style.background = randomColor;
    const size = Math.random() * 2 + 2;
    el.style.width = size + 'px';
    el.style.height = size + 'px';
    container.appendChild(el);
  }
})();

 
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) {
     
    setTimeout(() => {
      loader.classList.add('hidden');
      setTimeout(() => loader.remove(), 550);
    }, 150);
  }
   
  runTypewriter();
});
// russain roulette might be good now that i think about it
 
const contactFormEl = document.getElementById('contactForm');
if (contactFormEl) {
  contactFormEl.addEventListener('input', (e) => {
    const field = e.target;
    if (!(field instanceof HTMLElement)) return;
    if ('checkValidity' in field) {
      const valid = field.checkValidity();
      field.style.borderColor = valid ? 'rgba(94, 234, 212, 0.5)' : 'rgba(255, 107, 107, 0.5)';
    }
  });
}

 // i need coffe
(function konami() {
  const sequence = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  const buffer = [];
  let rainbowActive = false;
  document.addEventListener('keydown', (e) => {
    buffer.push(e.key);
    if (buffer.length > sequence.length) buffer.shift();
    if (sequence.every((k, i) => buffer[i] && buffer[i].toLowerCase() === k.toLowerCase())) {
      if (rainbowActive) return;
      rainbowActive = true;
      document.body.style.animation = 'rainbow 2s linear infinite';
      setTimeout(() => {
        document.body.style.animation = '';
        rainbowActive = false;
      }, 5000);
    }
  });
})();