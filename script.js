/* =========================================================
   PAVAN B C — PORTFOLIO  |  script.js
   ========================================================= */

// ── HERO INITIALIZATION ─────────────────────────────────────
(function initHero() {
  function revealHero() {
    const heroCenter = document.querySelector('.hero-center');
    if (heroCenter) heroCenter.classList.add('revealed');

    // Scramble decode the name words
    setTimeout(() => {
      document.querySelectorAll('.scramble-word').forEach((word, i) => {
        const target = word.getAttribute('data-target');
        if (target) setTimeout(() => scrambleDecode(word, target, 1100), i * 300);
      });
    }, 200);

    // Animate XP bar fill
    setTimeout(animateXPBar, 800);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', revealHero);
  } else {
    revealHero();
  }
})();

// ── STARFIELD Canvas (Depth Parallax on Mouse Move) ───────
(function initStarfield() {
  const canvas = document.getElementById('star-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;
  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Generate 3 layers of stars with depth (z: 0.5 to 2.5)
  const STAR_COUNT = 150;
  const stars = Array.from({ length: STAR_COUNT }, () => ({
    x: (Math.random() - 0.5) * (window.innerWidth + 400),
    y: (Math.random() - 0.5) * (window.innerHeight + 400),
    z: Math.random() * 2 + 0.5, // depth layer
    r: Math.random() * 1.5 + 0.6,
    alpha: Math.random() * 0.7 + 0.3,
    twinklePhase: Math.random() * Math.PI * 2,
    color: Math.random() > 0.3 ? '245, 158, 11' : (Math.random() > 0.5 ? '251, 146, 60' : '254, 243, 199')
  }));

  let mouseX = 0, mouseY = 0;
  let targetMouseX = 0, targetMouseY = 0;

  window.addEventListener('mousemove', (e) => {
    targetMouseX = (e.clientX / window.innerWidth - 0.5) * 70;
    targetMouseY = (e.clientY / window.innerHeight - 0.5) * 70;
  });

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Smooth lerp for parallax
    mouseX += (targetMouseX - mouseX) * 0.06;
    mouseY += (targetMouseY - mouseY) * 0.06;

    const cx = width / 2;
    const cy = height / 2;
    const t = Date.now() * 0.001;

    stars.forEach(star => {
      // Depth parallax offset
      const px = cx + star.x + (mouseX * star.z);
      const py = cy + star.y + (mouseY * star.z);

      if (px < -20 || px > width + 20 || py < -20 || py > height + 20) return;

      const twinkle = 0.5 + 0.5 * Math.sin(t * 2.5 + star.twinklePhase);
      const currentAlpha = star.alpha * (0.6 + 0.4 * twinkle);

      ctx.beginPath();
      ctx.arc(px, py, star.r * star.z * 0.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${star.color}, ${currentAlpha})`;
      if (star.z > 1.8) {
        ctx.shadowColor = `rgba(${star.color}, 0.8)`;
        ctx.shadowBlur = 8;
      }
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    requestAnimationFrame(draw);
  }
  draw();
})();

// ── SCRAMBLE DECODE Name Animation ────────────────────────
function scrambleDecode(element, finalText, duration = 1200) {
  if (!element || !finalText) return;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  const len   = finalText.length;
  let  frame  = 0;
  const totalFrames = Math.ceil(duration / 40);

  const raf = setInterval(() => {
    let display = '';
    for (let i = 0; i < len; i++) {
      const progress = frame / totalFrames;
      const revealAt = i / len;
      if (progress > revealAt + 0.15) {
        // Fully decoded
        display += finalText[i];
      } else if (progress > revealAt) {
        // Decoding — show random char
        display += finalText[i] === ' ' ? ' ' : chars[Math.floor(Math.random() * chars.length)];
      } else {
        // Not started — show scramble
        display += finalText[i] === ' ' ? ' ' : chars[Math.floor(Math.random() * chars.length)];
      }
    }
    element.setAttribute('data-text', display);
    element.textContent = display;
    frame++;
    if (frame > totalFrames) {
      clearInterval(raf);
      element.textContent = finalText;
    }
  }, 40);
}

// ── Parallax Photo Float on Scroll ────────────────────────
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const bgImg   = document.querySelector('.hero-bg-img');
  if (bgImg && scrollY < window.innerHeight) {
    bgImg.style.transform = `scale(1.04) translateY(${scrollY * 0.25}px)`;
  }
}, { passive: true });

// ── XP Bar Animated Fill ──────────────────────────────────
function animateXPBar() {
  const fill = document.getElementById('xp-fill');
  if (fill) {
    setTimeout(() => { fill.style.width = '74%'; }, 200);
  }
}



// ── Navbar scroll effect ─────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
  updateActiveNavLink();
});

// ── Mobile menu toggle ───────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ── Active nav link highlight ────────────────────────────
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 140) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

// ── Typewriter effect ─────────────────────────────────────
const phrases = [
  'Student Developer 🎓',
  'Python Enthusiast 🐍',
  'Agentic AI Developer 🤖',
  'C++ Problem Solver ⚡',
  'Open Source Fan 🌍',
];
const el = document.getElementById('typewriter');
let pIdx = 0, cIdx = 0, deleting = false;

function typeWriter() {
  const phrase = phrases[pIdx];
  if (!deleting) {
    el.textContent = phrase.substring(0, cIdx + 1);
    cIdx++;
    if (cIdx === phrase.length) {
      deleting = true;
      setTimeout(typeWriter, 1800);
      return;
    }
  } else {
    el.textContent = phrase.substring(0, cIdx - 1);
    cIdx--;
    if (cIdx === 0) {
      deleting = false;
      pIdx = (pIdx + 1) % phrases.length;
    }
  }
  setTimeout(typeWriter, deleting ? 50 : 90);
}
setTimeout(typeWriter, 1200);


// ── INTERACTIVE IDE CODE VIEWER ───────────────────────────
(function initIdeViewer() {
  const codeFiles = {
    'developer.py': `<span class="c-kw">class</span> <span class="c-cls">Developer</span>:
    <span class="c-kw">def</span> <span class="c-fn">__init__</span>(<span class="c-self">self</span>):
        <span class="c-self">self</span>.name     = <span class="c-str">"Pavan B C"</span>
        <span class="c-self">self</span>.role     = <span class="c-str">"Student Developer"</span>
        <span class="c-self">self</span>.college  = <span class="c-str">"Dayananda Sagar Institutions"</span>
        <span class="c-self">self</span>.location = <span class="c-str">"Bengaluru, India"</span>
        <span class="c-self">self</span>.stack    = [<span class="c-str">"Python"</span>, <span class="c-str">"C++"</span>, <span class="c-str">"Agentic AI"</span>]
        <span class="c-self">self</span>.focus    = <span class="c-str">"Autonomous AI &amp; Software Systems"</span>

    <span class="c-kw">def</span> <span class="c-fn">get_status</span>(<span class="c-self">self</span>):
        <span class="c-kw">return</span> <span class="c-str">"🟢 Ready to build &amp; collaborate"</span>

<span class="c-cmt"># Instance initialization</span>
pavan = <span class="c-cls">Developer</span>()
<span class="c-fn">print</span>(pavan.<span class="c-fn">get_status</span>())`,

    'skills.json': `{
  <span class="c-cls">"developer"</span>: <span class="c-str">"Pavan B C"</span>,
  <span class="c-cls">"languages"</span>: [<span class="c-str">"Python"</span>, <span class="c-str">"C"</span>, <span class="c-str">"C++"</span>],
  <span class="c-cls">"ai_stack"</span>: {
    <span class="c-cls">"frameworks"</span>: [<span class="c-str">"LangChain"</span>, <span class="c-str">"Groq API"</span>, <span class="c-str">"CrewAI"</span>],
    <span class="c-cls">"models"</span>: [<span class="c-str">"Llama 3.3 70B"</span>, <span class="c-str">"Gemini Flash"</span>]
  },
  <span class="c-cls">"tools"</span>: [<span class="c-str">"Git"</span>, <span class="c-str">"GitHub"</span>, <span class="c-str">"VS Code"</span>, <span class="c-str">"Linux"</span>],
  <span class="c-cls">"certifications"</span>: <span class="c-kw">5</span>
}`,

    'ai_agent.py': `<span class="c-kw">from</span> groq <span class="c-kw">import</span> Groq

<span class="c-kw">class</span> <span class="c-cls">NewsDigestAgent</span>:
    <span class="c-kw">def</span> <span class="c-fn">__init__</span>(<span class="c-self">self</span>):
        <span class="c-self">self</span>.model = <span class="c-str">"llama-3.3-70b-versatile"</span>
        <span class="c-self">self</span>.client = <span class="c-fn">Groq</span>()

    <span class="c-kw">async def</span> <span class="c-fn">summarize_feed</span>(<span class="c-self">self</span>, topics):
        <span class="c-cmt"># Fetch real-time trends & synthesize briefings</span>
        response = <span class="c-kw">await</span> <span class="c-self">self</span>.client.chat.<span class="c-fn">create</span>(
            model=<span class="c-self">self</span>.model,
            messages=[{<span class="c-str">"role"</span>: <span class="c-str">"user"</span>, <span class="c-str">"content"</span>: f<span class="c-str">"Digest: {topics}"</span>}]
        )
        <span class="c-kw">return</span> response.choices[<span class="c-kw">0</span>].message.content`
  };

  if (codeContainer && codeFiles['developer.py']) {
    codeContainer.innerHTML = codeFiles['developer.py'];
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filename = tab.getAttribute('data-file');
      if (codeFiles[filename] && codeContainer) {
        codeContainer.style.opacity = '0';
        codeContainer.style.transform = 'translateY(4px)';
        setTimeout(() => {
          codeContainer.innerHTML = codeFiles[filename];
          codeContainer.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
          codeContainer.style.opacity = '1';
          codeContainer.style.transform = 'translateY(0)';
        }, 120);
      }
    });
  });
})();

// ── SCROLL REVEAL — Tech Zoom & Rim Flash ─────────────────
const revealEls = document.querySelectorAll(
  '.about-grid, .section-title, .section-subtitle, .section-tag, ' +
  '.skill-card, .project-card, .cert-card, .resume-card, .contact-wrap, .footer-inner, .timeline-item'
);
revealEls.forEach(el => el.classList.add('reveal', 'visible'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible', 'rim-flash');
      if (entry.target.classList.contains('skill-card')) {
        entry.target.classList.add('animate');
      }
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.05, rootMargin: '50px 0px 50px 0px' });

revealEls.forEach(el => observer.observe(el));




// ── Contact Form Direct Email Dispatcher ──────────────────
const form        = document.getElementById('contact-form');
const deliveryBox = document.getElementById('form-delivery-box');
const gmailBtn    = document.getElementById('send-via-gmail-btn');
const copyBtn     = document.getElementById('copy-msg-btn');
const copyToast   = document.getElementById('copy-toast');
const quickCopyBtn = document.getElementById('quick-copy-email-btn');

// Quick copy email address button on contact card
if (quickCopyBtn) {
  quickCopyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText('pavanbc31@gmail.com').then(() => {
      quickCopyBtn.innerHTML = '<span>✓ Copied Address!</span>';
      setTimeout(() => {
        quickCopyBtn.innerHTML = '<span>📋 Copy Address</span>';
      }, 2500);
    });
  });
}

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInp    = document.getElementById('cf-name');
    const emailInp   = document.getElementById('cf-email');
    const subjectInp = document.getElementById('cf-subject');
    const messageInp = document.getElementById('cf-message');

    const name    = nameInp ? nameInp.value.trim() : '';
    const email   = emailInp ? emailInp.value.trim() : '';
    const subject = (subjectInp && subjectInp.value.trim()) ? subjectInp.value.trim() : `Portfolio Message from ${name}`;
    const rawMsg  = messageInp ? messageInp.value.trim() : '';

    // Validation
    let hasError = false;
    [nameInp, emailInp, messageInp].forEach(inp => {
      if (inp && !inp.value.trim()) {
        inp.style.borderColor = '#f87171';
        setTimeout(() => inp.style.borderColor = '', 2500);
        hasError = true;
      }
    });
    if (hasError) return;

    // Build the formatted email body
    const emailBody = `Hi Pavan,\n\n${rawMsg}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n👤 Sender: ${name}\n📧 Reply-To: ${email}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    // Gmail Web direct link (Browser tab)
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=pavanbc31@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;

    // Set URL on Gmail button
    if (gmailBtn) gmailBtn.setAttribute('href', gmailUrl);

    // Show delivery box
    if (deliveryBox) {
      deliveryBox.style.display = 'block';
      deliveryBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Open Gmail directly in a new tab
    window.open(gmailUrl, '_blank');
  });

  // 1-Click Copy Message & Email to clipboard
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const nameInp    = document.getElementById('cf-name');
      const emailInp   = document.getElementById('cf-email');
      const subjectInp = document.getElementById('cf-subject');
      const messageInp = document.getElementById('cf-message');

      const name    = nameInp ? nameInp.value.trim() : 'Visitor';
      const email   = emailInp ? emailInp.value.trim() : '';
      const subject = (subjectInp && subjectInp.value.trim()) ? subjectInp.value.trim() : 'Portfolio Inquiry';
      const rawMsg  = messageInp ? messageInp.value.trim() : '';

      const textToCopy = `To: pavanbc31@gmail.com\nSubject: ${subject}\n\nHi Pavan,\n\n${rawMsg}\n\n— ${name} (${email})`;

      navigator.clipboard.writeText(textToCopy).then(() => {
        if (copyToast) {
          copyToast.style.display = 'block';
          setTimeout(() => copyToast.style.display = 'none', 3000);
        }
      });
    });
  }
}

