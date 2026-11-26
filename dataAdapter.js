/* =====================================================================
   SATPath — Data Adapter (dataAdapter.js)
   ---------------------------------------------------------------------
   Единый слой данных. Склеивает три источника в один каталог вопросов:

     1. Math-генераторы      GENERATORS[ti] + TOPS[ti]      (math-questions.js)
     2. База R&W             RQ[ti] + RTOPS[ti] (+ RGEN)    (rw-questions.js)
     3. Базовые (статические) задачи — SP_BASE_QUESTIONS, RW_QUESTIONS
        или SPData.addQuestions([...])

   Единый формат вопроса (то, что отдаёт SPData.getQuestion(id)):
     { id, section: 'math'|'rw', domain, skill, topic, difficulty: 'easy'|'medium'|'hard',
       type: 'mcq'|'spr', passage, prompt,
       choices: [{ key:'A', text }],        // для spr — []
       correctAnswer,                       // mcq: ключ 'A'..'D';  spr: строка '14.5'
       acceptedAnswers,                     // mcq: ['B'];  spr: ['14.5','29/2']
       explanation, legacy: {q, ans, opts, isGrid, rw, top}, raw }

   Math-вопросы создаются «на лету» и детерминированно: id = m:<тема>:<генератор>:<версия>,
   поэтому статусы Solved / Missed привязаны к стабильному id.

   Подключение (после shell.js):
     <script src="dataAdapter.js"></script>
   Если глобалы TOPS / GENERATORS / RQ / RTOPS не найдены, адаптер сам подгрузит
   theory.js, math-questions.js, rw-questions.js (как в index_final.html).

   Настройки (необязательно) — до подключения этого файла:
     window.SP_DATA_CONFIG = { mathVariants: 8, topicMap: { 'My topic': { domain:'Algebra', skill:'Linear Functions' } } };
   Отладка: в консоли выполни SPData.debug() — таблица «ваша тема → домен / подтема».
   ===================================================================== */
