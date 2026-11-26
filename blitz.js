/* =====================================================================
   SATPath — Math Blitz (blitz.js)
   ---------------------------------------------------------------------
   Экран  #/blitz.  Подключать ПОСЛЕ shell.js и dataAdapter.js.

   Режимы:
     Time Attack  2:00 / 3:00. Ошибка = −5 сек. Быстрый верный ответ
                  при серии от 2 = +3 сек. Часы стоят во время проверки.
     3 Lives      Таймер на каждый вопрос (60 / 45 / 30 сек).
                  Ошибка или тайм-аут = минус жизнь.

   Фишки:
     Combo Heat      каждые 3 верных подряд поднимают множитель (до ×4),
                     а в режиме Adaptive и сложность задач
     Perks           50:50 и Skip (комбо сохраняется), по одному на раунд
     Mistake Replay  разбор проваленных задач на экране результатов

   Горячие клавиши (работают и на русской раскладке):
     A–D / 1–4 ответ · Enter отправить / дальше · F 50:50 · S skip · Esc пауза

   Данные:
     SPData.query / getQuestion / checkAnswer / progress.record
     Каждый ответ уходит в sp:progress (My Metrics, Saved & Errors).
     XP: SPData.stats.addPoints(), если он есть в dataAdapter.js.
         Иначе файл добавляет SPData.xp (ключ satpath_xp_v1).
     Статистика блица: satpath_blitz_math_v1

   Точка интеграции Firebase:
     window.addEventListener('sp:blitz-complete', e => ...)
   ===================================================================== */
