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

 /* ===== PRACTICE TESTS ===== */
var PT_N=6;
var PT_RW=[[3,4],[4,2],[5,1],[0,2],[1,2],[2,3],[6,4],[7,2],[8,4],[9,3]]; /* [тема,кол-во] = 27, порядок как в SAT */
var PT_MD=[[[0,1,2,3,4],7],[[5,6,7,8],7],[[9,10,11,12,13,14,15],4],[[16,17,18,19],4]]; /* = 22 */
function ptLoad(){try{return JSON.parse(spGet('satpath_pt'))||{}}catch(e){return{}}}
function ptSave(s){try{spSet('satpath_pt',JSON.stringify(s))}catch(e){}}
function ptSeed(s){return function(){s|=0;s=s+0x6D2B79F5|0;var t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function ptWithSeed(seed,fn){var o=Math.random;Math.random=ptSeed(seed);try{return fn()}finally{Math.random=o}}
function ptRight(q,v){return v!=null&&v!==''&&(q.isGrid?same(v,q.ans):String(v)===q.ans)}
function ptFmt(s){s=Math.max(0,s);return Math.floor(s/60)+':'+('0'+s%60).slice(-2)}
function ptScore(sec,a,b,hard){var tot=sec==='r'?54:44,sc=sec==='r'?50:40,c=Math.round((a+b)*sc/tot),s=scaleSectionScore(c,sc,hard);if(!hard)s=Math.min(s,sec==='r'?600:590);return s}
function ptMathPlan(t,m){var p=[];PT_MD.forEach(function(d,k){var L=d[0],o=(t*3+m*2+k)%L.length;for(var j=0;j<d[1];j++)p.push(L[(o+j)%L.length])});return p}

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
}
function lookupWordDef(rawWord, contextText) {
  var clean = String(rawWord || '').toLowerCase().replace(/[^a-z'-]/g, '');
  if (!clean) return null;
  if (SAT_VOCAB_DICT[clean]) return SAT_VOCAB_DICT[clean];
  // Check stem match
  for (var k in SAT_VOCAB_DICT) {
    if (clean.indexOf(k.slice(0, 6)) === 0 || k.indexOf(clean.slice(0, 6)) === 0) {
      return SAT_VOCAB_DICT[k];
    }
  }
  // Smart morphological & context-aware fallback for any English word in SAT passages
  var clue = "Academic SAT term used in the passage context.";
  if (clean.endsWith('tion') || clean.endsWith('sion')) clue = "Noun denoting a process, state, or action in academic analysis.";
  else if (clean.endsWith('ous') || clean.endsWith('ive') || clean.endsWith('al') || clean.endsWith('ic')) clue = "Adjective describing a key property or characteristic in the passage.";
  else if (clean.endsWith('ly')) clue = "Adverb modifying the degree or manner of an action in the text.";
  else if (clean.endsWith('ate') || clean.endsWith('ize') || clean.endsWith('ify')) clue = "Verb expressing a transformation, action, or causal effect.";
  return {
    d: clue + (contextText ? (' Context: "' + contextText.slice(0, 90) + '..."') : ''),
    ru: "Академический термин SAT (выделено в словарь для повторения)"
  };
}

function wrapWordsForVocab(htmlStr) {
  var saved = getVocabList().map(function(x) { return x.w.toLowerCase(); });
  // Split by HTML tags so we only wrap words >= 4 chars inside text nodes
  return String(htmlStr).split(/(<[^>]+>)/g).map(function(part, idx) {
    if (idx % 2 === 1) return part;
    return part.replace(/\b([A-Za-z]{4,})\b/g, function(m, w) {
      var isHl = saved.indexOf(w.toLowerCase()) >= 0;
      return '<span class="rw-word' + (isHl ? ' hl' : '') + '" data-word="' + w + '">' + w + '</span>';
    });
  }).join('');
}

function openVocabDrawer() {
  var ov = document.createElement('div');
  ov.style.cssText = 'position:fixed;inset:0;z-index:130;background:rgba(6,21,23,0.75);backdrop-filter:blur(4px);display:grid;place-items:center;padding:20px;overflow:auto';
  function render() {
    var list = getVocabList();
    var rows = list.length ? list.map(function(item, idx) {
      return '<div class="card" style="padding:14px 16px;border-radius:18px;display:flex;justify-content:space-between;align-items:flex-start;gap:12px">' +
        '<div><div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap"><b style="font-size:16px;color:var(--sand)">' + lbEsc(item.w) + '</b><span class="tag" style="margin:0;font-size:10px">' + lbEsc(item.ru || 'SAT Term') + '</span></div>' +
        '<div style="font-size:13px;color:var(--tx);margin-top:4px;line-height:1.45">' + lbEsc(item.d) + '</div>' +
        (item.ctx ? '<div style="font-size:11.5px;color:var(--mut);margin-top:4px;font-style:italic">"' + lbEsc(item.ctx) + '"</div>' : '') +
        '</div>' +
        '<button class="tbtn" data-del-voc="' + idx + '" title="Remove word" style="flex:none;width:30px;height:30px;font-size:12px">✕</button></div>';
    }).join('') : '<div style="text-align:center;padding:30px 10px;color:var(--mut)">No words saved yet! Click or highlight any unfamiliar word during a Mock Exam or R&amp;W passage to save it here.</div>';

    ov.innerHTML = '<div class="qb" style="max-width:600px;width:100%;border-radius:26px;border:2px solid var(--sand-line);max-height:85vh;overflow-y:auto">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:12px;border-bottom:1.5px dashed var(--line);margin-bottom:14px">' +
      '<div><small style="color:var(--sand);font-weight:800;letter-spacing:.08em;text-transform:uppercase">PERSONAL LEXICON</small><h2 style="font-size:22px;font-weight:800">Saved SAT Vocabulary (' + list.length + ')</h2></div>' +
      '<button class="tbtn" id="vocClose">✕</button></div>' +
      '<div style="display:grid;gap:10px">' + rows + '</div>' +
      (list.length ? '<div style="margin-top:16px;text-align:right"><button class="chip" id="vocClearAll" style="color:#e74c3c;border-color:#e74c3c">Clear All Words</button></div>' : '') +
      '</div>';
    ov.querySelector('#vocClose').onclick = function() { ov.remove(); };
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

function ptBuild(t,sec,m,lvl,used){
 return ptWithSeed(t*1000+(sec==='m'?100:200)+m*10+(lvl==='hard'?2:lvl==='easy'?1:0),function(){
  var out=[];
  if(sec==='m'){var cnt={};
   ptMathPlan(t,m).forEach(function(ti,k){
    var c=cnt[ti]=(cnt[ti]||0)+1,q=null,base=t*19+m*11+c*13+k*7,
     tier=lvl==='mix'?(k%2===0?'hard':'medium'):lvl==='hard'?'hard':(k%3?'easy':'medium');
    for(var a=0;a<10&&!q;a++){try{var x=getMathQ(ti,tier,base+a*17);if(x&&x.q)q=x}catch(e){}}
    if(q){q.top=TOPS[ti];out.push(q)}});
  }else{
   PT_RW.forEach(function(x){var ti=x[0],L=RQ[ti].length,th=Math.ceil(L/3),
    lo=lvl==='hard'?th:0,hi=lvl==='easy'?2*th:L,ids=[],u=used[ti]||(used[ti]={});
    for(var i=0;i<L;i++)ids.push(i);
    var cand=shuffle(ids.filter(function(i){return i>=lo&&i<hi&&!u[i]}));
    if(cand.length<x[1])cand=cand.concat(shuffle(ids.filter(function(i){return!u[i]&&cand.indexOf(i)<0})));
    cand.slice(0,x[1]).forEach(function(i){u[i]=1;var r=RQ[ti][i];
     out.push({q:r[0],ans:r[1],opts:shuffle(r.slice(1)),isGrid:false,rw:true,top:RTOPS[ti]})})});
  }
  return out})}

function ptInfo(html,btn,cb){var ov=document.createElement('div');
 ov.style.cssText='position:fixed;inset:0;z-index:90;background:var(--bg);overflow:auto;padding:24px;display:grid;place-items:center';
 ov.innerHTML='<div class="qb" style="text-align:center;border-radius:26px;border:2px solid var(--line);box-shadow:0 16px 40px rgba(0,0,0,0.25)">'+html+'<button class="cta-amber" id="pi" style="margin-top:18px">'+btn+'</button></div>';
 document.body.appendChild(ov);ov.querySelector('#pi').onclick=function(){ov.remove();cb()}}

function ptModule(cfg,done){
 var qs=cfg.qs,ans=[],flag=[],cur=0,left=cfg.min*60,ended=false,calc=null,tmr,popEl=null,
 ov=document.createElement('div');
 ov.style.cssText='position:fixed;inset:0;z-index:90;background:var(--bg);overflow:auto;padding:16px';
 ov.innerHTML='<div id="ptShell" class="pt-shell"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;background:var(--panel);padding:12px 18px;border-radius:18px;border:1.5px solid var(--line)">'
  +'<div><b style="font-size:15px">'+cfg.title+'</b><small style="display:block;color:var(--mut);font-size:11px">Click any word in the passage to highlight &amp; save to your Vocabulary</small></div>'
  +'<b id="ptT" style="font-size:18px;font-variant-numeric:tabular-nums;color:var(--sand);background:var(--sand-bg);padding:4px 12px;border-radius:99px;border:1px solid var(--sand-line)"></b>'
  +'<div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">'
  +'<button id="ptVocBtn" class="chip" style="padding:6px 12px;text-transform:none;font-weight:700;color:var(--sand);border-color:var(--sand-line)">📖 Vocab (<span id="ptVocCnt">' + getVocabList().length + '</span>)</button>'
  +(cfg.calc?'<button id="ptCB" style="background:var(--acc2);color:#fff;padding:6px 14px;border-radius:99px;font-weight:700;font-size:12px"><img class="ui-ic" src="math.png" alt=""> Calculator (50/50)</button>':'')
  +'<button id="ptEnd" class="chip" style="padding:6px 12px;text-transform:none;font-weight:700">Review / Submit</button>'
  +'<button id="ptEx" class="chip" style="padding:6px 12px;text-transform:none">Exit</button></div></div>'
  +'<div class="pt-split-body"><div class="qb" style="max-width:none;border-radius:24px"><div id="ptQ"></div><div id="ptG" hidden></div><div style="display:flex;justify-content:space-between;margin-top:20px;padding-top:14px;border-top:1px solid var(--line)"><button class="cta" id="ptP" style="border-radius:14px">← Back</button><button class="cta-amber" id="ptN" style="border-radius:14px">Next →</button></div></div>'
  +'<div id="ptCP" style="display:none;border:2px solid var(--line);border-radius:24px;overflow:hidden;background:#fff"></div></div></div>';
 document.body.appendChild(ov);
 var $=function(i){return ov.querySelector('#'+i)},Q=$('ptQ'),G=$('ptG');
 function closePop(){if(popEl){popEl.remove();popEl=null}}
 function stop(){closePop();ended=true;clearInterval(tmr);ov.remove()}
 function fin(){var un=0;qs.forEach(function(q,i){if(ans[i]==null||ans[i]==='')un++});
  spModalConfirm(un?'You have <b>'+un+' unanswered question(s)</b>. Submit this module now?':'Submit this module and proceed to the next stage?', function(){submit()})}
 function submit(){if(ended)return;stop();var ok=0;qs.forEach(function(q,i){if(ptRight(q,ans[i]))ok++});done({ok:ok,n:qs.length,qs:qs,ans:ans})}
 tmr=setInterval(function(){left--;$('ptT').textContent=ptFmt(left);if(left<=0){toast('Time is up for this module!');submit()}},1000);
 $('ptT').textContent=ptFmt(left);
 $('ptVocBtn').onclick=function(){openVocabDrawer()};

 function showWordPopover(wordEl, rawWord) {
  closePop();
  var clean = rawWord.replace(/[^a-zA-Z'-]/g, '');
  if (!clean) return;
  var plainCtx = Q.textContent.replace(/\s+/g, ' ').trim().slice(0, 110);
  var info = lookupWordDef(clean, plainCtx);
  var list = getVocabList();
  var isSaved = list.some(function(x){return x.w.toLowerCase()===clean.toLowerCase()});
  popEl = document.createElement('div');
  popEl.className = 'vocab-pop';
  var rect = wordEl.getBoundingClientRect();
  var topPos = Math.min(window.innerHeight - 170, Math.max(12, rect.bottom + 8));
  var leftPos = Math.min(window.innerWidth - 320, Math.max(12, rect.left));
  popEl.style.top = topPos + 'px';
  popEl.style.left = leftPos + 'px';
  popEl.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:6px">'
   + '<b style="font-size:16px;color:var(--sand)">' + lbEsc(clean) + '</b>'
   + '<button id="vpClose" style="font-size:12px;opacity:.6">✕</button></div>'
   + '<div style="font-size:11.5px;font-weight:700;color:var(--acc);margin-bottom:4px">' + lbEsc(info.ru) + '</div>'
   + '<div style="font-size:12.5px;color:var(--tx);line-height:1.45;margin-bottom:10px">' + lbEsc(info.d) + '</div>'
   + '<button class="cta-amber" id="vpSave" style="width:100%;padding:7px 12px;font-size:12px;border-radius:10px">' + (isSaved ? '✓ Saved in Vocab (Remove)' : '★ Highlight &amp; Save Word') + '</button>';
  document.body.appendChild(popEl);
  popEl.querySelector('#vpClose').onclick = closePop;
  popEl.querySelector('#vpSave').onclick = function() {
    var curList = getVocabList();
    var idx = curList.findIndex(function(x){return x.w.toLowerCase()===clean.toLowerCase()});
    if (idx >= 0) {
      curList.splice(idx, 1);
      wordEl.classList.remove('hl');
      toast('Removed "' + clean + '" from Saved Vocab');
    } else {
      curList.unshift({ w: clean, d: info.d, ru: info.ru, ctx: plainCtx });
      wordEl.classList.add('hl');
      toast('★ Saved "' + clean + '" to your Vocab list!');
    }
    saveVocabList(curList);
    var cntEl = $('ptVocCnt');
    if (cntEl) cntEl.textContent = curList.length;
    closePop();
  };
 }

 Q.addEventListener('click', function(e) {
  var wEl = e.target.closest('.rw-word');
  if (wEl) {
    e.stopPropagation();
    showWordPopover(wEl, wEl.dataset.word || wEl.textContent);
  } else {
    closePop();
  }
 });

 function map(){closePop();var h='<b>Question Map · ' + cfg.title + '</b><div style="display:flex;flex-wrap:wrap;gap:8px;margin:14px 0">';
  qs.forEach(function(q,i){var a=ans[i]!=null&&ans[i]!=='';
   h+='<button data-i="'+i+'" style="width:46px;height:42px;border-radius:10px;text-align:center;font-weight:700;border:2px solid '+(a?'var(--acc)':'var(--line)')+';background:'+(a?'rgba(34,163,129,.25)':'transparent')+'">'+(i+1)+(flag[i]?'🚩':'')+'</button>'});
  G.innerHTML=h+'</div><small style="color:var(--mut)">Filled = answered · 🚩 = flagged</small><div style="margin-top:14px"><button class="cta-amber" id="ptS">Submit Module →</button></div>';
  Q.hidden=true;G.hidden=false}
 G.onclick=function(e){var b=e.target.closest('[data-i]');if(b){cur=+b.dataset.i;draw()}if(e.target.id==='ptS')fin()};
 function draw(){closePop();G.hidden=true;Q.hidden=false;
  var q=qs[cur],fx=function(s){return q.rw?wrapWordsForVocab(s):rHTML(s)},
  h='<div style="display:flex;justify-content:space-between;align-items:center"><small style="color:var(--mut);font-weight:700">Question '+(cur+1)+' of '+qs.length+' · <span style="color:var(--acc)">'+(q.top||'')+'</span></small><button id="ptF" class="chip" style="font-size:12px;text-transform:none">'+(flag[cur]?'🚩 Flagged':'⚑ Flag for review')+'</button></div><div style="font-size:'+(q.rw?17:19)+'px;line-height:1.6;margin:18px 0">'+fx(q.q)+'</div>';
  if(q.isGrid)h+='<input id="ptI" class="qin" placeholder="Enter your answer" autocomplete="off" value="'+(ans[cur]!=null?String(ans[cur]).replace(/"/g,'&quot;'):'')+'">';
  else q.opts.forEach(function(o,k){h+='<button class="qo" data-k="'+k+'"'+(ans[cur]===o?' style="border-color:var(--acc);background:rgba(34,163,129,.2)"':'')+'><b>'+'ABCD'[k]+'</b>&nbsp; '+(q.rw?String(o):rHTML(o))+'</button>'});
  Q.innerHTML=h;
  Q.querySelectorAll('.qo').forEach(function(b){b.onclick=function(){ans[cur]=q.opts[+b.dataset.k];
   Q.querySelectorAll('.qo').forEach(function(x){x.style.cssText=x===b?'border-color:var(--acc);background:rgba(34,163,129,.2)':''})}});
  var inp=$('ptI');if(inp)inp.oninput=function(){ans[cur]=inp.value.trim()};
  $('ptF').onclick=function(){flag[cur]=!flag[cur];this.textContent=flag[cur]?'🚩 Flagged':'⚑ Flag for review'};
  $('ptP').style.opacity=cur?1:.35;$('ptN').textContent=cur<qs.length-1?'Next →':'Review →'}
 $('ptP').onclick=function(){if(cur>0){cur--;draw()}};
 $('ptN').onclick=function(){if(cur<qs.length-1){cur++;draw()}else map()};
 $('ptEnd').onclick=map;
 $('ptEx').onclick=function(){spModalConfirm('Exit this mock exam? Progress in the current module will be lost.', function(){stop();done(null)})};
 var cb=$('ptCB'),shell=$('ptShell');if(cb)cb.onclick=function(){var p=$('ptCP');
  if(!shell.classList.contains('calc-open')){shell.classList.add('calc-open');p.style.display='block';cb.style.background='#e74c3c';cb.textContent='✕ Close Calculator';
   if(!calc&&window.Desmos)calc=Desmos.GraphingCalculator(p,{keypad:true,expressions:true,settingsMenu:false,folders:false,images:false});
   if(calc)setTimeout(function(){calc.resize()},35)}
  else{shell.classList.remove('calc-open');p.style.display='none';cb.style.background='var(--acc2)';cb.innerHTML=IC_MATH_HTML+' Calculator (50/50)'}};
 draw()}

function ptStart(t,secs){
 var res={},used={},si=0;
 function section(){
  if(si>=secs.length)return ptResult(t,res);
  var sec=secs[si++],isR=sec==='r',name=isR?'Reading and Writing':'Math',nq=isR?27:22,mins=isR?32:35;
  ptInfo('<div style="font-size:11px;font-weight:800;color:var(--sand);letter-spacing:.1em;text-transform:uppercase;margin-bottom:6px">DIGITAL SAT ADAPTIVE MODULE</div><h2 style="font-size:24px;font-weight:800">'+name+' · Module 1</h2><p style="margin:10px 0;font-weight:600;color:var(--acc)">'+nq+' Questions · '+mins+' Minutes</p><p class="sub">'+(isR?'Tip: Click any unfamiliar word in a passage to highlight it, see its definition, and save it to your Vocabulary list!':'A Desmos graphing calculator is built in. Includes multi-step geometry, data tables, and coordinate graphs.')+'</p>','Start Module 1 →',function(){
   ptModule({title:name+' · Module 1',qs:ptBuild(t,sec,1,'mix',used),min:mins,calc:!isR},function(o1){
    if(!o1)return buildPT();
    var hard=o1.ok>=(isR?18:15);
    ptInfo('<div style="font-size:11px;font-weight:800;color:var(--acc);letter-spacing:.1em;text-transform:uppercase;margin-bottom:6px">MODULE 1 COMPLETE ('+o1.ok+'/'+o1.n+' CORRECT)</div><h2 style="font-size:24px;font-weight:800">'+name+' · Module 2 ('+(hard?'Adaptive Harder Track':'Standard Track')+')</h2><p style="margin:10px 0" class="sub">Your Module 2 difficulty has been calibrated based on your Module 1 accuracy.</p>','Start Module 2 →',function(){
     ptModule({title:name+' · Module 2',qs:ptBuild(t,sec,2,hard?'hard':'easy',used),min:mins,calc:!isR},function(o2){
      if(!o2)return buildPT();
      res[sec]={o1:o1,o2:o2,hard:hard,score:ptScore(sec,o1.ok,o2.ok,hard)};
      if(si<secs.length)ptInfo('<h2>Reading &amp; Writing Complete!</h2><p style="margin:10px 0" class="sub">Take a breather before embarking on the Math section (2 modules, 44 questions total).</p>','Continue to Math →',section);
      else section()})})})})}
 section()}

/* ===== SATPATH ECONOMY: PATHCOIN, ENERGY & SUPPLY SHOP (BALANCED 1-2 MONTH PROGRESSION) ===== */
var ECON_KEY = 'satpath_econ_v2';
var ENERGY_REGEN_MS = 3 * 3600 * 1000; // +1 Energy every 3 hours
var IC_MAP_HTML    = '<img class="ui-ic" src="map.png" alt="">';
var IC_COMPAS_HTML = '<img class="ui-ic" src="compas.png" alt="">';
var IC_COIN_HTML   = '<img class="ui-ic" src="logo.png" alt="">';
var IC_CAMP_HTML   = '<img class="ui-ic" src="camp.png" alt="">';
var IC_ENERGY_HTML = '<img class="ui-ic" src="energy.png" alt="">';
var IC_ART_HTML    = '<img class="ui-ic" src="art.png" alt="">';
var IC_ART_LG_HTML = '<img class="ui-ic-lg" src="art.png" alt="">';
var IC_LORD_HTML   = '<img class="ui-ic" src="lord.png" alt="">';
var IC_LORD_SM_HTML= '<img class="ui-ic-sm" src="lord.png" alt="">';
var IC_AIM_HTML    = '<img class="ui-ic" src="aim.png" alt="">';
var IC_BOOK_HTML   = '<img class="ui-ic" src="book.png" alt="">';
var IC_BOOK_SM_HTML= '<img class="ui-ic-sm" src="book.png" alt="">';
var IC_MATH_HTML   = '<img class="ui-ic" src="math.png" alt="">';

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

function addFreeEnergy(amount, reason) {
  return;
}

function spendEnergy(cost) {
  return true;
}

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

/* ===== EXPLORER PROFILE, AVATARS, SKINS & COSMETIC SHOP ===== */
var AVATAR_ITEMS = [
  { id: 'av_default', ico: '🧭', name: 'Archipelago Scout', cost: 0 },
  { id: 'av_fox',     ico: '🦊', name: 'Crimson Kitsune',   cost: 150 },
  { id: 'av_owl',     ico: '🦉', name: 'Athena Owl',        cost: 200 },
  { id: 'av_dragon',  ico: '🐉', name: 'Jade Dragon',       cost: 300 },
  { id: 'av_astro',   ico: '👩‍🚀', name: 'Star Navigator',    cost: 350 },
  { id: 'av_crown',   ico: '👑', name: 'Sovereign',         cost: 500 }
];
var SKIN_ITEMS = [
  { id: 'default',  name: 'Emerald Atoll (Default)', color: '#22a381', cost: 0 },
  { id: 'royal',    name: 'Royal Amber Gold',        color: '#d97706', cost: 250 },
  { id: 'cyber',    name: 'Oceanic Cyber Blue',      color: '#0ea5e9', cost: 300 },
  { id: 'crimson',  name: 'Volcanic Coral Rose',     color: '#e11d48', cost: 350 },
  { id: 'amethyst', name: 'Obsidian Amethyst',       color: '#8b5cf6', cost: 400 }
];
var TITLE_ITEMS = [
  { id: 't_scout',   name: 'Island Scout',       cost: 0 },
  { id: 't_scholar', name: '1600 Scholar',       cost: 200 },
  { id: 't_blitz',   name: 'Blitz Grandmaster',  cost: 300 },
  { id: 't_lord',    name: 'Archipelago Lord',   cost: 450 }
];

function getProfile() {
  try {
    var p = JSON.parse(spGet('satpath_profile_v1')) || {};
    var defName = (typeof FBU !== 'undefined' && FBU && (FBU.displayName || FBU.email)) ? (FBU.displayName || FBU.email.split('@')[0]) : '';
    return {
      name: p.name || defName || 'Explorer',
      avatar: p.avatar || '🧭',
      skin: p.skin || 'default',
      title: p.title || 'Island Scout',
      unlocked: p.unlocked || ['av_default', 'default', 't_scout']
    };
  } catch (e) {
    return { name: 'Explorer', avatar: '🧭', skin: 'default', title: 'Island Scout', unlocked: ['av_default', 'default', 't_scout'] };
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
  if (dTitle) dTitle.textContent = (p.title || 'Island Scout') + ' ✎';
  var sName = document.getElementById('sideName');
  if (sName) sName.textContent = displayName;
  var sTitle = document.getElementById('sideTitle');
  if (sTitle) sTitle.textContent = (p.title || 'Island Scout') + ' · Edit ✎';
  var sAv = document.getElementById('sideAv');
  if (sAv) {
    if (u && u.photoURL && p.avatar === 'google') {
      sAv.textContent = '';
      sAv.style.background = 'url(' + encodeURI(u.photoURL) + ') center/cover';
    } else {
      sAv.style.background = 'var(--acc2)';
      sAv.textContent = p.avatar || displayName[0] || 'E';
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
      '<label style="font-size:12px;font-weight:800;color:var(--mut);text-transform:uppercase;display:block;margin-bottom:8px">Choose Avatar</label>' +
      '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">' +
      AVATAR_ITEMS.map(function(item) {
        var unl = p.unlocked.indexOf(item.id) >= 0 || item.cost === 0;
        var act = p.avatar === item.ico;
        return '<button class="card" data-av="' + item.id + '" style="padding:10px;border-radius:16px;text-align:center;border-color:' + (act ? 'var(--sand)' : 'var(--line)') + ';background:' + (act ? 'var(--sand-bg)' : 'var(--panel2)') + '">' +
          '<div style="font-size:26px">' + item.ico + '</div>' +
          '<b style="font-size:12px;display:block;margin-top:4px">' + item.name + '</b>' +
          '<small style="font-size:11px;color:' + (act ? 'var(--sand)' : 'var(--mut)') + ';font-weight:700">' + (act ? 'Equipped ✓' : (unl ? 'Equip' : '🔒 ' + item.cost + ' PC')) + '</small></button>';
      }).join('') + '</div></div>' +
      '<div style="margin:16px 0">' +
      '<label style="font-size:12px;font-weight:800;color:var(--mut);text-transform:uppercase;display:block;margin-bottom:8px">App Theme Skin</label>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">' +
      SKIN_ITEMS.map(function(sk) {
        var unl = p.unlocked.indexOf(sk.id) >= 0 || sk.cost === 0;
        var act = p.skin === sk.id;
        return '<button class="card" data-sk="' + sk.id + '" style="padding:10px 12px;border-radius:14px;display:flex;align-items:center;gap:10px;border-color:' + (act ? 'var(--sand)' : 'var(--line)') + '">' +
          '<span style="width:20px;height:20px;border-radius:50%;background:' + sk.color + ';flex:none;border:2px solid #fff"></span>' +
          '<div style="flex:1;min-width:0"><b style="font-size:12px;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + sk.name + '</b>' +
          '<small style="font-size:11px;color:' + (act ? 'var(--sand)' : 'var(--mut)') + ';font-weight:700">' + (act ? 'Active ✓' : (unl ? 'Apply' : '🔒 ' + sk.cost + ' PC')) + '</small></div></button>';
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
        toast('✓ Profile name updated to ' + val + '!');
        render();
      }
    };
    ov.querySelectorAll('[data-av]').forEach(function(b) {
      b.onclick = function() {
        var item = AVATAR_ITEMS.find(function(x){return x.id===b.dataset.av});
        if (!item) return;
        if (p.unlocked.indexOf(item.id) < 0 && item.cost > 0) {
          var ec = getEcon();
          if (ec.coins < item.cost) return toast('Not enough Pathcoins (' + item.cost + ' PC needed)!');
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
          if (ec.coins < item.cost) return toast('Not enough Pathcoins (' + item.cost + ' PC needed)!');
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
          if (ec.coins < item.cost) return toast('Not enough Pathcoins (' + item.cost + ' PC needed)!');
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

var shopTab = 'gear'; // 'gear' | 'cosmetics'
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
        '<div style="display:flex;align-items:center;gap:10px"><span style="font-size:28px">' + p.avatar + '</span><div><b style="font-size:14px">' + lbEsc(p.name) + '</b><small style="display:block;color:var(--sand);font-weight:700">' + lbEsc(p.title) + '</small></div></div>' +
        '<button class="cta" id="shEditProfBtn" style="padding:8px 14px;font-size:12px;border-radius:12px">✎ Edit Name &amp; Profile</button></div>' +
        '<div><b style="font-size:13px;color:var(--mut);text-transform:uppercase;display:block;margin-bottom:8px">Explorer Avatars</b><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">' +
        AVATAR_ITEMS.map(function(item) {
          var unl = p.unlocked.indexOf(item.id) >= 0 || item.cost === 0;
          var act = p.avatar === item.ico;
          return '<button class="card" data-cos-av="' + item.id + '" style="padding:10px;border-radius:16px;text-align:center;border-color:' + (act ? 'var(--sand)' : 'var(--line)') + '">' +
            '<div style="font-size:26px">' + item.ico + '</div><b style="font-size:12px;display:block;margin-top:3px">' + item.name + '</b>' +
            '<small style="color:' + (act ? 'var(--sand)' : 'var(--acc)') + ';font-weight:800;font-size:11px">' + (act ? 'Equipped ✓' : (unl ? 'Equip' : item.cost + ' PC')) + '</small></button>';
        }).join('') + '</div></div>' +
        '<div><b style="font-size:13px;color:var(--mut);text-transform:uppercase;display:block;margin-bottom:8px">App Theme Skins</b><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">' +
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
      '<button class="island-pill sand' + (shopTab === 'cosmetics' ? ' on' : '') + '" data-shtab="cosmetics">🎨 Skins, Avatars &amp; Titles</button>' +
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
          if (cur.coins < item.cost) return toast('Not enough Pathcoins (' + item.cost + ' PC)!');
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
          if (cur.coins < item.cost) return toast('Not enough Pathcoins (' + item.cost + ' PC)!');
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
          if (cur.coins < item.cost) return toast('Not enough Pathcoins (' + item.cost + ' PC)!');
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
          if (st.dailyRationDate === todayStr) return toast('Already claimed today!');
          st.dailyRationDate = todayStr;
          st.coins += 25;
          saveEcon(st); renderShop(); confetti(); toast(IC_COIN_HTML + ' +25 Free Daily Pathcoins claimed!');
        } else if (k === 'compass' && !st.compass) {
          if (st.coins < 900) return toast('Not enough Pathcoins (need 900 PC)!');
          st.coins -= 900; st.compass = true;
          saveEcon(st); renderShop(); confetti(); toast(IC_COMPAS_HTML + ' Amber Compass 1.5× PC boost activated!');
        } else if (k === 'crest' && !st.crest) {
          if (st.coins < 1800) return toast('Not enough Pathcoins (need 1,800 PC)!');
          st.coins -= 1800; st.crest = true;
          saveEcon(st); renderShop(); confetti(); toast(IC_LORD_HTML + ' Navigator&apos;s Golden Crest unlocked!');
        }
      };
    });
  }
  document.body.appendChild(ov);
  ov.addEventListener('click', function(ev) { if (ev.target === ov) ov.remove(); });
  renderShop();
}

/* ===== MOCK EXAMS CATALOG (Roman Numerals I - VI & Island Routes) ===== */
var MOCK_EXPEDITIONS = [
  { t: 1, roman: 'I',   code: 'Mock 01 · Coral Reef',      sub: 'Shallow Atoll Expedition · Adaptive', reward: 120, accent: '#22a381' },
  { t: 2, roman: 'II',  code: 'Mock 02 · Emerald Atoll',   sub: 'Lagoon Current Expedition · Adaptive', reward: 120, accent: '#1f9d8a' },
  { t: 3, roman: 'III', code: 'Mock 03 · Amber Lagoon',    sub: 'Sunlit Shoals Expedition · Adaptive',  reward: 120, accent: '#e59a16' },
  { t: 4, roman: 'IV',  code: 'Mock 04 · Basalt Ridge',    sub: 'Volcanic Cliffs Expedition · Adaptive', reward: 150, accent: '#2b7f9c' },
  { t: 5, roman: 'V',   code: 'Mock 05 · Sunken Caldera',  sub: 'Deep Trench Expedition · Adaptive',    reward: 150, accent: '#2fa59f' },
  { t: 6, roman: 'VI',  code: 'Mock 06 · Obsidian Peak',   sub: 'Summit Spire Expedition · Adaptive',   reward: 180, accent: '#3f8f7a' }
];
var ptRouteFilter = 'rm'; // 'rm' (Full) | 'r' (R&W only) | 'm' (Math only)

function ptResult(t,res){
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

 var circum = 2 * Math.PI * 86; // r = 86 -> 540.35
 var targetOffset = Math.round(circum * (1 - pctVal));

 var ov=document.createElement('div');
 ov.style.cssText='position:fixed;inset:0;z-index:95;background:var(--bg);overflow:auto;padding:28px 20px';
 var h='<div style="max-width:860px;margin:0 auto;animation:up .45s ease">' +
  '<div class="atlas-hero" style="text-align:center;display:flex;flex-direction:column;align-items:center;gap:16px;padding:32px 24px;border:2px solid var(--sand-line)">' +
  '<div style="display:inline-flex;align-items:center;gap:8px;background:var(--sand-bg);border:1px solid var(--sand-line);color:var(--sand);padding:5px 14px;border-radius:99px;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase">🏆 OFFICIAL MOCK EXAM SCORE REPORT</div>' +
  '<h1 style="font-size:32px;font-weight:800;margin:0">' + mockObj.code + '</h1>' +
  '<div class="score-ring-wrap">' +
  '<svg viewBox="0 0 200 200"><circle cx="100" cy="100" r="86" fill="none" stroke="var(--cell)" stroke-width="14"/><circle id="mockRingProg" cx="100" cy="100" r="86" fill="none" stroke="var(--sand)" stroke-width="14" stroke-linecap="round" stroke-dasharray="'+Math.round(circum)+'" stroke-dashoffset="'+Math.round(circum)+'" style="transition:stroke-dashoffset 1.3s cubic-bezier(.2,.8,.2,1)"/></svg>' +
  '<div class="score-ring-center"><small style="font-size:11px;font-weight:800;color:var(--mut);text-transform:uppercase;letter-spacing:.08em">' + (maxPossible===1600?'TOTAL SCORE':'SECTION SCORE') + '</small><div id="mockBigScoreNum" style="font-size:52px;font-weight:800;color:var(--tx);line-height:1.05;letter-spacing:-.03em">' + minPossible + '</div><small style="color:var(--sand);font-weight:800;font-size:12px">' + nationalPct + ' Percentile</small></div>' +
  '</div>' +
  '<div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center">' +
  '<span class="hud-pill coin" style="font-size:14px;padding:8px 16px">' + IC_COIN_HTML + ' ' + (earnedPc > 0 ? '+'+earnedPc+' Pathcoins Earned!' : 'Practice Complete') + '</span>' +
  '<button class="hud-pill" id="ptResVocBtn" style="font-size:13px;padding:8px 16px">📖 Review Saved Words (' + getVocabList().length + ')</button>' +
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

 // Animate score ring and number counter
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
  '<p class="sub">Navigate the 4-stage adaptive island trail with all 1,000+ SAT Math &amp; R&amp;W patterns. Click any word during an exam to highlight and save it to your Vocabulary.</p>' +
  '</div>' +
  '<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">' +
  '<button class="hud-pill coin" id="ptOpenVocabHero" style="padding:8px 14px;font-size:12.5px">📖 Saved Words (' + getVocabList().length + ')</button>' +
  '<div class="island-pills">' +
  '<button class="island-pill'+(ptRouteFilter==='rm'?' sand on':'')+'" data-ptmode="rm">' + IC_COMPAS_HTML + ' Full Route</button>' +
  '<button class="island-pill'+(ptRouteFilter==='r'?' sand on':'')+'" data-ptmode="r">' + IC_BOOK_HTML + ' R&amp;W Only</button>' +
  '<button class="island-pill'+(ptRouteFilter==='m'?' sand on':'')+'" data-ptmode="m">' + IC_MATH_HTML + ' Math Only</button>' +
  '</div></div>' +
  '</div>' +
  '<div class="mock-cards-grid">';

 MOCK_EXPEDITIONS.forEach(function(item){
  var t = item.t, r = S[t] || {};
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
   (ptRouteFilter==='rm' ? '<button class="mock-sub-btn" data-pt="'+t+'" data-s="r" title="Practice Reading & Writing modules only">R&amp;W only</button><button class="mock-sub-btn" data-pt="'+t+'" data-s="m" title="Practice Math modules only">Math only</button>' : '') +
   '<button class="cta-amber" style="padding:10px 16px;font-size:13px;border-radius:14px" data-pt="'+t+'" data-s="'+ptRouteFilter+'">'+mainBtnLbl+'</button>' +
   '</div></div></div>';
 });

 el.innerHTML = h + '</div>';
 el.onclick = function(e){
  if (e.target.closest('#ptOpenVocabHero')) { openVocabDrawer(); return; }
  var mBtn = e.target.closest('[data-ptmode]');
  if(mBtn){ ptRouteFilter = mBtn.dataset.ptmode; buildPT(); return; }
  var b = e.target.closest('[data-pt]');
  if(b) ptStart(+b.dataset.pt, b.dataset.s.split(''));
 };
}
var renderPtCatalog = buildPT;

function runQuiz(n, qs) {
  var doneList = n.rw ? getRDone() : getDone();
  var isFirstClear = doneList.indexOf(n.g) < 0;
  var entryCost = (n.ni === 4 ? 2 : 1);
  if (!spendEnergy(entryCost)) return;

  var clearRewards = [5, 15, 20, 25, 40];
  var firstReward = clearRewards[n.ni] || 20;
  var replayReward = Math.max(10, Math.round(firstReward * 0.5));

  var fx=function(s){return n.rw?String(s):rHTML(s)};var i = 0, ok = 0, earnedInQuiz = 0, ov = document.createElement('div');
  ov.style.cssText = 'position:fixed;inset:0;z-index:80;background:var(--bg);overflow:auto;padding:24px';
  document.body.appendChild(ov);

  function close() { ov.remove(); paintHud(); }
  function show() {
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
    var modeBadge = '<span class="tag n" style="margin:0;font-size:10px">+5 PC/ans · Bonus +' + (isFirstClear ? firstReward : replayReward) + ' PC</span>';
    var wasOpen = ov.dataset.calcOpen === '1' && !n.rw;
    ov.innerHTML = '<div id="qSplitWrap" class="quiz-split-wrap' + (wasOpen ? ' calc-open' : '') + '"><div class="qb" style="border-radius:26px"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap"><div style="display:flex;align-items:center;gap:8px"><small style="font-weight:800">' + n.type.l + ' · ' + (i + 1) + '/' + qs.length + '</small>' + modeBadge + '</div><div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">' + miniHudHtml() + '<button id="qcalc" style="background:' + (wasOpen ? '#e74c3c' : 'var(--acc2)') + ';color:#fff;padding:5px 12px;border-radius:10px;font-weight:bold;font-size:12px;">' + (wasOpen ? '✕ Close Calculator' : (IC_MATH_HTML + ' Calculator (50/50)')) + '</button><button id="qx" class="tbtn">✕</button></div></div><div class="bar" style="margin:12px 0"><div style="width:' + (i / qs.length * 100) + '%"></div></div><div style="font-size:20px;line-height:1.6;margin:18px 0">' + fx(q.q) + '</div><div id="qa"></div><div id="qf"></div></div><div id="q-panel" class="quiz-calc-pane"></div></div>';

    var a = document.getElementById('qa'), f = document.getElementById('qf'), done = false;
    document.getElementById('qx').onclick = close;
    var qSplitWrap = document.getElementById('qSplitWrap');
    var qPanel = document.getElementById('q-panel');
    var qCalcBtn = document.getElementById('qcalc');if(n.rw)qCalcBtn.style.display='none';
    var qCalculator = null;
    function mountQCalc() {
      if (!qCalculator && window.Desmos) {
        qCalculator = Desmos.GraphingCalculator(qPanel, { keypad: true, expressions: true, settingsMenu: false, folders: false, images: false });
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
        qCalcBtn.innerHTML = IC_MATH_HTML + ' Calculator (50/50)';
      }
    };
    function fin(v) {
      if (done) return; done = true;
      var good = (q.isGrid ? same(v, q.ans) : String(v) === q.ans);
      if (good) {
        ok++;
        earnedInQuiz += 5;
        addCoins(5);
      }
      lbAdd(good);
      a.querySelectorAll('button').forEach(function(b) {
        b.disabled = true;
        if (b.dataset.v === q.ans) b.classList.add('good');
        else if (b.dataset.v === String(v)) b.classList.add('bad');
      });

      var gi = document.getElementById('qi');
      if (gi) { gi.disabled = true; gi.style.borderColor = good ? 'var(--acc)' : '#e74c3c'; }

      f.innerHTML = '<p style="margin:14px 0;font-weight:700;color:' + (good ? 'var(--acc)' : '#e74c3c') + '">' + (good ? ('Correct! ✓ (+5 ' + IC_COIN_HTML + ')') : ('Incorrect. Answer: ' + fx(fmtAns(q.ans)))) + '</p><button class="cta-amber" id="qn">' + (i < qs.length - 1 ? 'Next Waypoint →' : 'Finish Island') + '</button>';
      document.getElementById('qn').onclick = function() { i++; show(); };
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
        b.innerHTML = '<b>' + 'ABCD'[k] + '</b>&nbsp; ' + fx(o);
        b.onclick = function() { fin(o) };
        a.appendChild(b);
      });
    }
  }
  show();
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
function build(){var h='<div class="mph"><div style="display:flex;justify-content:space-between;align-items:center"><b style="font-size:22px"><img class="ic" style="width:32px;height:32px;vertical-align:-7px" src="art.png" alt=""> Math Path</b><small id="mpc" style="color:var(--mut)"></small></div><div class="bar" style="margin:10px 0 0"><div id="mpb"></div></div></div>',g=0,ti=0;
 CUR.forEach(function(d){d[1].forEach(function(tn){var c=DOM[d[0]];
  h+='<div class="tp" style="background:'+c[0]+'"><small>'+d[0]+' · Topic '+(ti+1)+'/20</small><b>'+tn+'</b></div><div class="pth">';
  TYPES.forEach(function(ty,ni){h+='<button class="isl" data-g="'+g+'" style="--c:'+c[0]+';--d:'+c[1]+';--x:'+Math.round(Math.sin(g*.9)*70)+'px"><img class="lg" src="logo.png" alt=""><em class="bd"></em><i class="lb">'+ty.l+'</i></button>';g++});
  h+=decor(ti,c)+'</div>';ti++})});
 mp.innerHTML=h+'<div class="tp" style="background:var(--acc2)">' + IC_BOOK_HTML + ' SAT Math complete!</div>';built=true;paint()}
function paint(){if(!built)return;var d=getDone(),cur=-1;
 for(var g=0;g<100;g++)if(d.indexOf(g)<0){cur=g;break}
 mp.querySelectorAll('.isl').forEach(function(b,g){var dn=d.indexOf(g)>=0;b.className='isl'+(g%5==4?' fin':'')+(dn?' done':g==cur?' cur':' lock');b.querySelector('.bd').innerHTML=dn?'✓':g==cur?TYPES[g%5].i:'🔒'});
 document.getElementById('mpc').textContent='Island '+Math.min(d.length+1,100)+'/100';document.getElementById('mpb').style.width=d.length+'%'}
mp.addEventListener('click',function(e){var b=e.target.closest('.isl');if(!b)return;if(b.classList.contains('lock'))return toast('Finish the previous island first');
 var g=+b.dataset.g,ti=Math.floor(g/5),ni=g%5;SATPath.onOpen({g:g,ti:ti,ni:ni,topic:TOPS[ti],type:TYPES[ni],theory:THEORY[ti],gens:GENERATORS[ti]})});
var qk=document.getElementById('vQB'),BK='satpath_bank';
function bankStats(){try{return JSON.parse(spGet(BK))||{}}catch(e){return{}}}
function bankSave(ti,ok){var s=bankStats(),r=s[ti]||{a:0,c:0};r.a++;if(ok)r.c++;s[ti]=r;try{spSet(BK,JSON.stringify(s))}catch(e){}}

/* ===== ATLAS (Archipelago Skill Map with Roman Numerals I - IV & 0-3 Mastery Stars) ===== */
var qbRealmMode = 'all';  // 'all' | 'rw' | 'math'
var qbStarFilter = 'all'; // 'all' | '0' | '12' | '3'

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
  var maxStars = (RTOPS.length + TOPS.length) * 3; // 30 topics * 3 = 90 stars
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
    regionsHtml = '<div class="card" style="padding:36px;text-align:center"><div><img class="ui-ic-lg" src="compas.png" alt=""></div><b>No islands match this star filter yet</b><p class="sub">Switch back to "All ★" to view the full archipelago map.</p></div>';
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
    var wasOpen = ov.dataset.calcOpen === '1';
    ov.innerHTML = '<div id="bSplitWrap" class="quiz-split-wrap' + (wasOpen ? ' calc-open' : '') + '"><div class="qb" style="border-radius:26px"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap"><div><small style="color:var(--sand);font-weight:800;text-transform:uppercase;letter-spacing:.06em;display:flex;align-items:center;gap:5px">' + IC_MATH_HTML + ' MATH ISLAND DRILL</small><div style="font-weight:800;font-size:16px">' + TOPS[ti] + '</div></div><div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">' + miniHudHtml() + renderStarsHtml(starsNow) + '<button id="bcalc" style="background:' + (wasOpen ? '#e74c3c' : 'var(--acc2)') + ';color:#fff;padding:5px 12px;border-radius:10px;font-weight:bold;font-size:12px;">' + (wasOpen ? '✕ Close Calculator' : (IC_MATH_HTML + ' Calculator (50/50)')) + '</button><button id="bx" class="tbtn">✕</button></div></div><div class="chips"><span class="sc" style="margin-left:0">✓ ' + ok + ' / ' + tot + ' solved · Earn ★ Mastery Stars for +15 PC</span></div><div style="font-size:20px;line-height:1.6;margin:22px 0 14px">' + rHTML(q.q) + '</div><div id="ba"></div><div id="bf"></div></div><div id="d-panel" class="quiz-calc-pane"></div></div>';
    document.getElementById('bx').onclick = close;
    var bSplitWrap = document.getElementById('bSplitWrap');
    var dPanel = document.getElementById('d-panel');
    var calcBtn = document.getElementById('bcalc');
    var calculator = null;
    function mountBCalc() {
      if (!calculator && window.Desmos) {
        calculator = Desmos.GraphingCalculator(dPanel, {
          keypad: true,
          expressions: true,
          settingsMenu: false,
          folders: false,
          images: false
        });
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
        calcBtn.innerHTML = IC_MATH_HTML + ' Calculator (50/50)';
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

      f.innerHTML = '<p style="margin:14px 0;font-weight:700;color:' + (good ? 'var(--acc)' : '#e74c3c') + '">' + (good ? ('Correct! ✓ (+5 ' + IC_COIN_HTML + ')') : ('Incorrect. Answer: ' + rHTML(fmtAns(q.ans)))) + '</p><button class="cta-amber" id="bn">Next Question →</button>';
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
var rwM1 = document.getElementById('scRwM1');
var rwM2 = document.getElementById('scRwM2');
var mathM1 = document.getElementById('scMathM1');
var mathM2 = document.getElementById('scMathM2');

function updateSatCalculator() {
  if (!rwM1) return;
  var r1 = parseInt(rwM1.value);
  var r2 = parseInt(rwM2.value);
  var m1 = parseInt(mathM1.value);
  var m2 = parseInt(mathM2.value);

  document.getElementById('scRwM1Val').textContent = r1;
  document.getElementById('scRwM2Val').textContent = r2;
  document.getElementById('scMathM1Val').textContent = m1;
  document.getElementById('scMathM2Val').textContent = m2;

  var rTot = r1 + r2, mTot = m1 + m2;
  var rwHard = (r1 >= 18);
  var mathHard = (m1 >= 15);

  document.getElementById('scRwSubCount').textContent = rTot + ' of 54 correct · 50 of them count';
  document.getElementById('scMathSubCount').textContent = mTot + ' of 44 correct · 40 of them count';

  var rwBadge = document.getElementById('scRwRouteBadge');
  var rwInfo = document.getElementById('scRwRouteInfo');
  if (!rwHard) {
    rwBadge.textContent = 'Easier version';
    rwBadge.className = 'tag';
    rwInfo.textContent = r1 + ' of 27 right in Module 1 — under the 18 it takes to be routed up, so this section is capped near 600.';
  } else {
    rwBadge.textContent = 'Harder version';
    rwBadge.className = 'tag n';
    rwInfo.textContent = r1 + ' of 27 right in Module 1 — routed to the harder second module, where 800 is reachable.';
  }

  var mathBadge = document.getElementById('scMathRouteBadge');
  var mathInfo = document.getElementById('scMathRouteInfo');
  if (!mathHard) {
    mathBadge.textContent = 'Easier version';
    mathBadge.className = 'tag';
    mathInfo.textContent = m1 + ' of 22 right in Module 1 — under the 15 it takes to be routed up, so this section is capped near 590.';
  } else {
    mathBadge.textContent = 'Harder version';
    mathBadge.className = 'tag n';
    mathInfo.textContent = m1 + ' of 22 right in Module 1 — routed to the harder second module, where 800 is reachable.';
  }

  var rwScoredCorrect = Math.min(25, Math.max(0, r1 - 1)) + Math.min(25, Math.max(0, r2 - 1));
  var mathScoredCorrect = Math.min(20, Math.max(0, m1 - 1)) + Math.min(20, Math.max(0, m2 - 1));

  var rwScore = scaleSectionScore(rwScoredCorrect, 50, rwHard);
  var mathScore = scaleSectionScore(mathScoredCorrect, 40, mathHard);

  if (!rwHard && rwScore > 600) rwScore = 600;
  if (!mathHard && mathScore > 590) mathScore = 590;

  var totalScore = rwScore + mathScore;
  var rwLow = Math.max(200, rwScore - (rTot === 0 ? 0 : 20)), rwHigh = Math.min(800, rwScore + (rTot === 54 ? 0 : 20));
  var mLow = Math.max(200, mathScore - (mTot === 0 ? 0 : 20)), mHigh = Math.min(800, mathScore + (mTot === 44 ? 0 : 20));

  document.getElementById('scRwScoreText').textContent = rwScore;
  document.getElementById('scRwRangeText').textContent = rwLow + '–' + rwHigh + ' likely';

  document.getElementById('scMathScoreText').textContent = mathScore;
  document.getElementById('scMathRangeText').textContent = mLow + '–' + mHigh + ' likely';

  document.getElementById('scTotalScore').textContent = totalScore;
  document.getElementById('scTotalRange').textContent = 'Realistically ' + (rwLow + mLow) + '–' + (rwHigh + mHigh);

  var pct = totalScore >= 1550 ? '99th+' : totalScore >= 1500 ? '98th' : totalScore >= 1400 ? '94th' : totalScore >= 1300 ? '87th' : totalScore >= 1200 ? '75th' : totalScore >= 1100 ? '59th' : totalScore >= 1000 ? '43rd' : totalScore >= 900 ? '26th' : totalScore >= 800 ? '12th' : '1st';
  document.getElementById('scPercentile').textContent = pct + ' percentile nationally';

  document.getElementById('scSummaryRw').textContent = rwLow + '–' + rwHigh + ' · ' + rwScore;
  document.getElementById('scSummaryMath').textContent = mLow + '–' + mHigh + ' · ' + mathScore;
}

function scaleSectionScore(correct, maxScored, isHard) {
  if (correct <= 0) return 200;
  var ratio = correct / maxScored;
  var base = 200 + 600 * Math.pow(ratio, isHard ? 0.9 : 1.1);
  return Math.min(800, Math.max(200, Math.round(base / 10) * 10));
}

rwM1.oninput = updateSatCalculator;
rwM2.oninput = updateSatCalculator;
mathM1.oninput = updateSatCalculator;
mathM2.oninput = updateSatCalculator;
updateSatCalculator();

function buildRW(){
  var h='<div class="mph"><div style="display:flex;justify-content:space-between;align-items:center"><b style="font-size:22px"><img class="ic" style="width:32px;height:32px;vertical-align:-7px" src="six.png" alt=""> R&amp;W Path</b><small id="rwc" style="color:var(--mut)"></small></div><div class="bar" style="margin:10px 0 0"><div id="rwb"></div></div></div>',g=0,ti=0;
  RCUR.forEach(function(d){d[1].forEach(function(tn){var c=RDOM[d[0]];
    h+='<div class="tp" style="background:'+c[0]+'"><small>'+d[0]+' · Topic '+(ti+1)+'/10</small><b>'+tn+'</b></div><div class="pth">';
    TYPES.forEach(function(ty,ni){h+='<button class="isl" data-g="'+g+'" style="--c:'+c[0]+';--d:'+c[1]+';--x:'+Math.round(Math.sin(g*.9)*70)+'px"><img class="lg" src="logo.png" alt=""><em class="bd"></em><i class="lb">'+ty.l+'</i></button>';g++});
    h+=decor(ti,c)+'</div>';ti++})});
  rw.innerHTML=h+'<div class="tp" style="background:var(--acc2)">' + IC_BOOK_HTML + ' SAT Reading &amp; Writing complete!</div>';rbuilt=true;paintRW();
}

function paintRW(){
  if(!rbuilt)return;var d=getRDone(),cur=-1;
  for(var g=0;g<50;g++)if(d.indexOf(g)<0){cur=g;break}
  rw.querySelectorAll('.isl').forEach(function(b,g){var dn=d.indexOf(g)>=0;b.className='isl'+(g%5==4?' fin':'')+(dn?' done':g==cur?' cur':' lock');b.querySelector('.bd').innerHTML=dn?'✓':g==cur?TYPES[g%5].i:'🔒'});
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

function rwBankOpen(ti){
  if (!spendEnergy(1)) return;
  var ov=document.createElement('div'),ok=0;
  ov.style.cssText='position:fixed;inset:0;z-index:80;background:var(--bg);overflow:auto;padding:24px';document.body.appendChild(ov);
  function close(){ov.remove();buildBank()}
  function pool(){var c=[];if(RQ[ti])RQ[ti].forEach(function(r){c.push(function(){return r})});if(RGEN[ti])RGEN[ti].forEach(function(g){c.push(g)});return c}
  var myPool = shuffle(pool());
  var qIndex = 0;

  function draw(){
    if (qIndex >= myPool.length) {
      var pct = myPool.length > 0 ? Math.round(ok / myPool.length * 100) : 0;
      ov.innerHTML = '<div class="qb" style="text-align:center;border-radius:26px"><div>' + IC_ART_LG_HTML + '</div><h2>Island Drill Complete!</h2><div class="big" style="color:var(--sand)">' + pct + '%</div><p>' + ok + ' / ' + myPool.length + ' correct</p><button class="cta-amber" id="rx2" style="margin-top:16px">Back to Atlas</button></div>';
      document.getElementById('rx2').onclick = close;
      return;
    }
    var starsNow = getTopicStars('rw_' + ti, true, ti);
    var x=myPool[qIndex](), ans=x[1], opts=shuffle(x.slice(1)), done=false;
    ov.innerHTML='<div class="qb" style="border-radius:26px"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap"><div><small style="color:var(--sand);font-weight:800;text-transform:uppercase;letter-spacing:.06em;display:flex;align-items:center;gap:5px">' + IC_BOOK_HTML + ' R&amp;W ISLAND DRILL</small><div style="font-weight:800;font-size:16px">'+RTOPS[ti]+'</div></div><div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">'+miniHudHtml()+renderStarsHtml(starsNow)+'<button id="rx" class="tbtn">✕</button></div></div><div class="chips"><span class="sc" style="margin-left:0">Waypoint '+(qIndex + 1)+' of '+myPool.length+' · ✓ '+ok+' · Earn ★ Mastery Stars for +15 PC</span></div><p style="font-size:18px;line-height:1.55;margin:18px 0 14px">'+x[0]+'</p><div id="ra"></div><div id="rf"></div></div>';
    var a=document.getElementById('ra'),f=document.getElementById('rf');
    document.getElementById('rx').onclick=close;
    function fin(v){
      if(done)return;done=true;
      var prevStars = getTopicStars('rw_' + ti, true, ti);
      var good=v===ans;
      if(good){
        ok++;
        addCoins(5);
      }
      bankSave('rw_' + ti, good);
      lbAdd(good);
      var newStars = getTopicStars('rw_' + ti, true, ti);
      if(newStars > prevStars){confetti();addCoins(15 * (newStars - prevStars), 'Mastery Star ★ unlocked!');}
      a.querySelectorAll('button').forEach(function(b){b.disabled=true;if(b.dataset.v===ans)b.classList.add('good');else if(b.dataset.v===v)b.classList.add('bad')});
      f.innerHTML='<p style="margin:14px 0;font-weight:700;color:'+(good?'var(--acc)':'#e74c3c')+'">'+(good?('Correct! ✓ (+5 ' + IC_COIN_HTML + ')'):('Incorrect. Answer: '+ans))+'</p><button class="cta-amber" id="rn">Next Waypoint →</button>';
      document.getElementById('rn').onclick=function(){qIndex++;draw()};
    }
    opts.forEach(function(o,k){var b=document.createElement('button');b.className='qo';b.dataset.v=o;b.innerHTML='<b>'+'ABCD'[k]+'</b>&nbsp; '+o;b.onclick=function(){fin(o)};a.appendChild(b)});
  }
  draw();
}

/* ===== BLITZ 10 MODE (Fast 10 Questions · Math / R&W / Mixed · Level Selector) ===== */
var bzCfg = { mode: 'mix', lvl: 'hard' }; // mode: 'mix' | 'math' | 'rw', lvl: 'easy' | 'medium' | 'hard'
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
    '<div class="atlas-star-tot"><span class="st-ico">⚡</span><div><b>' + best.score.toLocaleString() + ' pts</b><small>High Score · Max Streak ' + best.streak + '🔥</small></div></div>' +
    '</div></div>' +
    '<div class="blitz-card">' +
    '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:22px">' +
    '<div><label style="font-size:12px;font-weight:800;color:var(--mut);text-transform:uppercase;letter-spacing:.06em;display:block;margin-bottom:10px">1. Choose Subject Mix</label>' +
    '<div style="display:grid;gap:10px">' +
    [
      ['mix', '⚡ Mixed Odyssey (5 Math + 5 R&amp;W)', 'Alternates between SAT Math and Reading &amp; Writing'],
      ['math', '📐 Pure Math Blitz (10 Math)', 'Graphs, geometry, systems, and algebra'],
      ['rw', '📖 Pure R&amp;W Blitz (10 R&amp;W)', 'Inferences, evidence, vocabulary, and grammar']
    ].map(function(m) {
      var on = bzCfg.mode === m[0];
      return '<button class="card" data-bzm="' + m[0] + '" style="padding:14px 16px;border-radius:18px;border-color:' + (on ? 'var(--acc)' : 'var(--line)') + ';background:' + (on ? 'rgba(34,163,129,0.12)' : 'var(--panel)') + '">' +
        '<b style="font-size:14.5px;display:block">' + m[1] + '</b><small style="color:var(--mut);font-size:12px">' + m[2] + '</small></button>';
    }).join('') + '</div></div>' +
    '<div><label style="font-size:12px;font-weight:800;color:var(--mut);text-transform:uppercase;letter-spacing:.06em;display:block;margin-bottom:10px">2. Select Difficulty Level</label>' +
    '<div style="display:grid;gap:10px">' +
    [
      ['easy', '🌱 Foundation (Level 1 · Easy)', 'Core concepts &amp; rapid warm-up · 1.0× Score Multiplier'],
      ['medium', '⚔️ Challenger (Level 2 · Medium)', 'Standard Digital SAT Module 1 difficulty · 1.5× Score Multiplier'],
      ['hard', '🔥 Bluebook Master (Level 3 · Hard)', 'Multi-step Module 2 hard problems &amp; traps · 2.0× Score Multiplier']
    ].map(function(lv) {
      var on = bzCfg.lvl === lv[0];
      return '<button class="card" data-bzl="' + lv[0] + '" style="padding:14px 16px;border-radius:18px;border-color:' + (on ? 'var(--sand)' : 'var(--line)') + ';background:' + (on ? 'var(--sand-bg)' : 'var(--panel)') + '">' +
        '<b style="font-size:14.5px;display:block">' + lv[1] + '</b><small style="color:var(--mut);font-size:12px">' + lv[2] + '</small></button>';
    }).join('') + '</div></div></div>' +
    '<div style="margin-top:24px;padding-top:18px;border-top:1.5px dashed var(--line);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">' +
    '<div style="font-size:13px;color:var(--mut)">⏱️ <b>60 seconds</b> per question · Streak combos grant bonus Pathcoins!</div>' +
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
  function closeBlitz() { stopTmr(); ov.remove(); buildBlitz(); }

  function renderStep() {
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
        '<div style="font-size:12px;font-weight:800;color:var(--sand);letter-spacing:.1em;text-transform:uppercase">⚡ BLITZ 10 COMPLETE</div>' +
        '<h2 style="font-size:28px;font-weight:800;margin:6px 0">' + (ok >= 9 ? 'Unstoppable Blitz!' : ok >= 7 ? 'Sharp Navigator!' : 'Good Sprint!') + '</h2>' +
        '<div style="font-size:54px;font-weight:800;color:var(--sand);margin:8px 0">' + score.toLocaleString() + ' <small style="font-size:18px;color:var(--mut)">pts</small></div>' +
        '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:18px 0">' +
        '<div class="card" style="padding:12px;border-radius:16px"><small style="color:var(--mut);display:block">Accuracy</small><b style="font-size:20px;color:var(--acc)">' + ok + ' / 10</b></div>' +
        '<div class="card" style="padding:12px;border-radius:16px"><small style="color:var(--mut);display:block">Max Streak</small><b style="font-size:20px;color:var(--sand)">' + maxStreak + ' 🔥</b></div>' +
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
      '<div style="display:flex;align-items:center;gap:10px"><span class="tag n" style="margin:0">BLITZ ' + (idx + 1) + '/10</span><b style="color:var(--sand)">' + streak + ' 🔥 Streak</b><small style="color:var(--mut)">Score: <b>' + score + '</b></small></div>' +
      '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">' + miniHudHtml() + (!q.rw ? '<button id="bzCalcBtn" style="background:' + (wasOpen ? '#e74c3c' : 'var(--acc2)') + ';color:#fff;padding:5px 12px;border-radius:10px;font-weight:700;font-size:12px">' + (wasOpen ? '✕ Close Calculator' : (IC_MATH_HTML + ' Calculator (50/50)')) + '</button>' : '') + '<b id="bzTimer" style="font-size:16px;color:var(--acc);font-variant-numeric:tabular-nums">0:60</b><button class="tbtn" id="bzQuit">✕</button></div>' +
      '</div>' +
      '<div class="pt-split-body"><div class="qb" style="max-width:none;border-radius:26px">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><span class="tag" style="margin:0;font-size:10.5px">' + (q.rw ? 'READING &amp; WRITING' : 'MATH') + ' · ' + bzCfg.lvl.toUpperCase() + '</span><small style="color:var(--mut);font-weight:700">' + q.top + '</small></div>' +
      '<div style="font-size:' + (q.rw ? 17 : 19) + 'px;line-height:1.55;margin:16px 0">' + fx(q.q) + '</div>' +
      '<div id="bzAnsBox"></div><div id="bzFeedBox"></div></div><div id="ptCP" style="display:' + (wasOpen ? 'block' : 'none') + ';border:2px solid var(--line);border-radius:24px;overflow:hidden;background:#fff"></div></div></div>';

    ov.querySelector('#bzQuit').onclick = closeBlitz;
    var bzCalcBtn = ov.querySelector('#bzCalcBtn');
    var bzShell = ov.querySelector('#bzShell');
    var bzCP = ov.querySelector('#ptCP');
    var bzCalc = null;
    function mountBzCalc() {
      if (!bzCalc && window.Desmos && bzCP) {
        bzCalc = Desmos.GraphingCalculator(bzCP, { keypad: true, expressions: true, settingsMenu: false, folders: false, images: false });
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
          bzCalcBtn.innerHTML = IC_MATH_HTML + ' Calculator (50/50)';
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
        lbAdd(true);
      } else {
        streak = 0;
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
        '<b style="color:' + (good ? 'var(--acc)' : '#e74c3c') + '">' + (good ? '⚡ Correct! +' + Math.round((100 + qLeft * 2 + streak * 25) * mult) + ' pts (+5 ' + IC_COIN_HTML + ')' : '✗ Incorrect. Answer: ' + (q.rw ? q.ans : rHTML(fmtAns(q.ans)))) + '</b>' +
        '<button class="cta-amber" id="bzNextBtn">' + (idx < 9 ? 'Next Blitz →' : 'See Results 🏆') + '</button></div>';
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

function show(w){
  var V={d:document.getElementById('vDash'),m:mp,b:qk,r:rw,sc:document.getElementById('vSC'),lb:document.getElementById('vLB'),pt:document.getElementById('vPT'),bz:document.getElementById('vBZ')};
  var N={d:'nvD',m:'nvMP',b:'nvQB',r:'nvRW',sc:'nvSC',lb:'nvLB',pt:'nvPT',bz:'nvBZ'};
  var titles={d:'Base Camp · Archipelago',m:'Math Path · Odyssey',b:'Atlas · Training Grounds',r:'R&W Path · Odyssey',sc:'Score Calculator',lb:'Explorer Leaderboard',pt:'Mock Exams · Expeditions',bz:'Blitz 10 · High-Speed Arena'};
  for(var k in V){
    if(V[k]) V[k].hidden=(k!==w);
    var nb=document.getElementById(N[k]);
    if(nb) nb.classList.toggle('on',k===w);
  }
  var locEl=document.getElementById('topLocLabel');
  if(locEl && titles[w]) locEl.textContent=titles[w];
  document.getElementById('side').classList.remove('o');
  paintHud();
  if(w==='m'){if(!built)build();else paint();var c=mp.querySelector('.cur');if(c)setTimeout(function(){c.scrollIntoView({block:'center'})},50)}
  else if(w==='r'){if(!rbuilt)buildRW();else paintRW();var c=rw.querySelector('.cur');if(c)setTimeout(function(){c.scrollIntoView({block:'center'})},50)}
  else if(w==='b'){buildBank();scrollTo(0,0)}
  else if(w==='lb'){lbOff=0;buildLB();scrollTo(0,0)}
  else if(w==='sc'){updateSatCalculator();scrollTo(0,0)}
  else if(w==='pt'){buildPT();scrollTo(0,0)}
  else if(w==='bz'){buildBlitz();scrollTo(0,0)}
  else {scrollTo(0,0);refreshDash()}
}

document.getElementById('nvD').onclick=function(){show('d')};
document.getElementById('nvMP').onclick=function(){show('m')};
document.getElementById('nvQB').onclick=function(){show('b')};
document.getElementById('nvRW').onclick=function(){show('r')};
document.getElementById('nvSC').onclick=function(){show('sc')};
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
/* duplicate lbFlush removed */
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
    qElem.innerHTML = '<div style="text-align:center;padding:15px 0"><div><img class="ui-ic-lg" src="art.png" alt=""></div><b style="font-size:15px">Daily set finished!</b><p style="color:var(--mut);font-size:12px;margin-top:2px">You got ' + data.ok + ' of 3 right (+15 ' + IC_COIN_HTML + ' bonus). Come back tomorrow!</p></div>';
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
    .sp-auth-box { background:var(--panel); border:1.5px solid var(--line); border-radius:28px; max-width:920px; width:100%; display:grid; grid-template-columns:1.1fr 0.9fr; gap:28px; padding:32px; box-shadow:0 20px 50px rgba(0,0,0,0.25), 0 4px 0 var(--line); align-items:center; position:relative; overflow:hidden; }
    @media(max-width:820px){ .sp-auth-box { grid-template-columns:1fr; padding:24px 18px; } .sp-auth-art { display:none !important; } }
    .sp-auth-form { max-width:380px; width:100%; margin:0 auto; text-align:center; }
    .sp-auth-title { font-size:28px; font-weight:800; letter-spacing:-.03em; color:var(--tx); margin-bottom:6px; }
    .sp-auth-sub { font-size:13px; color:var(--mut); line-height:1.5; margin-bottom:20px; }
    .sp-gbtn { width:100%; display:flex; align-items:center; justify-content:center; gap:10px; padding:12px 16px; border-radius:16px; border:1.5px solid var(--line); background:var(--panel2); color:var(--tx); font-weight:700; font-size:13.5px; transition:.2s; box-shadow:0 2px 0 var(--line); }
    .sp-gbtn:hover { border-color:var(--acc); transform:translateY(-1px); }
    .sp-or { display:flex; align-items:center; gap:12px; color:var(--mut); font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:.08em; margin:16px 0; }
    .sp-or::before, .sp-or::after { content:""; flex:1; height:1px; background:var(--line); }
    .sp-inp-wrap { position:relative; margin-bottom:10px; }
    .sp-inp { width:100%; padding:12px 16px 12px 40px; border-radius:14px; border:1.5px solid var(--line); background:var(--panel2); color:var(--tx); font-size:13.5px; outline:none; transition:.2s; font-family:inherit; }
    .sp-inp:focus { border-color:var(--acc); background:var(--panel); }
    .sp-inp-ico { position:absolute; left:14px; top:50%; transform:translateY(-50%); font-size:13px; opacity:.6; pointer-events:none; }
    .sp-submit { width:100%; padding:12px 18px; border-radius:16px; background:linear-gradient(180deg, var(--sand-bright) 0%, var(--sand) 100%); color:var(--sand-tx); font-weight:800; font-size:14px; text-align:center; box-shadow:0 4px 0 var(--sand-deep); transition:.18s; margin-top:4px; }
    .sp-submit:hover { transform:translateY(-2px); box-shadow:0 6px 0 var(--sand-deep); filter:brightness(1.04); }
    .sp-auth-err { color:#e74c3c; font-size:12px; font-weight:600; margin:6px 0; min-height:16px; }
    .sp-auth-art { height:420px; border-radius:22px; background:linear-gradient(155deg, var(--acc2) 0%, var(--acc) 100%); position:relative; overflow:hidden; display:flex; flex-direction:column; justify-content:flex-end; padding:28px; color:#fff; box-shadow:0 8px 24px rgba(0,0,0,0.15); border:1.5px solid rgba(255,255,255,0.2); }
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
            '<div style="display:inline-flex;align-items:center;gap:8px;margin-bottom:12px">' +
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

            (isSign ? '<div class="sp-inp-wrap"><span class="sp-inp-ico"></span><input id="spAuthName" class="sp-inp" type="text" placeholder="Explorer Name"></div>' : '') +
            '<div class="sp-inp-wrap"><span class="sp-inp-ico"></span><input id="spAuthEmail" class="sp-inp" type="email" placeholder="Email address" autocomplete="email"></div>' +
            '<div class="sp-inp-wrap"><span class="sp-inp-ico"></span><input id="spAuthPass" class="sp-inp" type="password" placeholder="Password (6+ chars)" autocomplete="current-password"></div>' +

            (!isSign ? '<div style="text-align:right;margin-bottom:4px"><button type="button" id="spForgotBtn" style="font-size:11.5px;color:var(--mut);font-weight:700">Forgot password?</button></div>' : '') +

            '<div class="sp-auth-err" id="spAuthErr"></div>' +

            '<button type="button" class="sp-submit" id="spBtnEmailSubmit">' + (isSign ? 'Register Explorer →' : 'Sign In →') + '</button>' +

            '<div style="margin-top:14px;font-size:12.5px;color:var(--mut)">' +
              (isSign ? 'Already exploring? <button type="button" id="spToggleMode" style="color:var(--acc);font-weight:800">Sign in</button>' : 'New explorer? <button type="button" id="spToggleMode" style="color:var(--acc);font-weight:800">Create an account</button>') +
            '</div>' +

            '<div style="margin-top:12px;padding-top:10px;border-top:1px dashed var(--line)">' +
              '<button type="button" id="spGuestClose" style="font-size:12px;color:var(--mut);font-weight:700">Continue as Guest (No sync) →</button>' +
            '</div>' +
          '</div>' +

          '<div class="sp-auth-art">' +
            '<div style="position:absolute;top:20px;right:20px;background:rgba(255,255,255,0.18);backdrop-filter:blur(8px);padding:5px 12px;border-radius:99px;font-size:11px;font-weight:800;letter-spacing:.06em">ARCHIPELAGO OUTPOST</div>' +
            '<div style="font-size:42px;margin-bottom:8px"></div>' +
            '<h3 style="font-size:22px;font-weight:800;line-height:1.25;margin-bottom:6px">Conquer the SAT Islands</h3>' +
            '<p style="font-size:13px;opacity:.9;line-height:1.45">Track your mastery stars, compete on the live leaderboard, and follow your customized AI study roadmap.</p>' +
          '</div>' +
        '</div>';

      var errEl = ov.querySelector('#spAuthErr');
      function setErr(msg) { errEl.textContent = msg || ''; }

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
          setErr(e.message || 'Google sign-in failed');
        }
      };

      var fgBtn = ov.querySelector('#spForgotBtn');
      if (fgBtn) {
        fgBtn.onclick = async function() {
          var em = ov.querySelector('#spAuthEmail').value.trim();
          if (!em) return setErr('Enter your email above first.');
          try {
            await fbInit();
            await FB.au.sendPasswordResetEmail(FB.auth, em);
            toast('Reset link sent to ' + em);
          } catch (e) {
            setErr(e.message || 'Could not send reset email.');
          }
        };
      }

      ov.querySelector('#spBtnEmailSubmit').onclick = async function() {
        setErr('');
        var em = ov.querySelector('#spAuthEmail').value.trim();
        var pw = ov.querySelector('#spAuthPass').value;
        var nmEl = ov.querySelector('#spAuthName');
        var nm = nmEl ? nmEl.value.trim() : '';
        if (!em || !pw) return setErr('Enter both email and password.');
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
          setErr(e.message || 'Authentication error');
        }
      };
    }

    document.body.appendChild(ov);
    render();
  };

  // Автоматический показ при входе, если не авторизован и не нажал гостя
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
applyProfileUI();
refreshDash();
initDailyChallenges();
lucide.createIcons();
