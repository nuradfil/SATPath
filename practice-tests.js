/* =====================================================================
   SATPath — Practice Tests (practice-tests.js)
   ---------------------------------------------------------------------
   Подключать ПОСЛЕ shell.js и dataAdapter.js (и после highlighter.js, если он есть).

   Маршруты, которые регистрирует файл:
     #/practice-tests            каталог тестов + модалка выбора модулей
     #/exam?t=3                  Bluebook-режим (full screen, layout: 'full')
     #/pt-results?t=3            результаты и разбор ошибок

   Что внутри:
     • 8 детерминированных тестов (одинаковые для всех пользователей).
       Вопросы берутся из SPData (Math-генераторы + R&W-база + базовые задачи)
       по SAT-схеме: R&W 27 + 27, Math 22 + 22. Module 2 адаптивный.
     • Модалка запуска: Full test или любые модули, Accommodations (время ×1.5 / ×2,
       доп. перерывы), опции Full screen и Adaptive.
     • Bluebook-режим: таймер, Pause/Hide, Directions, Highlights & Notes, Calculator (Desmos),
       Reference, Mark for review, ABC-зачёркивание, навигатор, Check your work, автосохранение.
     • Экран перерыва 10:00 (+ дыхательное упражнение), короткие паузы между модулями.
     • Результаты: балл, модули, домены, темп, разбор каждой задачи.

   Хранилище (localStorage, с fallback в память):
     satpath_pt_results_v1   совместимо со старым сайтом и Dashboard ({ t: { r:{score,a,b,hard}, m:{...}, total } })
     satpath_pt_detail_v2    подробности модулей (ответы, время, флажки)
     satpath_pt_session_v2   незавершённые тесты (Continue test)
     satpath_pt_prefs_v1     настройки модалки

   Точка интеграции Firebase:
     window.addEventListener('sp:pt-complete', e => ...)   e.detail = { t, modules, scores }

   Свой каталог (необязательно) — ДО подключения файла:
     window.SP_PT_CATALOG = [ { t: 1, name: 'My test', tilt: 'standard' }, ... ];
   ===================================================================== */
