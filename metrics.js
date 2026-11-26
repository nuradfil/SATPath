/* =====================================================================
   SATPath — My Metrics (metrics.js)
   ---------------------------------------------------------------------
   Экран  #/metrics.  Подключать ПОСЛЕ shell.js и dataAdapter.js.

   Блоки:
     1. KPI: Average score, Accuracy, Questions answered, Day streak
     2. Score progress: график Practice Tests + шкала 0–1600 с целью
     3. Accuracy breakdown: секции, домены, Focus areas / Strengths
     4. Activity: точность и количество вопросов по дням

   Откуда берутся данные (файл читает их и НЕ изменяет):
     SPData.progress.get()     satpath_qprog_v1       последняя попытка по каждому вопросу
     satpath_telemetry_v1      история по дням из старого сайта
     satpath_pt_results_v1     текущие результаты Practice Tests
     satpath_pt_detail_v2      даты Practice Tests

   Единственный ключ, в который файл пишет:
     satpath_metrics_log_v1    { days: {...}, tests: [...] }
   Он нужен, потому что старые ключи не хранят все повторные попытки
   по дням и все пересдачи тестов.

   Демо с тестовыми данными (ничего не сохраняет):  app-new.html?demo=1
   ===================================================================== */
(function () {
  'use strict';

  const Shell = window.SPShell;
  const Data = window.SPData;
  if (!Shell || !Data) {
    console.error('[metrics] Подключите shell.js и dataAdapter.js ДО этого файла.');
    return;
  }

  const DEMO = /[?&]demo=1(&|$)/.test(location.search);
  const K = {
    log: 'satpath_metrics_log_v1',
    tele: 'satpath_telemetry_v1',
    pt: 'satpath_pt_results_v1',
    det: 'satpath_pt_detail_v2'
  };
  const DOMAINS = {
    rw: ['Craft and Structure', 'Expression of Ideas', 'Information and Ideas', 'Standard English Conventions'],
    math: ['Algebra', 'Advanced Math', 'Problem-Solving and Data Analysis', 'Geometry and Trigonometry']
  };
  const SEC_NAME = { rw: 'Reading & Writing', math: 'Math' };
  const MIN_SKILL_SAMPLE = 5;     // навык попадает в Focus / Strengths только после стольких вопросов
  const STRONG_FROM = 70;         // точность, с которой навык считается сильным

  /* =====================================================================
     1. УТИЛИТЫ
     ===================================================================== */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  const pad = function (n) { return n < 10 ? '0' + n : '' + n; };
  const iso = function (d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };
  const today = function () { const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()); };
  const addDays = function (d, n) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n); };
  const fmt = function (n) { return Number(n).toLocaleString('en-US'); };
  const dShort = function (d) { return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); };
  const dLong = function (d) { return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); };
  const pctOf = function (ok, n) { return n ? Math.round(ok / n * 100) : 0; };
  const clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  const plural = function (n, one) { return fmt(n) + ' ' + one + (n === 1 ? '' : 's'); };
  function icons() { try { if (window.lucide) window.lucide.createIcons(); } catch (e) {} }

  function jget(k, fallback) {
    try {
      const v = JSON.parse(localStorage.getItem(k));
      return v && typeof v === 'object' ? v : fallback;
    } catch (e) { return fallback; }
  }

  /* =====================================================================
     2. СЛОЙ ДАННЫХ
     ===================================================================== */
  let memLog = null;   // fallback, если localStorage недоступен

  function readLog() {
    const l = jget(K.log, memLog) || {};
    if (!l.days || typeof l.days !== 'object') l.days = {};
    if (!Array.isArray(l.tests)) l.tests = [];
    return l;
  }
  function writeLog(l) {
    memLog = l;
    try { localStorage.setItem(K.log, JSON.stringify(l)); } catch (e) {}
    // PLUG IN FIREBASE: здесь отправляйте объект l в Firestore, если пользователь авторизован
  }

  function sectionOfId(id) {
    if (/^m:/.test(id)) return 'math';
    if (/^(rw|rg):/.test(id)) return 'rw';
    try { const q = Data.getQuestion(id); return q ? q.section : null; } catch (e) { return null; }
  }

  // Текущие баллы тестов: тот же расчёт, что и на экране Practice Tests
  function currentScores() {
    const legacy = jget(K.pt, {}), det = jget(K.det, {}), ids = {};
    Object.keys(legacy).concat(Object.keys(det)).forEach(function (t) { ids[t] = 1; });
    const PT = window.SPPracticeTests;
    const valid = function (v) { return +v > 0 ? +v : null; };
    return Object.keys(ids).map(function (t) {
      let r = null, m = null;
      if (PT && PT.scoresOf) {
        const sc = PT.scoresOf(+t) || {};
        r = valid(sc.r); m = valid(sc.m);
      } else {
        const res = legacy[t] || {};
        r = valid(res.r && res.r.score); m = valid(res.m && res.m.score);
      }
      let busy = false;   // идёт пересдача: промежуточный балл показываем, но в историю не пишем
      try { busy = !!(PT && PT.Store && PT.Store.sess(+t)); } catch (e) {}
      return { t: +t, r: r, m: m, updated: (det[t] && det[t].updated) || null, busy: busy };
    }).filter(function (x) { return x.r !== null || x.m !== null; });
  }

  // Добавляет в список текущий балл теста, если последней записи он не соответствует
  function mergeScore(list, cur) {
    let at = -1;
    list.forEach(function (x, i) {
      if (+x.t === cur.t && (at < 0 || (x.ts || 0) >= (list[at].ts || 0))) at = i;
    });
    const last = at < 0 ? null : list[at];
    const sameR = cur.r === null || (!!last && last.r === cur.r);
    const sameM = cur.m === null || (!!last && last.m === cur.m);
    if (last && sameR && sameM) return false;

    // неполную запись без противоречий дополняем, иначе это новый результат
    const fill = !!last && last.total == null &&
      (last.r == null || last.r === cur.r) && (last.m == null || last.m === cur.m);
    const r = cur.r !== null ? cur.r : (fill ? last.r : null);
    const m = cur.m !== null ? cur.m : (fill ? last.m : null);
    const entry = {
      t: cur.t, name: (last && last.name) || ('Practice Test ' + cur.t), r: r, m: m,
      total: r !== null && m !== null ? r + m : null,
      fr: r !== null && (!last || last.r !== r || (fill && !!last.fr)),
      fm: m !== null && (!last || last.m !== m || (fill && !!last.fm)),
      ts: cur.updated || (last ? Date.now() : null)
    };
    if (fill) list[at] = entry; else list.push(entry);
    return true;
  }

  // Сверяет историю с Practice Tests и возвращает список результатов для экрана
  function syncTests() {
    if (DEMO) return [];
    const log = readLog(), view = log.tests.slice();
    let changed = false;
    currentScores().forEach(function (cur) {
      mergeScore(view, cur);
      if (!cur.busy && mergeScore(log.tests, cur)) changed = true;
    });
    if (changed) writeLog(log);
    return view;
  }

  // Каждый проверенный ответ (Solver, Daily Challenge, Practice Tests)
  window.addEventListener('sp:progress', function (e) {
    if (DEMO) return;
    const d = (e && e.detail) || {};
    if (!d.id) return;
    const log = readLog(), key = iso(new Date());
    const day = log.days[key] || { q: 0, ok: 0, rw: 0, math: 0 };
    day.q += 1;
    if (d.correct) day.ok += 1;
    const sec = sectionOfId(String(d.id));
    if (sec) day[sec] += 1;
    log.days[key] = day;
    writeLog(log);
  });

  // Каждое завершение теста — отдельная точка на графике
  window.addEventListener('sp:pt-complete', function (e) {
    if (DEMO) return;
    const d = (e && e.detail) || {};
    const sc = d.scores || {}, mods = d.modules || {};
    const fr = !!(mods.r1 || mods.r2) && sc.r != null;
    const fm = !!(mods.m1 || mods.m2) && sc.m != null;
    if (!fr && !fm) return;
    const log = readLog();
    const known = log.tests.some(function (x) { return String(x.t) === String(d.t); });
    // новая точка нужна, если секция пройдена целиком или этого теста ещё нет в истории
    const wholeSection = (mods.r1 && mods.r2) || (mods.m1 && mods.m2);
    if (known && !wholeSection) return;
    let keepR = false, keepM = false;
    log.tests.forEach(function (x) {
      if (String(x.t) !== String(d.t) || x.total != null) return;
      if (x.fr && x.r === sc.r) keepR = true;
      if (x.fm && x.m === sc.m) keepM = true;
    });
    // убираем неполную запись этого же теста, если новая точка включает те же баллы (иначе секция посчитается дважды)
    log.tests = log.tests.filter(function (x) {
      return !(String(x.t) === String(d.t) && x.total == null &&
        (x.r == null || x.r === sc.r) && (x.m == null || x.m === sc.m));
    });
    log.tests.push({
      t: +d.t, name: d.name || ('Practice Test ' + d.t),
      r: sc.r != null ? sc.r : null, m: sc.m != null ? sc.m : null,
      total: sc.total != null ? sc.total : null,
      fr: fr || keepR, fm: fm || keepM, ts: Date.now()
    });
    writeLog(log);
  });

  // Объединяет три источника по дням. Берётся самый полный, поэтому ответы не считаются дважды.
  function mergeDays(prog) {
    const out = {};
    function offer(key, rec) {
      if (!rec || !(rec.q > 0)) return;
      const cur = out[key];
      const split = (rec.rw || 0) + (rec.math || 0);
      if (!cur) out[key] = { q: rec.q, ok: Math.min(rec.ok || 0, rec.q), rw: rec.rw || 0, math: rec.math || 0, split: split };
      else {
        if (rec.q > cur.q) { cur.q = rec.q; cur.ok = Math.min(rec.ok || 0, rec.q); }
        if (split > cur.split) { cur.rw = rec.rw || 0; cur.math = rec.math || 0; cur.split = split; }
      }
    }
    const tele = jget(K.tele, {}).days || {};
    Object.keys(tele).forEach(function (k) {
      const r = tele[k] || {};
      offer(k, { q: +r.q || 0, ok: +r.ok || 0 });
    });
    const log = readLog().days;
    Object.keys(log).forEach(function (k) { offer(k, log[k]); });

    const fromProg = {};
    Object.keys(prog).forEach(function (id) {
      const p = prog[id];
      if (!p || !p.t) return;
      const k = iso(new Date(p.t));
      const day = fromProg[k] || (fromProg[k] = { q: 0, ok: 0, rw: 0, math: 0 });
      day.q++;
      if (p.r === 'ok') day.ok++;
      const sec = sectionOfId(id);
      if (sec) day[sec]++;
    });
    Object.keys(fromProg).forEach(function (k) { offer(k, fromProg[k]); });
    return out;
  }

  function streakOf(days) {
    const t = today();
    let current = 0;
    for (let back = 0; back < 3650; back++) {
      if (days[iso(addDays(t, -back))]) current++;
      else if (back > 0) break;
    }
    let best = 0, run = 0, prev = null;
    Object.keys(days).sort().forEach(function (k) {
      const p = k.split('-');
      const d = new Date(+p[0], +p[1] - 1, +p[2]);
      run = prev && iso(addDays(prev, 1)) === k ? run + 1 : 1;
      best = Math.max(best, run);
      prev = d;
    });
    const stored = +jget(K.tele, {}).bestStreak || 0;
    return { current: current, best: Math.max(best, current, stored) };
  }

  function breakdownOf(prog) {
    const sections = { rw: { n: 0, ok: 0, domains: {} }, math: { n: 0, ok: 0, domains: {} } };
    const skills = {};
    Object.keys(prog).forEach(function (id) {
      let q = null;
      try { q = Data.getQuestion(id); } catch (e) {}
      if (!q || !sections[q.section]) return;
      const good = prog[id].r === 'ok' ? 1 : 0;
      const S = sections[q.section];
      S.n++; S.ok += good;
      const dom = S.domains[q.domain] || (S.domains[q.domain] = { n: 0, ok: 0 });
      dom.n++; dom.ok += good;
      const key = q.section + '|' + q.domain + '|' + q.skill;
      const sk = skills[key] || (skills[key] = { section: q.section, domain: q.domain, skill: q.skill, n: 0, ok: 0 });
      sk.n++; sk.ok += good;
    });
    return {
      sections: sections,
      skills: Object.keys(skills).map(function (k) {
        const s = skills[k];
        s.pct = pctOf(s.ok, s.n);
        return s;
      })
    };
  }

  function sortTests(list) {
    // записи без даты (из старого сайта) идут первыми, по номеру теста
    return list.slice().sort(function (a, b) { return ((a.ts || 0) - (b.ts || 0)) || (a.t - b.t); });
  }

  function demoSnapshot() {
    let seed = 41;
    const rnd = function () { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    const days = {}, t = today();
    for (let i = 0; i < 100; i++) {
      if (i > 8 && rnd() < 0.4) continue;
      const q = Math.round(6 + rnd() * 28), ok = Math.round(q * (0.55 + rnd() * 0.3 + (100 - i) / 900));
      const rw = Math.round(q * rnd());
      days[iso(addDays(t, -i))] = { q: q, ok: Math.min(q, ok), rw: rw, math: q - rw };
    }
    const tests = [[1, 560, 590, 63], [2, 590, 610, 48], [3, 580, 650, 34], [4, 620, 660, 20], [5, 640, 700, 6]].map(function (x) {
      return { t: x[0], name: 'Practice Test ' + x[0], r: x[1], m: x[2], total: x[1] + x[2], fr: true, fm: true, ts: addDays(t, -x[3]).getTime() };
    });
    const sections = { rw: { n: 0, ok: 0, domains: {} }, math: { n: 0, ok: 0, domains: {} } };
    const set = function (sec, dom, n, ok) {
      sections[sec].domains[dom] = { n: n, ok: ok };
      sections[sec].n += n; sections[sec].ok += ok;
    };
    set('rw', DOMAINS.rw[0], 142, 117); set('rw', DOMAINS.rw[1], 88, 63); set('rw', DOMAINS.rw[2], 121, 82); set('rw', DOMAINS.rw[3], 109, 59);
    set('math', DOMAINS.math[0], 168, 144); set('math', DOMAINS.math[1], 117, 82); set('math', DOMAINS.math[2], 74, 41); set('math', DOMAINS.math[3], 63, 46);
    const skills = [
      ['rw', 0, 'Words in Context', 71, 63], ['math', 0, 'Linear Functions', 58, 52], ['math', 0, 'Linear Equations in One Variable', 34, 29],
      ['rw', 3, 'Boundaries', 62, 31], ['math', 2, 'Probability and Conditional Probability', 21, 10], ['rw', 2, 'Inferences', 37, 22]
    ].map(function (x) {
      return { section: x[0], domain: DOMAINS[x[0]][x[1]], skill: x[2], n: x[3], ok: x[4], pct: pctOf(x[4], x[3]) };
    });
    return { days: days, tests: tests, sections: sections, skills: skills, unique: 782, streak: streakOf(days) };
  }

  function snapshot() {
    if (DEMO) return demoSnapshot();
    const tests = syncTests();
    let prog = {};
    try { prog = Data.progress.get() || {}; } catch (e) {}
    const days = mergeDays(prog);
    const b = breakdownOf(prog);
    return {
      days: days,
      tests: sortTests(tests),
      sections: b.sections,
      skills: b.skills,
      unique: b.sections.rw.n + b.sections.math.n,
      streak: streakOf(days)
    };
  }

  function sumRange(days, from, len) {
    // len дней, заканчивая днём (сегодня - from)
    const out = { q: 0, ok: 0, active: 0 };
    const t = today();
    for (let i = from; i < from + len; i++) {
      const r = days[iso(addDays(t, -i))];
      if (!r) continue;
      out.q += r.q; out.ok += r.ok; out.active++;
    }
    return out;
  }

  const avgOf = function (a) { return a.length ? Math.round(a.reduce(function (s, v) { return s + v; }, 0) / a.length / 10) * 10 : null; };

  function scoreSummary(tests) {
    const pick = function (key, fresh) {
      return tests.filter(function (x) { return x[key] != null && (!fresh || x[fresh]); }).map(function (x) { return x[key]; });
    };
    const totals = pick('total'), r = pick('r', 'fr'), m = pick('m', 'fm');
    return {
      count: totals.length,
      avg: avgOf(totals),
      best: totals.length ? Math.max.apply(null, totals) : null,
      latest: totals.length ? totals[totals.length - 1] : null,
      r: avgOf(r), m: avgOf(m)
    };
  }

  /* =====================================================================
     3. СТИЛИ И АНИМАЦИИ
     ===================================================================== */
  const CSS =
    '.mx-reveal{opacity:0;transform:translateY(10px);transition:opacity .5s ease,transform .5s cubic-bezier(.2,.7,.2,1);transition-delay:var(--d,0ms)}' +
    '.mx-reveal.mx-in{opacity:1;transform:none}' +
    '.mx-fill{width:0;transition:width .9s cubic-bezier(.2,.7,.2,1) .2s}' +
    '.mx-in .mx-fill{width:var(--w)}' +
    '.mx-ring{stroke-dashoffset:var(--c);transition:stroke-dashoffset 1s cubic-bezier(.2,.7,.2,1) .15s}' +
    '.mx-in .mx-ring{stroke-dashoffset:var(--o)}' +
    '.mx-line{stroke-dasharray:1 1;stroke-dashoffset:1;transition:stroke-dashoffset 1.1s cubic-bezier(.4,0,.2,1) .15s}' +
    '.mx-draw .mx-line{stroke-dashoffset:0}' +
    '.mx-soft{opacity:0;transition:opacity .5s ease .7s}' +
    '.mx-draw .mx-soft{opacity:1}' +
    '.mx-bar{transform:scaleY(0);transform-box:fill-box;transform-origin:50% 100%;transition:transform .6s cubic-bezier(.2,.7,.2,1);transition-delay:var(--bd,0ms)}' +
    '.mx-draw .mx-bar{transform:scaleY(1)}' +
    '.mx-chart{position:relative;touch-action:pan-y;outline:none;border-radius:12px}' +
    '.mx-chart:focus-visible{box-shadow:0 0 0 2px rgb(var(--c-accent) / .6)}' +
    '.mx-chart svg{display:block;overflow:visible}' +
    '.mx-axis{fill:rgb(var(--c-ink-soft));font:500 10.5px "JetBrains Mono",ui-monospace,monospace}' +
    '.mx-grid{stroke:var(--c-hairline);stroke-width:1}' +
    '.mx-scale{display:flex;justify-content:space-between;align-items:center;height:44px}' +
    '.mx-scale i{width:2px;height:26px;border-radius:2px;background:rgb(var(--c-ink) / .10);transition:background .3s ease,height .3s ease}' +
    '.mx-in .mx-scale i[data-on="1"]{background:rgb(var(--c-accent));transition-delay:var(--td)}' +
    '.mx-scale i[data-mark="goal"]{height:44px;background:rgb(var(--c-ink) / .75)}' +
    '.mx-in .mx-scale i[data-mark="goal"]{background:rgb(var(--c-ink) / .75)}' +
    '.mx-tip{position:fixed;z-index:60;pointer-events:none;min-width:132px;opacity:0;transform:translateY(4px);transition:opacity .12s ease,transform .12s ease}' +
    '.mx-tip[data-on="1"]{opacity:1;transform:none}' +
    '@media (prefers-reduced-motion:reduce){.mx-reveal{opacity:1;transform:none}}';

  function injectStyle() {
    if (document.getElementById('mxStyle')) return;
    const s = document.createElement('style');
    s.id = 'mxStyle';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* =====================================================================
     4. РАЗМЕТКА
     ===================================================================== */
  const BIG = 'num text-[32px] font-semibold leading-none tracking-tight';

  function reveal(i) { return 'mx-reveal" style="--d:' + (i * 60) + 'ms'; }

  function tone(pct) { return pct >= 80 ? 'bg-success' : pct >= 60 ? 'bg-accent' : 'bg-danger'; }

  function segHTML(name, items, active, label) {
    return '<div class="inline-flex rounded-lg bg-raised p-0.5" role="group" aria-label="' + label + '">' + items.map(function (x) {
      return '<button type="button" data-seg="' + name + '" data-v="' + x[0] + '" aria-pressed="' + (String(active) === String(x[0])) + '" ' +
        'class="h-11 sm:h-8 rounded-md px-3 text-[12.5px] font-medium text-ink-soft transition-colors hover:text-ink aria-pressed:bg-surface aria-pressed:text-ink aria-pressed:shadow-[0_0_0_1px_var(--c-hairline)]">' + x[1] + '</button>';
    }).join('') + '</div>';
  }

  function emptyBox(icon, title, text, href, cta) {
    return '<div class="flex h-full min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed px-6 py-8 text-center">' +
      '<span class="grid h-11 w-11 place-items-center rounded-xl bg-raised text-accent"><i data-lucide="' + icon + '" class="h-5 w-5"></i></span>' +
      '<p class="mt-4 text-[14px] font-semibold">' + title + '</p>' +
      '<p class="mt-1.5 max-w-[360px] text-[12.5px] leading-relaxed text-ink-soft">' + text + '</p>' +
      (href ? '<a href="' + href + '" class="mt-4 inline-flex h-11 items-center gap-2 rounded-lg bg-accent px-4 text-[13px] font-semibold text-white transition-colors hover:bg-accent-hover sm:h-9">' + cta + '<i data-lucide="arrow-right" class="h-4 w-4"></i></a>' : '') +
    '</div>';
  }

  /* ---------- 1. KPI ---------- */
  function kpiCard(i, icon, label, value, foot) {
    return '<section class="card flex flex-col p-4 sm:p-5 ' + reveal(i) + '">' +
      '<div class="kpi-label"><i data-lucide="' + icon + '" class="h-4 w-4"></i>' + label + '</div>' +
      '<div class="mt-4 flex items-baseline gap-1.5">' + value + '</div>' +
      '<div class="mt-auto pt-3 text-[12.5px] text-ink-soft">' + foot + '</div></section>';
  }

  function kpiHTML(D) {
    const sc = scoreSummary(D.tests);
    const all = Object.keys(D.days).reduce(function (a, k) {
      a.q += D.days[k].q; a.ok += D.days[k].ok; return a;
    }, { q: 0, ok: 0 });
    const week = sumRange(D.days, 0, 7), prev = sumRange(D.days, 7, 7);
    const dash = '<span class="' + BIG + ' text-ink-mute">—</span>';
    const num = function (v) { return '<span class="' + BIG + '" data-count="' + v + '">' + fmt(v) + '</span>'; };

    let accFoot = all.q ? '<span class="num">' + fmt(all.ok) + '</span> of <span class="num">' + fmt(all.q) + '</span> correct' : 'Solve a question to start';
    if (week.q >= 5 && prev.q >= 5) {
      const diff = pctOf(week.ok, week.q) - pctOf(prev.ok, prev.q);
      if (diff !== 0) {
        accFoot = '<span class="inline-flex items-center gap-1 font-medium ' + (diff > 0 ? 'text-success' : 'text-danger') + '">' +
          '<i data-lucide="' + (diff > 0 ? 'trending-up' : 'trending-down') + '" class="h-3.5 w-3.5"></i>' + (diff > 0 ? '+' : '−') + Math.abs(diff) + ' pts</span> vs previous 7 days';
      }
    }

    const t = today(), L = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    let dots = '';
    for (let i = 6; i >= 0; i--) {
      const d = addDays(t, -i), on = !!D.days[iso(d)];
      dots += '<span class="flex flex-1 flex-col items-center gap-1" title="' + dShort(d) + (on ? ': practiced' : ': no activity') + '">' +
        '<span class="h-1.5 w-full rounded-full ' + (on ? 'bg-accent' : 'bg-raised') + '"></span>' +
        '<span class="text-[10px] ' + (i === 0 ? 'font-semibold text-ink' : 'text-ink-mute') + '">' + L[d.getDay()] + '</span></span>';
    }

    return '<div class="grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-4">' +
      kpiCard(0, 'target', 'Average score',
        sc.avg !== null ? num(sc.avg) : dash,
        sc.best !== null ? 'Best <span class="num font-semibold text-ink">' + sc.best + '</span> · ' + plural(sc.count, 'result') : 'Finish a full test') +
      kpiCard(1, 'crosshair', 'Accuracy',
        all.q ? num(pctOf(all.ok, all.q)) + '<span class="num text-[17px] text-ink-soft">%</span>' : dash,
        accFoot) +
      kpiCard(2, 'list-checks', 'Questions answered',
        num(all.q),
        week.q ? '<span class="num font-semibold text-ink">+' + fmt(week.q) + '</span> in the last 7 days' : 'None in the last 7 days') +
      kpiCard(3, 'flame', 'Day streak',
        num(D.streak.current) + '<span class="text-[13px] text-ink-soft">' + (D.streak.current === 1 ? 'day' : 'days') + '</span><span class="ml-auto text-[12px] text-ink-mute">Best <span class="num">' + D.streak.best + '</span></span>',
        '<div class="flex gap-1.5" aria-label="Last 7 days">' + dots + '</div>') +
    '</div>';
  }

  /* ---------- 2. Score ---------- */
  function scaleHTML(avg, goal) {
    const N = 64;
    const filled = avg === null ? 0 : Math.round(avg / 1600 * N);
    const goalAt = clamp(Math.round(goal / 1600 * N) - 1, 0, N - 1);
    let ticks = '';
    for (let i = 0; i < N; i++) {
      ticks += '<i' + (i < filled ? ' data-on="1" style="--td:' + (200 + i * 12) + 'ms"' : '') + (i === goalAt ? ' data-mark="goal"' : '') + '></i>';
    }
    return '<div class="mx-scale" role="img" aria-label="' + (avg === null ? 'No average score yet' : 'Average score ' + avg) + ', goal ' + goal + ', on a scale from 0 to 1600">' + ticks + '</div>' +
      '<div class="num mt-1 flex justify-between text-[10.5px] text-ink-mute"><span>0</span><span>800</span><span>1600</span></div>';
  }

  function goalPanelHTML(D) {
    const sc = scoreSummary(D.tests), goal = Shell.data.goal();
    let note;
    if (sc.latest === null) note = 'Your goal is <span class="num text-ink">' + goal + '</span>.';
    else if (sc.latest >= goal) note = 'Your latest score meets your goal of <span class="num text-ink">' + goal + '</span>.';
    else note = '<span class="num text-ink">' + (goal - sc.latest) + '</span> points from your latest score to <span class="num text-ink">' + goal + '</span>.';
    const split = function (label, v) {
      return '<div class="rounded-xl bg-raised px-3.5 py-3"><div class="text-[11.5px] text-ink-soft">' + label + '</div>' +
        '<div class="num mt-1 text-[20px] font-semibold ' + (v === null ? 'text-ink-mute' : '') + '">' + (v === null ? '—' : v) + '</div></div>';
    };
    return '<div class="text-[12.5px] font-medium text-ink-soft">Average SAT score</div>' +
      '<div class="num mt-2 text-[48px] font-semibold leading-none tracking-tight ' + (sc.avg === null ? 'text-ink-mute' : '') + '">' + (sc.avg === null ? '—' : sc.avg) + '</div>' +
      '<div class="mt-4 grid grid-cols-2 gap-2.5">' + split('Reading &amp; Writing', sc.r) + split('Math', sc.m) + '</div>' +
      '<div class="mt-5">' + scaleHTML(sc.avg, goal) + '</div>' +
      '<p class="mt-3 text-[12.5px] leading-relaxed text-ink-soft">' + note + '</p>' +
      '<form id="mxGoalForm" class="mt-3 flex gap-2" novalidate>' +
        '<label for="mxGoal" class="sr-only">Target score, 400 to 1600</label>' +
        '<input id="mxGoal" type="number" inputmode="numeric" min="400" max="1600" step="10" value="' + goal + '" class="num h-11 w-full min-w-0 rounded-lg border bg-canvas/40 px-3 text-[14px] outline-none focus:border-accent sm:h-9">' +
        '<button type="submit" class="h-11 shrink-0 rounded-lg bg-accent px-4 text-[13px] font-semibold text-white transition-colors hover:bg-accent-hover sm:h-9">Set goal</button>' +
      '</form>';
  }

  function testRowsHTML(D, showAll) {
    const list = D.tests.slice().reverse();
    if (!list.length) return '';
    const rows = (showAll ? list : list.slice(0, 4)).map(function (x) {
      const parts = [];
      if (x.r != null) parts.push('R&amp;W ' + x.r);
      if (x.m != null) parts.push('Math ' + x.m);
      return '<a href="#/pt-results?t=' + (+x.t) + '" class="flex min-h-[52px] items-center gap-3 border-t px-1 py-2 transition-colors hover:bg-raised/50">' +
        '<span class="min-w-0 flex-1"><span class="block truncate text-[13.5px] font-medium">' + esc(x.name) + '</span>' +
        '<span class="block text-[11.5px] text-ink-mute">' + (x.ts ? dLong(new Date(x.ts)) : 'Date not saved') + '</span></span>' +
        '<span class="num hidden text-[12px] text-ink-soft sm:block">' + parts.join(' · ') + '</span>' +
        '<span class="num w-14 text-right text-[16px] font-semibold">' + (x.total != null ? x.total : '<span class="text-[11px] font-medium text-ink-soft">Partial</span>') + '</span>' +
        '<i data-lucide="chevron-right" class="h-4 w-4 shrink-0 text-ink-mute"></i></a>';
    }).join('');
    return '<div class="mt-5"><div class="mb-1 flex items-center justify-between gap-3"><h3 class="text-[13px] font-semibold">Completed tests</h3>' +
      (list.length > 4 ? '<button type="button" data-act="allTests" class="h-11 rounded-md px-2 text-[12.5px] font-medium text-accent hover:text-accent-hover sm:h-8">' + (showAll ? 'Show less' : 'Show all ' + list.length) + '</button>' : '') +
      '</div>' + rows + '</div>';
  }

  /* ---------- 3. Breakdown ---------- */
  function sectionCardHTML(D, sec) {
    const S = D.sections[sec];
    const C = 2 * Math.PI * 30;
    const pct = pctOf(S.ok, S.n);
    const names = DOMAINS[sec].concat(Object.keys(S.domains).filter(function (n) { return DOMAINS[sec].indexOf(n) < 0; }));
    const bars = names.map(function (name) {
      const d = S.domains[name];
      const p = d ? pctOf(d.ok, d.n) : 0;
      return '<div><div class="flex items-baseline justify-between gap-3 text-[12.5px]">' +
        '<span class="min-w-0 truncate ' + (d ? '' : 'text-ink-soft') + '">' + esc(name) + '</span>' +
        '<span class="num shrink-0 ' + (d ? 'text-ink' : 'text-ink-mute') + '">' + (d ? p + '% <span class="text-ink-mute">' + d.ok + '/' + d.n + '</span>' : 'No data') + '</span></div>' +
        '<div class="mt-2 h-1.5 overflow-hidden rounded-full bg-raised" role="progressbar" aria-label="' + esc(name) + ' accuracy" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + p + '">' +
        '<div class="mx-fill h-full rounded-full ' + tone(p) + '" style="--w:' + p + '%"></div></div></div>';
    }).join('');
    return '<div class="rounded-xl border bg-canvas/40 p-4 md:p-5">' +
      '<div class="flex items-center gap-4">' +
        '<div class="relative h-[72px] w-[72px] shrink-0">' +
          '<svg viewBox="0 0 72 72" class="h-full w-full -rotate-90" aria-hidden="true"><circle cx="36" cy="36" r="30" fill="none" stroke="rgb(var(--c-raised))" stroke-width="6"/>' +
          (S.n && S.ok ? '<circle class="mx-ring" cx="36" cy="36" r="30" fill="none" stroke="rgb(var(--c-accent))" stroke-width="6" stroke-linecap="round" stroke-dasharray="' + C.toFixed(1) + '" style="--c:' + C.toFixed(1) + ';--o:' + (C * (1 - pct / 100)).toFixed(1) + '"/>' : '') +
          '</svg><span class="num absolute inset-0 grid place-items-center text-[15px] font-semibold">' + (S.n ? pct + '%' : '—') + '</span></div>' +
        '<div class="min-w-0"><h3 class="text-[14.5px] font-semibold">' + (sec === 'rw' ? 'Reading &amp; Writing' : 'Math') + '</h3>' +
        '<p class="mt-0.5 text-[12.5px] text-ink-soft">' + (S.n ? '<span class="num">' + fmt(S.ok) + '</span> of <span class="num">' + fmt(S.n) + '</span> correct' : 'No questions answered yet') + '</p></div>' +
      '</div>' +
      '<div class="mt-5 space-y-4">' + bars + '</div></div>';
  }

  function skillLists(D) {
    const ready = D.skills.filter(function (s) { return s.n >= MIN_SKILL_SAMPLE; });
    return {
      ready: ready.length,
      focus: ready.filter(function (s) { return s.pct < STRONG_FROM; }).sort(function (a, b) { return (a.pct - b.pct) || (b.n - a.n); }).slice(0, 3),
      strong: ready.filter(function (s) { return s.pct >= STRONG_FROM; }).sort(function (a, b) { return (b.pct - a.pct) || (b.n - a.n); }).slice(0, 3)
    };
  }

  function skillCardHTML(title, icon, color, list, emptyText) {
    const rows = list.map(function (s) {
      return '<div class="flex items-center gap-3 border-t py-2.5">' +
        '<span class="min-w-0 flex-1"><span class="block truncate text-[13.5px] font-medium">' + esc(s.skill) + '</span>' +
        '<span class="block truncate text-[11.5px] text-ink-mute">' + SEC_NAME[s.section].replace('&', '&amp;') + ' · ' + s.ok + '/' + s.n + ' correct</span></span>' +
        '<span class="num text-[13.5px] font-semibold ' + color + '">' + s.pct + '%</span>' +
        '<button type="button" data-act="practice" data-sec="' + s.section + '" data-domain="' + esc(s.domain) + '" data-skill="' + esc(s.skill) + '" ' +
          'class="inline-flex h-11 items-center gap-1 rounded-lg border px-3 text-[12.5px] font-medium text-ink-soft transition-colors hover:bg-raised hover:text-ink sm:h-8" aria-label="Practice ' + esc(s.skill) + '">Practice<i data-lucide="arrow-up-right" class="h-3.5 w-3.5"></i></button></div>';
    }).join('');
    return '<div class="rounded-xl border bg-canvas/40 p-4 md:px-5">' +
      '<h3 class="mb-2 flex items-center gap-2 text-[13.5px] font-semibold"><i data-lucide="' + icon + '" class="h-4 w-4 ' + color + '"></i>' + title + '</h3>' +
      (rows || '<p class="border-t py-6 text-center text-[12.5px] leading-relaxed text-ink-soft">' + emptyText + '</p>') + '</div>';
  }

  function breakdownHTML(D) {
    const hasAny = D.sections.rw.n + D.sections.math.n > 0;
    const L = skillLists(D);
    const wait = 'Answer at least ' + MIN_SKILL_SAMPLE + ' questions in a skill to see it here.';
    return '<section class="card p-4 md:p-6 ' + reveal(5) + '" data-block="breakdown">' +
      '<div class="mb-4 flex flex-wrap items-end justify-between gap-3"><div><h2 class="text-[15px] font-semibold">Accuracy breakdown</h2>' +
      '<p class="mt-1 text-[12.5px] text-ink-soft">Based on your latest answer to each question.</p></div>' +
      '<div class="flex flex-wrap gap-3 text-[11.5px] text-ink-soft">' +
        [['bg-success', '80% and up'], ['bg-accent', '60–79%'], ['bg-danger', 'Below 60%']].map(function (x) {
          return '<span class="inline-flex items-center gap-1.5"><span class="h-2 w-2 rounded-full ' + x[0] + '"></span>' + x[1] + '</span>';
        }).join('') + '</div></div>' +
      (!hasAny ? '<div class="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-accent/30 bg-accent/10 px-4 py-3"><p class="text-[13px]">Your strengths and weak spots will appear after your first answers.</p>' +
        '<a href="#/question-bank" class="inline-flex h-11 items-center rounded-lg bg-accent px-4 text-[13px] font-semibold text-white hover:bg-accent-hover sm:h-9">Open Question Bank</a></div>' : '') +
      '<div class="grid grid-cols-1 gap-3 lg:grid-cols-2">' + sectionCardHTML(D, 'rw') + sectionCardHTML(D, 'math') + '</div>' +
      '<div class="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2">' +
        skillCardHTML('Focus areas', 'crosshair', 'text-danger', L.focus, L.ready ? 'No skill with enough answers is below ' + STRONG_FROM + '%.' : wait) +
        skillCardHTML('Strengths', 'shield-check', 'text-success', L.strong, L.ready ? 'No skill has reached ' + STRONG_FROM + '% yet.' : wait) +
      '</div></section>';
  }

  /* ---------- 4. Activity ---------- */
  function activitySeries(days, range) {
    const t = today(), out = [];
    for (let i = range - 1; i >= 0; i--) {
      const d = addDays(t, -i), r = days[iso(d)];
      out.push({ d: d, q: r ? r.q : 0, ok: r ? r.ok : 0, rw: r ? r.rw : 0, math: r ? r.math : 0 });
    }
    return out;
  }

  function activityStatsHTML(days, range) {
    const s = sumRange(days, 0, range);
    const box = function (label, value) {
      return '<div class="rounded-xl bg-raised px-3 py-3 sm:px-4"><div class="text-[11.5px] text-ink-soft">' + label + '</div><div class="num mt-1 text-[19px] font-semibold">' + value + '</div></div>';
    };
    return box('Active days', s.active + '<span class="text-[13px] text-ink-mute"> / ' + range + '</span>') +
      box('Questions', fmt(s.q)) + box('Accuracy', s.q ? pctOf(s.ok, s.q) + '%' : '—');
  }

  /* ---------- страница ---------- */
  function pageHTML(D, st) {
    const fresh = !D.tests.length && !Object.keys(D.days).length;
    return '<div class="mx-auto w-full max-w-[1180px] space-y-3 px-4 py-6 md:space-y-4 md:px-8 md:py-10">' +
      '<div class="flex flex-wrap items-end justify-between gap-4 pb-2 ' + reveal(0) + '"><div class="min-w-0">' +
        '<h1 class="text-[26px] font-semibold tracking-tight md:text-[30px]">My Metrics</h1>' +
        '<p class="mt-1.5 text-[14px] text-ink-soft">' + (fresh ? 'Solve your first questions and your progress will build up here.' : 'See how your scores, accuracy and study habits are changing.') + '</p></div>' +
        (DEMO ? '<span class="inline-flex h-7 items-center rounded-full bg-raised px-3 text-[12px] font-medium text-ink-soft">Demo data</span>' : '') +
      '</div>' +
      kpiHTML(D) +

      '<section class="card p-4 md:p-6 ' + reveal(4) + '" data-block="score">' +
        '<div class="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">' +
          '<div class="min-w-0">' +
            '<div class="mb-4 flex flex-wrap items-center justify-between gap-3"><h2 class="text-[15px] font-semibold">Score progress</h2>' +
              (D.tests.length ? segHTML('score', [['total', 'Total'], ['r', 'R&amp;W'], ['m', 'Math']], st.score, 'Score type') : '') + '</div>' +
            (D.tests.length
              ? '<div id="mxScore" class="mx-chart" tabindex="0" role="group" aria-label="Practice test scores. Use left and right arrow keys to read each result."></div><p id="mxScoreNote" class="mt-2 text-[12px] text-ink-mute"></p>'
              : emptyBox('line-chart', 'No test scores yet', 'Finish both modules of a section to get a score. Two results are enough to draw your trend.', '#/practice-tests', 'Take a practice test')) +
            '<div id="mxTests">' + testRowsHTML(D, st.allTests) + '</div>' +
          '</div>' +
          '<aside id="mxGoalPanel" class="border-t pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">' + goalPanelHTML(D) + '</aside>' +
        '</div></section>' +

      breakdownHTML(D) +

      '<section class="card p-4 md:p-6 ' + reveal(6) + '" data-block="activity">' +
        '<div class="mb-4 flex flex-wrap items-center justify-between gap-3"><h2 class="text-[15px] font-semibold">Activity</h2>' +
          segHTML('range', [[14, '14 days'], [30, '30 days'], [90, '90 days']], st.range, 'Time range') + '</div>' +
        '<div id="mxStats" class="grid grid-cols-3 gap-2.5">' + activityStatsHTML(D.days, st.range) + '</div>' +
        '<div class="mt-5"><div id="mxAct" class="mx-chart" tabindex="0" role="group" aria-label="Daily accuracy and questions. Use left and right arrow keys to read each day."></div></div>' +
      '</section>' +
    '</div>';
  }

  /* =====================================================================
     5. ГРАФИКИ (SVG в реальных пикселях — текст не растягивается)
     ===================================================================== */
  const f1 = function (n) { return n.toFixed(1); };
  const pathOf = function (pts) { return pts.map(function (p, i) { return (i ? 'L' : 'M') + f1(p.x) + ' ' + f1(p.y); }).join(' '); };

  // Монотонная кубическая интерполяция: линия плавная, но не выходит за значения точек
  function smoothPath(p) {
    const n = p.length;
    if (n < 3) return pathOf(p);
    const slope = [], tan = [];
    for (let i = 0; i < n - 1; i++) slope.push((p[i + 1].y - p[i].y) / (p[i + 1].x - p[i].x));
    tan.push(slope[0]);
    for (let i = 1; i < n - 1; i++) {
      tan.push(slope[i - 1] * slope[i] <= 0 ? 0 : 2 / (1 / slope[i - 1] + 1 / slope[i]));
    }
    tan.push(slope[n - 2]);
    let d = 'M' + f1(p[0].x) + ' ' + f1(p[0].y);
    for (let i = 0; i < n - 1; i++) {
      const h = (p[i + 1].x - p[i].x) / 3;
      d += ' C' + f1(p[i].x + h) + ' ' + f1(p[i].y + tan[i] * h) + ' ' + f1(p[i + 1].x - h) + ' ' + f1(p[i + 1].y - tan[i + 1] * h) + ' ' + f1(p[i + 1].x) + ' ' + f1(p[i + 1].y);
    }
    return d;
  }

  function scoreChart(host, D, mode, width) {
    const key = mode, flag = mode === 'r' ? 'fr' : mode === 'm' ? 'fm' : null;
    const list = D.tests.filter(function (x) { return x[key] != null && (!flag || x[flag]); }).slice(-20);
    if (!list.length) {
      host.innerHTML = '<div class="grid h-[240px] place-items-center rounded-xl border border-dashed px-6 text-center text-[13px] text-ink-soft">' +
        (mode === 'total' ? 'A total score needs both sections of a test.' : 'No score for this section yet.') + '</div>';
      return { points: [], note: '' };
    }
    const W = Math.max(260, width), H = 240, L = 40, R = 14, T = 16, B = 26;
    const goal = mode === 'total' ? Shell.data.goal() : null;
    const floor = mode === 'total' ? 400 : 200, ceil = mode === 'total' ? 1600 : 800;
    const vals = list.map(function (x) { return x[key]; }).concat(goal ? [goal] : []);
    let lo = Math.max(floor, Math.floor((Math.min.apply(null, vals) - 50) / 100) * 100);
    let hi = Math.min(ceil, Math.ceil((Math.max.apply(null, vals) + 50) / 100) * 100);
    if (hi - lo < 200) { lo = Math.max(floor, lo - 100); hi = Math.min(ceil, lo + 200); }
    const X = function (i) { return list.length === 1 ? (L + W - R) / 2 : L + 8 + i * (W - L - R - 16) / (list.length - 1); };
    const Y = function (v) { return T + (hi - v) / (hi - lo) * (H - T - B); };

    let svg = '';
    for (let i = 0; i <= 4; i++) {
      const v = lo + (hi - lo) * i / 4, y = Y(v);
      svg += '<line class="mx-grid" x1="' + L + '" x2="' + (W - R) + '" y1="' + f1(y) + '" y2="' + f1(y) + '"/>' +
        '<text class="mx-axis" x="0" y="' + f1(y + 3.5) + '">' + Math.round(v) + '</text>';
    }
    if (goal && goal >= lo && goal <= hi) {
      svg += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + f1(Y(goal)) + '" y2="' + f1(Y(goal)) + '" stroke="rgb(var(--c-ink) / .5)" stroke-width="1" stroke-dasharray="4 4"/>' +
        '<text class="mx-axis" text-anchor="end" x="' + (W - R) + '" y="' + f1(Y(goal) - 6) + '">Goal ' + goal + '</text>';
    }
    const pts = list.map(function (x, i) { return { x: X(i), y: Y(x[key]), v: x[key], rec: x }; });
    if (pts.length > 1) {
      const line = smoothPath(pts);
      svg += '<defs><linearGradient id="mxGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgb(59,130,246)" stop-opacity=".22"/><stop offset="1" stop-color="rgb(59,130,246)" stop-opacity="0"/></linearGradient></defs>' +
        '<path class="mx-soft" fill="url(#mxGrad)" d="' + line + ' L' + f1(pts[pts.length - 1].x) + ' ' + (H - B) + ' L' + f1(pts[0].x) + ' ' + (H - B) + ' Z"/>' +
        '<path class="mx-line" pathLength="1" fill="none" stroke="rgb(var(--c-accent))" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="' + line + '"/>';
    }
    svg += '<line data-cross x1="0" x2="0" y1="' + T + '" y2="' + (H - B) + '" stroke="rgb(var(--c-ink) / .25)" stroke-width="1" visibility="hidden"/>';
    svg += '<g class="mx-soft">' + pts.map(function (p, i) {
      return '<circle data-dot="' + i + '" cx="' + f1(p.x) + '" cy="' + f1(p.y) + '" r="4" fill="rgb(var(--c-accent))" stroke="rgb(var(--c-surface))" stroke-width="2"/>';
    }).join('') + '</g>';
    const last = pts[pts.length - 1];
    if (!goal || Math.abs(Y(goal) - last.y) > 22 || last.y < Y(goal)) {
      svg += '<text class="mx-soft" text-anchor="' + (pts.length === 1 ? 'middle' : 'end') + '" x="' + f1(pts.length === 1 ? last.x : last.x + 4) + '" y="' + f1(last.y - 11) + '" fill="rgb(var(--c-ink))" style="font:600 12px \'JetBrains Mono\',monospace">' + last.v + '</text>';
    }
    const labelOf = function (p) { return p.rec.ts ? dShort(new Date(p.rec.ts)) : 'Test ' + p.rec.t; };
    svg += '<text class="mx-axis" text-anchor="' + (pts.length === 1 ? 'middle' : 'start') + '" x="' + f1(pts.length === 1 ? pts[0].x : L) + '" y="' + (H - 6) + '">' + labelOf(pts[0]) + '</text>';
    if (pts.length > 1) svg += '<text class="mx-axis" text-anchor="end" x="' + (W - R) + '" y="' + (H - 6) + '">' + labelOf(last) + '</text>';

    host.innerHTML = '<svg width="' + W + '" height="' + H + '" aria-hidden="true">' + svg + '</svg>';

    const name = mode === 'total' ? 'Total score' : mode === 'r' ? 'R&W score' : 'Math score';
    return {
      note: pts.length === 1 ? 'Finish one more test to draw your trend.' : '',
      points: pts.map(function (p, i) {
        const prev = i ? p.v - pts[i - 1].v : null;
        return {
          x: p.x, y: p.y,
          html: '<div class="text-[11.5px] text-ink-soft">' + esc(p.rec.name) + (p.rec.ts ? ' · ' + dShort(new Date(p.rec.ts)) : '') + '</div>' +
            '<div class="mt-1 flex items-baseline gap-2"><span class="num text-[18px] font-semibold">' + p.v + '</span>' +
            (prev ? '<span class="num text-[11.5px] font-semibold ' + (prev > 0 ? 'text-success' : 'text-danger') + '">' + (prev > 0 ? '+' : '−') + Math.abs(prev) + '</span>' : '') + '</div>' +
            '<div class="text-[11.5px] text-ink-mute">' + esc(name) + '</div>' +
            (mode === 'total' ? '<div class="num mt-1 text-[11.5px] text-ink-soft">R&amp;W ' + p.rec.r + ' · Math ' + p.rec.m + '</div>' : '')
        };
      })
    };
  }

  function activityChart(host, D, range, width) {
    const series = activitySeries(D.days, range);
    const total = series.reduce(function (s, x) { return s + x.q; }, 0);
    if (!total) {
      host.innerHTML = emptyBox('bar-chart-3', 'No activity in this period', 'Every answer you check is counted here by day.', '#/question-bank', 'Solve questions');
      icons();
      return { points: [] };
    }
    // Две панели с общей осью дат: сверху точность (0–100%), снизу количество вопросов
    const W = Math.max(260, width), L = 40, R = 8;
    const A0 = 22, A1 = 86, B0 = 124, B1 = 244, H = 266;
    const rawMax = Math.max.apply(null, series.map(function (x) { return x.q; }));
    const step = rawMax <= 8 ? 2 : rawMax <= 20 ? 5 : rawMax <= 50 ? 10 : rawMax <= 100 ? 25 : Math.ceil(rawMax / 200) * 50;
    const max = Math.max(step, Math.ceil(rawMax / step) * step);
    const slot = (W - L - R) / series.length;
    const bw = clamp(slot - 2, 1.5, 24);
    const X = function (i) { return L + slot * i + slot / 2; };
    const AY = function (p) { return A1 - p / 100 * (A1 - A0); };
    const BY = function (v) { return B1 - v / max * (B1 - B0); };
    const grid = function (y, text) {
      return '<line class="mx-grid" x1="' + L + '" x2="' + (W - R) + '" y1="' + f1(y) + '" y2="' + f1(y) + '"/><text class="mx-axis" x="0" y="' + f1(y + 3.5) + '">' + text + '</text>';
    };

    let svg = '<text class="mx-axis" x="0" y="8">ACCURACY</text><text class="mx-axis" x="0" y="110">QUESTIONS</text>' +
      grid(AY(100), '100%') + grid(AY(50), '50%') + grid(AY(0), '0%') +
      grid(BY(max), max) + grid(BY(max / 2), Math.round(max / 2 * 10) / 10) + grid(BY(0), 0);

    series.forEach(function (x, i) {
      if (!x.q) return;
      const h = Math.max(2, B1 - BY(x.q)), r = Math.min(4, bw / 2, h);
      const x0 = X(i) - bw / 2, x1 = x0 + bw, y0 = B1 - h;
      svg += '<path class="mx-bar" data-col="' + i + '" style="--bd:' + Math.round(i / series.length * 400) + 'ms" fill="rgb(var(--c-accent))" d="M' + f1(x0) + ' ' + B1 + ' V' + f1(y0 + r) + ' Q' + f1(x0) + ' ' + f1(y0) + ' ' + f1(x0 + r) + ' ' + f1(y0) + ' H' + f1(x1 - r) + ' Q' + f1(x1) + ' ' + f1(y0) + ' ' + f1(x1) + ' ' + f1(y0 + r) + ' V' + B1 + ' Z"/>';
    });

    // Линия точности соединяет только дни с активностью; пустые дни не считаются за 0%
    const acc = [];
    series.forEach(function (x, i) { if (x.q) acc.push({ x: X(i), y: AY(x.ok / x.q * 100), i: i }); });
    if (acc.length > 1) svg += '<path class="mx-line" pathLength="1" fill="none" stroke="rgb(var(--c-success))" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="' + pathOf(acc) + '"/>';
    if (range <= 30 || acc.length === 1) {
      svg += '<g class="mx-soft">' + acc.map(function (p) {
        return '<circle cx="' + f1(p.x) + '" cy="' + f1(p.y) + '" r="' + (range <= 14 ? 4 : 3) + '" fill="rgb(var(--c-success))" stroke="rgb(var(--c-surface))" stroke-width="2"/>';
      }).join('') + '</g>';
    }
    svg += '<line data-cross x1="0" x2="0" y1="' + A0 + '" y2="' + B1 + '" stroke="rgb(var(--c-ink) / .25)" stroke-width="1" visibility="hidden"/>';
    svg += '<text class="mx-axis" x="' + L + '" y="' + (H - 4) + '">' + dShort(series[0].d) + '</text>' +
      '<text class="mx-axis" text-anchor="middle" x="' + f1((L + W - R) / 2) + '" y="' + (H - 4) + '">' + dShort(series[Math.floor(series.length / 2)].d) + '</text>' +
      '<text class="mx-axis" text-anchor="end" x="' + (W - R) + '" y="' + (H - 4) + '">Today</text>';

    host.innerHTML = '<svg width="' + W + '" height="' + H + '" aria-hidden="true">' + svg + '</svg>';

    return {
      points: series.map(function (x, i) {
        const split = (x.rw || x.math) ? '<div class="num mt-1 text-[11.5px] text-ink-mute">R&amp;W ' + x.rw + ' · Math ' + x.math + '</div>' : '';
        return {
          x: X(i), y: x.q ? BY(x.q) : B1,
          html: '<div class="text-[11.5px] text-ink-soft">' + dLong(x.d) + '</div>' +
            (x.q ? '<div class="mt-1 text-[13px] font-semibold"><span class="num">' + x.q + '</span> ' + (x.q === 1 ? 'question' : 'questions') + '</div>' +
              '<div class="text-[12px] text-success"><span class="num">' + pctOf(x.ok, x.q) + '%</span> accuracy</div>' + split
              : '<div class="mt-1 text-[13px] font-medium">No activity</div>')
        };
      })
    };
  }

  /* =====================================================================
     6. ЭКРАН
     ===================================================================== */
  Shell.register('metrics', {
    title: 'My Metrics',
    group: 'Insights',
    render: function (root, ctx) {
      injectStyle();
      let alive = true, D = null, io = null, ro = null, lastW = 0;
      const st = { score: 'total', range: 30, allTests: false };
      const timers = [], frames = [];
      const charts = {};     // id -> { points, active }

      const tip = document.createElement('div');
      tip.className = 'mx-tip rounded-xl border bg-raised px-3 py-2.5 shadow-2xl';
      tip.setAttribute('role', 'status');
      document.body.appendChild(tip);

      root.innerHTML =
        '<div class="mx-auto w-full max-w-[1180px] space-y-4 px-4 py-6 md:px-8 md:py-10" aria-busy="true">' +
          '<div class="h-9 w-48 animate-pulse rounded-lg bg-raised"></div>' +
          '<div class="grid grid-cols-2 gap-3 xl:grid-cols-4">' + '<div class="card h-[138px] animate-pulse"></div>'.repeat(4) + '</div>' +
          '<div class="card h-[360px] animate-pulse"></div></div>';

      const q = function (sel) { return root.querySelector(sel); };

      function hideTip() {
        tip.setAttribute('data-on', '0');
        Object.keys(charts).forEach(function (id) {
          charts[id].active = -1;
          const host = q('#' + id);
          if (!host) return;
          const line = host.querySelector('[data-cross]');
          if (line) line.setAttribute('visibility', 'hidden');
          host.querySelectorAll('[data-dot]').forEach(function (c) { c.setAttribute('r', '4'); });
          host.querySelectorAll('[data-col]').forEach(function (c) { c.removeAttribute('opacity'); });
        });
      }

      function showPoint(id, i) {
        const c = charts[id], host = q('#' + id);
        if (!c || !host || !c.points[i]) return;
        hideTip();
        c.active = i;
        const p = c.points[i];
        const line = host.querySelector('[data-cross]');
        if (line) { line.setAttribute('x1', p.x); line.setAttribute('x2', p.x); line.setAttribute('visibility', 'visible'); }
        const dot = host.querySelector('[data-dot="' + i + '"]');
        if (dot) dot.setAttribute('r', '6');
        if (host.querySelector('[data-col="' + i + '"]')) {
          host.querySelectorAll('[data-col]').forEach(function (b) {
            if (b.getAttribute('data-col') !== String(i)) b.setAttribute('opacity', '.45');
          });
        }
        tip.innerHTML = p.html;
        const box = host.getBoundingClientRect();
        const w = tip.offsetWidth, h = tip.offsetHeight;
        let left = box.left + p.x + 14;
        if (left + w > window.innerWidth - 8) left = box.left + p.x - w - 14;
        tip.style.left = clamp(left, 8, Math.max(8, window.innerWidth - w - 8)) + 'px';
        tip.style.top = clamp(box.top + p.y - h / 2, 64, Math.max(64, window.innerHeight - h - 8)) + 'px';
        tip.setAttribute('data-on', '1');
      }

      function bindChart(id) {
        const host = q('#' + id);
        if (!host) return;
        const move = function (e) {
          const c = charts[id];
          if (!c || !c.points.length) return;
          const x = e.clientX - host.getBoundingClientRect().left;
          let best = 0;
          for (let i = 1; i < c.points.length; i++) if (Math.abs(c.points[i].x - x) < Math.abs(c.points[best].x - x)) best = i;
          if (best !== c.active) showPoint(id, best);
        };
        host.addEventListener('pointermove', move);
        host.addEventListener('pointerdown', move);
        host.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') hideTip(); });
        host.addEventListener('focus', function () {
          const c = charts[id];
          if (c && c.points.length && c.active < 0 && host.matches(':focus-visible')) showPoint(id, c.points.length - 1);
        });
        host.addEventListener('blur', hideTip);
        host.addEventListener('keydown', function (e) {
          const c = charts[id];
          if (!c || !c.points.length) return;
          if (e.key === 'Escape') { hideTip(); return; }
          if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
          e.preventDefault();
          const from = c.active < 0 ? c.points.length - 1 : c.active;
          showPoint(id, clamp(from + (e.key === 'ArrowRight' ? 1 : -1), 0, c.points.length - 1));
        });
      }

      // visible = true: блок уже показан, график рисуется с анимацией (или сразу готовым при resize)
      function draw(id, animate) {
        const host = q('#' + id);
        if (!host) return;
        hideTip();
        const block = host.closest('.mx-reveal');
        const shown = !!block && block.classList.contains('mx-in');
        if (animate) host.classList.remove('mx-draw');
        const width = Math.floor(host.clientWidth);
        const res = id === 'mxScore' ? scoreChart(host, D, st.score, width) : activityChart(host, D, st.range, width);
        charts[id] = { points: res.points, active: -1 };
        if (id === 'mxScore') { const n = q('#mxScoreNote'); if (n) n.textContent = res.note; }
        if (shown) {
          void host.getBoundingClientRect();     // фиксируем начальное состояние перед анимацией
          host.classList.add('mx-draw');
        }
      }

      function show(el) {
        el.classList.add('mx-in');
        el.querySelectorAll('.mx-chart').forEach(function (h) { h.classList.add('mx-draw'); });
        // после появления убираем задержку, чтобы она не влияла на другие переходы
        timers.push(setTimeout(function () { el.style.removeProperty('--d'); }, 1000));
      }

      function observe() {
        const items = Array.prototype.slice.call(root.querySelectorAll('.mx-reveal'));
        // два кадра нужны, чтобы браузер увидел начальное состояние
        frames.push(requestAnimationFrame(function () {
          frames.push(requestAnimationFrame(function () {
            if (!alive) return;
            if (!window.IntersectionObserver) { items.forEach(show); return; }
            io = new IntersectionObserver(function (entries) {
              entries.forEach(function (en) {
                if (!en.isIntersecting) return;
                show(en.target);
                io.unobserve(en.target);
              });
            }, { threshold: 0.08 });
            items.forEach(function (el) { io.observe(el); });
          }));
        }));
      }

      function countUp() {
        if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        root.querySelectorAll('[data-count]').forEach(function (el) {
          const to = +el.getAttribute('data-count') || 0;
          if (!to) return;
          const t0 = performance.now();
          el.textContent = '0';
          (function step(now) {
            if (!alive) return;
            const p = clamp((now - t0) / 800, 0, 1);
            el.textContent = fmt(Math.round(to * (1 - Math.pow(1 - p, 3))));
            if (p < 1) frames.push(requestAnimationFrame(step));
          })(t0);
          // страховка: в фоновой вкладке кадры не приходят
          timers.push(setTimeout(function () { el.textContent = fmt(to); }, 1000));
        });
      }

      function paint() {
        if (!alive) return;
        try { D = snapshot(); }
        catch (err) {
          console.error('[metrics]', err);
          root.innerHTML = '<div class="mx-auto max-w-[460px] px-6 py-24 text-center"><h1 class="text-[20px] font-semibold">Metrics could not be loaded</h1>' +
            '<p class="mt-2 text-[13.5px] text-ink-soft">Refresh the page to try again. Your saved progress has not been changed.</p></div>';
          return;
        }
        root.innerHTML = pageHTML(D, st);
        icons();
        draw('mxScore');
        draw('mxAct');
        bindChart('mxScore');
        bindChart('mxAct');
        countUp();
        observe();

        if (window.ResizeObserver) {
          const widths = {};
          ro = new ResizeObserver(function (entries) {
            entries.forEach(function (en) {
              const id = en.target.id;
              const w = Math.floor(en.target.clientWidth);
              if (!w || w === widths[id]) return;
              widths[id] = w;
              draw(id);
            });
          });
          ['mxScore', 'mxAct'].forEach(function (id) {
            const el = q('#' + id);
            if (el) { widths[id] = Math.floor(el.clientWidth); ro.observe(el); }
          });
        }
      }

      function onClick(e) {
        const seg = e.target.closest('[data-seg]');
        if (seg) {
          const name = seg.getAttribute('data-seg'), v = seg.getAttribute('data-v');
          if (String(st[name]) === v) return;
          st[name] = name === 'range' ? +v : v;
          root.querySelectorAll('[data-seg="' + name + '"]').forEach(function (b) {
            b.setAttribute('aria-pressed', String(b.getAttribute('data-v') === v));
          });
          if (name === 'range') { q('#mxStats').innerHTML = activityStatsHTML(D.days, st.range); draw('mxAct', true); }
          else draw('mxScore', true);
          return;
        }
        const b = e.target.closest('[data-act]');
        if (!b) return;
        const act = b.getAttribute('data-act');
        if (act === 'allTests') {
          st.allTests = !st.allTests;
          q('#mxTests').innerHTML = testRowsHTML(D, st.allTests);
          icons();
        } else if (act === 'practice') {
          if (!Data.solverReady) { Shell.toast('The Solver is not connected yet'); return; }
          const session = Data.startSession({
            section: b.getAttribute('data-sec'), domain: b.getAttribute('data-domain'), skill: b.getAttribute('data-skill'),
            status: 'all', difficulty: 'all', shuffle: true
          });
          if (!session.ids.length) { Shell.toast('No questions found for this skill'); return; }
          ctx.navigate('solver');
        }
      }

      function onSubmit(e) {
        if (!e.target || e.target.id !== 'mxGoalForm') return;
        e.preventDefault();
        const v = +q('#mxGoal').value;
        if (!(v >= 400 && v <= 1600)) { Shell.toast('Enter a goal between 400 and 1600'); return; }
        Shell.data.setGoal(v);
        q('#mxGoalPanel').innerHTML = goalPanelHTML(D);
        draw('mxScore');
        Shell.toast('Goal set to ' + Shell.data.goal());
      }

      const onScroll = function () { hideTip(); };
      const onDocDown = function (e) { if (!e.target.closest || !e.target.closest('.mx-chart')) hideTip(); };
      root.addEventListener('click', onClick);
      root.addEventListener('submit', onSubmit);
      window.addEventListener('scroll', onScroll, { passive: true });
      document.addEventListener('pointerdown', onDocDown);

      Promise.resolve(Data.load()).then(paint, paint);

      return function () {
        alive = false;
        if (io) io.disconnect();
        if (ro) ro.disconnect();
        timers.forEach(clearTimeout);
        frames.forEach(cancelAnimationFrame);
        root.removeEventListener('click', onClick);
        root.removeEventListener('submit', onSubmit);
        window.removeEventListener('scroll', onScroll);
        document.removeEventListener('pointerdown', onDocDown);
        tip.remove();
      };
    }
  });

  // Сохраняем уже имеющиеся результаты тестов сразу, пока пересдача их не заменила
  // (после загрузки всех скриптов, чтобы расчёт из practice-tests.js был уже доступен)
  function seedHistory() {
    try { syncTests(); } catch (e) { console.error('[metrics] syncTests', e); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', seedHistory);
  else seedHistory();

  // Для отладки в консоли
  window.SPMetrics = { snapshot: snapshot };
})();
