if (typeof Lenis !== "undefined") {
  const lenis = new Lenis({
    duration: 2.5,
    easing: t => 1 - Math.pow(1 - t, 4),
    smoothWheel: true,
    smoothTouch: true,
    wheelMultiplier: 1.2,
    touchMultiplier: 2
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
  
  toggleBtn.style.transform = 'scale(0.9)';
  setTimeout(() => {
    toggleBtn.style.transform = 'scale(1)';
  }, 150);
});

const typewriter = document.getElementById('typewriter');
const words = ['developer.', 'gamer.', 'learner.', 'creator.'];
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
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      
      if (entry.target.id === 'stats') {
        animateStats();
      }
      
      if (entry.target.id === 'services') {
        animateServiceCards();
      }
      
      if (entry.target.id === 'projects') {
        animateProjectCards();
      }
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

sections.forEach(section => {
  sectionObserver.observe(section);
});

function animateStats() {
  const stats = document.querySelectorAll('.stat-number');
  stats.forEach((stat, i) => {
    setTimeout(() => {
      const final = stat.textContent;
      const target = parseInt(final);
      let current = 0;
      const step = target / 50;
      
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          stat.textContent = final;
          clearInterval(timer);
        } else {
          stat.textContent = Math.floor(current) + (final.includes('+') ? '+' : '');
        }
      }, 50);
    }, i * 200);
  });
}

// Animate service cards
function animateServiceCards() {
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
    }, i * 150);
  });
}

function animateProjectCards() {
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
    }, i * 200);
  });
}
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
      if (section.id) {
        const correspondingLink = document.querySelector(`a[href="#${section.id}"]`);
        if (correspondingLink) {
          correspondingLink.classList.add('active');
        }
      }
    }
  });
});

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
    
    // Success animation
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

// Enhanced hover effects for service cards
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-8px) scale(1.02)';
  });
  
  card.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0) scale(1)';
  });
});

// Enhanced hover effects for project cards
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-8px) scale(1.02)';
  });
  
  card.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0) scale(1)';
  });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.style.transform = `translateY(${scrolled * 0.5}px)`;
  }
});


(() => {
  'use strict';

  const wrapper = document.querySelector('.header-hero-wrapper');
  if (!wrapper) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'cursor-glow';
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

  // Vibrant color palette
  const colors = [
    { r: 168, g: 108, b: 209, a: 0.3 }, // purple
    { r: 255, g: 78, b: 205, a: 0.25 },  // magenta
    { r: 94, g: 234, b: 212, a: 0.2 },   // cyan
    { r: 96, g: 165, b: 250, a: 0.15 }   // blue
  ];

  const mouse = { x: w / 2, y: h / 2, inside: false };
  const target = { x: mouse.x, y: mouse.y };
  let time = 0;

  wrapper.addEventListener('mousemove', e => {
    const r = wrapper.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
    mouse.inside = true;
  });
  wrapper.addEventListener('mouseleave', () => (mouse.inside = false));

  function step() {
    time += 0.016; // 60fps

    const mx = mouse.inside ? mouse.x : w * 0.5;
    const my = mouse.inside ? mouse.y : h * 0.5;
    
    // Smooth cursor following
    target.x += (mx - target.x) * 0.1;
    target.y += (my - target.y) * 0.1;

    ctx.clearRect(0, 0, w, h);

    if (mouse.inside) {
      // Draw multiple layered orbs with different colors
      colors.forEach((color, index) => {
        const size = 80 + index * 40; // Different sizes for each layer
        const pulse = Math.sin(time * 2 + index) * 0.1 + 0.9; // Subtle pulsing
        const currentSize = size * pulse;
        
        // Create radial gradient for each orb
        const gradient = ctx.createRadialGradient(
          target.x, target.y, 0,
          target.x, target.y, currentSize
        );
        
        gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`);
        gradient.addColorStop(0.6, `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a * 0.5})`);
        gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(target.x, target.y, currentSize, 0, Math.PI * 2);
        ctx.fill();
      });

      // Add subtle sparkles around the orb
      for (let i = 0; i < 6; i++) {
        const angle = (time * 0.5 + i * Math.PI / 3) % (Math.PI * 2);
        const distance = 60 + Math.sin(time * 3 + i) * 10;
        const sparkleX = target.x + Math.cos(angle) * distance;
        const sparkleY = target.y + Math.sin(angle) * distance;
        const sparkleSize = 2 + Math.sin(time * 4 + i) * 1;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + Math.sin(time * 2 + i) * 0.2})`;
        ctx.beginPath();
        ctx.arc(sparkleX, sparkleY, sparkleSize, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
})();

const particleColors = [
  'rgba(168, 108, 209, 0.4)',
  'rgba(255, 78, 205, 0.4)',
  'rgba(94, 234, 212, 0.4)',
  'rgba(96, 165, 250, 0.4)'
];


(function createParticles() {
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