/* =====================================================================
   SATPath — Vocabulary (vocabulary.js)
   ---------------------------------------------------------------------
   Подключать ПОСЛЕ shell.js и dataAdapter.js.   Маршрут: #/vocabulary

   Что внутри:
     1. Хранилище (localStorage satpath_vocab_v1 — тот же ключ, что в старом сайте)
     2. Интервальное повторение: New → Learning → Mastered
     3. Автозаполнение: dictionaryapi.dev (EN) + MyMemory (RU)
     4. Окно добавления / редактирования слова
     5. «+ Vocab» для Solver:  SPVocab.attach({ root, getId })
     6. Экран: Flashcards, Context Practice, Word of the Day, прогресс, список

   API:  window.SPVocab (он же SPData.vocab)
     list(), get(word), add(entry), update(word, patch), remove(word),
     dueCount(), openEditor(opts), speak(word), attach(opts)

   Синхронизация с Firebase:
     window.addEventListener('sp:vocab', function (e) { ... e.detail.list ... });
   ===================================================================== */
(function () {
  'use strict';

  const Shell = window.SPShell;
  if (!Shell) {
    console.error('[vocabulary] Подключите shell.js ДО этого файла.');
    return;
  }

  const KEY = 'satpath_vocab_v1';
  const DICT_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
  const TR_URL = 'https://api.mymemory.translated.net/get?langpair=en%7Cru&q=';
  const DAY = 864e5;
  const INTERVALS = [0, 1, 3, 7, 14, 30];     // дни до следующего повторения для box 0..5
  const MASTERED_BOX = 4;
  const POS = ['noun', 'verb', 'adjective', 'adverb', 'preposition', 'conjunction', 'pronoun', 'interjection', 'phrase'];
  const STATUS = {
    new:      { label: 'New',      chip: 'bg-accent/10 text-accent',   bar: 'bg-accent' },
    learning: { label: 'Learning', chip: 'bg-hl/15 text-hl',           bar: 'bg-hl' },
    mastered: { label: 'Mastered', chip: 'bg-success/10 text-success', bar: 'bg-success' }
  };

  /* ------------------------------ SAT-БАНК ------------------------------ */
  // [слово, часть речи, перевод, определение, пример]. Первые 5 — стартовый набор.
  const BANK = [
    ['evergreen', 'adjective', 'вечнозелёный', 'A plant that keeps its green leaves or needles throughout all four seasons of the year.', 'Spruce and fir trees remain evergreen even during the coldest winter months when deciduous trees shed their leaves.'],
    ['corroborate', 'verb', 'подтверждать', 'To support a statement or theory with additional evidence.', 'New ice-core measurements corroborate the hypothesis about rapid warming.'],
    ['mitigate', 'verb', 'смягчать', 'To make something less severe, harmful, or painful.', 'Coastal wetlands help mitigate storm damage during hurricanes.'],
    ['ubiquitous', 'adjective', 'повсеместный', 'Present or found everywhere.', 'Microplastic particles have become ubiquitous in marine ecosystems.'],
    ['ambiguous', 'adjective', 'неоднозначный', 'Open to more than one interpretation.', 'Because the clause was ambiguous, both nations claimed the reef.'],
    ['ephemeral', 'adjective', 'мимолётный', 'Lasting for a very short time.', 'Desert wildflowers produce ephemeral blooms that vanish within days.'],
    ['bolster', 'verb', 'укреплять, подкреплять', 'To support or strengthen something.', 'The economist cited census data to bolster her claim about wage mobility.'],
    ['nuance', 'noun', 'нюанс, оттенок', 'A subtle difference in meaning, expression, or tone.', 'The translator preserved every nuance of the original poem.'],
    ['pragmatic', 'adjective', 'прагматичный', 'Dealing with things in a practical and realistic way.', 'The engineers chose a pragmatic repair over a costly demolition.'],
    ['scrutinize', 'verb', 'тщательно изучать', 'To examine something closely and thoroughly.', 'Peer reviewers scrutinize research methods before approving a paper.'],
    ['tenacious', 'adjective', 'упорный, цепкий', 'Persistent and not giving up easily.', 'Lichens are tenacious organisms that can colonize bare rock.'],
    ['undermine', 'verb', 'подрывать', 'To gradually weaken the strength or credibility of something.', 'Uncontrolled variables can undermine the validity of a study.'],
    ['vindicate', 'verb', 'оправдывать, доказывать правоту', 'To show that someone or something was right or free from blame.', 'The new telescope images seemed to vindicate the astronomer.'],
    ['anomaly', 'noun', 'аномалия, отклонение', 'Something that differs from what is normal or expected.', 'The team treated the unusual reading as an anomaly until it appeared again.'],
    ['conjecture', 'noun', 'догадка, предположение', 'An opinion or conclusion formed without complete evidence.', 'Without written records, the purpose of the structure remains a matter of conjecture.'],
    ['disparate', 'adjective', 'разнородный', 'Essentially different from one another.', 'The artist combines disparate materials such as glass, wool, and steel.'],
    ['elucidate', 'verb', 'разъяснять', 'To make something clear by explaining it.', 'The diagrams help elucidate how the enzyme changes shape.'],
    ['empirical', 'adjective', 'эмпирический', 'Based on observation or experiment rather than theory alone.', 'The claim is popular, but it lacks empirical support.'],
    ['exacerbate', 'verb', 'усугублять', 'To make a problem or bad situation worse.', 'A long drought can exacerbate the risk of wildfire.'],
    ['meticulous', 'adjective', 'дотошный, тщательный', 'Showing great attention to detail.', 'Her meticulous field notes allowed others to repeat the survey.'],
    ['novel', 'adjective', 'новый, оригинальный', 'New and different from what has been known before.', 'The researchers proposed a novel method for recycling plastic.'],
    ['paradigm', 'noun', 'парадигма, модель', 'A typical model or framework for understanding something.', 'The discovery forced a shift in the dominant scientific paradigm.'],
    ['plausible', 'adjective', 'правдоподобный', 'Seeming reasonable or likely to be true.', 'Erosion is a plausible explanation for the unusual shape of the cliff.'],
    ['reconcile', 'verb', 'согласовывать, примирять', 'To make two ideas or facts consistent with each other.', 'Historians struggle to reconcile the two conflicting accounts.'],
    ['substantiate', 'verb', 'обосновывать', 'To provide evidence that proves something is true.', 'The author offers no data to substantiate the argument.'],
    ['tentative', 'adjective', 'предварительный', 'Not certain or final.', 'The scientists reached a tentative conclusion that awaits further testing.']
  ].map(function (r) { return { w: r[0], pos: r[1], tr: r[2], d: r[3], ex: r[4] }; });

  /* ------------------------------ УТИЛИТЫ ------------------------------ */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  const norm = function (w) { return String(w || '').toLowerCase().replace(/[’]/g, "'").replace(/\s+/g, ' ').trim(); };
  const hasCyr = function (s) { return /[а-яё]/i.test(String(s || '')); };
  function shuffle(a) {
    const r = a.slice();
    for (let i = r.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); const t = r[i]; r[i] = r[j]; r[j] = t;
    }
    return r;
  }

  const P = {
    plus: '<path d="M12 5v14M5 12h14"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
    speaker: '<path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/>',
    trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v5M14 11v5"/>',
    pencil: '<path d="M17 3a2.8 2.8 0 0 1 4 4L8 20l-5 1 1-5z"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    back: '<path d="M19 12H5M11 18l-6-6 6-6"/>',
    cards: '<rect x="3" y="7" width="14" height="14" rx="3"/><path d="M7 3h11a3 3 0 0 1 3 3v11"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    spark: '<path d="M12 3l2 6 6 2-6 2-2 8-2-8-6-2 6-2z"/>',
    book: '<path d="M12 6c-2-2-5-2-9-2v15c4 0 7 0 9 2 2-2 5-2 9-2V4c-4 0-7 0-9 2zM12 6v15"/>',
    rotate: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>'
  };
  function ic(name, size) {
    const s = size || 16;
    return '<svg viewBox="0 0 24 24" width="' + s + '" height="' + s + '" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="shrink-0">' + P[name] + '</svg>';
  }

  /* ------------------------------ СТИЛИ ------------------------------ */
  const CSS =
    '@keyframes vcUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}' +
    '@keyframes vcFade{from{opacity:0}to{opacity:1}}' +
    '.vc-up{animation:vcUp .22s cubic-bezier(.2,.7,.2,1) both}' +
    '.vc-fade{animation:vcFade .16s ease both}' +
    '.vc-flip{perspective:1400px}' +
    '.vc-inner{display:grid;transform-style:preserve-3d;transition:transform .45s cubic-bezier(.2,.7,.2,1)}' +
    '.vc-inner[data-on="1"]{transform:rotateY(180deg)}' +
    '.vc-face{grid-area:1/1;min-height:320px;backface-visibility:hidden;-webkit-backface-visibility:hidden}' +
    '.vc-back{transform:rotateY(180deg)}' +
    '.vc-field{width:100%;border-radius:10px;border:1px solid var(--c-hairline);background:rgb(var(--c-canvas));color:rgb(var(--c-ink));padding:10px 12px;font-size:14px;outline:none;transition:border-color .15s}' +
    '.vc-field:focus{border-color:rgb(var(--c-accent))}' +
    '@media (max-width:767px){.vc-field{font-size:16px}}' +
    '@media (prefers-reduced-motion:reduce){.vc-up,.vc-fade{animation:none!important}.vc-inner{transition:none!important}}';

  function ensureStyle() {
    if (document.getElementById('vcStyle')) return;
    const s = document.createElement('style');
    s.id = 'vcStyle';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* =====================================================================
     1. ХРАНИЛИЩЕ
     Поля w, d, ru, ctx совместимы со старым сайтом:
       w — слово, d — определение, ru — метка части речи, ctx — пример.
     Новые поля: pos, tr (перевод), src (предложение из задачи), qid,
       audio, box, due, reviews, status, addedAt.
     ===================================================================== */
  let mem = null;   // запасной вариант, если localStorage недоступен

  function readRaw() {
    try {
      const v = localStorage.getItem(KEY);
      if (v !== null) { const a = JSON.parse(v); return Array.isArray(a) ? a : []; }
    } catch (e) {}
    return mem ? mem.slice() : [];
  }

  function normalize(x) {
    const o = {};
    Object.keys(x).forEach(function (k) { o[k] = x[k]; });   // чужие поля не теряем
    const legacy = String(x.ru || '');
    o.w = String(x.w || '').trim();
    o.pos = x.pos != null ? String(x.pos) : (POS.indexOf(legacy.toLowerCase()) >= 0 ? legacy.toLowerCase() : '');
    o.tr = x.tr != null ? String(x.tr) : (hasCyr(legacy) ? legacy : '');
    o.d = String(x.d || '');
    o.ctx = String(x.ctx || '');
    o.src = String(x.src || '');
    o.box = Math.max(0, Math.min(INTERVALS.length - 1, +x.box || 0));
    o.due = +x.due || 0;
    o.reviews = +x.reviews || 0;
    o.status = STATUS[x.status] ? x.status : 'new';
    o.addedAt = +x.addedAt || 0;
    return o;
  }

  function list() {
    return readRaw().filter(function (x) { return x && x.w; }).map(normalize);
  }
  function get(word) {
    const k = norm(word);
    return list().filter(function (x) { return norm(x.w) === k; })[0] || null;
  }
  function dueList(words) {
    const now = Date.now();
    return (words || list()).filter(function (x) { return x.due <= now; });
  }
  function dueCount() { return dueList().length; }
  function paintBadge() { try { Shell.setBadge('vocabulary', dueCount()); } catch (e) {} }

  function save(arr) {
    mem = arr.slice();
    try { localStorage.setItem(KEY, JSON.stringify(arr)); }
    catch (e) { console.warn('[vocabulary] localStorage недоступен, слова живут до перезагрузки', e); }
    paintBadge();
    try { window.dispatchEvent(new CustomEvent('sp:vocab', { detail: { list: arr } })); } catch (e) {}
  }

  function clean(entry) {
    const o = normalize(entry);
    o.ru = o.pos || o.ru || 'word';
    return o;
  }
  function add(entry) {
    if (!entry || !norm(entry.w)) return false;
    if (get(entry.w)) return false;
    const o = clean(entry);
    o.addedAt = o.addedAt || Date.now();
    const arr = list();
    arr.unshift(o);
    save(arr);
    return true;
  }
  function update(word, patch) {
    const k = norm(word);
    let found = false;
    const arr = list().map(function (x) {
      if (norm(x.w) !== k) return x;
      found = true;
      Object.keys(patch).forEach(function (p) { x[p] = patch[p]; });
      return clean(x);
    });
    if (found) save(arr);
    return found;
  }
  function remove(word) {
    const k = norm(word);
    save(list().filter(function (x) { return norm(x.w) !== k; }));
  }

  /* =====================================================================
     2. ИНТЕРВАЛЬНОЕ ПОВТОРЕНИЕ
     Уровень растёт только когда слову «пора» повторяться, поэтому
     за один вечер нельзя случайно сделать слово Mastered.
     ===================================================================== */
  function grade(word, ok) {
    const x = get(word);
    if (!x) return;
    const now = Date.now();
    const patch = { reviews: x.reviews + 1 };
    if (!ok) {
      patch.box = 0; patch.due = now; patch.status = 'learning';
    } else if (x.due <= now) {
      patch.box = Math.min(INTERVALS.length - 1, x.box + 1);
      patch.due = now + INTERVALS[patch.box] * DAY;
      patch.status = patch.box >= MASTERED_BOX ? 'mastered' : 'learning';
    } else if (x.status === 'new') {
      patch.status = 'learning';
    }
    update(word, patch);
  }
  function setStatus(word, status) {
    const box = status === 'mastered' ? MASTERED_BOX : status === 'learning' ? 1 : 0;
    update(word, {
      status: status, box: box,
      due: status === 'mastered' ? Date.now() + INTERVALS[box] * DAY : Date.now(),
      reviews: status === 'new' ? 0 : 1
    });
  }

  /* ------------------------------ ПРОИЗНОШЕНИЕ ------------------------------ */
  function tts(word) {
    if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) { Shell.toast('Audio is not supported in this browser.'); return; }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(word);
    u.lang = 'en-US';
    u.rate = 0.9;
    window.speechSynthesis.speak(u);
  }
  function speak(word) {
    const x = get(word);
    if (x && x.audio && window.Audio) {
      try {
        const p = new Audio(x.audio).play();
        if (p && p.catch) p.catch(function () { tts(word); });
        return;
      } catch (e) {}
    }
    tts(word);
  }

  /* =====================================================================
     3. АВТОЗАПОЛНЕНИЕ
     ===================================================================== */
  function fetchJSON(url) {
    const ctl = window.AbortController ? new AbortController() : null;
    const tm = setTimeout(function () { if (ctl) ctl.abort(); }, 8000);
    return fetch(url, ctl ? { signal: ctl.signal } : undefined).then(function (r) {
      if (r.status === 404) return null;
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    }).then(
      function (j) { clearTimeout(tm); return j; },
      function (e) { clearTimeout(tm); throw e; }
    );
  }

  // Начальные формы: remained -> remain, studies -> study
  function candidates(word) {
    const w = norm(word).replace(/[^a-z'\- ]/g, '');
    if (!w) return [];
    const c = [w];
    if (w.indexOf(' ') < 0) {
      if (/ies$/.test(w)) c.push(w.slice(0, -3) + 'y');
      if (/ied$/.test(w)) c.push(w.slice(0, -3) + 'y');
      if (/(ches|shes|sses|xes|zes)$/.test(w)) c.push(w.slice(0, -2));
      if (/[^s]s$/.test(w)) c.push(w.slice(0, -1));
      if (/ing$/.test(w) && w.length > 5) {
        if (/([b-df-hj-np-tv-z])\1ing$/.test(w)) c.push(w.slice(0, -4));
        c.push(w.slice(0, -3), w.slice(0, -3) + 'e');
      }
      if (/ed$/.test(w) && w.length > 4) {
        if (/([b-df-hj-np-tv-z])\1ed$/.test(w)) c.push(w.slice(0, -3));
        c.push(w.slice(0, -2), w.slice(0, -1));
      }
      if (/ly$/.test(w) && w.length > 4) c.push(w.slice(0, -2));
    }
    return c.filter(function (x, i) { return x.length > 1 && c.indexOf(x) === i; });
  }

  function parseDict(data) {
    if (!Array.isArray(data) || !data.length) return null;
    const senses = [];
    let audio = '';
    data.forEach(function (entry) {
      (entry.phonetics || []).forEach(function (p) {
        if (!audio && p.audio) audio = p.audio.indexOf('//') === 0 ? 'https:' + p.audio : p.audio;
      });
      (entry.meanings || []).forEach(function (m) {
        (m.definitions || []).slice(0, 3).forEach(function (df) {
          if (df.definition) senses.push({ pos: m.partOfSpeech || '', d: df.definition, ex: df.example || '' });
        });
      });
    });
    return senses.length ? { word: String(data[0].word || ''), audio: audio, senses: senses.slice(0, 10) } : null;
  }

  // -> Promise<{ ok, data?, offline? }>  (никогда не отклоняется)
  function lookup(word) {
    const c = candidates(word);
    let failed = false;
    function next(i) {
      if (i >= c.length) return Promise.resolve({ ok: false, offline: failed });
      return fetchJSON(DICT_URL + encodeURIComponent(c[i])).then(function (j) {
        const d = j && parseDict(j);
        if (!d) return next(i + 1);
        d.word = d.word || c[i];
        return { ok: true, data: d };
      }).catch(function () { failed = true; return next(i + 1); });
    }
    return next(0);
  }

  // -> Promise<string[]>  варианты перевода на русский
  function translate(word) {
    return fetchJSON(TR_URL + encodeURIComponent(norm(word))).then(function (j) {
      const out = [], seen = {};
      function push(t) {
        const s = String(t || '').trim().replace(/[.;,]+$/, '');
        const k = s.toLowerCase();
        if (!s || !hasCyr(s) || s.length > 60 || seen[k]) return;
        seen[k] = 1;
        out.push(s);
      }
      if (j && +j.responseStatus === 200 && j.responseData) push(j.responseData.translatedText);
      ((j && j.matches) || []).forEach(function (m) {
        if (norm(m.segment) === norm(word)) push(m.translation);
      });
      return out.slice(0, 4);
    }).catch(function () { return []; });
  }

  /* =====================================================================
     4. ОКНО ДОБАВЛЕНИЯ / РЕДАКТИРОВАНИЯ
     opts: { word, src, qid, onSaved }
     ===================================================================== */
  let closeEditor = null;

  function openEditor(opts) {
    opts = opts || {};
    ensureStyle();
    if (closeEditor) closeEditor();

    const existing = opts.word ? get(opts.word) : null;
    const startWord = existing ? existing.w : norm(opts.word);
    const prevFocus = document.activeElement;
    const touched = {};
    let seq = 0, closed = false, audio = existing ? (existing.audio || '') : '', senses = [], lastLooked = '';

    const wrap = document.createElement('div');
    wrap.className = 'vc-fade fixed inset-0 z-[90] flex items-end md:items-center justify-center bg-black/60 md:p-6';

    function label(forId, text) {
      return '<label for="' + forId + '" class="block mb-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-mute">' + text + '</label>';
    }

    wrap.innerHTML =
      '<div class="vc-up w-full md:max-w-[540px] max-h-[92vh] flex flex-col rounded-t-2xl md:rounded-2xl border bg-surface text-ink shadow-2xl" role="dialog" aria-modal="true" aria-label="Vocabulary card" tabindex="-1">' +
        '<div class="shrink-0 flex items-center justify-between gap-3 h-14 px-5 border-b">' +
          '<h2 class="text-[15px] font-semibold">' + (existing ? 'Edit word' : 'Add to Vocabulary') + '</h2>' +
          '<button type="button" data-ed="close" class="grid place-items-center w-11 h-11 -mr-2 rounded-lg text-ink-soft hover:text-ink hover:bg-raised" aria-label="Close">' + ic('x', 18) + '</button>' +
        '</div>' +
        '<div class="flex-1 overflow-y-auto p-5 space-y-4">' +
          (existing && opts.src ? '<p class="rounded-lg bg-accent/10 px-3 py-2 text-[12.5px] text-accent">This word is already in your vocabulary. You can update its card.</p>' : '') +
          '<div>' + label('vcW', 'Word') +
            '<div class="flex gap-2">' +
              '<input id="vcW" data-f="w" class="vc-field" maxlength="60" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="e.g. evergreen"' + (existing ? ' readonly' : '') + '>' +
              '<button type="button" data-ed="speak" class="grid place-items-center w-11 shrink-0 rounded-lg border text-ink-soft hover:text-ink hover:bg-raised" aria-label="Play pronunciation">' + ic('speaker') + '</button>' +
              '<button type="button" data-ed="lookup" class="shrink-0 h-11 px-3.5 rounded-lg border text-[13px] font-medium hover:bg-raised">Look up</button>' +
            '</div>' +
            '<p data-ed-status role="status" aria-live="polite" class="mt-1.5 min-h-[18px] text-[12px] text-ink-soft"></p>' +
          '</div>' +
          '<div data-ed-senses hidden>' + label('vcSense', 'Choose the meaning') + '<select id="vcSense" class="vc-field"></select></div>' +
          '<div class="grid gap-4 sm:grid-cols-2">' +
            '<div>' + label('vcPos', 'Part of speech') +
              '<input id="vcPos" data-f="pos" class="vc-field" list="vcPosList" maxlength="30" autocomplete="off">' +
              '<datalist id="vcPosList">' + POS.map(function (p) { return '<option value="' + p + '">'; }).join('') + '</datalist>' +
            '</div>' +
            '<div>' + label('vcTr', 'Translation (Russian)') + '<input id="vcTr" data-f="tr" class="vc-field" maxlength="120" lang="ru" autocomplete="off"></div>' +
          '</div>' +
          '<div data-ed-sugg class="flex flex-wrap gap-1.5 !mt-2" hidden></div>' +
          '<div>' + label('vcD', 'Definition (English)') + '<textarea id="vcD" data-f="d" class="vc-field resize-y" rows="3" maxlength="600"></textarea></div>' +
          '<div>' + label('vcEx', 'Example in context') + '<textarea id="vcEx" data-f="ctx" class="vc-field resize-y" rows="3" maxlength="600"></textarea></div>' +
          (opts.src ? '<div class="rounded-xl border bg-canvas p-3"><div class="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-mute">From your question</div>' +
            '<p class="mt-1 text-[13px] leading-relaxed text-ink-soft">' + esc(opts.src) + '</p>' +
            '<button type="button" data-ed="usesrc" class="mt-1 h-9 text-[12.5px] font-medium text-accent hover:text-accent-hover">Use as example</button></div>' : '') +
        '</div>' +
        '<div class="shrink-0 flex gap-2.5 border-t p-4" style="padding-bottom:calc(16px + env(safe-area-inset-bottom,0px))">' +
          '<button type="button" data-ed="close" class="flex-1 h-11 rounded-lg border text-[13.5px] font-medium hover:bg-raised">Cancel</button>' +
          '<button type="button" data-ed="save" class="flex-1 h-11 rounded-lg bg-accent hover:bg-accent-hover text-white text-[13.5px] font-semibold">' + (existing ? 'Save changes' : 'Save word') + '</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(wrap);

    const q = function (s) { return wrap.querySelector(s); };
    const F = { w: q('#vcW'), pos: q('#vcPos'), tr: q('#vcTr'), d: q('#vcD'), ctx: q('#vcEx') };
    const elStatus = q('[data-ed-status]'), elSenses = q('[data-ed-senses]'), elSelect = q('#vcSense'), elSugg = q('[data-ed-sugg]');

    F.w.value = startWord;
    if (existing) ['pos', 'tr', 'd', 'ctx'].forEach(function (k) { F[k].value = existing[k]; if (existing[k]) touched[k] = true; });

    // автозаполнение не затирает то, что пользователь ввёл сам
    function fill(k, v) { if (!touched[k]) F[k].value = v || ''; }

    function applySense(i) {
      const s = senses[i];
      if (!s) return;
      fill('pos', s.pos);
      fill('d', s.d);
      fill('ctx', s.ex || (opts.src && !/_{3,}/.test(opts.src) ? opts.src : ''));
    }

    function runLookup() {
      const word = norm(F.w.value);
      if (!word) { elStatus.textContent = 'Type a word first.'; return; }
      const my = ++seq;
      if (lastLooked && lastLooked !== word) {
        ['pos', 'tr', 'd', 'ctx'].forEach(function (k) { delete touched[k]; F[k].value = ''; });
        audio = '';
      }
      lastLooked = word;
      senses = [];
      elSenses.hidden = true;
      elSugg.hidden = true;
      elStatus.textContent = 'Looking up…';

      let baseWord = word;
      lookup(word).then(function (res) {
        if (closed || my !== seq) return null;
        if (res.ok) {
          baseWord = norm(res.data.word);
          audio = res.data.audio;
          if (!existing && baseWord !== word) { F.w.value = baseWord; lastLooked = baseWord; }
          senses = res.data.senses;
          elSelect.innerHTML = senses.map(function (s, i) {
            const t = (s.pos ? s.pos + ' — ' : '') + s.d;
            return '<option value="' + i + '">' + esc(t.length > 90 ? t.slice(0, 87) + '…' : t) + '</option>';
          }).join('');
          elSenses.hidden = senses.length < 2;
          applySense(0);
          elStatus.textContent = 'Filled from the dictionary. Check that the meaning matches your context.';
        } else {
          if (opts.src && !/_{3,}/.test(opts.src)) fill('ctx', opts.src);
          elStatus.textContent = res.offline
            ? 'Could not reach the dictionary. Fill in the fields manually or try again.'
            : 'No dictionary entry found. Fill in the fields manually.';
        }
        return translate(baseWord).then(function (variants) {
          if (closed || my !== seq || !variants.length) return;
          fill('tr', variants[0]);
          if (variants.length > 1) {
            elSugg.innerHTML = variants.map(function (v) {
              return '<button type="button" data-sugg="' + esc(v) + '" class="h-9 rounded-full border px-3 text-[12.5px] text-ink-soft hover:text-ink hover:bg-raised">' + esc(v) + '</button>';
            }).join('');
            elSugg.hidden = false;
          }
        });
      });
    }

    function doSave() {
      const w = norm(F.w.value);
      if (!w) { elStatus.textContent = 'Type a word first.'; F.w.focus(); return; }
      const data = { pos: F.pos.value.trim().toLowerCase(), tr: F.tr.value.trim(), d: F.d.value.trim(), ctx: F.ctx.value.trim(), audio: audio };
      if (!data.d && !data.tr) { elStatus.textContent = 'Add a definition or a translation before saving.'; F.d.focus(); return; }
      if (existing) {
        update(existing.w, data);
        Shell.toast('Card updated');
      } else {
        data.w = w;
        data.src = opts.src || '';
        data.qid = opts.qid || '';
        if (!add(data)) { elStatus.textContent = 'This word is already in your vocabulary.'; return; }
        Shell.toast('“' + w + '” added to Vocabulary');
      }
      close();
      if (opts.onSaved) opts.onSaved(w);
    }

    // Пока окно открыто, горячие клавиши Solver и экрана не срабатывают
    function onKey(e) {
      e.stopPropagation();
      if (e.key === 'Escape') { e.preventDefault(); close(); return; }
      if (e.key === 'Enter' && e.target && e.target.tagName === 'INPUT') {
        e.preventDefault();
        if (e.target === F.w && !existing && norm(F.w.value) !== lastLooked) runLookup(); else doSave();
      }
    }
    window.addEventListener('keydown', onKey, true);

    function close() {
      if (closed) return;
      closed = true;
      window.removeEventListener('keydown', onKey, true);
      wrap.remove();
      closeEditor = null;
      if (prevFocus && prevFocus.focus && document.contains(prevFocus)) { try { prevFocus.focus({ preventScroll: true }); } catch (e) {} }
    }
    closeEditor = close;

    wrap.addEventListener('input', function (e) {
      const k = e.target.getAttribute && e.target.getAttribute('data-f');
      if (k && k !== 'w') { if (e.target.value) touched[k] = true; else delete touched[k]; }
    });
    elSelect.addEventListener('change', function () {
      ['pos', 'd', 'ctx'].forEach(function (k) { delete touched[k]; });
      applySense(+elSelect.value);
    });
    wrap.addEventListener('click', function (e) {
      if (e.target === wrap) { close(); return; }
      const s = e.target.closest('[data-sugg]');
      if (s) { F.tr.value = s.getAttribute('data-sugg'); touched.tr = true; return; }
      const b = e.target.closest('[data-ed]');
      if (!b) return;
      const act = b.getAttribute('data-ed');
      if (act === 'close') close();
      else if (act === 'save') doSave();
      else if (act === 'lookup') {
        if (existing) elSelect.value = '0';
        runLookup();
      }
      else if (act === 'speak') { if (norm(F.w.value)) speak(norm(F.w.value)); }
      else if (act === 'usesrc') { F.ctx.value = opts.src; touched.ctx = true; }
    });

    if (!existing && startWord) runLookup();
    const focusEl = (!existing && !startWord) ? F.w : q('[role="dialog"]');
    try { focusEl.focus({ preventScroll: true }); } catch (e) {}
  }

  /* =====================================================================
     5. «+ VOCAB» В SOLVER
     Выделите слово, кликните по нему в тексте или сделайте двойной клик
     по варианту ответа — рядом с инструментами появится «+ Vocab».
     Работает и при включённом маркере: слово запоминается до того,
     как Highlighter снимает выделение.
     ===================================================================== */
  const TEXT_SEL = '.sv-prompt, .sv-txt';
  const WORD_RE = /^[A-Za-z][A-Za-z'’\-]*( [A-Za-z][A-Za-z'’\-]*){0,2}$/;

  function cleanWord(s) {
    const t = String(s || '').replace(/\s+/g, ' ').replace(/^[^A-Za-z]+|[^A-Za-z]+$/g, '');
    return t.length >= 2 && t.length <= 40 && WORD_RE.test(t) ? t : '';
  }
  function hostOf(node) {
    const el = node && (node.nodeType === 1 ? node : node.parentElement);
    if (!el || el.closest('.katex')) return null;
    return el.closest(TEXT_SEL);
  }
  function offsetIn(host, node, off) {
    const r = document.createRange();
    r.selectNodeContents(host);
    r.setEnd(node, off);
    return r.toString().length;
  }
  function sentenceAt(text, pos) {
    const re = /[.!?]["”')\]]*\s+/g;
    let start = 0, end = text.length, m;
    while ((m = re.exec(text))) {
      const cut = m.index + m[0].length;
      if (cut <= pos) start = cut;
      else { end = cut; break; }
    }
    const s = text.slice(start, end).replace(/\s+/g, ' ').trim();
    return s.length > 320 ? s.slice(0, 317) + '…' : s;
  }

  // Слово под курсором / пальцем
  function wordAtPoint(x, y) {
    let node = null, off = 0;
    if (document.caretPositionFromPoint) {
      const p = document.caretPositionFromPoint(x, y);
      if (p) { node = p.offsetNode; off = p.offset; }
    } else if (document.caretRangeFromPoint) {
      const r = document.caretRangeFromPoint(x, y);
      if (r) { node = r.startContainer; off = r.startOffset; }
    }
    if (!node || node.nodeType !== 3) return null;
    const t = node.nodeValue, ch = /[A-Za-z'’\-]/;
    let a = off, b = off;
    while (a > 0 && ch.test(t.charAt(a - 1))) a--;
    while (b < t.length && ch.test(t.charAt(b))) b++;
    if (a === b) return null;
    const range = document.createRange();
    range.setStart(node, a);
    range.setEnd(node, b);
    const box = range.getBoundingClientRect();        // клик по пустому месту рядом не считается
    if (x < box.left - 3 || x > box.right + 3 || y < box.top - 3 || y > box.bottom + 3) return null;
    return { node: node, start: a, text: t.slice(a, b) };
  }

  // opts: { root, getId }  ->  { clear, destroy }
  function attach(opts) {
    const root = opts.root;
    ensureStyle();
    let picked = null, btn = null, timer = null;
    const mobile = window.matchMedia ? matchMedia('(max-width: 767px)') : { matches: false };
    const curId = function () { return opts.getId ? opts.getId() : null; };

    function clear() {
      picked = null;
      if (btn) { btn.remove(); btn = null; }
    }

    function show() {
      if (btn) btn.remove();
      btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('data-vocab-add', '');
      const known = !!get(picked.word);
      const inner = ic(known ? 'check' : 'plus', 15) + '<span>' + (known ? 'In Vocab' : 'Vocab') + '</span>';
      btn.setAttribute('aria-label', (known ? 'Edit in vocabulary: ' : 'Add to vocabulary: ') + picked.word);
      btn.title = btn.getAttribute('aria-label');

      const anchor = root.querySelector('#svCalcBtn');
      if (!mobile.matches && anchor && anchor.parentNode) {
        // первым в правой группе — рядом с Highlights & Notes
        btn.className = 'vc-up inline-flex shrink-0 items-center justify-center gap-1.5 h-11 px-3 rounded-lg border border-accent bg-accent/15 text-accent text-[13px] font-semibold hover:bg-accent hover:text-white transition-colors';
        btn.innerHTML = inner;
        anchor.parentNode.insertBefore(btn, anchor.parentNode.firstChild);
      } else {
        btn.className = 'vc-fade fixed left-1/2 -translate-x-1/2 top-[64px] z-[57] inline-flex max-w-[calc(100vw-24px)] items-center gap-2 h-11 px-4 rounded-full bg-accent text-white text-[13.5px] font-semibold shadow-2xl';
        btn.innerHTML = inner + '<span class="truncate font-normal opacity-80">' + esc(picked.word) + '</span>';
        (root.querySelector('#svRoot') || document.body).appendChild(btn);
      }

      btn.addEventListener('pointerdown', function (e) { e.preventDefault(); });
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        const p = picked;
        if (!p) return;
        clear();
        const s = window.getSelection && window.getSelection();
        if (s) s.removeAllRanges();
        openEditor({ word: p.word, src: p.src, qid: p.qid });
      });
    }

    function pick(host, node, off, raw) {
      const word = cleanWord(raw);
      if (!word || !root.contains(host)) return;
      let src = '';
      // у вариантов ответа нет предложения-контекста
      if (host.classList.contains('sv-prompt')) {
        try { src = sentenceAt(host.textContent, offsetIn(host, node, off)); } catch (e) {}
      }
      if (picked && picked.word === word && picked.src === src && btn) return;
      picked = { word: word, src: src, qid: curId() };
      show();
    }

    function fromSelection() {
      const sel = window.getSelection && window.getSelection();
      if (!sel || !sel.rangeCount || sel.isCollapsed) return;
      const rg = sel.getRangeAt(0);
      const host = hostOf(rg.startContainer);
      if (host) pick(host, rg.startContainer, rg.startOffset, sel.toString());
    }

    function onDown(e) {
      if (btn && !btn.contains(e.target)) clear();
    }
    function onUp() { fromSelection(); }                  // синхронно: раньше Highlighter
    function onSelChange() {
      clearTimeout(timer);
      timer = setTimeout(fromSelection, 180);             // тач-выделение (Highlighter ждёт 500 мс)
    }
    function onPoint(e) {
      const t = e.target;
      if (!t || !t.closest || t.closest('mark.sp-hl, a, summary, input, textarea')) return;
      const inChoice = !!t.closest('.sv-txt');
      if (inChoice && e.type !== 'dblclick') return;      // одиночный клик по варианту = выбор ответа
      const sel = window.getSelection && window.getSelection();
      if (sel && !sel.isCollapsed) { fromSelection(); return; }
      const hit = wordAtPoint(e.clientX, e.clientY);
      if (!hit) return;
      const host = hostOf(hit.node);
      if (host) pick(host, hit.node, hit.start, hit.text);
    }
    function onEsc(e) { if (e.key === 'Escape') clear(); }

    document.addEventListener('pointerdown', onDown, true);
    document.addEventListener('pointerup', onUp);
    document.addEventListener('selectionchange', onSelChange);
    document.addEventListener('keydown', onEsc);
    root.addEventListener('click', onPoint);
    root.addEventListener('dblclick', onPoint);

    // При смене вопроса прячем кнопку (Solver заменяет содержимое #svMain)
    let observer = null;
    const main = root.querySelector('#svMain');
    if (main && window.MutationObserver) {
      observer = new MutationObserver(function () {
        if (picked && picked.qid !== curId()) clear();
      });
      observer.observe(main, { childList: true });
    }

    return {
      clear: clear,
      destroy: function () {
        clearTimeout(timer);
        clear();
        if (closeEditor) closeEditor();
        if (observer) observer.disconnect();
        document.removeEventListener('pointerdown', onDown, true);
        document.removeEventListener('pointerup', onUp);
        document.removeEventListener('selectionchange', onSelChange);
        document.removeEventListener('keydown', onEsc);
        root.removeEventListener('click', onPoint);
        root.removeEventListener('dblclick', onPoint);
      }
    };
  }

  /* =====================================================================
     6. ПОСТРОЕНИЕ КВИЗА
     ===================================================================== */
  // Ищет слово (с простыми окончаниями) в примере и заменяет пропуском
  function makeGap(x) {
    const w = norm(x.w);
    if (!x.ctx || !w) return null;
    const safe = function (s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); };
    let pattern = safe(w) + '(?:s|es|d|ed|ing|ly)?';
    if (/e$/.test(w)) pattern += '|' + safe(w.slice(0, -1)) + '(?:ing|ed)';
    if (/y$/.test(w)) pattern += '|' + safe(w.slice(0, -1)) + '(?:ies|ied)';
    const re = new RegExp('\\b(?:' + pattern + ')\\b', 'gi');
    if (!re.test(x.ctx)) return null;
    re.lastIndex = 0;
    return x.ctx.replace(re, '______');
  }

  function buildQuiz(words, mode) {
    const bankPool = BANK.map(function (b) { return { w: b.w, pos: b.pos, d: b.d }; });
    const due = shuffle(dueList(words));
    const rest = shuffle(words.filter(function (x) { return x.due > Date.now(); }));
    const out = [];

    due.concat(rest).forEach(function (x) {
      if (out.length >= 10) return;
      const gap = makeGap(x);
      let type = null;
      if (mode === 'context') type = gap ? 'gap' : (x.d ? 'def' : null);
      else type = x.d ? 'def' : (gap ? 'gap' : null);
      if (!type) return;

      const field = type === 'gap' ? 'w' : 'd';
      const right = x[field];
      const seen = {};
      seen[norm(right)] = 1;
      const wrong = [];
      // сначала дистракторы той же части речи, из своих слов, потом из SAT-банка
      const own = shuffle(words), extra = shuffle(bankPool);
      const same = function (y) { return y.pos === x.pos; };
      own.filter(same).concat(extra.filter(same), own, extra).forEach(function (y) {
        if (wrong.length >= 3 || norm(y.w) === norm(x.w) || !y[field] || seen[norm(y[field])]) return;
        seen[norm(y[field])] = 1;
        wrong.push(y[field]);
      });
      out.push({ word: x.w, type: type, gap: gap, answer: right, choices: shuffle(wrong.concat(right)) });
    });
    return out;
  }

  /* =====================================================================
     7. ЭКРАН VOCABULARY
     ===================================================================== */
  function wordOfDay() {
    const n = new Date();
    const dayNo = Math.floor(Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()) / DAY);
    return BANK[dayNo % BANK.length];
  }

  function addStarter() {
    let n = 0;
    BANK.slice(0, 5).reverse().forEach(function (b) {
      if (add({ w: b.w, pos: b.pos, tr: b.tr, d: b.d, ctx: b.ex })) n++;
    });
    Shell.toast(n ? n + ' starter words added' : 'These words are already in your list');
  }

  const BTN_ICON = 'grid place-items-center w-11 h-11 md:w-9 md:h-9 shrink-0 rounded-lg text-ink-soft hover:text-ink hover:bg-raised transition-colors';
  const BTN_LINE = 'inline-flex items-center justify-center gap-2 h-11 px-4 rounded-lg border text-[13px] font-medium hover:bg-raised transition-colors';
  const BTN_BLUE = 'inline-flex items-center justify-center gap-2 h-11 px-5 rounded-lg bg-accent hover:bg-accent-hover text-white text-[13.5px] font-semibold transition-colors';
  const EYEBROW = 'text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-mute';

  function render(root) {
    ensureStyle();
    const V = { view: 'home', search: '', filter: 'all', confirm: null, cards: null, quiz: null };
    let alive = true;

    /* ---------- главная ---------- */
    function emptyHTML() {
      const wod = wordOfDay();
      return '<div class="vc-up mx-auto max-w-[520px] px-4 py-16 md:py-24 text-center">' +
        '<div class="mx-auto grid w-14 h-14 place-items-center rounded-2xl border bg-surface text-accent">' + ic('book', 26) + '</div>' +
        '<h1 class="mt-5 text-[24px] font-semibold tracking-tight">Build your SAT vocabulary</h1>' +
        '<p class="mt-2 text-[14px] leading-relaxed text-ink-soft">Save unfamiliar words while you solve questions, then review them with flashcards and context practice.</p>' +
        '<div class="mt-7 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5">' +
          '<button type="button" data-v="starter" class="btn-pill">' + ic('spark') + 'Add 5 starter SAT words</button>' +
          '<button type="button" data-v="new" class="' + BTN_LINE + ' rounded-full">' + ic('plus') + 'Add your own word</button>' +
        '</div>' +
        '<div class="card mt-10 p-5 text-left"><div class="' + EYEBROW + '">Word of the Day</div>' +
          '<div class="mt-2 text-[18px] font-semibold">' + esc(wod.w) + ' <span class="text-[12.5px] font-normal italic text-ink-soft">' + esc(wod.pos) + '</span></div>' +
          '<p class="mt-1.5 text-[13.5px] leading-relaxed text-ink-soft">' + esc(wod.d) + '</p>' +
        '</div></div>';
    }

    function modeCard(act, icon, title, text, meta) {
      return '<section class="card p-5 md:p-6 flex flex-col">' +
        '<span class="grid w-10 h-10 place-items-center rounded-xl bg-accent/10 text-accent">' + ic(icon, 20) + '</span>' +
        '<h2 class="mt-4 text-[17px] font-semibold">' + title + '</h2>' +
        '<p class="mt-1.5 flex-1 text-[13.5px] leading-relaxed text-ink-soft">' + text + '</p>' +
        '<div class="mt-5 flex flex-wrap items-center justify-between gap-3">' +
          '<span class="num text-[12px] text-ink-mute">' + meta + '</span>' +
          '<button type="button" data-v="' + act + '" class="' + BTN_BLUE + '">Start ' + ic('arrow') + '</button>' +
        '</div></section>';
    }

    function homeHTML(words) {
      const due = dueList(words).length;
      const count = { new: 0, learning: 0, mastered: 0 };
      words.forEach(function (x) { count[x.status]++; });
      const pct = Math.round(count.mastered / words.length * 100);
      const wod = wordOfDay();
      const wodSaved = !!get(wod.w);

      return '<div class="vc-up mx-auto w-full max-w-[1100px] px-4 md:px-8 py-6 md:py-10 space-y-4">' +
        '<div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-2">' +
          '<div><h1 class="text-[26px] md:text-[30px] font-semibold tracking-tight">Vocabulary</h1>' +
          '<p class="mt-1.5 text-[14px] text-ink-soft">' + (due ? due + (due === 1 ? ' word is' : ' words are') + ' ready for review today.' : 'You are all caught up. Extra practice is always welcome.') + '</p></div>' +
          '<button type="button" data-v="new" class="btn-pill self-start sm:self-auto">' + ic('plus') + 'Add word</button>' +
        '</div>' +

        '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">' +
          modeCard('cards', 'cards', 'Flashcards', 'Flip each card, recall the meaning, and rate yourself. Words you miss come back sooner.', due ? due + ' due' : words.length + ' cards') +
          modeCard('quiz', 'target', 'Context Practice', 'Fill in the blank in real sentences, just like Words in Context questions.', Math.min(10, words.length) + ' questions max') +
        '</div>' +

        '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">' +
          '<section class="card p-5">' +
            '<div class="flex items-center justify-between gap-2"><h2 class="text-[15px] font-semibold">Memory progress</h2><span class="num text-[13px] text-ink-soft">' + pct + '% mastered</span></div>' +
            '<div class="mt-4 flex h-2 overflow-hidden rounded-full bg-raised" role="img" aria-label="' + count.mastered + ' mastered, ' + count.learning + ' learning, ' + count.new + ' new">' +
              ['mastered', 'learning', 'new'].map(function (s) {
                return '<span class="' + STATUS[s].bar + '" style="width:' + (count[s] / words.length * 100) + '%;transition:width .4s ease"></span>';
              }).join('') +
            '</div>' +
            '<div class="mt-4 grid grid-cols-3 gap-2">' +
              ['new', 'learning', 'mastered'].map(function (s) {
                return '<button type="button" data-v="filter" data-k="' + s + '" class="rounded-xl bg-raised p-3 text-left hover:ring-1 hover:ring-accent/40">' +
                  '<span class="num block text-[20px] font-semibold">' + count[s] + '</span>' +
                  '<span class="mt-0.5 flex items-center gap-1.5 text-[11.5px] text-ink-soft"><span class="w-2 h-2 rounded-full ' + STATUS[s].bar + '"></span>' + STATUS[s].label + '</span></button>';
              }).join('') +
            '</div>' +
          '</section>' +

          '<section class="card p-5 flex flex-col">' +
            '<div class="flex items-center justify-between gap-2"><span class="' + EYEBROW + '">Word of the Day</span>' +
              '<button type="button" data-v="speak" data-w="' + esc(wod.w) + '" class="' + BTN_ICON + '" aria-label="Play pronunciation">' + ic('speaker') + '</button></div>' +
            '<div class="text-[22px] font-semibold tracking-tight">' + esc(wod.w) + ' <span class="text-[12.5px] font-normal italic text-ink-soft">' + esc(wod.pos) + '</span></div>' +
            '<div class="mt-0.5 text-[13.5px] text-accent" lang="ru">' + esc(wod.tr) + '</div>' +
            '<p class="mt-2 flex-1 text-[13.5px] leading-relaxed text-ink-soft">' + esc(wod.d) + '</p>' +
            '<button type="button" data-v="wod" ' + (wodSaved ? 'disabled ' : '') + 'class="mt-4 self-start ' + BTN_LINE + ' disabled:opacity-60">' +
              ic(wodSaved ? 'check' : 'plus') + (wodSaved ? 'In your words' : 'Add to My Words') + '</button>' +
          '</section>' +
        '</div>' +

        '<section class="card p-4 md:p-5">' +
          '<div class="flex flex-col lg:flex-row lg:items-center gap-3">' +
            '<h2 class="text-[15px] font-semibold lg:flex-1">My Words <span class="num text-ink-mute font-medium">' + words.length + '</span></h2>' +
            '<div class="relative lg:w-[260px]">' +
              '<span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-mute">' + ic('search', 15) + '</span>' +
              '<input id="vcSearch" type="search" class="vc-field" style="padding-left:36px;height:44px" placeholder="Search words" aria-label="Search words" value="' + esc(V.search) + '">' +
            '</div>' +
            '<div id="vcFilters" class="flex gap-1.5 overflow-x-auto" role="group" aria-label="Filter by status"></div>' +
          '</div>' +
          '<div id="vcList" class="mt-4"></div>' +
        '</section>' +
      '</div>';
    }

    function paintList() {
      const words = list();
      const box = root.querySelector('#vcList'), chips = root.querySelector('#vcFilters');
      if (!box || !chips) return;

      chips.innerHTML = ['all', 'new', 'learning', 'mastered'].map(function (k) {
        const n = k === 'all' ? words.length : words.filter(function (x) { return x.status === k; }).length;
        const on = V.filter === k;
        return '<button type="button" data-v="filter" data-k="' + k + '" aria-pressed="' + on + '" class="shrink-0 inline-flex items-center gap-1.5 h-11 md:h-9 px-3.5 rounded-full border text-[12.5px] font-medium transition-colors ' +
          (on ? 'border-accent bg-accent/15 text-accent' : 'text-ink-soft hover:text-ink hover:bg-raised') + '">' +
          (k === 'all' ? 'All' : STATUS[k].label) + '<span class="num text-[11px] opacity-70">' + n + '</span></button>';
      }).join('');

      const term = norm(V.search);
      const shown = words.filter(function (x) {
        if (V.filter !== 'all' && x.status !== V.filter) return false;
        return !term || (x.w + ' ' + x.tr + ' ' + x.d).toLowerCase().indexOf(term) >= 0;
      });

      if (!shown.length) {
        box.innerHTML = '<div class="rounded-xl border border-dashed px-6 py-10 text-center"><p class="text-[14px] font-semibold">No matching words</p>' +
          '<p class="mt-1 text-[12.5px] text-ink-soft">Try a different search or status filter.</p></div>';
        return;
      }

      box.innerHTML = '<div class="grid grid-cols-1 md:grid-cols-2 gap-3">' + shown.map(function (x) {
        const w = esc(x.w);
        const confirming = V.confirm === x.w;
        return '<article class="flex flex-col rounded-xl border bg-canvas/40 p-4 hover:border-accent/40 transition-colors">' +
          '<div class="flex items-start gap-1">' +
            '<div class="min-w-0 flex-1">' +
              '<h3 class="text-[16.5px] font-semibold break-words">' + w + '</h3>' +
              '<div class="mt-0.5 text-[12.5px]">' + (x.pos ? '<span class="italic text-ink-soft">' + esc(x.pos) + '</span>' : '') +
                (x.pos && x.tr ? '<span class="text-ink-mute"> · </span>' : '') + (x.tr ? '<span class="text-accent" lang="ru">' + esc(x.tr) + '</span>' : '') + '</div>' +
            '</div>' +
            '<button type="button" data-v="speak" data-w="' + w + '" class="' + BTN_ICON + '" aria-label="Play pronunciation of ' + w + '">' + ic('speaker') + '</button>' +
            '<button type="button" data-v="edit" data-w="' + w + '" class="' + BTN_ICON + '" aria-label="Edit ' + w + '">' + ic('pencil', 15) + '</button>' +
            '<button type="button" data-v="del" data-w="' + w + '" class="' + BTN_ICON + ' hover:!text-danger" aria-label="Delete ' + w + '">' + ic('trash', 15) + '</button>' +
          '</div>' +
          (x.d ? '<p class="mt-2.5 text-[13.5px] leading-relaxed">' + esc(x.d) + '</p>' : '') +
          (x.ctx ? '<p class="mt-2 border-l-2 pl-3 text-[12.5px] italic leading-relaxed text-ink-soft">' + esc(x.ctx) + '</p>' : '') +
          '<div class="flex-1"></div>' +
          (confirming
            ? '<div class="vc-fade mt-3 flex items-center gap-2 rounded-lg bg-danger/10 p-2"><span class="flex-1 pl-1 text-[12.5px] text-danger">Delete this word?</span>' +
              '<button type="button" data-v="delno" class="h-9 px-3 rounded-lg text-[12.5px] font-medium text-ink-soft hover:text-ink">Keep</button>' +
              '<button type="button" data-v="delyes" data-w="' + w + '" class="h-9 px-3 rounded-lg bg-danger text-white text-[12.5px] font-semibold">Delete</button></div>'
            : '<label class="mt-3 self-start inline-flex items-center rounded-full ' + STATUS[x.status].chip + '"><span class="sr-only">Status of ' + w + '</span>' +
              '<select data-status="' + w + '" class="h-8 cursor-pointer rounded-full bg-transparent px-2.5 text-[11.5px] font-semibold outline-none focus-visible:ring-2 focus-visible:ring-accent">' +
                Object.keys(STATUS).map(function (s) { return '<option value="' + s + '" class="bg-surface text-ink"' + (s === x.status ? ' selected' : '') + '>' + STATUS[s].label + '</option>'; }).join('') +
              '</select></label>') +
        '</article>';
      }).join('') + '</div>';
    }

    /* ---------- общая шапка режимов ---------- */
    function studyShell(title, done, total, body) {
      const pct = total ? Math.round(done / total * 100) : 0;
      return '<div class="mx-auto w-full max-w-[640px] px-4 py-5 md:py-8">' +
        '<div class="flex items-center justify-between gap-3">' +
          '<button type="button" data-v="home" class="' + BTN_LINE + ' border-transparent text-ink-soft px-2">' + ic('back') + 'Vocabulary</button>' +
          '<span class="text-[13px] font-semibold">' + title + '</span>' +
          '<span class="num min-w-[64px] text-right text-[13px] text-ink-soft">' + Math.min(done + 1, total) + ' / ' + total + '</span>' +
        '</div>' +
        '<div class="mt-3 h-1.5 overflow-hidden rounded-full bg-raised" role="progressbar" aria-valuemin="0" aria-valuemax="' + total + '" aria-valuenow="' + done + '">' +
          '<div class="h-full rounded-full bg-accent" style="width:' + pct + '%;transition:width .35s ease"></div></div>' +
        '<div class="mt-6">' + body + '</div></div>';
    }

    function summaryHTML(title, good, total, missed) {
      return '<div class="vc-up mx-auto max-w-[460px] px-4 py-16 text-center">' +
        '<div class="mx-auto grid w-14 h-14 place-items-center rounded-2xl bg-success/10 text-success">' + ic('check', 26) + '</div>' +
        '<h1 class="mt-5 text-[22px] font-semibold tracking-tight">' + title + '</h1>' +
        '<p class="mt-2 text-[14px] text-ink-soft"><span class="num font-semibold text-ink">' + good + ' / ' + total + '</span> recalled correctly</p>' +
        (missed.length ? '<div class="card mt-6 p-4 text-left"><div class="' + EYEBROW + '">Review again</div><div class="mt-2.5 flex flex-wrap gap-1.5">' +
          missed.map(function (w) { return '<span class="rounded-full bg-danger/10 px-3 py-1 text-[12.5px] font-medium text-danger">' + esc(w) + '</span>'; }).join('') + '</div></div>' : '') +
        '<div class="mt-7 flex justify-center gap-2.5">' +
          '<button type="button" data-v="home" class="' + BTN_LINE + '">Back to words</button>' +
          '<button type="button" data-v="again" class="' + BTN_BLUE + '">' + ic('rotate') + 'Practice again</button>' +
        '</div></div>';
    }

    /* ---------- Flashcards ---------- */
    function startCards() {
      const words = list();
      if (!words.length) return;
      const due = dueList(words);
      const queue = shuffle(due.length ? due : words).slice(0, 20).map(function (x) { return x.w; });
      V.view = 'cards';
      V.cards = { queue: queue, i: 0, flipped: false, total: queue.length, good: 0, missed: [] };
      paint();
    }

    function cardsHTML() {
      const C = V.cards;
      if (C.i >= C.queue.length) return summaryHTML('Session complete', C.good, C.total, C.missed);
      const x = get(C.queue[C.i]);
      if (!x) { C.i++; return cardsHTML(); }
      const w = esc(x.w);
      return studyShell('Flashcards', C.i, C.queue.length,
        '<div class="vc-flip vc-up">' +
          '<div class="vc-inner" data-on="' + (C.flipped ? 1 : 0) + '">' +
            '<button type="button" data-v="flip" data-face="front" class="vc-face card flex flex-col items-center justify-center p-6 text-center"' + (C.flipped ? ' tabindex="-1" aria-hidden="true"' : '') + '>' +
              '<span class="text-[32px] md:text-[40px] font-semibold tracking-tight break-words">' + w + '</span>' +
              '<span class="mt-2 text-[13px] italic text-ink-soft">' + esc(x.pos) + '</span>' +
              '<span class="mt-8 text-[12px] text-ink-mute">Tap or press Space to flip</span>' +
            '</button>' +
            '<button type="button" data-v="flip" data-face="back" class="vc-face vc-back card flex flex-col justify-center p-6 text-left"' + (C.flipped ? '' : ' tabindex="-1" aria-hidden="true"') + '>' +
              '<span class="text-[18px] font-semibold">' + w + '</span>' +
              (x.tr ? '<span class="mt-1 text-[15px] text-accent" lang="ru">' + esc(x.tr) + '</span>' : '') +
              '<span class="mt-4 text-[15px] leading-relaxed">' + esc(x.d || 'No definition yet.') + '</span>' +
              (x.ctx ? '<span class="mt-4 border-l-2 pl-3 text-[13.5px] italic leading-relaxed text-ink-soft">' + esc(x.ctx) + '</span>' : '') +
            '</button>' +
          '</div>' +
        '</div>' +
        '<div class="mt-4 flex justify-center"><button type="button" data-v="speak" data-w="' + w + '" class="' + BTN_LINE + ' text-ink-soft">' + ic('speaker') + 'Listen</button></div>' +
        (C.flipped
          ? '<div class="vc-up mt-4 grid grid-cols-2 gap-3">' +
              '<button type="button" data-v="rate" data-ok="0" class="h-12 rounded-xl border border-danger/40 bg-danger/10 text-danger text-[14px] font-semibold">Again <span class="num opacity-60">1</span></button>' +
              '<button type="button" data-v="rate" data-ok="1" class="h-12 rounded-xl border border-success/40 bg-success/10 text-success text-[14px] font-semibold">Got it <span class="num opacity-60">2</span></button>' +
            '</div>'
          : '<button type="button" data-v="flip" class="mt-4 w-full ' + BTN_BLUE + ' h-12">Show answer</button>'));
    }

    function flip() {
      const C = V.cards;
      if (!C || C.i >= C.queue.length) return;
      C.flipped = !C.flipped;
      // меняем только атрибут, чтобы сработала анимация переворота
      const inner = root.querySelector('.vc-inner');
      if (inner) inner.setAttribute('data-on', C.flipped ? '1' : '0');
      setTimeout(function () { if (alive && V.view === 'cards') paint(true); }, 460);
    }
    function rate(ok) {
      const C = V.cards;
      if (!C || !C.flipped || C.i >= C.queue.length) return;
      const w = C.queue[C.i];
      const repeat = C.queue.indexOf(w) < C.i;      // это уже повторный показ
      if (!repeat) {
        grade(w, ok);
        if (ok) C.good++;
        else { C.missed.push(w); C.queue.push(w); }  // ещё раз в конце сессии
      }
      C.i++;
      C.flipped = false;
      paint();
    }

    /* ---------- Context Practice (Mini-Quiz) ---------- */
    function startQuiz(mode) {
      const items = buildQuiz(list(), mode);
      if (!items.length) { Shell.toast('Add a definition or an example to start practicing.'); return; }
      V.view = 'quiz';
      V.quiz = { mode: mode, items: items, i: 0, picked: null, good: 0, missed: [] };
      paint();
    }

    function quizHTML() {
      const Q = V.quiz;
      if (Q.i >= Q.items.length) return summaryHTML('Practice complete', Q.good, Q.items.length, Q.missed);
      const it = Q.items[Q.i];
      const done = Q.picked !== null;
      const ok = done && it.choices[Q.picked] === it.answer;

      const prompt = it.type === 'gap'
        ? '<div class="' + EYEBROW + '">Which word best completes the sentence?</div><p class="mt-3 text-[17px] leading-relaxed">' + esc(it.gap) + '</p>'
        : '<div class="' + EYEBROW + '">Choose the correct definition</div><p class="mt-3 text-[28px] font-semibold tracking-tight break-words">' + esc(it.word) + '</p>';

      const modes = '<div class="mb-4 flex rounded-lg bg-raised p-0.5" role="group" aria-label="Practice type">' +
        [['context', 'Fill in the blank'], ['definition', 'Definitions']].map(function (m) {
          const on = Q.mode === m[0];
          return '<button type="button" data-v="qmode" data-k="' + m[0] + '" aria-pressed="' + on + '" class="flex-1 h-11 md:h-9 rounded-md text-[12.5px] font-medium ' + (on ? 'bg-surface text-ink shadow-sm' : 'text-ink-soft hover:text-ink') + '">' + m[1] + '</button>';
        }).join('') + '</div>';

      return studyShell('Context Practice', Q.i, Q.items.length,
        modes +
        '<div class="card vc-up p-5 md:p-7">' + prompt +
          '<div class="mt-5 space-y-2.5">' + it.choices.map(function (c, i) {
            let cls = 'border bg-surface hover:bg-raised';
            if (done) {
              if (c === it.answer) cls = 'border-success bg-success/10';
              else if (i === Q.picked) cls = 'border-danger bg-danger/10';
              else cls = 'border opacity-60';
            }
            return '<button type="button" data-v="answer" data-i="' + i + '" ' + (done ? 'disabled ' : '') + 'class="flex w-full min-h-[52px] items-center gap-3 rounded-xl px-4 py-2.5 text-left transition-colors ' + cls + '">' +
              '<span class="num grid w-7 h-7 shrink-0 place-items-center rounded-full border text-[12.5px] text-ink-soft">' + (i + 1) + '</span>' +
              '<span class="text-[14.5px] leading-snug">' + esc(c) + '</span></button>';
          }).join('') + '</div>' +
          (done
            ? '<div role="status" class="vc-up mt-5 flex flex-wrap items-center justify-between gap-3">' +
                '<span class="text-[14px] font-semibold ' + (ok ? 'text-success' : 'text-danger') + '">' + (ok ? 'Correct' : 'Not quite') + '</span>' +
                '<button type="button" data-v="qnext" class="' + BTN_BLUE + '">' + (Q.i === Q.items.length - 1 ? 'See results' : 'Next') + ' ' + ic('arrow') + '</button></div>'
            : '') +
        '</div>' +
        '<p class="mt-3 text-center text-[12px] text-ink-mute">Press 1–4 to answer and Enter to continue.</p>');
    }

    function answer(i) {
      const Q = V.quiz;
      if (!Q || Q.picked !== null || Q.i >= Q.items.length) return;
      const it = Q.items[Q.i];
      if (i < 0 || i >= it.choices.length) return;
      Q.picked = i;
      const ok = it.choices[i] === it.answer;
      if (ok) Q.good++; else Q.missed.push(it.word);
      grade(it.word, ok);
      paint(true);
    }
    function quizNext() {
      const Q = V.quiz;
      if (!Q || Q.picked === null) return;
      Q.i++;
      Q.picked = null;
      paint();
    }

    /* ---------- отрисовка и события ---------- */
    function paint(still) {
      if (V.view === 'cards') root.innerHTML = cardsHTML();
      else if (V.view === 'quiz') root.innerHTML = quizHTML();
      else {
        const words = list();
        if (!words.length) root.innerHTML = emptyHTML();
        else { root.innerHTML = homeHTML(words); paintList(); }
      }
      // без повторной анимации появления при обновлении того же шага
      if (still) root.querySelectorAll('.vc-up').forEach(function (el) { el.classList.remove('vc-up'); });
    }

    function onClick(e) {
      const b = e.target.closest('[data-v]');
      if (!b || b.disabled) return;
      const k = b.getAttribute('data-k'), w = b.getAttribute('data-w');
      switch (b.getAttribute('data-v')) {
        case 'starter': addStarter(); break;
        case 'new': openEditor({}); break;
        case 'edit': openEditor({ word: w }); break;
        case 'speak': speak(w); break;
        case 'wod': {
          const d = wordOfDay();
          if (add({ w: d.w, pos: d.pos, tr: d.tr, d: d.d, ctx: d.ex })) Shell.toast('“' + d.w + '” added to Vocabulary');
          break;
        }
        case 'filter': V.filter = k; paintList(); break;
        case 'del': V.confirm = w; paintList(); break;
        case 'delno': V.confirm = null; paintList(); break;
        case 'delyes': V.confirm = null; remove(w); Shell.toast('Word deleted'); break;
        case 'cards': startCards(); break;
        case 'quiz': startQuiz('context'); break;
        case 'qmode': if (V.quiz.mode !== k) startQuiz(k); break;
        case 'again': if (V.view === 'cards') startCards(); else startQuiz(V.quiz.mode); break;
        case 'home': V.view = 'home'; paint(); break;
        case 'flip': flip(); break;
        case 'rate': rate(b.getAttribute('data-ok') === '1'); break;
        case 'answer': answer(+b.getAttribute('data-i')); break;
        case 'qnext': quizNext(); break;
      }
    }
    function onInput(e) {
      if (e.target.id === 'vcSearch') { V.search = e.target.value; paintList(); }
    }
    function onChange(e) {
      const w = e.target.getAttribute && e.target.getAttribute('data-status');
      if (w) setStatus(w, e.target.value);
    }
    function onKey(e) {
      if (closeEditor || V.view === 'home' || e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === 'Escape') { V.view = 'home'; paint(); return; }
      const onControl = e.target && e.target.closest && e.target.closest('button, a, input, select, textarea');
      if (V.view === 'cards') {
        if ((e.key === ' ' || e.key === 'Enter') && !onControl) { e.preventDefault(); flip(); }
        else if (e.key === '1') rate(false);
        else if (e.key === '2') rate(true);
      } else if (V.view === 'quiz') {
        if (/^[1-4]$/.test(e.key)) answer(+e.key - 1);
        else if (e.key === 'Enter' && !onControl) { e.preventDefault(); quizNext(); }
      }
    }
    // слова изменились (сохранение, удаление, статус) — обновить главную
    function onVocab() {
      if (V.view !== 'home') return;
      const y = window.scrollY;
      paint(true);
      window.scrollTo(0, y);
    }

    root.addEventListener('click', onClick);
    root.addEventListener('input', onInput);
    root.addEventListener('change', onChange);
    document.addEventListener('keydown', onKey);
    window.addEventListener('sp:vocab', onVocab);
    paint();

    return function () {
      alive = false;
      if (closeEditor) closeEditor();
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      root.removeEventListener('click', onClick);
      root.removeEventListener('input', onInput);
      root.removeEventListener('change', onChange);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('sp:vocab', onVocab);
    };
  }

  /* =====================================================================
     ПУБЛИЧНЫЙ API И РЕГИСТРАЦИЯ
     ===================================================================== */
  window.SPVocab = {
    list: list, get: get, add: add, update: update, remove: remove,
    dueCount: dueCount, openEditor: openEditor, speak: speak, attach: attach
  };
  if (window.SPData) window.SPData.vocab = window.SPVocab;

  window.addEventListener('storage', function (e) { if (e.key === KEY) paintBadge(); });

  Shell.register('vocabulary', { title: 'Vocabulary', group: 'Prep', render: render });
})();