// ── Project card tilt effect ─────────────────────────────
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-6px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ── Page Load Progress Bar ────────────────────────────────
const loadBar = document.getElementById('page-load-bar');
if (loadBar) {
  let w = 0;
  const grow = setInterval(() => {
    w += Math.random() * 18;
    if (w >= 90) { clearInterval(grow); }
    loadBar.style.width = Math.min(w, 90) + '%';
  }, 80);
  window.addEventListener('load', () => {
    clearInterval(grow);
    loadBar.style.width = '100%';
    setTimeout(() => {
      loadBar.style.opacity = '0';
      setTimeout(() => loadBar.remove(), 500);
    }, 400);
  });
}

// ── Custom Cursor (Smooth Lerp Follow) ────────────────────
const cursorGlow = document.getElementById('cursor-glow');
const cursorDot  = document.getElementById('cursor-dot');
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let glowX  = mouseX, glowY = mouseY;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (cursorDot) {
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top  = mouseY + 'px';
  }
});

(function lerpGlow() {
  glowX += (mouseX - glowX) * 0.08;
  glowY += (mouseY - glowY) * 0.08;
  if (cursorGlow) {
    cursorGlow.style.left = glowX + 'px';
    cursorGlow.style.top  = glowY + 'px';
  }
  requestAnimationFrame(lerpGlow);
})();

