/* =====================================================================
   SATPath — Highlights & Notes (highlighter.js)
   ---------------------------------------------------------------------
   «Marker dock»: нажал Highlights & Notes — внизу появляется док с
   маркерами (жёлтый / голубой / розовый / подчёркивание) и ластиком.
   Выбери маркер и просто выделяй текст — он закрашивается сразу, без
   всплывающего тулбара. Клик по подсвеченному фрагменту открывает
   заметку (можно сменить цвет или удалить). Кнопка Notes в доке
   показывает список всех пометок вопроса.

   Подключается в solver.js (см. шаги в ответе):
     const HL = SPHighlight.create({ root, mount, button, bottomEl, getId });
     HL.refresh()  — вызывать после каждой перерисовки вопроса
     HL.destroy()  — при выходе из Solver

   Хранение: localStorage  satpath_hl_v1  { questionId: { t, r: [ {k,s,e,c,n} ] } }
     k — 'p' (passage) или 'q' (текст вопроса), s/e — смещения по тексту,
     c — цвет (y | b | p | u), n — заметка.
   ===================================================================== */
(function () {
  'use strict';

  const KEY = 'satpath_hl_v1';
  const MAX_QUESTIONS = 400;
  const TOOLS = {
    y: { label: 'Yellow marker', dot: '#FACC15' },
    b: { label: 'Blue marker',   dot: '#60A5FA' },
    p: { label: 'Pink marker',   dot: '#F472B6' },
    u: { label: 'Underline',     dot: '#F59E0B' }
  };

  /* ------------------------------ ХРАНИЛИЩЕ ------------------------------ */
  const mem = {};
  function lsGet(k) {
    try { const v = localStorage.getItem(k); if (v !== null) return v; } catch (e) {}
    return Object.prototype.hasOwnProperty.call(mem, k) ? mem[k] : null;
  }
  function lsSet(k, v) {
    mem[k] = String(v);
    try { localStorage.setItem(k, String(v)); } catch (e) {}
  }
  let DB = null;
  function db() {
    if (!DB) {
      try { DB = JSON.parse(lsGet(KEY) || '{}') || {}; } catch (e) { DB = {}; }
      if (typeof DB !== 'object') DB = {};
    }
    return DB;
  }
  window.addEventListener('storage', function (e) { if (e.key === KEY) DB = null; });

  function persist() {
    const d = db(), ids = Object.keys(d);
    if (ids.length > MAX_QUESTIONS) {
      ids.sort(function (a, b) { return (d[a].t || 0) - (d[b].t || 0); })
        .slice(0, ids.length - MAX_QUESTIONS).forEach(function (k) { delete d[k]; });
    }
    lsSet(KEY, JSON.stringify(d));
  }
  function getRanges(qid) {
    const e = db()[qid];
    return e && Array.isArray(e.r) ? e.r : [];
  }
  function putRanges(qid, arr) {
    const d = db();
    if (arr.length) d[qid] = { t: Date.now(), r: arr }; else delete d[qid];
    persist();
  }

  /* ------------------------------ МОДЕЛЬ ------------------------------ */
  // вырезает [s,e) из всех пометок контейнера k (пометка может разделиться на две)
  function subtract(arr, k, s, e) {
    const out = [];
    arr.forEach(function (r) {
      if (r.k !== k || r.e <= s || r.s >= e) { out.push(r); return; }
      if (r.s < s) out.push({ k: r.k, s: r.s, e: s, c: r.c, n: r.n || '' });
      if (r.e > e) out.push({ k: r.k, s: e, e: r.e, c: r.c, n: '' });
    });
    return out;
  }
  function sortRanges(arr) {
    return arr.sort(function (a, b) { return a.k === b.k ? a.s - b.s : (a.k < b.k ? -1 : 1); });
  }

  /* ------------------------------ DOM-ПОМОЩНИКИ ------------------------------ */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function unwrapMarks(el) {
    const marks = el.querySelectorAll('mark.sp-hl');
    for (let i = 0; i < marks.length; i++) {
      const m = marks[i], p = m.parentNode;
      while (m.firstChild) p.insertBefore(m.firstChild, m);
      p.removeChild(m);
    }
    el.normalize();
  }

  // list: [{ id, s, e, c, n }] без пересечений
  function paintRanges(el, list) {
    unwrapMarks(el);
    if (!list.length) return;
    const nodes = [];
    const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    let pos = 0, n;
    while ((n = w.nextNode())) {
      const len = n.nodeValue.length;
      nodes.push({ n: n, s: pos, e: pos + len });
      pos += len;
    }
    nodes.forEach(function (x) {
      const segs = list
        .filter(function (r) { return r.s < x.e && r.e > x.s; })
        .map(function (r) { return { a: Math.max(r.s, x.s) - x.s, b: Math.min(r.e, x.e) - x.s, r: r }; })
        .sort(function (p, q) { return q.a - p.a; });                 // с конца к началу
      segs.forEach(function (sg) {
        const node = x.n;
        if (sg.b < node.nodeValue.length) node.splitText(sg.b);
        const mid = sg.a > 0 ? node.splitText(sg.a) : node;
        const m = document.createElement('mark');
        m.className = 'sp-hl sp-hl-' + sg.r.c + (sg.r.n ? ' sp-hl-n' : '');
        m.setAttribute('data-hl', String(sg.r.id));
        mid.parentNode.insertBefore(m, mid);
        m.appendChild(mid);
      });
    });
  }

  function offsetOf(el, node, off) {
    const r = document.createRange();
    r.selectNodeContents(el);
    r.setEnd(node, off);
    return r.toString().length;
  }

  let styleDone = false;
  function ensureStyle() {
    if (styleDone || document.getElementById('spHlStyle')) { styleDone = true; return; }
    const s = document.createElement('style');
    s.id = 'spHlStyle';
    s.textContent =
      'mark.sp-hl{color:inherit;border-radius:3px;cursor:pointer;transition:filter .12s}' +
      'mark.sp-hl:hover{filter:brightness(1.18)}' +
      '.sp-hl-y{background:rgba(250,204,21,.42)}' +
      '.sp-hl-b{background:rgba(96,165,250,.38)}' +
      '.sp-hl-p{background:rgba(244,114,182,.38)}' +
      '.sp-hl-u{background:transparent;text-decoration:underline;text-decoration-color:#F59E0B;text-decoration-thickness:2px;text-underline-offset:3px}' +
      '.sp-hl-n::after{content:"";display:inline-block;width:6px;height:6px;margin-left:2px;border-radius:50%;background:#F59E0B;vertical-align:super}' +
      '.sp-hl-flash{animation:spHlFlash 1.1s ease}' +
      '@keyframes spHlFlash{0%,100%{box-shadow:0 0 0 0 rgba(245,158,11,0)}30%{box-shadow:0 0 0 4px rgba(245,158,11,.6)}}' +
      '[data-sp-pen="y"] ::selection{background:rgba(250,204,21,.55)}' +
      '[data-sp-pen="b"] ::selection{background:rgba(96,165,250,.55)}' +
      '[data-sp-pen="p"] ::selection{background:rgba(244,114,182,.55)}' +
      '[data-sp-pen="u"] ::selection{background:rgba(245,158,11,.4)}' +
      '[data-sp-pen="erase"] ::selection{background:rgba(239,68,68,.35)}' +
      '.sp-pen{position:relative;transition:transform .12s,box-shadow .12s}' +
      '.sp-pen:hover{transform:scale(1.08)}' +
      '.sp-pen[aria-pressed="true"]{box-shadow:0 0 0 2px rgb(var(--c-surface)),0 0 0 4px rgb(var(--c-accent));transform:scale(1.08)}' +
      '.sp-dock{animation:spDockIn .18s ease both}' +
      '@keyframes spDockIn{from{opacity:0;transform:translate(-50%,10px)}to{opacity:1;transform:translate(-50%,0)}}' +
      '@media (prefers-reduced-motion:reduce){.sp-dock,.sp-hl-flash{animation:none!important}}';
    document.head.appendChild(s);
    styleDone = true;
  }

  const SVG_ERASER = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/><path d="M22 21H7"/><path d="m5 11 9 9"/></svg>';
  const SVG_NOTE = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z"/><path d="M15 3v6h6"/></svg>';
  const SVG_X = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>';

  /* ------------------------------ ЭКЗЕМПЛЯР ------------------------------ */
  function create(opts) {
    opts = opts || {};
    ensureStyle();
    const root = opts.root;
    const mount = opts.mount || document.body;
    const btn = opts.button || null;
    const bottomEl = opts.bottomEl || null;

    let on = false, tool = 'y', curId = null;
    let dock = null, panel = null, pop = null, popIdx = -1;
    let ptrDown = false, selTimer = null, noteTimer = null;

    const arr = function () { return curId == null ? [] : getRanges(curId); };

    function containers() {
      return Array.prototype.map.call(root.querySelectorAll('.sv-prompt'), function (el) {
        return { el: el, k: el.closest('[aria-label="Passage"]') ? 'p' : 'q' };
      });
    }

    function commit(next) {
      if (curId == null) return;
      putRanges(curId, sortRanges(next));
      paintAll();
    }

    function paintAll() {
      const a = arr().map(function (r, i) { return { id: i, k: r.k, s: r.s, e: r.e, c: r.c, n: r.n || '' }; });
      containers().forEach(function (c) {
        paintRanges(c.el, a.filter(function (r) { return r.k === c.k; }));
      });
      paintDock();
    }

    /* ---------- выделение -> пометка ---------- */
    function tryApply() {
      if (!on || curId == null) return;
      const sel = window.getSelection && window.getSelection();
      if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return;
      const rg = sel.getRangeAt(0);
      const host = containers().filter(function (c) { return c.el.contains(rg.startContainer); })[0];
      if (!host) return;
      const total = host.el.textContent.length;
      let s = offsetOf(host.el, rg.startContainer, rg.startOffset);
      let e = host.el.contains(rg.endContainer) ? offsetOf(host.el, rg.endContainer, rg.endOffset) : total;
      const text = host.el.textContent;
      while (s < e && /\s/.test(text.charAt(s))) s++;
      while (e > s && /\s/.test(text.charAt(e - 1))) e--;
      if (e <= s) { sel.removeAllRanges(); return; }
      let next = subtract(arr(), host.k, s, e);
      if (tool !== 'erase') next.push({ k: host.k, s: s, e: e, c: tool, n: '' });
      sel.removeAllRanges();
      commit(next);
    }

    const onPtrDown = function () { ptrDown = true; };
    const onPtrUp = function (e) {
      ptrDown = false;
      if (e && e.pointerType === 'mouse') setTimeout(tryApply, 0);
    };
    const onSelChange = function () {
      if (!on) return;
      clearTimeout(selTimer);
      selTimer = setTimeout(function () { if (!ptrDown) tryApply(); }, 500);   // тач: ручки выделения
    };
    root.addEventListener('pointerdown', onPtrDown);
    document.addEventListener('pointerup', onPtrUp);
    document.addEventListener('pointercancel', onPtrUp);
    document.addEventListener('selectionchange', onSelChange);

    /* ---------- клик по пометке ---------- */
    const onRootClick = function (e) {
      const m = e.target.closest && e.target.closest('mark.sp-hl');
      if (!m || !root.contains(m)) return;
      const sel = window.getSelection && window.getSelection();
      if (sel && !sel.isCollapsed) return;
      const i = +m.getAttribute('data-hl');
      if (on && tool === 'erase') {
        const a = arr();
        if (a[i]) { a.splice(i, 1); commit(a); }
        return;
      }
      openPop(i, m);
    };
    root.addEventListener('click', onRootClick);

    /* ---------- поповер заметки ---------- */
    function closePop() {
      if (pop) { pop.remove(); pop = null; }
      popIdx = -1;
    }
    function placePop(anchor) {
      if (!pop) return;
      const r = anchor.getBoundingClientRect();
      const w = pop.offsetWidth, h = pop.offsetHeight;
      let top = r.bottom + 8;
      if (top + h > window.innerHeight - 8) top = Math.max(8, r.top - h - 8);
      const left = Math.max(8, Math.min(window.innerWidth - w - 8, r.left + r.width / 2 - w / 2));
      pop.style.top = top + 'px';
      pop.style.left = left + 'px';
    }
    function openPop(i, anchor) {
      const a = arr(), r = a[i];
      if (!r) return;
      closePop();
      popIdx = i;
      pop = document.createElement('div');
      pop.className = 'fixed z-[58] w-[min(300px,calc(100vw-16px))] rounded-xl border bg-raised p-3 shadow-2xl';
      pop.setAttribute('role', 'dialog');
      pop.setAttribute('aria-label', 'Highlight note');
      pop.innerHTML =
        '<div class="flex items-center gap-1">' +
          Object.keys(TOOLS).map(function (t) {
            return '<button type="button" data-hl-recolor="' + t + '" aria-pressed="' + (r.c === t) + '" aria-label="' + TOOLS[t].label + '" class="sp-pen grid h-9 w-9 place-items-center rounded-full">' +
              (t === 'u'
                ? '<span class="text-[14px] font-semibold underline decoration-[#F59E0B] decoration-2 underline-offset-[3px]">U</span>'
                : '<span class="block h-4 w-4 rounded-full" style="background:' + TOOLS[t].dot + '"></span>') + '</button>';
          }).join('') +
          '<span class="flex-1"></span>' +
          '<button type="button" data-hl-del class="h-9 rounded-lg px-2.5 text-[12.5px] font-medium text-danger hover:bg-danger/10">Remove</button>' +
          '<button type="button" data-hl-done class="h-9 rounded-lg bg-accent px-3 text-[12.5px] font-semibold text-white hover:bg-accent-hover">Done</button>' +
        '</div>' +
        '<textarea maxlength="500" placeholder="Add a note…" aria-label="Note" class="mt-2.5 h-24 w-full resize-none rounded-lg border bg-surface p-2.5 text-[13.5px] leading-snug outline-none focus:border-accent">' + esc(r.n || '') + '</textarea>';
      mount.appendChild(pop);
      placePop(anchor);

      const ta = pop.querySelector('textarea');
      ta.addEventListener('keydown', function (e) {
        e.stopPropagation();                      // чтобы Enter / цифры не попадали в горячие клавиши Solver
        if (e.key === 'Escape') closePop();
      });
      ta.addEventListener('input', function () {
        const cur = arr();
        if (!cur[popIdx]) return;
        cur[popIdx].n = ta.value;
        const has = !!ta.value.trim();
        root.querySelectorAll('mark.sp-hl[data-hl="' + popIdx + '"]').forEach(function (m) { m.classList.toggle('sp-hl-n', has); });
        clearTimeout(noteTimer);
        noteTimer = setTimeout(function () { putRanges(curId, cur); paintDock(); }, 300);
      });
      pop.addEventListener('click', function (e) {
        const rc = e.target.closest('[data-hl-recolor]');
        if (rc) {
          const cur = arr();
          if (cur[popIdx]) { cur[popIdx].c = rc.getAttribute('data-hl-recolor'); const keep = popIdx; commit(cur); const mk = root.querySelector('mark.sp-hl[data-hl="' + keep + '"]'); if (mk) openPop(keep, mk); }
          return;
        }
        if (e.target.closest('[data-hl-del]')) { const cur = arr(); if (cur[popIdx]) { cur.splice(popIdx, 1); closePop(); commit(cur); } return; }
        if (e.target.closest('[data-hl-done]')) { putRanges(curId, arr()); closePop(); paintDock(); }
      });
      if (window.matchMedia && matchMedia('(hover:hover)').matches) { try { ta.focus({ preventScroll: true }); } catch (e) {} }
    }
    const onDocDown = function (e) {
      if (!pop) return;
      if (pop.contains(e.target) || (e.target.closest && e.target.closest('mark.sp-hl'))) return;
      closePop();
    };
    document.addEventListener('pointerdown', onDocDown, true);

    /* ---------- док ---------- */
    function penBtn(t) {
      return '<button type="button" data-hl-tool="' + t + '" aria-pressed="false" aria-label="' + TOOLS[t].label + '" title="' + TOOLS[t].label + '" class="sp-pen grid h-11 w-11 place-items-center rounded-full md:h-9 md:w-9">' +
        (t === 'u'
          ? '<span class="text-[15px] font-semibold underline decoration-[#F59E0B] decoration-2 underline-offset-[3px]">U</span>'
          : '<span class="block h-5 w-5 rounded-full" style="background:' + TOOLS[t].dot + '"></span>') + '</button>';
    }
    function buildDock() {
      if (dock) return;
      dock = document.createElement('div');
      dock.className = 'sp-dock fixed left-1/2 z-[56] -translate-x-1/2';
      dock.setAttribute('role', 'toolbar');
      dock.setAttribute('aria-label', 'Highlights and notes tools');
      dock.innerHTML =
        '<div data-hl-panel hidden class="absolute bottom-full left-1/2 mb-2 max-h-[46vh] w-[min(360px,calc(100vw-16px))] -translate-x-1/2 overflow-y-auto rounded-2xl border bg-raised p-2 shadow-2xl"></div>' +
        '<div class="flex items-center gap-0.5 rounded-full border bg-surface/95 p-1.5 shadow-2xl backdrop-blur-md">' +
          ['y', 'b', 'p', 'u'].map(penBtn).join('') +
          '<button type="button" data-hl-tool="erase" aria-pressed="false" aria-label="Eraser" title="Eraser" class="sp-pen grid h-11 w-11 place-items-center rounded-full text-ink-soft hover:text-ink md:h-9 md:w-9">' + SVG_ERASER + '</button>' +
          '<span class="mx-1 h-6 w-px bg-white/10 dark:bg-white/10" style="background:var(--c-hairline)"></span>' +
          '<button type="button" data-hl-notes aria-expanded="false" class="inline-flex h-11 items-center gap-1.5 rounded-full px-3 text-[12.5px] font-medium text-ink-soft hover:bg-raised hover:text-ink md:h-9">' + SVG_NOTE + 'Notes<span data-hl-count class="num ml-0.5 rounded-full bg-raised px-1.5 text-[11px]">0</span></button>' +
          '<button type="button" data-hl-off aria-label="Turn off highlighter" title="Turn off" class="grid h-11 w-11 place-items-center rounded-full text-ink-soft hover:bg-raised hover:text-ink md:h-9 md:w-9">' + SVG_X + '</button>' +
        '</div>';
      panel = dock.querySelector('[data-hl-panel]');
      dock.addEventListener('click', function (e) {
        const t = e.target.closest('[data-hl-tool]');
        if (t) { setTool(t.getAttribute('data-hl-tool')); return; }
        if (e.target.closest('[data-hl-off]')) { setOn(false); return; }
        if (e.target.closest('[data-hl-notes]')) { panel.hidden = !panel.hidden; paintDock(); return; }
        const it = e.target.closest('[data-hl-go]');
        if (it) goTo(+it.getAttribute('data-hl-go'));
      });
      mount.appendChild(dock);
      placeDock();
    }
    function placeDock() {
      if (!dock) return;
      dock.style.bottom = ((bottomEl ? bottomEl.offsetHeight : 64) + 12) + 'px';
    }
    const onResize = function () { placeDock(); };
    window.addEventListener('resize', onResize);

    function setTool(t) {
      tool = t;
      root.setAttribute('data-sp-pen', t);
      paintDock();
    }

    function quoteOf(r) {
      const c = containers().filter(function (x) { return x.k === r.k; })[0];
      const q = c ? c.el.textContent.slice(r.s, r.e).replace(/\s+/g, ' ').trim() : '';
      return q.length > 90 ? q.slice(0, 87) + '…' : q;
    }

    function paintDock() {
      if (!dock) return;
      dock.querySelectorAll('[data-hl-tool]').forEach(function (b) {
        b.setAttribute('aria-pressed', b.getAttribute('data-hl-tool') === tool ? 'true' : 'false');
      });
      const a = arr();
      dock.querySelector('[data-hl-count]').textContent = String(a.length);
      dock.querySelector('[data-hl-notes]').setAttribute('aria-expanded', String(!panel.hidden));
      if (panel.hidden) return;
      if (!a.length) {
        panel.innerHTML = '<p class="px-3 py-4 text-center text-[12.5px] leading-relaxed text-ink-soft">Pick a marker and select text to paint it.<br>Click a highlight to add a note.</p>';
        return;
      }
      panel.innerHTML = a.map(function (r, i) {
        return '<button type="button" data-hl-go="' + i + '" class="flex min-h-[44px] w-full items-start gap-2.5 rounded-xl px-3 py-2 text-left hover:bg-surface">' +
          '<span class="mt-1 h-3 w-3 shrink-0 rounded-full" style="background:' + TOOLS[r.c].dot + '"></span>' +
          '<span class="min-w-0 flex-1"><span class="block text-[13px] leading-snug">' + esc(quoteOf(r)) + '</span>' +
          (r.n ? '<span class="mt-0.5 block text-[12.5px] italic text-ink-soft">' + esc(r.n.length > 120 ? r.n.slice(0, 117) + '…' : r.n) + '</span>' : '') +
          '</span></button>';
      }).join('');
    }

    function goTo(i) {
      const m = root.querySelector('mark.sp-hl[data-hl="' + i + '"]');
      if (!m) return;
      try { m.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (e) {}
      root.querySelectorAll('mark.sp-hl[data-hl="' + i + '"]').forEach(function (x) {
        x.classList.remove('sp-hl-flash'); void x.offsetWidth; x.classList.add('sp-hl-flash');
      });
      setTimeout(function () { openPop(i, m); }, 250);
    }

    /* ---------- включение / выключение ---------- */
    function paintButton() {
      if (!btn) return;
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      ['bg-hl/15', 'text-hl', 'border-hl'].forEach(function (c) { btn.classList.toggle(c, on); });
    }
    function setOn(v) {
      on = !!v;
      if (on) { buildDock(); root.setAttribute('data-sp-pen', tool); paintDock(); }
      else {
        closePop();
        if (dock) { dock.remove(); dock = null; panel = null; }
        root.removeAttribute('data-sp-pen');
        const s = window.getSelection && window.getSelection();
        if (s && !s.isCollapsed) { try { s.removeAllRanges(); } catch (e) {} }
      }
      paintButton();
    }
    const onBtn = function () { setOn(!on); };
    if (btn) btn.addEventListener('click', onBtn);

    paintButton();

    return {
      toggle: function () { setOn(!on); },
      setOn: setOn,
      isOn: function () { return on; },
      refresh: function () {
        closePop();
        curId = opts.getId ? opts.getId() : null;
        paintAll();
        placeDock();
      },
      destroy: function () {
        setOn(false);
        clearTimeout(selTimer); clearTimeout(noteTimer);
        root.removeEventListener('pointerdown', onPtrDown);
        root.removeEventListener('click', onRootClick);
        document.removeEventListener('pointerup', onPtrUp);
        document.removeEventListener('pointercancel', onPtrUp);
        document.removeEventListener('selectionchange', onSelChange);
        document.removeEventListener('pointerdown', onDocDown, true);
        window.removeEventListener('resize', onResize);
        if (btn) btn.removeEventListener('click', onBtn);
      }
    };
  }

  window.SPHighlight = { create: create, _model: { subtract: subtract, sortRanges: sortRanges } };
})();
