/* ══════════════════════════════════════════════════════════
   Doron Linton Prince — portfolio interactions
   Vanilla JS, no dependencies.
   ══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ═══════════ PROJECT DATA ═══════════
     Baked in at build time rather than fetched from the GitHub API —
     unauthenticated browser requests are rate-limited per visitor IP. */
  var PROJECTS = [
    {
      title: "KSP God's Eye",
      sub: 'Agentic RAG crime analytics',
      badge: 'Datathon 2026',
      tags: ['ai', 'fullstack'],
      desc: 'An intelligence-fusion centre that turns plain-English questions into complex SQL over FIR records and surveillance data. Built for the Karnataka State Police Datathon 2026.',
      stack: ['Next.js', 'TypeScript', 'FastAPI', 'Agentic RAG', 'xAI Grok'],
      url: 'https://github.com/doronprince/KSP-DATATHON_MEIKA_GOD-S-EYE'
    },
    {
      title: 'Aegis',
      sub: 'Fully-local AI operating assistant',
      badge: 'Private',
      priv: true,
      tags: ['ai'],
      desc: 'A desktop assistant that runs entirely on-device with no cloud inference — a Rust daemon handling model execution and system access, driven by a Flutter interface.',
      stack: ['Rust', 'Flutter', 'Local LLMs'],
      url: null
    },
    {
      title: 'NexusOps',
      sub: 'AI workforce management platform',
      tags: ['ai', 'fullstack'],
      desc: 'An agentic AI backend that lets non-technical users build, train and deploy custom agents to automate business operations. Modular, service-oriented architecture.',
      stack: ['Python', 'FastAPI', 'TensorFlow', 'Flask', 'JavaScript'],
      url: 'https://github.com/doronprince/Nexus-OPS'
    },
    {
      title: 'Meika',
      sub: 'Explainable AI finance assistant',
      badge: 'In progress',
      tags: ['ai', 'fullstack'],
      desc: 'A personal-finance MVP for students that does more than categorise spending — it explains its risk flags and budget advice. FastAPI service with a Flutter client.',
      stack: ['Python', 'FastAPI', 'SQLAlchemy', 'Flutter', 'Alembic'],
      url: 'https://github.com/doronprince/Meika_mvp'
    },
    {
      title: 'Object Tracking Drone',
      sub: 'Computer vision for rescue operations',
      tags: ['cv', 'robotics'],
      desc: 'Drone-based CCTV for real-time identification and tracking across simulated disaster sites, with a full model-training pipeline and integration into the flight controller.',
      stack: ['Python', 'OpenCV', 'C++', 'Deep learning'],
      url: 'https://github.com/doronprince/Drone_CCTV_criminal-identification-and-tracking'
    },
    {
      title: 'Scan Center System',
      sub: 'Offline-first diagnostic management',
      tags: ['ai', 'fullstack'],
      desc: 'An AI-assisted management system for diagnostic scan centres, designed to keep working when the network does not — offline-first data capture with later synchronisation.',
      stack: ['Python', 'Offline-first', 'SQLite'],
      url: 'https://github.com/doronprince/scan-center-system'
    },
    {
      title: 'Security Robot Vision',
      sub: 'ROS2 perception node',
      tags: ['cv', 'robotics'],
      desc: 'A ROS2 vision node for an autonomous security robot: YOLOv8 object detection with a fire-detection alerting path wired into the robot control graph.',
      stack: ['ROS2', 'YOLOv8', 'Python', 'OpenCV'],
      url: 'https://github.com/doronprince/ROBOT_PROGRAMING'
    },
    {
      title: 'Bipedal Walker RL',
      sub: 'Imitation-bootstrapped SAC',
      tags: ['ai'],
      desc: 'A controlled study comparing Soft Actor-Critic bootstrapped from demonstrations against SAC trained from scratch on the BipedalWalker environment.',
      stack: ['Python', 'PyTorch', 'SAC', 'Gymnasium'],
      url: 'https://github.com/doronprince/reinforcement-learning-bipedal'
    },
    {
      title: 'AR Music',
      sub: 'Gesture-controlled music generator',
      tags: ['cv', 'creative'],
      desc: 'Hand-tracking via MediaPipe mapped to a real-time synthesis engine — play and shape music in the air with no controller.',
      stack: ['Python', 'MediaPipe', 'OpenCV', 'Audio synthesis'],
      url: 'https://github.com/doronprince/ar-music'
    },
    {
      title: 'Nexus IoT Event Platform',
      sub: 'The Hunt for the Lost Algorithm',
      tags: ['fullstack', 'robotics'],
      desc: 'A gamified event website for an IoT and AI competition — puzzle progression, team scoring and live state backed by Firebase.',
      stack: ['React', 'Firebase', 'JavaScript'],
      url: 'https://github.com/doronprince/nexus-iot-event-website'
    },
    {
      title: 'Neon Heart',
      sub: 'WebGL fragment shader',
      tags: ['creative'],
      desc: 'An animated neon heart rendered entirely in a GLSL fragment shader — signed distance fields, bloom and time-driven distortion, no textures.',
      stack: ['WebGL', 'GLSL', 'JavaScript'],
      url: 'https://github.com/doronprince/neon-heart'
    },
    {
      title: 'AiDiagnose',
      sub: 'Symptom-based medical chatbot',
      tags: ['ai'],
      desc: 'An NLP pipeline that interprets free-text symptom descriptions and surfaces likely conditions, trained on structured medical record data.',
      stack: ['Python', 'Scikit-learn', 'NLTK', 'Pandas'],
      url: null
    }
  ];

  /* ═══════════ PRELOADER ═══════════ */
  (function preloader() {
    var el = $('#preloader'), bar = $('#preBar'), pct = $('#prePct');
    if (!el) return;
    var p = 0;
    var tick = setInterval(function () {
      p += Math.random() * 18 + 6;
      if (p >= 100) { p = 100; clearInterval(tick); setTimeout(done, 260); }
      if (bar) bar.style.width = p + '%';
      if (pct) pct.textContent = Math.floor(p);
    }, reduced ? 30 : 110);

    function done() {
      el.classList.add('is-done');
      document.body.classList.remove('is-locked');
      setTimeout(function () { el.remove(); }, 800);
    }
    document.body.classList.add('is-locked');
    // Hard safety net — never trap the visitor behind the loader.
    setTimeout(function () { clearInterval(tick); done(); }, 3500);
  })();

  /* ═══════════ BACKGROUND: PARTICLE CONSTELLATION ═══════════ */
  (function background() {
    var cv = $('#bgCanvas');
    if (!cv || reduced) { if (cv) cv.style.display = 'none'; return; }

    var ctx = cv.getContext('2d', { alpha: true });
    if (!ctx) { cv.style.display = 'none'; return; }

    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0, pts = [], raf = null, running = true;
    var mouse = { x: -9999, y: -9999 };

    function size() {
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = Math.floor(W * dpr);
      cv.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function seed() {
      // Density scales with viewport, hard-capped so phones stay smooth.
      var n = Math.min(Math.round((W * H) / 15000), 110);
      pts = [];
      for (var i = 0; i < n; i++) {
        pts.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - .5) * .28,
          vy: (Math.random() - .5) * .28,
          r: Math.random() * 1.5 + .5
        });
      }
    }

    function frame() {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);

      for (var i = 0; i < pts.length; i++) {
        var p = pts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;

        // gentle attraction toward the pointer
        var dx = mouse.x - p.x, dy = mouse.y - p.y;
        var md = Math.sqrt(dx * dx + dy * dy);
        if (md < 190 && md > 0) {
          p.x += (dx / md) * .32;
          p.y += (dy / md) * .32;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,229,255,.42)';
        ctx.fill();
      }

      // link nearby nodes
      for (var a = 0; a < pts.length; a++) {
        for (var b = a + 1; b < pts.length; b++) {
          var ux = pts[a].x - pts[b].x, uy = pts[a].y - pts[b].y;
          var d2 = ux * ux + uy * uy;
          if (d2 < 16900) {
            var o = (1 - Math.sqrt(d2) / 130) * .22;
            ctx.beginPath();
            ctx.moveTo(pts[a].x, pts[a].y);
            ctx.lineTo(pts[b].x, pts[b].y);
            ctx.strokeStyle = 'rgba(139,92,246,' + o + ')';
            ctx.lineWidth = .6;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(frame);
    }

    function start() { if (!running) { running = true; frame(); } }
    function stop()  { running = false; if (raf) cancelAnimationFrame(raf); }

    window.addEventListener('resize', debounce(size, 180));
    window.addEventListener('pointermove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
    window.addEventListener('pointerleave', function () { mouse.x = mouse.y = -9999; });
    // Don't burn battery in a background tab.
    document.addEventListener('visibilitychange', function () {
      document.hidden ? stop() : start();
    });

    size();
    frame();
  })();

  /* ═══════════ CUSTOM CURSOR + MAGNETIC ═══════════ */
  (function cursor() {
    var dot = $('#cursorDot'), ring = $('#cursorRing');
    if (!dot || !ring || window.matchMedia('(hover:none)').matches) return;

    var mx = 0, my = 0, rx = 0, ry = 0;

    window.addEventListener('pointermove', function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = 'translate(' + mx + 'px,' + my + 'px) translate(-50%,-50%)';
    }, { passive: true });

    (function loop() {
      rx += (mx - rx) * .16;
      ry += (my - ry) * .16;
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px) translate(-50%,-50%)';
      requestAnimationFrame(loop);
    })();

    $$('a, button, .pills span, .card').forEach(function (el) {
      el.addEventListener('pointerenter', function () { ring.classList.add('is-hot'); });
      el.addEventListener('pointerleave', function () { ring.classList.remove('is-hot'); });
    });

    if (reduced) return;
    $$('[data-magnetic]').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        el.style.transform = 'translate(' + x * .22 + 'px,' + y * .3 + 'px)';
      });
      el.addEventListener('pointerleave', function () { el.style.transform = ''; });
    });
  })();

  /* ═══════════ NAV ═══════════ */
  (function nav() {
    var bar = $('#nav'), burger = $('#burger'), links = $('#navLinks');

    window.addEventListener('scroll', function () {
      if (bar) bar.classList.toggle('is-stuck', window.scrollY > 40);
    }, { passive: true });

    if (burger && links) {
      burger.addEventListener('click', function () {
        var open = links.classList.toggle('is-open');
        burger.classList.toggle('is-open', open);
        burger.setAttribute('aria-expanded', String(open));
        document.body.classList.toggle('is-locked', open);
      });
      $$('a', links).forEach(function (a) {
        a.addEventListener('click', function () {
          links.classList.remove('is-open');
          burger.classList.remove('is-open');
          burger.setAttribute('aria-expanded', 'false');
          document.body.classList.remove('is-locked');
        });
      });
    }

    // active-section highlighting
    var navLinks = $$('[data-nav]');
    var sections = navLinks.map(function (a) { return $(a.getAttribute('href')); }).filter(Boolean);
    if ('IntersectionObserver' in window && sections.length) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          navLinks.forEach(function (a) {
            a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id);
          });
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      sections.forEach(function (s) { io.observe(s); });
    }
  })();

  /* ═══════════ SCROLL PROGRESS ═══════════ */
  (function progress() {
    var bar = $('#scrollBar');
    if (!bar) return;
    window.addEventListener('scroll', function () {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
    }, { passive: true });
  })();

  /* ═══════════ REVEAL ON SCROLL ═══════════ */
  var revealIO = null;
  if ('IntersectionObserver' in window) {
    revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en, i) {
        if (!en.isIntersecting) return;
        var el = en.target;
        setTimeout(function () { el.classList.add('is-in'); }, reduced ? 0 : i * 70);
        revealIO.unobserve(el);
      });
    }, { threshold: .12, rootMargin: '0px 0px -60px 0px' });
    $$('.reveal').forEach(function (el) { revealIO.observe(el); });
  } else {
    $$('.reveal').forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ═══════════ COUNTERS ═══════════ */
  (function counters() {
    var nodes = $$('[data-count]');
    if (!nodes.length || !('IntersectionObserver' in window)) {
      nodes.forEach(function (n) { n.textContent = n.dataset.count + (n.dataset.suffix || ''); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        var target = parseInt(el.dataset.count, 10);
        var suffix = el.dataset.suffix || '';
        if (reduced) { el.textContent = target + suffix; io.unobserve(el); return; }
        var t0 = null, dur = 1500;
        (function step(ts) {
          if (!t0) t0 = ts;
          var k = Math.min((ts - t0) / dur, 1);
          var eased = 1 - Math.pow(1 - k, 3);
          el.textContent = Math.floor(eased * target) + (k === 1 ? suffix : '');
          if (k < 1) requestAnimationFrame(step);
        })();
        io.unobserve(el);
      });
    }, { threshold: .5 });
    nodes.forEach(function (n) { io.observe(n); });
  })();

  /* ═══════════ SKILL METERS ═══════════ */
  (function meters() {
    var nodes = $$('.meter');
    if (!nodes.length) return;
    if (!('IntersectionObserver' in window)) {
      nodes.forEach(function (m) { m.style.setProperty('--lvl', m.dataset.level + '%'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var m = en.target;
        setTimeout(function () {
          m.style.setProperty('--lvl', m.dataset.level + '%');
        }, reduced ? 0 : 120);
        io.unobserve(m);
      });
    }, { threshold: .4 });
    nodes.forEach(function (m) { io.observe(m); });
  })();

  /* ═══════════ ROLE ROTATOR ═══════════ */
  (function rotator() {
    var box = $('#rotator');
    if (!box) return;
    var items = $$('span', box);
    if (items.length < 2) return;
    var i = 0;
    setInterval(function () {
      i = (i + 1) % items.length;
      items.forEach(function (s) { s.style.transform = 'translateY(-' + (i * 100) + '%)'; });
    }, 2600);
  })();

  /* ═══════════ HERO TITLE DECRYPT ═══════════ */
  (function decrypt() {
    if (reduced) return;
    var CH = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&$@*';
    $$('.decrypt').forEach(function (el, idx) {
      var final = el.dataset.text || el.textContent;
      var frame = 0;
      setTimeout(function () {
        var id = setInterval(function () {
          el.textContent = final.split('').map(function (c, i) {
            if (i < frame / 3) return final[i];
            return CH[Math.floor(Math.random() * CH.length)];
          }).join('');
          frame++;
          if (frame / 3 >= final.length) { clearInterval(id); el.textContent = final; }
        }, 38);
      }, 420 + idx * 130);
    });
  })();

  /* ═══════════ PROJECT GRID ═══════════ */
  (function projects() {
    var grid = $('#projectGrid');
    if (!grid) return;

    var html = PROJECTS.map(function (p, i) {
      var n = String(i + 1).padStart(2, '0');
      var badge = p.badge
        ? '<span class="card__badge' + (p.priv ? ' card__badge--private' : '') + '">' + p.badge + '</span>'
        : '';
      var stack = p.stack.map(function (s) { return '<span>' + s + '</span>'; }).join('');
      var foot = p.url
        ? '<a class="card__link" href="' + p.url + '" target="_blank" rel="noopener">View source <span class="btn__arrow">→</span></a>'
        : '<span class="card__lock">Private repository</span>';

      return '' +
        '<article class="card" data-tags="' + p.tags.join(' ') + '" style="animation-delay:' + (i % 6) * 60 + 'ms">' +
          '<div class="card__top"><span class="card__idx">' + n + '</span>' + badge + '</div>' +
          '<h3 class="card__title">' + p.title + '</h3>' +
          '<p class="card__sub">' + p.sub + '</p>' +
          '<p class="card__desc">' + p.desc + '</p>' +
          '<div class="card__stack">' + stack + '</div>' +
          '<div class="card__foot">' + foot + '</div>' +
        '</article>';
    }).join('');

    grid.innerHTML = html;

    // pointer-tracked glow
    $$('.card', grid).forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });

    // filtering
    var chips = $$('.chip');
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (c) { c.classList.remove('is-active'); });
        chip.classList.add('is-active');
        var f = chip.dataset.filter;
        $$('.card', grid).forEach(function (card, i) {
          var show = f === 'all' || card.dataset.tags.split(' ').indexOf(f) > -1;
          card.classList.toggle('is-hidden', !show);
          if (show) {
            card.style.animation = 'none';
            void card.offsetWidth;           // force reflow to restart the entry animation
            card.style.animation = '';
            card.style.animationDelay = (i % 6) * 50 + 'ms';
          }
        });
      });
    });
  })();

  /* ═══════════ MISC ═══════════ */
  var yr = $('#year');
  if (yr) yr.textContent = new Date().getFullYear();

  function debounce(fn, ms) {
    var t;
    return function () {
      var a = arguments, c = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(c, a); }, ms);
    };
  }
})();
