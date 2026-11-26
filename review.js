/* =====================================================================
   SATPath — Saved & Review (review.js)
   ---------------------------------------------------------------------
   Экран  #/errors  («Saved & Errors») с двумя вкладками:

   REVIEW — лестница «Fix · Prove · Lock»
     Любая ошибка (в Solver, Question Bank, Daily Challenge) попадает на
     лестницу из трёх ступеней. Ступень закрывается верным ответом,
     когда вопрос «созрел» (due):
       Fix    — сразу: решить точно ту же задачу, на которой ошибся
       Prove  — на следующий день: Math возвращается с НОВЫМИ числами
                (запомнить ответ нельзя — нужно уметь решать)
       Lock   — ещё через 4 дня: последняя проверка → Mastered (+30 очков)
     Ошибка на любой ступени возвращает задачу на Fix.
     Math отслеживается по генератору, поэтому «слабая тема» закрывается
     именно навыком, а не конкретным вариантом.

   SAVED — закладки из Solver (кнопка-флажок в карточке вопроса).

   Публичный API (его использует shell.js и solver.js):
     SPReview.dueCount()  SPReview.isSaved(id)  SPReview.toggleSaved(id)
   Хранение: satpath_review_v1, satpath_saved_v1 (в ?demo=1 — только в памяти)
   Зависимости: shell.js, dataAdapter.js (подключать после них)
   ===================================================================== */
