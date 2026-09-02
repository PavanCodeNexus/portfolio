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
  const tabs          = document.querySelectorAll('.ide-tab');
  const codeContainer = document.getElementById('ide-code-content');
  const fileTypeLabel = document.getElementById('ide-file-type');

  const fileTypeMap = {
    'developer.py': 'Python 3.12 · UTF-8 · Spaces: 4',
    'skills.json':  'JSON · UTF-8 · Spaces: 2',
    'ai_agent.py':  'Python 3.12 · UTF-8 · Spaces: 4'
  };

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
      if (fileTypeLabel && fileTypeMap[filename]) {
        fileTypeLabel.textContent = fileTypeMap[filename];
      }
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


// ── SCROLL REVEAL & STAGGERED FRAME TRANSITIONS ──────────
const revealElements = document.querySelectorAll(
  '.about-grid, .section-title, .section-subtitle, .section-tag, ' +
  '.skill-card-modern, .project-card, .cert-card, .resume-card, .contact-wrap, .timeline-card, .bento-card'
);

revealElements.forEach(el => el.classList.add('reveal-frame'));

const frameScrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      frameScrollObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

revealElements.forEach(el => frameScrollObserver.observe(el));

// Fallback: Ensure everything is revealed after 2 seconds
setTimeout(() => {
  revealElements.forEach(el => el.classList.add('revealed'));
}, 2000);

// ── Active Navbar Link Highlighting on Scroll ─────────────
const navSections = document.querySelectorAll('section[id]');
const navLinkItems = document.querySelectorAll('.kage-nav-links a');

