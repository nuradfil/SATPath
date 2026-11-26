/* =====================================================================
   SATPath — Leaderboard (leaderboard.js)
   ---------------------------------------------------------------------
   Маршрут #/leaderboard. Реальные данные из Firestore (lb_YYYY-MM)
   через window.SPFirebase (firebaseAdapter.js).

   Подключать ПОСЛЕ shell.js, dataAdapter.js и firebaseAdapter.js.
   ===================================================================== */
(function () {
  'use strict';

  const Shell = window.SPShell;
  if (!Shell) {
    console.error('[leaderboard] Подключите shell.js ДО этого файла.');
    return;
  }

  const MIN_OFFSET = -5;      // текущий месяц и 5 предыдущих, как в старом сайте

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  const fmt = function (n) { return Number(n || 0).toLocaleString('en-US'); };
  const accuracy = function (r) { return r.q ? Math.min(100, Math.round(r.c / r.q * 100)) : 0; };
  function icons() { try { if (window.lucide) window.lucide.createIcons(); } catch (e) {} }

  function monthDate(offset) {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth() + offset, 1);
  }
  const monthName = function (d) { return d.toLocaleDateString('en-US', { month: 'long' }); };

  const CSS =
    '.lb-row{display:grid;align-items:center;column-gap:12px;grid-template-columns:36px minmax(0,1fr) auto}' +
    '.lb-wide{display:none}' +
    '@media (min-width:768px){' +
      '.lb-row{grid-template-columns:44px minmax(0,1.3fr) minmax(0,1fr) 84px 88px 80px;column-gap:16px}' +
      '.lb-wide{display:block}.lb-narrow{display:none}' +
    '}';
  function injectStyle() {
    if (document.getElementById('lbStyle')) return;
    const s = document.createElement('style');
    s.id = 'lbStyle';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  const AV_TONES = ['bg-accent/15 text-accent', 'bg-success/15 text-success', 'bg-hl/20 text-hl', 'bg-danger/15 text-danger'];
  function tone(id) {
    let h = 0;
    for (let i = 0; i < String(id).length; i++) h = (h * 31 + String(id).charCodeAt(i)) >>> 0;
    return AV_TONES[h % AV_TONES.length];
  }
  function initials(name) {
    const p = String(name).trim().split(/\s+/).filter(Boolean);
    return ((p[0] ? p[0].charAt(0) : '') + (p[1] ? p[1].charAt(0) : '')).toUpperCase() || '?';
  }
  function avatarHTML(r, size) {
    const letters = '<span class="grid h-full w-full place-items-center rounded-full text-[12.5px] font-semibold ' + tone(r.id) + '">' + esc(initials(r.name)) + '</span>';
    return '<span class="relative block shrink-0 ' + size + '" aria-hidden="true">' + letters +
      (r.photo ? '<img data-av src="' + esc(r.photo) + '" alt="" loading="lazy" referrerpolicy="no-referrer" class="absolute inset-0 h-full w-full rounded-full object-cover">' : '') +
      '</span>';
  }

  function rankHTML(rank) {
    const top = rank === 1 ? 'bg-hl/15 text-hl' : rank <= 3 ? 'bg-accent/15 text-accent' : 'text-ink-mute';
    return '<span class="num grid h-7 min-w-[28px] place-items-center justify-self-start rounded-lg px-1 text-[13px] font-semibold ' + top + '">' + fmt(rank) + '</span>';
  }

  function barHTML(pts, max) {
    const w = max > 0 ? Math.max(pts > 0 ? 3 : 0, Math.min(100, Math.round(pts / max * 100))) : 0;
    return '<span class="block h-1.5 overflow-hidden rounded-full bg-raised" aria-hidden="true"><span class="block h-full rounded-full bg-accent" style="width:' + w + '%"></span></span>';
  }

  function rowHTML(r, rank, max, mine) {
    return '<li class="lb-row min-h-[60px] border-t px-4 py-2.5 md:px-5 ' + (mine ? 'bg-accent/10 shadow-[inset_3px_0_0_rgb(var(--c-accent))]' : 'hover:bg-raised/50') + '"' + (mine ? ' aria-current="true"' : '') + '>' +
      rankHTML(rank) +
      '<div class="flex min-w-0 items-center gap-3">' + avatarHTML(r, 'h-9 w-9') +
        '<div class="min-w-0 flex-1">' +
          '<div class="flex min-w-0 items-center gap-2"><span class="truncate text-[13.5px] font-medium">' + esc(r.name) + '</span>' +
            (mine ? '<span class="shrink-0 rounded-full bg-accent px-2 py-0.5 text-[10.5px] font-semibold text-white">You</span>' : '') + '</div>' +
          '<div class="lb-narrow mt-1.5">' + barHTML(r.pts, max) + '</div>' +
          '<div class="lb-narrow mt-1 text-[11.5px] text-ink-soft"><span class="num">' + fmt(r.q) + '</span> questions · <span class="num">' + accuracy(r) + '%</span></div>' +
        '</div>' +
      '</div>' +
      '<div class="lb-wide">' + barHTML(r.pts, max) + '</div>' +
      '<span class="num text-right text-[13.5px] font-semibold">' + fmt(r.pts) + '<span class="lb-narrow text-[10.5px] font-medium text-ink-mute">pts</span></span>' +
      '<span class="lb-wide num text-right text-[13px] text-ink-soft">' + fmt(r.q) + '</span>' +
      '<span class="lb-wide num text-right text-[13px] text-ink-soft">' + accuracy(r) + '%</span>' +
    '</li>';
  }

  function statHTML(label, value) {
    return '<div class="rounded-xl bg-raised p-3.5 md:p-4"><div class="text-[11.5px] text-ink-soft">' + label + '</div>' +
      '<div class="num mt-1.5 text-[22px] font-semibold leading-none tracking-tight md:text-[26px]">' + value + '</div></div>';
  }

  function meCardHTML(d, offset) {
    const mon = monthName(monthDate(offset));
    if (!d.uid) {
      return '<section class="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between md:p-6">' +
        '<div class="min-w-0"><h2 class="text-[17px] font-semibold tracking-tight">Join the ranking</h2>' +
        '<p class="mt-1 text-[13.5px] text-ink-soft">Sign in to save your points and see where you stand.</p></div>' +
        '<button type="button" data-lb-act="signin" class="btn-pill shrink-0">Sign in <i data-lucide="arrow-right" class="h-4 w-4"></i></button></section>';
    }
    if (!d.me) {
      return '<section class="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between md:p-6">' +
        '<div class="min-w-0"><h2 class="text-[17px] font-semibold tracking-tight">Not ranked ' + (offset === 0 ? 'yet' : 'in ' + mon) + '</h2>' +
        '<p class="mt-1 text-[13.5px] text-ink-soft">' + (offset === 0 ? 'Answer a question to join the ' + mon + ' ranking.' : 'You have no points recorded for this month.') + '</p></div>' +
        (offset === 0 ? '<a href="#/question-bank" class="btn-pill shrink-0">Solve questions <i data-lucide="arrow-right" class="h-4 w-4"></i></a>' : '') + '</section>';
    }
    return '<section class="card grid gap-5 p-5 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:items-center md:p-6" aria-label="Your position">' +
      '<div class="flex items-center gap-4">' + avatarHTML(d.me, 'h-12 w-12') +
        '<div class="min-w-0"><div class="kpi-label">Your rank</div>' +
        '<div class="num mt-1 text-[34px] font-semibold leading-none tracking-tight"><span class="text-ink-mute">#</span>' + fmt(d.rank) + '</div>' +
        '<div class="mt-1.5 text-[12.5px] text-ink-soft">of ' + fmt(d.total) + (d.total === 1 ? ' student' : ' students') + ' in ' + mon + '</div></div></div>' +
      '<div class="grid grid-cols-3 gap-2.5 md:gap-3">' + statHTML('Points', fmt(d.me.pts)) + statHTML('Questions', fmt(d.me.q)) + statHTML('Accuracy', accuracy(d.me) + '%') + '</div>' +
    '</section>';
  }

  function tableHTML(d) {
    if (!d.rows.length) {
      return '<section class="card px-6 py-14 text-center"><div class="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-raised text-accent"><i data-lucide="trophy" class="h-6 w-6"></i></div>' +
        '<p class="mt-4 text-[15px] font-semibold">No one here yet</p><p class="mt-1.5 text-[13px] text-ink-soft">Be the first to earn points this month.</p></section>';
    }
    const max = Math.max.apply(null, d.rows.map(function (r) { return r.pts; }).concat([1]));
    let inTop = false;
    const rows = d.rows.map(function (r, i) {
      const mine = !!d.uid && r.id === d.uid;
      if (mine) inTop = true;
      return rowHTML(r, i + 1, max, mine);
    }).join('');
    const pinned = (!inTop && d.me && d.rank)
      ? '<li class="border-t bg-canvas/40 py-1.5 text-center text-[11px] text-ink-mute" aria-hidden="true">• • •</li>' + rowHTML(d.me, d.rank, max, true)
      : '';
    return '<section class="card overflow-hidden" aria-label="Top 20">' +
      '<div class="lb-row px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-mute md:px-5">' +
        '<span>Rank</span><span>Student</span><span class="lb-wide"></span><span class="text-right">Points</span>' +
        '<span class="lb-wide text-right">Questions</span><span class="lb-wide text-right">Accuracy</span></div>' +
      '<ol>' + rows + pinned + '</ol></section>';
  }

  function skeletonHTML() {
    let rows = '';
    for (let i = 0; i < 7; i++) {
      rows += '<div class="flex h-[60px] items-center gap-4 border-t px-5"><div class="h-7 w-7 animate-pulse rounded-lg bg-raised"></div>' +
        '<div class="h-9 w-9 animate-pulse rounded-full bg-raised"></div><div class="h-3.5 animate-pulse rounded bg-raised" style="width:' + (26 + (i * 13) % 30) + '%"></div></div>';
    }
    return '<div class="card h-[128px] animate-pulse" aria-hidden="true"></div><div class="card overflow-hidden" aria-hidden="true"><div class="h-11"></div>' + rows + '</div>';
  }

  function messageHTML(icon, title, text, retry) {
    return '<section class="card px-6 py-14 text-center"><div class="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-raised text-accent"><i data-lucide="' + icon + '" class="h-6 w-6"></i></div>' +
      '<p class="mt-4 text-[15px] font-semibold">' + title + '</p><p class="mx-auto mt-1.5 max-w-[440px] text-[13px] leading-relaxed text-ink-soft">' + text + '</p>' +
      (retry ? '<button type="button" data-lb-act="retry" class="mt-5 inline-flex h-11 items-center gap-2 rounded-lg bg-accent px-5 text-[13.5px] font-semibold text-white hover:bg-accent-hover"><i data-lucide="rotate-ccw" class="h-4 w-4"></i>Try again</button>' : '') +
      '</section>';
  }

  Shell.register('leaderboard', {
    render: function (root) {
      injectStyle();
      let alive = true;
      let offset = 0;
      let request = 0;

      const NAVBTN = 'grid h-11 w-11 place-items-center rounded-full text-ink-soft transition-colors hover:bg-raised hover:text-ink disabled:pointer-events-none disabled:opacity-30 sm:h-9 sm:w-9';

      root.innerHTML =
        '<div class="mx-auto w-full max-w-[1000px] space-y-5 px-4 py-6 md:px-8 md:py-10">' +
          '<div class="rise flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">' +
            '<div class="min-w-0"><h1 class="text-[26px] font-semibold tracking-tight md:text-[30px]">Leaderboard</h1>' +
            '<p id="lbSub" class="mt-1.5 text-[14px] text-ink-soft"></p></div>' +
            '<div class="flex items-center gap-2">' +
              '<div class="flex items-center rounded-full border bg-surface p-0.5">' +
                '<button type="button" data-lb-act="prev" class="' + NAVBTN + '" aria-label="Previous month"><i data-lucide="chevron-left" class="h-4 w-4"></i></button>' +
                '<span id="lbMonth" class="min-w-[124px] text-center text-[13px] font-medium" aria-live="polite"></span>' +
                '<button type="button" data-lb-act="next" class="' + NAVBTN + '" aria-label="Next month"><i data-lucide="chevron-right" class="h-4 w-4"></i></button>' +
              '</div>' +
              '<button type="button" data-lb-act="refresh" class="grid h-11 w-11 place-items-center rounded-full border bg-surface text-ink-soft transition-colors hover:bg-raised hover:text-ink" aria-label="Refresh ranking" title="Refresh"><i data-lucide="refresh-cw" class="h-4 w-4"></i></button>' +
            '</div>' +
          '</div>' +
          '<div id="lbBody" class="space-y-5"></div>' +
        '</div>';

      const body = root.querySelector('#lbBody');

      function paintHeader() {
        const d = monthDate(offset);
        const reset = monthDate(offset + 1).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        root.querySelector('#lbMonth').textContent = monthName(d) + ' ' + d.getFullYear();
        root.querySelector('#lbSub').textContent = 'Monthly ranking · Top 20 · ' + (offset === 0 ? 'Resets ' + reset : 'Final standings');
        root.querySelector('[data-lb-act="prev"]').disabled = offset <= MIN_OFFSET;
        root.querySelector('[data-lb-act="next"]').disabled = offset >= 0;
      }

      function load(force) {
        const id = ++request;
        paintHeader();
        const Fire = window.SPFirebase;
        if (!Fire) {
          body.innerHTML = messageHTML('plug', 'Leaderboard is not connected',
            /[?&]demo=1(&|$)/.test(location.search) ? 'Live rankings are turned off in demo mode.' : 'The account service is unavailable on this page.', false);
          icons();
          return;
        }
        body.setAttribute('aria-busy', 'true');
        body.innerHTML = skeletonHTML();
        Fire.fetchLeaderboard(offset, { force: !!force }).then(function (d) {
          if (!alive || id !== request) return;
          body.removeAttribute('aria-busy');
          body.innerHTML = meCardHTML(d, offset) + tableHTML(d);
          // если фото не загрузилось, остаются инициалы
          body.querySelectorAll('img[data-av]').forEach(function (img) {
            img.addEventListener('error', function () { img.remove(); });
          });
          icons();
        }).catch(function (e) {
          if (!alive || id !== request) return;
          console.error('[leaderboard]', e);
          body.removeAttribute('aria-busy');
          const denied = e && e.code === 'permission-denied';
          body.innerHTML = messageHTML(denied ? 'lock' : 'wifi-off', denied ? 'Sign in to view the ranking' : 'Could not load the leaderboard',
            denied ? 'The ranking is not available for this session.' : 'Check your internet connection and try again.', true) +
            (denied && !Fire.user() ? '<div class="text-center"><button type="button" data-lb-act="signin" class="btn-pill">Sign in</button></div>' : '');
          icons();
        });
      }

      function onClick(e) {
        const b = e.target.closest('[data-lb-act]');
        if (!b || b.disabled) return;
        const a = b.getAttribute('data-lb-act');
        if (a === 'prev') { offset = Math.max(MIN_OFFSET, offset - 1); load(false); }
        else if (a === 'next') { offset = Math.min(0, offset + 1); load(false); }
        else if (a === 'refresh' || a === 'retry') load(true);
        else if (a === 'signin' && window.SPFirebase) window.SPFirebase.openAuth();
      }
      root.addEventListener('click', onClick);

      const onAuth = function () { load(true); };
      window.addEventListener('sp:auth', onAuth);

      load(false);

      return function () {
        alive = false;
        root.removeEventListener('click', onClick);
        window.removeEventListener('sp:auth', onAuth);
      };
    }
  });
})();
