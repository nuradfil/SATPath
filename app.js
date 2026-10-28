/* ===== SATPATH CORE APPLICATION LOGIC, UI & CONTROLLERS ===== */
window._SP_MEM = {};
function spGet(k) {
  try { var v = window.localStorage.getItem(k); if (v !== null) return v; } catch(e) {}
  return Object.prototype.hasOwnProperty.call(window._SP_MEM, k) ? window._SP_MEM[k] : null;
}
function spSet(k, v) {
  window._SP_MEM[k] = String(v);
  try { window.localStorage.setItem(k, String(v)); } catch(e) {}
}


/* ===== MOCK EXAM CORE HELPERS (fallbacks) =====
 * ptLoad / ptSave / getMockSession / saveMockSession / ptRight / ptFmt / ptScore / ptMathPlan
 * вызываются в buildPT, ptResult, ptStart, но не были определены ни в app.js, ни в index.html.
 * Блоки ниже подключаются только если такие функции ещё не определены в других файлах. */
(function mockCoreFallbacks() {
  function jget(k, def) { try { var v = JSON.parse(spGet(k)); return (v && typeof v === 'object') ? v : def; } catch (e) { return def; } }
  function jset(k, v) { try { spSet(k, JSON.stringify(v)); } catch (e) {} }
  var PT_KEY = 'satpath_pt_results_v1', SESS_KEY = 'satpath_mock_sessions_v1';

  if (typeof window.ptLoad !== 'function') window.ptLoad = function () { return jget(PT_KEY, {}); };
  if (typeof window.ptSave !== 'function') window.ptSave = function (S) { jset(PT_KEY, S || {}); };
  if (typeof window.getMockSession !== 'function') window.getMockSession = function (t) {
    var all = jget(SESS_KEY, {});
    return all[t] || null;
  };
  if (typeof window.saveMockSession !== 'function') window.saveMockSession = function (t, sess) {
    var all = jget(SESS_KEY, {});
    if (sess) all[t] = sess; else delete all[t];
    jset(SESS_KEY, all);
  };
  if (typeof window.ptFmt !== 'function') window.ptFmt = function (sec) {
    sec = Math.max(0, Math.floor(+sec || 0));
    var m = Math.floor(sec / 60), s = sec % 60;
    return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
  };
  if (typeof window.ptRight !== 'function') window.ptRight = function (q, a) {
    if (!q || a == null || a === '') return false;
    if (q.isGrid) {
      if (typeof same === 'function') return !!same(a, q.ans);
      return String(a).trim() === String(q.ans).trim();
    }
    return String(a) === String(q.ans);
  };
  /* Приблизительная шкала 200–800: R&W 2×27 вопросов, Math 2×22. Лёгкий второй модуль ограничивает потолок. */
  /* План R&W-модуля: 27 вопросов, поровну по темам, где есть вопросы (PT_RW из других файлов имеет приоритет) */
  window.ptRwPlan = function () {
    if (Array.isArray(window.PT_RW) && window.PT_RW.length) return window.PT_RW;
    var tis = [];
    if (typeof RTOPS !== 'undefined' && typeof RQ !== 'undefined') {
      for (var i = 0; i < RTOPS.length; i++) if (RQ[i] && RQ[i].length) tis.push(i);
    }
    var plan = [], total = 27, n = tis.length;
    for (var k = 0; k < n; k++) plan.push([tis[k], Math.floor(total / n) + (k < total % n ? 1 : 0)]);
    return plan;
  };
  if (typeof window.ptScore !== 'function') window.ptScore = function (sec, ok1, ok2, hard) {
    var max = sec === 'r' ? 54 : 44;
    var pct = Math.max(0, Math.min(1, ((+ok1 || 0) + (+ok2 || 0)) / max));
    var raw = hard ? 300 + 500 * pct : 200 + 440 * pct;
    return Math.max(200, Math.min(800, Math.round(raw / 10) * 10));
  };
  /* 22 тем для Math-модуля: детерминированный план (одинаковый для всех пользователей) */
  if (typeof window.ptMathPlan !== 'function') window.ptMathPlan = function (t, m) {
    var n = (typeof TOPS !== 'undefined' && TOPS && TOPS.length) ? TOPS.length : 20;
    var seed = ((t || 1) * 131 + (m || 1) * 17) | 0;
    function rnd() { seed = (seed * 1664525 + 1013904223) | 0; return ((seed >>> 0) / 4294967296); }
    var order = [], i;
    for (i = 0; i < n; i++) order.push(i);
    for (i = n - 1; i > 0; i--) { var j = Math.floor(rnd() * (i + 1)); var tmp = order[i]; order[i] = order[j]; order[j] = tmp; }
    var plan = [];
    for (i = 0; i < 22; i++) plan.push(order[i % n]);
    return plan;
  };
})();

/* Минималистичные SVG-иконки вместо эмодзи */
function spSvg(name, size) {
  var sz = size || 16;
  var paths = {
    compass: '<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>',
    anchor: '<circle cx="12" cy="5" r="3"/><line x1="12" y1="22" x2="12" y2="8"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/>',
    feather: '<path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
    crown: '<path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/>',
    flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    lock: '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    award: '<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>',
    layers: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
    user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    alert: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
    plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
    send: '<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>',
    coffee: '<path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/>'
  };
  return '<svg width="' + sz + '" height="' + sz + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-3px;flex:none">' + (paths[name] || paths.compass) + '</svg>';
}

/* Полноценный Desmos как в реальном Bluebook SAT */
function createFullDesmos(el) {
  if (!window.Desmos || !el) return null;
  return Desmos.GraphingCalculator(el, {
    keypad: true,
    expressions: true,
    settingsMenu: true,
    zoomButtons: true,
    expressionsTopbar: true,
    pointsOfInterest: true,
    trace: true,
    border: false,
    lockViewport: false,
    expressionsCollapsed: false,
    capExpressionSize: false,
    authorFeatures: false,
    images: false,
    folders: true,
    notes: true,
    sliders: true,
    links: false,
    qwertyKeyboard: true,
    degreeMode: false
  });
}

var h=new Date().getHours();document.getElementById('gr').textContent=(h<5?'Good night,':h<12?'Good morning,':h<18?'Good afternoon,':'Good evening,');
var n=new Date(),sat=new Date(n.getFullYear()+(n.getMonth()>10?1:0),10,7);
document.getElementById('mo').textContent=n.toLocaleString('en',{month:'long'})+' · 5 questions';
var c=document.getElementById('cal'),x='';'MoTuWeThFrSaSu'.match(/../g).forEach(function(d){x+='<span>'+d+'</span>'});
var first=new Date(n.getFullYear(),n.getMonth(),1),off=(first.getDay()+6)%7,dm=new Date(n.getFullYear(),n.getMonth()+1,0).getDate();
for(var i=0;i<off;i++)x+='<i style="background:none"></i>';
for(var d=1;d<=dm;d++)x+='<i class="'+(d==n.getDate()?'t ':'')+(d==n.getDate()-1?'l2':d==n.getDate()-2?'l1':'')+'"></i>';
c.innerHTML=x;
var t=document.getElementById('t'),tm;
document.querySelectorAll('.soon').forEach(function(b){b.addEventListener('click',function(e){e.preventDefault();toast()})});

function confetti(){for(var i=0;i<60;i++){var p=document.createElement('i'),c=['#22a381','#f5b82e','#2b7f9c','#e74c3c','#fff'][i%5],a=Math.random()*Math.PI*2,d=150+Math.random()*350;
 p.style.cssText='position:fixed;left:50%;top:40%;width:9px;height:14px;background:'+c+';z-index:200;border-radius:2px;pointer-events:none';
 document.body.appendChild(p);
 p.animate([{transform:'translate(0,0) rotate(0)',opacity:1},{transform:'translate('+Math.cos(a)*d+'px,'+(Math.sin(a)*d+300)+'px) rotate('+Math.random()*720+'deg)',opacity:0}],{duration:1200+Math.random()*800,easing:'cubic-bezier(.2,.8,.4,1)'}).onfinish=p.remove.bind(p)}}

/* ===== MISTAKES BANK (РАБОТА НАД ОШИБКАМИ · MAX 500) ===== */
var MISTAKES_KEY = 'satpath_mistakes_v1';
function getMistakes() {
  try { return JSON.parse(spGet(MISTAKES_KEY)) || []; } catch (e) { return []; }
}
function saveMistakes(list) {
  if (list.length > 500) list = list.slice(0, 500);
  try { spSet(MISTAKES_KEY, JSON.stringify(list)); } catch (e) {}
  updateNavBadges();
}
function recordMistake(qObj, userAns, sourceLabel) {
  if (!qObj || !qObj.q) return;
  var list = getMistakes();
  var qText = String(qObj.q).trim();
  var existingIdx = list.findIndex(function(x) { return String(x.q).trim() === qText; });
  var entry = {
    id: 'mk_' + Date.now() + '_' + Math.floor(Math.random() * 10000),
    q: qObj.q,
    ans: qObj.ans,
    opts: Array.isArray(qObj.opts) ? qObj.opts.slice() : [],
    isGrid: !!qObj.isGrid,
    rw: !!qObj.rw,
    top: qObj.top || (qObj.rw ? 'Reading & Writing' : 'SAT Math'),
    wrongAns: userAns != null ? String(userAns) : 'Unanswered',
    src: sourceLabel || 'Practice',
    ts: Date.now()
  };
  if (existingIdx >= 0) {
    list.splice(existingIdx, 1);
  }
  list.unshift(entry);
  if (list.length > 500) list = list.slice(0, 500);
  saveMistakes(list);
}
function removeMistakeByQuestion(qText) {
  var list = getMistakes();
  var clean = String(qText).trim();
  var filtered = list.filter(function(x) { return String(x.q).trim() !== clean; });
  saveMistakes(filtered);
}
function updateNavBadges() {
  var mkLen = getMistakes().length;
  ['navMistakesCnt', 'sideErrCnt', 'mbErrCnt'].forEach(function(id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.textContent = mkLen;
    el.style.display = mkLen > 0 ? (id.indexOf('mb') === 0 ? 'grid' : 'inline-block') : 'none';
  });
  var vLen = getVocabList().length;
  ['navVocabCnt', 'sideVocCnt', 'mbVocCnt'].forEach(function(id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.textContent = vLen;
    el.style.display = vLen > 0 ? (id.indexOf('mb') === 0 ? 'grid' : 'inline-block') : 'none';
  });
}

/* ===== IN-PAGE CONFIRM MODAL & VOCABULARY HIGHLIGHTER FOR MOCK EXAMS ===== */
function spModalConfirm(msg, onYes) {
  var m = document.createElement('div');
  m.style.cssText = 'position:fixed;inset:0;z-index:140;background:rgba(6,21,23,0.75);backdrop-filter:blur(4px);display:grid;place-items:center;padding:20px';
  m.innerHTML = '<div class="qb" style="max-width:420px;width:100%;text-align:center;border-radius:24px;border:2px solid var(--sand-line);animation:up .2s ease">' +
    '<div style="font-size:16px;font-weight:700;line-height:1.5;margin-bottom:18px">' + msg + '</div>' +
    '<div style="display:flex;gap:10px;justify-content:center">' +
    '<button class="chip" id="spModNo" style="padding:10px 18px;font-weight:700;font-size:13px">Cancel</button>' +
    '<button class="cta-amber" id="spModYes" style="padding:10px 20px;font-size:13px">Confirm →</button>' +
    '</div></div>';
  document.body.appendChild(m);
  m.querySelector('#spModNo').onclick = function() { m.remove(); };
  m.querySelector('#spModYes').onclick = function() { m.remove(); if (onYes) onYes(); };
}

function getVocabList() {
  try { return JSON.parse(spGet('satpath_vocab_v1')) || []; } catch (e) { return []; }
}
function saveVocabList(list) {
  try { spSet('satpath_vocab_v1', JSON.stringify(list)); } catch (e) {}
  updateNavBadges();
}
/* ===== FREE DICTIONARY API (https://dictionaryapi.dev) ===== */
var GENERIC_RU = 'Academic SAT Vocabulary';
var DICT_CACHE_KEY = 'satpath_dict_v1';
var _dictMem = null, _dictInflight = {}, _dictActive = 0, _dictQ = [], _vocState = {};

