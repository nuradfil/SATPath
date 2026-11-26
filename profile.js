/* =====================================================================
   SATPath — Profile & Support (profile.js)
   ---------------------------------------------------------------------
   Маршруты:  #/profile            вкладка Profile
              #/profile?tab=support вкладка Support

   Firestore (существующая схема не меняется, только дополняется):
     users/{uid}            name, updatedAt, + новое поле photoData (аватарка base64)
     lb_YYYY-MM/{uid}       name, photo (только если документ уже есть)
     support_tickets/{id}   НОВАЯ коллекция:
                            { text, contact, contactType, uid, nick, createdAt, status:'open' }

   Подключать ПОСЛЕ shell.js, dataAdapter.js, firebaseAdapter.js.
   ===================================================================== */
(function () {
  'use strict';

  /* ===================================================================
     ▼▼▼  ВСТАВЬТЕ СВОИ КЛЮЧИ  ▼▼▼
     =================================================================== */
  // Вариант 1 (рекомендуется): заявки приходят на почту. Ключ: web3forms.com
  const WEB3FORMS_KEY = '885e38db-8be3-4c30-923f-ab4f2419570c';

  // Вариант 2: заявки приходят в Telegram.
  // ВНИМАНИЕ: этот файл публичный. Любой посетитель увидит BOT_TOKEN и сможет
  // управлять ботом. Если используете, заведите отдельного бота только для заявок.
  const BOT_TOKEN = '';
  const CHAT_ID = '';
  /* =================================================================== */

  const Shell = window.SPShell;
  if (!Shell) {
    console.error('[profile] Подключите shell.js ДО этого файла.');
    return;
  }

  const PROFILE_KEY = 'satpath_profile_v1';
  const FLASH_KEY = 'sp_flash';
  const COOLDOWN_KEY = 'sp_support_last';
  const COOLDOWN_MS = 60000;
  const AVATAR_PX = 96;
  const AVATAR_MAX_CHARS = 14000;   // ~10 КБ: аватарка копируется в документ лидерборда
  const LB_MONTHS_BACK = 36;

  const PRESETS = [
    { id: 'azure',   label: 'Azure',   a: '#3B82F6', b: '#1E3A8A', shape: 'orbit' },
    { id: 'emerald', label: 'Emerald', a: '#10B981', b: '#064E3B', shape: 'peak' },
    { id: 'amber',   label: 'Amber',   a: '#F59E0B', b: '#7C2D12', shape: 'sun' },
    { id: 'rose',    label: 'Rose',    a: '#FB7185', b: '#881337', shape: 'rings' },
    { id: 'violet',  label: 'Violet',  a: '#A78BFA', b: '#4C1D95', shape: 'diamond' },
    { id: 'cyan',    label: 'Cyan',    a: '#22D3EE', b: '#164E63', shape: 'waves' },
    { id: 'slate',   label: 'Slate',   a: '#94A3B8', b: '#1E293B', shape: 'grid' },
    { id: 'sunset',  label: 'Sunset',  a: '#F97316', b: '#6D28D9', shape: 'orbit' }
  ];

  const CONTACTS = {
    telegram: { label: 'Telegram', icon: 'send',           ph: '@username',           type: 'text',  mode: 'text',  err: 'Enter a Telegram username, such as @username.' },
    whatsapp: { label: 'WhatsApp', icon: 'message-circle', ph: '+7 700 000 00 00',    type: 'tel',   mode: 'tel',   err: 'Enter a phone number with its country code.' },
    email:    { label: 'Email',    icon: 'mail',           ph: 'name@example.com',    type: 'email', mode: 'email', err: 'Enter a valid email address.' }
  };

  /* -------------------------------------------------------------------
     УТИЛИТЫ
     ------------------------------------------------------------------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function icons() { try { if (window.lucide) window.lucide.createIcons(); } catch (e) {} }
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function withTimeout(promise, ms) {
    let timer = null;
    return Promise.race([
      promise,
      new Promise(function (_, reject) {
        timer = setTimeout(function () { const e = new Error('timeout'); e.code = 'sp/timeout'; reject(e); }, ms);
      })
    ]).finally(function () { clearTimeout(timer); });
  }
  function fire() { return window.SPFirebase || null; }
  // Новые функции появляются в SPFirebase после правок в firebaseAdapter.js
  function accountReady() { const f = fire(); return !!(f && f.halt && f.clearLocal && f.applyProfile); }

  function localName() {
    try {
      const p = JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}');
      const n = String((p && p.name) || '').trim();
      return n && n !== 'Explorer' && n !== 'Guest' ? n : '';
    } catch (e) { return ''; }
  }
  function nameOf(u) {
    return localName() || (u && (u.displayName || (u.email ? u.email.split('@')[0] : ''))) || 'Student';
  }
  function initials(name) {
    const p = String(name).trim().split(/\s+/).filter(Boolean);
    return ((p[0] ? p[0].charAt(0) : '') + (p[1] ? p[1].charAt(0) : '')).toUpperCase() || '?';
  }
  // так же сокращает имя лидерборд (shortName в firebaseAdapter.js)
  function boardName(name) {
    const p = String(name || 'Student').split(' ');
    return p[0] + (p[1] ? ' ' + p[1][0] + '.' : '');
  }
  function cleanNick(v) { return String(v || '').replace(/\s+/g, ' ').trim(); }
  function nickError(v) {
    if (v.length < 2) return 'Use at least 2 characters.';
    if (v.length > 24) return 'Use no more than 24 characters.';
    if (/[<>"'`\\]/.test(v) || /[\u0000-\u001F\u007F]/.test(v)) return 'Quotes, angle brackets and backslashes are not allowed.';
    if (v === 'Guest' || v === 'Explorer') return 'This name is reserved.';
    return '';
  }
  function validContact(type, v) {
    if (type === 'telegram') return /^@?[A-Za-z0-9_]{4,32}$/.test(v);
    if (type === 'whatsapp') {
      const d = v.replace(/\D/g, '');
      return /^\+?[\d\s()-]+$/.test(v) && d.length >= 7 && d.length <= 15;
    }
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && v.length <= 120;
  }

  /* -------------------------------------------------------------------
     АВАТАРКИ: пресеты и загрузка превращаются в маленький JPEG (base64)
     ------------------------------------------------------------------- */
  function newCanvas() {
    const c = document.createElement('canvas');
    c.width = AVATAR_PX; c.height = AVATAR_PX;
    return c;
  }
  const presetCache = {};
  function presetData(p) {
    if (presetCache[p.id]) return presetCache[p.id];
    const c = newCanvas(), x = c.getContext('2d'), S = AVATAR_PX, TAU = Math.PI * 2;
    const g = x.createLinearGradient(0, 0, S, S);
    g.addColorStop(0, p.a); g.addColorStop(1, p.b);
    x.fillStyle = g; x.fillRect(0, 0, S, S);
    x.strokeStyle = 'rgba(255,255,255,.85)';
    x.fillStyle = 'rgba(255,255,255,.85)';
    x.lineWidth = 5; x.lineCap = 'round'; x.lineJoin = 'round';
    const circle = function (cx, cy, r, fill) { x.beginPath(); x.arc(cx, cy, r, 0, TAU); if (fill) x.fill(); else x.stroke(); };
    const path = function (pts, close) {
      x.beginPath(); pts.forEach(function (q, i) { if (i) x.lineTo(q[0], q[1]); else x.moveTo(q[0], q[1]); });
      if (close) x.closePath(); x.stroke();
    };
    if (p.shape === 'orbit') { circle(48, 48, 12, true); circle(48, 48, 27, false); circle(70, 31, 6, true); }
    else if (p.shape === 'peak') { path([[20, 66], [40, 34], [52, 52], [61, 40], [76, 66]], true); }
    else if (p.shape === 'sun') {
      circle(48, 48, 13, true);
      for (let i = 0; i < 8; i++) { const a = i * TAU / 8; path([[48 + Math.cos(a) * 22, 48 + Math.sin(a) * 22], [48 + Math.cos(a) * 29, 48 + Math.sin(a) * 29]]); }
    }
    else if (p.shape === 'rings') { circle(39, 48, 17, false); circle(57, 48, 17, false); }
    else if (p.shape === 'diamond') { path([[48, 21], [73, 48], [48, 75], [23, 48]], true); circle(48, 48, 6, true); }
    else if (p.shape === 'waves') {
      [36, 50, 64].forEach(function (y) { x.beginPath(); x.moveTo(23, y); x.bezierCurveTo(35, y - 14, 46, y + 12, 73, y - 4); x.stroke(); });
    }
    else { [31, 48, 65].forEach(function (gx) { [31, 48, 65].forEach(function (gy) { circle(gx, gy, 4.5, true); }); }); }
    presetCache[p.id] = c.toDataURL('image/jpeg', 0.86);
    return presetCache[p.id];
  }

  function compressImage(file) {
    return new Promise(function (resolve, reject) {
      if (!/^image\/(jpeg|png|webp)$/.test(file.type)) { reject(new Error('Choose a JPG, PNG or WebP image.')); return; }
      if (file.size > 10 * 1024 * 1024) { reject(new Error('The image must be smaller than 10 MB.')); return; }
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = function () {
        try {
          const side = Math.min(img.naturalWidth, img.naturalHeight);
          const c = newCanvas(), x = c.getContext('2d');
          x.fillStyle = '#ffffff';                       // фон для прозрачных PNG
          x.fillRect(0, 0, AVATAR_PX, AVATAR_PX);
          x.imageSmoothingQuality = 'high';
          x.drawImage(img, (img.naturalWidth - side) / 2, (img.naturalHeight - side) / 2, side, side, 0, 0, AVATAR_PX, AVATAR_PX);
          let q = 0.86, out = c.toDataURL('image/jpeg', q);
          while (out.length > AVATAR_MAX_CHARS && q > 0.4) { q -= 0.1; out = c.toDataURL('image/jpeg', q); }
          URL.revokeObjectURL(url);
          if (out.length > AVATAR_MAX_CHARS) reject(new Error('This image could not be compressed enough. Try another one.'));
          else resolve(out);
        } catch (e) { URL.revokeObjectURL(url); reject(new Error('Could not process this image.')); }
      };
      img.onerror = function () { URL.revokeObjectURL(url); reject(new Error('Could not read this image.')); };
      img.src = url;
    });
  }

  function avatarHTML(src, name, cls) {
    return '<span class="relative grid shrink-0 place-items-center overflow-hidden rounded-full bg-accent/15 font-semibold text-accent ' + cls + '">' +
      esc(initials(name)) +
      (src ? '<img data-pf-img src="' + esc(src) + '" alt="" referrerpolicy="no-referrer" class="absolute inset-0 h-full w-full object-cover">' : '') +
      '</span>';
  }

  /* -------------------------------------------------------------------
     СОХРАНЕНИЕ ПРОФИЛЯ
     ------------------------------------------------------------------- */
  // Лидерборд обновляется только для текущего месяца и только если запись уже есть
  async function updateBoardEntry(FB, user, patch) {
    const s = FB.fs;
    const ref = s.doc(FB.db, 'lb_' + fire().monthId(), user.uid);
    const snap = await withTimeout(s.getDoc(ref), 10000);
    if (snap.exists()) await withTimeout(s.setDoc(ref, patch, { merge: true }), 10000);
  }

  // Возвращает true, если лидерборд тоже обновился
  async function saveNickname(nick) {
    const F = fire(), FB = await F.init(), user = F.user();
    if (!user) throw new Error('not-signed-in');
    await withTimeout(FB.au.updateProfile(user, { displayName: nick }), 15000);
    F.applyProfile({ name: nick });
    const s = FB.fs;
    await withTimeout(s.setDoc(s.doc(FB.db, 'users', user.uid), { name: nick, updatedAt: Date.now() }, { merge: true }), 15000);
    let boardOk = true;
    try { await updateBoardEntry(FB, user, { name: boardName(nick) }); }
    catch (e) { boardOk = false; console.warn('[profile] leaderboard name update failed', e); }
    F.applyProfile({});           // сбросить кэш рейтинга
    return boardOk;
  }

  // photoData: base64 или '' (вернуться к фото Google / инициалам)
  async function saveAvatar(photoData) {
    const F = fire(), FB = await F.init(), user = F.user();
    if (!user) throw new Error('not-signed-in');
    const s = FB.fs;
    await withTimeout(s.setDoc(s.doc(FB.db, 'users', user.uid), { photoData: photoData, updatedAt: Date.now() }, { merge: true }), 15000);
    F.applyProfile({ photoData: photoData });
    let boardOk = true;
    try { await updateBoardEntry(FB, user, { photo: photoData || user.photoURL || '' }); }
    catch (e) { boardOk = false; console.warn('[profile] leaderboard photo update failed', e); }
    F.applyProfile({});
    return boardOk;
  }

  /* -------------------------------------------------------------------
     ВЫХОД И УДАЛЕНИЕ АККАУНТА
     ------------------------------------------------------------------- */
  function finishSession(message) {
    try { sessionStorage.setItem(FLASH_KEY, message); } catch (e) {}
    location.hash = '#/dashboard';
    setTimeout(function () { location.reload(); }, 60);   // сбрасывает все кэши в памяти
  }

  async function performLogout() {
    const F = fire(), FB = await F.init();
    await F.halt();
    try { await FB.au.signOut(FB.auth); }
    catch (e) { F.resume(); throw e; }
    F.clearLocal();
    finishSession('You have been logged out');
  }

  /* Порядок важен:
       1) повторный вход (делается ДО вызова этой функции) — чтобы deleteUser не упал после удаления данных
       2) остановить синхронизацию, иначе она заново создаст удалённые документы
       3) users/{uid}/sync/*  и  users/{uid}
       4) записи в lb_YYYY-MM
       5) аккаунт Firebase Auth                                                   */
  async function wipeAccount(FB, user) {
    const F = fire(), s = FB.fs, uid = user.uid;
    await F.halt();
    const userRef = s.doc(FB.db, 'users', uid);
    let backup = null;
    try {
      const snap = await withTimeout(s.getDoc(userRef), 15000);
      backup = snap.exists() ? snap.data() : null;
      const syncSnap = await withTimeout(s.getDocsFromServer(s.collection(FB.db, 'users', uid, 'sync')), 20000);
      const docs = syncSnap.docs;
      for (let i = 0; i < docs.length; i += 400) {
        const batch = s.writeBatch(FB.db);
        docs.slice(i, i + 400).forEach(function (d) { batch.delete(d.ref); });
        await withTimeout(batch.commit(), 20000);
      }
      await withTimeout(s.deleteDoc(userRef), 15000);
    } catch (e) {
      console.error('[profile] data deletion failed', e);
      F.resume();                       // локальные данные снова загрузятся в облако
      e.spStage = 'data';
      throw e;
    }

    // Записи рейтинга: ошибки здесь не блокируют удаление аккаунта
    let boardFailed = 0;
    const jobs = [];
    for (let i = 0; i < LB_MONTHS_BACK; i++) {
      const ref = s.doc(FB.db, 'lb_' + F.monthId(-i), uid);
      jobs.push(
        withTimeout(s.getDoc(ref).then(function (snap) { return snap.exists() ? s.deleteDoc(ref) : null; }), 20000)
          .catch(function (e) { boardFailed++; console.warn('[profile] leaderboard entry not removed', ref.path, e); })
      );
    }
    await Promise.all(jobs);

    try {
      await FB.au.deleteUser(user);
    } catch (e) {
      console.error('[profile] deleteUser failed', e);
      if (backup) {                     // вернуть документ с теми же полями (в том числе aiTokens и coins)
        try { await withTimeout(s.setDoc(userRef, backup), 15000); } catch (err) { console.warn('[profile] restore failed', err); }
      }
      F.resume();
      e.spStage = 'auth';
      throw e;
    }

    F.clearLocal();
    finishSession(boardFailed
      ? 'Account deleted. Some leaderboard entries could not be removed.'
      : 'Your account has been deleted');
  }

  function deleteError(e) {
    const code = e && e.code;
    if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') return 'Incorrect password.';
    if (code === 'auth/user-mismatch') return 'That is a different Google account. Choose the account you are signed in with.';
    if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') return 'Verification was cancelled. Nothing was deleted.';
    if (code === 'auth/popup-blocked') return 'Your browser blocked the Google window. Allow pop-ups and try again.';
    if (code === 'auth/too-many-requests') return 'Too many attempts. Please wait a few minutes and try again.';
    if (code === 'auth/requires-recent-login') return 'For security, log out, sign in again and then delete your account.';
    if (code === 'auth/network-request-failed' || code === 'sp/timeout') return 'Network problem. Check your connection and try again.';
    if (e && e.spStage === 'data') return 'Your data could not be deleted' + (code ? ' (' + code + ')' : '') + '. Your account is unchanged.';
    return 'Could not delete the account' + (code ? ' (' + code + ')' : '') + '. Please try again.';
  }

  /* -------------------------------------------------------------------
     ЗАЯВКИ В ПОДДЕРЖКУ
     ------------------------------------------------------------------- */
  async function saveTicket(ticket) {
    const F = fire();
    if (!F) return false;
    const FB = await withTimeout(F.init(), 10000);
    await withTimeout(F.ready(), 10000);
    const user = F.user();
    ticket.uid = user ? user.uid : null;
    await withTimeout(FB.fs.addDoc(FB.fs.collection(FB.db, 'support_tickets'), ticket), 12000);
    return true;
  }

  function ticketText(t) {
    return 'New SATPath support request\n\n' + t.text +
      '\n\nContact (' + t.contactType + '): ' + t.contact +
      '\nNickname: ' + t.nick +
      '\nUID: ' + (t.uid || 'guest') +
      '\nDate: ' + new Date(t.createdAt).toISOString();
  }

  async function sendWeb3Forms(t) {
    const body = {
      access_key: WEB3FORMS_KEY,
      subject: 'SATPath support — ' + t.nick,
      from_name: 'SATPath Support',
      message: ticketText(t)
    };
    if (t.contactType === 'email') body.email = t.contact;   // чтобы можно было сразу нажать «Ответить»
    const res = await withTimeout(fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body)
    }), 12000);
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error('web3forms: ' + (json.message || res.status));
    return true;
  }

  async function sendTelegram(t) {
    const res = await withTimeout(fetch('https://api.telegram.org/bot' + BOT_TOKEN + '/sendMessage', {
      method: 'POST',
      body: new URLSearchParams({ chat_id: CHAT_ID, text: ticketText(t).slice(0, 4000) })
    }), 12000);
    if (!res.ok) throw new Error('telegram: ' + res.status);
    return true;
  }

  // Успех, если заявка сохранена в Firestore ИЛИ доставлено уведомление
  async function submitTicket(ticket) {
    const F = fire(), u = F && F.user ? F.user() : null;
    ticket.uid = u ? u.uid : null;
    const quiet = function (p, what) {
      return p.catch(function (e) { console.warn('[support] ' + what + ' failed', e); return false; });
    };
    const saved = await quiet(saveTicket(ticket), 'Firestore');
    const jobs = [];
    if (WEB3FORMS_KEY) jobs.push(quiet(sendWeb3Forms(ticket), 'Web3Forms'));
    if (BOT_TOKEN && CHAT_ID) jobs.push(quiet(sendTelegram(ticket), 'Telegram'));
    const sent = (await Promise.all(jobs)).some(Boolean);
    if (!saved && !sent) throw new Error('not-delivered');
  }

  /* -------------------------------------------------------------------
     РАЗМЕТКА
     ------------------------------------------------------------------- */
  const INPUT = 'h-11 w-full rounded-lg border bg-canvas px-3 text-[14px] text-ink outline-none transition-colors placeholder:text-ink-mute focus:border-accent';
  const PRIMARY = 'inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-accent px-5 text-[13.5px] font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-accent';
  const GHOST = 'inline-flex h-11 items-center justify-center gap-2 rounded-lg border px-5 text-[13.5px] font-medium transition-colors hover:bg-raised disabled:opacity-40';
  const DANGER = 'inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-danger px-5 text-[13.5px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40';
  const SPINNER = '<i data-lucide="loader-circle" class="h-4 w-4 animate-spin"></i>';

  function busy(btn, on, label) {
    if (!btn) return;
    if (on) {
      btn.dataset.html = btn.innerHTML;
      btn.disabled = true;
      btn.setAttribute('aria-busy', 'true');
      btn.innerHTML = SPINNER + esc(label);
    } else {
      btn.disabled = false;
      btn.removeAttribute('aria-busy');
      if (btn.dataset.html) btn.innerHTML = btn.dataset.html;
    }
    icons();
  }
  function say(el, text, ok) {
    if (!el) return;
    el.textContent = text || '';
    el.className = 'min-h-[18px] text-[12.5px] leading-snug ' + (ok ? 'text-success' : 'text-danger');
  }
  function cardTitle(icon, title, sub) {
    return '<div class="flex items-start gap-3"><span class="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-raised text-accent"><i data-lucide="' + icon + '" class="h-[18px] w-[18px]"></i></span>' +
      '<div class="min-w-0"><h2 class="text-[15px] font-semibold">' + title + '</h2><p class="mt-0.5 text-[12.5px] text-ink-soft">' + sub + '</p></div></div>';
  }
  function skeletonHTML() {
    return '<div class="grid gap-4 lg:grid-cols-2" aria-hidden="true"><div class="card h-[130px] animate-pulse lg:col-span-2"></div><div class="card h-[220px] animate-pulse"></div><div class="card h-[220px] animate-pulse"></div></div>';
  }
  function noticeHTML(icon, title, text, button) {
    return '<section class="card rise px-6 py-14 text-center"><div class="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-raised text-accent"><i data-lucide="' + icon + '" class="h-6 w-6"></i></div>' +
      '<p class="mt-4 text-[16px] font-semibold">' + title + '</p><p class="mx-auto mt-1.5 max-w-[420px] text-[13px] leading-relaxed text-ink-soft">' + text + '</p>' +
      (button || '') + '</section>';
  }

  function profileHTML(user) {
    const F = fire();
    const name = nameOf(user);
    const photo = F.avatar(user);
    const custom = F.customAvatar(user);
    const tile = 'relative grid aspect-square min-h-[44px] place-items-center rounded-2xl border p-1.5 transition-all hover:-translate-y-0.5 hover:bg-raised aria-pressed:border-accent aria-pressed:bg-accent/10 disabled:pointer-events-none disabled:opacity-50';

    let presetOn = false;
    const presets = PRESETS.map(function (p) {
      const data = presetData(p);
      const on = custom === data;
      if (on) presetOn = true;
      return '<button type="button" data-pf="preset" data-id="' + p.id + '" aria-pressed="' + on + '" aria-label="' + p.label + ' avatar" title="' + p.label + '" class="' + tile + '">' +
        '<img src="' + data + '" alt="" class="h-full w-full rounded-full object-cover"></button>';
    }).join('');

    const uploaded = custom && !presetOn
      ? '<button type="button" data-pf="noop" aria-pressed="true" aria-label="Your uploaded photo" title="Your photo" class="' + tile + '"><img src="' + esc(custom) + '" alt="" class="h-full w-full rounded-full object-cover"></button>'
      : '';

    const defaultTile = '<button type="button" data-pf="default" aria-pressed="' + !custom + '" aria-label="Default avatar" title="Default" class="' + tile + '">' +
      avatarHTML(user.photoURL || '', name, 'h-full w-full text-[14px]') + '</button>';

    return '<div class="grid gap-4 lg:grid-cols-2">' +

      '<section class="card rise flex items-center gap-4 p-5 md:p-6 lg:col-span-2" style="--i:0">' +
        '<span id="pfHeroAv">' + avatarHTML(photo, name, 'h-16 w-16 text-[20px] md:h-20 md:w-20') + '</span>' +
        '<div class="min-w-0"><div id="pfHeroName" class="truncate text-[20px] font-semibold tracking-tight md:text-[22px]">' + esc(name) + '</div>' +
        '<div class="mt-0.5 truncate text-[13px] text-ink-soft">' + esc(user.email || 'No email') + '</div>' +
        '<span class="mt-2 inline-flex h-6 items-center gap-1.5 rounded-full bg-success/10 px-2.5 text-[11.5px] font-semibold text-success"><i data-lucide="cloud" class="h-3.5 w-3.5"></i>Signed in</span></div>' +
      '</section>' +

      '<section class="card rise p-5 md:p-6" style="--i:1">' +
        cardTitle('user-round', 'Nickname', 'Shown in the sidebar, on your dashboard and on the leaderboard.') +
        '<form id="pfNickForm" class="mt-4 space-y-2.5" novalidate>' +
          '<label class="sr-only" for="pfNick">Nickname</label>' +
          '<input id="pfNick" type="text" maxlength="24" autocomplete="nickname" spellcheck="false" value="' + esc(name) + '" class="' + INPUT + '">' +
          '<p class="text-[12px] text-ink-mute">Leaderboard preview: <span id="pfPreview" class="font-medium text-ink-soft">' + esc(boardName(name)) + '</span></p>' +
          '<p id="pfNickMsg" class="min-h-[18px] text-[12.5px]" role="status" aria-live="polite"></p>' +
          '<button type="submit" id="pfNickSave" class="' + PRIMARY + ' w-full sm:w-auto" disabled>Save nickname</button>' +
        '</form>' +
      '</section>' +

      '<section class="card rise p-5 md:p-6" style="--i:2">' +
        cardTitle('image', 'Avatar', 'Pick a built-in style or upload your own photo.') +
        '<div class="mt-4 grid grid-cols-5 gap-2" role="group" aria-label="Choose an avatar">' + defaultTile + presets + uploaded + '</div>' +
        '<div class="mt-4 flex flex-wrap items-center gap-3">' +
          '<button type="button" id="pfUploadBtn" data-pf="upload" class="' + GHOST + '"><i data-lucide="upload" class="h-4 w-4"></i>Upload photo</button>' +
          '<span class="text-[12px] text-ink-mute">JPG, PNG or WebP · cropped to a square</span>' +
          '<input id="pfFile" type="file" accept="image/jpeg,image/png,image/webp" class="hidden">' +
        '</div>' +
        '<p id="pfAvMsg" class="mt-2 min-h-[18px] text-[12.5px]" role="status" aria-live="polite"></p>' +
      '</section>' +

      '<section class="card rise flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between md:p-6 lg:col-span-2" style="--i:3">' +
        cardTitle('log-out', 'Log out', 'Your progress is synced first, then removed from this device.') +
        '<button type="button" id="pfLogout" data-pf="logout" class="' + GHOST + ' shrink-0">Log out</button>' +
      '</section>' +

      '<section class="rise rounded-2xl border border-danger/40 bg-danger/5 p-5 md:p-6 lg:col-span-2" style="--i:4" aria-labelledby="pfDangerT">' +
        '<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">' +
          '<div class="min-w-0"><h2 id="pfDangerT" class="flex items-center gap-2 text-[15px] font-semibold text-danger"><i data-lucide="alert-triangle" class="h-4 w-4"></i>Danger Zone</h2>' +
          '<p class="mt-1.5 text-[13px] leading-relaxed text-ink-soft">Permanently delete your account, synced progress and leaderboard entries. This cannot be undone.</p></div>' +
          '<button type="button" data-pf="delete" class="' + DANGER + ' shrink-0"><i data-lucide="trash-2" class="h-4 w-4"></i>Delete account</button>' +
        '</div>' +
      '</section>' +
    '</div>';
  }

  function supportFormHTML(draft) {
    const type = CONTACTS[draft.type];
    const chips = Object.keys(CONTACTS).map(function (k) {
      const c = CONTACTS[k];
      return '<button type="button" data-pf="ctype" data-v="' + k + '" aria-pressed="' + (draft.type === k) + '" class="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full border px-4 text-[13px] font-medium text-ink-soft transition-colors hover:bg-raised hover:text-ink aria-pressed:border-accent aria-pressed:bg-accent/15 aria-pressed:text-ink sm:flex-none">' +
        '<i data-lucide="' + c.icon + '" class="h-4 w-4"></i>' + c.label + '</button>';
    }).join('');

    return '<div class="grid gap-4 lg:grid-cols-3">' +
      '<section class="card rise p-5 md:p-6 lg:col-span-2" style="--i:0">' +
        cardTitle('life-buoy', 'Contact support', 'Report a problem or share an idea.') +
        '<form id="pfSupport" class="mt-5 space-y-5" novalidate>' +
          '<div><label for="pfText" class="mb-1.5 block text-[13px] font-medium">Describe your problem or idea</label>' +
            '<textarea id="pfText" rows="6" maxlength="2000" placeholder="What happened, or what would make SATPath better?" class="w-full resize-y rounded-lg border bg-canvas px-3 py-2.5 text-[14px] leading-relaxed text-ink outline-none transition-colors placeholder:text-ink-mute focus:border-accent">' + esc(draft.text) + '</textarea>' +
            '<div class="mt-1 text-right text-[11.5px] text-ink-mute"><span id="pfCount" class="num">' + draft.text.length + '</span> / 2000</div></div>' +
          '<div><div class="mb-1.5 text-[13px] font-medium" id="pfCtypeL">How should we reach you?</div>' +
            '<div class="flex flex-wrap gap-2" role="group" aria-labelledby="pfCtypeL">' + chips + '</div>' +
            '<label for="pfContact" class="sr-only">Contact details</label>' +
            '<input id="pfContact" type="' + type.type + '" inputmode="' + type.mode + '" maxlength="120" autocomplete="off" placeholder="' + type.ph + '" value="' + esc(draft.contact) + '" class="' + INPUT + ' mt-2.5"></div>' +
          // скрытое поле-ловушка для спам-ботов
          '<input id="pfWebsite" type="text" tabindex="-1" autocomplete="off" aria-hidden="true" class="hidden">' +
          '<p id="pfSupMsg" class="min-h-[18px] text-[12.5px]" role="alert"></p>' +
          '<button type="submit" id="pfSend" class="' + PRIMARY + ' w-full sm:w-auto"><i data-lucide="send" class="h-4 w-4"></i>Send request</button>' +
        '</form>' +
      '</section>' +
      '<aside class="card rise h-fit p-5 md:p-6" style="--i:1"><h2 class="text-[13px] font-semibold">For a faster answer</h2>' +
        '<ul class="mt-3 space-y-3 text-[13px] leading-snug text-ink-soft">' + [
          ['map-pin', 'Say which screen you were on.'],
          ['list-checks', 'List the steps that led to the problem.'],
          ['monitor-smartphone', 'Mention your device and browser.'],
          ['shield', 'Never include passwords or payment details.']
        ].map(function (r) {
          return '<li class="flex gap-2.5"><i data-lucide="' + r[0] + '" class="mt-0.5 h-4 w-4 shrink-0 text-accent"></i><span>' + r[1] + '</span></li>';
        }).join('') + '</ul></aside>' +
    '</div>';
  }

  function sentHTML() {
    return '<section class="card rise px-6 py-14 text-center" role="status"><div class="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-success/10 text-success"><i data-lucide="check-circle-2" class="h-7 w-7"></i></div>' +
      '<p class="mt-5 text-[20px] font-semibold tracking-tight">Request sent</p>' +
      '<p class="mx-auto mt-2 max-w-[420px] text-[13.5px] leading-relaxed text-ink-soft">Thank you. We will reply using the contact you provided.</p>' +
      '<button type="button" data-pf="again" class="' + GHOST + ' mt-6">Send another request</button></section>';
  }

  /* -------------------------------------------------------------------
     МОДАЛЬНЫЕ ОКНА
     ------------------------------------------------------------------- */
  let activeModal = null;
  function openModal(label, inner) {
    closeModal(true);
    const el = document.createElement('div');
    el.className = 'fixed inset-0 z-[110] grid place-items-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-label', label);
    el.innerHTML = '<div class="rise w-full max-w-[440px] rounded-2xl border bg-surface p-6 shadow-2xl">' + inner + '</div>';
    const m = { el: el, locked: false, onKey: null, onClose: null };
    m.onKey = function (e) { if (e.key === 'Escape' && !m.locked) { e.stopPropagation(); closeModal(); } };
    el.addEventListener('click', function (e) {
      if (!m.locked && (e.target === el || e.target.closest('[data-md="cancel"]'))) closeModal();
    });
    document.addEventListener('keydown', m.onKey, true);
    document.body.appendChild(el);
    activeModal = m;
    icons();
    return m;
  }
  function closeModal(force) {
    const m = activeModal;
    if (!m || (m.locked && !force)) return;
    activeModal = null;
    document.removeEventListener('keydown', m.onKey, true);
    m.el.remove();
    if (m.onClose) m.onClose();
  }
  function lockModal(m, on) {
    m.locked = on;
    m.el.querySelectorAll('button, input').forEach(function (x) { x.disabled = on; });
  }

  function confirmModal(o) {
    return new Promise(function (resolve) {
      const m = openModal(o.title,
        '<h2 class="text-[18px] font-semibold tracking-tight">' + esc(o.title) + '</h2>' +
        '<p class="mt-2 text-[13.5px] leading-relaxed text-ink-soft">' + esc(o.text) + '</p>' +
        '<div class="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">' +
          '<button type="button" data-md="cancel" class="' + GHOST + '">Cancel</button>' +
          '<button type="button" data-md="ok" class="' + PRIMARY + '">' + esc(o.ok) + '</button></div>');
      let answer = false;
      m.onClose = function () { resolve(answer); };
      const ok = m.el.querySelector('[data-md="ok"]');
      ok.onclick = function () { answer = true; closeModal(); };
      ok.focus();
    });
  }

  function deleteModal(FB, user, onBusy) {
    const providers = (user.providerData || []).map(function (p) { return p.providerId; });
    const hasPassword = providers.indexOf('password') >= 0;
    const hasGoogle = providers.indexOf('google.com') >= 0;

    const m = openModal('Delete account',
      '<div class="grid h-11 w-11 place-items-center rounded-xl bg-danger/10 text-danger"><i data-lucide="trash-2" class="h-5 w-5"></i></div>' +
      '<h2 class="mt-4 text-[19px] font-semibold tracking-tight">Delete your account?</h2>' +
      '<p class="mt-2 text-[13.5px] leading-relaxed text-ink-soft">Your profile, synced progress and leaderboard entries will be permanently removed. Support requests you have sent are kept.</p>' +
      '<label class="mt-5 block text-[12.5px] font-medium" for="pfDelWord">Type <span class="num text-danger">DELETE</span> to confirm</label>' +
      '<input id="pfDelWord" type="text" autocomplete="off" autocapitalize="characters" spellcheck="false" class="' + INPUT + ' num mt-1.5">' +
      (hasPassword
        ? '<label class="mt-3 block text-[12.5px] font-medium" for="pfDelPass">Your password</label>' +
          '<input id="pfDelPass" type="password" autocomplete="current-password" class="' + INPUT + ' mt-1.5">'
        : '<p class="mt-3 text-[12.5px] text-ink-soft">For security, Google will ask you to confirm your account.</p>') +
      '<p id="pfDelMsg" class="mt-2 min-h-[18px] text-[12.5px] text-danger" role="alert"></p>' +
      '<div class="mt-3 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">' +
        '<button type="button" data-md="cancel" class="' + GHOST + '">Cancel</button>' +
        '<button type="button" id="pfDelGo" class="' + DANGER + '" disabled>' + (hasPassword ? 'Delete account' : 'Verify and delete') + '</button></div>' +
      (hasPassword && hasGoogle ? '<button type="button" id="pfDelGoogle" class="mt-3 min-h-[44px] w-full text-[12.5px] font-medium text-ink-soft hover:text-ink">Verify with Google instead</button>' : ''));

    const q = function (id) { return m.el.querySelector('#' + id); };
    const word = q('pfDelWord'), pass = q('pfDelPass'), go = q('pfDelGo'), msg = q('pfDelMsg'), alt = q('pfDelGoogle');
    const ready = function () { return word.value.trim() === 'DELETE'; };
    const sync = function () { go.disabled = !ready(); };
    word.addEventListener('input', sync);
    word.focus();

    function run(useGoogle) {
      msg.textContent = '';
      if (!ready()) { msg.textContent = 'Type DELETE to confirm.'; return; }
      if (!navigator.onLine) { msg.textContent = 'You are offline. Connect to the internet first.'; return; }
      if (!useGoogle && !pass.value) { msg.textContent = 'Enter your password.'; pass.focus(); return; }

      // Окно Google должно открываться прямо из клика, иначе браузер его заблокирует
      let reauth;
      try {
        if (useGoogle) reauth = FB.au.reauthenticateWithPopup(user, new FB.au.GoogleAuthProvider());
        else reauth = FB.au.reauthenticateWithCredential(user, FB.au.EmailAuthProvider.credential(user.email, pass.value));
      } catch (e) { msg.textContent = deleteError(e); return; }

      lockModal(m, true);
      onBusy(true);
      go.innerHTML = SPINNER + 'Deleting…';
      icons();
      reauth
        .then(function () { return wipeAccount(FB, user); })
        .catch(function (e) {
          console.error('[profile] delete account', e);
          onBusy(false);
          lockModal(m, false);
          go.textContent = hasPassword ? 'Delete account' : 'Verify and delete';
          sync();
          msg.textContent = deleteError(e);
        });
    }
    go.onclick = function () { run(!hasPassword); };
    if (alt) alt.onclick = function () { run(true); };
    m.el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && e.target.tagName === 'INPUT') { e.preventDefault(); run(!hasPassword); }
    });
  }

  /* -------------------------------------------------------------------
     ЭКРАН
     ------------------------------------------------------------------- */
  Shell.register('profile', {
    title: 'Profile & Support',
    group: 'Account',
    render: function (root, ctx) {
      let alive = true;
      let working = false;                 // идёт выход / удаление / сохранение
      let token = 0;
      let tab = ctx.params.get('tab') === 'support' ? 'support' : 'profile';
      const draft = { text: '', contact: '', type: 'telegram' };
      let sent = false;

      const TAB = 'inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full px-5 text-[13.5px] font-medium text-ink-soft transition-colors hover:text-ink aria-selected:bg-raised aria-selected:text-ink sm:h-9 sm:flex-none';
      root.innerHTML =
        '<div class="mx-auto w-full max-w-[960px] space-y-5 px-4 py-6 md:px-8 md:py-10">' +
          '<div class="rise"><h1 class="text-[26px] font-semibold tracking-tight md:text-[30px]">Profile &amp; Support</h1>' +
          '<p class="mt-1.5 text-[14px] text-ink-soft">Manage your account or get in touch with us.</p></div>' +
          '<div class="flex w-full gap-1 rounded-full border bg-surface p-1 sm:w-fit" role="tablist">' +
            '<button type="button" role="tab" data-pf="tab" data-v="profile" class="' + TAB + '"><i data-lucide="settings" class="h-4 w-4"></i>Profile</button>' +
            '<button type="button" role="tab" data-pf="tab" data-v="support" class="' + TAB + '"><i data-lucide="life-buoy" class="h-4 w-4"></i>Support</button>' +
          '</div>' +
          '<div id="pfBody" role="tabpanel"></div>' +
        '</div>';
      const body = root.querySelector('#pfBody');
      const $ = function (id) { return root.querySelector('#' + id); };

      function afterPaint() {
        body.querySelectorAll('img[data-pf-img]').forEach(function (img) {
          img.addEventListener('error', function () { img.remove(); });
        });
        icons();
      }
      function paintTabs() {
        root.querySelectorAll('[role="tab"]').forEach(function (b) {
          b.setAttribute('aria-selected', String(b.getAttribute('data-v') === tab));
        });
      }

      function paintSupport() {
        token++;
        if (sent) { body.innerHTML = sentHTML(); afterPaint(); return; }
        const u = fire() && fire().user ? fire().user() : null;
        if (!draft.contact && draft.type === 'email' && u && u.email) draft.contact = u.email;
        body.innerHTML = supportFormHTML(draft);
        afterPaint();
      }

      function paintProfile() {
        const id = ++token;
        const F = fire();
        if (!F) {
          body.innerHTML = noticeHTML('plug', 'Account service is not connected',
            /[?&]demo=1(&|$)/.test(location.search) ? 'Account settings are turned off in demo mode.' : 'Check that firebaseAdapter.js is connected on this page.');
          afterPaint();
          return;
        }
        if (!accountReady()) {
          body.innerHTML = noticeHTML('wrench', 'Setup is not finished', 'Apply the account edits to firebaseAdapter.js, then reload the page.');
          afterPaint();
          return;
        }
        body.innerHTML = skeletonHTML();
        withTimeout(F.init().then(F.ready), 12000).then(function () {
          if (!alive || id !== token) return;
          const user = F.user();
          body.innerHTML = user ? profileHTML(user) : noticeHTML('user-round', 'You are not signed in',
            'Sign in to change your nickname and avatar and to sync your progress.',
            '<button type="button" data-pf="signin" class="btn-pill mt-6">Sign in <i data-lucide="arrow-right" class="h-4 w-4"></i></button>');
          afterPaint();
        }).catch(function (e) {
          console.error('[profile]', e);
          if (!alive || id !== token) return;
          body.innerHTML = noticeHTML('wifi-off', 'Could not load your account', 'Check your internet connection and try again.',
            '<button type="button" data-pf="reload" class="' + PRIMARY + ' mt-6">Try again</button>');
          afterPaint();
        });
      }

      function paint() { paintTabs(); if (tab === 'support') paintSupport(); else paintProfile(); }

      function chooseAvatar(data) {
        const F = fire(), user = F.user();
        if (!user || working) return;
        if (data === F.customAvatar(user)) return;
        if (!navigator.onLine) { say($('pfAvMsg'), 'You are offline. Connect to the internet first.'); return; }
        working = true;
        body.querySelectorAll('[data-pf="preset"], [data-pf="default"], #pfUploadBtn').forEach(function (b) { b.disabled = true; });
        say($('pfAvMsg'), 'Saving…', true);
        saveAvatar(data).then(function (boardOk) {
          working = false;
          if (!alive) return;
          if (tab === 'profile') paintProfile();
          Shell.toast(boardOk ? 'Avatar updated' : 'Avatar saved. The leaderboard will update later.');
        }).catch(function (e) {
          console.error('[profile] avatar', e);
          working = false;
          if (!alive) return;
          body.querySelectorAll('[data-pf="preset"], [data-pf="default"], #pfUploadBtn').forEach(function (b) { b.disabled = false; });
          say($('pfAvMsg'), 'Could not save the avatar. Please try again.');
        });
      }

      async function logout(btn) {
        if (working) return;
        working = true;
        busy(btn, true, 'Syncing…');
        try {
          const synced = await fire().flushAll();
          if (!synced) {
            const go = await confirmModal({
              title: 'Log out without syncing?',
              text: 'Some recent progress has not been saved to your account. Logging out now removes it from this device.',
              ok: 'Log out anyway'
            });
            if (!go) { working = false; busy(btn, false); return; }
          }
          await performLogout();
        } catch (e) {
          console.error('[profile] logout', e);
          working = false;
          busy(btn, false);
          Shell.toast('Could not log out. Please try again.');
        }
      }

      function onClick(e) {
        const b = e.target.closest('[data-pf]');
        if (!b || b.disabled) return;
        const a = b.getAttribute('data-pf');
        if (a === 'tab') {
          if (working) return;
          tab = b.getAttribute('data-v');
          try { history.replaceState(null, '', location.pathname + location.search + '#/profile' + (tab === 'support' ? '?tab=support' : '')); } catch (err) {}
          paint();
        }
        else if (a === 'signin') fire().openAuth();
        else if (a === 'reload') paintProfile();
        else if (a === 'default') chooseAvatar('');
        else if (a === 'preset') {
          const p = PRESETS.filter(function (x) { return x.id === b.getAttribute('data-id'); })[0];
          if (p) chooseAvatar(presetData(p));
        }
        else if (a === 'upload') $('pfFile').click();
        else if (a === 'logout') logout(b);
        else if (a === 'delete') {
          if (working) return;
          const F = fire();
          F.init().then(function (FB) {
            const user = F.user();
            if (alive && user) deleteModal(FB, user, function (v) { working = v; });
          }).catch(function () { Shell.toast('Could not reach your account. Please try again.'); });
        }
        else if (a === 'ctype') {
          const v = b.getAttribute('data-v');
          if (v === draft.type) return;
          draft.type = v;
          draft.contact = '';
          const u = fire() && fire().user ? fire().user() : null;
          if (v === 'email' && u && u.email) draft.contact = u.email;
          const input = $('pfContact'), c = CONTACTS[v];
          body.querySelectorAll('[data-pf="ctype"]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
          input.type = c.type;
          input.setAttribute('inputmode', c.mode);
          input.placeholder = c.ph;
          input.value = draft.contact;
          say($('pfSupMsg'), '');
        }
        else if (a === 'again') { sent = false; paintSupport(); }
      }

      function onInput(e) {
        const el = e.target;
        if (el.id === 'pfNick') {
          const v = cleanNick(el.value);
          const user = fire().user();
          $('pfPreview').textContent = boardName(v || 'Student');
          $('pfNickSave').disabled = working || !v || (!!user && v === nameOf(user));
          say($('pfNickMsg'), '');
        } else if (el.id === 'pfText') {
          draft.text = el.value;
          $('pfCount').textContent = el.value.length;
        } else if (el.id === 'pfContact') draft.contact = el.value;
      }

      function onChange(e) {
        if (e.target.id !== 'pfFile') return;
        const file = e.target.files && e.target.files[0];
        e.target.value = '';
        if (!file) return;
        say($('pfAvMsg'), 'Processing image…', true);
        compressImage(file).then(function (data) {
          if (alive && tab === 'profile') chooseAvatar(data);
        }).catch(function (err) {
          if (alive) say($('pfAvMsg'), err.message);
        });
      }

      function onSubmit(e) {
        e.preventDefault();
        if (e.target.id === 'pfNickForm') submitNick();
        else if (e.target.id === 'pfSupport') submitSupport();
      }

      function submitNick() {
        if (working) return;
        const input = $('pfNick'), btn = $('pfNickSave'), msg = $('pfNickMsg');
        const nick = cleanNick(input.value);
        const bad = nickError(nick);
        if (bad) { say(msg, bad); input.focus(); return; }
        if (!navigator.onLine) { say(msg, 'You are offline. Connect to the internet first.'); return; }
        working = true;
        say(msg, '');
        busy(btn, true, 'Saving…');
        saveNickname(nick).then(function (boardOk) {
          working = false;
          if (!alive || tab !== 'profile') return;
          busy(btn, false);
          btn.disabled = true;
          input.value = nick;
          $('pfHeroName').textContent = nick;
          $('pfPreview').textContent = boardName(nick);
          say(msg, boardOk ? 'Nickname saved.' : 'Nickname saved. The leaderboard will update with your next points.', true);
        }).catch(function (err) {
          console.error('[profile] nickname', err);
          working = false;
          if (!alive || tab !== 'profile') return;
          busy(btn, false);
          say(msg, 'Could not save the nickname. Check your connection and try again.');
        });
      }

      function submitSupport() {
        const btn = $('pfSend'), msg = $('pfSupMsg');
        if (btn.disabled) return;
        const text = draft.text.trim(), contact = draft.contact.trim();
        if (text.length < 10) { say(msg, 'Please describe it in at least 10 characters.'); $('pfText').focus(); return; }
        if (!validContact(draft.type, contact)) { say(msg, CONTACTS[draft.type].err); $('pfContact').focus(); return; }
        if ($('pfWebsite').value) { sent = true; paintSupport(); return; }   // бот
        let last = 0;
        try { last = +localStorage.getItem(COOLDOWN_KEY) || 0; } catch (err) {}
        const wait = Math.ceil((COOLDOWN_MS - (Date.now() - last)) / 1000);
        if (wait > 0) { say(msg, 'Please wait ' + wait + ' seconds before sending another request.'); return; }
        if (!navigator.onLine) { say(msg, 'You are offline. Connect to the internet first.'); return; }

        const u = fire() && fire().user ? fire().user() : null;
        say(msg, '');
        busy(btn, true, 'Sending…');
        submitTicket({
          text: text.slice(0, 2000),
          contact: contact,
          contactType: draft.type,
          uid: null,
          nick: (u ? nameOf(u) : 'Guest').slice(0, 80),
          createdAt: Date.now(),
          status: 'open'
        }).then(function () {
          try { localStorage.setItem(COOLDOWN_KEY, String(Date.now())); } catch (err) {}
          draft.text = '';
          Shell.toast('Request sent');
          if (!alive) return;
          sent = true;
          if (tab === 'support') paintSupport();
        }).catch(function () {
          if (!alive || tab !== 'support') return;
          busy($('pfSend'), false);
          say($('pfSupMsg'), 'Your request could not be sent. Your text is still here, so please try again.');
        });
      }

      root.addEventListener('click', onClick);
      root.addEventListener('input', onInput);
      root.addEventListener('change', onChange);
      root.addEventListener('submit', onSubmit);

      const onAccount = function () { if (alive && !working && tab === 'profile') paintProfile(); };
      window.addEventListener('sp:auth', onAccount);
      window.addEventListener('sp:avatar', onAccount);

      paint();

      return function () {
        alive = false;
        closeModal();                      // во время удаления окно заблокировано и остаётся
        root.removeEventListener('click', onClick);
        root.removeEventListener('input', onInput);
        root.removeEventListener('change', onChange);
        root.removeEventListener('submit', onSubmit);
        window.removeEventListener('sp:auth', onAccount);
        window.removeEventListener('sp:avatar', onAccount);
      };
    }
  });

  // Сообщение после перезагрузки (выход / удаление аккаунта)
  function showFlash() {
    let m = null;
    try { m = sessionStorage.getItem(FLASH_KEY); sessionStorage.removeItem(FLASH_KEY); } catch (e) {}
    if (m) sleep(300).then(function () { Shell.toast(m); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', showFlash);
  else showFlash();
})();