window.addEventListener('scroll', () => {
  let currentSec = '';
  const scrollPos = window.pageYOffset + 200;

  navSections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    if (scrollPos >= top && scrollPos < top + height) {
      currentSec = section.getAttribute('id');
    }
  });

  navLinkItems.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSec}`) {
      link.classList.add('active');
    }
  });
});




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
  const navResumeBtn  = document.getElementById('nav-resume-trigger');
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
  if (navResumeBtn)  navResumeBtn.addEventListener('click', openModal);
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

// =========================================================
// THREE.JS 3D WEBGL AMBIENT NEURAL CONSTELLATION & AI CORE
// =========================================================
(function init3DWebGLScene() {
  const canvas = document.getElementById('webgl-3d-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  // Scene & Camera
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
  camera.position.z = 320;

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // 1. 3D Particle Constellation (Neural Swarm)
  const particleCount = 750;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const colorAmber = new THREE.Color(0xF59E0B);
  const colorCyan  = new THREE.Color(0x38BDF8);
  const colorWhite = new THREE.Color(0xFFFFFF);

  for (let i = 0; i < particleCount; i++) {
    // Spherical / Cloud Distribution
    const radius = 180 + Math.random() * 260;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);

    positions[i * 3]     = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);

    // Dynamic Palette
    const randColor = Math.random();
    const c = randColor > 0.6 ? colorAmber : (randColor > 0.25 ? colorCyan : colorWhite);
    colors[i * 3]     = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  // Create subtle circular particle texture
  const particleCanvas = document.createElement('canvas');
  particleCanvas.width = 32;
  particleCanvas.height = 32;
  const pCtx = particleCanvas.getContext('2d');
  const grad = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.3, 'rgba(245,158,11,0.8)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  pCtx.fillStyle = grad;
  pCtx.fillRect(0, 0, 32, 32);
  const particleTexture = new THREE.CanvasTexture(particleCanvas);

  const particleMaterial = new THREE.PointsMaterial({
    size: 4.5,
    vertexColors: true,
    map: particleTexture,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const particleSystem = new THREE.Points(geometry, particleMaterial);
  scene.add(particleSystem);

  // Mouse Interaction & LERP Damping

  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;
  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - windowHalfX) * 0.12;
    mouseY = (e.clientY - windowHalfY) * 0.12;
  });

  // Scroll Tracking for 3D Camera Travel
  let scrollProgress = 0;
  window.addEventListener('scroll', () => {
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    scrollProgress = maxScroll > 0 ? window.pageYOffset / maxScroll : 0;
  });

  // 3D Camera Warp Speed State
  let isWarping = false;
  let warpFactor = 1.0;
  let targetFOV = 60;

  window.trigger3DCameraWarp = function() {
    isWarping = true;
    warpFactor = 9.0;
    targetFOV = 82;

    setTimeout(() => {
      warpFactor = 1.0;
      targetFOV = 60;
      setTimeout(() => {
        isWarping = false;
      }, 500);
    }, 450);
  };

  // Resize Handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Animation Loop (60fps with Visibility Check)
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    if (document.hidden) return;

    const elapsedTime = clock.getElapsedTime();
    const delta = clock.getDelta();

    // Smooth Mouse Physics (LERP)
    targetX += (mouseX - targetX) * 0.04;
    targetY += (mouseY - targetY) * 0.04;

    // FOV Warp LERP
    if (Math.abs(camera.fov - targetFOV) > 0.1) {
      camera.fov += (targetFOV - camera.fov) * 0.08;
      camera.updateProjectionMatrix();
    }

    // Rotate Particles with Warp Multiplier
    const currentSpeed = (isWarping ? warpFactor : 1.0);
    particleSystem.rotation.y += (0.0015 * currentSpeed) + (targetX * 0.0001);
    particleSystem.rotation.x += (0.0008 * currentSpeed) + (targetY * 0.0001);

    // Particle Scale pulse during warp
    if (isWarping) {
      particleSystem.scale.set(1.15, 1.15, 1.15);
    } else {
      particleSystem.scale.lerp(new THREE.Vector3(1, 1, 1), 0.05);
    }

    // Scroll-Linked Camera Gliding

    camera.position.x = targetX * 0.4;
    camera.position.y = -targetY * 0.4 - (scrollProgress * 60);
    camera.position.z = 320 - (scrollProgress * 80);
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  animate();
})();

// =========================================================
// CINEMATIC 3D WARP SMOOTH SECTION NAVIGATION
// =========================================================
(function initCinematicNav() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();

      // Trigger 3D Camera Warp
      if (window.trigger3DCameraWarp) {
        window.trigger3DCameraWarp();
      }

      // Smooth scroll to section
      const headerOffset = 70;
      const elementPosition = targetEl.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Close mobile menu if open
      const mobileMenu = document.getElementById('mobile-menu');
      if (mobileMenu) mobileMenu.classList.remove('open');

      // Add arrival frame shutter flash on target section
      setTimeout(() => {
        targetEl.classList.remove('rim-flash');
        void targetEl.offsetWidth; // trigger reflow
        targetEl.classList.add('rim-flash');
      }, 500);
    });
  });
})();


// =========================================================
// SPATIAL 3D CARD TILT & SPECULAR GLARE ENGINE
// =========================================================
(function initSpatial3DTilt() {
  const tiltCards = document.querySelectorAll(
    '[data-tilt-3d], .skill-card-modern, .project-card, .cert-card, .stat-card, .timeline-card, .hero-left-cockpit, .hero-right-cockpit .ide-window'
  );

  tiltCards.forEach(card => {
    // Invert if already exists
    if (!card.querySelector('.card-3d-glare')) {
      const glare = document.createElement('div');
      glare.className = 'card-3d-glare';
      card.appendChild(glare);
    }

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within card
      const y = e.clientY - rect.top;  // y position within card

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Max tilt angle (degrees)
      const maxTilt = 9;
      const rotateX = ((y - centerY) / centerY) * -maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;

      // Specular glare position percentage
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
      card.style.setProperty('--glare-x', `${glareX}%`);
      card.style.setProperty('--glare-y', `${glareY}%`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      card.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'none'; // Instant responsiveness while hovering
    });
  });
})();

// =========================================================
// CYBER HOLOGRAPHIC WARP PORTAL COUNTDOWN REDIRECT
// =========================================================
(function initWarpPortalModal() {
  const modal = document.getElementById('warp-portal-modal');
  if (!modal) return;

  const closeBtn       = document.getElementById('warp-close-btn');
  const cancelBtn      = document.getElementById('warp-cancel-btn');
  const launchBtn      = document.getElementById('warp-instant-launch-btn');
  const digitEl        = document.getElementById('warp-countdown-digit');
  const circleEl       = document.getElementById('warp-progress-circle');
  const targetTitleEl  = document.getElementById('warp-target-title');
  const targetUrlEl    = document.getElementById('warp-target-url');

  let activeUrl = '';
  let countdownTimer = null;
  let remainingSeconds = 3;
  const totalCircleStroke = 326;

  function openPortal(url, title) {
    activeUrl = url;
    remainingSeconds = 3;

    if (targetTitleEl) targetTitleEl.textContent = title || 'External Platform Redirect';
    if (targetUrlEl) targetUrlEl.textContent = url;
    if (digitEl) digitEl.textContent = '3';
    if (circleEl) circleEl.style.strokeDashoffset = '0';

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Trigger 3D Camera Warp in background
    if (window.trigger3DCameraWarp) {
      window.trigger3DCameraWarp();
    }

    startCountdown();
  }

  function closePortal() {
    if (countdownTimer) clearInterval(countdownTimer);
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function launchDestination() {
    if (countdownTimer) clearInterval(countdownTimer);
    if (activeUrl) {
      window.open(activeUrl, '_blank', 'noopener,noreferrer');
    }
    setTimeout(closePortal, 250);
  }

  function startCountdown() {
    if (countdownTimer) clearInterval(countdownTimer);

    countdownTimer = setInterval(() => {
      remainingSeconds -= 1;

      if (remainingSeconds > 0) {
        if (digitEl) digitEl.textContent = remainingSeconds;
        if (circleEl) {
          const offset = totalCircleStroke * (1 - remainingSeconds / 3);
          circleEl.style.strokeDashoffset = offset;
        }
      } else if (remainingSeconds === 0) {
        if (digitEl) digitEl.textContent = '🚀';
        if (circleEl) circleEl.style.strokeDashoffset = totalCircleStroke;
        setTimeout(launchDestination, 300);
      }
    }, 1000);
  }

  // Intercept all external hyperlinks
  document.querySelectorAll('a[href^="http"]').forEach(link => {
    const href = link.getAttribute('href');
    if (href && !href.includes('#')) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const customTitle = link.getAttribute('title') || 
                            link.getAttribute('aria-label') || 
                            link.closest('.project-card')?.querySelector('.project-title')?.textContent ||
                            'Secure Destination';
        openPortal(href, customTitle);
      });
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', closePortal);
  if (cancelBtn) cancelBtn.addEventListener('click', closePortal);
  if (launchBtn) launchBtn.addEventListener('click', launchDestination);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closePortal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closePortal();
    }
  });
})();