function dictCacheLoad() {
  if (_dictMem) return _dictMem;
  try { _dictMem = JSON.parse(spGet(DICT_CACHE_KEY)) || {}; } catch (e) { _dictMem = {}; }
  return _dictMem;
}
function dictCacheSave() {
  try { spSet(DICT_CACHE_KEY, JSON.stringify(_dictMem || {})); } catch (e) {}
}
function dictPump() {
  while (_dictActive < 4 && _dictQ.length) {
    (function(job) {
      _dictActive++;
      job.fn().then(function(r) { _dictActive--; job.resolve(r); dictPump(); });
    })(_dictQ.shift());
  }
}
function dictRun(fn) {
  return new Promise(function(resolve) { _dictQ.push({ fn: fn, resolve: resolve }); dictPump(); });
}
function dictCandidates(word) {
  var w = String(word || '').toLowerCase().trim().replace(/[^a-z'\- ]/g, '').replace(/\s+/g, ' ');
  if (!w) return [];
  var c = [w];
  if (w.indexOf(' ') < 0) {
    if (/ies$/.test(w)) c.push(w.slice(0, -3) + 'y');
    if (/(ches|shes|sses|xes|zes)$/.test(w)) c.push(w.slice(0, -2));
    if (/[^s]s$/.test(w)) c.push(w.slice(0, -1));
    if (/ing$/.test(w) && w.length > 5) { c.push(w.slice(0, -3)); c.push(w.slice(0, -3) + 'e'); if (/(.)\1ing$/.test(w)) c.push(w.slice(0, -4)); }
    if (/ed$/.test(w) && w.length > 4) { c.push(w.slice(0, -2)); c.push(w.slice(0, -1)); if (/(.)\1ed$/.test(w)) c.push(w.slice(0, -3)); }
    if (/ly$/.test(w) && w.length > 4) c.push(w.slice(0, -2));
  }
  return c.filter(function(x, i) { return x.length > 2 && c.indexOf(x) === i; });
}
function dictParse(data) {
  if (!Array.isArray(data) || !data.length) return null;
  var out = { phonetic: '', audio: '', meanings: [] }, byPos = {};
  data.forEach(function(entry) {
    if (!out.phonetic && entry.phonetic) out.phonetic = entry.phonetic;
    (entry.phonetics || []).forEach(function(p) {
      if (!out.phonetic && p.text) out.phonetic = p.text;
      if (!out.audio && p.audio) out.audio = p.audio.indexOf('//') === 0 ? 'https:' + p.audio : p.audio;
    });
    (entry.meanings || []).forEach(function(m) {
      var pos = m.partOfSpeech || 'word';
      var defs = (m.definitions || []).map(function(df) {
        return { d: df.definition || '', ex: df.example || '' };
      }).filter(function(df) { return df.d; });
      if (!defs.length) return;
      if (byPos[pos]) {
        byPos[pos].defs = byPos[pos].defs.concat(defs).slice(0, 3);
      } else {
        byPos[pos] = { pos: pos, defs: defs.slice(0, 3), syn: (m.synonyms || []).slice(0, 5) };
        out.meanings.push(byPos[pos]);
      }
    });
  });
  return out.meanings.length ? out : null;
}
/* Resolves (never rejects) to {ok:true,data} | {ok:false,notFound:true} | {ok:false,error:true} */
function fetchDictEntry(word) {
  var cands = dictCandidates(word);
  if (!cands.length) return Promise.resolve({ ok: false, notFound: true });
  var key = cands[0], cache = dictCacheLoad();
  if (cache[key]) return Promise.resolve(cache[key].none ? { ok: false, notFound: true } : { ok: true, data: cache[key] });
  if (_dictInflight[key]) return _dictInflight[key];

  function get(url) {
    var ctl = window.AbortController ? new AbortController() : null;
    var tm = setTimeout(function() { if (ctl) ctl.abort(); }, 8000);
    return fetch(url, ctl ? { signal: ctl.signal } : undefined).then(
      function(r) { clearTimeout(tm); return r; },
      function(e) { clearTimeout(tm); throw e; }
    );
  }
  function tryNext(i, hadError) {
    if (i >= cands.length) return Promise.resolve(hadError ? { ok: false, error: true } : { ok: false, notFound: true });
    return get('https://api.dictionaryapi.dev/api/v2/entries/en/' + encodeURIComponent(cands[i]))
      .then(function(r) {
        if (r.status === 404) return tryNext(i + 1, hadError);
        if (!r.ok) return tryNext(i + 1, true);
        return r.json().then(function(j) {
          var d = dictParse(j);
          return d ? { ok: true, data: d } : tryNext(i + 1, hadError);
        });
      })
      .catch(function() { return tryNext(i + 1, true); });
  }
  var p = dictRun(function() { return tryNext(0, false); }).then(function(res) {
    delete _dictInflight[key];
    if (res.ok) { cache[key] = res.data; dictCacheSave(); }
    else if (res.notFound) { cache[key] = { none: 1 }; dictCacheSave(); }
    return res;
  });
  _dictInflight[key] = p;
  return p;
}
function isGenericVocab(x) {
  return !x.manual && (!x.d || x.ru === GENERIC_RU);
}
/* Fetch meanings for a saved word and write them into the saved list */
function enrichVocabWord(word) {
  var k = String(word).toLowerCase();
  return fetchDictEntry(word).then(function(res) {
    if (res.ok || res.notFound) {
      delete _vocState[k];
      var list = getVocabList(), changed = false;
      list.forEach(function(x) {
        if (x.w.toLowerCase() !== k) return;
        if (res.ok) {
          var wasGeneric = isGenericVocab(x);
          x.dict = res.data;
          delete x.dictNone;
          if (wasGeneric) {
            x.d = res.data.meanings[0].defs[0].d;
            x.ru = res.data.meanings[0].pos;
            x.fromApi = true;
          }
        } else {
          x.dictNone = true;
        }
        changed = true;
      });
      if (changed) saveVocabList(list);
    } else {
      _vocState[k] = 'error';
    }
    vocRefreshCards(k);
    return res;
  });
}
function vocBackfill() {
  getVocabList().forEach(function(x) {
    if (x.dict || x.dictNone) return;
    var k = x.w.toLowerCase();
    if (_vocState[k]) return;
    _vocState[k] = 'loading';
    enrichVocabWord(x.w);
  });
}
var VOC_ICON_SPEAKER = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M19 5a10 10 0 0 1 0 14"/></svg>';
function vocMeaningHTML(item) {
  var label = '<b style="color:var(--acc);font-size:11.5px;text-transform:uppercase;letter-spacing:.05em;display:block;margin-bottom:2px">Meaning</b>';
  var wrap = 'font-size:13.5px;color:var(--tx);line-height:1.55';
  var dd = item.dict, h = '';
  if (dd && dd.meanings && dd.meanings.length) {
    if (dd.phonetic || dd.audio) {
      h += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;color:var(--mut);font-size:12.5px">' +
        (dd.phonetic ? '<span>' + lbEsc(dd.phonetic) + '</span>' : '') +
        (dd.audio ? '<button type="button" class="tbtn" data-voc-audio="' + lbEsc(dd.audio) + '" title="Listen" style="width:26px;height:26px">' + VOC_ICON_SPEAKER + '</button>' : '') +
      '</div>';
    }
    h += '<div style="' + wrap + '">' + label;
    dd.meanings.slice(0, 3).forEach(function(m) {
      h += '<div style="margin-top:8px"><span class="tag" style="margin:0;font-size:10px">' + lbEsc(m.pos) + '</span></div>' +
        '<ol style="margin:4px 0 0 18px;padding:0">';
      m.defs.slice(0, 2).forEach(function(df) {
        h += '<li style="margin-bottom:3px">' + lbEsc(df.d) +
          (df.ex ? '<div style="color:var(--mut);font-style:italic;font-size:12px">&ldquo;' + lbEsc(df.ex) + '&rdquo;</div>' : '') + '</li>';
      });
      h += '</ol>';
      if (m.syn && m.syn.length) h += '<div style="color:var(--mut);font-size:11.5px;margin-top:2px">Synonyms: ' + lbEsc(m.syn.join(', ')) + '</div>';
    });
    h += '</div>';
    if (!item.fromApi && !isGenericVocab(item) && item.d) {
      h += '<div style="margin-top:8px;font-size:12.5px;color:var(--mut)"><b>Note:</b> ' + lbEsc(item.d) + '</div>';
    }
    return h;
  }
  var k = String(item.w).toLowerCase();
  var own = isGenericVocab(item) ? '' : lbEsc(item.d);
  if (item.dictNone) {
    return '<div style="' + wrap + '">' + label + (own || lbEsc(item.d || '')) +
      '<div style="color:var(--mut);font-size:11.5px;margin-top:4px">No dictionary entry found for this word.</div></div>';
  }
  if (_vocState[k] === 'error') {
    return '<div style="' + wrap + '">' + label + own +
      '<div style="color:var(--mut);font-size:11.5px;margin-top:4px">Couldn\'t reach the dictionary. ' +
      '<button type="button" data-voc-retry="' + lbEsc(item.w) + '" style="color:var(--acc);font-weight:700;text-decoration:underline">Retry</button></div></div>';
  }
  return '<div style="' + wrap + '">' + label + own +
    '<div style="color:var(--mut);font-size:12px;margin-top:' + (own ? '4' : '0') + 'px">Loading meanings from dictionary…</div></div>';
}
function bindVocMeanEvents(scope) {
  scope.querySelectorAll('[data-voc-audio]').forEach(function(b) {
    b.onclick = function() { try { new Audio(b.getAttribute('data-voc-audio')).play(); } catch (e) {} };
  });
  scope.querySelectorAll('[data-voc-retry]').forEach(function(b) {
    b.onclick = function() {
      var w = b.getAttribute('data-voc-retry');
      _vocState[w.toLowerCase()] = 'loading';
      vocRefreshCards(w.toLowerCase());
      enrichVocabWord(w);
    };
  });
}
function vocRefreshCards(k) {
  var root = document.getElementById('vVOC');
  if (!root) return;
  var list = getVocabList();
  root.querySelectorAll('[data-voc-mean]').forEach(function(el) {
    if (el.getAttribute('data-voc-mean').toLowerCase() !== k) return;
    var item = list.filter(function(x) { return x.w.toLowerCase() === k; })[0];
    if (!item) return;
    el.innerHTML = vocMeaningHTML(item);
    bindVocMeanEvents(el);
    var ruEl = el.parentNode && el.parentNode.querySelector('[data-voc-ru]');
    if (ruEl) ruEl.textContent = item.ru || 'SAT Term';
  });
}

function lookupWordDef(rawWord, contextText) {
  var clean = String(rawWord || '').toLowerCase().replace(/[^a-z'-]/g, '');
  if (!clean) return null;
  var dict = (typeof SAT_VOCAB_DICT !== 'undefined' && SAT_VOCAB_DICT) ? SAT_VOCAB_DICT : {};
  if (dict[clean]) {
    return {
      d: dict[clean].d,
      ru: dict[clean].ru || 'Academic Term',
      ex: contextText || ('The author utilized the term "' + clean + '" to emphasize the central claim of the passage.')
    };
  }
  for (var k in dict) {
    if (k.length >= 5 && (clean.indexOf(k.slice(0, 5)) === 0 || k.indexOf(clean.slice(0, 5)) === 0)) {
      return {
        d: dict[k].d,
        ru: dict[k].ru || 'Academic Term',
        ex: contextText || ('In the SAT passage, "' + clean + '" conveys a precise analytical nuance.')
      };
    }
  }
  var clue = "High-utility academic SAT vocabulary term used in analytical and literary contexts.";
  if (clean.endsWith('tion') || clean.endsWith('sion') || clean.endsWith('ment')) clue = "Noun denoting a formal process, condition, or analytical result in the text.";
  else if (clean.endsWith('ous') || clean.endsWith('ive') || clean.endsWith('al') || clean.endsWith('ic') || clean.endsWith('able')) clue = "Adjective characterizing a specific quality, tone, or attribute in the passage.";
  else if (clean.endsWith('ly')) clue = "Adverb modifying the intensity, manner, or certainty of an action in the argument.";
  else if (clean.endsWith('ate') || clean.endsWith('ize') || clean.endsWith('ify')) clue = "Verb expressing a transformation, evaluation, or causal relationship.";
  return {
    d: clue,
    ru: "Academic SAT Vocabulary",
    ex: contextText ? contextText : ('The researcher\'s analysis relied on understanding how "' + clean + '" functions in context.')
  };
}

function wrapWordsForVocab(htmlStr) {
  var saved = getVocabList().map(function(x) { return x.w.toLowerCase(); });
  return String(htmlStr).split(/(<[^>]+>)/g).map(function(part, idx) {
    if (idx % 2 === 1) return part;
    return part.replace(/\b([A-Za-z]{4,})\b/g, function(m, w) {
      var isHl = saved.indexOf(w.toLowerCase()) >= 0;
      return '<span class="rw-word' + (isHl ? ' hl' : '') + '" data-word="' + w + '">' + w + '</span>';
    });
  }).join('');
}

function openAddWordModal(defaultCtx, onSaved) {
  var m = document.createElement('div');
  m.style.cssText = 'position:fixed;inset:0;z-index:160;background:rgba(6,21,23,0.78);backdrop-filter:blur(4px);display:grid;place-items:center;padding:20px';
  var selectedText = '';
  try { selectedText = window.getSelection().toString().trim().slice(0, 40); } catch (e) {}
  var autoInfo = selectedText ? lookupWordDef(selectedText, defaultCtx) : null;

  m.innerHTML = '<div class="qb" style="max-width:480px;width:100%;border-radius:26px;border:2px solid var(--sand-line);animation:up .2s ease">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;padding-bottom:10px;border-bottom:1px dashed var(--line)">' +
      '<div><small style="color:var(--sand);font-weight:800;text-transform:uppercase;letter-spacing:.08em">PERSONAL LEXICON</small><h3 style="font-size:20px;font-weight:800">Add Word to Vocabulary</h3></div>' +
      '<button class="tbtn" id="awClose">✕</button>' +
    '</div>' +
    '<div style="display:grid;gap:12px">' +
      '<div><label style="font-size:11.5px;font-weight:800;color:var(--mut);text-transform:uppercase;display:block;margin-bottom:5px">Word or Term</label>' +
      '<input id="awWord" class="qin" style="font-size:15px;padding:10px 14px;text-align:left" placeholder="e.g., corroborate" value="' + lbEsc(selectedText) + '"></div>' +
      '<div><label style="font-size:11.5px;font-weight:800;color:var(--mut);text-transform:uppercase;display:block;margin-bottom:5px">Meaning / Definition</label>' +
      '<input id="awDef" class="qin" style="font-size:14px;padding:10px 14px;text-align:left" placeholder="Leave blank to auto-generate definition..." value="' + (autoInfo && autoInfo.ru !== GENERIC_RU ? lbEsc(autoInfo.d) : '') + '"></div>' +
      '<div><label style="font-size:11.5px;font-weight:800;color:var(--mut);text-transform:uppercase;display:block;margin-bottom:5px">Example Sentence (Context)</label>' +
      '<input id="awEx" class="qin" style="font-size:13.5px;padding:10px 14px;text-align:left" placeholder="Example usage in an SAT passage..." value="' + lbEsc(defaultCtx || '') + '"></div>' +
      '<div style="display:flex;justify-content:flex-end;gap:10px;margin-top:6px">' +
        '<button class="chip" id="awCancel" style="padding:10px 16px;font-weight:700">Cancel</button>' +
        '<button class="cta-amber" id="awSave" style="padding:10px 20px;font-size:13.5px">' + spSvg('plus', 15) + ' Save to Vocabulary</button>' +
      '</div>' +
    '</div></div>';
  document.body.appendChild(m);
  var awWordEl = m.querySelector('#awWord'), awDefEl = m.querySelector('#awDef');
  var AW_PH = awDefEl.placeholder;
  function awLookup() {
    var w = awWordEl.value.trim();
    if (!w || (awDefEl.value.trim() && awDefEl.dataset.auto !== '1')) return;
    awDefEl.placeholder = 'Looking up in dictionary…';
    fetchDictEntry(w).then(function(res) {
      awDefEl.placeholder = AW_PH;
      if (awWordEl.value.trim() !== w) return;
      if (res.ok && (!awDefEl.value.trim() || awDefEl.dataset.auto === '1')) {
        awDefEl.value = res.data.meanings[0].defs[0].d;
        awDefEl.dataset.auto = '1';
      }
    });
  }
  awWordEl.addEventListener('change', awLookup);
  awDefEl.addEventListener('input', function() { awDefEl.dataset.auto = ''; });
  if (awWordEl.value.trim()) awLookup();
  m.querySelector('#awClose').onclick = function() { m.remove(); };
  m.querySelector('#awCancel').onclick = function() { m.remove(); };
  m.querySelector('#awSave').onclick = function() {
    var w = m.querySelector('#awWord').value.trim();
    if (!w) return toast('Please enter a word first');
    var info = lookupWordDef(w, defaultCtx);
    var typedDef = m.querySelector('#awDef').value.trim();
    var isAuto = m.querySelector('#awDef').dataset.auto === '1';
    var d = typedDef || (info ? info.d : 'Academic SAT vocabulary term.');
    var ex = m.querySelector('#awEx').value.trim() || (info ? info.ex : '');
    var list = getVocabList();
    var existing = list.findIndex(function(x) { return x.w.toLowerCase() === w.toLowerCase(); });
    if (existing >= 0) list.splice(existing, 1);
    list.unshift({ w: w, d: d, ru: info ? info.ru : 'SAT Term', ctx: ex, manual: !!typedDef && !isAuto });
    saveVocabList(list);
    enrichVocabWord(w);
    toast('Saved "' + w + '" to Vocabulary');
    m.remove();
    if (onSaved) onSaved();
  };
}

function openVocabDrawer() {
  var ov = document.createElement('div');
  ov.style.cssText = 'position:fixed;inset:0;z-index:130;background:rgba(6,21,23,0.75);backdrop-filter:blur(4px);display:grid;place-items:center;padding:20px;overflow:auto';
  function render() {
    var list = getVocabList();
    var rows = list.length ? list.map(function(item, idx) {
      return '<div class="card" style="padding:14px 16px;border-radius:18px;display:flex;justify-content:space-between;align-items:flex-start;gap:12px">' +
        '<div><div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap"><b style="font-size:16px;color:var(--sand)">' + lbEsc(item.w) + '</b><span class="tag" style="margin:0;font-size:10px">' + lbEsc(item.ru || 'SAT Term') + '</span></div>' +
        '<div style="font-size:13px;color:var(--tx);margin-top:6px;line-height:1.45"><b>Meaning:</b> ' + lbEsc(item.d) + '</div>' +
        (item.ctx ? '<div style="font-size:12px;color:var(--mut);margin-top:6px;font-style:italic"><b>Example:</b> "' + lbEsc(item.ctx) + '"</div>' : '') +
        '</div>' +
        '<button class="tbtn" data-del-voc="' + idx + '" title="Remove word" style="flex:none;width:30px;height:30px;font-size:12px">✕</button></div>';
    }).join('') : '<div style="text-align:center;padding:30px 10px;color:var(--mut)">No words saved yet! Click any unfamiliar word during a Mock Exam or R&amp;W passage, or click "+ Add Word" above.</div>';

    ov.innerHTML = '<div class="qb" style="max-width:640px;width:100%;border-radius:26px;border:2px solid var(--sand-line);max-height:85vh;overflow-y:auto">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:12px;border-bottom:1.5px dashed var(--line);margin-bottom:14px;gap:10px;flex-wrap:wrap">' +
      '<div><small style="color:var(--sand);font-weight:800;letter-spacing:.08em;text-transform:uppercase">PERSONAL LEXICON</small><h2 style="font-size:22px;font-weight:800">Saved SAT Vocabulary (' + list.length + ')</h2></div>' +
      '<div style="display:flex;gap:8px;align-items:center"><button class="cta-amber" id="vocAddCustom" style="padding:8px 14px;font-size:12px;border-radius:12px">' + spSvg('plus', 14) + ' Add Word</button><button class="tbtn" id="vocClose">✕</button></div></div>' +
      '<div style="display:grid;gap:10px">' + rows + '</div>' +
      (list.length ? '<div style="margin-top:16px;text-align:right"><button class="chip" id="vocClearAll" style="color:#e74c3c;border-color:#e74c3c">Clear All Words</button></div>' : '') +
      '</div>';
    ov.querySelector('#vocClose').onclick = function() { ov.remove(); };
    ov.querySelector('#vocAddCustom').onclick = function() { openAddWordModal('', render); };
    var clr = ov.querySelector('#vocClearAll');
    if (clr) clr.onclick = function() { saveVocabList([]); render(); };
    ov.querySelectorAll('[data-del-voc]').forEach(function(b) {
      b.onclick = function() {
        var l = getVocabList();
        l.splice(+b.dataset.delVoc, 1);
        saveVocabList(l);
        render();
      };
    });
  }
  document.body.appendChild(ov);
  ov.addEventListener('click', function(e) { if (e.target === ov) ov.remove(); });
  render();
}

function ptInfo(html,btn,cb){var ov=document.createElement('div');
 ov.style.cssText='position:fixed;inset:0;z-index:90;background:var(--bg);overflow:auto;padding:24px;display:grid;place-items:center';
 ov.innerHTML='<div class="qb" style="text-align:center;border-radius:26px;border:2px solid var(--line);box-shadow:0 16px 40px rgba(0,0,0,0.25)">'+html+'<button class="cta-amber" id="pi" style="margin-top:18px">'+btn+'</button></div>';
 document.body.appendChild(ov);ov.querySelector('#pi').onclick=function(){
  if (sessionStorage.getItem('bb_fullscreen_active') === '1' && !document.fullscreenElement && document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen().catch(function(){});
  }
  ov.remove();cb();
 }}

/* 10-минутный перерыв между секциями R&W и Math в Mock Exam */
function showTenMinuteBreak(onContinue) {
  var ov = document.createElement('div');
  ov.style.cssText = 'position:fixed;inset:0;z-index:95;background:var(--bg);background-image:radial-gradient(circle at 20% 20%, rgba(34,163,129,0.14), transparent 40%), var(--topo-svg);display:grid;place-items:center;padding:24px;overflow:auto';
  var left = 10 * 60;
  ov.innerHTML = '<div class="qb" style="max-width:580px;width:100%;text-align:center;border-radius:28px;border:2px solid var(--sand-line);padding:36px 30px;box-shadow:0 24px 60px rgba(0,0,0,0.3)">' +
    '<div style="display:inline-flex;align-items:center;gap:8px;background:var(--sand-bg);color:var(--sand);border:1px solid var(--sand-line);padding:6px 14px;border-radius:99px;font-size:11.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;margin-bottom:14px">' + spSvg('coffee', 15) + ' INTERMISSION · SECTION BREAK</div>' +
    '<h2 style="font-size:28px;font-weight:800;margin-bottom:8px">Reading &amp; Writing Complete</h2>' +
    '<p class="sub" style="max-width:440px;margin:0 auto 24px">Take a 10-minute breather to stretch and hydrate before starting the Math section (2 modules, 44 questions total).</p>' +
    '<div style="background:var(--panel2);border:2px solid var(--line);border-radius:24px;padding:22px;margin:0 auto 24px;max-width:260px">' +
      '<small style="display:block;font-size:11px;font-weight:800;color:var(--mut);text-transform:uppercase;letter-spacing:.08em;margin-bottom:4px">Remaining Break Time</small>' +
      '<div id="brkTimerVal" style="font-size:48px;font-weight:800;color:var(--sand);font-variant-numeric:tabular-nums;line-height:1.1">10:00</div>' +
    '</div>' +
    '<button class="cta-amber" id="brkResumeBtn" style="padding:14px 28px;font-size:14.5px;border-radius:16px">Resume to Math Section Now →</button>' +
  '</div>';
  document.body.appendChild(ov);
  var tmr = setInterval(function() {
    left--;
    var el = ov.querySelector('#brkTimerVal');
    if (el) el.textContent = ptFmt(left);
    if (left <= 0) {
      clearInterval(tmr);
      ov.remove();
      onContinue();
    }
  }, 1000);
  ov.querySelector('#brkResumeBtn').onclick = function() {
    clearInterval(tmr);
    if (sessionStorage.getItem('bb_fullscreen_active') === '1' && !document.fullscreenElement && document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(function(){});
    }
    ov.remove();
    onContinue();
  };
}

/* ===== SATPATH ECONOMY: PATHCOIN, ENERGY & SUPPLY SHOP ===== */
var ECON_KEY = 'satpath_econ_v2';
var ENERGY_REGEN_MS = 3 * 3600 * 1000;
/* ===== MINIMAL SVG ICON SET (inline, uses currentColor — works in light & dark theme) ===== */
var SP_ICO = {
  logo: '<path d="M16.6 7.2c-.5-1.7-2.4-2.7-4.6-2.7-2.6 0-4.5 1.2-4.5 3 0 4.6 9 2.4 9 7 0 1.9-1.9 3-4.5 3-2.3 0-4.2-1-4.7-2.8"/>',
  coin: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5.2"/>',
  camp: '<path d="M3 20 12 4l9 16H3z"/><path d="M9.8 20 12 15.5l2.2 4.5"/>',
  map: '<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2z"/><path d="M9 4v14M15 6v14"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="m15.6 8.4-1.9 5.3-5.3 1.9 1.9-5.3z"/>',
  bolt: '<path d="M13 3 5 13.5h6L10 21l8-10.5h-6z"/>',
  trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5v1.5A3 3 0 0 0 8 10.5M16 6h3v1.5a3 3 0 0 1-3 3M12 13v4M9 20h6M10 17h4"/>',
  crown: '<path d="M4.5 8 8.3 11.5 12 5l3.7 6.5L19.5 8 18 18H6z"/><path d="M6 21h12"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  book: '<path d="M12 6.5C10.5 5 8 4.5 4 4.5v13c4 0 6.5.5 8 2 1.5-1.5 4-2 8-2v-13c-4 0-6.5.5-8 2z"/><path d="M12 6.5v13"/>',
  math: '<path d="M5 7h6M8 4v6M14 7h6M5.5 14.5l5 5M10.5 14.5l-5 5M14 15.5h6M14 18.5h6"/>',
  pen: '<path d="m4 20 1-4L16.5 4.5a2.1 2.1 0 0 1 3 3L8 19z"/><path d="m14.5 6.5 3 3"/>'
};
function spIco(name, cls, style, sw) {
  return '<svg class="' + (cls == null ? 'ui-ic' : cls) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (sw || '1.9') + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"' + (style ? ' style="' + style + '"' : '') + '>' + (SP_ICO[name] || '') + '</svg>';
}
var IC_MAP_HTML    = spIco('map');
var IC_COMPAS_HTML = spIco('compass');
var IC_COIN_HTML   = spIco('coin');
var IC_CAMP_HTML   = spIco('camp');
var IC_ENERGY_HTML = spIco('bolt');
var IC_ART_HTML    = spIco('trophy');
var IC_ART_LG_HTML = spIco('trophy','ui-ic-lg');
var IC_LORD_HTML   = spIco('crown');
var IC_LORD_SM_HTML= spIco('crown','ui-ic-sm');
var IC_AIM_HTML    = spIco('target');
var IC_BOOK_HTML   = spIco('book');
var IC_BOOK_SM_HTML= spIco('book','ui-ic-sm');
var IC_MATH_HTML   = spIco('math');

function getRawEcon() {
  try {
    var d = JSON.parse(spGet(ECON_KEY)) || {};
    var today = new Date().toISOString().slice(0, 10);
    return {
      coins: typeof d.coins === 'number' ? d.coins : 100,
      energy: typeof d.energy === 'number' ? d.energy : 5,
      maxEnergy: d.maxEnergy || 5,
      compass: !!d.compass,
      crest: !!d.crest,
      lastEnergyTs: d.lastEnergyTs || Date.now(),
      dailyRationDate: d.dailyRationDate || '',
      drillRewardsDate: d.drillRewardsDate === today ? today : today,
      drillRewardsCount: d.drillRewardsDate === today ? (d.drillRewardsCount || 0) : 0,
      mockRewarded: d.mockRewarded || {}
    };
  } catch (e) {
    return {
      coins: 100, energy: 5, maxEnergy: 5, compass: false, crest: false,
      lastEnergyTs: Date.now(), dailyRationDate: '',
      drillRewardsDate: new Date().toISOString().slice(0, 10), drillRewardsCount: 0,
      mockRewarded: {}
    };
  }
}

function getEcon() {
  var st = getRawEcon();
  var now = Date.now();
  if (st.energy < st.maxEnergy) {
    var elapsed = now - st.lastEnergyTs;
    if (elapsed >= ENERGY_REGEN_MS) {
      var gained = Math.floor(elapsed / ENERGY_REGEN_MS);
      st.energy = Math.min(st.maxEnergy, st.energy + gained);
      st.lastEnergyTs = st.energy >= st.maxEnergy ? now : st.lastEnergyTs + gained * ENERGY_REGEN_MS;
      try { spSet(ECON_KEY, JSON.stringify(st)); } catch (e) {}
    }
  } else {
    st.lastEnergyTs = now;
  }
  return st;
}

function saveEcon(d) {
  try { spSet(ECON_KEY, JSON.stringify(d)); } catch (e) {}
  paintHud();
}

function formatRegenTime(ms) {
  if (ms <= 0) return '';
  var totalMins = Math.ceil(ms / 60000);
  var hrs = Math.floor(totalMins / 60);
  var mins = totalMins % 60;
  return hrs > 0 ? (hrs + 'h ' + (mins < 10 ? '0' : '') + mins + 'm') : (mins + 'm');
}

function getNextEnergyLeftMs() {
  var st = getEcon();
  if (st.energy >= st.maxEnergy) return 0;
  return Math.max(0, ENERGY_REGEN_MS - (Date.now() - st.lastEnergyTs));
}

function addCoins(amount, reason) {
  if (!amount) return;
  var e = getEcon();
  if (e.compass && amount > 0 && amount <= 40) {
    amount = Math.round(amount * 1.5);
  }
  e.coins = Math.max(0, e.coins + amount);
  saveEcon(e);
  if (reason) toast(IC_COIN_HTML + ' +' + amount + ' Pathcoins · ' + reason);
}

function addFreeEnergy(amount, reason) { return; }
function spendEnergy(cost) { return true; }

function miniHudHtml() {
  var e = getEcon();
  return '<button type="button" class="hud-pill coin" onclick="openSupplyShop()" title="Pathcoins" style="padding:4px 10px;font-size:12px">' +
    IC_COIN_HTML + ' <span class="q-hud-coins">' + e.coins.toLocaleString() + '</span> PC</button>';
}

function paintHud() {
  var e = getEcon();
  var cEl = document.getElementById('hudCoins');
  var crEl = document.getElementById('dashCrest');
  if (cEl) cEl.textContent = e.coins.toLocaleString();
  if (crEl) crEl.hidden = !e.crest;
  document.querySelectorAll('.q-hud-coins').forEach(function(el) {
    el.textContent = e.coins.toLocaleString();
  });
}

/* ===== EXPLORER PROFILE, MINIMALIST AVATARS & ARCHIPELAGO SKINS ===== */
var AVATAR_ITEMS = [
  { id: 'av_default', ico: 'compass', name: 'Archipelago Scout', cost: 0 },
  { id: 'av_anchor',  ico: 'anchor',  name: 'Deep Sea Captain',  cost: 150 },
  { id: 'av_feather', ico: 'feather', name: 'Athena Scholar',    cost: 200 },
  { id: 'av_shield',  ico: 'shield',  name: 'Citadel Guardian',  cost: 300 },
  { id: 'av_zap',     ico: 'zap',     name: 'Storm Navigator',   cost: 350 },
  { id: 'av_crown',   ico: 'crown',   name: 'Sovereign',         cost: 500 }
];
var SKIN_ITEMS = [
  { id: 'default',  name: 'Emerald Atoll (Default)', color: '#22a381', cost: 0 },
  { id: 'lagoon',   name: 'Sunlit Amber Lagoon',     color: '#d97706', cost: 250 },
  { id: 'trench',   name: 'Deep Ocean Trench',       color: '#0284c7', cost: 300 },
  { id: 'volcanic', name: 'Volcanic Obsidian',       color: '#e11d48', cost: 350 },
  { id: 'biolum',   name: 'Bioluminescent Reef',     color: '#0d9488', cost: 400 },
  { id: 'sovereign',name: 'Royal Sovereign',         color: '#7c3aed', cost: 500 }
];
var TITLE_ITEMS = [
  { id: 't_scout',   name: 'Island Scout',       cost: 0 },
  { id: 't_scholar', name: '1600 Scholar',       cost: 200 },
  { id: 't_blitz',   name: 'Blitz Grandmaster',  cost: 300 },
  { id: 't_lord',    name: 'Archipelago Lord',   cost: 450 }
];

function renderAvatarIcon(avKey, size) {
  var validKeys = ['compass', 'anchor', 'feather', 'shield', 'zap', 'crown'];
  var key = validKeys.indexOf(avKey) >= 0 ? avKey : 'compass';
  return spSvg(key, size || 20);
}

function getProfile() {
  try {
    var p = JSON.parse(spGet('satpath_profile_v1')) || {};
    var defName = (typeof FBU !== 'undefined' && FBU && (FBU.displayName || FBU.email)) ? (FBU.displayName || FBU.email.split('@')[0]) : '';
    var av = p.avatar || 'compass';
    if (['compass','anchor','feather','shield','zap','crown','google'].indexOf(av) < 0) av = 'compass';
    return {
      name: p.name || defName || 'Explorer',
      avatar: av,
      skin: p.skin || 'default',
      title: p.title || 'Island Scout',
      unlocked: p.unlocked || ['av_default', 'default', 't_scout']
    };
  } catch (e) {
    return { name: 'Explorer', avatar: 'compass', skin: 'default', title: 'Island Scout', unlocked: ['av_default', 'default', 't_scout'] };
  }
}

function saveProfile(p) {
  try { spSet('satpath_profile_v1', JSON.stringify(p)); } catch (e) {}
  applyProfileUI();
}

function applyProfileUI() {
  var p = getProfile();
  var u = (typeof FBU !== 'undefined') ? FBU : null;
  var displayName = (p.name && p.name !== 'Explorer') ? p.name : (u && (u.displayName || u.email) ? (u.displayName || u.email.split('@')[0]) : (p.name || 'Explorer'));
  if (p.skin && p.skin !== 'default') {
    document.documentElement.setAttribute('data-skin', p.skin);
  } else {
    document.documentElement.removeAttribute('data-skin');
  }
  var dName = document.getElementById('dashExplorerName');
  if (dName) dName.textContent = displayName;
  var dTitle = document.getElementById('dashTitleBadge');
  if (dTitle) dTitle.textContent = (p.title || 'Island Scout');
  var sName = document.getElementById('sideName');
  if (sName) sName.textContent = displayName;
  var sTitle = document.getElementById('sideTitle');
  if (sTitle) sTitle.textContent = (p.title || 'Island Scout') + ' · Profile';
  var sAv = document.getElementById('sideAv');
  if (sAv) {
    if (u && u.photoURL && p.avatar === 'google') {
      sAv.innerHTML = '';
      sAv.style.background = 'url(' + encodeURI(u.photoURL) + ') center/cover';
    } else {
      sAv.style.background = 'var(--acc2)';
      sAv.innerHTML = renderAvatarIcon(p.avatar, 16);
    }
  }
}

function openProfileModal() {
  var ov = document.createElement('div');
  ov.style.cssText = 'position:fixed;inset:0;z-index:110;background:rgba(6,21,23,0.78);backdrop-filter:blur(4px);overflow:auto;padding:24px;display:grid;place-items:center';
  function render() {
    var p = getProfile();
    var e = getEcon();
    ov.innerHTML = '<div class="qb" style="max-width:560px;width:100%;border-radius:28px;border:2px solid var(--sand-line);box-shadow:0 20px 50px rgba(0,0,0,0.45)">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:14px;border-bottom:1.5px dashed var(--line)">' +
      '<div><small style="color:var(--sand);font-weight:800;letter-spacing:.08em;text-transform:uppercase">EXPLORER PASSPORT</small><h2 style="font-size:22px;font-weight:800">Edit Your Profile</h2></div>' +
      '<div style="display:flex;align-items:center;gap:8px"><span class="hud-pill coin">' + IC_COIN_HTML + ' ' + e.coins.toLocaleString() + ' PC</span><button id="pfClose" class="tbtn">✕</button></div></div>' +
      '<div style="margin:16px 0">' +
      '<label style="font-size:12px;font-weight:800;color:var(--mut);text-transform:uppercase;display:block;margin-bottom:6px">Display Name (Shown in Greeting &amp; Profile)</label>' +
      '<div style="display:flex;gap:8px"><input id="pfNameInp" class="qin" style="font-size:16px;padding:10px 14px;text-align:left" value="' + lbEsc(p.name) + '" placeholder="Enter your name...">' +
      '<button class="cta-amber" id="pfSaveName" style="padding:10px 18px;font-size:13px;white-space:nowrap">Save Name</button></div></div>' +
      '<div style="margin:16px 0">' +
      '<label style="font-size:12px;font-weight:800;color:var(--mut);text-transform:uppercase;display:block;margin-bottom:8px">Choose Minimalist Emblem</label>' +
      '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">' +
      AVATAR_ITEMS.map(function(item) {
        var unl = p.unlocked.indexOf(item.id) >= 0 || item.cost === 0;
        var act = p.avatar === item.ico;
        return '<button class="card" data-av="' + item.id + '" style="padding:12px 10px;border-radius:16px;text-align:center;border-color:' + (act ? 'var(--sand)' : 'var(--line)') + ';background:' + (act ? 'var(--sand-bg)' : 'var(--panel2)') + '">' +
          '<div style="color:var(--acc);display:flex;justify-content:center;margin-bottom:4px">' + renderAvatarIcon(item.ico, 24) + '</div>' +
          '<b style="font-size:12px;display:block;margin-top:2px">' + item.name + '</b>' +
          '<small style="font-size:11px;color:' + (act ? 'var(--sand)' : 'var(--mut)') + ';font-weight:700">' + (act ? 'Equipped ✓' : (unl ? 'Equip' : item.cost + ' PC')) + '</small></button>';
      }).join('') + '</div></div>' +
      '<div style="margin:16px 0">' +
      '<label style="font-size:12px;font-weight:800;color:var(--mut);text-transform:uppercase;display:block;margin-bottom:8px">Archipelago Theme Skin</label>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">' +
      SKIN_ITEMS.map(function(sk) {
        var unl = p.unlocked.indexOf(sk.id) >= 0 || sk.cost === 0;
        var act = p.skin === sk.id;
        return '<button class="card" data-sk="' + sk.id + '" style="padding:10px 12px;border-radius:14px;display:flex;align-items:center;gap:10px;border-color:' + (act ? 'var(--sand)' : 'var(--line)') + '">' +
          '<span style="width:20px;height:20px;border-radius:50%;background:' + sk.color + ';flex:none;border:2px solid #fff"></span>' +
          '<div style="flex:1;min-width:0"><b style="font-size:12px;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + sk.name + '</b>' +
          '<small style="font-size:11px;color:' + (act ? 'var(--sand)' : 'var(--mut)') + ';font-weight:700">' + (act ? 'Active ✓' : (unl ? 'Apply' : sk.cost + ' PC')) + '</small></div></button>';
      }).join('') + '</div></div>' +
      '<div style="margin:16px 0 6px">' +
      '<label style="font-size:12px;font-weight:800;color:var(--mut);text-transform:uppercase;display:block;margin-bottom:8px">Explorer Title</label>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">' +
      TITLE_ITEMS.map(function(ti) {
        var unl = p.unlocked.indexOf(ti.id) >= 0 || ti.cost === 0;
        var act = p.title === ti.name;
        return '<button class="card" data-ti="' + ti.id + '" style="padding:9px 12px;border-radius:14px;display:flex;justify-content:space-between;align-items:center;border-color:' + (act ? 'var(--sand)' : 'var(--line)') + '">' +
          '<b style="font-size:12px">' + ti.name + '</b>' +
          '<small style="font-size:11px;color:' + (act ? 'var(--sand)' : 'var(--mut)') + ';font-weight:700">' + (act ? '✓' : (unl ? 'Use' : ti.cost + ' PC')) + '</small></button>';
      }).join('') + '</div></div></div>';

    ov.querySelector('#pfClose').onclick = function() { ov.remove(); };
    ov.querySelector('#pfSaveName').onclick = function() {
      var val = ov.querySelector('#pfNameInp').value.trim();
      if (val) {
        p.name = val;
        saveProfile(p);
        toast('Profile name updated to ' + val);
        render();
      }
    };
    ov.querySelectorAll('[data-av]').forEach(function(b) {
      b.onclick = function() {
        var item = AVATAR_ITEMS.find(function(x){return x.id===b.dataset.av});
        if (!item) return;
        if (p.unlocked.indexOf(item.id) < 0 && item.cost > 0) {
          var ec = getEcon();
          if (ec.coins < item.cost) return toast('Not enough Pathcoins (' + item.cost + ' PC needed)');
          ec.coins -= item.cost; saveEcon(ec);
          p.unlocked.push(item.id);
          confetti();
        }
        p.avatar = item.ico;
        saveProfile(p); render();
      };
    });
    ov.querySelectorAll('[data-sk]').forEach(function(b) {
      b.onclick = function() {
        var item = SKIN_ITEMS.find(function(x){return x.id===b.dataset.sk});
        if (!item) return;
        if (p.unlocked.indexOf(item.id) < 0 && item.cost > 0) {
          var ec = getEcon();
          if (ec.coins < item.cost) return toast('Not enough Pathcoins (' + item.cost + ' PC needed)');
          ec.coins -= item.cost; saveEcon(ec);
          p.unlocked.push(item.id);
          confetti();
        }
        p.skin = item.id;
        saveProfile(p); render();
      };
    });
    ov.querySelectorAll('[data-ti]').forEach(function(b) {
      b.onclick = function() {
        var item = TITLE_ITEMS.find(function(x){return x.id===b.dataset.ti});
        if (!item) return;
        if (p.unlocked.indexOf(item.id) < 0 && item.cost > 0) {
          var ec = getEcon();
          if (ec.coins < item.cost) return toast('Not enough Pathcoins (' + item.cost + ' PC needed)');
          ec.coins -= item.cost; saveEcon(ec);
          p.unlocked.push(item.id);
          confetti();
        }
        p.title = item.name;
        saveProfile(p); render();
      };
    });
  }
  document.body.appendChild(ov);
  ov.addEventListener('click', function(e) { if (e.target === ov) ov.remove(); });
  render();
}

var shopTab = 'gear';
function openSupplyShop() {
  var ov = document.createElement('div');
  ov.style.cssText = 'position:fixed;inset:0;z-index:95;background:rgba(6,21,23,0.78);backdrop-filter:blur(4px);overflow:auto;padding:24px;display:grid;place-items:center';
  function renderShop() {
    var cur = getEcon();
    var p = getProfile();
    var today = new Date().toISOString().slice(0, 10);
    var rationClaimed = (cur.dailyRationDate === today);

    var bodyHtml = '';
    if (shopTab === 'gear') {
      bodyHtml = '<div style="display:grid;gap:12px">' +
        '<div class="card" style="padding:15px 18px;border-radius:20px;display:flex;justify-content:space-between;align-items:center;gap:12px;border-color:var(--acc)">' +
        '<div><b style="font-size:15px;display:flex;align-items:center;gap:6px">' + IC_CAMP_HTML + ' Daily Base Camp Chest (+25 ' + IC_COIN_HTML + ')</b><div class="sub" style="font-size:12px;margin-top:2px">Free daily Pathcoin supply drop for explorers. Resets every day at midnight.</div></div>' +
        '<button class="cta" data-buy="daily_ration" ' + (rationClaimed ? 'disabled style="opacity:.5;padding:9px 15px;font-size:12.5px;border-radius:12px;white-space:nowrap"' : 'style="padding:9px 15px;font-size:12.5px;border-radius:12px;white-space:nowrap"') + '>' + (rationClaimed ? 'Claimed Today ✓' : 'Claim Free +25 PC') + '</button></div>' +
        '<div class="card" style="padding:15px 18px;border-radius:20px;display:flex;justify-content:space-between;align-items:center;gap:12px">' +
        '<div><b style="font-size:15px;display:flex;align-items:center;gap:6px">' + IC_COMPAS_HTML + ' Amber Compass Boost (1.5× PC) ' + (cur.compass ? '<span class="tag n" style="margin-left:6px">ACTIVE</span>' : '') + '</b><div class="sub" style="font-size:12px;margin-top:2px">Permanently boosts Pathcoin rewards from Island clears, drills &amp; Stars by 50%.</div></div>' +
        '<button class="cta-amber" data-buy="compass" ' + (cur.compass ? 'disabled style="opacity:.5;padding:9px 15px;font-size:12.5px"' : 'style="padding:9px 15px;font-size:12.5px;white-space:nowrap"') + '>' + (cur.compass ? 'Active ✓' : IC_COIN_HTML + ' 900 PC') + '</button></div>' +
        '<div class="card" style="padding:15px 18px;border-radius:20px;display:flex;justify-content:space-between;align-items:center;gap:12px">' +
        '<div><b style="font-size:15px;display:flex;align-items:center;gap:6px">' + IC_LORD_HTML + ' Navigator&apos;s Golden Crest ' + (cur.crest ? '<span class="tag n" style="margin-left:6px">UNLOCKED</span>' : '') + '</b><div class="sub" style="font-size:12px;margin-top:2px">Prestigious emblem displaying the royal navigator crown at Base Camp.</div></div>' +
        '<button class="cta-amber" data-buy="crest" ' + (cur.crest ? 'disabled style="opacity:.5;padding:9px 15px;font-size:12.5px"' : 'style="padding:9px 15px;font-size:12.5px;white-space:nowrap"') + '>' + (cur.crest ? 'Unlocked ✓' : IC_COIN_HTML + ' 1,800 PC') + '</button></div>' +
        '</div>';
    } else {
      bodyHtml = '<div style="display:grid;gap:14px">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;background:var(--panel2);padding:12px 16px;border-radius:16px;border:1px solid var(--line)">' +
        '<div style="display:flex;align-items:center;gap:10px"><span style="width:36px;height:36px;border-radius:10px;background:var(--acc2);color:#fff;display:grid;place-items:center">' + renderAvatarIcon(p.avatar, 20) + '</span><div><b style="font-size:14px">' + lbEsc(p.name) + '</b><small style="display:block;color:var(--sand);font-weight:700">' + lbEsc(p.title) + '</small></div></div>' +
        '<button class="cta" id="shEditProfBtn" style="padding:8px 14px;font-size:12px;border-radius:12px">Edit Name &amp; Profile</button></div>' +
        '<div><b style="font-size:13px;color:var(--mut);text-transform:uppercase;display:block;margin-bottom:8px">Explorer Emblems</b><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">' +
        AVATAR_ITEMS.map(function(item) {
          var unl = p.unlocked.indexOf(item.id) >= 0 || item.cost === 0;
          var act = p.avatar === item.ico;
          return '<button class="card" data-cos-av="' + item.id + '" style="padding:12px 10px;border-radius:16px;text-align:center;border-color:' + (act ? 'var(--sand)' : 'var(--line)') + '">' +
            '<div style="color:var(--acc);display:flex;justify-content:center;margin-bottom:4px">' + renderAvatarIcon(item.ico, 22) + '</div><b style="font-size:12px;display:block;margin-top:3px">' + item.name + '</b>' +
            '<small style="color:' + (act ? 'var(--sand)' : 'var(--acc)') + ';font-weight:800;font-size:11px">' + (act ? 'Equipped ✓' : (unl ? 'Equip' : item.cost + ' PC')) + '</small></button>';
        }).join('') + '</div></div>' +
        '<div><b style="font-size:13px;color:var(--mut);text-transform:uppercase;display:block;margin-bottom:8px">Archipelago Theme Skins</b><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">' +
        SKIN_ITEMS.map(function(sk) {
          var unl = p.unlocked.indexOf(sk.id) >= 0 || sk.cost === 0;
          var act = p.skin === sk.id;
          return '<button class="card" data-cos-sk="' + sk.id + '" style="padding:10px 12px;border-radius:14px;display:flex;align-items:center;gap:10px;border-color:' + (act ? 'var(--sand)' : 'var(--line)') + '">' +
            '<span style="width:20px;height:20px;border-radius:50%;background:' + sk.color + ';flex:none;border:2px solid #fff"></span>' +
            '<div style="flex:1;min-width:0"><b style="font-size:12px;display:block">' + sk.name + '</b>' +
            '<small style="color:' + (act ? 'var(--sand)' : 'var(--acc)') + ';font-weight:800;font-size:11px">' + (act ? 'Active ✓' : (unl ? 'Apply' : sk.cost + ' PC')) + '</small></div></button>';
        }).join('') + '</div></div>' +
        '<div><b style="font-size:13px;color:var(--mut);text-transform:uppercase;display:block;margin-bottom:8px">Honorary Titles</b><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">' +
        TITLE_ITEMS.map(function(ti) {
          var unl = p.unlocked.indexOf(ti.id) >= 0 || ti.cost === 0;
          var act = p.title === ti.name;
          return '<button class="card" data-cos-ti="' + ti.id + '" style="padding:10px 12px;border-radius:14px;display:flex;justify-content:space-between;align-items:center;border-color:' + (act ? 'var(--sand)' : 'var(--line)') + '">' +
            '<b style="font-size:12px">' + ti.name + '</b>' +
            '<small style="color:' + (act ? 'var(--sand)' : 'var(--acc)') + ';font-weight:800;font-size:11px">' + (act ? 'Active ✓' : (unl ? 'Equip' : ti.cost + ' PC')) + '</small></button>';
        }).join('') + '</div></div></div>';
    }

    ov.innerHTML = '<div class="qb" style="max-width:620px;width:100%;border-radius:28px;border:2px solid var(--sand-line);box-shadow:0 20px 50px rgba(0,0,0,0.45)">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:14px;border-bottom:1.5px dashed var(--line)">' +
      '<div><div style="font-size:11px;font-weight:800;color:var(--sand);letter-spacing:.08em;text-transform:uppercase;display:flex;align-items:center;gap:6px">' + IC_CAMP_HTML + ' ARCHIPELAGO OUTPOST</div><h2 style="font-size:24px;font-weight:800;margin-top:2px">Explorer Supply Shop</h2></div>' +
      '<div style="display:flex;align-items:center;gap:10px"><span class="hud-pill coin">' + IC_COIN_HTML + ' ' + cur.coins.toLocaleString() + ' PC</span><button id="shClose" class="tbtn">✕</button></div>' +
      '</div>' +
      '<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;margin:14px 0;flex-wrap:wrap">' +
      '<div class="island-pills">' +
      '<button class="island-pill' + (shopTab === 'gear' ? ' on' : '') + '" data-shtab="gear">' + IC_COMPAS_HTML + ' Boosts &amp; Relics</button>' +
      '<button class="island-pill sand' + (shopTab === 'cosmetics' ? ' on' : '') + '" data-shtab="cosmetics">' + spSvg('layers', 14) + ' Skins, Emblems &amp; Titles</button>' +
      '</div>' +
      '</div>' +
      bodyHtml + '</div>';

    ov.querySelector('#shClose').onclick = function() { ov.remove(); };
    ov.querySelectorAll('[data-shtab]').forEach(function(tb) {
      tb.onclick = function() { shopTab = tb.dataset.shtab; renderShop(); };
    });
    var epBtn = ov.querySelector('#shEditProfBtn');
    if (epBtn) epBtn.onclick = function() { ov.remove(); openProfileModal(); };

    ov.querySelectorAll('[data-cos-av]').forEach(function(b) {
      b.onclick = function() {
        var item = AVATAR_ITEMS.find(function(x){return x.id===b.dataset.cosAv});
        if (!item) return;
        if (p.unlocked.indexOf(item.id) < 0 && item.cost > 0) {
          if (cur.coins < item.cost) return toast('Not enough Pathcoins (' + item.cost + ' PC)');
          cur.coins -= item.cost; saveEcon(cur); p.unlocked.push(item.id); confetti();
        }
        p.avatar = item.ico; saveProfile(p); renderShop();
      };
    });
    ov.querySelectorAll('[data-cos-sk]').forEach(function(b) {
      b.onclick = function() {
        var item = SKIN_ITEMS.find(function(x){return x.id===b.dataset.cosSk});
        if (!item) return;
        if (p.unlocked.indexOf(item.id) < 0 && item.cost > 0) {
          if (cur.coins < item.cost) return toast('Not enough Pathcoins (' + item.cost + ' PC)');
          cur.coins -= item.cost; saveEcon(cur); p.unlocked.push(item.id); confetti();
        }
        p.skin = item.id; saveProfile(p); renderShop();
      };
    });
    ov.querySelectorAll('[data-cos-ti]').forEach(function(b) {
      b.onclick = function() {
        var item = TITLE_ITEMS.find(function(x){return x.id===b.dataset.cosTi});
        if (!item) return;
        if (p.unlocked.indexOf(item.id) < 0 && item.cost > 0) {
          if (cur.coins < item.cost) return toast('Not enough Pathcoins (' + item.cost + ' PC)');
          cur.coins -= item.cost; saveEcon(cur); p.unlocked.push(item.id); confetti();
        }
        p.title = item.name; saveProfile(p); renderShop();
      };
    });

    ov.querySelectorAll('[data-buy]').forEach(function(btn) {
      btn.onclick = function() {
        var k = btn.dataset.buy, st = getEcon();
        var todayStr = new Date().toISOString().slice(0, 10);
        if (k === 'daily_ration') {
          if (st.dailyRationDate === todayStr) return toast('Already claimed today');
          st.dailyRationDate = todayStr;
          st.coins += 25;
          saveEcon(st); renderShop(); confetti(); toast(IC_COIN_HTML + ' +25 Free Daily Pathcoins claimed');
        } else if (k === 'compass' && !st.compass) {
          if (st.coins < 900) return toast('Not enough Pathcoins (need 900 PC)');
          st.coins -= 900; st.compass = true;
          saveEcon(st); renderShop(); confetti(); toast(IC_COMPAS_HTML + ' Amber Compass 1.5× PC boost activated');
        } else if (k === 'crest' && !st.crest) {
          if (st.coins < 1800) return toast('Not enough Pathcoins (need 1,800 PC)');
          st.coins -= 1800; st.crest = true;
          saveEcon(st); renderShop(); confetti(); toast(IC_LORD_HTML + ' Navigator&apos;s Golden Crest unlocked');
        }
      };
    });
  }
  document.body.appendChild(ov);
  ov.addEventListener('click', function(ev) { if (ev.target === ov) ov.remove(); });
  renderShop();
}

/* ===== MOCK EXAMS CATALOG (Roman Numerals I - VIII & Island Routes) ===== */
var MOCK_EXPEDITIONS = [
  { t: 1, roman: 'I',    code: 'Mock 01 · Coral Reef',      sub: 'Shallow Atoll Expedition · Static Form A',  reward: 120, accent: '#22a381' },
  { t: 2, roman: 'II',   code: 'Mock 02 · Emerald Atoll',   sub: 'Lagoon Current Expedition · Static Form B', reward: 120, accent: '#1f9d8a' },
  { t: 3, roman: 'III',  code: 'Mock 03 · Amber Lagoon',    sub: 'Sunlit Shoals Expedition · Static Form C',  reward: 120, accent: '#e59a16' },
  { t: 4, roman: 'IV',   code: 'Mock 04 · Basalt Ridge',    sub: 'Volcanic Cliffs Expedition · Static Form D', reward: 150, accent: '#2b7f9c' },
  { t: 5, roman: 'V',    code: 'Mock 05 · Sunken Caldera',  sub: 'Deep Trench Expedition · Static Form E',    reward: 150, accent: '#2fa59f' },
  { t: 6, roman: 'VI',   code: 'Mock 06 · Obsidian Peak',   sub: 'Summit Spire Expedition · Static Form F',   reward: 180, accent: '#3f8f7a' },
  { t: 7, roman: 'VII',  code: 'Mock 07 · Celestial Spire', sub: 'November Predictions · Static Form G',      reward: 200, accent: '#6366f1' },
  { t: 8, roman: 'VIII', code: 'Mock 08 · Astral Sanctum',  sub: 'December Master Finale · Static Form H',    reward: 220, accent: '#ec4899' }
];
var ptRouteFilter = 'rm';

function ptResult(t,res){
  if (document.fullscreenElement && document.exitFullscreen) {
    try { document.exitFullscreen(); } catch (e) {}
  }
  sessionStorage.removeItem('bb_fullscreen_active');
  saveMockSession(t, null);

  var S=ptLoad(),r=S[t]||{};
  var hadRW = !!r.r, hadM = !!r.m;
  ['r','m'].forEach(function(k){if(res[k])r[k]={score:res[k].score,a:res[k].o1.ok,b:res[k].o2.ok,hard:res[k].hard}});
  if(r.r&&r.m)r.total=r.r.score+r.m.score;S[t]=r;ptSave(S);
  var mockObj = MOCK_EXPEDITIONS[(t-1)%MOCK_EXPEDITIONS.length] || {code:'Mock 0'+t, reward:120};
  var earnedPc = 0;
  if (res.r && !hadRW) earnedPc += Math.round(mockObj.reward * 0.5);
  if (res.m && !hadM)  earnedPc += Math.round(mockObj.reward * 0.5);
  if (earnedPc > 0) addCoins(earnedPc, mockObj.code + ' first completion!');
  confetti(); setTimeout(confetti, 450);

  var dispScore = (res.r && res.m) ? (res.r.score + res.m.score) : (res.r ? res.r.score : (res.m ? res.m.score : (r.total || 800)));
  var maxPossible = (res.r && res.m) ? 1600 : 800;
  var minPossible = (res.r && res.m) ? 400 : 200;
  var pctVal = Math.max(0.05, Math.min(1, (dispScore - minPossible) / (maxPossible - minPossible)));
  var nationalPct = maxPossible === 1600
    ? (dispScore >= 1550 ? '99th+' : dispScore >= 1500 ? '98th' : dispScore >= 1400 ? '94th' : dispScore >= 1300 ? '87th' : dispScore >= 1200 ? '75th' : dispScore >= 1100 ? '59th' : '35th')
    : (dispScore >= 760 ? '99th' : dispScore >= 700 ? '93rd' : dispScore >= 650 ? '85th' : dispScore >= 600 ? '72nd' : '50th');

  var circum = 2 * Math.PI * 86;
  var targetOffset = Math.round(circum * (1 - pctVal));

  var ov=document.createElement('div');
  ov.style.cssText='position:fixed;inset:0;z-index:95;background:var(--bg);overflow:auto;padding:28px 20px';
  var h='<div style="max-width:860px;margin:0 auto;animation:up .45s ease">' +
   '<div class="atlas-hero" style="text-align:center;display:flex;flex-direction:column;align-items:center;gap:16px;padding:32px 24px;border:2px solid var(--sand-line)">' +
   '<div style="display:inline-flex;align-items:center;gap:8px;background:var(--sand-bg);border:1px solid var(--sand-line);color:var(--sand);padding:5px 14px;border-radius:99px;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase">' + spSvg('award', 15) + ' OFFICIAL MOCK EXAM SCORE REPORT</div>' +
   '<h1 style="font-size:32px;font-weight:800;margin:0">' + mockObj.code + '</h1>' +
   '<div class="score-ring-wrap">' +
   '<svg viewBox="0 0 200 200"><circle cx="100" cy="100" r="86" fill="none" stroke="var(--cell)" stroke-width="14"/><circle id="mockRingProg" cx="100" cy="100" r="86" fill="none" stroke="var(--sand)" stroke-width="14" stroke-linecap="round" stroke-dasharray="'+Math.round(circum)+'" stroke-dashoffset="'+Math.round(circum)+'" style="transition:stroke-dashoffset 1.3s cubic-bezier(.2,.8,.2,1)"/></svg>' +
   '<div class="score-ring-center"><small style="font-size:11px;font-weight:800;color:var(--mut);text-transform:uppercase;letter-spacing:.08em">' + (maxPossible===1600?'TOTAL SCORE':'SECTION SCORE') + '</small><div id="mockBigScoreNum" style="font-size:52px;font-weight:800;color:var(--tx);line-height:1.05;letter-spacing:-.03em">' + minPossible + '</div><small style="color:var(--sand);font-weight:800;font-size:12px">' + nationalPct + ' Percentile</small></div>' +
   '</div>' +
   '<div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center">' +
   '<span class="hud-pill coin" style="font-size:14px;padding:8px 16px">' + IC_COIN_HTML + ' ' + (earnedPc > 0 ? '+'+earnedPc+' Pathcoins Earned!' : 'Practice Complete') + '</span>' +
   '<button class="hud-pill" id="ptResVocBtn" style="font-size:13px;padding:8px 16px">' + spSvg('book', 14) + ' Review Saved Words (' + getVocabList().length + ')</button>' +
   '</div></div>';

  h += '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:18px;margin-top:20px">';
  ['r','m'].forEach(function(k){
   var x=res[k];if(!x)return;
   var secTot = x.o1.n + x.o2.n, secOk = x.o1.ok + x.o2.ok, secPct = Math.round(secOk/secTot*100);
   h += '<div class="card" style="padding:22px;border-radius:24px">' +
    '<div style="display:flex;justify-content:space-between;align-items:flex-start">' +
    '<div><span class="tag n" style="margin:0">' + (k==='r'?'READING &amp; WRITING':'MATH SECTION') + '</span><h3 style="font-size:20px;font-weight:800;margin-top:8px">' + (k==='r'?'Evidence-Based R&amp;W':'Digital SAT Math') + '</h3></div>' +
    '<div style="text-align:right"><div style="font-size:36px;font-weight:800;color:var(--acc);line-height:1">' + x.score + '</div><small style="color:var(--mut);font-size:11px">out of 800</small></div></div>' +
    '<div class="bar" style="margin:14px 0"><div style="width:' + secPct + '%"></div></div>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px">' +
    '<div style="background:var(--panel2);padding:10px 12px;border-radius:14px;border:1px solid var(--line)"><small style="color:var(--mut);font-size:11px;display:block">Module 1 (Baseline)</small><b style="font-size:16px">' + x.o1.ok + ' / ' + x.o1.n + '</b></div>' +
    '<div style="background:var(--panel2);padding:10px 12px;border-radius:14px;border:1px solid var(--line)"><small style="color:var(--mut);font-size:11px;display:block">Module 2 (' + (x.hard?'Harder':'Standard') + ')</small><b style="font-size:16px;color:var(--sand)">' + x.o2.ok + ' / ' + x.o2.n + '</b></div>' +
    '</div></div>';
  });
  h += '</div>';

  ['r','m'].forEach(function(k){
   var x=res[k];if(!x)return;
   h+='<div class="card" style="padding:20px 22px;margin-top:18px;border-radius:24px"><b style="font-size:17px;display:block;margin-bottom:8px">Detailed Question Breakdown · '+(k==='r'?'Reading &amp; Writing':'Math')+'</b>';
   [x.o1,x.o2].forEach(function(o,mi){
    h+='<details style="margin-top:10px;background:var(--panel2);padding:12px 16px;border-radius:16px;border:1px solid var(--line)"><summary style="cursor:pointer;font-weight:800;color:var(--acc);font-size:14px">Module '+(mi+1)+' Question-by-Question Review ('+o.ok+'/'+o.n+' correct)</summary><div style="margin-top:10px">';
    o.qs.forEach(function(q,i){var a=o.ans[i],g=ptRight(q,a),fx=function(s){return q.rw?String(s):rHTML(s)};
     h+='<div style="padding:12px 0;border-top:1px solid var(--line);font-size:13.5px"><div style="display:flex;justify-content:space-between;align-items:center"><b style="color:'+(g?'var(--acc)':'#e74c3c')+'">Question '+(i+1)+' · '+(g?'✓ Correct':'✗ Incorrect')+'</b><span class="tag" style="margin:0;font-size:10px">'+q.top+'</span></div><div style="margin:8px 0;line-height:1.55">'+fx(q.q)+'</div><div style="background:var(--panel);padding:8px 12px;border-radius:10px;font-size:12.5px">Your answer: <b style="color:'+(g?'var(--acc)':'#e74c3c')+'">'+(a?fx(a):'Unanswered')+'</b> &nbsp;·&nbsp; Correct answer: <b style="color:var(--acc)">'+fx(q.ans)+'</b></div></div>'});
    h+='</div></details>'});
   h+='</div>'});

  ov.innerHTML=h+'<div style="display:flex;gap:12px;justify-content:center;margin:24px 0 40px"><button class="cta-amber" id="ptX" style="padding:14px 28px;font-size:15px">Return to Mock Exams →</button></div></div>';
  document.body.appendChild(ov);

  var numEl = ov.querySelector('#mockBigScoreNum');
  var ringEl = ov.querySelector('#mockRingProg');
  setTimeout(function() {
    if (ringEl) ringEl.style.strokeDashoffset = String(targetOffset);
  }, 80);
  var t0 = performance.now();
  (function animScore(now) {
    var prog = Math.min(1, (now - t0) / 1200);
    var ease = 1 - Math.pow(1 - prog, 3);
    if (numEl) numEl.textContent = Math.round(minPossible + (dispScore - minPossible) * ease);
    if (prog < 1) requestAnimationFrame(animScore);
  })(t0);

  var vocBtn = ov.querySelector('#ptResVocBtn');
  if (vocBtn) vocBtn.onclick = openVocabDrawer;
  ov.querySelector('#ptX').onclick=function(){ov.remove();buildPT()};
}

function buildPT(){
 var el=document.getElementById('vPT'),S=ptLoad();
 if(!el)return;
 var modeLabel = ptRouteFilter === 'rm' ? 'Full 4-Module Route' : ptRouteFilter === 'r' ? 'R&W Only (2 Modules)' : 'Math Only (2 Modules)';
 var h = '<div class="atlas-hero" style="margin-bottom:22px">' +
  '<div>' +
  '<div style="font-size:11.5px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--sand);margin-bottom:4px;display:flex;align-items:center;gap:6px">' + IC_COMPAS_HTML + ' ARCHIPELAGO MOCK EXPEDITIONS</div>' +
  '<h1>Mock Exams</h1>' +
  '<p class="sub">Navigate the 4-stage adaptive island trail. Click any word during an exam to highlight and save it to your Vocabulary, or pause and resume anytime.</p>' +
  '</div>' +
  '<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">' +
  '<button class="hud-pill coin" id="ptOpenVocabHero" style="padding:8px 14px;font-size:12.5px">' + spSvg('book', 14) + ' Saved Words (' + getVocabList().length + ')</button>' +
  '<div class="island-pills">' +
  '<button class="island-pill'+(ptRouteFilter==='rm'?' sand on':'')+'" data-ptmode="rm">' + IC_COMPAS_HTML + ' Full Route</button>' +
  '<button class="island-pill'+(ptRouteFilter==='r'?' sand on':'')+'" data-ptmode="r">' + IC_BOOK_HTML + ' R&amp;W Only</button>' +
  '<button class="island-pill'+(ptRouteFilter==='m'?' sand on':'')+'" data-ptmode="m">' + IC_MATH_HTML + ' Math Only</button>' +
  '</div></div>' +
  '</div>' +
  '<div class="mock-cards-grid">';

 MOCK_EXPEDITIONS.forEach(function(item){
  var t = item.t, r = S[t] || {};
  var savedSess = getMockSession(t);
  var hasRW = !!r.r, hasM = !!r.m, hasFull = !!r.total;
  var bestTxt = hasFull ? r.total : (hasRW && ptRouteFilter==='r' ? r.r.score : (hasM && ptRouteFilter==='m' ? r.m.score : (hasRW || hasM ? (hasRW?'R&W '+r.r.score:'')+(hasRW&&hasM?' · ':'')+(hasM?'Math '+r.m.score:'') : 'Uncharted')));
  var dimRW = (ptRouteFilter === 'm') ? ' dim' : '';
  var dimM  = (ptRouteFilter === 'r') ? ' dim' : '';
  var pcReward = ptRouteFilter === 'rm' ? item.reward : Math.round(item.reward * 0.5);
  var alreadyClaimed = ptRouteFilter === 'rm' ? hasFull : (ptRouteFilter === 'r' ? hasRW : hasM);
  var mainBtnLbl = ptRouteFilter === 'rm' ? (hasFull ? 'Retake Expedition ↻' : 'Embark Full Mock →') : (ptRouteFilter === 'r' ? 'Start R&W Route →' : 'Start Math Route →');

  h += '<div class="mock-isl-card'+(hasFull?' done-mock':'')+'">' +
   '<div>' +
   '<div class="mock-top">' +
   '<div style="display:flex;gap:12px;align-items:center">' +
   '<div class="mock-emblem" style="border-color:'+item.accent+'">'+item.roman+'</div>' +
   '<div><div style="font-size:17px;font-weight:800;color:var(--tx)">'+item.code+'</div><div style="font-size:12px;color:var(--mut);margin-top:2px">'+item.sub+'</div></div>' +
   '</div>' +
   '<span class="mock-reward-pill">' + IC_COIN_HTML + ' ' + (alreadyClaimed ? 'Claimed ✓' : '+'+pcReward+' PC') + '</span>' +
   '</div>' +
   (savedSess ? '<div style="margin-top:12px;padding:10px 14px;border-radius:14px;background:var(--sand-bg);border:1.5px solid var(--sand-line);display:flex;justify-content:space-between;align-items:center;gap:8px"><small style="color:var(--sand);font-weight:800">' + spSvg('clock', 14) + ' In Progress · Saved Session Available</small><button class="chip" data-discard-mock="'+t+'" style="font-size:11px;padding:3px 8px">Reset</button></div>' : '') +
   '<div class="mock-route-box" style="margin-top:16px">' +
   '<div class="mock-route-lbl"><span style="display:inline-flex;align-items:center;gap:5px">' + IC_MAP_HTML + ' '+modeLabel+'</span><span>'+(hasFull?'✓ All 4 Waypoints Charted':(hasRW||hasM?'Partial Trail Charted':'4 Waypoints'))+'</span></div>' +
   '<div class="mock-trail-nodes">' +
   '<div class="m-node'+(hasRW?' done':'')+dimRW+'"><div class="m-dot">'+(hasRW?'✓':'1')+'</div><b>R&amp;W 1</b><small>'+(hasRW?r.r.a+'/27':'Baseline')+'</small></div>' +
   '<div class="m-node'+(hasRW?' done':'')+dimRW+'"><div class="m-dot">'+(hasRW?'✓':'2')+'</div><b>R&amp;W 2</b><small>'+(hasRW?r.r.b+'/27':'Adaptive')+'</small></div>' +
   '<div class="m-node'+(hasM?' done':'')+dimM+'"><div class="m-dot">'+(hasM?'✓':'3')+'</div><b>Math 1</b><small>'+(hasM?r.m.a+'/22':'Baseline')+'</small></div>' +
   '<div class="m-node'+(hasM?' done':'')+dimM+'"><div class="m-dot">'+(hasM?'✓':'4')+'</div><b>Math 2</b><small>'+(hasM?r.m.b+'/22':'Adaptive')+'</small></div>' +
   '</div>' +
   '</div>' +
   '</div>' +
   '<div class="mock-best-row">' +
   '<div><small style="display:block;font-size:11px;color:var(--mut);font-weight:700;text-transform:uppercase;letter-spacing:.05em">Best Result</small>' +
   '<div class="mock-score-badge"><b>'+bestTxt+'</b>'+(hasFull?'<small style="color:var(--mut);font-weight:600">R&amp;W '+r.r.score+' · Math '+r.m.score+'</small>':'')+'</div></div>' +
   '<div class="mock-actions">' +
   (savedSess ? '<button class="cta-amber" style="padding:10px 16px;font-size:13px;border-radius:14px" data-resume-pt="'+t+'">Resume Expedition →</button>' :
    (ptRouteFilter==='rm' ? '<button class="mock-sub-btn" data-pt="'+t+'" data-s="r" title="Practice Reading & Writing modules only">R&amp;W only</button><button class="mock-sub-btn" data-pt="'+t+'" data-s="m" title="Practice Math modules only">Math only</button>' : '') +
    '<button class="cta-amber" style="padding:10px 16px;font-size:13px;border-radius:14px" data-pt="'+t+'" data-s="'+ptRouteFilter+'">'+mainBtnLbl+'</button>') +
   '</div></div></div>';
 });

 el.innerHTML = h + '</div>';
 el.onclick = function(e){
  if (e.target.closest('#ptOpenVocabHero')) { show('voc'); return; }
  var disc = e.target.closest('[data-discard-mock]');
  if (disc) {
    saveMockSession(+disc.dataset.discardMock, null);
    toast('Saved session cleared');
    buildPT();
    return;
  }
  var resBtn = e.target.closest('[data-resume-pt]');
  if (resBtn) {
    var tId = +resBtn.dataset.resumePt;
    var sess = getMockSession(tId);
    if (sess) ptStart(tId, sess.secs, true);
    return;
  }
  var mBtn = e.target.closest('[data-ptmode]');
  if(mBtn){ ptRouteFilter = mBtn.dataset.ptmode; buildPT(); return; }
  var b = e.target.closest('[data-pt]');
  if(b) {
    saveMockSession(+b.dataset.pt, null);
    ptStart(+b.dataset.pt, b.dataset.s.split(''), false);
  }
 };
}
var renderPtCatalog = buildPT;

/* ===== ISLAND QUIZ RUNNER ===== */
function runQuiz(n, qs) {
  var doneList = n.rw ? getRDone() : getDone();
  var isFirstClear = doneList.indexOf(n.g) < 0;
  var entryCost = (n.ni === 4 ? 2 : 1);
  if (!spendEnergy(entryCost)) return;

  var clearRewards = [5, 15, 20, 25, 40];
  var firstReward = clearRewards[n.ni] || 20;
  var replayReward = Math.max(10, Math.round(firstReward * 0.5));

  var fx=function(s){return n.rw?wrapWordsForVocab(s):rHTML(s)};var i = 0, ok = 0, earnedInQuiz = 0, ov = document.createElement('div');
  ov.style.cssText = 'position:fixed;inset:0;z-index:80;background:var(--bg);overflow:auto;padding:24px';
  document.body.appendChild(ov);

  function close() { ov.remove(); paintHud(); }
  function showQ() {
    if (i >= qs.length) {
      var pct = Math.round(ok / qs.length * 100), pass = pct >= (n.min||80);
      var bonusGiven = 0;
      if (pass) {
        bonusGiven = isFirstClear ? firstReward : replayReward;
        addCoins(bonusGiven, n.type.l + (isFirstClear ? ' conquered!' : ' replay bonus!'));
      }
      var totalEarned = earnedInQuiz + bonusGiven;
      var rewardText = pass
        ? (' · <b style="color:var(--sand)">' + IC_COIN_HTML + ' +' + totalEarned + ' Pathcoins (' + earnedInQuiz + ' Qs + ' + bonusGiven + ' Bonus)</b>')
        : (' · <b style="color:var(--sand)">' + IC_COIN_HTML + ' +' + earnedInQuiz + ' PC</b> · <small style="color:#e74c3c">Need ' + (n.min||80) + '% for clear bonus</small>');
      ov.innerHTML = '<div class="qb" style="text-align:center;border-radius:26px"><div>' + IC_ART_LG_HTML + '</div><h2>' + (pass ? (isFirstClear ? 'Island Conquered!' : 'Island Practice Complete!') : 'Keep Exploring') + '</h2><div class="big" style="color:var(--sand)">' + pct + '%</div><p>' + ok + ' / ' + qs.length + ' correct' + rewardText + '</p><button class="cta-amber" id="qe" style="margin-top:16px">Back to Island Map</button></div>';
      var bn = ov.querySelector('.big'), t0 = performance.now();
      (function s(t) {
        var k = Math.min(1, (t - t0) / 900);
        bn.textContent = Math.round(pct * k) + '%';
        if (k < 1) requestAnimationFrame(s);
      })(t0);
      if (pass) confetti();
      document.getElementById('qe').onclick = function() { if (pass) (n.done||SATPath.complete)(n.g); close(); };
      return;
    }

    var q = qs[i];
    if (!q.top) q.top = n.topic || (n.rw ? RTOPS[n.ti] : TOPS[n.ti]);
    q.rw = !!n.rw;
    var modeBadge = '<span class="tag n" style="margin:0;font-size:10px">+5 PC/ans · Bonus +' + (isFirstClear ? firstReward : replayReward) + ' PC</span>';
    var wasOpen = ov.dataset.calcOpen === '1' && !n.rw;
    ov.innerHTML = '<div id="qSplitWrap" class="quiz-split-wrap' + (wasOpen ? ' calc-open' : '') + '"><div class="qb" style="border-radius:26px"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap"><div style="display:flex;align-items:center;gap:8px"><small style="font-weight:800">' + n.type.l + ' · ' + (i + 1) + '/' + qs.length + '</small>' + modeBadge + '</div><div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">' + miniHudHtml() + (n.rw ? '<button id="qAddWord" class="chip" style="font-weight:700;color:var(--sand);border-color:var(--sand-line)">' + spSvg('plus', 13) + ' Add Word</button>' : '') + '<button id="qcalc" style="background:' + (wasOpen ? '#e74c3c' : 'var(--acc2)') + ';color:#fff;padding:5px 12px;border-radius:10px;font-weight:bold;font-size:12px;">' + (wasOpen ? '✕ Close Calculator' : (IC_MATH_HTML + ' Desmos Calculator')) + '</button><button id="qx" class="tbtn">✕</button></div></div><div class="bar" style="margin:12px 0"><div style="width:' + (i / qs.length * 100) + '%"></div></div><div id="qTextBody" style="font-size:20px;line-height:1.6;margin:18px 0">' + fx(q.q) + '</div><div id="qa"></div><div id="qf"></div></div><div id="q-panel" class="quiz-calc-pane"></div></div>';

    var a = document.getElementById('qa'), f = document.getElementById('qf'), done = false;
    document.getElementById('qx').onclick = close;
    var qAddW = document.getElementById('qAddWord');
    if (qAddW) qAddW.onclick = function() { openAddWordModal(ov.querySelector('#qTextBody').textContent.replace(/\s+/g,' ').trim().slice(0,130)); };
    bindVocabClicksOnContainer(ov.querySelector('#qTextBody'));

    var qSplitWrap = document.getElementById('qSplitWrap');
    var qPanel = document.getElementById('q-panel');
    var qCalcBtn = document.getElementById('qcalc');if(n.rw)qCalcBtn.style.display='none';
    var qCalculator = null;
    function mountQCalc() {
      if (!qCalculator && window.Desmos) {
        qCalculator = createFullDesmos(qPanel);
      }
      if (qCalculator) setTimeout(function() { qCalculator.resize(); }, 35);
    }
    if (wasOpen) mountQCalc();
    qCalcBtn.onclick = function() {
      if (!qSplitWrap.classList.contains('calc-open')) {
        qSplitWrap.classList.add('calc-open');
        ov.dataset.calcOpen = '1';
        qCalcBtn.style.background = '#e74c3c';
        qCalcBtn.innerHTML = '✕ Close Calculator';
        mountQCalc();
      } else {
        qSplitWrap.classList.remove('calc-open');
        ov.dataset.calcOpen = '0';
        qCalcBtn.style.background = 'var(--acc2)';
        qCalcBtn.innerHTML = IC_MATH_HTML + ' Desmos Calculator';
      }
    };
    function fin(v) {
      if (done) return; done = true;
      var good = (q.isGrid ? same(v, q.ans) : String(v) === q.ans);
      if (good) {
        ok++;
        earnedInQuiz += 5;
        addCoins(5);
        removeMistakeByQuestion(q.q);
      } else {
        recordMistake(q, v, (n.rw ? 'R&W Path · ' : 'Math Path · ') + (q.top || ''));
      }
      lbAdd(good);
      a.querySelectorAll('button').forEach(function(b) {
        b.disabled = true;
        if (b.dataset.v === q.ans) b.classList.add('good');
        else if (b.dataset.v === String(v)) b.classList.add('bad');
      });

      var gi = document.getElementById('qi');
      if (gi) { gi.disabled = true; gi.style.borderColor = good ? 'var(--acc)' : '#e74c3c'; }

      f.innerHTML = '<p style="margin:14px 0;font-weight:700;color:' + (good ? 'var(--acc)' : '#e74c3c') + '">' + (good ? ('Correct! ✓ (+5 ' + IC_COIN_HTML + ')') : ('Incorrect · Saved to Mistakes. Answer: ' + (n.rw ? String(q.ans) : rHTML(fmtAns(q.ans))))) + '</p><button class="cta-amber" id="qn">' + (i < qs.length - 1 ? 'Next Waypoint →' : 'Finish Island') + '</button>';
      document.getElementById('qn').onclick = function() { i++; showQ(); };
    }

    if (q.isGrid) {
      a.innerHTML = '<input id="qi" class="qin" placeholder="Enter your answer" autocomplete="off"><button class="cta-amber" id="qc" style="margin-top:12px">Check Answer</button>';
      var inp = document.getElementById('qi');
      inp.focus();
      document.getElementById('qc').onclick = function() { if (inp.value) fin(inp.value) };
      inp.onkeydown = function(e) { if (e.key === 'Enter' && inp.value) fin(inp.value) };
    } else {
      q.opts.forEach(function(o, k) {
        var b = document.createElement('button');
        b.className = 'qo';
        b.dataset.v = o;
        b.innerHTML = '<b>' + 'ABCD'[k] + '</b>&nbsp; ' + (n.rw ? String(o) : rHTML(o));
        b.onclick = function() { fin(o) };
        a.appendChild(b);
      });
    }
  }
  showQ();
}

var SATPath={
  onOpen:function(n){
  if(n.ni===0){
    var alreadyDone = getDone().indexOf(n.g) >= 0;
    var btnLabel = 'I&apos;ve read it · +' + (alreadyDone ? 2 : 5) + ' ' + IC_COIN_HTML;
    document.body.insertAdjacentHTML('beforeend','<div id="ov" style="position:fixed;inset:0;z-index:80;background:#e2f0ec;overflow:auto;padding:24px"><div class="th" style="max-width:680px;margin:0 auto;background:#fff;color:#0f2b4a;border-radius:24px;padding:24px">'+(THEORY[n.ti]||'No theory yet')+'<button class="cta-amber" id="thDoneBtn" style="margin-top:20px">' + btnLabel + '</button> <button style="margin-left:12px;opacity:.6" onclick="document.getElementById(\'ov\').remove()">Close</button></div></div>');
    document.getElementById('thDoneBtn').onclick = function() {
      if (getDone().indexOf(n.g) < 0) {
        addCoins(5, 'Theory charted');
        SATPath.complete(n.g);
      } else {
        addCoins(2, 'Theory reviewed');
      }
      document.getElementById('ov').remove();
    };
    return}
  var tier=['','easy','medium','hard','boss'][n.ni],cnt=[0,8,10,12,15][n.ni],off=R(0,999),qs=[];
  for(var i=0;i<cnt;i++)qs.push(getMathQ(n.ti,tier,off+i));
    runQuiz(n,qs);
  },
 complete:function(g){var d=getDone();if(d.indexOf(g)<0){d.push(g);lbAdd(null,50)}try{spSet('satpath_done',JSON.stringify(d))}catch(e){}paint();var fb=mp.querySelector('[data-g="'+g+'"]');if(fb)fb.classList.add('flash');}
};window.SATPath=SATPath;

function toast(m){t.innerHTML=m||"Coming soon — this tab isn't open yet";t.classList.add('s');clearTimeout(tm);tm=setTimeout(function(){t.classList.remove('s')},m?2600:1800)}
function getDone(){try{return JSON.parse(spGet('satpath_done'))||[]}catch(e){return[]}}
var mp=document.getElementById('vMP'),built=false;
var SV={
 tree:'<svg viewBox="0 0 80 100"><rect class="k" x="35" y="60" width="10" height="38" rx="4"/><circle class="b" cx="40" cy="36" r="27"/><circle class="a" cx="25" cy="50" r="19"/><circle class="a" cx="56" cy="49" r="20"/><circle class="w" cx="34" cy="28" r="9"/></svg>',
 pine:'<svg viewBox="0 0 60 110"><rect class="k" x="26" y="88" width="8" height="20" rx="3"/><path class="b" d="M30 4 48 36H38L54 62H40L58 90H2L20 62H6L22 36H12Z"/><path class="a" d="M30 4 48 36H38L54 62H40L58 90H30Z"/></svg>',
 bush:'<svg viewBox="0 0 70 40"><circle class="b" cx="17" cy="26" r="14"/><circle class="b" cx="53" cy="26" r="14"/><circle class="a" cx="35" cy="21" r="18"/><circle class="w" cx="29" cy="15" r="6"/></svg>',
 leaf:'<svg viewBox="0 0 30 30"><path class="a" d="M4 26C4 10 14 3 27 3 27 17 19 27 4 26Z"/><path class="b" d="M5 25 22 8"/></svg>'};
function decor(ti,c){
 var L=[['tree',3,78],['bush',27,60],['pine',50,64],['bush',79,56]],Rr=[['pine',10,58],['bush',38,62],['tree',60,76],['bush',88,56]],o='';
 [L,Rr].forEach(function(S,side){S.forEach(function(d,k){var t=d[0];if(ti%2&&(t=='tree'||t=='pine'))t=t=='tree'?'pine':'tree';
  o+='<div class="dc '+(side?'r':'l')+'" style="--c:'+c[0]+';--d:'+c[1]+';--w:'+d[2]+';--dl:-'+((ti*7+k*3+side)%9)+'s;top:'+d[1]+'%">'+SV[t]+'</div>'})});
 for(var i=0;i<5;i++)o+='<div class="lf" style="--c:'+c[0]+';--d:'+c[1]+';--dl:-'+(i*2.3)+'s;left:'+(8+(i*19+ti*7)%84)+'%;animation-duration:'+(9+i*2)+'s">'+SV.leaf+'</div>';
 return o}
function build(){var h='<div class="mph"><div style="display:flex;justify-content:space-between;align-items:center"><b style="font-size:22px">' + spIco('math','ic','width:32px;height:32px;vertical-align:-7px;color:var(--acc)') + ' Math Path</b><small id="mpc" style="color:var(--mut)"></small></div><div class="bar" style="margin:10px 0 0"><div id="mpb"></div></div></div>',g=0,ti=0;
 CUR.forEach(function(d){d[1].forEach(function(tn){var c=DOM[d[0]];
  h+='<div class="tp" style="background:'+c[0]+'"><small>'+d[0]+' · Topic '+(ti+1)+'/20</small><b>'+tn+'</b></div><div class="pth">';
  TYPES.forEach(function(ty,ni){h+='<button class="isl" data-g="'+g+'" style="--c:'+c[0]+';--d:'+c[1]+';--x:'+Math.round(Math.sin(g*.9)*70)+'px"><img class="lg" src="logo.png" alt=""><em class="bd"></em><i class="lb">'+ty.l+'</i></button>';g++});
  h+=decor(ti,c)+'</div>';ti++})});
 mp.innerHTML=h+'<div class="tp" style="background:var(--acc2)">' + IC_BOOK_HTML + ' SAT Math complete!</div>';built=true;paint()}
function paint(){if(!built)return;var d=getDone(),cur=-1;
 for(var g=0;g<100;g++)if(d.indexOf(g)<0){cur=g;break}
 var icons = [IC_BOOK_SM_HTML, '1', '2', '3', IC_LORD_SM_HTML];
 mp.querySelectorAll('.isl').forEach(function(b,g){var dn=d.indexOf(g)>=0;b.className='isl'+(g%5==4?' fin':'')+(dn?' done':g==cur?' cur':' lock');b.querySelector('.bd').innerHTML=dn?'✓':g==cur?icons[g%5]:spSvg('lock', 12)});
 document.getElementById('mpc').textContent='Island '+Math.min(d.length+1,100)+'/100';document.getElementById('mpb').style.width=d.length+'%'}
mp.addEventListener('click',function(e){var b=e.target.closest('.isl');if(!b)return;if(b.classList.contains('lock'))return toast('Finish the previous island first');
 var g=+b.dataset.g,ti=Math.floor(g/5),ni=g%5;SATPath.onOpen({g:g,ti:ti,ni:ni,topic:TOPS[ti],type:TYPES[ni],theory:THEORY[ti],gens:GENERATORS[ti]})});
var qk=document.getElementById('vQB'),BK='satpath_bank';
function bankStats(){try{return JSON.parse(spGet(BK))||{}}catch(e){return{}}}
function bankSave(ti,ok){var s=bankStats(),r=s[ti]||{a:0,c:0};r.a++;if(ok)r.c++;s[ti]=r;try{spSet(BK,JSON.stringify(s))}catch(e){}}

/* ===== ATLAS (Archipelago Skill Map) ===== */
var qbRealmMode = 'all';
var qbStarFilter = 'all';

function getTopicStars(key, isRw, topicIdx) {
  var st = bankStats();
  var r = st[key] || { a: 0, c: 0 };
  var pathDone = isRw ? getRDone() : getDone();
  var pathNodesForTopic = 0;
  for (var n = 0; n < 5; n++) {
    if (pathDone.indexOf(topicIdx * 5 + n) >= 0) pathNodesForTopic++;
  }
  var a = r.a || 0;
  var acc = a > 0 ? (r.c / a) * 100 : 0;
  var stars = 0;
  if (a >= 8 && acc >= 80) stars = 3;
  else if (a >= 4 && acc >= 65) stars = 2;
  else if (a >= 1) stars = 1;
  var pathStars = pathNodesForTopic >= 5 ? 3 : pathNodesForTopic >= 3 ? 2 : pathNodesForTopic >= 1 ? 1 : 0;
  return Math.max(stars, pathStars);
}

function renderStarsHtml(stars) {
  var s = '';
  for (var i = 1; i <= 3; i++) {
    s += '<span class="' + (i <= stars ? 'on' : 'off') + '">★</span>';
  }
  return '<div class="isl-stars" aria-label="' + stars + ' of 3 stars">' + s + '</div>';
}

function renderMiniTrail(stars) {
  return '<div class="isl-trail-mini">' +
    '<i class="' + (stars >= 1 ? 'on' : '') + '"></i>' +
    '<span class="' + (stars >= 2 ? 'on' : '') + '"></span>' +
    '<i class="' + (stars >= 2 ? 'on' : '') + '"></i>' +
    '<span class="' + (stars >= 3 ? 'on' : '') + '"></span>' +
    '<i class="' + (stars >= 3 ? 'on' : '') + '"></i>' +
    '</div>';
}

function getRankLabel(stars, statObj) {
  var labels = ['Uncharted · 0★', 'Scouted · 1★', 'Charted · 2★', 'Mastered · 3★'];
  if (statObj && statObj.a > 0) {
    return labels[stars] + ' (' + Math.round((statObj.c / statObj.a) * 100) + '%)';
  }
  return labels[stars];
}

function buildBank() {
  var st = bankStats();
  var maxStars = (RTOPS.length + TOPS.length) * 3;
  var earnedStars = 0, masteredCount = 0;

  RTOPS.forEach(function(_, k) {
    var s = getTopicStars('rw_' + k, true, k);
    earnedStars += s;
    if (s === 3) masteredCount++;
  });
  TOPS.forEach(function(_, k) {
    var s = getTopicStars(k, false, k);
    earnedStars += s;
    if (s === 3) masteredCount++;
  });

  var h = '<div class="atlas-hero">' +
    '<div>' +
    '<div style="font-size:11.5px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--sand);margin-bottom:4px;display:flex;align-items:center;gap:6px">' + IC_MAP_HTML + ' ARCHIPELAGO TRAINING GROUNDS</div>' +
    '<h1>Atlas</h1>' +
    '<p class="sub">Explore topic islands across the R&amp;W and Math archipelagos. Earn up to 3 Mastery Stars (★★★) on every island and collect Pathcoins.</p>' +
    '</div>' +
    '<div class="atlas-stats-cluster">' +
    '<div class="atlas-star-tot">' +
    '<span class="st-ico">★</span>' +
    '<div><b>' + earnedStars + ' / ' + maxStars + '</b><small>' + masteredCount + ' Islands Mastered (3★)</small></div>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '<div class="atlas-controls">' +
    '<div class="island-pills">' +
    [
      ['all', IC_MAP_HTML + ' All Realms'],
      ['rw', IC_BOOK_HTML + ' R&amp;W Archipelago'],
      ['math', IC_MATH_HTML + ' Math Archipelago']
    ].map(function(pair) {
      return '<button class="island-pill' + (qbRealmMode === pair[0] ? ' on' : '') + '" data-realm="' + pair[0] + '">' + pair[1] + '</button>';
    }).join('') +
    '</div>' +
    '<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">' +
    '<div class="island-pills">' +
    [
      ['all', 'All ★'],
      ['0', '☆ Uncharted'],
      ['12', '★ Exploring'],
      ['3', '★★★ Mastered']
    ].map(function(pair) {
      return '<button class="island-pill sand' + (qbStarFilter === pair[0] ? ' on' : '') + '" data-sfilt="' + pair[0] + '">' + pair[1] + '</button>';
    }).join('') +
    '</div></div></div>';

  var regionsHtml = '';
  var romanNumerals = ['I', 'II', 'III', 'IV'];

  if (qbRealmMode === 'all' || qbRealmMode === 'rw') {
    var rIdx = 0;
    RCUR.forEach(function(dom, dIdx) {
      var domName = dom[0], domTopics = dom[1];
      var regStars = 0, regMax = domTopics.length * 3, cards = '';
      domTopics.forEach(function(tName) {
        var k = rIdx++;
        var stars = getTopicStars('rw_' + k, true, k);
        regStars += stars;
        if (qbStarFilter === '0' && stars !== 0) return;
        if (qbStarFilter === '12' && (stars < 1 || stars > 2)) return;
        if (qbStarFilter === '3' && stars !== 3) return;
        var rStat = st['rw_' + k] || { a: 0, c: 0 };
        cards += '<button class="atlas-island' + (stars === 3 ? ' mastered' : '') + '" data-r="' + k + '">' +
          '<div>' +
          '<div class="isl-top-row"><span class="isl-num">R&amp;W Island 0' + (k + 1) + '</span>' + renderStarsHtml(stars) + '</div>' +
          '<div class="isl-name" style="margin-top:10px">' + tName + '</div>' +
          '</div>' +
          '<div>' +
          renderMiniTrail(stars) +
          '<div class="isl-foot" style="margin-top:10px">' +
          '<span class="isl-rank">' + getRankLabel(stars, rStat) + '</span>' +
          '<span class="isl-bounty">' + IC_COIN_HTML + ' ★ +15 PC ›</span>' +
          '</div></div></button>';
      });
      if (cards) {
        var c = RDOM[domName] || ['#22a381', '#11676a'];
        var rom = romanNumerals[dIdx % romanNumerals.length];
        regionsHtml += '<div class="archipelago-region">' +
          '<div class="arch-hd">' +
          '<div class="arch-title"><div class="arch-badge" style="background:' + c[0] + '">' + rom + '</div>' +
          '<div><small style="color:var(--mut);font-weight:800;text-transform:uppercase;letter-spacing:.08em;font-size:10.5px">R&amp;W ARCHIPELAGO · SECTOR ' + rom + '</small><h2 style="font-size:20px;font-weight:800">' + domName + '</h2></div></div>' +
          '<div style="display:flex;align-items:center;gap:10px"><span class="arch-stars-pill">★ ' + regStars + ' / ' + regMax + ' Stars</span></div>' +
          '</div>' +
          '<div class="atlas-map-grid">' + cards + '</div></div>';
      }
    });
  }

  if (qbRealmMode === 'all' || qbRealmMode === 'math') {
    var mIdx = 0;
    CUR.forEach(function(dom, dIdx) {
      var domName = dom[0], domTopics = dom[1];
      var regStars = 0, regMax = domTopics.length * 3, cards = '';
      domTopics.forEach(function(tName) {
        var ti = mIdx++;
        var stars = getTopicStars(ti, false, ti);
        regStars += stars;
        if (qbStarFilter === '0' && stars !== 0) return;
        if (qbStarFilter === '12' && (stars < 1 || stars > 2)) return;
        if (qbStarFilter === '3' && stars !== 3) return;
        var mStat = st[ti] || { a: 0, c: 0 };
        cards += '<button class="atlas-island' + (stars === 3 ? ' mastered' : '') + '" data-t="' + ti + '">' +
          '<div>' +
          '<div class="isl-top-row"><span class="isl-num">Math Island ' + (ti + 1 < 10 ? '0' + (ti + 1) : (ti + 1)) + '</span>' + renderStarsHtml(stars) + '</div>' +
          '<div class="isl-name" style="margin-top:10px">' + tName + '</div>' +
          '</div>' +
          '<div>' +
          renderMiniTrail(stars) +
          '<div class="isl-foot" style="margin-top:10px">' +
          '<span class="isl-rank">' + getRankLabel(stars, mStat) + '</span>' +
          '<span class="isl-bounty">' + IC_COIN_HTML + ' ★ +15 PC ›</span>' +
          '</div></div></button>';
      });
      if (cards) {
        var c = DOM[domName] || ['#22a381', '#11676a'];
        var rom = romanNumerals[dIdx % romanNumerals.length];
        regionsHtml += '<div class="archipelago-region">' +
          '<div class="arch-hd">' +
          '<div class="arch-title"><div class="arch-badge" style="background:' + c[0] + '">' + rom + '</div>' +
          '<div><small style="color:var(--mut);font-weight:800;text-transform:uppercase;letter-spacing:.08em;font-size:10.5px">MATH ARCHIPELAGO · SECTOR ' + rom + '</small><h2 style="font-size:20px;font-weight:800">' + domName + '</h2></div></div>' +
          '<div style="display:flex;align-items:center;gap:10px"><span class="arch-stars-pill">★ ' + regStars + ' / ' + regMax + ' Stars</span></div>' +
          '</div>' +
          '<div class="atlas-map-grid">' + cards + '</div></div>';
      }
    });
  }

  if (!regionsHtml) {
    regionsHtml = '<div class="card" style="padding:36px;text-align:center"><div>' + spIco('compass','ui-ic-lg','color:var(--sand)') + '</div><b>No islands match this star filter yet</b><p class="sub">Switch back to "All ★" to view the full archipelago map.</p></div>';
  }

  qk.innerHTML = h + regionsHtml;
}

qk.addEventListener('click', function(e) {
  var rBtn = e.target.closest('[data-realm]');
  if (rBtn) { qbRealmMode = rBtn.dataset.realm; buildBank(); return; }
  var sBtn = e.target.closest('[data-sfilt]');
  if (sBtn) { qbStarFilter = sBtn.dataset.sfilt; buildBank(); return; }
  var b = e.target.closest('[data-r], [data-t]');
  if (!b) return;
  if (b.dataset.r !== undefined) rwBankOpen(+b.dataset.r);
  else if (b.dataset.t !== undefined) bankOpen(+b.dataset.t);
});

function bankOpen(ti) {
  if (!spendEnergy(1)) return;
  var ov = document.createElement('div'), ok = 0, tot = 0;
  ov.style.cssText = 'position:fixed;inset:0;z-index:80;background:var(--bg);overflow:auto;padding:24px';
  document.body.appendChild(ov);

  function close() {
    ov.remove();
    buildBank();
  }
  function draw() {
    var starsNow = getTopicStars(ti, false, ti);
    var q = getMathQ(ti, 'bank', R(0, 999)), done = false;
    q.top = TOPS[ti];
    q.rw = false;
    var wasOpen = ov.dataset.calcOpen === '1';
    ov.innerHTML = '<div id="bSplitWrap" class="quiz-split-wrap' + (wasOpen ? ' calc-open' : '') + '"><div class="qb" style="border-radius:26px"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap"><div><small style="color:var(--sand);font-weight:800;text-transform:uppercase;letter-spacing:.06em;display:flex;align-items:center;gap:5px">' + IC_MATH_HTML + ' MATH ISLAND DRILL</small><div style="font-weight:800;font-size:16px">' + TOPS[ti] + '</div></div><div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">' + miniHudHtml() + renderStarsHtml(starsNow) + '<button id="bcalc" style="background:' + (wasOpen ? '#e74c3c' : 'var(--acc2)') + ';color:#fff;padding:5px 12px;border-radius:10px;font-weight:bold;font-size:12px;">' + (wasOpen ? '✕ Close Calculator' : (IC_MATH_HTML + ' Desmos Calculator')) + '</button><button id="bx" class="tbtn">✕</button></div></div><div class="chips"><span class="sc" style="margin-left:0">✓ ' + ok + ' / ' + tot + ' solved · Earn ★ Mastery Stars for +15 PC</span></div><div style="font-size:20px;line-height:1.6;margin:22px 0 14px">' + rHTML(q.q) + '</div><div id="ba"></div><div id="bf"></div></div><div id="d-panel" class="quiz-calc-pane"></div></div>';
    document.getElementById('bx').onclick = close;
    var bSplitWrap = document.getElementById('bSplitWrap');
    var dPanel = document.getElementById('d-panel');
    var calcBtn = document.getElementById('bcalc');
    var calculator = null;
    function mountBCalc() {
      if (!calculator && window.Desmos) {
        calculator = createFullDesmos(dPanel);
      }
      if (calculator) setTimeout(function() { calculator.resize(); }, 35);
    }
    if (wasOpen) mountBCalc();
    calcBtn.onclick = function() {
      if (!bSplitWrap.classList.contains('calc-open')) {
        bSplitWrap.classList.add('calc-open');
        ov.dataset.calcOpen = '1';
        calcBtn.style.background = '#e74c3c';
        calcBtn.innerHTML = '✕ Close Calculator';
        mountBCalc();
      } else {
        bSplitWrap.classList.remove('calc-open');
        ov.dataset.calcOpen = '0';
        calcBtn.style.background = 'var(--acc2)';
        calcBtn.innerHTML = IC_MATH_HTML + ' Desmos Calculator';
      }
    };

    var a = document.getElementById('ba'), f = document.getElementById('bf');
    function fin(v) {
      if (done) return; done = true;
      var prevStars = getTopicStars(ti, false, ti);
      var good = (q.isGrid ? same(v, q.ans) : String(v) === q.ans);
      tot++;
      if (good) {
        ok++;
        addCoins(5);
        removeMistakeByQuestion(q.q);
      } else {
        recordMistake(q, v, 'Atlas Math · ' + TOPS[ti]);
      }
      bankSave(ti, good); lbAdd(good);
      var newStars = getTopicStars(ti, false, ti);
      if (newStars > prevStars) { confetti(); addCoins(15 * (newStars - prevStars), 'Mastery Star ★ unlocked!'); }

      a.querySelectorAll('button').forEach(function(b) {
        b.disabled = true;
        if (b.dataset.v === q.ans) b.classList.add('good');
        else if (b.dataset.v === String(v)) b.classList.add('bad');
      });

      var gi = document.getElementById('bi');
      if (gi) { gi.disabled = true; gi.style.borderColor = good ? 'var(--acc)' : '#e74c3c'; }

      f.innerHTML = '<p style="margin:14px 0;font-weight:700;color:' + (good ? 'var(--acc)' : '#e74c3c') + '">' + (good ? ('Correct! ✓ (+5 ' + IC_COIN_HTML + ')') : ('Incorrect · Saved to Mistakes. Answer: ' + rHTML(fmtAns(q.ans)))) + '</p><button class="cta-amber" id="bn">Next Question →</button>';
      var nb = document.getElementById('bn');
      nb.onclick = draw;
      setTimeout(function() { nb.focus() }, 60);
    }

    if (q.isGrid) {
      a.innerHTML = '<input id="bi" class="qin" placeholder="Enter your answer" autocomplete="off"><button class="cta-amber" id="bc" style="margin-top:12px">Check Answer</button>';
      var inp = document.getElementById('bi');
      inp.focus();
      document.getElementById('bc').onclick = function() { if (inp.value) fin(inp.value) };
      inp.onkeydown = function(e) { if (e.key === 'Enter' && inp.value) fin(inp.value) };
    } else {
      q.opts.forEach(function(o, k) {
        var b = document.createElement('button');
        b.className = 'qo';
        b.dataset.v = o;
        b.innerHTML = '<b>' + 'ABCD'[k] + '</b>&nbsp; ' + rHTML(o);
        b.onclick = function() { fin(o) };
        a.appendChild(b);
      });
    }
  }
  draw();
}

var rw=document.getElementById('vRW'),rbuilt=false,RK='satpath_done_rw';
function getRDone(){try{return JSON.parse(spGet(RK))||[]}catch(e){return[]}}
function rwComplete(g){var d=getRDone();if(d.indexOf(g)<0){d.push(g);lbAdd(null,50)}try{spSet(RK,JSON.stringify(d))}catch(e){}paintRW();var fb=rw.querySelector('[data-g="'+g+'"]');if(fb)fb.classList.add('flash')}
window.rwComplete=rwComplete;

function scaleSectionScore(correct, maxScored, isHard) {
  if (correct <= 0) return 200;
  var ratio = correct / maxScored;
  var base = 200 + 600 * Math.pow(ratio, isHard ? 0.9 : 1.1);
  return Math.min(800, Math.max(200, Math.round(base / 10) * 10));
}

function buildRW(){
  var h='<div class="mph"><div style="display:flex;justify-content:space-between;align-items:center"><b style="font-size:22px">' + spIco('pen','ic','width:32px;height:32px;vertical-align:-7px;color:var(--acc2)') + ' R&amp;W Path</b><small id="rwc" style="color:var(--mut)"></small></div><div class="bar" style="margin:10px 0 0"><div id="rwb"></div></div></div>',g=0,ti=0;
  RCUR.forEach(function(d){d[1].forEach(function(tn){var c=RDOM[d[0]];
    h+='<div class="tp" style="background:'+c[0]+'"><small>'+d[0]+' · Topic '+(ti+1)+'/10</small><b>'+tn+'</b></div><div class="pth">';
    TYPES.forEach(function(ty,ni){h+='<button class="isl" data-g="'+g+'" style="--c:'+c[0]+';--d:'+c[1]+';--x:'+Math.round(Math.sin(g*.9)*70)+'px"><img class="lg" src="logo.png" alt=""><em class="bd"></em><i class="lb">'+ty.l+'</i></button>';g++});
    h+=decor(ti,c)+'</div>';ti++})});
  rw.innerHTML=h+'<div class="tp" style="background:var(--acc2)">' + IC_BOOK_HTML + ' SAT Reading &amp; Writing complete!</div>';rbuilt=true;paintRW();
}

function paintRW(){
  if(!rbuilt)return;var d=getRDone(),cur=-1;
  for(var g=0;g<50;g++)if(d.indexOf(g)<0){cur=g;break}
  var icons = [IC_BOOK_SM_HTML, '1', '2', '3', IC_LORD_SM_HTML];
  rw.querySelectorAll('.isl').forEach(function(b,g){var dn=d.indexOf(g)>=0;b.className='isl'+(g%5==4?' fin':'')+(dn?' done':g==cur?' cur':' lock');b.querySelector('.bd').innerHTML=dn?'✓':g==cur?icons[g%5]:spSvg('lock', 12)});
  document.getElementById('rwc').textContent='Island '+Math.min(d.length+1,50)+'/50';document.getElementById('rwb').style.width=(d.length*2)+'%';
}

rw.addEventListener('click',function(e){
  var b=e.target.closest('.isl');if(!b)return;if(b.classList.contains('lock'))return toast('Finish the previous island first');
  var g=+b.dataset.g,ti=Math.floor(g/5),ni=g%5;
  if(ni===0){
    var alreadyDone = getRDone().indexOf(g) >= 0;
    var btnLabel = 'I&apos;ve read it · +' + (alreadyDone ? 2 : 5) + ' ' + IC_COIN_HTML;
    document.body.insertAdjacentHTML('beforeend','<div id="ov" style="position:fixed;inset:0;z-index:80;background:#e2f0ec;overflow:auto;padding:24px"><div class="th" style="max-width:680px;margin:0 auto;background:#fff;color:#0f2b4a;border-radius:18px;padding:24px">'+RTH[ti]+'<button class="cta" id="rwThDoneBtn" style="margin-top:20px">' + btnLabel + '</button> <button style="margin-left:12px;opacity:.6" onclick="document.getElementById(\'ov\').remove()">Close</button></div></div>');
    document.getElementById('rwThDoneBtn').onclick = function() {
      if (getRDone().indexOf(g) < 0) {
        addCoins(5, 'Theory charted');
        rwComplete(g);
      } else {
        addCoins(2, 'Theory reviewed');
      }
      document.getElementById('ov').remove();
    };
    return;
  }
  runQuiz({g:g,ti:ti,ni:ni,type:TYPES[ni],rw:true,min:65,done:rwComplete},getRQ(ti,ni));
});

/* Интерактивный клик по словам в любом контейнере R&W */
var activeVocabPopover = null;
function closeActiveVocabPopover() {
  if (activeVocabPopover) { activeVocabPopover.remove(); activeVocabPopover = null; }
}
function bindVocabClicksOnContainer(containerEl, onUpdateCount) {
  if (!containerEl) return;
  containerEl.addEventListener('click', function(e) {
    var wEl = e.target.closest('.rw-word');
    if (!wEl) { closeActiveVocabPopover(); return; }
    e.stopPropagation();
    closeActiveVocabPopover();
    var rawWord = wEl.dataset.word || wEl.textContent;
    var clean = rawWord.replace(/[^a-zA-Z'-]/g, '');
    if (!clean) return;
    var plainCtx = containerEl.textContent.replace(/\s+/g, ' ').trim().slice(0, 140);
    var info = lookupWordDef(clean, plainCtx);
    var list = getVocabList();
    var isSaved = list.some(function(x){return x.w.toLowerCase()===clean.toLowerCase()});

    activeVocabPopover = document.createElement('div');
    activeVocabPopover.className = 'vocab-pop';
    var rect = wEl.getBoundingClientRect();
    var topPos = Math.min(window.innerHeight - 200, Math.max(12, rect.bottom + 8));
    var leftPos = Math.min(window.innerWidth - 330, Math.max(12, rect.left));
    activeVocabPopover.style.top = topPos + 'px';
    activeVocabPopover.style.left = leftPos + 'px';
    activeVocabPopover.innerHTML =
      '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:6px">' +
        '<b style="font-size:16px;color:var(--sand)">' + lbEsc(clean) + '</b>' +
        '<button id="vpClose" style="font-size:12px;opacity:.6">✕</button>' +
      '</div>' +
      '<div id="vpRu" style="font-size:11px;font-weight:700;color:var(--acc);margin-bottom:4px;text-transform:uppercase">' + lbEsc(info.ru) + '</div>' +
      '<div style="font-size:12.5px;color:var(--tx);line-height:1.45;margin-bottom:8px"><b>Meaning:</b> <span id="vpMean">' + lbEsc(info.d) + '</span></div>' +
      '<div style="font-size:11.5px;color:var(--mut);font-style:italic;line-height:1.4;margin-bottom:10px"><b>Example:</b> "' + lbEsc(info.ex) + '"</div>' +
      '<button class="cta-amber" id="vpSave" style="width:100%;padding:8px 12px;font-size:12px;border-radius:10px">' + (isSaved ? '✓ Saved in Vocabulary (Remove)' : spSvg('plus', 13) + ' Highlight &amp; Save Word') + '</button>';
    document.body.appendChild(activeVocabPopover);
    activeVocabPopover.querySelector('#vpClose').onclick = closeActiveVocabPopover;
    if (info.ru === GENERIC_RU) {
      var popRef = activeVocabPopover, popMean = popRef.querySelector('#vpMean'), popRu = popRef.querySelector('#vpRu');
      popMean.textContent = 'Looking up in dictionary…';
      fetchDictEntry(clean).then(function(res) {
        if (res.ok) {
          var m0 = res.data.meanings[0];
          info.d = m0.defs[0].d; info.ru = m0.pos; info.fromApi = true;
        }
        if (popRef.isConnected) { popMean.textContent = info.d; popRu.textContent = info.ru; }
      });
    }
    activeVocabPopover.querySelector('#vpSave').onclick = function() {
      var curList = getVocabList();
      var idx = curList.findIndex(function(x){return x.w.toLowerCase()===clean.toLowerCase()});
      if (idx >= 0) {
        curList.splice(idx, 1);
        wEl.classList.remove('hl');
        toast('Removed "' + clean + '" from Vocabulary');
      } else {
        curList.unshift({ w: clean, d: info.d, ru: info.ru, ctx: info.ex, fromApi: !!info.fromApi });
        enrichVocabWord(clean);
        wEl.classList.add('hl');
        toast('Saved "' + clean + '" to Vocabulary');
      }
      saveVocabList(curList);
      if (onUpdateCount) onUpdateCount(curList.length);
      closeActiveVocabPopover();
    };
  });
}

function rwBankOpen(ti){
  if (!spendEnergy(1)) return;
  var ov = document.createElement('div'), ok = 0;
  ov.style.cssText = 'position:fixed;inset:0;z-index:80;background:var(--bg);overflow:auto;padding:24px';
  document.body.appendChild(ov);

  function close(){ closeActiveVocabPopover(); ov.remove(); buildBank(); }

  function pool(){
    var c = [];
    if(RQ[ti]) RQ[ti].forEach(function(r, idx){ c.push({ fn: function(){return r}, id: 'rq_'+idx }) });
    if(typeof RGEN !== 'undefined' && RGEN[ti]) RGEN[ti].forEach(function(g, idx){ c.push({ fn: g, id: 'rgen_'+idx }) });
    return c;
  }

  var solvedKey = 'satpath_rw_solved_island_' + ti;
  var solvedList = [];
  try { solvedList = JSON.parse(spGet(solvedKey)) || []; } catch(e) {}

  var fullPool = pool();
  var myPool = fullPool.filter(function(item) {
    return solvedList.indexOf(item.id) === -1;
  });

  if (myPool.length === 0) {
    toast("Island fully explored! Resetting questions...");
    solvedList = [];
    spSet(solvedKey, JSON.stringify(solvedList));
    myPool = fullPool;
  }

  var qIndex = 0;

  function draw(){
    closeActiveVocabPopover();
    if (qIndex >= myPool.length) {
      var pct = myPool.length > 0 ? Math.round(ok / myPool.length * 100) : 0;
      ov.innerHTML = '<div class="qb" style="text-align:center;border-radius:26px"><div>' + IC_ART_LG_HTML + '</div><h2>Island Drill Complete!</h2><div class="big" style="color:var(--sand)">' + pct + '%</div><p>' + ok + ' / ' + myPool.length + ' correct</p><button class="cta-amber" id="rx2" style="margin-top:16px">Back to Atlas</button></div>';
      document.getElementById('rx2').onclick = close;
      return;
    }

    var starsNow = getTopicStars('rw_' + ti, true, ti);
    var currentItem = myPool[qIndex];
    var x = currentItem.fn(), ans = x[1], opts = shuffle(x.slice(1)), done = false;

    ov.innerHTML='<div class="qb" style="border-radius:26px"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap"><div><small style="color:var(--sand);font-weight:800;text-transform:uppercase;letter-spacing:.06em;display:flex;align-items:center;gap:5px">' + IC_BOOK_HTML + ' R&amp;W ISLAND DRILL</small><div style="font-weight:800;font-size:16px">'+RTOPS[ti]+'</div></div><div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">'+miniHudHtml()+'<button class="chip" id="rwAddVocBtn" style="font-weight:700;color:var(--sand);border-color:var(--sand-line)">' + spSvg('plus', 13) + ' Add Word</button>'+renderStarsHtml(starsNow)+'<button id="rx" class="tbtn">✕</button></div></div><div class="chips"><span class="sc" style="margin-left:0">Waypoint '+(qIndex + 1)+' of '+myPool.length+' · ✓ '+ok+' · Click any word in text to save to Vocabulary</span></div><div id="rwDrillPassage" style="font-size:18px;line-height:1.55;margin:18px 0 14px">'+wrapWordsForVocab(x[0])+'</div><div id="ra"></div><div id="rf"></div></div>';

    var a = document.getElementById('ra'), f = document.getElementById('rf');
    document.getElementById('rx').onclick = close;
    var passEl = document.getElementById('rwDrillPassage');
    bindVocabClicksOnContainer(passEl);
    document.getElementById('rwAddVocBtn').onclick = function() {
      openAddWordModal(passEl.textContent.replace(/\s+/g,' ').trim().slice(0,130));
    };

    function fin(v){
      if(done) return; done = true;
      if (solvedList.indexOf(currentItem.id) === -1) {
        solvedList.push(currentItem.id);
        spSet(solvedKey, JSON.stringify(solvedList));
      }

      var prevStars = getTopicStars('rw_' + ti, true, ti);
      var good = (v === ans);
      if(good){
        ok++;
        addCoins(5);
        removeMistakeByQuestion(x[0]);
      } else {
        recordMistake({ q: x[0], ans: ans, opts: opts, isGrid: false, rw: true, top: RTOPS[ti] }, v, 'Atlas R&W · ' + RTOPS[ti]);
      }
      bankSave('rw_' + ti, good);
      lbAdd(good);
      var newStars = getTopicStars('rw_' + ti, true, ti);
      if(newStars > prevStars){confetti();addCoins(15 * (newStars - prevStars), 'Mastery Star ★ unlocked!');}
      a.querySelectorAll('button').forEach(function(b){b.disabled=true;if(b.dataset.v===ans)b.classList.add('good');else if(b.dataset.v===v)b.classList.add('bad')});
      f.innerHTML='<p style="margin:14px 0;font-weight:700;color:'+(good?'var(--acc)':'#e74c3c')+'">'+(good?('Correct! ✓ (+5 ' + IC_COIN_HTML + ')'):('Incorrect · Saved to Mistakes. Answer: '+ans))+'</p><button class="cta-amber" id="rn">Next Waypoint →</button>';
      document.getElementById('rn').onclick = function(){ qIndex++; draw(); };
    }
    opts.forEach(function(o,k){var b=document.createElement('button');b.className='qo';b.dataset.v=o;b.innerHTML='<b>'+'ABCD'[k]+'</b>&nbsp; '+o;b.onclick=function(){fin(o)};a.appendChild(b)});
  }
  draw();
}

/* ===== BLITZ 10 MODE (Minimalist Icons & Full Desmos) ===== */
var bzCfg = { mode: 'mix', lvl: 'hard' };
function getBlitzBest() {
  try { return JSON.parse(spGet('satpath_blitz_best')) || { score: 0, streak: 0, runs: 0 }; } catch (e) { return { score: 0, streak: 0, runs: 0 }; }
}
function saveBlitzBest(b) {
  try { spSet('satpath_blitz_best', JSON.stringify(b)); } catch (e) {}
}

function buildBlitz() {
  var el = document.getElementById('vBZ');
  if (!el) return;
  var best = getBlitzBest();
  el.innerHTML = '<div class="atlas-hero" style="margin-bottom:22px;border:2px solid var(--sand-line)">' +
    '<div><div style="font-size:11.5px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--sand);margin-bottom:4px;display:flex;align-items:center;gap:6px">' + IC_ENERGY_HTML + ' HIGH-SPEED ARENA · 10 QUESTIONS</div>' +
    '<h1>Blitz 10 Mode</h1>' +
    '<p class="sub">Test your reflexes across 10 rapid-fire SAT questions! Build answer streaks for bonus multipliers and earn Pathcoins.</p></div>' +
    '<div style="display:flex;gap:14px;flex-wrap:wrap">' +
    '<div class="atlas-star-tot"><span class="st-ico">' + spSvg('zap', 26) + '</span><div><b>' + best.score.toLocaleString() + ' pts</b><small>High Score · Max Streak ' + best.streak + 'x</small></div></div>' +
    '</div></div>' +
    '<div class="blitz-card">' +
    '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:22px">' +
    '<div><label style="font-size:12px;font-weight:800;color:var(--mut);text-transform:uppercase;letter-spacing:.06em;display:block;margin-bottom:10px">1. Choose Subject Mix</label>' +
    '<div style="display:grid;gap:10px">' +
    [
      ['mix', IC_ENERGY_HTML + ' Mixed Odyssey (5 Math + 5 R&amp;W)', 'Alternates between SAT Math and Reading &amp; Writing'],
      ['math', IC_MATH_HTML + ' Pure Math Blitz (10 Math)', 'Graphs, geometry, systems, and algebra'],
      ['rw', IC_BOOK_HTML + ' Pure R&amp;W Blitz (10 R&amp;W)', 'Inferences, evidence, vocabulary, and grammar']
    ].map(function(m) {
      var on = bzCfg.mode === m[0];
      return '<button class="card" data-bzm="' + m[0] + '" style="padding:14px 16px;border-radius:18px;border-color:' + (on ? 'var(--acc)' : 'var(--line)') + ';background:' + (on ? 'rgba(34,163,129,0.12)' : 'var(--panel)') + '">' +
        '<b style="font-size:14.5px;display:flex;align-items:center;gap:6px">' + m[1] + '</b><small style="color:var(--mut);font-size:12px;display:block;margin-top:3px">' + m[2] + '</small></button>';
    }).join('') + '</div></div>' +
    '<div><label style="font-size:12px;font-weight:800;color:var(--mut);text-transform:uppercase;letter-spacing:.06em;display:block;margin-bottom:10px">2. Select Difficulty Level</label>' +
    '<div style="display:grid;gap:10px">' +
    [
      ['easy', spSvg('compass', 15) + ' Foundation (Level 1 · Easy)', 'Core concepts &amp; rapid warm-up · 1.0× Score Multiplier'],
      ['medium', spSvg('shield', 15) + ' Challenger (Level 2 · Medium)', 'Standard Digital SAT Module 1 difficulty · 1.5× Score Multiplier'],
      ['hard', spSvg('crown', 15) + ' Bluebook Master (Level 3 · Hard)', 'Multi-step Module 2 hard problems &amp; traps · 2.0× Score Multiplier']
    ].map(function(lv) {
      var on = bzCfg.lvl === lv[0];
      return '<button class="card" data-bzl="' + lv[0] + '" style="padding:14px 16px;border-radius:18px;border-color:' + (on ? 'var(--sand)' : 'var(--line)') + ';background:' + (on ? 'var(--sand-bg)' : 'var(--panel)') + '">' +
        '<b style="font-size:14.5px;display:flex;align-items:center;gap:6px">' + lv[1] + '</b><small style="color:var(--mut);font-size:12px;display:block;margin-top:3px">' + lv[2] + '</small></button>';
    }).join('') + '</div></div></div>' +
    '<div style="margin-top:24px;padding-top:18px;border-top:1.5px dashed var(--line);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">' +
    '<div style="font-size:13px;color:var(--mut)">' + spSvg('clock', 14) + ' <b>60 seconds</b> per question · Streak combos grant bonus Pathcoins</div>' +
    '<button class="cta-amber" id="bzStartBtn" style="padding:14px 28px;font-size:15px;border-radius:16px">Launch Blitz 10 →</button>' +
    '</div></div>';

  el.querySelectorAll('[data-bzm]').forEach(function(b) {
    b.onclick = function() { bzCfg.mode = b.dataset.bzm; buildBlitz(); };
  });
  el.querySelectorAll('[data-bzl]').forEach(function(b) {
    b.onclick = function() { bzCfg.lvl = b.dataset.bzl; buildBlitz(); };
  });
  el.querySelector('#bzStartBtn').onclick = startBlitzRun;
}

function startBlitzRun() {
  if (!spendEnergy(1)) return;
  var qs = [];
  for (var i = 0; i < 10; i++) {
    var isRw = bzCfg.mode === 'rw' ? true : (bzCfg.mode === 'math' ? false : (i % 2 === 1));
    if (!isRw) {
      var ti = R(0, TOPS.length - 1);
      var q = getMathQ(ti, bzCfg.lvl, R(0, 999) + i * 19);
      q.top = TOPS[ti];
      q.rw = false;
      qs.push(q);
    } else {
      var rti = R(0, RTOPS.length - 1);
      var list = RQ[rti] || RQ[0];
      var th = Math.ceil(list.length / 3);
      var sub = bzCfg.lvl === 'easy' ? list.slice(0, th) : (bzCfg.lvl === 'medium' ? list.slice(th, th * 2) : list.slice(th * 2));
      if (!sub.length) sub = list;
      var item = getEl(sub);
      qs.push({ q: item[0], ans: item[1], opts: shuffle(item.slice(1)), isGrid: false, rw: true, top: RTOPS[rti] });
    }
  }

  var idx = 0, ok = 0, streak = 0, maxStreak = 0, score = 0, qLeft = 60, tmr = null, doneQ = false;
  var mult = bzCfg.lvl === 'hard' ? 2.0 : (bzCfg.lvl === 'medium' ? 1.5 : 1.0);
  var ov = document.createElement('div');
  ov.style.cssText = 'position:fixed;inset:0;z-index:95;background:var(--bg);overflow:auto;padding:20px';
  document.body.appendChild(ov);

  function stopTmr() { if (tmr) { clearInterval(tmr); tmr = null; } }
  function closeBlitz() { closeActiveVocabPopover(); stopTmr(); ov.remove(); buildBlitz(); }

  function renderStep() {
    closeActiveVocabPopover();
    stopTmr();
    if (idx >= qs.length) {
      var best = getBlitzBest();
      best.runs = (best.runs || 0) + 1;
      if (score > best.score) best.score = score;
      if (maxStreak > best.streak) best.streak = maxStreak;
      saveBlitzBest(best);
      var pcEarned = Math.max(5, Math.round(ok * 4 * mult));
      addCoins(pcEarned, 'Blitz 10 Complete (' + ok + '/10)!');
      if (ok >= 7) confetti();
      ov.innerHTML = '<div class="qb" style="max-width:580px;margin:20px auto;text-align:center;border-radius:28px;border:2px solid var(--sand-line);animation:up .35s ease">' +
        '<div style="font-size:12px;font-weight:800;color:var(--sand);letter-spacing:.1em;text-transform:uppercase">' + spSvg('zap', 14) + ' BLITZ 10 COMPLETE</div>' +
        '<h2 style="font-size:28px;font-weight:800;margin:6px 0">' + (ok >= 9 ? 'Unstoppable Blitz!' : ok >= 7 ? 'Sharp Navigator!' : 'Good Sprint!') + '</h2>' +
        '<div style="font-size:54px;font-weight:800;color:var(--sand);margin:8px 0">' + score.toLocaleString() + ' <small style="font-size:18px;color:var(--mut)">pts</small></div>' +
        '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:18px 0">' +
        '<div class="card" style="padding:12px;border-radius:16px"><small style="color:var(--mut);display:block">Accuracy</small><b style="font-size:20px;color:var(--acc)">' + ok + ' / 10</b></div>' +
        '<div class="card" style="padding:12px;border-radius:16px"><small style="color:var(--mut);display:block">Max Streak</small><b style="font-size:20px;color:var(--sand)">' + maxStreak + 'x</b></div>' +
        '<div class="card" style="padding:12px;border-radius:16px"><small style="color:var(--mut);display:block">Reward</small><b style="font-size:20px;color:var(--acc)">+' + pcEarned + ' PC</b></div>' +
        '</div>' +
        '<div style="display:flex;gap:10px;justify-content:center;margin-top:18px">' +
        '<button class="cta" id="bzRetry" style="border-radius:14px">Play Again ↻</button>' +
        '<button class="cta-amber" id="bzDone" style="border-radius:14px">Back to Blitz Hub →</button>' +
        '</div></div>';
      ov.querySelector('#bzRetry').onclick = function() { ov.remove(); startBlitzRun(); };
      ov.querySelector('#bzDone').onclick = closeBlitz;
      return;
    }

    doneQ = false;
    qLeft = 60;
    var q = qs[idx];
    var fx = function(str) { return q.rw ? wrapWordsForVocab(str) : rHTML(str); };
    var wasOpen = ov.dataset.calcOpen === '1' && !q.rw;
    ov.innerHTML = '<div id="bzShell" class="pt-shell' + (wasOpen ? ' calc-open' : '') + '">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;background:var(--panel);padding:12px 18px;border-radius:18px;border:1.5px solid var(--line);margin-bottom:14px">' +
      '<div style="display:flex;align-items:center;gap:10px"><span class="tag n" style="margin:0">BLITZ ' + (idx + 1) + '/10</span><b style="color:var(--sand)">' + streak + 'x Streak</b><small style="color:var(--mut)">Score: <b>' + score + '</b></small></div>' +
      '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">' + miniHudHtml() + (!q.rw ? '<button id="bzCalcBtn" style="background:' + (wasOpen ? '#e74c3c' : 'var(--acc2)') + ';color:#fff;padding:5px 12px;border-radius:10px;font-weight:700;font-size:12px">' + (wasOpen ? '✕ Close Calculator' : (IC_MATH_HTML + ' Desmos Calculator')) + '</button>' : '') + '<b id="bzTimer" style="font-size:16px;color:var(--acc);font-variant-numeric:tabular-nums">0:60</b><button class="tbtn" id="bzQuit">✕</button></div>' +
      '</div>' +
      '<div class="pt-split-body"><div class="qb" style="max-width:none;border-radius:26px">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><span class="tag" style="margin:0;font-size:10.5px">' + (q.rw ? 'READING &amp; WRITING' : 'MATH') + ' · ' + bzCfg.lvl.toUpperCase() + '</span><small style="color:var(--mut);font-weight:700">' + q.top + '</small></div>' +
      '<div id="bzQText" style="font-size:' + (q.rw ? 17 : 19) + 'px;line-height:1.55;margin:16px 0">' + fx(q.q) + '</div>' +
      '<div id="bzAnsBox"></div><div id="bzFeedBox"></div></div><div id="ptCP" style="display:' + (wasOpen ? 'block' : 'none') + ';border:2px solid var(--line);border-radius:24px;overflow:hidden;background:#fff"></div></div></div>';

    ov.querySelector('#bzQuit').onclick = closeBlitz;
    bindVocabClicksOnContainer(ov.querySelector('#bzQText'));
    var bzCalcBtn = ov.querySelector('#bzCalcBtn');
    var bzShell = ov.querySelector('#bzShell');
    var bzCP = ov.querySelector('#ptCP');
    var bzCalc = null;
    function mountBzCalc() {
      if (!bzCalc && window.Desmos && bzCP) {
        bzCalc = createFullDesmos(bzCP);
      }
      if (bzCalc) setTimeout(function() { bzCalc.resize(); }, 35);
    }
    if (wasOpen) mountBzCalc();
    if (bzCalcBtn) {
      bzCalcBtn.onclick = function() {
        if (!bzShell.classList.contains('calc-open')) {
          bzShell.classList.add('calc-open');
          bzCP.style.display = 'block';
          ov.dataset.calcOpen = '1';
          bzCalcBtn.style.background = '#e74c3c';
          bzCalcBtn.innerHTML = '✕ Close Calculator';
          mountBzCalc();
        } else {
          bzShell.classList.remove('calc-open');
          bzCP.style.display = 'none';
          ov.dataset.calcOpen = '0';
          bzCalcBtn.style.background = 'var(--acc2)';
          bzCalcBtn.innerHTML = IC_MATH_HTML + ' Desmos Calculator';
        }
      };
    }
    var ansBox = ov.querySelector('#bzAnsBox'), feedBox = ov.querySelector('#bzFeedBox');

    function answerBlitz(val) {
      if (doneQ) return;
      doneQ = true;
      stopTmr();
      var good = (val !== null && (q.isGrid ? same(val, q.ans) : String(val) === q.ans));
      if (good) {
        ok++;
        streak++;
        if (streak > maxStreak) maxStreak = streak;
        var gained = Math.round((100 + qLeft * 2 + streak * 25) * mult);
        score += gained;
        addCoins(5);
        removeMistakeByQuestion(q.q);
        lbAdd(true);
      } else {
        streak = 0;
        recordMistake(q, val, 'Blitz 10 · ' + q.top);
        lbAdd(false);
      }
      ansBox.querySelectorAll('button').forEach(function(b) {
        b.disabled = true;
        if (b.dataset.v === q.ans) b.classList.add('good');
        else if (b.dataset.v === String(val)) b.classList.add('bad');
      });
      var gi = ov.querySelector('#bzGridInp');
      if (gi) { gi.disabled = true; gi.style.borderColor = good ? 'var(--acc)' : '#e74c3c'; }
      feedBox.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;margin-top:16px;padding-top:12px;border-top:1px solid var(--line)">' +
        '<b style="color:' + (good ? 'var(--acc)' : '#e74c3c') + '">' + (good ? 'Correct! +' + Math.round((100 + qLeft * 2 + streak * 25) * mult) + ' pts (+5 ' + IC_COIN_HTML + ')' : 'Incorrect · Saved to Mistakes. Answer: ' + (q.rw ? q.ans : rHTML(fmtAns(q.ans)))) + '</b>' +
        '<button class="cta-amber" id="bzNextBtn">' + (idx < 9 ? 'Next Blitz →' : 'See Results →') + '</button></div>';
      ov.querySelector('#bzNextBtn').onclick = function() { idx++; renderStep(); };
    }

    if (q.isGrid) {
      ansBox.innerHTML = '<input id="bzGridInp" class="qin" placeholder="Type answer &amp; press Enter" autocomplete="off"><button class="cta-amber" id="bzGridSub" style="margin-top:12px">Submit Answer</button>';
      var inp = ov.querySelector('#bzGridInp');
      inp.focus();
      ov.querySelector('#bzGridSub').onclick = function() { if (inp.value) answerBlitz(inp.value.trim()); };
      inp.onkeydown = function(ev) { if (ev.key === 'Enter' && inp.value) answerBlitz(inp.value.trim()); };
    } else {
      q.opts.forEach(function(o, k) {
        var b = document.createElement('button');
        b.className = 'qo';
        b.dataset.v = o;
        b.innerHTML = '<b>' + 'ABCD'[k] + '</b>&nbsp; ' + (q.rw ? o : rHTML(o));
        b.onclick = function() { answerBlitz(o); };
        ansBox.appendChild(b);
      });
    }

    tmr = setInterval(function() {
      qLeft--;
      var tEl = ov.querySelector('#bzTimer');
      if (tEl) tEl.textContent = '0:' + (qLeft < 10 ? '0' : '') + Math.max(0, qLeft);
      if (qLeft <= 0) {
        answerBlitz(null);
      }
    }, 1000);
  }
  renderStep();
}

/* ===== DEDICATED VOCABULARY TAB & MISTAKES TAB & SUPPORT MODAL ===== */
function buildVocabTab() {
  var el = document.getElementById('vVOC');
  if (!el) return;
  var list = getVocabList();
  var h = '<div class="atlas-hero" style="margin-bottom:22px">' +
    '<div>' +
      '<div style="font-size:11.5px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--sand);margin-bottom:4px;display:flex;align-items:center;gap:6px">' + IC_BOOK_HTML + ' PERSONAL SAT LEXICON</div>' +
      '<h1>Vocabulary</h1>' +
      '<p class="sub">Words you highlighted during Mock Exams and R&amp;W passages, complete with definitions and context examples.</p>' +
    '</div>' +
    '<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">' +
      '<button class="cta-amber" id="vocTabAddBtn" style="padding:12px 20px;font-size:13.5px;border-radius:16px">' + spSvg('plus', 16) + ' Add New Word</button>' +
      (list.length ? '<button class="chip" id="vocTabClearBtn" style="padding:10px 14px;color:#e74c3c;border-color:#e74c3c;font-weight:700">Clear All (' + list.length + ')</button>' : '') +
    '</div>' +
  '</div>';

  if (!list.length) {
    h += '<div class="card" style="padding:48px 24px;text-align:center;border-radius:26px">' +
      '<div style="color:var(--sand);margin-bottom:10px">' + spSvg('book', 42) + '</div>' +
      '<h3 style="font-size:20px;font-weight:800;margin-bottom:6px">Your Vocabulary List is Empty</h3>' +
      '<p class="sub" style="max-width:460px;margin:0 auto 18px">Click on any unfamiliar word inside a Reading &amp; Writing passage or Mock Exam to see its meaning and save it here, or add words manually.</p>' +
      '<button class="cta-amber" id="vocEmptyAddBtn">' + spSvg('plus', 15) + ' Add First Word</button>' +
    '</div>';
  } else {
    h += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(310px,1fr));gap:16px">';
    list.forEach(function(item, idx) {
      h += '<div class="card" style="padding:20px;border-radius:22px;display:flex;flex-direction:column;justify-content:space-between;gap:12px">' +
        '<div>' +
          '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px">' +
            '<div><b style="font-size:20px;color:var(--sand);letter-spacing:-.01em">' + lbEsc(item.w) + '</b><span class="tag" data-voc-ru style="margin-left:8px;font-size:10px">' + lbEsc(item.ru || 'SAT Term') + '</span></div>' +
            '<button class="tbtn" data-voc-del="' + idx + '" title="Remove word" style="width:30px;height:30px;font-size:12px">✕</button>' +
          '</div>' +
          '<div data-voc-mean="' + lbEsc(item.w) + '" style="margin-top:10px">' + vocMeaningHTML(item) + '</div>' +
        '</div>' +
        '<div style="background:var(--panel2);border:1px solid var(--line);padding:10px 12px;border-radius:14px;font-size:12.5px;color:var(--mut);line-height:1.45">' +
          '<b style="color:var(--tx);font-size:11px;text-transform:uppercase;letter-spacing:.05em;display:block;margin-bottom:2px;font-style:normal">Example in Context</b>' +
          '<i>"' + lbEsc(item.ctx || ('The passage demonstrates how "' + item.w + '" functions in academic analysis.')) + '"</i>' +
        '</div>' +
      '</div>';
    });
    h += '</div>';
  }
  el.innerHTML = h;
  var addB = el.querySelector('#vocTabAddBtn');
  if (addB) addB.onclick = function() { openAddWordModal('', buildVocabTab); };
  var addE = el.querySelector('#vocEmptyAddBtn');
  if (addE) addE.onclick = function() { openAddWordModal('', buildVocabTab); };
  var clrB = el.querySelector('#vocTabClearBtn');
  if (clrB) clrB.onclick = function() {
    spModalConfirm('Clear all saved words from your Vocabulary?', function() {
      saveVocabList([]);
      buildVocabTab();
    });
  };
  el.querySelectorAll('[data-voc-del]').forEach(function(btn) {
    btn.onclick = function() {
      var l = getVocabList();
      l.splice(+btn.dataset.vocDel, 1);
      saveVocabList(l);
      buildVocabTab();
    };
  });
  bindVocMeanEvents(el);
  vocBackfill();
}

var mkFilter = 'all'; // 'all' | 'math' | 'rw'
function buildMistakesTab() {
  var el = document.getElementById('vERR');
  if (!el) return;
  var all = getMistakes();
  var filtered = all.filter(function(x) {
    if (mkFilter === 'math') return !x.rw;
    if (mkFilter === 'rw') return !!x.rw;
    return true;
  });

  var h = '<div class="atlas-hero" style="margin-bottom:22px">' +
    '<div>' +
      '<div style="font-size:11.5px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--sand);margin-bottom:4px;display:flex;align-items:center;gap:6px">' + IC_AIM_HTML + ' ERROR CORRECTION HUB · MAX 500</div>' +
      '<h1>Mistakes Review</h1>' +
      '<p class="sub">Every question you miss in Mock Exams, Atlas, Path, or Blitz is saved here (' + all.length + ' / 500). Solve a question correctly in a review test and it will automatically disappear from this list!</p>' +
    '</div>' +
    '<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">' +
      (filtered.length ? '<button class="cta-amber" id="mkStartTestBtn" style="padding:13px 22px;font-size:14px;border-radius:16px">' + spSvg('zap', 16) + ' Start Mistake Drill (' + Math.min(15, filtered.length) + ' Qs) →</button>' : '') +
    '</div>' +
  '</div>' +
  '<div class="atlas-controls">' +
    '<div class="island-pills">' +
      '<button class="island-pill' + (mkFilter === 'all' ? ' on' : '') + '" data-mkf="all">All Mistakes (' + all.length + ')</button>' +
      '<button class="island-pill' + (mkFilter === 'math' ? ' on' : '') + '" data-mkf="math">' + IC_MATH_HTML + ' Math (' + all.filter(function(x){return !x.rw}).length + ')</button>' +
      '<button class="island-pill' + (mkFilter === 'rw' ? ' on' : '') + '" data-mkf="rw">' + IC_BOOK_HTML + ' R&amp;W (' + all.filter(function(x){return !!x.rw}).length + ')</button>' +
    '</div>' +
    (all.length ? '<button class="chip" id="mkClearAllBtn" style="color:#e74c3c;border-color:#e74c3c;font-weight:700">Clear All Mistakes</button>' : '') +
  '</div>';

  if (!filtered.length) {
    h += '<div class="card" style="padding:48px 24px;text-align:center;border-radius:26px">' +
      '<div style="color:var(--acc);margin-bottom:10px">' + spSvg('award', 42) + '</div>' +
      '<h3 style="font-size:20px;font-weight:800;margin-bottom:6px">Zero Pending Mistakes!</h3>' +
      '<p class="sub" style="max-width:460px;margin:0 auto">You have cleared all mistakes in this category. Keep practicing in Mock Exams or the Atlas!</p>' +
    '</div>';
  } else {
    h += '<div style="display:grid;gap:14px">';
    filtered.forEach(function(item, idx) {
      var fx = function(s) { return item.rw ? String(s) : rHTML(s); };
      h += '<div class="card" style="padding:20px 22px;border-radius:22px;display:flex;justify-content:space-between;align-items:flex-start;gap:16px;flex-wrap:wrap">' +
        '<div style="flex:1;min-width:260px">' +
          '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;flex-wrap:wrap">' +
            '<span class="tag n" style="margin:0">' + (item.rw ? 'R&amp;W' : 'MATH') + '</span>' +
            '<span class="tag" style="margin:0">' + lbEsc(item.top || 'SAT Topic') + '</span>' +
            '<small style="color:var(--mut);font-size:11.5px">' + lbEsc(item.src || '') + '</small>' +
          '</div>' +
          '<div style="font-size:15.5px;line-height:1.55;margin-bottom:10px">' + fx(item.q) + '</div>' +
          '<div style="font-size:12.5px;color:#e74c3c;font-weight:700">Previous answer: ' + fx(item.wrongAns) + '</div>' +
        '</div>' +
        '<div style="display:flex;gap:8px;align-items:center">' +
          '<button class="cta" data-mk-single="' + idx + '" style="padding:9px 15px;font-size:12.5px;border-radius:12px">Retry Question →</button>' +
          '<button class="tbtn" data-mk-del="' + item.id + '" title="Remove from mistakes">✕</button>' +
        '</div>' +
      '</div>';
    });
    h += '</div>';
  }

  el.innerHTML = h;
  el.querySelectorAll('[data-mkf]').forEach(function(b) {
    b.onclick = function() { mkFilter = b.dataset.mkf; buildMistakesTab(); };
  });
  var clr = el.querySelector('#mkClearAllBtn');
  if (clr) clr.onclick = function() {
    spModalConfirm('Clear all saved questions from your Mistakes list?', function() {
      saveMistakes([]);
      buildMistakesTab();
    });
  };
  el.querySelectorAll('[data-mk-del]').forEach(function(b) {
    b.onclick = function() {
      var list = getMistakes().filter(function(x) { return x.id !== b.dataset.mkDel; });
      saveMistakes(list);
      buildMistakesTab();
    };
  });
  el.querySelectorAll('[data-mk-single]').forEach(function(b) {
    b.onclick = function() {
      var target = filtered[+b.dataset.mkSingle];
      if (target) startMistakesDrill([target]);
    };
  });
  var startBtn = el.querySelector('#mkStartTestBtn');
  if (startBtn) startBtn.onclick = function() {
    startMistakesDrill(filtered.slice(0, 15));
  };
}

function startMistakesDrill(questionsList) {
  if (!questionsList || !questionsList.length) return;
  var idx = 0, clearedCount = 0;
  var ov = document.createElement('div');
  ov.style.cssText = 'position:fixed;inset:0;z-index:95;background:var(--bg);overflow:auto;padding:24px';
  document.body.appendChild(ov);

  function closeDrill() {
    closeActiveVocabPopover();
    ov.remove();
    buildMistakesTab();
  }

  function renderQ() {
    closeActiveVocabPopover();
    if (idx >= questionsList.length) {
      if (clearedCount > 0) confetti();
      ov.innerHTML = '<div class="qb" style="max-width:540px;margin:30px auto;text-align:center;border-radius:28px;border:2px solid var(--sand-line)">' +
        '<div style="color:var(--sand);margin-bottom:8px">' + spSvg('award', 42) + '</div>' +
        '<h2 style="font-size:26px;font-weight:800">Mistake Drill Complete!</h2>' +
        '<div class="big" style="color:var(--acc);margin:12px 0">' + clearedCount + ' / ' + questionsList.length + '</div>' +
        '<p class="sub" style="margin-bottom:20px">' + clearedCount + ' question(s) solved correctly and permanently removed from your Mistakes list!</p>' +
        '<button class="cta-amber" id="mkDoneBtn">Back to Mistakes Hub →</button>' +
      '</div>';
      ov.querySelector('#mkDoneBtn').onclick = closeDrill;
      return;
    }

    var q = questionsList[idx];
    var done = false;
    var fx = function(s) { return q.rw ? wrapWordsForVocab(s) : rHTML(s); };
    var wasOpen = ov.dataset.calcOpen === '1' && !q.rw;

    ov.innerHTML = '<div id="mkSplitWrap" class="quiz-split-wrap' + (wasOpen ? ' calc-open' : '') + '">' +
      '<div class="qb" style="border-radius:26px">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:12px">' +
          '<div style="display:flex;align-items:center;gap:8px"><span class="tag n" style="margin:0">MISTAKE DRILL ' + (idx + 1) + '/' + questionsList.length + '</span><small style="color:var(--mut);font-weight:700">' + lbEsc(q.top || '') + '</small></div>' +
          '<div style="display:flex;align-items:center;gap:8px">' +
            (!q.rw ? '<button id="mkCalcBtn" style="background:' + (wasOpen ? '#e74c3c' : 'var(--acc2)') + ';color:#fff;padding:5px 12px;border-radius:10px;font-weight:700;font-size:12px">' + (wasOpen ? '✕ Close Calculator' : (IC_MATH_HTML + ' Desmos Calculator')) + '</button>' : '') +
            '<button class="tbtn" id="mkQuit">✕</button>' +
          '</div>' +
        '</div>' +
        '<div id="mkPassage" style="font-size:19px;line-height:1.6;margin:18px 0">' + fx(q.q) + '</div>' +
        '<div id="mkAns"></div><div id="mkFeed"></div>' +
      '</div>' +
      '<div id="mkCalcPane" class="quiz-calc-pane"></div>' +
    '</div>';

    ov.querySelector('#mkQuit').onclick = closeDrill;
    bindVocabClicksOnContainer(ov.querySelector('#mkPassage'));

    var mkCalcBtn = ov.querySelector('#mkCalcBtn');
    var mkSplitWrap = ov.querySelector('#mkSplitWrap');
    var mkCalcPane = ov.querySelector('#mkCalcPane');
    var mkCalc = null;
    function mountMkCalc() {
      if (!mkCalc && window.Desmos && mkCalcPane) mkCalc = createFullDesmos(mkCalcPane);
      if (mkCalc) setTimeout(function() { mkCalc.resize(); }, 35);
    }
    if (wasOpen) mountMkCalc();
    if (mkCalcBtn) {
      mkCalcBtn.onclick = function() {
        if (!mkSplitWrap.classList.contains('calc-open')) {
          mkSplitWrap.classList.add('calc-open');
          ov.dataset.calcOpen = '1';
          mkCalcBtn.style.background = '#e74c3c';
          mkCalcBtn.innerHTML = '✕ Close Calculator';
          mountMkCalc();
        } else {
          mkSplitWrap.classList.remove('calc-open');
          ov.dataset.calcOpen = '0';
          mkCalcBtn.style.background = 'var(--acc2)';
          mkCalcBtn.innerHTML = IC_MATH_HTML + ' Desmos Calculator';
        }
      };
    }

    var a = ov.querySelector('#mkAns'), f = ov.querySelector('#mkFeed');
    function checkAns(v) {
      if (done) return; done = true;
      var good = (q.isGrid ? same(v, q.ans) : String(v) === q.ans);
      if (good) {
        clearedCount++;
        removeMistakeByQuestion(q.q);
        addCoins(5, 'Mistake resolved!');
      }
      a.querySelectorAll('button').forEach(function(b) {
        b.disabled = true;
        if (b.dataset.v === q.ans) b.classList.add('good');
        else if (b.dataset.v === String(v)) b.classList.add('bad');
      });
      var gi = ov.querySelector('#mkInp');
      if (gi) { gi.disabled = true; gi.style.borderColor = good ? 'var(--acc)' : '#e74c3c'; }
      f.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;margin-top:16px;padding-top:12px;border-top:1px solid var(--line)">' +
        '<b style="color:' + (good ? 'var(--acc)' : '#e74c3c') + '">' + (good ? '✓ Solved! Removed from Mistakes (+5 PC)' : '✗ Still incorrect. Correct answer: ' + (q.rw ? q.ans : rHTML(fmtAns(q.ans)))) + '</b>' +
        '<button class="cta-amber" id="mkNextBtn">' + (idx < questionsList.length - 1 ? 'Next Question →' : 'Finish Drill →') + '</button>' +
      '</div>';
      ov.querySelector('#mkNextBtn').onclick = function() { idx++; renderQ(); };
    }

    if (q.isGrid) {
      a.innerHTML = '<input id="mkInp" class="qin" placeholder="Enter your answer" autocomplete="off"><button class="cta-amber" id="mkSub" style="margin-top:12px">Check Answer</button>';
      var inp = ov.querySelector('#mkInp');
      inp.focus();
      ov.querySelector('#mkSub').onclick = function() { if (inp.value) checkAns(inp.value.trim()); };
      inp.onkeydown = function(e) { if (e.key === 'Enter' && inp.value) checkAns(inp.value.trim()); };
    } else {
      (q.opts || []).forEach(function(o, k) {
        var b = document.createElement('button');
        b.className = 'qo';
        b.dataset.v = o;
        b.innerHTML = '<b>' + 'ABCD'[k] + '</b>&nbsp; ' + (q.rw ? String(o) : rHTML(o));
        b.onclick = function() { checkAns(o); };
        a.appendChild(b);
      });
    }
  }
  renderQ();
}

function openSupportModal() {
  var ov = document.createElement('div');
  ov.style.cssText = 'position:fixed;inset:0;z-index:150;background:rgba(6,21,23,0.78);backdrop-filter:blur(4px);display:grid;place-items:center;padding:20px';
  ov.innerHTML = '<div class="qb" style="max-width:500px;width:100%;border-radius:28px;border:2px solid var(--sand-line);animation:up .2s ease">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:14px;border-bottom:1.5px dashed var(--line);margin-bottom:16px">' +
      '<div><small style="color:var(--sand);font-weight:800;letter-spacing:.08em;text-transform:uppercase">ARCHIPELAGO COMMS</small><h2 style="font-size:22px;font-weight:800">Technical Support</h2></div>' +
      '<button class="tbtn" id="supClose">✕</button>' +
    '</div>' +
    '<p class="sub" style="margin-bottom:18px">Need help with your account, found a bug, or have a feature request? Reach out directly to our team:</p>' +
    '<div style="display:grid;gap:12px">' +
      '<a href="https://t.me/slayerofprep" target="_blank" rel="noopener" class="card" style="padding:14px 18px;border-radius:18px;display:flex;justify-content:space-between;align-items:center;text-decoration:none;border-color:var(--acc)">' +
        '<div style="display:flex;align-items:center;gap:12px"><span style="width:38px;height:38px;border-radius:12px;background:rgba(34,163,129,0.15);color:var(--acc);display:grid;place-items:center">' + spSvg('send', 18) + '</span><div><b style="font-size:15px;display:block">Telegram Support 1</b><small style="color:var(--mut)">@slayerofprep</small></div></div>' +
        '<span class="tag n" style="margin:0">Message →</span>' +
      '</a>' +
      '<a href="https://t.me/gOlvzZ" target="_blank" rel="noopener" class="card" style="padding:14px 18px;border-radius:18px;display:flex;justify-content:space-between;align-items:center;text-decoration:none;border-color:var(--acc)">' +
        '<div style="display:flex;align-items:center;gap:12px"><span style="width:38px;height:38px;border-radius:12px;background:rgba(34,163,129,0.15);color:var(--acc);display:grid;place-items:center">' + spSvg('send', 18) + '</span><div><b style="font-size:15px;display:block">Telegram Support 2</b><small style="color:var(--mut)">@gOlvzZ</small></div></div>' +
        '<span class="tag n" style="margin:0">Message →</span>' +
      '</a>' +
      '<a href="mailto:satpath1600@gmail.com" class="card" style="padding:14px 18px;border-radius:18px;display:flex;justify-content:space-between;align-items:center;text-decoration:none;border-color:var(--sand-line)">' +
        '<div style="display:flex;align-items:center;gap:12px"><span style="width:38px;height:38px;border-radius:12px;background:var(--sand-bg);color:var(--sand);display:grid;place-items:center">' + spSvg('mail', 18) + '</span><div><b style="font-size:15px;display:block">Email Support</b><small style="color:var(--mut)">satpath1600@gmail.com</small></div></div>' +
        '<span class="tag" style="margin:0;border-color:var(--sand);color:var(--sand)">Email →</span>' +
      '</a>' +
    '</div>' +
  '</div>';
  document.body.appendChild(ov);
  ov.querySelector('#supClose').onclick = function() { ov.remove(); };
  ov.addEventListener('click', function(e) { if (e.target === ov) ov.remove(); });
}

/* Настройка сайдбара и контейнеров: кнопки Vocabulary / Mistake Log уже есть в HTML (nvVOC, nvERR) — вешаем на них обработчики */
(function setupNavigationAndContainers() {
  var scBtn = document.getElementById('nvSC');
  if (scBtn) scBtn.remove();
  var scView = document.getElementById('vSC');
  if (scView) scView.remove();

  var mainEl = document.querySelector('.main');
  var dashEl = document.getElementById('vDash');
  function ensureView(id) {
    if (document.getElementById(id) || !mainEl || !dashEl) return;
    var v = document.createElement('div');
    v.className = 'qbk';
    v.id = id;
    v.hidden = true;
    v.style.maxWidth = '1080px';
    mainEl.insertBefore(v, dashEl);
  }
  ensureView('vVOC');
  ensureView('vERR');

  function ensureNav(id, afterId, html, target) {
    var b = document.getElementById(id);
    if (!b) {
      var after = document.getElementById(afterId);
      if (!after) return;
      b = document.createElement('button');
      b.className = 'nav';
      b.id = id;
      b.innerHTML = html;
      after.insertAdjacentElement('afterend', b);
    }
    b.onclick = function() { show(target); };
  }
  ensureNav('nvVOC', 'nvPT', '<i data-lucide="bookmark-check"></i> Vocabulary <span class="tag" id="sideVocCnt">0</span>', 'voc');
  ensureNav('nvERR', 'nvVOC', '<i data-lucide="shield-alert"></i> Mistake Log <span class="tag" id="sideErrCnt">0</span>', 'mk');

  ['btnOpenSupport', 'hudSupBtn'].forEach(function(id) {
    var b = document.getElementById(id);
    if (b) b.onclick = openSupportModal;
  });

  var footerEl = document.querySelector('.legal-footer');
  if (footerEl) {
    footerEl.innerHTML = 'SAT is a registered trademark of College Board, which is not affiliated with SATPath. &nbsp;·&nbsp; <button type="button" onclick="openSupportModal()" style="color:var(--acc);font-weight:700">Support: @slayerofprep · @gOlvzZ · satpath1600@gmail.com</button>';
  }
  updateNavBadges();
})();

function show(w){
  var V={
    d:document.getElementById('vDash'),
    m:mp,
    b:qk,
    r:rw,
    lb:document.getElementById('vLB'),
    pt:document.getElementById('vPT'),
    bz:document.getElementById('vBZ'),
    voc:document.getElementById('vVOC'),
    mk:document.getElementById('vERR')
  };
  var N={d:'nvD',m:'nvMP',b:'nvQB',r:'nvRW',lb:'nvLB',pt:'nvPT',bz:'nvBZ',voc:'nvVOC',mk:'nvERR'};
  var titles={
    d:'Base Camp · Archipelago',
    m:'Math Path · Odyssey',
    b:'Atlas · Training Grounds',
    r:'R&W Path · Odyssey',
    lb:'Explorer Leaderboard',
    pt:'Mock Exams · Expeditions',
    bz:'Blitz 10 · High-Speed Arena',
    voc:'Vocabulary · Personal Lexicon',
    mk:'Mistakes Review · Error Correction'
  };
  for(var k in V){
    if(V[k]) V[k].hidden=(k!==w);
    var nb=document.getElementById(N[k]);
    if(nb) nb.classList.toggle('on',k===w);
  }
  var locEl=document.getElementById('topLocLabel');
  if(locEl && titles[w]) locEl.textContent=titles[w];
  document.getElementById('side').classList.remove('o');
  paintHud();
  updateNavBadges();
  if(w==='m'){if(!built)build();else paint();var c=mp.querySelector('.cur');if(c)setTimeout(function(){c.scrollIntoView({block:'center'})},50)}
  else if(w==='r'){if(!rbuilt)buildRW();else paintRW();var c=rw.querySelector('.cur');if(c)setTimeout(function(){c.scrollIntoView({block:'center'})},50)}
  else if(w==='b'){buildBank();scrollTo(0,0)}
  else if(w==='lb'){lbOff=0;buildLB();scrollTo(0,0)}
  else if(w==='pt'){buildPT();scrollTo(0,0)}
  else if(w==='bz'){buildBlitz();scrollTo(0,0)}
  else if(w==='voc'){buildVocabTab();scrollTo(0,0)}
  else if(w==='mk'){buildMistakesTab();scrollTo(0,0)}
  else {scrollTo(0,0);refreshDash()}
}

document.getElementById('nvD').onclick=function(){show('d')};
document.getElementById('nvMP').onclick=function(){show('m')};
document.getElementById('nvQB').onclick=function(){show('b')};
document.getElementById('nvRW').onclick=function(){show('r')};
document.getElementById('nvPT').onclick=function(){show('pt')};
var nvBzEl = document.getElementById('nvBZ'); if(nvBzEl) nvBzEl.onclick=function(){show('bz')};
var sbUserEl = document.getElementById('sidebarUserBox'); if(sbUserEl) sbUserEl.onclick=openProfileModal;
var btnProfEl = document.getElementById('btnEditProfile'); if(btnProfEl) btnProfEl.onclick=openProfileModal;
document.getElementById('hudShopBtn').onclick=openSupplyShop;
document.getElementById('hudCoinBtn').onclick=openSupplyShop;

var sd=document.getElementById('side');
document.getElementById('bg').onclick=function(e){e.stopPropagation();sd.classList.toggle('o')};
document.querySelector('.main').addEventListener('click',function(){sd.classList.remove('o')});
document.getElementById('th').onclick=function(){var r=document.documentElement,dk=r.dataset.theme?r.dataset.theme=='dark':matchMedia('(prefers-color-scheme:dark)').matches;r.dataset.theme=dk?'light':'dark'};
var FB_CONFIG = {
  apiKey: "AIzaSyApS0OklFNhdr5LMyqnq3Qt0dIoGiQIaTU",
  authDomain: "satpath-3ec98.firebaseapp.com",
  projectId: "satpath-3ec98",
  storageBucket: "satpath-3ec98.firebasestorage.app",
  messagingSenderId: "766311395755",
  appId: "1:766311395755:web:b0c6314a631ee92da462ee"
};

/* ===== LEADERBOARD (Firebase) ===== */
var FB=null,FBU=null,lbOff=0,lbCache={},lbT;
function lbEsc(s){return String(s).replace(/[&<>"']/g,function(c){return'&#'+c.charCodeAt(0)+';'})}
function monthId(o){var d=new Date();d=new Date(d.getFullYear(),d.getMonth()+(o||0),1);return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)}
function lbGet(m){
  try{
    var o=JSON.parse(spGet('satpath_lb_'+m))||{};
    return {pts:Math.max(0,+o.pts||0),q:Math.max(0,+o.q||0),c:Math.max(0,+o.c||0)};
  }catch(e){return{pts:0,q:0,c:0}}
}
var lbBusy=false;
async function lbFlush(){
  if(!FB||!FBU||lbBusy)return;
  var m=monthId(),p=lbGet(m);
  if(p.pts<=0&&p.q<=0)return;
  lbBusy=true;
  lbSet(m,{pts:0,q:0,c:0});
  var s=FB.fs;
  try{
    await s.setDoc(s.doc(FB.db,'lb_'+m,FBU.uid),
      {name:shortName(FBU),photo:FBU.photoURL||'',
       pts:s.increment(p.pts),q:s.increment(p.q),c:s.increment(p.c),t:Date.now()},{merge:true});
    lbCache={};
  }catch(e){
    var n=lbGet(m);
    lbSet(m,{pts:n.pts+p.pts,q:n.q+p.q,c:n.c+p.c});
  }
  lbBusy=false;
}
function lbSet(m,p){try{spSet('satpath_lb_'+m,JSON.stringify(p))}catch(e){}}
function lbAdd(good,bonus){var m=monthId(),p=lbGet(m);
 if(good!==null&&good!==undefined){p.q++;if(good){p.c++;p.pts+=10}}
 if(bonus)p.pts+=bonus;lbSet(m,p);clearTimeout(lbT);lbT=setTimeout(lbFlush,60000)}
function shortName(u){var p=(u.displayName||'Student').split(' ');return p[0]+(p[1]?' '+p[1][0]+'.':'')}

async function fbInit(){if(!FB_CONFIG||FB)return;
 var B='https://www.gstatic.com/firebasejs/10.12.2/';
 var a=await import(B+'firebase-app.js'),au=await import(B+'firebase-auth.js'),f=await import(B+'firebase-firestore.js');
 var app=a.initializeApp(FB_CONFIG);FB={auth:au.getAuth(app),db:f.getFirestore(app),au:au,fs:f};
 au.onAuthStateChanged(FB.auth,function(u){FBU=u;paintUser();if(u)lbFlush();if(!document.getElementById('vLB').hidden)buildLB()})}
function paintUser(){var u=FBU,soAll=document.querySelectorAll('.so');
 if(u){var p=getProfile();if(!p.name||p.name==='Explorer'||p.name==='Guest'){p.name=u.displayName||u.email.split('@')[0];saveProfile(p)}}
 applyProfileUI();
 var lastSo = soAll[soAll.length-1];
 if(lastSo) lastSo.textContent = u ? 'Sign Out' : 'Sign in with Google';
}
function lbSign(){if(!FB_CONFIG)return toast('Leaderboard is not configured yet');
 fbInit().then(function(){FBU?FB.au.signOut(FB.auth):FB.au.signInWithPopup(FB.auth,new FB.au.GoogleAuthProvider()).catch(function(e){console.error(e);toast('Sign-in failed: '+(e.code||e.message))})})}
function lbRow(r,i,max,mine){var acc=r.q?Math.round(r.c/r.q*100):0,ok=r.photo&&/^https:\/\//.test(r.photo);
 return'<div class="lbr'+(mine?' me':'')+'"><span class="rk">'+(i+1)+'</span>'+(ok?'<img class="pa" referrerpolicy="no-referrer" src="'+encodeURI(r.photo)+'" alt="">':'<span class="pa">'+lbEsc((r.name||'?')[0])+'</span>')+'<b>'+lbEsc(r.name||'Student')+'</b><span class="bw"><i style="width:'+Math.round(r.pts/(max||1)*100)+'%"></i></span><span class="n">'+r.pts.toLocaleString()+'</span><span class="n s">'+r.q.toLocaleString()+'</span><span class="n s">'+acc+'%</span></div>'}
async function buildLB(){var el=document.getElementById('vLB');
 if(!FB_CONFIG){el.innerHTML='<h1>Leaderboard</h1><p class="sub">Paste your firebaseConfig into FB_CONFIG in the script to turn this on.</p>';return}
 el.innerHTML='<h1>Leaderboard</h1><p class="sub">Loading…</p>';
 try{await fbInit();if(FBU&&lbOff===0)await lbFlush();
  var m=monthId(lbOff),s=FB.fs,c=lbCache[m];
  if(!c||Date.now()-c.t>180000){var col=s.collection(FB.db,'lb_'+m);
   var snap=await s.getDocs(s.query(col,s.orderBy('pts','desc'),s.limit(20)));
   var tot=(await s.getCountFromServer(col)).data().count;
   c=lbCache[m]={t:Date.now(),tot:tot,me:null,rank:null,rows:snap.docs.map(function(d){return Object.assign({id:d.id},d.data())})};
   if(FBU){var md=await s.getDoc(s.doc(FB.db,'lb_'+m,FBU.uid));
    if(md.exists()){c.me=md.data();c.rank=(await s.getCountFromServer(s.query(col,s.where('pts','>',c.me.pts)))).data().count+1}}}
  var d0=new Date(m+'-01T12:00:00'),mon=d0.toLocaleString('en',{month:'long'}),nx=new Date(d0.getFullYear(),d0.getMonth()+1,1).toLocaleString('en',{month:'long'});
  var me=c.me?Object.assign({},c.me):null,pend=lbOff===0?lbGet(m):null;
  if(me&&pend){me.pts+=pend.pts;me.q+=pend.q;me.c+=pend.c}
  if(me){me.pts=Math.max(0,me.pts);me.q=Math.max(0,me.q);me.c=Math.max(0,me.c)}
  var max=c.rows.length?c.rows[0].pts:1,head;
  if(!FBU)head='<div><small style="color:var(--mut)">Join the ranking</small><div style="margin-top:8px"><button class="cta" id="lbin">Sign in with Google</button></div></div>';
  else if(!me)head='<div><small style="color:var(--mut)">Not ranked yet</small><div style="margin-top:6px">Answer a question to join <b>'+mon+'</b>.</div></div>';
  else head='<div><div class="rk"><sup>#</sup>'+c.rank.toLocaleString()+'</div><small style="color:var(--mut)">of '+c.tot.toLocaleString()+' students in '+mon+'</small></div><div class="lbst"><div><small>Points</small><b>'+me.pts.toLocaleString()+'</b></div><div><small>Questions</small><b>'+me.q.toLocaleString()+'</b></div><div><small>Accuracy</small><b>'+(me.q?Math.round(me.c/me.q*100):0)+'%</b></div></div>';
  el.innerHTML='<h1>Leaderboard</h1><div class="lbc lbme">'+head+'</div><div class="lbc" style="padding:20px 22px"><div style="display:flex;justify-content:space-between;align-items:center"><div><b style="font-size:20px">'+mon+' '+d0.getFullYear()+'</b><div class="sub" style="font-size:12px">Monthly ranking · Top 20 · Resets '+nx+' 1</div></div><div class="lbnav"><button data-lb="-1"'+(lbOff<=-5?' disabled':'')+'>‹</button> <button data-lb="1"'+(lbOff>=0?' disabled':'')+'>›</button></div></div>'
   +'<div class="lbh" style="margin-top:14px"><span></span><span></span><span>Student</span><span class="x"></span><span style="text-align:right">Points</span><span class="x" style="text-align:right">Questions</span><span class="x" style="text-align:right">Accuracy</span></div>'
   +(c.rows.length?c.rows.map(function(r,i){return lbRow(r,i,max,FBU&&r.id===FBU.uid)}).join(''):'<p class="sub" style="padding:16px 0">No one here yet. Be the first!</p>')+'</div>';
  var b=document.getElementById('lbin');if(b)b.onclick=lbSign;
  el.querySelectorAll('[data-lb]').forEach(function(x){x.onclick=function(){lbOff+=+x.dataset.lb;buildLB()}})
 }catch(e){el.innerHTML='<h1>Leaderboard</h1><p class="sub">Could not load the leaderboard. Check your Firebase config and rules.</p>'}}
document.getElementById('nvLB').onclick=function(){show('lb')};
var _soAll=document.querySelectorAll('.so');var _so=_soAll[_soAll.length-1];if(_so){_so.style.cursor='pointer';_so.onclick=lbSign;}
document.addEventListener('visibilitychange',function(){if(document.hidden)lbFlush()});
if(FB_CONFIG)fbInit();

function renderFiveWaypoints(curIdx) {
  var stepInTopic = curIdx % 5;
  var icons = [IC_BOOK_SM_HTML, '1', '2', '3', IC_LORD_SM_HTML];
  var out = '';
  for (var s = 0; s < 5; s++) {
    var cls = s < stepInTopic ? 'trail-dot done' : (s === stepInTopic ? 'trail-dot cur' : 'trail-dot');
    out += '<span class="' + cls + '" title="' + TYPES[s].l + '">' + (s < stepInTopic ? '✓' : icons[s]) + '</span>';
  }
  return out;
}

function refreshDash(){
  paintHud();
  updateNavBadges();
  var md=getDone(), rd=getRDone(), st=bankStats();
  var mCur=0; for(var i=0;i<100;i++)if(md.indexOf(i)<0){mCur=i;break}
  document.getElementById('dMathPct').textContent=md.length+'/100 islands';
  document.getElementById('dMathBar').style.width=md.length+'%';
  document.getElementById('dMathTop').textContent=TOPS[Math.floor(mCur/5)]||'All complete!';
  document.getElementById('dMathStep').textContent='Waypoint '+(mCur%5+1)+'/5 · '+TYPES[mCur%5].l;
  var mTr=document.getElementById('dMathTrail'); if(mTr) mTr.innerHTML=renderFiveWaypoints(mCur);

  var rCur=0; for(var j=0;j<50;j++)if(rd.indexOf(j)<0){rCur=j;break}
  document.getElementById('dRwPct').textContent=rd.length+'/50 islands';
  document.getElementById('dRwBar').style.width=(rd.length*2)+'%';
  document.getElementById('dRwTop').textContent=RTOPS[Math.floor(rCur/5)]||'All complete!';
  document.getElementById('dRwStep').textContent='Waypoint '+(rCur%5+1)+'/5 · '+TYPES[rCur%5].l;
  var rTr=document.getElementById('dRwTrail'); if(rTr) rTr.innerHTML=renderFiveWaypoints(rCur);

  var totA=0, totC=0;
  Object.keys(st).forEach(function(k){totA+=st[k].a||0; totC+=st[k].c||0});
  var acc=totA?Math.round(totC/totA*100):65;
  var mScore=Math.min(800, Math.round((420 + md.length*2.5 + (acc*1.3))/10)*10);
  var rScore=Math.min(800, Math.round((420 + rd.length*5.0 + (acc*1.3))/10)*10);
  document.getElementById('dScore').textContent=(mScore+rScore);
  document.getElementById('dScoreM').textContent=mScore;
  document.getElementById('dScoreR').textContent=rScore;
  document.getElementById('dAccTxt').textContent=totA?(totC+' / '+totA+' Atlas drills correct ('+acc+'% accuracy)'):'Explore islands in the Atlas to calibrate accuracy';

  var list=[];
  TOPS.forEach(function(name,idx){
    var r=st[idx]||{a:0,c:0};
    var stars=getTopicStars(idx,false,idx);
    var p=r.a?Math.round(r.c/r.a*100):-1;
    list.push({idx:idx,name:name,p:p,a:r.a,stars:stars});
  });
  var attempted=list.filter(function(x){return x.a>0}).sort(function(a,b){return a.stars-b.stars || a.p-b.p});
  var picks=(attempted.length>=3?attempted:attempted.concat(list.filter(function(x){return x.a===0}))).slice(0,3);
  document.getElementById('dRadar').innerHTML=picks.map(function(x){
    var stStr = '★'.repeat(x.stars) + '☆'.repeat(3-x.stars);
    return '<button class="qr" data-dti="'+x.idx+'" style="padding:12px 2px"><b>'+x.name+'</b><small class="pc" style="color:var(--sand);font-weight:800">'+stStr+' →</small></button>';
  }).join('');
  document.querySelectorAll('[data-dti]').forEach(function(b){
    b.onclick=function(){show('b');bankOpen(+b.dataset.dti)};
  });
}

function initDailyChallenges() {
  var todayStr = new Date().toISOString().slice(0, 10);
  document.getElementById('dMathDate').textContent = todayStr;
  document.getElementById('dRwDate').textContent = todayStr;

  var mKey = 'satpath_daily_m_' + todayStr;
  var mData; try { mData = JSON.parse(spGet(mKey) || 'null'); } catch(e) {} if (!mData) mData = {idx:0, ok:0, done:false, list:null};
  if (!mData.list) {
    mData.list = [];
    for (var i = 0; i < 3; i++) {
      var ti = R(0, TOPS.length - 1), q;
      for (var a = 0; a < 10; a++) {
        q = getMathQ(ti, 'medium', R(0, 99));
        if (!q.isGrid) break;
      }
      if (q.isGrid) q.opts = shuffle([q.ans, String(+q.ans + 2), String(+q.ans - 1), String(+q.ans + 5)]);
      mData.list.push({ top: TOPS[ti], q: q.q, ans: q.ans, opts: q.opts });
    }
    spSet(mKey, JSON.stringify(mData));
  }
  renderDailyWidget('Math', mData, mKey);
  var rKey = 'satpath_daily_r_' + todayStr;
  var rData; try { rData = JSON.parse(spGet(rKey) || 'null'); } catch(e) {} if (!rData) rData = {idx:0, ok:0, done:false, list:null};
  if (!rData.list) {
    var poolAll = [];
    RTOPS.forEach(function(tName, idx) {
      if (RQ[idx]) {
        RQ[idx].forEach(function(item) {
          poolAll.push({ top: tName, q: item[0], ans: item[1], opts: shuffle(item.slice(1)) });
        });
      }
    });
    rData.list = shuffle(poolAll).slice(0, 3);
    spSet(rKey, JSON.stringify(rData));
  }
  renderDailyWidget('Rw', rData, rKey);
}

function renderDailyWidget(type, data, storageKey) {
  var prefix = 'd' + type;
  var topElem = document.getElementById(prefix + 'DayTop');
  var qElem = document.getElementById(prefix + 'Q');
  var optsBox = document.getElementById(prefix + 'Opts');
  var msgBox = document.getElementById(prefix + 'Msg');
  var badge = document.getElementById(prefix + 'Badge');
  var stat = document.getElementById(prefix + 'Stat');

  if (data.done || data.idx >= data.list.length) {
    badge.textContent = '3/3 ✓';
    stat.textContent = 'Score today: ' + data.ok + '/3';
    if (topElem) topElem.textContent = '';
    qElem.innerHTML = '<div style="text-align:center;padding:15px 0"><div>' + spIco('trophy','ui-ic-lg','color:var(--sand)') + '</div><b style="font-size:15px">Daily set finished!</b><p style="color:var(--mut);font-size:12px;margin-top:2px">You got ' + data.ok + ' of 3 right (+15 ' + IC_COIN_HTML + ' bonus). Come back tomorrow!</p></div>';
    optsBox.innerHTML = '';
    msgBox.textContent = '';
    return;
  }

  badge.textContent = (data.idx + 1) + '/3';
  stat.textContent = 'Correct: ' + data.ok + '/3';
  var item = data.list[data.idx];
  if (topElem) topElem.textContent = item.top;
  qElem.innerHTML = type === 'Rw' ? item.q : rHTML(item.q);
  optsBox.innerHTML = '';
  msgBox.textContent = '';

  item.opts.forEach(function(o, idx) {
    var b = document.createElement('button');
    b.className = 'qo';
    b.style.cssText = 'margin:0;padding:7px 10px;font-size:12.5px';
    b.innerHTML = '<b>' + 'ABCD'[idx] + '</b>&nbsp; ' + (type === 'Rw' ? o : rHTML(o));
    b.onclick = function() {
      optsBox.querySelectorAll('button').forEach(function(btn) { btn.disabled = true; });
      var good = (o === item.ans);
      if (good) {
        b.classList.add('good');
        msgBox.style.color = 'var(--acc)';
        msgBox.innerHTML = '✓ Correct! (+3 ' + IC_COIN_HTML + ')';
        data.ok++;
        addCoins(3);
      } else {
        b.classList.add('bad');
        msgBox.style.color = '#e74c3c';
        msgBox.innerHTML = '✗ Answer: ' + (type === 'Rw' ? item.ans : rHTML(item.ans));
        recordMistake({ q: item.q, ans: item.ans, opts: item.opts, isGrid: false, rw: type === 'Rw', top: item.top }, o, 'Daily Challenge');
      }
      data.idx++;
      if (data.idx >= data.list.length) {
        data.done = true;
        if (!data.energyClaimed) {
          data.energyClaimed = true;
          addCoins(15, type + ' Daily Set complete!');
        }
      }
      spSet(storageKey, JSON.stringify(data));

      setTimeout(function() {
        renderDailyWidget(type, data, storageKey);
      }, 1100);
    };
    optsBox.appendChild(b);
  });
}

var btnMath = document.getElementById('dGoMath');
if(btnMath) btnMath.onclick = function(){ show('m'); };
var btnRw = document.getElementById('dGoRw');
if(btnRw) btnRw.onclick = function(){ show('r'); };

/* ===== AUTO-OPEN AUTH MODAL IN SATPATH ORGANIC STYLE ===== */
(function initSatPathAuthUI() {
  var st = document.createElement('style');
  st.textContent = `
    .sp-auth-ov { position:fixed; inset:0; z-index:250; background:var(--bg); background-image: radial-gradient(circle at 15% 12%, rgba(34, 163, 129, 0.12), transparent 38%), radial-gradient(circle at 86% 22%, rgba(245, 184, 46, 0.10), transparent 36%), var(--topo-svg); background-attachment: fixed; display:flex; align-items:center; justify-content:center; padding:24px; overflow-y:auto; animation:fade .25s ease; }
    .sp-auth-box { background:var(--panel); border:1.5px solid var(--line); border-radius:32px; max-width:980px; width:100%; display:grid; grid-template-columns:1.05fr 0.95fr; gap:32px; padding:36px; box-shadow:0 24px 60px rgba(0,0,0,0.28), 0 4px 0 var(--line); align-items:center; position:relative; overflow:hidden; }
    @media(max-width:860px){ .sp-auth-box { grid-template-columns:1fr; padding:24px 18px; } .sp-auth-art { display:none !important; } }
    .sp-auth-form { max-width:400px; width:100%; margin:0 auto; text-align:left; }
    .sp-auth-title { font-size:26px; font-weight:800; letter-spacing:-.03em; color:var(--tx); margin-bottom:4px; }
    .sp-auth-sub { font-size:12.5px; color:var(--mut); line-height:1.45; margin-bottom:18px; }
    .sp-gbtn { width:100%; display:flex; align-items:center; justify-content:center; gap:10px; padding:12px 16px; border-radius:16px; border:1.5px solid var(--line); background:var(--panel2); color:var(--tx); font-weight:700; font-size:13.5px; transition:.2s; box-shadow:0 2px 0 var(--line); cursor:
    pointer; }
    .sp-gbtn:hover { border-color:var(--acc); transform:translateY(-1px); }
    .sp-or { display:flex; align-items:center; gap:12px; color:var(--mut); font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:.08em; margin:14px 0; }
    .sp-or::before, .sp-or::after { content:""; flex:1; height:1px; background:var(--line); }
    .sp-inp-wrap { position:relative; margin-bottom:10px; }
    .sp-inp { width:100%; padding:12px 16px 12px 42px; border-radius:14px; border:1.5px solid var(--line); background:var(--panel2); color:var(--tx); font-size:13.5px; outline:none; transition:.2s; font-family:inherit; }
    .sp-inp:focus { border-color:var(--acc); background:var(--panel); }
    .sp-inp-ico { position:absolute; left:14px; top:50%; transform:translateY(-50%); color:var(--mut); opacity:.8; pointer-events:none; display:flex; align-items:center; }
    .sp-submit { width:100%; padding:12px 18px; border-radius:16px; background:linear-gradient(180deg, var(--sand-bright) 0%, var(--sand) 100%); color:var(--sand-tx); font-weight:800; font-size:14px; text-align:center; box-shadow:0 4px 0 var(--sand-deep); transition:.18s; margin-top:4px; cursor:pointer; }
    .sp-submit:hover { transform:translateY(-2px); box-shadow:0 6px 0 var(--sand-deep); filter:brightness(1.04); }
    .sp-auth-err { color:#e74c3c; font-size:12px; font-weight:600; margin:6px 0; min-height:16px; }

    /* Правая карточка в стиле островов SATPath */
    .sp-auth-art { border-radius:24px; background:linear-gradient(155deg, var(--acc2) 0%, var(--acc) 100%); position:relative; overflow:hidden; display:flex; flex-direction:column; justify-content:space-between; padding:28px; color:#fff; box-shadow:0 10px 30px rgba(0,0,0,0.18); border:1.5px solid rgba(255,255,255,0.22); min-height:440px; }
    .sp-stat-pill { background:rgba(255,255,255,0.15); backdrop-filter:blur(8px); border:1px solid rgba(255,255,255,0.25); padding:6px 14px; border-radius:99px; font-size:11.5px; font-weight:800; display:inline-flex; align-items:center; gap:6px; width:fit-content; }

    /* Расширенные стили новых скинов для всего сайта */
    :root[data-skin="lagoon"] {
      --acc: #d97706;
      --acc2: #92400e;
      --sand: #f59e0b;
      --sand-bright: #fde68a;
      --sand-deep: #78350f;
    }
    :root[data-skin="trench"] {
      --acc: #0284c7;
      --acc2: #075985;
      --sand: #38bdf8;
      --sand-bright: #bae6fd;
      --sand-deep: #0c4a6e;
    }
    :root[data-skin="volcanic"] {
      --acc: #e11d48;
      --acc2: #9f1239;
      --sand: #fb7185;
      --sand-bright: #fecdd3;
      --sand-deep: #881337;
    }
    :root[data-skin="biolum"] {
      --acc: #0d9488;
      --acc2: #115e59;
      --sand: #2dd4bf;
      --sand-bright: #99f6e4;
      --sand-deep: #134e4a;
    }
    :root[data-skin="sovereign"] {
      --acc: #7c3aed;
      --acc2: #5b21b6;
      --sand: #a78bfa;
      --sand-bright: #ddd6fe;
      --sand-deep: #4c1d95;
    }
  `;
  document.head.appendChild(st);

  var mode = 'login';

  window.openAuthScreen = function() {
    if (document.getElementById('spAuthOv')) return;
    var ov = document.createElement('div');
    ov.id = 'spAuthOv';
    ov.className = 'sp-auth-ov';

    function render() {
      var isSign = (mode === 'signup');
      ov.innerHTML =
        '<div class="sp-auth-box">' +
          '<div class="sp-auth-form">' +
            '<div style="display:inline-flex;align-items:center;gap:8px;margin-bottom:10px">' +
              '<img src="logo.png" alt="" style="width:28px;height:28px;object-fit:contain">' +
              '<span style="font-size:19px;font-weight:800">SAT<b style="color:var(--acc)">Path</b></span>' +
            '</div>' +
            '<h2 class="sp-auth-title">' + (isSign ? 'Create Account' : 'Welcome Back') + '</h2>' +
            '<p class="sp-auth-sub">Chart your course across islands, master AI roadmaps, and sync your progress.</p>' +

            '<button type="button" class="sp-gbtn" id="spBtnGoogle">' +
              '<svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>' +
              'Continue with Google' +
            '</button>' +

            '<div class="sp-or">OR</div>' +

            (isSign ? '<div class="sp-inp-wrap"><span class="sp-inp-ico">' + spSvg('user', 15) + '</span><input id="spAuthName" class="sp-inp" type="text" placeholder="Explorer Name"></div>' : '') +
            '<div class="sp-inp-wrap"><span class="sp-inp-ico">' + spSvg('mail', 15) + '</span><input id="spAuthEmail" class="sp-inp" type="email" placeholder="Email address" autocomplete="email"></div>' +
            '<div class="sp-inp-wrap"><span class="sp-inp-ico">' + spSvg('lock', 15) + '</span><input id="spAuthPass" class="sp-inp" type="password" placeholder="Password (6+ chars)" autocomplete="current-password"></div>' +

            (!isSign ? '<div style="text-align:right;margin-bottom:2px"><button type="button" id="spForgotBtn" style="font-size:11.5px;color:var(--mut);font-weight:700;cursor:pointer">Forgot password?</button></div>' : '') +

            '<div class="sp-auth-err" id="spAuthErr"></div>' +

            '<button type="button" class="sp-submit" id="spBtnEmailSubmit">' + (isSign ? 'Register Explorer →' : 'Sign In →') + '</button>' +

            '<div style="margin-top:12px;font-size:12.5px;color:var(--mut)">' +
              (isSign ? 'Already exploring? <button type="button" id="spToggleMode" style="color:var(--acc);font-weight:800;cursor:pointer">Sign in</button>' : 'New explorer? <button type="button" id="spToggleMode" style="color:var(--acc);font-weight:800;cursor:pointer">Create an account</button>') +
            '</div>' +

            '<div style="margin-top:10px;padding-top:8px;border-top:1px dashed var(--line)">' +
              '<button type="button" id="spGuestClose" style="font-size:12px;color:var(--mut);font-weight:700;cursor:pointer">Continue as Guest (No sync) →</button>' +
            '</div>' +
          '</div>' +

          '<div class="sp-auth-art">' +
            '<div style="display:flex;justify-content:space-between;align-items:center">' +
              '<span class="sp-stat-pill">' + spSvg('compass', 14) + ' ARCHIPELAGO OUTPOST</span>' +
              '<span style="opacity:.85">' + spSvg('award', 20) + '</span>' +
            '</div>' +
            '<div style="margin:20px 0">' +
              '<div style="font-size:11.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,0.8);margin-bottom:6px">Know your SAT score</div>' +
              '<h3 style="font-size:26px;font-weight:800;line-height:1.2;margin-bottom:10px">Step by step across every island. Track your progress, crack every problem.</h3>' +
              '<p style="font-size:13px;opacity:0.9;line-height:1.5">Sorted by domain and difficulty to match the adaptive Digital SAT experience.</p>' +
            '</div>' +
            '<div style="background:rgba(0,0,0,0.18);padding:14px;border-radius:16px;border:1px solid rgba(255,255,255,0.15);display:flex;justify-content:space-between;align-items:center">' +
              '<div style="font-size:12px;font-weight:700;display:flex;align-items:center;gap:8px">' + spSvg('target', 15) + ' Adaptive Track &amp; Full Desmos included</div>' +
              '<span style="opacity:.9">' + spSvg('zap', 16) + '</span>' +
            '</div>' +
          '</div>' +
        '</div>';

      var errEl = ov.querySelector('#spAuthErr');
      function setErr(msg) { errEl.style.color = ''; errEl.textContent = msg || ''; }
      function setOk(msg) { errEl.style.color = 'var(--acc)'; errEl.textContent = msg || ''; }

      ov.querySelector('#spGuestClose').onclick = function() {
        sessionStorage.setItem('satpath_guest', '1');
        ov.remove();
      };
      ov.querySelector('#spToggleMode').onclick = function() {
        mode = isSign ? 'login' : 'signup';
        render();
      };

      ov.querySelector('#spBtnGoogle').onclick = async function() {
        setErr('');
        try {
          await fbInit();
          await FB.au.signInWithPopup(FB.auth, new FB.au.GoogleAuthProvider());
          ov.remove();
          toast('✓ Signed in with Google!');
        } catch (e) {
          setErr('Google sign-in was cancelled or failed.');
        }
      };

      var fgBtn = ov.querySelector('#spForgotBtn');
      if (fgBtn) {
        var fgBusy = false, fgTimer = null;
        fgBtn.onclick = async function() {
          if (fgBusy) return;
          var emEl = ov.querySelector('#spAuthEmail');
          var em = emEl.value.trim();
          if (!em) { setErr('Enter your email above, then press "Forgot password?" again.'); emEl.focus(); return; }
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) { setErr('Please enter a valid email address.'); emEl.focus(); return; }

          fgBusy = true;
          fgBtn.disabled = true;
          fgBtn.textContent = 'Sending…';
          setErr('');
          var sent = false;
          try {
            await fbInit();
            if (!FB || !FB.au || !FB.auth) throw { code: 'sp/not-ready' };
            await FB.au.sendPasswordResetEmail(FB.auth, em);
            sent = true;
            setOk('Reset link sent to ' + em + '. Check Inbox and Spam / Promotions.');
          } catch (e) {
            console.error('Password reset failed:', e);
            var code = e && e.code;
            var msg = 'Could not send reset email' + (code ? ' (' + code + ')' : '') + '. Please try again.';
            if (code === 'auth/user-not-found') msg = 'No account found with this email. If you signed up with Google, use "Continue with Google".';
            else if (code === 'auth/invalid-email') msg = 'Please enter a valid email address.';
            else if (code === 'auth/too-many-requests') msg = 'Too many requests. Please wait a few minutes and try again.';
            else if (code === 'auth/network-request-failed') msg = 'Network error. Check your connection and try again.';
            else if (code === 'auth/unauthorized-continue-uri' || code === 'auth/operation-not-allowed') msg = 'Password reset is not enabled for this site yet (' + code + '). Please contact support.';
            else if (code === 'sp/not-ready') msg = 'Authentication service is still loading. Please try again in a moment.';
            setErr(msg);
          }
          if (sent) {
            var left = 30;
            fgBtn.textContent = 'Resend in ' + left + 's';
            fgTimer = setInterval(function() {
              left--;
              if (!document.body.contains(fgBtn)) { clearInterval(fgTimer); return; }
              if (left <= 0) {
                clearInterval(fgTimer);
                fgBusy = false; fgBtn.disabled = false; fgBtn.textContent = 'Forgot password?';
              } else {
                fgBtn.textContent = 'Resend in ' + left + 's';
              }
            }, 1000);
          } else {
            fgBusy = false; fgBtn.disabled = false; fgBtn.textContent = 'Forgot password?';
          }
        };
      }

      ov.querySelector('#spBtnEmailSubmit').onclick = async function() {
        setErr('');
        var em = ov.querySelector('#spAuthEmail').value.trim();
        var pw = ov.querySelector('#spAuthPass').value;
        var nmEl = ov.querySelector('#spAuthName');
        var nm = nmEl ? nmEl.value.trim() : '';
        if (!em || !pw) return setErr('Please enter both email and password.');
        try {
          await fbInit();
          if (isSign) {
            var cred = await FB.au.createUserWithEmailAndPassword(FB.auth, em, pw);
            if (nm && FB.au.updateProfile) {
              await FB.au.updateProfile(cred.user, { displayName: nm });
              var p = getProfile(); p.name = nm; saveProfile(p);
            }
            toast('Account created successfully!');
          } else {
            await FB.au.signInWithEmailAndPassword(FB.auth, em, pw);
            toast('✓ Welcome back, Explorer!');
          }
          ov.remove();
        } catch (e) {
          var friendlyMsg = 'Incorrect email or password. Please try again.';
          if (e.code === 'auth/user-not-found') {
            friendlyMsg = 'No account found with this email. Please sign up.';
          } else if (e.code === 'auth/wrong-password' || e.code === 'auth/invalid-credential') {
            friendlyMsg = 'Incorrect email or password. Please check and try again.';
          } else if (e.code === 'auth/invalid-email') {
            friendlyMsg = 'Please enter a valid email address format.';
          } else if (e.code === 'auth/email-already-in-use') {
            friendlyMsg = 'This email is already registered. Try signing in instead.';
          } else if (e.code === 'auth/weak-password') {
            friendlyMsg = 'Password should be at least 6 characters long.';
          } else if (e.code === 'auth/too-many-requests') {
            friendlyMsg = 'Too many failed attempts. Please try again later or reset your password.';
          }
          setErr(friendlyMsg);
        }
      };
    }

    document.body.appendChild(ov);
    render();
  };

  window.addEventListener('load', function() {
    setTimeout(function() {
      if (!sessionStorage.getItem('satpath_guest')) {
        if (typeof FBU === 'undefined' || !FBU) {
          openAuthScreen();
        }
      }
    }, 800);
  });

  var soBtns = document.querySelectorAll('.so');
  var signBtn = soBtns[soBtns.length - 1];
  if (signBtn) {
    signBtn.onclick = function() {
      if (typeof FBU !== 'undefined' && FBU) {
        FB.au.signOut(FB.auth);
        toast('Signed out');
      } else {
        openAuthScreen();
      }
    };
  }
})();

/* ============================================================================
 * SATPATH BLUEBOOK MOCK EXAM UPGRADE (v4.0):
 * 1. 8 STATIC MOCK EXAMS (100% IDENTICAL FOR ALL USERS ON ANY DEVICE)
 * 2. ORGANIC SATPATH FULLSCREEN GATE & PERSISTENT FULLSCREEN ACROSS MODULES
 * 3. WIDER MOCK EXAM CONTAINER & WORKING VOCABULARY HIGHLIGHTER + "+ ADD WORD"
 * 4. 10-MINUTE BREAK TIMER BETWEEN R&W AND MATH
 * 5. SAVE & RESUME PROGRESS IF USER EXITS MOCK EXAM
 * 6. AUTOMATIC MISTAKES RECORDING INTO MISTAKES TAB (MAX 500)
 * ============================================================================ */
(function upgradeSatPathMocksToBluebook() {
  window.PT_N = 8;

  function makeDeterministicRng(seed) {
    var s = seed | 0;
    return function () {
      s = (s + 0x6D2B79F5) | 0;
      var t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function deterministicShuffle(arr, rng) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(rng() * (i + 1));
      var tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a;
  }

  // Стили: органичное окно Fullscreen под дизайн сайта + широкие поля в Mock Exams
  var bbStyle = document.createElement('style');
  bbStyle.textContent = `
    .bb-fs-ov {
      position: fixed; inset: 0; z-index: 260;
      background: var(--bg);
      background-image: radial-gradient(circle at 18% 15%, rgba(34, 163, 129, 0.14), transparent 40%), radial-gradient(circle at 82% 20%, rgba(245, 184, 46, 0.12), transparent 38%), var(--topo-svg);
      background-attachment: fixed;
      color: var(--tx);
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      padding: 24px; text-align: center; font-family: Inter, system-ui, -apple-system, sans-serif;
      animation: fade .2s ease;
    }
    .bb-fs-card {
      background: linear-gradient(155deg, var(--panel) 0%, var(--panel2) 100%);
      border: 2px solid var(--sand-line);
      border-radius: 30px;
      max-width: 500px;
      width: 100%;
      padding: 36px 32px;
      box-shadow: 0 24px 60px rgba(0,0,0,0.3), 0 4px 0 var(--line);
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .bb-fs-timer {
      width: 72px; height: 72px; border-radius: 20px;
      background: var(--sand-bg);
      border: 2px solid var(--sand-line); display: grid; place-items: center;
      font-size: 30px; font-weight: 800; color: var(--sand); margin-bottom: 18px;
      box-shadow: 0 4px 0 var(--line); font-variant-numeric: tabular-nums;
    }
    .bb-fs-title { font-size: 26px; font-weight: 800; color: var(--tx); margin-bottom: 8px; letter-spacing: -0.02em; }
    .bb-fs-sub { font-size: 13.5px; color: var(--mut); max-width: 420px; line-height: 1.55; margin-bottom: 24px; }

    /* Увеличиваем ширину рабочей области в Mock Exams */
    .pt-shell {
      max-width: 1360px !important;
      width: 96vw !important;
      margin: 0 auto;
      transition: max-width .22s ease;
    }
    .pt-shell.calc-open {
      max-width: 1820px !important;
      width: 98vw !important;
    }

    /* Двухколоночная сетка для вопросов с левой инструкцией (Student-Produced Response) */
    .bb-spr-grid {
      display: grid; grid-template-columns: 1fr 1.15fr; gap: 0;
      border: 1.5px solid var(--line); border-radius: 22px; overflow: hidden;
      background: var(--panel); min-height: 520px; position: relative;
    }
    .bb-spr-left {
      padding: 26px 28px; border-right: 2px solid var(--line);
      background: var(--panel2); overflow-y: auto; max-height: 74vh;
      font-size: 13.5px; line-height: 1.55; color: var(--tx);
    }
    .bb-spr-left h3 { font-size: 16.5px; font-weight: 800; margin-bottom: 12px; color: var(--tx); }
    .bb-spr-left ul { list-style: disc; padding-left: 18px; display: grid; gap: 8px; margin-bottom: 18px; }
    .bb-spr-table {
      width: 100%; border-collapse: collapse; font-size: 12.5px; text-align: center;
      border: 1px solid var(--line); border-radius: 10px; overflow: hidden;
    }
    .bb-spr-table th {
      background: var(--panel); padding: 9px 10px; font-weight: 700;
      border-bottom: 1px solid var(--line); border-right: 1px solid var(--line); color: var(--mut);
    }
    .bb-spr-table td {
      padding: 10px 8px; border-bottom: 1px solid var(--line); border-right: 1px solid var(--line);
      line-height: 1.65; font-variant-numeric: tabular-nums;
    }
    .bb-spr-right {
      padding: 26px 30px; display: flex; flex-direction: column; justify-content: space-between;
      background: var(--panel);
    }
    .bb-q-bar {
      display: flex; justify-content: space-between; align-items: center;
      background: var(--panel2); border-bottom: 2px dashed var(--line);
      padding: 8px 14px; border-radius: 12px; margin-bottom: 18px;
    }
    .bb-q-num {
      background: var(--tx); color: var(--panel); font-weight: 800; font-size: 13px;
      padding: 3px 10px; border-radius: 6px;
    }
    @media (max-width: 860px) {
      .bb-spr-grid { grid-template-columns: 1fr; }
      .bb-spr-left { border-right: 0; border-bottom: 2px solid var(--line); max-height: 320px; }
    }
  `;
  document.head.appendChild(bbStyle);

  var SPR_DIRECTIONS_HTML = `
    <h3>Student-Produced Response Directions</h3>
    <ul>
      <li>If you find <b>more than one correct answer</b>, enter only one answer.</li>
      <li>You can enter up to 5 characters for a <b>positive</b> answer and up to 6 characters (including the negative sign) for a <b>negative</b> answer.</li>
      <li>If your answer is a <b>fraction</b> that doesn't fit in the provided space, enter the decimal equivalent.</li>
      <li>If your answer is a <b>decimal</b> that doesn't fit, enter it by truncating or rounding at the fourth digit.</li>
      <li>If your answer is a <b>mixed number</b> (such as 3&frac12;), enter it as an improper fraction (7/2) or its decimal equivalent (3.5).</li>
      <li>Don't enter symbols such as a percent sign, comma, or dollar sign.</li>
    </ul>
    <div style="font-weight:700;font-size:12.5px;margin-bottom:8px">Examples</div>
    <table class="bb-spr-table">
      <thead>
        <tr>
          <th>Answer</th>
          <th>Acceptable ways to enter answer</th>
          <th>Unacceptable: will not receive credit</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><b>3.5</b></td>
          <td>3.5<br>3.50<br>7/2</td>
          <td>3 1/2<br>31/2</td>
        </tr>
        <tr>
          <td><b>2/3</b></td>
          <td>2/3<br>.6666<br>.6667<br>0.666<br>0.667</td>
          <td>0.66<br>.66<br>0.67<br>.67</td>
        </tr>
        <tr>
          <td><b>&minus;1/3</b></td>
          <td>&minus;1/3<br>&minus;.3333<br>&minus;0.333</td>
          <td>&minus;.33<br>&minus;0.33</td>
        </tr>
      </tbody>
    </table>
  `;

  // Статичный генератор вопросов для 8 моков
  window.ptBuild = function (t, sec, m, lvl, used) {
    var masterSeed = (t * 10007) + (sec === 'm' ? 5003 : 2003) + (m * 997) + (lvl === 'hard' ? 313 : lvl === 'easy' ? 101 : 0);
    var out = [];

    if (sec === 'm') {
      var plan = ptMathPlan(t, m);
      plan.forEach(function (ti, k) {
        var qSeed = masterSeed + (k * 7919) + (ti * 353);
        var qRng = makeDeterministicRng(qSeed);
        var origRandom = Math.random;
        Math.random = qRng;
        var q = null;
        try {
          var tier = lvl === 'mix' ? (k % 2 === 0 ? 'hard' : 'medium') : (lvl === 'hard' ? 'hard' : (k % 3 ? 'easy' : 'medium'));
          var gensList = (typeof MATH_GENS !== 'undefined' && MATH_GENS[ti]) ? MATH_GENS[ti] : ((typeof GENERATORS !== 'undefined' && GENERATORS[ti]) ? GENERATORS[ti] : null);
          if (gensList && gensList.length) {
            var gIdx = ((t - 1) * 3 + (m - 1) * 2 + k) % gensList.length;
            var raw = gensList[gIdx](tier);
            if (raw && raw.q) q = raw;
          }
          if (!q) {
            q = getMathQ(ti, tier, (t * 23) + (m * 11) + k);
          }
          if (q && (k % 4 === 1) && /^[-+]?\d+(\.\d+|\/\d+)?$/.test(String(q.ans).trim())) {
            q.isGrid = true;
          }
          if (q && Array.isArray(q.opts)) {
            q.opts = deterministicShuffle(q.opts, qRng);
          }
        } catch (e) {} finally {
          Math.random = origRandom;
        }
        if (q) {
          q.top = TOPS[ti];
          q.rw = false;
          out.push(q);
        }
      });
    } else {
      ptRwPlan().forEach(function (x, blockIdx) {
        var ti = x[0], countNeeded = x[1];
        var list = RQ[ti] || [];
        var L = list.length;
        if (!L) return;
        var u = used[ti] || (used[ti] = {});
        var step = 3;
        var startOffset = ((t - 1) * countNeeded * 2 + (m - 1) * countNeeded + (lvl === 'hard' ? Math.floor(L / 3) : 0)) % L;

        var picked = [];
        for (var probe = 0; probe < L * 2 && picked.length < countNeeded; probe++) {
          var candIdx = (startOffset + probe * step) % L;
          if (!u[candIdx]) {
            u[candIdx] = 1;
            picked.push(candIdx);
          }
        }
        for (var fallback = 0; fallback < L && picked.length < countNeeded; fallback++) {
          if (picked.indexOf(fallback) < 0) picked.push(fallback);
        }

        picked.forEach(function (qIdx, localK) {
          var r = list[qIdx];
          var optRng = makeDeterministicRng(masterSeed + blockIdx * 1013 + qIdx * 97 + localK);
          out.push({
            q: r[0],
            ans: r[1],
            opts: deterministicShuffle(r.slice(1), optRng),
            isGrid: false,
            rw: true,
            top: RTOPS[ti]
          });
        });
      });
      if (out.length < 27 && typeof RQ !== 'undefined') {
        var pool = [];
        for (var pi = 0; pi < RQ.length; pi++) if (RQ[pi] && RQ[pi].length) pool.push(pi);
        for (var z = 0, guard = 0; out.length < 27 && pool.length && guard < 800; z++, guard++) {
          var tj = pool[z % pool.length], Lj = RQ[tj].length, uj = used[tj] || (used[tj] = {});
          for (var pr = 0; pr < Lj; pr++) {
            var ci = (masterSeed + z * 31 + pr) % Lj;
            if (uj[ci]) continue;
            uj[ci] = 1;
            var rj = RQ[tj][ci];
            out.push({
              q: rj[0], ans: rj[1],
              opts: deterministicShuffle(rj.slice(1), makeDeterministicRng(masterSeed + tj * 1013 + ci * 97)),
              isGrid: false, rw: true, top: RTOPS[tj]
            });
            break;
          }
        }
      }
    }
    return out;
  };

  // Красивое окно входа в Fullscreen в фирменном стиле SATPath
  function showFullscreenCountdownGate(onProceed, onCancel) {
    var fsOk = !!(document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen);
    if (!fsOk) { sessionStorage.setItem('bb_fullscreen_active', '0'); onProceed(); return; }
    var gate = document.createElement('div');
    gate.className = 'bb-fs-ov';
    var secLeft = 10;
    gate.innerHTML =
      '<div class="bb-fs-card">' +
        '<div style="display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:800;color:var(--sand);letter-spacing:.1em;text-transform:uppercase;margin-bottom:14px">' + IC_COMPAS_HTML + ' BLUEBOOK EXPEDITION PROTOCOL</div>' +
        '<div class="bb-fs-timer" id="bbFsCount">10</div>' +
        '<div class="bb-fs-title">Enter Fullscreen Mode</div>' +
        '<div class="bb-fs-sub">Mock Exams run in distraction-free fullscreen mode just like the official Digital SAT. If you do nothing, the exam starts automatically when the timer ends.</div>' +
        '<button type="button" class="cta-amber" id="bbBtnEnterFs" style="width:100%;max-width:320px;margin-bottom:10px;padding:13px 20px;font-size:14px">Enter Fullscreen &amp; Start →</button>' +
        '<button type="button" class="chip" id="bbBtnSkipFs" style="width:100%;max-width:320px;padding:11px 20px;font-size:13px;font-weight:700;text-align:center">Continue Without Fullscreen</button>' +
        '<button type="button" id="bbBtnBackFs" style="display:block;margin:14px auto 0;font-size:12.5px;font-weight:700;color:var(--mut);text-decoration:underline">Back to Mock Exams</button>' +
      '</div>';
    document.body.appendChild(gate);

    var countEl = gate.querySelector('#bbFsCount');
    var iv = setInterval(function () {
      secLeft--;
      if (countEl) countEl.textContent = Math.max(0, secLeft);
      if (secLeft <= 0) {
        clearInterval(iv);
        gate.remove();
        sessionStorage.setItem('bb_fullscreen_active', '0');
        onProceed();
      }
    }, 1000);

    gate.querySelector('#bbBtnEnterFs').onclick = function () {
      clearInterval(iv);
      sessionStorage.setItem('bb_fullscreen_active', '1');
      var docEl = document.documentElement;
      try {
        if (docEl.requestFullscreen) docEl.requestFullscreen();
        else if (docEl.webkitRequestFullscreen) docEl.webkitRequestFullscreen();
      } catch (e) {}
      gate.remove();
      onProceed();
    };

    gate.querySelector('#bbBtnBackFs').onclick = function () {
      clearInterval(iv);
      gate.remove();
      if (onCancel) onCancel();
    };

    gate.querySelector('#bbBtnSkipFs').onclick = function () {
      clearInterval(iv);
      sessionStorage.setItem('bb_fullscreen_active', '0');
      gate.remove();
      onProceed();
    };
  }

  // Модуль тестирования с автосохранением, работающим хайлайтером, кнопкой "+ Add Word", полным Desmos и без текста "Filled = answered"
  window.ptModule = function (cfg, done) {
    var qs = cfg.qs;
    var state = cfg.savedState || {};
    var ans = Array.isArray(state.ans) ? state.ans : [];
    var flag = Array.isArray(state.flag) ? state.flag : [];
    var cur = typeof state.cur === 'number' ? state.cur : 0;
    var left = typeof state.left === 'number' ? state.left : cfg.min * 60;
    var ended = false, calc = null, tmr;

    function persistProgress() {
      if (cfg.onSaveProgress && !ended) {
        cfg.onSaveProgress({ ans: ans, flag: flag, cur: cur, left: left });
      }
    }

    var ov = document.createElement('div');
    ov.style.cssText = 'position:fixed;inset:0;z-index:90;background:var(--bg);overflow:auto;padding:16px 20px';
    ov.innerHTML = '<div id="ptShell" class="pt-shell"><div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;background:var(--panel);padding:12px 20px;border-radius:20px;border:1.5px solid var(--line)">'
      + '<div><b style="font-size:15.5px">' + cfg.title + '</b><small style="display:block;color:var(--mut);font-size:11.5px">Click any word in the passage to highlight &amp; save to your Vocabulary</small></div>'
      + '<b id="ptT" style="font-size:18px;font-variant-numeric:tabular-nums;color:var(--sand);background:var(--sand-bg);padding:5px 14px;border-radius:99px;border:1px solid var(--sand-line)"></b>'
      + '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">'
      + '<button id="ptAddWordBtn" class="chip" style="padding:6px 12px;text-transform:none;font-weight:700;color:var(--acc);border-color:var(--acc)">' + spSvg('plus', 13) + ' Add Word</button>'
      + '<button id="ptVocBtn" class="chip" style="padding:6px 12px;text-transform:none;font-weight:700;color:var(--sand);border-color:var(--sand-line)">' + spSvg('book', 13) + ' Vocab (<span id="ptVocCnt">' + getVocabList().length + '</span>)</button>'
      + (cfg.calc ? '<button id="ptCB" style="background:var(--acc2);color:#fff;padding:6px 14px;border-radius:99px;font-weight:700;font-size:12px">' + IC_MATH_HTML + ' Desmos Calculator</button>' : '')
      + '<button id="ptEnd" class="chip" style="padding:6px 12px;text-transform:none;font-weight:700">Question Map</button>'
      + '<button id="ptEx" class="chip" style="padding:6px 12px;text-transform:none">Save &amp; Exit</button></div></div>'
      + '<div class="pt-split-body"><div class="qb" style="max-width:none;border-radius:24px;padding:26px 32px"><div id="ptQ"></div><div id="ptG" hidden></div><div style="display:flex;justify-content:space-between;align-items:center;margin-top:22px;padding-top:14px;border-top:1px solid var(--line)"><button class="cta" id="ptP" style="border-radius:14px">← Back</button><button class="chip" id="ptMidMap" style="font-weight:800;font-size:13px;padding:8px 16px">Question 1 of ' + qs.length + ' ▾</button><button class="cta-amber" id="ptN" style="border-radius:14px">Next →</button></div></div>'
      + '<div id="ptCP" style="display:none;border:2px solid var(--line);border-radius:24px;overflow:hidden;background:#fff"></div></div></div>';
    document.body.appendChild(ov);
    var $ = function (i) { return ov.querySelector('#' + i); }, Q = $('ptQ'), G = $('ptG');

    // Подключаем интерактивный хайлайтер слов внутри модуля Mock Exam
    bindVocabClicksOnContainer(Q, function(newLen) {
      var cntEl = $('ptVocCnt');
      if (cntEl) cntEl.textContent = newLen;
    });

    $('ptAddWordBtn').onclick = function() {
      var plainCtx = Q.textContent.replace(/\s+/g, ' ').trim().slice(0, 140);
      openAddWordModal(plainCtx, function() {
        var cntEl = $('ptVocCnt');
        if (cntEl) cntEl.textContent = getVocabList().length;
        draw();
      });
    };

    function stop(keepFullscreen) {
      closeActiveVocabPopover();
      ended = true;
      clearInterval(tmr);
      if (!keepFullscreen && document.fullscreenElement && document.exitFullscreen) {
        try { document.exitFullscreen(); } catch (e) {}
      }
      ov.remove();
    }

    function fin() {
      var un = 0; qs.forEach(function (q, i) { if (ans[i] == null || ans[i] === '') un++; });
      spModalConfirm(un ? 'You have <b>' + un + ' unanswered question(s)</b>. Submit this module now?' : 'Submit this module and proceed to the next stage?', function () { submit(); });
    }

    function submit() {
      if (ended) return;
      // Не сбрасываем Fullscreen при переходе к следующему модулю!
      stop(true);
      var ok = 0;
      qs.forEach(function (q, i) {
        if (ptRight(q, ans[i])) {
          ok++;
          removeMistakeByQuestion(q.q);
        } else {
          recordMistake(q, ans[i], cfg.title);
        }
      });
      done({ ok: ok, n: qs.length, qs: qs, ans: ans });
    }

    tmr = setInterval(function () {
      left--;
      $('ptT').textContent = ptFmt(left);
      if (left % 5 === 0) persistProgress();
      if (left <= 0) { toast('Time is up for this module!'); submit(); }
    }, 1000);
    $('ptT').textContent = ptFmt(left);
    $('ptVocBtn').onclick = function () { openVocabDrawer(); };

    function map() {
      closeActiveVocabPopover();
      var h = '<b>Question Map · ' + cfg.title + '</b><div style="display:flex;flex-wrap:wrap;gap:8px;margin:16px 0">';
      qs.forEach(function (q, i) {
        var a = ans[i] != null && ans[i] !== '';
        h += '<button data-i="' + i + '" style="width:46px;height:42px;border-radius:10px;text-align:center;font-weight:700;display:inline-flex;align-items:center;justify-content:center;gap:3px;border:2px solid ' + (a ? 'var(--acc)' : 'var(--line)') + ';background:' + (a ? 'rgba(34,163,129,.25)' : 'transparent') + '">' + (i + 1) + (flag[i] ? spSvg('flag', 11) : '') + '</button>';
      });
      G.innerHTML = h + '</div><div style="margin-top:16px"><button class="cta-amber" id="ptS">Submit Module →</button></div>';
      Q.hidden = true; G.hidden = false;
    }

    G.onclick = function (e) {
      var b = e.target.closest('[data-i]');
      if (b) { cur = +b.dataset.i; persistProgress(); draw(); }
      if (e.target.id === 'ptS') fin();
    };

    function draw() {
      closeActiveVocabPopover();
      G.hidden = true; Q.hidden = false;
      var q = qs[cur], fx = function (s) { return q.rw ? wrapWordsForVocab(s) : rHTML(s); };
      var midBtn = $('ptMidMap');
      if (midBtn) midBtn.textContent = 'Question ' + (cur + 1) + ' of ' + qs.length + ' ▾';

      var flagLabel = flag[cur] ? (spSvg('flag', 13) + ' Marked for Review') : (spSvg('flag', 13) + ' Mark for Review');

      if (q.isGrid) {
        var curVal = ans[cur] != null ? String(ans[cur]).replace(/"/g, '&quot;') : '';
        Q.innerHTML =
          '<div class="bb-spr-grid">' +
            '<div class="bb-spr-left">' + SPR_DIRECTIONS_HTML + '</div>' +
            '<div class="bb-spr-right">' +
              '<div>' +
                '<div class="bb-q-bar">' +
                  '<div style="display:flex;align-items:center;gap:10px"><span class="bb-q-num">' + (cur + 1) + '</span><button id="ptF" class="chip" style="font-size:12px;text-transform:none;border:0;color:' + (flag[cur] ? 'var(--sand)' : 'var(--mut)') + '">' + flagLabel + '</button></div>' +
                  '<small style="color:var(--acc);font-weight:700">' + (q.top || '') + '</small>' +
                '</div>' +
                '<div style="font-size:19px;line-height:1.6;margin:18px 0 22px">' + fx(q.q) + '</div>' +
                '<label style="display:block;font-size:12.5px;font-weight:700;color:var(--mut);margin-bottom:8px">Enter your answer</label>' +
                '<input id="ptI" class="qin" style="max-width:240px;text-align:left;padding:12px 16px;font-size:20px" maxlength="6" autocomplete="off" value="' + curVal + '">' +
                '<div style="margin-top:12px;font-size:13px;color:var(--mut)">Answer Preview: <b id="bbAnsPrev" style="color:var(--tx);font-size:15px;margin-left:6px">' + (curVal || '—') + '</b></div>' +
              '</div>' +
            '</div>' +
          '</div>';
      } else {
        var h = '<div class="bb-q-bar"><div style="display:flex;align-items:center;gap:10px"><span class="bb-q-num">' + (cur + 1) + '</span><button id="ptF" class="chip" style="font-size:12px;text-transform:none;border:0;color:' + (flag[cur] ? 'var(--sand)' : 'var(--mut)') + '">' + flagLabel + '</button></div><small style="color:var(--acc);font-weight:700">' + (q.top || '') + '</small></div>' +
          '<div style="font-size:' + (q.rw ? 17.5 : 19) + 'px;line-height:1.65;margin:18px 0">' + fx(q.q) + '</div>';
        q.opts.forEach(function (o, k) {
          h += '<button class="qo" data-k="' + k + '"' + (ans[cur] === o ? ' style="border-color:var(--acc);background:rgba(34,163,129,.2)"' : '') + '><b>' + 'ABCD'[k] + '</b>&nbsp; ' + (q.rw ? wrapWordsForVocab(o) : rHTML(o)) + '</button>';
        });
        Q.innerHTML = h;
      }

      Q.querySelectorAll('.qo').forEach(function (b) {
        b.onclick = function (ev) {
          if (ev.target.closest('.rw-word')) return;
          ans[cur] = q.opts[+b.dataset.k];
          persistProgress();
          Q.querySelectorAll('.qo').forEach(function (x) {
            x.style.cssText = x === b ? 'border-color:var(--acc);background:rgba(34,163,129,.2)' : '';
          });
        };
      });
      var inp = $('ptI');
      if (inp) {
        inp.oninput = function () {
          ans[cur] = inp.value.trim();
          persistProgress();
          var prev = $('bbAnsPrev');
          if (prev) prev.innerHTML = ans[cur] ? rHTML(ans[cur]) : '—';
        };
      }
      $('ptF').onclick = function () {
        flag[cur] = !flag[cur];
        persistProgress();
        this.style.color = flag[cur] ? 'var(--sand)' : 'var(--mut)';
        this.innerHTML = flag[cur] ? (spSvg('flag', 13) + ' Marked for Review') : (spSvg('flag', 13) + ' Mark for Review');
      };
      $('ptP').style.opacity = cur ? 1 : 0.35;
      $('ptN').textContent = cur < qs.length - 1 ? 'Next →' : 'Review →';
    }

    $('ptP').onclick = function () { if (cur > 0) { cur--; persistProgress(); draw(); } };
    $('ptN').onclick = function () { if (cur < qs.length - 1) { cur++; persistProgress(); draw(); } else map(); };
    $('ptEnd').onclick = map;
    $('ptMidMap').onclick = map;
    $('ptEx').onclick = function () {
      persistProgress();
      spModalConfirm('Save your current progress and exit to Mock Exams? You can resume right where you left off anytime.', function () {
        stop(false);
        toast('Progress saved! Click "Resume Expedition" anytime to continue.');
        done(null);
      });
    };
    var cb = $('ptCB'), shell = $('ptShell');
    if (cb) {
      cb.onclick = function () {
        var p = $('ptCP');
        if (!shell.classList.contains('calc-open')) {
          shell.classList.add('calc-open'); p.style.display = 'block'; cb.style.background = '#e74c3c'; cb.textContent = '✕ Close Calculator';
          if (!calc && window.Desmos) calc = createFullDesmos(p);
          if (calc) setTimeout(function () { calc.resize(); }, 35);
        } else {
          shell.classList.remove('calc-open'); p.style.display = 'none'; cb.style.background = 'var(--acc2)'; cb.innerHTML = IC_MATH_HTML + ' Desmos Calculator';
        }
      };
    }
    draw();
  };

  // Полный цикл прохождения Mock Exam с поддержкой паузы/продолжения и 10-минутным перерывом
  window.ptStart = function (t, secs, isResume) {
    showFullscreenCountdownGate(
      function () {
        var saved = isResume ? getMockSession(t) : null;
        var res = (saved && saved.res) ? saved.res : {};
        var used = (saved && saved.used) ? saved.used : {};
        var si = (saved && typeof saved.si === 'number') ? saved.si : 0;
        var activeSecs = (saved && Array.isArray(saved.secs)) ? saved.secs : secs;

        function runSection() {
          if (si >= activeSecs.length) return ptResult(t, res);
          var sec = activeSecs[si];
          var isR = sec === 'r', name = isR ? 'Reading and Writing' : 'Math', nq = isR ? 27 : 22, mins = isR ? 32 : 35;
          var curStep = (saved && saved.si === si && saved.modStep) ? saved.modStep : 1;

          function startMod1() {
            var qs1 = ptBuild(t, sec, 1, 'mix', used);
            if (!qs1.length) { toast('Questions for this section did not load. Please refresh the page.'); return buildPT(); }
            var savedModState = (saved && saved.si === si && saved.modStep === 1) ? saved.modState : null;

            function launchM1() {
              ptModule({
                title: name + ' · Module 1',
                qs: qs1,
                min: mins,
                calc: !isR,
                savedState: savedModState,
                onSaveProgress: function (mState) {
                  saveMockSession(t, { secs: activeSecs, si: si, modStep: 1, res: res, used: used, modState: mState });
                }
              }, function (o1) {
                if (!o1) return buildPT();
                var hard = o1.ok >= (isR ? 18 : 15);
                saveMockSession(t, { secs: activeSecs, si: si, modStep: 2, o1: o1, hard: hard, res: res, used: used, modState: null });
                saved = getMockSession(t);
                startMod2(o1, hard, false);
              });
            }

            if (savedModState) {
              launchM1();
            } else {
              ptInfo('<div style="font-size:11px;font-weight:800;color:var(--sand);letter-spacing:.1em;text-transform:uppercase;margin-bottom:6px">DIGITAL SAT ADAPTIVE MODULE</div><h2 style="font-size:24px;font-weight:800">' + name + ' · Module 1</h2><p style="margin:10px 0;font-weight:600;color:var(--acc)">' + nq + ' Questions · ' + mins + ' Minutes</p><p class="sub">' + (isR ? 'Click any unfamiliar word in a passage to highlight it, see its definition, and save it to your Vocabulary list!' : 'A full Desmos graphing calculator is built in. Includes multi-step geometry, data tables, and coordinate graphs.') + '</p>', 'Start Module 1 →', launchM1);
            }
          }

          function startMod2(o1Data, isHardTrack, resumingM2) {
            var qs2 = ptBuild(t, sec, 2, isHardTrack ? 'hard' : 'easy', used);
            if (!qs2.length) { toast('Questions for this section did not load. Please refresh the page.'); return buildPT(); }
            var savedMod2State = resumingM2 && saved ? saved.modState : null;

            function launchM2() {
              ptModule({
                title: name + ' · Module 2',
                qs: qs2,
                min: mins,
                calc: !isR,
                savedState: savedMod2State,
                onSaveProgress: function (mState) {
                  saveMockSession(t, { secs: activeSecs, si: si, modStep: 2, o1: o1Data, hard: isHardTrack, res: res, used: used, modState: mState });
                }
              }, function (o2) {
                if (!o2) return buildPT();
                res[sec] = { o1: o1Data, o2: o2, hard: isHardTrack, score: ptScore(sec, o1Data.ok, o2.ok, isHardTrack) };
                si++;
                saveMockSession(t, { secs: activeSecs, si: si, modStep: 1, res: res, used: used, modState: null });
                saved = getMockSession(t);
                if (si < activeSecs.length) {
                  showTenMinuteBreak(runSection);
                } else {
                  runSection();
                }
              });
            }

            if (savedMod2State) {
              launchM2();
            } else {
              ptInfo('<div style="font-size:11px;font-weight:800;color:var(--acc);letter-spacing:.1em;text-transform:uppercase;margin-bottom:6px">MODULE 1 COMPLETE (' + o1Data.ok + '/' + o1Data.n + ' CORRECT)</div><h2 style="font-size:24px;font-weight:800">' + name + ' · Module 2 (' + (isHardTrack ? 'Adaptive Harder Track' : 'Standard Track') + ')</h2><p style="margin:10px 0" class="sub">Your Module 2 difficulty has been calibrated based on your Module 1 accuracy.</p>', 'Start Module 2 →', launchM2);
            }
          }

          if (curStep === 2 && saved && saved.o1) {
            ptBuild(t, sec, 1, 'mix', used);
            startMod2(saved.o1, saved.hard, true);
          } else {
            startMod1();
          }
        }

        runSection();
      },
      function () {
        buildPT();
      }
    );
  };

  try { if (typeof buildPT === 'function') buildPT(); } catch (e) { console.error('buildPT failed:', e); }
})();

/* ===== MOBILE BOTTOM NAV: sync active tab with show() ===== */
(function mobileBottomNav() {
  var bar = document.getElementById('mbar');
  if (!bar || typeof window.show !== 'function') return;
  function mark(w) {
    bar.querySelectorAll('button').forEach(function(b) { b.classList.toggle('on', b.getAttribute('data-t') === w); });
  }
  var origShow = window.show;
  window.show = function(w) {
    var r = origShow.apply(this, arguments);
    mark(w);
    if (window.innerWidth <= 820) { try { window.scrollTo(0, 0); } catch (e) {} }
    return r;
  };
  bar.querySelectorAll('button').forEach(function(b) {
    b.onclick = function() { show(b.getAttribute('data-t')); };
  });
  mark('d');
  updateNavBadges();
})();

applyProfileUI();
refreshDash();
initDailyChallenges();
updateNavBadges();
function spRenderIcons() { try { if (window.lucide) lucide.createIcons(); } catch (e) {} }
spRenderIcons();
window.addEventListener('load', spRenderIcons);
