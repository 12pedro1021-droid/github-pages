/* ═══════════════════════════════════════════════════
   PEDRO HENRIQUE — PORTFOLIO JS
   • Particles canvas background
   • Custom cursor
   • Typed text effect
   • Navbar scroll behaviour
   • Mobile menu toggle
   • Scroll-reveal (IntersectionObserver)
   • Skill bar animations
═══════════════════════════════════════════════════ */

/* ── 1. PARTICLE CANVAS ── */
(function initParticles() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], mouseX = -9999, mouseY = -9999;

  const CONFIG = {
    count: 90,
    maxDist: 140,
    speed: 0.35,
    radius: 1.5,
    color: '0,170,255',
  };

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function mkParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * CONFIG.speed * 2,
      vy: (Math.random() - 0.5) * CONFIG.speed * 2,
      r: Math.random() * CONFIG.radius + 0.5,
      a: Math.random() * 0.5 + 0.2,
    };
  }

  function reset() {
    particles = Array.from({ length: CONFIG.count }, mkParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {
      // move
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      // mouse repulse
      const dx = p.x - mouseX, dy = p.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 80) {
        const force = (80 - dist) / 80;
        p.x += dx / dist * force * 2;
        p.y += dy / dist * force * 2;
      }

      // dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${CONFIG.color},${p.a})`;
      ctx.fill();
    });

    // lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < CONFIG.maxDist) {
          const alpha = (1 - d / CONFIG.maxDist) * 0.18;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${CONFIG.color},${alpha})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); reset(); });
  window.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

  resize();
  reset();
  draw();
})();


/* ── 2. CUSTOM CURSOR ── */
(function initCursor() {
  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  let rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    dot.style.left  = e.clientX + 'px';
    dot.style.top   = e.clientY + 'px';

    // ring lags behind
    rx += (e.clientX - rx) * 0.18;
    ry += (e.clientY - ry) * 0.18;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
  });

  function lerp() {
    rx += (parseFloat(dot.style.left) - rx) * 0.15;
    ry += (parseFloat(dot.style.top)  - ry) * 0.15;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(lerp);
  }
  lerp();

  document.addEventListener('mouseenter', () => { dot.style.opacity = 1; ring.style.opacity = 1; });
  document.addEventListener('mouseleave', () => { dot.style.opacity = 0; ring.style.opacity = 0; });

  // scale ring on hover of interactive elements
  document.querySelectorAll('a, button, .project-card, .comp-card, .about-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.transform = 'translate(-50%,-50%) scale(1.8)';
      ring.style.borderColor = 'rgba(0,170,255,0.8)';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.transform = 'translate(-50%,-50%) scale(1)';
      ring.style.borderColor = 'rgba(0,170,255,0.5)';
    });
  });
})();


/* ── 3. TYPED TEXT ── */
(function initTyped() {
  const el = document.getElementById('typedText');
  if (!el) return;

  const phrases = [
    'Desenvolvedor em formação',
    'Entusiasta de IA',
    'Criador de Soluções Web',
    'Pensador Digital',
  ];

  let pIdx = 0, cIdx = 0, deleting = false;

  function type() {
    const current = phrases[pIdx];
    el.textContent = deleting
      ? current.slice(0, cIdx--)
      : current.slice(0, cIdx++);

    let delay = deleting ? 55 : 95;

    if (!deleting && cIdx > current.length) {
      delay = 2200;
      deleting = true;
    } else if (deleting && cIdx < 0) {
      deleting = false;
      cIdx = 0;
      pIdx = (pIdx + 1) % phrases.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }

  type();
})();


/* ── 4. NAVBAR SCROLL ── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // active link highlight
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    links.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === '#' + current);
    });
  }, { passive: true });
})();


/* ── 5. MOBILE MENU ── */
(function initMenu() {
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
  });

  links.querySelectorAll('.nav-link').forEach(l => {
    l.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('open');
    });
  });
})();


/* ── 6. SCROLL REVEAL ── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => obs.observe(el));
})();


/* ── 7. SKILL BARS ── */
(function initSkills() {
  const fills = document.querySelectorAll('.skill-fill');
  if (!fills.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target.dataset.target;
        entry.target.style.width = target + '%';
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  fills.forEach(f => obs.observe(f));
})();


/* ── 8. SMOOTH ANCHOR SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 68; // navbar height
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
