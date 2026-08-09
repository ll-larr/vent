/* Vent story engine — scroll reveals, sticky frame tracks, cursor.
   Runs at parse time from <helmet> so streamed nodes are picked up as they land. */
(function () {
  var RM = window.matchMedia('(prefers-reduced-motion: reduce)');
  var seen = new WeakSet();
  var T0 = document.timeline.currentTime;
  /* The animation clock is frozen in paused/capture contexts; a running CSS
     transition outranks !important, so a transitioned property would stay
     pinned at its from-value forever. Detected per reveal, no rAF needed. */
  function frozen() { return RM.matches || document.timeline.currentTime === T0; }

  /* ---------- injected rules that cannot be inline ---------- */
  var s = document.createElement('style');
  s.textContent =
    'html.vent-cursor,html.vent-cursor *{cursor:none!important}' +
    '[data-reveal][data-revealed]{opacity:1!important;transform:none!important;clip-path:none!important}' +
    '@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto!important}[data-reveal]{opacity:1!important;transform:none!important}}';
  document.head.appendChild(s);

  /* ---------- reveals ---------- */
  function reveal(el) {
    if (frozen()) {
      el.style.transition = 'none';
      if (el.getAnimations) el.getAnimations().forEach(function (a) { try { a.cancel(); } catch (e) {} });
    }
    el.setAttribute('data-revealed', '1');
    el.style.opacity = '1';
    el.style.transform = 'none';
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target, d = parseInt(el.getAttribute('data-delay') || '0', 10);
      if (RM.matches || !d) reveal(el); else setTimeout(function () { reveal(el); }, d);
      io.unobserve(el);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });

  function scanReveals() {
    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      if (seen.has(el)) return;
      seen.add(el);
      if (RM.matches) reveal(el); else io.observe(el);
    });
  }

  /* ---------- sticky frame tracks ---------- */
  var tracks = [];
  function scanTracks() {
    document.querySelectorAll('[data-track]').forEach(function (t) {
      if (t.__vt) return;
      t.__vt = 1;
      tracks.push(t);
    });
    document.querySelectorAll('[data-compare]').forEach(initCompare);
  }

  /* ---------- before / after comparison ---------- */
  function initCompare(el) {
    if (el.__vc) return;
    el.__vc = 1;
    var p = 0, drag = false;
    function paint(v, smooth) {
      p = Math.min(1, Math.max(0, v));
      var after = el.querySelector('[data-after]');
      var line = el.querySelector('[data-compare-line]');
      var bb = el.querySelector('[data-badge-before]');
      var ba = el.querySelector('[data-badge-after]');
      var ms = smooth ? '1.15s cubic-bezier(.16,1,.3,1)' : '0s';
      if (after) { after.style.transition = 'clip-path ' + ms; after.style.clipPath = 'inset(0 ' + ((1 - p) * 100).toFixed(2) + '% 0 0)'; }
      if (line) { line.style.transition = 'left ' + ms; line.style.left = (p * 100).toFixed(2) + '%'; }
      if (bb) bb.style.opacity = p > 0.8 ? '0' : '1';
      if (ba) ba.style.opacity = p < 0.2 ? '0' : '1';
      el.setAttribute('aria-valuenow', Math.round(p * 100));
    }
    el.__set = paint;
    paint(0, false);
    var cio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting || el.__played) return;
        el.__played = 1;
        if (RM.matches || el.getAttribute('data-auto') === '0') paint(0.5, false);
        else setTimeout(function () { paint(0.62, true); }, 240);
      });
    }, { threshold: 0.3 });
    cio.observe(el);
    function at(e) {
      var r = el.getBoundingClientRect();
      paint((e.clientX - r.left) / r.width, false);
    }
    el.addEventListener('pointerdown', function (e) {
      drag = true;
      if (el.setPointerCapture) { try { el.setPointerCapture(e.pointerId); } catch (x) {} }
      at(e);
      e.preventDefault();
    });
    el.addEventListener('pointermove', function (e) { if (drag) at(e); });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (t) {
      el.addEventListener(t, function () { drag = false; });
    });
    el.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { paint(p - 0.06, false); e.preventDefault(); }
      if (e.key === 'ArrowRight') { paint(p + 0.06, false); e.preventDefault(); }
    });
  }
  /* replayed by the logic class when the object tab changes */
  window.ventCompareReplay = function () {
    document.querySelectorAll('[data-compare]').forEach(function (el) {
      if (!el.__set) return;
      el.__set(0, false);
      setTimeout(function () { el.__set(0.62, true); }, 140);
    });
  };
  function paintTrack(t, vh) {
    var inner = t.firstElementChild;
    if (inner && getComputedStyle(inner).position !== 'sticky') {
      /* short-viewport fallback: the pane is no longer sticky, so rows are not
         revealed one at a time — show every row and bar at full strength. */
      t.__idx = -1;
      t.querySelectorAll('[data-item]').forEach(function (it) {
        it.style.opacity = '1';
        it.setAttribute('data-on', '1');
        var b = it.querySelector('[data-bar]');
        if (b) b.style.transform = 'scaleX(1)';
      });
      return;
    }
    var r = t.getBoundingClientRect();
    var span = r.height - vh;
    var p = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : (r.top < vh * 0.4 ? 1 : 0);
    t.style.setProperty('--p', p.toFixed(4));

    var frames = t.querySelectorAll('[data-frame]');
    var items = t.querySelectorAll('[data-item]');
    var n = frames.length || items.length;
    if (!n) return;
    var idx = Math.min(n - 1, Math.floor(p * n * 0.999 + 0.0001));
    if (t.__idx === idx) return;
    t.__idx = idx;
    frames.forEach(function (f, i) {
      var on = i === idx;
      f.style.opacity = on ? '1' : '0';
      f.style.transform = on ? 'scale(1)' : 'scale(1.04)';
      f.style.zIndex = on ? '2' : '1';
    });
    items.forEach(function (it, i) {
      var on = i === idx;
      it.setAttribute('data-on', on ? '1' : '0');
      it.style.opacity = on ? '1' : '0.32';
      var bar = it.querySelector('[data-bar]');
      if (bar) bar.style.transform = on ? 'scaleX(1)' : 'scaleX(0)';
    });
    var counter = t.querySelector('[data-counter]');
    if (counter) counter.textContent = String(idx + 1).padStart(2, '0');
  }

  /* ---------- parallax ---------- */
  function paintParallax(vh) {
    document.querySelectorAll('[data-parallax]').forEach(function (el) {
      var k = parseFloat(el.getAttribute('data-parallax')) || 0.12;
      var r = el.getBoundingClientRect();
      var mid = r.top + r.height / 2 - vh / 2;
      el.style.transform = 'translate3d(0,' + (-mid * k).toFixed(1) + 'px,0)';
    });
  }

  /* ---------- header nav (scroll-driven, no observer lag) ---------- */
  var lastSec = '';
  function activeSection(vh) {
    var secs = document.querySelectorAll('section[data-sec]');
    if (!secs.length) return '';
    var line = vh * 0.38, hit = null, near = null, nd = 1e9;
    secs.forEach(function (s) {
      var r = s.getBoundingClientRect();
      if (r.top <= line && r.bottom > line) hit = s;
      var d = Math.abs(r.top - line);
      if (d < nd) { nd = d; near = s; }
    });
    var el = hit || near;
    /* bottom of the document: last section wins even if it is short */
    var sc = document.scrollingElement || document.documentElement;
    if (sc.scrollTop + vh >= sc.scrollHeight - 4) el = secs[secs.length - 1];
    return el ? el.getAttribute('data-sec') : '';
  }
  function paintNav(vh, solid) {
    var id = activeSection(vh);
    lastSec = id;
    document.querySelectorAll('[data-nav-item]').forEach(function (a) {
      var on = a.getAttribute('data-nav-item') === id;
      a.style.color = on ? (solid ? '#141312' : '#c8ff3e') : (solid ? 'rgba(20,19,18,.6)' : 'rgba(246,243,236,.72)');
      var u = a.querySelector('[data-nav-underline]');
      if (u) {
        u.style.transform = on ? 'scaleX(1)' : 'scaleX(0)';
        u.style.background = solid ? '#1e5c32' : '#c8ff3e';
      }
    });
  }

  var raf = 0;
  function frame() {
    raf = 0;
    var vh = window.innerHeight;
    tracks.forEach(function (t) { paintTrack(t, vh); });
    if (!RM.matches) paintParallax(vh);
    var solid = window.scrollY > 60;
    paintNav(vh, solid);
    var bar = document.querySelector('[data-topbar]');
    if (bar) {
      bar.style.background = solid ? 'rgba(246,243,236,.9)' : 'transparent';
      bar.style.backdropFilter = solid ? 'blur(14px)' : 'none';
      bar.style.borderBottomColor = solid ? 'rgba(20,19,18,.1)' : 'transparent';
      bar.style.color = solid ? '#141312' : '#f6f3ec';
      var tail = bar.querySelector('[data-logo-tail]');
      if (tail) tail.style.color = solid ? '#1e5c32' : '#c8ff3e';
      bar.querySelectorAll('[data-topbar-soft]').forEach(function (el) {
        el.style.color = solid ? 'rgba(20,19,18,.6)' : 'rgba(246,243,236,.68)';
      });
    }
    var pb = document.querySelector('[data-progress-bar]');
    if (pb) {
      var h = document.documentElement.scrollHeight - vh;
      pb.style.transform = 'scaleX(' + (h > 0 ? window.scrollY / h : 0).toFixed(4) + ')';
    }
  }
  function onScroll() { if (!raf) raf = requestAnimationFrame(frame); }

  /* ---------- custom cursor ---------- */
  function initCursor() {
    if (window.__ventCursor) return;
    if (RM.matches || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    window.__ventCursor = 1;
    document.documentElement.classList.add('vent-cursor');
    var mk = function (css) { var d = document.createElement('div'); d.style.cssText = css; d.setAttribute('aria-hidden', 'true'); document.body.appendChild(d); return d; };
    var base = 'position:fixed;top:0;left:0;pointer-events:none;z-index:9999;opacity:0;transition:opacity .18s ease;mix-blend-mode:difference;will-change:transform;border-radius:999px;';
    var dot = mk(base + 'width:8px;height:8px;background:#fff;');
    var ring = mk(base + 'width:32px;height:32px;border:1.5px solid #fff;transition:opacity .18s ease,width .22s cubic-bezier(.16,1,.3,1),height .22s cubic-bezier(.16,1,.3,1),margin .22s cubic-bezier(.16,1,.3,1),border-color .18s ease,background-color .18s ease;');
    var mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my, vis = false;
    var SEL = 'a,button,[role="button"],[role="checkbox"],[role="radio"],input,textarea,select,label,summary,[data-hoverable]';
    (function tick() {
      rx += (mx - rx) * 0.22; ry += (my - ry) * 0.22;
      dot.style.transform = 'translate3d(' + (mx - 4) + 'px,' + (my - 4) + 'px,0)';
      ring.style.transform = 'translate3d(' + (rx - 16) + 'px,' + (ry - 16) + 'px,0)';
      requestAnimationFrame(tick);
    })();
    addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      if (!vis) { vis = true; dot.style.opacity = '1'; ring.style.opacity = '1'; }
      var t = e.target, on = t && t.closest && t.closest(SEL);
      if (on) {
        ring.style.width = '58px'; ring.style.height = '58px';
        ring.style.marginLeft = '-13px'; ring.style.marginTop = '-13px';
        ring.style.borderColor = '#c8ff3e';
        ring.style.background = 'rgba(200,255,62,.16)';
        ring.style.mixBlendMode = 'normal';
      } else {
        ring.style.width = '32px'; ring.style.height = '32px';
        ring.style.marginLeft = '0'; ring.style.marginTop = '0';
        ring.style.borderColor = '#fff';
        ring.style.background = 'transparent';
        ring.style.mixBlendMode = 'difference';
      }
    }, { passive: true });
    addEventListener('mouseleave', function () { vis = false; dot.style.opacity = '0'; ring.style.opacity = '0'; });
  }
  window.ventCursorOff = function () {
    window.__ventCursorOff = 1;
    document.documentElement.classList.remove('vent-cursor');
  };

  /* ---------- boot ---------- */
  function sweep() { scanReveals(); scanTracks(); onScroll(); }
  new MutationObserver(sweep).observe(document.documentElement, { childList: true, subtree: true });
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', function () { tracks.forEach(function (t) { t.__idx = -1; }); onScroll(); }, { passive: true });
  document.addEventListener('DOMContentLoaded', function () { sweep(); initCursor(); });
  sweep();
  setTimeout(function () { sweep(); initCursor(); }, 400);
  setTimeout(sweep, 1200);
  /* failsafe — never leave content hidden */
  setTimeout(function () { document.querySelectorAll('[data-reveal]:not([data-revealed])').forEach(reveal); }, 4000);
})();