(function () {
  'use strict';

  /* -------------------------------------------------------------------
     0. НАСТРОЙКИ
     ------------------------------------------------------------------- */
  const CFG = {
    mathVariants: 6,             // сколько версий каждого Math-генератора попадает в банк
    rwGenVariants: 3,            // то же для R&W-генераторов RGEN (если они есть)
    gridInEveryNth: 4,           // каждый N-й Math-вопрос с числовым ответом показывается как Grid-in (0 = выключить)
    solvedIncludesMissed: true,  // как на 1609sat: Unsolved + Solved = All, а Missed — часть Solved
    dataScripts: ['theory.js', 'math-questions.js', 'rw-questions.js'],
    topicMap: {}                 // ручные соответствия: { 'Название вашей темы': { domain, skill } }
  };
  const userCfg = window.SP_DATA_CONFIG;
  if (userCfg && typeof userCfg === 'object') {
    Object.keys(userCfg).forEach(function (k) { CFG[k] = userCfg[k]; });
  }

  const KEYS = {
    prog: 'satpath_qprog_v1',                 // { id: { r:'ok'|'miss', n, t } }
    session: 'satpath_session_v1',
    legacyMistakes: 'satpath_mistakes_v1',     // ошибки из старого сайта
    legacyRwSolved: 'satpath_rw_solved_island_' // + индекс темы: ['rq_12', ...] из старого сайта
  };
  const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];
  const FALLBACK_DOMAIN = 'More Topics';

  /* -------------------------------------------------------------------
     1. ХРАНИЛИЩЕ (localStorage с fallback в память)
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
  function jget(k, fallback) {
    try { const r = lsGet(k); return r ? JSON.parse(r) : fallback; } catch (e) { return fallback; }
  }

  /* -------------------------------------------------------------------
     2. ДЕТЕРМИНИРОВАННЫЙ ГЕНЕРАТОР СЛУЧАЙНЫХ ЧИСЕЛ
     ------------------------------------------------------------------- */
  function hash(s) {
    let h = 2166136261;
    s = String(s);
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function rng(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  // Подменяем Math.random на время вызова генератора — так же делает Practice Test в старом app.js
  function withSeed(seed, fn) {
    const orig = Math.random;
    Math.random = rng(seed);
    try { return fn(); } finally { Math.random = orig; }
  }
  function shuffleSeeded(arr, seed) {
    const r = rng(seed), a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(r() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function shuffleRandom(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* -------------------------------------------------------------------
     3. ТАКСОНОМИЯ SAT И СОПОСТАВЛЕНИЕ ВАШИХ ТЕМ
     ------------------------------------------------------------------- */
  const TAXONOMY = {
    rw: [
      { domain: 'Craft and Structure', skills: ['Cross-Text Connections', 'Text Structure and Purpose', 'Words in Context'] },
      { domain: 'Expression of Ideas', skills: ['Transitions', 'Rhetorical Synthesis'] },
      { domain: 'Information and Ideas', skills: ['Central Ideas and Details', 'Command of Evidence', 'Inferences'] },
      { domain: 'Standard English Conventions', skills: ['Boundaries', 'Form, Structure, and Sense'] }
    ],
    math: [
      { domain: 'Algebra', skills: [
        'Linear Functions', 'Linear Equations in One Variable', 'Linear Equations in Two Variables',
        'Linear Inequalities in One or Two Variables', 'Systems of Two Linear Equations in Two Variables'] },
      { domain: 'Advanced Math', skills: ['Equivalent Expressions', 'Nonlinear Equations and Systems', 'Nonlinear Functions'] },
      { domain: 'Problem-Solving and Data Analysis', skills: [
        'Ratios, Rates, Proportional Relationships, and Units', 'Percentages',
        'One-Variable Data: Distributions and Measures of Center and Spread',
        'Two-Variable Data: Models and Scatterplots', 'Probability and Conditional Probability',
        'Inference from Sample Statistics and Margin of Error',
        'Evaluating Statistical Claims: Observational Studies and Experiments'] },
      { domain: 'Geometry and Trigonometry', skills: [
        'Area and Volume', 'Circles', 'Lines, Angles, and Triangles', 'Right Triangles and Trigonometry'] }
    ]
  };

  // Порядок правил важен: более специфичные — раньше
  const RULES = {
    rw: [
      [/\bboundar|punctuat/, 'Boundaries'],
      [/\bform\b|\bsense\b|grammar|agreement|\bverbs?\b|pronoun|modifier/, 'Form, Structure, and Sense'],
      [/transition/, 'Transitions'],
      [/rhetor|synthesis/, 'Rhetorical Synthesis'],
      [/cross|connection|paired/, 'Cross-Text Connections'],
      [/words? in context|vocab/, 'Words in Context'],
      [/text structure|structure and purpose|purpose/, 'Text Structure and Purpose'],
      [/central|main idea|\bdetails?\b/, 'Central Ideas and Details'],
      [/evidence/, 'Command of Evidence'],
      [/inferen/, 'Inferences']
    ],
    math: [
      [/(nonlinear|quadratic).*(equation|system)|equations? and systems|one variable and systems/, 'Nonlinear Equations and Systems'],
      [/nonlinear|exponential|quadratic|polynomial function/, 'Nonlinear Functions'],
      [/scatter|two variable data|models? and scatter/, 'Two-Variable Data: Models and Scatterplots'],
      [/one variable data|distribution|center|spread|standard deviation|\bmean\b|\bmedian\b/, 'One-Variable Data: Distributions and Measures of Center and Spread'],
      [/probabilit/, 'Probability and Conditional Probability'],
      [/percent/, 'Percentages'],
      [/\bratios?\b|\brates?\b|proportion|\bunits?\b/, 'Ratios, Rates, Proportional Relationships, and Units'],
      [/margin|inference|sample|survey/, 'Inference from Sample Statistics and Margin of Error'],
      [/claim|observational|experiment|causal/, 'Evaluating Statistical Claims: Observational Studies and Experiments'],
      [/circle|\barcs?\b|sector|radian/, 'Circles'],
      [/right triangle|trig|\bsine\b|cosine|tangent|pythag/, 'Right Triangles and Trigonometry'],
      [/\barea\b|volume|perimeter|surface/, 'Area and Volume'],
      [/angle|triangle|\blines?\b|parallel|similar|congruen/, 'Lines, Angles, and Triangles'],
      [/equivalent|expression|factor/, 'Equivalent Expressions'],
      [/system/, 'Systems of Two Linear Equations in Two Variables'],
      [/inequalit/, 'Linear Inequalities in One or Two Variables'],
      [/linear equations? in two|two variables?/, 'Linear Equations in Two Variables'],
      [/linear equations? in one|one variable|linear equations?$|literal/, 'Linear Equations in One Variable'],
      [/linear function|slope|intercept|linear model|function/, 'Linear Functions']
    ]
  };

  function norm(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim(); }

  function domainOf(section, skill) {
    const dom = TAXONOMY[section] || [];
    for (let i = 0; i < dom.length; i++) if (dom[i].skills.indexOf(skill) >= 0) return dom[i].domain;
    return null;
  }

  function classify(section, rawName) {
    const name = String(rawName == null ? '' : rawName).trim();
    const manual = CFG.topicMap && CFG.topicMap[name];
    if (manual) {
      const sk = typeof manual === 'string' ? manual : manual.skill;
      const dm = (typeof manual === 'object' && manual.domain) || domainOf(section, sk) || FALLBACK_DOMAIN;
      return { domain: dm, skill: sk || name, mapped: true };
    }
    const n = norm(name), rules = RULES[section] || [];
    for (let i = 0; i < rules.length; i++) {
      if (rules[i][0].test(n)) return { domain: domainOf(section, rules[i][1]), skill: rules[i][1], mapped: true };
    }
    return { domain: FALLBACK_DOMAIN, skill: name || 'Uncategorized', mapped: false };
  }

  const CLS = {};
  function cls(section, raw) {
    const k = section + '|' + raw;
    return CLS[k] || (CLS[k] = classify(section, raw));
  }

  function diffBy(i, n) {
    if (n <= 1) return 'medium';
    const r = i / n;
    return r < 1 / 3 ? 'easy' : r < 2 / 3 ? 'medium' : 'hard';
  }
  function normDifficulty(x) {
    if (x == null) return null;
    const s = String(x).toLowerCase();
    if (/easy|^1$/.test(s)) return 'easy';
    if (/med|^2$/.test(s)) return 'medium';
    if (/hard|^3$/.test(s)) return 'hard';
    return null;
  }

  /* -------------------------------------------------------------------
     4. ГЛОБАЛЫ ИЗ ВАШИХ ФАЙЛОВ (читаем безопасно: const/let-глобалы не лежат в window)
     ------------------------------------------------------------------- */
  function globals() {
    return {
      TOPS:       typeof TOPS !== 'undefined' ? TOPS : null,
      GENERATORS: typeof GENERATORS !== 'undefined' ? GENERATORS : null,
      RTOPS:      typeof RTOPS !== 'undefined' ? RTOPS : null,
      RQ:         typeof RQ !== 'undefined' ? RQ : null,
      RGEN:       typeof RGEN !== 'undefined' ? RGEN : null
    };
  }

  function tierOf(k) {
    k = String(k).toLowerCase();
    return /easy/.test(k) ? 'easy' : /hard|boss/.test(k) ? 'hard' : /med/.test(k) ? 'medium' : null;
  }
  // GENERATORS[ti] — обычно массив функций; на всякий случай поддержан объект { easy:[...], hard:[...] }
  function flattenGens(list) {
    const out = [];
    if (Array.isArray(list)) {
      list.forEach(function (fn) { if (typeof fn === 'function') out.push({ fn: fn, tier: null }); });
    } else if (list && typeof list === 'object') {
      Object.keys(list).forEach(function (k) {
        const v = list[k];
        if (Array.isArray(v)) v.forEach(function (fn) { if (typeof fn === 'function') out.push({ fn: fn, tier: tierOf(k) }); });
        else if (typeof v === 'function') out.push({ fn: v, tier: tierOf(k) });
      });
    }
    return out;
  }

  /* -------------------------------------------------------------------
     5. ПОСТРОЕНИЕ ВОПРОСОВ В ЕДИНОМ ФОРМАТЕ
     ------------------------------------------------------------------- */
  const NUMERIC = /^[-+]?\d+(\.\d+|\/\d+)?$/;

  function base(id, section, c, topic, difficulty) {
    return {
      id: id, section: section, domain: c.domain, skill: c.skill, topic: topic || c.skill,
      difficulty: difficulty, type: 'mcq', passage: '', prompt: '',
      choices: [], correctAnswer: '', acceptedAnswers: [], explanation: ''
    };
  }

  // Убирает дубли вариантов, гарантирует наличие верного ответа, стабильно перемешивает
  function makeMCQ(texts, correctText, seedKey, doShuffle) {
    const seen = {}, arr = [];
    texts.forEach(function (t) { const s = String(t); if (!seen[s]) { seen[s] = 1; arr.push(s); } });
    const c = String(correctText);
    if (!seen[c]) arr.unshift(c);
    const ordered = doShuffle ? shuffleSeeded(arr, hash(seedKey)) : arr;
    const choices = ordered.slice(0, LETTERS.length).map(function (t, i) { return { key: LETTERS[i], text: t }; });
    let ck = '';
    choices.forEach(function (ch) { if (ch.text === c) ck = ch.key; });
    return { choices: choices, correctAnswer: ck };
  }

  function splitPassage(s) {
    const re = /<br\s*\/?>\s*<br\s*\/?>/gi;
    let last = null, m;
    while ((m = re.exec(s))) last = m;
    if (!last) return { passage: '', prompt: s };
    const prompt = s.slice(last.index + last[0].length);
    if (!prompt.trim()) return { passage: '', prompt: s };
    return { passage: s.slice(0, last.index), prompt: prompt };
  }

  function toNum(s) {
    s = String(s).trim().replace(/\s+/g, '');
    const m = /^([-+]?\d+)\/(\d+)$/.exec(s);
    if (m) return +m[2] === 0 ? NaN : (+m[1]) / (+m[2]);
    if (/^[-+]?(\d+\.?\d*|\.\d+)$/.test(s)) return parseFloat(s);
    return NaN;
  }

  // '14.5' -> ['14.5','29/2'];  '1/3' -> ['1/3','0.3333','0.3333'(усечённое)]
  function buildAccepted(ans) {
    const s = String(ans).trim(), out = [s], v = toNum(s);
    const add = function (x) { if (out.indexOf(x) < 0) out.push(x); };
    if (!isFinite(v)) return out;
    if (s.indexOf('/') >= 0) {
      add(String(+v.toFixed(4)));
      add(String(Math.trunc(v * 1e4) / 1e4));
    } else if (s.indexOf('.') >= 0 && Math.abs(v - Math.round(v)) > 1e-12) {
      for (let d = 2; d <= 100; d++) {
        const n = Math.round(v * d);
        if (n !== 0 && Math.abs(v * d - n) < 1e-9) { add(n + '/' + d); break; }
      }
    }
    return out;
  }

  function fromMathOutput(id, info, out) {
    const ans = String(out.a != null ? out.a : out.ans);
    const hasOpts = Array.isArray(out.opts) && out.opts.length > 1;
    let asGrid = !!out.isGrid || !hasOpts;
    if (!asGrid && CFG.gridInEveryNth > 0 && NUMERIC.test(ans.trim()) &&
        !/which (of the following|choice)/i.test(String(out.q)) &&
        hash(id + '|grid') % CFG.gridInEveryNth === 0) asGrid = true;

    const q = base(id, 'math', info.c, info.topic, info.difficulty);
    q.prompt = String(out.q);
    q.explanation = String(out.expl || out.explanation || out.sol || '');
    q.raw = out;
    if (asGrid) {
      q.type = 'spr';
      q.correctAnswer = ans;
      q.acceptedAnswers = buildAccepted(ans);
    } else {
      const m = makeMCQ(out.opts, ans, id, true);
      q.choices = m.choices;
      q.correctAnswer = m.correctAnswer;
      q.acceptedAnswers = [m.correctAnswer];
    }
    q.legacy = { q: q.prompt, ans: ans, opts: q.choices.map(function (c) { return c.text; }), isGrid: asGrid, rw: false, top: info.topic };
    return q;
  }

  // R&W-кортеж: [текст, верный, неверный, неверный, неверный]
  function fromTuple(id, tuple, c, topic, difficulty) {
    const full = String(tuple[0]);
    const parts = splitPassage(full);
    const m = makeMCQ(tuple.slice(1), tuple[1], id, true);
    const q = base(id, 'rw', c, topic, difficulty);
    q.passage = parts.passage;
    q.prompt = parts.prompt;
    q.choices = m.choices;
    q.correctAnswer = m.correctAnswer;
    q.acceptedAnswers = [m.correctAnswer];
    q.raw = tuple;
    q.legacy = { q: full, ans: String(tuple[1]), opts: q.choices.map(function (x) { return x.text; }), isGrid: false, rw: true, top: topic };
    return q;
  }

  function mathGenInfo(G, ti, gi) {
    const gens = flattenGens(G.GENERATORS[ti]);
    const e = gens[gi];
    return { e: e, c: cls('math', G.TOPS[ti]), topic: G.TOPS[ti], difficulty: (e && e.tier) || diffBy(gi, gens.length) };
  }

  function buildMath(id, ti, gi) {
    const G = globals();
    if (!G.GENERATORS || !G.TOPS) return null;
    const info = mathGenInfo(G, ti, gi);
    if (!info.e) return null;
    let out = null;
    for (let t = 0; t < 4 && !out; t++) {
      try { out = withSeed(hash(id) + t, info.e.fn); } catch (err) { out = null; }
      if (out && (out.q == null || (out.a == null && out.ans == null))) out = null;
    }
    return out ? fromMathOutput(id, info, out) : null;
  }

  function buildRQ(id, ti, idx) {
    const G = globals();
    const list = G.RQ && G.RQ[ti];
    const tuple = list && list[idx];
    if (!tuple) return null;
    return fromTuple(id, tuple, cls('rw', G.RTOPS[ti]), G.RTOPS[ti], diffBy(idx, list.length));
  }

  function buildRG(id, ti, gi) {
    const G = globals();
    const gens = flattenGens(G.RGEN && G.RGEN[ti]);
    const e = gens[gi];
    if (!e) return null;
    let tuple = null;
    for (let t = 0; t < 4 && !tuple; t++) {
      try { tuple = withSeed(hash(id) + t, e.fn); } catch (err) { tuple = null; }
      if (!Array.isArray(tuple) || tuple.length < 2) tuple = null;
    }
    return tuple ? fromTuple(id, tuple, cls('rw', G.RTOPS[ti]), G.RTOPS[ti], e.tier || diffBy(gi, gens.length)) : null;
  }

  /* -------------------------------------------------------------------
     6. СТАТИЧЕСКИЕ («БАЗОВЫЕ») ЗАДАЧИ
     Принимает: кортеж [текст, верный, неверные...] ИЛИ объект
       { id?, section?, domain?, skill?, difficulty?, passage?, prompt|q, choices|opts, correctAnswer|ans, explanation? }
     ------------------------------------------------------------------- */
  const STATIC_RAW = [];     // то, что добавили через SPData.addQuestions
  let STATIC_Q = {};         // id -> готовый вопрос

  function normStatic(raw, def, tag) {
    const isTuple = Array.isArray(raw);
    const o = isTuple ? {} : (raw && typeof raw === 'object' ? raw : null);
    if (!o) return null;

    let section = o.section || def.section || 'rw';
    if (section !== 'math') section = 'rw';
    const skill = o.skill || def.skill || '';
    const domain = o.domain || def.domain || '';
    const topicName = skill || o.topic || o.top || def.topic || '';
    const c = (domain && skill) ? { domain: domain, skill: skill } : classify(section, topicName);
    const difficulty = normDifficulty(o.difficulty != null ? o.difficulty : def.difficulty) || 'medium';

    let prompt, passage, texts, correct, doShuffle = false, isGrid = false;
    if (isTuple) {
      const split = splitPassage(String(raw[0]));
      passage = split.passage; prompt = split.prompt;
      texts = raw.slice(1).map(String); correct = String(raw[1]); doShuffle = true;
    } else {
      prompt = o.prompt != null ? String(o.prompt) : (o.q != null ? String(o.q) : '');
      passage = o.passage != null ? String(o.passage) : '';
      if (o.passage == null) { const sp = splitPassage(prompt); passage = sp.passage; prompt = sp.prompt; }
      const rawChoices = o.choices || o.opts || [];
      texts = rawChoices.map(function (x) { return String(x && typeof x === 'object' ? (x.text != null ? x.text : x.t) : x); });
      const ans = o.correctAnswer != null ? o.correctAnswer : o.ans;
      correct = ans == null ? '' : String(ans);
      if (texts.indexOf(correct) < 0 && /^[A-Fa-f]$/.test(correct)) {
        correct = texts[correct.toUpperCase().charCodeAt(0) - 65] || correct;
      }
      isGrid = o.type === 'spr' || !!o.isGrid || texts.length < 2;
      doShuffle = !!o.shuffle;
    }
    if (!prompt && !passage) return null;

    const id = o.id != null ? String(o.id) : (tag + ':' + hash(passage + '|' + prompt + '|' + correct).toString(36));
    const q = base(id, section, c, topicName, difficulty);
    q.passage = passage;
    q.prompt = prompt;
    q.explanation = String(o.explanation || o.expl || '');
    q.raw = raw;
    if (isGrid) {
      q.type = 'spr';
      q.correctAnswer = correct;
      q.acceptedAnswers = Array.isArray(o.acceptedAnswers) && o.acceptedAnswers.length ? o.acceptedAnswers.map(String) : buildAccepted(correct);
    } else {
      const m = makeMCQ(texts, correct, id, doShuffle);
      q.choices = m.choices; q.correctAnswer = m.correctAnswer; q.acceptedAnswers = [m.correctAnswer];
    }
    q.legacy = {
      q: passage ? passage + '<br><br>' + prompt : prompt, ans: correct,
      opts: q.choices.map(function (x) { return x.text; }), isGrid: isGrid, rw: section === 'rw',
      top: q.topic || (section === 'rw' ? 'Reading & Writing' : 'SAT Math')
    };
    return q;
  }

  function globalStatic() {
    const out = [];
    if (Array.isArray(window.SP_BASE_QUESTIONS)) out.push({ list: window.SP_BASE_QUESTIONS, def: {}, tag: 'base' });
    // PLUG IN 1500 R&W QUESTIONS (плоский массив): window.RW_QUESTIONS = [ ... ]
    if (Array.isArray(window.RW_QUESTIONS)) out.push({ list: window.RW_QUESTIONS, def: { section: 'rw' }, tag: 'rwq' });
    return out;
  }

  /* -------------------------------------------------------------------
     7. КАТАЛОГ
     ------------------------------------------------------------------- */
  let ITEMS = [];            // лёгкие метаданные всех вопросов
  let IDSET = {};
  let STRUCT = null;         // { rw:[{name,skills:[{name}]}], math:[...] }
  let MAPPING = [];
  let QCACHE = {};
  let BUILT = false, DIRTY = true;

  function newStructure() {
    const s = {};
    ['rw', 'math'].forEach(function (sec) {
      s[sec] = TAXONOMY[sec].map(function (d) {
        return { name: d.domain, skills: d.skills.map(function (k) { return { name: k }; }) };
      });
    });
    return s;
  }
  function ensureNode(S, sec, domain, skill) {
    let D = null;
    S[sec].forEach(function (d) { if (d.name === domain) D = d; });
    if (!D) { D = { name: domain, skills: [] }; S[sec].push(D); }
    if (!D.skills.some(function (k) { return k.name === skill; })) D.skills.push({ name: skill });
  }

  function build() {
    const G = globals();
    const S = newStructure();
    const mapAgg = {};
    ITEMS = []; IDSET = {}; QCACHE = {}; STATIC_Q = {}; MAPPING = [];

    function add(meta, rawTopic) {
      if (IDSET[meta.id]) return;
      IDSET[meta.id] = 1;
      ITEMS.push(meta);
      ensureNode(S, meta.section, meta.domain, meta.skill);
      const k = meta.section + '|' + rawTopic;
      if (!mapAgg[k]) {
        mapAgg[k] = { section: meta.section, topic: rawTopic, domain: meta.domain, skill: meta.skill, count: 0, unmapped: meta.domain === FALLBACK_DOMAIN };
        MAPPING.push(mapAgg[k]);
      }
      mapAgg[k].count++;
    }

    // ---- PLUG IN MATH GENERATORS --------------------------------------
    // Источник: TOPS[ti] (названия тем) и GENERATORS[ti] (массив функций-генераторов).
    // Версии идут «по кругу» (v-major), чтобы подряд не попадали похожие задачи.
    if (G.TOPS && G.GENERATORS) {
      for (let ti = 0; ti < G.TOPS.length; ti++) {
        const gens = flattenGens(G.GENERATORS[ti]);
        if (!gens.length) continue;
        const c = cls('math', G.TOPS[ti]);
        for (let v = 0; v < CFG.mathVariants; v++) {
          for (let gi = 0; gi < gens.length; gi++) {
            add({ id: 'm:' + ti + ':' + gi + ':' + v, section: 'math', domain: c.domain, skill: c.skill,
                  difficulty: gens[gi].tier || diffBy(gi, gens.length), kind: 'gen' }, G.TOPS[ti]);
          }
        }
      }
    }

    // ---- PLUG IN 1500 R&W QUESTIONS -----------------------------------
    // Источник: RTOPS[ti] (названия тем) и RQ[ti] (массивы [текст, верный, неверные...]).
    if (G.RTOPS && G.RQ) {
      for (let ti = 0; ti < G.RTOPS.length; ti++) {
        const list = G.RQ[ti];
        if (!list || !list.length) continue;
        const c = cls('rw', G.RTOPS[ti]);
        for (let idx = 0; idx < list.length; idx++) {
          add({ id: 'rw:' + ti + ':' + idx, section: 'rw', domain: c.domain, skill: c.skill,
                difficulty: diffBy(idx, list.length), kind: 'rq', q0: String(list[idx][0]).trim() }, G.RTOPS[ti]);
        }
      }
    }
    // R&W-генераторы (необязательно): RGEN[ti] — функции, возвращающие такой же кортеж
    if (G.RTOPS && G.RGEN) {
      for (let ti = 0; ti < G.RTOPS.length; ti++) {
        const gens = flattenGens(G.RGEN[ti]);
        if (!gens.length) continue;
        const c = cls('rw', G.RTOPS[ti]);
        for (let v = 0; v < CFG.rwGenVariants; v++) {
          for (let gi = 0; gi < gens.length; gi++) {
            add({ id: 'rg:' + ti + ':' + gi + ':' + v, section: 'rw', domain: c.domain, skill: c.skill,
                  difficulty: gens[gi].tier || diffBy(gi, gens.length), kind: 'rg' }, G.RTOPS[ti]);
          }
        }
      }
    }

    // ---- БАЗОВЫЕ (СТАТИЧЕСКИЕ) ЗАДАЧИ ---------------------------------
    const groups = STATIC_RAW.concat(globalStatic());
    groups.forEach(function (grp) {
      grp.list.forEach(function (raw) {
        const q = normStatic(raw, grp.def || {}, grp.tag || 'x');
        if (!q || IDSET[q.id]) return;
        STATIC_Q[q.id] = q;
        add({ id: q.id, section: q.section, domain: q.domain, skill: q.skill, difficulty: q.difficulty, kind: 'static' },
            q.topic || q.skill);
      });
    });

    STRUCT = S;
    BUILT = true; DIRTY = false;

    const bad = MAPPING.filter(function (m) { return m.unmapped; });
    if (bad.length) {
      console.warn('[SPData] Темы не сопоставлены со стандартной таксономией SAT (попали в "' + FALLBACK_DOMAIN + '"): ' +
        bad.map(function (b) { return '"' + b.topic + '"'; }).join(', ') +
        '. Добавьте их в SP_DATA_CONFIG.topicMap или посмотрите SPData.debug().');
    }
  }
  function ensureBuilt() { if (!BUILT || DIRTY) build(); }

  /* -------------------------------------------------------------------
     8. ПОЛУЧЕНИЕ ВОПРОСА, REMIX
     ------------------------------------------------------------------- */
  function getQuestion(id) {
    ensureBuilt();
    id = String(id);
    if (QCACHE[id]) return QCACHE[id];
    let q = null, m;
    try {
      if ((m = /^m:(\d+):(\d+):(\d+)$/.exec(id))) q = buildMath(id, +m[1], +m[2]);
      else if ((m = /^rw:(\d+):(\d+)$/.exec(id))) q = buildRQ(id, +m[1], +m[2]);
      else if ((m = /^rg:(\d+):(\d+):(\d+)$/.exec(id))) q = buildRG(id, +m[1], +m[2]);
      else q = STATIC_Q[id] || null;
    } catch (e) { console.error('[SPData] cannot build question ' + id, e); }
    if (q) QCACHE[id] = q;
    return q;
  }

  // Новая версия той же задачи (кнопка Remix). Работает для Math-генераторов и RGEN.
  function remix(qOrId) {
    const id = typeof qOrId === 'string' ? qOrId : (qOrId && qOrId.id);
    const m = /^(m|rg):(\d+):(\d+):\d+$/.exec(id || '');
    if (!m) return null;
    return getQuestion(m[1] + ':' + m[2] + ':' + m[3] + ':' + (1000 + Math.floor(Math.random() * 900000)));
  }

  /* -------------------------------------------------------------------
     9. ПРОГРЕСС: Unsolved / Solved / Missed
     ------------------------------------------------------------------- */
  let PROG = null;
  function prog() { if (!PROG) PROG = jget(KEYS.prog, {}); return PROG; }
  window.addEventListener('storage', function (e) { if (e.key === KEYS.prog) PROG = null; });

  /* -------------------------------------------------------------------
     9a. СТАТИСТИКА: активность, точность, серия и очки
     Формат ключей совместим со старым сайтом:
       satpath_telemetry_v1 = { days: { 'YYYY-MM-DD': { q, ok, sec } }, bestStreak }
       satpath_lb_YYYY-MM   = { pts, q, c }   — «ожидающие» очки лидерборда (их отправляет в Firestore lbFlush)
       satpath_points_v1    = { total, days: { 'YYYY-MM-DD': очки } }   — личный счёт, его показывает Dashboard
     ------------------------------------------------------------------- */
  const STAT_KEYS = { tele: 'satpath_telemetry_v1', points: 'satpath_points_v1', lb: 'satpath_lb_' };
  const POINTS_PER_CORRECT = 10;     // как в старом сайте: +10 за верный ответ (один раз за вопрос)
  const p2 = function (n) { return n < 10 ? '0' + n : '' + n; };
  const dayKey = function (d) { d = d || new Date(); return d.getFullYear() + '-' + p2(d.getMonth() + 1) + '-' + p2(d.getDate()); };
  const monthKey = function (d) { d = d || new Date(); return d.getFullYear() + '-' + p2(d.getMonth() + 1); };

  function bumpTelemetry(correct) {
    let t = jget(STAT_KEYS.tele, {});
    if (!t || typeof t !== 'object') t = {};
    if (!t.days || typeof t.days !== 'object') t.days = {};
    const k = dayKey();
    const d = t.days[k] || { q: 0, ok: 0, sec: 0 };
    d.q = (+d.q || 0) + 1;
    if (correct) d.ok = (+d.ok || 0) + 1;
    if (d.sec == null) d.sec = 0;
    t.days[k] = d;
    // лучшая серия дней подряд
    let cur = 0;
    const now = new Date();
    for (let i = 0; i < 400; i++) {
      const r = t.days[dayKey(new Date(now.getFullYear(), now.getMonth(), now.getDate() - i))];
      if (r && +r.q > 0) cur++;
      else if (i === 0) continue;
      else break;
    }
    if (cur > (+t.bestStreak || 0)) t.bestStreak = cur;
    lsSet(STAT_KEYS.tele, JSON.stringify(t));
  }

  function bumpPending(inc) {
    const key = STAT_KEYS.lb + monthKey();
    const o = jget(key, {}) || {};
    lsSet(key, JSON.stringify({
      pts: (+o.pts || 0) + (inc.pts || 0),
      q: (+o.q || 0) + (inc.q || 0),
      c: (+o.c || 0) + (inc.c || 0)
    }));
  }

  function pointsStore() {
    const p = jget(STAT_KEYS.points, null);
    return {
      total: p && +p.total > 0 ? +p.total : 0,
      days: p && p.days && typeof p.days === 'object' ? p.days : {}
    };
  }

  function addPoints(n, why) {
    n = Math.round(+n || 0);
    if (n <= 0) return 0;
    const p = pointsStore(), k = dayKey();
    p.total += n;
    p.days[k] = (+p.days[k] || 0) + n;
    const keys = Object.keys(p.days).sort();
    while (keys.length > 400) delete p.days[keys.shift()];
    lsSet(STAT_KEYS.points, JSON.stringify(p));
    try { window.dispatchEvent(new CustomEvent('sp:points', { detail: { points: n, why: why || 'bonus', total: p.total } })); } catch (e) {}
    return n;
  }

  // { total, week (последние 7 дней), month (текущий месяц), today }
  function statsPoints() {
    const p = pointsStore(), now = new Date();
    let week = 0, month = 0;
    for (let i = 0; i < 7; i++) week += +p.days[dayKey(new Date(now.getFullYear(), now.getMonth(), now.getDate() - i))] || 0;
    const mk = monthKey();
    Object.keys(p.days).forEach(function (k) { if (k.slice(0, 7) === mk) month += +p.days[k] || 0; });
    return { total: p.total, week: week, month: month, today: +p.days[dayKey()] || 0 };
  }

  // вопросы и верные ответы за текущий месяц
  function statsMonthQA() {
    const t = jget(STAT_KEYS.tele, {}), mk = monthKey();
    let q = 0, ok = 0;
    Object.keys((t && t.days) || {}).forEach(function (k) {
      if (k.slice(0, 7) === mk) { q += +t.days[k].q || 0; ok += +t.days[k].ok || 0; }
    });
    return { q: q, ok: ok, pct: q ? Math.round(ok / q * 100) : 0 };
  }

  // Бонус за Daily Challenge (событие отправляет shell.js): 5 очков × верные × множитель серии
  window.addEventListener('sp:daily-complete', function (e) {
    const d = (e && e.detail) || {};
    addPoints(Math.round((+d.correct || 0) * 5 * (+d.multiplier || 1)), 'daily');
  });

  /* -------------------------------------------------------------------
     9b. ЗАПИСЬ ОТВЕТА — вызывается из solver.js и Daily Challenge после каждой проверки
     ------------------------------------------------------------------- */
  function record(id, correct, opts) {
    ensureBuilt();
    id = String(id);
    correct = !!correct;
    const inBank = !!IDSET[id];          // Remix-варианты в банк не входят: считаются в статистику, но очков не дают
    let firstOk = false;

    if (inBank) {
      const p = prog(), prev = p[id] || { n: 0 };
      firstOk = correct && prev.r !== 'ok';
      p[id] = { r: correct ? 'ok' : 'miss', n: (prev.n || 0) + 1, t: Date.now() };
      lsSet(KEYS.prog, JSON.stringify(p));
    }

    try {
      bumpTelemetry(correct);
      // Лидерборд (старые правила): q+1, c+1 за верный, +10 очков за верный ответ.
      if (!(opts && opts.leaderboard === false)) {
        bumpPending({
          q: 1,
          c: correct ? 1 : 0,
          pts: correct && (firstOk || !inBank) ? POINTS_PER_CORRECT : 0
        });
      }
      if (firstOk) addPoints(POINTS_PER_CORRECT, 'correct');
    } catch (e) { console.error('[SPData] stats update failed', e); }

    let meta = {};
    try {
      const q = getQuestion(id);
      if (q) meta = { section: q.section, domain: q.domain, skill: q.skill, difficulty: q.difficulty, type: q.type };
    } catch (e) {}
    // Точка интеграции Firebase / Review: window.addEventListener('sp:progress', e => ...)
    try {
      window.dispatchEvent(new CustomEvent('sp:progress', { detail: { id: id, correct: correct, inBank: inBank, firstOk: firstOk, meta: meta } }));
    } catch (e) {}
  }
  function resetProgress() { PROG = {}; lsSet(KEYS.prog, '{}'); }

  // Данные старого сайта: решённые R&W-острова и журнал ошибок (по тексту вопроса)
  function snapshot() {
    const snap = { prog: prog(), solved: {}, missed: {} };
    const G = globals();
    if (G.RTOPS) {
      for (let ti = 0; ti < G.RTOPS.length; ti++) {
        const arr = jget(KEYS.legacyRwSolved + ti, null);
        if (Array.isArray(arr)) arr.forEach(function (k) {
          const m = /^rq_(\d+)$/.exec(k);
          if (m) snap.solved['rw:' + ti + ':' + m[1]] = 1;
        });
      }
    }
    const mk = jget(KEYS.legacyMistakes, []);
    if (Array.isArray(mk)) mk.forEach(function (x) { if (x && x.rw && x.q) snap.missed[String(x.q).trim()] = 1; });
    return snap;
  }
  function statusOf(m, snap) {
    const p = snap.prog[m.id];
    if (p) return p.r === 'ok' ? 'solved' : 'missed';
    if (m.kind === 'rq') {
      if (snap.missed[m.q0]) return 'missed';
      if (snap.solved[m.id]) return 'solved';
    }
    return 'unsolved';
  }
  function inTab(tab, st) {
    if (tab === 'unsolved') return st === 'unsolved';
    if (tab === 'missed') return st === 'missed';
    if (tab === 'solved') return CFG.solvedIncludesMissed ? st !== 'unsolved' : st === 'solved';
    return true;   // 'all'
  }

  /* -------------------------------------------------------------------
     10. ЗАПРОСЫ: дерево со счётчиками и списки id
     ------------------------------------------------------------------- */
  function tree(f) {
    ensureBuilt();
    f = f || {};
    const status = f.status || 'all';
    const diff = f.difficulty && f.difficulty !== 'all' ? f.difficulty : null;
    const snap = snapshot();
    const counts = {};
    const tabs = { unsolved: 0, solved: 0, missed: 0, all: 0 };

    ITEMS.forEach(function (m) {
      if (diff && m.difficulty !== diff) return;
      const st = statusOf(m, snap);
      tabs.all++;
      if (inTab('unsolved', st)) tabs.unsolved++;
      if (inTab('solved', st)) tabs.solved++;
      if (inTab('missed', st)) tabs.missed++;
      if (inTab(status, st)) {
        const k = m.section + '|' + m.domain + '|' + m.skill;
        counts[k] = (counts[k] || 0) + 1;
      }
    });

    function sec(name) {
      let total = 0;
      const domains = STRUCT[name].map(function (d) {
        let dc = 0;
        const skills = d.skills.map(function (s) {
          const c = counts[name + '|' + d.name + '|' + s.name] || 0;
          dc += c;
          return { name: s.name, count: c };
        });
        total += dc;
        return { name: d.name, count: dc, skills: skills };
      });
      return { total: total, domains: domains };
    }
    return { tabs: tabs, sections: { rw: sec('rw'), math: sec('math') } };
  }

  function query(f) {
    ensureBuilt();
    f = f || {};
    const snap = snapshot();
    const status = f.status || 'all';
    const diff = f.difficulty && f.difficulty !== 'all' ? f.difficulty : null;
    const out = [];
    ITEMS.forEach(function (m) {
      if (f.section && f.section !== 'all' && m.section !== f.section) return;
      if (f.domain && m.domain !== f.domain) return;
      if (f.skill && m.skill !== f.skill) return;
      if (diff && m.difficulty !== diff) return;
      if (!inTab(status, statusOf(m, snap))) return;
      out.push(m.id);
    });
    return out;
  }

  /* -------------------------------------------------------------------
     11. СЕССИИ (Question Bank -> Solver)
     ------------------------------------------------------------------- */
  let ACTIVE = null;
  function startSession(o) {
    o = o || {};
    let ids = query(o);
    if (o.shuffle) ids = shuffleRandom(ids);
    const secName = o.section === 'math' ? 'Math' : o.section === 'rw' ? 'Reading & Writing' : 'All questions';
    ACTIVE = {
      id: 's' + Date.now().toString(36),
      section: o.section || 'all', domain: o.domain || null, skill: o.skill || null,
      status: o.status || 'all', difficulty: o.difficulty || 'all', shuffled: !!o.shuffle,
      title: o.skill || o.domain || secName, ids: ids, createdAt: Date.now()
    };
    try { sessionStorage.setItem(KEYS.session, JSON.stringify(ACTIVE)); } catch (e) {}
    return ACTIVE;
  }
  function getSession() {
    if (ACTIVE) return ACTIVE;
    try { const raw = sessionStorage.getItem(KEYS.session); if (raw) ACTIVE = JSON.parse(raw); } catch (e) {}
    return ACTIVE;
  }
  function clearSession() {
    ACTIVE = null;
    try { sessionStorage.removeItem(KEYS.session); } catch (e) {}
  }

  /* -------------------------------------------------------------------
     12. ПРОВЕРКА ОТВЕТА (mcq: 'B' или текст варианта; spr: '14.5', '29/2', '.5')
     ------------------------------------------------------------------- */
  function checkAnswer(q, input) {
    if (!q) return false;
    const raw = input == null ? '' : String(input).trim();
    if (!raw) return false;
    if (q.type === 'mcq') {
      if (raw.toUpperCase() === q.correctAnswer) return true;
      return q.choices.some(function (c) { return c.key === q.correctAnswer && c.text === raw; });
    }
    const u = toNum(raw);
    const flat = function (s) { return String(s).toLowerCase().replace(/\s+/g, ''); };
    return q.acceptedAnswers.some(function (a) {
      const n = toNum(a);
      if (isFinite(n) && isFinite(u)) return Math.abs(n - u) < 1e-9;
      return flat(a) === flat(raw);
    });
  }

  /* -------------------------------------------------------------------
     13. ЗАГРУЗКА ДАННЫХ
     ------------------------------------------------------------------- */
  let readyP = null;
  const LOAD_ERRORS = [];

  function hasScriptTag(src) {
    const tags = document.getElementsByTagName('script');
    for (let i = 0; i < tags.length; i++) {
      const a = (tags[i].getAttribute('src') || '').split('?')[0];
      if (a === src || a.slice(-(src.length + 1)) === '/' + src) return true;
    }
    return false;
  }
  function loadScript(src) {
    return new Promise(function (resolve) {
      const s = document.createElement('script');
      s.src = src; s.async = false;
      s.onload = function () { resolve(true); };
      s.onerror = function () { LOAD_ERRORS.push(src); resolve(false); };
      document.head.appendChild(s);
    });
  }

  function load() {
    if (readyP) return readyP;
    readyP = new Promise(function (resolve) {
      function go() {
        const G = globals();
        let chain = Promise.resolve();
        if (!(G.TOPS && G.GENERATORS && G.RTOPS && G.RQ)) {
          CFG.dataScripts.forEach(function (src) {
            if (!hasScriptTag(src)) chain = chain.then(function () { return loadScript(src); });
          });
        }
        chain.then(function () {
          DIRTY = true;
          try { ensureBuilt(); } catch (e) { console.error('[SPData] build failed', e); }
          resolve(true);
        });
      }
      if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go);
      else go();
    });
    return readyP;
  }

  function status() {
    const G = globals();
    const missing = Object.keys(G).filter(function (k) { return !G[k] && k !== 'RGEN'; });
    ensureBuilt();
    return { size: ITEMS.length, missingGlobals: missing, loadErrors: LOAD_ERRORS.slice(), tried: CFG.dataScripts.slice() };
  }

  function addQuestions(list, defaults, tag) {
    if (!Array.isArray(list)) return;
    STATIC_RAW.push({ list: list, def: defaults || {}, tag: tag || 'x' });
    DIRTY = true;
  }

  function debug() {
    ensureBuilt();
    if (console.table) console.table(MAPPING);
    return MAPPING.slice();
  }

  /* -------------------------------------------------------------------
     ПУБЛИЧНЫЙ API
     ------------------------------------------------------------------- */
  window.SPData = {
    config: CFG,
    solverReady: false,          // solver.js выставит true, когда зарегистрирует маршрут 'solver'
    load: load,                  // Promise: данные подгружены, каталог собран
    status: status,
    size: function () { ensureBuilt(); return ITEMS.length; },
    addQuestions: addQuestions,  // SPData.addQuestions(list, { section:'rw', skill:'Transitions' })
    tree: tree,                  // счётчики для экрана Question Bank
    query: query,                // -> массив id
    getQuestion: getQuestion,    // id -> вопрос в едином формате
    remix: remix,
    startSession: startSession,
    getSession: getSession,
    clearSession: clearSession,
    progress: { record: record, reset: resetProgress, get: function () { return prog(); } },
    stats: { points: statsPoints, monthQA: statsMonthQA, addPoints: addPoints },
    checkAnswer: checkAnswer,
    debug: debug
  };
})();
