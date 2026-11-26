/* =====================================================================
   SATPath — Question Bank (question-bank.js)
   ---------------------------------------------------------------------
   Экран Question Bank: фильтры статуса и сложности + две карточки
   (Reading & Writing / Math) с доменами, подтемами, счётчиками,
   кнопками Shuffle и Play.

   Зависимости (подключать ПОСЛЕ shell.js):  dataAdapter.js
   Регистрируется как маршрут  #/question-bank  через SPShell.register.
   Параметры ссылки:  #/question-bank?status=missed&difficulty=hard

   Клик по Play / Shuffle / домену / подтеме создаёт сессию:
     SPData.startSession({ section, domain, skill, status, difficulty, shuffle })
   и открывает маршрут #/solver (когда solver.js выставит SPData.solverReady = true).
   ===================================================================== */
(function () {
  'use strict';

  const Shell = window.SPShell;
  const Data = window.SPData;
  if (!Shell || !Data) {
    console.error('[question-bank] Подключите shell.js и dataAdapter.js ДО этого файла.');
    return;
  }

  const FKEY = 'satpath_qb_filters_v1';
  const STATUSES = [['unsolved', 'Unsolved'], ['solved', 'Solved'], ['missed', 'Missed'], ['all', 'All']];
  const DIFFS = [['all', 'All', ''], ['easy', 'Easy', 'bg-success'], ['medium', 'Medium', 'bg-hl'], ['hard', 'Hard', 'bg-danger']];
  const SECTIONS = { rw: 'Reading & Writing', math: 'Math' };

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  const fmt = function (n) { return Number(n).toLocaleString('en-US'); };
  const isIn = function (list, v) { return list.some(function (x) { return x[0] === v; }); };

  function loadFilters() {
    let f = {};
    try { f = JSON.parse(localStorage.getItem(FKEY) || '{}') || {}; } catch (e) {}
    return {
      status: isIn(STATUSES, f.status) ? f.status : 'unsolved',
      difficulty: isIn(DIFFS, f.difficulty) ? f.difficulty : 'all'
    };
  }
  function saveFilters(f) { try { localStorage.setItem(FKEY, JSON.stringify(f)); } catch (e) {} }

  /* ------------------------------ РАЗМЕТКА ------------------------------ */
  function skeletonHTML() {
    let rows = '';
    for (let i = 0; i < 8; i++) rows += '<div class="h-4 rounded bg-raised animate-pulse" style="width:' + (42 + (i * 17) % 44) + '%"></div>';
    const card = '<div class="card p-7 space-y-5" aria-hidden="true"><div class="h-7 w-48 rounded bg-raised animate-pulse"></div>' + rows + '</div>';
    return card + card;
  }

  function tabsHTML(st) {
    return STATUSES.map(function (s) {
      const on = st.status === s[0];
      return '<button type="button" role="tab" data-status="' + s[0] + '" aria-selected="' + on + '" tabindex="' + (on ? 0 : -1) + '" ' +
        'class="h-11 sm:h-9 shrink-0 rounded-full px-4 text-[13.5px] font-medium text-ink-soft transition-colors hover:text-ink aria-selected:bg-raised aria-selected:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60">' +
        s[1] + ' <span class="text-ink-mute">·</span> <span data-cnt="' + s[0] + '" class="tabular-nums">–</span></button>';
    }).join('');
  }

  function diffMenuHTML(st) {
    return DIFFS.map(function (d) {
      return '<button type="button" role="option" data-diff="' + d[0] + '" aria-selected="' + (st.difficulty === d[0]) + '" ' +
        'class="group flex w-full items-center gap-2.5 h-11 sm:h-9 rounded-lg px-3 text-left text-[13.5px] text-ink-soft transition-colors hover:bg-surface hover:text-ink focus-visible:bg-surface focus-visible:text-ink focus-visible:outline-none aria-selected:text-ink">' +
        (d[2] ? '<span class="w-2 h-2 rounded-full ' + d[2] + '"></span>' : '<span class="w-2 h-2 rounded-full bg-ink-mute"></span>') +
        '<span class="flex-1">' + d[1] + '</span>' +
        '<span class="opacity-0 group-aria-selected:opacity-100"><i data-lucide="check" class="w-4 h-4 text-accent"></i></span></button>';
    }).join('');
  }

  function layoutHTML(st) {
    return '<div class="mx-auto w-full max-w-[1180px] px-4 md:px-8 py-6 md:py-10">' +
      '<div class="rise relative z-20 flex flex-wrap items-center gap-3" style="--i:0">' +
        '<div id="qbTabs" role="tablist" aria-label="Question status" class="flex max-w-full items-center gap-0.5 overflow-x-auto rounded-full border bg-surface p-1">' + tabsHTML(st) + '</div>' +
        '<div class="relative" id="qbDiffWrap">' +
          '<button type="button" id="qbDiffBtn" aria-haspopup="listbox" aria-expanded="false" class="inline-flex h-11 sm:h-[46px] items-center gap-2 rounded-full border bg-surface px-4 text-[13.5px] text-ink-soft transition-colors hover:text-ink hover:border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60">' +
            'Difficulty: <b id="qbDiffLabel" class="font-semibold text-ink">All</b><i data-lucide="chevron-down" class="w-4 h-4"></i></button>' +
          '<div id="qbDiffMenu" role="listbox" aria-label="Difficulty" hidden class="absolute left-0 top-full z-30 mt-2 w-[190px] rounded-xl border bg-raised p-1.5 shadow-2xl">' + diffMenuHTML(st) + '</div>' +
        '</div>' +
      '</div>' +
      '<div id="qbGrid" class="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-2" aria-busy="true">' + skeletonHTML() + '</div>' +
    '</div>';
  }

  function rowHTML(sec, domain, skill, count, isDomain) {
    const attrs = 'data-act="' + (isDomain ? 'domain' : 'skill') + '" data-sec="' + sec + '" data-domain="' + esc(domain) + '"' +
      (isDomain ? '' : ' data-skill="' + esc(skill) + '"');
    return '<button type="button" ' + attrs + (count === 0 ? ' disabled' : '') + ' class="group flex w-full items-center gap-3 px-5 md:px-7 py-2 text-left transition-colors ' +
      'hover:bg-raised/60 focus-visible:bg-raised/60 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40 ' +
      (isDomain ? 'min-h-[48px] text-[15.5px] font-medium text-ink' : 'min-h-[44px] text-[14px] text-ink-soft hover:text-ink focus-visible:text-ink') + '">' +
      '<span class="min-w-0 flex-1 leading-snug">' + esc(isDomain ? domain : skill) + '</span>' +
      '<span class="tabular-nums ' + (isDomain ? 'text-[15px] text-ink' : 'text-[13.5px]') + '">' + fmt(count) + '</span>' +
      '<i data-lucide="chevron-right" class="w-4 h-4 shrink-0 text-ink-mute transition-transform group-hover:translate-x-0.5 group-hover:text-ink"></i></button>';
  }

  function cardHTML(sec, data, i, animate) {
    const title = esc(SECTIONS[sec]);
    const off = data.total === 0 ? ' disabled' : '';
    let h = '<section class="card ' + (animate ? 'rise ' : '') + 'overflow-hidden" ' + (animate ? 'style="--i:' + (i + 1) + '" ' : '') + 'aria-label="' + title + '">' +
      '<header class="flex items-center gap-2 px-5 md:px-7 py-5 md:py-6">' +
        '<div class="min-w-0 flex-1">' +
          '<h2 class="text-[21px] md:text-[24px] font-medium tracking-tight">' + title + '</h2>' +
          '<p class="mt-1 text-[13.5px] text-ink-soft tabular-nums">' + fmt(data.total) + (data.total === 1 ? ' question' : ' questions') + '</p>' +
        '</div>' +
        '<button type="button" data-act="shuffle" data-sec="' + sec + '"' + off + ' title="Shuffle" aria-label="Shuffle and play ' + title + '" ' +
          'class="grid h-11 w-11 place-items-center rounded-full text-accent transition-colors hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 disabled:pointer-events-none disabled:opacity-40">' +
          '<i data-lucide="shuffle" class="w-5 h-5"></i></button>' +
        '<button type="button" data-act="play" data-sec="' + sec + '"' + off + ' title="Play" aria-label="Play ' + title + '" ' +
          'class="grid h-12 w-12 place-items-center rounded-full bg-accent text-white transition hover:bg-accent-hover hover:shadow-[0_6px_20px_rgb(var(--c-accent)/0.35)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:pointer-events-none disabled:opacity-40">' +
          '<i data-lucide="play" class="w-5 h-5 fill-current"></i></button>' +
      '</header>';
    data.domains.forEach(function (d) {
      h += '<div class="border-t pt-2 pb-3">' + rowHTML(sec, d.name, null, d.count, true) +
        d.skills.map(function (s) { return rowHTML(sec, d.name, s.name, s.count, false); }).join('') + '</div>';
    });
    return h + '</section>';
  }

  function emptyHTML(info) {
    const miss = info.missingGlobals.length ? 'Missing: <span class="text-ink">' + info.missingGlobals.map(esc).join(', ') + '</span>. ' : '';
    const err = info.loadErrors.length ? 'Could not load: <span class="text-ink">' + info.loadErrors.map(esc).join(', ') + '</span>. ' : '';
    return '<div class="card lg:col-span-2 mx-auto w-full max-w-[560px] px-6 py-14 text-center">' +
      '<div class="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-raised text-accent"><i data-lucide="library-big" class="w-6 h-6"></i></div>' +
      '<h2 class="mt-5 text-[20px] font-semibold tracking-tight">No questions found</h2>' +
      '<p class="mt-2 text-[13.5px] leading-relaxed text-ink-soft">' + miss + err +
      'Place <span class="text-ink">theory.js</span>, <span class="text-ink">math-questions.js</span> and <span class="text-ink">rw-questions.js</span> next to this page, or call <span class="text-ink">SPData.addQuestions([...])</span>.</p></div>';
  }

  /* ------------------------------- ЭКРАН ------------------------------- */
  function viewQuestionBank(root, ctx) {
    const st = loadFilters();
    const qs = ctx && ctx.params;
    if (qs) {
      if (isIn(STATUSES, qs.get('status'))) st.status = qs.get('status');
      if (isIn(DIFFS, qs.get('difficulty'))) st.difficulty = qs.get('difficulty');
    }

    root.innerHTML = layoutHTML(st);
    const grid = root.querySelector('#qbGrid');
    const menu = root.querySelector('#qbDiffMenu');
    const diffBtn = root.querySelector('#qbDiffBtn');
    const wrap = root.querySelector('#qbDiffWrap');
    let dead = false, ready = false, animateNext = true, hasData = false;

    function icons() { if (window.lucide) window.lucide.createIcons(); }

    function paintFilters(tabs) {
      root.querySelectorAll('[data-status]').forEach(function (b) {
        const on = b.getAttribute('data-status') === st.status;
        b.setAttribute('aria-selected', on ? 'true' : 'false');
        b.setAttribute('tabindex', on ? '0' : '-1');
        if (tabs) b.querySelector('[data-cnt]').textContent = fmt(tabs[b.getAttribute('data-status')]);
      });
      menu.querySelectorAll('[data-diff]').forEach(function (o) {
        o.setAttribute('aria-selected', o.getAttribute('data-diff') === st.difficulty ? 'true' : 'false');
      });
      const cur = DIFFS.filter(function (d) { return d[0] === st.difficulty; })[0];
      root.querySelector('#qbDiffLabel').textContent = cur ? cur[1] : 'All';
    }

    function refresh() {
      if (!ready) return;
      const t = Data.tree({ status: st.status, difficulty: st.difficulty });
      paintFilters(t.tabs);
      grid.removeAttribute('aria-busy');
      if (!hasData) {
        grid.innerHTML = emptyHTML(Data.status());
      } else {
        grid.innerHTML = cardHTML('rw', t.sections.rw, 0, animateNext) + cardHTML('math', t.sections.math, 1, animateNext);
      }
      animateNext = false;
      icons();
    }

    function setStatus(v) {
      if (!isIn(STATUSES, v) || v === st.status) return;
      st.status = v; saveFilters(st); refresh();
    }
    function setDiff(v) {
      if (!isIn(DIFFS, v)) return;
      st.difficulty = v; saveFilters(st); refresh();
    }

    function openMenu(focusFirst) {
      menu.hidden = false;
      diffBtn.setAttribute('aria-expanded', 'true');
      if (focusFirst) {
        const sel = menu.querySelector('[aria-selected="true"]') || menu.querySelector('[data-diff]');
        if (sel) sel.focus();
      }
    }
    function closeMenu(refocus) {
      if (menu.hidden) return;
      menu.hidden = true;
      diffBtn.setAttribute('aria-expanded', 'false');
      if (refocus) diffBtn.focus();
    }

    function start(opts) {
      const session = Data.startSession({
        section: opts.section, domain: opts.domain, skill: opts.skill, shuffle: !!opts.shuffle,
        status: st.status, difficulty: st.difficulty
      });
      if (!session.ids.length) { Shell.toast('No questions match these filters'); return; }
      if (Data.solverReady) ctx.navigate('solver');
      else Shell.toast('Session ready: ' + fmt(session.ids.length) + (session.ids.length === 1 ? ' question' : ' questions') + ' · the Solver opens here once it is added');
    }

    /* ----- события (делегирование на корень экрана) ----- */
    root.addEventListener('click', function (e) {
      const tab = e.target.closest('[data-status]');
      if (tab) { setStatus(tab.getAttribute('data-status')); return; }

      if (e.target.closest('#qbDiffBtn')) { menu.hidden ? openMenu(false) : closeMenu(false); return; }

      const opt = e.target.closest('[data-diff]');
      if (opt) { setDiff(opt.getAttribute('data-diff')); closeMenu(true); return; }

      const btn = e.target.closest('[data-act]');
      if (!btn || btn.disabled) return;
      const act = btn.getAttribute('data-act');
      const o = { section: btn.getAttribute('data-sec') };
      if (act === 'shuffle') o.shuffle = true;
      if (act === 'domain' || act === 'skill') o.domain = btn.getAttribute('data-domain');
      if (act === 'skill') o.skill = btn.getAttribute('data-skill');
      start(o);
    });

    // Стрелки ← → в списке табов
    root.querySelector('#qbTabs').addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const ids = STATUSES.map(function (s) { return s[0]; });
      const i = ids.indexOf(st.status);
      const next = ids[(i + (e.key === 'ArrowRight' ? 1 : ids.length - 1)) % ids.length];
      setStatus(next);
      const el = root.querySelector('[data-status="' + next + '"]');
      if (el) el.focus();
      e.preventDefault();
    });

    // Клавиатура в меню сложности
    diffBtn.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); openMenu(true); }
    });
    menu.addEventListener('keydown', function (e) {
      const items = Array.prototype.slice.call(menu.querySelectorAll('[data-diff]'));
      const i = items.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length].focus(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
    });

    const onDocClick = function (e) { if (!wrap.contains(e.target)) closeMenu(false); };
    const onKey = function (e) { if (e.key === 'Escape') closeMenu(true); };
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKey);

    paintFilters(null);
    icons();

    Data.load().then(function () {
      if (dead) return;
      ready = true;
      hasData = Data.size() > 0;
      refresh();
    });

    return function () {
      dead = true;
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }

  Shell.register('question-bank', { render: viewQuestionBank });
})();
