/* =====================================================================
   SATPath — Learning Path (islands.js)
   ---------------------------------------------------------------------
   Перенос режима «Островки» из старого сайта (Math Path / R&W Path) — только практика.

     Остров   = тема из TOPS (Math) / RTOPS (R&W)
     Узлы     = Easy (8) → Medium (10) → Hard (12) → Boss Checkpoint (12)
     Открытие = строго по порядку; следующий остров открывает только победа над боссом

   Подключать ПОСЛЕ shell.js и dataAdapter.js. Маршрут: #/islands  (#/islands?track=rw)

   Ключи:
     satpath_islands_v1  { v:1, nodes:{ 'math:<ti>:<ni>': { done, stars, best, tries } } }
                         все поля только растут, поэтому firebaseAdapter.js
                         синхронизирует и объединяет их без изменений
     satpath_done, satpath_done_rw — прогресс старого сайта (только чтение)
   XP и стрик: SPData.progress.record() + SPData.stats.addPoints()
   Событие:    window 'sp:islands' { key, passed, stars, pct, firstClear }
   ===================================================================== */
(function () {
  'use strict';

  const Shell = window.SPShell;
  const Data = window.SPData;
  if (!Shell || !Data) {
    console.error('[islands] Подключите shell.js и dataAdapter.js ДО этого файла.');
    return;
  }

  const DEMO = /[?&]demo=1(&|$)/.test(location.search);
  const KEY = 'satpath_islands_v1';
  const LEGACY = { math: 'satpath_done', rw: 'satpath_done_rw' };
  const TELE_KEY = 'satpath_telemetry_v1';
  const TRACK_KEY = 'sp_islands_track';

  const TRACKS = {
    math: { label: 'Math', pass: 80, two: 90, three: 100, bossSec: 75 },
    rw: { label: 'Reading & Writing', pass: 65, two: 80, three: 95, bossSec: 60 }
  };
  // ni совпадает с номером узла старого сайта (ni = 0 была теория — она не переносится)
  const NODES = [
    { ni: 1, id: 'easy', label: 'Easy', count: 8, bonus: 50 },
    { ni: 2, id: 'medium', label: 'Medium', count: 10, bonus: 50 },
    { ni: 3, id: 'hard', label: 'Hard', count: 12, bonus: 50 },
    { ni: 4, id: 'boss', label: 'Boss', count: 12, bonus: 120 }
  ];
  const BOSS_LIVES = 3;          // третья ошибка завершает попытку
  const FLAWLESS_BONUS = 25;     // один раз за узел: впервые получены 3 звезды

  /* -------------------------------------------------------------------
     ИКОНКИ (inline SVG)
     ------------------------------------------------------------------- */
  const PATHS = {
    play: '<path d="M7 4.5v15l12-7.5z" fill="currentColor"/>',
    lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    crown: '<path d="m3 7 4.5 4L12 4l4.5 7L21 7l-2 11H5z"/>',
    star: '<path d="m12 3 2.7 5.6 6.1.8-4.5 4.2 1.2 6.1-5.5-3-5.5 3 1.2-6.1L3.2 9.4l6.1-.8z"/>',
    shield: '<path d="M12 3 5 6v5c0 4.6 2.9 8.2 7 10 4.1-1.8 7-5.400 7-10V6z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    flame: '<path d="M12 3c1 4 6 5.5 6 11a6 6 0 0 1-12 0c0-2.500 1.200-4.200 2.500-5.500.2 1.700 1 2.700 2 3.200C10 8.500 10.500 5.500 12 3z"/>',
    bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    flag: '<path d="M5 21V4m0 1h12l-2.500 4L17 13H5"/>',
    chevron: '<path d="m6 9 6 6 6-6"/>',
    arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/>',
    calc: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01"/>'
  };
  function icon(name, cls) {
    return '<svg class="' + (cls || 'h-4 w-4') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (PATHS[name] || '') + '</svg>';
  }
  function starRow(n, size) {
    let h = '<span class="inline-flex items-center gap-0.5" aria-label="' + n + ' of 3 stars">';
    for (let i = 1; i <= 3; i++) {
      h += '<span class="' + (i <= n ? 'il-star-on' : 'text-ink-mute') + '">' + icon('star', size || 'h-3 w-3') + '</span>';
    }
    return h + '</span>';
  }

  /* -------------------------------------------------------------------
     СТИЛИ
     ------------------------------------------------------------------- */
  function injectStyle() {
    if (document.getElementById('il-style')) return;
    const s = document.createElement('style');
    s.id = 'il-style';
    s.textContent = [
      '.il-star-on{color:#F59E0B}.il-star-on svg{fill:#F59E0B}',
      '.il-path{position:relative;height:150px}',
      '.il-path>svg{position:absolute;inset:0;width:100%;height:150px;overflow:visible}',
      '.il-seg{fill:none;stroke:var(--c-hairline);stroke-width:2;stroke-dasharray:4 6;stroke-linecap:round;vector-effect:non-scaling-stroke}',
      '.il-seg.on{stroke:rgb(var(--c-accent));stroke-dasharray:none}',
      '.il-seg.draw{animation:ilDraw .9s ease .15s both}',
      '@keyframes ilDraw{from{clip-path:inset(-20px 100% -20px -4px)}to{clip-path:inset(-20px -4px -20px -4px)}}',
      '.il-slot{position:absolute;width:72px;margin-left:-36px;display:flex;flex-direction:column;align-items:center;gap:5px}',
      '.il-node{position:relative;width:52px;height:52px;border-radius:999px;display:grid;place-items:center;border-width:1px;transition:transform .18s ease,border-color .18s ease}',
      '.il-node:hover{transform:translateY(-2px)}.il-node:active{transform:scale(.96)}',
      '.il-node.boss{border-radius:16px}',
      '.il-node.cur::before{content:"";position:absolute;inset:-6px;border-radius:inherit;border:1.5px solid rgb(var(--c-accent));animation:ilPulse 2s ease-out infinite}',
      '@keyframes ilPulse{0%{transform:scale(.92);opacity:.9}70%,100%{transform:scale(1.2);opacity:0}}',
      '.il-node.pop{animation:ilPop .6s cubic-bezier(.2,1.5,.4,1) .85s both}',
      '@keyframes ilPop{from{transform:scale(.6);opacity:.2}to{transform:scale(1);opacity:1}}',
      '.il-fade{animation:ilFade .28s ease both}',
      '@keyframes ilFade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}',
      '.il-bar{transition:width .5s ease}',
      '.il-award{animation:ilAward .5s cubic-bezier(.2,1.6,.4,1) both}',
      '@keyframes ilAward{from{opacity:0;transform:scale(.3) rotate(-25deg)}to{opacity:1;transform:none}}',
      '.il-shake{animation:ilShake .4s ease}',
      '@keyframes ilShake{25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}',
      '.il-rich{overflow-wrap:anywhere}.il-rich img,.il-rich svg{max-width:100%;height:auto}',
      '.il-rich table{border-collapse:collapse;margin:10px 0;display:block;max-width:100%;overflow-x:auto}',
      '.il-rich td,.il-rich th{border:1px solid var(--c-hairline);padding:6px 12px;text-align:center}',
      '.il-frac{display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;line-height:1.15;margin:0 2px;font-size:.92em}',
      '.il-frac>span:first-child{border-bottom:1px solid currentColor;padding:0 4px}.il-frac>span:last-child{padding:0 4px}',
      '@media (prefers-reduced-motion:reduce){.il-seg.draw,.il-node.pop,.il-node.cur::before,.il-fade,.il-award,.il-shake{animation:none}}'
    ].join('\n');
    document.head.appendChild(s);
  }

  /* -------------------------------------------------------------------
     УТИЛИТЫ
     ------------------------------------------------------------------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  // Тексты задач — ваши собственные данные и могут содержать HTML
  function rich(s) {
    let t = String(s == null ? '' : s);
    t = t.replace(/<f>\s*([^<]*?)\s*\/\s*([^<]*?)\s*<\/f>/g, function (_, a, b) {
      return '<span class="il-frac"><span>' + a + '</span><span>' + b + '</span></span>';
    });
    if (!/<(p|br|div|ul|ol|li|table|h\d)\b/i.test(t)) t = t.replace(/\r?\n/g, '<br>');
    return t;
  }
  function mathify(el) {
    if (!el || !window.renderMathInElement) return;
    try {
      window.renderMathInElement(el, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '\\(', right: '\\)', display: false },
          { left: '$', right: '$', display: false }
        ],
        throwOnError: false
      });
    } catch (e) {}
  }
  function jget(k, fallback) {
    try { const r = localStorage.getItem(k); return r ? JSON.parse(r) : fallback; } catch (e) { return fallback; }
  }
  function shuffle(a) {
    const x = a.slice();
    for (let i = x.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); const t = x[i]; x[i] = x[j]; x[j] = t;
    }
    return x;
  }
  function mmss(ms) {
    const s = Math.max(0, Math.ceil(ms / 1000));
    return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2);
  }
  function dayKey(d) {
    return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
  }
  function streak() {
    const days = ((jget(TELE_KEY, {}) || {}).days) || {};
    const now = new Date();
    let n = 0;
    for (let i = 0; i < 400; i++) {
      const r = days[dayKey(new Date(now.getFullYear(), now.getMonth(), now.getDate() - i))];
      if (r && +r.q > 0) n++;
      else if (i > 0) break;
    }
    return n;
  }
  function topicNames(track) {
    if (track === 'math') return typeof TOPS !== 'undefined' ? TOPS : [];
    return typeof RTOPS !== 'undefined' ? RTOPS : [];
  }

  /* -------------------------------------------------------------------
     КАТАЛОГ ОСТРОВОВ (из dataAdapter.js)
     ------------------------------------------------------------------- */
  let CATALOG = null;
  function buildCatalog() {
    const out = { math: [], rw: [] };
    ['math', 'rw'].forEach(function (track) {
      const byTi = {};
      ['easy', 'medium', 'hard'].forEach(function (diff) {
        Data.query({ section: track, difficulty: diff }).forEach(function (id) {
          const m = /^(?:m|rw|rg):(\d+):/.exec(id);
          if (!m) return;
          const ti = +m[1];
          if (!byTi[ti]) byTi[ti] = { easy: [], medium: [], hard: [] };
          byTi[ti][diff].push(id);
        });
      });
      const names = topicNames(track);
      Object.keys(byTi).map(Number).sort(function (a, b) { return a - b; }).forEach(function (ti) {
        const q = byTi[ti];
        const sample = Data.getQuestion(q.easy[0] || q.medium[0] || q.hard[0]);
        out[track].push({
          track: track, ti: ti, pool: q,
          title: String(names[ti] || (sample && sample.topic) || ('Topic ' + (ti + 1))),
          domain: sample ? sample.domain : ''
        });
      });
    });
    return out;
  }

  /* -------------------------------------------------------------------
     ПРОГРЕСС
     ------------------------------------------------------------------- */
  let demoStore = null;
  function readStore() {
    if (DEMO) {
      if (!demoStore) {
        demoStore = { v: 1, nodes: {} };
        [[0, 1, 3], [0, 2, 3], [0, 3, 2], [0, 4, 2], [1, 1, 3], [1, 2, 1]].forEach(function (x) {
          demoStore.nodes['math:' + x[0] + ':' + x[1]] = { done: 1, stars: x[2], best: 70 + x[2] * 10, tries: 1 };
        });
      }
      return demoStore;
    }
    const s = jget(KEY, null);
    return s && s.nodes ? s : { v: 1, nodes: {} };
  }
  function writeStore(s) {
    if (DEMO) { demoStore = s; return; }
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { Shell.toast('Could not save progress on this device.'); }
  }
  function legacySet(track) {
    const set = {};
    if (DEMO) return set;
    const a = jget(LEGACY[track], []);
    if (Array.isArray(a)) a.forEach(function (g) { set[g] = 1; });
    return set;
  }
  function nodeKey(track, ti, ni) { return track + ':' + ti + ':' + ni; }

  // Снимок трека: у каждого узла state = 'done' | 'current' | 'locked'
  function trackState(track) {
    const store = readStore(), old = legacySet(track);
    let open = true, current = null, stars = 0, done = 0, total = 0, conquered = 0;
    const islands = CATALOG[track].map(function (isl, index) {
      const nodes = NODES.map(function (def) {
        const key = nodeKey(track, isl.ti, def.ni);
        const rec = store.nodes[key];
        const legacyDone = !!old[isl.ti * 5 + def.ni];
        const isDone = !!(rec && rec.done) || legacyDone;
        const n = {
          key: key, def: def, island: isl, index: index,
          done: isDone,
          stars: isDone ? Math.max(1, (rec && rec.stars) || 0) : 0,
          best: (rec && rec.best) || 0,
          tries: (rec && rec.tries) || 0,
          state: isDone ? 'done' : (open ? 'current' : 'locked')
        };
        if (n.state === 'current') current = n;
        if (!isDone) open = false;
        total++;
        if (isDone) { done++; stars += n.stars; }
        return n;
      });
      const cleared = nodes.every(function (n) { return n.done; });
      if (cleared) conquered++;
      return {
        info: isl, index: index, nodes: nodes, cleared: cleared,
        stars: nodes.reduce(function (a, n) { return a + n.stars; }, 0),
        locked: nodes.every(function (n) { return n.state === 'locked'; })
      };
    });
    return { islands: islands, current: current, stars: stars, done: done, total: total, conquered: conquered };
  }
  function findNode(track, key) {
    let hit = null;
    trackState(track).islands.forEach(function (i) { i.nodes.forEach(function (n) { if (n.key === key) hit = n; }); });
    return hit;
  }

  /* -------------------------------------------------------------------
     ПОДБОР ЗАДАЧ ДЛЯ УЗЛА
     ------------------------------------------------------------------- */
  // Сначала нерешённые; Math-задачи чередуются по генераторам, чтобы не шли похожие подряд
  function arrange(ids) {
    const prog = DEMO ? {} : Data.progress.get();
    const mix = function (list) {
      const groups = {};
      shuffle(list).forEach(function (id) {
        const m = /^(m|rg):(\d+):(\d+):/.exec(id);
        const g = m ? m[1] + m[3] : id;
        (groups[g] = groups[g] || []).push(id);
      });
      const queues = shuffle(Object.keys(groups).map(function (k) { return groups[k]; }));
      const out = [];
      let left = list.length;
      while (left > 0) queues.forEach(function (queue) { if (queue.length) { out.push(queue.shift()); left--; } });
      return out;
    };
    const fresh = ids.filter(function (id) { return !prog[id] || prog[id].r !== 'ok'; });
    const seen = ids.filter(function (id) { return prog[id] && prog[id].r === 'ok'; });
    return mix(fresh).concat(mix(seen));
  }

  function pickQuestions(node) {
    const pool = node.island.pool, def = node.def, want = def.count;
    const used = {}, texts = {}, out = [];
    function take(id, limit) {
      if (out.length >= limit || used[id]) return;
      used[id] = 1;
      const q = Data.getQuestion(id);
      if (!q) return;
      if (q.type === 'mcq' && (q.choices.length < 2 || !q.correctAnswer)) return;
      const sig = q.passage + '|' + q.prompt + '|' + q.correctAnswer;
      if (texts[sig]) return;
      texts[sig] = 1;
      out.push(q);
    }
    function fill(diff, limit) {
      arrange(pool[diff]).forEach(function (id) { take(id, limit); });
      if (out.length >= limit) return;
      // Генераторы могут создать новые версии, если в банке не хватает задач
      const seeds = {};
      pool[diff].forEach(function (id) {
        const m = /^((?:m|rg):\d+:\d+):/.exec(id);
        if (m) seeds[m[1]] = 1;
      });
      const bases = Object.keys(seeds);
      if (!bases.length) return;
      for (let i = 0; i < 80 && out.length < limit; i++) {
        take(bases[i % bases.length] + ':' + (100 + Math.floor(Math.random() * 900000)), limit);
      }
    }
    if (def.id === 'boss') {
      fill('hard', Math.ceil(want * 0.7));
      fill('medium', want);
      fill('hard', want);
      fill('easy', want);
    } else {
      const order = { easy: ['easy', 'medium', 'hard'], medium: ['medium', 'easy', 'hard'], hard: ['hard', 'medium', 'easy'] }[def.id];
      order.forEach(function (d) { fill(d, want); });
    }
    return shuffle(out);
  }

  /* -------------------------------------------------------------------
     СОСТОЯНИЕ ЭКРАНА
     RUN живёт вне render(), поэтому смена темы не сбрасывает попытку
     ------------------------------------------------------------------- */
  let RUN = null;
  let VIEW = null;           // { root, ctx, alive }
  let TRACK = 'math';
  let OPEN = {};             // раскрытые вручную острова: { 'math:3': true|false }
  let fresh = null;          // только что открытый узел (анимация на карте)
  let sheetEl = null, sheetNode = null;
  let runEl = null;
  let timer = null;
  let lastOverflow = null;

  function lockScroll(on) {
    if (on && lastOverflow === null) { lastOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden'; }
    if (!on && lastOverflow !== null) { document.body.style.overflow = lastOverflow; lastOverflow = null; }
  }

  /* -------------------------------------------------------------------
     КАРТА
     ------------------------------------------------------------------- */
  const XS = [12.5, 37.5, 62.5, 87.5];
  const YS = [40, 66, 40, 66];

  function pathHtml(isl) {
    let segs = '';
    for (let i = 0; i < 3; i++) {
      const x1 = XS[i] * 4, x2 = XS[i + 1] * 4, mid = (x1 + x2) / 2;
      const d = 'M' + x1 + ' ' + YS[i] + ' C' + mid + ' ' + YS[i] + ' ' + mid + ' ' + YS[i + 1] + ' ' + x2 + ' ' + YS[i + 1];
      const on = isl.nodes[i].done && isl.nodes[i + 1].state !== 'locked';
      segs += '<path class="il-seg' + (on ? ' on' : '') + (on && fresh === isl.nodes[i + 1].key ? ' draw' : '') + '" d="' + d + '"/>';
    }
    const slots = isl.nodes.map(function (n, i) {
      const boss = n.def.id === 'boss';
      let look, inner;
      if (n.state === 'done') {
        look = boss ? 'bg-hl/15 border-hl text-hl' : 'bg-accent border-accent text-white';
        inner = icon(boss ? 'crown' : 'check', 'h-5 w-5');
      } else if (n.state === 'current') {
        look = 'bg-accent/15 border-accent text-accent cur';
        inner = icon(boss ? 'crown' : 'play', 'h-5 w-5');
      } else {
        look = 'bg-raised text-ink-mute';
        inner = icon(boss ? 'crown' : 'lock', 'h-4 w-4');
      }
      const label = n.def.label + (boss ? ' checkpoint' : ' level') + ', ' +
        (n.state === 'done' ? n.stars + ' of 3 stars' : n.state);
      return '<div class="il-slot" style="left:' + XS[i] + '%;top:' + (YS[i] - 26) + 'px">' +
        '<button type="button" class="il-node ' + look + (boss ? ' boss' : '') + (fresh === n.key ? ' pop' : '') +
          '" data-node="' + n.key + '" aria-label="' + esc(label) + '">' + inner + '</button>' +
        '<span class="text-[11.5px] font-medium ' + (n.state === 'locked' ? 'text-ink-mute' : 'text-ink-soft') + '">' + n.def.label + '</span>' +
        (n.state === 'done' ? starRow(n.stars) : n.state === 'current'
          ? '<span class="text-[10.5px] font-semibold uppercase tracking-wider text-accent">Next</span>' : '') +
      '</div>';
    }).join('');
    return '<div class="il-path mt-2"><svg viewBox="0 0 400 150" preserveAspectRatio="none" aria-hidden="true">' + segs + '</svg>' + slots + '</div>';
  }

  function islandHtml(isl, st) {
    const key = TRACK + ':' + isl.info.ti;
    const isCurrent = !!(st.current && st.current.island === isl.info);
    const justHere = !!(fresh && isl.nodes.some(function (n) { return n.key === fresh; }));
    const open = OPEN[key] !== undefined ? OPEN[key] : (isCurrent || justHere);
    const doneCount = isl.nodes.filter(function (n) { return n.done; }).length;
    const badge = isl.cleared
      ? '<span class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-success/10 text-success">' + icon('flag', 'h-4 w-4') + '</span>'
      : isl.locked
        ? '<span class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-raised text-ink-mute">' + icon('lock', 'h-4 w-4') + '</span>'
        : '<span class="num grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/10 text-[13px] font-semibold text-accent">' + (isl.index + 1) + '</span>';
    return '<section class="rounded-2xl border bg-surface ' + (isCurrent ? 'border-accent/50' : '') + '" id="il-isl-' + isl.info.ti + '">' +
      '<button type="button" class="flex min-h-[64px] w-full items-center gap-3 p-3.5 text-left sm:px-4" data-toggle="' + key + '" aria-expanded="' + open + '">' +
        badge +
        '<span class="min-w-0 flex-1">' +
          '<span class="block truncate text-[14.5px] font-semibold ' + (isl.locked ? 'text-ink-soft' : 'text-ink') + '">' + esc(isl.info.title) + '</span>' +
          '<span class="num mt-0.5 block text-[12px] text-ink-mute">Island ' + (isl.index + 1) + ' · ' + doneCount + '/4 levels</span>' +
        '</span>' +
        '<span class="num inline-flex shrink-0 items-center gap-1 text-[12.5px] ' + (isl.stars ? 'text-ink-soft' : 'text-ink-mute') + '">' +
          '<span class="' + (isl.stars ? 'il-star-on' : '') + '">' + icon('star', 'h-3.5 w-3.5') + '</span>' + isl.stars + '/12</span>' +
        '<span class="shrink-0 text-ink-mute transition-transform ' + (open ? 'rotate-180' : '') + '">' + icon('chevron') + '</span>' +
      '</button>' +
      (open ? '<div class="il-fade border-t px-2 pb-2 pt-3">' + pathHtml(isl) + '</div>' : '') +
    '</section>';
  }

  function statHtml(ic, value, label) {
    return '<div class="rounded-xl border bg-surface p-3.5">' +
      '<div class="flex items-center gap-1.5 text-[11.5px] text-ink-soft">' + icon(ic, 'h-3.5 w-3.5') + label + '</div>' +
      '<div class="num mt-1.5 text-[20px] font-semibold tracking-tight">' + value + '</div></div>';
  }

  function paintMap() {
    if (!VIEW || !VIEW.alive) return;
    const host = VIEW.root.querySelector('#il-body');
    if (!host) return;
    if (!CATALOG[TRACK].length) {
      host.innerHTML = '<div class="rounded-2xl border bg-surface p-8 text-center">' +
        '<p class="text-[15px] font-semibold">No ' + TRACKS[TRACK].label + ' questions found</p>' +
        '<p class="mt-1.5 text-[13px] text-ink-soft">Make sure the question files are in the same folder as the app, then reload.</p></div>';
      return;
    }
    const st = trackState(TRACK);
    const cur = st.current;
    const pct = st.total ? Math.round(st.done / st.total * 100) : 0;
    const xp = Data.stats.points();

    const hero = cur
      ? '<div class="rounded-2xl border bg-surface p-4 sm:p-5">' +
          '<div class="text-[11px] font-semibold uppercase tracking-widest text-ink-mute">Your position</div>' +
          '<div class="mt-2 text-[17px] font-semibold leading-snug tracking-tight">' + esc(cur.island.title) + '</div>' +
          '<div class="num mt-1 text-[12.5px] text-ink-soft">Island ' + (cur.index + 1) + ' of ' + st.islands.length + ' · ' +
            (cur.def.id === 'boss' ? 'Boss checkpoint' : cur.def.label + ' level') + '</div>' +
          '<button type="button" data-continue class="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-accent text-[13.5px] font-semibold text-white transition-colors hover:bg-accent-hover">Continue' + icon('arrow') + '</button>' +
          '<button type="button" data-locate class="mt-1.5 h-11 w-full rounded-full text-[12.5px] font-medium text-ink-soft hover:text-ink">Show on map</button>' +
        '</div>'
      : '<div class="rounded-2xl border border-success/40 bg-surface p-5">' +
          '<div class="text-success">' + icon('flag', 'h-6 w-6') + '</div>' +
          '<div class="mt-2 text-[17px] font-semibold">Path complete</div>' +
          '<p class="mt-1 text-[13px] text-ink-soft">Every island is conquered. Replay any level to collect all stars.</p></div>';

    let lastDomain = null;
    const list = st.islands.map(function (isl) {
      let head = '';
      if (isl.info.domain !== lastDomain) {
        lastDomain = isl.info.domain;
        head = '<h2 class="px-1 pb-0.5 pt-3 text-[11px] font-semibold uppercase tracking-widest text-ink-mute first:pt-0">' + esc(lastDomain) + '</h2>';
      }
      return head + islandHtml(isl, st);
    }).join('');

    host.innerHTML =
      '<div class="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">' +
        '<aside class="space-y-3 lg:sticky lg:top-6 lg:order-2">' +
          hero +
          '<div class="rounded-2xl border bg-surface p-4">' +
            '<div class="flex items-center justify-between text-[12.5px]"><span class="text-ink-soft">' + TRACKS[TRACK].label + ' progress</span><span class="num font-semibold">' + pct + '%</span></div>' +
            '<div class="mt-2 h-1.5 overflow-hidden rounded-full bg-raised"><div class="il-bar h-full rounded-full bg-accent" style="width:' + pct + '%"></div></div>' +
            '<div class="num mt-2 text-[12px] text-ink-mute">' + st.conquered + ' of ' + st.islands.length + ' islands conquered</div>' +
          '</div>' +
          '<div class="grid grid-cols-3 gap-2">' +
            statHtml('star', st.stars, 'Stars') +
            statHtml('flame', streak(), 'Streak') +
            statHtml('bolt', xp.today, 'XP today') +
          '</div>' +
        '</aside>' +
        '<div class="min-w-0 space-y-2.5 lg:order-1">' + list + '</div>' +
      '</div>';

    VIEW.root.querySelectorAll('[data-track]').forEach(function (b) {
      const on = b.getAttribute('data-track') === TRACK;
      b.setAttribute('aria-selected', String(on));
      b.className = 'h-11 flex-1 whitespace-nowrap rounded-full px-4 text-[13px] font-medium transition-colors sm:flex-none ' +
        (on ? 'bg-raised text-ink' : 'text-ink-soft hover:text-ink');
    });
  }

  function scrollToIsland(ti) {
    const el = VIEW && VIEW.root.querySelector('#il-isl-' + ti);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function onMapClick(e) {
    const t = e.target.closest('[data-track],[data-toggle],[data-node],[data-continue],[data-locate]');
    if (!t) return;
    if (t.hasAttribute('data-track')) {
      TRACK = t.getAttribute('data-track');
      fresh = null;
      try { sessionStorage.setItem(TRACK_KEY, TRACK); } catch (err) {}
      paintMap();
    } else if (t.hasAttribute('data-toggle')) {
      const k = t.getAttribute('data-toggle');
      OPEN[k] = t.getAttribute('aria-expanded') !== 'true';
      fresh = null;
      paintMap();
    } else if (t.hasAttribute('data-node')) {
      const n = findNode(TRACK, t.getAttribute('data-node'));
      if (!n) return;
      if (n.state === 'locked') {
        t.classList.remove('il-shake'); void t.offsetWidth; t.classList.add('il-shake');
        Shell.toast('Finish the previous level to unlock this one.');
      } else openSheet(n);
    } else if (t.hasAttribute('data-continue')) {
      const cur = trackState(TRACK).current;
      if (cur) openSheet(cur);
    } else {
      const cur = trackState(TRACK).current;
      if (cur) {
        OPEN[TRACK + ':' + cur.island.ti] = true;
        paintMap();
        scrollToIsland(cur.island.ti);
      }
    }
  }

  /* -------------------------------------------------------------------
     КАРТОЧКА УЗЛА (bottom sheet на телефоне, модалка на десктопе)
     ------------------------------------------------------------------- */
  function closeSheet() {
    if (sheetEl) { sheetEl.remove(); sheetEl = null; sheetNode = null; if (!RUN) lockScroll(false); }
  }

  function openSheet(node) {
    closeSheet();
    const T = TRACKS[node.island.track], boss = node.def.id === 'boss';
    const rules = boss
      ? [
        ['clock', mmss(node.def.count * T.bossSec * 1000) + ' on the clock. It pauses while you read each result.'],
        ['shield', BOSS_LIVES + ' shields. Each mistake breaks one; losing all three ends the run.'],
        ['star', 'No mistakes: 3 stars · 1 mistake: 2 stars · 2 mistakes: 1 star.']
      ]
      : [
        ['target', 'Score ' + T.pass + '% or higher to clear this level.'],
        ['star', '1 star at ' + T.pass + '% · 2 stars at ' + T.two + '% · 3 stars at ' + T.three + '%.'],
        ['clock', 'No time limit. An explanation follows every answer.']
      ];
    sheetNode = node;
    sheetEl = document.createElement('div');
    sheetEl.className = 'fixed inset-0 z-[60] flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-4';
    sheetEl.setAttribute('role', 'dialog');
    sheetEl.setAttribute('aria-modal', 'true');
    sheetEl.setAttribute('aria-label', node.island.title + ' — ' + node.def.label);
    sheetEl.innerHTML =
      '<div class="il-fade max-h-[90vh] w-full overflow-y-auto rounded-t-2xl border bg-surface p-5 shadow-2xl sm:max-w-[420px] sm:rounded-2xl">' +
        '<div class="flex items-start gap-3">' +
          '<span class="grid h-11 w-11 shrink-0 place-items-center rounded-xl ' + (boss ? 'bg-hl/15 text-hl' : 'bg-accent/10 text-accent') + '">' + icon(boss ? 'crown' : 'target', 'h-5 w-5') + '</span>' +
          '<div class="min-w-0 flex-1"><h2 class="text-[17px] font-semibold leading-snug tracking-tight">' + (boss ? 'Boss Checkpoint' : node.def.label + ' level') + '</h2>' +
          '<p class="mt-0.5 text-[12.5px] text-ink-soft">' + esc(node.island.title) + '</p></div>' +
          '<button type="button" data-sheet="close" class="grid h-11 w-11 shrink-0 place-items-center rounded-lg text-ink-soft hover:bg-raised hover:text-ink" aria-label="Close">' + icon('x') + '</button>' +
        '</div>' +
        '<div class="num mt-4 flex items-center justify-between rounded-xl bg-raised px-3.5 py-3 text-[12.5px]">' +
          '<span class="text-ink-soft">' + node.def.count + ' questions</span>' +
          (node.done
            ? '<span class="inline-flex items-center gap-2 text-ink-soft">' + (node.best ? 'Best ' + node.best + '%' : 'Cleared') + starRow(node.stars, 'h-3.5 w-3.5') + '</span>'
            : '<span class="font-semibold text-accent">+' + node.def.bonus + ' XP on first clear</span>') +
        '</div>' +
        '<ul class="mt-4 space-y-3">' + rules.map(function (r) {
          return '<li class="flex gap-2.5 text-[13px] leading-relaxed text-ink-soft"><span class="mt-0.5 shrink-0 text-ink-mute">' + icon(r[0]) + '</span><span>' + r[1] + '</span></li>';
        }).join('') + '</ul>' +
        (boss && !node.done ? '<p class="mt-3 text-[12.5px] text-ink">Defeat the boss to unlock the next island.</p>' : '') +
        '<button type="button" data-sheet="start" class="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-accent text-[14px] font-semibold text-white transition-colors hover:bg-accent-hover">' +
          icon('play') + (node.done ? 'Replay level' : boss ? 'Face the boss' : 'Start level') + '</button>' +
      '</div>';
    sheetEl.addEventListener('click', function (e) {
      const b = e.target.closest('[data-sheet]');
      if (e.target === sheetEl || (b && b.getAttribute('data-sheet') === 'close')) closeSheet();
      else if (b) startRun(sheetNode);
    });
    document.body.appendChild(sheetEl);
    lockScroll(true);
    sheetEl.querySelector('[data-sheet="start"]').focus();
  }

  /* -------------------------------------------------------------------
     ПОПЫТКА
     ------------------------------------------------------------------- */
  function startRun(node) {
    if (!node) return;
    const qs = pickQuestions(node);
    if (!qs.length) { Shell.toast('No questions are available for this level yet.'); return; }
    closeSheet();
    const boss = node.def.id === 'boss';
    const limit = boss ? qs.length * TRACKS[node.island.track].bossSec * 1000 : 0;
    fresh = null;
    RUN = {
      key: node.key, track: node.island.track, node: node, boss: boss,
      qs: qs, i: 0, answer: '', checked: false, results: [],
      lives: BOSS_LIVES, remaining: limit, deadline: boss ? Date.now() + limit : 0,
      started: Date.now(), combo: 0, xpStart: Data.stats.points().total,
      result: null, leaving: false, calc: false
    };
    mountRun();
  }

  function mountRun() {
    unmountRun();
    if (!RUN) return;
    runEl = document.createElement('div');
    runEl.className = 'fixed inset-0 z-[55] flex flex-col bg-canvas text-ink';
    runEl.setAttribute('role', 'dialog');
    runEl.setAttribute('aria-modal', 'true');
    runEl.setAttribute('aria-label', 'Level in progress');
    runEl.addEventListener('click', onRunClick);
    runEl.addEventListener('input', onRunInput);
    document.body.appendChild(runEl);
    lockScroll(true);
    paintRun();
    timer = setInterval(tick, 250);
  }
  function unmountRun() {
    clearInterval(timer);
    timer = null;
    if (runEl) { runEl.remove(); runEl = null; }
  }

  function tick() {
    if (!RUN || !runEl || RUN.result) return;
    const el = runEl.querySelector('#il-clock');
    if (RUN.boss) {
      if (RUN.checked) return;                     // пауза, пока виден результат
      const left = RUN.deadline - Date.now();
      if (left <= 0) { RUN.remaining = 0; finish('time'); return; }
      if (el) {
        el.textContent = mmss(left);
        el.parentNode.classList.toggle('text-danger', left < 60000);
      }
    } else if (el) {
      el.textContent = mmss(Date.now() - RUN.started);
    }
  }

  function headerHtml() {
    const total = RUN.qs.length;
    let dots = '';
    for (let k = 0; k < total; k++) {
      const r = RUN.results[k];
      dots += '<span class="h-1.5 flex-1 rounded-full transition-colors ' +
        (r ? (r.ok ? 'bg-success' : 'bg-danger') : k === RUN.i ? 'bg-accent' : 'bg-raised') + '"></span>';
    }
    let shields = '';
    if (RUN.boss) {
      shields = '<span class="inline-flex items-center gap-1" aria-label="' + RUN.lives + ' shields left">';
      for (let s = 0; s < BOSS_LIVES; s++) {
        shields += '<span class="' + (s < RUN.lives ? 'text-hl' : 'text-ink-mute opacity-40') + '">' + icon('shield', 'h-4 w-4') + '</span>';
      }
      shields += '</span>';
    }
    return '<header class="shrink-0 border-b bg-surface">' +
      '<div class="flex h-14 items-center gap-2 px-2 sm:px-4">' +
        '<button type="button" data-run="exit" class="grid h-11 w-11 shrink-0 place-items-center rounded-lg text-ink-soft hover:bg-raised hover:text-ink" aria-label="Exit level">' + icon('x', 'h-5 w-5') + '</button>' +
        '<div class="min-w-0 flex-1"><div class="truncate text-[13.5px] font-semibold">' + esc(RUN.node.island.title) + '</div>' +
          '<div class="text-[11.5px] ' + (RUN.boss ? 'text-hl' : 'text-ink-mute') + '">' + (RUN.boss ? 'Boss Checkpoint' : RUN.node.def.label + ' level') + '</div></div>' +
        shields +
        '<span class="inline-flex items-center gap-1.5 px-1 text-ink-soft">' + icon('clock', 'h-4 w-4') +
          '<span id="il-clock" class="num text-[13.5px] font-semibold">' +
          (RUN.boss ? mmss(RUN.checked ? RUN.remaining : RUN.deadline - Date.now()) : mmss(Date.now() - RUN.started)) + '</span></span>' +
        (RUN.track === 'math' ? '<button type="button" data-run="calc" class="grid h-11 w-11 shrink-0 place-items-center rounded-lg ' + (RUN.calc ? 'bg-accent text-white' : 'text-ink-soft hover:bg-raised hover:text-ink') + '" aria-label="Calculator" aria-pressed="' + RUN.calc + '">' + icon('calc', 'h-5 w-5') + '</button>' : '') +
      '</div>' +
      '<div class="flex gap-1 px-4 pb-2.5">' + dots + '</div>' +
    '</header>';
  }

  function choicesHtml(q) {
    return '<div class="mt-5 space-y-2.5" role="radiogroup">' + q.choices.map(function (c) {
      const picked = RUN.answer === c.key;
      let box = picked ? 'border-accent bg-accent/10' : 'bg-surface hover:bg-raised';
      let dot = picked ? 'bg-accent border-accent text-white' : 'text-ink-soft';
      let mark = esc(c.key);
      if (RUN.checked) {
        const right = c.key === q.correctAnswer;
        // В бою с боссом верный ответ не раскрывается до конца попытки
        if (right && (!RUN.boss || picked)) {
          box = 'border-success bg-success/10'; dot = 'bg-success border-success text-white'; mark = icon('check', 'h-3.5 w-3.5');
        } else if (picked) {
          box = 'border-danger bg-danger/10'; dot = 'bg-danger border-danger text-white'; mark = icon('x', 'h-3.5 w-3.5');
        } else box = 'bg-surface opacity-60';
      }
      return '<button type="button" role="radio" aria-checked="' + picked + '" data-choice="' + esc(c.key) + '"' + (RUN.checked ? ' disabled' : '') +
        ' class="flex min-h-[52px] w-full items-center gap-3 rounded-xl border px-3.5 py-3 text-left text-[14.5px] transition-colors ' + box + '">' +
        '<span class="grid h-7 w-7 shrink-0 place-items-center rounded-full border text-[12px] font-semibold ' + dot + '">' + mark + '</span>' +
        '<span class="il-rich min-w-0 flex-1">' + rich(c.text) + '</span></button>';
    }).join('') + '</div>';
  }

  function gridHtml(q) {
    const r = RUN.results[RUN.i];
    return '<div class="mt-5"><label class="block text-[12px] font-medium text-ink-soft" for="il-spr">Enter your answer</label>' +
      '<input id="il-spr" type="text" maxlength="16" autocomplete="off" spellcheck="false" inputmode="text" value="' + esc(RUN.answer) + '"' + (RUN.checked ? ' disabled' : '') +
      ' class="num mt-2 h-12 w-full max-w-[240px] rounded-xl border bg-surface px-3.5 text-[17px] text-ink outline-none focus:border-accent ' +
      (r ? (r.ok ? 'border-success' : 'border-danger') : '') + '">' +
      (RUN.checked && !RUN.boss ? '<p class="num mt-2.5 text-[13px] text-success">Accepted answers: ' + esc(q.acceptedAnswers.join(', ')) + '</p>' : '') +
    '</div>';
  }

  function isOver() {
    return (RUN.boss && RUN.lives <= 0) || RUN.i >= RUN.qs.length - 1;
  }

  function verdictHtml(q) {
    if (!RUN.checked) return '';
    const ok = RUN.results[RUN.i].ok;
    let title = ok ? (RUN.combo >= 3 ? 'Correct · ' + RUN.combo + ' in a row' : 'Correct') : 'Not quite';
    if (!ok && RUN.boss) {
      title = RUN.lives <= 0 ? 'All shields are broken'
        : 'Shield broken · ' + RUN.lives + (RUN.lives === 1 ? ' shield left' : ' shields left');
    }
    return '<div class="il-fade mt-5" role="status">' +
      '<div class="flex items-center gap-2 rounded-xl px-3.5 py-3 text-[13.5px] font-semibold ' + (ok ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger') + '">' +
        icon(ok ? 'check' : 'x') + title + '</div>' +
      (!RUN.boss && q.explanation
        ? '<div class="mt-3 rounded-xl border bg-surface p-4"><div class="text-[11px] font-semibold uppercase tracking-widest text-ink-mute">Explanation</div>' +
          '<div class="il-rich mt-2 text-[13.5px] leading-relaxed text-ink-soft">' + rich(q.explanation) + '</div></div>'
        : '') +
    '</div>';
  }

  function questionHtml() {
    const q = RUN.qs[RUN.i];
    const head = '<div class="num text-[12px] text-ink-mute">Question ' + (RUN.i + 1) + ' of ' + RUN.qs.length + '</div>';
    const passage = q.passage ? '<div class="il-rich rounded-2xl border bg-surface p-4 text-[14.5px] leading-7 sm:p-5">' + rich(q.passage) + '</div>' : '';
    const body =
      '<div class="il-rich mt-2 text-[15.5px] leading-relaxed">' + rich(q.prompt) + '</div>' +
      (q.type === 'spr' ? gridHtml(q) : choicesHtml(q)) +
      verdictHtml(q);
    const content = passage
      ? '<div class="il-fade mx-auto grid max-w-[1080px] grid-cols-1 gap-5 lg:grid-cols-2 lg:items-start"><div>' + passage + '</div><div>' + head + body + '</div></div>'
      : '<div class="il-fade mx-auto max-w-[680px]">' + head + body + '</div>';

    const calc = RUN.track === 'math'
      ? '<div id="il-calc" class="' + (RUN.calc ? 'flex' : 'hidden') + ' h-[46vh] shrink-0 flex-col border-b bg-surface lg:h-auto lg:w-[42%] lg:border-b-0 lg:border-r"></div>'
      : '';

    const label = !RUN.checked ? 'Check' : isOver() ? 'See results' : 'Next';
    return headerHtml() +
      '<div class="flex min-h-0 flex-1 flex-col lg:flex-row">' + calc +
        '<main id="il-scroll" class="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:py-8">' + content + '</main></div>' +
      '<footer class="flex shrink-0 items-center justify-between gap-3 border-t bg-surface px-4 py-3">' +
        '<span class="hidden text-[12px] text-ink-mute sm:block">Keys: 1–4 or A–D to choose · Enter to continue</span>' +
        '<button type="button" id="il-main" data-run="main" class="ml-auto h-12 w-full rounded-full bg-accent px-8 text-[14px] font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40 sm:h-11 sm:w-auto"' +
          (!RUN.checked && !String(RUN.answer).trim() ? ' disabled' : '') + '>' + label + '</button>' +
      '</footer>' +
      (RUN.leaving
        ? '<div class="absolute inset-0 z-10 grid place-items-center bg-black/60 p-4 backdrop-blur-sm">' +
            '<div class="il-fade w-full max-w-[360px] rounded-2xl border bg-surface p-5">' +
              '<h2 class="text-[16px] font-semibold">Leave this level?</h2>' +
              '<p class="mt-1.5 text-[13px] text-ink-soft">Your answers still count toward your stats, but this run will not be saved on the map.</p>' +
              '<div class="mt-5 flex gap-2.5"><button type="button" data-run="stay" class="h-11 flex-1 rounded-lg border text-[13.5px] font-medium hover:bg-raised">Keep going</button>' +
              '<button type="button" data-run="leave" class="h-11 flex-1 rounded-lg bg-danger text-[13.5px] font-semibold text-white">Leave</button></div>' +
            '</div></div>'
        : '');
  }

  // Desmos создаётся один раз и переносится между перерисовками, чтобы не терять графики
  let calcFrame = null;
  function mountCalc() {
    const slot = runEl && runEl.querySelector('#il-calc');
    if (!slot || !RUN.calc) return;
    if (!calcFrame) {
      calcFrame = document.createElement('iframe');
      calcFrame.src = 'https://www.desmos.com/calculator';
      calcFrame.title = 'Desmos graphing calculator';
      calcFrame.className = 'h-full w-full border-0';
    }
    slot.appendChild(calcFrame);
  }
  function toggleCalc() {
    RUN.calc = !RUN.calc;
    const slot = runEl.querySelector('#il-calc');
    const btn = runEl.querySelector('[data-run="calc"]');
    if (!slot || !btn) return;
    slot.classList.toggle('hidden', !RUN.calc);
    slot.classList.toggle('flex', RUN.calc);
    btn.className = 'grid h-11 w-11 shrink-0 place-items-center rounded-lg ' + (RUN.calc ? 'bg-accent text-white' : 'text-ink-soft hover:bg-raised hover:text-ink');
    btn.setAttribute('aria-pressed', String(RUN.calc));
    if (RUN.calc && !slot.firstChild) mountCalc();
  }

  function paintRun(keepScroll) {
    if (!runEl || !RUN) return;
    if (RUN.result) { runEl.innerHTML = resultHtml(); mathify(runEl); return; }
    const old = runEl.querySelector('#il-scroll');
    const top = keepScroll && old ? old.scrollTop : 0;
    // iframe перезагружается при переносе, поэтому при перерисовке сохраняем саму панель калькулятора
    const oldCalc = runEl.querySelector('#il-calc');
    if (oldCalc && calcFrame && oldCalc.contains(calcFrame) && oldCalc.parentNode) {
      const tmp = document.createElement('div');
      tmp.innerHTML = questionHtml();
      const kids = Array.prototype.slice.call(tmp.children);
      const row = oldCalc.parentNode;
      const newHeader = kids[0], newRow = kids[1], newFooter = kids[2], newDialog = kids[3];
      Array.prototype.slice.call(runEl.children).forEach(function (ch) { if (ch !== row) ch.remove(); });
      runEl.insertBefore(newHeader, row);
      row.replaceChild(newRow.querySelector('#il-scroll'), row.querySelector('#il-scroll'));
      runEl.appendChild(newFooter);
      if (newDialog) runEl.appendChild(newDialog);
      oldCalc.classList.toggle('hidden', !RUN.calc);
      oldCalc.classList.toggle('flex', RUN.calc);
    } else {
      runEl.innerHTML = questionHtml();
      mountCalc();
    }
    const sc = runEl.querySelector('#il-scroll');
    if (sc) { sc.scrollTop = top; mathify(sc); }
    const focus = runEl.querySelector(RUN.leaving ? '[data-run="stay"]' : (!RUN.checked && RUN.qs[RUN.i].type === 'spr') ? '#il-spr' : RUN.checked ? '#il-main' : null);
    if (focus) focus.focus({ preventScroll: true });
  }

  function select(key) {
    if (!RUN || RUN.checked || RUN.result) return;
    if (!RUN.qs[RUN.i].choices.some(function (c) { return c.key === key; })) return;
    RUN.answer = key;
    paintRun(true);
  }

  function check() {
    if (!RUN || RUN.checked || RUN.result || !String(RUN.answer).trim()) return;
    if (RUN.boss) {
      RUN.remaining = RUN.deadline - Date.now();
      if (RUN.remaining <= 0) { finish('time'); return; }
    }
    const q = RUN.qs[RUN.i];
    const ok = Data.checkAnswer(q, RUN.answer);
    RUN.results[RUN.i] = { id: q.id, ok: ok, answer: RUN.answer };
    RUN.checked = true;
    RUN.combo = ok ? RUN.combo + 1 : 0;
    if (!ok && RUN.boss) RUN.lives--;
    // Общие ключи: статус вопроса, активность/стрик, очки лидерборда, очередь ошибок
    if (!DEMO) Data.progress.record(q.id, ok);
    paintRun(true);
    const sc = runEl && runEl.querySelector('#il-scroll');
    const verdict = sc && sc.querySelector('[role="status"]');
    if (verdict) verdict.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function advance() {
    if (!RUN || !RUN.checked || RUN.result) return;
    if (RUN.boss && RUN.lives <= 0) { finish('shields'); return; }
    if (RUN.i >= RUN.qs.length - 1) { finish('end'); return; }
    RUN.i++;
    RUN.answer = '';
    RUN.checked = false;
    if (RUN.boss) RUN.deadline = Date.now() + RUN.remaining;
    paintRun();
  }

  function finish(reason) {
    if (!RUN || RUN.result) return;
    clearInterval(timer);
    const T = TRACKS[RUN.track];
    const total = RUN.qs.length;
    const correct = RUN.results.filter(function (r) { return r && r.ok; }).length;
    const mistakes = RUN.results.filter(function (r) { return r && !r.ok; }).length;
    const pct = total ? Math.round(correct / total * 100) : 0;
    let passed, stars = 0;
    if (RUN.boss) {
      passed = reason === 'end' && mistakes < BOSS_LIVES;
      if (passed) stars = BOSS_LIVES - mistakes;
    } else {
      passed = pct >= T.pass;
      if (passed) stars = pct >= T.three ? 3 : pct >= T.two ? 2 : 1;
    }

    const before = findNode(RUN.track, RUN.key) || RUN.node;
    const firstClear = passed && !before.done;
    const newFlawless = stars === 3 && before.stars < 3;

    const store = readStore();
    const rec = store.nodes[RUN.key] || { done: 0, stars: 0, best: 0, tries: 0 };
    rec.tries = (rec.tries || 0) + 1;
    rec.best = Math.max(rec.best || 0, pct);
    if (passed) { rec.done = 1; rec.stars = Math.max(rec.stars || 0, stars); }
    store.nodes[RUN.key] = rec;
    writeStore(store);

    if (!DEMO) {
      if (firstClear) Data.stats.addPoints(RUN.node.def.bonus, RUN.boss ? 'island-boss' : 'island-clear');
      if (newFlawless) Data.stats.addPoints(FLAWLESS_BONUS, 'island-flawless');
    }

    let unlocked = null;
    if (firstClear) {
      const cur = trackState(RUN.track).current;
      if (cur) unlocked = cur;
      fresh = cur ? cur.key : null;
      OPEN = {};
    }

    RUN.leaving = false;
    RUN.result = {
      reason: reason, passed: passed, stars: stars, pct: pct, correct: correct, total: total,
      seconds: Math.round((Date.now() - RUN.started) / 1000),
      xp: Math.max(0, Data.stats.points().total - RUN.xpStart),
      unlocked: unlocked,
      missed: RUN.results.map(function (r, i) { return r && !r.ok ? { q: RUN.qs[i], answer: r.answer, n: i + 1 } : null; }).filter(Boolean)
    };
    try {
      window.dispatchEvent(new CustomEvent('sp:islands', { detail: { key: RUN.key, passed: passed, stars: stars, pct: pct, firstClear: firstClear } }));
    } catch (e) {}
    calcFrame = null;
    paintRun();
    paintMap();
    const btn = runEl && runEl.querySelector('[data-run="primary"]');
    if (btn) btn.focus();
  }

  function resultHtml() {
    const R = RUN.result, boss = RUN.boss;
    let title, sub;
    if (R.passed) {
      title = boss ? 'Island conquered' : 'Level cleared';
      sub = boss ? 'The checkpoint is yours.' : 'Nice work. The path moves forward.';
    } else if (R.reason === 'time') {
      title = 'Time is up'; sub = 'The boss held its ground. Review your misses and try again.';
    } else if (R.reason === 'shields') {
      title = 'Checkpoint not cleared'; sub = 'All three shields broke. Review your misses and try again.';
    } else {
      title = 'Almost there'; sub = 'You need ' + TRACKS[RUN.track].pass + '% to clear this level.';
    }
    let big = '';
    for (let i = 1; i <= 3; i++) {
      big += '<span class="il-award ' + (i <= R.stars ? 'il-star-on' : 'text-ink-mute') + (i === 2 ? ' -translate-y-2' : '') + '" style="animation-delay:' + (i * 0.16) + 's">' + icon('star', 'h-11 w-11') + '</span>';
    }
    const nextLabel = R.unlocked
      ? (R.unlocked.island.ti !== RUN.node.island.ti ? 'Sail to the next island' : 'Next level')
      : 'Back to map';
    const primary = R.passed
      ? '<button type="button" data-run="primary" data-act="' + (R.unlocked ? 'next' : 'map') + '" class="h-12 w-full rounded-full bg-accent text-[14px] font-semibold text-white hover:bg-accent-hover">' + nextLabel + '</button>'
      : '<button type="button" data-run="primary" data-act="retry" class="h-12 w-full rounded-full bg-accent text-[14px] font-semibold text-white hover:bg-accent-hover">Try again</button>';
    const secondary =
      '<div class="mt-2.5 flex flex-col gap-2.5 sm:flex-row">' +
        (R.passed && R.stars < 3 ? '<button type="button" data-run="retry" class="h-11 flex-1 rounded-full border text-[13px] font-medium hover:bg-raised">Replay for 3 stars</button>' : '') +
        (R.missed.length && Data.solverReady ? '<button type="button" data-run="solver" class="h-11 flex-1 rounded-full border text-[13px] font-medium hover:bg-raised">Redo mistakes in Solver</button>' : '') +
        (R.passed && !R.unlocked ? '' : '<button type="button" data-run="map" class="h-11 flex-1 rounded-full border text-[13px] font-medium hover:bg-raised">Back to map</button>') +
      '</div>';
    const missed = R.missed.length
      ? '<div class="mt-6"><h3 class="text-[11px] font-semibold uppercase tracking-widest text-ink-mute">Review your misses</h3><div class="mt-2.5 space-y-2">' +
        R.missed.map(function (m) {
          const q = m.q;
          const text = function (key) {
            let t = key;
            q.choices.forEach(function (c) { if (c.key === key) t = c.key + '. ' + c.text; });
            return t;
          };
          return '<details class="rounded-xl border bg-surface"><summary class="flex min-h-[48px] cursor-pointer items-center justify-between gap-3 px-3.5 text-[13.5px] font-medium">' +
              '<span class="num">Question ' + m.n + '</span><span class="text-ink-mute">' + icon('chevron') + '</span></summary>' +
            '<div class="space-y-3 border-t p-3.5 text-[13.5px] leading-relaxed">' +
              (q.passage ? '<div class="il-rich text-ink-soft">' + rich(q.passage) + '</div>' : '') +
              '<div class="il-rich">' + rich(q.prompt) + '</div>' +
              '<div class="il-rich rounded-lg bg-danger/10 px-3 py-2 text-danger">Your answer: ' + rich(q.type === 'mcq' ? text(m.answer) : esc(m.answer)) + '</div>' +
              '<div class="il-rich rounded-lg bg-success/10 px-3 py-2 text-success">Correct answer: ' + rich(q.type === 'mcq' ? text(q.correctAnswer) : q.acceptedAnswers.join(', ')) + '</div>' +
              (q.explanation ? '<div class="il-rich text-ink-soft">' + rich(q.explanation) + '</div>' : '') +
            '</div></details>';
        }).join('') + '</div></div>'
      : '';
    return '<div class="min-h-0 flex-1 overflow-y-auto px-4 py-8"><div class="il-fade mx-auto max-w-[520px]">' +
      '<div class="rounded-2xl border bg-surface p-5 text-center sm:p-7">' +
        '<div class="flex justify-center gap-2 pt-2" aria-label="' + R.stars + ' of 3 stars">' + big + '</div>' +
        '<h2 class="mt-4 text-[22px] font-semibold tracking-tight">' + title + '</h2>' +
        '<p class="mt-1 text-[13.5px] text-ink-soft">' + sub + '</p>' +
        '<div class="mt-5 grid grid-cols-3 gap-2">' +
          [['Score', R.correct + '/' + R.total], ['Time', mmss(R.seconds * 1000)], ['XP earned', '+' + R.xp]].map(function (x) {
            return '<div class="rounded-xl bg-raised p-3"><div class="num text-[17px] font-semibold">' + x[1] + '</div><div class="mt-0.5 text-[11.5px] text-ink-soft">' + x[0] + '</div></div>';
          }).join('') +
        '</div>' +
        '<div class="mt-6">' + primary + secondary + '</div>' +
      '</div>' + missed +
    '</div></div>';
  }

  function endRun() {
    unmountRun();
    RUN = null;
    calcFrame = null;
    lockScroll(false);
  }

  function backToMap() {
    const track = RUN ? RUN.track : TRACK;
    const ti = RUN ? RUN.node.island.ti : null;
    endRun();
    TRACK = track;
    paintMap();
    let target = ti;
    if (fresh) {
      const m = /^[a-z]+:(\d+):/.exec(fresh);
      if (m) target = +m[1];
    }
    if (target !== null) setTimeout(function () { scrollToIsland(target); }, 60);
  }

  // Промахи открываются в обычном Solver — там Desmos, заметки и разбор
  function openInSolver() {
    const ids = RUN.result.missed.map(function (m) { return m.q.id; });
    const title = 'Review: ' + RUN.node.island.title;
    const s = Data.startSession({ section: RUN.track });
    s.ids = ids;
    s.title = title;
    s.shuffled = false;
    try {
      sessionStorage.setItem('satpath_session_v1', JSON.stringify(s));
      sessionStorage.setItem('satpath_solver_idx_v1', JSON.stringify({ sid: s.id, idx: 0 }));
    } catch (e) {}
    const nav = VIEW.ctx.navigate;
    endRun();
    nav('solver');
  }

  function onRunClick(e) {
    const choice = e.target.closest('[data-choice]');
    if (choice) { select(choice.getAttribute('data-choice')); return; }
    const b = e.target.closest('[data-run]');
    if (!b || !RUN) return;
    let act = b.getAttribute('data-run');
    if (act === 'primary') act = b.getAttribute('data-act');
    if (act === 'main') { if (RUN.checked) advance(); else check(); }
    else if (act === 'exit') { RUN.leaving = true; paintRun(true); }
    else if (act === 'stay') { RUN.leaving = false; paintRun(true); }
    else if (act === 'leave' || act === 'map') backToMap();
    else if (act === 'calc') toggleCalc();
    else if (act === 'solver') openInSolver();
    else if (act === 'retry') {
      const n = findNode(RUN.track, RUN.key);
      endRun();
      startRun(n);
    } else if (act === 'next') {
      const next = RUN.result.unlocked;
      backToMap();
      if (next) setTimeout(function () {
        if (VIEW && VIEW.alive && !RUN) {
          const n = findNode(TRACK, next.key);
          if (n) openSheet(n);
        }
      }, 1500);                                // сначала видно, как открывается путь
    }
  }

  function onRunInput(e) {
    if (!RUN || RUN.checked || e.target.id !== 'il-spr') return;
    RUN.answer = e.target.value;
    const btn = runEl.querySelector('#il-main');
    if (btn) btn.disabled = !RUN.answer.trim();
  }

  function onKey(e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (sheetEl) {
      if (e.key === 'Escape') closeSheet();
      return;
    }
    if (!RUN || !runEl) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      if (RUN.result) backToMap();
      else { RUN.leaving = !RUN.leaving; paintRun(true); }
      return;
    }
    if (RUN.result || RUN.leaving) return;
    const typing = e.target && /^(INPUT|TEXTAREA)$/.test(e.target.tagName);
    if (e.key === 'Enter') {
      const el = e.target && e.target.closest ? e.target : null;
      const onChoice = !!(el && el.closest('[data-choice]'));
      // обычная кнопка (и вариант, пока ответ не выбран) сама обработает Enter
      if (el && el.closest('button, summary') && (!onChoice || !RUN.answer)) return;
      e.preventDefault();
      if (RUN.checked) advance(); else check();
      return;
    }
    if (typing) return;
    if (RUN.checked) {
      if (e.key === 'ArrowRight') advance();
      return;
    }
    const q = RUN.qs[RUN.i];
    if (q.type !== 'mcq') return;
    let idx = -1;
    if (/^[1-6]$/.test(e.key)) idx = +e.key - 1;
    else if (/^[a-fA-F]$/.test(e.key)) idx = e.key.toUpperCase().charCodeAt(0) - 65;
    if (idx >= 0 && q.choices[idx]) { e.preventDefault(); select(q.choices[idx].key); }
  }

  /* -------------------------------------------------------------------
     МАРШРУТ
     ------------------------------------------------------------------- */
  function render(root, ctx) {
    injectStyle();
    const view = { root: root, ctx: ctx, alive: true };
    VIEW = view;

    let want = ctx && ctx.params && ctx.params.get('track');
    if (!want) { try { want = sessionStorage.getItem(TRACK_KEY); } catch (e) {} }
    if (TRACKS[want]) TRACK = want;

    root.innerHTML =
      '<div class="mx-auto w-full max-w-[1040px]">' +
        '<div class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">' +
          '<div><h1 class="text-[22px] font-semibold tracking-tight sm:text-[26px]">Learning Path</h1>' +
          '<p class="mt-1 text-[13.5px] text-ink-soft">Clear each level, beat the checkpoint, and open the next island.</p></div>' +
          '<div class="flex rounded-full border bg-surface p-1" role="tablist" aria-label="Track">' +
            ['math', 'rw'].map(function (k) {
              return '<button type="button" role="tab" data-track="' + k + '" class="h-11 flex-1 whitespace-nowrap rounded-full px-4 text-[13px] font-medium text-ink-soft sm:flex-none">' + TRACKS[k].label + '</button>';
            }).join('') +
          '</div>' +
        '</div>' +
        '<div id="il-body"><div class="h-64 animate-pulse rounded-2xl border bg-surface"></div></div>' +
      '</div>';

    const wrap = root.firstChild;
    const clickGate = function (e) { if (CATALOG) onMapClick(e); };
    wrap.addEventListener('click', clickGate);
    document.addEventListener('keydown', onKey);

    const onStorage = function (e) {
      if (CATALOG && (!e.key || e.key === KEY || e.key === LEGACY.math || e.key === LEGACY.rw)) paintMap();
    };
    window.addEventListener('storage', onStorage);

    const ready = function () {
      if (!view.alive) return;
      try {
        if (!CATALOG || (!CATALOG.math.length && !CATALOG.rw.length)) CATALOG = buildCatalog();
      } catch (e) {
        console.error('[islands] catalog failed', e);
        CATALOG = { math: [], rw: [] };
      }
      paintMap();
      if (RUN) mountRun();
    };
    Promise.resolve(Data.load()).then(ready, ready);

    return function () {
      view.alive = false;
      closeSheet();
      unmountRun();            // сам RUN сохраняется: вернувшись на экран, можно продолжить
      calcFrame = null;
      lockScroll(false);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('storage', onStorage);
      wrap.removeEventListener('click', clickGate);
    };
  }

  Shell.register('islands', { title: 'Learning Path', group: 'Prep', render: render });
})();