// Hide cursor elements on mobile
if ('ontouchstart' in window) {
  if (cursorGlow) cursorGlow.style.display = 'none';
  if (cursorDot)  cursorDot.style.display  = 'none';
}

// ── Animated Stat Counters ────────────────────────────────
function animateCounter(el, target, suffix = '') {
  const duration = 1400;
  const start = performance.now();
  const isInfinity = target === '∞';
  if (isInfinity) return; // keep as-is
  const num = parseInt(target);
  const hasPlusSign = typeof target === 'string' && target.includes('+');

  (function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = Math.round(eased * num);
    el.textContent = current + (hasPlusSign ? '+' : '') + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  })(start);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const numEl = entry.target.querySelector('.stat-num');
      if (numEl && !numEl.dataset.counted) {
        numEl.dataset.counted = 'true';
        const raw = numEl.textContent.trim();
        if (raw !== '∞') {
          const num = parseInt(raw);
          animateCounter(numEl, raw);
        }
      }
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-card').forEach(card => statObserver.observe(card));

// ── Button Ripple Effect ──────────────────────────────────
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top  = (e.clientY - rect.top  - size / 2) + 'px';
    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});

// ── Staggered Card Scroll Reveal ─────────────────────────
const staggerObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const parent = entry.target;
      const children = parent.querySelectorAll(':scope > *');
      children.forEach((child, i) => {
        child.style.transitionDelay = `${i * 0.1}s`;
        child.classList.add('reveal', 'visible');
      });
      staggerObserver.unobserve(parent);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.projects-grid, .skills-grid, .about-highlights, .about-stats')
  .forEach(grid => staggerObserver.observe(grid));

