/* =====================================================================
   SATPath — Study Planner (study-planner.js)
   ---------------------------------------------------------------------
   Экран  #/study-planner.  Подключать ПОСЛЕ shell.js и dataAdapter.js.

   Что внутри:
     1. Schedule: дата SAT + окна по дням недели (0 / 30 / 60 / 90 / 120 / 180 мин)
     2. Генератор недельного плана по слабым навыкам
     3. Фазы подготовки: Foundation → Weak Spots → Full Mocks & Review
     4. Rebalance: перенос пропущенных задач в ближайшие окна (с Undo)
     5. Автоотметка задач по событиям sp:progress, sp:blitz-complete, sp:pt-complete

   Читает (не изменяет):
     SPData.progress.get(), satpath_pt_results_v1, SPPracticeTests, SPReview, SPVocab
   Пишет:
     satpath_study_planner_v1   расписание, план, чекбоксы
     satpath_exam_date_v1       только через SPShell.data.setExam()
   В режиме ?demo=1 план живёт только в памяти.

   Точка интеграции Firebase:
     window.addEventListener('sp:planner', e => ...)   e.detail = состояние планировщика
   ===================================================================== */
(function () {
  'use strict';

  const Shell = window.SPShell;
  const Data = window.SPData;
  if (!Shell || !Data) {
    console.error('[study-planner] Подключите shell.js и dataAdapter.js ДО этого файла.');
    return;
  }

  /* -------------------------------------------------------------------
     1. КОНСТАНТЫ
     ------------------------------------------------------------------- */
  const DEMO = /[?&]demo=1(&|$)/.test(location.search);
  const K_PLAN = 'satpath_study_planner_v1';
  const K_EXAM = 'satpath_exam_date_v1';
  const K_PT = 'satpath_pt_results_v1';

  const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const DURATIONS = [0, 30, 60, 90, 120, 180];
  const TIMES = [['am', 'Morning'], ['pm', 'Afternoon'], ['eve', 'Evening']];
  const PRESETS = [
    ['light', 'Light', [30, 30, 30, 30, 0, 90, 0]],
    ['balanced', 'Balanced', [60, 30, 60, 30, 0, 180, 30]],
    ['intensive', 'Intensive', [90, 60, 90, 60, 60, 180, 120]]
  ];
  const STRONG_FROM = 70;        // тот же порог, что в metrics.js
  const MIN_SAMPLE = 3;          // с этого числа ответов навык может считаться слабым
  const STARTER_BELOW = 10;      // меньше ответов и нет тестов = стартовый план
  const STRETCH = 15;            // на сколько минут Rebalance может растянуть окно
  const SEC_NAME = { rw: 'Reading & Writing', math: 'Math' };

  const TYPES = {
    diag:       { label: 'Diagnostic', icon: 'target',  tone: 'bg-accent/15 text-accent',   prio: 6 },
    mock:       { label: 'Mock test',  icon: 'file',    tone: 'bg-accent/15 text-accent',   prio: 5 },
    practice:   { label: 'Practice',   icon: 'pencil',  tone: 'bg-success/10 text-success', prio: 4 },
    mockreview: { label: 'Test review', icon: 'search', tone: 'bg-hl/15 text-hl',           prio: 3 },
    review:     { label: 'Errors',     icon: 'rotate',  tone: 'bg-danger/10 text-danger',   prio: 3 },
    blitz:      { label: 'Blitz',      icon: 'zap',     tone: 'bg-hl/15 text-hl',           prio: 1 },
    vocab:      { label: 'Vocabulary', icon: 'book',    tone: 'bg-raised text-ink-soft',    prio: 1 }
  };

  const PHASES = {
    foundation: { name: 'Foundation',          bar: 'bg-accent',  text: 'Cover every skill and build a steady habit. A mock test every other week.' },
    weak:       { name: 'Weak Spots',          bar: 'bg-hl',      text: 'Most practice goes to your weakest skills. One mock test each week.' },
    mocks:      { name: 'Full Mocks & Review', bar: 'bg-success', text: 'Rehearse test day: up to two mock tests a week, each followed by review.' }
  };
  const PHASE_ORDER = ['foundation', 'weak', 'mocks'];

  /* -------------------------------------------------------------------
     2. УТИЛИТЫ
     ------------------------------------------------------------------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  const pad = function (n) { return n < 10 ? '0' + n : '' + n; };
  const iso = function (d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };
  const parseISO = function (s) { const p = String(s).split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); };
  const today = function () { const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()); };
  const addDays = function (d, n) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n); };
  const diffDays = function (a, b) { return Math.round((b - a) / 864e5); };
  const dowOf = function (d) { return (d.getDay() + 6) % 7; };               // Пн = 0
  const mondayOf = function (d) { return addDays(d, -dowOf(d)); };
  const dShort = function (d) { return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); };
  const dLong = function (d) { return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); };
  const plural = function (n, one) { return n + ' ' + one + (n === 1 ? '' : 's'); };
  const sumMin = function (list) { return list.reduce(function (a, t) { return a + t.min; }, 0); };
  function hoursText(min) {
    const h = Math.floor(min / 60), m = min % 60;
    return h ? h + 'h' + (m ? ' ' + m + 'm' : '') : m + 'm';
  }
  let uidN = 0;
  const uid = function () { uidN++; return 'sp' + Date.now().toString(36) + uidN.toString(36) + Math.floor(Math.random() * 1296).toString(36); };

  const PATHS = {
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="m9 15 2 2 4-4"/>',
    pencil: '<path d="M17 3a2.8 2.8 0 0 1 4 4L8 20l-5 1 1-5z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
    rotate: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
    zap: '<path d="M13 2 3 14h8l-1 8 10-12h-8z"/>',
    book: '<path d="M12 6c-2-2-5-2-9-2v15c4 0 7 0 9 2 2-2 5-2 9-2V4c-4 0-7 0-9 2zM12 6v15"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="3"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    sliders: '<path d="M4 6h10M18 6h2M4 12h2M10 12h10M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="8" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
    shuffle: '<path d="m16 3 5 0 0 5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/>',
    refresh: '<path d="M21 12a9 9 0 0 1-15.5 6.2M3 12A9 9 0 0 1 18.500 5.8"/><path d="M18 2v4h-4M6 22v-4h4"/>',
    moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
    flag: '<path d="M4 22V4a8 5 0 0 1 8 0 8 5 0 0 0 8 0v11a8 5 0 0 1-8 0 8 5 0 0 0-8 0"/>'
  };
  function icon(name, cls) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="shrink-0 ' + (cls || 'h-4 w-4') + '">' + PATHS[name] + '</svg>';
  }

  /* -------------------------------------------------------------------
     3. ХРАНИЛИЩЕ
     { v, slots:[{min,time}] x7 | null, weeks:{ mondayISO:{ sig, tasks:[] } }, undo }
     ------------------------------------------------------------------- */
  let memRaw = null;

  function readRaw(k) {
    try { return localStorage.getItem(k); } catch (e) { return null; }
  }
  function jget(k, fallback) {
    try {
      const v = JSON.parse(readRaw(k));
      return v && typeof v === 'object' ? v : fallback;
    } catch (e) { return fallback; }
  }
  function load() {
    let s = null;
    if (!DEMO) s = jget(K_PLAN, null);
    if (!s && memRaw) { try { s = JSON.parse(memRaw); } catch (e) {} }
    if (!s || typeof s !== 'object') s = {};
    s.v = 1;
    if (!Array.isArray(s.slots) || s.slots.length !== 7) s.slots = null;
    if (!s.weeks || typeof s.weeks !== 'object') s.weeks = {};
    return s;
  }
  function save(s) {
    const keys = Object.keys(s.weeks).sort();
    while (keys.length > 8) delete s.weeks[keys.shift()];
    memRaw = JSON.stringify(s);
    if (DEMO) return;
    try { localStorage.setItem(K_PLAN, memRaw); } catch (e) {}
    try { window.dispatchEvent(new CustomEvent('sp:planner', { detail: s })); } catch (e) {}
  }

  /* ---------- дата экзамена ---------- */
  let memExam = null;    // только для demo
  function examInfo() {
    const raw = DEMO && memExam ? memExam : readRaw(K_EXAM);
    const isSet = !!raw && /^\d{4}-\d{2}-\d{2}$/.test(raw);
    // SPShell.data.exam() отдаёт и дату-заглушку, поэтому «задана ли дата» проверяем по ключу
    const shellDate = Shell.data.exam();
    return {
      isSet: isSet,
      date: isSet ? (DEMO && memExam ? parseISO(memExam) : (shellDate || parseISO(raw))) : null,
      suggestion: !isSet ? shellDate : null
    };
  }
  function setExam(value) {
    if (DEMO) memExam = value;
    else Shell.data.setExam(value);
  }

  /* -------------------------------------------------------------------
     4. АНАЛИЗ СЛАБЫХ ТЕМ
     ------------------------------------------------------------------- */
  function analyze() {
    let prog = {};
    try { prog = Data.progress.get() || {}; } catch (e) {}

    const stats = {};
    const secAgg = { rw: { n: 0, ok: 0 }, math: { n: 0, ok: 0 } };
    let answered = 0;

    Object.keys(prog).forEach(function (id) {
      if (!prog[id]) return;
      answered++;
      let q = null;
      try { q = Data.getQuestion(id); } catch (e) {}
      if (!q || !secAgg[q.section]) return;
      const good = prog[id].r === 'ok' ? 1 : 0;
      secAgg[q.section].n++;
      secAgg[q.section].ok += good;
      const key = q.section + '|' + q.domain + '|' + q.skill;
      const s = stats[key] || (stats[key] = { n: 0, ok: 0 });
      s.n++;
      s.ok += good;
    });

    // Баллы секций из Practice Tests (берём последний тест, где секция есть)
    const pt = jget(K_PT, {});
    const secScore = { rw: null, math: null };
    let ptCount = 0;
    Object.keys(pt).sort(function (a, b) { return (+a) - (+b); }).forEach(function (t) {
      const r = pt[t] || {};
      let used = false;
      if (r.r && +r.r.score > 0) { secScore.rw = +r.r.score; used = true; }
      if (r.m && +r.m.score > 0) { secScore.math = +r.m.score; used = true; }
      if (used) ptCount++;
    });
    // Отдельный завершённый модуль тоже считается данными
    let hasModules = false;
    const PT = window.SPPracticeTests;
    if (PT && PT.doneMods) {
      for (let t = 1; t <= 8; t++) {
        try { if (Object.keys(PT.doneMods(t)).length) hasModules = true; } catch (e) {}
      }
    }

    // Насколько секции нужно внимание: 0..1
    function secNeed(sec) {
      if (secScore[sec] !== null) return Math.max(0, Math.min(1, (800 - secScore[sec]) / 600));
      const a = secAgg[sec];
      return a.n ? 1 - (a.ok + 2) / (a.n + 4) : 0.4;
    }
    const need = { rw: secNeed('rw'), math: secNeed('math') };

    // Все навыки, по которым в банке есть вопросы
    const all = [];
    try {
      const tree = Data.tree({ status: 'all' });
      ['rw', 'math'].forEach(function (sec) {
        tree.sections[sec].domains.forEach(function (d) {
          d.skills.forEach(function (sk) {
            if (!(sk.count > 0)) return;
            const st = stats[sec + '|' + d.name + '|' + sk.name] || { n: 0, ok: 0 };
            const smooth = (st.ok + 2.6) / (st.n + 4);        // сглаживание: 1 ошибка из 1 не делает навык худшим
            all.push({
              section: sec, domain: d.name, skill: sk.name, n: st.n, ok: st.ok,
              pct: st.n ? Math.round(st.ok / st.n * 100) : null,
              priority: (1 - smooth) * (1 + need[sec])
            });
          });
        });
      });
    } catch (e) { console.error('[study-planner] tree', e); }

    const weak = all.filter(function (s) { return s.n >= MIN_SAMPLE && s.pct < STRONG_FROM; })
      .sort(function (a, b) { return (b.priority - a.priority) || (b.n - a.n); });
    const fresh = all.filter(function (s) { return s.n < MIN_SAMPLE; })
      .sort(function (a, b) { return a.n - b.n; });
    const rest = all.filter(function (s) { return s.n >= MIN_SAMPLE && s.pct >= STRONG_FROM; })
      .sort(function (a, b) { return (a.pct - b.pct) || (a.n - b.n); });

    return {
      answered: answered, ptCount: ptCount, need: need, secScore: secScore,
      weak: weak, fresh: fresh, rest: rest, all: all,
      starter: answered < STARTER_BELOW && !ptCount && !hasModules
    };
  }

  // Чередует секции, начиная с той, которой нужно больше внимания
  function interleave(list, first) {
    const a = list.filter(function (s) { return s.section === first; });
    const b = list.filter(function (s) { return s.section !== first; });
    const out = [];
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
      if (a[i]) out.push(a[i]);
      if (b[i]) out.push(b[i]);
    }
    return out;
  }
  const weakerSection = function (A) { return A.need.rw > A.need.math ? 'rw' : 'math'; };

  function skillQueue(A, phase) {
    const first = weakerSection(A);
    const weak = interleave(A.weak, first);
    const fresh = interleave(A.fresh, first);
    const rest = interleave(A.rest, first);
    let out;
    if (A.starter) out = interleave(A.all, first);
    else if (phase === 'foundation') {
      out = [];
      for (let i = 0; i < Math.max(weak.length, fresh.length); i++) {
        if (weak[i]) out.push(weak[i]);
        if (fresh[i]) out.push(fresh[i]);
      }
      out = out.concat(rest);
    } else if (phase === 'weak') {
      // самые слабые навыки повторяются дважды за цикл
      out = weak.slice(0, 6).concat(weak.slice(0, 4), weak.slice(6), fresh.slice(0, 4));
      if (!out.length) out = fresh.concat(rest);
    } else {
      out = weak.slice(0, 6);
      if (out.length < 4) out = out.concat(rest.slice(0, 4), fresh.slice(0, 4));
    }
    return out.length ? out : interleave(A.all, first);
  }

  /* -------------------------------------------------------------------
     5. ФАЗЫ
     ------------------------------------------------------------------- */
  // Длины фаз зависят от того, сколько всего дней от старта плана до экзамена
  function phaseSpans(start, exam) {
    const total = Math.max(1, diffDays(start, exam));
    const mocks = Math.min(21, Math.ceil(total * 0.4));
    let weak = Math.min(35, Math.ceil((total - mocks) * 0.65));
    let foundation = total - mocks - weak;
    if (foundation < 7) { weak += foundation; foundation = 0; }
    return { total: total, foundation: foundation, weak: weak, mocks: mocks };
  }
  function phaseAt(date, exam) {
    const left = diffDays(date, exam);
    const S = phaseSpans(anchorDate(), exam);
    if (left <= S.mocks) return 'mocks';
    if (left <= S.mocks + S.weak) return 'weak';
    return 'foundation';
  }
  let anchorCache = null;
  function anchorDate() { return anchorCache || today(); }

  /* -------------------------------------------------------------------
     6. ГЕНЕРАТОР ПЛАНА
     ------------------------------------------------------------------- */
  function task(date, type, min, title, sub, why, extra) {
    return Object.assign({
      id: uid(), date: iso(date), type: type, min: min, title: title, sub: sub, why: why || '',
      done: false, count: 0
    }, extra || {});
  }

  function practiceTask(date, min, sk, A) {
    const target = Math.max(5, Math.round(min / (sk.section === 'math' ? 3 : 2.25)));
    let why;
    if (sk.n >= MIN_SAMPLE && sk.pct < STRONG_FROM) why = 'Weak spot: ' + sk.pct + '% across ' + sk.n + ' answers';
    else if (A.starter) why = 'Builds your starting baseline';
    else if (sk.n < MIN_SAMPLE) why = 'Not enough data on this skill yet';
    else why = 'Keeps a solid skill sharp: ' + sk.pct + '%';
    return task(date, 'practice', min, sk.skill, SEC_NAME[sk.section] + ' · ' + target + ' questions', why,
      { section: sk.section, domain: sk.domain, skill: sk.skill, target: target });
  }

  function lightTask(date, min, kind) {
    if (kind === 'review') {
      return task(date, 'review', min, 'Fix your mistakes', 'Saved & Errors · work through what is due', 'Redoing a miss shows whether the skill has stuck');
    }
    if (kind === 'blitz') {
      return task(date, 'blitz', min, 'Math Blitz', 'Timed rounds · speed and accuracy', 'Short windows are good for pacing practice');
    }
    return task(date, 'vocab', min, 'Vocabulary review', 'Flashcards or Context Practice', 'Supports Words in Context questions');
  }

  // Номера тестов: сначала незавершённые, потом новые, потом пересдачи
  function testPool(taken) {
    const PT = window.SPPracticeTests;
    const going = [], fresh = [], old = [];
    for (let t = 1; t <= 8; t++) {
      let busy = false, used = false;
      try {
        busy = !!(PT && PT.Store && PT.Store.sess(t));
        used = !!(PT && PT.doneMods && Object.keys(PT.doneMods(t)).length);
      } catch (e) {}
      (busy ? going : used ? old : fresh).push(t);
    }
    const list = going.concat(fresh, old);
    const free = list.filter(function (t) { return !taken[t]; });
    return free.length ? free : list;
  }

  function mockTasks(date, minutes, section, testNo) {
    const out = [];
    let main;
    if (minutes >= 150) {
      const m = 145;
      main = task(date, 'mock', m, 'Full Practice Test ' + testNo, 'All 4 modules + 10 min break', 'Rehearses test-day pacing and stamina', { t: testNo, mods: 'full' });
      out.push(main);
      out.push(task(date, 'mockreview', minutes - m, 'Review Practice Test ' + testNo, 'Open every missed and slow question', 'The review is where a mock turns into points', { t: testNo, link: main.id }));
    } else {
      const m = section === 'math' ? 70 : 65;
      main = task(date, 'mock', m, SEC_NAME[section] + ' mock · Test ' + testNo, 'Select ' + (section === 'math' ? 'Math' : 'R&W') + ' Module 1 + Module 2', 'A full section under real timing', { t: testNo, mods: section });
      out.push(main);
      out.push(task(date, 'mockreview', minutes - m, 'Review your mock', 'Open every missed and slow question', 'The review is where a mock turns into points', { t: testNo, link: main.id }));
    }
    return out;
  }

  function diagTask(date, minutes) {
    let sub;
    if (minutes >= 150) sub = 'Take the full test (about 2h 14m + break)';
    else if (minutes >= 120) sub = 'Take R&W Modules 1 + 2 and Math Module 1';
    else if (minutes >= 90) sub = 'Take R&W Module 1 and Math Module 1';
    else sub = 'Start with one module; add the others in later sessions';
    return task(date, 'diag', minutes, 'Take a diagnostic Practice Test', sub, 'Your results will personalize the rest of the plan', { t: testPool({})[0] });
  }

  // Строит задачи недели. kept — задачи, которые трогать нельзя (прошлое, выполненное, перенесённое)
  function generate(S, monday, kept, A, exam) {
    const now = today();
    const weekNo = Math.floor(Date.UTC(monday.getFullYear(), monday.getMonth(), monday.getDate()) / 864e5 / 7);
    const out = [];
    const days = [];

    for (let i = 0; i < 7; i++) {
      const d = addDays(monday, i);
      if (d < now || d >= exam) continue;
      const used = sumMin(kept.filter(function (t) { return t.date === iso(d); }));
      let free = S.slots[i].min - used;
      const left = diffDays(d, exam);
      if (left === 1) free = Math.min(free, 30);       // накануне экзамена только лёгкое
      if (free >= 15) days.push({ d: d, dow: i, free: free, left: left });
    }
    if (!days.length) return out;

    const due = Shell.data.mistakesCount();
    let skillI = Math.abs(weekNo * 5);
    let lightI = Math.abs(weekNo);
    let reviewPlanned = false;

    function nextSkill(date, avoidSection) {
      const queue = skillQueue(A, phaseAt(date, exam));
      if (!queue.length) return null;
      for (let k = 0; k < queue.length; k++) {
        const s = queue[(skillI + k) % queue.length];
        if (!avoidSection || s.section !== avoidSection) { skillI += k + 1; return s; }
      }
      return queue[skillI++ % queue.length];
    }
    function nextLight() {
      // накопившиеся ошибки идут в первое же короткое окно
      if (due > 0 && !reviewPlanned) { reviewPlanned = true; return 'review'; }
      const cycle = due > 0 ? ['vocab', 'blitz', 'review'] : ['vocab', 'blitz'];
      return cycle[lightI++ % cycle.length];
    }

    // Диагностика: только в стартовом плане и только один раз
    let hasDiag = kept.some(function (t) { return t.type === 'diag' && !t.released; });
    Object.keys(S.weeks).forEach(function (k) {
      if (k === iso(monday)) return;
      S.weeks[k].tasks.forEach(function (t) {
        if (t.type === 'diag' && (t.done || (!t.released && t.date >= iso(now)))) hasDiag = true;
      });
    });
    if (A.starter && !hasDiag) {
      const first = days.filter(function (x) { return x.left > 1; })[0];
      if (first) {
        const m = Math.min(first.free, 180);
        out.push(diagTask(first.d, m));
        first.free -= m;
      }
    }

    // Выбор дней для мок-тестов
    const mockDays = {};
    if (!A.starter) {
      const ph = phaseAt(days[days.length - 1].d, exam);
      let quota = ph === 'mocks' ? 2 : ph === 'weak' ? 1 : (weekNo % 2 === 0 ? 1 : 0);
      quota -= kept.filter(function (t) { return t.type === 'mock'; }).length;
      days.filter(function (x) { return x.free >= 90 && x.left > 2; })
        .sort(function (a, b) {
          return ((b.dow >= 5) - (a.dow >= 5)) || (b.free - a.free) || (a.dow - b.dow);
        })
        .forEach(function (x) {
          if (quota > 0 && !mockDays[x.dow] && !mockDays[x.dow - 1] && !mockDays[x.dow + 1]) {
            mockDays[x.dow] = true;
            quota--;
          }
        });
    }

    const taken = {};
    Object.keys(S.weeks).forEach(function (k) {
      if (k === iso(monday)) return;
      S.weeks[k].tasks.forEach(function (t) { if (t.type === 'mock' && !t.done && !t.released) taken[t.t] = 1; });
    });
    kept.forEach(function (t) { if (t.type === 'mock') taken[t.t] = 1; });
    let sectionTurn = weakerSection(A);

    function addPractice(date, min, avoid) {
      const sk = nextSkill(date, avoid);
      if (!sk) { out.push(lightTask(date, min, 'blitz')); return null; }
      out.push(practiceTask(date, min, sk, A));
      return sk.section;
    }

    days.forEach(function (x) {
      let free = x.free;
      const d = x.d;
      if (free < 15) return;

      if (x.left === 1) {
        out.push(lightTask(d, free, due > 0 ? 'review' : 'vocab'));
        return;
      }
      if (mockDays[x.dow]) {
        const no = testPool(taken)[0];
        taken[no] = 1;
        mockTasks(d, free, sectionTurn, no).forEach(function (t) { out.push(t); });
        if (free < 150) sectionTurn = sectionTurn === 'math' ? 'rw' : 'math';
        return;
      }
      if (free < 45) {
        // каждое четвёртое короткое окно — мини-практика по слабому навыку
        if ((lightI + x.dow) % 4 === 3) addPractice(d, free, null);
        else out.push(lightTask(d, free, nextLight()));
        return;
      }
      if (free < 75) {
        addPractice(d, free - 15, null);
        out.push(lightTask(d, 15, nextLight()));
        return;
      }
      let lastSec = null;
      let blocks = 0;
      while (free >= 60 && blocks < 3) {
        lastSec = addPractice(d, 45, lastSec);
        free -= 45;
        blocks++;
      }
      if (free >= 45) {
        out.push(lightTask(d, free - 15, nextLight()));
        out.push(lightTask(d, 15, nextLight()));
      } else if (free >= 15) {
        out.push(lightTask(d, free, nextLight()));
      }
    });

    return out;
  }

  const signature = function (S, A, exam) {
    return [iso(exam), S.slots.map(function (s) { return s.min; }).join(','), A.starter ? 's' : 'p'].join('|');
  };

  function buildWeek(S, monday, A, exam) {
    const key = iso(monday);
    const nowKey = iso(today());
    const old = S.weeks[key] ? S.weeks[key].tasks : [];
    const examKey = iso(exam);
    const kept = old.filter(function (t) {
      if (t.done || t.date < nowKey) return true;
      if (!t.movedFrom || t.date >= examKey) return false;
      return !(t.type === 'diag' && !A.starter);
    });
    const tasks = kept.concat(generate(S, monday, kept, A, exam))
      .sort(function (a, b) { return a.date < b.date ? -1 : a.date > b.date ? 1 : 0; });
    S.weeks[key] = { sig: signature(S, A, exam), tasks: tasks };
  }

  // Гарантирует, что неделя существует и соответствует расписанию и дате
  function ensureWeek(S, monday, A, exam) {
    const w = S.weeks[iso(monday)];
    if (w && w.sig === signature(S, A, exam)) return false;
    buildWeek(S, monday, A, exam);
    return true;
  }

  /* -------------------------------------------------------------------
     7. REBALANCE
     ------------------------------------------------------------------- */
  function allTasks(S) {
    return Object.keys(S.weeks).sort().reduce(function (a, k) { return a.concat(S.weeks[k].tasks); }, []);
  }
  function missedTasks(S) {
    const nowKey = iso(today()), from = iso(addDays(today(), -7));
    return allTasks(S).filter(function (t) { return !t.done && !t.released && t.date < nowKey && t.date >= from; });
  }

  function rebalance(S, A, exam) {
    const before = JSON.stringify(S.weeks);
    const thisMon = mondayOf(today()), nextMon = addDays(thisMon, 7);
    ensureWeek(S, thisMon, A, exam);
    ensureWeek(S, nextMon, A, exam);

    const missed = missedTasks(S).sort(function (a, b) {
      return (TYPES[b.type].prio - TYPES[a.type].prio) || (a.date < b.date ? -1 : 1);
    });

    const targets = [];
    for (let i = 0; i < 14; i++) {
      const d = addDays(today(), i);
      if (d >= exam) break;
      const slot = S.slots[dowOf(d)].min;
      if (slot > 0) targets.push({ d: d, key: iso(d), week: iso(mondayOf(d)), slot: slot, left: diffDays(d, exam) });
    }

    let moved = 0, released = 0, replaced = 0;

    function dayList(x) {
      return S.weeks[x.week] ? S.weeks[x.week].tasks.filter(function (t) { return t.date === x.key; }) : [];
    }
    function allowed(m, x) {
      if (!S.weeks[x.week]) return false;
      if (x.left === 1 && TYPES[m.type].prio > 1 && m.type !== 'review') return false;
      if (m.link) {
        const parent = allTasks(S).filter(function (t) { return t.id === m.link; })[0];
        if (parent && !parent.done && (parent.released || x.key < parent.date)) return false;
      }
      return true;
    }
    function place(m, x) {
      const src = Object.keys(S.weeks).filter(function (k) { return S.weeks[k].tasks.indexOf(m) >= 0; })[0];
      if (src) S.weeks[src].tasks.splice(S.weeks[src].tasks.indexOf(m), 1);
      m.movedFrom = m.movedFrom || m.date;
      m.date = x.key;
      S.weeks[x.week].tasks.push(m);
      S.weeks[x.week].tasks.sort(function (a, b) { return a.date < b.date ? -1 : a.date > b.date ? 1 : 0; });
      moved++;
    }

    missed.forEach(function (m) {
      // 1) свободное место (окно можно растянуть не более чем на STRETCH минут)
      for (let i = 0; i < targets.length; i++) {
        const x = targets[i];
        if (!allowed(m, x)) continue;
        if (sumMin(dayList(x)) + m.min <= x.slot + STRETCH) { place(m, x); return; }
      }
      // 2) важная задача может заменить ещё не начатые лёгкие
      if (TYPES[m.type].prio >= 3) {
        for (let i = 0; i < targets.length; i++) {
          const x = targets[i];
          if (!allowed(m, x)) continue;
          const light = dayList(x).filter(function (t) { return !t.done && !t.movedFrom && TYPES[t.type].prio === 1; });
          let load = sumMin(dayList(x));
          if (load - sumMin(light) + m.min > x.slot + STRETCH) continue;
          while (load + m.min > x.slot + STRETCH && light.length) {
            const drop = light.pop();
            S.weeks[x.week].tasks.splice(S.weeks[x.week].tasks.indexOf(drop), 1);
            load -= drop.min;
            replaced++;
          }
          place(m, x);
          return;
        }
      }
      m.released = true;
      released++;
    });

    S.undo = { weeks: before, day: iso(today()) };
    return { moved: moved, released: released, replaced: replaced };
  }

  /* -------------------------------------------------------------------
     8. АВТООТМЕТКА (работает и когда экран планировщика закрыт)
     ------------------------------------------------------------------- */
  function autoUpdate(fn) {
    if (DEMO) return;
    const S = load();
    const key = iso(today());
    const list = allTasks(S).filter(function (t) { return t.date === key && !t.done; });
    if (fn(list)) save(S);
  }
  function markDone(t) { t.done = true; t.doneAt = Date.now(); t.auto = true; delete t.released; }

  window.addEventListener('sp:progress', function (e) {
    const meta = (e && e.detail && e.detail.meta) || {};
    if (!meta.skill) return;
    autoUpdate(function (list) {
      const t = list.filter(function (x) { return x.type === 'practice' && x.skill === meta.skill && x.section === meta.section; })[0];
      if (!t) return false;
      t.count = (t.count || 0) + 1;
      if (t.count >= t.target) markDone(t);
      return true;
    });
  });
  window.addEventListener('sp:blitz-complete', function (e) {
    if (!(e && e.detail && e.detail.answered > 0)) return;
    autoUpdate(function (list) {
      const t = list.filter(function (x) { return x.type === 'blitz'; })[0];
      if (!t) return false;
      markDone(t);
      return true;
    });
  });
  window.addEventListener('sp:pt-complete', function (e) {
    const d = (e && e.detail) || {};
    autoUpdate(function (list) {
      const t = list.filter(function (x) { return (x.type === 'mock' || x.type === 'diag') && +x.t === +d.t; })[0];
      if (!t) return false;
      const mods = d.modules || {};
      if (t.mods === 'full' && !(mods.r1 && mods.r2 && mods.m1 && mods.m2)) return false;
      if (t.mods === 'rw' && !(mods.r1 && mods.r2)) return false;
      if (t.mods === 'math' && !(mods.m1 && mods.m2)) return false;
      markDone(t);
      return true;
    });
  });

  /* -------------------------------------------------------------------
     9. СТИЛИ
     ------------------------------------------------------------------- */
  const CSS =
    '@keyframes plIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}' +
    '.pl-in{animation:plIn .3s cubic-bezier(.2,.7,.2,1) both;animation-delay:calc(var(--i,0) * 40ms)}' +
    '.pl-bar{transition:width .5s cubic-bezier(.2,.7,.2,1)}' +
    '.pl-task{transition:background-color .15s ease,border-color .15s ease,opacity .2s ease}' +
    '.pl-box{transition:background-color .15s ease,border-color .15s ease,transform .1s ease}' +
    '.pl-box:active{transform:scale(.9)}' +
    '@keyframes plTick{0%{transform:scale(.4)}60%{transform:scale(1.2)}100%{transform:scale(1)}}' +
    '.pl-tick{animation:plTick .28s ease both}' +
    '@media (prefers-reduced-motion:reduce){.pl-in,.pl-tick{animation:none!important}.pl-bar{transition:none!important}}';

  function injectStyle() {
    if (document.getElementById('plStyle')) return;
    const s = document.createElement('style');
    s.id = 'plStyle';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  const EYEBROW = 'text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-mute';
  const BTN_LINE = 'inline-flex h-11 items-center justify-center gap-2 rounded-lg border px-4 text-[13px] font-medium transition-colors hover:bg-raised sm:h-9';
  const BTN_BLUE = 'inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-accent px-4 text-[13px] font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40 sm:h-9';

  /* -------------------------------------------------------------------
     10. ЭКРАН
     ------------------------------------------------------------------- */
  function view(root, ctx) {
    injectStyle();

    let alive = true;
    let S = load();
    let A = null;
    let mode = 'plan';          // 'plan' | 'setup'
    let weekOffset = 0;         // 0 — эта неделя, 1 — следующая
    let draft = null;
    let renderedDay = iso(today());

    root.innerHTML =
      '<div class="mx-auto w-full max-w-[1180px] space-y-4 px-4 py-6 md:px-8 md:py-10" aria-busy="true">' +
        '<div class="h-9 w-52 animate-pulse rounded-lg bg-raised"></div>' +
        '<div class="card h-[130px] animate-pulse"></div><div class="card h-[380px] animate-pulse"></div></div>';

    function persist() { save(S); }

    function refreshAnchor() {
      if (S.anchor && /^\d{4}-\d{2}-\d{2}$/.test(S.anchor)) anchorCache = parseISO(S.anchor);
      else anchorCache = today();
    }

    /* ================= SETUP ================= */
    function openSetup() {
      const E = examInfo();
      draft = {
        exam: E.isSet ? iso(E.date) : '',
        suggestion: E.suggestion ? iso(E.suggestion) : '',
        slots: S.slots
          ? S.slots.map(function (s) { return { min: s.min, time: s.time || 'eve' }; })
          : PRESETS[1][2].map(function (m, i) { return { min: m, time: i >= 5 ? 'am' : 'eve' }; })
      };
      mode = 'setup';
      paint(true);
      window.scrollTo(0, 0);
    }

    const examValid = function (v) { return /^\d{4}-\d{2}-\d{2}$/.test(v) && parseISO(v) > today(); };
    const draftTotal = function () { return draft.slots.reduce(function (a, s) { return a + s.min; }, 0); };

    function setupHTML() {
      const total = draftTotal();
      const ok = examValid(draft.exam) && total > 0;
      let hint = '';
      if (!examValid(draft.exam)) hint = draft.exam ? 'Choose a date after today.' : 'Choose your SAT date to continue.';
      else if (!total) hint = 'Add at least one study window.';
      else hint = plural(draft.slots.filter(function (s) { return s.min > 0; }).length, 'study day') + ' · ' + hoursText(total) + ' per week';

      const cols = draft.slots.map(function (s, i) {
        const rest = s.min === 0;
        return '<div class="rounded-xl border p-3 ' + (rest ? 'bg-canvas/40' : 'border-accent/30 bg-accent/10') + '">' +
          '<div class="flex items-center justify-between gap-2 lg:flex-col lg:gap-1">' +
            '<span class="text-[13.5px] font-semibold">' + DAY_NAMES[i] + '</span>' +
            '<span class="num text-[11.5px] ' + (rest ? 'text-ink-mute' : 'text-accent') + '">' + (rest ? 'Rest day' : hoursText(s.min)) + '</span>' +
          '</div>' +
          '<div class="mt-3 grid grid-cols-6 gap-1.5 lg:grid-cols-1" role="group" aria-label="' + DAY_NAMES[i] + ' study time">' +
            DURATIONS.map(function (m) {
              const on = s.min === m;
              return '<button type="button" data-a="dur" data-i="' + i + '" data-v="' + m + '" aria-pressed="' + on + '" aria-label="' + (m ? m + ' minutes' : 'Rest day') + '" ' +
                'class="num grid h-11 place-items-center rounded-lg border text-[12.5px] font-medium transition-colors lg:h-9 ' +
                (on ? 'border-accent bg-accent text-white' : 'bg-surface text-ink-soft hover:bg-raised hover:text-ink') + '">' +
                (m === 0 ? icon('moon', 'h-3.5 w-3.5') : m) + '</button>';
            }).join('') +
          '</div>' +
          '<label class="mt-2 block"><span class="sr-only">' + DAY_NAMES[i] + ' time of day</span>' +
            '<select data-time="' + i + '" ' + (rest ? 'disabled ' : '') + 'class="h-11 w-full rounded-lg border bg-surface px-2 text-[12px] text-ink outline-none focus:border-accent disabled:opacity-40 lg:h-9">' +
              TIMES.map(function (t) { return '<option value="' + t[0] + '"' + (s.time === t[0] ? ' selected' : '') + '>' + t[1] + '</option>'; }).join('') +
            '</select></label>' +
        '</div>';
      }).join('');

      return '<div class="mx-auto w-full max-w-[1180px] space-y-4 px-4 py-6 md:px-8 md:py-10">' +
        '<div class="pl-in"><h1 class="text-[26px] font-semibold tracking-tight md:text-[30px]">' + (S.slots ? 'Edit schedule' : 'Set up your Study Planner') + '</h1>' +
        '<p class="mt-1.5 text-[14px] text-ink-soft">Tell us when you can study. The plan fits your windows and your weakest skills.</p></div>' +

        '<section class="card pl-in p-5" style="--i:1">' +
          '<div class="' + EYEBROW + '">1 · Test date</div>' +
          '<div class="mt-3 flex flex-wrap items-center gap-3">' +
            '<label class="sr-only" for="plExam">SAT date</label>' +
            '<input id="plExam" type="date" min="' + iso(addDays(today(), 1)) + '" value="' + esc(draft.exam) + '" class="num h-11 rounded-lg border bg-canvas/40 px-3 text-[14px] text-ink outline-none focus:border-accent">' +
            (!draft.exam && draft.suggestion
              ? '<button type="button" data-a="suggest" class="' + BTN_LINE + ' text-ink-soft">Use sample date: ' + dLong(parseISO(draft.suggestion)) + '</button>'
              : '') +
          '</div>' +
          '<p class="mt-2 text-[12px] text-ink-mute">Shared with your Dashboard. Confirm official dates on the College Board website.</p>' +
        '</section>' +

        '<section class="card pl-in p-5" style="--i:2">' +
          '<div class="flex flex-wrap items-center justify-between gap-3">' +
            '<div><div class="' + EYEBROW + '">2 · Weekly study windows</div><p class="mt-1 text-[12.5px] text-ink-soft">Pick the minutes for each day. A full mock test needs a 180 min window.</p></div>' +
            '<div class="flex gap-1.5" role="group" aria-label="Presets">' + PRESETS.map(function (p) {
              return '<button type="button" data-a="preset" data-v="' + p[0] + '" class="' + BTN_LINE + ' rounded-full">' + p[1] + '</button>';
            }).join('') + '</div>' +
          '</div>' +
          '<div class="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-7">' + cols + '</div>' +
        '</section>' +

        '<div class="card pl-in flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between" style="--i:3">' +
          '<span class="text-[13px] ' + (ok ? 'text-ink' : 'text-hl') + '" role="status">' + hint + '</span>' +
          '<div class="flex gap-2">' +
            (S.slots && examInfo().isSet ? '<button type="button" data-a="cancel" class="' + BTN_LINE + ' flex-1">Cancel</button>' : '') +
            '<button type="button" data-a="savesetup" ' + (ok ? '' : 'disabled ') + 'class="' + BTN_BLUE + ' flex-1">' + (S.slots ? 'Save & rebuild' : 'Build my plan') + icon('arrow') + '</button>' +
          '</div></div>' +
      '</div>';
    }

    /* ================= PLAN ================= */
    function kpiHTML(exam) {
      const left = diffDays(today(), exam);
      const mon = mondayOf(today());
      const week = (S.weeks[iso(mon)] ? S.weeks[iso(mon)].tasks : []).filter(function (t) { return !t.released; });
      const done = week.filter(function (t) { return t.done; });
      const pct = week.length ? Math.round(done.length / week.length * 100) : 0;
      const todays = week.filter(function (t) { return t.date === iso(today()); });
      const todayOpen = todays.filter(function (t) { return !t.done; });
      const box = function (i, label, ic, value, foot) {
        return '<section class="card pl-in p-4 sm:p-5" style="--i:' + i + '"><div class="kpi-label">' + icon(ic) + label + '</div>' +
          '<div class="mt-3 flex items-baseline gap-1.5">' + value + '</div><div class="mt-2.5 text-[12.5px] text-ink-soft">' + foot + '</div></section>';
      };
      const big = function (v) { return '<span class="num text-[30px] font-semibold leading-none tracking-tight">' + v + '</span>'; };

      return '<div class="grid grid-cols-1 gap-3 sm:grid-cols-3">' +
        box(1, 'Days to your SAT', 'calendar', big(left) + '<span class="text-[13px] text-ink-soft">' + (left === 1 ? 'day' : 'days') + '</span>', dLong(exam)) +
        box(2, 'This week', 'check', big(done.length) + '<span class="num text-[13px] text-ink-soft">/ ' + week.length + ' tasks</span>',
          '<div class="h-1.5 overflow-hidden rounded-full bg-raised" role="progressbar" aria-label="Weekly progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '"><div class="pl-bar h-full rounded-full bg-success" style="width:' + pct + '%"></div></div>' +
          '<div class="mt-1.5"><span class="num">' + hoursText(sumMin(done)) + '</span> of <span class="num">' + hoursText(sumMin(week)) + '</span> done</div>') +
        box(3, 'Left today', 'flag', big(todayOpen.length ? hoursText(sumMin(todayOpen)) : (todays.length ? 'Done' : 'Rest')),
          todayOpen.length ? 'Next: ' + esc(todayOpen[0].title) : (todays.length ? 'Today’s plan is complete.' : 'No tasks scheduled today.')) +
      '</div>';
    }

    function timelineHTML(exam) {
      const start = anchorDate();
      const P = phaseSpans(start, exam);
      const cur = phaseAt(today(), exam);
      const elapsed = Math.max(0, Math.min(100, diffDays(start, today()) / P.total * 100));
      const segs = PHASE_ORDER.filter(function (k) { return P[k] > 0; });

      let cursor = 0;
      const labels = segs.map(function (k) {
        const from = addDays(start, cursor);
        cursor += P[k];
        const to = addDays(start, cursor - 1);
        const on = k === cur;
        return '<div class="min-w-0 rounded-xl border p-3 ' + (on ? 'border-accent/50 bg-accent/10' : 'bg-canvas/40') + '">' +
          '<div class="flex items-center gap-2"><span class="h-2 w-2 shrink-0 rounded-full ' + PHASES[k].bar + '"></span><span class="truncate text-[13px] font-semibold">' + PHASES[k].name + '</span></div>' +
          '<div class="num mt-1.5 text-[11.5px] text-ink-soft">' + dShort(from) + ' – ' + dShort(to) + '</div></div>';
      }).join('');

      const track = segs.map(function (k) {
        return '<span class="h-full ' + PHASES[k].bar + ' ' + (k === cur ? '' : 'opacity-30') + '" style="width:' + (P[k] / P.total * 100) + '%"></span>';
      }).join('');

      const weeksLeft = Math.ceil(diffDays(today(), exam) / 7);
      return '<section class="card pl-in p-5" style="--i:4">' +
        '<div class="flex flex-wrap items-baseline justify-between gap-2"><h2 class="text-[15px] font-semibold">Preparation phases</h2>' +
        '<span class="text-[12.5px] text-ink-soft"><span class="num">' + weeksLeft + '</span> ' + (weeksLeft === 1 ? 'week' : 'weeks') + ' left</span></div>' +
        '<div class="relative mt-4">' +
          '<div class="flex h-2 gap-0.5 overflow-hidden rounded-full bg-raised">' + track + '</div>' +
          '<span class="absolute -top-1 h-4 w-1 -translate-x-1/2 rounded-full bg-ink" style="left:' + elapsed + '%" title="Today"></span>' +
        '</div>' +
        '<div class="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-' + segs.length + '">' + labels + '</div>' +
        '<p class="mt-3 text-[12.5px] leading-relaxed text-ink-soft"><b class="font-semibold text-ink">Now: ' + PHASES[cur].name + '.</b> ' + PHASES[cur].text + '</p>' +
      '</section>';
    }

    function bannerHTML() {
      const missed = missedTasks(S);
      if (missed.length) {
        return '<div class="pl-in flex flex-col gap-3 rounded-2xl border border-hl/40 bg-hl/10 p-4 sm:flex-row sm:items-center sm:justify-between">' +
          '<div class="min-w-0"><p class="text-[13.5px] font-semibold">' + plural(missed.length, 'unfinished task') + ' from earlier days</p>' +
          '<p class="mt-0.5 text-[12.5px] text-ink-soft">Rebalance moves them into upcoming windows, adding at most ' + STRETCH + ' extra minutes to a day.</p></div>' +
          '<button type="button" data-a="rebalance" class="' + BTN_BLUE + ' shrink-0">' + icon('shuffle') + 'Rebalance</button></div>';
      }
      if (S.undo && S.undo.day === iso(today())) {
        return '<div class="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-surface px-4 py-3">' +
          '<span class="text-[13px] text-ink-soft">' + esc(S.undo.note || 'Plan rebalanced.') + '</span>' +
          '<button type="button" data-a="undo" class="' + BTN_LINE + '">' + icon('rotate') + 'Undo</button></div>';
      }
      return '';
    }

    function taskHTML(t) {
      const type = TYPES[t.type] || TYPES.practice;
      const isPast = t.date < iso(today());
      const isFuture = t.date > iso(today());
      let tag = '';
      if (t.released) tag = '<span class="rounded-full bg-raised px-2 py-0.5 text-[11px] font-medium text-ink-soft">Released</span>';
      else if (!t.done && isPast) tag = '<span class="rounded-full bg-hl/15 px-2 py-0.5 text-[11px] font-semibold text-hl">Missed</span>';
      else if (t.movedFrom && !t.done) tag = '<span class="rounded-full bg-raised px-2 py-0.5 text-[11px] font-medium text-ink-soft">Moved from ' + dShort(parseISO(t.movedFrom)) + '</span>';
      const counter = t.type === 'practice' && t.count > 0 && !t.done
        ? ' · <span class="num text-accent">' + Math.min(t.count, t.target) + '/' + t.target + '</span>' : '';

      return '<li class="pl-task flex items-start gap-2 rounded-xl border bg-canvas/40 p-2.5 sm:items-center sm:gap-3 ' + (t.done || t.released ? 'opacity-60' : 'hover:border-accent/40') + '">' +
        '<button type="button" role="checkbox" data-a="toggle" data-id="' + t.id + '" aria-checked="' + !!t.done + '" aria-label="Mark done: ' + esc(t.title) + '" ' + (isFuture && !t.done ? 'disabled title="Available on the scheduled day" ' : '') +
          'class="grid h-11 w-11 shrink-0 place-items-center rounded-lg disabled:cursor-not-allowed disabled:opacity-40">' +
          '<span class="pl-box grid h-5 w-5 place-items-center rounded-md border-2 ' + (t.done ? 'border-success bg-success text-white' : '') + '">' + (t.done ? icon('check', 'pl-tick h-3 w-3') : '') + '</span></button>' +
        '<span class="hidden h-9 w-9 shrink-0 place-items-center rounded-lg sm:grid ' + type.tone + '">' + icon(type.icon) + '</span>' +
        '<div class="min-w-0 flex-1">' +
          '<div class="flex flex-wrap items-center gap-x-2 gap-y-1"><span class="text-[13.5px] font-semibold ' + (t.done ? 'line-through' : '') + '">' + esc(t.title) + '</span>' + tag + '</div>' +
          '<div class="mt-0.5 text-[12px] text-ink-soft">' + type.label + ' · <span class="num">' + t.min + ' min</span> · ' + esc(t.sub) + counter + '</div>' +
          (t.why && !t.done ? '<div class="mt-0.5 text-[11.5px] text-ink-mute">' + esc(t.why) + '</div>' : '') +
        '</div>' +
        (t.done ? '' : '<button type="button" data-a="go" data-id="' + t.id + '" class="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-lg border bg-surface px-3 text-[12.5px] font-semibold transition-colors hover:border-accent hover:bg-accent hover:text-white sm:h-9" aria-label="Start: ' + esc(t.title) + '">Start' + icon('arrow', 'h-3.5 w-3.5') + '</button>') +
      '</li>';
    }

    function weekHTML(exam) {
      const monday = addDays(mondayOf(today()), weekOffset * 7);
      const week = S.weeks[iso(monday)] ? S.weeks[iso(monday)].tasks : [];
      const nowKey = iso(today());
      let rows = '';

      for (let i = 0; i < 7; i++) {
        const d = addDays(monday, i), key = iso(d);
        const list = week.filter(function (t) { return t.date === key; });
        const isToday = key === nowKey;
        const isExam = key === iso(exam);
        if (d > exam) continue;
        if (!list.length && d < today()) continue;
        const slot = S.slots[i];
        const timeName = (TIMES.filter(function (t) { return t[0] === slot.time; })[0] || TIMES[2])[1];
        const meta = isExam ? 'Test day'
          : list.length ? hoursText(sumMin(list.filter(function (t) { return !t.released; }))) + (slot.min ? ' · ' + timeName : '')
          : 'Rest day';
        rows += '<div class="pl-in border-t px-3 py-3.5 sm:px-5 ' + (isToday ? 'bg-accent/10' : '') + '" style="--i:' + i + '">' +
          '<div class="flex items-center justify-between gap-3">' +
            '<h3 class="flex items-center gap-2 text-[13.5px] font-semibold">' + DAY_NAMES[i] + ' <span class="num font-medium text-ink-soft">' + dShort(d) + '</span>' +
              (isToday ? '<span class="rounded-full bg-accent px-2 py-0.5 text-[10.5px] font-semibold text-white">Today</span>' : '') + '</h3>' +
            '<span class="text-[12px] ' + (isExam ? 'font-semibold text-success' : 'text-ink-mute') + '">' + meta + '</span>' +
          '</div>' +
          (isExam ? '<p class="mt-2 text-[12.5px] text-ink-soft">No study tasks. Rest well and good luck.</p>' : '') +
          (list.length ? '<ul class="mt-2.5 space-y-2">' + list.map(taskHTML).join('') + '</ul>' : '') +
        '</div>';
      }

      const tabs = [[0, 'This week'], [1, 'Next week']].map(function (x) {
        const on = weekOffset === x[0];
        const gone = x[0] === 1 && addDays(mondayOf(today()), 7) > exam;
        return '<button type="button" data-a="week" data-v="' + x[0] + '" aria-pressed="' + on + '" ' + (gone ? 'disabled ' : '') +
          'class="h-11 rounded-md px-3.5 text-[12.5px] font-medium transition-colors disabled:opacity-40 sm:h-8 ' + (on ? 'bg-surface text-ink shadow-sm' : 'text-ink-soft hover:text-ink') + '">' + x[1] + '</button>';
      }).join('');

      return '<section class="card overflow-hidden">' +
        '<div class="flex flex-wrap items-center justify-between gap-3 px-3 py-4 sm:px-5">' +
          '<div><h2 class="text-[15px] font-semibold">Weekly plan</h2><p class="num mt-0.5 text-[12px] text-ink-soft">' + dShort(monday) + ' – ' + dShort(addDays(monday, 6)) + '</p></div>' +
          '<div class="flex rounded-lg bg-raised p-0.5" role="group" aria-label="Week">' + tabs + '</div>' +
        '</div>' +
        (rows || '<p class="border-t px-6 py-12 text-center text-[13px] text-ink-soft">No study windows are left in this week. Check next week or edit your schedule.</p>') +
      '</section>';
    }

    function focusHTML(exam) {
      let body;
      if (A.starter) {
        body = '<p class="mt-2 text-[12.5px] leading-relaxed text-ink-soft">There is not enough data yet, so this is a balanced starter plan. Take the diagnostic test to reveal your weak spots.</p>';
      } else if (!A.weak.length) {
        body = '<p class="mt-2 text-[12.5px] leading-relaxed text-ink-soft">No skill with at least ' + MIN_SAMPLE + ' answers is below ' + STRONG_FROM + '%. The plan now covers skills with little data.</p>';
      } else {
        body = '<ul class="mt-3 space-y-3.5">' + A.weak.slice(0, 5).map(function (s, i) {
          return '<li><div class="flex items-center gap-3"><div class="min-w-0 flex-1"><div class="truncate text-[13px] font-medium">' + esc(s.skill) + '</div>' +
            '<div class="text-[11.5px] text-ink-mute">' + esc(SEC_NAME[s.section]) + ' · <span class="num">' + s.ok + '/' + s.n + '</span></div></div>' +
            '<span class="num text-[13px] font-semibold ' + (s.pct < 50 ? 'text-danger' : 'text-hl') + '">' + s.pct + '%</span>' +
            '<button type="button" data-a="drill" data-i="' + i + '" class="grid h-11 w-11 shrink-0 place-items-center rounded-lg border text-ink-soft hover:bg-raised hover:text-ink sm:h-9 sm:w-9" aria-label="Practice ' + esc(s.skill) + '">' + icon('arrow') + '</button></div>' +
            '<div class="mt-1.5 h-1 overflow-hidden rounded-full bg-raised"><div class="pl-bar h-full rounded-full ' + (s.pct < 50 ? 'bg-danger' : 'bg-hl') + '" style="width:' + s.pct + '%"></div></div></li>';
        }).join('') + '</ul>';
      }

      const needsLong = phaseAt(today(), exam) === 'mocks' && !S.slots.some(function (s) { return s.min >= 90; });

      return '<aside class="space-y-4">' +
        '<section class="card pl-in p-5" style="--i:5"><h2 class="text-[15px] font-semibold">Focus skills</h2>' + body + '</section>' +
        (needsLong ? '<section class="rounded-2xl border border-hl/40 bg-hl/10 p-4"><p class="text-[13px] font-semibold">No room for mock tests</p><p class="mt-1 text-[12.5px] leading-relaxed text-ink-soft">Add a window of at least 90 minutes (180 for a full test) to rehearse test day.</p></section>' : '') +
        '<section class="card pl-in p-5" style="--i:6"><h2 class="text-[15px] font-semibold">How tasks check off</h2>' +
          '<p class="mt-2 text-[12.5px] leading-relaxed text-ink-soft">Practice, Blitz and mock tasks scheduled for today complete on their own when you finish the work. Check off the rest yourself.</p>' +
          '<button type="button" data-a="rebuild" class="' + BTN_LINE + ' mt-4 w-full">' + icon('refresh') + 'Refresh with latest results</button></section>' +
      '</aside>';
    }

    function expiredHTML() {
      return '<div class="pl-in mx-auto max-w-[460px] px-6 py-24 text-center">' +
        '<div class="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-raised text-accent">' + icon('calendar', 'h-6 w-6') + '</div>' +
        '<h1 class="mt-5 text-[22px] font-semibold tracking-tight">Choose your next test date</h1>' +
        '<p class="mt-2 text-[14px] text-ink-soft">Your saved SAT date is today or has passed. Pick a new one to build a plan.</p>' +
        '<button type="button" data-a="edit" class="' + BTN_BLUE + ' mt-6">Choose a date' + icon('arrow') + '</button></div>';
    }

    function planHTML(exam) {
      return '<div class="mx-auto w-full max-w-[1180px] space-y-4 px-4 py-6 md:px-8 md:py-10">' +
        '<div class="pl-in flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">' +
          '<div><h1 class="text-[26px] font-semibold tracking-tight md:text-[30px]">Study Planner</h1>' +
          '<p class="mt-1.5 text-[14px] text-ink-soft">' + (A.starter ? 'A balanced starter plan until your first results come in.' : 'Your week, built around your weakest skills and free time.') + '</p></div>' +
          '<button type="button" data-a="edit" class="' + BTN_LINE + ' self-start sm:self-auto">' + icon('sliders') + 'Edit schedule</button>' +
        '</div>' +
        kpiHTML(exam) +
        timelineHTML(exam) +
        bannerHTML() +
        '<div class="grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">' + weekHTML(exam) + focusHTML(exam) + '</div>' +
      '</div>';
    }

    // still = true: обновление без повторной анимации появления
    function paint(animate) {
      if (!alive) return;
      const y = window.scrollY;
      const E = examInfo();

      if (mode === 'setup') root.innerHTML = setupHTML();
      else if (!E.date || E.date <= today()) root.innerHTML = expiredHTML();
      else {
        refreshAnchor();
        let changed = ensureWeek(S, mondayOf(today()), A, E.date);
        if (weekOffset === 1) changed = ensureWeek(S, addDays(mondayOf(today()), 7), A, E.date) || changed;
        if (changed) persist();
        root.innerHTML = planHTML(E.date);
      }

      if (!animate) {
        root.querySelectorAll('.pl-in').forEach(function (el) { el.classList.remove('pl-in'); });
        window.scrollTo(0, y);
      }
    }

    function focusEl(selector) {
      const el = root.querySelector(selector);
      if (el) { try { el.focus({ preventScroll: true }); } catch (e) {} }
    }

    /* ================= ЗАПУСК ЗАДАЧ ================= */
    function startSkill(sk, count) {
      if (!Data.solverReady) { Shell.toast('The Solver is not connected yet'); return; }
      const opts = { section: sk.section, domain: sk.domain, skill: sk.skill, difficulty: 'all', shuffle: true };
      let session = Data.startSession(Object.assign({ status: 'unsolved' }, opts));
      if (!session.ids.length) session = Data.startSession(Object.assign({ status: 'all' }, opts));
      if (!session.ids.length) { Shell.toast('No questions found for this skill'); return; }
      if (count) session.ids = session.ids.slice(0, count);
      try {
        sessionStorage.setItem('satpath_session_v1', JSON.stringify(session));
        sessionStorage.setItem('satpath_solver_idx_v1', JSON.stringify({ sid: session.id, idx: 0 }));
      } catch (e) {}
      ctx.navigate('solver');
    }

    function ptHasResults(t) {
      const PT = window.SPPracticeTests;
      try {
        if (PT && PT.doneMods) return Object.keys(PT.doneMods(t)).length > 0;
      } catch (e) {}
      return !!jget(K_PT, {})[t];
    }
    function ptInProgress(t) {
      const PT = window.SPPracticeTests;
      try { return !!(PT && PT.Store && PT.Store.sess(t)); } catch (e) { return false; }
    }

    function startTask(t) {
      if (t.type === 'practice') startSkill(t, Math.max(1, t.target - (t.count || 0)));
      else if (t.type === 'blitz') ctx.navigate('blitz');
      else if (t.type === 'vocab') ctx.navigate('vocabulary');
      else if (t.type === 'review') ctx.navigate('errors');
      else if (t.type === 'mock' || t.type === 'diag') {
        ctx.navigate(ptInProgress(t.t) ? 'exam?t=' + t.t : 'practice-tests?start=' + t.t);
      } else if (t.type === 'mockreview') {
        if (ptHasResults(t.t)) ctx.navigate('pt-results?t=' + t.t);
        else Shell.toast('Finish the mock test first, then review it here');
      }
    }

    const findTask = function (id) { return allTasks(S).filter(function (t) { return t.id === id; })[0]; };

    /* ================= СОБЫТИЯ ================= */
    function onClick(e) {
      const b = e.target.closest('[data-a]');
      if (!b || b.disabled || !A) return;
      const a = b.getAttribute('data-a');
      const E = examInfo();

      if (a === 'edit') openSetup();
      else if (a === 'cancel') { mode = 'plan'; paint(true); window.scrollTo(0, 0); }
      else if (a === 'suggest') { draft.exam = draft.suggestion; paint(false); focusEl('#plExam'); }
      else if (a === 'dur') {
        const i = +b.getAttribute('data-i'), v = +b.getAttribute('data-v');
        draft.slots[i].min = v;
        paint(false);
        focusEl('[data-a="dur"][data-i="' + i + '"][data-v="' + v + '"]');
      }
      else if (a === 'preset') {
        const name = b.getAttribute('data-v');
        const p = PRESETS.filter(function (x) { return x[0] === name; })[0];
        p[2].forEach(function (m, i) { draft.slots[i].min = m; });
        paint(false);
        focusEl('[data-a="preset"][data-v="' + name + '"]');
      }
      else if (a === 'savesetup') {
        if (!examValid(draft.exam) || !draftTotal()) return;
        const examChanged = !E.isSet || iso(E.date) !== draft.exam;
        setExam(draft.exam);
        if (!S.anchor || examChanged) S.anchor = iso(today());
        S.slots = draft.slots.map(function (s) { return { min: s.min, time: s.time }; });
        delete S.undo;
        refreshAnchor();
        const exam = parseISO(draft.exam);
        // будущие недели пересоберутся по новому расписанию при открытии
        const mon = iso(mondayOf(today()));
        Object.keys(S.weeks).forEach(function (k) { if (k > mon) delete S.weeks[k]; });
        buildWeek(S, mondayOf(today()), A, exam);
        persist();
        mode = 'plan';
        weekOffset = 0;
        paint(true);
        window.scrollTo(0, 0);
        Shell.toast('Your plan is ready');
      }
      else if (a === 'week') {
        weekOffset = +b.getAttribute('data-v');
        paint(false);
        focusEl('[data-a="week"][data-v="' + weekOffset + '"]');
      }
      else if (a === 'toggle') {
        const t = findTask(b.getAttribute('data-id'));
        if (!t) return;
        t.done = !t.done;
        t.auto = false;
        if (t.done) { t.doneAt = Date.now(); delete t.released; }
        else { delete t.doneAt; t.count = 0; }
        delete S.undo;
        persist();
        paint(false);
        focusEl('[data-a="toggle"][data-id="' + t.id + '"]');
      }
      else if (a === 'go') {
        const t = findTask(b.getAttribute('data-id'));
        if (t) startTask(t);
      }
      else if (a === 'drill') {
        const sk = A.weak[+b.getAttribute('data-i')];
        if (sk) startSkill(sk, 0);
      }
      else if (a === 'rebalance') {
        if (!E.date) return;
        const r = rebalance(S, A, E.date);
        let note = plural(r.moved, 'task') + ' moved';
        if (r.replaced) note += ', ' + plural(r.replaced, 'light task') + ' replaced';
        if (r.released) note += ', ' + r.released + ' released without a free window';
        S.undo.note = note + '.';
        persist();
        paint(false);
        Shell.toast('Plan rebalanced');
      }
      else if (a === 'undo') {
        if (!S.undo) return;
        try { S.weeks = JSON.parse(S.undo.weeks); } catch (err) { return; }
        delete S.undo;
        persist();
        paint(false);
        Shell.toast('Rebalance undone');
      }
      else if (a === 'rebuild') {
        if (!E.date) return;
        A = analyze();
        delete S.undo;
        const mon = mondayOf(today());
        delete S.weeks[iso(addDays(mon, 7))];
        buildWeek(S, mon, A, E.date);
        persist();
        paint(false);
        Shell.toast('Upcoming tasks updated');
      }
    }

    function onChange(e) {
      const el = e.target;
      if (!el || !draft || mode !== 'setup') return;
      if (el.id === 'plExam') {
        draft.exam = el.value;
        paint(false);
        focusEl('#plExam');
      } else if (el.hasAttribute('data-time')) {
        draft.slots[+el.getAttribute('data-time')].time = el.value;
      }
    }

    // Вкладка могла провисеть ночь или план изменился в другой вкладке
    function onVisibility() {
      if (document.hidden || !A || mode !== 'plan') return;
      if (renderedDay !== iso(today())) {
        renderedDay = iso(today());
        weekOffset = 0;
        paint(false);
      }
    }
    function onStorage(e) {
      if ((e.key === K_PLAN || e.key === K_EXAM) && A && mode === 'plan') {
        S = load();
        paint(false);
      }
    }

    root.addEventListener('click', onClick);
    root.addEventListener('change', onChange);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('storage', onStorage);

    const onReady = function () {
      if (!alive) return;
      try {
        A = analyze();
        S = load();
        const E = examInfo();
        if (!S.slots || !E.isSet) openSetup();
        else paint(true);
      } catch (err) {
        console.error('[study-planner]', err);
        root.innerHTML = '<div class="mx-auto max-w-[460px] px-6 py-24 text-center"><h1 class="text-[20px] font-semibold">The planner could not be loaded</h1>' +
          '<p class="mt-2 text-[13.5px] text-ink-soft">Refresh the page to try again. Your saved progress has not been changed.</p></div>';
      }
    };
    Promise.resolve(Data.load()).then(onReady, onReady);

    return function () {
      alive = false;
      root.removeEventListener('click', onClick);
      root.removeEventListener('change', onChange);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('storage', onStorage);
    };
  }

  Shell.register('study-planner', { title: 'Study Planner', group: 'Prep', render: view });
})();
