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

  /* ═══════════ HERO: 3D VALUE TERRAIN ═══════════
     A glowing wireframe surface, V(x, z, t), seen in perspective.
     Height and colour show value: deep blue valleys, bright cyan slopes,
     amber peaks. The pointer raises a reward peak where it points, the
     camera leans with the pointer, and a comet-like agent climbs the
     gradient across the surface. */
  (function terrain() {
    var cv = $('#field');
    if (!cv) return;
    var ctx = cv.getContext('2d');
    if (!ctx) return;

    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0, NX = 72, NZ = 46;
    var t = 0, visible = true, last = 0;
    var mouse = { u: .62, v: .45, on: 0, tu: .62, tv: .45 };   // u,v in [0,1] across the surface
    var tilt = { x: 0, y: 0 };
    var P = null, Y = null;                                    // projected points, heights

    // world extents: x in [-1,1], z in [0,1] (0 = near, 1 = far)
    var peaks = [
      { x: .45, z: .62, r: .20, a: .55 },
      { x: -.5, z: .45, r: .17, a: .42 },
      { x: .05, z: .85, r: .25, a: .35 }
    ];

    var BUCKETS = 10;
    var colors = [];
    (function palette() {
      // valley → slope → peak
      var stops = [[52, 78, 150], [70, 140, 255], [110, 225, 255], [240, 177, 74], [255, 230, 170]];
      for (var i = 0; i < BUCKETS; i++) {
        var k = i / (BUCKETS - 1) * (stops.length - 1);
        var a = stops[Math.floor(k)], b = stops[Math.min(Math.ceil(k), stops.length - 1)], f = k - Math.floor(k);
        colors.push([a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f]);
      }
    })();

    var agent = { x: 0, z: 0, trail: [], age: 0 };
    function spawn() {
      agent.x = .05 + Math.random() * .6;
      agent.z = .15 + Math.random() * .4;
      agent.trail = []; agent.age = 0;
    }

    function V(x, z) {
      var v = .10 * Math.sin(x * 3.1 + t * .6) * Math.cos(z * 4.2 - t * .45)
            + .07 * Math.sin((x + z) * 5.3 + t * .8)
            + .04 * Math.sin(x * 9.0 - z * 6.0 + t * 1.3);
      for (var i = 0; i < peaks.length; i++) {
        var p = peaks[i];
        var px = p.x + .18 * Math.sin(t * .21 + i * 2.1);
        var pz = p.z + .08 * Math.cos(t * .17 + i);
        var dx = (x - px) / p.r, dz = (z - pz) / p.r;
        v += p.a * Math.exp(-(dx * dx + dz * dz));
      }
      if (mouse.on > .01) {
        var mx = (mouse.u * 2 - 1) - x, mz = (1 - mouse.v) * 1.0 - z;
        v += .75 * mouse.on * Math.exp(-(mx * mx + mz * mz) / .03);
      }
      return v;
    }

    // perspective camera looking across the surface
    function project(x, y, z, out) {
      var camH = .62 + tilt.y * .08, camZ = -.55, f = 1.15;
      var rx = x + tilt.x * .12 * (1 - z);           // slight parallax lean
      var dz = z - camZ;
      var sx = W * .5 + (rx / dz) * f * W * .5;
      var sy = H * (W < 700 ? .22 : .40) + ((camH - y) / dz) * f * W * .5 - H * .02;
      out[0] = sx; out[1] = sy; out[2] = 1 / dz;      // depth weight for fading
    }

    function size() {
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      NX = W < 700 ? 44 : 72;
      NZ = W < 700 ? 34 : 46;
      P = new Float32Array(NX * NZ * 3);
      Y = new Float32Array(NX * NZ);
    }

    var tmp = [0, 0, 0];
    function compute() {
      for (var j = 0; j < NZ; j++) {
        var z = j / (NZ - 1);
        for (var i = 0; i < NX; i++) {
          var x = -1.25 + 2.5 * i / (NX - 1);
          var y = V(x, z);
          Y[j * NX + i] = y;
          project(x, y, z, tmp);
          var o = (j * NX + i) * 3;
          P[o] = tmp[0]; P[o + 1] = tmp[1]; P[o + 2] = tmp[2];
        }
      }
    }

    function bucketOf(y) {
      var k = Math.floor((y + .12) / .9 * (BUCKETS - 1));
      return k < 0 ? 0 : k >= BUCKETS ? BUCKETS - 1 : k;
    }

    function drawSurface() {
      ctx.globalCompositeOperation = 'lighter';
      // draw far rows first; each colour bucket is one path per depth band
      var bands = 4;
      for (var band = bands - 1; band >= 0; band--) {
        var j0 = Math.floor(band * NZ / bands), j1 = Math.floor((band + 1) * NZ / bands);
        var fade = .28 + .72 * (1 - band / bands);
        for (var b = 0; b < BUCKETS; b++) {
          ctx.beginPath();
          var any = false;
          for (var j = j0; j < j1; j++) {
            for (var i = 0; i < NX; i++) {
              var a = j * NX + i, ya = Y[a];
              // segment along x
              if (i < NX - 1) {
                var c = a + 1;
                if (bucketOf((ya + Y[c]) * .5) === b) {
                  ctx.moveTo(P[a * 3], P[a * 3 + 1]); ctx.lineTo(P[c * 3], P[c * 3 + 1]); any = true;
                }
              }
              // segment along z (sparser: every second column)
              if (j < NZ - 1 && i % 2 === 0) {
                var d = a + NX;
                if (bucketOf((ya + Y[d]) * .5) === b) {
                  ctx.moveTo(P[a * 3], P[a * 3 + 1]); ctx.lineTo(P[d * 3], P[d * 3 + 1]); any = true;
                }
              }
            }
          }
          if (!any) continue;
          var col = colors[b];
          var alpha = (.3 + .6 * (b / (BUCKETS - 1))) * fade;
          ctx.strokeStyle = 'rgba(' + (col[0] | 0) + ',' + (col[1] | 0) + ',' + (col[2] | 0) + ',' + alpha + ')';
          ctx.lineWidth = b > BUCKETS - 4 ? 1.4 : 1;
          ctx.stroke();
        }
      }
      // glowing nodes on the peaks
      for (var k = 0; k < NX * NZ; k += 1) {
        var y = Y[k];
        if (y < .42) continue;
        var s = P[k * 3 + 2];
        var r = (y - .38) * 6 * s;
        ctx.beginPath();
        ctx.arc(P[k * 3], P[k * 3 + 1], Math.max(.6, r), 0, 6.283);
        ctx.fillStyle = 'rgba(255,214,140,' + Math.min(.9, (y - .4) * 2.2) + ')';
        ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
    }

    function stepAgent() {
      var h = .01;
      var gx = (V(agent.x + h, agent.z) - V(agent.x - h, agent.z)) / (2 * h);
      var gz = (V(agent.x, agent.z + h) - V(agent.x, agent.z - h)) / (2 * h);
      var g = Math.sqrt(gx * gx + gz * gz);
      if (g > 1e-5) { agent.x += gx / g * .006; agent.z += gz / g * .006; }
      agent.x += (Math.random() - .5) * .004;
      agent.z += (Math.random() - .5) * .004;
      agent.trail.push(agent.x, agent.z);
      if (agent.trail.length > 240) agent.trail.splice(0, 2);
      agent.age++;
      if (agent.age > 700 || agent.z < 0 || agent.z > 1 || Math.abs(agent.x) > 1.2 || (g < .02 && agent.age > 200)) spawn();
    }

    function drawAgent() {
      var tr = agent.trail, n = tr.length / 2;
      if (n < 2) return;
      ctx.globalCompositeOperation = 'lighter';
      var prev = [0, 0, 0], cur = [0, 0, 0];
      project(tr[0], V(tr[0], tr[1]) + .015, tr[1], prev);
      for (var i = 1; i < n; i++) {
        project(tr[i * 2], V(tr[i * 2], tr[i * 2 + 1]) + .015, tr[i * 2 + 1], cur);
        ctx.beginPath();
        ctx.moveTo(prev[0], prev[1]); ctx.lineTo(cur[0], cur[1]);
        ctx.strokeStyle = 'rgba(255,200,110,' + (i / n) * .95 + ')';
        ctx.lineWidth = 2.2 * (i / n) + .4;
        ctx.stroke();
        prev[0] = cur[0]; prev[1] = cur[1];
      }
      var g = ctx.createRadialGradient(cur[0], cur[1], 0, cur[0], cur[1], 26);
      g.addColorStop(0, 'rgba(255,236,190,1)');
      g.addColorStop(.25, 'rgba(240,177,74,.75)');
      g.addColorStop(1, 'rgba(240,177,74,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(cur[0], cur[1], 26, 0, 6.283); ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    }

    function render() {
      ctx.clearRect(0, 0, W, H);
      compute();
      drawSurface();
      drawAgent();
    }

    function frame(ts) {
      requestAnimationFrame(frame);
      if (!visible || document.hidden) return;
      if (ts - last < 28) return;
      last = ts;
      t += .022;
      mouse.u += (mouse.tu - mouse.u) * .08;
      mouse.v += (mouse.tv - mouse.v) * .08;
      tilt.x += ((mouse.tu - .5) - tilt.x) * .04;
      tilt.y += ((mouse.tv - .5) - tilt.y) * .04;
      for (var s = 0; s < 2; s++) stepAgent();
      render();
    }

    var host = cv.parentElement;
    host.addEventListener('pointermove', function (e) {
      var r = cv.getBoundingClientRect();
      mouse.tu = (e.clientX - r.left) / r.width;
      mouse.tv = Math.min(1, Math.max(0, ((e.clientY - r.top) / r.height - .35) / .65));
      mouse.on = 1;
    }, { passive: true });
    host.addEventListener('pointerleave', function () { mouse.on = 0; mouse.tu = .62; mouse.tv = .45; });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }).observe(cv);
    }
    window.addEventListener('resize', debounce(function () { size(); if (reduced) render(); }, 150));

    size(); spawn();
    if (reduced) {
      t = 3;
      for (var i = 0; i < 240; i++) stepAgent();
      render();
    } else {
      requestAnimationFrame(frame);
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
