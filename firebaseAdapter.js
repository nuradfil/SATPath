/* =====================================================================
   SATPath — Firebase Adapter (firebaseAdapter.js)
   ---------------------------------------------------------------------
   Перенос Firebase из старого app.js БЕЗ изменения схемы базы:

     lb_YYYY-MM/{uid}          { name, photo, pts+, q+, c+, t }      (merge, increment)
     users/{uid}               { name, email, aiTokens, coins, createdAt, updatedAt }
     users/{uid}/sync/{key}    { k, v, ts, updatedAt }

   Что внутри:
     1. Конфиг и ленивая загрузка Firebase SDK 10.12.2 с CDN
     2. Облачная синхронизация localStorage (правила объединения как в старом сайте)
     3. users/{uid} и профиль satpath_profile_v1
     4. Лидерборд: отправка очков (lbFlush) и чтение рейтинга
     5. Окно входа: Google, Email, регистрация, сброс пароля, режим гостя
     6. Связь с SPShell (сайдбар и Top 3 на Dashboard)

   Подключать ПОСЛЕ shell.js и dataAdapter.js, ДО остальных экранов.
   В режиме ?demo=1 файл ничего не делает.
   ===================================================================== */
(function () {
  'use strict';

  if (/[?&]demo=1(&|$)/.test(location.search)) return;

  const Shell = window.SPShell;
  if (!Shell) {
    console.error('[firebase] Подключите shell.js ДО этого файла.');
    return;
  }

  /* -------------------------------------------------------------------
     1. КОНФИГ И SDK
     ------------------------------------------------------------------- */
  const FB_CONFIG = {
    apiKey: 'AIzaSyApS0OklFNhdr5LMyqnq3Qt0dIoGiQIaTU',
    authDomain: 'satpath.online',
    projectId: 'satpath-3ec98',
    storageBucket: 'satpath-3ec98.firebasestorage.app',
    messagingSenderId: '766311395755',
    appId: '1:766311395755:web:b0c6314a631ee92da462ee'
  };
  const SDK = 'https://www.gstatic.com/firebasejs/10.12.2/';

  const PROFILE_KEY = 'satpath_profile_v1';
  const ECON_KEY = 'satpath_econ_v2';
  const GUEST_KEY = 'satpath_guest';

  let FB = null;              // { auth, db, au, fs }
  let FBU = null;             // текущий пользователь
  let authResolved = false;
  let initP = null;

  function toast(m) { try { Shell.toast(m); } catch (e) {} }
  function emit(name, detail) {
    try { window.dispatchEvent(new CustomEvent(name, { detail: detail })); } catch (e) {}
  }
  function icons() { try { if (window.lucide) window.lucide.createIcons(); } catch (e) {} }
  function routeId() {
    return (location.hash || '').replace(/^#\/?/, '').split('?')[0] || 'dashboard';
  }

  function init() {
    if (initP) return initP;
    initP = Promise.all([
      import(SDK + 'firebase-app.js'),
      import(SDK + 'firebase-auth.js'),
      import(SDK + 'firebase-firestore.js')
    ]).then(function (m) {
      const a = m[0], au = m[1], f = m[2];
      const app = a.initializeApp(FB_CONFIG);
      FB = { auth: au.getAuth(app), db: f.getFirestore(app), au: au, fs: f };
      au.onAuthStateChanged(FB.auth, onAuth);
      return FB;
    }).catch(function (e) {
      initP = null;                     // позволяем повторить попытку
      console.error('[firebase] init failed', e);
      throw e;
    });
    return initP;
  }

  /* -------------------------------------------------------------------
     2. ОБЛАЧНАЯ СИНХРОНИЗАЦИЯ  users/{uid}/sync/{key}
     ------------------------------------------------------------------- */
  const store = window.localStorage;
  const proto = window.Storage && window.Storage.prototype;
  const nativeSet = proto.setItem;
  const mem = {};

  function rawGet(k) {
    try { const v = store.getItem(k); if (v !== null) return v; } catch (e) {}
    return Object.prototype.hasOwnProperty.call(mem, k) ? mem[k] : null;
  }
  function rawSet(k, v) {
    mem[k] = String(v);
    try { nativeSet.call(store, k, String(v)); } catch (e) {}
  }
  function jget(k, fallback) {
    try { const r = rawGet(k); return r ? JSON.parse(r) : fallback; } catch (e) { return fallback; }
  }

  const SYNC = {
    on: false, uid: null, unsub: null, applying: false, first: true, ready: false,
    trusted: false, changed: false, liveChanged: false, dirty: {}, timer: null,
    meta: null, warned: false, flushing: false, needReload: false
  };
  const META_KEY = 'satpath_sync_meta_v1';
  const UID_KEY = 'satpath_sync_uid_v1';
  const SKIP = { satpath_dict_v1: 1 };
  // Настройки конкретного устройства (появились только в новом интерфейсе) — в облако не уходят.
  // satpath_pt_session_v2 сохраняется каждые 5 секунд во время экзамена и тратил бы квоту записей.
  const UI_ONLY = { satpath_theme_v2: 1, satpath_sidebar_v2: 1, satpath_qb_filters_v1: 1 };
  const NO_SYNC = { satpath_pt_session_v2: 1 };

  // Базовое правило старого сайта
  function isUserKey(k) {
    return typeof k === 'string' && k.indexOf('satpath_') === 0 &&
      k.indexOf('satpath_sync_') !== 0 && k.indexOf('satpath_lb_') !== 0 && !SKIP[k] && !UI_ONLY[k];
  }
  function syncable(k) { return isUserKey(k) && !NO_SYNC[k]; }

  function meta() {
    if (!SYNC.meta) SYNC.meta = jget(META_KEY, {}) || {};
    return SYNC.meta;
  }
  function metaSave() { rawSet(META_KEY, JSON.stringify(meta())); }
  function metaSet(k, t, d) { meta()[k] = { t: t, d: d ? 1 : 0 }; metaSave(); }

  function touch(k) {
    metaSet(k, Date.now(), 1);
    if (SYNC.on) { SYNC.dirty[k] = 1; schedule(2500); }
  }
  function schedule(ms) {
    clearTimeout(SYNC.timer);
    SYNC.timer = setTimeout(syncFlush, ms);
  }

  // Новые экраны пишут прямо в localStorage, поэтому изменения ловим здесь.
  // sessionStorage не затрагивается.
  proto.setItem = function (k, v) {
    const isLocal = this === store;
    let before = null;
    if (isLocal) { try { before = this.getItem(k); } catch (e) {} }
    nativeSet.call(this, k, v);
    if (isLocal && !SYNC.applying && syncable(String(k)) && before !== String(v)) touch(String(k));
  };

  async function syncFlush() {
    if (!SYNC.on || !SYNC.ready || SYNC.flushing || !FB || !FBU) return;
    const keys = Object.keys(SYNC.dirty);
    if (!keys.length) return;
    SYNC.flushing = true;
    SYNC.dirty = {};
    const s = FB.fs, uid = SYNC.uid;
    let failed = false;
    await Promise.all(keys.map(async function (k) {
      const v = rawGet(k);
      if (v === null) return;
      if (v.length > 900000) { console.warn('SATPath sync: value too large, skipped', k); return; }
      const m = meta()[k] || { t: Date.now() };
      const t = m.t || Date.now();
      try {
        await s.setDoc(s.doc(FB.db, 'users', uid, 'sync', k), { k: k, v: v, ts: t, updatedAt: Date.now() });
        const cur = meta()[k];
        if (cur && cur.t === t) cur.d = 0;
      } catch (e) {
        failed = true;
        SYNC.dirty[k] = 1;
        if (!SYNC.warned) { SYNC.warned = true; console.warn('SATPath sync write failed', e); }
      }
    }));
    metaSave();
    SYNC.flushing = false;
    if (failed || Object.keys(SYNC.dirty).length) schedule(failed ? 15000 : 1500);
  }

  /* ---------- объединение (1:1 со старым сайтом) ---------- */
  function isObj(x) { return x && typeof x === 'object' && !Array.isArray(x); }
  function itemKey(o) {
    if (o === null || typeof o !== 'object') return 'p:' + String(o);
    if (o.q != null) return 'q:' + String(o.q).trim();
    if (o.w != null) return 'w:' + String(o.w).toLowerCase();
    if (o.id != null) return 'id:' + o.id;
    return 'j:' + JSON.stringify(o);
  }
  function mergeArr(a, b, k) {
    const map = {}, order = [];
    a.concat(b).forEach(function (it) {
      const key = itemKey(it);
      if (!(key in map)) { map[key] = it; order.push(key); return; }
      const old = map[key];
      if (old && it && typeof old === 'object' && typeof it === 'object') {
        let merged = mergeVal(old, it);
        if ((it.ts || 0) >= (old.ts || 0)) merged = Object.assign({}, merged, it);
        map[key] = merged;
      }
    });
    let out = order.map(function (x) { return map[x]; });
    if (k === 'satpath_mistakes_v1') {
      out.sort(function (x, y) { return (y.ts || 0) - (x.ts || 0); });
      if (out.length > 500) out = out.slice(0, 500);
    }
    return out;
  }
  function mergeVal(a, b, k) {
    if (a === undefined) return b;
    if (b === undefined) return a;
    if (Array.isArray(a) && Array.isArray(b)) return mergeArr(a, b, k);
    if (isObj(a) && isObj(b)) {
      const o = {};
      Object.keys(a).concat(Object.keys(b)).forEach(function (x) {
        if (x in o) return;
        o[x] = mergeVal(a[x], b[x]);
      });
      return o;
    }
    if (typeof a === 'number' && typeof b === 'number') return Math.max(a, b);
    if (typeof a === 'boolean' && typeof b === 'boolean') return a || b;
    if (typeof b === 'string' && b === '') return a;
    return b;
  }
  function mergeJson(k, lv, rv) {
    try {
      const a = JSON.parse(lv), b = JSON.parse(rv);
      if (a && b && typeof a === 'object' && typeof b === 'object') return JSON.stringify(mergeVal(a, b, k));
    } catch (e) {}
    return null;
  }

  /* ---------- получение из облака ---------- */
  function apply(k, val, ts, dirty) {
    SYNC.applying = true;
    try { rawSet(k, val); } finally { SYNC.applying = false; }
    metaSet(k, ts, dirty);
    if (dirty) { SYNC.dirty[k] = 1; schedule(1200); }
    if (SYNC.first) SYNC.changed = true; else SYNC.liveChanged = true;
    // сбрасываем кэши в памяти (dataAdapter.js, review.js слушают событие storage)
    try { window.dispatchEvent(new StorageEvent('storage', { key: k, newValue: val })); } catch (e) {}
  }
  function handle(k, d) {
    const rv = d && d.v, rts = +(d && d.ts) || 0;
    if (typeof rv !== 'string') return;
    const lv = rawGet(k);
    const m = SYNC.trusted ? (meta()[k] || { t: 0, d: 0 }) : { t: 0, d: 1 };
    if (lv === rv) { metaSet(k, Math.max(m.t || 0, rts) || rts, 0); return; }
    if (lv === null) { apply(k, rv, rts, false); return; }
    if (m.d) {                                   // есть несинхронизированные изменения → объединяем
      const merged = mergeJson(k, lv, rv);
      if (merged !== null) {
        if (merged === rv) apply(k, rv, rts, false); else apply(k, merged, Date.now(), true);
      } else if (!SYNC.trusted || rts > m.t) apply(k, rv, rts, false);
      else { SYNC.dirty[k] = 1; schedule(1200); }
      return;
    }
    if (rts > m.t) apply(k, rv, rts, false);
    else if (m.t > rts) { SYNC.dirty[k] = 1; schedule(1200); }
  }
  function localKeys(filter) {
    const seen = {}, out = [];
    const add = function (k) { if (filter(k) && !seen[k]) { seen[k] = 1; out.push(k); } };
    try { for (let i = 0; i < store.length; i++) add(store.key(i)); } catch (e) {}
    Object.keys(mem).forEach(add);
    return out;
  }
  function wipeLocal() {
    localKeys(isUserKey).forEach(function (k) {
      try { store.removeItem(k); } catch (e) {}
      delete mem[k];
    });
    SYNC.meta = {};
    metaSave();
    SYNC.changed = true;
  }

  // Эти экраны можно безопасно перерисовать или перезагрузить: там нет несданной работы
  const SAFE_ROUTES = { dashboard: 1, leaderboard: 1, metrics: 1, 'question-bank': 1 };
  function refreshUI() {
    paintSidebar();
    if (SAFE_ROUTES[routeId()]) { try { Shell.refresh(); } catch (e) {} paintSidebar(); }
  }
  function reloadWhenSafe() {
    if (!SYNC.needReload || !SAFE_ROUTES[routeId()]) return;
    SYNC.needReload = false;
    let last = 0;
    try { last = +(sessionStorage.getItem('sp_sync_rl') || 0); } catch (e) {}
    if (Date.now() - last > 30000) {
      try { sessionStorage.setItem('sp_sync_rl', String(Date.now())); } catch (e) {}
      toast('Restoring your progress from your account…');
      setTimeout(function () { location.reload(); }, 900);
    } else refreshUI();
  }
  window.addEventListener('hashchange', function () {
    if (SYNC.needReload) setTimeout(reloadWhenSafe, 50);
  });

  function syncStart(u) {
    syncStop();
    if (!u || !FB) return;
    const s = FB.fs;
    SYNC.uid = u.uid; SYNC.on = true; SYNC.first = true; SYNC.ready = false;
    SYNC.changed = false; SYNC.liveChanged = false;
    const prev = rawGet(UID_KEY);
    if (prev && prev !== u.uid) wipeLocal();       // другой аккаунт на этом устройстве
    SYNC.trusted = prev === u.uid;
    const seenRemote = {};
    try {
      SYNC.unsub = s.onSnapshot(s.collection(FB.db, 'users', u.uid, 'sync'), function (snap) {
        if (SYNC.first && snap.metadata.fromCache) return;     // ждём ответ сервера
        snap.docChanges().forEach(function (ch) {
          if (ch.type === 'removed' || ch.doc.metadata.hasPendingWrites) return;
          const k = ch.doc.id;
          if (!syncable(k)) return;
          seenRemote[k] = 1;
          handle(k, ch.doc.data());
        });
        if (SYNC.first) {
          SYNC.first = false;
          localKeys(syncable).forEach(function (k) {           // чего нет в облаке — отправляем
            if (!seenRemote[k]) {
              const m = meta()[k];
              metaSet(k, (m && m.t) || Date.now(), 1);
              SYNC.dirty[k] = 1;
            }
          });
          rawSet(UID_KEY, u.uid);
          SYNC.trusted = true; SYNC.ready = true;
          ensureProfileName(u);                                // профиль — только после загрузки из облака
          syncFlush();
          if (SYNC.changed) { SYNC.needReload = true; reloadWhenSafe(); }
          else refreshUI();
        } else if (SYNC.liveChanged) {
          SYNC.liveChanged = false;
          refreshUI();
          toast('Synced from another device');
        }
      }, function (err) {
        console.warn('SATPath sync listener error', err);
        if (!SYNC.warned) { SYNC.warned = true; toast('Cloud sync is blocked. Check Firestore rules.'); }
      });
    } catch (e) { console.warn('SATPath sync start failed', e); }
  }
  function syncStop() {
    if (SYNC.unsub) { try { SYNC.unsub(); } catch (e) {} }
    SYNC.unsub = null; SYNC.on = false; SYNC.ready = false; SYNC.first = true;
    SYNC.dirty = {}; SYNC.needReload = false;
    clearTimeout(SYNC.timer);
  }

  /* -------------------------------------------------------------------
     3. users/{uid} И ПРОФИЛЬ
     ------------------------------------------------------------------- */
  // Те же поля и значения по умолчанию, что getRawEcon() в старом сайте
  function readEcon() {
    const d = jget(ECON_KEY, {}) || {};
    const today = new Date().toISOString().slice(0, 10);
    return Object.assign({}, d, {
      coins: typeof d.coins === 'number' ? d.coins : 100,
      aiTokens: typeof d.aiTokens === 'number' ? d.aiTokens : 300,
      energy: typeof d.energy === 'number' ? d.energy : 5,
      maxEnergy: d.maxEnergy || 5,
      compass: !!d.compass,
      crest: !!d.crest,
      lastEnergyTs: d.lastEnergyTs || Date.now(),
      dailyRationDate: d.dailyRationDate || '',
      drillRewardsDate: today,
      drillRewardsCount: d.drillRewardsDate === today ? (d.drillRewardsCount || 0) : 0,
      mockRewarded: d.mockRewarded || {}
    });
  }
  function saveEcon(e) { try { store.setItem(ECON_KEY, JSON.stringify(e)); } catch (err) {} }

  async function ensureUserDoc(u) {
    try {
      const s = FB.fs;
      const ref = s.doc(FB.db, 'users', u.uid);
      const snap = await s.getDoc(ref);
      if (!snap.exists()) {
        const e = readEcon();
        e.aiTokens = 300;                       // новая регистрация: 300 AI Tokens
        saveEcon(e);
        await s.setDoc(ref, {
          name: u.displayName || (u.email ? u.email.split('@')[0] : 'Explorer'),
          email: u.email || '',
          aiTokens: 300,
          coins: e.coins,
          createdAt: Date.now(),
          updatedAt: Date.now()
        }, { merge: true });
      } else {
        const data = snap.data() || {};
        if (typeof data.aiTokens === 'number') {
          // Если локальной экономики ещё нет, не создаём её с дефолтами:
          // она придёт из sync, и дефолтные монеты не должны смешаться с настоящими
          if (rawGet(ECON_KEY) !== null) {
            const e = readEcon();
            e.aiTokens = data.aiTokens;
            saveEcon(e);
          }
        } else {
          await s.setDoc(ref, { aiTokens: readEcon().aiTokens }, { merge: true });
        }
      }
    } catch (err) {
      console.warn('[firebase] users/{uid} is not available', err);
    }
  }

  function fallbackName(u) {
    return u ? (u.displayName || (u.email ? u.email.split('@')[0] : '')) : '';
  }
  function writeProfileName(name) {
    const p = jget(PROFILE_KEY, {}) || {};
    const next = Object.assign({
      avatar: 'compass', skin: 'default', title: 'Island Scout',
      unlocked: ['av_default', 'default', 't_scout']
    }, p, { name: name });
    try { store.setItem(PROFILE_KEY, JSON.stringify(next)); } catch (e) {}
  }
  function ensureProfileName(u) {
    const p = jget(PROFILE_KEY, {}) || {};
    if (!p.name || p.name === 'Explorer' || p.name === 'Guest') {
      const n = fallbackName(u);
      if (n) writeProfileName(n);
    }
  }

  /* -------------------------------------------------------------------
     4. ЛИДЕРБОРД  lb_YYYY-MM/{uid}
     ------------------------------------------------------------------- */
  function monthId(offset) {
    let d = new Date();
    d = new Date(d.getFullYear(), d.getMonth() + (offset || 0), 1);
    return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2);
  }
  function pendingGet(m) {
    const o = jget('satpath_lb_' + m, {}) || {};
    return { pts: Math.max(0, +o.pts || 0), q: Math.max(0, +o.q || 0), c: Math.max(0, +o.c || 0) };
  }
  function pendingSet(m, p) { rawSet('satpath_lb_' + m, JSON.stringify(p)); }
  function shortName(u) {
    const p = (u.displayName || 'Student').split(' ');
    return p[0] + (p[1] ? ' ' + p[1][0] + '.' : '');
  }

  let flushP = null;
  let flushTimer = null;
  let cache = {};

  function lbFlush() {
    if (flushP) return flushP;
        if (halted || !FB || !FBU) return Promise.resolve(false);
    const m = monthId(), p = pendingGet(m), user = FBU;
    if (p.pts <= 0 && p.q <= 0) return Promise.resolve(false);
    pendingSet(m, { pts: 0, q: 0, c: 0 });
    const s = FB.fs;
    flushP = (async function () {
      let sent = false;
      try {
        await userDocP;
        await s.setDoc(s.doc(FB.db, 'lb_' + m, user.uid), {
          name: shortName(user), photo: avatarFor(user),
          pts: s.increment(p.pts), q: s.increment(p.q), c: s.increment(p.c), t: Date.now()
        }, { merge: true });
        cache = {};
        sent = true;
      } catch (e) {
        console.warn('[firebase] leaderboard write failed', e);
        const n = pendingGet(m);
        pendingSet(m, { pts: n.pts + p.pts, q: n.q + p.q, c: n.c + p.c });
      }
      return sent;
    })();
    const done = flushP;
    done.then(function () { if (flushP === done) flushP = null; });
    return done;
  }
  function scheduleLbFlush() {
    clearTimeout(flushTimer);
    flushTimer = setTimeout(lbFlush, 60000);
  }
  window.addEventListener('sp:progress', scheduleLbFlush);

  function cleanRow(id, d) {
    return {
      id: id,
      name: String((d && d.name) || 'Student'),
      photo: safePhoto(d && d.photo),
      pts: Math.max(0, +(d && d.pts) || 0),
      q: Math.max(0, +(d && d.q) || 0),
      c: Math.max(0, +(d && d.c) || 0)
    };
  }

  // offset: 0 — текущий месяц, -1 — прошлый ... Кэш 3 минуты, как в старом сайте.
  async function fetchLeaderboard(offset, opts) {
    offset = offset || 0;
    await init();
    await whenAuthResolved();
    if (FBU && offset === 0) await lbFlush();
    const m = monthId(offset), s = FB.fs, uid = FBU ? FBU.uid : null;
    const key = m + '|' + (uid || '');
    let c = cache[key];
    if ((opts && opts.force) || !c || Date.now() - c.t > 180000) {
      const col = s.collection(FB.db, 'lb_' + m);
      const snap = await s.getDocs(s.query(col, s.orderBy('pts', 'desc'), s.limit(20)));
      const total = (await s.getCountFromServer(col)).data().count;
      const next = {
        t: Date.now(), total: total, me: null, rank: null,
        rows: snap.docs.map(function (d) { return cleanRow(d.id, d.data()); })
      };
      if (uid) {
        const mine = await s.getDoc(s.doc(FB.db, 'lb_' + m, uid));
        if (mine.exists()) {
          const raw = mine.data();
          next.me = raw;
          next.rank = (await s.getCountFromServer(s.query(col, s.where('pts', '>', raw.pts || 0)))).data().count + 1;
        }
      }
      c = cache[key] = next;
    }
    let me = null;
    if (c.me) {
      const raw = Object.assign({}, c.me);
      if (offset === 0) {                       // добавляем ещё не отправленные очки
        const p = pendingGet(m);
        raw.pts = (+raw.pts || 0) + p.pts;
        raw.q = (+raw.q || 0) + p.q;
        raw.c = (+raw.c || 0) + p.c;
      }
      me = cleanRow(uid, raw);
    }
    return { month: m, uid: uid, rows: c.rows, total: c.total, me: me, rank: c.rank, updatedAt: c.t };
  }

  /* ---------- Top 3 на Dashboard ---------- */
  let boardJson = '';
  function feedDashboard() {
    fetchLeaderboard(0).then(function (d) {
      const board = {
        weekly: [],                              // в базе есть только месячный рейтинг
        monthly: d.rows.slice(0, 3).map(function (r) { return { name: r.name, points: r.pts, avatar: r.photo }; }),
        me: d.me ? { monthly: d.me.pts } : null
      };
      const json = JSON.stringify(board);
      if (json === boardJson) return;
      boardJson = json;
      Shell.setLeaderboard(board);
    }).catch(function (e) { console.warn('[firebase] dashboard leaderboard unavailable', e); });
  }
  window.addEventListener('hashchange', function () {
    if (routeId() === 'dashboard' && authResolved) feedDashboard();
  });

  /* -------------------------------------------------------------------
     5. AUTH
     ------------------------------------------------------------------- */
  const resolvers = [];
  function whenAuthResolved() {
    if (authResolved) return Promise.resolve(FBU);
    return new Promise(function (res) { resolvers.push(res); });
  }

  let autoPrompted = false;
  function onAuth(u) {
    const first = !authResolved;
    FBU = u;
    authResolved = true;
    cache = {};
    boardJson = '';
    resolvers.splice(0).forEach(function (r) { r(u); });
    paintSidebar();
    if (u) {
      closeAuth();
      userDocP = Promise.all([ensureUserDoc(u), loadAvatar(u)]);
      lbFlush();
      syncStart(u);
    } else {
      syncStop();
    }
    emit('sp:auth', { user: u });
    feedDashboard();
    if (first && !u && !autoPrompted) {
      autoPrompted = true;
      setTimeout(function () {
        let guest = false;
        try { guest = !!sessionStorage.getItem(GUEST_KEY); } catch (e) {}
        if (!FBU && !guest && routeId() !== 'exam' && routeId() !== 'solver') openAuth();
      }, 800);
    }
  }

  async function signOut() {
    await init();
    try { await lbFlush(); } catch (e) {}
    try { await syncFlush(); } catch (e) {}
    await FB.au.signOut(FB.auth);
    toast('Signed out');
  }

  /* ---------- сайдбар ---------- */
  function paintSidebar() {
    if (FBU) {
      const p = jget(PROFILE_KEY, {}) || {};
      const name = p.name && p.name !== 'Explorer' && p.name !== 'Guest' ? p.name : (fallbackName(FBU) || 'Student');
            Shell.setUser({ name: name, email: FBU.email || '', avatar: avatarFor(FBU) });
    } else {
      Shell.setUser(null);
    }
    const row = document.querySelector('.user-row');
    if (row) {
      const label = FBU ? 'Account: sign out' : 'Sign in';
      row.setAttribute('role', 'button');
      row.setAttribute('tabindex', '0');
      row.setAttribute('title', label);
      row.setAttribute('aria-label', label);
      row.classList.add('cursor-pointer', 'rounded-lg', 'py-1.5', 'hover:bg-raised', 'transition-colors');
      const l2 = document.getElementById('userLine2');
      if (l2 && !FBU) l2.textContent = 'Click to sign in';
    }
  }
  function onUserRow() {
        if (FBU) Shell.navigate('profile'); else openAuth();
  }
  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('.user-row')) onUserRow();
  });
  document.addEventListener('keydown', function (e) {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.classList && e.target.classList.contains('user-row')) {
      e.preventDefault();
      onUserRow();
    }
  });

  /* ---------- модальные окна ---------- */
  let modal = null;
  let modalTimer = null;

  function closeAuth() {
    clearInterval(modalTimer);
    if (modal) { modal.remove(); modal = null; document.removeEventListener('keydown', onModalKey, true); }
  }
  function asGuest() {
    try { sessionStorage.setItem(GUEST_KEY, '1'); } catch (e) {}
    closeAuth();
  }
  function onModalKey(e) {
    if (e.key === 'Escape') { e.stopPropagation(); asGuest(); }
  }
  function mountModal(label) {
    closeAuth();
    modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', label);
    document.body.appendChild(modal);
    document.addEventListener('keydown', onModalKey, true);
    return modal;
  }

  function openAccount() {
    const host = mountModal('Account');
    host.innerHTML =
      '<div class="w-full max-w-[360px] rounded-2xl border bg-surface p-6 shadow-2xl">' +
        '<h2 class="text-[18px] font-semibold tracking-tight">Your account</h2>' +
        '<p id="fbWho" class="mt-1.5 break-all text-[13.5px] text-ink-soft"></p>' +
        '<div class="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">' +
          '<button type="button" data-fb="close" class="h-11 rounded-lg border px-5 text-[13.5px] font-medium hover:bg-raised">Cancel</button>' +
          '<button type="button" data-fb="out" class="h-11 rounded-lg bg-accent px-5 text-[13.5px] font-semibold text-white hover:bg-accent-hover">Sign out</button>' +
        '</div></div>';
    host.querySelector('#fbWho').textContent = FBU.email || fallbackName(FBU);
    host.querySelector('[data-fb="close"]').onclick = closeAuth;
    host.querySelector('[data-fb="out"]').onclick = function () {
      closeAuth();
      signOut().catch(function (e) { console.error(e); toast('Could not sign out. Try again.'); });
    };
    host.onclick = function (e) { if (e.target === host) closeAuth(); };
    host.querySelector('[data-fb="out"]').focus();
  }

  function authError(e) {
    const code = e && e.code;
    if (code === 'auth/user-not-found') return 'No account found with this email. Please sign up.';
    if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') return 'Incorrect email or password. Please check and try again.';
    if (code === 'auth/invalid-email') return 'Please enter a valid email address format.';
    if (code === 'auth/email-already-in-use') return 'This email is already registered. Try signing in instead.';
    if (code === 'auth/weak-password') return 'Password should be at least 6 characters long.';
    if (code === 'auth/too-many-requests') return 'Too many failed attempts. Please try again later or reset your password.';
    return 'Incorrect email or password. Please try again.';
  }
  function resetError(e) {
    const code = e && e.code;
    if (code === 'auth/user-not-found') return 'No account found with this email. If you signed up with Google, use "Continue with Google".';
    if (code === 'auth/invalid-email') return 'Please enter a valid email address.';
    if (code === 'auth/too-many-requests') return 'Too many requests. Please wait a few minutes and try again.';
    if (code === 'auth/network-request-failed') return 'Network error. Check your connection and try again.';
    if (code === 'auth/unauthorized-continue-uri' || code === 'auth/operation-not-allowed') return 'Password reset is not enabled for this site yet (' + code + '). Please contact support.';
    if (code === 'sp/not-ready') return 'Authentication service is still loading. Please try again in a moment.';
    return 'Could not send reset email' + (code ? ' (' + code + ')' : '') + '. Please try again.';
  }

  async function signInWithGoogle() {
    if (!FB) await init();
    await FB.au.signInWithPopup(FB.auth, new FB.au.GoogleAuthProvider());
  }

  function openAuth(startMode) {
    if (FBU) return;
    init().catch(function () {});
    let mode = startMode === 'signup' ? 'signup' : 'login';
    const host = mountModal('Sign in to SATPath');
    const INPUT = 'h-11 w-full rounded-lg border bg-canvas pl-10 pr-3 text-[14px] text-ink outline-none placeholder:text-ink-mute focus:border-accent';
    const field = function (id, icon, type, ph, ac) {
      return '<label class="relative block"><span class="sr-only">' + ph + '</span>' +
        '<span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-mute"><i data-lucide="' + icon + '" class="h-4 w-4"></i></span>' +
        '<input id="' + id + '" type="' + type + '" placeholder="' + ph + '" autocomplete="' + ac + '" class="' + INPUT + '"></label>';
    };

    function paint(keepEmail) {
      clearInterval(modalTimer);
      const up = mode === 'signup';
      host.innerHTML =
        '<div class="w-full max-w-[400px] rounded-2xl border bg-surface p-6 shadow-2xl">' +
          '<div class="text-[15px] font-semibold tracking-tight">SAT<span class="text-accent">Path</span></div>' +
          '<h2 class="mt-4 text-[22px] font-semibold tracking-tight">' + (up ? 'Create your account' : 'Welcome back') + '</h2>' +
          '<p class="mt-1.5 text-[13.5px] text-ink-soft">Sync your progress and join the monthly leaderboard.</p>' +
          '<button type="button" id="fbGoogle" class="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border bg-raised text-[13.5px] font-semibold transition-colors hover:border-accent"><i data-lucide="log-in" class="h-4 w-4"></i>Continue with Google</button>' +
          '<div class="my-4 flex items-center gap-3 text-[11.5px] text-ink-mute"><span class="h-px flex-1" style="background:var(--c-hairline)"></span>or<span class="h-px flex-1" style="background:var(--c-hairline)"></span></div>' +
          '<form id="fbForm" class="space-y-2.5" novalidate>' +
            (up ? field('fbName', 'user', 'text', 'Your name', 'name') : '') +
            field('fbEmail', 'mail', 'email', 'Email address', 'email') +
            field('fbPass', 'lock', 'password', 'Password (6+ characters)', up ? 'new-password' : 'current-password') +
            (up ? '' : '<div class="text-right"><button type="button" id="fbForgot" class="min-h-[32px] text-[12.5px] font-medium text-ink-soft hover:text-ink">Forgot password?</button></div>') +
            '<p id="fbMsg" class="text-[12.5px] leading-snug" role="status" aria-live="polite"></p>' +
            '<button type="submit" id="fbSubmit" class="h-11 w-full rounded-lg bg-accent text-[13.5px] font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-50">' + (up ? 'Create account' : 'Sign in') + '</button>' +
          '</form>' +
          '<p class="mt-4 text-center text-[13px] text-ink-soft">' + (up ? 'Already have an account?' : 'New to SATPath?') +
            ' <button type="button" id="fbSwitch" class="min-h-[32px] font-semibold text-accent hover:text-accent-hover">' + (up ? 'Sign in' : 'Create an account') + '</button></p>' +
          '<div class="mt-3 border-t pt-3 text-center"><button type="button" id="fbGuest" class="min-h-[44px] text-[12.5px] font-medium text-ink-soft hover:text-ink">Continue as guest (no sync)</button></div>' +
        '</div>';
      icons();

      const q = function (id) { return host.querySelector('#' + id); };
      const msg = q('fbMsg');
      const say = function (text, ok) {
        msg.textContent = text || '';
        msg.className = 'text-[12.5px] leading-snug ' + (ok ? 'text-success' : 'text-danger');
      };
      if (keepEmail) q('fbEmail').value = keepEmail;

      q('fbGuest').onclick = asGuest;
      q('fbSwitch').onclick = function () {
        const em = q('fbEmail').value;
        mode = up ? 'login' : 'signup';
        paint(em);
      };
      q('fbGoogle').onclick = async function () {
        say('');
        try {
          await signInWithGoogle();
          closeAuth();
          toast('Signed in with Google');
        } catch (e) {
          console.error('Google sign-in failed:', e);
          say('Google sign-in was cancelled or failed' + (e && e.code ? ' (' + e.code + ')' : '') + '.');
        }
      };

      const forgot = q('fbForgot');
      if (forgot) {
        let busy = false;
        forgot.onclick = async function () {
          if (busy) return;
          const emEl = q('fbEmail');
          const em = emEl.value.trim();
          if (!em) { say('Enter your email above, then press "Forgot password?" again.'); emEl.focus(); return; }
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) { say('Please enter a valid email address.'); emEl.focus(); return; }
          busy = true;
          forgot.disabled = true;
          forgot.textContent = 'Sending…';
          say('');
          try {
            await init();
            if (!FB) throw { code: 'sp/not-ready' };
            await FB.au.sendPasswordResetEmail(FB.auth, em);
            say('Reset link sent to ' + em + '. Check Inbox and Spam / Promotions.', true);
            let left = 30;
            forgot.textContent = 'Resend in ' + left + 's';
            modalTimer = setInterval(function () {
              left--;
              if (left <= 0 || !document.body.contains(forgot)) {
                clearInterval(modalTimer);
                busy = false; forgot.disabled = false; forgot.textContent = 'Forgot password?';
              } else forgot.textContent = 'Resend in ' + left + 's';
            }, 1000);
          } catch (e) {
            console.error('Password reset failed:', e);
            say(resetError(e));
            busy = false; forgot.disabled = false; forgot.textContent = 'Forgot password?';
          }
        };
      }

      q('fbForm').onsubmit = async function (ev) {
        ev.preventDefault();
        say('');
        const em = q('fbEmail').value.trim();
        const pw = q('fbPass').value;
        const nm = q('fbName') ? q('fbName').value.trim() : '';
        if (!em || !pw) { say('Please enter both email and password.'); return; }
        const btn = q('fbSubmit');
        btn.disabled = true;
        try {
          await init();
          if (up) {
            const cred = await FB.au.createUserWithEmailAndPassword(FB.auth, em, pw);
            if (nm) {
              await FB.au.updateProfile(cred.user, { displayName: nm });
              writeProfileName(nm);
              paintSidebar();
              if (SAFE_ROUTES[routeId()]) { Shell.refresh(); paintSidebar(); }
            }
            toast('Account created');
          } else {
            await FB.au.signInWithEmailAndPassword(FB.auth, em, pw);
            toast('Welcome back');
          }
          closeAuth();
        } catch (e) {
          console.error('Email auth failed:', e);
          say(authError(e));
          btn.disabled = false;
        }
      };

      q(up ? 'fbName' : 'fbEmail').focus();
    }
    paint('');
  }

  /* -------------------------------------------------------------------
     6. ФОНОВЫЕ СОБЫТИЯ И ПУБЛИЧНЫЙ API
     ------------------------------------------------------------------- */
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { lbFlush(); syncFlush(); }
  });
  window.addEventListener('pagehide', function () { syncFlush(); });
  window.addEventListener('online', function () { syncFlush(); lbFlush(); });

  window.SPFirebase = {
    init: init,
    ready: whenAuthResolved,
    user: function () { return FBU; },
    isResolved: function () { return authResolved; },
    openAuth: openAuth,
    signInWithGoogle: signInWithGoogle,
    signOut: signOut,
    flushPoints: lbFlush,
    fetchLeaderboard: fetchLeaderboard,
    monthId: monthId
  };
    /* -------------------------------------------------------------------
     7. АККАУНТ (используется profile.js)
     ------------------------------------------------------------------- */
  const AVATAR_KEY = 'sp_avatar_v1';      // локальный кэш { uid, data }, в sync не уходит
  const PHOTO_RE = /^(https:\/\/|data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$)/;
  let halted = false;
  let userDocP = Promise.resolve();

  function safePhoto(v) {
    return typeof v === 'string' && v.length <= 20000 && PHOTO_RE.test(v) ? v : '';
  }
  function customAvatar(u) {
    const a = jget(AVATAR_KEY, null);
    return u && a && a.uid === u.uid ? safePhoto(a.data) : '';
  }
  function avatarFor(u) { return customAvatar(u) || (u && u.photoURL) || ''; }
  function cacheAvatar(uid, data) { rawSet(AVATAR_KEY, JSON.stringify({ uid: uid, data: safePhoto(data) })); }

  async function loadAvatar(u) {
    try {
      const s = FB.fs;
      const snap = await s.getDoc(s.doc(FB.db, 'users', u.uid));
      if (!FBU || FBU.uid !== u.uid) return;
      cacheAvatar(u.uid, snap.exists() ? snap.data().photoData : '');
      paintSidebar();
      emit('sp:avatar');
    } catch (e) { console.warn('[firebase] avatar is not available', e); }
  }

  function applyProfile(o) {
    if (!FBU) return;
    if (o && o.name) writeProfileName(o.name);
    if (o && typeof o.photoData === 'string') cacheAvatar(FBU.uid, o.photoData);
    cache = {};
    boardJson = '';
    paintSidebar();
  }

  function pause(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  // true — всё отправлено в облако
  async function flushAll() {
    if (!navigator.onLine || !SYNC.ready) return false;
    const work = (async function () {
      await lbFlush();
      for (let i = 0; i < 3; i++) {
        while (SYNC.flushing) await pause(150);
        await syncFlush();
        if (!Object.keys(SYNC.dirty).length) break;
      }
      const p = pendingGet(monthId());
      return !SYNC.flushing && !Object.keys(SYNC.dirty).length && p.q <= 0 && p.pts <= 0;
    })();
    return Promise.race([work, pause(10000).then(function () { return false; })])
      .catch(function () { return false; });
  }

  // Останавливает любую запись в облако (перед выходом и удалением аккаунта)
  async function halt() {
    halted = true;
    clearTimeout(flushTimer);
    clearTimeout(SYNC.timer);
    await Promise.race([
      (async function () {
        if (flushP) await flushP;
        while (SYNC.flushing) await pause(150);
      })(),
      pause(8000)
    ]);
    syncStop();
  }
  function resume() {
    halted = false;
    if (!FBU) return;
    userDocP = Promise.all([ensureUserDoc(FBU), loadAvatar(FBU)]);
    syncStart(FBU);
  }

  // Удаляет данные пользователя с этого устройства. Тема и настройки интерфейса остаются.
  function clearLocal() {
    wipeLocal();
    const extra = [META_KEY, UID_KEY, AVATAR_KEY];
    localKeys(function (k) { return typeof k === 'string' && k.indexOf('satpath_lb_') === 0; })
      .forEach(function (k) { extra.push(k); });
    extra.forEach(function (k) {
      try { store.removeItem(k); } catch (e) {}
      delete mem[k];
    });
    SYNC.meta = null;
    ['satpath_session_v1', 'satpath_solver_idx_v1', 'satpath_guest', 'sp_sync_rl'].forEach(function (k) {
      try { sessionStorage.removeItem(k); } catch (e) {}
    });
  }

  Object.assign(window.SPFirebase, {
    avatar: avatarFor,
    customAvatar: customAvatar,
    applyProfile: applyProfile,
    flushAll: flushAll,
    halt: halt,
    resume: resume,
    clearLocal: clearLocal
  });
  function boot() {
    paintSidebar();
    init().catch(function () { toast('Could not connect to your account. Working offline.'); });
  }
  // shell.js строит сайдбар на DOMContentLoaded — стартуем после него
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
