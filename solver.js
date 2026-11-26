/* =====================================================================
   SATPath — Question Solver (solver.js)
   ---------------------------------------------------------------------
   Полноэкранный экран решения задач (Question Bank -> Solver).

   Зависимости (подключать ПОСЛЕ shell.js, dataAdapter.js, question-bank.js):
     SPShell, SPData

   Маршрут:  #/solver   (SPShell.register('solver', { layout: 'full' }))
   При загрузке файла ставится  SPData.solverReady = true,
   после чего кнопки Play / Shuffle / подтемы в Question Bank открывают этот экран.

   Что внутри:
     • верхняя панель: ← Question Bank, секундомер (Pause / Hide), Calculator и Reference (только Math)
     • Calculator — Desmos в split-панели слева (Graphing / Scientific), API грузится лениво с CDN
     • Reference Sheet — модалка с формулами SAT на чистом SVG/HTML
     • карточка вопроса: номер, Section · Domain · Skill, бейдж сложности, режим Eliminate,
       Math по центру, R&W — split 50/50 (на телефоне вкладки Passage / Question), MCQ и Grid-in
     • нижняя панель: Remix, счётчик «1 / N» с поповером-сеткой, Explanation, Check, Previous, Next
     • шторка Explanation (на телефоне — bottom sheet), итоговое окно сессии
     • горячие клавиши: ← / → , 1–4 или A–D, Enter (проверить / дальше), Esc
   ===================================================================== */