(function () {
  'use strict';

  const Shell = window.SPShell;
  const Data = window.SPData;
  if (!Shell || !Data) {
    console.error('[practice-tests] Подключите shell.js и dataAdapter.js ДО этого файла.');
    return;
  }

  /* -------------------------------------------------------------------
     0. КОНСТАНТЫ
     ------------------------------------------------------------------- */
  const DESMOS_SRC = 'https://www.desmos.com/api/v1.9/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6';
  const KEY = {
    legacy: 'satpath_pt_results_v1',
    sess: 'satpath_pt_session_v2',
    det: 'satpath_pt_detail_v2',
    pref: 'satpath_pt_prefs_v1'
  };

  const MODS = {
    r1: { key: 'r1', sec: 'rw',   n: 1, secNo: 1, q: 27, min: 32, short: 'R&W Module 1',  full: 'Reading and Writing', pip: 'R&W 1' },
    r2: { key: 'r2', sec: 'rw',   n: 2, secNo: 1, q: 27, min: 32, short: 'R&W Module 2',  full: 'Reading and Writing', pip: 'R&W 2' },
    m1: { key: 'm1', sec: 'math', n: 1, secNo: 2, q: 22, min: 35, short: 'Math Module 1', full: 'Math',                pip: 'Math 1' },
    m2: { key: 'm2', sec: 'math', n: 2, secNo: 2, q: 22, min: 35, short: 'Math Module 2', full: 'Math',                pip: 'Math 2' }
  };
  const ORDER = ['r1', 'r2', 'm1', 'm2'];
  const TOTAL_Q = 98;      // 27 + 27 + 22 + 22
  const TOTAL_MIN = 134;   // 32 + 32 + 35 + 35  = 2h 14m
  const PACE_TARGET = { rw: 71, math: 96 };   // секунд на вопрос при стандартном времени

  // Схема модуля: сколько вопросов из каждого домена (порядок = порядок в реальном экзамене)
  const BLUEPRINT = {
    rw: [['Craft and Structure', 7], ['Information and Ideas', 7], ['Standard English Conventions', 7], ['Expression of Ideas', 6]],
    math: [['Algebra', 6], ['Advanced Math', 6], ['Problem-Solving and Data Analysis', 5], ['Geometry and Trigonometry', 5]]
  };
  const TIERS = ['easy', 'medium', 'hard'];
  const MIX = { std: [0.30, 0.45, 0.25], easy: [0.50, 0.40, 0.10], hard: [0.10, 0.40, 0.50] };
  const TILT = { foundation: [0.42, 0.43, 0.15], standard: null, challenge: [0.18, 0.40, 0.42] };
  const TILT_LABEL = { foundation: 'Foundation', standard: 'Standard', challenge: 'Challenge' };
  const DIFF_LABEL = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };

  const DEFAULT_CATALOG = [
    { t: 1, name: 'Practice Test 1', tilt: 'foundation' },
    { t: 2, name: 'Practice Test 2', tilt: 'foundation' },
    { t: 3, name: 'Practice Test 3', tilt: 'standard' },
    { t: 4, name: 'Practice Test 4', tilt: 'standard' },
    { t: 5, name: 'Practice Test 5', tilt: 'standard' },
    { t: 6, name: 'Practice Test 6', tilt: 'challenge' },
    { t: 7, name: 'Practice Test 7', tilt: 'challenge' },
    { t: 8, name: 'Practice Test 8', tilt: 'challenge' }
  ];

  function catalog() {
    const c = window.SP_PT_CATALOG;
    return (Array.isArray(c) && c.length) ? c : DEFAULT_CATALOG;
  }
  function entry(t) {
    const list = catalog();
    for (let i = 0; i < list.length; i++) if (+list[i].t === +t) return list[i];
    return { t: +t, name: 'Practice Test ' + t, tilt: 'standard' };
  }

  /* -------------------------------------------------------------------
     1. УТИЛИТЫ
     ------------------------------------------------------------------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  // Текст вопросов — HTML старого формата: <f>a/b</f> = дробь, \n = перенос
  function rich(s) {
    let t = String(s == null ? '' : s);
    t = t.replace(/<f>\s*([^<]*?)\s*\/\s*([^<]*?)\s*<\/f>/g, function (_, a, b) {
      return '<span class="pt-frac"><span>' + a + '</span><span>' + b + '</span></span>';
    });
    if (!/<(p|br|div|ul|ol|li|table|h\d)\b/i.test(t)) t = t.replace(/\r?\n/g, '<br>');
    return t;
  }
  const pad2 = function (n) { return n < 10 ? '0' + n : '' + n; };
  function clock(sec) {
    sec = Math.max(0, Math.ceil(sec));
    const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
    return h ? h + ':' + pad2(m) + ':' + pad2(s) : pad2(m) + ':' + pad2(s);
  }
  function fmtMin(min) {
    min = Math.round(min);
    const h = Math.floor(min / 60), m = min % 60;
    return h ? h + 'h ' + pad2(m) + 'm' : m + 'm';
  }
  function fmtSec(sec) {
    sec = Math.max(0, Math.round(sec));
    return sec >= 60 ? Math.floor(sec / 60) + 'm ' + pad2(sec % 60) + 's' : sec + 's';
  }
  function fmtDate(ts) {
    return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
  function hash(s) {
    let h = 2166136261;
    s = String(s);
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function icons() { try { if (window.lucide) window.lucide.createIcons(); } catch (e) {} }
    // Обновляет содержимое открытого окна, не пересоздавая само окно и фон
  function morphInner(host, html, sel) {
    const old = host.querySelector(sel);
    if (old) {
      const tmp = document.createElement('div');
      tmp.innerHTML = html;
      const next = tmp.querySelector(sel);
      if (next) { old.innerHTML = next.innerHTML; return; }
    }
    host.innerHTML = html;
  }
  function renderMath(el) {
    if (!window.renderMathInElement) return;
    try {
      window.renderMathInElement(el, { delimiters: [{ left: '$$', right: '$$', display: true }, { left: '\\(', right: '\\)', display: false }, { left: '$', right: '$', display: false }], throwOnError: false });
    } catch (e) {}
  }
  function userLabel() {
    const el = document.getElementById('userLine1');
    const v = el ? String(el.textContent || '').trim() : '';
    return v && v !== 'Guest' ? v : 'SATPath student';
  }

  /* -------------------------------------------------------------------
     2. ХРАНИЛИЩЕ
     ------------------------------------------------------------------- */
  const mem = {};
  function lsGet(k) {
    try { const v = localStorage.getItem(k); if (v !== null) return v; } catch (e) {}
    return Object.prototype.hasOwnProperty.call(mem, k) ? mem[k] : null;
  }
  function lsSet(k, v) {
    mem[k] = String(v);
    try { localStorage.setItem(k, String(v)); } catch (e) {}
  }
  function jget(k, def) {
    try { const r = lsGet(k); if (!r) return def; const v = JSON.parse(r); return (v && typeof v === 'object') ? v : def; } catch (e) { return def; }
  }
  function jset(k, v) { lsSet(k, JSON.stringify(v)); }

  const Store = {
    legacy: function () { return jget(KEY.legacy, {}); },
    det: function () { return jget(KEY.det, {}); },
    setDet: function (o) { jset(KEY.det, o); },
    sessAll: function () { return jget(KEY.sess, {}); },
    sess: function (t) { const s = Store.sessAll()[t]; return (s && typeof s === 'object') ? s : null; },
    setSess: function (t, s) {
      const all = Store.sessAll();
      if (s) all[t] = s; else delete all[t];
      jset(KEY.sess, all);
    },
    prefs: function () {
      const p = jget(KEY.pref, {});
      return {
        time: [1, 1.5, 2].indexOf(+p.time) >= 0 ? +p.time : 1,
        breaks: p.breaks === 'extra' ? 'extra' : 'std',
        fs: p.fs !== false,
        adaptive: p.adaptive !== false,
        topics: p.topics !== false,
        size: [0, 1, 2].indexOf(+p.size) >= 0 ? +p.size : 1
      };
    },
    setPrefs: function (patch) {
      const p = Object.assign(Store.prefs(), patch || {});
      jset(KEY.pref, p);
      return p;
    }
  };

  /* -------------------------------------------------------------------
     3. СБОРКА МОДУЛЕЙ (детерминированно: одинаковые вопросы у всех)
     ------------------------------------------------------------------- */
  function seededSort(ids, seed) {
    return ids.map(function (id) { return { id: id, h: hash(seed + '|' + id) }; })
      .sort(function (a, b) { return a.h - b.h; })
      .map(function (x) { return x.id; });
  }
  // Распределение n вопросов по [easy, medium, hard] методом наибольших остатков
  function mixCounts(n, mix) {
    const raw = mix.map(function (p) { return p * n; });
    const base = raw.map(Math.floor);
    let rem = n - base.reduce(function (a, b) { return a + b; }, 0);
    const order = raw.map(function (v, i) { return { i: i, f: v - base[i] }; }).sort(function (a, b) { return b.f - a.f; });
    for (let k = 0; rem > 0; k++, rem--) base[order[k % 3].i]++;
    return base;
  }
  function mixFor(level, tilt) {
    if (level === 'std' && tilt && TILT[tilt]) return TILT[tilt];
    return MIX[level] || MIX.std;
  }
    // Генератор случайных чисел с seed (mulberry32): порядок перемешан, но стабилен
  function seededRandom(seed) {
    let a = hash(seed);
    return function () {
      a = (a + 0x6D2B79F5) | 0;
      let x = Math.imul(a ^ (a >>> 15), 1 | a);
      x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
      return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
    };
  }
  // Shuffle Фишера-Йейтса
  function shuffle(list, seed) {
    const a = list.slice(), rnd = seededRandom(seed);
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      const tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }
  // Разводим соседние вопросы с одной и той же подтемой
  function spreadSkills(ids) {
    const a = ids.slice();
    const sk = function (id) { const q = Data.getQuestion(id); return (q && q.skill) || id; };
    for (let i = 1; i < a.length; i++) {
      const prev = sk(a[i - 1]);
      if (sk(a[i]) !== prev) continue;
      for (let j = i + 1; j < a.length; j++) {
        if (sk(a[j]) !== prev) { const tmp = a[i]; a[i] = a[j]; a[j] = tmp; break; }
      }
    }
    return a;
  }
  function buildModule(t, key, level, tilt, exclude) {
    const M = MODS[key], sec = M.sec, used = {}, out = [];
    (exclude || []).forEach(function (id) { used[id] = 1; });
    const mix = mixFor(level, tilt);
    const pref = level === 'hard' ? ['hard', 'medium', 'easy'] : level === 'easy' ? ['easy', 'medium', 'hard'] : ['medium', 'easy', 'hard'];

    BLUEPRINT[sec].forEach(function (bp) {
      const domain = bp[0], need = mixCounts(bp[1], mix), pool = {}, picked = [];
      TIERS.forEach(function (d) {
        const ids = Data.query({ section: sec, domain: domain, difficulty: d, status: 'all' }).filter(function (id) { return !used[id]; });
        pool[d] = seededSort(ids, 'pt' + t + key + domain + d);
      });
      TIERS.forEach(function (d, ti) {
        let n = need[ti];
        while (n > 0 && pool[d].length) { const id = pool[d].shift(); used[id] = 1; picked.push({ id: id, r: ti }); n--; }
        need[ti] = n;
      });
      let short = need[0] + need[1] + need[2];
      pref.forEach(function (d) {
        while (short > 0 && pool[d].length) { const id = pool[d].shift(); used[id] = 1; picked.push({ id: id, r: TIERS.indexOf(d) }); short--; }
      });
      picked.sort(function (a, b) { return a.r - b.r; });     // внутри домена: от лёгких к сложным
      picked.forEach(function (p) { out.push(p.id); });
    });

    if (out.length < M.q) {                                   // банк беднее схемы — добираем любыми
      seededSort(Data.query({ section: sec, status: 'all' }), 'pt' + t + key + 'fill').forEach(function (id) {
        if (out.length < M.q && !used[id]) { used[id] = 1; out.push(id); }
      });
    }
        return spreadSkills(shuffle(out, 'pt' + t + key + level + 'order'));
  }
  // Module 2 никогда не повторяет вопросы Module 1 того же теста
  function moduleIds(t, key, level, tilt) {
    const M = MODS[key];
    const ex = M.n === 2 ? buildModule(t, M.sec === 'rw' ? 'r1' : 'm1', 'std', tilt, []) : [];
    return buildModule(t, key, level, tilt, ex);
  }
  function nextLevel(sec, ok) { return ok >= (sec === 'rw' ? 18 : 15) ? 'hard' : 'easy'; }

  /* -------------------------------------------------------------------
     4. БАЛЛЫ И СТАТУСЫ
     ------------------------------------------------------------------- */
    // level: уровень Module 2 ('easy' | 'std' | 'hard'); total: сколько вопросов было в двух модулях
  function scaled(sec, ok1, ok2, level, total) {
    const max = +total || (sec === 'rw' ? 54 : 44);
    const pct = Math.max(0, Math.min(1, ((+ok1 || 0) + (+ok2 || 0)) / max));
    if (pct === 1) return 800;                       // всё верно = максимум на любом маршруте
    const raw = level === 'hard' ? 300 + 500 * pct
      : level === 'easy' ? 200 + 440 * pct           // потолок только у Easier route
      : 200 + 600 * pct;                             // Mixed: полная шкала 200–800
    return Math.max(200, Math.min(800, Math.round(raw / 10) * 10));
  }
  // a = Module 1, b = Module 2 (объекты из doneMods)
  function sectionScore(sec, a, b) {
    if (b.legacy && b.score != null) return b.score; // результаты старого сайта не пересчитываем
    return scaled(sec, a.ok, b.ok, b.level || (b.hard ? 'hard' : 'easy'), a.total + b.total);
  }
  function percentile(total) {
    return total >= 1550 ? '99th+' : total >= 1500 ? '98th' : total >= 1400 ? '94th' : total >= 1300 ? '87th' :
      total >= 1200 ? '75th' : total >= 1100 ? '59th' : total >= 1000 ? '42nd' : total >= 900 ? '27th' : '15th';
  }

  // Какие модули теста уже пройдены (новые данные + результаты старого сайта)
  function doneMods(t) {
    const out = {}, d = Store.det()[t], lg = Store.legacy()[t];
    if (lg && typeof lg === 'object') {
      if (lg.r) {
        out.r1 = { ok: +lg.r.a || 0, total: 27, legacy: 1 };
        out.r2 = { ok: +lg.r.b || 0, total: 27, legacy: 1, hard: !!lg.r.hard, score: +lg.r.score || null };
      }
      if (lg.m) {
        out.m1 = { ok: +lg.m.a || 0, total: 22, legacy: 1 };
        out.m2 = { ok: +lg.m.b || 0, total: 22, legacy: 1, hard: !!lg.m.hard, score: +lg.m.score || null };
      }
    }
    if (d && d.mods) {
      Object.keys(d.mods).forEach(function (k) {
        const m = d.mods[k];
        if (!m || !MODS[k]) return;
        out[k] = { ok: m.okN || 0, total: (m.ids || []).length, level: m.level, hard: m.level === 'hard', date: m.date };
      });
    }
    return out;
  }
  function scoresOf(t) {
    const dm = doneMods(t), res = { r: null, m: null, total: null };
    [['rw', 'r', 'r1', 'r2'], ['math', 'm', 'm1', 'm2']].forEach(function (x) {
            const a = dm[x[2]], b = dm[x[3]];
      if (a && b) res[x[1]] = sectionScore(x[0], a, b);
    });
    if (res.r != null && res.m != null) res.total = res.r + res.m;
    return res;
  }
  function statusOf(t) {
    if (Store.sess(t)) return 'progress';
    return Object.keys(doneMods(t)).length ? 'done' : 'new';
  }
  function lastTouched(t) { const d = Store.det()[t]; return (d && d.updated) || 0; }

  // Дублируем итоги в старый ключ — Dashboard (Current Score) читает именно его
  function syncLegacy(t) {
    const dm = doneMods(t), L = Store.legacy(), r = L[t] || {};
    let changed = false;
    [['rw', 'r', 'r1', 'r2'], ['math', 'm', 'm1', 'm2']].forEach(function (x) {
      const a = dm[x[2]], b = dm[x[3]];
      if (!a || !b) return;
            r[x[1]] = { score: sectionScore(x[0], a, b), a: a.ok, b: b.ok, hard: !!b.hard };
      changed = true;
    });
    if (r.r && r.m) r.total = r.r.score + r.m.score;
    if (changed) { L[t] = r; jset(KEY.legacy, L); }
  }

  function plannedMin(mods, mult) {
    return mods.reduce(function (s, k) { return s + MODS[k].min; }, 0) * (mult || 1);
  }
  function plannedQ(mods) { return mods.reduce(function (s, k) { return s + MODS[k].q; }, 0); }
  function hasSectionBreak(mods) {
    for (let i = 1; i < mods.length; i++) if (MODS[mods[i]].sec !== MODS[mods[i - 1]].sec) return true;
    return false;
  }

  function newSession(t, mods, p, lvl) {
    return {
      v: 2, t: t, mods: mods, mult: p.time, breaks: p.breaks, fs: !!p.fs, adaptive: !!p.adaptive,
      lvl: lvl || { rw: 'std', math: 'std' },
      step: 0, phase: 'gate', secsLeft: 0, brkLeft: 0, brkLen: 0, brkKind: 'main',
      qi: 0, cur: null, done: {}, started: Date.now()
    };
  }

  /* -------------------------------------------------------------------
     5. FULL SCREEN, DESMOS, REFERENCE SHEET
     ------------------------------------------------------------------- */
  function fsSupported() {
    const el = document.documentElement;
    return !!(el && (el.requestFullscreen || el.webkitRequestFullscreen));
  }
  function inFs() { return !!(document.fullscreenElement || document.webkitFullscreenElement); }
  function reqFs() {
    const el = document.documentElement;
    const f = el.requestFullscreen || el.webkitRequestFullscreen;
    if (!f) return Promise.resolve(false);
    try {
      const p = f.call(el);
      return (p && p.then) ? p.then(function () { return true; }, function () { return false; }) : Promise.resolve(true);
    } catch (e) { return Promise.resolve(false); }
  }
  function exitFs() {
    if (!inFs()) return;
    const f = document.exitFullscreen || document.webkitExitFullscreen;
    try { if (f) { const p = f.call(document); if (p && p.catch) p.catch(function () {}); } } catch (e) {}
  }

  let desmosP = null;
  function loadDesmos() {
    if (window.Desmos) return Promise.resolve();
    if (desmosP) return desmosP;
    desmosP = new Promise(function (resolve, reject) {
      const s = document.createElement('script');
      s.src = DESMOS_SRC; s.async = true;
      s.onload = function () { window.Desmos ? resolve() : reject(new Error('Desmos missing')); };
      s.onerror = function () { reject(new Error('network')); };
      document.head.appendChild(s);
    }).catch(function (e) { desmosP = null; throw e; });
    return desmosP;
  }

  function fig(svg, formulas) {
    return '<figure class="m-0 flex flex-col items-center rounded-xl border bg-surface p-3">' +
      '<svg viewBox="0 0 120 90" class="h-auto w-full max-w-[150px] text-ink" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + svg + '</svg>' +
      '<figcaption class="pt-math mt-2 text-center text-[13.5px] leading-snug">' + formulas + '</figcaption></figure>';
  }
  const FR = function (a, b) { return '<span class="pt-frac"><span>' + a + '</span><span>' + b + '</span></span>'; };

  function referenceHTML() {
    const D = ' stroke-dasharray="3 3"';
    const figs = [
      fig('<circle cx="60" cy="45" r="32"/><path d="M60 45h32"/><circle cx="60" cy="45" r="1.6" fill="currentColor" stroke="none"/><text class="pt-lbl" x="72" y="40">r</text>', 'A = πr²<br>C = 2πr'),
      fig('<rect x="18" y="20" width="84" height="48"/><text class="pt-lbl" x="56" y="83">ℓ</text><text class="pt-lbl" x="107" y="48">w</text>', 'A = ℓw'),
      fig('<path d="M64 12 20 70h88z"/><path d="M64 12v58"' + D + '/><path d="M64 62h6v8"/><text class="pt-lbl" x="60" y="84">b</text><text class="pt-lbl" x="69" y="44">h</text>', 'A = ' + FR('1', '2') + 'bh'),
      fig('<path d="M22 72V20L100 72Z"/><path d="M22 64h8v8"/><text class="pt-lbl" x="10" y="50">a</text><text class="pt-lbl" x="58" y="84">b</text><text class="pt-lbl" x="68" y="38">c</text>', 'c² = a² + b²'),
      fig('<path d="M20 74V26L104 74Z"/><path d="M20 66h8v8"/><text class="pt-lbl" x="9" y="54">x</text><text class="pt-lbl" x="50" y="87">x√3</text><text class="pt-lbl" x="68" y="44">2x</text><text class="pt-lbl2" x="25" y="42">60°</text><text class="pt-lbl2" x="82" y="71">30°</text>', 'Special Right Triangle<br>30° – 60° – 90°'),
      fig('<path d="M20 74V14L80 74Z"/><path d="M20 66h8v8"/><text class="pt-lbl" x="9" y="46">s</text><text class="pt-lbl" x="47" y="87">s</text><text class="pt-lbl" x="58" y="38">s√2</text><text class="pt-lbl2" x="25" y="32">45°</text><text class="pt-lbl2" x="62" y="71">45°</text>', 'Special Right Triangle<br>45° – 45° – 90°'),
      fig('<path d="M16 36h60v40H16zM16 36l22-16h60l-22 16M98 20v40l-22 16"/><path d="M38 20v40h60M38 60 16 76"' + D + '/><text class="pt-lbl" x="44" y="88">ℓ</text><text class="pt-lbl" x="96" y="76">w</text><text class="pt-lbl" x="6" y="60">h</text>', 'V = ℓwh'),
      fig('<ellipse cx="60" cy="20" rx="30" ry="9"/><path d="M30 20v50M90 20v50M30 70a30 9 0 0 0 60 0"/><path d="M30 70a30 9 0 0 1 60 0"' + D + '/><path d="M60 20h30"/><text class="pt-lbl" x="70" y="16">r</text><text class="pt-lbl" x="96" y="48">h</text>', 'V = πr²h'),
      fig('<circle cx="60" cy="45" r="32"/><path d="M28 45a32 10 0 0 0 64 0"/><path d="M28 45a32 10 0 0 1 64 0"' + D + '/><path d="M60 45h32"/><circle cx="60" cy="45" r="1.6" fill="currentColor" stroke="none"/><text class="pt-lbl" x="72" y="40">r</text>', 'V = ' + FR('4', '3') + 'πr³'),
      fig('<path d="M60 10 28 68M60 10 92 68M28 68a32 9 0 0 0 64 0"/><path d="M28 68a32 9 0 0 1 64 0M60 10v58M60 68h32"' + D + '/><text class="pt-lbl" x="64" y="42">h</text><text class="pt-lbl" x="74" y="64">r</text>', 'V = ' + FR('1', '3') + 'πr²h'),
      fig('<path d="M60 10 20 70h64zM60 10l44 46-20 14"/><path d="M60 10 40 56l64 0M20 70l20-14M60 10v52"' + D + '/><text class="pt-lbl" x="48" y="84">ℓ</text><text class="pt-lbl" x="100" y="72">w</text><text class="pt-lbl" x="64" y="40">h</text>', 'V = ' + FR('1', '3') + 'ℓwh')
    ].join('');
    return '<div class="grid grid-cols-2 gap-3 md:grid-cols-3">' + figs + '</div>' +
      '<ul class="mt-5 list-disc space-y-1.5 pl-5 text-[13.5px] leading-relaxed text-ink-soft">' +
      '<li>The number of degrees of arc in a circle is 360.</li>' +
      '<li>The number of radians of arc in a circle is 2π.</li>' +
      '<li>The sum of the measures in degrees of the angles of a triangle is 180.</li></ul>';
  }

  /* -------------------------------------------------------------------
     6. СТИЛИ
     ------------------------------------------------------------------- */
  const CSS =
    '.pt-frac{display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;margin:0 2px;line-height:1.15;font-size:.92em}' +
    '.pt-frac>span:first-child{padding:0 3px;border-bottom:1.5px solid currentColor}.pt-frac>span:last-child{padding:0 3px}' +
    '.pt-math{font-family:Georgia,"Times New Roman",serif}' +
    '.pt-lbl{fill:currentColor;stroke:none;font:italic 11px Georgia,serif}.pt-lbl2{fill:currentColor;stroke:none;font:8px Inter,sans-serif;opacity:.7}' +
    '.pt-prompt img{max-width:100%;height:auto}.pt-prompt table{border-collapse:collapse;margin:10px auto}' +
    '.pt-prompt td,.pt-prompt th{border:1px solid rgba(138,143,152,.4);padding:4px 10px;text-align:center}' +
    '.pt-txt.struck{text-decoration:line-through;opacity:.5}' +
    '.pt-fade{animation:ptFade .16s ease both}@keyframes ptFade{from{opacity:0}to{opacity:1}}' +
    '.pt-rise{animation:ptRise .3s cubic-bezier(.2,.7,.2,1) both}@keyframes ptRise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}' +
    '.pt-pop{position:fixed;left:50%;z-index:55;width:min(520px,calc(100vw - 16px));max-height:calc(100vh - 150px);display:flex;flex-direction:column;transform:translateX(-50%);animation:ptPop .16s ease both}' +
    '@keyframes ptPop{from{opacity:0;transform:translate(-50%,12px)}to{opacity:1;transform:translate(-50%,0)}}' +
    '.pt-calc{width:46%;min-width:360px;max-width:760px;flex:none;display:flex;flex-direction:column}.pt-calc[data-wide="1"]{width:68%;max-width:none}' +
    '@media (max-width:767px){.pt-calc{position:fixed;inset:0;z-index:60;width:auto;min-width:0;max-width:none}}' +
    '.pt-split{display:flex;flex-direction:column;min-height:100%}' +
    '@media (min-width:768px){.pt-split{display:grid;grid-template-columns:1fr 1fr;height:100%;min-height:0}.pt-pane{overflow-y:auto;min-height:0}}' +
    '@media (max-width:767px){.pt-pane[data-on="0"]{display:none}}' +
    '.pt-tile{position:relative;display:grid;place-items:center;height:44px;min-width:44px;border-radius:12px;border:1.5px solid transparent;font-weight:600;font-size:13px;transition:transform .1s,background .15s}' +
    '.pt-tile:hover{transform:translateY(-1px)}' +
    '.pt-tile[data-s="un"]{border-style:dashed;border-color:var(--c-hairline);color:rgb(var(--c-ink-soft))}' +
    '.pt-tile[data-s="an"]{background:rgb(var(--c-accent)/.16);border-color:rgb(var(--c-accent)/.45);color:rgb(var(--c-ink))}' +
    '.pt-tile[data-cur="1"]{box-shadow:0 0 0 2px rgb(var(--c-accent))}' +
    '.pt-flag{position:absolute;top:-6px;right:-5px;color:rgb(var(--c-hl))}' +
    '.pt-breath{animation:ptBreathe 16s ease-in-out infinite}' +
    '@keyframes ptBreathe{0%{transform:scale(.62)}25%{transform:scale(1)}50%{transform:scale(1)}75%{transform:scale(.62)}100%{transform:scale(.62)}}' +
    '.pt-bl{opacity:0;animation:ptBl 16s linear infinite}' +
    '@keyframes ptBl{0%{opacity:1}24%{opacity:1}25%,100%{opacity:0}}' +
    '.pt-count{animation:ptCount .9s ease both}@keyframes ptCount{0%{opacity:0;transform:scale(.6)}30%{opacity:1;transform:scale(1)}100%{opacity:1;transform:scale(1)}}' +
    '.pt-ring{transition:stroke-dashoffset .9s cubic-bezier(.2,.7,.2,1)}' +
    '@media (prefers-reduced-motion:reduce){.pt-pop,.pt-fade,.pt-rise,.pt-breath,.pt-bl,.pt-count,.pt-ring{animation:none!important;transition:none!important}.pt-bl:first-child{opacity:1}}';

  function injectStyle() {
    if (document.getElementById('ptStyle')) return;
    const s = document.createElement('style');
    s.id = 'ptStyle';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* Универсальное подтверждение (каталог и экзамен) */
  function confirmDialog(host, o) {
    const wrap = document.createElement('div');
    wrap.className = 'fixed inset-0 z-[95] grid place-items-center bg-black/60 p-4 pt-fade';
    wrap.innerHTML =
      '<div class="w-full max-w-[420px] rounded-2xl border bg-surface p-6 shadow-2xl" role="alertdialog" aria-modal="true" aria-label="' + esc(o.title) + '">' +
        '<h2 class="text-[18px] font-semibold tracking-tight">' + esc(o.title) + '</h2>' +
        '<p class="mt-2 text-[13.5px] leading-relaxed text-ink-soft">' + esc(o.text) + '</p>' +
        '<div class="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">' +
          '<button type="button" data-c="no" class="h-11 rounded-lg border px-5 text-[13.5px] font-medium hover:bg-raised">' + esc(o.cancel || 'Cancel') + '</button>' +
          (o.alt ? '<button type="button" data-c="alt" class="h-11 rounded-lg border border-danger/40 px-5 text-[13.5px] font-medium text-danger hover:bg-danger/10">' + esc(o.alt) + '</button>' : '') +
          '<button type="button" data-c="ok" class="h-11 rounded-lg px-5 text-[13.5px] font-semibold text-white ' + (o.danger ? 'bg-danger hover:opacity-90' : 'bg-accent hover:bg-accent-hover') + '">' + esc(o.ok || 'OK') + '</button>' +
        '</div></div>';
    function close() { wrap.remove(); document.removeEventListener('keydown', onEsc, true); }
    function onEsc(e) { if (e.key === 'Escape') { e.stopPropagation(); close(); } }
    wrap.addEventListener('click', function (e) {
      const b = e.target.closest('[data-c]');
      if (!b) { if (e.target === wrap) close(); return; }
      const c = b.getAttribute('data-c');
      close();
      if (c === 'ok' && o.onOk) o.onOk();
      if (c === 'alt' && o.onAlt) o.onAlt();
    });
    document.addEventListener('keydown', onEsc, true);
    host.appendChild(wrap);
    const ok = wrap.querySelector('[data-c="ok"]');
    if (ok) ok.focus();
    return wrap;
  }


  /* =====================================================================
     7. КАТАЛОГ ТЕСТОВ + МОДАЛКА ВЫБОРА МОДУЛЕЙ   (#/practice-tests)
     ===================================================================== */
  function pipHTML(k, dm, cur) {
    const d = dm[k], on = !!d, isCur = !on && cur === k;
    return '<div class="min-w-0 flex-1">' +
      '<div class="h-1.5 rounded-full ' + (on ? 'bg-accent' : isCur ? 'animate-pulse bg-accent/40' : 'bg-raised') + '"></div>' +
      '<div class="mt-1.5 flex justify-between gap-1 text-[10.5px] text-ink-mute"><span class="truncate">' + MODS[k].pip + '</span>' +
      '<span class="num">' + (on ? d.ok + '/' + d.total : '') + '</span></div></div>';
  }

  function cardHTML(it, upNext) {
    const t = it.t, stt = statusOf(t), sc = scoresOf(t), sess = Store.sess(t), dm = doneMods(t);
    const tilt = it.tilt && TILT_LABEL[it.tilt] ? it.tilt : 'standard';
    const cur = sess && sess.mods ? sess.mods[sess.step] : null;

    let badge = '';
    if (stt === 'progress') badge = '<span class="inline-flex h-6 items-center rounded-full border border-hl/50 px-2.5 text-[11px] font-semibold text-hl">In progress</span>';
    else if (stt === 'done') badge = '<span class="inline-flex h-6 items-center rounded-full border border-success/40 bg-success/10 px-2.5 text-[11px] font-semibold text-success">' + (sc.total != null ? 'Completed' : 'Partial') + '</span>';
    else if (upNext === t) badge = '<span class="inline-flex h-6 items-center rounded-full bg-accent/15 px-2.5 text-[11px] font-semibold text-accent">Up next</span>';

    let label, value, side;
    if (sc.total != null) { label = 'Score'; value = sc.total; side = 'R&W ' + sc.r + ' · Math ' + sc.m; }
    else if (sc.r != null || sc.m != null) { label = 'Score · partial'; value = sc.r != null ? sc.r : sc.m; side = sc.r != null ? 'R&W section' : 'Math section'; }
    else if (stt === 'progress') { label = 'Module'; value = (sess.step || 0) + 1; side = 'of ' + sess.mods.length + ' selected'; }
    else { label = 'Questions'; value = TOTAL_Q; side = fmtMin(TOTAL_MIN); }

    let actions;
    if (stt === 'progress') {
      actions = '<button type="button" data-pt="resume" data-t="' + t + '" class="inline-flex h-11 items-center gap-2 rounded-lg bg-accent px-4 text-[13.5px] font-semibold text-white transition-colors hover:bg-accent-hover">Continue test<i data-lucide="arrow-right" class="h-4 w-4"></i></button>' +
        '<button type="button" data-pt="discard" data-t="' + t + '" class="ml-auto h-11 rounded-lg px-3 text-[12.5px] font-medium text-ink-soft hover:bg-raised hover:text-ink">Discard</button>';
    } else if (stt === 'done') {
      actions = '<button type="button" data-pt="results" data-t="' + t + '" class="inline-flex h-11 items-center gap-2 rounded-lg border px-4 text-[13.5px] font-semibold transition-colors hover:bg-raised">View results<i data-lucide="arrow-right" class="h-4 w-4"></i></button>' +
        '<button type="button" data-pt="start" data-t="' + t + '" class="ml-auto inline-flex h-11 items-center gap-1.5 rounded-lg px-3 text-[12.5px] font-medium text-ink-soft hover:bg-raised hover:text-ink"><i data-lucide="rotate-ccw" class="h-3.5 w-3.5"></i>Retake</button>';
    } else {
      actions = '<button type="button" data-pt="start" data-t="' + t + '" class="inline-flex h-11 items-center gap-2 rounded-lg bg-accent px-4 text-[13.5px] font-semibold text-white transition-colors hover:bg-accent-hover">Start test<i data-lucide="arrow-right" class="h-4 w-4"></i></button>';
    }

    return '<article class="card flex flex-col p-5 ' + (stt === 'progress' ? 'border-accent/40' : '') + '">' +
      '<div class="flex items-start justify-between gap-3">' +
        '<div class="min-w-0"><h3 class="truncate text-[16px] font-semibold tracking-tight">' + esc(it.name) + '</h3>' +
        '<p class="mt-0.5 text-[12.5px] text-ink-soft">Full-length digital SAT · ' + TILT_LABEL[tilt] + '</p></div>' + badge +
      '</div>' +
      '<div class="mt-5 flex items-end justify-between gap-3">' +
        '<div><div class="text-[11.5px] text-ink-mute">' + label + '</div><div class="num mt-1 text-[34px] font-semibold leading-none tracking-tight">' + value + '</div></div>' +
        '<div class="pb-1 text-[12.5px] text-ink-soft">' + esc(side) + '</div>' +
      '</div>' +
      '<div class="mt-5 flex items-start gap-1.5">' + pipHTML('r1', dm, cur) + pipHTML('r2', dm, cur) + '<span class="w-2 shrink-0"></span>' + pipHTML('m1', dm, cur) + pipHTML('m2', dm, cur) + '</div>' +
      '<div class="mt-5 flex items-center gap-2 border-t pt-4">' + actions + '</div>' +
    '</article>';
  }

  function trendHTML() {
    const pts = catalog().map(function (it) { return { s: scoresOf(it.t).total, d: lastTouched(it.t) || it.t }; })
      .filter(function (x) { return x.s != null; }).sort(function (a, b) { return a.d - b.d; });
    if (pts.length < 2) return '<p class="text-[12.5px] leading-relaxed text-ink-soft">Finish two full tests to see your score trend here.</p>';
    const W = 280, H = 64, P = 8;
    const vals = pts.map(function (p) { return p.s; });
    const lo = Math.min.apply(null, vals) - 40, hi = Math.max.apply(null, vals) + 40;
    const xy = pts.map(function (p, i) { return [P + i * (W - 2 * P) / (pts.length - 1), H - P - (p.s - lo) / (hi - lo) * (H - 2 * P)]; });
    const line = xy.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' ');
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" class="h-16 w-full" role="img" aria-label="Score trend across completed tests">' +
      '<path d="' + line + ' L' + xy[xy.length - 1][0].toFixed(1) + ' ' + H + ' L' + xy[0][0].toFixed(1) + ' ' + H + 'Z" fill="rgb(var(--c-accent) / .12)"/>' +
      '<path d="' + line + '" fill="none" stroke="rgb(var(--c-accent))" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
      xy.map(function (p) { return '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="3" fill="rgb(var(--c-accent))"/>'; }).join('') + '</svg>' +
      '<div class="mt-1 flex justify-between text-[11px] text-ink-mute"><span class="num">' + vals[0] + '</span><span>Score trend</span><span class="num">' + vals[vals.length - 1] + '</span></div>';
  }

  Shell.register('practice-tests', {
    render: function (root, ctx) {
      injectStyle();
      let alive = true;
      let MS = null;
      const st = { tab: 'all', sort: 'num' };
      const cleanups = [];
      root.innerHTML = '<div id="ptPage"></div><div id="ptHost"></div>';
      const page = root.querySelector('#ptPage'), host = root.querySelector('#ptHost');

      /* ---------- страница ---------- */
      function statsHTML() {
        const list = catalog();
        let doneN = 0, modsN = 0, best = null, latest = null, latestD = -1;
        list.forEach(function (it) {
          const t = it.t, dm = doneMods(t), sc = scoresOf(t);
          if (Object.keys(dm).length) doneN++;
          modsN += Object.keys(dm).length;
          if (sc.total != null) {
            if (best == null || sc.total > best) best = sc.total;
            const d = lastTouched(t) || t;
            if (d > latestD) { latestD = d; latest = sc.total; }
          }
        });
        const stat = function (label, value) {
          return '<div><div class="text-[11.5px] text-ink-mute">' + label + '</div><div class="num mt-1 text-[26px] font-semibold leading-none tracking-tight">' + value + '</div></div>';
        };
        return '<section class="card grid gap-6 p-5 md:grid-cols-[1.3fr_1fr] md:items-center">' +
          '<div class="grid grid-cols-2 gap-5 sm:grid-cols-4">' +
            stat('Best score', best != null ? best : '—') + stat('Latest', latest != null ? latest : '—') +
            stat('Tests started', doneN + '<span class="text-[15px] text-ink-mute"> / ' + list.length + '</span>') + stat('Modules done', modsN) +
          '</div><div>' + trendHTML() + '</div></section>';
      }

      function pageHTML() {
        const list = catalog().slice();
        const counts = { all: list.length, progress: 0, done: 0, 'new': 0 };
        list.forEach(function (it) { counts[statusOf(it.t)]++; });
        let shown = list.filter(function (it) { return st.tab === 'all' || statusOf(it.t) === st.tab; });
        if (st.sort === 'recent') shown.sort(function (a, b) { return (lastTouched(b.t) - lastTouched(a.t)) || (a.t - b.t); });
        const firstNew = list.filter(function (it) { return statusOf(it.t) === 'new'; })[0];
        const upNext = counts.progress === 0 && firstNew ? firstNew.t : null;

        const tabs = [['all', 'All tests'], ['progress', 'In progress'], ['done', 'Completed'], ['new', 'Not started']].map(function (x) {
          const on = st.tab === x[0];
          return '<button type="button" data-pt="tab" data-v="' + x[0] + '" aria-pressed="' + on + '" class="inline-flex h-10 items-center gap-2 rounded-full px-3.5 text-[13px] font-medium transition-colors ' + (on ? 'bg-accent/15 text-accent' : 'text-ink-soft hover:bg-raised hover:text-ink') + '">' +
            '<span class="num grid h-5 min-w-[22px] place-items-center rounded-full px-1.5 text-[11px] ' + (on ? 'bg-accent/20' : 'bg-raised') + '">' + counts[x[0]] + '</span>' + x[1] + '</button>';
        }).join('');

        const feat = [['shuffle', 'Module 2 adapts to your result'], ['maximize', 'Full screen exam mode'], ['timer', 'Time-per-question review']].map(function (f) {
          return '<span class="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11.5px] text-ink-soft"><i data-lucide="' + f[0] + '" class="h-3.5 w-3.5 text-accent"></i>' + f[1] + '</span>';
        }).join('');

        return '<div class="mx-auto w-full max-w-[1180px] space-y-6 px-4 py-6 md:px-8 md:py-10">' +
          '<div class="pt-rise flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">' +
            '<div class="min-w-0"><h1 class="text-[26px] font-semibold tracking-tight md:text-[30px]">Practice Tests</h1>' +
            '<p class="mt-1.5 max-w-[620px] text-[14px] text-ink-soft">Full-length adaptive Digital SAT in a Bluebook-style environment. Run the whole test or just the modules you need.</p>' +
            '<div class="mt-3 flex flex-wrap gap-2">' + feat + '</div></div>' +
          '</div>' +
          '<div class="pt-rise" style="animation-delay:60ms">' + statsHTML() + '</div>' +
          '<div class="flex flex-wrap items-center justify-between gap-3">' +
            '<div class="flex flex-wrap items-center gap-1" role="group" aria-label="Filter tests">' + tabs + '</div>' +
            '<button type="button" data-pt="sort" class="inline-flex h-10 items-center gap-2 rounded-full border px-3.5 text-[12.5px] font-medium text-ink-soft hover:bg-raised hover:text-ink"><i data-lucide="arrow-up-down" class="h-3.5 w-3.5"></i>' + (st.sort === 'num' ? 'Test number' : 'Recently taken') + '</button>' +
          '</div>' +
          (shown.length
            ? '<div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">' + shown.map(function (it) { return cardHTML(it, upNext); }).join('') + '</div>'
            : '<div class="rounded-2xl border border-dashed px-6 py-14 text-center"><p class="text-[15px] font-semibold">Nothing here yet</p><p class="mt-1.5 text-[13px] text-ink-soft">No tests match this filter.</p></div>') +
        '</div>';
      }
            let painted = false;
      function paint() {
        page.classList.toggle('sp-no-anim', painted);   // анимация только при первом показе
        page.innerHTML = pageHTML();
        painted = true;
        icons();
      }

      /* ---------- модалка ---------- */
      function modalHTML() {
        const t = MS.t, it = entry(t), dm = doneMods(t);
        const mods = ORDER.filter(function (k) { return MS.sel[k]; });
        const all = mods.length === ORDER.length;
        const chipCls = function (on) {
          return 'inline-flex min-h-[44px] items-center gap-2 rounded-xl border px-3.5 text-[13.5px] font-medium transition-colors ' +
            (on ? 'border-accent bg-accent/15 text-ink' : 'bg-canvas/40 text-ink-soft hover:bg-raised hover:text-ink');
        };
        const chips = '<button type="button" data-m="full" aria-pressed="' + all + '" class="' + chipCls(all) + '"><i data-lucide="layers" class="h-4 w-4"></i>Full test <span class="num text-[12px] text-ink-mute">~' + fmtMin(TOTAL_MIN * MS.time) + '</span></button>' +
          ORDER.map(function (k) {
            const on = !!MS.sel[k], d = dm[k];
            return '<button type="button" data-m="mod" data-k="' + k + '" aria-pressed="' + on + '" class="' + chipCls(on) + '">' + MODS[k].short +
              ' <span class="num text-[12px] text-ink-mute">' + MODS[k].q + 'q</span>' +
              (d ? '<span class="grid h-[18px] w-[18px] place-items-center rounded-full bg-success/20 text-success" title="Last result: ' + d.ok + '/' + d.total + '"><i data-lucide="check" class="h-3 w-3"></i></span>' : '') + '</button>';
          }).join('');

        const seg = function (sec) {
          const cur = MS.lvl[sec] || 'std';
          return '<div class="inline-flex rounded-lg bg-raised p-0.5" role="group">' + [['std', 'Mixed'], ['easy', 'Easier'], ['hard', 'Harder']].map(function (o) {
            return '<button type="button" data-m="lvl" data-sec="' + sec + '" data-v="' + o[0] + '" aria-pressed="' + (cur === o[0]) + '" class="h-9 rounded-md px-3 text-[12.5px] font-medium ' + (cur === o[0] ? 'bg-surface text-ink shadow-[0_0_0_1px_var(--c-hairline)]' : 'text-ink-soft hover:text-ink') + '">' + o[1] + '</button>';
          }).join('') + '</div>';
        };
        const lvlBlocks = [['rw', 'r1', 'r2', 'R&W'], ['math', 'm1', 'm2', 'Math']].map(function (x) {
          if (!MS.sel[x[2]]) return '';
          const standalone = !MS.sel[x[1]] || !MS.adaptive;
          return '<div class="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-canvas/40 px-4 py-3">' +
            '<div class="min-w-0 text-[13px]"><div class="font-medium">' + x[3] + ' Module 2 difficulty</div>' +
            '<div class="text-[12px] text-ink-soft">' + (standalone ? 'Choose the level, since there is no Module 1 result to adapt to.' : 'Adapts to how you do in Module 1.') + '</div></div>' +
            (standalone ? seg(x[0]) : '<span class="inline-flex h-7 items-center rounded-full bg-accent/15 px-2.5 text-[11.5px] font-semibold text-accent">Adaptive</span>') + '</div>';
        }).join('');

        const sw = function (id, on, label, desc, disabled) {
          return '<div class="flex items-center justify-between gap-4 py-2.5"><div class="min-w-0"><div class="text-[13.5px] font-medium">' + label + '</div><div class="text-[12px] text-ink-soft">' + desc + '</div></div>' +
            '<button type="button" role="switch" data-m="sw" data-k="' + id + '" aria-checked="' + on + '" aria-label="' + label + '" ' + (disabled ? 'disabled ' : '') +
            'class="relative h-6 w-10 shrink-0 rounded-full transition-colors ' + (on ? 'bg-accent' : 'border bg-raised') + (disabled ? ' opacity-50' : '') + '">' +
            '<span class="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ' + (on ? 'left-[18px]' : 'left-0.5') + '"></span></button></div>';
        };
        const opt = function (m, v, on, text) {
          return '<button type="button" data-m="' + m + '" data-v="' + v + '" aria-pressed="' + on + '" class="h-10 rounded-lg border px-3 text-[13px] font-medium transition-colors ' + (on ? 'border-accent bg-accent/15 text-ink' : 'text-ink-soft hover:bg-raised hover:text-ink') + '">' + text + '</button>';
        };

        const acc = '<div class="border-t">' +
          '<button type="button" data-m="acc" aria-expanded="' + MS.acc + '" class="flex w-full items-center justify-between gap-4 py-4 text-left">' +
            '<span><span class="block text-[14px] font-semibold">Accommodations' + ((MS.time !== 1 || MS.breaks === 'extra') ? ' <span class="ml-1 rounded-full bg-accent/15 px-2 py-0.5 text-[11px] font-semibold text-accent">On</span>' : '') + '</span>' +
            '<span class="mt-0.5 block text-[12.5px] text-ink-soft">Approved for extended time or extra breaks? Practise the way you will test.</span></span>' +
            '<i data-lucide="' + (MS.acc ? 'chevron-up' : 'chevron-down') + '" class="h-4 w-4 shrink-0 text-ink-soft"></i></button>' +
          (MS.acc
            ? '<div class="space-y-4 pb-4"><div><div class="mb-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-ink-mute">Extended time</div><div class="flex flex-wrap gap-2">' +
                opt('time', 1, MS.time === 1, 'Standard') + opt('time', 1.5, MS.time === 1.5, '×1.5 time') + opt('time', 2, MS.time === 2, '×2 time') + '</div></div>' +
              '<div><div class="mb-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-ink-mute">Breaks</div><div class="flex flex-wrap gap-2">' +
                opt('brk', 'std', MS.breaks === 'std', 'Standard · 10 min') + opt('brk', 'extra', MS.breaks === 'extra', 'Extra breaks · 15 min + 2 min between modules') + '</div></div></div>'
            : '') + '</div>';

        const minutes = plannedMin(mods, MS.time);
        const brkMin = hasSectionBreak(mods) ? (MS.breaks === 'extra' ? 15 : 10) : 0;
        const summary = mods.length
          ? '<span class="font-medium text-ink">' + (all ? 'Full test' : mods.map(function (k) { return MODS[k].pip; }).join(' + ')) + '</span> · <span class="num">' + plannedQ(mods) + '</span>q · ~' + fmtMin(minutes) + (brkMin ? ' + ' + brkMin + ' min break' : '')
          : 'Nothing picked yet';

        return '<div data-ov class="fixed inset-0 z-[80] grid place-items-center overflow-y-auto bg-black/60 p-3 backdrop-blur-sm pt-fade">' +
          '<div id="ptDlg" class="max-h-[94vh] w-full max-w-[660px] overflow-y-auto rounded-2xl border bg-surface shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="ptmT">' +
            '<div class="flex items-start justify-between gap-4 px-6 pt-6"><div class="min-w-0"><h2 id="ptmT" class="text-[22px] font-semibold tracking-tight">' + esc(it.name) + '</h2>' +
            '<p class="mt-1 text-[14px] text-ink-soft">Run the whole test, or just the modules you want to practise.</p></div>' +
            '<button type="button" data-m="close" class="grid h-11 w-11 shrink-0 place-items-center rounded-lg text-ink-soft hover:bg-raised hover:text-ink" aria-label="Close"><i data-lucide="x" class="h-[18px] w-[18px]"></i></button></div>' +
            '<div class="space-y-4 px-6 pb-2 pt-5">' +
              (Store.sess(t) ? '<div class="flex items-start gap-2.5 rounded-xl border border-hl/40 bg-hl/10 px-4 py-3 text-[12.5px] text-ink-soft"><i data-lucide="alert-triangle" class="mt-0.5 h-4 w-4 shrink-0 text-hl"></i><span>You have a saved session for this test. Starting a new attempt replaces it.</span></div>' : '') +
              '<div class="flex flex-wrap gap-2.5">' + chips + '</div>' + lvlBlocks +
              '<div class="border-t pt-2">' +
                sw('fs', MS.fs && fsSupported(), 'Full screen exam mode', fsSupported() ? 'Hides everything else, like the real test. Leaving full screen pauses the clock.' : 'Not supported in this browser.', !fsSupported()) +
                sw('adaptive', MS.adaptive, 'Adaptive Module 2', 'The harder or easier Module 2 is picked from your Module 1 score.', false) +
              '</div>' + acc +
            '</div>' +
            '<div class="sticky bottom-0 flex flex-wrap items-center justify-between gap-3 border-t bg-surface px-6 py-4"><div class="min-w-0 text-[13px] text-ink-soft">' + summary + '</div>' +
            '<button type="button" data-m="go" ' + (mods.length ? '' : 'disabled ') + 'class="inline-flex h-11 items-center gap-2 rounded-lg bg-accent px-6 text-[14px] font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-accent">Start test</button></div>' +
          '</div></div>';
      }

            function paintModal() {
        if (!MS) { host.innerHTML = ''; return; }
        morphInner(host, modalHTML(), '#ptDlg');
        icons();
      }
      function openModal(t) {
        const p = Store.prefs();
        MS = { t: t, sel: { r1: 1, r2: 1, m1: 1, m2: 1 }, time: p.time, breaks: p.breaks, fs: p.fs, adaptive: p.adaptive, lvl: { rw: 'std', math: 'std' }, acc: p.time !== 1 || p.breaks === 'extra' };
        paintModal();
        const go = host.querySelector('[data-m="go"]');
        if (go) go.focus();
      }
      function closeModal() { MS = null; paintModal(); }

      function launch() {
        if (!MS) return;
        const mods = ORDER.filter(function (k) { return MS.sel[k]; });
        if (!mods.length) return;
        const btn = host.querySelector('[data-m="go"]');
        if (btn) { btn.disabled = true; btn.textContent = 'Preparing…'; }
        const snap = MS;
        Promise.resolve(Data.load()).then(function () {
          if (!alive) return;
          if (!(Data.size() >= 30)) {
            Shell.toast('The question bank is empty. Add the data files first.');
            paintModal();
            return;
          }
          const p = Store.setPrefs({ time: snap.time, breaks: snap.breaks, fs: snap.fs, adaptive: snap.adaptive });
          Store.setSess(snap.t, newSession(snap.t, mods, p, snap.lvl));
          closeModal();
          ctx.navigate('exam?t=' + snap.t);
        }, function () { Shell.toast('Could not load the questions.'); paintModal(); });
      }

      function onModalClick(e) {
        if (!MS) return;
        const b = e.target.closest('[data-m]');
        if (!b) { if (e.target.hasAttribute && e.target.hasAttribute('data-ov')) closeModal(); return; }
        if (b.disabled) return;
        const a = b.getAttribute('data-m');
        if (a === 'close') { closeModal(); return; }
        if (a === 'go') { launch(); return; }
        if (a === 'full') {
          const all = ORDER.every(function (k) { return MS.sel[k]; });
          ORDER.forEach(function (k) { if (all) delete MS.sel[k]; else MS.sel[k] = 1; });
        } else if (a === 'mod') {
          const k = b.getAttribute('data-k');
          if (MS.sel[k]) delete MS.sel[k]; else MS.sel[k] = 1;
        } else if (a === 'acc') MS.acc = !MS.acc;
        else if (a === 'time') MS.time = +b.getAttribute('data-v');
        else if (a === 'brk') MS.breaks = b.getAttribute('data-v');
        else if (a === 'sw') { const k = b.getAttribute('data-k'); MS[k] = !MS[k]; }
        else if (a === 'lvl') MS.lvl[b.getAttribute('data-sec')] = b.getAttribute('data-v');
        paintModal();
      }
      host.addEventListener('click', onModalClick);

      function onEsc(e) { if (e.key === 'Escape' && MS && !document.querySelector('[role="alertdialog"]')) closeModal(); }
      document.addEventListener('keydown', onEsc);
      cleanups.push(function () { document.removeEventListener('keydown', onEsc); });

      /* ---------- действия на карточках ---------- */
      page.addEventListener('click', function (e) {
        const b = e.target.closest('[data-pt]');
        if (!b) return;
        const a = b.getAttribute('data-pt'), t = +b.getAttribute('data-t');
        if (a === 'tab') { st.tab = b.getAttribute('data-v'); paint(); }
        else if (a === 'sort') { st.sort = st.sort === 'num' ? 'recent' : 'num'; paint(); }
        else if (a === 'start') openModal(t);
        else if (a === 'resume') ctx.navigate('exam?t=' + t);
        else if (a === 'results') ctx.navigate('pt-results?t=' + t);
        else if (a === 'discard') {
          confirmDialog(host, {
            title: 'Discard saved session?',
            text: 'Your unfinished module will be removed. Modules you already finished stay in your results.',
            ok: 'Discard', danger: true,
            onOk: function () { Store.setSess(t, null); paint(); }
          });
        }
      });

      paint();
      const want = +ctx.params.get('start');
      if (want) openModal(want);

      return function () {
        alive = false;
        cleanups.forEach(function (fn) { try { fn(); } catch (e) {} });
      };
    }
  });

  /* =====================================================================
     8. РЕЗУЛЬТАТЫ И РАЗБОР   (#/pt-results?t=3)
     ===================================================================== */
  Shell.register('pt-results', {
    title: 'Test results',
    group: 'Simulate',
    render: function (root, ctx) {
      injectStyle();
      const t = +ctx.params.get('t');
      const isNew = ctx.params.get('new') === '1';
      const R = { filter: 'all', mod: 'all', open: -1 };
      let alive = true, rows = [];
      const cleanups = [];

      root.innerHTML = '<div class="grid place-items-center py-40 text-[13px] text-ink-soft">Loading results…</div>';
      Promise.resolve(Data.load()).then(go, go);

      return function () {
        alive = false;
        cleanups.forEach(function (fn) { try { fn(); } catch (e) {} });
      };

      function secOf(r) { return r.q ? r.q.section : MODS[r.key].sec; }
      function isSlow(r) { return r.sec > 2 * PACE_TARGET[secOf(r)]; }
      function matches(r) {
        if (R.mod !== 'all' && r.key !== R.mod) return false;
        if (R.filter === 'missed') return !r.ok;
        if (R.filter === 'skip') return !r.a;
        if (R.filter === 'flag') return r.fl;
        if (R.filter === 'slow') return isSlow(r);
        return true;
      }
      function filtered() { return rows.filter(matches); }

      function go() {
        if (!alive) return;
        const det = Store.det()[t], dm = doneMods(t), it = entry(t);
        if (!Object.keys(dm).length) {
          root.innerHTML = '<div class="mx-auto max-w-[460px] px-6 py-24 text-center"><h1 class="text-[22px] font-semibold tracking-tight">No results yet</h1>' +
            '<p class="mt-2 text-[14px] text-ink-soft">Finish at least one module of this test to see your results.</p>' +
            '<a href="#/practice-tests" class="btn-pill mt-7 inline-flex">Back to Practice Tests</a></div>';
          return;
        }
        rows = [];
        if (det && det.mods) {
          ORDER.forEach(function (k) {
            const m = det.mods[k];
            if (!m || !m.ids) return;
            m.ids.forEach(function (id, i) {
              rows.push({ gi: rows.length, key: k, idx: i, id: id, q: Data.getQuestion(id), a: (m.a && m.a[i]) || '', ok: !!(m.ok && m.ok[i]), sec: (m.sec && m.sec[i]) || 0, fl: !!(m.fl && m.fl[i]) });
            });
          });
        }
        paint(det, dm, it);
        bind();
      }

      /* ---------- блоки страницы ---------- */
      function scoreCardHTML(sc, dm) {
        let big, sub, ringPct = 0, ringLabel;
        if (sc.total != null) {
          big = sc.total; ringPct = (sc.total - 400) / 1200; ringLabel = 'of 1600';
          sub = '<div class="mt-1 text-[12.5px] text-ink-soft">Likely range <span class="num">' + Math.max(400, sc.total - 30) + '–' + Math.min(1600, sc.total + 30) + '</span> · about the <b>' + percentile(sc.total) + '</b> percentile</div>';
        } else if (sc.r != null || sc.m != null) {
          const v = sc.r != null ? sc.r : sc.m;
          big = v; ringPct = (v - 200) / 600; ringLabel = 'of 800';
          sub = '<div class="mt-1 text-[12.5px] text-ink-soft">' + (sc.r != null ? 'R&W' : 'Math') + ' section score. Finish both sections for a total out of 1600.</div>';
        } else {
          let ok = 0, tot = 0;
          Object.keys(dm).forEach(function (k) { ok += dm[k].ok; tot += dm[k].total; });
          big = ok; ringPct = tot ? ok / tot : 0; ringLabel = 'of ' + tot;
          sub = '<div class="mt-1 text-[12.5px] text-ink-soft">Raw score. A scaled score needs both modules of a section.</div>';
        }
        const C = 2 * Math.PI * 54;
        return '<section class="card flex flex-col items-center gap-6 p-6 sm:flex-row md:p-8">' +
          '<div class="relative h-[148px] w-[148px] shrink-0"><svg viewBox="0 0 128 128" class="h-full w-full -rotate-90" aria-hidden="true"><circle cx="64" cy="64" r="54" fill="none" stroke="rgb(var(--c-raised))" stroke-width="10"/>' +
          '<circle class="pt-ring" data-ring="' + (C * (1 - Math.max(0.02, Math.min(1, ringPct)))).toFixed(1) + '" cx="64" cy="64" r="54" fill="none" stroke="rgb(var(--c-accent))" stroke-width="10" stroke-linecap="round" stroke-dasharray="' + C.toFixed(1) + '" stroke-dashoffset="' + C.toFixed(1) + '"/></svg>' +
          '<div class="absolute inset-0 grid place-content-center text-center"><div class="num text-[34px] font-semibold leading-none tracking-tight">' + big + '</div><div class="mt-1 text-[11.5px] text-ink-mute">' + ringLabel + '</div></div></div>' +
          '<div class="min-w-0 flex-1 text-center sm:text-left"><div class="text-[12px] font-semibold uppercase tracking-[0.08em] text-ink-mute">Estimated score</div>' + sub +
          '<div class="mt-4 grid grid-cols-2 gap-3">' +
            '<div class="rounded-xl bg-raised p-3"><div class="text-[11.5px] text-ink-soft">Reading &amp; Writing</div><div class="num mt-1 text-[22px] font-semibold">' + (sc.r != null ? sc.r : '—') + '</div></div>' +
            '<div class="rounded-xl bg-raised p-3"><div class="text-[11.5px] text-ink-soft">Math</div><div class="num mt-1 text-[22px] font-semibold">' + (sc.m != null ? sc.m : '—') + '</div></div>' +
          '</div></div></section>';
      }

      function moduleCardsHTML(det, dm) {
        return '<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">' + ORDER.map(function (k) {
          const M = MODS[k], d = dm[k], m = det && det.mods && det.mods[k];
          if (!d) return '<div class="rounded-2xl border border-dashed p-4 opacity-60"><div class="text-[13.5px] font-semibold">' + M.short + '</div><div class="mt-1 text-[12.5px] text-ink-soft">Not taken</div></div>';
          const pct = d.total ? Math.round(d.ok / d.total * 100) : 0;
          let route = '';
          if (M.n === 2 && d.level) {
            route = d.level === 'hard' ? '<span class="rounded-full bg-accent/15 px-2 py-0.5 text-[11px] font-semibold text-accent">Harder route</span>'
              : d.level === 'easy' ? '<span class="rounded-full bg-hl/15 px-2 py-0.5 text-[11px] font-semibold text-hl">Easier route</span>'
              : '<span class="rounded-full bg-raised px-2 py-0.5 text-[11px] font-semibold text-ink-soft">Mixed</span>';
          }
          return '<div class="card p-4"><div class="flex items-center justify-between gap-2"><div class="text-[13.5px] font-semibold">' + M.short + '</div>' + route + '</div>' +
            '<div class="mt-3 flex items-baseline gap-2"><span class="num text-[26px] font-semibold leading-none">' + d.ok + '</span><span class="num text-[13px] text-ink-soft">/ ' + d.total + ' · ' + pct + '%</span></div>' +
            '<div class="mt-3 h-1.5 overflow-hidden rounded-full bg-raised"><div class="h-full rounded-full ' + (pct >= 80 ? 'bg-success' : pct >= 60 ? 'bg-accent' : 'bg-danger') + '" style="width:' + pct + '%"></div></div>' +
            (m && m.used != null ? '<div class="mt-2.5 text-[12px] text-ink-soft">Used <span class="num">' + clock(m.used) + '</span> of <span class="num">' + clock(M.min * 60 * (m.mult || 1)) + '</span></div>' : '') + '</div>';
        }).join('') + '</div>';
      }

      function domainsHTML() {
        if (!rows.length) return '';
        const agg = { rw: {}, math: {} };
        rows.forEach(function (r) {
          const sec = secOf(r), dom = (r.q && r.q.domain) || 'Other';
          const o = agg[sec][dom] || (agg[sec][dom] = { n: 0, ok: 0 });
          o.n++; if (r.ok) o.ok++;
        });
        const col = function (sec, title) {
          const names = BLUEPRINT[sec].map(function (b) { return b[0]; }).concat(Object.keys(agg[sec]).filter(function (n) { return !BLUEPRINT[sec].some(function (b) { return b[0] === n; }); }));
          const list = names.filter(function (n) { return agg[sec][n]; }).map(function (n) {
            const o = agg[sec][n], pct = Math.round(o.ok / o.n * 100);
            return '<div><div class="flex items-center justify-between gap-3 text-[12.5px]"><span class="min-w-0 truncate">' + esc(n) + '</span><span class="num shrink-0 text-ink-soft">' + o.ok + '/' + o.n + ' · ' + pct + '%</span></div>' +
              '<div class="mt-1.5 h-1.5 overflow-hidden rounded-full bg-raised"><div class="h-full rounded-full ' + (pct >= 80 ? 'bg-success' : pct >= 60 ? 'bg-accent' : 'bg-danger') + '" style="width:' + pct + '%"></div></div></div>';
          }).join('');
          return '<div><h3 class="mb-3 text-[13px] font-semibold">' + title + '</h3><div class="space-y-3.5">' + (list || '<p class="text-[12.5px] text-ink-soft">Not taken</p>') + '</div></div>';
        };
        return '<section class="card p-5 md:p-6"><h2 class="mb-5 text-[15px] font-semibold">Accuracy by domain</h2><div class="grid gap-8 md:grid-cols-2">' + col('rw', 'Reading &amp; Writing') + col('math', 'Math') + '</div></section>';
      }

      function paceHTML() {
        if (!rows.length) return '';
        const box = function (sec, title) {
          const rs = rows.filter(function (r) { return secOf(r) === sec; });
          if (!rs.length) return '';
          const avg = rs.reduce(function (s, r) { return s + r.sec; }, 0) / rs.length;
          const tgt = PACE_TARGET[sec];
          const tag = avg > tgt * 1.15 ? ['Slower than target', 'bg-hl/15 text-hl'] : avg < tgt * 0.6 ? ['Very fast', 'bg-accent/15 text-accent'] : ['On pace', 'bg-success/10 text-success'];
          return '<div class="rounded-xl bg-raised p-4"><div class="flex items-center justify-between gap-2"><span class="text-[12.5px] text-ink-soft">' + title + '</span><span class="rounded-full px-2 py-0.5 text-[11px] font-semibold ' + tag[1] + '">' + tag[0] + '</span></div>' +
            '<div class="num mt-2 text-[24px] font-semibold leading-none">' + fmtSec(avg) + '<span class="text-[12px] font-normal text-ink-mute"> per question</span></div>' +
            '<div class="mt-1.5 text-[12px] text-ink-soft">Target about <span class="num">' + fmtSec(tgt) + '</span></div></div>';
        };
        const flagged = rows.filter(function (r) { return r.fl; });
        const flagWrong = flagged.filter(function (r) { return !r.ok; }).length;
        const skipped = rows.filter(function (r) { return !r.a; }).length;
        const slow = rows.slice().sort(function (a, b) { return b.sec - a.sec; }).slice(0, 3).filter(function (r) { return r.sec > 0; });
        return '<section class="card p-5 md:p-6"><h2 class="mb-4 text-[15px] font-semibold">Pace and habits</h2>' +
          '<div class="grid gap-3 sm:grid-cols-2">' + box('rw', 'Reading &amp; Writing') + box('math', 'Math') + '</div>' +
          '<div class="mt-4 grid grid-cols-3 gap-3 text-center">' +
            '<div class="rounded-xl border p-3"><div class="num text-[20px] font-semibold">' + skipped + '</div><div class="mt-0.5 text-[11.5px] text-ink-soft">Unanswered</div></div>' +
            '<div class="rounded-xl border p-3"><div class="num text-[20px] font-semibold">' + flagged.length + '</div><div class="mt-0.5 text-[11.5px] text-ink-soft">Marked for review</div></div>' +
            '<div class="rounded-xl border p-3"><div class="num text-[20px] font-semibold">' + flagWrong + '</div><div class="mt-0.5 text-[11.5px] text-ink-soft">Marked and missed</div></div></div>' +
          (slow.length ? '<div class="mt-5"><div class="mb-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-ink-mute">Biggest time sinks</div><div class="space-y-1">' + slow.map(function (r) {
            return '<button type="button" data-r="open" data-i="' + r.gi + '" class="flex min-h-[44px] w-full items-center gap-3 rounded-lg px-3 text-left hover:bg-raised"><span class="num w-16 text-[12px] text-ink-soft">' + MODS[r.key].pip + ' · ' + (r.idx + 1) + '</span>' +
              '<span class="min-w-0 flex-1 truncate text-[13px]">' + esc((r.q && r.q.skill) || 'Question') + '</span><span class="num text-[12.5px] text-hl">' + fmtSec(r.sec) + '</span></button>';
          }).join('') + '</div></div>' : '') + '</section>';
      }

      function rowHTML(r) {
        const q = r.q;
        const status = !r.a ? '<span class="grid h-5 w-5 place-items-center rounded-full bg-raised text-ink-mute"><i data-lucide="minus" class="h-3 w-3"></i></span>'
          : r.ok ? '<span class="grid h-5 w-5 place-items-center rounded-full bg-success text-white"><i data-lucide="check" class="h-3 w-3"></i></span>'
          : '<span class="grid h-5 w-5 place-items-center rounded-full bg-danger text-white"><i data-lucide="x" class="h-3 w-3"></i></span>';
        const d = q && q.difficulty;
        const dcls = d === 'easy' ? 'bg-success/10 text-success' : d === 'hard' ? 'bg-danger/10 text-danger' : 'bg-hl/15 text-hl';
        return '<button type="button" data-r="open" data-i="' + r.gi + '" class="flex min-h-[52px] w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-raised">' +
          '<span class="num w-7 shrink-0 text-center text-[12.5px] text-ink-mute">' + (r.idx + 1) + '</span>' +
          '<span class="hidden w-[64px] shrink-0 text-[11.5px] text-ink-soft sm:block">' + MODS[r.key].pip + '</span>' +
          '<span class="min-w-0 flex-1 truncate text-[13.5px]">' + esc(q ? (q.skill || q.domain) : 'Question unavailable') + '</span>' +
          (d ? '<span class="hidden h-5 shrink-0 items-center rounded-full px-2 text-[11px] font-semibold sm:inline-flex ' + dcls + '">' + (DIFF_LABEL[d] || d) + '</span>' : '') +
          (r.fl ? '<i data-lucide="flag" class="h-3.5 w-3.5 shrink-0 text-hl"></i>' : '') +
          '<span class="num w-14 shrink-0 text-right text-[12px] text-ink-soft">' + fmtSec(r.sec) + '</span>' + status + '</button>';
      }

      function reviewHTML() {
        if (!rows.length) {
          return '<section class="card p-6 text-center"><p class="text-[14px] font-semibold">Question review is not available</p>' +
            '<p class="mx-auto mt-1.5 max-w-[420px] text-[12.5px] leading-relaxed text-ink-soft">This test was taken before detailed results were saved. Retake it to get a full breakdown of every question.</p></section>';
        }
        const all = rows.filter(function (r) { return R.mod === 'all' || r.key === R.mod; });
        const cnt = { all: all.length, missed: all.filter(function (r) { return !r.ok; }).length, skip: all.filter(function (r) { return !r.a; }).length, flag: all.filter(function (r) { return r.fl; }).length, slow: all.filter(isSlow).length };
        const chip = function (a, v, text, on) {
          return '<button type="button" data-r="' + a + '" data-v="' + v + '" aria-pressed="' + on + '" class="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[12.5px] font-medium transition-colors ' + (on ? 'bg-accent/15 text-accent' : 'text-ink-soft hover:bg-raised hover:text-ink') + '">' + text + '</button>';
        };
        const f = [['all', 'All'], ['missed', 'Missed'], ['flag', 'Marked'], ['skip', 'Unanswered'], ['slow', 'Slow']].map(function (x) {
          return chip('filter', x[0], x[1] + ' <span class="num text-[11px] opacity-70">' + cnt[x[0]] + '</span>', R.filter === x[0]);
        }).join('');
        const mods = [['all', 'All modules']].concat(ORDER.filter(function (k) { return rows.some(function (r) { return r.key === k; }); }).map(function (k) { return [k, MODS[k].pip]; })).map(function (x) {
          return chip('mod', x[0], x[1], R.mod === x[0]);
        }).join('');
        const list = filtered();
        return '<section id="ptReview" class="card p-4 md:p-6"><div class="mb-4 flex flex-wrap items-center justify-between gap-3"><h2 class="text-[15px] font-semibold">Question review</h2><div class="flex flex-wrap gap-1">' + mods + '</div></div>' +
          '<div class="mb-3 flex flex-wrap gap-1">' + f + '</div>' +
          (list.length ? '<div class="divide-y divide-transparent">' + list.map(rowHTML).join('') + '</div>' : '<p class="px-3 py-10 text-center text-[13px] text-ink-soft">No questions match this filter.</p>') + '</section>';
      }

      function paint(det, dm, it) {
        const sc = scoresOf(t);
        let when = 0;
        if (det && det.mods) Object.keys(det.mods).forEach(function (k) { when = Math.max(when, det.mods[k].date || 0); });
        root.innerHTML = '<div class="mx-auto w-full max-w-[1100px] space-y-6 px-4 py-6 md:px-8 md:py-10">' +
          '<div class="pt-rise flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div class="min-w-0">' +
            '<a href="#/practice-tests" class="inline-flex h-9 items-center gap-1.5 text-[13px] font-medium text-ink-soft hover:text-ink"><i data-lucide="arrow-left" class="h-4 w-4"></i>Practice Tests</a>' +
            '<h1 class="mt-1 text-[26px] font-semibold tracking-tight md:text-[30px]">' + esc(it.name) + ' <span class="text-ink-soft">· Results</span></h1>' +
            (when ? '<p class="mt-1 text-[13px] text-ink-soft">Last attempt ' + fmtDate(when) + '</p>' : '') + '</div>' +
          '<div class="flex flex-wrap gap-2.5">' +
            '<button type="button" data-r="goMissed" class="inline-flex h-11 items-center gap-2 rounded-lg border px-4 text-[13.5px] font-medium hover:bg-raised"' + (rows.length ? '' : ' disabled') + '><i data-lucide="list-checks" class="h-4 w-4"></i>Review mistakes</button>' +
            '<button type="button" data-r="retake" class="inline-flex h-11 items-center gap-2 rounded-lg bg-accent px-5 text-[13.5px] font-semibold text-white hover:bg-accent-hover"><i data-lucide="rotate-ccw" class="h-4 w-4"></i>Retake</button></div></div>' +
          (isNew ? '<div class="flex items-start gap-3 rounded-2xl border border-success/30 bg-success/10 px-4 py-3 text-[13px]"><i data-lucide="check-circle-2" class="mt-0.5 h-4 w-4 shrink-0 text-success"></i><span>Results saved. Questions you missed were added to your Review Queue.</span></div>' : '') +
          scoreCardHTML(sc, dm) + moduleCardsHTML(det, dm) + domainsHTML() + paceHTML() + '<div id="ptRvHost">' + reviewHTML() + '</div></div><div id="ptDrawer"></div>';
        icons();
        requestAnimationFrame(function () {
          root.querySelectorAll('[data-ring]').forEach(function (c) { c.style.strokeDashoffset = c.getAttribute('data-ring'); });
        });
      }

      /* ---------- шторка с разбором задачи ---------- */
      function drawerHTML() {
        const r = rows[R.open];
        if (!r) return '';
        const q = r.q, list = filtered(), pos = list.indexOf(r);
        let body;
        if (!q) {
          body = '<p class="text-[13.5px] text-ink-soft">This question is no longer available in the bank.</p>';
        } else {
          let answers;
          if (q.type === 'mcq') {
            answers = '<div class="mt-5 space-y-2">' + q.choices.map(function (c) {
              const isRight = c.key === q.correctAnswer, mine = r.a === c.key;
              const cls = isRight ? 'border-success bg-success/10' : mine ? 'border-danger bg-danger/10' : 'bg-surface';
              const lt = isRight ? 'border-success bg-success text-white' : mine ? 'border-danger bg-danger text-white' : 'text-ink-soft';
              return '<div class="flex min-h-[48px] items-center gap-3 rounded-xl border px-3.5 py-2 ' + cls + '"><span class="grid h-6 w-6 shrink-0 place-items-center rounded-full border text-[12px] font-semibold ' + lt + '">' + esc(c.key) + '</span>' +
                '<span class="min-w-0 flex-1 text-[14px] leading-snug">' + rich(c.text) + '</span>' +
                (isRight ? '<span class="text-[11px] font-semibold text-success">Correct</span>' : mine ? '<span class="text-[11px] font-semibold text-danger">Your answer</span>' : '') + '</div>';
            }).join('') + '</div>' + (!r.a ? '<p class="mt-3 text-[12.5px] text-hl">You did not answer this question.</p>' : '');
          } else {
            answers = '<div class="mt-5 grid gap-3 sm:grid-cols-2"><div class="rounded-xl border p-3"><div class="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-mute">Your answer</div><div class="num mt-1 text-[15px]">' + (r.a ? esc(r.a) : '<span class="text-hl">—</span>') + '</div></div>' +
              '<div class="rounded-xl border border-success/30 bg-success/10 p-3"><div class="text-[11px] font-semibold uppercase tracking-[0.08em] text-success">Accepted answers</div><div class="num mt-1 text-[15px]">' + (q.acceptedAnswers && q.acceptedAnswers.length ? q.acceptedAnswers.map(esc).join(', ') : esc(q.correctAnswer)) + '</div></div></div>';
          }
          const passage = q.section === 'rw' && q.passage && String(q.passage).trim() ? '<div class="pt-prompt mb-4 rounded-xl border bg-canvas/40 p-4 text-[14px] leading-[1.7]">' + rich(q.passage) + '</div>' : '';
          body = passage + '<div class="pt-prompt text-[15px] leading-relaxed">' + rich(q.prompt) + '</div>' + answers +
            '<h3 class="mb-2 mt-7 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-mute">Explanation</h3>' +
            (String(q.explanation || '').trim() ? '<div class="pt-prompt text-[14px] leading-[1.7]">' + rich(q.explanation) + '</div>' : '<p class="text-[13px] text-ink-soft">A step-by-step explanation is not available for this question yet.</p>');
        }
        const chip = function (icon, text) { return '<span class="inline-flex h-7 items-center gap-1.5 rounded-full bg-raised px-2.5 text-[12px] text-ink-soft"><i data-lucide="' + icon + '" class="h-3.5 w-3.5"></i>' + text + '</span>'; };
        return '<div class="fixed inset-0 z-[70] pt-fade"><div class="absolute inset-0 bg-black/40" data-r="closeDrawer"></div>' +
          '<aside class="absolute inset-y-0 right-0 flex w-full max-w-[520px] flex-col border-l bg-surface shadow-2xl" role="dialog" aria-modal="true" aria-label="Question review">' +
            '<div class="flex h-14 shrink-0 items-center justify-between gap-2 border-b px-4"><div class="min-w-0 text-[14px] font-semibold">' + MODS[r.key].short + ' · Question ' + (r.idx + 1) + '</div>' +
            '<button type="button" data-r="closeDrawer" class="grid h-11 w-11 place-items-center rounded-lg text-ink-soft hover:bg-raised hover:text-ink" aria-label="Close"><i data-lucide="x" class="h-[18px] w-[18px]"></i></button></div>' +
            '<div class="flex-1 overflow-y-auto p-5"><div class="mb-4 flex flex-wrap gap-2">' +
              '<span class="inline-flex h-7 items-center rounded-full px-3 text-[12px] font-semibold ' + (!r.a ? 'bg-raised text-ink-soft' : r.ok ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger') + '">' + (!r.a ? 'Unanswered' : r.ok ? 'Correct' : 'Incorrect') + '</span>' +
              chip('timer', fmtSec(r.sec)) + (r.fl ? chip('flag', 'Marked for review') : '') + (q && q.skill ? chip('tag', esc(q.skill)) : '') + '</div>' + body + '</div>' +
            '<div class="flex shrink-0 items-center justify-between gap-2 border-t px-4 py-3">' +
              '<button type="button" data-r="prev" ' + (pos <= 0 ? 'disabled ' : '') + 'class="inline-flex h-11 items-center gap-1.5 rounded-lg border px-4 text-[13px] font-medium hover:bg-raised disabled:opacity-40"><i data-lucide="chevron-left" class="h-4 w-4"></i>Previous</button>' +
              '<span class="num text-[12px] text-ink-mute">' + (pos + 1) + ' / ' + list.length + '</span>' +
              '<button type="button" data-r="next" ' + (pos < 0 || pos >= list.length - 1 ? 'disabled ' : '') + 'class="inline-flex h-11 items-center gap-1.5 rounded-lg border px-4 text-[13px] font-medium hover:bg-raised disabled:opacity-40">Next<i data-lucide="chevron-right" class="h-4 w-4"></i></button></div>' +
          '</aside></div>';
      }
      function paintDrawer() {
        const h = root.querySelector('#ptDrawer');
        if (!h) return;
        if (R.open >= 0) morphInner(h, drawerHTML(), 'aside');
        else h.innerHTML = '';
        if (R.open >= 0) renderMath(h);
        icons();
      }
      function paintReview() {
        const h = root.querySelector('#ptRvHost');
        if (h) { h.innerHTML = reviewHTML(); icons(); }
      }

      function bind() {
        function onClick(e) {
          const b = e.target.closest('[data-r]');
          if (!b || b.disabled) return;
          const a = b.getAttribute('data-r');
          if (a === 'filter') { R.filter = b.getAttribute('data-v'); paintReview(); }
          else if (a === 'mod') { R.mod = b.getAttribute('data-v'); paintReview(); }
          else if (a === 'open') { R.open = +b.getAttribute('data-i'); paintDrawer(); }
          else if (a === 'closeDrawer') { R.open = -1; paintDrawer(); }
          else if (a === 'prev' || a === 'next') {
            const list = filtered(), pos = list.indexOf(rows[R.open]), np = list[pos + (a === 'next' ? 1 : -1)];
            if (np) { R.open = np.gi; paintDrawer(); const body = root.querySelector('#ptDrawer .overflow-y-auto'); if (body) body.scrollTop = 0; }
          }
          else if (a === 'goMissed') {
            R.filter = 'missed'; R.mod = 'all'; paintReview();
            const el = root.querySelector('#ptReview');
            if (el && el.scrollIntoView) { try { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (err) {} }
          }
          else if (a === 'retake') ctx.navigate('practice-tests?start=' + t);
        }
        function onKey(e) {
          if (e.key === 'Escape' && R.open >= 0) { R.open = -1; paintDrawer(); }
        }
        root.addEventListener('click', onClick);
        document.addEventListener('keydown', onKey);
        cleanups.push(function () { root.removeEventListener('click', onClick); document.removeEventListener('keydown', onKey); });
      }
    }
  });


  /* =====================================================================
     9. ЭКЗАМЕН В СТИЛЕ BLUEBOOK   (#/exam?t=3)
        gate → module → (review) → between | break → ... → pt-results
     ===================================================================== */
  Shell.register('exam', {
    layout: 'full',
    title: 'Practice Test',
    group: 'Simulate',
    render: function (root, ctx) {
      injectStyle();
      const t = +ctx.params.get('t');
      let S = Store.sess(t);
      if (!S || !S.mods || !S.mods.length) {
        setTimeout(function () { ctx.navigate('practice-tests'); }, 0);
        return function () {};
      }
      const IT = entry(t);
      let alive = true, HL = null, desG = null, desS = null;
      const cleanups = [], timeouts = [];

      // Сохранённая фаза: на экране «Before you begin» всегда показываем gate (нужен жест для full screen)
      const resumePhase = (S.phase && S.phase !== 'gate' && S.phase !== 'done') ? S.phase : 'gate';
      S.phase = 'gate';

      const P0 = Store.prefs();
      const T = {
        paused: false, hide: false, calc: false, wide: false, ctab: 'graphing', elim: false,
        grid: false, ref: false, dirs: false, menu: false, keys: false, review: false,
        ptab: 'p', fsLost: false, fsOff: false, fired5: false, fired1: false,
        last: Date.now(), lastSave: Date.now(), size: P0.size, topics: P0.topics, cd: 0, mounted: false
      };

      const $ = function (id) { return root.querySelector('#' + id); };
      const BTN = 'inline-flex h-11 min-w-[44px] items-center justify-center gap-2 rounded-lg border border-transparent px-2.5 text-[13px] font-medium text-ink-soft transition-colors hover:bg-raised hover:text-ink';
      const PRIMARY = 'inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-accent px-7 text-[14.5px] font-semibold text-white transition-colors hover:bg-accent-hover';
      const GHOST = 'inline-flex h-11 items-center justify-center gap-2 rounded-lg border px-5 text-[13.5px] font-medium text-ink-soft transition-colors hover:bg-raised hover:text-ink';

      root.innerHTML =
        '<div id="ptx" class="fixed inset-0 z-[50] flex flex-col bg-canvas text-ink">' +
          '<div id="ptScreen" class="flex min-h-0 flex-1 flex-col"></div>' +
          '<div id="ptToasts" class="pointer-events-none fixed bottom-24 left-1/2 z-[90] flex -translate-x-1/2 flex-col items-center gap-2"></div>' +
        '</div>';
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      cleanups.push(function () { document.body.style.overflow = prevOverflow; });

      function toast(msg) {
        const h = $('ptToasts');
        if (!h) return;
        const d = document.createElement('div');
        d.className = 'pt-rise rounded-xl border bg-raised px-4 py-2.5 text-[13px] shadow-2xl';
        d.textContent = msg;
        h.appendChild(d);
        timeouts.push(setTimeout(function () { d.remove(); }, 3400));
      }

      /* ---------- сохранение ---------- */
      let saveT = null;
      function persist() {
        if (!alive || S.phase === 'done') return;
        const copy = Object.assign({}, S);
        if (S.phase === 'gate') copy.phase = resumePhase;
        Store.setSess(t, copy);
        T.lastSave = Date.now();
      }
      function persistSoon() { clearTimeout(saveT); saveT = setTimeout(persist, 400); }
      cleanups.push(function () { clearTimeout(saveT); });

      /* ---------- helpers ---------- */
      const curM = function () { return S.cur ? MODS[S.cur.key] : null; };
      const nQ = function () { return S.cur ? S.cur.ids.length : 0; };
      const qAt = function (i) { try { return Data.getQuestion(S.cur.ids[i]); } catch (e) { return null; } };
      function answeredCount() {
        let n = 0;
        for (let i = 0; i < nQ(); i++) if (S.cur.ans[i] != null && S.cur.ans[i] !== '') n++;
        return n;
      }
      function flaggedCount() { let n = 0; for (let i = 0; i < nQ(); i++) if (S.cur.flag[i]) n++; return n; }
      function isDark() { return document.documentElement.classList.contains('dark'); }
      function wantFs() { return !!S.fs && !T.fsOff && fsSupported(); }
      function modLabel(k) { const M = MODS[k]; return 'Section ' + M.secNo + ', Module ' + M.n + ': ' + M.full; }
      function modSecs(k) { return Math.round(MODS[k].min * 60 * S.mult); }

      /* =================================================================
         ОТРИСОВКА ФАЗ
         ================================================================= */
      function show() {
        teardownModule();
        const scr = $('ptScreen');
        if (!scr) return;
        scr.classList.remove('sp-no-anim');
        T.paused = false; T.review = false; T.grid = false; T.menu = false; T.dirs = false; T.ref = false; T.keys = false;
        if (S.phase === 'gate') paintGate();
        else if (S.phase === 'module') mountModule();
        else if (S.phase === 'between') paintBetween();
        else if (S.phase === 'break') paintBreak();
        icons();
      }

      /* ---------- Gate ---------- */
      function paintGate() {
        const scr = $('ptScreen');
        const mods = S.mods;
        const mins = plannedMin(mods, S.mult);
        const resuming = resumePhase !== 'gate';
        const done = Object.keys(S.done || {}).length;
        scr.innerHTML =
          '<div class="flex-1 overflow-y-auto"><div class="mx-auto flex min-h-full w-full max-w-[640px] flex-col justify-center px-5 py-10">' +
            '<div class="pt-rise">' +
              '<div class="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[12px] font-medium text-ink-soft"><i data-lucide="shield-check" class="h-3.5 w-3.5 text-accent"></i>Exam mode</div>' +
              '<h1 class="mt-4 text-[30px] font-semibold leading-tight tracking-tight">' + esc(IT.name) + '</h1>' +
              '<p class="mt-2 text-[14.5px] text-ink-soft">' + (resuming
                ? 'Welcome back. Your progress is saved' + (done ? ' — ' + done + ' module' + (done > 1 ? 's' : '') + ' already submitted.' : '.') + ' The clock stays paused until you continue.'
                : (mods.length === 4 ? 'Full-length test' : mods.length + ' selected module' + (mods.length > 1 ? 's' : '')) + ' · <span class="num">' + plannedQ(mods) + '</span> questions · about ' + fmtMin(mins) + (S.mult !== 1 ? ' (×' + S.mult + ' time)' : '') + '.') + '</p>' +
              '<div class="mt-6 flex flex-wrap gap-2">' + mods.map(function (k, i) {
                const doneMark = S.done && S.done[k];
                return '<span class="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12.5px] ' + (doneMark ? 'border-success/40 bg-success/10 text-success' : 'text-ink-soft') + '">' +
                  '<span class="num text-ink-mute">' + (i + 1) + '</span>' + MODS[k].short + (doneMark ? '<i data-lucide="check" class="h-3.5 w-3.5"></i>' : '') + '</span>';
              }).join('') + '</div>' +
              '<div class="card mt-7 p-5"><h2 class="text-[13px] font-semibold">Before you begin</h2><ul class="mt-3 space-y-2.5 text-[13.5px] leading-snug text-ink-soft">' + [
                ['timer', 'The timer runs for the whole module. You can pause it, but you cannot go back to a finished module.'],
                ['flag', 'Mark questions for review and use the question grid to jump around inside a module.'],
                ['list-checks', 'Before you submit, the review page shows which questions are unanswered or marked.'],
                ['phone-off', 'Silence notifications, close other tabs and keep scratch paper and a pencil nearby.']
              ].map(function (r) {
                return '<li class="flex gap-3"><i data-lucide="' + r[0] + '" class="mt-0.5 h-4 w-4 shrink-0 text-accent"></i><span>' + r[1] + '</span></li>';
              }).join('') + '</ul></div>' +
              '<div class="mt-4 flex items-center justify-between gap-4 rounded-2xl border px-5 py-3.5"><div class="min-w-0"><div class="text-[13.5px] font-medium">Full screen</div>' +
                '<div class="text-[12px] text-ink-soft">' + (fsSupported() ? 'Hides everything else. Leaving full screen pauses the clock.' : 'Not supported in this browser.') + '</div></div>' +
                '<button type="button" role="switch" data-x="gateFs" aria-checked="' + (S.fs && fsSupported()) + '" aria-label="Full screen" ' + (fsSupported() ? '' : 'disabled ') +
                'class="relative h-6 w-10 shrink-0 rounded-full transition-colors ' + (S.fs && fsSupported() ? 'bg-accent' : 'border bg-raised') + (fsSupported() ? '' : ' opacity-50') + '">' +
                '<span class="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ' + (S.fs && fsSupported() ? 'left-[18px]' : 'left-0.5') + '"></span></button></div>' +
              '<div class="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:items-center">' +
                '<button type="button" data-x="exit" class="' + GHOST + '">' + (resuming ? 'Back to tests' : 'Not now') + '</button>' +
                '<button type="button" data-x="begin" class="' + PRIMARY + ' sm:flex-1">' + (resuming ? 'Continue test' : 'Begin test') + '<i data-lucide="arrow-right" class="h-4 w-4"></i></button>' +
              '</div>' +
            '</div></div></div>' +
          '<div id="ptCd" class="fixed inset-0 z-[70] hidden place-items-center bg-canvas"></div>' +
          '<div id="ptLayer"></div>';
        const b = scr.querySelector('[data-x="begin"]');
        if (b) b.focus();
      }

      function countdown() {
        const cd = $('ptCd');
        if (!cd) { begin(); return; }
        cd.classList.remove('hidden'); cd.classList.add('grid');
        let n = 3;
        (function step() {
          if (!alive) return;
          if (n === 0) { begin(); return; }
          cd.innerHTML = '<div class="text-center"><div class="pt-count num text-[120px] font-semibold leading-none tracking-tight text-accent" key="' + n + '">' + n + '</div>' +
            '<p class="mt-4 text-[14px] text-ink-soft">' + (S.phase === 'gate' && resumePhase !== 'gate' ? 'Resuming…' : 'Get ready') + '</p></div>';
          n--;
          timeouts.push(setTimeout(step, 850));
        })();
      }

      function begin() {
        if (!alive) return;
        T.last = Date.now();
        if (resumePhase === 'module' && S.cur) S.phase = 'module';
        else if ((resumePhase === 'break' || resumePhase === 'between') && S.mods[S.step]) S.phase = resumePhase;
        else { startModule(); return; }
        persist();
        show();
      }

      /* ---------- Между модулями ---------- */
      function paintBetween() {
        const scr = $('ptScreen');
        const prevKey = S.mods[S.step - 1], nextKey = S.mods[S.step];
        const d = S.done[prevKey] || {};
        const nextM = MODS[nextKey];
        scr.innerHTML =
          '<div class="flex-1 overflow-y-auto"><div class="mx-auto flex min-h-full w-full max-w-[520px] flex-col justify-center px-5 py-10 text-center">' +
            '<div class="pt-rise"><div class="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-success/10 text-success"><i data-lucide="check-circle-2" class="h-7 w-7"></i></div>' +
            '<h1 class="mt-5 text-[26px] font-semibold tracking-tight">' + MODS[prevKey].short + ' submitted</h1>' +
            '<p class="mt-2 text-[14px] text-ink-soft">' + (d.answered != null ? 'You answered <span class="num">' + d.answered + '</span> of <span class="num">' + d.total + '</span> questions.' : 'Your answers are saved.') +
              ' Results are shown at the end, like on test day.</p>' +
            '<div class="card mt-7 p-5 text-left"><div class="text-[11.5px] font-semibold uppercase tracking-[0.08em] text-ink-mute">Up next</div>' +
              '<div class="mt-1.5 text-[17px] font-semibold">' + nextM.short + '</div>' +
              '<div class="mt-1 text-[13px] text-ink-soft"><span class="num">' + nextM.q + '</span> questions · <span class="num">' + fmtMin(nextM.min * S.mult) + '</span>' +
              (nextM.n === 2 && S.adaptive && S.done[nextM.sec === 'rw' ? 'r1' : 'm1'] ? ' · tuned to your Module 1 result' : '') + '</div></div>' +
            '<div class="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">' +
              '<button type="button" data-x="saveExit" class="' + GHOST + '">Save &amp; exit</button>' +
              '<button type="button" data-x="goNext" class="' + PRIMARY + '">Start ' + nextM.short + '<i data-lucide="arrow-right" class="h-4 w-4"></i></button></div></div>' +
          '</div></div><div id="ptLayer"></div>';
        const b = scr.querySelector('[data-x="goNext"]');
        if (b) b.focus();
      }

      /* ---------- Перерыв ---------- */
      const RING_C = 2 * Math.PI * 84;
      function paintBreak() {
        const scr = $('ptScreen');
        const nextM = MODS[S.mods[S.step]];
        const main = S.brkKind === 'main';
        const len = S.brkLen || (main ? 600 : 120);
        scr.innerHTML =
          '<header class="flex h-14 shrink-0 items-center justify-between border-b bg-surface px-4 md:px-6"><div class="text-[14px] font-semibold">' + (main ? 'Take a break' : 'Short break') + '</div>' +
            '<button type="button" data-x="saveExit" class="' + BTN + '"><i data-lucide="log-out" class="h-4 w-4"></i><span class="hidden sm:inline">Save &amp; exit</span></button></header>' +
          '<div class="flex-1 overflow-y-auto"><div class="mx-auto grid w-full max-w-[1000px] gap-6 px-4 py-8 md:grid-cols-2 md:px-8 md:py-12">' +
            '<div class="space-y-6"><section class="card pt-rise flex flex-col items-center p-6 md:p-8">' +
              '<div class="relative h-[200px] w-[200px]"><svg viewBox="0 0 200 200" class="h-full w-full -rotate-90" aria-hidden="true"><circle cx="100" cy="100" r="84" fill="none" stroke="rgb(var(--c-raised))" stroke-width="10"/>' +
              '<circle id="ptRing" cx="100" cy="100" r="84" fill="none" stroke="rgb(var(--c-accent))" stroke-width="10" stroke-linecap="round" stroke-dasharray="' + RING_C.toFixed(1) + '" stroke-dashoffset="' + (RING_C * (1 - Math.max(0, S.brkLeft) / len)).toFixed(1) + '"/></svg>' +
              '<div class="absolute inset-0 grid place-content-center text-center"><div id="ptBrk" class="num text-[40px] font-semibold leading-none tracking-tight" role="timer">' + clock(S.brkLeft) + '</div><div class="mt-2 text-[12px] text-ink-mute">remaining</div></div></div>' +
              '<p class="mt-5 text-center text-[13px] text-ink-soft">The next module starts automatically when the break ends.</p>' +
              '<button type="button" data-x="resume" class="' + PRIMARY + ' mt-5 w-full">Resume testing<i data-lucide="arrow-right" class="h-4 w-4"></i></button></section>' +
            '<section class="card p-6"><div class="text-[11.5px] font-semibold uppercase tracking-[0.08em] text-ink-mute">Up next</div><div class="mt-1.5 text-[17px] font-semibold">' + nextM.short + '</div>' +
              '<div class="mt-1 text-[13px] text-ink-soft"><span class="num">' + nextM.q + '</span> questions · <span class="num">' + fmtMin(nextM.min * S.mult) + '</span>' + (nextM.sec === 'math' ? ' · calculator and reference sheet available' : '') + '</div></section></div>' +
            '<div class="space-y-6"><section class="card flex flex-col items-center p-6"><div class="text-[13px] font-semibold">Breathe with the circle</div>' +
              '<div class="relative mt-6 grid h-[170px] w-[170px] place-items-center"><div class="pt-breath absolute inset-0 rounded-full bg-accent/15 ring-1 ring-accent/40"></div>' +
              '<div class="relative h-[110px] w-[110px] text-center">' + ['Breathe in', 'Hold', 'Breathe out', 'Hold'].map(function (w, i) {
                return '<span class="pt-bl absolute inset-0 grid place-items-center text-[14px] font-medium" style="animation-delay:' + (i * 4) + 's">' + w + '</span>';
              }).join('') + '</div></div></section>' +
            '<section class="card p-6"><div class="text-[13px] font-semibold">Break rules</div><ul class="mt-3 space-y-2.5 text-[13.5px] leading-snug text-ink-soft">' + [
              'Test questions, notes and the calculator are locked until you resume.',
              'Drink water, stretch or look away from the screen. Stay in this window.',
              'Your answers in the finished module are already saved.',
              main ? 'On test day this break is 10 minutes. Accommodations may extend it.' : 'Short breaks are part of the extra-breaks accommodation.'
            ].map(function (r) { return '<li class="flex gap-3"><i data-lucide="dot" class="mt-0.5 h-4 w-4 shrink-0 text-accent"></i><span>' + r + '</span></li>'; }).join('') + '</ul>' +
            '<div class="mt-4 flex flex-wrap gap-2">' + [['droplet', 'Water'], ['move', 'Stretch'], ['eye-off', 'Rest your eyes'], ['footprints', 'Walk']].map(function (c) {
              return '<span class="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] text-ink-soft"><i data-lucide="' + c[0] + '" class="h-3.5 w-3.5"></i>' + c[1] + '</span>';
            }).join('') + '</div></section></div>' +
          '</div></div><div id="ptLayer"></div>';
      }

      function endBreak(auto) {
        if (!alive || S.phase !== 'break') return;
        const need = wantFs() && !inFs();
        if (need && !auto) reqFs();
        startModule();
        if (need && auto) { T.fsLost = true; paintLayer(); }
      }

      /* =================================================================
         ЛОГИКА МОДУЛЯ
         ================================================================= */
      function startModule() {
        const key = S.mods[S.step];
        if (!key) { completeRun(); return; }
        const M = MODS[key];
        let level = 'std';
        if (M.n === 2) {
          const pk = M.sec === 'rw' ? 'r1' : 'm1';
          level = (S.adaptive && S.done[pk]) ? nextLevel(M.sec, S.done[pk].okN) : ((S.lvl && S.lvl[M.sec]) || 'std');
        }
        const ids = moduleIds(t, key, level, IT.tilt);
        S.cur = { key: key, level: level, ids: ids, ans: {}, flag: {}, struck: {}, times: {} };
        S.secsLeft = modSecs(key);
        S.qi = 0; S.phase = 'module';
        T.last = Date.now();
        persist();
        show();
      }

      function finishModule(auto) {
        const C = S.cur;
        if (!C || S.phase !== 'module') return;
        const key = C.key, M = MODS[key], n = C.ids.length;
        const a = [], ok = [], sec = [], fl = [];
        let okN = 0, answered = 0;
        for (let i = 0; i < n; i++) {
          const id = C.ids[i], q = qAt(i), ans = C.ans[i] == null ? '' : String(C.ans[i]);
          let good = false;
          if (ans && q) {
            answered++;
            try { good = !!Data.checkAnswer(q, ans); } catch (e) {}
                        try { Data.progress.record(id, good, { leaderboard: false }); } catch (e) {}
          }
          a.push(ans); ok.push(good ? 1 : 0); sec.push(Math.round(C.times[i] || 0)); fl.push(C.flag[i] ? 1 : 0);
          if (good) okN++;
        }
        const used = Math.max(0, modSecs(key) - Math.max(0, Math.round(S.secsLeft)));
        S.done[key] = { okN: okN, total: n, level: C.level, answered: answered };
        const det = Store.det();
        const e = det[t] || (det[t] = { mods: {} });
        if (!e.mods) e.mods = {};
        e.mods[key] = { ids: C.ids, a: a, ok: ok, sec: sec, fl: fl, okN: okN, level: C.level, used: used, mult: S.mult, date: Date.now(), key: key };
        e.updated = Date.now();
        Store.setDet(det);
        syncLegacy(t);

        S.cur = null; S.qi = 0; S.step++;
        T.review = false; T.grid = false;
        if (auto) toast('Time is up. Your answers were submitted.');

        if (S.step >= S.mods.length) { completeRun(); return; }
        const nextM = MODS[S.mods[S.step]];
        if (M.sec !== nextM.sec) {
          S.phase = 'break'; S.brkKind = 'main';
          S.brkLen = S.brkLeft = (S.breaks === 'extra' ? 15 : 10) * 60;
        } else if (S.breaks === 'extra') {
          S.phase = 'break'; S.brkKind = 'short';
          S.brkLen = S.brkLeft = 120;
        } else S.phase = 'between';
        T.last = Date.now();
        persist();
        show();
      }

      function completeRun() {
        S.phase = 'done';
        Store.setSess(t, null);
        try {
          window.dispatchEvent(new CustomEvent('sp:pt-complete', { detail: { t: t, modules: S.done, scores: scoresOf(t), name: IT.name } }));
        } catch (e) {}
        exitFs();
        ctx.navigate('pt-results?t=' + t + '&new=1');
      }

      /* =================================================================
         КАРКАС МОДУЛЯ
         ================================================================= */
      function mountModule() {
        const M = curM(), math = M.sec === 'math';
        T.mounted = true; T.calc = false; T.wide = false; T.ctab = 'graphing'; T.elim = false; T.ptab = 'p';
        T.fired5 = S.secsLeft <= 300; T.fired1 = S.secsLeft <= 60;
        if (S.secsLeft <= 300) T.hide = false;
        $('ptScreen').innerHTML =
          '<header id="ptHead" class="relative z-[30] grid h-14 shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-2 border-b bg-surface px-2 md:px-5">' +
            '<div class="min-w-0 pl-1"><div class="truncate text-[13px] font-semibold leading-tight md:text-[14px]">' + esc(modLabel(S.cur.key)) + '</div>' +
              '<button type="button" data-x="dirs" aria-expanded="false" class="-ml-1 inline-flex h-6 items-center gap-1 rounded-md px-1 text-[12px] font-medium text-ink-soft hover:text-ink">Directions<i data-lucide="chevron-down" class="h-3.5 w-3.5"></i></button></div>' +
            '<div class="flex items-center gap-0.5">' +
              '<button type="button" id="ptPauseBtn" data-x="pause" class="' + BTN + ' px-2"></button>' +
              '<span id="ptTime" class="num min-w-[64px] text-center text-[19px] font-semibold tabular-nums" role="timer" aria-label="Time remaining">' + clock(S.secsLeft) + '</span>' +
              '<button type="button" id="ptHideBtn" data-x="hide" class="' + BTN + ' px-2"></button>' +
            '</div>' +
            '<div class="flex items-center justify-end gap-0.5">' +
              '<button type="button" id="ptHlBtn" data-x="hl" class="' + BTN + '" aria-label="Highlights and notes" aria-pressed="false"><i data-lucide="highlighter" class="h-4 w-4"></i><span class="hidden xl:inline">Highlights &amp; Notes</span></button>' +
              (math ? '<button type="button" id="ptCalcBtn" data-x="calc" class="' + BTN + '" aria-pressed="false" aria-label="Calculator"><i data-lucide="calculator" class="h-4 w-4"></i><span class="hidden xl:inline">Calculator</span></button>' +
                '<button type="button" data-x="ref" class="' + BTN + '" aria-label="Reference sheet"><i data-lucide="sigma" class="h-4 w-4"></i><span class="hidden xl:inline">Reference</span></button>' : '') +
              '<button type="button" id="ptMenuBtn" data-x="menu" class="' + BTN + '" aria-haspopup="menu" aria-expanded="false" aria-label="More options"><i data-lucide="more-horizontal" class="h-[18px] w-[18px]"></i></button>' +
            '</div>' +
          '</header>' +
          '<div class="h-[3px] shrink-0 bg-raised"><div id="ptBarFill" class="h-full bg-accent transition-all duration-300" style="width:0"></div></div>' +
          '<div class="relative flex min-h-0 flex-1">' +
            (math ? '<aside id="ptCalc" class="pt-calc border-r bg-surface" hidden aria-label="Calculator">' +
              '<div class="flex h-12 shrink-0 items-center gap-2 border-b px-3"><div class="flex rounded-lg bg-raised p-0.5" role="tablist" aria-label="Calculator type">' +
                '<button type="button" role="tab" data-x="ctab" data-v="graphing" class="h-8 rounded-md px-3 text-[12.5px] font-medium">Graphing</button>' +
                '<button type="button" role="tab" data-x="ctab" data-v="scientific" class="h-8 rounded-md px-3 text-[12.5px] font-medium">Scientific</button></div><span class="flex-1"></span>' +
                '<button type="button" data-x="calcWide" class="hidden h-9 w-9 place-items-center rounded-lg text-ink-soft hover:bg-raised hover:text-ink md:grid" aria-label="Expand calculator"><i data-lucide="maximize-2" class="h-4 w-4"></i></button>' +
                '<button type="button" data-x="calcClose" class="grid h-11 w-11 place-items-center rounded-lg text-ink-soft hover:bg-raised hover:text-ink md:h-9 md:w-9" aria-label="Close calculator"><i data-lucide="x" class="h-[18px] w-[18px]"></i></button></div>' +
              '<div class="relative min-h-0 flex-1 bg-white"><div id="ptDesG" class="absolute inset-0"></div><div id="ptDesS" class="absolute inset-0" hidden></div>' +
              '<div id="ptDesMsg" class="absolute inset-0 grid place-items-center bg-surface p-6 text-center text-[13px] text-ink-soft" hidden></div></div></aside>' : '') +
            '<main id="ptMain" class="min-w-0 flex-1 overflow-y-auto" tabindex="-1"></main>' +
            '<div id="ptPause" class="pt-fade absolute inset-0 z-[25] hidden place-items-center bg-canvas"><div class="px-6 text-center"><div class="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-raised text-accent"><i data-lucide="pause" class="h-6 w-6"></i></div>' +
              '<h2 class="mt-4 text-[20px] font-semibold">Test paused</h2><p class="mt-1.5 text-[13.5px] text-ink-soft">The clock is stopped and the question is hidden.</p>' +
              '<button type="button" data-x="pause" class="' + PRIMARY + ' mt-6"><i data-lucide="play" class="h-4 w-4"></i>Resume</button></div></div>' +
          '</div>' +
          '<footer id="ptFoot" class="relative z-[30] grid shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-2 border-t bg-surface px-3 py-2 pb-[calc(8px+env(safe-area-inset-bottom,0px))] md:px-5"></footer>' +
          '<div id="ptLayer"></div>';

        if (window.SPHighlight) {
          try {
            HL = window.SPHighlight.create({
              root: $('ptMain'), mount: $('ptx'), button: $('ptHlBtn'), bottomEl: $('ptFoot'),
              getId: function () { return S.cur ? S.cur.ids[S.qi] : null; }
            });
          } catch (e) { HL = null; console.error('[practice-tests] highlighter', e); }
        }
        paintHead(); paintMain(); paintFoot(); updateBar();
        icons();
      }

      function teardownModule() {
        if (HL) { try { HL.destroy(); } catch (e) {} HL = null; }
        try { if (desG) desG.destroy(); } catch (e) {}
        try { if (desS) desS.destroy(); } catch (e) {}
        desG = desS = null;
        T.mounted = false;
      }

      function paintHead() {
        const pb = $('ptPauseBtn'), hb = $('ptHideBtn');
        if (!pb) return;
        pb.innerHTML = '<i data-lucide="' + (T.paused ? 'play' : 'pause') + '" class="h-4 w-4"></i>';
        pb.setAttribute('aria-label', T.paused ? 'Resume test' : 'Pause test');
        hb.innerHTML = '<i data-lucide="' + (T.hide ? 'eye' : 'eye-off') + '" class="h-4 w-4"></i>';
        hb.setAttribute('aria-label', T.hide ? 'Show timer' : 'Hide timer');
        paintTime();
        const ps = $('ptPause');
        if (ps) { ps.classList.toggle('hidden', !T.paused); ps.classList.toggle('grid', T.paused); }
        const cb = $('ptCalcBtn');
        if (cb) {
          cb.setAttribute('aria-pressed', String(T.calc));
          ['bg-accent', 'text-white'].forEach(function (c) { cb.classList.toggle(c, T.calc); });
        }
        const d = root.querySelector('[data-x="dirs"]');
        if (d) d.setAttribute('aria-expanded', String(T.dirs));
        const mb = $('ptMenuBtn');
        if (mb) mb.setAttribute('aria-expanded', String(T.menu));
        icons();
      }
      function paintTime() {
        const el = $('ptTime');
        if (!el) return;
        el.textContent = T.hide ? '–– : ––' : clock(S.secsLeft);
        el.classList.toggle('text-danger', S.secsLeft <= 60);
      }
      function updateBar() {
        const f = $('ptBarFill');
        if (f && S.cur) f.style.width = (nQ() ? Math.round(answeredCount() / nQ() * 100) : 0) + '%';
      }

      /* ---------- вопрос ---------- */
      const FS_PROMPT = ['text-[15px]', 'text-[16.5px]', 'text-[18.5px]'];
      function choiceHTML(c, idx) {
        const C = S.cur, sel = C.ans[S.qi] === c.key, st = !!(C.struck[S.qi] && C.struck[S.qi][c.key]);
        const cls = sel ? 'border-accent bg-accent/15' : 'bg-surface hover:bg-raised';
        const letter = sel ? 'border-accent bg-accent text-white' : 'text-ink-soft';
        return '<div class="flex items-stretch gap-2">' +
          '<button type="button" data-x="pick" data-k="' + esc(c.key) + '" aria-pressed="' + sel + '" class="flex min-h-[52px] min-w-0 flex-1 items-center gap-3.5 rounded-xl border px-4 py-2.5 text-left transition-colors ' + cls + '">' +
            '<span class="grid h-7 w-7 shrink-0 place-items-center rounded-full border text-[13px] font-semibold ' + letter + '">' + esc(c.key) + '</span>' +
            '<span class="pt-txt min-w-0 flex-1 leading-snug ' + FS_PROMPT[T.size] + (st ? ' struck' : '') + '">' + rich(c.text) + '</span></button>' +
          (T.elim ? '<button type="button" data-x="strike" data-k="' + esc(c.key) + '" aria-pressed="' + st + '" aria-label="' + (st ? 'Restore' : 'Eliminate') + ' choice ' + esc(c.key) + '" class="grid min-h-[44px] w-11 shrink-0 place-items-center rounded-xl border text-[12px] font-semibold ' + (st ? 'bg-raised text-ink' : 'text-ink-soft hover:bg-raised hover:text-ink') + '">' + (st ? '<i data-lucide="undo-2" class="h-4 w-4"></i>' : '<span class="line-through">' + esc(c.key) + '</span>') + '</button>' : '') +
        '</div>';
      }

      function headHTML(q) {
        const flagged = !!S.cur.flag[S.qi];
        const crumb = T.topics && q ? [q.domain, q.skill].filter(Boolean).map(esc).join(' · ') : '';
        return '<div class="mb-5 flex flex-wrap items-center gap-2">' +
          '<span class="num grid h-8 min-w-[32px] place-items-center rounded-md bg-ink px-2 text-[13px] font-semibold text-canvas" aria-label="Question ' + (S.qi + 1) + '">' + (S.qi + 1) + '</span>' +
          '<button type="button" data-x="flag" aria-pressed="' + flagged + '" class="inline-flex h-11 items-center gap-2 rounded-lg px-2.5 text-[13px] font-medium transition-colors md:h-9 ' + (flagged ? 'bg-hl/15 text-hl' : 'text-ink-soft hover:bg-raised hover:text-ink') + '">' +
            '<i data-lucide="flag" class="h-4 w-4' + (flagged ? ' fill-current' : '') + '"></i>Mark for review</button>' +
          (crumb ? '<span class="hidden min-w-0 truncate text-[12px] text-ink-mute lg:inline">' + crumb + '</span>' : '') +
          '<span class="flex-1"></span>' +
          (q && q.type === 'mcq' ? '<button type="button" data-x="elim" aria-pressed="' + T.elim + '" aria-label="Eliminate answer choices" class="inline-flex h-11 items-center gap-2 rounded-lg border px-3 text-[12.5px] font-medium transition-colors md:h-9 ' + (T.elim ? 'border-accent bg-accent/15 text-accent' : 'text-ink-soft hover:bg-raised hover:text-ink') + '"><span class="text-[11px] font-semibold tracking-wide line-through">ABC</span></button>' : '') +
        '</div>';
      }

      function paintMain() {
        const main = $('ptMain');
        if (!main || !S.cur) return;
        const mainTop = main.scrollTop;
        const paneTops = Array.from(main.querySelectorAll('.pt-pane'), function (p) { return p.scrollTop; });
        const C = S.cur, q = qAt(S.qi);
        if (!q) {
          main.className = 'min-w-0 flex-1 overflow-y-auto';
          main.innerHTML = '<div class="mx-auto max-w-[460px] px-6 py-24 text-center"><p class="text-[16px] font-semibold">This question is unavailable</p>' +
            '<p class="mt-2 text-[13.5px] text-ink-soft">It may have been removed from the bank. Use Next to continue.</p></div>';
          return;
        }
        let ans;
        if (q.type === 'mcq') {
          ans = '<div class="mt-6 space-y-2.5" role="group" aria-label="Answer choices">' + q.choices.map(choiceHTML).join('') + '</div>';
        } else {
          const v = C.ans[S.qi] || '';
          ans = '<div class="mt-6 max-w-[380px]"><label for="ptSpr" class="mb-2 block text-[12px] font-semibold uppercase tracking-[0.08em] text-ink-mute">Enter your answer</label>' +
            '<input id="ptSpr" type="text" inputmode="decimal" autocomplete="off" autocapitalize="off" spellcheck="false" maxlength="7" value="' + esc(v) + '" placeholder="Type a number" class="num h-12 w-full rounded-xl border bg-surface px-4 text-[17px] outline-none focus:border-accent"/>' +
            '<div class="mt-3 min-h-[44px] rounded-xl bg-raised px-4 py-2.5"><div class="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-mute">Answer preview</div>' +
            '<div id="ptPrev" class="num mt-0.5 text-[16px]">' + (v ? esc(v) : '<span class="text-ink-mute">—</span>') + '</div></div>' +
            '<p class="mt-2 text-[12px] text-ink-mute">Fractions (3/4), decimals (0.75) and negatives (-2) are accepted.</p></div>';
        }
        const body = headHTML(q) + '<div class="sv-prompt pt-prompt leading-relaxed ' + FS_PROMPT[T.size] + '">' + rich(q.prompt) + '</div>' + ans;
        const hasPassage = q.section === 'rw' && q.passage && String(q.passage).trim();
        if (hasPassage) {
          main.className = 'min-w-0 flex-1 overflow-y-auto md:overflow-hidden';
          main.innerHTML = '<div class="pt-split">' +
            '<div class="sticky top-0 z-10 flex gap-1 border-b bg-canvas p-2 md:hidden" role="tablist">' + [['p', 'Passage'], ['q', 'Question']].map(function (x) {
              const on = T.ptab === x[0];
              return '<button type="button" role="tab" data-x="ptab" data-v="' + x[0] + '" aria-selected="' + on + '" class="h-11 flex-1 rounded-lg text-[13.5px] font-medium ' + (on ? 'bg-raised text-ink' : 'text-ink-soft') + '">' + x[1] + '</button>';
            }).join('') + '</div>' +
            '<section class="pt-pane px-5 py-6 md:border-r md:px-10 md:py-9" data-on="' + (T.ptab === 'p' ? 1 : 0) + '" aria-label="Passage"><div class="sv-prompt pt-prompt mx-auto max-w-[620px] leading-[1.75] ' + FS_PROMPT[T.size] + '">' + rich(q.passage) + '</div></section>' +
            '<section class="pt-pane px-5 py-6 md:px-10 md:py-9" data-on="' + (T.ptab === 'q' ? 1 : 0) + '" aria-label="Question"><div class="mx-auto max-w-[620px]">' + body + '</div></section></div>';
        } else {
          main.className = 'min-w-0 flex-1 overflow-y-auto';
          main.innerHTML = '<div class="mx-auto w-full max-w-[780px] px-4 py-6 md:px-8 md:py-9"><div class="card p-5 md:p-8">' + body + '</div></div>';
        }
        renderMath(main);
        icons();
        main.scrollTop = mainTop;
        main.querySelectorAll('.pt-pane').forEach(function (p, i) { p.scrollTop = paneTops[i] || 0; });
        if (HL) { try { HL.refresh(); } catch (e) {} }
      }

      function paintFoot() {
        const f = $('ptFoot');
        if (!f || !S.cur) return;
        const n = nQ(), last = S.qi === n - 1;
        f.innerHTML =
          '<div class="min-w-0 truncate text-[12.5px] font-medium text-ink-soft"><span class="hidden sm:inline">' + esc(userLabel()) + '</span></div>' +
          '<button type="button" data-x="grid" aria-expanded="' + T.grid + '" aria-haspopup="dialog" aria-label="Open question navigator" class="inline-flex h-11 items-center gap-2 rounded-lg bg-ink px-4 text-[13.5px] font-semibold text-canvas transition-opacity hover:opacity-90"><span class="num">' + (S.qi + 1) + ' of ' + n + '</span><i data-lucide="chevron-up" class="h-4 w-4"></i></button>' +
          '<div class="flex items-center justify-end gap-2">' +
            '<button type="button" data-x="back" class="inline-flex h-11 items-center gap-1.5 rounded-full border px-4 text-[13.5px] font-semibold transition-colors hover:bg-raised ' + (S.qi === 0 ? 'invisible' : '') + '"><i data-lucide="chevron-left" class="h-4 w-4"></i>Back</button>' +
            '<button type="button" data-x="next" class="inline-flex h-11 items-center gap-1.5 rounded-full bg-accent px-5 text-[13.5px] font-semibold text-white transition-colors hover:bg-accent-hover">' + (last ? 'Review' : 'Next') + '<i data-lucide="chevron-right" class="h-4 w-4"></i></button></div>';
        icons();
      }

      /* ---------- действия ---------- */
      function goTo(i) {
        if (!S.cur) return;
        i = Math.max(0, Math.min(nQ() - 1, i));
        S.qi = i; T.ptab = 'p'; T.grid = false;
        paintMain(); paintFoot(); paintLayer(); updateBar();
        const m = $('ptMain');
        if (m) { m.scrollTop = 0; m.querySelectorAll('.pt-pane').forEach(function (p) { p.scrollTop = 0; }); }
        persistSoon();
      }
      function next() { if (S.qi < nQ() - 1) goTo(S.qi + 1); else openReview(); }
      function back() { if (S.qi > 0) goTo(S.qi - 1); }

      function setAns(v) {
        const C = S.cur;
        if (v === '' || v == null) delete C.ans[S.qi]; else C.ans[S.qi] = v;
        updateBar(); persistSoon();
      }
      function pick(key) {
        const C = S.cur, q = qAt(S.qi);
        if (!q || q.type !== 'mcq') return;
        if (T.elim) { toggleStrike(key); return; }
        if (C.struck[S.qi]) delete C.struck[S.qi][key];
        setAns(C.ans[S.qi] === key ? '' : key);
        paintMain();
      }
      function toggleStrike(key) {
        const C = S.cur, o = C.struck[S.qi] || (C.struck[S.qi] = {});
        if (o[key]) delete o[key]; else { o[key] = 1; if (C.ans[S.qi] === key) setAns(''); }
        paintMain(); persistSoon();
      }
      function toggleFlag() {
        const C = S.cur;
        if (C.flag[S.qi]) delete C.flag[S.qi]; else C.flag[S.qi] = 1;
        paintMain(); persistSoon();
      }

      function setPaused(v) {
        T.paused = !!v;
        if (T.paused) { T.grid = false; T.menu = false; T.dirs = false; T.review = false; if (HL) { try { HL.setOn(false); } catch (e) {} } }
        paintHead(); paintLayer();
        if (!T.paused) T.last = Date.now();
      }

      function openReview() {
        T.review = true; T.grid = false; T.menu = false; T.dirs = false;
        if (HL) { try { HL.setOn(false); } catch (e) {} }
        paintLayer();
      }

      /* ---------- Desmos ---------- */
      function applyCalc() {
        const el = $('ptCalc');
        if (!el) return;
        el.hidden = !T.calc;
        el.setAttribute('data-wide', T.wide ? '1' : '0');
        el.querySelectorAll('[data-v]').forEach(function (b) {
          const on = b.getAttribute('data-v') === T.ctab;
          b.setAttribute('aria-selected', String(on));
          b.className = 'h-8 rounded-md px-3 text-[12.5px] font-medium ' + (on ? 'bg-surface text-ink shadow-sm' : 'text-ink-soft hover:text-ink');
        });
        paintHead();
        if (T.calc) mountCalc();
        resizeCalc();
      }
      function mountCalc() {
        const msg = $('ptDesMsg');
        if (!msg) return;
        if (!window.Desmos) {
          msg.hidden = false; msg.textContent = 'Loading calculator…';
          loadDesmos().then(function () { if (alive && T.calc) { msg.hidden = true; buildCalc(); } }, function () {
            if (!alive) return;
            msg.hidden = false;
            msg.innerHTML = '<div><p class="font-medium text-ink">Calculator could not be loaded.</p><p class="mt-1">Check your connection and try again.</p>' +
              '<button type="button" data-x="calcRetry" class="mt-4 inline-flex h-10 items-center rounded-lg bg-accent px-4 text-[13px] font-semibold text-white hover:bg-accent-hover">Retry</button></div>';
          });
          return;
        }
        msg.hidden = true;
        buildCalc();
      }
      function buildCalc() {
        const g = $('ptDesG'), s = $('ptDesS');
        if (!g || !s) return;
        if (T.ctab === 'graphing') {
          if (!desG) { try { desG = window.Desmos.GraphingCalculator(g, { keypad: true, expressions: true, settingsMenu: true, zoomButtons: true, border: false, invertedColors: isDark() }); } catch (e) { console.error(e); } }
          else { try { desG.updateSettings({ invertedColors: isDark() }); } catch (e) {} }
        } else if (!desS) { try { desS = window.Desmos.ScientificCalculator(s, {}); } catch (e) { console.error(e); } }
        g.hidden = T.ctab !== 'graphing'; s.hidden = T.ctab !== 'scientific';
        resizeCalc();
      }
      function resizeCalc() {
        requestAnimationFrame(function () {
          try { if (desG) desG.resize(); } catch (e) {}
          try { if (desS) desS.resize(); } catch (e) {}
        });
      }

      /* =================================================================
         СЛОЙ: поповеры, ревью, модалки
         ================================================================= */
      function dirsHTML() {
        const math = curM().sec === 'math';
        const items = math ? [
          'Solve each problem, choose the best answer from the choices provided, or type your own answer where asked.',
          'Grid-in answers can be a whole number, a decimal or a fraction such as 3/4. Negative numbers are allowed.',
          'The calculator and the reference sheet are always available from the toolbar.',
          'Unless a note says otherwise, figures are drawn to scale, all variables and constants are real numbers, and a function has the largest domain on which it is defined.'
        ] : [
          'Each question refers to a short text, sometimes with a table or graph. Read the text and the question carefully.',
          'Choose the answer that best fits the text. Every question has exactly one best answer out of four.',
          'Use the question grid at the bottom to jump between questions in this module.'
        ];
        return '<div role="dialog" aria-label="Directions" class="pt-fade fixed left-3 top-[60px] z-[55] w-[min(440px,calc(100vw-24px))] rounded-2xl border bg-raised p-5 shadow-2xl">' +
          '<div class="flex items-center justify-between"><h2 class="text-[15px] font-semibold">Directions</h2><button type="button" data-x="closeLayer" class="grid h-9 w-9 place-items-center rounded-lg text-ink-soft hover:bg-surface hover:text-ink" aria-label="Close"><i data-lucide="x" class="h-4 w-4"></i></button></div>' +
          '<ul class="mt-3 space-y-2.5 text-[13.5px] leading-snug text-ink-soft">' + items.map(function (x) { return '<li class="flex gap-2.5"><i data-lucide="dot" class="mt-0.5 h-4 w-4 shrink-0 text-accent"></i><span>' + x + '</span></li>'; }).join('') + '</ul></div>';
      }

      function menuHTML() {
        const item = function (act, icon, text, extra) {
          return '<button type="button" role="menuitem" data-x="' + act + '" class="flex h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-[13.5px] hover:bg-surface"><i data-lucide="' + icon + '" class="h-4 w-4 text-ink-soft"></i><span class="flex-1">' + text + '</span>' + (extra || '') + '</button>';
        };
        const sizes = ['S', 'M', 'L'].map(function (l, i) {
          return '<button type="button" data-x="size" data-v="' + i + '" aria-pressed="' + (T.size === i) + '" aria-label="Text size ' + l + '" class="h-8 w-9 rounded-md text-[12.5px] font-semibold ' + (T.size === i ? 'bg-surface text-ink shadow-sm' : 'text-ink-soft hover:text-ink') + '">' + l + '</button>';
        }).join('');
        const sw = function (on) { return '<span class="relative h-5 w-9 rounded-full ' + (on ? 'bg-accent' : 'border bg-surface') + '"><span class="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow ' + (on ? 'left-[18px]' : 'left-0.5') + '"></span></span>'; };
        return '<div role="menu" class="pt-fade fixed right-3 top-[60px] z-[55] w-[min(300px,calc(100vw-24px))] rounded-2xl border bg-raised p-1.5 shadow-2xl">' +
          (fsSupported() ? item('fs', inFs() ? 'minimize' : 'maximize', inFs() ? 'Exit full screen' : 'Enter full screen') : '') +
          '<div class="flex h-11 items-center gap-3 px-3 text-[13.5px]"><i data-lucide="a-large-small" class="h-4 w-4 text-ink-soft"></i><span class="flex-1">Text size</span><span class="flex rounded-lg bg-raised p-0.5" style="background:rgb(var(--c-surface))">' + sizes + '</span></div>' +
          item('topics', 'tag', 'Skill labels', sw(T.topics)) +
          item('keys', 'keyboard', 'Keyboard shortcuts') +
          item('theme', isDark() ? 'sun' : 'moon', isDark() ? 'Switch to light mode' : 'Switch to dark mode') +
          '<div class="my-1 h-px bg-white/10" style="background:var(--c-hairline)"></div>' +
          item('saveExit', 'log-out', 'Save &amp; exit') + '</div>';
      }

      function gridHTML() {
        const C = S.cur, n = nQ();
        let tiles = '';
        for (let i = 0; i < n; i++) {
          const an = C.ans[i] != null && C.ans[i] !== '';
          tiles += '<button type="button" data-x="goto" data-i="' + i + '" class="pt-tile" data-s="' + (an ? 'an' : 'un') + '"' + (i === S.qi ? ' data-cur="1" aria-current="true"' : '') +
            ' aria-label="Question ' + (i + 1) + ', ' + (an ? 'answered' : 'unanswered') + (C.flag[i] ? ', marked for review' : '') + '"><span class="num">' + (i + 1) + '</span>' +
            (C.flag[i] ? '<i data-lucide="flag" class="pt-flag h-3.5 w-3.5 fill-current"></i>' : '') + '</button>';
        }
        const foot = $('ptFoot');
        const bottom = (foot ? foot.offsetHeight : 64) + 10;
        return '<div role="dialog" aria-label="Question navigator" class="pt-pop rounded-2xl border bg-raised shadow-2xl" style="bottom:' + bottom + 'px">' +
          '<div class="flex shrink-0 items-start justify-between gap-2 px-4 pb-2 pt-3.5"><div class="min-w-0"><div class="truncate text-[13.5px] font-semibold">' + esc(modLabel(C.key)) + '</div>' +
            '<div class="mt-0.5 text-[11.5px] text-ink-soft"><span class="num">' + answeredCount() + '</span> of <span class="num">' + n + '</span> answered</div></div>' +
          '<button type="button" data-x="closeLayer" class="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-ink-soft hover:bg-surface hover:text-ink" aria-label="Close navigator"><i data-lucide="x" class="h-4 w-4"></i></button></div>' +
          '<div class="flex shrink-0 flex-wrap gap-x-4 gap-y-1.5 border-b px-4 pb-3 text-[11.5px] text-ink-soft">' +
            '<span class="inline-flex items-center gap-1.5"><span class="h-3 w-3 rounded border-2 border-accent"></span>Current</span>' +
            '<span class="inline-flex items-center gap-1.5"><span class="h-3 w-3 rounded border border-dashed"></span>Unanswered</span>' +
            '<span class="inline-flex items-center gap-1.5"><i data-lucide="flag" class="h-3 w-3 fill-current text-hl"></i>For review</span></div>' +
          '<div class="overflow-y-auto p-4"><div class="grid grid-cols-6 gap-2.5 sm:grid-cols-9">' + tiles + '</div></div>' +
          '<div class="shrink-0 border-t p-3"><button type="button" data-x="review" class="h-11 w-full rounded-full border text-[13.5px] font-semibold transition-colors hover:bg-surface">Go to review page</button></div></div>';
      }

      function reviewHTML() {
        const C = S.cur, n = nQ(), an = answeredCount(), un = n - an, fl = flaggedCount();
        let tiles = '';
        for (let i = 0; i < n; i++) {
          const a = C.ans[i] != null && C.ans[i] !== '';
          tiles += '<button type="button" data-x="goto" data-i="' + i + '" class="pt-tile" data-s="' + (a ? 'an' : 'un') + '" aria-label="Question ' + (i + 1) + ', ' + (a ? 'answered' : 'unanswered') + (C.flag[i] ? ', marked' : '') + '"><span class="num">' + (i + 1) + '</span>' +
            (C.flag[i] ? '<i data-lucide="flag" class="pt-flag h-3.5 w-3.5 fill-current"></i>' : '') + '</button>';
        }
        const stat = function (v, l, cls) { return '<div class="rounded-xl bg-raised p-3 text-center"><div class="num text-[22px] font-semibold ' + (cls || '') + '">' + v + '</div><div class="mt-0.5 text-[11.5px] text-ink-soft">' + l + '</div></div>'; };
        return '<div role="dialog" aria-label="Check your work" class="pt-fade fixed inset-x-0 bottom-0 top-[57px] z-[42] overflow-y-auto bg-canvas">' +
          '<div class="mx-auto w-full max-w-[640px] px-4 py-8 md:py-12"><h2 class="text-[26px] font-semibold tracking-tight">Check your work</h2>' +
          '<p class="mt-2 text-[14px] text-ink-soft">' + esc(modLabel(C.key)) + '. Once you submit, you cannot return to this module. If time runs out, it is submitted for you.</p>' +
          '<div class="mt-6 grid grid-cols-3 gap-3">' + stat(an, 'Answered') + stat(un, 'Unanswered', un ? 'text-hl' : '') + stat(fl, 'Marked') + '</div>' +
          (un ? '<div class="mt-5 flex gap-3 rounded-xl border border-hl/40 bg-hl/10 px-4 py-3 text-[13px] text-ink-soft"><i data-lucide="alert-triangle" class="mt-0.5 h-4 w-4 shrink-0 text-hl"></i><span>You left <b class="text-ink">' + un + '</b> question' + (un > 1 ? 's' : '') + ' unanswered. A blank answer counts as incorrect.</span></div>' : '') +
          '<div class="mt-6 grid grid-cols-6 gap-2.5 sm:grid-cols-9">' + tiles + '</div>' +
          '<div class="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between"><button type="button" data-x="closeReview" class="' + GHOST + '"><i data-lucide="arrow-left" class="h-4 w-4"></i>Back to questions</button>' +
            '<button type="button" data-x="submit" class="' + PRIMARY + '">' + (un ? 'Submit anyway' : 'Submit module') + '</button></div></div></div>';
      }

      function refHTML() {
        return '<div class="pt-fade fixed inset-0 z-[80] grid place-items-center bg-black/60 p-0 md:p-6" data-x="refBg"><div class="flex h-full w-full max-w-[900px] flex-col rounded-none border bg-surface shadow-2xl md:h-auto md:max-h-[90vh] md:rounded-2xl" role="dialog" aria-modal="true" aria-label="Reference sheet">' +
          '<div class="flex h-14 shrink-0 items-center justify-between border-b px-5"><h2 class="text-[15px] font-semibold">Reference Sheet</h2>' +
          '<button type="button" data-x="refClose" class="grid h-11 w-11 place-items-center rounded-lg text-ink-soft hover:bg-raised hover:text-ink md:h-9 md:w-9" aria-label="Close reference sheet"><i data-lucide="x" class="h-[18px] w-[18px]"></i></button></div>' +
          '<div class="flex-1 overflow-y-auto p-5">' + referenceHTML() + '</div></div></div>';
      }

      function keysHTML() {
        const rows = [['← / →', 'Previous / next question'], ['Enter', 'Next question'], ['1–4 or A–D', 'Pick an answer'], ['F', 'Mark for review'], ['E', 'Eliminate mode'], ['G', 'Question grid'],
          ['C', 'Calculator (Math)'], ['?', 'This list'], ['Esc', 'Close the open panel']];
        return '<div class="pt-fade fixed inset-0 z-[80] grid place-items-center bg-black/60 p-4" data-x="keysBg"><div class="w-full max-w-[420px] rounded-2xl border bg-surface p-6 shadow-2xl" role="dialog" aria-modal="true" aria-label="Keyboard shortcuts">' +
          '<div class="flex items-center justify-between"><h2 class="text-[17px] font-semibold">Keyboard shortcuts</h2><button type="button" data-x="keysClose" class="grid h-11 w-11 place-items-center rounded-lg text-ink-soft hover:bg-raised hover:text-ink" aria-label="Close"><i data-lucide="x" class="h-[18px] w-[18px]"></i></button></div>' +
          '<dl class="mt-3 divide-y divide-transparent">' + rows.map(function (r) {
            return '<div class="flex items-center justify-between gap-4 py-2.5 text-[13.5px]"><dt class="text-ink-soft">' + r[1] + '</dt><dd><kbd class="num rounded-md border bg-raised px-2 py-1 text-[12px]">' + r[0] + '</kbd></dd></div>';
          }).join('') + '</dl></div></div>';
      }

      function fsLostHTML() {
        return '<div class="pt-fade fixed inset-0 z-[90] grid place-items-center bg-canvas p-6" role="alertdialog" aria-modal="true" aria-label="Full screen exited"><div class="max-w-[440px] text-center">' +
          '<div class="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-hl/15 text-hl"><i data-lucide="maximize" class="h-6 w-6"></i></div>' +
          '<h2 class="mt-5 text-[22px] font-semibold tracking-tight">You left full screen</h2>' +
          '<p class="mt-2 text-[14px] text-ink-soft">The clock is paused. Return to full screen to keep going, as you would on test day.</p>' +
          '<div class="mt-7 flex flex-col gap-3"><button type="button" data-x="fsBack" class="' + PRIMARY + '">Return to full screen</button>' +
          '<button type="button" data-x="fsSkip" class="' + GHOST + '">Continue without full screen</button></div></div></div>';
      }

      function paintLayer() {
        const L = $('ptLayer');
        if (!L) return;
        if (S.phase !== 'module') { L.innerHTML = T.fsLost ? fsLostHTML() : ''; icons(); return; }
        let h = '';
        if (T.dirs || T.menu || T.grid) h += '<div data-x="closeLayer" class="fixed inset-0 z-[54]"></div>';
        if (T.dirs) h += dirsHTML();
        if (T.menu) h += menuHTML();
        if (T.grid) h += gridHTML();
        if (T.review) h += reviewHTML();
        if (T.ref) h += refHTML();
        if (T.keys) h += keysHTML();
                if (T.fsLost) h += fsLostHTML();
        // Если набор открытых панелей не изменился, не проигрываем анимацию заново
        const open = [T.dirs, T.menu, T.grid, T.review, T.ref, T.keys, T.fsLost].map(Number).join('');
        L.classList.toggle('sp-still', L.dataset.open === open);
        L.dataset.open = open;
        L.innerHTML = h;
        icons();
        const mb = $('ptMenuBtn'); if (mb) mb.setAttribute('aria-expanded', String(T.menu));
        const gb = root.querySelector('[data-x="grid"]'); if (gb) gb.setAttribute('aria-expanded', String(T.grid));
        const db = root.querySelector('[data-x="dirs"]'); if (db) db.setAttribute('aria-expanded', String(T.dirs));
      }

      function closePopovers() { T.dirs = false; T.menu = false; T.grid = false; }

      /* ---------- выход ---------- */
      function saveExit() {
        persist();
        exitFs();
        ctx.navigate('practice-tests');
      }
      function askExit() {
        confirmDialog($('ptx'), {
          title: 'Save and exit?',
          text: S.phase === 'module'
            ? 'Your answers and the remaining time are saved. You can pick up exactly where you stopped.'
            : 'Your progress is saved. You can continue from the same place later.',
          ok: 'Save & exit', cancel: 'Keep testing', alt: 'Discard test',
          onOk: saveExit,
          onAlt: function () {
            S.phase = 'done';
            Store.setSess(t, null);
            exitFs();
            ctx.navigate('practice-tests');
          }
        });
      }

      function toggleFs() {
        if (inFs()) { T.fsOff = true; exitFs(); }
        else { T.fsOff = false; S.fs = true; reqFs(); }
      }
      function toggleTheme() {
        const dark = isDark();
        if (Shell.theme && typeof Shell.theme.set === 'function') Shell.theme.set(dark ? 'light' : 'dark');
        else document.documentElement.classList.toggle('dark');
        setTimeout(function () { if (T.calc && desG) { try { desG.updateSettings({ invertedColors: isDark() }); } catch (e) {} } paintLayer(); }, 50);
      }

      /* =================================================================
         СОБЫТИЯ
         ================================================================= */
      function onClick(e) {
        const b = e.target.closest('[data-x]');
        if (!b || b.disabled) return;
        const a = b.getAttribute('data-x');
        if ((a === 'refBg' || a === 'keysBg') && e.target !== b) return;
        switch (a) {
          case 'gateFs': S.fs = !S.fs; Store.setPrefs({ fs: S.fs }); $('ptScreen').classList.add('sp-no-anim'); paintGate(); icons(); break;
          case 'exit': ctx.navigate('practice-tests'); break;
          case 'begin': {
            const p = (wantFs() && !inFs()) ? reqFs() : Promise.resolve(true);
            b.disabled = true;
            p.then(function () { if (alive) countdown(); });
            break;
          }
          case 'goNext': { if (wantFs() && !inFs()) reqFs(); startModule(); break; }
          case 'resume': endBreak(false); break;
          case 'saveExit': askExit(); break;
          case 'pause': setPaused(!T.paused); break;
          case 'hide': T.hide = !T.hide; paintHead(); break;
          case 'hl': if (!HL) toast('Highlights are not available on this page.'); break;
          case 'dirs': { const v = !T.dirs; closePopovers(); T.dirs = v; paintLayer(); break; }
          case 'menu': { const v = !T.menu; closePopovers(); T.menu = v; paintLayer(); break; }
          case 'grid': { const v = !T.grid; closePopovers(); T.grid = v; paintLayer(); break; }
          case 'closeLayer': closePopovers(); paintLayer(); break;
          case 'goto': T.review = false; goTo(+b.getAttribute('data-i')); break;
          case 'review': openReview(); break;
          case 'closeReview': T.review = false; paintLayer(); break;
          case 'submit': finishModule(false); break;
          case 'next': next(); break;
          case 'back': back(); break;
          case 'pick': pick(b.getAttribute('data-k')); break;
          case 'strike': toggleStrike(b.getAttribute('data-k')); break;
          case 'elim': T.elim = !T.elim; paintMain(); break;
          case 'flag': toggleFlag(); break;
          case 'ptab': T.ptab = b.getAttribute('data-v'); paintMain(); break;
          case 'calc': T.calc = !T.calc; applyCalc(); break;
          case 'calcClose': T.calc = false; applyCalc(); break;
          case 'calcWide': T.wide = !T.wide; applyCalc(); break;
          case 'calcRetry': mountCalc(); break;
          case 'ctab': T.ctab = b.getAttribute('data-v'); applyCalc(); break;
          case 'ref': closePopovers(); T.ref = true; paintLayer(); break;
          case 'refClose': case 'refBg': T.ref = false; paintLayer(); break;
          case 'keys': closePopovers(); T.keys = true; paintLayer(); break;
          case 'keysClose': case 'keysBg': T.keys = false; paintLayer(); break;
          case 'fs': closePopovers(); toggleFs(); paintLayer(); break;
          case 'size': T.size = +b.getAttribute('data-v'); Store.setPrefs({ size: T.size }); paintMain(); paintLayer(); break;
          case 'topics': T.topics = !T.topics; Store.setPrefs({ topics: T.topics }); paintMain(); paintLayer(); break;
          case 'theme': toggleTheme(); break;
          case 'fsBack': reqFs().then(function (ok) { if (!alive) return; T.fsLost = false; if (!ok) T.fsOff = true; T.last = Date.now(); paintLayer(); }); break;
          case 'fsSkip': T.fsOff = true; T.fsLost = false; T.last = Date.now(); paintLayer(); break;
        }
      }
      root.addEventListener('click', onClick);
      cleanups.push(function () { root.removeEventListener('click', onClick); });

      function onInput(e) {
        const el = e.target;
        if (!el || el.id !== 'ptSpr' || !S.cur) return;
        const v = el.value.replace(/[^0-9./-]/g, '');
        if (v !== el.value) el.value = v;
        setAns(v.trim());
        const pv = $('ptPrev');
        if (pv) pv.innerHTML = v ? esc(v) : '<span class="text-ink-mute">—</span>';
      }
      root.addEventListener('input', onInput);
      cleanups.push(function () { root.removeEventListener('input', onInput); });

      function onKey(e) {
        if (!alive) return;
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        if (S.phase !== 'module' || !S.cur) return;
        const tgt = e.target;
        if (e.key === 'Escape') {
          if (document.querySelector('[role="alertdialog"]')) return;
          if (T.keys) T.keys = false;
          else if (T.ref) T.ref = false;
          else if (T.dirs || T.menu || T.grid) closePopovers();
          else if (T.review) T.review = false;
          else return;
          paintLayer();
          return;
        }
        if (tgt && tgt.closest && (tgt.closest('#ptCalc') || tgt.closest('[role="dialog"] textarea'))) return;
        if (T.paused || T.fsLost || T.ref || T.keys || document.querySelector('[role="alertdialog"]')) return;
        const typing = tgt && (tgt.tagName === 'INPUT' || tgt.tagName === 'TEXTAREA' || tgt.isContentEditable);
        if (typing) { if (e.key === 'Enter' && tgt.id === 'ptSpr') { e.preventDefault(); next(); } return; }
        if (T.review) return;
        const k = e.key;
        if (k === 'ArrowRight') { e.preventDefault(); next(); }
        else if (k === 'ArrowLeft') { e.preventDefault(); back(); }
        else if (k === 'Enter') { if (tgt && tgt.closest && tgt.closest('button, a')) return; e.preventDefault(); next(); }
        else if (k === 'f' || k === 'F') { e.preventDefault(); toggleFlag(); }
        else if (k === 'e' || k === 'E') { const q = qAt(S.qi); if (q && q.type === 'mcq') { e.preventDefault(); T.elim = !T.elim; paintMain(); } }
        else if (k === 'g' || k === 'G') { e.preventDefault(); const v = !T.grid; closePopovers(); T.grid = v; paintLayer(); }
        else if ((k === 'c' || k === 'C') && curM().sec === 'math') { e.preventDefault(); T.calc = !T.calc; applyCalc(); }
        else if (k === '?') { e.preventDefault(); T.keys = true; paintLayer(); }
        else {
          const q = qAt(S.qi);
          if (!q || q.type !== 'mcq') return;
          let idx = -1;
          if (/^[1-4]$/.test(k)) idx = +k - 1;
          else if (/^[a-dA-D]$/.test(k)) idx = k.toUpperCase().charCodeAt(0) - 65;
          if (idx >= 0 && q.choices[idx]) { e.preventDefault(); pick(q.choices[idx].key); }
        }
      }
      document.addEventListener('keydown', onKey);
      cleanups.push(function () { document.removeEventListener('keydown', onKey); });

      function onFsChange() {
        if (!alive) return;
        if (!inFs()) {
          if (S.phase === 'module' && wantFs()) { T.fsLost = true; paintLayer(); }
        } else if (T.fsLost) { T.fsLost = false; T.last = Date.now(); paintLayer(); }
      }
      document.addEventListener('fullscreenchange', onFsChange);
      document.addEventListener('webkitfullscreenchange', onFsChange);
      cleanups.push(function () {
        document.removeEventListener('fullscreenchange', onFsChange);
        document.removeEventListener('webkitfullscreenchange', onFsChange);
      });

      function onResize() { if (T.calc) resizeCalc(); if (T.grid) paintLayer(); }
      window.addEventListener('resize', onResize);
      cleanups.push(function () { window.removeEventListener('resize', onResize); });

      function onUnload(e) {
        if (S.phase === 'module') { persist(); e.preventDefault(); e.returnValue = ''; }
      }
      window.addEventListener('beforeunload', onUnload);
      cleanups.push(function () { window.removeEventListener('beforeunload', onUnload); });

      /* ---------- часы: реальное прошедшее время, а не число тиков ---------- */
      function tick() {
        if (!alive) return;
        const now = Date.now();
        const dt = Math.max(0, Math.min(5, (now - T.last) / 1000));
        T.last = now;
        if (S.phase === 'module' && S.cur) {
          if (T.paused || T.fsLost) return;
          S.secsLeft -= dt;
          S.cur.times[S.qi] = (S.cur.times[S.qi] || 0) + dt;
          if (S.secsLeft <= 300 && T.hide) { T.hide = false; paintHead(); }
          paintTime();
          if (!T.fired5 && S.secsLeft <= 300) { T.fired5 = true; toast('5 minutes remaining'); }
          if (!T.fired1 && S.secsLeft <= 60) { T.fired1 = true; toast('1 minute remaining'); }
          if (S.secsLeft <= 0) { S.secsLeft = 0; finishModule(true); return; }
        } else if (S.phase === 'break') {
          if (T.fsLost) return;
          S.brkLeft -= dt;
          const el = $('ptBrk'), ring = $('ptRing');
          if (el) el.textContent = clock(S.brkLeft);
          if (ring) ring.setAttribute('stroke-dashoffset', (RING_C * (1 - Math.max(0, S.brkLeft) / (S.brkLen || 1))).toFixed(1));
          if (S.brkLeft <= 0) { S.brkLeft = 0; endBreak(true); return; }
        } else return;
        if (now - T.lastSave > 5000) persist();
      }
      const timer = setInterval(tick, 500);
      cleanups.push(function () { clearInterval(timer); });

      /* ---------- старт ---------- */
      const startUp = function () {
        if (!alive) return;
        if (!(Data.size() >= 30)) {
          $('ptScreen').innerHTML = '<div class="mx-auto max-w-[460px] px-6 py-28 text-center"><h1 class="text-[22px] font-semibold tracking-tight">Questions are not loaded</h1>' +
            '<p class="mt-2 text-[14px] text-ink-soft">The question bank is empty, so the test cannot start. Check that your data files are connected.</p>' +
            '<a href="#/practice-tests" class="btn-pill mt-7 inline-flex">Back to Practice Tests</a></div>';
          return;
        }
        show();
      };
      $('ptScreen').innerHTML = '<div class="grid flex-1 place-items-center text-[13px] text-ink-soft">Preparing your test…</div>';
      Promise.resolve(Data.load()).then(startUp, startUp);

      return function () {
        persist();
        alive = false;
        timeouts.forEach(function (id) { clearTimeout(id); });
        teardownModule();
        cleanups.forEach(function (fn) { try { fn(); } catch (e) {} });
        exitFs();
      };
    }
  });

  /* Для отладки и тестов в консоли */
  window.SPPracticeTests = {
    buildModule: buildModule, moduleIds: moduleIds, scaled: scaled, scoresOf: scoresOf, doneMods: doneMods,
    nextLevel: nextLevel, mixCounts: mixCounts, Store: Store
  };
})();