// ── Smooth section entrance (fade + slide up) ─────────────
const sectionTitleObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.2 });
document.querySelectorAll('.section-tag, .section-title, .section-subtitle')
  .forEach(el => {
    el.classList.add('reveal');
    sectionTitleObserver.observe(el);
  });

// ── SVG Circular Ring Animation ───────────────────────────
const CIRCUMFERENCE = 2 * Math.PI * 50; // r=50 → ~314.16

function animateRing(card) {
  const pct     = parseInt(card.dataset.percent) || 0;
  const color   = card.dataset.skillColor || 'var(--accent)';
  const ring    = card.querySelector('.ring-progress');
  const glow    = card.querySelector('.skill-card-glow');
  const icon    = card.querySelector('.skill-center-icon');

  if (!ring) return;

  // Inject per-skill color as CSS var and on the ring stroke
  card.style.setProperty('--skill-color', color);
  ring.style.stroke = color;
  ring.style.filter = `drop-shadow(0 0 6px ${color})`;
  if (icon) icon.style.color = color;

  // Animate dashoffset from full (hidden) → target
  const targetOffset = CIRCUMFERENCE * (1 - pct / 100);
  setTimeout(() => {
    ring.style.strokeDashoffset = targetOffset;
  }, 100);
}

const ringObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, idx) => {
    if (entry.isIntersecting && !entry.target.dataset.ringDone) {
      entry.target.dataset.ringDone = 'true';
      setTimeout(() => animateRing(entry.target), idx * 120);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-card[data-percent]').forEach(card => {
  ringObserver.observe(card);
  // Set skill-color CSS var immediately so glow is ready
  const color = card.dataset.skillColor || 'var(--accent)';
  card.style.setProperty('--skill-color', color);
});

