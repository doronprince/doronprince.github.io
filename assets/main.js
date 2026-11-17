/* ══════════════════════════════════════════════════════════
   Doron Linton Prince — portfolio
   Vanilla JS, no dependencies.
   ══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ═══════════ PROJECT DATA ═══════════
     Edit this list to add or change projects.
     tags: ai, cv, robotics, fullstack, creative. url: null for private repos. */
  var PROJECTS = [
    {
      title: "KSP God's Eye",
      sub: 'Agentic RAG crime analytics',
      badge: 'KSP Datathon 2026',
      tags: ['ai', 'fullstack'],
      desc: 'Turns plain-English questions into SQL over FIR records and surveillance data, so analysts can query a police database without writing code. Next.js front end, FastAPI back end, read-only query execution.',
      stack: ['Next.js', 'TypeScript', 'FastAPI', 'Agentic RAG', 'xAI Grok'],
      url: 'https://github.com/doronprince/KSP-DATATHON_MEIKA_GOD-S-EYE'
    },
    {
      title: 'Bipedal Walker RL',
      sub: 'Imitation-bootstrapped Soft Actor-Critic',
      tags: ['ai'],
      desc: 'Compares a SAC agent bootstrapped by behaviour cloning from a pretrained PPO expert against SAC trained from scratch on BipedalWalker-v3, with the same network architecture.',
      stack: ['Python', 'PyTorch', 'Stable-Baselines3', 'Gymnasium'],
      url: 'https://github.com/doronprince/reinforcement-learning-bipedal'
    },
    {
      title: 'Object Tracking Drone',
      sub: 'Computer vision for rescue operations',
      tags: ['cv', 'robotics'],
      desc: 'Drone-based CCTV for real-time identification and tracking across simulated disaster sites, with its own video capture, inference and model-training pipeline.',
      stack: ['Python', 'OpenCV', 'C++', 'Deep learning'],
      url: 'https://github.com/doronprince/Drone_CCTV_criminal-identification-and-tracking'
    },
    {
      title: 'Security Robot Vision',
      sub: 'ROS2 perception node',
      tags: ['cv', 'robotics'],
      desc: 'A ROS2 vision node for an autonomous security robot: YOLOv8 object detection with a fire-detection alert path wired into the robot control graph.',
      stack: ['ROS2', 'YOLOv8', 'Python', 'OpenCV'],
      url: 'https://github.com/doronprince/ROBOT_PROGRAMING'
    },
    {
      title: 'Aegis',
      sub: 'Fully local AI assistant',
      badge: 'Private',
      tags: ['ai'],
      desc: 'A desktop assistant that runs entirely on-device with no cloud inference: a Rust daemon handles model execution and system access, driven by a Flutter interface.',
      stack: ['Rust', 'Flutter', 'Local LLMs'],
      url: null
    },
    {
      title: 'NexusOps',
      sub: 'AI workforce management platform',
      tags: ['ai', 'fullstack'],
      desc: 'An agentic AI back end that lets non-technical users build, train and deploy agents to automate business operations.',
      stack: ['Python', 'FastAPI', 'TensorFlow', 'Flask', 'JavaScript'],
      url: 'https://github.com/doronprince/Nexus-OPS'
    },
    {
      title: 'Meika',
      sub: 'Explainable AI finance assistant',
      badge: 'In progress',
      tags: ['ai', 'fullstack'],
      desc: 'A personal-finance app for students that explains its risk flags and budget advice instead of only categorising spending. FastAPI service with a Flutter client.',
      stack: ['Python', 'FastAPI', 'SQLAlchemy', 'Flutter', 'Alembic'],
      url: 'https://github.com/doronprince/Meika_mvp'
    },
    {
      title: 'Scan Center System',
      sub: 'Offline-first diagnostic management',
      tags: ['ai', 'fullstack'],
      desc: 'An AI-assisted management system for diagnostic scan centres that keeps working without a network and synchronises later.',
      stack: ['Python', 'SQLite'],
      url: 'https://github.com/doronprince/scan-center-system'
    },
    {
      title: 'AR Music',
      sub: 'Gesture-controlled music',
      tags: ['cv', 'creative'],
      desc: 'MediaPipe hand tracking mapped to a real-time synthesis engine, so you play and shape sound in the air.',
      stack: ['Python', 'MediaPipe', 'OpenCV', 'Audio synthesis'],
      url: 'https://github.com/doronprince/ar-music'
    },
    {
      title: 'Nexus IoT Event Platform',
      sub: 'The Hunt for the Lost Algorithm',
      tags: ['fullstack', 'robotics'],
      desc: 'A gamified website for an IoT and AI competition, with puzzle progression, team scoring and live state backed by Firebase.',
      stack: ['React', 'Firebase', 'JavaScript'],
      url: 'https://github.com/doronprince/nexus-iot-event-website'
    },
    {
      title: 'Neon Heart',
      sub: 'WebGL fragment shader',
      tags: ['creative'],
      desc: 'An animated neon heart drawn entirely in a GLSL fragment shader with signed distance fields and time-driven distortion.',
      stack: ['WebGL', 'GLSL', 'JavaScript'],
      url: 'https://github.com/doronprince/neon-heart'
    },
    {
      title: 'AiDiagnose',
      sub: 'Symptom-based medical chatbot',
      tags: ['ai'],
      desc: 'An NLP pipeline that reads free-text symptom descriptions and suggests likely conditions, trained on structured medical record data.',
      stack: ['Python', 'scikit-learn', 'NLTK', 'Pandas'],
      url: null
    }
  ];

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ═══════════ HERO: VALUE LANDSCAPE ═══════════
     A scalar field V(x, y, t) = slow waves + a few drifting reward peaks
     + a peak under the pointer. Contours are drawn with marching squares.
     An agent does gradient ascent on V and leaves a fading trail. */
  (function field() {
    var cv = $('#field');
    if (!cv) return;
    var ctx = cv.getContext('2d');
    if (!ctx) return;

    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0, cell = 12, cols = 0, rows = 0, grid = null;
    var t = Math.random() * 100;
    var visible = true, raf = null, last = 0;
    var pointer = { x: -1e4, y: -1e4, k: 0 };      // k eases the cursor peak in and out

    var peaks = [
      { ax: .72, ay: .32, r: .19, a: 1.0, sx: .11, sy: .07 },
      { ax: .28, ay: .62, r: .16, a: .8,  sx: .08, sy: .13 },
      { ax: .55, ay: .78, r: .22, a: .6,  sx: .05, sy: .09 }
    ];

    var LEVELS = [];
    for (var L = -0.6; L <= 1.75; L += 0.17) LEVELS.push(L);

    var agent = { x: 0, y: 0, trail: [], age: 0 };

    function size() {
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cell = W < 700 ? 16 : 12;
      cols = Math.ceil(W / cell) + 1;
      rows = Math.ceil(H / cell) + 1;
      grid = new Float32Array(cols * rows);
      spawn();
    }

    function V(x, y) {
      var u = x / W, v = y / H, s = Math.max(W, H);
      var val = .32 * Math.sin(u * 5.1 + t * .23) * Math.cos(v * 4.3 - t * .17)
              + .22 * Math.sin((u + v) * 3.7 + t * .31);
      for (var i = 0; i < peaks.length; i++) {
        var p = peaks[i];
        var px = (p.ax + .12 * Math.sin(t * p.sx * 2.1 + i)) * W;
        var py = (p.ay + .10 * Math.cos(t * p.sy * 2.3 + i * 2)) * H;
        var dx = (x - px) / (p.r * s), dy = (y - py) / (p.r * s);
        val += p.a * Math.exp(-(dx * dx + dy * dy));
      }
      if (pointer.k > .001) {
        var qx = (x - pointer.x) / 150, qy = (y - pointer.y) / 150;
        val += 1.15 * pointer.k * Math.exp(-(qx * qx + qy * qy));
      }
      return val;
    }

    function spawn() {
      agent.x = W * (.45 + Math.random() * .45);
      agent.y = H * (.15 + Math.random() * .7);
      agent.trail = [];
      agent.age = 0;
    }

    function sample() {
      for (var j = 0; j < rows; j++) {
        for (var i = 0; i < cols; i++) grid[j * cols + i] = V(i * cell, j * cell);
      }
    }

    function lerp(a, b, lv) { return (lv - a) / (b - a || 1e-6); }

    function contours() {
      var n = LEVELS.length;
      for (var li = 0; li < n; li++) {
        var lv = LEVELS[li];
        var hi = li >= n - 2;
        var k = li / (n - 1);
        ctx.beginPath();
        for (var j = 0; j < rows - 1; j++) {
          for (var i = 0; i < cols - 1; i++) {
            var a = grid[j * cols + i],       b = grid[j * cols + i + 1];
            var c = grid[(j + 1) * cols + i + 1], d = grid[(j + 1) * cols + i];
            var idx = (a > lv ? 8 : 0) | (b > lv ? 4 : 0) | (c > lv ? 2 : 0) | (d > lv ? 1 : 0);
            if (idx === 0 || idx === 15) continue;
            var x = i * cell, y = j * cell;
            var top = [x + cell * lerp(a, b, lv), y];
            var rgt = [x + cell, y + cell * lerp(b, c, lv)];
            var bot = [x + cell * lerp(d, c, lv), y + cell];
            var lft = [x, y + cell * lerp(a, d, lv)];
            var segs;
            switch (idx) {
              case 1: case 14: segs = [lft, bot]; break;
              case 2: case 13: segs = [bot, rgt]; break;
              case 3: case 12: segs = [lft, rgt]; break;
              case 4: case 11: segs = [top, rgt]; break;
              case 6: case 9:  segs = [top, bot]; break;
              case 7: case 8:  segs = [lft, top]; break;
              case 5:  segs = [lft, top, bot, rgt]; break;
              case 10: segs = [lft, bot, top, rgt]; break;
            }
            for (var s = 0; s < segs.length; s += 2) {
              ctx.moveTo(segs[s][0], segs[s][1]);
              ctx.lineTo(segs[s + 1][0], segs[s + 1][1]);
            }
          }
        }
        ctx.lineWidth = hi ? 1.25 : 1;
        ctx.strokeStyle = hi
          ? 'rgba(240,177,74,' + (.55 + .25 * (li - n + 2)) + ')'
          : 'rgba(127,147,188,' + (.1 + .32 * k) + ')';
        ctx.stroke();
      }
    }

    function stepAgent() {
      var h = 3;
      var gx = (V(agent.x + h, agent.y) - V(agent.x - h, agent.y)) / (2 * h);
      var gy = (V(agent.x, agent.y + h) - V(agent.x, agent.y - h)) / (2 * h);
      var g = Math.sqrt(gx * gx + gy * gy);
      var speed = 1.6;
      if (g > 1e-6) { agent.x += gx / g * speed; agent.y += gy / g * speed; }
      // a little exploration noise, like an epsilon-greedy policy
      agent.x += (Math.random() - .5) * .9;
      agent.y += (Math.random() - .5) * .9;
      agent.trail.push(agent.x, agent.y);
      if (agent.trail.length > 360) agent.trail.splice(0, 2);
      agent.age++;
      var off = agent.x < -20 || agent.y < -20 || agent.x > W + 20 || agent.y > H + 20;
      if (agent.age > 1100 || off || (g < 0.00045 && agent.age > 240)) spawn();
    }

    function drawAgent() {
      var tr = agent.trail, n = tr.length / 2;
      if (n < 2) return;
      for (var i = 1; i < n; i++) {
        ctx.beginPath();
        ctx.moveTo(tr[(i - 1) * 2], tr[(i - 1) * 2 + 1]);
        ctx.lineTo(tr[i * 2], tr[i * 2 + 1]);
        ctx.strokeStyle = 'rgba(240,177,74,' + (i / n) * .85 + ')';
        ctx.lineWidth = 1.6;
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(agent.x, agent.y, 3.6, 0, Math.PI * 2);
      ctx.fillStyle = '#f0b14a';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(agent.x, agent.y, 9, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(240,177,74,.35)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    function render() {
      ctx.clearRect(0, 0, W, H);
      sample();
      contours();
      drawAgent();
    }

    function frame(ts) {
      raf = requestAnimationFrame(frame);
      if (!visible || document.hidden) return;
      if (ts - last < 33) return;            // ~30 fps is plenty for slow drift
      last = ts;
      t += .016;
      var target = pointer.x > -1e3 ? 1 : 0;
      pointer.k += (target - pointer.k) * .06;
      for (var s = 0; s < 2; s++) stepAgent();
      render();
    }

    window.addEventListener('resize', debounce(function () { size(); if (reduced) render(); }, 150));
    cv.parentElement.addEventListener('pointermove', function (e) {
      var r = cv.getBoundingClientRect();
      pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top;
    }, { passive: true });
    cv.parentElement.addEventListener('pointerleave', function () { pointer.x = pointer.y = -1e4; });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }).observe(cv);
    }

    size();
    if (reduced) {
      // a single still frame: the landscape and a finished climb
      for (var i = 0; i < 260; i++) stepAgent();
      render();
    } else {
      raf = requestAnimationFrame(frame);
    }
  })();

  /* ═══════════ NAV ═══════════ */
  (function nav() {
    var bar = $('#nav');
    function onScroll() { if (bar) bar.classList.toggle('is-stuck', window.scrollY > 40); }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    var links = $$('.nav__links a');
    var targets = links.map(function (a) { return $(a.getAttribute('href')); }).filter(Boolean);
    if (!('IntersectionObserver' in window) || !targets.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    targets.forEach(function (s) { io.observe(s); });
  })();

  /* ═══════════ PROJECTS: expandable rows + filters ═══════════ */
  (function projects() {
    var list = $('#projects');
    if (!list) return;

    list.innerHTML = PROJECTS.map(function (p, i) {
      var id = 'proj-' + i;
      var link = p.url
        ? '<a href="' + esc(p.url) + '" target="_blank" rel="noopener">Source on GitHub</a>'
        : '<span>Private repository</span>';
      var badge = p.badge ? '<span class="badge">' + esc(p.badge) + '</span>' : '';
      return '' +
        '<li class="project" data-tags="' + p.tags.join(' ') + '">' +
          '<button class="project__btn" aria-expanded="false" aria-controls="' + id + '">' +
            '<span class="project__title">' + esc(p.title) + '</span>' +
            '<span class="project__sub">' + esc(p.sub) + '</span>' +
            '<span class="project__mark" aria-hidden="true"></span>' +
          '</button>' +
          '<div class="project__more" id="' + id + '"><div>' +
            '<p class="project__desc">' + esc(p.desc) + '</p>' +
            '<p class="project__meta">' + badge + '<span>' + p.stack.map(esc).join(', ') + '</span>' + link + '</p>' +
          '</div></div>' +
        '</li>';
    }).join('');

    $$('.project', list).forEach(function (row, i) {
      var btn = $('.project__btn', row);
      var panel = $('.project__more', row);
      panel.inert = true;
      btn.addEventListener('click', function () {
        var open = !row.classList.contains('is-open');
        row.classList.toggle('is-open', open);
        btn.setAttribute('aria-expanded', String(open));
        panel.inert = !open;
      });
      if (i === 0) btn.click();     // show one example of what a row holds
    });

    var filters = $$('.filter');
    filters.forEach(function (f) {
      f.addEventListener('click', function () {
        filters.forEach(function (o) { o.classList.remove('is-active'); o.setAttribute('aria-pressed', 'false'); });
        f.classList.add('is-active'); f.setAttribute('aria-pressed', 'true');
        var tag = f.dataset.filter;
        $$('.project', list).forEach(function (row) {
          row.hidden = !(tag === 'all' || row.dataset.tags.split(' ').indexOf(tag) > -1);
        });
      });
    });
  })();

  var yr = $('#year');
  if (yr) yr.textContent = new Date().getFullYear();

  function debounce(fn, ms) {
    var tm;
    return function () { clearTimeout(tm); tm = setTimeout(fn, ms); };
  }
})();