(function () {
  'use strict';

  const Shell = window.SPShell;
  const Data = window.SPData;
  if (!Shell || !Data) {
    console.error('[solver] Подключите shell.js и dataAdapter.js ДО этого файла.');
    return;
  }

  Data.solverReady = true;

  const DESMOS_SRC = 'https://www.desmos.com/api/v1.9/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6';
  const IDX_KEY = 'satpath_solver_idx_v1';
  const DIFF_LABEL = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };
  const SECTION_LABEL = { math: 'Math', rw: 'Reading & Writing' };

  /* ------------------------------ УТИЛИТЫ ------------------------------ */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // Текст вопросов приходит как HTML (старый формат): <f>a/b</f> — дробь, \n — перенос строки.
  function rich(s) {
    let t = String(s == null ? '' : s);
    t = t.replace(/<f>\s*([^<]*?)\s*\/\s*([^<]*?)\s*<\/f>/g, function (_, a, b) {
      return '<span class="sv-frac"><span>' + a + '</span><span>' + b + '</span></span>';
    });
    if (!/<(p|br|div|ul|ol|li|table|h\d)\b/i.test(t)) t = t.replace(/\r?\n/g, '<br>');
    return t;
  }

  function fmtTime(sec) {
    sec = Math.max(0, Math.floor(sec));
    const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
    const p = function (n) { return n < 10 ? '0' + n : '' + n; };
    return h > 0 ? h + ':' + p(m) + ':' + p(s) : p(m) + ':' + p(s);
  }

  function normDiff(d) {
    d = String(d || '').toLowerCase();
    return DIFF_LABEL[d] ? d : 'none';
  }

  function icons() { try { if (window.lucide) window.lucide.createIcons(); } catch (e) {} }

  const SVG = {
    check: '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
    x: '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    slash: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/></svg>',
    lock: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>'
  };

  /* ------------------------------ СТИЛИ ------------------------------ */
  const CSS =
    '.sv-frac{display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;margin:0 2px;line-height:1.15;font-size:.92em}' +
    '.sv-frac>span:first-child{padding:0 3px;border-bottom:1.5px solid currentColor}' +
    '.sv-frac>span:last-child{padding:0 3px}' +
    '.sv-math{font-family:Georgia,"Times New Roman",serif}' +
    '.sv-lbl{fill:currentColor;stroke:none;font:italic 11px Georgia,serif}' +
    '.sv-lbl2{fill:currentColor;stroke:none;font:8px Inter,sans-serif;opacity:.7}' +
    '.sv-prompt img{max-width:100%;height:auto}' +
    '.sv-prompt table{border-collapse:collapse;margin:10px auto}' +
    '.sv-prompt td,.sv-prompt th{border:1px solid rgba(138,143,152,.4);padding:4px 10px;text-align:center}' +
    '.sv-txt.struck{text-decoration:line-through;opacity:.5}' +
    '.sv-strike{opacity:0;transition:opacity .15s}' +
    '.sv-opt:hover .sv-strike,.sv-strike:focus-visible,.sv-elim .sv-strike,.sv-strike[aria-pressed="true"]{opacity:1}' +
    '@media (hover:none){.sv-strike{opacity:1}}' +
    '.sv-tile{position:relative;height:40px;border-radius:10px;border:1.5px solid transparent;font-weight:600;font-size:13px;cursor:pointer;transition:transform .1s}' +
    '.sv-tile:hover{transform:translateY(-1px)}' +
    '.sv-t-easy{background:rgba(16,185,129,.16);color:#047857}' +
    '.sv-t-medium{background:rgba(245,158,11,.18);color:#b45309}' +
    '.sv-t-hard{background:rgba(239,68,68,.15);color:#b91c1c}' +
    '.sv-t-none{background:rgba(138,143,152,.16);color:#525866}' +
    'html.dark .sv-t-easy{color:#6ee7b7}html.dark .sv-t-medium{color:#fcd34d}html.dark .sv-t-hard{color:#fca5a5}html.dark .sv-t-none{color:#8A8F98}' +
    '.sv-tile.sv-cur{border-color:#3B82F6;box-shadow:0 0 0 2px rgba(59,130,246,.28)}' +
    '.sv-mk{position:absolute;top:-5px;right:-5px;width:16px;height:16px;border-radius:50%;display:grid;place-items:center;color:#fff}' +
    '.sv-mk.ok{background:#10B981}.sv-mk.bad{background:#EF4444}' +
    '.sv-dot{display:inline-block;width:12px;height:12px;border-radius:4px;vertical-align:-1px;margin-right:6px}' +
    '.sv-d-easy{background:rgba(16,185,129,.16);color:#047857}.sv-d-medium{background:rgba(245,158,11,.18);color:#b45309}.sv-d-hard{background:rgba(239,68,68,.15);color:#b91c1c}.sv-d-none{background:rgba(138,143,152,.16);color:#525866}' +
    'html.dark .sv-d-easy{color:#6ee7b7}html.dark .sv-d-medium{color:#fcd34d}html.dark .sv-d-hard{color:#fca5a5}html.dark .sv-d-none{color:#8A8F98}' +
    '.sv-foot{display:grid;gap:8px;align-items:center;padding:8px 12px calc(8px + env(safe-area-inset-bottom,0px));grid-template-columns:auto minmax(0,1fr) auto;grid-template-areas:"rm ct ex" "pv ck nx"}' +
    '.sv-rg{display:contents}.sv-rm{grid-area:rm}.sv-ct{grid-area:ct;justify-self:center}.sv-ex{grid-area:ex}.sv-pv{grid-area:pv}.sv-ck{grid-area:ck}.sv-nx{grid-area:nx}' +
    '@media (min-width:768px){.sv-foot{grid-template-columns:1fr auto 1fr;grid-template-areas:"rm ct rg";padding:10px 20px}' +
    '.sv-rg{display:flex;grid-area:rg;justify-content:flex-end;gap:8px}.sv-ex,.sv-pv,.sv-ck,.sv-nx{grid-area:auto}}' +
    '.sv-calc{width:46%;min-width:360px;max-width:760px;flex:none;display:flex;flex-direction:column}' +
    '.sv-calc[data-wide="1"]{width:68%;max-width:none}' +
    '@media (max-width:767px){.sv-calc{position:fixed;inset:0;z-index:60;width:auto;min-width:0;max-width:none}}' +
    '.sv-split{display:flex;flex-direction:column;min-height:100%}' +
    '@media (min-width:768px){.sv-split{display:grid;grid-template-columns:1fr 1fr;height:100%;min-height:0}.sv-pane{overflow-y:auto;min-height:0}}' +
    '@media (max-width:767px){.sv-pane[data-on="0"]{display:none}}' +
    '.sv-pop{position:fixed;left:50%;transform:translateX(-50%);z-index:55;width:min(460px,calc(100vw - 16px));max-height:calc(100vh - 150px);display:flex;flex-direction:column;animation:svUp .16s ease both}' +
    '.sv-drawer{position:absolute;top:0;right:0;bottom:0;width:min(460px,100%);display:flex;flex-direction:column;animation:svSlide .22s ease both}' +
    '@media (max-width:767px){.sv-drawer{top:auto;left:0;width:auto;max-height:86vh;border-radius:16px 16px 0 0;animation:svUp .22s ease both}}' +
    '@keyframes svSlide{from{transform:translateX(28px);opacity:0}to{transform:none;opacity:1}}' +
    '@keyframes svUp{from{transform:translate(var(--sv-tx,0),14px);opacity:0}to{transform:translate(var(--sv-tx,0),0);opacity:1}}' +
    '.sv-pop{--sv-tx:-50%}' +
    '@keyframes svFade{from{opacity:0}to{opacity:1}}' +
    '.sv-fade{animation:svFade .15s ease both}' +
    '@media (prefers-reduced-motion:reduce){.sv-pop,.sv-drawer,.sv-fade{animation:none!important}}';

  /* ------------------------------ ЛЕНИВАЯ ЗАГРУЗКА DESMOS ------------------------------ */
  let desmosP = null;
  function loadDesmos() {
    if (window.Desmos) return Promise.resolve();
    if (desmosP) return desmosP;
    desmosP = new Promise(function (resolve, reject) {
      const s = document.createElement('script');
      s.src = DESMOS_SRC;
      s.async = true;
      s.onload = function () { window.Desmos ? resolve() : reject(new Error('Desmos missing')); };
      s.onerror = function () { reject(new Error('network')); };
      document.head.appendChild(s);
    }).catch(function (e) { desmosP = null; throw e; });
    return desmosP;
  }

  /* ------------------------------ REFERENCE SHEET ------------------------------ */
  function fig(svg, formulas) {
    return '<figure class="rounded-xl border bg-surface p-3 flex flex-col items-center m-0">' +
      '<svg viewBox="0 0 120 90" class="w-full max-w-[150px] h-auto text-ink" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + svg + '</svg>' +
      '<figcaption class="mt-2 text-center text-[13.5px] leading-snug sv-math">' + formulas + '</figcaption></figure>';
  }
  const FR = function (a, b) { return '<span class="sv-frac"><span>' + a + '</span><span>' + b + '</span></span>'; };

  function referenceHTML() {
    const D = ' stroke-dasharray="3 3"';
    const figs = [
      fig('<circle cx="60" cy="45" r="32"/><path d="M60 45h32"/><circle cx="60" cy="45" r="1.6" fill="currentColor" stroke="none"/><text class="sv-lbl" x="72" y="40">r</text>',
        'A = πr²<br>C = 2πr'),
      fig('<rect x="18" y="20" width="84" height="48"/><text class="sv-lbl" x="56" y="83">ℓ</text><text class="sv-lbl" x="107" y="48">w</text>',
        'A = ℓw'),
      fig('<path d="M64 12 20 70h88z"/><path d="M64 12v58"' + D + '/><path d="M64 62h6v8"/><text class="sv-lbl" x="60" y="84">b</text><text class="sv-lbl" x="69" y="44">h</text>',
        'A = ' + FR('1', '2') + 'bh'),
      fig('<path d="M22 72V20L100 72Z"/><path d="M22 64h8v8"/><text class="sv-lbl" x="10" y="50">a</text><text class="sv-lbl" x="58" y="84">b</text><text class="sv-lbl" x="68" y="38">c</text>',
        'c² = a² + b²'),
      fig('<path d="M20 74V26L104 74Z"/><path d="M20 66h8v8"/><text class="sv-lbl" x="9" y="54">x</text><text class="sv-lbl" x="50" y="87">x√3</text><text class="sv-lbl" x="68" y="44">2x</text><text class="sv-lbl2" x="25" y="42">60°</text><text class="sv-lbl2" x="82" y="71">30°</text>',
        'Special Right Triangle<br>30° – 60° – 90°'),
      fig('<path d="M20 74V14L80 74Z"/><path d="M20 66h8v8"/><text class="sv-lbl" x="9" y="46">s</text><text class="sv-lbl" x="47" y="87">s</text><text class="sv-lbl" x="58" y="38">s√2</text><text class="sv-lbl2" x="25" y="32">45°</text><text class="sv-lbl2" x="62" y="71">45°</text>',
        'Special Right Triangle<br>45° – 45° – 90°'),
      fig('<path d="M16 36h60v40H16zM16 36l22-16h60l-22 16M98 20v40l-22 16"/><path d="M38 20v40h60M38 60 16 76"' + D + '/><text class="sv-lbl" x="44" y="88">ℓ</text><text class="sv-lbl" x="96" y="76">w</text><text class="sv-lbl" x="6" y="60">h</text>',
        'V = ℓwh'),
      fig('<ellipse cx="60" cy="20" rx="30" ry="9"/><path d="M30 20v50M90 20v50M30 70a30 9 0 0 0 60 0"/><path d="M30 70a30 9 0 0 1 60 0"' + D + '/><path d="M60 20h30"/><text class="sv-lbl" x="70" y="16">r</text><text class="sv-lbl" x="96" y="48">h</text>',
        'V = πr²h'),
      fig('<circle cx="60" cy="45" r="32"/><path d="M28 45a32 10 0 0 0 64 0"/><path d="M28 45a32 10 0 0 1 64 0"' + D + '/><path d="M60 45h32"/><circle cx="60" cy="45" r="1.6" fill="currentColor" stroke="none"/><text class="sv-lbl" x="72" y="40">r</text>',
        'V = ' + FR('4', '3') + 'πr³'),
      fig('<path d="M60 10 28 68M60 10 92 68M28 68a32 9 0 0 0 64 0"/><path d="M28 68a32 9 0 0 1 64 0M60 10v58M60 68h32"' + D + '/><text class="sv-lbl" x="64" y="42">h</text><text class="sv-lbl" x="74" y="64">r</text>',
        'V = ' + FR('1', '3') + 'πr²h'),
      fig('<path d="M60 10 20 70h64zM60 10l44 46-20 14"/><path d="M60 10 40 56l64 0M20 70l20-14M60 10v52"' + D + '/><text class="sv-lbl" x="48" y="84">ℓ</text><text class="sv-lbl" x="100" y="72">w</text><text class="sv-lbl" x="64" y="40">h</text>',
        'V = ' + FR('1', '3') + 'ℓwh')
    ].join('');

    return '<div class="grid grid-cols-2 md:grid-cols-3 gap-3">' + figs + '</div>' +
      '<ul class="mt-5 space-y-1.5 text-[13.5px] text-ink-soft leading-relaxed list-disc pl-5">' +
      '<li>The number of degrees of arc in a circle is 360.</li>' +
      '<li>The number of radians of arc in a circle is 2π.</li>' +
      '<li>The sum of the measures in degrees of the angles of a triangle is 180.</li></ul>';
  }

  /* ------------------------------ ЭКРАН ------------------------------ */
  Shell.register('solver', {
    layout: 'full',
    title: 'Solver',
    group: 'Prep',
    render: function (root, ctx) {
      let alive = true;
      const cleanups = [];

      // ---------- стили ----------
      if (!document.getElementById('svStyle')) {
        const st = document.createElement('style');
        st.id = 'svStyle';
        st.textContent = CSS;
        document.head.appendChild(st);
      }

      // ---------- пустые состояния ----------
      function emptyState(title, text) {
        root.innerHTML =
          '<div class="mx-auto max-w-[460px] px-6 py-28 text-center">' +
          '<div class="mx-auto w-12 h-12 rounded-xl bg-raised grid place-items-center text-accent"><i data-lucide="inbox" class="w-6 h-6"></i></div>' +
          '<h1 class="mt-5 text-[22px] font-semibold tracking-tight">' + esc(title) + '</h1>' +
          '<p class="mt-2 text-[14px] text-ink-soft leading-relaxed">' + esc(text) + '</p>' +
          '<a href="#/question-bank" class="btn-pill mt-7 inline-flex">Open Question Bank</a></div>';
        icons();
      }

      const sess = Data.getSession();
      if (!sess || !sess.ids || !sess.ids.length) {
        emptyState(sess ? 'No questions in this session' : 'No session started',
          sess ? 'Nothing matches the selected filters. Try another status or difficulty.' : 'Pick a topic in the Question Bank and press Play to start solving.');
        return;
      }

      root.innerHTML = '<div class="grid place-items-center py-40 text-[13px] text-ink-soft">Loading questions…</div>';
      const loading = (typeof Data.load === 'function') ? Promise.resolve(Data.load()) : Promise.resolve();
      loading.then(function () { if (alive) start(sess); }, function () { if (alive) start(sess); });

      return function () {
        alive = false;
        cleanups.forEach(function (fn) { try { fn(); } catch (e) {} });
      };

      /* ============================ ОСНОВНАЯ ЛОГИКА ============================ */
      function start(sess) {
        const S = {
          sess: sess, ids: sess.ids.slice(), items: [], idx: 0,
          elim: false, paused: false, hide: false, secs: 0,
          calc: false, wide: false, ctab: 'graphing',
          drawer: false, grid: false, ref: false, ptab: 'passage'
        };
        const diffCache = {};
        let desG = null, desS = null;

        // ---------- данные ----------
        function safeGet(id) { try { return Data.getQuestion(id); } catch (e) { return null; } }
        function item(i) {
          if (!S.items[i]) S.items[i] = { q: safeGet(S.ids[i]), sel: null, text: '', struck: {}, checked: false, correct: null };
          return S.items[i];
        }
        const cur = function () { return item(S.idx); };
        function diffOf(i) {
          const it = S.items[i];
          if (it && it.q) return normDiff(it.q.difficulty);
          if (diffCache[i] === undefined) { const q = safeGet(S.ids[i]); diffCache[i] = normDiff(q && q.difficulty); }
          return diffCache[i];
        }
        const isMath = function (q) { return !!q && q.section === 'math'; };
        const $ = function (id) { return root.querySelector('#' + id); };

        // восстановление позиции после обновления страницы
        try {
          const saved = JSON.parse(sessionStorage.getItem(IDX_KEY) || 'null');
          if (saved && saved.sid === sess.id && saved.idx >= 0 && saved.idx < S.ids.length) S.idx = saved.idx;
        } catch (e) {}
        function saveIdx() { try { sessionStorage.setItem(IDX_KEY, JSON.stringify({ sid: sess.id, idx: S.idx })); } catch (e) {} }

        // ---------- каркас ----------
        const BTN = 'inline-flex items-center justify-center gap-2 h-11 min-w-[44px] px-3 rounded-lg border text-[13px] font-medium text-ink-soft hover:text-ink hover:bg-raised transition-colors';

        root.innerHTML =
          '<div id="svRoot" class="fixed inset-0 z-[50] flex flex-col bg-canvas text-ink">' +

          /* верхняя панель */
          '<header class="shrink-0 grid grid-cols-[1fr_auto_1fr] items-center gap-2 h-14 px-2 md:px-5 border-b bg-surface">' +
            '<div class="flex items-center min-w-0">' +
              '<button type="button" data-act="back" class="' + BTN + ' border-transparent" aria-label="Back to Question Bank"><i data-lucide="arrow-left" class="w-4 h-4"></i><span class="hidden sm:inline">Question Bank</span></button>' +
            '</div>' +
            '<div class="flex items-center gap-1">' +
              '<span id="svTime" class="num text-[15px] font-semibold tabular-nums min-w-[58px] text-center" role="timer" aria-label="Elapsed time">00:00</span>' +
              '<button type="button" id="svPauseBtn" data-act="pause" class="' + BTN + ' border-transparent px-2.5" aria-label="Pause timer"></button>' +
              '<button type="button" id="svHideBtn" data-act="hide" class="' + BTN + ' border-transparent px-2.5" aria-label="Hide timer"></button>' +
            '</div>' +
            '<div class="flex items-center justify-end gap-1.5">' +
              '<button type="button" id="svHlBtn" class="' + BTN + '" aria-pressed="false" aria-label="Highlights and notes"><i data-lucide="highlighter" class="w-4 h-4"></i><span class="hidden md:inline">Highlights &amp; Notes</span></button>' +
              '<button type="button" id="svCalcBtn" data-act="calc" class="' + BTN + '" aria-pressed="false" aria-label="Calculator"><i data-lucide="calculator" class="w-4 h-4"></i><span class="hidden md:inline">Calculator</span></button>' +
              '<button type="button" id="svRefBtn" data-act="ref" class="' + BTN + '" aria-label="Reference sheet"><i data-lucide="sigma" class="w-4 h-4"></i><span class="hidden md:inline">Reference</span></button>' +
            '</div>' +
          '</header>' +

          /* тело */
          '<div class="relative flex-1 min-h-0 flex">' +
            '<aside id="svCalc" class="sv-calc border-r bg-surface" hidden aria-label="Calculator">' +
              '<div class="shrink-0 flex items-center gap-2 h-12 px-3 border-b">' +
                '<div class="flex rounded-lg bg-raised p-0.5" role="tablist" aria-label="Calculator type">' +
                  '<button type="button" role="tab" data-act="ctab" data-ctab="graphing" class="h-8 px-3 rounded-md text-[12.5px] font-medium">Graphing</button>' +
                  '<button type="button" role="tab" data-act="ctab" data-ctab="scientific" class="h-8 px-3 rounded-md text-[12.5px] font-medium">Scientific</button>' +
                '</div>' +
                '<span class="flex-1"></span>' +
                '<button type="button" data-act="calcWide" class="hidden md:grid place-items-center w-9 h-9 rounded-lg text-ink-soft hover:text-ink hover:bg-raised" aria-label="Expand calculator"><i data-lucide="maximize-2" class="w-4 h-4"></i></button>' +
                '<button type="button" data-act="calcClose" class="grid place-items-center w-11 h-11 md:w-9 md:h-9 rounded-lg text-ink-soft hover:text-ink hover:bg-raised" aria-label="Close calculator"><i data-lucide="x" class="w-[18px] h-[18px]"></i></button>' +
              '</div>' +
              '<div class="relative flex-1 min-h-0 bg-white">' +
                '<div id="svDesG" class="absolute inset-0"></div>' +
                '<div id="svDesS" class="absolute inset-0" hidden></div>' +
                '<div id="svDesMsg" class="absolute inset-0 grid place-items-center p-6 text-center text-[13px] text-neutral-500 bg-surface" hidden></div>' +
              '</div>' +
            '</aside>' +
            '<main id="svMain" class="flex-1 min-w-0 overflow-y-auto" tabindex="-1"></main>' +
            '<div id="svPause" class="absolute inset-0 z-20 grid place-items-center bg-canvas/85 backdrop-blur-md sv-fade" hidden>' +
              '<div class="text-center px-6"><div class="text-[20px] font-semibold">Timer paused</div>' +
              '<p class="mt-1.5 text-[13.5px] text-ink-soft">Your question is hidden while the timer is paused.</p>' +
              '<button type="button" data-act="pause" class="btn-pill mt-5 inline-flex"><i data-lucide="play" class="w-4 h-4"></i>Resume</button></div>' +
            '</div>' +
          '</div>' +

          '<footer id="svBottom" class="shrink-0 border-t bg-surface"></footer>' +

          /* поповер-сетка */
          '<div id="svGrid" class="sv-pop rounded-2xl border bg-raised shadow-2xl" role="dialog" aria-label="Question navigator" hidden></div>' +

          /* шторка Explanation */
          '<div id="svDrawer" class="fixed inset-0 z-[70]" hidden>' +
            '<div class="absolute inset-0 bg-black/35 sv-fade" data-act="closeDrawer"></div>' +
            '<aside class="sv-drawer bg-surface border-l shadow-2xl" role="dialog" aria-modal="true" aria-label="Explanation">' +
              '<div class="shrink-0 flex items-center justify-between h-14 px-5 border-b"><h2 class="text-[15px] font-semibold">Explanation</h2>' +
              '<button type="button" data-act="closeDrawer" class="grid place-items-center w-11 h-11 md:w-9 md:h-9 rounded-lg text-ink-soft hover:text-ink hover:bg-raised" aria-label="Close explanation"><i data-lucide="x" class="w-[18px] h-[18px]"></i></button></div>' +
              '<div id="svDrawerBody" class="flex-1 overflow-y-auto p-5"></div>' +
            '</aside>' +
          '</div>' +

          /* Reference Sheet */
          '<div id="svRef" class="fixed inset-0 z-[80] grid place-items-center bg-black/60 p-0 md:p-6 sv-fade" hidden>' +
            '<div class="w-full max-w-[900px] h-full md:h-auto md:max-h-[90vh] flex flex-col rounded-none md:rounded-2xl border bg-surface shadow-2xl" role="dialog" aria-modal="true" aria-label="Reference sheet">' +
              '<div class="shrink-0 flex items-center justify-between h-14 px-5 border-b"><h2 class="text-[15px] font-semibold">Reference Sheet</h2>' +
              '<button type="button" data-act="refClose" class="grid place-items-center w-11 h-11 md:w-9 md:h-9 rounded-lg text-ink-soft hover:text-ink hover:bg-raised" aria-label="Close reference sheet"><i data-lucide="x" class="w-[18px] h-[18px]"></i></button></div>' +
              '<div class="flex-1 overflow-y-auto p-5">' + referenceHTML() + '</div>' +
            '</div>' +
          '</div>' +

          /* итог сессии */
          '<div id="svSummary" class="fixed inset-0 z-[80] grid place-items-center bg-black/60 p-4 sv-fade" hidden></div>' +
          '</div>';

        const elMain = $('svMain'), elFoot = $('svBottom'), elGrid = $('svGrid'), elDrawer = $('svDrawer'),
              elDrawerBody = $('svDrawerBody'), elRef = $('svRef'), elSum = $('svSummary'), elCalc = $('svCalc'),
              elTime = $('svTime'), elPause = $('svPause');
                // ---------- Highlights & Notes (highlighter.js) и Saved (review.js) ----------
        const HL = window.SPHighlight ? window.SPHighlight.create({
          root: elMain,
          mount: $('svRoot'),
          button: $('svHlBtn'),
          bottomEl: elFoot,
          getId: function () { const q = cur().q; return q ? q.id : null; }
        }) : null;
        if (HL) cleanups.push(function () { HL.destroy(); });
        else $('svHlBtn').hidden = true;

        function saveBtnHTML(q) {
          const on = !!(window.SPReview && window.SPReview.isSaved(q.id));
          return '<button type="button" data-act="save" aria-pressed="' + on + '" aria-label="' + (on ? 'Remove bookmark' : 'Save question') + '" title="' + (on ? 'Saved' : 'Save') + '" class="inline-flex h-11 w-11 md:h-9 md:w-9 items-center justify-center rounded-lg border transition-colors ' + (on ? 'border-accent bg-accent/10 text-accent' : 'text-ink-soft hover:text-ink hover:bg-raised') + '">' +
            '<svg viewBox="0 0 24 24" width="16" height="16" fill="' + (on ? 'currentColor' : 'none') + '" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg></button>';
        }
        function toggleSave() {
          const q = cur().q;
          if (!q) return;
          if (!window.SPReview) { Shell.toast('Saved is not available — add review.js'); return; }
          const on = window.SPReview.toggleSaved(q.id);
          Shell.toast(on ? 'Saved' : 'Removed from Saved');
          paintMain(); icons();
        }
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        cleanups.push(function () { document.body.style.overflow = prevOverflow; });

        /* ============================ ОТРИСОВКА ============================ */
        function optionHTML(it, c) {
          const q = it.q;
          const struck = !!it.struck[c.key];
          const sel = it.sel === c.key;
          let cls = 'border bg-surface hover:bg-raised';
          let letter = 'border text-ink-soft';
          if (it.checked) {
            if (c.key === q.correctAnswer) { cls = 'border-success bg-success/10'; letter = 'bg-success border-success text-white'; }
            else if (sel) { cls = 'border-danger bg-danger/10'; letter = 'bg-danger border-danger text-white'; }
            else cls = 'border bg-surface';
          } else if (sel) { cls = 'border-accent bg-accent/10'; letter = 'bg-accent border-accent text-white'; }

          return '<div class="sv-opt group flex items-stretch gap-2" data-opt="' + esc(c.key) + '">' +
            '<button type="button" data-act="pick" data-key="' + esc(c.key) + '" ' + (it.checked ? 'disabled ' : '') +
              'aria-pressed="' + sel + '" class="flex-1 min-w-0 flex items-center gap-3 min-h-[52px] px-4 py-2.5 rounded-xl text-left transition-colors ' + cls + '">' +
              '<span class="shrink-0 w-7 h-7 rounded-full grid place-items-center text-[13px] font-semibold ' + letter + '">' + esc(c.key) + '</span>' +
              '<span class="sv-txt flex-1 min-w-0 text-[15px] leading-snug' + (struck ? ' struck' : '') + '">' + rich(c.text) + '</span>' +
            '</button>' +
            '<button type="button" data-act="strike" data-key="' + esc(c.key) + '" ' + (it.checked ? 'disabled ' : '') +
              'aria-pressed="' + struck + '" aria-label="' + (struck ? 'Restore' : 'Eliminate') + ' choice ' + esc(c.key) + '" ' +
              'class="sv-strike shrink-0 w-11 min-h-[44px] rounded-xl border grid place-items-center text-ink-soft hover:text-ink hover:bg-raised ' + (struck ? 'bg-raised text-ink' : '') + '">' + SVG.slash + '</button>' +
            '</div>';
        }

        function answerHTML(it) {
          const q = it.q;
          if (q.type === 'mcq') {
            return '<div class="mt-6 space-y-2.5' + (S.elim ? ' sv-elim' : '') + '" role="group" aria-label="Answer choices">' +
              q.choices.map(function (c) { return optionHTML(it, c); }).join('') + '</div>';
          }
          return '<div class="mt-6 max-w-[360px]">' +
            '<label for="svAns" class="block text-[12px] font-semibold uppercase tracking-[0.08em] text-ink-mute mb-2">Your answer</label>' +
            '<input id="svAns" type="text" inputmode="text" autocomplete="off" autocapitalize="off" spellcheck="false" maxlength="16" ' +
              'placeholder="Enter your answer" value="' + esc(it.text) + '" ' + (it.checked ? 'disabled ' : '') +
              'class="w-full h-12 rounded-xl border bg-surface px-4 text-[16px] num outline-none focus:border-accent disabled:opacity-70" />' +
            '<p class="mt-2 text-[12px] text-ink-mute">Fractions (3/4) and decimals (0.75) are accepted.</p></div>';
        }

        function resultHTML(it) {
          if (!it.checked) return '';
          const q = it.q, ok = it.correct;
          let mine, accepted, accLabel;
          if (q.type === 'mcq') {
            const find = function (k) { const c = q.choices.filter(function (x) { return x.key === k; })[0]; return c ? '<b>' + esc(c.key) + '</b> · ' + rich(c.text) : esc(k); };
            mine = find(it.sel);
            accepted = find(q.correctAnswer);
            accLabel = 'Correct answer';
          } else {
            mine = '<span class="num">' + esc(it.text) + '</span>';
            accepted = '<span class="num">' + (q.acceptedAnswers && q.acceptedAnswers.length ? q.acceptedAnswers.map(esc).join(', ') : esc(q.correctAnswer)) + '</span>';
            accLabel = 'Accepted answers';
          }
          return '<div id="svResult" role="status" aria-live="polite" class="mt-7 rounded-xl border p-4 ' + (ok ? 'border-success/40 bg-success/10' : 'border-danger/40 bg-danger/10') + '">' +
            '<div class="flex items-center gap-2 text-[15px] font-semibold ' + (ok ? 'text-success' : 'text-danger') + '">' +
              '<span class="w-5 h-5 rounded-full grid place-items-center text-white ' + (ok ? 'bg-success' : 'bg-danger') + '">' + (ok ? SVG.check : SVG.x) + '</span>' + (ok ? 'Correct' : 'Not quite') + '</div>' +
            '<div class="mt-3 grid gap-3 sm:grid-cols-2">' +
              '<div class="rounded-lg border bg-surface p-3"><div class="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-mute">Your answer</div><div class="mt-1 text-[14.5px] break-words">' + mine + '</div></div>' +
              '<div class="rounded-lg p-3 bg-success/10 border border-success/30"><div class="text-[11px] font-semibold uppercase tracking-[0.08em] text-success">' + accLabel + '</div><div class="mt-1 text-[14.5px] break-words">' + accepted + '</div></div>' +
            '</div>' +
            '<button type="button" data-act="expl" class="mt-3 inline-flex items-center h-11 text-[13.5px] font-medium text-accent hover:text-accent-hover">' + (ok ? 'View explanation' : 'Why was I wrong?') + ' →</button>' +
          '</div>';
        }

        function headHTML(it) {
          const q = it.q;
          const d = normDiff(q.difficulty);
          const crumbs = [SECTION_LABEL[q.section] || '', q.domain, q.skill].filter(Boolean).map(esc).join(' · ');
          return '<div class="flex flex-wrap items-center gap-2 mb-5">' +
            '<span class="num shrink-0 w-8 h-8 rounded-full bg-accent text-white grid place-items-center text-[13px] font-semibold" aria-label="Question ' + (S.idx + 1) + '">' + (S.idx + 1) + '</span>' +
            '<span class="min-w-0 text-[12.5px] text-ink-soft truncate max-w-full">' + crumbs + '</span>' +
            (d !== 'none' ? '<span class="sv-d-' + d + ' inline-flex items-center h-6 px-2.5 rounded-full text-[11.5px] font-semibold">' + DIFF_LABEL[d] + '</span>' : '') +
            '<span class="flex-1"></span>' + saveBtnHTML(q) +
            (q.type === 'mcq'
              ? '<button type="button" data-act="elim" aria-pressed="' + S.elim + '" class="inline-flex items-center gap-2 h-11 md:h-9 px-3 rounded-lg border text-[12.5px] font-medium transition-colors ' +
                  (S.elim ? 'border-accent bg-accent/15 text-accent' : 'text-ink-soft hover:text-ink hover:bg-raised') + '"><span class="line-through font-semibold tracking-wide text-[11px]">ABC</span>Eliminate</button>'
              : '') +
            '</div>';
        }

        function paintMain() { paintMainRaw(); if (HL) HL.refresh(); }
        function paintMainRaw() {
          const it = cur(), q = it.q;
          if (!q) {
            elMain.innerHTML = '<div class="mx-auto max-w-[460px] px-6 py-24 text-center"><p class="text-[16px] font-semibold">This question is unavailable</p>' +
              '<p class="mt-2 text-[13.5px] text-ink-soft">It may have been removed from the bank. Use Next to continue.</p></div>';
            return;
          }
          const hasPassage = q.section === 'rw' && q.passage && String(q.passage).trim();
          const body = headHTML(it) + '<div class="sv-prompt text-[16px] md:text-[17px] leading-relaxed">' + rich(q.prompt) + '</div>' + answerHTML(it) + resultHTML(it);

          if (hasPassage) {
            elMain.className = 'flex-1 min-w-0 overflow-y-auto md:overflow-hidden';
            elMain.innerHTML =
              '<div class="sv-split">' +
                '<div class="md:hidden sticky top-0 z-10 flex gap-1 p-2 bg-canvas border-b" role="tablist">' +
                  ['passage', 'question'].map(function (t) {
                    const on = S.ptab === t;
                    return '<button type="button" role="tab" data-act="ptab" data-ptab="' + t + '" aria-selected="' + on + '" class="flex-1 h-11 rounded-lg text-[13.5px] font-medium ' + (on ? 'bg-raised text-ink' : 'text-ink-soft') + '">' + (t === 'passage' ? 'Passage' : 'Question') + '</button>';
                  }).join('') +
                '</div>' +
                '<section class="sv-pane md:border-r px-5 py-6 md:px-10 md:py-10" data-on="' + (S.ptab === 'passage' ? 1 : 0) + '" aria-label="Passage">' +
                  '<div class="sv-prompt max-w-[620px] mx-auto text-[16px] leading-[1.75]">' + rich(q.passage) + '</div></section>' +
                '<section class="sv-pane px-5 py-6 md:px-10 md:py-10" data-on="' + (S.ptab === 'question' ? 1 : 0) + '" aria-label="Question">' +
                  '<div class="max-w-[620px] mx-auto">' + body + '</div></section>' +
              '</div>';
          } else {
            elMain.className = 'flex-1 min-w-0 overflow-y-auto';
            elMain.innerHTML = '<div class="mx-auto w-full max-w-[780px] px-4 md:px-8 py-6 md:py-10"><div class="card p-5 md:p-9">' + body + '</div></div>';
          }

          if (window.renderMathInElement) {
            try {
              window.renderMathInElement(elMain, { delimiters: [{ left: '$$', right: '$$', display: true }, { left: '\\(', right: '\\)', display: false }, { left: '$', right: '$', display: false }], throwOnError: false });
            } catch (e) {}
          }
        }

        function paintTop() {
          const q = cur().q;
          const math = isMath(q);
          $('svCalcBtn').hidden = !math;
          $('svRefBtn').hidden = !math;
          if (!math && S.calc) { S.calc = false; applyCalc(); }
          const pb = $('svPauseBtn'), hb = $('svHideBtn');
          pb.innerHTML = '<i data-lucide="' + (S.paused ? 'play' : 'pause') + '" class="w-4 h-4"></i><span class="hidden lg:inline">' + (S.paused ? 'Resume' : 'Pause') + '</span>';
          pb.setAttribute('aria-label', S.paused ? 'Resume timer' : 'Pause timer');
          hb.innerHTML = '<i data-lucide="' + (S.hide ? 'eye' : 'eye-off') + '" class="w-4 h-4"></i><span class="hidden lg:inline">' + (S.hide ? 'Show' : 'Hide') + '</span>';
          hb.setAttribute('aria-label', S.hide ? 'Show timer' : 'Hide timer');
          elTime.style.visibility = S.hide ? 'hidden' : 'visible';
          elPause.hidden = !S.paused;
        }

        function paintFoot() {
          const it = cur(), q = it.q, n = S.ids.length;
          const canRemix = !!q && /^(m|rg):/.test(String(q.id));
          const last = S.idx === n - 1;
          elFoot.innerHTML =
            '<div class="sv-foot">' +
              '<button type="button" data-act="remix" aria-disabled="' + (!canRemix) + '" class="sv-rm ' + BTN + (canRemix ? '' : ' opacity-50') + '" title="Generate a similar question"><i data-lucide="refresh-cw" class="w-4 h-4"></i><span class="hidden sm:inline">Remix</span></button>' +
              '<button type="button" data-act="grid" aria-expanded="' + S.grid + '" aria-haspopup="dialog" class="sv-ct inline-flex items-center justify-center gap-2 h-11 px-4 rounded-lg border bg-raised hover:bg-surface text-[14px] font-semibold num transition-colors" aria-label="Open question navigator">' + (S.idx + 1) + ' / ' + n + '<i data-lucide="chevron-up" class="w-4 h-4 text-ink-soft"></i></button>' +
              '<div class="sv-rg">' +
                '<button type="button" data-act="expl" class="sv-ex ' + BTN + '" aria-label="Explanation"><i data-lucide="lightbulb" class="w-4 h-4"></i><span class="hidden md:inline">Explanation</span></button>' +
                '<button type="button" data-act="check" ' + (!q || it.checked ? 'disabled ' : '') + 'class="sv-ck inline-flex items-center justify-center gap-2 h-11 px-5 rounded-lg text-[13.5px] font-semibold text-white bg-accent hover:bg-accent-hover transition-colors disabled:opacity-40 disabled:hover:bg-accent">' + (it.checked ? 'Checked' : 'Check') + '</button>' +
                '<button type="button" data-act="prev" ' + (S.idx === 0 ? 'disabled ' : '') + 'class="sv-pv ' + BTN + ' disabled:opacity-40"><i data-lucide="chevron-left" class="w-4 h-4"></i><span>Previous</span></button>' +
                '<button type="button" data-act="next" class="sv-nx inline-flex items-center justify-center gap-1.5 h-11 pl-5 pr-4 rounded-full text-[13.5px] font-semibold bg-ink text-canvas hover:opacity-90 transition-opacity"><span>' + (last ? 'Finish' : 'Next') + '</span><i data-lucide="chevron-right" class="w-4 h-4"></i></button>' +
              '</div>' +
            '</div>';
        }

        function paintGrid() {
          elGrid.hidden = !S.grid;
          if (!S.grid) return;
          elGrid.style.bottom = (elFoot.offsetHeight + 10) + 'px';
          const n = S.ids.length;
          let tiles = '';
          for (let i = 0; i < n; i++) {
            const d = diffOf(i), it = S.items[i];
            let mk = '', state = 'not answered';
            if (it && it.checked) { mk = '<span class="sv-mk ' + (it.correct ? 'ok' : 'bad') + '">' + (it.correct ? SVG.check : SVG.x) + '</span>'; state = it.correct ? 'correct' : 'incorrect'; }
            tiles += '<button type="button" data-go="' + i + '" class="sv-tile sv-t-' + d + (i === S.idx ? ' sv-cur' : '') + '"' +
              (i === S.idx ? ' aria-current="true"' : '') + ' aria-label="Question ' + (i + 1) + ', ' + (DIFF_LABEL[d] || 'unrated') + ', ' + state + '"><span class="num">' + (i + 1) + '</span>' + mk + '</button>';
          }
          elGrid.innerHTML =
            '<div class="shrink-0 flex items-center justify-between gap-2 px-4 pt-3.5 pb-2.5">' +
              '<div class="min-w-0"><div class="text-[13.5px] font-semibold truncate">' + esc(S.sess.title || 'Questions') + '</div><div class="text-[11.5px] text-ink-soft num">' + n + ' questions</div></div>' +
              '<button type="button" data-act="grid" class="grid place-items-center w-11 h-11 md:w-8 md:h-8 rounded-lg text-ink-soft hover:text-ink hover:bg-surface" aria-label="Close navigator"><i data-lucide="x" class="w-4 h-4"></i></button>' +
            '</div>' +
            '<div class="shrink-0 flex flex-wrap items-center gap-x-4 gap-y-1.5 px-4 pb-3 text-[11.5px] text-ink-soft border-b">' +
              ['easy', 'medium', 'hard'].map(function (d) { return '<span><span class="sv-dot sv-d-' + d + '"></span>' + DIFF_LABEL[d] + '</span>'; }).join('') +
              '<span class="inline-flex items-center gap-1.5"><span class="sv-mk ok" style="position:static">' + SVG.check + '</span>Correct</span>' +
              '<span class="inline-flex items-center gap-1.5"><span class="sv-mk bad" style="position:static">' + SVG.x + '</span>Incorrect</span>' +
            '</div>' +
            '<div class="overflow-y-auto p-4"><div class="grid gap-2.5" style="grid-template-columns:repeat(auto-fill,minmax(44px,1fr))">' + tiles + '</div></div>';
          const curTile = elGrid.querySelector('.sv-cur');
          if (curTile && curTile.scrollIntoView) { try { curTile.scrollIntoView({ block: 'nearest' }); } catch (e) {} }
        }

        function paintDrawer() {
          elDrawer.hidden = !S.drawer;
          if (!S.drawer) return;
          const it = cur(), q = it.q;
          if (!q) { elDrawerBody.innerHTML = ''; return; }
          if (!it.checked) {
            elDrawerBody.innerHTML =
              '<div class="py-14 text-center"><div class="mx-auto w-12 h-12 rounded-xl bg-raised grid place-items-center text-ink-soft">' + SVG.lock + '</div>' +
              '<p class="mt-4 text-[15px] font-semibold">Explanation is locked</p>' +
              '<p class="mt-1.5 text-[13.5px] text-ink-soft">Answer the question and press Check to see the full solution.</p>' +
              '<button type="button" data-act="check" class="mt-5 inline-flex items-center h-11 px-5 rounded-lg bg-accent hover:bg-accent-hover text-white text-[13.5px] font-semibold">Check answer</button></div>';
            return;
          }
          const ok = it.correct;
          let correctTxt;
          if (q.type === 'mcq') {
            const c = q.choices.filter(function (x) { return x.key === q.correctAnswer; })[0];
            correctTxt = '<b>' + esc(q.correctAnswer) + '</b>' + (c ? ' · ' + rich(c.text) : '');
          } else {
            correctTxt = '<span class="num">' + (q.acceptedAnswers && q.acceptedAnswers.length ? q.acceptedAnswers.map(esc).join(', ') : esc(q.correctAnswer)) + '</span>';
          }
          elDrawerBody.innerHTML =
            '<div class="inline-flex items-center gap-2 h-8 px-3 rounded-full text-[13px] font-semibold ' + (ok ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger') + '">' + (ok ? SVG.check : SVG.x) + (ok ? 'Correct' : 'Not quite') + '</div>' +
            '<div class="mt-4 rounded-xl border border-success/30 bg-success/10 p-3.5"><div class="text-[11px] font-semibold uppercase tracking-[0.08em] text-success">' + (q.type === 'mcq' ? 'Correct answer' : 'Accepted answers') + '</div>' +
            '<div class="mt-1 text-[15px] break-words">' + correctTxt + '</div></div>' +
            '<h3 class="mt-6 mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-mute">Explanation</h3>' +
            (String(q.explanation || '').trim()
              ? '<div class="sv-prompt text-[14.5px] leading-[1.7]">' + rich(q.explanation) + '</div>'
              : '<p class="text-[13.5px] text-ink-soft">A step-by-step explanation is not available for this question yet.</p>');
          if (window.renderMathInElement) { try { window.renderMathInElement(elDrawerBody, { delimiters: [{ left: '$$', right: '$$', display: true }, { left: '\\(', right: '\\)', display: false }, { left: '$', right: '$', display: false }], throwOnError: false }); } catch (e) {} }
        }

        function paintAll() {
          paintTop();
          paintMain();
          paintFoot();
          paintGrid();
          paintDrawer();
          icons();
        }

        /* ============================ ДЕЙСТВИЯ ============================ */
        function goTo(i, keepFocus) {
          i = Math.max(0, Math.min(S.ids.length - 1, i));
          S.idx = i;
          S.ptab = 'passage';
          S.grid = false;
          saveIdx();
          paintAll();
          elMain.scrollTop = 0;
          const pane = elMain.querySelectorAll('.sv-pane');
          for (let k = 0; k < pane.length; k++) pane[k].scrollTop = 0;
          if (!keepFocus) focusInput();
        }
        function focusInput() {
          const inp = $('svAns');
          if (inp && !inp.disabled && window.matchMedia && matchMedia('(hover:hover)').matches) { try { inp.focus({ preventScroll: true }); } catch (e) {} }
        }

        function toggleStrike(key) {
          const it = cur();
          if (!it.q || it.checked) return;
          if (it.struck[key]) delete it.struck[key]; else { it.struck[key] = true; if (it.sel === key) it.sel = null; }
          paintMain(); icons();
        }
        function pick(key) {
          const it = cur();
          if (!it.q || it.checked || it.q.type !== 'mcq') return;
          if (S.elim) { toggleStrike(key); return; }
          delete it.struck[key];
          it.sel = key;
          paintMain(); icons();
        }

        function check() {
          const it = cur(), q = it.q;
          if (!q || it.checked) return;
          const input = q.type === 'mcq' ? it.sel : String(it.text || '').trim();
          if (!input) { Shell.toast(q.type === 'mcq' ? 'Select an answer first.' : 'Enter your answer first.'); return; }
          if (q.type !== 'mcq') it.text = input;
          it.correct = !!Data.checkAnswer(q, input);
          it.checked = true;
          try { Data.progress.record(q.id, it.correct); } catch (e) { console.error('[solver] progress.record', e); }
          paintAll();
          const r = $('svResult');
          if (r && r.scrollIntoView) { try { r.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch (e) {} }
        }

        function remix() {
          const it = cur();
          const nq = it.q ? Data.remix(it.q) : null;
          if (!nq) { Shell.toast('Remix is available for generated Math questions.'); return; }
          S.items[S.idx] = { q: nq, sel: null, text: '', struck: {}, checked: false, correct: null, remixed: true };
          S.drawer = false;
          paintAll();
          elMain.scrollTop = 0;
          Shell.toast('New variant generated');
          focusInput();
        }

        function next() { if (S.idx < S.ids.length - 1) goTo(S.idx + 1); else openSummary(); }
        function prev() { if (S.idx > 0) goTo(S.idx - 1); }

        function setPaused(v) { S.paused = v; paintTop(); icons(); }

        /* ---------- Calculator (Desmos) ---------- */
        function applyCalc() {
          elCalc.hidden = !S.calc;
          elCalc.setAttribute('data-wide', S.wide ? '1' : '0');
          const b = $('svCalcBtn');
          b.setAttribute('aria-pressed', String(S.calc));
          b.classList.toggle('bg-accent', S.calc);
          b.classList.toggle('text-white', S.calc);
          b.classList.toggle('border-accent', S.calc);
          elCalc.querySelectorAll('[data-ctab]').forEach(function (t) {
            const on = t.getAttribute('data-ctab') === S.ctab;
            t.setAttribute('aria-selected', String(on));
            t.className = 'h-8 px-3 rounded-md text-[12.5px] font-medium ' + (on ? 'bg-surface text-ink shadow-sm' : 'text-ink-soft hover:text-ink');
          });
          if (S.calc) mountCalc();
          resizeCalc();
        }
        function mountCalc() {
          const msg = $('svDesMsg');
          if (!window.Desmos) {
            msg.hidden = false;
            msg.textContent = 'Loading calculator…';
            loadDesmos().then(function () { if (alive && S.calc) { msg.hidden = true; buildCalc(); } }, function () {
              if (!alive) return;
              msg.hidden = false;
              msg.innerHTML = '<div><p class="font-medium text-ink">Calculator could not be loaded.</p><p class="mt-1">Check your internet connection and try again.</p>' +
                '<button type="button" data-act="calcRetry" class="mt-4 inline-flex items-center h-10 px-4 rounded-lg bg-accent hover:bg-accent-hover text-white text-[13px] font-semibold">Retry</button></div>';
            });
            return;
          }
          msg.hidden = true;
          buildCalc();
        }
        function buildCalc() {
          const dark = document.documentElement.classList.contains('dark');
          if (S.ctab === 'graphing') {
            if (!desG) { try { desG = window.Desmos.GraphingCalculator($('svDesG'), { keypad: true, expressions: true, settingsMenu: true, zoomButtons: true, border: false, invertedColors: dark }); } catch (e) { console.error(e); } }
            else { try { desG.updateSettings({ invertedColors: dark }); } catch (e) {} }
          } else {
            if (!desS) { try { desS = window.Desmos.ScientificCalculator($('svDesS'), {}); } catch (e) { console.error(e); } }
          }
          $('svDesG').hidden = S.ctab !== 'graphing';
          $('svDesS').hidden = S.ctab !== 'scientific';
          resizeCalc();
        }
        function resizeCalc() {
          requestAnimationFrame(function () {
            try { if (desG) desG.resize(); } catch (e) {}
            try { if (desS) desS.resize(); } catch (e) {}
          });
        }
        cleanups.push(function () {
          try { if (desG) desG.destroy(); } catch (e) {}
          try { if (desS) desS.destroy(); } catch (e) {}
        });

        /* ---------- модалки ---------- */
        function setRef(v) { S.ref = v; elRef.hidden = !v; if (v) { const b = elRef.querySelector('[data-act="refClose"]'); if (b) b.focus(); } }
        function setDrawer(v) { S.drawer = v; paintDrawer(); icons(); if (v) { const b = elDrawer.querySelector('button[data-act="closeDrawer"]'); if (b) b.focus(); } }
        function setGrid(v) { S.grid = v; paintGrid(); icons(); paintFoot(); icons(); }

        function openSummary() {
          let answered = 0, ok = 0;
          S.items.forEach(function (it) { if (it && it.checked) { answered++; if (it.correct) ok++; } });
          const total = S.ids.length;
          const pct = answered ? Math.round(ok / answered * 100) : 0;
          elSum.innerHTML =
            '<div class="w-full max-w-[420px] rounded-2xl border bg-surface p-6 shadow-2xl" role="dialog" aria-modal="true" aria-label="Session summary">' +
              '<h2 class="text-[20px] font-semibold tracking-tight">Session complete</h2>' +
              '<p class="mt-1 text-[13.5px] text-ink-soft">' + esc(S.sess.title || 'Practice') + '</p>' +
              '<div class="mt-5 grid grid-cols-3 gap-3 text-center">' +
                '<div class="rounded-xl bg-raised p-3"><div class="num text-[22px] font-semibold">' + ok + '<span class="text-ink-mute text-[15px]"> / ' + answered + '</span></div><div class="mt-0.5 text-[11.5px] text-ink-soft">Correct</div></div>' +
                '<div class="rounded-xl bg-raised p-3"><div class="num text-[22px] font-semibold">' + pct + '%</div><div class="mt-0.5 text-[11.5px] text-ink-soft">Accuracy</div></div>' +
                '<div class="rounded-xl bg-raised p-3"><div class="num text-[22px] font-semibold">' + fmtTime(S.secs) + '</div><div class="mt-0.5 text-[11.5px] text-ink-soft">Time</div></div>' +
              '</div>' +
              (answered < total ? '<p class="mt-4 text-[13px] text-ink-soft">' + (total - answered) + ' of ' + total + ' questions were not answered.</p>' : '') +
              '<div class="mt-6 flex flex-col-reverse sm:flex-row gap-2.5">' +
                '<button type="button" data-act="sumClose" class="flex-1 h-11 rounded-lg border text-[13.5px] font-medium hover:bg-raised">Keep reviewing</button>' +
                '<button type="button" data-act="back" class="flex-1 h-11 rounded-lg bg-accent hover:bg-accent-hover text-white text-[13.5px] font-semibold">Back to Question Bank</button>' +
              '</div></div>';
          elSum.hidden = false;
          const b = elSum.querySelector('[data-act="back"]');
          if (b) b.focus();
        }

        /* ============================ СОБЫТИЯ ============================ */
        function onClick(e) {
          const t = e.target;
          // клик вне поповера закрывает сетку
          if (S.grid && !t.closest('#svGrid') && !t.closest('[data-act="grid"]')) setGrid(false);

          const go = t.closest('[data-go]');
          if (go) { goTo(+go.getAttribute('data-go')); return; }

          const b = t.closest('[data-act]');
          if (!b || b.disabled) return;
          switch (b.getAttribute('data-act')) {
            case 'back': ctx.navigate('question-bank'); break;
            case 'pause': setPaused(!S.paused); break;
            case 'hide': S.hide = !S.hide; paintTop(); icons(); break;
            case 'calc': S.calc = !S.calc; applyCalc(); break;
            case 'calcClose': S.calc = false; applyCalc(); break;
            case 'calcWide': S.wide = !S.wide; applyCalc(); break;
            case 'calcRetry': mountCalc(); break;
            case 'ctab': S.ctab = b.getAttribute('data-ctab'); applyCalc(); break;
            case 'ref': setRef(true); break;
            case 'refClose': setRef(false); break;
            case 'pick': pick(b.getAttribute('data-key')); break;
            case 'strike': toggleStrike(b.getAttribute('data-key')); break;
            case 'elim': S.elim = !S.elim; paintMain(); icons(); break;
            case 'ptab': S.ptab = b.getAttribute('data-ptab'); paintMain(); break;
            case 'check': check(); break;
            case 'next': next(); break;
            case 'prev': prev(); break;
            case 'remix': remix(); break;
            case 'save': toggleSave(); break;
            case 'grid': setGrid(!S.grid); break;
            case 'expl': setDrawer(true); break;
            case 'closeDrawer': setDrawer(false); break;
            case 'sumClose': elSum.hidden = true; break;
          }
        }
        root.addEventListener('click', onClick);
        cleanups.push(function () { root.removeEventListener('click', onClick); });

        function onInput(e) {
          if (e.target && e.target.id === 'svAns') cur().text = e.target.value;
        }
        root.addEventListener('input', onInput);
        cleanups.push(function () { root.removeEventListener('input', onInput); });

        function onKey(e) {
          if (!alive) return;
          if (e.ctrlKey || e.metaKey || e.altKey) return;
          const tgt = e.target;
          if (e.key === 'Escape') {
            if (!elSum.hidden) elSum.hidden = true;
            else if (S.ref) setRef(false);
            else if (S.drawer) setDrawer(false);
            else if (S.grid) setGrid(false);
            return;
          }
          if (tgt && tgt.closest && tgt.closest('#svCalc')) return;
          if (S.ref || !elSum.hidden || S.paused) return;
          const typing = tgt && (tgt.tagName === 'INPUT' || tgt.tagName === 'TEXTAREA' || tgt.isContentEditable);
          if (typing) {
            if (e.key === 'Enter') { e.preventDefault(); check(); }
            return;
          }
          if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
          else if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
          else if (e.key === 'Enter') {
            if (tgt && tgt.closest && tgt.closest('button, a')) return;     // Enter на кнопке — обычный клик
            e.preventDefault();
            const it = cur();
            if (it.checked) next(); else check();
          } else {
            const it = cur();
            if (!it.q || it.q.type !== 'mcq' || it.checked) return;
            let idx = -1;
            if (/^[1-4]$/.test(e.key)) idx = +e.key - 1;
            else if (/^[a-dA-D]$/.test(e.key)) idx = e.key.toUpperCase().charCodeAt(0) - 65;
            if (idx >= 0 && it.q.choices[idx]) { e.preventDefault(); pick(it.q.choices[idx].key); }
          }
        }
        document.addEventListener('keydown', onKey);
        cleanups.push(function () { document.removeEventListener('keydown', onKey); });

        // Desmos: перекрасить при смене темы пользователем, пересчитать размер при ресайзе окна
        const onResize = function () { if (S.calc) resizeCalc(); if (S.grid) elGrid.style.bottom = (elFoot.offsetHeight + 10) + 'px'; };
        window.addEventListener('resize', onResize);
        cleanups.push(function () { window.removeEventListener('resize', onResize); });

        // ---------- секундомер ----------
        const timer = setInterval(function () {
          if (S.paused || document.hidden) return;
          S.secs++;
          elTime.textContent = fmtTime(S.secs);
        }, 1000);
        cleanups.push(function () { clearInterval(timer); });

        // ---------- Vocabulary: кнопка «+ Vocab» ----------
        if (window.SPVocab) {
          const vocab = window.SPVocab.attach({
            root: root,
            getId: function () { const q = cur().q; return q ? q.id : null; }
          });
          cleanups.push(function () { vocab.destroy(); });
        }

        applyCalc();
        paintAll();
        focusInput();
      }
    }
  });
})();