// ── Section Smooth Transition Observer ────────────────────
const sectionVisObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('section-visible');
    }
  });
}, { threshold: 0.08 });

// Hero section is always visible immediately
const heroSection = document.getElementById('home');
if (heroSection) heroSection.classList.add('section-visible');

// Observe all other sections
document.querySelectorAll('section:not(#home)').forEach(sec => {
  sectionVisObserver.observe(sec);
});

// Also make nav + footer always visible
const navEl = document.getElementById('navbar');
const footerEl = document.querySelector('.footer');
if (navEl)    navEl.style.cssText += 'opacity:1;transform:none;';
if (footerEl) {
  footerEl.style.opacity = '1';
  footerEl.style.transform = 'none';
}

// ── Interactive Resume Modal Logic ────────────────────────
(function initResumeModal() {
  const modal         = document.getElementById('resume-modal');
  const openBtn       = document.getElementById('open-resume-modal-btn');
  const heroResumeBtn = document.getElementById('hero-resume-trigger');
  const closeBtn      = document.getElementById('close-resume-modal-btn');

  if (!modal) return;

  function openModal() {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (openBtn)       openBtn.addEventListener('click', openModal);
  if (heroResumeBtn) heroResumeBtn.addEventListener('click', openModal);
  if (closeBtn)      closeBtn.addEventListener('click', closeModal);

  // Close on backdrop click outside the window
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Close on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
})();