(function () {
  'use strict';

  const Shell = window.SPShell;
  const Data = window.SPData;
  if (!Shell || !Data) {
    console.error('[blitz] Подключите shell.js и dataAdapter.js ДО этого файла.');
    return;
  }

  /* -------------------------------------------------------------------
     1. КОНСТАНТЫ
     ------------------------------------------------------------------- */
  const DEMO = /[?&]demo=1(&|$)/.test(location.search);
  const K_STATS = 'satpath_blitz_math_v1';
  const K_XP = 'satpath_xp_v1';

  const LIVES = 3;
  const PENALTY = 5;          // Time Attack: секунды за ошибку
  const BONUS = 3;            // Time Attack: секунды за быстрый ответ
  const PER_LEVEL = 3;        // верных подряд на один уровень Heat
  const BASE_POINTS = { easy: 100, medium: 150, hard: 220 };
  const XP_PER = { easy: 5, medium: 8, hard: 12 };
  const FAST_SEC = { easy: 15, medium: 25, hard: 35 };
  const HEAT_DIFF = ['easy', 'medium', 'hard', 'hard'];
  const FALLBACK = {
    easy: ['easy', 'medium', 'hard'],
    medium: ['medium', 'easy', 'hard'],
    hard: ['hard', 'medium', 'easy']
  };
  const DIFF_BADGE = {
    easy: ['Easy', 'bg-success/10 text-success'],
    medium: ['Medium', 'bg-hl/15 text-hl'],
    hard: ['Hard', 'bg-danger/10 text-danger']
  };
  const OPTIONS = {
    mode: [['sprint', 'Time Attack'], ['lives', '3 Lives']],
    dur: [[120, '2:00'], [180, '3:00']],
    pace: [[60, 'Relaxed 60s/q'], [45, 'Standard 45s/q'], [30, 'Insane 30s/q']],
    diff: [['adaptive', 'Adaptive'], ['easy', 'Easy'], ['medium', 'Medium'], ['hard', 'Hard']],
    grid: [['no', 'Multiple choice only'], ['yes', 'Include grid-ins']]
  };
  const DEF_PREFS = { mode: 'sprint', dur: 120, pace: 45, diff: 'adaptive', grid: 'no' };

  /* -------------------------------------------------------------------
     2. УТИЛИТЫ
     ------------------------------------------------------------------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  // Текст вопросов — HTML вашего формата: <f>a/b</f> = дробь, \n = перенос
  function rich(s) {
    let t = String(s == null ? '' : s);
    t = t.replace(/<f>\s*([^<]*?)\s*\/\s*([^<]*?)\s*<\/f>/g, function (_, a, b) {
      return '<span class="bz-frac"><span>' + a + '</span><span>' + b + '</span></span>';
    });
    if (!/<(p|br|div|ul|ol|li|table|h\d|svg)\b/i.test(t)) t = t.replace(/\r?\n/g, '<br>');
    return t;
  }
  function renderMath(el) {
    if (!window.renderMathInElement) return;
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
  const fmt = function (n) { return Number(n || 0).toLocaleString('en-US'); };
  const pad = function (n) { return n < 10 ? '0' + n : '' + n; };
  function clock(sec) {
    const s = Math.max(0, Math.ceil(sec));
    return Math.floor(s / 60) + ':' + pad(s % 60);
  }
  function shuffle(list) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  const familyOf = function (id) { return String(id).replace(/^((?:m|rg):\d+:\d+):\d+$/, '$1'); };
  const reducedMotion = function () { return !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches); };

  // SVG-иконки встроены в файл: они не перерисовываются и не мигают во время раунда
  const PATHS = {
    zap: '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
    heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.500 5.500 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
    pause: '<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>',
    play: '<polygon points="6 3 20 12 6 21 6 3"/>',
    skip: '<polygon points="5 4 15 12 5 20 5 4"/><line x1="19" x2="19" y1="5" y2="19"/>',
    split: '<circle cx="12" cy="12" r="9"/><path d="M12 3v18"/><path d="m5.6 5.6 6.4 6.4"/><path d="M3 12h9"/>',
    flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    trophy: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
    chevron: '<path d="m6 9 6 6 6-6"/>',
    arrow: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    rotate: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
    book: '<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>'
  };
  function icon(name, cls, filled) {
    return '<svg viewBox="0 0 24 24" fill="' + (filled ? 'currentColor' : 'none') + '" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="shrink-0 ' + (cls || 'h-4 w-4') + '">' + PATHS[name] + '</svg>';
  }

  /* -------------------------------------------------------------------
     3. ХРАНИЛИЩЕ И XP
     ------------------------------------------------------------------- */
  const mem = {};
  function jget(k, fallback) {
    let raw = null;
    try { raw = localStorage.getItem(k); } catch (e) {}
    if (raw === null && Object.prototype.hasOwnProperty.call(mem, k)) raw = mem[k];
    try {
      const v = raw ? JSON.parse(raw) : null;
      return v && typeof v === 'object' ? v : fallback;
    } catch (e) { return fallback; }
  }
  function jset(k, v) {
    mem[k] = JSON.stringify(v);
    if (DEMO) return;
    try { localStorage.setItem(k, mem[k]); } catch (e) {}
  }

  function readStats() {
    const s = jget(K_STATS, {});
    return {
      prefs: Object.assign({}, DEF_PREFS, s.prefs || {}),
      best: s.best && typeof s.best === 'object' ? s.best : {},
      sessions: +s.sessions || 0,
      bestStreak: +s.bestStreak || 0,
      bestAcc: +s.bestAcc || 0,
      sumOk: +s.sumOk || 0,
      sumAns: +s.sumAns || 0
    };
  }
  const writeStats = function (s) { jset(K_STATS, s); };
  function bestKey(p) {
    return p.mode + ':' + (p.mode === 'sprint' ? p.dur : p.pace) + ':' + p.diff + (p.grid === 'yes' ? ':grid' : '');
  }

  // Запасной XP-слой в SPData. Существующие SPData.stats и SPData.xp не перезаписываются.
  if (!Data.xp) {
    Data.xp = {
      get: function () {
        const v = jget(K_XP, {});
        return { total: +v.total || 0, log: Array.isArray(v.log) ? v.log : [] };
      },
      total: function () { return Data.xp.get().total; },
      add: function (amount, why) {
        const n = Math.max(0, Math.round(+amount || 0));
        if (!n) return 0;
        const v = Data.xp.get();
        v.total += n;
        v.log.push({ n: n, why: String(why || ''), t: Date.now() });
        v.log = v.log.slice(-100);
        jset(K_XP, v);
        try { window.dispatchEvent(new CustomEvent('sp:xp', { detail: { amount: n, total: v.total, why: why } })); } catch (e) {}
        return n;
      }
    };
  }
  function awardXP(amount) {
    if (DEMO || !amount) return 0;
    try {
      if (Data.stats && typeof Data.stats.addPoints === 'function') {
        const r = Data.stats.addPoints(amount, 'blitz');
        return typeof r === 'number' ? r : amount;
      }
      if (Data.xp && typeof Data.xp.add === 'function') return Data.xp.add(amount, 'blitz');
    } catch (e) { console.error('[blitz] XP', e); }
    return 0;
  }

  /* -------------------------------------------------------------------
     4. ОЧЕРЕДЬ ЗАДАЧ (только Math, перемешанные)
     ------------------------------------------------------------------- */
  function makeDeck(allowGrid) {
    const queues = {};
    const seen = {};
    let lastFamily = '';
    function refill(d) {
      queues[d] = shuffle(Data.query({ section: 'math', difficulty: d, status: 'all' }));
    }
    function usable(q) {
      if (!q || q.section !== 'math' || !String(q.prompt || '').trim()) return false;
      if (q.type === 'mcq') return !!(q.choices && q.choices.length >= 2 && q.correctAnswer);
      return allowGrid && !!String(q.correctAnswer || '').trim();
    }
    // repeat = false: только генераторы, которых ещё не было в этом раунде
    function drawFrom(d, repeat) {
      if (!queues[d] || (repeat && !queues[d].length)) refill(d);
      const list = queues[d];
      let i = 0;
      while (i < list.length) {
        const id = list[i], fam = familyOf(id);
        if ((!repeat && seen[fam]) || (repeat && fam === lastFamily && list.length > 1)) { i++; continue; }
        list.splice(i, 1);
        let q = null;
        try { q = Data.getQuestion(id); } catch (e) {}
        if (usable(q)) { seen[fam] = 1; lastFamily = fam; return q; }
      }
      return null;
    }
    return {
      // Сначала держим нужную сложность (с новыми числами), и только потом берём соседнюю
      draw: function (want) {
        const order = FALLBACK[want] || FALLBACK.medium;
        for (let i = 0; i < order.length; i++) {
          const q = drawFrom(order[i], false) || drawFrom(order[i], true);
          if (q) return q;
        }
        return null;
      }
    };
  }

  /* -------------------------------------------------------------------
     5. СТИЛИ
     ------------------------------------------------------------------- */
  const CSS =
    '.bz-frac{display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;margin:0 2px;line-height:1.15;font-size:.92em}' +
    '.bz-frac>span:first-child{padding:0 3px;border-bottom:1.5px solid currentColor}.bz-frac>span:last-child{padding:0 3px}' +
    '.bz-prose{overflow-wrap:anywhere}.bz-prose img,.bz-prose svg{max-width:100%;height:auto}' +
    '.bz-prose table{border-collapse:collapse;margin:10px auto}.bz-prose td,.bz-prose th{border:1px solid rgba(138,143,152,.4);padding:4px 10px;text-align:center}' +
    '.bz-prose .katex-display{overflow-x:auto;overflow-y:hidden}' +
    '.bz-in{animation:bzIn .2s cubic-bezier(.2,.7,.2,1) both}@keyframes bzIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}' +
    '.bz-pop{animation:bzPop .36s cubic-bezier(.3,1.5,.5,1)}@keyframes bzPop{0%{transform:scale(1)}45%{transform:scale(1.14)}100%{transform:scale(1)}}' +
    '.bz-float{animation:bzFloat 1s ease both}@keyframes bzFloat{0%{opacity:0;transform:translateY(8px)}18%{opacity:1;transform:none}75%{opacity:1}100%{opacity:0;transform:translateY(-22px)}}' +
    '.bz-count{animation:bzCount .55s ease both}@keyframes bzCount{from{opacity:0;transform:scale(.7)}to{opacity:1;transform:none}}' +
    '.bz-fill{transform-origin:0 50%;will-change:transform;background:rgb(var(--c-accent));transition:background-color .35s ease}' +
    '.bz-fill[data-tone="warn"]{background:rgb(var(--c-hl))}.bz-fill[data-tone="low"]{background:#EF4444}' +
    '.bz-choice{border:1px solid var(--c-hairline);background:rgb(var(--c-surface));transition:background-color .14s ease,border-color .14s ease,opacity .2s ease,transform .1s ease}' +
    'button.bz-choice:not(:disabled):active{transform:scale(.985)}' +
    '@media (hover:hover){button.bz-choice:not(:disabled):hover{background:rgb(var(--c-raised));border-color:rgb(var(--c-accent)/.5)}}' +
    '#bzPause[hidden]{display:none!important}' +
    '.bz-letter{border:1px solid var(--c-hairline);color:rgb(var(--c-ink-soft))}' +
    '.bz-choice[data-s="ok"]{border-color:#10B981;background:rgba(16,185,129,.12)}.bz-choice[data-s="ok"] .bz-letter{background:#10B981;border-color:#10B981;color:#fff}' +
    '.bz-choice[data-s="bad"]{border-color:#EF4444;background:rgba(239,68,68,.12)}.bz-choice[data-s="bad"] .bz-letter{background:#EF4444;border-color:#EF4444;color:#fff}' +
    '.bz-choice[data-s="dim"]{opacity:.4}.bz-choice[data-s="cut"]{opacity:.18;text-decoration:line-through}' +
    '.bz-pip{height:6px;width:22px;border-radius:99px;background:rgb(var(--c-raised));transition:background-color .25s ease}' +
    '.bz-pip[data-on="1"]{background:rgb(var(--c-accent))}.bz-hot .bz-pip[data-on="1"]{background:rgb(var(--c-hl))}' +
    '.bz-heart{color:#EF4444;transition:opacity .3s ease,transform .3s ease}.bz-heart[data-on="0"]{color:rgb(var(--c-ink-mute));opacity:.35;transform:scale(.82)}' +
    '@media (prefers-reduced-motion:reduce){.bz-in,.bz-pop,.bz-count{animation:none!important}.bz-float{animation-duration:1s;transform:none}}';

  function injectStyle() {
    if (document.getElementById('bzStyle')) return;
    const s = document.createElement('style');
    s.id = 'bzStyle';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* -------------------------------------------------------------------
     6. ЭКРАН
     ------------------------------------------------------------------- */
  function view(root, ctx) {
    injectStyle();

    let alive = true;
    let screen = 'setup';          // 'setup' | 'play' | 'results'
    let ready = false, mathCount = 0;
    let G = null;                  // состояние раунда
    let overlay = null, raf = 0, prevOverflow = '', resultsAt = 0;
    let R = null;                  // итоги последнего раунда
    const prefs = readStats().prefs;

    root.innerHTML = '<div id="bzPage"></div>';
    const page = root.querySelector('#bzPage');

    /* ===============================================================
       SETUP
       =============================================================== */
    function pillRow(label, key) {
      return '<div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between md:gap-4">' +
        '<div class="text-[12px] font-semibold uppercase tracking-[0.08em] text-ink-mute">' + label + '</div>' +
        '<div class="flex flex-wrap gap-1.5 md:justify-end" role="group" aria-label="' + label + '">' +
        OPTIONS[key].map(function (o) {
          const on = String(prefs[key]) === String(o[0]);
          return '<button type="button" data-a="opt" data-k="' + key + '" data-v="' + o[0] + '" aria-pressed="' + on + '" class="h-11 rounded-full border px-4 text-[13px] font-medium transition-colors sm:h-9 ' +
            (on ? 'border-accent bg-accent/15 text-accent' : 'text-ink-soft hover:bg-raised hover:text-ink') + '">' + o[1] + '</button>';
        }).join('') + '</div></div>';
    }

    function statCard(label, value) {
      return '<div class="card p-4"><div class="text-[11.5px] text-ink-mute">' + label + '</div>' +
        '<div class="num mt-1.5 text-[26px] font-semibold leading-none tracking-tight">' + value + '</div></div>';
    }

    function paintSetup(animate, focusSel) {
      screen = 'setup';
      const s = readStats();
      const best = s.best[bestKey(prefs)] || 0;
      const sprint = prefs.mode === 'sprint';
      const rise = animate ? 'rise' : '';
      const summary = sprint
        ? clock(prefs.dur) + ' on the clock · as many questions as you can'
        : '3 lives · ' + prefs.pace + ' seconds per question';
      const rules = sprint
        ? 'A wrong answer costs ' + PENALTY + ' seconds. A quick correct answer in a streak adds ' + BONUS + '.'
        : 'A wrong answer or a timeout costs one life.';
      const startLabel = !ready ? 'Loading math questions…' : !mathCount ? 'No math questions found' : 'Start Blitz';

      const features = [
        ['flame', 'Combo Heat', 'Every ' + PER_LEVEL + ' correct answers in a row raise your multiplier, up to ×4. In Adaptive mode, questions get harder too.'],
        ['split', 'Two perks per round', '50:50 removes two wrong choices. Skip moves on and keeps your combo.'],
        ['rotate', 'Mistake Replay', 'After the round, open any missed question to see the correct answer and the solution.']
      ].map(function (f) {
        return '<div class="card p-4"><span class="grid h-9 w-9 place-items-center rounded-lg bg-raised text-accent">' + icon(f[0], 'h-[18px] w-[18px]') + '</span>' +
          '<h3 class="mt-3 text-[13.5px] font-semibold">' + f[1] + '</h3><p class="mt-1 text-[12.5px] leading-relaxed text-ink-soft">' + f[2] + '</p></div>';
      }).join('');

      page.innerHTML =
        '<div class="mx-auto w-full max-w-[860px] space-y-4 px-4 py-6 md:px-8 md:py-10">' +
          '<div class="' + rise + '"><h1 class="text-[26px] font-semibold tracking-tight md:text-[30px]">Math Blitz</h1>' +
          '<p class="mt-1.5 text-[14px] text-ink-soft">Short, fast rounds that build speed and accuracy on SAT Math.</p></div>' +

          '<div class="' + rise + ' grid grid-cols-2 gap-3 md:grid-cols-4">' +
            statCard('Best streak', fmt(s.bestStreak)) +
            statCard('Sessions played', fmt(s.sessions)) +
            statCard('Best accuracy', s.bestAcc ? s.bestAcc + '%' : '—') +
            statCard('Avg accuracy', s.sumAns ? Math.round(s.sumOk / s.sumAns * 100) + '%' : '—') +
          '</div>' +

          '<section class="card ' + rise + ' p-5 md:p-7">' +
            '<div class="flex flex-col items-center text-center">' +
              '<button type="button" data-a="start" ' + (ready && mathCount ? '' : 'disabled ') + 'class="inline-flex h-14 w-full max-w-[320px] items-center justify-center gap-2.5 rounded-full bg-accent px-8 text-[16px] font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50">' + icon('zap', 'h-5 w-5', true) + startLabel + '</button>' +
              '<p class="mt-3 text-[13.5px] font-medium">' + summary + '</p>' +
              '<p class="mt-1 text-[12.5px] text-ink-soft">' + rules + '</p>' +
              '<p class="mt-3 inline-flex items-center gap-1.5 rounded-full bg-raised px-3 py-1.5 text-[12px] text-ink-soft">' + icon('trophy', 'h-3.5 w-3.5 text-hl') + 'Personal best for this setup <b class="num text-ink">' + (best ? fmt(best) : '—') + '</b></p>' +
              (ready && !mathCount ? '<p class="mt-3 max-w-[440px] text-[12.5px] text-danger">Check that math-questions.js and theory.js are next to the page.</p>' : '') +
            '</div>' +
            '<div class="mt-6 space-y-4 border-t pt-5">' +
              pillRow('Mode', 'mode') +
              (sprint ? pillRow('Duration', 'dur') : pillRow('Pace', 'pace')) +
              pillRow('Difficulty', 'diff') +
              pillRow('Answer format', 'grid') +
            '</div>' +
          '</section>' +

          '<div class="' + rise + ' grid grid-cols-1 gap-3 md:grid-cols-3">' + features + '</div>' +
          '<p class="hidden text-center text-[12px] text-ink-mute md:block">' + kbd('A–D') + ' ' + kbd('1–4') + ' answer · ' + kbd('Enter') + ' start or continue · ' + kbd('F') + ' 50:50 · ' + kbd('S') + ' skip · ' + kbd('Esc') + ' pause</p>' +
        '</div>';

      if (focusSel) {
        const f = page.querySelector(focusSel);
        if (f) { try { f.focus({ preventScroll: true }); } catch (e) {} }
      }
    }
    function kbd(t) { return '<kbd class="num rounded-md border bg-raised px-1.5 py-0.5 text-[11px] text-ink-soft">' + t + '</kbd>'; }

    /* ===============================================================
       PLAY: каркас
       =============================================================== */
    const el = function (id) { return overlay ? overlay.querySelector('#' + id) : null; };

    function startRound() {
      if (!ready || !mathCount) return;
      removeOverlay();
      const cfg = Object.assign({}, prefs, { dur: +prefs.dur, pace: +prefs.pace });
      const s = readStats();
      s.prefs = Object.assign({}, cfg);
      writeStats(s);

      G = {
        cfg: cfg, sprint: cfg.mode === 'sprint',
        deck: makeDeck(cfg.grid === 'yes'),
        phase: 'count', paused: false,
        count: 1.8, countShown: 0,
        left: cfg.dur, qLeft: cfg.pace, shown: 1,
        lives: LIVES, score: 0, streak: 0, maxStreak: 0, fast: 0,
        perks: { half: 1, skip: 1 },
        q: null, n: 0, cut: {}, elapsed: 0, fbLeft: 0, fbAge: 0,
        log: [], last: performance.now(), clockText: ''
      };
      screen = 'play';
      buildOverlay();
      raf = requestAnimationFrame(frame);
    }

    function buildOverlay() {
      overlay = document.createElement('div');
      overlay.className = 'fixed inset-0 z-[65] flex flex-col bg-canvas text-ink';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      overlay.setAttribute('aria-label', 'Math Blitz round');

      const iconBtn = 'grid h-11 w-11 place-items-center rounded-lg text-ink-soft transition-colors hover:bg-raised hover:text-ink';
      const perkBtn = 'inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border bg-surface px-4 text-[13.5px] font-semibold transition-colors hover:bg-raised disabled:pointer-events-none disabled:opacity-35 sm:flex-none';

      overlay.innerHTML =
        '<header class="shrink-0 border-b bg-surface">' +
          '<div class="mx-auto grid h-16 w-full max-w-[860px] grid-cols-[1fr_auto_1fr] items-center gap-2 px-3 md:px-6">' +
            '<div class="flex items-center gap-2"><button type="button" data-a="pause" class="' + iconBtn + '" aria-label="Pause round">' + icon('pause', 'h-[18px] w-[18px]') + '</button>' +
              '<span class="hidden text-[13px] font-semibold sm:inline">' + (G.sprint ? 'Time Attack' : '3 Lives') + '</span></div>' +
            '<div class="flex items-center justify-center gap-3">' +
              (G.sprint ? '' : '<div id="bzHearts" class="flex gap-1" role="img"></div>') +
              '<span id="bzClock" class="num min-w-[58px] text-center text-[24px] font-semibold tabular-nums" role="timer"></span>' +
            '</div>' +
            '<div class="text-right"><div class="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-ink-mute">Score</div><div id="bzScore" class="num text-[19px] font-semibold leading-tight">0</div></div>' +
          '</div>' +
          '<div class="h-1.5 w-full bg-raised"><div id="bzFill" class="bz-fill h-full w-full"></div></div>' +
        '</header>' +
        '<div id="bzHeat" class="mx-auto flex w-full max-w-[860px] shrink-0 items-center gap-3 px-4 pt-3 md:px-6">' +
          '<span id="bzMult" class="num inline-flex h-8 items-center gap-1.5 rounded-full bg-raised px-3 text-[13.5px] font-semibold"></span>' +
          '<span class="flex gap-1.5" aria-hidden="true"><i class="bz-pip"></i><i class="bz-pip"></i><i class="bz-pip"></i></span>' +
          '<span id="bzStreak" class="min-w-0 truncate text-[12.5px] text-ink-soft"></span>' +
        '</div>' +
        '<div class="relative flex min-h-0 flex-1 flex-col">' +
          '<div id="bzFx" class="pointer-events-none absolute inset-x-0 top-1 z-10 mx-auto flex max-w-[860px] justify-end gap-2 px-4 md:px-6" aria-hidden="true"></div>' +
          '<main id="bzMain" class="min-h-0 flex-1 overflow-y-auto"><div id="bzStage" class="mx-auto w-full max-w-[760px] px-4 py-5 md:px-6 md:py-8"></div></main>' +
        '</div>' +
        '<footer id="bzFoot" class="shrink-0 border-t bg-surface px-3 pt-2.5" style="padding-bottom:calc(10px + env(safe-area-inset-bottom,0px))">' +
          '<div class="mx-auto flex w-full max-w-[760px] items-center gap-2.5">' +
            '<button type="button" id="bzHalf" data-a="half" class="' + perkBtn + '">' + icon('split') + '50:50 <span class="hidden sm:inline">' + kbd('F') + '</span></button>' +
            '<button type="button" id="bzSkip" data-a="skip" class="' + perkBtn + '">' + icon('skip') + 'Skip <span class="hidden sm:inline">' + kbd('S') + '</span></button>' +
            '<span class="ml-auto hidden text-[12px] text-ink-mute md:block">Esc to pause</span>' +
          '</div>' +
        '</footer>' +
        '<div id="bzPause" class="absolute inset-0 z-20 grid place-items-center bg-canvas p-6" hidden></div>' +
        '<div id="bzLive" class="sr-only" aria-live="polite"></div>';

      overlay.addEventListener('click', onClick);
      document.body.appendChild(overlay);
      prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
      paintHud();
      paintClock();
      paintPerks();
    }

    function removeOverlay() {
      cancelAnimationFrame(raf);
      if (!overlay) return;
      overlay.removeEventListener('click', onClick);
      overlay.remove();
      overlay = null;
      document.body.style.overflow = prevOverflow;
    }

    /* ---------- HUD: обновляется точечно, без перерисовки всего экрана ---------- */
    const heatLevel = function () { return Math.min(3, Math.floor(G.streak / PER_LEVEL)); };

    function paintHud() {
      if (!overlay) return;
      const lvl = heatLevel();
      el('bzScore').textContent = fmt(G.score);
      const mult = el('bzMult');
      mult.innerHTML = icon('flame', 'h-4 w-4') + '×' + (lvl + 1);
      mult.className = 'num inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[13.5px] font-semibold ' +
        (lvl >= 2 ? 'bg-hl/15 text-hl' : lvl === 1 ? 'bg-accent/15 text-accent' : 'bg-raised text-ink-soft');
      el('bzHeat').classList.toggle('bz-hot', lvl >= 2);
      const filled = lvl >= 3 ? PER_LEVEL : G.streak % PER_LEVEL;
      overlay.querySelectorAll('.bz-pip').forEach(function (p, i) { p.setAttribute('data-on', i < filled ? '1' : '0'); });
      el('bzStreak').textContent = lvl >= 3
        ? G.streak + ' in a row · max heat'
        : (G.streak ? G.streak + ' in a row · ' : '') + (PER_LEVEL - filled) + ' more for ×' + (lvl + 2);

      const hearts = el('bzHearts');
      if (hearts) {
        if (!hearts.children.length) {
          let h = '';
          for (let i = 0; i < LIVES; i++) h += '<span class="bz-heart" data-on="1">' + icon('heart', 'h-5 w-5', true) + '</span>';
          hearts.innerHTML = h;
        }
        Array.prototype.forEach.call(hearts.children, function (c, i) { c.setAttribute('data-on', i < G.lives ? '1' : '0'); });
        hearts.setAttribute('aria-label', G.lives + ' of ' + LIVES + ' lives left');
      }
    }

    function paintClock() {
      const c = el('bzClock');
      if (!c) return;
      const v = G.sprint ? G.left : G.qLeft;
      const text = G.sprint ? clock(v) : String(Math.max(0, Math.ceil(v)));
      if (text !== G.clockText) {
        G.clockText = text;
        c.textContent = text;
        c.classList.toggle('text-danger', v <= (G.sprint ? 15 : 8));
      }
    }

    function paintBar(dt) {
      const fill = el('bzFill');
      if (!fill) return;
      const target = Math.max(0, Math.min(1, G.sprint ? G.left / G.cfg.dur : G.qLeft / G.cfg.pace));
      // мягкое догоняние: +3 сек и −5 сек выглядят плавно, а не прыжком
      G.shown += (target - G.shown) * Math.min(1, dt * 12);
      if (Math.abs(target - G.shown) < 0.0005) G.shown = target;
      fill.style.transform = 'scaleX(' + G.shown.toFixed(4) + ')';
      const tone = target <= 0.12 ? 'low' : target <= 0.3 ? 'warn' : '';
      if (fill.getAttribute('data-tone') !== tone) fill.setAttribute('data-tone', tone);
    }

    function paintPerks() {
      const h = el('bzHalf'), s = el('bzSkip');
      if (!h || !s) return;
      const live = G.phase === 'live';
      h.disabled = !(live && G.perks.half && G.q && G.q.type === 'mcq' && G.q.choices.length >= 3);
      s.disabled = !(live && G.perks.skip);
    }

    function floatChip(text, cls) {
      const box = el('bzFx');
      if (!box) return;
      const c = document.createElement('span');
      c.className = 'bz-float num rounded-full border bg-raised px-3 py-1 text-[13px] font-semibold shadow-lg ' + cls;
      c.textContent = text;
      c.addEventListener('animationend', function () { c.remove(); });
      box.appendChild(c);
    }

    const announce = function (t) { const l = el('bzLive'); if (l) l.textContent = t; };

    /* ===============================================================
       PLAY: игровой цикл
       =============================================================== */
    function frame(now) {
      if (!alive || !G || G.phase === 'done') return;
      const dt = Math.max(0, Math.min(0.5, (now - G.last) / 1000));
      G.last = now;

      if (!G.paused) {
        if (G.phase === 'count') {
          G.count -= dt;
          const n = Math.max(1, Math.ceil(G.count / 0.6));
          if (G.count <= 0) nextQuestion();
          else if (n !== G.countShown) {
            G.countShown = n;
            el('bzStage').innerHTML = '<div class="grid min-h-[46vh] place-items-center text-center"><div><div class="bz-count num text-[96px] font-semibold leading-none text-accent">' + n + '</div><p class="mt-4 text-[14px] text-ink-soft">Get ready</p></div></div>';
          }
        } else if (G.phase === 'live') {
          G.elapsed += dt;
          if (G.sprint) {
            G.left -= dt;
            if (G.left <= 0) { G.left = 0; paintClock(); finish(); return; }
          } else {
            G.qLeft -= dt;
            if (G.qLeft <= 0) { G.qLeft = 0; resolve(null, true); }
          }
        } else if (G.phase === 'feedback') {
          G.fbAge += dt;
          G.fbLeft -= dt;
          if (G.fbLeft <= 0) advance();
        }
        if (!G || G.phase === 'done') return;
        paintClock();
        paintBar(dt);
      }
      raf = requestAnimationFrame(frame);
    }

    function nextQuestion() {
      const want = G.cfg.diff === 'adaptive' ? HEAT_DIFF[heatLevel()] : G.cfg.diff;
      const q = G.deck.draw(want);
      if (!q) { finish(); return; }
      G.q = q;
      G.n++;
      G.cut = {};
      G.elapsed = 0;
      G.qLeft = G.cfg.pace;
      if (!G.sprint) G.shown = 1;
      G.phase = 'live';
      paintQuestion();
      paintPerks();
    }

    function paintQuestion() {
      const q = G.q;
      const badge = DIFF_BADGE[q.difficulty] || DIFF_BADGE.medium;
      let answers;
      if (q.type === 'mcq') {
        answers = '<div class="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2" role="group" aria-label="Answer choices">' +
          q.choices.map(function (c) {
            return '<button type="button" data-a="pick" data-v="' + esc(c.key) + '" class="bz-choice flex min-h-[58px] items-center gap-3 rounded-xl px-4 py-3 text-left">' +
              '<span class="bz-letter num grid h-7 w-7 shrink-0 place-items-center rounded-full text-[12.5px] font-semibold">' + esc(c.key) + '</span>' +
              '<span class="bz-prose min-w-0 flex-1 text-[15.5px] leading-snug">' + rich(c.text) + '</span></button>';
          }).join('') + '</div>';
      } else {
        answers = '<div class="mt-5"><label for="bzInput" class="mb-2 block text-[11.5px] font-semibold uppercase tracking-[0.08em] text-ink-mute">Enter your answer</label>' +
          '<div class="flex max-w-[420px] gap-2.5"><input id="bzInput" type="text" inputmode="text" autocomplete="off" autocapitalize="off" spellcheck="false" maxlength="12" placeholder="e.g. 3/4" class="num h-12 min-w-0 flex-1 rounded-xl border bg-surface px-4 text-[17px] outline-none focus:border-accent disabled:opacity-60">' +
          '<button type="button" data-a="submit" class="h-12 shrink-0 rounded-xl bg-accent px-5 text-[14px] font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-40">Submit</button></div></div>';
      }

      const stage = el('bzStage');
      stage.innerHTML =
        '<div class="bz-in">' +
          '<div class="mb-3 flex items-center gap-2">' +
            '<span class="num grid h-7 min-w-[28px] place-items-center rounded-full bg-raised px-2 text-[12.5px] font-semibold">' + G.n + '</span>' +
            '<span class="min-w-0 truncate text-[12.5px] text-ink-soft">' + esc(q.skill || q.domain || 'Math') + '</span>' +
            '<span class="inline-flex h-5 shrink-0 items-center rounded-full px-2 text-[11px] font-semibold ' + badge[1] + '">' + badge[0] + '</span>' +
          '</div>' +
          '<div class="card p-5 md:p-6"><div class="bz-prose text-[17px] leading-relaxed">' + rich(q.prompt) + '</div></div>' +
          answers +
          '<div id="bzFeedback" class="mt-4 min-h-[56px]"></div>' +
        '</div>';
      renderMath(stage);
      el('bzMain').scrollTop = 0;

      const input = el('bzInput');
      if (input) {
        input.addEventListener('input', function () {
          const v = input.value.replace(/,/g, '.').replace(/[^0-9./-]/g, '');
          if (v !== input.value) input.value = v;
        });
        if (window.matchMedia && matchMedia('(pointer: fine)').matches) input.focus({ preventScroll: true });
      }
      announce('Question ' + G.n);
    }

    function submitInput() {
      const input = el('bzInput');
      if (!input || G.phase !== 'live' || G.paused) return;
      const v = input.value.trim();
      if (!v || !/\d/.test(v)) { input.focus(); return; }
      resolve(v, false);
    }

    // Мгновенная проверка: given = ключ варианта или строка; timeout = истёк таймер вопроса
    function resolve(given, timeout) {
      if (!G || G.phase !== 'live') return;
      const q = G.q;
      let ok = false;
      if (!timeout) { try { ok = !!Data.checkAnswer(q, given); } catch (e) { console.error('[blitz] checkAnswer', e); } }
      const time = G.elapsed;
      const limit = G.sprint ? FAST_SEC[q.difficulty] || 25 : Math.min(FAST_SEC[q.difficulty] || 25, G.cfg.pace * 0.4);
      const fast = ok && time <= limit;
      let points = 0, timeDelta = 0;
      const before = heatLevel();

      if (ok) {
        G.streak++;
        G.maxStreak = Math.max(G.maxStreak, G.streak);
        points = Math.round((BASE_POINTS[q.difficulty] || 150) * (heatLevel() + 1) * (fast ? 1.25 : 1));
        G.score += points;
        if (fast) G.fast++;
        // бонус времени только в серии: случайное угадывание не накручивает таймер
        if (G.sprint && fast && G.streak >= 2) timeDelta = BONUS;
      } else {
        G.streak = 0;
        if (G.sprint) timeDelta = -PENALTY;
        else G.lives--;
      }
      if (G.sprint) G.left = Math.max(0, G.left + timeDelta);

      G.log.push({ n: G.n, id: q.id, q: q, given: timeout ? null : given, result: ok ? 'ok' : timeout ? 'timeout' : 'wrong', time: time, fast: fast });
      if (!timeout && !DEMO) { try { Data.progress.record(q.id, ok); } catch (e) { console.error('[blitz] progress.record', e); } }

      G.phase = 'feedback';
      G.fbAge = 0;
      G.fbLeft = ok ? 0.65 : 2.4;

      if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
      markAnswers(given, ok);
      paintFeedback(ok, timeout, points, timeDelta);
      paintHud();
      paintPerks();
      paintClock();

      if (points) floatChip('+' + points, 'text-success');
      if (timeDelta > 0) floatChip('+' + timeDelta + 's', 'text-accent');
      if (timeDelta < 0) floatChip('−' + Math.abs(timeDelta) + 's', 'text-danger');
      if (heatLevel() > before) {
        const m = el('bzMult');
        if (m) { m.classList.remove('bz-pop'); void m.offsetWidth; m.classList.add('bz-pop'); }
      }
    }

    function markAnswers(given, ok) {
      const q = G.q;
      overlay.querySelectorAll('.bz-choice').forEach(function (b) {
        const k = b.getAttribute('data-v');
        b.disabled = true;
        b.setAttribute('data-s', k === q.correctAnswer ? 'ok' : (!ok && k === given) ? 'bad' : 'dim');
      });
      const input = el('bzInput');
      if (input) {
        input.disabled = true;
        input.style.borderColor = ok ? '#10B981' : '#EF4444';
        const s = overlay.querySelector('[data-a="submit"]');
        if (s) s.disabled = true;
      }
    }

    const acceptedText = function (q) {
      return q.type === 'spr'
        ? (q.acceptedAnswers && q.acceptedAnswers.length ? q.acceptedAnswers.join(', ') : q.correctAnswer)
        : q.correctAnswer;
    };

    function paintFeedback(ok, timeout, points, timeDelta) {
      const box = el('bzFeedback');
      if (!box) return;
      const title = ok ? 'Correct' : timeout ? 'Time is up' : 'Not quite';
      const detail = ok
        ? '+' + points + (timeDelta > 0 ? ' · +' + timeDelta + 's' : '')
        : (G.q.type === 'spr' ? 'Accepted: ' : 'Correct answer: ') + acceptedText(G.q);
      box.innerHTML =
        '<div class="bz-in flex items-center gap-3 rounded-xl border px-4 py-2.5 ' + (ok ? 'border-success/40 bg-success/10' : 'border-danger/40 bg-danger/10') + '">' +
          '<span class="' + (ok ? 'text-success' : 'text-danger') + '">' + icon(ok ? 'check' : 'x', 'h-5 w-5') + '</span>' +
          '<div class="min-w-0 flex-1"><div class="text-[13.5px] font-semibold ' + (ok ? 'text-success' : 'text-danger') + '">' + title + '</div>' +
          '<div class="num truncate text-[12.5px] text-ink-soft">' + esc(detail) + '</div></div>' +
          (ok ? '' : '<button type="button" data-a="advance" class="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-lg border bg-surface px-3.5 text-[13px] font-semibold hover:bg-raised">Continue' + icon('arrow', 'h-3.5 w-3.5') + '</button>') +
        '</div>';
      announce(title + '. ' + detail);
      if (!ok && box.scrollIntoView) { try { box.scrollIntoView({ block: 'nearest', behavior: reducedMotion() ? 'auto' : 'smooth' }); } catch (e) {} }
    }

    function advance() {
      if (!G || G.phase !== 'feedback') return;
      if ((!G.sprint && G.lives <= 0) || (G.sprint && G.left <= 0)) { finish(); return; }
      nextQuestion();
    }

    /* ---------- перки ---------- */
    function useHalf() {
      if (!G || G.phase !== 'live' || G.paused || !G.perks.half) return;
      const q = G.q;
      if (q.type !== 'mcq' || q.choices.length < 3) return;
      G.perks.half--;
      shuffle(q.choices.filter(function (c) { return c.key !== q.correctAnswer; })).slice(0, 2)
        .forEach(function (c) { G.cut[c.key] = 1; });
      overlay.querySelectorAll('.bz-choice').forEach(function (b) {
        if (G.cut[b.getAttribute('data-v')]) { b.disabled = true; b.setAttribute('data-s', 'cut'); }
      });
      paintPerks();
      announce('Two wrong choices removed');
    }

    function useSkip() {
      if (!G || G.phase !== 'live' || G.paused || !G.perks.skip) return;
      G.perks.skip--;
      G.log.push({ n: G.n, id: G.q.id, q: G.q, given: null, result: 'skip', time: G.elapsed, fast: false });
      floatChip('Combo saved', 'text-accent');
      nextQuestion();
    }

    /* ---------- пауза ---------- */
    function setPaused(v) {
      if (!G || G.phase === 'done' || G.paused === v) return;
      G.paused = v;
      G.last = performance.now();
      const p = el('bzPause');
      if (!p) return;
      p.hidden = !v;
      // непрозрачный экран паузы скрывает задачу, чтобы её нельзя было решать при остановленных часах
      p.innerHTML = v
        ? '<div class="bz-in w-full max-w-[360px] text-center">' +
            '<div class="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-raised text-accent">' + icon('pause', 'h-6 w-6') + '</div>' +
            '<h2 class="mt-4 text-[22px] font-semibold tracking-tight">Round paused</h2>' +
            '<p class="mt-1.5 text-[13.5px] text-ink-soft">The clock is stopped and the question is hidden.</p>' +
            '<div class="mt-6 flex flex-col gap-2.5">' +
              '<button type="button" data-a="resume" class="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-accent text-[14px] font-semibold text-white hover:bg-accent-hover">' + icon('play', 'h-4 w-4', true) + 'Resume</button>' +
              '<button type="button" data-a="end" class="h-11 rounded-lg border text-[13.5px] font-medium hover:bg-raised">End round and see results</button>' +
              '<button type="button" data-a="quit" class="h-11 rounded-lg text-[13px] font-medium text-ink-soft hover:bg-raised hover:text-ink">Quit without saving the score</button>' +
            '</div></div>'
        : '';
      if (v) { const b = p.querySelector('[data-a="resume"]'); if (b) b.focus(); }
      else if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
    }

    function quit() {
      if (G) G.phase = 'done';
      removeOverlay();
      G = null;
      paintSetup(true);
    }

    /* ===============================================================
       RESULTS
       =============================================================== */
    function finish() {
      if (!G || G.phase === 'done') return;
      G.phase = 'done';
      const attempted = G.log.filter(function (x) { return x.result !== 'skip'; });
      const correct = attempted.filter(function (x) { return x.result === 'ok'; });
      const n = attempted.length;
      const acc = n ? Math.round(correct.length / n * 100) : 0;
      const avg = n ? attempted.reduce(function (a, x) { return a + x.time; }, 0) / n : 0;

      const s = readStats();
      const key = bestKey(G.cfg);
      const prevBest = s.best[key] || 0;
      const isBest = G.score > prevBest;

      let xp = correct.reduce(function (a, x) { return a + (XP_PER[x.q.difficulty] || 8) + (x.fast ? 1 : 0); }, 0);
      if (n >= 8 && acc >= 80) xp += 10;
      if (isBest && prevBest > 0) xp += 15;

      if (n && !DEMO) {
        s.sessions++;
        s.sumOk += correct.length;
        s.sumAns += n;
        s.bestStreak = Math.max(s.bestStreak, G.maxStreak);
        if (n >= 5) s.bestAcc = Math.max(s.bestAcc, acc);     // 1 из 1 не считается рекордом точности
        if (isBest) s.best[key] = G.score;
        writeStats(s);
      }
      const gained = awardXP(xp);

      R = {
        cfg: G.cfg, score: G.score, n: n, ok: correct.length, acc: acc, avg: avg,
        maxStreak: G.maxStreak, fast: G.fast, xp: gained,
        isBest: isBest && n > 0, prevBest: prevBest, best: Math.max(prevBest, G.score),
        review: G.log.filter(function (x) { return x.result !== 'ok'; }),
        reason: !G.sprint && G.lives <= 0 ? 'Out of lives' : G.sprint && G.left <= 0 ? 'Time is up' : 'Round complete'
      };

      if (!DEMO) {
        try {
          window.dispatchEvent(new CustomEvent('sp:blitz-complete', { detail: { mode: R.cfg.mode, score: R.score, answered: R.n, correct: R.ok, accuracy: R.acc, maxStreak: R.maxStreak, xp: R.xp } }));
        } catch (e) {}
      }

      removeOverlay();
      G = null;
      paintResults();
    }

    function tile(ic, label, value, sub) {
      return '<div class="card p-4"><div class="flex items-center gap-2 text-[12px] text-ink-soft">' + icon(ic, 'h-3.5 w-3.5 text-accent') + label + '</div>' +
        '<div class="num mt-2 text-[26px] font-semibold leading-none tracking-tight">' + value + '</div>' +
        '<div class="mt-1.5 text-[11.5px] text-ink-mute">' + sub + '</div></div>';
    }

    function reviewRow(x, i) {
      const tag = x.result === 'skip' ? ['Skipped', 'bg-raised text-ink-soft'] : x.result === 'timeout' ? ['Timed out', 'bg-hl/15 text-hl'] : ['Missed', 'bg-danger/10 text-danger'];
      return '<div class="border-t first:border-t-0">' +
        '<button type="button" data-a="review" data-i="' + i + '" aria-expanded="false" aria-controls="bzRv' + i + '" class="flex min-h-[56px] w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-raised/50">' +
          '<span class="num grid h-7 w-7 shrink-0 place-items-center rounded-full bg-raised text-[12px] font-semibold">' + x.n + '</span>' +
          '<span class="min-w-0 flex-1"><span class="block truncate text-[13.5px] font-medium">' + esc(x.q.skill || x.q.domain || 'Math') + '</span>' +
          '<span class="block text-[11.5px] text-ink-mute">' + (DIFF_BADGE[x.q.difficulty] || DIFF_BADGE.medium)[0] + ' · <span class="num">' + x.time.toFixed(1) + 's</span></span></span>' +
          '<span class="inline-flex h-6 shrink-0 items-center rounded-full px-2.5 text-[11px] font-semibold ' + tag[1] + '">' + tag[0] + '</span>' +
          '<span class="bz-chev text-ink-soft" style="transition:transform .2s ease">' + icon('chevron') + '</span>' +
        '</button>' +
        '<div id="bzRv' + i + '" hidden></div></div>';
    }

    function reviewBody(x) {
      const q = x.q;
      let answers;
      if (q.type === 'mcq') {
        answers = '<div class="mt-4 space-y-2">' + q.choices.map(function (c) {
          const right = c.key === q.correctAnswer, mine = x.given === c.key;
          return '<div class="bz-choice flex min-h-[48px] items-center gap-3 rounded-xl px-3.5 py-2"' + (right ? ' data-s="ok"' : mine ? ' data-s="bad"' : '') + '>' +
            '<span class="bz-letter num grid h-6 w-6 shrink-0 place-items-center rounded-full text-[12px] font-semibold">' + esc(c.key) + '</span>' +
            '<span class="bz-prose min-w-0 flex-1 text-[14px] leading-snug">' + rich(c.text) + '</span>' +
            (right ? '<span class="shrink-0 text-[11px] font-semibold text-success">Correct</span>' : mine ? '<span class="shrink-0 text-[11px] font-semibold text-danger">Your answer</span>' : '') +
          '</div>';
        }).join('') + '</div>';
      } else {
        answers = '<div class="mt-4 grid gap-2.5 sm:grid-cols-2">' +
          '<div class="rounded-xl border p-3"><div class="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-mute">Your answer</div><div class="num mt-1 text-[15px]">' + (x.given ? esc(x.given) : '—') + '</div></div>' +
          '<div class="rounded-xl border border-success/30 bg-success/10 p-3"><div class="text-[11px] font-semibold uppercase tracking-[0.08em] text-success">Accepted answers</div><div class="num mt-1 text-[15px]">' + esc(acceptedText(q)) + '</div></div></div>';
      }
      return '<div class="bz-in bg-canvas/40 px-4 pb-5 pt-3">' +
        '<div class="bz-prose text-[15px] leading-relaxed">' + rich(q.prompt) + '</div>' + answers +
        '<h3 class="mb-1.5 mt-5 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-mute">Solution</h3>' +
        (String(q.explanation || '').trim()
          ? '<div class="bz-prose text-[14px] leading-[1.7]">' + rich(q.explanation) + '</div>'
          : '<p class="text-[13px] text-ink-soft">A step-by-step solution is not available for this question yet.</p>') +
      '</div>';
    }

    function paintResults() {
      screen = 'results';
      resultsAt = Date.now();
      const setupName = R.cfg.mode === 'sprint' ? 'Time Attack ' + clock(R.cfg.dur) : '3 Lives · ' + R.cfg.pace + 's';
      const diffName = OPTIONS.diff.filter(function (o) { return o[0] === R.cfg.diff; })[0][1];

      let bestLine;
      if (R.isBest) bestLine = '<span class="bz-pop inline-flex items-center gap-1.5 rounded-full bg-hl/15 px-3 py-1.5 text-[12.5px] font-semibold text-hl">' + icon('trophy', 'h-3.5 w-3.5') + 'New personal best' + (R.prevBest ? ' · +' + fmt(R.score - R.prevBest) : '') + '</span>';
      else bestLine = '<span class="inline-flex items-center gap-1.5 rounded-full bg-raised px-3 py-1.5 text-[12.5px] text-ink-soft">' + icon('trophy', 'h-3.5 w-3.5') + (R.best ? 'Personal best <b class="num text-ink">' + fmt(R.best) + '</b>' : 'No personal best yet') + '</span>';

      const reviewBlock = R.review.length
        ? '<section class="card rise overflow-hidden"><div class="border-b px-4 py-3.5"><h2 class="text-[15px] font-semibold">Mistake Replay</h2>' +
            '<p class="mt-0.5 text-[12.5px] text-ink-soft">Open a question to see the correct answer and the solution.</p></div>' +
            R.review.map(reviewRow).join('') + '</section>'
        : R.n
          ? '<section class="rise rounded-2xl border border-success/30 bg-success/10 px-5 py-6 text-center"><p class="text-[15px] font-semibold text-success">Clean round</p><p class="mt-1 text-[13px] text-ink-soft">No mistakes to replay.</p></section>'
          : '<section class="card rise px-5 py-6 text-center"><p class="text-[15px] font-semibold">No answers this round</p><p class="mt-1 text-[13px] text-ink-soft">This round was not added to your stats.</p></section>';

      page.innerHTML =
        '<div class="mx-auto w-full max-w-[760px] space-y-4 px-4 py-6 md:px-8 md:py-10">' +
          '<section class="card rise p-6 text-center md:p-8">' +
            '<div class="text-[12px] font-semibold uppercase tracking-[0.08em] text-ink-mute">' + R.reason + '</div>' +
            '<div class="num mt-3 text-[64px] font-semibold leading-none tracking-tight">' + fmt(R.score) + '</div>' +
            '<p class="mt-2 text-[13px] text-ink-soft">' + setupName + ' · ' + diffName + '</p>' +
            '<div class="mt-4">' + bestLine + '</div>' +
            '<div class="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">' +
              '<button type="button" data-a="start" class="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-accent px-7 text-[14.5px] font-semibold text-white transition-colors hover:bg-accent-hover">' + icon('zap', 'h-4 w-4', true) + 'Play again</button>' +
              '<button type="button" data-a="setup" class="h-12 rounded-full border px-6 text-[13.5px] font-medium hover:bg-raised">Change setup</button>' +
              (window.SPReview && R.review.some(function (x) { return x.result === 'wrong'; })
                ? '<button type="button" data-a="errors" class="inline-flex h-12 items-center justify-center gap-2 rounded-full border px-6 text-[13.5px] font-medium hover:bg-raised">' + icon('book') + 'Saved &amp; Errors</button>' : '') +
            '</div>' +
          '</section>' +
          '<div class="rise grid grid-cols-2 gap-3 md:grid-cols-4">' +
            tile('target', 'Accuracy', R.n ? R.acc + '%' : '—', R.ok + ' of ' + R.n + ' correct') +
            tile('clock', 'Avg time', R.n ? R.avg.toFixed(1) + 's' : '—', R.fast + ' fast ' + (R.fast === 1 ? 'answer' : 'answers')) +
            tile('flame', 'Best combo', R.maxStreak, 'correct in a row') +
            tile('zap', 'XP earned', '+' + R.xp, DEMO ? 'Not saved in demo' : 'added to your total') +
          '</div>' +
          reviewBlock +
        '</div>';
      window.scrollTo(0, 0);
    }

    function toggleReview(btn) {
      const i = +btn.getAttribute('data-i');
      const body = page.querySelector('#bzRv' + i);
      if (!body || !R || !R.review[i]) return;
      const open = body.hidden;
      if (open && !body.firstChild) {
        body.innerHTML = reviewBody(R.review[i]);
        renderMath(body);
      }
      body.hidden = !open;
      btn.setAttribute('aria-expanded', String(open));
      const ch = btn.querySelector('.bz-chev');
      if (ch) ch.style.transform = open ? 'rotate(180deg)' : '';
    }

    /* ===============================================================
       СОБЫТИЯ
       =============================================================== */
    function onClick(e) {
      const b = e.target.closest('[data-a]');
      if (!b || b.disabled) return;
      const a = b.getAttribute('data-a');
      if (a === 'opt') {
        const k = b.getAttribute('data-k'), raw = b.getAttribute('data-v');
        prefs[k] = (k === 'dur' || k === 'pace') ? +raw : raw;
        const s = readStats();
        s.prefs = Object.assign({}, prefs);
        writeStats(s);
        paintSetup(false, '[data-k="' + k + '"][data-v="' + raw + '"]');
      }
      else if (a === 'start') startRound();
      else if (a === 'setup') { paintSetup(true); window.scrollTo(0, 0); }
      else if (a === 'errors') ctx.navigate('errors');
      else if (a === 'review') toggleReview(b);
      else if (!G) return;
      else if (a === 'pick') { if (!G.paused) resolve(b.getAttribute('data-v'), false); }
      else if (a === 'submit') submitInput();
      else if (a === 'advance') advance();
      else if (a === 'half') useHalf();
      else if (a === 'skip') useSkip();
      else if (a === 'pause') setPaused(true);
      else if (a === 'resume') setPaused(false);
      else if (a === 'end') finish();
      else if (a === 'quit') quit();
    }

    // e.code не зависит от раскладки клавиатуры
    function choiceIndex(code) {
      let m = /^Key([A-D])$/.exec(code);
      if (m) return m[1].charCodeAt(0) - 65;
      m = /^(?:Digit|Numpad)([1-4])$/.exec(code);
      return m ? +m[1] - 1 : -1;
    }

    function onKey(e) {
      if (!alive || e.ctrlKey || e.metaKey || e.altKey) return;
      const isEnter = e.key === 'Enter';
      const onControl = !!(e.target && e.target.closest && e.target.closest('button, a, input, textarea, select, summary'));

      if (screen !== 'play' || !G) {
        if (isEnter && !e.repeat && !onControl && (screen === 'setup' || Date.now() - resultsAt > 900)) {
          e.preventDefault();
          startRound();
        }
        return;
      }

      if (e.repeat) { if (isEnter) e.preventDefault(); return; }
      if (e.key === 'Escape') { e.preventDefault(); setPaused(!G.paused); return; }
      if (G.paused) return;

      if (e.code === 'KeyF') { e.preventDefault(); useHalf(); return; }
      if (e.code === 'KeyS') { e.preventDefault(); useSkip(); return; }

      if (G.phase === 'feedback') {
        if (isEnter || e.key === ' ' || e.key === 'ArrowRight') {
          e.preventDefault();
          if (G.fbAge > 0.2) advance();
        }
        return;
      }
      if (G.phase !== 'live') return;

      if (G.q.type === 'spr') {
        const inInput = e.target && e.target.id === 'bzInput';
        if (isEnter && (inInput || !onControl)) { e.preventDefault(); submitInput(); }
        return;
      }
      const idx = choiceIndex(e.code);
      if (idx >= 0 && G.q.choices[idx]) {
        const key = G.q.choices[idx].key;
        e.preventDefault();
        if (!G.cut[key]) resolve(key, false);
      }
    }

    function onVisibility() {
      if (document.hidden && screen === 'play') setPaused(true);
    }

    page.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    document.addEventListener('visibilitychange', onVisibility);

    paintSetup(true);
    const onLoaded = function () {
      if (!alive) return;
      ready = true;
      try { mathCount = Data.query({ section: 'math', status: 'all' }).length; } catch (e) { mathCount = 0; }
      if (screen === 'setup') paintSetup(false);
    };
    Promise.resolve(Data.load()).then(onLoaded, onLoaded);

    return function () {
      alive = false;
      if (G) G.phase = 'done';
      removeOverlay();
      G = null;
      page.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }

  Shell.register('blitz', { title: 'Math Blitz', group: 'Simulate', render: view });
})();