(function () {
  'use strict';

  const Shell = window.SPShell;
  const Data = window.SPData;
  if (!Shell || !Data) { console.error('[review] Подключите shell.js и dataAdapter.js ДО этого файла.'); return; }

  const DEMO = /[?&]demo=1(&|$)/.test(location.search);
  const K_REV = 'satpath_review_v1';
  const K_SAVED = 'satpath_saved_v1';
  const DAY = 864e5;
  const GAPS = [1, 4];            // дней до следующей ступени: после Fix -> 1, после Prove -> 4
  const MASTERY_BONUS = 30;       // очков за закрытую лестницу
  const SESSION_CAP = 15;         // вопросов в одной сессии повторения
  const IMPORT_CAP = 300;
  const STAGES = [
    { name: 'Fix',   line: 'Redo the exact question you missed' },
    { name: 'Prove', line: 'Tomorrow · Math returns with new numbers' },
    { name: 'Lock',  line: 'In 4 days · one last check' }
  ];
  const DIFFS = { easy: ['Easy', 'bg-success/10 text-success'], medium: ['Medium', 'bg-hl/15 text-hl'], hard: ['Hard', 'bg-danger/10 text-danger'] };

  /* ------------------------------ УТИЛИТЫ ------------------------------ */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  const sod = function (t) { const d = new Date(t); return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime(); };
  const secLabel = function (s) { return s === 'math' ? 'Math' : 'Reading & Writing'; };
  const fmt = function (n) { return Number(n).toLocaleString('en-US'); };

  const mem = {};
  function lsGet(k) {
    try { const v = localStorage.getItem(k); if (v !== null) return v; } catch (e) {}
    return Object.prototype.hasOwnProperty.call(mem, k) ? mem[k] : null;
  }
  function lsSet(k, v) {
    mem[k] = String(v);
    try { localStorage.setItem(k, String(v)); } catch (e) {}
  }
  function jget(k, f) { try { const r = lsGet(k); return r ? JSON.parse(r) : f; } catch (e) { return f; } }

  function ago(t) {
    const m = Math.round((Date.now() - t) / 60000);
    if (m < 1) return 'Just now';
    if (m < 60) return m + 'm ago';
    const h = Math.round(m / 60);
    if (h < 24) return h + 'h ago';
    return Math.round(h / 24) + 'd ago';
  }

  const famKey = function (id) {
    const m = /^(m|rg):(\d+):(\d+):\d+$/.exec(String(id));
    return m ? m[1] + ':' + m[2] + ':' + m[3] : String(id);
  };
  const isGen = function (id) { return /^(m|rg):\d+:\d+:\d+$/.test(String(id)); };
  const getQ = function (id) { try { return Data.getQuestion(id); } catch (e) { return null; } };

  function snippet(q) {
    const src = q.section === 'rw' && q.passage ? q.passage : q.prompt;
    const t = String(src || '')
      .replace(/<f>\s*([^<]*?)\s*\/\s*([^<]*?)\s*<\/f>/g, '($1)/($2)')
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&')
      .replace(/\s+/g, ' ').trim();
    return t.length > 150 ? t.slice(0, 147) + '…' : t;
  }
  const metaOf = function (q) {
    return { section: q.section, domain: q.domain, skill: q.skill, difficulty: q.difficulty, snip: snippet(q) };
  };

  /* ------------------------------ ХРАНИЛИЩЕ ------------------------------ */
  let REV = null, SAVED = null;
  function rev() {
    if (!REV) {
      const r = DEMO ? null : jget(K_REV, null);
      REV = r && typeof r === 'object' ? r : {};
      if (!REV.items || typeof REV.items !== 'object') REV.items = {};
      if (!REV.done || typeof REV.done !== 'object') REV.done = {};
    }
    return REV;
  }
  const saveRev = function () { if (!DEMO) lsSet(K_REV, JSON.stringify(rev())); };
  function saved() {
    if (!SAVED) {
      const s = DEMO ? null : jget(K_SAVED, null);
      SAVED = s && typeof s === 'object' ? s : {};
    }
    return SAVED;
  }
  const saveSaved = function () { if (!DEMO) lsSet(K_SAVED, JSON.stringify(saved())); };
  window.addEventListener('storage', function (e) {
    if (DEMO) return;
    if (e.key === K_REV) REV = null;
    if (e.key === K_SAVED) SAVED = null;
  });

  /* ------------------------------ ЛЕСТНИЦА ------------------------------ */
  function onAnswer(id, ok) {
    const R = rev(), key = famKey(id), it = R.items[key], now = Date.now();

    if (!ok) {
      if (it) { it.stage = 0; it.due = now; it.miss = (it.miss || 0) + 1; it.last = now; }
      else {
        const q = getQ(id);
        if (!q) return;
        R.items[key] = Object.assign({ key: key, ref: id, stage: 0, due: now, miss: 1, added: now, last: now }, metaOf(q));
      }
      delete R.done[key];
      saveRev();
      return;
    }

    if (!it || now < it.due) return;               // верный ответ засчитывается только «созревшей» задаче
    if (it.stage >= 2) {                           // Lock закрыт -> Mastered
      R.done[key] = { t: now, section: it.section, skill: it.skill, snip: it.snip };
      delete R.items[key];
      saveRev();
      let bonus = 0;
      try { if (Data.stats && Data.stats.addPoints) bonus = Data.stats.addPoints(MASTERY_BONUS, 'mastery'); } catch (e) {}
      Shell.toast('Mastered · ' + (it.skill || 'question') + (bonus ? ' · +' + bonus + ' pts' : ''));
      return;
    }
    it.due = sod(now) + GAPS[it.stage] * DAY;      // старая ступень определяет паузу
    it.stage += 1;
    it.last = now;
    saveRev();
    Shell.toast(STAGES[it.stage - 1].name + ' cleared · next step ' + (GAPS[it.stage - 1] === 1 ? 'tomorrow' : 'in ' + GAPS[it.stage - 1] + ' days'));
  }

  window.addEventListener('sp:progress', function (e) {
    const d = (e && e.detail) || {};
    if (!d.id) return;
    try { onAnswer(String(d.id), !!d.correct); } catch (err) { console.error('[review]', err); }
  });
  // мгновенная обратная связь по очкам
  window.addEventListener('sp:points', function (e) {
    const d = (e && e.detail) || {};
    if (d.why === 'correct' && d.points > 0) Shell.toast('+' + d.points + ' pts');
  });

  function items() { const R = rev(); return Object.keys(R.items).map(function (k) { return R.items[k]; }); }
  const sortItems = function (a, b) { return (a.due - b.due) || (a.stage - b.stage) || ((a.added || 0) - (b.added || 0)); };
  function summary() {
    const now = Date.now(), all = items().sort(sortItems);
    const S = { all: all, due: [], byStage: [0, 0, 0], mastered: Object.keys(rev().done).length };
    all.forEach(function (it) { if (it.due <= now) S.due.push(it); S.byStage[Math.min(2, it.stage)]++; });
    return S;
  }
  function dueLabel(it) {
    const now = Date.now();
    if (it.due <= now) return 'Due now';
    const n = Math.round((sod(it.due) - sod(now)) / DAY);
    return n <= 1 ? 'Tomorrow' : 'In ' + n + ' days';
  }

  // Fix — точная задача; Prove / Lock — свежий вариант для Math (и R&W-генераторов)
  function reviewIds(list) {
    return list.map(function (it) {
      if (it.stage > 0 && isGen(it.ref)) {
        try { const nq = Data.remix(it.ref); if (nq && nq.id) return nq.id; } catch (e) {}
      }
      return it.ref;
    });
  }

  /* ------------------------------ SAVED ------------------------------ */
  function toggleSaved(id) {
    id = String(id);
    const S = saved();
    if (S[id]) { delete S[id]; saveSaved(); return false; }
    const q = getQ(id);
    S[id] = Object.assign({ id: id, t: Date.now() },
      q ? metaOf(q) : { section: /^m:/.test(id) ? 'math' : 'rw', skill: '', domain: '', difficulty: '', snip: '' });
    saveSaved();
    return true;
  }

  function addToLadder(id) {
    id = String(id);
    const R = rev(), key = famKey(id);
    if (R.items[key]) return false;
    const q = getQ(id);
    if (!q) return false;
    const now = Date.now();
    R.items[key] = Object.assign({ key: key, ref: id, stage: 0, due: now, miss: 0, added: now, last: now }, metaOf(q));
    delete R.done[key];
    saveRev();
    return true;
  }

  window.SPReview = {
    dueCount: function () { const now = Date.now(); return items().filter(function (it) { return it.due <= now; }).length; },
    ladderCount: function () { return items().length; },
    masteredCount: function () { return Object.keys(rev().done).length; },
    savedCount: function () { return Object.keys(saved()).length; },
    isSaved: function (id) { return !!saved()[String(id)]; },
    toggleSaved: toggleSaved,
    addToLadder: addToLadder
  };

  /* ------------------------------ СЕССИИ ------------------------------ */
  function openSession(ids, title, startIdx) {
    if (!ids.length) { Shell.toast('Nothing to practice yet'); return; }
    if (!Data.solverReady) { Shell.toast('Session ready: ' + ids.length + ' questions · the Solver opens here once it is added'); return; }
    let sess = null;
    try {
      sess = Data.startSession({ section: 'all', status: 'all' });
      sess.ids = ids.slice();
      sess.title = title;
      sess.section = 'all'; sess.domain = null; sess.skill = null; sess.shuffled = false;
      sessionStorage.setItem('satpath_session_v1', JSON.stringify(sess));
      sessionStorage.setItem('satpath_solver_idx_v1', JSON.stringify({ sid: sess.id, idx: startIdx || 0 }));
    } catch (e) { if (!sess) console.error('[review] startSession', e); }
    if (!sess) { Shell.toast('Could not open the Solver'); return; }
    Shell.navigate('solver');
  }
  const withData = function (fn) { Promise.resolve(Data.load()).then(fn, fn); };

  /* ------------------------------ DEMO ------------------------------ */
  let demoSeeded = false;
  function seedDemo() {
    if (!DEMO || demoSeeded) return;
    const ids = Data.query({ status: 'all' });
    if (ids.length < 8) return;
    demoSeeded = true;
    const R = rev(), S = saved(), now = Date.now(), step = Math.floor(ids.length / 14);
    const plan = [[0, 0], [0, 0], [0, 0], [1, 0], [1, 1], [2, 3], [2, 0], [0, 0]];   // [stage, due через N дней]
    plan.forEach(function (p, i) {
      const id = ids[i * step], q = getQ(id);
      if (!q) return;
      R.items[famKey(id)] = Object.assign({ key: famKey(id), ref: id, stage: p[0], due: p[1] ? sod(now) + p[1] * DAY : now, miss: 1 + (i % 3), added: now - i * 3600e3, last: now }, metaOf(q));
    });
    [9, 10].forEach(function (k) {
      const q = getQ(ids[k * step]);
      if (q) R.done[famKey(ids[k * step])] = { t: now - 864e5, section: q.section, skill: q.skill, snip: snippet(q) };
    });
    [11, 12, 13, 5].forEach(function (k, i) {
      const id = ids[k * step], q = getQ(id);
      if (q) S[id] = Object.assign({ id: id, t: now - (i + 1) * 5400e3 }, metaOf(q));
    });
  }

  /* ------------------------------ ЭКРАН ------------------------------ */
  function pipsHTML(stage) {
    return '<span class="inline-flex items-center gap-1" aria-hidden="true">' + [0, 1, 2].map(function (i) {
      return '<span class="h-2 w-2 rounded-full ' + (i < stage ? 'bg-accent' : 'border') + '"></span>';
    }).join('') + '</span>';
  }
  function diffBadge(d) {
    const x = DIFFS[String(d || '').toLowerCase()];
    return x ? '<span class="inline-flex h-5 items-center rounded-full px-2 text-[11px] font-semibold ' + x[1] + '">' + x[0] + '</span>' : '';
  }
  function chip(attr, val, label, on, count) {
    return '<button type="button" ' + attr + '="' + val + '" aria-pressed="' + on + '" class="h-11 shrink-0 rounded-full border px-3.5 text-[13px] font-medium text-ink-soft transition-colors hover:text-ink aria-pressed:border-accent aria-pressed:bg-accent/10 aria-pressed:text-accent sm:h-9">' +
      label + (count != null ? ' <span class="num text-ink-mute">' + count + '</span>' : '') + '</button>';
  }

  function view(root, ctx) {
    const P = ctx && ctx.params;
    const st = { tab: (P && (P.get('tab') === 'saved' || P.get('filter') === 'saved')) ? 'saved' : 'review', sec: 'all', when: 'all', q: '', importN: 0 };
    let alive = true;

    root.innerHTML =
      '<div id="rvBox" class="mx-auto w-full max-w-[1000px] px-4 py-6 md:px-8 md:py-10">' +
        '<div class="rise" style="--i:0">' +
          '<h1 class="text-[26px] font-semibold tracking-tight md:text-[30px]">Saved &amp; Errors</h1>' +
          '<p class="mt-1.5 text-[14px] text-ink-soft">Bookmark what matters. Turn every mistake into a skill you can prove.</p>' +
        '</div>' +
        '<div id="rvTabs" role="tablist" aria-label="Saved and Review" class="rise mt-6 inline-flex rounded-full border bg-surface p-1" style="--i:1"></div>' +
        '<div id="rvBody" class="mt-6"></div>' +
      '</div>';
    const box = root.querySelector('#rvBox'), tabs = root.querySelector('#rvTabs'), body = root.querySelector('#rvBody');
    const icons = function () { if (window.lucide) { try { window.lucide.createIcons(); } catch (e) {} } };

    function paintTabs() {
      const S = summary();
      tabs.innerHTML = [['review', 'Review', S.due.length], ['saved', 'Saved', Object.keys(saved()).length]].map(function (t) {
        const on = st.tab === t[0];
        return '<button type="button" role="tab" data-tab="' + t[0] + '" aria-selected="' + on + '" class="h-11 rounded-full px-5 text-[13.5px] font-medium text-ink-soft transition-colors hover:text-ink aria-selected:bg-raised aria-selected:text-ink sm:h-9">' +
          t[1] + ' <span class="num ' + (t[0] === 'review' && t[2] > 0 ? 'text-accent' : 'text-ink-mute') + '">' + t[2] + '</span></button>';
      }).join('');
    }

    /* ---------- REVIEW ---------- */
    function heroHTML(S) {
      const due = S.due.length, cap = Math.min(due, SESSION_CAP);
      const total = S.all.length + S.mastered, pct = total ? Math.round(S.mastered / total * 100) : 0;
      const hasSec = function (s) { return S.all.some(function (it) { return it.section === s; }); };
      const rungs = STAGES.map(function (g, i) {
        return '<div class="min-w-0 rounded-xl border bg-canvas/40 p-3.5">' +
          '<div class="flex items-center justify-between gap-2"><span class="text-[13px] font-semibold">' + g.name + '</span>' + pipsHTML(i + 1) + '</div>' +
          '<div class="num mt-2 text-[24px] font-semibold leading-none">' + S.byStage[i] + '</div>' +
          '<p class="mt-2 text-[11.5px] leading-snug text-ink-soft">' + g.line + '</p></div>';
      }).join('') +
        '<div class="min-w-0 rounded-xl border border-success/30 bg-success/10 p-3.5">' +
          '<div class="flex items-center justify-between gap-2"><span class="text-[13px] font-semibold text-success">Mastered</span><i data-lucide="check-circle-2" class="h-4 w-4 text-success"></i></div>' +
          '<div class="num mt-2 text-[24px] font-semibold leading-none">' + S.mastered + '</div>' +
          '<p class="mt-2 text-[11.5px] leading-snug text-ink-soft">+' + MASTERY_BONUS + ' pts each</p></div>';

      return '<section class="card rise p-5 md:p-7" style="--i:2">' +
        '<div class="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">' +
          '<div class="min-w-0">' +
            '<div class="kpi-label"><i data-lucide="rotate-ccw" class="h-4 w-4"></i>Turn mistakes into mastery</div>' +
            '<div class="mt-4 flex items-baseline gap-2"><span class="num text-[44px] font-semibold leading-none tracking-tight">' + due + '</span>' +
            '<span class="text-[14px] text-ink-soft">' + (due === 1 ? 'question' : 'questions') + ' due now</span></div>' +
            '<p class="mt-2 max-w-[460px] text-[13px] leading-relaxed text-ink-soft">Every mistake climbs three rungs — <b class="font-semibold text-ink">Fix</b>, <b class="font-semibold text-ink">Prove</b>, <b class="font-semibold text-ink">Lock</b>. A wrong answer sends it back to Fix. Math comes back with new numbers, so you prove the skill, not the memory.</p>' +
          '</div>' +
          '<div class="flex flex-wrap gap-2">' +
            '<button type="button" data-rv="start" ' + (due ? '' : 'disabled ') + 'class="btn-pill disabled:pointer-events-none disabled:opacity-40">' + (due ? 'Start review · ' + cap : 'All caught up') + (due ? ' <i data-lucide="arrow-right" class="h-4 w-4"></i>' : '') + '</button>' +
          '</div>' +
        '</div>' +
        '<div class="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">' + rungs + '</div>' +
        '<div class="mt-6">' +
          '<div class="flex items-center justify-between text-[12.5px]"><span class="text-ink-soft">Mistakes mastered</span><span class="num">' + S.mastered + ' of ' + total + '</span></div>' +
          '<div class="mt-2 h-1.5 overflow-hidden rounded-full bg-raised" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '" aria-label="Mistakes mastered"><div class="h-full rounded-full bg-success" style="width:' + pct + '%;transition:width .6s cubic-bezier(.2,.7,.2,1)"></div></div>' +
        '</div>' +
        '<div class="mt-5 flex flex-wrap gap-2">' +
          '<button type="button" data-rv="test" data-sec="rw" ' + (hasSec('rw') ? '' : 'disabled ') + 'class="inline-flex h-11 items-center gap-2 rounded-full border px-4 text-[13px] font-medium transition-colors hover:bg-raised disabled:pointer-events-none disabled:opacity-40 sm:h-9"><i data-lucide="play" class="h-3.5 w-3.5 fill-current text-accent"></i>R&amp;W error test</button>' +
          '<button type="button" data-rv="test" data-sec="math" ' + (hasSec('math') ? '' : 'disabled ') + 'class="inline-flex h-11 items-center gap-2 rounded-full border px-4 text-[13px] font-medium transition-colors hover:bg-raised disabled:pointer-events-none disabled:opacity-40 sm:h-9"><i data-lucide="play" class="h-3.5 w-3.5 fill-current text-accent"></i>Math error test</button>' +
        '</div>' +
      '</section>';
    }

    function rowHTML(it) {
      const due = it.due <= Date.now();
      return '<div class="flex items-center gap-2 border-t px-4 py-2 first:border-t-0 sm:gap-3" data-key="' + esc(it.key) + '">' +
        '<button type="button" data-rv="open" data-key="' + esc(it.key) + '" class="min-h-[56px] min-w-0 flex-1 rounded-lg py-1 text-left hover:bg-raised/50">' +
          '<span class="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-ink-soft"><span>' + secLabel(it.section) + '</span><span aria-hidden="true">·</span><span class="truncate">' + esc(it.skill || it.domain || '') + '</span>' + diffBadge(it.difficulty) + '</span>' +
          '<span class="mt-1 line-clamp-2 block text-[14px] leading-snug">' + esc(it.snip || 'Question') + '</span>' +
        '</button>' +
        '<div class="hidden shrink-0 text-right sm:block">' +
          '<div class="flex items-center justify-end gap-2 text-[12.5px] font-medium">' + pipsHTML(it.stage) + '<span>' + STAGES[Math.min(2, it.stage)].name + '</span></div>' +
          '<div class="mt-0.5 text-[12px] ' + (due ? 'text-accent' : 'text-ink-soft') + '">' + dueLabel(it) + (it.miss > 1 ? ' · missed ' + it.miss + '×' : '') + '</div>' +
        '</div>' +
        '<span class="shrink-0 text-[11.5px] sm:hidden ' + (due ? 'text-accent' : 'text-ink-soft') + '">' + dueLabel(it) + '</span>' +
        '<button type="button" data-rv="drop" data-key="' + esc(it.key) + '" aria-label="Remove from review" title="Remove from review" class="grid h-11 w-11 shrink-0 place-items-center rounded-lg text-ink-mute hover:bg-raised hover:text-ink"><i data-lucide="x" class="h-4 w-4"></i></button>' +
      '</div>';
    }

    function reviewListHTML() {
      const S = summary(), now = Date.now();
      let list = S.all.filter(function (it) {
        if (st.sec !== 'all' && it.section !== st.sec) return false;
        if (st.when === 'due' && it.due > now) return false;
        if (st.when === 'later' && it.due <= now) return false;
        return true;
      });
      if (!list.length) {
        return '<div class="px-6 py-12 text-center text-[13.5px] text-ink-soft">' + (S.all.length ? 'Nothing matches these filters.' : 'No mistakes on the ladder yet. Miss a question and it will show up here.') + '</div>';
      }
      return list.map(rowHTML).join('');
    }

    function paintReview() {
      const S = summary();
      const doneList = Object.keys(rev().done).map(function (k) { return rev().done[k]; }).sort(function (a, b) { return b.t - a.t; });
      const importBanner = st.importN > 0
        ? '<div class="rise mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-accent/30 bg-accent/10 px-4 py-3" style="--i:1">' +
            '<p class="text-[13px]"><b class="num">' + st.importN + '</b> earlier missed questions are not on the ladder yet.</p>' +
            '<button type="button" data-rv="import" class="inline-flex h-11 items-center rounded-lg bg-accent px-4 text-[13px] font-semibold text-white hover:bg-accent-hover sm:h-9">Add them to Review</button></div>'
        : '';
      body.innerHTML = importBanner + heroHTML(S) +
        '<section class="card rise mt-4 overflow-hidden" style="--i:3">' +
          '<div class="flex flex-wrap items-center gap-2 px-4 py-3.5">' +
            '<div class="flex gap-2 overflow-x-auto" role="group" aria-label="Section">' + chip('data-fsec', 'all', 'All', st.sec === 'all') + chip('data-fsec', 'rw', 'R&amp;W', st.sec === 'rw') + chip('data-fsec', 'math', 'Math', st.sec === 'math') + '</div>' +
            '<span class="mx-1 hidden h-5 w-px sm:block" style="background:var(--c-hairline)"></span>' +
            '<div class="flex gap-2 overflow-x-auto" role="group" aria-label="Schedule">' + chip('data-fwhen', 'all', 'All', st.when === 'all') + chip('data-fwhen', 'due', 'Due now', st.when === 'due', S.due.length) + chip('data-fwhen', 'later', 'Upcoming', st.when === 'later', S.all.length - S.due.length) + '</div>' +
          '</div>' +
          '<div id="rvList" class="border-t">' + reviewListHTML() + '</div>' +
        '</section>' +
        (doneList.length
          ? '<details class="card rise mt-4" style="--i:4"><summary class="flex min-h-[52px] cursor-pointer select-none items-center justify-between px-5 text-[14px] font-medium">Mastered <span class="num text-ink-soft">' + doneList.length + '</span></summary>' +
            '<div class="border-t">' + doneList.slice(0, 50).map(function (d) {
              return '<div class="flex items-center gap-3 border-t px-5 py-3 first:border-t-0"><i data-lucide="check-circle-2" class="h-4 w-4 shrink-0 text-success"></i>' +
                '<div class="min-w-0 flex-1"><div class="text-[12px] text-ink-soft">' + secLabel(d.section) + ' · ' + esc(d.skill || '') + '</div><div class="truncate text-[13.5px]">' + esc(d.snip || '') + '</div></div>' +
                '<span class="shrink-0 text-[12px] text-ink-mute">' + ago(d.t) + '</span></div>';
            }).join('') + '</div></details>'
          : '');
      icons();
    }

    /* ---------- SAVED ---------- */
    function savedFiltered() {
      const q = st.q.trim().toLowerCase();
      return Object.keys(saved()).map(function (k) { return saved()[k]; })
        .filter(function (s) {
          if (st.sec !== 'all' && s.section !== st.sec) return false;
          if (q && (String(s.skill || '') + ' ' + String(s.domain || '') + ' ' + String(s.snip || '')).toLowerCase().indexOf(q) < 0) return false;
          return true;
        })
        .sort(function (a, b) { return b.t - a.t; });
    }
    function savedListHTML() {
      const list = savedFiltered();
      if (!list.length) {
        return '<div class="px-6 py-12 text-center text-[13.5px] text-ink-soft">' +
          (Object.keys(saved()).length ? 'Nothing matches your search.' : 'No saved questions yet. Tap the bookmark on any question in the Solver to keep it here.') + '</div>';
      }
      return list.map(function (s) {
        const inLadder = !!rev().items[famKey(s.id)];
        return '<div class="flex items-center gap-1.5 border-t px-4 py-2 first:border-t-0 sm:gap-3">' +
          '<button type="button" data-rv="sopen" data-id="' + esc(s.id) + '" class="min-h-[56px] min-w-0 flex-1 rounded-lg py-1 text-left hover:bg-raised/50">' +
            '<span class="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-ink-soft"><span>' + secLabel(s.section) + '</span><span aria-hidden="true">·</span><span class="truncate">' + esc(s.skill || s.domain || '') + '</span>' + diffBadge(s.difficulty) + '<span class="text-ink-mute">· ' + ago(s.t) + '</span></span>' +
            '<span class="mt-1 line-clamp-2 block text-[14px] leading-snug">' + esc(s.snip || 'Question') + '</span>' +
          '</button>' +
          '<button type="button" data-rv="toladder" data-id="' + esc(s.id) + '" ' + (inLadder ? 'disabled ' : '') + 'title="' + (inLadder ? 'Already in Review' : 'Add to Review') + '" aria-label="' + (inLadder ? 'Already in Review' : 'Add to Review') + '" class="grid h-11 w-11 shrink-0 place-items-center rounded-lg text-ink-soft hover:bg-raised hover:text-ink disabled:opacity-40"><i data-lucide="' + (inLadder ? 'check' : 'rotate-ccw') + '" class="h-4 w-4"></i></button>' +
          '<button type="button" data-rv="unsave" data-id="' + esc(s.id) + '" aria-label="Remove bookmark" title="Remove bookmark" class="grid h-11 w-11 shrink-0 place-items-center rounded-lg text-accent hover:bg-raised"><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg></button>' +
        '</div>';
      }).join('');
    }
    function paintSaved() {
      const n = Object.keys(saved()).length;
      body.innerHTML =
        '<section class="card rise overflow-hidden" style="--i:2">' +
          '<div class="flex flex-wrap items-center gap-3 px-4 py-4">' +
            '<button type="button" data-rv="spractice" ' + (n ? '' : 'disabled ') + 'class="btn-pill disabled:pointer-events-none disabled:opacity-40">Practice <i data-lucide="arrow-right" class="h-4 w-4"></i></button>' +
            '<span class="text-[13.5px] text-ink-soft"><span class="num">' + n + '</span> ' + (n === 1 ? 'question' : 'questions') + '</span>' +
            '<div class="flex gap-2 overflow-x-auto sm:ml-auto" role="group" aria-label="Section">' + chip('data-fsec', 'all', 'All', st.sec === 'all') + chip('data-fsec', 'rw', 'R&amp;W', st.sec === 'rw') + chip('data-fsec', 'math', 'Math', st.sec === 'math') + '</div>' +
          '</div>' +
          '<div class="px-4 pb-4"><label class="sr-only" for="rvSearch">Search saved questions</label>' +
            '<input id="rvSearch" type="search" value="' + esc(st.q) + '" placeholder="Search by topic or skill — transitions, circles…" autocomplete="off" class="h-11 w-full rounded-xl border bg-canvas/40 px-4 text-[14px] outline-none focus:border-accent" /></div>' +
          '<div id="rvList" class="border-t">' + savedListHTML() + '</div>' +
        '</section>';
      icons();
    }

    function paint() { paintTabs(); if (st.tab === 'saved') paintSaved(); else paintReview(); }
    function paintList() {
      const el = body.querySelector('#rvList');
      if (!el) return;
      el.innerHTML = st.tab === 'saved' ? savedListHTML() : reviewListHTML();
      icons();
    }

    /* ---------- события ---------- */
    function countMissed() {
      withData(function () {
        if (!alive || DEMO) return;
        const R = rev();
        let n = 0;
        try {
          Data.query({ status: 'missed' }).forEach(function (id) { const k = famKey(id); if (!R.items[k] && !R.done[k]) n++; });
        } catch (e) {}
        st.importN = n;
        if (alive && st.tab === 'review' && n) paint();
      });
    }

    box.addEventListener('click', function (e) {
      const tab = e.target.closest('[data-tab]');
      if (tab) { st.tab = tab.getAttribute('data-tab'); st.sec = 'all'; st.when = 'all'; st.q = ''; paint(); return; }

      const fs = e.target.closest('[data-fsec]');
      if (fs) { st.sec = fs.getAttribute('data-fsec'); if (st.tab === 'saved') paintSaved(); else paintReview(); return; }
      const fw = e.target.closest('[data-fwhen]');
      if (fw) { st.when = fw.getAttribute('data-fwhen'); paintReview(); return; }

      const b = e.target.closest('[data-rv]');
      if (!b || b.disabled) return;
      const act = b.getAttribute('data-rv'), R = rev();

      if (act === 'start') {
        const due = summary().due.slice(0, SESSION_CAP);
        withData(function () { openSession(reviewIds(due), 'Review · Fix · Prove · Lock'); });
      } else if (act === 'test') {
        const sec = b.getAttribute('data-sec');
        const list = summary().all.filter(function (it) { return it.section === sec; }).slice(0, SESSION_CAP);
        withData(function () { openSession(reviewIds(list), sec === 'math' ? 'Math error test' : 'R&W error test'); });
      } else if (act === 'open') {
        const it = R.items[b.getAttribute('data-key')];
        if (it) withData(function () { openSession(reviewIds([it]), 'Review · ' + (it.skill || 'Question')); });
      } else if (act === 'drop') {
        delete R.items[b.getAttribute('data-key')];
        saveRev(); paint();
      } else if (act === 'import') {
        withData(function () {
          let n = 0;
          Data.query({ status: 'missed' }).forEach(function (id) {
            if (n >= IMPORT_CAP) return;
            const k = famKey(id);
            if (R.items[k] || R.done[k]) return;
            const q = getQ(id);
            if (!q) return;
            const now = Date.now();
            R.items[k] = Object.assign({ key: k, ref: id, stage: 0, due: now, miss: 1, added: now, last: now }, metaOf(q));
            n++;
          });
          saveRev(); st.importN = 0; paint();
          Shell.toast(n + ' questions added to Review');
        });
      } else if (act === 'spractice') {
        const ids = savedFiltered().map(function (s) { return s.id; });
        withData(function () { openSession(ids, 'Saved questions'); });
      } else if (act === 'sopen') {
        const ids = savedFiltered().map(function (s) { return s.id; });
        const i = ids.indexOf(b.getAttribute('data-id'));
        withData(function () { openSession(ids, 'Saved questions', Math.max(0, i)); });
      } else if (act === 'unsave') {
        toggleSaved(b.getAttribute('data-id'));
        paint();
      } else if (act === 'toladder') {
        withData(function () {
          if (addToLadder(b.getAttribute('data-id'))) Shell.toast('Added to Review · Fix');
          paint();
        });
      }
    });
    box.addEventListener('input', function (e) {
      if (e.target && e.target.id === 'rvSearch') { st.q = e.target.value; paintList(); }
    });

    if (DEMO) withData(function () { if (alive) { seedDemo(); paint(); } });
    paint();
    countMissed();

    return function () { alive = false; };
  }

  Shell.register('errors', { title: 'Saved & Errors', render: view });
})();
