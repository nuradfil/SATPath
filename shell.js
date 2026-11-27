/* =====================================================================
   SATPath — App Shell + Dashboard (shell.js)
   ---------------------------------------------------------------------
   Что внутри:
     1. Хранилище и слой данных (читает ТЕ ЖЕ ключи localStorage, что и старый сайт)
     2. Тема Dark / Light
     3. Hash-роутер  (#/dashboard, #/question-bank ...)
     4. Сайдбар (240px / 72px), мобильный Drawer, нижняя панель
     5. Экран Dashboard
   Как подключать новые экраны (в отдельных файлах, ПОСЛЕ shell.js):
     SPShell.register('question-bank', { render: function (root, ctx) { ...; return cleanupFn; } });
   Режим предпросмотра с демо-данными (ничего не пишет в хранилище):
     app-new.html?demo=1
   ===================================================================== */
(function () {
  'use strict';

  /* -------------------------------------------------------------------
     1. КОНФИГ, УТИЛИТЫ, ХРАНИЛИЩЕ
     ------------------------------------------------------------------- */
  const KEYS = {
    theme:    'satpath_theme_v2',
    side:     'satpath_sidebar_v2',
    exam:     'satpath_exam_date_v1',
    tele:     'satpath_telemetry_v1',     // { days: { 'YYYY-MM-DD': { q, ok, sec } } }  — из старого сайта
    profile:  'satpath_profile_v1',       // { name, ... }                                — из старого сайта
    goal:     'satpath_goal_score',       // число 400..1600                              — из старого сайта
    mistakes: 'satpath_mistakes_v1',      // массив ошибок                                — из старого сайта
    pt:       'satpath_pt_results_v1'     // результаты Practice Tests                    — из старого сайта
  };

  const DEMO = /[?&]demo=1(&|$)/.test(location.search);

  // ЗАГЛУШКИ дат SAT — замени на официальное расписание
  const SAT_DATE_PLACEHOLDERS = ['2027-03-13', '2027-05-08', '2027-06-05'];

  const NAV = [
    { group: 'Prep', items: [
      { id: 'dashboard',      label: 'Dashboard',      icon: 'layout-dashboard' },
      { id: 'study-planner', label: 'Study Planner', icon: 'calendar-range' },
      { id: 'islands', label: 'Learning Path', icon: 'map' },
      { id: 'question-bank',  label: 'Question Bank',  icon: 'library-big' },
      { id: 'leaderboard',    label: 'Leaderboard',    icon: 'trophy' },
            { id: 'vocabulary',     label: 'Vocabulary',     icon: 'book-open', badge: true }
    ]},
    { group: 'Simulate', items: [
      { id: 'practice-tests', label: 'Practice Tests', icon: 'file-check' },
      { id: 'blitz',          label: 'Blitz',          icon: 'zap' }
    ]},
    { group: 'Insights', items: [
      { id: 'metrics',        label: 'My Metrics',     icon: 'bar-chart-3' },
      { id: 'errors',         label: 'Saved & Errors', icon: 'bookmark', badge: true }
    ]},
    { group: 'Account', items: [
      { id: 'profile',        label: 'Profile & Support', icon: 'user-round' }
    ]}
  ];

  const MOBILE_BAR = [
    { id: 'dashboard',      label: 'Dashboard', icon: 'layout-dashboard' },
    { id: 'question-bank',  label: 'Bank',      icon: 'library-big' },
    { id: 'practice-tests', label: 'Tests',     icon: 'file-check' },
    { id: 'blitz',          label: 'Blitz',     icon: 'zap' }
  ];

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  const pad = function (n) { return n < 10 ? '0' + n : '' + n; };
  const isoLocal = function (d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };
  const parseISO = function (s) { const p = String(s).split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); };
  const addDays = function (d, n) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n); };
  const startOfToday = function () { const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()); };
  const fmtNum = function (n) { return Number(n).toLocaleString('en-US'); };
  const fmtDate = function (d, withYear) {
    return d.toLocaleDateString('en-US', withYear
      ? { month: 'short', day: 'numeric', year: 'numeric' }
      : { month: 'short', day: 'numeric' });
  };

  // localStorage с безопасным fallback в память (приватный режим, запрет storage)
  const mem = {};
  function lsGet(k) {
    try { const v = localStorage.getItem(k); if (v !== null) return v; } catch (e) {}
    return Object.prototype.hasOwnProperty.call(mem, k) ? mem[k] : null;
  }
  function lsSet(k, v) {
    mem[k] = String(v);
    try { localStorage.setItem(k, String(v)); } catch (e) {}
  }
  function jget(k, fallback) {
    try { const r = lsGet(k); return r ? JSON.parse(r) : fallback; } catch (e) { return fallback; }
  }

  /* -------------------------------------------------------------------
     2. СЛОЙ ДАННЫХ ДЛЯ DASHBOARD
     ------------------------------------------------------------------- */
  // Детерминированные демо-данные (?demo=1)
  const demoDays = (function () {
    const days = {};
    let seed = 7;
    const rnd = function () { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    const today = startOfToday();
    for (let i = 0; i < 190; i++) {
      const active = i < 9 ? true : rnd() > 0.45;     // стрик 9 дней
      if (!active) continue;
      const q = Math.max(1, Math.round(4 + rnd() * 28));
      const ok = Math.round(q * (0.55 + rnd() * 0.35));
      days[isoLocal(addDays(today, -i))] = { q: q, ok: ok, sec: q * 58 };
    }
    return days;
  })();

  let userOverride = null;   // SPShell.setUser({ name, email })

  const Data = {
    profile: function () {
      if (DEMO) return { name: 'Alex' };
      const p = jget(KEYS.profile, {});
      const name = String((p && p.name) || '').trim();
      return { name: name || 'Explorer' };
    },
    days: function () {
      if (DEMO) return demoDays;
      const t = jget(KEYS.tele, {});
      return (t && t.days && typeof t.days === 'object') ? t.days : {};
    },
    streak: function () {
      const days = Data.days();
      const today = startOfToday();
      let cur = 0;
      for (let back = 0; back < 400; back++) {
        const rec = days[isoLocal(addDays(today, -back))];
        const q = rec && rec.q ? rec.q : 0;
        if (q > 0) cur++;
        else if (back === 0) continue;       // сегодня ещё можно успеть
        else break;
      }
      const stored = jget(KEYS.tele, {});
      const best = Math.max(cur, (stored && +stored.bestStreak) || 0);
      return { current: cur, best: best };
    },
    last7: function () {
      const days = Data.days();
      const today = startOfToday();
      const L = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
      const out = [];
      for (let i = 6; i >= 0; i--) {
        const d = addDays(today, -i);
        const rec = days[isoLocal(d)];
        out.push({ label: L[d.getDay()], active: !!(rec && rec.q > 0), today: i === 0 });
      }
      return out;
    },
    accuracy: function () {
      const days = Data.days();
      let q = 0, ok = 0;
      Object.keys(days).forEach(function (k) {
        const r = days[k] || {};
        q += +r.q || 0;
        ok += +r.ok || 0;
      });
      return { q: q, ok: ok, pct: q ? Math.round(ok / q * 100) : 0 };
    },
    // Текущий балл = последний Practice Test, где есть оба модуля (R&W и Math)
    score: function () {
      if (DEMO) return { total: 1280, m: 640, r: 640 };
      const res = jget(KEYS.pt, {});
      if (!res || typeof res !== 'object') return null;
      const keys = Object.keys(res).sort(function (a, b) { return (+a) - (+b); });
      if (!keys.length) return null;
      const last = res[keys[keys.length - 1]];
      const m = last && last.m && +last.m.score;
      const r = last && last.r && +last.r.score;
      if (!(m > 0) || !(r > 0)) return null;
      return { total: m + r, m: m, r: r };
    },
    goal: function () {
      const g = Math.round((+lsGet(KEYS.goal) || 1500) / 10) * 10;
      return Math.max(400, Math.min(1600, g));
    },
    setGoal: function (v) {
      const g = Math.max(400, Math.min(1600, Math.round((+v || 1500) / 10) * 10));
      lsSet(KEYS.goal, g);
    },
    mistakesCount: function () {
      if (DEMO) return 14;
      if (window.SPReview) return window.SPReview.dueCount();
      const m = jget(KEYS.mistakes, []);
      return Array.isArray(m) ? m.length : 0;
    },
    exam: function () {
      const raw = lsGet(KEYS.exam);
      if (raw && /^\d{4}-\d{2}-\d{2}$/.test(raw)) return parseISO(raw);
      const today = startOfToday();
      for (let i = 0; i < SAT_DATE_PLACEHOLDERS.length; i++) {
        const d = parseISO(SAT_DATE_PLACEHOLDERS[i]);
        if (d >= today) return d;
      }
      return null;
    },
    setExam: function (iso) { lsSet(KEYS.exam, iso); }
  };

  /* -------------------------------------------------------------------
     3. ТЕМА
     ------------------------------------------------------------------- */
  const Theme = {
    get: function () { return document.documentElement.classList.contains('dark') ? 'dark' : 'light'; },
    set: function (t) {
      const dark = t === 'dark';
      document.documentElement.classList.toggle('dark', dark);
      lsSet(KEYS.theme, dark ? 'dark' : 'light');
      const m = document.querySelector('meta[name="theme-color"]');
      if (m) m.setAttribute('content', dark ? '#0B0D14' : '#F6F7FB');
      document.querySelectorAll('[data-theme-set]').forEach(function (b) {
        b.setAttribute('aria-pressed', b.getAttribute('data-theme-set') === (dark ? 'dark' : 'light') ? 'true' : 'false');
      });
    }
  };

  /* -------------------------------------------------------------------
     4. РОУТЕР
     ------------------------------------------------------------------- */
  const routes = {};
  let started = false;
  let currentId = null;
  let unmountFn = null;
  let appEl, viewEl;

  function register(id, def) {
    routes[id] = def;
    if (started && currentId === id) render();   // экран подключили позже — перерисовать
  }
  function navigate(path) { location.hash = '#/' + path; }
  function parseLocation() {
    const raw = (location.hash || '').replace(/^#\/?/, '');
    const qi = raw.indexOf('?');
    return {
      id: (qi < 0 ? raw : raw.slice(0, qi)) || 'dashboard',
      params: new URLSearchParams(qi < 0 ? '' : raw.slice(qi + 1))
    };
  }
  function findNav(id) {
    for (let g = 0; g < NAV.length; g++) {
      for (let i = 0; i < NAV[g].items.length; i++) {
        if (NAV[g].items[i].id === id) return { group: NAV[g].group, item: NAV[g].items[i] };
      }
    }
    return null;
  }
    let lastHash = null;

  // Стили переходов. !important нужен, чтобы перебить .rise и .pt-rise из других файлов
  function injectMotionStyle() {
    if (document.getElementById('spMotion')) return;
    const s = document.createElement('style');
    s.id = 'spMotion';
    s.textContent =
      '@media (prefers-reduced-motion:no-preference){' +
        '@keyframes sp-in{from{transform:translateY(6px)}to{transform:none}}' +
        '.rise,.pt-rise{animation:sp-in .24s cubic-bezier(.2,.7,.2,1) both!important;animation-delay:0ms!important}' +
      '}' +
      '.sp-no-anim .rise,.sp-no-anim .pt-rise{animation:none!important}' +
      '.sp-still .pt-fade,.sp-still .pt-pop{animation:none!important}' +
      '::view-transition-old(root),::view-transition-new(root){animation-duration:.16s;animation-timing-function:ease}';
    document.head.appendChild(s);
  }

  function render() {
    const loc = parseLocation();
    if (!routes[loc.id]) { location.replace('#/dashboard'); return; }
    injectMotionStyle();

    const sameScreen = lastHash === location.hash;
    const useTransition = lastHash !== null && !sameScreen &&
      typeof document.startViewTransition === 'function' && !reduceMotion();

    if (!useTransition) { swap(sameScreen); return; }

    // Старый кадр остаётся на экране, пока не готов новый
    const vt = document.startViewTransition(function () {
      if (lastHash !== location.hash) swap(false);
    });
    [vt.ready, vt.finished, vt.updateCallbackDone].forEach(function (p) {
      if (p) p.catch(function () {});
    });
  }

  function swap(sameScreen) {
    const loc = parseLocation();
    if (!routes[loc.id]) return;
    lastHash = location.hash;

    // При обновлении того же экрана держим высоту и прокрутку
    const y = window.scrollY;
    if (sameScreen) viewEl.style.minHeight = viewEl.offsetHeight + 'px';
    viewEl.classList.toggle('sp-no-anim', sameScreen);

    if (typeof unmountFn === 'function') { try { unmountFn(); } catch (e) {} }
    unmountFn = null;

    const def = routes[loc.id];
    currentId = loc.id;
    appEl.setAttribute('data-layout', def.layout === 'full' ? 'full' : 'shell');
    viewEl.innerHTML = '';
    if (!sameScreen) window.scrollTo(0, 0);

    const nav = findNav(loc.id);
    const title = def.title || (nav ? nav.item.label : 'SATPath');
    try {
      const ret = def.render(viewEl, { params: loc.params, navigate: navigate });
      if (typeof ret === 'function') unmountFn = ret;
    } catch (err) {
      viewEl.innerHTML =
        '<div class="mx-auto max-w-[560px] px-6 py-24 text-center">' +
        '<p class="text-[15px] font-semibold">This screen failed to load</p>' +
        '<p class="mt-2 text-[13px] text-ink-soft">' + esc(err && err.message || err) + '</p></div>';
      console.error('[SPShell] render error in "' + loc.id + '":', err);
    }

    document.title = 'SATPath — ' + title;
    document.getElementById('crumbGroup').textContent = (def.group || (nav && nav.group) || 'SATPath');
    document.getElementById('crumbTitle').textContent = title;
    paintNav(loc.id);
    setDrawer(false);
    refreshBadges();
    if (window.lucide) window.lucide.createIcons();
    if (sameScreen) {
      window.scrollTo(0, y);
      viewEl.style.minHeight = '';
    }
    try { viewEl.focus({ preventScroll: true }); } catch (e) {}
  }
  function paintNav(id) {
    document.querySelectorAll('[data-nav]').forEach(function (a) {
      if (a.getAttribute('data-nav') === id) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  }

  /* -------------------------------------------------------------------
     5. APP SHELL (сайдбар, шапка, нижняя панель)
     ------------------------------------------------------------------- */
  function navItemHTML(it) {
    return '<a href="#/' + it.id + '" data-nav="' + it.id + '" title="' + esc(it.label) + '" ' +
      'class="nav-item relative flex items-center gap-3 h-10 px-3 rounded-lg text-[13.5px] font-medium text-ink-soft hover:text-ink hover:bg-raised transition-colors">' +
      '<i data-lucide="' + it.icon + '" class="w-[18px] h-[18px] shrink-0"></i>' +
      '<span class="sb-label truncate">' + esc(it.label) + '</span>' +
      (it.badge
        ? '<span class="nav-badge ml-auto hidden min-w-[20px] h-5 px-1.5 rounded-full bg-accent text-white text-[11px] font-semibold items-center justify-center num" data-badge="' + it.id + '">0</span>'
        : '') +
      '</a>';
  }

  function buildShell() {
    appEl = document.getElementById('app');
    appEl.setAttribute('data-collapsed', lsGet(KEYS.side) === '1' ? 'true' : 'false');
    appEl.setAttribute('data-drawer', 'closed');
    appEl.setAttribute('data-layout', 'shell');

    const groups = NAV.map(function (g) {
      return '<div class="sb-group px-3 pt-5 pb-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-mute">' + esc(g.group) + '</div>' +
        g.items.map(navItemHTML).join('');
    }).join('');

    const bar = MOBILE_BAR.map(function (it) {
      return '<a href="#/' + it.id + '" data-nav="' + it.id + '" class="bar-item flex-1 flex flex-col items-center justify-center gap-1 min-h-[52px] rounded-xl text-[10.5px] font-medium text-ink-soft aria-[current=page]:text-accent aria-[current=page]:bg-raised">' +
        '<i data-lucide="' + it.icon + '" class="w-5 h-5"></i><span>' + esc(it.label) + '</span></a>';
    }).join('') +
      '<button type="button" id="btnProfile" class="flex-1 flex flex-col items-center justify-center gap-1 min-h-[52px] rounded-xl text-[10.5px] font-medium text-ink-soft" aria-label="Open profile and menu">' +
      '<i data-lucide="user" class="w-5 h-5"></i><span>Profile</span></button>';

    appEl.innerHTML =
      '<div id="scrim" class="fixed inset-0 z-[35] bg-black/55 md:hidden" hidden></div>' +

      '<aside id="sidebar" class="fixed inset-y-0 left-0 z-40 flex flex-col bg-surface border-r" aria-label="Primary">' +
        '<div class="flex items-center gap-2.5 h-14 px-4 border-b shrink-0">' +
          '<img src="logo.jpg" alt="SATPath" class="w-7 h-7 shrink-0 rounded-lg object-cover">' +
          '<span class="sb-label text-[16px] font-semibold tracking-tight">SAT<span class="text-accent">Path</span></span>' +
          '<button type="button" id="btnCloseDrawer" class="icon-btn grid ml-auto md:hidden" aria-label="Close menu"><i data-lucide="x" class="w-[18px] h-[18px]"></i></button>' +
        '</div>' +
        '<nav class="flex-1 overflow-y-auto px-3 pb-3">' + groups + '</nav>' +
        '<div class="border-t p-3 space-y-3 shrink-0">' +
          '<div class="theme-seg flex rounded-lg bg-raised p-0.5" role="group" aria-label="Color theme">' +
            '<button type="button" data-theme-set="dark" aria-pressed="true" title="Dark"><i data-lucide="moon" class="w-4 h-4"></i><span class="sb-label">Dark</span></button>' +
            '<button type="button" data-theme-set="light" aria-pressed="false" title="Light"><i data-lucide="sun" class="w-4 h-4"></i><span class="sb-label">Light</span></button>' +
          '</div>' +
          '<div class="user-row flex items-center gap-3 px-1">' +
            '<div id="userAv" class="w-8 h-8 shrink-0 rounded-full bg-accent/15 text-accent grid place-items-center text-[13px] font-semibold">E</div>' +
            '<div class="sb-meta min-w-0">' +
              '<div id="userLine1" class="text-[13px] font-medium truncate">Guest</div>' +
              '<div id="userLine2" class="text-[11.5px] text-ink-soft truncate">Not signed in</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</aside>' +

      '<div id="main">' +
        '<header id="topbar" class="sticky top-0 z-30 h-14 flex items-center gap-2 px-3 md:px-5 border-b bg-canvas/80 backdrop-blur-md">' +
          '<button type="button" id="btnDrawer" class="icon-btn grid md:hidden" aria-label="Open menu"><i data-lucide="menu" class="w-5 h-5"></i></button>' +
          '<button type="button" id="btnCollapse" class="icon-btn hidden md:grid" aria-label="Collapse sidebar" title="Collapse sidebar"><i data-lucide="panel-left" class="w-[18px] h-[18px]"></i></button>' +
          '<div class="flex items-center gap-2 text-[13px] min-w-0">' +
            '<span id="crumbGroup" class="text-ink-mute hidden sm:inline">Prep</span>' +
            '<span class="text-ink-mute hidden sm:inline">/</span>' +
            '<span id="crumbTitle" class="font-medium truncate">Dashboard</span>' +
          '</div>' +
        '</header>' +
        '<main id="view" tabindex="-1" class="outline-none"></main>' +
      '</div>' +

      '<nav id="bottombar" class="md:hidden fixed bottom-0 inset-x-0 z-30 flex items-stretch gap-1 px-2 pt-1.5 border-t bg-surface/95 backdrop-blur-md" style="padding-bottom:calc(6px + env(safe-area-inset-bottom,0px))" aria-label="Quick navigation">' + bar + '</nav>';

    viewEl = document.getElementById('view');
    paintUser();
    Theme.set(Theme.get());     // синхронизировать aria-pressed
  }

  function setDrawer(open) {
    appEl.setAttribute('data-drawer', open ? 'open' : 'closed');
    const scrim = document.getElementById('scrim');
    if (scrim) scrim.hidden = !open;
  }
  function setCollapsed(c) {
    appEl.setAttribute('data-collapsed', c ? 'true' : 'false');
    lsSet(KEYS.side, c ? '1' : '0');
    const b = document.getElementById('btnCollapse');
    if (b) {
      b.setAttribute('aria-label', c ? 'Expand sidebar' : 'Collapse sidebar');
      b.setAttribute('title', c ? 'Expand sidebar' : 'Collapse sidebar');
    }
  }

  function bindShell() {
    document.getElementById('btnDrawer').addEventListener('click', function () { setDrawer(true); });
    document.getElementById('btnProfile').addEventListener('click', function () { setDrawer(true); });
    document.getElementById('btnCloseDrawer').addEventListener('click', function () { setDrawer(false); });
    document.getElementById('scrim').addEventListener('click', function () { setDrawer(false); });
    document.getElementById('btnCollapse').addEventListener('click', function () {
      setCollapsed(appEl.getAttribute('data-collapsed') !== 'true');
    });
    document.getElementById('sidebar').addEventListener('click', function (e) {
      if (e.target.closest('a[data-nav]')) setDrawer(false);       // повторный клик по текущему пункту
      const tb = e.target.closest('[data-theme-set]');
      if (tb) Theme.set(tb.getAttribute('data-theme-set'));
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setDrawer(false);
    });
    window.addEventListener('hashchange', render);
    window.addEventListener('storage', function (e) {
      if (e.key === KEYS.theme && e.newValue) Theme.set(e.newValue);
      refreshBadges();
    });
    setCollapsed(appEl.getAttribute('data-collapsed') === 'true');
  }

  /* Бейджи и профиль */
  function setBadge(id, n) {
    document.querySelectorAll('[data-badge="' + id + '"]').forEach(function (el) {
      el.textContent = n > 99 ? '99+' : String(n);
      el.classList.toggle('hidden', !(n > 0));
      el.classList.toggle('inline-flex', n > 0);
    });
  }
    function refreshBadges() {
    setBadge('errors', Data.mistakesCount());
    if (window.SPVocab) setBadge('vocabulary', window.SPVocab.dueCount());
  }

  function paintUser() {
    const name = (userOverride && userOverride.name) || Data.profile().name;
    const email = userOverride && userOverride.email;
    const l1 = document.getElementById('userLine1');
    const l2 = document.getElementById('userLine2');
    const av = document.getElementById('userAv');
    if (!l1) return;
    l1.textContent = email || name;
    l2.textContent = email ? name : 'Not signed in';
    av.textContent = (String(email || name).trim().charAt(0) || 'E').toUpperCase();
        const pic = userOverride && userOverride.avatar;
    if (pic && /^(https:\/\/|data:image\/(jpeg|png|webp);base64,)/.test(pic)) {
      const letter = av.textContent;
      const img = document.createElement('img');
      img.alt = '';
      img.referrerPolicy = 'no-referrer';
      img.className = 'h-full w-full rounded-full object-cover';
      img.onerror = function () { av.textContent = letter; };
      img.src = pic;
      av.textContent = '';
      av.appendChild(img);
    }
  }

  /* Toast */
  let toastTimer = null;
  function toast(msg) {
    let t = document.getElementById('spToast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'spToast';
      t.setAttribute('role', 'status');
      t.className = 'fixed left-1/2 bottom-24 md:bottom-8 z-[70] rounded-xl border bg-raised px-4 py-2.5 text-[13px] font-medium shadow-xl';
      t.style.animation = 'toastin .25s ease both';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.hidden = true; }, 2400);
  }

  /* -------------------------------------------------------------------
     6. ВСПОМОГАТЕЛЬНЫЕ АНИМАЦИИ
     ------------------------------------------------------------------- */
  const reduceMotion = function () { return window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches; };

  function countUp(root) {
        // Тот же экран (например, сменили цель): сразу показываем итоговые значения
    if (root.classList.contains('sp-no-anim')) {
      root.querySelectorAll('[data-bar]').forEach(function (el) {
        el.style.transition = 'none';
        el.style.width = Math.max(0, Math.min(100, +el.getAttribute('data-bar') || 0)) + '%';
      });
      return;
    }
    root.querySelectorAll('[data-count]').forEach(function (el) {
      const to = +el.getAttribute('data-count') || 0;
      if (reduceMotion() || to === 0) { el.textContent = fmtNum(to); return; }
      const t0 = performance.now(), dur = 700;
      (function step(t) {
        const p = Math.min(1, (t - t0) / dur);
        el.textContent = fmtNum(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(step);
      })(t0);
    });
    requestAnimationFrame(function () {
      root.querySelectorAll('[data-bar]').forEach(function (el) {
        el.style.width = Math.max(0, Math.min(100, +el.getAttribute('data-bar') || 0)) + '%';
      });
    });
  }

  /* -------------------------------------------------------------------
     7. ЭКРАН DASHBOARD
     ------------------------------------------------------------------- */
  function buildHeatmap(weeks) {
    const days = Data.days();
    const today = startOfToday();
    const todayKey = isoLocal(today);
    const dow = (today.getDay() + 6) % 7;                       // Пн = 0
    const start = addDays(today, -((weeks - 1) * 7 + dow));
    const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let cells = '', months = '', lastMonth = -1, total = 0, active = 0;

    for (let w = 0; w < weeks; w++) {
      const mon = addDays(start, w * 7);
      const mm = mon.getMonth();
      const skipFirst = w === 0 && addDays(start, 7).getMonth() !== mm;   // не наезжать на следующую подпись
      if (mm !== lastMonth && !skipFirst) {
        months += '<span class="text-[10px] text-ink-mute whitespace-nowrap" style="grid-column:' + (w + 1) + '">' + MONTHS[mm] + '</span>';
      }
      lastMonth = mm;
      for (let d = 0; d < 7; d++) {
        const dt = addDays(start, w * 7 + d);
        if (dt > today) { cells += '<span class="hm hm-void"></span>'; continue; }
        const k = isoLocal(dt);
        const rec = days[k];
        const q = rec && rec.q ? +rec.q : 0;
        const ok = rec && rec.ok ? +rec.ok : 0;
        const lvl = q === 0 ? 0 : q < 5 ? 1 : q < 10 ? 2 : q < 20 ? 3 : 4;
        total += q;
        if (q > 0) active++;
        cells += '<button type="button" class="hm hm-' + lvl + (k === todayKey ? ' hm-today' : '') + '" data-d="' + fmtDate(dt, true) + '" data-q="' + q + '" data-ok="' + ok + '" aria-label="' + fmtDate(dt, true) + ': ' + q + ' questions"></button>';
      }
    }
    const html =
      '<div class="grid mb-1.5" style="grid-template-columns:repeat(' + weeks + ',minmax(0,1fr));gap:4px">' + months + '</div>' +
      '<div style="display:grid;grid-auto-flow:column;grid-template-rows:repeat(7,auto);grid-auto-columns:minmax(0,1fr);gap:4px">' + cells + '</div>';
    return { html: html, total: total, active: active };
  }
  /* -------------------------------------------------------------------
     7b. ДОПОЛНЕНИЕ DASHBOARD: Leaderboard Top 3 + Daily Challenge
     ------------------------------------------------------------------- */
  const LB_KEY = 'satpath_lb_period_v1';
  const DAILY_KEY = 'satpath_daily_v1';
  const SOLVER_SESSION_KEY = 'satpath_session_v1';   // тот же ключ, что в dataAdapter.js
  const SOLVER_IDX_KEY = 'satpath_solver_idx_v1';    // тот же ключ, что в solver.js

  // Тестовые игроки для демо-режима (?demo=1)
  const DEMO_BOARD = {
    weekly: [
      { name: 'Amelia R.', points: 1840 },
      { name: 'Daniel K.', points: 1625 },
      { name: 'Sofia M.',  points: 1410 }
    ],
    monthly: [
      { name: 'Daniel K.', points: 6920 },
      { name: 'Amelia R.', points: 6480 },
      { name: 'Sofia M.',  points: 5390 }
    ]
  };
  let boardOverride = null;   // SPShell.setLeaderboard({ weekly: [...], monthly: [...] }) — данные из Firestore
  let demoDaily = null;       // в демо-режиме Daily Challenge живёт только в памяти
    let lbPeriod = DEMO ? 'weekly' : 'monthly';
  const AV_TONES = ['bg-accent/15 text-accent', 'bg-success/15 text-success', 'bg-hl/20 text-hl', 'bg-danger/15 text-danger'];

  function boardRows(period) {
    const src = DEMO ? DEMO_BOARD : boardOverride;
    const list = src && Array.isArray(src[period]) ? src[period] : [];
    return list
      .filter(function (r) { return r && r.name; })
      .sort(function (a, b) { return (+b.points || 0) - (+a.points || 0); })
      .slice(0, 3);
  }

  function initials(name) {
    const p = String(name).trim().split(/\s+/).filter(Boolean);
    return ((p[0] ? p[0].charAt(0) : '') + (p[1] ? p[1].charAt(0) : '')).toUpperCase() || '?';
  }
  function dcHash(s) {
    let h = 2166136261;
    s = String(s);
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }

  function avatarHTML(row, first) {
    const size = first ? 'w-[68px] h-[68px] text-[22px]' : 'w-[52px] h-[52px] text-[17px]';
    if (!row) {
      return '<span class="grid place-items-center rounded-full border border-dashed text-ink-mute ' + size + '" aria-hidden="true">—</span>';
    }
    const ring = first ? ' ring-2 ring-accent ring-offset-2 ring-offset-surface' : '';
        if (row.avatar && /^(https?:\/\/|data:image\/)/i.test(String(row.avatar))) {
      return '<img src="' + esc(row.avatar) + '" alt="" class="rounded-full object-cover ' + size + ring + '" loading="lazy" referrerpolicy="no-referrer">';
    }
    const tone = AV_TONES[dcHash(row.name) % AV_TONES.length];
    return '<span class="grid place-items-center rounded-full font-semibold ' + size + ' ' + tone + ring + '" aria-hidden="true">' + esc(initials(row.name)) + '</span>';
  }

  function podiumSlotHTML(row, place) {
    const first = place === 1;
    const ped = first ? 'h-24 bg-accent/15 border-accent/40' : place === 2 ? 'h-16 bg-raised' : 'h-12 bg-raised';
    const label = ['', '1st', '2nd', '3rd'][place];
    return '<div role="listitem" class="flex min-w-0 flex-col items-center" aria-label="' + label + ': ' + (row ? esc(row.name) + ', ' + fmtNum(+row.points || 0) + ' points' : 'open spot') + '">' +
      (first ? '<i data-lucide="crown" class="mb-1.5 h-5 w-5 text-accent"></i>' : '') +
      avatarHTML(row, first) +
      '<div class="mt-2.5 w-full min-w-0 text-center">' +
        '<div class="truncate text-[13px] font-medium ' + (row ? '' : 'text-ink-mute') + '">' + (row ? esc(row.name) : 'Open spot') + '</div>' +
        '<div class="mt-0.5 text-[12px] text-ink-soft"><span class="num">' + (row ? fmtNum(+row.points || 0) : '—') + '</span>' + (row ? ' pts' : '') + '</div>' +
      '</div>' +
      '<div class="mt-3 grid w-full place-items-center rounded-t-xl border border-b-0 ' + ped + '">' +
        '<span class="num text-[18px] font-semibold ' + (first ? 'text-accent' : 'text-ink-soft') + '">' + place + '</span>' +
      '</div></div>';
  }
  function youLineHTML(period) {
    let pts = 0;
    if (DEMO) pts = period === 'monthly' ? 1260 : 420;
        else if (period === 'monthly' && boardOverride && boardOverride.me) pts = boardOverride.me.monthly;
    else if (window.SPData && window.SPData.stats) {
      const s = window.SPData.stats.points();
      pts = period === 'monthly' ? s.month : s.week;
    }
    return '<div class="mx-auto mt-4 flex max-w-[520px] items-center justify-between rounded-xl bg-raised px-4 py-3">' +
      '<span class="text-[12.5px] text-ink-soft">Your points · ' + (period === 'monthly' ? 'this month' : 'this week') + '</span>' +
      '<span class="num text-[15px] font-semibold">' + fmtNum(pts) + '</span></div>';
  }
  function podiumHTML(period) {
    const rows = boardRows(period);
    const note = (!DEMO && !rows.length)
      ? '<p class="mt-4 text-center text-[12.5px] text-ink-soft">Rankings will appear here once players start earning points.</p>'
      : '';
    // порядок на подиуме: 2-е слева, 1-е по центру (выше всех), 3-е справа
    return '<div class="mx-auto grid max-w-[520px] grid-cols-3 items-end gap-3 border-b sm:gap-6" role="list" aria-label="Top 3 players">' +
      podiumSlotHTML(rows[1], 2) + podiumSlotHTML(rows[0], 1) + podiumSlotHTML(rows[2], 3) +
      '</div>' + note + youLineHTML(period);
  }

  function periodButtonsHTML(period) {
        return (DEMO ? [['weekly', 'Weekly'], ['monthly', 'Monthly']] : [['monthly', 'Monthly']]).map(function (p) {
      return '<button type="button" data-lb="' + p[0] + '" aria-pressed="' + (period === p[0]) + '" ' +
        'class="h-11 sm:h-8 rounded-md px-3 text-[12.5px] font-medium text-ink-soft transition-colors hover:text-ink aria-pressed:bg-surface aria-pressed:text-ink aria-pressed:shadow-[0_0_0_1px_var(--c-hairline)]">' + p[1] + '</button>';
    }).join('');
  }

  function leaderboardHTML() {
    return '<section class="card rise p-5" style="--i:7" aria-labelledby="lbTitle">' +
      '<div class="mb-6 flex flex-wrap items-center justify-between gap-3">' +
        '<div class="flex min-w-0 items-center gap-2.5">' +
          '<h2 id="lbTitle" class="text-[15px] font-semibold">Leaderboard</h2>' +
          (DEMO ? '<span class="inline-flex h-5 items-center rounded-full bg-raised px-2 text-[11px] font-medium text-ink-soft">Demo players</span>' : '') +
        '</div>' +
        '<div class="flex items-center gap-2 sm:gap-3">' +
          '<div id="lbToggle" class="flex rounded-lg bg-raised p-0.5" role="group" aria-label="Leaderboard period">' + periodButtonsHTML(lbPeriod) + '</div>' +
          '<a href="#/leaderboard" class="inline-flex h-11 items-center gap-1 rounded px-1 text-[12.5px] font-medium text-accent hover:text-accent-hover sm:h-8">View all <i data-lucide="arrow-right" class="h-3.5 w-3.5"></i></a>' +
        '</div>' +
      '</div>' +
      '<div id="lbPodium">' + podiumHTML(lbPeriod) + '</div>' +
    '</section>';
  }

  /* Множитель за серию: ×1.0 в начале, +0.25 за каждые 3 дня серии, максимум ×2.0 */
  function streakMult(days) { return Math.min(2, 1 + Math.floor((+days || 0) / 3) * 0.25); }
  function fmtMult(m) { return '×' + m.toFixed(2).replace(/0$/, ''); }

  function dailyShellHTML(streakDays) {
    const mult = streakMult(streakDays);
    let sk = '';
    for (let i = 0; i < 4; i++) sk += '<div class="h-48 animate-pulse rounded-xl bg-raised" aria-hidden="true"></div>';
    return '<section class="card rise p-5" style="--i:8" aria-labelledby="dcTitle">' +
      '<div class="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">' +
        '<div class="min-w-0">' +
          '<h2 id="dcTitle" class="text-[15px] font-semibold">Daily Challenge</h2>' +
          '<p class="mt-1 text-[12.5px] text-ink-soft">2 Reading &amp; Writing + 2 Math questions · new set every day</p>' +
        '</div>' +
        '<span class="inline-flex h-7 items-center gap-1.5 rounded-full bg-accent/10 px-2.5 text-[12px] font-semibold text-accent" ' +
          'title="Your streak boosts Daily Challenge points: +0.25× every 3 days, up to ×2.0">' +
          '<i data-lucide="flame" class="h-3.5 w-3.5"></i>Streak multiplier <span class="num">' + fmtMult(mult) + '</span></span>' +
      '</div>' +
      '<div class="mt-4">' +
        '<div class="flex items-center justify-between gap-3 text-[12.5px]">' +
          '<span id="dcCount" class="num font-medium">0 of 4 answered</span>' +
          '<span id="dcNote" class="text-ink-soft"></span>' +
        '</div>' +
        '<div id="dcBarWrap" class="mt-2 h-1.5 overflow-hidden rounded-full bg-raised" role="progressbar" aria-valuemin="0" aria-valuemax="4" aria-valuenow="0" aria-label="Daily Challenge progress">' +
          '<div id="dcBar" class="h-full rounded-full bg-accent" style="width:0;transition:width .5s cubic-bezier(.2,.7,.2,1)"></div>' +
        '</div>' +
      '</div>' +
      '<div id="dcGrid" class="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2" aria-busy="true">' + sk + '</div>' +
    '</section>';
  }

  function dashExtrasHTML(streakDays) { return leaderboardHTML() + dailyShellHTML(streakDays); }

  /* 4 задачи дня: SPData.pick(...) если он есть в dataAdapter.js, иначе — тот же результат через SPData.query */
  function dailyPick(section, n, seed) {
    const D = window.SPData;
    if (!D) return [];
    if (typeof D.pick === 'function') {
      try {
        const r = D.pick({ section: section, count: n, seed: seed, status: 'unsolved' });
        const ids = (Array.isArray(r) ? r : [])
          .map(function (x) { return x && typeof x === 'object' ? x.id : x; })
          .filter(Boolean).slice(0, n);
        if (ids.length === n) return ids;
      } catch (e) { console.warn('[SPShell] SPData.pick failed, using fallback', e); }
    }
    let ids = D.query({ section: section, status: 'unsolved' });
    if (ids.length < n) ids = D.query({ section: section, status: 'all' });
    return ids
      .map(function (id) { return { id: id, h: dcHash(seed + '|' + section + '|' + id) }; })   // одинаково в течение дня
      .sort(function (a, b) { return a.h - b.h; })
      .slice(0, n)
      .map(function (x) { return x.id; });
  }

  function dcRich(s) {
    let t = String(s == null ? '' : s);
    t = t.replace(/<f>\s*([^<]*?)\s*\/\s*([^<]*?)\s*<\/f>/g, function (_, a, b) {
      return '<span class="dc-frac"><span>' + a + '</span><span>' + b + '</span></span>';
    });
    if (!/<(p|br|div|ul|ol|li|table|h\d)\b/i.test(t)) t = t.replace(/\r?\n/g, '<br>');
    return t;
  }

  function ensureDashStyle() {
    if (document.getElementById('dcStyle')) return;
    const s = document.createElement('style');
    s.id = 'dcStyle';
    s.textContent =
      '.dc-frac{display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;margin:0 2px;line-height:1.15;font-size:.92em}' +
      '.dc-frac>span:first-child{padding:0 3px;border-bottom:1.5px solid currentColor}' +
      '.dc-frac>span:last-child{padding:0 3px}' +
      '.dc-prose img{max-width:100%;height:auto}' +
      '.dc-prose table{border-collapse:collapse;margin:8px auto}' +
      '.dc-prose td,.dc-prose th{border:1px solid rgba(138,143,152,.4);padding:3px 8px;text-align:center}';
    document.head.appendChild(s);
  }

  function initDashExtras(root) {
    let alive = true;
    const SP = window.SPData || null;
    ensureDashStyle();

    /* ---------- Leaderboard: переключатель Weekly / Monthly ---------- */
    const lbToggle = root.querySelector('#lbToggle');
    const lbPodium = root.querySelector('#lbPodium');
    if (lbToggle && lbPodium) {
      lbToggle.addEventListener('click', function (e) {
        const b = e.target.closest('[data-lb]');
        if (!b) return;
        lbPeriod = b.getAttribute('data-lb') === 'monthly' ? 'monthly' : 'weekly';
        if (!DEMO) lsSet(LB_KEY, lbPeriod);
        lbToggle.querySelectorAll('[data-lb]').forEach(function (x) {
          x.setAttribute('aria-pressed', x.getAttribute('data-lb') === lbPeriod ? 'true' : 'false');
        });
        lbPodium.innerHTML = podiumHTML(lbPeriod);
        if (window.lucide) window.lucide.createIcons();
      });
    }

    /* ---------- Daily Challenge ---------- */
    const grid = root.querySelector('#dcGrid');
    if (!grid) return function () { alive = false; };

    const elCount = root.querySelector('#dcCount');
    const elNote = root.querySelector('#dcNote');
    const elBar = root.querySelector('#dcBar');
    const elBarWrap = root.querySelector('#dcBarWrap');
    const pending = {};      // выбранный, но ещё не проверенный ответ: { id: 'B' | '14.5' }
    let st = null;

    const getQ = function (id) { try { return SP.getQuestion(id); } catch (e) { return null; } };
    const persist = function (s) { if (DEMO) demoDaily = s; else lsSet(DAILY_KEY, JSON.stringify(s)); };

    function showEmpty(title, text) {
      grid.removeAttribute('aria-busy');
      grid.innerHTML =
        '<div class="rounded-xl border border-dashed px-6 py-10 text-center md:col-span-2">' +
          '<p class="text-[14px] font-semibold">' + esc(title) + '</p>' +
          '<p class="mx-auto mt-1.5 max-w-[420px] text-[12.5px] leading-relaxed text-ink-soft">' + esc(text) + '</p>' +
        '</div>';
    }

    function loadOrCreate() {
      const key = isoLocal(startOfToday());
      let s = DEMO ? demoDaily : jget(DAILY_KEY, null);
      const valid = s && s.date === key && Array.isArray(s.ids) && s.ids.length > 0 &&
        s.ids.every(function (id) { return !!getQ(id); });
      if (!valid) {
        const ids = dailyPick('rw', 2, key).concat(dailyPick('math', 2, key));
        if (!ids.length) return null;
        s = { date: key, ids: ids, ans: {}, done: false };
        persist(s);
      }
      if (!s.ans) s.ans = {};
      return s;
    }

    // Ответ на сегодня: либо дан здесь, либо в Solver (тогда он есть в SPData.progress за сегодня)
    function answerOf(id) {
      if (st.ans[id]) return st.ans[id];
      try {
        const p = SP.progress.get()[id];
        if (p && p.t >= startOfToday().getTime()) return { ok: p.r === 'ok', v: null, solver: true };
      } catch (e) {}
      return null;
    }

    function afterPaint(el) {
      if (window.lucide) { try { window.lucide.createIcons(); } catch (e) {} }
      if (window.renderMathInElement) {
        try {
          window.renderMathInElement(el, { delimiters: [{ left: '$$', right: '$$', display: true }, { left: '\\(', right: '\\)', display: false }, { left: '$', right: '$', display: false }], throwOnError: false });
        } catch (e) {}
      }
    }

    const DIFF = { easy: ['Easy', 'bg-success/10 text-success'], medium: ['Medium', 'bg-hl/15 text-hl'], hard: ['Hard', 'bg-danger/10 text-danger'] };

    function answerHTML(id, Q, a) {
      if (Q.type === 'mcq') {
        const sel = pending[id];
        return '<div class="mt-3 space-y-2" role="group" aria-label="Answer choices">' + Q.choices.map(function (c) {
          let cls = 'border bg-surface hover:bg-raised', letter = 'border text-ink-soft';
          if (a) {
            if (c.key === Q.correctAnswer) { cls = 'border-success bg-success/10'; letter = 'bg-success border-success text-white'; }
            else if (a.v === c.key) { cls = 'border-danger bg-danger/10'; letter = 'bg-danger border-danger text-white'; }
            else cls = 'border bg-surface opacity-70';
          } else if (sel === c.key) { cls = 'border-accent bg-accent/10'; letter = 'bg-accent border-accent text-white'; }
          return '<button type="button" data-dc="pick" data-id="' + esc(id) + '" data-k="' + esc(c.key) + '" ' + (a ? 'disabled ' : '') +
            'aria-pressed="' + (sel === c.key) + '" class="flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors ' + cls + '">' +
            '<span class="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[12px] font-semibold ' + letter + '">' + esc(c.key) + '</span>' +
            '<span class="dc-prose min-w-0 flex-1 text-[14px] leading-snug">' + dcRich(c.text) + '</span></button>';
        }).join('') + '</div>';
      }
      return '<div class="mt-3">' +
        '<label class="sr-only" for="dcIn-' + esc(id) + '">Your answer</label>' +
        '<input id="dcIn-' + esc(id) + '" data-dc="spr" data-id="' + esc(id) + '" type="text" inputmode="text" autocomplete="off" autocapitalize="off" spellcheck="false" maxlength="16" ' +
          'placeholder="Enter your answer" value="' + esc(a && a.v != null ? a.v : (pending[id] || '')) + '" ' + (a ? 'disabled ' : '') +
          'class="h-11 w-full rounded-xl border bg-surface px-3 text-[15px] num outline-none focus:border-accent disabled:opacity-70" />' +
        '<p class="mt-1.5 text-[11.5px] text-ink-mute">Fractions (3/4) and decimals (0.75) are accepted.</p></div>';
    }

    function resultHTML(Q, a) {
      if (!a) return '';
      const ok = !!a.ok;
      let detail = '';
      if (Q.type === 'spr') {
        detail = 'Accepted answers: <span class="num">' + (Q.acceptedAnswers && Q.acceptedAnswers.length ? Q.acceptedAnswers.map(esc).join(', ') : esc(Q.correctAnswer)) + '</span>';
      } else if (!ok) {
        detail = 'Correct answer: <b>' + esc(Q.correctAnswer) + '</b>';
      }
      if (a.solver) detail += (detail ? ' · ' : '') + 'Answered in Solver';
      return '<div role="status" class="mt-3 rounded-lg border px-3 py-2.5 ' + (ok ? 'border-success/40 bg-success/10' : 'border-danger/40 bg-danger/10') + '">' +
        '<div class="text-[13.5px] font-semibold ' + (ok ? 'text-success' : 'text-danger') + '">' + (ok ? 'Correct' : 'Not quite') + '</div>' +
        (detail ? '<div class="mt-0.5 text-[12.5px] text-ink-soft">' + detail + '</div>' : '') +
      '</div>';
    }

    function cardHTML(id, i) {
      const Q = getQ(id);
      if (!Q) return '';
      const a = answerOf(id);
      const isMath = Q.section === 'math';
      const diff = String(Q.difficulty || '').toLowerCase();
      const crumbs = [isMath ? 'Math' : 'Reading & Writing', Q.skill].filter(Boolean).map(esc).join(' · ');
      const passage = (!isMath && Q.passage && String(Q.passage).trim())
        ? '<details class="mt-3 rounded-lg border bg-surface"><summary class="flex min-h-[44px] cursor-pointer select-none items-center px-3 text-[12.5px] font-medium text-ink-soft hover:text-ink">Passage</summary>' +
          '<div class="dc-prose px-3 pb-3 text-[13.5px] leading-relaxed">' + dcRich(Q.passage) + '</div></details>'
        : '';
      const expl = (a && String(Q.explanation || '').trim())
        ? '<details class="mt-3 rounded-lg border bg-surface"><summary class="flex min-h-[44px] cursor-pointer select-none items-center px-3 text-[12.5px] font-medium text-ink-soft hover:text-ink">Explanation</summary>' +
          '<div class="dc-prose px-3 pb-3 text-[13.5px] leading-relaxed">' + dcRich(Q.explanation) + '</div></details>'
        : '';

      return '<article class="flex flex-col rounded-xl border bg-canvas/40 p-4" data-i="' + i + '" data-id="' + esc(id) + '">' +
        '<div class="flex items-center gap-2">' +
          '<span class="num grid h-6 w-6 shrink-0 place-items-center rounded-full bg-raised text-[11.5px] text-ink-soft">' + (i + 1) + '</span>' +
          '<span class="min-w-0 truncate text-[12px] text-ink-soft">' + crumbs + '</span>' +
          (DIFF[diff] ? '<span class="inline-flex h-5 shrink-0 items-center rounded-full px-2 text-[11px] font-semibold ' + DIFF[diff][1] + '">' + DIFF[diff][0] + '</span>' : '') +
          '<span class="flex-1"></span>' +
          (a ? '<span class="grid h-5 w-5 shrink-0 place-items-center rounded-full text-white ' + (a.ok ? 'bg-success' : 'bg-danger') + '"><i data-lucide="' + (a.ok ? 'check' : 'x') + '" class="h-3 w-3"></i></span>' : '') +
        '</div>' +
        passage +
        '<div class="dc-prose mt-3 text-[14.5px] leading-relaxed">' + dcRich(Q.prompt) + '</div>' +
        answerHTML(id, Q, a) +
        resultHTML(Q, a) +
        expl +
        '<div class="mt-4 flex flex-wrap items-center gap-2">' +
          (a ? '' : '<button type="button" data-dc="check" data-i="' + i + '" class="inline-flex h-11 items-center justify-center rounded-lg bg-accent px-4 text-[13px] font-semibold text-white transition-colors hover:bg-accent-hover sm:h-9">Check</button>') +
          '<button type="button" data-dc="solver" data-i="' + i + '" class="inline-flex h-11 items-center gap-1.5 rounded-lg border px-3 text-[13px] font-medium text-ink-soft transition-colors hover:bg-raised hover:text-ink sm:h-9">Open in Solver<i data-lucide="arrow-up-right" class="h-3.5 w-3.5"></i></button>' +
        '</div>' +
      '</article>';
    }

    // Перерисовать одну карточку, сохранив раскрытые <details> и фокус
    function paintCard(i, focusSel) {
      const old = grid.querySelector('[data-i="' + i + '"]');
      if (!old) return;
      const flags = Array.prototype.map.call(old.querySelectorAll('details'), function (d) { return d.open; });
      const tmp = document.createElement('div');
      tmp.innerHTML = cardHTML(st.ids[i], i);
      const nu = tmp.firstElementChild;
      if (!nu) return;
      nu.querySelectorAll('details').forEach(function (d, k) { if (flags[k]) d.open = true; });
      old.replaceWith(nu);
      afterPaint(nu);
      if (focusSel) { const f = nu.querySelector(focusSel); if (f) { try { f.focus({ preventScroll: true }); } catch (e) {} } }
    }

    function paintSummary(announce) {
      const total = st.ids.length;
      let done = 0, ok = 0;
      st.ids.forEach(function (id) { const a = answerOf(id); if (a) { done++; if (a.ok) ok++; } });
      elCount.textContent = done + ' of ' + total + ' answered';
      elBar.style.width = (total ? Math.round(done / total * 100) : 0) + '%';
      elBarWrap.setAttribute('aria-valuemax', String(total));
      elBarWrap.setAttribute('aria-valuenow', String(done));
      elNote.textContent = (total && done === total) ? ok + ' of ' + total + ' correct' : '';
      if (total && done === total && !st.done) {
        st.done = true;
        persist(st);
        if (announce) toast('Daily Challenge complete · ' + ok + ' of ' + total + ' correct');
        if (!DEMO) {
          // Точка интеграции для начисления очков в Firebase: window.addEventListener('sp:daily-complete', e => ...)
          try {
            window.dispatchEvent(new CustomEvent('sp:daily-complete', { detail: { date: st.date, correct: ok, total: total, multiplier: streakMult(Data.streak().current) } }));
          } catch (e) {}
        }
      }
    }

    function check(i) {
      const id = st.ids[i], Q = getQ(id);
      if (!Q || answerOf(id)) return;
      const raw = Q.type === 'mcq' ? pending[id] : String(pending[id] || '').trim();
      if (!raw) { toast(Q.type === 'mcq' ? 'Select an answer first.' : 'Enter your answer first.'); return; }
      let ok = false;
      try { ok = !!SP.checkAnswer(Q, raw); } catch (e) {}
      st.ans[id] = { v: raw, ok: ok, t: Date.now() };
      if (!DEMO) { try { SP.progress.record(id, ok); } catch (e) { console.error('[SPShell] progress.record', e); } }
      persist(st);
      paintCard(i);
      paintSummary(true);
    }

    function openSolver(i) {
      if (!SP.solverReady) { toast('The Solver is not connected yet'); return; }
      let sess = null;
      try {
        sess = SP.startSession({ section: 'all', status: 'all' });
        // подменяем набор вопросов на 4 задачи дня (тот же объект лежит в SPData, solver.js читает его оттуда)
        sess.ids = st.ids.slice();
        sess.title = 'Daily Challenge';
        sess.section = 'all'; sess.domain = null; sess.skill = null; sess.shuffled = false;
      } catch (e) { console.error('[SPShell] startSession', e); }
      if (!sess) { toast('Could not open the Solver'); return; }
      try {
        sessionStorage.setItem(SOLVER_SESSION_KEY, JSON.stringify(sess));
        sessionStorage.setItem(SOLVER_IDX_KEY, JSON.stringify({ sid: sess.id, idx: i }));
      } catch (e) {}
      navigate('solver');
    }

    grid.addEventListener('click', function (e) {
      const b = e.target.closest('[data-dc]');
      if (!b || b.disabled || !st) return;
      const act = b.getAttribute('data-dc');
      if (act === 'pick') {
        const card = b.closest('[data-i]');
        pending[b.getAttribute('data-id')] = b.getAttribute('data-k');
        paintCard(+card.getAttribute('data-i'), '[data-k="' + b.getAttribute('data-k') + '"]');
      } else if (act === 'check') check(+b.getAttribute('data-i'));
      else if (act === 'solver') openSolver(+b.getAttribute('data-i'));
    });
    grid.addEventListener('input', function (e) {
      const t = e.target;
      if (t && t.getAttribute && t.getAttribute('data-dc') === 'spr') pending[t.getAttribute('data-id')] = t.value;
    });
    grid.addEventListener('keydown', function (e) {
      const t = e.target;
      if (e.key === 'Enter' && t && t.getAttribute && t.getAttribute('data-dc') === 'spr' && st) {
        const card = t.closest('[data-i]');
        if (card) { e.preventDefault(); check(+card.getAttribute('data-i')); }
      }
    });

    function setup() {
      if (!SP || !(SP.size() > 0)) {
        showEmpty('Daily Challenge is not available yet', 'The question bank is empty or still missing. Add theory.js, math-questions.js and rw-questions.js next to the page.');
        return;
      }
      st = loadOrCreate();
      if (!st || !st.ids.length) { showEmpty('No questions for today', 'Could not pick questions from the bank.'); return; }
      grid.removeAttribute('aria-busy');
      grid.innerHTML = st.ids.map(cardHTML).join('');
      afterPaint(grid);
      paintSummary(false);
    }

    if (!SP || typeof SP.load !== 'function') {
      showEmpty('Daily Challenge is not available yet', 'dataAdapter.js is not connected.');
    } else {
      SP.load().then(function () { if (alive) setup(); }, function () { if (alive) showEmpty('Daily Challenge is not available yet', 'The question bank could not be loaded.'); });
    }

    return function () { alive = false; };
  }
  function viewDashboard(root) {
    const prof = Data.profile();
    const streak = Data.streak();
    const acc = Data.accuracy();
    const score = Data.score();
    const goal = Data.goal();
    const exam = Data.exam();
    const errs = Data.mistakesCount();
    const week = Data.last7();

    const h = new Date().getHours();
    const greet = h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
    const sub = streak.current > 0
      ? 'You are on a ' + streak.current + '-day streak. Solve a few more questions to keep it going.'
      : 'Solve a few questions today to start your streak.';

    // --- KPI: Days to your SAT
    let daysLeft = null;
    if (exam) daysLeft = Math.round((exam - startOfToday()) / 864e5);
    const daysShown = daysLeft === null ? null : Math.max(0, daysLeft);
    const examLine = exam
      ? (daysLeft < 0 ? 'Date has passed — pick the next one' : fmtDate(exam, true))
      : 'Pick your test date';

    const examChips = SAT_DATE_PLACEHOLDERS.map(function (iso) {
      return '<button type="button" data-date="' + iso + '" class="w-full text-left h-9 px-3 rounded-lg text-[13px] hover:bg-surface transition-colors">' + fmtDate(parseISO(iso), true) + '</button>';
    }).join('');

    // --- KPI: Current Score
    let scoreHTML, scoreBar = 0, scoreSub;
    if (score) {
      scoreHTML = '<span class="num text-[34px] leading-none font-semibold tracking-tight" data-count="' + score.total + '">' + fmtNum(score.total) + '</span>' +
                  '<span class="num text-[13px] text-ink-soft">/ ' + fmtNum(goal) + '</span>';
      scoreBar = Math.round(score.total / goal * 100);
      const left = goal - score.total;
      scoreSub = left > 0 ? fmtNum(left) + ' points to your goal' : 'Goal reached — nice work';
    } else {
      scoreHTML = '<span class="num text-[34px] leading-none font-semibold tracking-tight text-ink-mute">—</span>' +
                  '<span class="num text-[13px] text-ink-soft">/ ' + fmtNum(goal) + '</span>';
      scoreSub = 'Take a practice test to see your score';
    }

    // --- Heatmap
    const mq = window.matchMedia ? matchMedia('(min-width: 640px)') : { matches: true };
    const hm = buildHeatmap(mq.matches ? 26 : 16);

    // --- Quick actions
    const quick = [
      { href: 'question-bank',  icon: 'library-big', title: 'Question Bank',  sub: 'Practice by topic' },
      { href: 'errors',         icon: 'rotate-ccw',  title: 'Review Queue',   sub: errs > 0 ? errs + ' to redo' : 'Nothing to redo' },
      { href: 'practice-tests', icon: 'file-check',  title: 'Practice Tests', sub: 'Full Bluebook exams' },
      { href: 'errors?filter=saved', icon: 'bookmark', title: 'Saved',        sub: 'Bookmarked questions' }
    ].map(function (a) {
      return '<a href="#/' + a.href + '" class="card card-link group flex flex-col gap-3 p-4 bg-canvas/40">' +
        '<span class="w-9 h-9 rounded-lg bg-raised grid place-items-center text-accent"><i data-lucide="' + a.icon + '" class="w-[18px] h-[18px]"></i></span>' +
        '<span class="min-w-0"><span class="block text-[13.5px] font-semibold truncate">' + a.title + '</span>' +
        '<span class="block text-[12px] text-ink-soft truncate mt-0.5">' + a.sub + '</span></span></a>';
    }).join('');

    root.innerHTML =
      '<div class="mx-auto w-full max-w-[1180px] px-4 md:px-8 py-6 md:py-10 space-y-6">' +

        /* Шапка */
        '<div class="rise flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4" style="--i:0">' +
          '<div class="min-w-0">' +
            '<h1 class="text-[26px] md:text-[30px] font-semibold tracking-tight">' + greet + ', <span class="text-ink-soft">' + esc(prof.name) + '</span></h1>' +
            '<p class="mt-1.5 text-[14px] text-ink-soft">' + esc(sub) + '</p>' +
          '</div>' +
          '<a href="#/question-bank" class="btn-pill shrink-0 self-start sm:self-auto">Solve questions <i data-lucide="arrow-right" class="w-4 h-4"></i></a>' +
        '</div>' +

        /* KPI */
'<div class="relative z-20 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">' +

          /* Days to SAT */
          '<section class="card rise relative p-5" style="--i:1">' +
            '<div class="flex items-center justify-between gap-2">' +
              '<span class="kpi-label"><i data-lucide="calendar-days" class="w-4 h-4"></i>Days to your SAT</span>' +
              '<button type="button" id="btnExam" class="text-[12px] font-medium text-accent hover:text-accent-hover rounded px-1 -mr-1" aria-haspopup="true" aria-expanded="false">Change</button>' +
            '</div>' +
            '<div class="mt-5 flex items-baseline gap-2">' +
              (daysShown === null
                ? '<span class="num text-[34px] leading-none font-semibold text-ink-mute">—</span>'
                : '<span class="num text-[34px] leading-none font-semibold tracking-tight" data-count="' + daysShown + '">' + daysShown + '</span><span class="text-[13px] text-ink-soft">days</span>') +
            '</div>' +
            '<p class="mt-3 text-[12.5px] text-ink-soft">' + esc(examLine) + '</p>' +
            '<div id="examPop" hidden class="absolute right-3 top-12 z-20 w-[240px] rounded-xl border bg-raised p-2 shadow-2xl">' +
              '<div class="px-3 pt-1.5 pb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-mute">Test date</div>' +
              examChips +
              '<div class="mt-1 border-t pt-2 px-1 pb-1">' +
                '<label class="block px-2 pb-1 text-[11.5px] text-ink-soft" for="examInput">Custom date</label>' +
                '<input id="examInput" type="date" min="' + isoLocal(startOfToday()) + '" class="w-full h-9 rounded-lg border bg-surface px-2 text-[13px] text-ink outline-none focus:border-accent" />' +
              '</div>' +
            '</div>' +
          '</section>' +

          /* Current Score */
          '<section class="card rise relative p-5" style="--i:2">' +
            '<div class="flex items-center justify-between gap-2">' +
              '<span class="kpi-label"><i data-lucide="target" class="w-4 h-4"></i>Current Score</span>' +
              '<button type="button" id="btnGoal" class="text-[12px] font-medium text-accent hover:text-accent-hover rounded px-1 -mr-1" aria-haspopup="true" aria-expanded="false">Goal</button>' +
            '</div>' +
            '<div class="mt-5 flex items-baseline gap-2">' + scoreHTML + '</div>' +
            '<div class="mt-3.5 h-1.5 rounded-full bg-raised overflow-hidden" role="progressbar" aria-valuemin="0" aria-valuemax="' + goal + '" aria-valuenow="' + (score ? score.total : 0) + '" aria-label="Progress to score goal">' +
              '<div class="h-full rounded-full bg-accent" style="width:0;transition:width .8s cubic-bezier(.2,.7,.2,1)" data-bar="' + scoreBar + '"></div>' +
            '</div>' +
            '<p class="mt-3 text-[12.5px] text-ink-soft">' + esc(scoreSub) + '</p>' +
            '<div id="goalPop" hidden class="absolute right-3 top-12 z-20 w-[220px] rounded-xl border bg-raised p-2 shadow-2xl">' +
              '<div class="px-3 pt-1.5 pb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-mute">Target score</div>' +
              '<div class="grid grid-cols-2 gap-1 px-1">' +
                [1300, 1400, 1500, 1550, 1600].map(function (v) {
                  return '<button type="button" data-goal="' + v + '" class="h-8 rounded-lg text-[13px] num font-medium ' + (goal === v ? 'bg-accent text-white' : 'hover:bg-surface text-ink-soft hover:text-ink') + ' transition-colors">' + v + '</button>';
                }).join('') +
              '</div>' +
              '<div class="mt-2 border-t pt-2 px-1 pb-1">' +
                '<label class="block px-1 pb-1 text-[11.5px] text-ink-soft" for="goalInput">Custom (400–1600)</label>' +
                '<div class="flex gap-1.5">' +
                  '<input id="goalInput" type="number" min="400" max="1600" step="10" value="' + goal + '" class="w-full h-9 rounded-lg border bg-surface px-2.5 text-[13px] num text-ink outline-none focus:border-accent" />' +
                  '<button type="button" id="goalSave" class="h-9 px-3 rounded-lg bg-accent hover:bg-accent-hover text-white text-[12.5px] font-medium shrink-0">OK</button>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</section>' +
          /* Day Streak */
          '<section class="card rise p-5" style="--i:3">' +
            '<div class="kpi-label"><i data-lucide="flame" class="w-4 h-4"></i>Day Streak</div>' +
            '<div class="mt-5 flex items-baseline gap-2">' +
              '<span class="num text-[34px] leading-none font-semibold tracking-tight" data-count="' + streak.current + '">' + streak.current + '</span>' +
              '<span class="text-[13px] text-ink-soft">' + (streak.current === 1 ? 'day' : 'days') + '</span>' +
              '<span class="ml-auto text-[12px] text-ink-mute">Best ' + streak.best + '</span>' +
            '</div>' +
            '<div class="mt-3.5 flex items-center justify-between" aria-label="Last 7 days">' +
              week.map(function (d) {
                return '<div class="flex flex-col items-center gap-1.5">' +
                  '<span class="w-7 h-7 rounded-full grid place-items-center ' +
                    (d.active ? 'bg-accent text-white' : 'bg-raised text-ink-mute') +
                    (d.today ? ' ring-2 ring-accent/40 ring-offset-2 ring-offset-surface' : '') + '">' +
                    (d.active ? '<i data-lucide="check" class="w-3.5 h-3.5"></i>' : '') + '</span>' +
                  '<span class="text-[10px] text-ink-mute">' + d.label + '</span></div>';
              }).join('') +
            '</div>' +
          '</section>' +

          /* Accuracy */
          '<section class="card rise p-5" style="--i:4">' +
            '<div class="kpi-label"><i data-lucide="percent" class="w-4 h-4"></i>Accuracy</div>' +
            '<div class="mt-5 flex items-baseline gap-1">' +
              '<span class="num text-[34px] leading-none font-semibold tracking-tight" data-count="' + acc.pct + '">' + acc.pct + '</span>' +
              '<span class="num text-[18px] text-ink-soft">%</span>' +
            '</div>' +
            '<div class="mt-3.5 h-1.5 rounded-full bg-raised overflow-hidden" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + acc.pct + '" aria-label="Accuracy">' +
              '<div class="h-full rounded-full bg-success" style="width:0;transition:width .8s cubic-bezier(.2,.7,.2,1)" data-bar="' + acc.pct + '"></div>' +
            '</div>' +
            '<p class="mt-3 text-[12.5px] text-ink-soft">' + (acc.q ? fmtNum(acc.ok) + ' of ' + fmtNum(acc.q) + ' solved correctly' : 'No questions solved yet') + '</p>' +
          '</section>' +
        '</div>' +

        /* Нижняя сетка */
        '<div class="grid grid-cols-1 lg:grid-cols-3 gap-4">' +

          '<section class="card rise lg:col-span-2 p-5" style="--i:5">' +
            '<div class="flex flex-wrap items-center justify-between gap-2 mb-4">' +
              '<h2 class="text-[15px] font-semibold">Practice Activity</h2>' +
              '<span id="hmSummary" class="text-[12.5px] text-ink-soft">' + fmtNum(hm.total) + ' questions · ' + hm.active + ' active days</span>' +
            '</div>' +
            '<div id="hmWrap">' + hm.html + '</div>' +
            '<div class="mt-4 flex items-center justify-end gap-1.5 text-[11px] text-ink-mute">Less' +
              '<span class="hm" style="width:12px"></span><span class="hm hm-1" style="width:12px"></span><span class="hm hm-2" style="width:12px"></span><span class="hm hm-3" style="width:12px"></span><span class="hm hm-4" style="width:12px"></span>More</div>' +
          '</section>' +

          '<section class="card rise p-5" style="--i:6">' +
            '<h2 class="text-[15px] font-semibold mb-4">Quick Actions</h2>' +
                        '<div class="grid grid-cols-2 gap-3">' + quick + '</div>' +
          '</section>' +
        '</div>' +

        /* Leaderboard Top 3 + Daily Challenge */
        dashExtrasHTML(streak.current) +
      '</div>';

    /* ---------- интерактив ---------- */
    countUp(root);
    const extrasCleanup = initDashExtras(root);
    // Выбор цели (Goal)
    const btnGoal = root.querySelector('#btnGoal');
    const goalPop = root.querySelector('#goalPop');
    const closeGoal = function () { goalPop.hidden = true; btnGoal.setAttribute('aria-expanded', 'false'); };
    btnGoal.addEventListener('click', function (e) {
      e.stopPropagation();
      closePop(); // закрыть календарь, если открыт
      goalPop.hidden = !goalPop.hidden;
      btnGoal.setAttribute('aria-expanded', goalPop.hidden ? 'false' : 'true');
    });
    goalPop.addEventListener('click', function (e) {
      e.stopPropagation();
      const b = e.target.closest('[data-goal]');
      if (b) { Data.setGoal(b.getAttribute('data-goal')); render(); }
    });
    const saveCustomGoal = function () {
      const val = root.querySelector('#goalInput').value;
      if (val && +val >= 400 && +val <= 1600) { Data.setGoal(val); render(); }
    };
    root.querySelector('#goalSave').addEventListener('click', saveCustomGoal);
    root.querySelector('#goalInput').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') saveCustomGoal();
    });
    // Выбор даты SAT
    const btnExam = root.querySelector('#btnExam');
    const pop = root.querySelector('#examPop');
    const closePop = function () { pop.hidden = true; btnExam.setAttribute('aria-expanded', 'false'); };
    btnExam.addEventListener('click', function (e) {
      e.stopPropagation();
      pop.hidden = !pop.hidden;
      btnExam.setAttribute('aria-expanded', pop.hidden ? 'false' : 'true');
    });
    pop.addEventListener('click', function (e) {
      e.stopPropagation();
      const b = e.target.closest('[data-date]');
      if (b) { Data.setExam(b.getAttribute('data-date')); render(); }
    });
    root.querySelector('#examInput').addEventListener('change', function (e) {
      if (/^\d{4}-\d{2}-\d{2}$/.test(e.target.value)) { Data.setExam(e.target.value); render(); }
    });
    const onDocClick = function () { if (!pop.hidden) closePop(); };
    const onKey = function (e) { if (e.key === 'Escape' && !pop.hidden) { closePop(); btnExam.focus(); } };
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKey);

    // Тултип heatmap
    const tip = document.createElement('div');
    tip.className = 'fixed z-[60] pointer-events-none rounded-lg border bg-raised px-2.5 py-1.5 text-[12px] shadow-xl whitespace-nowrap';
    tip.hidden = true;
    document.body.appendChild(tip);
    let tipTimer = null;
    const hmWrap = root.querySelector('#hmWrap');
    const showTip = function (cell) {
      const q = +cell.getAttribute('data-q'), ok = +cell.getAttribute('data-ok');
      tip.innerHTML = '<span class="font-medium">' + esc(cell.getAttribute('data-d')) + '</span><span class="text-ink-soft"> · ' +
        (q ? q + ' question' + (q === 1 ? '' : 's') + ' · ' + Math.round(ok / q * 100) + '%' : 'No activity') + '</span>';
      tip.hidden = false;
      const r = cell.getBoundingClientRect();
      tip.style.left = Math.max(8, Math.min(window.innerWidth - tip.offsetWidth - 8, r.left + r.width / 2 - tip.offsetWidth / 2)) + 'px';
      tip.style.top = Math.max(8, r.top - tip.offsetHeight - 8) + 'px';
    };
    hmWrap.addEventListener('mouseover', function (e) { const c = e.target.closest('.hm[data-d]'); if (c) showTip(c); });
    hmWrap.addEventListener('mouseout', function () { tip.hidden = true; });
    hmWrap.addEventListener('click', function (e) {       // touch: тап показывает подсказку
      const c = e.target.closest('.hm[data-d]');
      if (!c) return;
      showTip(c);
      clearTimeout(tipTimer);
      tipTimer = setTimeout(function () { tip.hidden = true; }, 2200);
    });

    // Перестроить heatmap при переходе через брейкпоинт
    const onMq = function () {
      const n = buildHeatmap(mq.matches ? 26 : 16);
      hmWrap.innerHTML = n.html;
      root.querySelector('#hmSummary').textContent = fmtNum(n.total) + ' questions · ' + n.active + ' active days';
    };
    if (mq.addEventListener) mq.addEventListener('change', onMq);

    // cleanup при уходе с экрана
    return function () {
      document.removeEventListener('click', onDocClick);
      if (extrasCleanup) extrasCleanup();
      document.removeEventListener('keydown', onKey);
      if (mq.removeEventListener) mq.removeEventListener('change', onMq);
      clearTimeout(tipTimer);
      tip.remove();
    };
  }

  /* -------------------------------------------------------------------
     8. ЭКРАНЫ-ПУСТЫШКИ (будут заменены следующими файлами)
     ------------------------------------------------------------------- */
  const SOON = {
    'question-bank':  { icon: 'library-big', text: 'Reading & Writing and Math banks with status filters, domains and sub-topics.' },
    'leaderboard':    { icon: 'trophy',      text: 'Your rank, points and accuracy compared with other students.' },
    'vocabulary':     { icon: 'book-open',   text: 'Flashcards, context practice and spaced repetition for SAT words.' },
    'practice-tests': { icon: 'file-check',  text: 'Full-length adaptive tests in the Bluebook interface.' },
    'blitz':          { icon: 'zap',         text: 'Fast timed drills to build speed and accuracy under pressure.' },
    'metrics':        { icon: 'bar-chart-3', text: 'Score estimate, activity trends and accuracy by domain.' },
    'errors':         { icon: 'bookmark',    text: 'Your error notebook: saved questions and mistakes to redo.' }
  };

  function comingSoon(id) {
    const m = SOON[id];
    const nav = findNav(id);
    return {
      render: function (root) {
        root.innerHTML =
          '<div class="rise mx-auto max-w-[460px] px-6 py-24 text-center">' +
            '<div class="mx-auto w-12 h-12 rounded-xl bg-raised grid place-items-center text-accent"><i data-lucide="' + m.icon + '" class="w-6 h-6"></i></div>' +
            '<h1 class="mt-5 text-[22px] font-semibold tracking-tight">' + esc(nav.item.label) + '</h1>' +
            '<p class="mt-2 text-[14px] text-ink-soft leading-relaxed">' + esc(m.text) + '</p>' +
            '<span class="mt-5 inline-flex items-center h-7 px-3 rounded-full bg-accent/10 text-accent text-[12px] font-medium">Coming soon</span>' +
            '<div class="mt-8"><a href="#/dashboard" class="text-[13px] font-medium text-accent hover:text-accent-hover">← Back to Dashboard</a></div>' +
          '</div>';
      }
    };
  }

  /* -------------------------------------------------------------------
     9. СТАРТ
     ------------------------------------------------------------------- */
  function start() {
    if (started) return;
    started = true;
    buildShell();
    bindShell();
    render();
  }

  register('dashboard', { render: viewDashboard });
  Object.keys(SOON).forEach(function (id) { register(id, comingSoon(id)); });

  // Публичный API для следующих файлов (question-bank.js, blitz.js, solver.js ...)
  window.SPShell = {
    register: register,
    navigate: navigate,
    setBadge: setBadge,
    toast: toast,
    theme: Theme,
    data: Data,
    refresh: function () { refreshBadges(); paintUser(); if (started) render(); },
    // Привязка Firebase-пользователя:  SPShell.setUser({ name: u.displayName, email: u.email })
    setUser: function (u) { userOverride = u || null; paintUser(); },
    // SPShell.setLeaderboard({ weekly: [{ name, points, avatar? }], monthly: [...] })
    setLeaderboard: function (b) { boardOverride = b || null; if (currentId === 'dashboard') render(); }
  };

  // Скрипты экранов подключаются после shell.js — стартуем, когда DOM готов и они успели зарегистрироваться
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
