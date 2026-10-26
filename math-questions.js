/* ===== SATPATH MATH QUESTION GENERATORS & HELPERS ===== */
const R=(a,b,skip)=>{let v;do{v=Math.floor(Math.random()*(b-a+1))+a}while(v===skip);return v};
const shuffle=a=>[...a].sort(()=>Math.random()-.5);
const getEl=a=>a[R(0,a.length-1)];
const ITEMS=['notebooks','concert tickets','potted plants','cups of coffee','t-shirts','boots','rubick-cubes','airpods','glasses'];
const rHTML=s=>{
 s=String(s).replace(/<f>([\s\S]*?)\/(?![^<]*>)([\s\S]*?)<\/f>/g,'<span class="frac"><span>$1</span><span>$2</span></span>');
 const FR=/(\([^()]*\)|\|[^|]+\||[\w.²³π$]+(?:\^[\w.−-]+)?)\s?\/\s?(\([^()]*\)|[\w.²³π$]+(?:\^[\w.−-]+)?)/g;
 const unp=t=>t[0]==='('&&t.slice(-1)===')'?t.slice(1,-1):t;
 return s.split(/(<\/?[a-zA-Z][^>]*>)/).map((p,i)=>i%2?p:p
  .replace(/\+\s*[-−]\s*(?=[\w(.])/g,'− ')
  .replace(/(\s)[-−]\s*[-−]\s*(?=[\w(.])/g,'$1+ ')
  .replace(/(^|[^\d.\w])1(?=[A-Za-z](?![A-Za-z]))/g,'$1')
  .replace(/ - /g,' − ')
  .replace(/(^|[\s(=,])-(?=[\w(.])/g,'$1−')
  .replace(/<=/g,'≤').replace(/>=/g,'≥')
  .replace(FR,(m,n,d)=>{
    const tr=(d.match(/[.,]+$/)||[''])[0];if(tr)d=d.slice(0,-tr.length);
    if(/^[A-Za-z]{2,}$/.test(n)&&/^[A-Za-z]{2,}$/.test(d))return m;
    return '<span class="frac"><span>'+unp(n)+'</span><span>'+unp(d)+'</span></span>'+tr})
 ).join('')};
const MATH_GENS = (() => {
const g = (q, a, opts) => {
  if (!opts) opts = traps(a);
  a = String(a);
  let list = [...new Set([a, ...opts.map(String)])];
  const n = Number(a);
  if (list.length < 4 && isFinite(n)) {
    for (const d of [1,-1,2,-2,3,-3,5,-5,10,-10]) {
      if (list.length >= 4) break;
      const v = String(Math.round((n + d) * 100) / 100);
      if (!list.includes(v)) list.push(v);
    }
  }
  if (list.length < 4) {
    for (const f of ["0", "1", "-1", "2", "<f>1/2</f>", "<f>1/3</f>"]) {
      if (list.length >= 4) break;
      if (!list.includes(f)) list.push(f);
    }
  }
  return { q, a, opts: shuffle([a, ...list.filter(x => x !== a).slice(0, 3)]) };
};
const traps = (a) => {
  const n = Number(a);
  if (!isFinite(n)) return [String(a), "0", "1", "-1"];
  const v = Math.round(n * 1000) / 1000;
  const s = String(v);
  let cand = [];
  if (v > 0 && v < 1) {
    cand = [
      Math.round((1 - v) * 1000) / 1000,
      Math.min(0.99, Math.round((v + 0.15) * 1000) / 1000),
      Math.max(0.01, Math.round((v - 0.12) * 1000) / 1000),
      Math.min(0.98, Math.round((v * 0.5) * 1000) / 1000),
      Math.min(0.99, Math.round((v + 0.08) * 1000) / 1000)
    ];
  } else if (Number.isInteger(v)) {
    if (Math.abs(v) >= 6) {
      cand = [v * 2, (v % 2 === 0 ? v / 2 : v + 3), v - 2, v + 2, -v, v + 4, v - 4];
    } else if (v !== 0) {
      cand = [-v, v * 2, v + 1, v - 1, v + 3, v - 2];
    } else {
      cand = [1, -1, 2, -2, 4];
    }
  } else {
    cand = [
      Math.round((v + 1.5) * 100) / 100,
      Math.round((v - 1.5) * 100) / 100,
      Math.round((v * 2) * 100) / 100,
      Math.round((v + 3) * 100) / 100,
      Math.round((-v) * 100) / 100
    ];
  }
  const out = [s];
  for (const c of cand) {
    const cs = String(c);
    if (!out.includes(cs)) out.push(cs);
    if (out.length >= 4) break;
  }
  return out;
};
const grid = (q, a) => {
  const n = Number(a);
  return { q, a: String(isFinite(n) ? Math.round(n * 1000) / 1000 : a), isGrid: true };
};
  const svg = (elements) => `<div class="flex justify-center my-5"><svg width="220" height="220" viewBox="0 0 200 200" class="bg-white border border-[#cfe8e2] shadow-sm rounded-xl"><g stroke="#e2e8f0" stroke-width="1">${Array.from({length:21},(_,i)=>i*10).map(p=>`<line x1="${p}" y1="0" x2="${p}" y2="200"/><line x1="0" y1="${p}" x2="200" y2="${p}"/>`).join('')}</g><path d="M0 100H200M100 0V200" stroke="#0f2b4a" stroke-width="2"/>${elements}</svg></div>`;
  const tX = x => 100 + x * 10; const tY = y => 100 - y * 10;
const fill=(c,arr=[])=>{const s=[String(c)];[...arr,...[1,-1,2,-2,3,-3,5,-5].map(o=>Number(c)+o)].forEach(x=>{x=String(Math.round(x*100)/100);if(s.length<4&&!s.includes(x)&&Number(x)>0)s.push(x);});return s;};
const opts=(c,arr)=>{const s=[String(c)];arr.forEach(x=>{x=String(x);if(s.length<4&&!s.includes(x))s.push(x);});return s;};
const gcd=(a,b)=>b?gcd(b,a%b):a;
const eqC=(h,k,rr)=>`(x ${h>=0?'-':'+'} ${Math.abs(h)})² + (y ${k>=0?'-':'+'} ${Math.abs(k)})² = ${rr}`;
const TR=[[3,4,5],[5,12,13],[8,15,17],[7,24,25],[6,8,10],[9,12,15]];

const gSvg = (w, h, body, note=true) => `<div class="flex flex-col items-center my-4"><svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" class="bg-white border border-[#cfe8e2] shadow-sm rounded-xl p-1">${body}</svg>${note ? '<small style="color:var(--mut);font-size:11.5px;margin-top:4px;font-style:italic">Note: Figure not drawn to scale.</small>' : ''}</div>`;
const svgRightTri = (lblAB, lblBC, lblAC, angC='', angA='') => gSvg(250, 175, `<polygon points="45,140 205,140 205,30" fill="#f0fbf8" stroke="#0f2b4a" stroke-width="2.5"/><rect x="191" y="126" width="14" height="14" fill="none" stroke="#1f9d8a" stroke-width="2"/><text x="30" y="148" font-size="14" font-weight="bold" fill="#0f2b4a" font-style="italic">C</text><text x="212" y="148" font-size="14" font-weight="bold" fill="#0f2b4a" font-style="italic">B</text><text x="210" y="26" font-size="14" font-weight="bold" fill="#0f2b4a" font-style="italic">A</text>${lblAC ? `<text x="110" y="75" font-size="14" font-weight="bold" fill="#0f2b4a" text-anchor="middle">${lblAC}</text>` : ''}${lblBC ? `<text x="125" y="160" font-size="14" font-weight="bold" fill="#0f2b4a" text-anchor="middle">${lblBC}</text>` : ''}${lblAB ? `<text x="228" y="92" font-size="14" font-weight="bold" fill="#0f2b4a" text-anchor="middle">${lblAB}</text>` : ''}${angC ? `<path d="M 80 140 A 35 35 0 0 0 73 121" fill="none" stroke="#1f9d8a" stroke-width="2"/><text x="92" y="134" font-size="13" font-weight="bold" fill="#1f9d8a">${angC}</text>` : ''}${angA ? `<path d="M 187 42 A 24 24 0 0 0 205 54" fill="none" stroke="#1f9d8a" stroke-width="2"/><text x="178" y="66" font-size="12" font-weight="bold" fill="#1f9d8a">${angA}</text>` : ''}`);
const svgCone = (lblR, lblH, lblL) => gSvg(230, 180, `<ellipse cx="115" cy="142" rx="68" ry="18" fill="#e8f7f4" stroke="#0f2b4a" stroke-width="2" stroke-dasharray="5,3"/><path d="M 47 142 A 68 18 0 0 0 183 142" fill="none" stroke="#0f2b4a" stroke-width="2.5"/><line x1="115" y1="22" x2="47" y2="142" stroke="#0f2b4a" stroke-width="2.5"/><line x1="115" y1="22" x2="183" y2="142" stroke="#0f2b4a" stroke-width="2.5"/><line x1="115" y1="22" x2="115" y2="142" stroke="#1f9d8a" stroke-width="2" stroke-dasharray="4,4"/><line x1="115" y1="142" x2="183" y2="142" stroke="#e74c3c" stroke-width="2"/><rect x="115" y="132" width="10" height="10" fill="none" stroke="#1f9d8a" stroke-width="1.5"/>${lblR ? `<text x="149" y="136" font-size="12" font-weight="bold" fill="#e74c3c" text-anchor="middle">${lblR}</text>` : ''}${lblH ? `<text x="102" y="90" font-size="12" font-weight="bold" fill="#1f9d8a" text-anchor="end">${lblH}</text>` : ''}${lblL ? `<text x="162" y="78" font-size="13" font-weight="bold" fill="#0f2b4a">${lblL}</text>` : ''}`);
const svgCyl = (lblR, lblH) => gSvg(220, 175, `<ellipse cx="110" cy="140" rx="62" ry="16" fill="#e8f7f4" stroke="#0f2b4a" stroke-width="2.2"/><line x1="48" y1="38" x2="48" y2="140" stroke="#0f2b4a" stroke-width="2.5"/><line x1="172" y1="38" x2="172" y2="140" stroke="#0f2b4a" stroke-width="2.5"/><ellipse cx="110" cy="38" rx="62" ry="16" fill="#d5f2ec" stroke="#0f2b4a" stroke-width="2.5"/><line x1="110" y1="38" x2="172" y2="38" stroke="#e74c3c" stroke-width="2"/><circle cx="110" cy="38" r="3" fill="#0f2b4a"/>${lblR ? `<text x="141" y="32" font-size="12" font-weight="bold" fill="#e74c3c" text-anchor="middle">${lblR}</text>` : ''}${lblH ? `<text x="182" y="94" font-size="13" font-weight="bold" fill="#0f2b4a">${lblH}</text>` : ''}`);
const svgBox = (lblL, lblW, lblH, openTop=false) => gSvg(240, 175, `<polygon points="45,65 145,65 185,35 85,35" fill="${openTop ? '#cbd5e1' : '#d5f2ec'}" stroke="#0f2b4a" stroke-width="2" ${openTop ? 'stroke-dasharray="4,3"' : ''}/><polygon points="45,65 145,65 145,145 45,145" fill="#e8f7f4" stroke="#0f2b4a" stroke-width="2.5"/><polygon points="145,65 185,35 185,115 145,145" fill="#ccebe4" stroke="#0f2b4a" stroke-width="2.5"/><line x1="85" y1="35" x2="85" y2="115" stroke="#0f2b4a" stroke-width="1.5" stroke-dasharray="4,4"/><line x1="45" y1="145" x2="85" y2="115" stroke="#0f2b4a" stroke-width="1.5" stroke-dasharray="4,4"/><line x1="85" y1="115" x2="185" y2="115" stroke="#0f2b4a" stroke-width="1.5" stroke-dasharray="4,4"/>${openTop ? `<text x="115" y="54" font-size="11" font-weight="bold" fill="#475569" text-anchor="middle">Open Top (No Lid)</text>` : ''}${lblL ? `<text x="95" y="162" font-size="12" font-weight="bold" fill="#0f2b4a" text-anchor="middle">${lblL}</text>` : ''}${lblW ? `<text x="176" y="140" font-size="12" font-weight="bold" fill="#0f2b4a">${lblW}</text>` : ''}${lblH ? `<text x="38" y="110" font-size="12" font-weight="bold" fill="#1f9d8a" text-anchor="end">${lblH}</text>` : ''}`);
const svgPyramid = (lblS, lblH, lblSlant) => gSvg(235, 175, `<polygon points="45,142 145,142 185,112 85,112" fill="#e8f7f4" stroke="#0f2b4a" stroke-width="2"/><line x1="115" y1="22" x2="45" y2="142" stroke="#0f2b4a" stroke-width="2.5"/><line x1="115" y1="22" x2="145" y2="142" stroke="#0f2b4a" stroke-width="2.5"/><line x1="115" y1="22" x2="185" y2="112" stroke="#0f2b4a" stroke-width="2.5"/><line x1="115" y1="22" x2="85" y2="112" stroke="#0f2b4a" stroke-width="1.5" stroke-dasharray="4,4"/><line x1="115" y1="22" x2="115" y2="127" stroke="#e74c3c" stroke-width="2" stroke-dasharray="4,3"/><line x1="115" y1="22" x2="165" y2="127" stroke="#1f9d8a" stroke-width="2.2"/>${lblS ? `<text x="95" y="160" font-size="12" font-weight="bold" fill="#0f2b4a" text-anchor="middle">${lblS}</text>` : ''}${lblH ? `<text x="110" y="85" font-size="12" font-weight="bold" fill="#e74c3c" text-anchor="end">${lblH}</text>` : ''}${lblSlant ? `<text x="155" y="72" font-size="12" font-weight="bold" fill="#1f9d8a">${lblSlant}</text>` : ''}`);
const svgCircleSector = (lblR, lblDeg) => gSvg(210, 175, `<circle cx="105" cy="88" r="64" fill="#f0fbf8" stroke="#0f2b4a" stroke-width="2.5"/><path d="M 105 88 L 169 88 A 64 64 0 0 0 137 32.6 Z" fill="#b9e9df" stroke="#1f9d8a" stroke-width="2.2"/><circle cx="105" cy="88" r="3.5" fill="#0f2b4a"/><text x="95" y="98" font-size="12" font-weight="bold" fill="#0f2b4a">O</text><text x="138" y="104" font-size="12" font-weight="bold" fill="#0f2b4a">${lblR}</text><text x="128" y="76" font-size="12" font-weight="bold" fill="#1f9d8a">${lblDeg}</text>`);
const svgCircleTangent = (lblR, lblPT, lblOP) => gSvg(240, 170, `<circle cx="85" cy="85" r="52" fill="#f0fbf8" stroke="#0f2b4a" stroke-width="2.5"/><line x1="85" y1="85" x2="137" y2="85" stroke="#0f2b4a" stroke-width="2"/><line x1="85" y1="85" x2="85" y2="33" stroke="#1f9d8a" stroke-width="2.2"/><line x1="85" y1="33" x2="205" y2="33" stroke="#e74c3c" stroke-width="2.5"/><line x1="85" y1="85" x2="205" y2="33" stroke="#0f2b4a" stroke-width="2" stroke-dasharray="4,3"/><rect x="85" y="33" width="11" height="11" fill="none" stroke="#1f9d8a" stroke-width="1.8"/><circle cx="85" cy="85" r="3.5" fill="#0f2b4a"/><text x="72" y="92" font-size="12" font-weight="bold" fill="#0f2b4a">O</text><text x="80" y="25" font-size="12" font-weight="bold" fill="#0f2b4a">T</text><text x="210" y="37" font-size="12" font-weight="bold" fill="#0f2b4a">P</text>${lblR ? `<text x="77" y="64" font-size="12" font-weight="bold" fill="#1f9d8a" text-anchor="end">${lblR}</text>` : ''}${lblPT ? `<text x="145" y="25" font-size="12" font-weight="bold" fill="#e74c3c" text-anchor="middle">${lblPT}</text>` : ''}${lblOP ? `<text x="152" y="74" font-size="12" font-weight="bold" fill="#0f2b4a">${lblOP}</text>` : ''}`);
const svgCircleChord = (lblR, lblDist, lblChord) => gSvg(220, 175, `<circle cx="110" cy="88" r="64" fill="#f0fbf8" stroke="#0f2b4a" stroke-width="2.5"/><line x1="59" y1="126" x2="161" y2="126" stroke="#e74c3c" stroke-width="2.8"/><line x1="110" y1="88" x2="110" y2="126" stroke="#1f9d8a" stroke-width="2.2"/><line x1="110" y1="88" x2="161" y2="126" stroke="#0f2b4a" stroke-width="2" stroke-dasharray="4,3"/><rect x="110" y="116" width="10" height="10" fill="none" stroke="#1f9d8a" stroke-width="1.6"/><circle cx="110" cy="88" r="3.5" fill="#0f2b4a"/><text x="106" y="78" font-size="12" font-weight="bold" fill="#0f2b4a">O</text>${lblR ? `<text x="142" y="102" font-size="12" font-weight="bold" fill="#0f2b4a">${lblR}</text>` : ''}${lblDist ? `<text x="103" y="112" font-size="12" font-weight="bold" fill="#1f9d8a" text-anchor="end">${lblDist}</text>` : ''}${lblChord ? `<text x="110" y="144" font-size="12" font-weight="bold" fill="#e74c3c" text-anchor="middle">${lblChord}</text>` : ''}`);
const svgParallelTrans = (lbl1, lbl2) => gSvg(240, 165, `<line x1="25" y1="50" x2="215" y2="50" stroke="#0f2b4a" stroke-width="2.5"/><line x1="25" y1="120" x2="215" y2="120" stroke="#0f2b4a" stroke-width="2.5"/><line x1="65" y1="150" x2="175" y2="20" stroke="#1f9d8a" stroke-width="2.5"/><text x="148" y="43" font-size="13" font-weight="bold" fill="#e74c3c">${lbl1}</text><text x="105" y="113" font-size="13" font-weight="bold" fill="#1f9d8a">${lbl2}</text><text x="200" y="43" font-size="11" fill="#4f7570" font-style="italic">l</text><text x="200" y="113" font-size="11" fill="#4f7570" font-style="italic">m</text>`);
const svgExtAngle = (lblA, lblB, lblExt) => gSvg(250, 165, `<polygon points="40,135 165,135 110,35" fill="#f0fbf8" stroke="#0f2b4a" stroke-width="2.5"/><line x1="165" y1="135" x2="225" y2="135" stroke="#0f2b4a" stroke-width="2.5"/><text x="62" y="128" font-size="12" font-weight="bold" fill="#1f9d8a">${lblA}</text><text x="108" y="65" font-size="12" font-weight="bold" fill="#1f9d8a" text-anchor="middle">${lblB}</text><text x="186" y="126" font-size="13" font-weight="bold" fill="#e74c3c">${lblExt}</text>`);
const svgSimSplit = (lblTopL, lblBotL, lblTopR, lblBotR, parBaseTop='', parBaseBot='') => gSvg(240, 175, `<polygon points="120,22 45,148 195,148" fill="#f0fbf8" stroke="#0f2b4a" stroke-width="2.5"/><line x1="78" y1="92" x2="162" y2="92" stroke="#1f9d8a" stroke-width="2.5"/><text x="120" y="16" font-size="12" font-weight="bold" fill="#0f2b4a" text-anchor="middle">A</text><text x="35" y="152" font-size="12" font-weight="bold" fill="#0f2b4a">B</text><text x="203" y="152" font-size="12" font-weight="bold" fill="#0f2b4a">C</text><text x="64" y="95" font-size="12" font-weight="bold" fill="#1f9d8a">D</text><text x="170" y="95" font-size="12" font-weight="bold" fill="#1f9d8a">E</text>${lblTopL ? `<text x="86" y="58" font-size="12" font-weight="bold" fill="#0f2b4a" text-anchor="end">${lblTopL}</text>` : ''}${lblBotL ? `<text x="52" y="125" font-size="12" font-weight="bold" fill="#0f2b4a" text-anchor="end">${lblBotL}</text>` : ''}${lblTopR ? `<text x="152" y="58" font-size="12" font-weight="bold" fill="#0f2b4a">${lblTopR}</text>` : ''}${lblBotR ? `<text x="186" y="125" font-size="12" font-weight="bold" fill="#0f2b4a">${lblBotR}</text>` : ''}${parBaseTop ? `<text x="120" y="86" font-size="12" font-weight="bold" fill="#1f9d8a" text-anchor="middle">${parBaseTop}</text>` : ''}${parBaseBot ? `<text x="120" y="164" font-size="12" font-weight="bold" fill="#0f2b4a" text-anchor="middle">${parBaseBot}</text>` : ''}`);
const svgParabola = (a, h, k, lblV='', showRoots=false) => {
  const pts = [];
  for(let px = -9; px <= 9; px += 0.25) {
    const py = a * (px - h) * (px - h) + k;
    if (py >= -10 && py <= 10) pts.push(`${tX(px).toFixed(1)},${tY(py).toFixed(1)}`);
  }
  const poly = pts.length > 1 ? `<polyline fill="none" stroke="#22a381" stroke-width="3" points="${pts.join(' ')}"/>` : '';
  const vx = tX(h), vy = tY(k);
  return svg(`${poly}<circle cx="${vx}" cy="${vy}" r="4.5" fill="#e74c3c"/>${lblV ? `<text x="${vx + 8}" y="${vy - 6}" font-size="11" font-weight="bold" fill="#0f2b4a">${lblV}</text>` : ''}`);
};
const svgRightAlt = (lblAD, lblDB, lblCD, lblAC='', lblBC='') => gSvg(250, 175, `<polygon points="35,140 215,140 105,35" fill="#f0fbf8" stroke="#0f2b4a" stroke-width="2.5"/><line x1="105" y1="35" x2="105" y2="140" stroke="#1f9d8a" stroke-width="2.2" stroke-dasharray="4,3"/><rect x="105" y="128" width="12" height="12" fill="none" stroke="#1f9d8a" stroke-width="1.8"/><text x="23" y="148" font-size="13" font-weight="bold" fill="#0f2b4a">A</text><text x="222" y="148" font-size="13" font-weight="bold" fill="#0f2b4a">B</text><text x="105" y="26" font-size="13" font-weight="bold" fill="#0f2b4a" text-anchor="middle">C</text><text x="105" y="156" font-size="12" font-weight="bold" fill="#1f9d8a" text-anchor="middle">D</text>${lblAD ? `<text x="70" y="156" font-size="12" font-weight="bold" fill="#0f2b4a" text-anchor="middle">${lblAD}</text>` : ''}${lblDB ? `<text x="160" y="156" font-size="12" font-weight="bold" fill="#0f2b4a" text-anchor="middle">${lblDB}</text>` : ''}${lblCD ? `<text x="98" y="92" font-size="12" font-weight="bold" fill="#e74c3c" text-anchor="end">${lblCD}</text>` : ''}${lblAC ? `<text x="60" y="82" font-size="12" font-weight="bold" fill="#0f2b4a" text-anchor="end">${lblAC}</text>` : ''}${lblBC ? `<text x="170" y="82" font-size="12" font-weight="bold" fill="#0f2b4a">${lblBC}</text>` : ''}`);
const svgInscribedQuad = (lblA, lblB, lblC, lblD) => gSvg(220, 180, `<circle cx="110" cy="90" r="68" fill="#f0fbf8" stroke="#0f2b4a" stroke-width="2.5"/><polygon points="62,42 165,50 158,138 55,130" fill="rgba(34,163,129,0.12)" stroke="#1f9d8a" stroke-width="2.2"/><text x="48" y="38" font-size="12" font-weight="bold" fill="#0f2b4a">A</text><text x="174" y="48" font-size="12" font-weight="bold" fill="#0f2b4a">B</text><text x="168" y="148" font-size="12" font-weight="bold" fill="#0f2b4a">C</text><text x="40" y="140" font-size="12" font-weight="bold" fill="#0f2b4a">D</text>${lblA ? `<text x="76" y="62" font-size="11.5" font-weight="bold" fill="#e74c3c">${lblA}</text>` : ''}${lblB ? `<text x="135" y="68" font-size="11.5" font-weight="bold" fill="#1f9d8a">${lblB}</text>` : ''}${lblC ? `<text x="128" y="128" font-size="11.5" font-weight="bold" fill="#e74c3c">${lblC}</text>` : ''}${lblD ? `<text x="72" y="122" font-size="11.5" font-weight="bold" fill="#1f9d8a">${lblD}</text>` : ''}`);
const svgTrapPrism = (lblB1, lblB2, lblH, lblL) => gSvg(250, 175, `<polygon points="40,140 140,140 120,75 60,75" fill="#e8f7f4" stroke="#0f2b4a" stroke-width="2.5"/><polygon points="60,75 120,75 175,45 115,45" fill="#d5f2ec" stroke="#0f2b4a" stroke-width="2.2"/><polygon points="140,140 195,110 175,45 120,75" fill="#ccebe4" stroke="#0f2b4a" stroke-width="2.2"/><line x1="90" y1="75" x2="90" y2="140" stroke="#e74c3c" stroke-width="2" stroke-dasharray="4,3"/><text x="90" y="156" font-size="12" font-weight="bold" fill="#0f2b4a" text-anchor="middle">${lblB1}</text><text x="90" y="68" font-size="12" font-weight="bold" fill="#0f2b4a" text-anchor="middle">${lblB2}</text><text x="84" y="112" font-size="11.5" font-weight="bold" fill="#e74c3c" text-anchor="end">${lblH}</text><text x="176" y="134" font-size="12" font-weight="bold" fill="#1f9d8a">${lblL}</text>`);

  return [
    // === Topic 0: Linear equations in one variable ===
    [
      () => { const a=R(4,19), b=R(12,68), k=R(3,11), v=R(15,85), c=k*v; return g(`If ${k}(${a}<i>x</i> - ${b}) - ${2*a}<i>x</i> + ${2*b} = ${(k-2)*v}, what is the value of ${a}<i>x</i> - ${b}?`, v); },
      () => { const p=R(3,14), q=R(15,75), r=R(4,18), m=p*r, n=q*r; return g(`-${p}(${r}<i>x</i> - ${q}) + <i>kx</i> = ${p*q + R(12,60)}<br><br>In the given equation, <i>k</i> is a constant. If the equation has no solution, what is the value of <i>k</i>?`, String(m), [String(m), String(-m), String(p*q), String(r)]); },
      () => { const d1=R(3,9), d2=R(4,11,d1), c=R(14,88), k=R(2,7), x=c + d1*d2*k, rhs=k*(d2 - d1); return g(`<f><i>x</i> - ${c}/${d1}</f> - <f><i>x</i> - ${c}/${d2}</f> = ${rhs}<br><br>What value of <i>x</i> is the solution to the given equation?`, x); },
      () => { const a=R(6,28), b=R(12,75), m=R(3,9), c=a*b*m; return g(`If ${a}(${m}<i>x</i> + ${b*m}) = <i>a</i><i>k</i><i>x</i> + <i>c</i> has infinitely many solutions for <i>x</i>, where <i>k</i> and <i>c</i> are constants, what is the value of <i>c</i>?`, c, [c, a*b, a+b*m, m*b]); },
      () => {
        const n = R(5, 25);
        const d1 = R(2, 9);
        let d2 = R(10, 20);
        const left = -R(1, 6);
        const right = R(1, 6);
        const answer = `${left} and ${right}`;
        return g(`If (x + ${n})/${d1} = (x + ${n})/${d2}, the value of x + ${n} is between which of the following pairs of values?`, answer, [answer, `${-R(15, 10)} and ${-R(7, 2)}`, `${R(2, 5)} and ${R(6, 10)}`, `${R(10, 15)} and ${R(16, 20)}`]);
      },
      () => { const a=R(3,8), b=R(4,11), k=R(2,5), p=a*k, c=R(5,18), n=b*k + c*k; return g(`<f>${a}<i>x</i> - ${b}/${k}</f> + ${c} = <f><i>px</i> - <i>n</i>/${k*k}</f><br><br>In the given equation, <i>p</i> and <i>n</i> are constants. If the equation has infinitely many solutions for <i>x</i>, what is the value of <f><i>p</i>/<i>k</i></f> + <f><i>n</i>/${k}</f> when <i>k</i> = ${k}?`, String(a*k + b - c*k), traps(a*k + b - c*k)); },
      () => { const a=R(12,48), b=R(15,65), k=R(3,9), s=a*k, t=b*k; return g(`<f>${a}<i>x</i> + ${b}/${k}</f> - <f>${s}<i>x</i> - ${t}/${k*k}</f> = <f><i>n</i>/${k}</f><br><br>If the given equation has infinitely many solutions for <i>x</i>, what is the value of the constant <i>n</i>?`, 2*b); },
      () => { const m=R(3,7), d=R(2,5), x0=R(6,16), k=m*x0, rhs=d*x0; return g(`|${m}<i>x</i> - ${k}| = ${d}<i>x</i> - ${rhs}<br><br>If the equation above is graphed in Desmos as a system of two functions, what is the sum of all real solutions <i>x</i>?`, String(x0), [String(x0), String(2*x0), String(x0 + d), "0"]); },
      () => {
        const m1 = (R(30, 90) / 2).toFixed(2);
        const b1 = (R(100, 250) / 2).toFixed(2);
        const x = R(5, 15);
        const m2 = (parseFloat(m1) - R(4, 16) / 2).toFixed(2);
        const b2 = (parseFloat(b1) + (parseFloat(m1) - parseFloat(m2)) * x).toFixed(2);
        return g(`Company A charges a $${b1} setup fee plus $${m1} per hour. Company B charges a $${b2} setup fee plus $${m2} per hour. At how many hours are the total costs equal?`, x, [x, x-2, x+1, x+3]);
      },
      () => {
        const item = getEl(['pitcher', 'bucket', 'water dispenser', 'barrel']);
        const remain = R(10, 30);
        const lost = R(5, 20);
        const start = remain + lost;
        const daysPerOunce = R(3, 8);
        const answer = lost * daysPerOunce;
        return g(`A ${item} contains ${start} ounces of water. When left uncovered, the water decreases by 1 ounce every ${daysPerOunce} days. If ${remain} ounces remain, for how many days has it been uncovered?`, answer, [answer, lost, answer + daysPerOunce, Math.max(1, answer - daysPerOunce)]);
      },
      () => {
        const it = getEl(['smartphones', 'headphones', 'tablets', 'laptops']);
        const [c1, c2, c3] = shuffle(['silver', 'black', 'white']);
        const prod = R(3, 12);
        const third = R(20, 80);
        const n_val = R(10, 40);
        const total = (prod + 1) * n_val + third;
        const eq = `${prod}n + n + ${third} = ${total}`;
        return g(`A tech store sells ${it} in three colors: ${c1}, ${c2}, and ${c3}. The number of ${c1} ${it} sold is ${prod} times the number n of ${c2} ${it} sold, and the number of ${c3} ${it} sold is ${third}. If the store sells ${total} ${it} in total, which equation represents this situation?`, eq, [eq, `${prod}n + ${third} = ${total}`,`${prod}(n + ${third}) = ${total}`, `n + ${third} = ${prod}n + ${total}`]);
      },
      ()=>{const S=[{b:'A museum',i:'tablets',t:'day'},{b:'A bakery',i:'specialty cakes',t:'morning'},{b:'A theater',i:'headsets',t:'night'}];const s=getEl(S);const r=R(10,35);const e=R(100,300,10);const x=R(25,85);const p=r*x-e;const q=`${s.b} rents ${s.i} to visitors. The business earns revenue of $${r} for each item rented. On a certain ${s.t}, it earned $${p} in profit after paying daily expenses of $${e}. How many ${s.i} did it rent? (profit = total revenue - total expenses)`;return grid(q,x);},
      ()=>{const S=[{n:'Lorenzo',i1:'cereal',i2:'strawberries',u:'pound'},{n:'Maya',i1:'milk',i2:'coffee beans',u:'pound'},{n:'Ethan',i1:'bread',i2:'deli meat',u:'ounce'}];const s=getEl(S);const b=R(2,10);const m=(R(11,49)/10).toFixed(2);const t=(b+parseFloat(m)*R(2,8)).toFixed(2);const ans=`${m}<i>p</i> + ${b} = ${t}`;const q=`${s.n} purchased a box of ${s.i1} and some ${s.i2}. ${s.n} paid $${b} for the box of ${s.i1} and $${m} per ${s.u} for the ${s.i2}. If ${s.n} paid a total of $${t}, which equation can be used to find <i>p</i>, the number of ${s.u}s of ${s.i2} purchased?`;return g(q,ans,[ans,`${m}<i>p</i> - ${b} = ${t}`,`${m} + ${b}<i>p</i> = ${t}`,`${b} - ${m}<i>p</i> = ${t}`]);},
      ()=>{const d1=R(2,5);let d2=R(2,5);while(d1===d2)d2=R(2,5);const k=R(2,12);const mult=R(-5,5,0);const v=d1*d2*mult;const x=v-k;const c=v/d1-v/d2;const q=`<f>1/${d1}</f>(<i>x</i> + ${k}) - <f>1/${d2}</f>(<i>x</i> + ${k}) = ${c}<br><br>What value of <i>x</i> is the solution to the given equation?`;return g(q,x);},
      ()=>{const S=[{o:'rocket',i:'propellant',u:'kilograms (kg)',b:'burn'},{o:'water tower',i:'water',u:'gallons',b:'leak'},{o:'silo',i:'grain',u:'pounds (lbs)',b:'dispense'}];const s=getEl(S);const init=R(200000,800000,1000);const rate=R(2000,8000,5);const t=R(15,45);const rem=init-rate*t;const q=`A ${s.o} contained ${init.toLocaleString()} ${s.u} of ${s.i} before starting. Exactly ${t} seconds later, ${rem.toLocaleString()} ${s.u} of this ${s.i} remained. On average, approximately how much ${s.i}, in ${s.u.split(' ')[0]}, did the ${s.o} ${s.b} each second?`;return g(q,String(rate),[String(rate),String(rate*2),String(Math.floor(rate/2)),String(init-rem)]);},
      ()=>{const S=[{i:'commercial fishing boat',c:'rent',u:'hours'},{i:'moving truck',c:'rent',u:'days'},{i:'recording studio',c:'book',u:'hours'}];const s=getEl(S);const b=R(400,1200,50);const k=R(2,5);const r=R(30,90,5);const t=b+r*R(3,10);const ans=`${b} + ${r}(<i>t</i> - ${k}) = ${t}`;const q=`The cost to ${s.c} a ${s.i} from a company is $${b} for the first ${k} ${s.u} and an additional $${r} for each unit of time after the first ${k} ${s.u}. If the total cost to ${s.c} the ${s.i} for <i>t</i> ${s.u}, where <i>t</i> > ${k}, is $${t}, which equation represents this situation?`;return g(q,ans,[ans,`${b}(<i>t</i> - ${k}) + ${r}<i>t</i> = ${t}`,`${b} + ${r}<i>t</i> = ${t}`,`${b} + ${r}(${k}<i>t</i>) = ${t}`]);},
      ()=>{const S=[{i:'tape dispensers',v:'created and sold',r:'revenue',c:'cost'},{i:'custom mugs',v:'produced and sold',r:'revenue',c:'cost'},{i:'handmade candles',v:'made and sold',r:'revenue',c:'cost'}];const s=getEl(S);const r=(R(150,450)/100).toFixed(2);const b=R(2000,8000,100);const p=R(5000,15000,500);const q=`A company calculates its monthly profit, in dollars, by subtracting its fixed monthly ${s.c}s from its monthly sales ${s.r}. The equation ${p} = ${r}<i>x</i> - ${b} represents this situation for a month where <i>x</i> ${s.i} are ${s.v}. Which statement is the best interpretation of ${r}<i>x</i> in this context?`;const ans=`The monthly sales ${s.r}, in dollars, from selling <i>x</i> ${s.i}`;return g(q,ans,[ans,`The monthly sales ${s.r}, in dollars, from each item sold`,`The monthly ${s.c}, in dollars, of creating each item`,`The monthly ${s.c}, in dollars, of creating <i>x</i> ${s.i}`]);},
      ()=>{const den=R(3,11);const a=R(2,8);const b=a*den;const c=R(20,95);const q=`-${a}<i>x</i> + ${b}<i>px</i> = ${c}<br><br>In the given equation, <i>p</i> is a constant. The equation has no solution. What is the value of <i>p</i>?`;const ans=`<f>1/${den}</f>`;return g(q,ans,[ans,`<f>1/${b}</f>`,`<f>${den}/1</f>`,String(a)]);},
      ()=>{const C=R(2,5);const k_num=R(4,15);const num=C*k_num;let den=R(5,21,2);while(k_num%den===0)den+=2;const D=R(20,50);const E=R(11,29,2);const q=`${C}(<i>kx</i> - <i>n</i>) = <f>${num}/${den}</f><i>x</i> - <f>${D}/${E}</f><br><br>In the given equation, <i>k</i> and <i>n</i> are constants and <i>n</i> > 1. The equation has no solution. What is the value of <i>k</i>?`;const ans=`<f>${k_num}/${den}</f>`;return g(q,ans,[ans,`<f>${num}/${den}</f>`,`<f>${k_num*C}/${den}</f>`,`<f>${den}/${k_num}</f>`]);},
      ()=>{const x=R(15,45);const p=R(20,60);const L=2*x+p;const q=`A line segment that has a length of ${L} centimeters (cm) is divided into three parts. One part is ${p} cm long. The other two parts have lengths that are equal to each other. What is the length, in cm, of one of the other two parts of equal length?`;return g(q,x);},
      () => { const a=R(4,9), b=R(3,8), k=R(3,6), u=R(5,14); const rhs=(a*k - b)*u; return g(`${a}<i>k</i>(${b}<i>x</i> - ${a}) - ${b}(${b}<i>x</i> - ${a}) = ${rhs}<br><br>In the given equation, <i>k</i> = ${k}. What is the value of ${2*b}<i>x</i> - ${2*a}?`, String(2*u), [String(2*u), String(u), String(u + a), String(2*u + 2*a)]); },
      ()=>{const m=R(3,8),n=R(2,7),x=R(4,12),b=R(5,20),a=m*x-b-n*x;return g(`If ${m}(<i>x</i> + ${b}) = ${n}<i>x</i> + ${m*b+a+b}, what is the value of <i>x</i>?`,String(x),[String(x),String(x+b),String(Math.abs(x-m)),String(x*2)]);},
      ()=>{const a=R(3,9),b=R(2,8),k=R(2,6),A=a*k,B=b*k;return g(`<f>${a}(<i>x</i> + ${b})/${k}</f> = <f><i>c</i><i>x</i> + <i>d</i>/${k*k}</f><br><br>The given equation has infinitely many solutions, where <i>c</i> and <i>d</i> are constants. What is the value of <i>c</i> + <i>d</i>?`,A+A*b);},
      ()=>{const d1=R(3,7),d2=R(2,6,d1),k=R(2,9),x=d1*k-d2*k;const c1=R(2,8),v=R(3,10),rhs=(v*d1-v*d2);return grid(`If <f><i>x</i> - ${c1}/${d2}</f> = <f><i>x</i> - ${c1}/${d1}</f>, what is the value of <i>x</i>?`,c1);},
      ()=>{const S=[{w:'an electrician',f:'service call fee',u:'hour'},{w:'an IT consultant',f:'setup fee',u:'hour'},{w:'a landscape designer',f:'consultation fee',u:'hour'}];const s=getEl(S),f=R(45,95,5),r=R(35,85,5),h1=R(2,5),h2=h1+R(3,6),t1=f+r*h1,t2=f+r*h2;return g(`When hired for a job, ${s.w} charges a fixed ${s.f} plus an hourly rate. A ${h1}-${s.u} job costs $${t1}, and a ${h2}-${s.u} job costs $${t2}. What is the fixed ${s.f}, in dollars?`,f);},
      () => { const r1=R(18,32), r2=r1+R(12,24), t1=R(3,7), t2=R(4,9), totD=r1*t1+r2*t2, totT=t1+t2; return g(`An autonomous cargo vessel travels a total of ${totD} nautical miles in ${totT} hours. During the first part of the voyage through a canal, it averages ${r1} knots (nautical miles per hour), and in open water it averages ${r2} knots. How many nautical miles did the vessel travel in open water?`, String(r2*t2), [String(r2*t2), String(r1*t1), String(t2), String((r1+r2)*t2)]); },
      ()=>{const n=R(3,7),s1=R(15,45),tot=n*s1+n*(n-1);return g(`The sum of ${n} consecutive odd integers is ${tot}. What is the smallest of these integers?`,s1);},
      ()=>{const a=R(3,9),b=R(4,12),c=R(2,8),k=a+b;return g(`${a}(<i>x</i> - ${c}) + ${b}(<i>x</i> + ${c}) = <i>k</i><i>x</i> + ${c*(b-a)+5}<br><br>In the given equation, <i>k</i> is a constant. If the equation has no solution, what is the value of <i>k</i>?`,k);},
      ()=>{const a=R(11,39),b=R(14,64),k=R(4,12);return grid(`${a}(<i>x</i> - ${b}) = ${a*k}(<i>x</i> - ${b})<br><br>What is the solution <i>x</i> to the given equation?`,b);},
      ()=>{const p=R(4,15),q=R(5,19,p),m=R(12,55),ans=p+q;return g(`If (${p}<i>x</i> + ${m}) - (${q}<i>x</i> - ${m}) = (<i>k</i> - ${2*q})<i>x</i> + ${2*m} is true for all values of <i>x</i>, what is the value of the constant <i>k</i>?`,ans);},
      () => { const a=R(3,9), b=R(4,12), k=R(2,6), c=a*k, d=b*k+R(5,19); return g(`<f>${a}<i>x</i> - ${b}/4</f> - <f>${c}<i>x</i> - ${d}/${4*k}</f> = <f><i>m</i>/${4*k}</f><br><br>In the given equation, <i>m</i> is a constant. If the equation has infinitely many solutions, what is the value of <i>m</i>?`, d - b*k); },
      () => { const p=R(3,8), q=R(4,11), r=R(2,7), x=R(5,18); const rhs = p*(x+q) - r*(x-q); return g(`${p}(<i>x</i> + ${q}) - ${r}(<i>x</i> - ${q}) = ${rhs}<br><br>Based on the given equation, what is the value of (<i>x</i> + ${q}) - (<i>x</i> - ${q}) + <i>x</i>?`, 2*q + x); },
      () => { const k=R(4,12), m=R(3,9), n=R(15,45); const fig = gSvg(250, 95, `<line x1="25" y1="50" x2="225" y2="50" stroke="#0f2b4a" stroke-width="3"/><circle cx="25" cy="50" r="4.5" fill="#1f9d8a"/><circle cx="115" cy="50" r="4.5" fill="#e74c3c"/><circle cx="225" cy="50" r="4.5" fill="#1f9d8a"/><text x="25" y="34" font-size="12" font-weight="bold" fill="#0f2b4a" text-anchor="middle">A</text><text x="115" y="34" font-size="12" font-weight="bold" fill="#e74c3c" text-anchor="middle">B</text><text x="225" y="34" font-size="12" font-weight="bold" fill="#0f2b4a" text-anchor="middle">C</text><text x="70" y="72" font-size="12" font-weight="bold" fill="#0f2b4a" text-anchor="middle">${k}x - ${m}</text><text x="170" y="72" font-size="12" font-weight="bold" fill="#0f2b4a" text-anchor="middle">2x + ${n}</text>`); const x=R(6,16), tot=(k+2)*x - m + n; return grid(`${fig}In the figure shown, point <i>B</i> lies on segment <i>AC</i>. If <i>AB</i> = ${k}<i>x</i> - ${m}, <i>BC</i> = 2<i>x</i> + ${n}, and the total length of <i>AC</i> is ${tot}, what is the length of segment <i>AB</i>?`, k*x - m); },
      () => { const a=R(4,11), b=R(3,9), k=R(3,7); return g(`<f>${a}(<i>x</i> - ${b})/${k}</f> + ${2*a}<i>x</i> = <i>c</i><i>x</i> - <f>${a*b}/${k}</f><br><br>In the given equation, <i>c</i> is a constant. If the equation has infinitely many solutions, what is the value of <i>c</i>?`, `<f>${a*(2*k+1)}/${k}</f>`, [`<f>${a*(2*k+1)}/${k}</f>`, `<f>${a*(2*k-1)}/${k}</f>`, `<f>${3*a}/${k}</f>`, String(2*a)]); },
      () => { const r1=R(12,28), r2=R(32,58), tTot=R(5,11), t1=R(2,tTot-2), t2=tTot-t1; const d = r1*t1 + r2*t2; return g(`A logistics drone flies for a total of ${tTot} hours in two stages. During the first stage, it flies at a constant speed of ${r1} miles per hour, and during the second stage, it flies at a constant speed of ${r2} miles per hour. If the drone covers a total distance of ${d} miles, for how many hours did it fly during the first stage?`, t1); },
      () => { const a=R(3,8), b=R(5,16), d=R(10,35); const s1 = a*b + d, s2 = a*b - d; return g(`|${a}<i>x</i> - ${a*b}| = ${d}<br><br>What is the sum of all solutions to the given equation?`, 2*b); },
      () => { const a=R(2,6), b=R(4,15), c=R(3,9); return g(`If |${a}<i>x</i> + ${b}| + ${c} = 0, how many real solutions does the equation have?`, "Zero", ["Zero", "Exactly one", "Exactly two", "Infinitely many"]); },
      () => { const w=R(8,22), k=R(2,4), pad=R(3,9); const l=k*w+pad, perim=2*(l+w); const fig=gSvg(220,135,`<rect x="35" y="25" width="150" height="80" fill="#f0fbf8" stroke="#0f2b4a" stroke-width="2.5"/><text x="110" y="20" font-size="12" font-weight="bold" fill="#0f2b4a" text-anchor="middle">${k}w + ${pad}</text><text x="192" y="70" font-size="12" font-weight="bold" fill="#1f9d8a">w</text><text x="110" y="70" font-size="12" font-weight="bold" fill="#e74c3c" text-anchor="middle">Perimeter = ${perim}</text>`); return g(`${fig}The rectangle shown has a width of <i>w</i> feet, a length of ${k}<i>w</i> + ${pad} feet, and a perimeter of ${perim} feet. What is the length, in feet, of the rectangle?`, l); },
      () => { const a=R(5,14), b=R(6,19), m=R(3,8); const u=R(4,12); const rhs = a*u + m*u; return grid(`${a}(3<i>x</i> - ${b}) + ${m}(3<i>x</i> - ${b}) = ${rhs}<br><br>Based on the equation above, what is the value of 6<i>x</i> - ${2*b}?`, 2*u); },
      () => { const d1=R(3,6), d2=d1+1, k=R(2,7); const x = d1*d2*k; const rhs = k*(d1+d2) + k; return g(`<f><i>x</i>/${d1}</f> + <f><i>x</i>/${d2}</f> - <f><i>x</i>/${d1*d2}</f> = ${k*(d1+d2-1)}<br><br>What value of <i>x</i> satisfies the given equation?`, x); },
      () => { const p=R(4,11), q=R(3,9), k=p*q; return g(`If <f>1/<i>R</i></f> = <f>1/${p}</f> + <f>1/${q}</f> + <f>1/<i>x</i></f>, which expression represents <i>x</i> in terms of <i>R</i>, assuming all denominators are nonzero?`, `<f>${k}<i>R</i>/${k} - ${p+q}<i>R</i></f>`, [`<f>${k}<i>R</i>/${k} - ${p+q}<i>R</i></f>`, `<f>${k} - ${p+q}<i>R</i>/${k}<i>R</i></f>`, `<i>R</i> - ${p+q}`, `<f>${p+q}<i>R</i>/${k}</f>`]); },
      () => { const c1=15, c2=40, v1=R(3,9)*10, v2=R(3,9)*10; const totM = (c1*v1 + c2*v2)/100; return g(`A laboratory technician mixes ${v1} milliliters of a ${c1}% acid solution with <i>x</i> milliliters of a ${c2}% acid solution. If the resulting mixture contains a total of ${totM} milliliters of pure acid, what is the value of <i>x</i>?`, v2); },
      () => { const a=R(3,9), b=R(4,11), c=R(5,14); const k = a*b - c; return g(`${a}(<i>bx</i> - ${c}) = ${c}<i>x</i> + 18<br><br>In the given equation, <i>b</i> is a constant. If the equation has no solution for <i>x</i>, and <i>b</i> = <f><i>n</i>/${a}</f>, what is the value of <i>n</i>?`, c); },
      () => { const x=R(8,24), d=R(3,7); const s = x + (x+d) + (x+2*d) + (x+3*d); return grid(`Four consecutive terms of an arithmetic sequence have a common difference of ${d} and a sum of ${s}. What is the greatest of these four terms?`, x + 3*d); },
      () => { const base=R(60,150,10), r1=R(12,24), r2=r1+R(8,16), thr=R(20,40,5), extra=R(10,30,5); const tot = base + r1*thr + r2*extra; return g(`An industrial electricity plan charges a $${base} monthly facility fee, plus $${r1} per megawatt-hour (MWh) for the first ${thr} MWh used, and $${r2} per MWh for all usage exceeding ${thr} MWh. If a factory's monthly bill was $${tot}, how many total megawatt-hours did the factory use that month?`, thr + extra); },
      () => { const a=R(4,12), b=R(5,15), x=R(3,9); const tbl=`<table style="margin:10px auto;border-collapse:collapse;text-align:center;width:250px;border:1px solid var(--line)"><tr style="background:var(--panel2)"><th style="padding:6px;border:1px solid var(--line)">Expression A</th><th style="padding:6px;border:1px solid var(--line)">Expression B</th></tr><tr><td style="padding:6px;border:1px solid var(--line)">${a}(<i>x</i> + ${b})</td><td style="padding:6px;border:1px solid var(--line)">2<i>x</i> + ${(a-2)*x + a*b}</td></tr></table>`; return g(`${tbl}For what value of <i>x</i> do Expression A and Expression B in the table above have the exact same value?`, x); },
      () => { const p=R(3,8), q=R(4,10), r=R(5,12); const x = q + r; return g(`<f><i>x</i> - ${q}/${p}</f> = <f><i>x</i> - ${q} - ${r}/${p} - 1</f> - ${r}<br><br>If <f><i>x</i> - ${q}/${p}</f> = ${r}, what is the value of <i>x</i>?`, p*r + q); },
      () => { const a=R(5,15), b=R(4,12), k=R(3,7); return grid(`If ${a}<i>x</i> - ${b} = ${k}(${a}<i>x</i> - ${b}) - ${(k-1)*18}, what is the value of ${a}<i>x</i> - ${b}?`, 18); },
      () => { const m=R(3,8), n=R(4,11), p=R(12,36); return g(`In the equation ${m}(<i>kx</i> + ${n}) = ${p}<i>x</i> + ${m*n + 7}, <i>k</i> is a constant. For what value of <i>k</i> does the equation have no solution?`, `<f>${p}/${m}</f>`, [`<f>${p}/${m}</f>`, `<f>${m}/${p}</f>`, `<f>-${p}/${m}</f>`, String(p*m)]); },
      () => { const v1=R(15,35), v2=v1+R(10,25), t=R(3,8); const d = (v1+v2)*t; return g(`Two autonomous rovers start ${d} meters apart and drive directly toward each other along a straight test track. Rover A moves at ${v1} meters per minute and Rover B moves at ${v2} meters per minute. After how many minutes will the two rovers meet?`, t); }
    ],
    // === Topic 1: Linear functions ===
    [
      () => { const m=R(3,7), b=R(-12,12,0), c=R(2,5), d=R(3,9); const x0=R(2,6); const val = m*(c*x0 + d) + b; return g(`The linear function <i>f</i> satisfies <i>f</i>(<i>x</i>) = ${m}<i>x</i> + <i>b</i>, and the linear function <i>g</i> is defined by <i>g</i>(<i>x</i>) = ${c}<i>x</i> + ${d}. If <i>f</i>(<i>g</i>(${x0})) = ${val}, what is the value of <i>f</i>(0) + <i>g</i>(0)?`, String(b + d), traps(b + d)); },
      () => { const m=R(2,6), b=R(4,18), k=R(3,7); const y1=m*2+b, y2=m*5+b; return g(`For a linear function <i>f</i>, the graph of <i>y</i> = <i>f</i>(<i>x</i>) passes through (2, ${y1}) and (5, ${y2}). A second function <i>h</i> is defined by <i>h</i>(<i>x</i>) = <i>f</i>(<i>x</i> - ${k}) + ${2*k}. What is the <i>y</i>-intercept of the graph of <i>y</i> = <i>h</i>(<i>x</i>)?`, String(b - m*k + 2*k), [String(b - m*k + 2*k), String(b + m*k + 2*k), String(b - m*k), String(b + 2*k)]); },
      () => { const a=R(2,5), b=R(3,11), x=R(4,9); const rhsM = a*a, rhsB = a*b + b; return g(`A linear function <i>f</i> with positive slope satisfies <i>f</i>(<i>f</i>(<i>x</i>)) = ${rhsM}<i>x</i> + ${rhsB} for all real numbers <i>x</i>. What is the value of <i>f</i>(${x})?`, String(a*x + b), [String(a*x + b), String(rhsM*x + rhsB), String(a*x - b), String((a+1)*x + b)]); },
      () => { const m=R(3,8), b=R(10,30), w=R(4,9); const ans = (w - b)/m; const yTarget = m*w + b; return g(`The linear function <i>f</i> is defined by <i>f</i>(<i>x</i>) = ${m}<i>x</i> + ${b}. If <i>f</i><sup>-1</sup>(<i>k</i>) = ${w}, where <i>f</i><sup>-1</sup> is the inverse of <i>f</i>, what is the value of <i>f</i>(${w}) + <i>k</i>?`, String(2*yTarget), [String(2*yTarget), String(yTarget), String(yTarget + w), String(2*w + b)]); },
      () => {
        const names = ['Juan', 'Alex', 'Maria', 'David', 'Elena', 'Carlos'];
        const activities = [
            { act: 'rides his bike', unit: 'minutes per mile', dist: 'miles' },
            { act: 'runs', unit: 'minutes per kilometer', dist: 'kilometers' },
            { act: 'jogs', unit: 'minutes per mile', dist: 'miles' },
            { act: 'swims', unit: 'minutes per lap', dist: 'laps' }
        ];
        const name = getEl(names);
        const activityObj = getEl(activities);
        const whole = R(2, 9);
        const dec = R(1, 9);
        const rate = whole + dec / 10;
        const templates = [
            `For a training program, ${name} ${activityObj.act} at an average rate of <strong>${rate}</strong> ${activityObj.unit}. Which function <em>m</em> models the number of minutes it will take ${name} to complete <em>x</em> ${activityObj.dist} at this rate?`,
            `During a workout, ${name} ${activityObj.act} at a constant speed of <strong>${rate}</strong> ${activityObj.unit}. Which function <em>m</em> expresses the total time in minutes it takes to cover <em>x</em> ${activityObj.dist}?`,
            `${name} ${activityObj.act} at a rate of <strong>${rate}</strong> ${activityObj.unit}. Which function <em>m</em> models the time required for <em>x</em> ${activityObj.dist}?`
        ];
        const q = getEl(templates);
        const correct = `<em>m</em>(<em>x</em>) = ${rate}<em>x</em>`;
        const wrong1 = `<em>m</em>(<em>x</em>) = <f>x/${rate}</f>`;
        const wrong2 = `<em>m</em>(<em>x</em>) = <em>x</em> + ${rate}`;
        const wrong3 = `<em>m</em>(<em>x</em>) = <em>x</em> - ${rate}`;
        return g(q, correct, [correct, wrong1, wrong2, wrong3]);
    },
    ()=>{const S=[{p:'a plumber',c:'charge',u:'hours',a:'hourly rate',b:'onetime fee'},{p:'a mechanic',c:'cost',u:'hours',a:'hourly rate',b:'diagnostic fee'},{p:'a delivery service',c:'fee',u:'miles',a:'rate per mile',b:'base flat fee'}];const s=getEl(S);const q=`A graph in the <i>xy</i>-plane represents the total ${s.c}, in dollars, charged by ${s.p} for <i>x</i> ${s.u} of work. The ${s.p} charges a ${s.b} plus an ${s.a}. What is the best interpretation of the slope of the graph?`;const ans=`The ${s.p}'s ${s.a}`;return g(q,ans,[ans,`The ${s.p}'s ${s.b}`,`The total ${s.c} for 1 ${s.u}`,`The total ${s.c} for 0 ${s.u}`]);},
    ()=>{const S=[{e:'a solar panel',y:'power',yu:'watts',x:'time',xu:'hours'},{e:'a wind turbine',y:'energy',yu:'joules',x:'wind speed',xu:'mph'},{e:'a cooling system',y:'temperature drop',yu:'degrees',x:'time',xu:'minutes'}];const s=getEl(S);const a=R(1500,8500,15);const y1=R(300,950,5);const k=R(4,18);const x2=a+k*R(10,60);const y2=y1+(x2-a)/k;const q=`For ${s.e}, the linear function <i>f</i> gives the predicted ${s.y}, in ${s.yu}, for ${s.x}s between 1,000 and 9,000 ${s.xu}. According to this function, the predicted ${s.y} is ${y1} ${s.yu} at a ${s.x} of ${a} ${s.xu} and ${y2} ${s.yu} at a ${s.x} of ${x2} ${s.xu}. The equation <i>f</i>(<i>x</i>) = <f>1/${k}</f>(<i>x</i> - <i>a</i>) + ${y1} defines <i>f</i>, where <i>x</i> is the ${s.x}, in ${s.xu}, and <i>a</i> is a constant. What is the value of <i>a</i>?`;return g(q,a);},
    () => {
        const items = ['carpet cleaner', 'pressure washer', 'generator', 'tile saw'];
        const name = getEl(items);
        const add = R(15, 35);
        const base = add + R(20, 40);
        const q = `The cost of renting a ${name} is $${base} for the first day and$${add} for each additional day. Which of the following functions gives the cost <em>C</em>(<em>d</em>), in dollars, of renting the ${name} for <em>d</em> days, where <em>d</em> is a positive integer?`;
        const correct = `<em>C</em>(<em>d</em>) = ${add}<em>d</em> +${base - add}`;
        const w1 = `<em>C</em>(<em>d</em>) = ${add}<em>d</em> +${base}`;
        const w2 = `<em>C</em>(<em>d</em>) = ${base}<em>d</em> -${add}`;
        const w3 = `<em>C</em>(<em>d</em>) = ${base}<em>d</em> +${add}`;
        return g(q, correct, [correct, w1, w2, w3]);
    },
    ()=>{const S=[{v:'volume of liquid',u:'milliliters',c:'a leaking industrial tank',a:'draining from the tank'},{v:'charge level',u:'milliampere-hours',c:'a large battery',a:'depleting from the battery'},{v:'mass of fuel',u:'kilograms',c:'a rocket booster',a:'burning away'}];const s=getEl(S);const b=R(2000,15000,100);const m=R(15,85);return g(`The function <i>w</i> models the ${s.v}, in ${s.u}, in ${s.c} <i>t</i> seconds after it begins. The function is <i>w</i>(<i>t</i>) = ${b} - ${m}<i>t</i>. According to the model, what is the predicted ${s.v}, in ${s.u}, ${s.a} each second?`,String(m),[String(m),String(b),String(b-m),String(b+m)]);},
    ()=>{const m=R(3,15);const c=R(1,8);let a=R(2,12);while(a===c)a=R(2,12);const k=R(2,20);const f_a=m*a+k*(a-c);const b=R(15,35);const ans=m*b+k*(b-c);return g(`The function <i>f</i> is defined by <i>f</i>(<i>x</i>) = ${m}<i>x</i> + <i>k</i>(<i>x</i> - ${c}), where <i>k</i> is a constant, and <i>f</i>(${a}) = ${f_a}. What is the value of <i>f</i>(${b})?`,ans);},
    ()=>{const S=[{p:'a freelance developer',j:'coding',p2:'software licenses',u:'hour'},{p:'an industrial moving crew',j:'heavy lifting',p2:'truck rental',u:'hour'},{p:'a consulting firm',j:'analysis',p2:'initial audit',u:'day'}];const s=getEl(S);const m=R(80,350,10);const b=R(150,800,25);const correct=`<i>f</i>(<i>x</i>) = ${m}<i>x</i> + ${b}`;return g(`To hire ${s.p}, the charge is $${m} per ${s.u} for ${s.j} plus a fixed cost of $${b} for ${s.p2}. Which function <i>f</i> represents the total amount, in dollars, charged for a job taking <i>x</i> ${s.u}s?`,correct,[correct,`<i>f</i>(<i>x</i>) = <i>x</i> + ${b}`,`<i>f</i>(<i>x</i>) = ${m}<i>x</i>`,`<i>f</i>(<i>x</i>) = ${m}<i>x</i> - ${b}`]);},
    ()=>{const S=[{v:'A train',o:'a station',m:'meters',t:'seconds'},{v:'A drone',o:'a launch pad',m:'feet',t:'seconds'},{v:'A cyclist',o:'a crosswalk',m:'yards',t:'minutes'}];const s=getEl(S);const r=R(25,125,5);const t=R(3,18);const q=`${s.v} is traveling at a constant speed along a straight path. The equation <i>d</i> = ${r}<i>t</i> gives the distance <i>d</i>, in ${s.m} from ${s.o}, that the vehicle will be <i>t</i> ${s.t} after passing the mark. How many ${s.m} from the mark will it be ${t} ${s.t} after passing it?`;return g(q,String(r*t),[String(r*t),String(r),String(r+t),String(r*t+r)]);},
    ()=>{const m=R(25,150,5);const b=R(200,900,50);const x=R(5,25);const q=`A manufacturing plant produces ${b} units initially and then produces ${m} units per hour. The function <i>P</i>(<i>t</i>) = ${m}<i>t</i> + ${b} models the total units produced after <i>t</i> hours. How many units are produced after ${x} hours?`;return g(q,m*x+b);},
    ()=>{const S=[{c:'a banquet hall',f:'reservation fee',r:'cost per guest'},{c:'a software service',f:'setup fee',r:'monthly subscription'},{c:'an equipment rental',f:'deposit',r:'daily rate'}];const s=getEl(S);const m=R(25,185,5);const b=R(200,800,25);const q=`The total cost <i>C</i>, in dollars, to use ${s.c} is given by the equation <i>C</i> = ${m}<i>x</i> + ${b}, where <i>x</i> is the number of units used. What is the best interpretation of the number ${b} in this context?`;const ans=`The ${s.f} for the service`;return g(q,ans,[ans,`The ${s.r} for the service`,`The total cost for 1 unit`,`The number of units used`]);},
    ()=>{const S=[{e:'marine biologists',i:'coral reefs',x:'water depth',y:'fish species count'},{e:'agricultural scientists',i:'wheat fields',x:'nitrogen level',y:'crop yield'},{e:'meteorologists',i:'cloud formations',x:'atmospheric pressure',y:'precipitation rate'}];const s=getEl(S);const m=(R(15,125)/100).toFixed(2);const b=(R(20,150)/10).toFixed(1);const x=R(50,250);const ans=Math.round(parseFloat(m)*x+parseFloat(b));return g(`${s.e.charAt(0).toUpperCase()+s.e.slice(1)} analyzed ${s.i}. The equation <i>y</i> = ${m}<i>x</i> + ${b} gives the predicted ${s.y}, <i>y</i>, when the ${s.x} is <i>x</i>. If one sample has a ${s.x} of ${x}, which of the following is closest to the predicted ${s.y}?`,String(ans),[String(ans),String(Math.round(parseFloat(m)*(x+20)+parseFloat(b))),String(Math.round(parseFloat(m)*x)),String(Math.round(parseFloat(b)))]);},
    ()=>{const S=[{o:'a redwood sapling',u:'inches',t:'months'},{o:'a stalactite',u:'millimeters',t:'years'},{o:'an investment portfolio',u:'thousands of dollars',t:'quarters'}];const s=getEl(S);const m=R(5,25);const b=R(15,120);const correct=`The estimated measurement of the ${s.o} was ${b} ${s.u} when it was first recorded.`;return g(`The function <i>f</i>(<i>x</i>) = ${m}<i>x</i> + ${b} gives the estimated measurement, in ${s.u}, of ${s.o} <i>x</i> ${s.t} after it was first recorded. Which statement is the best interpretation of ${b} in this context?`,correct,[correct,`The measurement of the ${s.o} increases by ${b} ${s.u} each ${s.t}.`,`The ${s.o} will be measured for ${b} ${s.t}.`,`The ${s.o} reaches a maximum measurement of ${b} ${s.u}.`]);},
    ()=>{const a=R(5,25);const b=R(2,12);const x=R(10,40);const c=R(4,20);const d=a*(b*x+c);return g(`The function <i>f</i> is defined by <i>f</i>(<i>x</i>) = ${a}(${b}<i>x</i> + ${c}). For what value of <i>x</i> does <i>f</i>(<i>x</i>) = ${d}?`,String(x),[String(x),String(x+R(2,5)),String(Math.abs(x-R(3,6))),String(x*2)]);},
    ()=>{const b=R(15,85);const m=R(4,24);const x=R(5,25);const y=m*x+b;const correct=`<i>f</i>(<i>x</i>) = ${m}<i>x</i> + ${b}`;return g(`In the <i>xy</i>-plane, the graph of the linear function <i>f</i> contains the points (0, ${b}) and (${x}, ${y}). Which equation defines <i>f</i>, where <i>y</i> = <i>f</i>(<i>x</i>)?`,correct,[correct,`<i>f</i>(<i>x</i>) = ${m}<i>x</i> - ${b}`,`<i>f</i>(<i>x</i>) = ${b}<i>x</i> + ${m}`,`<i>f</i>(<i>x</i>) = ${m}<i>x</i>`]);},
      () => { const r1=R(12,25), r2=r1+R(6,14), thr=R(100,250,50), extra=R(40,120,20); const base=R(45,95,5); const bill = base + r1*thr + r2*extra; return g(`A cloud computing platform charges a monthly base fee of $${base}, plus $${r1} per terabyte for the first ${thr} terabytes of data processed, and $${r2} per terabyte for all data exceeding ${thr} terabytes. If a company's total monthly charge is $${bill.toLocaleString()}, how many total terabytes of data did the company process?`, String(thr + extra), [String(thr + extra), String(extra), String(thr + extra + 20), String(Math.round(bill / r2))]); },
    () => { const m=(R(15,45)/10).toFixed(1), x=R(10,25); return grid(`A bamboo plant grows ${m} inches per week. If it is currently ${x} inches tall, how tall will it be in 6 weeks?`, (parseFloat(x)+6*parseFloat(m)).toFixed(1)); },
      () => { const m=R(-6,-2), x1=R(2,5), x2=x1+R(4,8), b=R(30,70); const f1=m*x1+b, f2=m*x2+b; return g(`For the linear function <i>f</i>, <i>f</i>(${x1}) = ${f1} and <i>f</i>(${x2}) = ${f2}. If the graph of <i>y</i> = <i>f</i>(<i>x</i>) intersects the <i>x</i>-axis at (<i>a</i>, 0) and the <i>y</i>-axis at (0, <i>c</i>), what is the value of <i>c</i> - ${Math.abs(m)}<i>a</i>?`, "0", ["0", String(b), String(2*b), String(-b)]); },
    () => { const start=R(1500,3000,100), rate=R(25,75,5); return g(`A water tank holds ${start} gallons. It drains at a rate of ${rate} gal/min. How many gallons remain after 15 minutes?`, start-15*rate); },
    // 23. SVG-график: найти уравнение линейной функции f(x) по графику
    () => {
      const m = getEl([-3, -2, -1, 1, 2, 3]);
      const b = R(-4, 4, 0);
      const x1 = -10, y1 = m * x1 + b, x2 = 10, y2 = m * x2 + b;
      const graph = svg(`<line x1="${tX(x1)}" y1="${tY(y1)}" x2="${tX(x2)}" y2="${tY(y2)}" stroke="#22a381" stroke-width="3"/><circle cx="${tX(0)}" cy="${tY(b)}" r="4" fill="#0f2b4a"/><circle cx="${tX(1)}" cy="${tY(m+b)}" r="4" fill="#0f2b4a"/>`);
      const sign = b > 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
      const oppSign = b > 0 ? `- ${b}` : `+ ${Math.abs(b)}`;
      const ans = `<i>f</i>(<i>x</i>) = ${m}<i>x</i> ${sign}`;
      return g(`${graph}The graph of the linear function <i>f</i> is shown in the <i>xy</i>-plane above, where each grid line represents 1 unit. Which equation defines <i>f</i>?`, ans, [
        ans,
        `<i>f</i>(<i>x</i>) = ${-m}<i>x</i> ${sign}`,
        `<i>f</i>(<i>x</i>) = ${m}<i>x</i> ${oppSign}`,
        `<i>f</i>(<i>x</i>) = ${b}<i>x</i> ${m > 0 ? '+' : '-'} ${Math.abs(m)}`
      ]);
    },
    // 24. SVG-график: найти значение f(k) + f(0) по графику прямой
    () => {
      const m = getEl([-2, -1, 1, 2]);
      const b = R(-3, 3, 0);
      const k = R(2, 4);
      const x1 = -10, y1 = m * x1 + b, x2 = 10, y2 = m * x2 + b;
      const graph = svg(`<line x1="${tX(x1)}" y1="${tY(y1)}" x2="${tX(x2)}" y2="${tY(y2)}" stroke="#2b7f9c" stroke-width="3"/><circle cx="${tX(0)}" cy="${tY(b)}" r="4" fill="#e74c3c"/><circle cx="${tX(k)}" cy="${tY(m*k+b)}" r="4" fill="#e74c3c"/>`);
      const ans = (m * k + b) + b;
      return g(`${graph}The graph of <i>y</i> = <i>f</i>(<i>x</i>) is shown in the <i>xy</i>-plane, where each grid square represents 1 unit. What is the value of <i>f</i>(${k}) + <i>f</i>(0)?`, ans);
    },
    // 25. HTML-таблица: дана таблица для f(x), найти y-intercept функции g(x) = f(x) + k
    () => {
      const m = R(3, 9), b = R(-12, 15, 0), k = R(5, 18);
      const x1 = R(1, 3), x2 = x1 + R(2, 4), x3 = x2 + R(2, 4);
      const tbl = `<table style="margin:12px auto;border-collapse:collapse;text-align:center;width:240px;border:1px solid var(--line)"><tr style="background:var(--panel2)"><th style="padding:6px;border:1px solid var(--line)"><i>x</i></th><th style="padding:6px;border:1px solid var(--line)"><i>f</i>(<i>x</i>)</th></tr><tr><td style="padding:6px;border:1px solid var(--line)">${x1}</td><td style="padding:6px;border:1px solid var(--line)">${m*x1+b}</td></tr><tr><td style="padding:6px;border:1px solid var(--line)">${x2}</td><td style="padding:6px;border:1px solid var(--line)">${m*x2+b}</td></tr><tr><td style="padding:6px;border:1px solid var(--line)">${x3}</td><td style="padding:6px;border:1px solid var(--line)">${m*x3+b}</td></tr></table>`;
      const ans = `(0, ${b + k})`;
      return g(`${tbl}For the linear function <i>f</i>, the table shows three values of <i>x</i> and their corresponding values of <i>f</i>(<i>x</i>). Function <i>g</i> is defined by <i>g</i>(<i>x</i>) = <i>f</i>(<i>x</i>) + ${k}. What is the <i>y</i>-intercept of the graph of <i>y</i> = <i>g</i>(<i>x</i>) in the <i>xy</i>-plane?`, ans, [
        ans,
        `(0, ${b})`,
        `(0, ${m + k})`,
        `(0, ${b - k})`
      ]);
    },
    // 26. HTML-таблица: в таблице даны значения g(x) = f(x) - c, найти наклон (slope) самой f(x)
    () => {
      const m = R(4, 14), b = R(10, 40), c = R(5, 15);
      const x1 = 2, x2 = 5, x3 = 8;
      const tbl = `<table style="margin:12px auto;border-collapse:collapse;text-align:center;width:260px;border:1px solid var(--line)"><tr style="background:var(--panel2)"><th style="padding:6px;border:1px solid var(--line)"><i>x</i></th><th style="padding:6px;border:1px solid var(--line)"><i>f</i>(<i>x</i>) − ${c}</th></tr><tr><td style="padding:6px;border:1px solid var(--line)">${x1}</td><td style="padding:6px;border:1px solid var(--line)">${m*x1+b-c}</td></tr><tr><td style="padding:6px;border:1px solid var(--line)">${x2}</td><td style="padding:6px;border:1px solid var(--line)">${m*x2+b-c}</td></tr><tr><td style="padding:6px;border:1px solid var(--line)">${x3}</td><td style="padding:6px;border:1px solid var(--line)">${m*x3+b-c}</td></tr></table>`;
      return g(`${tbl}The table shows three values of <i>x</i> and their corresponding values of <i>f</i>(<i>x</i>) − ${c} for the linear function <i>f</i>. What is the slope of the graph of <i>y</i> = <i>f</i>(<i>x</i>) in the <i>xy</i>-plane?`, m);
    },
    // 27. Сдвиг графика функции (Function transformations): g(x) = f(x - h) + k
    () => {
      const m = R(3, 8), b = R(4, 15), h = R(2, 6), k = R(3, 10);
      const newB = b - m * h + k;
      return grid(`The linear function <i>f</i> is defined by <i>f</i>(<i>x</i>) = ${m}<i>x</i> + ${b}. The function <i>g</i> is defined by <i>g</i>(<i>x</i>) = <i>f</i>(<i>x</i> - ${h}) + ${k}. What is the <i>y</i>-coordinate of the <i>y</i>-intercept of the graph of <i>y</i> = <i>g</i>(<i>x</i>) in the <i>xy</i>-plane?`, newB);
    },
    // 28. Свойство постоянной скорости изменения: дано f(a + d) - f(a) = diff, найти f(x2) - f(x1)
    () => {
      const m = R(4, 12), d1 = R(3, 6), diff1 = m * d1;
      const x1 = R(10, 25), d2 = R(7, 15), x2 = x1 + d2, ans = m * d2;
      return g(`For the linear function <i>f</i>, <i>f</i>(<i>x</i> + ${d1}) - <i>f</i>(<i>x</i>) = ${diff1} for all values of <i>x</i>. What is the value of <i>f</i>(${x2}) - <i>f</i>(${x1})?`, ans);
    },
    // 29. Композиция линейных функций: f(g(x))
    () => {
      const a = R(2, 5), b = R(3, 9), c = R(2, 6), d = R(4, 11);
      const A = a * c, B = a * d + b;
      const ans = `<i>h</i>(<i>x</i>) = ${A}<i>x</i> - ${a * d - b}`;
      const signB = (-a * d + b) >= 0 ? `+ ${-a * d + b}` : `- ${Math.abs(-a * d + b)}`;
      const realAns = `<i>h</i>(<i>x</i>) = ${A}<i>x</i> ${signB}`;
      return g(`The functions <i>f</i> and <i>g</i> are defined by <i>f</i>(<i>x</i>) = ${a}<i>x</i> + ${b} and <i>g</i>(<i>x</i>) = ${c}<i>x</i> - ${d}. If the function <i>h</i> is defined by <i>h</i>(<i>x</i>) = <i>f</i>(<i>g</i>(<i>x</i>)), which equation defines <i>h</i>?`, realAns, [
        realAns,
        `<i>h</i>(<i>x</i>) = ${A}<i>x</i> + ${a * d + b}`,
        `<i>h</i>(<i>x</i>) = ${a + c}<i>x</i> - ${d - b}`,
        `<i>h</i>(<i>x</i>) = ${A}<i>x</i> - ${d}`
      ]);
    },
    // 30. Bluebook Hard (image_10.png): Positive difference between two average rates of change of speed
    () => {
      const t1 = getEl([4, 5, 8, 10]);
      const dt2 = getEl([5, 8, 10, 20]);
      const t2 = t1 + dt2;
      const v1 = R(8, 36);
      const v2 = v1 + R(10, 48);
      const r1 = v1 / t1;
      const r2 = (v2 - v1) / dt2;
      const diff = Number(Math.abs(r1 - r2).toFixed(2));
      return g(`During the first ${t1.toFixed(2)} seconds after a car started moving, its speed increased to ${v1.toFixed(1)} meters per second. From ${t1.toFixed(2)} seconds to ${t2.toFixed(1)} seconds after the car started moving, its speed increased from ${v1.toFixed(1)} meters per second to ${v2.toFixed(1)} meters per second. To the nearest hundredth, what is the positive difference between the average rate of change of the speed of the car, in meters per second per second, during the first ${t1.toFixed(2)} seconds after the car started moving and the average rate of change of the speed of the car, in meters per second per second, from ${t1.toFixed(2)} seconds to ${t2.toFixed(1)} seconds after the car started moving?`, diff);
    },
      () => { const m=getEl([-3,-2,-1,1,2,3]), b=R(-3,3,0), k=R(2,5); const gr=svg(`<line x1="${tX(-8)}" y1="${tY(m*(-8)+b)}" x2="${tX(8)}" y2="${tY(m*8+b)}" stroke="#22a381" stroke-width="3"/><circle cx="${tX(0)}" cy="${tY(b)}" r="4.5" fill="#e74c3c"/><circle cx="${tX(2)}" cy="${tY(2*m+b)}" r="4.5" fill="#e74c3c"/>`); return g(`${gr}The graph of the linear function <i>f</i> is shown in the <i>xy</i>-plane above, where each grid line represents 1 unit. If <i>g</i>(<i>x</i>) = <i>f</i>(<i>x</i>) + ${k}, what is the value of <i>g</i>(4)?`, 4*m + b + k); },
      () => { const m=R(3,8), b=R(5,20), c=R(4,12); const x1=2, x2=5, x3=8; const tbl=`<table style="margin:10px auto;border-collapse:collapse;text-align:center;width:250px;border:1px solid var(--line)"><tr style="background:var(--panel2)"><th style="padding:6px;border:1px solid var(--line)"><i>x</i></th><th style="padding:6px;border:1px solid var(--line)"><i>f</i>(<i>x</i>) + <i>x</i></th></tr><tr><td style="padding:5px;border:1px solid var(--line)">${x1}</td><td style="padding:5px;border:1px solid var(--line)">${(m+1)*x1+b}</td></tr><tr><td style="padding:5px;border:1px solid var(--line)">${x2}</td><td style="padding:5px;border:1px solid var(--line)">${(m+1)*x2+b}</td></tr><tr><td style="padding:5px;border:1px solid var(--line)">${x3}</td><td style="padding:5px;border:1px solid var(--line)">${(m+1)*x3+b}</td></tr></table>`; return grid(`${tbl}For the linear function <i>f</i>, the table above gives three values of <i>x</i> and their corresponding values of <i>f</i>(<i>x</i>) + <i>x</i>. What is the value of <i>f</i>(0)?`, b); },
      () => { const m=R(2,6), b=R(3,14); const a=m*m, c=m*b+b; const x=R(2,6); return g(`The linear function <i>f</i> has a positive slope and satisfies <i>f</i>(<i>f</i>(<i>x</i>)) = ${a}<i>x</i> + ${c} for all real values of <i>x</i>. What is the value of <i>f</i>(${x})?`, m*x + b); },
      () => { const m=R(3,9), x0=R(4,12), b=-m*x0; return g(`For the linear function <i>f</i>, the graph of <i>y</i> = <i>f</i>(<i>x</i>) in the <i>xy</i>-plane has a slope of ${m} and passes through the point (${x0}, 0). What is the value of <i>f</i>(0)?`, b); },
      () => { const m=R(2,7), b=R(4,16), h=R(2,6); const newInt = m*h + b; return g(`The function <i>f</i> is defined by <i>f</i>(<i>x</i>) = ${m}<i>x</i> + ${b}. In the <i>xy</i>-plane, the graph of <i>y</i> = <i>g</i>(<i>x</i>) is the result of translating the graph of <i>y</i> = <i>f</i>(<i>x</i>) to the left by ${h} units. Which equation defines function <i>g</i>?`, `<i>g</i>(<i>x</i>) = ${m}<i>x</i> + ${newInt}`, [`<i>g</i>(<i>x</i>) = ${m}<i>x</i> + ${newInt}`, `<i>g</i>(<i>x</i>) = ${m}<i>x</i> + ${b - m*h}`, `<i>g</i>(<i>x</i>) = ${m}<i>x</i> + ${b + h}`, `<i>g</i>(<i>x</i>) = ${m}<i>x</i> + ${b - h}`]); },
      () => { const r=R(4,9), b=R(12,36), x0=R(3,8); const y0 = r*x0 + b; return g(`The linear function <i>f</i> is invertible. If <i>f</i>(0) = ${b} and <i>f</i>(${x0}) = ${y0}, what is the value of <i>f</i>⁻¹(${y0 + r*3})?`, x0 + 3); },
      () => { const m=R(3,8), b=R(10,30), k=R(2,5); const tbl=`<table style="margin:10px auto;border-collapse:collapse;text-align:center;width:250px;border:1px solid var(--line)"><tr style="background:var(--panel2)"><th style="padding:6px;border:1px solid var(--line)"><i>x</i></th><th style="padding:6px;border:1px solid var(--line)"><i>g</i>(<i>x</i>)</th></tr><tr><td style="padding:5px;border:1px solid var(--line)">1</td><td style="padding:5px;border:1px solid var(--line)">${k*(m*1+b)}</td></tr><tr><td style="padding:5px;border:1px solid var(--line)">3</td><td style="padding:5px;border:1px solid var(--line)">${k*(m*3+b)}</td></tr></table>`; return grid(`${tbl}The table above gives two values of the linear function <i>g</i>, where <i>g</i>(<i>x</i>) = ${k}<i>f</i>(<i>x</i>). What is the slope of the graph of <i>y</i> = <i>f</i>(<i>x</i>) in the <i>xy</i>-plane?`, m); },
      () => { const m1=R(10,25), m2=m1+R(6,18), t1=4, t2=9, b=R(40,90); const y1=b+m1*t1, y2=y1+m2*(t2-t1); return g(`A reservoir's water volume <i>V</i>(<i>t</i>), in thousands of gallons, is modeled by a piecewise linear function of time <i>t</i>, in hours. At <i>t</i> = 0, the volume is ${b}; at <i>t</i> = ${t1}, the volume is ${y1}; and at <i>t</i> = ${t2}, the volume is ${y2}. What is the positive difference between the rate of inflow, in thousands of gallons per hour, from <i>t</i> = ${t1} to <i>t</i> = ${t2} and the rate from <i>t</i> = 0 to <i>t</i> = ${t1}?`, m2 - m1); },
      () => { const a=R(3,9), b=R(4,12), d=R(5,15); return g(`For the linear function <i>h</i>, <i>h</i>(${a}) = ${b} and <i>h</i>(${a + d}) - <i>h</i>(${a}) = ${3*d}. What is the value of <i>h</i>(${a + 4*d})?`, b + 12*d); },
      () => { const xInt=R(3,8), yInt=R(4,9); const area = (xInt*yInt)/2; const gr=svg(`<line x1="${tX(-2)}" y1="${tY(yInt*(1+2/xInt))}" x2="${tX(xInt+2)}" y2="${tY(-yInt*2/xInt)}" stroke="#11676a" stroke-width="3"/><polygon points="${tX(0)},${tY(0)} ${tX(xInt)},${tY(0)} ${tX(0)},${tY(yInt)}" fill="rgba(34,163,129,0.22)"/><circle cx="${tX(xInt)}" cy="${tY(0)}" r="4" fill="#0f2b4a"/><circle cx="${tX(0)}" cy="${tY(yInt)}" r="4" fill="#0f2b4a"/>`); return g(`${gr}In the <i>xy</i>-plane above, the graph of the linear function <i>f</i>(<i>x</i>) = -<f>${yInt}/${xInt}</f><i>x</i> + ${yInt} forms a shaded right triangle with the coordinate axes. What is the area of this shaded triangle?`, area); },
      () => { const m=R(4,11), c=R(15,45); const ans = `The temperature increases by ${m} degrees Celsius for each 1-kilometer increase in depth.`; return g(`Geologists use the linear function <i>T</i>(<i>d</i>) = ${m}<i>d</i> + ${c} to model the rock temperature <i>T</i>(<i>d</i>), in degrees Celsius, at a depth of <i>d</i> kilometers beneath Earth's surface. Which statement is the best interpretation of the slope of the graph of <i>y</i> = <i>T</i>(<i>d</i>)?`, ans, [ans, `The rock temperature at the surface (<i>d</i> = 0) is ${m} degrees Celsius.`, `The depth increases by ${m} kilometers for each 1-degree Celsius increase in temperature.`, `The maximum temperature at a depth of ${c} kilometers is ${m} degrees Celsius.`]); },
      () => { const m=R(2,6), k=R(3,8), b=m*k; return grid(`The linear function <i>f</i> is defined by <i>f</i>(<i>x</i>) = ${m}<i>x</i> - ${b}. If the graph of <i>y</i> = <i>f</i>(<i>x</i>) intersects the <i>x</i>-axis at (<i>a</i>, 0) and the <i>y</i>-axis at (0, <i>c</i>), what is the value of <i>a</i> - <i>c</i>?`, k + b); },
      () => { const m=R(3,8), b=R(5,18), p=R(4,10); return g(`If <i>f</i>(<i>x</i>) = ${m}<i>x</i> + ${b} is a linear function, what is the value of <f><i>f</i>(${p + 6}) - <i>f</i>(${p})/6</f>?`, m); },
      () => { const c0=R(120,300,20), r=R(8,18), n=R(15,35); const tot = c0 + r*n; return g(`A 3D-printing bureau charges a fixed calibration fee of $${c0} plus a constant rate per cubic centimeter of titanium powder used. If an order using ${n} cubic centimeters costs $${tot}, what is the cost, in dollars, of an order using ${n + 10} cubic centimeters?`, tot + 10*r); },
      () => { const a=R(2,6), b=R(3,9), k=R(4,10); return g(`Let <i>f</i>(<i>x</i>) = ${a}<i>x</i> + ${b} and <i>g</i>(<i>x</i>) = ${b}<i>x</i> - ${a}. For what value of <i>x</i> is <i>f</i>(<i>x</i>) + <i>g</i>(<i>x</i>) = ${(a+b)*k + (b-a)}?`, k); },
      () => { const bp=100, fp=0, bF=32, m=1.8; const c=R(20,80,5); return grid(`The linear function <i>F</i>(<i>C</i>) = <f>9/5</f><i>C</i> + 32 converts a temperature of <i>C</i> degrees Celsius to <i>F</i>(<i>C</i>) degrees Fahrenheit. If the temperature of a chemical bath increases by ${c} degrees Celsius, by how many degrees Fahrenheit does it increase?`, 1.8*c); },
      () => { const m=R(3,7), x1=R(2,5), y1=R(10,25), x2=x1+R(3,6), y2=y1-m*(x2-x1); return g(`For the linear function <i>f</i>, <i>f</i>(${x1}) = ${y1} and <i>f</i>(${x2}) = ${y2}. What is the <i>y</i>-intercept of the graph of <i>y</i> = <i>f</i>(<i>x</i>) in the <i>xy</i>-plane?`, y1 + m*x1); },
      () => { const k=R(3,9), b=R(12,48); return g(`The function <i>h</i> is defined by <i>h</i>(<i>x</i>) = <f><i>x</i> - ${b}/${k}</f>. At what point (<i>x</i>, <i>y</i>) does the graph of <i>y</i> = <i>h</i>(<i>x</i>) intersect the <i>x</i>-axis?`, `(${b}, 0)`, [`(${b}, 0)`, `(0, ${b})`, `(-${b}, 0)`, `(${k}, 0)`]); },
      () => { const m=R(2,5), b=R(4,12); const sum = 5*b + m*(1+2+3+4+5); return g(`If <i>f</i>(<i>x</i>) = ${m}<i>x</i> + ${b}, what is the value of <i>f</i>(1) + <i>f</i>(2) + <i>f</i>(3) + <i>f</i>(4) + <i>f</i>(5)?`, sum); },
      () => { const p=R(3,8), q=R(10,30), r=R(2,6); return g(`The linear function <i>f</i> satisfies <i>f</i>(${r}<i>x</i>) = ${p*r}<i>x</i> + ${q} for all real numbers <i>x</i>. What is the value of <i>f</i>(4)?`, 4*p + q); }
    ],
    // === Topic 2: Linear equations in two variables ===
    [
      () => { const a=R(3,7), b=R(4,9), k=R(2,5); const c = a*b*2*k; const area = (c/a)*(c/b)/2; return g(`In the <i>xy</i>-plane, the line ${a}<i>x</i> + ${b}<i>y</i> = ${c} intersects the positive <i>x</i>-axis at point <i>A</i> and the positive <i>y</i>-axis at point <i>B</i>. If <i>O</i> is the origin, what is the area of right triangle <i>AOB</i>?`, String(area), [String(area), String(area*2), String((c/a)+(c/b)), String(area/2)]); },
      () => { const x1=R(1,5), y1=R(2,6), dx=R(2,5)*2, dy=R(2,5)*2; const x2=x1+dx, y2=y1+dy; const mx=(x1+x2)/2, my=(y1+y2)/2; const yInt = my + (dx/dy)*mx; return g(`In the <i>xy</i>-plane, line <i>L</i> is the perpendicular bisector of the line segment with endpoints (${x1}, ${y1}) and (${x2}, ${y2}). Which point lies on line <i>L</i>?`, `(${mx}, ${my})`, [`(${mx}, ${my})`, `(${x2 - x1}, ${y2 - y1})`, `(${mx + dy}, ${my + dx})`, `(${x1}, ${y2})`]); },
      () => {
        const a = (R(15, 45) / 10).toFixed(2);
        const b = (R(5, 25) / 10).toFixed(2);
        const x = R(8, 25);
        const y = R(10, 30);
        const c = (parseFloat(a) * x + parseFloat(b) * y).toFixed(2);
        return g(`At an organic market, avocados cost $${a} and mangoes cost $${b}. If you spend exactly $${c} on ${x} avocados and some mangoes, how many mangoes did you buy?`, y);
      },
      () => { const m=R(2,6), b=R(3,11), h=R(3,8), k=R(4,10); const newB = b - m*h + k; return g(`In the <i>xy</i>-plane, the graph of the line <i>y</i> = ${m}<i>x</i> + ${b} is translated ${h} units to the right and ${k} units up to form line <i>m</i>. What is the <i>y</i>-coordinate of the <i>y</i>-intercept of line <i>m</i>?`, String(newB), [String(newB), String(b + m*h + k), String(b - h + k), String(b + h - m*k)]); },
      () => { const a=R(2,6), m=R(3,7), b=R(2,9); const x1=a, y1=m*a+b, x2=a+3, y2=m*(a+3)+b, x3=a+7, y3=m*(a+7)+b; return g(`In the <i>xy</i>-plane, the three distinct points (${x1}, ${y1}), (${x2}, ${y2}), and (${x3}, <i>k</i>) are collinear. If this line is shifted vertically downward by ${b} units, what is the new <i>y</i>-coordinate when <i>x</i> = ${x3}?`, String(y3 - b), [String(y3 - b), String(y3), String(y3 + b), String(m*x3 + b)]); },
      () => { const p=R(2,6), q=R(3,8,p), c=R(15,45); const k = (q*q)/p; return g(`In the <i>xy</i>-plane, line <i>l</i> has equation ${p}<i>x</i> + ${q}<i>y</i> = ${c}, and line <i>m</i> has equation ${q}<i>x</i> - <i>ky</i> = 19, where <i>k</i> is a constant. If line <i>l</i> is perpendicular to line <i>m</i>, what is the value of <i>k</i>?`, String(p), [String(p), String(-p), `<f>${q}/${p}</f>`, `<f>${p}/${q}</f>`]); },
      () => { const a=R(3,8), b=R(4,9), x0=R(2,6), y0=R(2,6); const c=a*x0 - b*y0; return g(`The graph of ${a}<i>x</i> - ${b}<i>y</i> = ${c} in the <i>xy</i>-plane is reflected across the line <i>y</i> = <i>x</i>. What is the slope of the reflected line?`, `<f>${b}/${a}</f>`, [`<f>${b}/${a}</f>`, `<f>${a}/${b}</f>`, `<f>-${b}/${a}</f>`, `<f>-${a}/${b}</f>`]); },
      () => { const a=R(4,10), b=R(5,12), c=a*b*R(2,4); return g(`The line ${a}x + ${b}y = ${c} forms a right triangle with the x- and y-axes. What is the area of this triangle?`, String((c/a)*(c/b)/2), [String((c/a)*(c/b)/2), String(c/a), String(c/b), String((c/a)*(c/b))]); },
      // 9. SVG-график: найти уравнение прямой в стандартной форме Ax + By = C по пересечениям с осями
      () => {
        const xInt = R(2, 6), yInt = R(2, 6, xInt);
        const C = xInt * yInt, A = yInt, B = xInt;
        const x1 = -8, y1 = (C - A * x1) / B, x2 = 8, y2 = (C - A * x2) / B;
        const graph = svg(`<line x1="${tX(x1)}" y1="${tY(y1)}" x2="${tX(x2)}" y2="${tY(y2)}" stroke="#22a381" stroke-width="3"/><circle cx="${tX(xInt)}" cy="${tY(0)}" r="4" fill="#0f2b4a"/><circle cx="${tX(0)}" cy="${tY(yInt)}" r="4" fill="#0f2b4a"/>`);
        const ans = `${A}<i>x</i> + ${B}<i>y</i> = ${C}`;
        return g(`${graph}The graph of a linear equation is shown in the <i>xy</i>-plane above, where each grid line represents 1 unit. Which of the following equations represents this line?`, ans, [
          ans,
          `${B}<i>x</i> + ${A}<i>y</i> = ${C}`,
          `${A}<i>x</i> - ${B}<i>y</i> = ${C}`,
          `${B}<i>x</i> - ${A}<i>y</i> = ${C}`
        ]);
      },
      // 10. SVG-график: на графике показана прямая l, найти наклон прямой, ПЕРПЕНДИКУЛЯРНОЙ прямой l
      () => {
        const dx = R(2, 5), dy = R(2, 5, dx);
        const x1 = -dx, y1 = -dy, x2 = dx, y2 = dy;
        const graph = svg(`<line x1="${tX(x1*2)}" y1="${tY(y1*2)}" x2="${tX(x2*2)}" y2="${tY(y2*2)}" stroke="#11676a" stroke-width="3"/><circle cx="${tX(0)}" cy="${tY(0)}" r="4" fill="#e74c3c"/><circle cx="${tX(dx)}" cy="${tY(dy)}" r="4" fill="#e74c3c"/>`);
        const ans = `<f>-${dx}/${dy}</f>`;
        return g(`${graph}Line <i>l</i> is shown in the <i>xy</i>-plane above, where each grid square represents 1 unit. Line <i>k</i> (not shown) is perpendicular to line <i>l</i>. What is the slope of line <i>k</i>?`, ans, [
          ans,
          `<f>${dy}/${dx}</f>`,
          `<f>-${dy}/${dx}</f>`,
          `<f>${dx}/${dy}</f>`
        ]);
      },
      // 11. HTML-таблица: дана таблица точек на прямой, найти пропущенную координату k
      () => {
        const m = R(3, 8), b = R(-10, 12, 0);
        const x1 = R(1, 3), x2 = x1 + R(2, 4), x3 = x2 + R(3, 5);
        const k = m * x3 + b;
        const tbl = `<table style="margin:12px auto;border-collapse:collapse;text-align:center;width:220px;border:1px solid var(--line)"><tr style="background:var(--panel2)"><th style="padding:6px;border:1px solid var(--line)"><i>x</i></th><th style="padding:6px;border:1px solid var(--line)"><i>y</i></th></tr><tr><td style="padding:6px;border:1px solid var(--line)">${x1}</td><td style="padding:6px;border:1px solid var(--line)">${m*x1+b}</td></tr><tr><td style="padding:6px;border:1px solid var(--line)">${x2}</td><td style="padding:6px;border:1px solid var(--line)">${m*x2+b}</td></tr><tr><td style="padding:6px;border:1px solid var(--line)">${x3}</td><td style="padding:6px;border:1px solid var(--line)"><i>k</i></td></tr></table>`;
        return g(`${tbl}The table above shows three pairs of (<i>x</i>, <i>y</i>) coordinates that lie on a line in the <i>xy</i>-plane. What is the value of <i>k</i>?`, k);
      },
      // 12. HTML-таблица: выбрать уравнение Ax + By = C, которое соответствует точкам в таблице
      () => {
        const a = R(2, 5), b = R(2, 6, a), x0 = R(2, 5), y0 = R(3, 7);
        const c = a * x0 + b * y0;
        const x1 = x0 + b, y1 = y0 - a;
        const tbl = `<table style="margin:12px auto;border-collapse:collapse;text-align:center;width:220px;border:1px solid var(--line)"><tr style="background:var(--panel2)"><th style="padding:6px;border:1px solid var(--line)"><i>x</i></th><th style="padding:6px;border:1px solid var(--line)"><i>y</i></th></tr><tr><td style="padding:6px;border:1px solid var(--line)">${x0}</td><td style="padding:6px;border:1px solid var(--line)">${y0}</td></tr><tr><td style="padding:6px;border:1px solid var(--line)">${x1}</td><td style="padding:6px;border:1px solid var(--line)">${y1}</td></tr></table>`;
        const ans = `${a}<i>x</i> + ${b}<i>y</i> = ${c}`;
        return g(`${tbl}In the <i>xy</i>-plane, a line passes through the two points shown in the table above. Which equation defines this line?`, ans, [
          ans,
          `${b}<i>x</i> + ${a}<i>y</i> = ${c}`,
          `${a}<i>x</i> - ${b}<i>y</i> = ${a*x0 - b*y0}`,
          `${a}<i>x</i> + ${b}<i>y</i> = ${c + a}`
        ]);
      },
      // 13. Параллельные прямые в стандартной форме: дано Ax + By = C и kx + Dy = E, найти k
      () => {
        const a = R(3, 9), b = R(4, 11, a), mult = R(2, 5);
        const k = a * mult, d = b * mult, c1 = R(15, 45), c2 = R(50, 95);
        return g(`In the <i>xy</i>-plane, the graph of the line ${a}<i>x</i> + ${b}<i>y</i> = ${c1} is parallel to the graph of the line <i>kx</i> + ${d}<i>y</i> = ${c2}, where <i>k</i> is a constant. What is the value of <i>k</i>?`, k);
      },
      // 14. Перпендикулярные прямые в стандартной форме: дано Ax + By = C и kx - Ay = D, найти k
      () => {
        const a = R(3, 8), b = R(4, 11, a), mult = R(2, 4);
        const k = b * mult, d = a * mult, c1 = R(12, 40), c2 = R(20, 60);
        return grid(`In the <i>xy</i>-plane, the line ${a}<i>x</i> + ${b}<i>y</i> = ${c1} is perpendicular to the line <i>kx</i> - ${d}<i>y</i> = ${c2}, where <i>k</i> is a constant. What is the value of <i>k</i>?`, k);
      },
      // 15. Неизвестный коэффициент: точка (x0, y0) лежит на прямой kx + by = c, найти k
      () => {
        const k = R(3, 9), b = R(2, 8), x0 = R(3, 7), y0 = R(4, 9);
        const c = k * x0 + b * y0;
        return g(`In the <i>xy</i>-plane, the graph of the equation <i>kx</i> + ${b}<i>y</i> = ${c} passes through the point (${x0}, ${y0}), where <i>k</i> is a constant. What is the value of <i>k</i>?`, k);
      },
      // 16. Сумма координат пересечения с осями (x-intercept + y-intercept) для Ax + By = C
      () => {
        const a = R(2, 7), b = R(3, 8, a), k = R(2, 5);
        const c = a * b * k;
        const sum = (c / a) + (c / b);
        return g(`In the <i>xy</i>-plane, the graph of ${a}<i>x</i> + ${b}<i>y</i> = ${c} intersects the <i>x</i>-axis at (<i>p</i>, 0) and the <i>y</i>-axis at (0, <i>q</i>). What is the value of <i>p</i> + <i>q</i>?`, sum);
      },
      // 17. Текстовая задача: перевод из общего количества двух типов билетов/товаров в уравнение
      () => {
        const S = [
          { a: 'standard seats', b: 'VIP seats', v: 'an amphitheater', u: 'seats' },
          { a: 'small tables', b: 'large tables', v: 'a banquet hall', u: 'guests', pA: R(4, 6), pB: R(8, 12) },
          { a: ' vans', b: 'buses', v: 'a school trip', u: 'students', pA: R(8, 12), pB: R(35, 50) }
        ];
        const pA = R(4, 8), pB = R(10, 18), tot = pA * R(10, 20) + pB * R(8, 15);
        const ans = `${pA}<i>x</i> + ${pB}<i>y</i> = ${tot}`;
        return g(`A catering company uses small trays that hold ${pA} pastries each and large trays that hold ${pB} pastries each. If the company needs to arrange a total of ${tot} pastries using <i>x</i> small trays and <i>y</i> large trays, which equation represents this situation?`, ans, [
          ans,
          `${pB}<i>x</i> + ${pA}<i>y</i> = ${tot}`,
          `<i>x</i> + <i>y</i> = ${tot}`,
          `${pA + pB}(<i>x</i> + <i>y</i>) = ${tot}`
        ]);
      },
      // 18. Текстовая задача: изменение одной переменной при изменении другой на 1 (Rate of substitution)
      () => {
        const a = R(2, 6), b = a * R(2, 5), c = b * R(10, 25);
        const ratio = b / a;
        return g(`A cargo container can hold a maximum weight of ${c} pounds. It is loaded with <i>x</i> crates weighing ${a} pounds each and <i>y</i> crates weighing ${b} pounds each, modeled by the equation ${a}<i>x</i> + ${b}<i>y</i> = ${c}. For each additional ${b}-pound crate loaded into the container, by how many crates must the number of ${a}-pound crates decrease to maintain the same total weight?`, ratio);
      },
      // 19. Отражение прямой относительно оси x или оси y
      () => {
        const m = R(2, 7), b = R(3, 12);
        const ans = `<i>y</i> = -${m}<i>x</i> - ${b}`;
        return g(`In the <i>xy</i>-plane, line <i>l</i> has the equation <i>y</i> = ${m}<i>x</i> + ${b}. Line <i>k</i> is formed by reflecting line <i>l</i> across the <i>x</i>-axis. Which equation defines line <i>k</i>?`, ans, [
          ans,
          `<i>y</i> = -${m}<i>x</i> + ${b}`,
          `<i>y</i> = ${m}<i>x</i> - ${b}`,
          `<i>y</i> = <f>1/${m}</f><i>x</i> - ${b}`
        ]);
      },
      // 20. Прямая проходит через начало координат (0,0) и точку (a, b), найти ординату при x = c
      () => {
        const x1 = R(3, 8), m = R(3, 7), y1 = x1 * m, x2 = R(10, 22);
        return grid(`In the <i>xy</i>-plane, a line passes through the origin (0, 0) and the point (${x1}, ${y1}). If the point (${x2}, <i>k</i>) also lies on this line, what is the value of <i>k</i>?`, x2 * m);
      },
      // 21. Прямая с неопределенным наклоном (вертикальная) или нулевым наклоном (горизонтальная)
      () => {
        const x0 = R(-12, 18, 0), y1 = R(2, 9), y2 = R(11, 25);
        const ans = `<i>x</i> = ${x0}`;
        return g(`In the <i>xy</i>-plane, a line passes through the points (${x0}, ${y1}) and (${x0}, ${y2}). Which equation defines this line?`, ans, [
          ans,
          `<i>y</i> = ${x0}`,
          `<i>y</i> = ${y1}<i>x</i> + ${y2}`,
          `<i>x</i> + <i>y</i> = ${x0 + y1}`
        ]);
      },
      // 22. Дробные коэффициенты в уравнении прямой: (1/a)x + (1/b)y = c, найти y-intercept
      () => {
        const a = R(3, 8), b = R(2, 9, a), c = R(3, 7);
        return g(`In the <i>xy</i>-plane, what is the <i>y</i>-coordinate of the <i>y</i>-intercept of the graph of the equation <f>1/${a}</f><i>x</i> + <f>1/${b}</f><i>y</i> = ${c}?`, b * c);
      },
      // 23. Перевод уравнения из стандартной формы Ax - By = C в форму с выделенным y
      () => {
        const a = R(3, 9), b = R(2, 8, a), c = b * R(3, 9);
        const yInt = -c / b;
        const ans = `<i>y</i> = <f>${a}/${b}</f><i>x</i> - ${c/b}`;
        return g(`Which of the following equations is equivalent to ${a}<i>x</i> - ${b}<i>y</i> = ${c}?`, ans, [
          ans,
          `<i>y</i> = <f>-${a}/${b}</f><i>x</i> + ${c/b}`,
          `<i>y</i> = <f>${a}/${b}</f><i>x</i> + ${c/b}`,
          `<i>y</i> = <f>${b}/${a}</f><i>x</i> - ${c/b}`
        ]);
      },
      // 24. Текстовая задача: интерпретация y-intercept в уравнении Ax + By = C
      () => {
        const S = [
          { x: '3-point field goals', y: '2-point field goals', a: 3, b: 2, tot: 48, ctx: 'a basketball player scored 48 points' },
          { x: '5-pound bags of flour', y: '10-pound bags of sugar', a: 5, b: 10, tot: 150, ctx: 'a baker ordered 150 pounds of ingredients' },
          { x: '4-seat tables', y: '6-seat booths', a: 4, b: 6, tot: 120, ctx: 'a restaurant can seat 120 diners' }
        ];
        const s = getEl(S), yInt = s.tot / s.b;
        const ans = `The number of ${s.y} if there are zero ${s.x}`;
        return g(`The equation ${s.a}<i>x</i> + ${s.b}<i>y</i> = ${s.tot} models a situation where ${s.ctx} using <i>x</i> ${s.x} and <i>y</i> ${s.y}. What does the <i>y</i>-intercept of the graph of this equation represent in this context?`, ans, [
          ans,
          `The number of ${s.x} if there are zero ${s.y}`,
          `The total number of ${s.y} and ${s.x} combined`,
          `The increase in ${s.y} for each additional unit of ${s.x}`
        ]);
      },
      // 25. Середина отрезка между x-intercept и y-intercept прямой Ax + By = C
      () => {
        const xInt = R(4, 14, 0) * 2, yInt = R(4, 14, xInt/2) * 2;
        const a = yInt, b = xInt, c = xInt * yInt;
        const midX = xInt / 2, midY = yInt / 2;
        const ans = `(${midX}, ${midY})`;
        return g(`In the <i>xy</i>-plane, the line ${a}<i>x</i> + ${b}<i>y</i> = ${c} intersects the <i>x</i>-axis at point <i>A</i> and the <i>y</i>-axis at point <i>B</i>. What are the coordinates of the midpoint of segment <i>AB</i>?`, ans, [
          ans,
          `(${xInt}, ${yInt})`,
          `(${midY}, ${midX})`,
          `(${xInt * 2}, ${yInt * 2})`
        ]);
      },
      // 26. Уравнение прямой, проходящей через точку (x0, y0) и параллельной оси x
      () => {
        const x0 = R(-15, 15, 0), y0 = R(4, 25);
        return g(`In the <i>xy</i>-plane, line <i>m</i> has a slope of 0 and passes through the point (${x0}, ${y0}). What is the <i>y</i>-coordinate of the point where line <i>m</i> intersects the <i>y</i>-axis?`, y0);
      },
      // 27. Нахождение отношения коэффициентов a/b, если известен наклон прямой ax + by = c
      () => {
        const num = R(3, 9), den = R(2, 8, num);
        const c = R(15, 60);
        const ans = `<f>${num}/${den}</f>`;
        return g(`In the <i>xy</i>-plane, the graph of the linear equation <i>ax</i> + <i>by</i> = ${c} has a slope of <f>-${num}/${den}</f>, where <i>a</i> and <i>b</i> are positive constants. What is the value of <f><i>a</i>/<i>b</i></f>?`, ans, [
          ans,
          `<f>-${num}/${den}</f>`,
          `<f>${den}/${num}</f>`,
          `<f>-${den}/${num}</f>`
        ]);
      },
      // 28. Сдвиг прямой в стандартной форме: Ax + By = C сдвинули вверх на k единиц
      () => {
        const a = R(2, 6), b = R(3, 7), yInt = R(4, 10), c = b * yInt, k = R(3, 8);
        const newC = c + b * k;
        const ans = `${a}<i>x</i> + ${b}<i>y</i> = ${newC}`;
        return g(`In the <i>xy</i>-plane, the graph of the line ${a}<i>x</i> + ${b}<i>y</i> = ${c} is translated ${k} units up. Which of the following is an equation of the resulting line?`, ans, [
          ans,
          `${a}<i>x</i> + ${b}<i>y</i> = ${c + k}`,
          `${a}<i>x</i> + ${b}<i>y</i> = ${c - b * k}`,
          `${a}<i>x</i> + ${b}<i>y</i> = ${c + a * k}`
        ]);
      },
      // 29. Расстояние между x-intercepts двух параллельных прямых
      () => {
        const a = R(3, 7), b = R(2, 6), k1 = R(2, 5), k2 = k1 + R(3, 8);
        const c1 = a * k1, c2 = a * k2;
        return g(`In the <i>xy</i>-plane, what is the distance between the <i>x</i>-intercept of the line ${a}<i>x</i> + ${b}<i>y</i> = ${c1} and the <i>x</i>-intercept of the line ${a}<i>x</i> + ${b}<i>y</i> = ${c2}?`, k2 - k1);
      },
      // 30. Три точки на одной прямой (Collinear points) с параметром t
      () => {
        const m = R(2, 6), b = R(-8, 12, 0);
        const t = R(3, 9);
        const x1 = 1, y1 = m + b, x2 = 3, y2 = 3 * m + b, x3 = t, y3 = m * t + b;
        return grid(`In the <i>xy</i>-plane, the points (${x1}, ${y1}), (${x2}, ${y2}), and (<i>t</i>, ${y3}) lie on the same line. What is the value of <i>t</i>?`, t);
      },
      () => { const m1=2, b1=3; const x0=4, y0=1; const gr=svg(`<line x1="${tX(-6)}" y1="${tY(m1*(-6)+b1)}" x2="${tX(4)}" y2="${tY(m1*4+b1)}" stroke="#22a381" stroke-width="3"/><circle cx="${tX(x0)}" cy="${tY(y0)}" r="4.5" fill="#e74c3c"/><text x="${tX(x0)+7}" y="${tY(y0)+4}" font-size="11" font-weight="bold" fill="#e74c3c">(4, 1)</text>`); const ans = `<i>x</i> + 2<i>y</i> = 6`; return g(`${gr}Line <i>l</i> is graphed in the <i>xy</i>-plane above and has a slope of 2. Line <i>k</i> (not shown) is perpendicular to line <i>l</i> and passes through the point (4, 1). Which equation defines line <i>k</i>?`, ans, [ans, `2<i>x</i> + <i>y</i> = 9`, `<i>x</i> - 2<i>y</i> = 2`, `2<i>x</i> - <i>y</i> = 7`]); },
      () => { const x1=R(2,6)*2, y1=R(2,6)*2, x2=x1+R(2,5)*2, y2=y1+R(2,5)*2; const mx=(x1+x2)/2, my=(y1+y2)/2; return g(`In the <i>xy</i>-plane, a line with slope -1 passes through the midpoint of the line segment joining (${x1}, ${y1}) and (${x2}, ${y2}). What is the <i>y</i>-coordinate of the <i>y</i>-intercept of this line?`, mx + my); },
      () => { const a=R(3,8), b=R(4,9,a), k=R(2,5); const c=a*b*k; const xInt=b*k, yInt=a*k; return g(`In the <i>xy</i>-plane, the line <f><i>x</i>/${xInt}</f> + <f><i>y</i>/${yInt}</f> = 1 intersects the <i>x</i>-axis at point <i>P</i> and the <i>y</i>-axis at point <i>Q</i>. What is the area of right triangle <i>OPQ</i>, where <i>O</i> is the origin?`, (xInt*yInt)/2); },
      () => { const a=R(3,7), b=R(4,9), m=R(2,5); const k = a*m; const tbl=`<table style="margin:10px auto;border-collapse:collapse;text-align:center;width:240px;border:1px solid var(--line)"><tr style="background:var(--panel2)"><th style="padding:6px;border:1px solid var(--line)"><i>x</i></th><th style="padding:6px;border:1px solid var(--line)"><i>y</i></th></tr><tr><td style="padding:5px;border:1px solid var(--line)">0</td><td style="padding:5px;border:1px solid var(--line)">${a*m}</td></tr><tr><td style="padding:5px;border:1px solid var(--line)">${b}</td><td style="padding:5px;border:1px solid var(--line)">0</td></tr><tr><td style="padding:5px;border:1px solid var(--line)">${2*b}</td><td style="padding:5px;border:1px solid var(--line)">-${a*m}</td></tr></table>`; return g(`${tbl}The table above shows three points on a line in the <i>xy</i>-plane. Which equation represents this line?`, `${a*m}<i>x</i> + ${b}<i>y</i> = ${a*b*m}`, [`${a*m}<i>x</i> + ${b}<i>y</i> = ${a*b*m}`, `${b}<i>x</i> + ${a*m}<i>y</i> = ${a*b*m}`, `${a*m}<i>x</i> - ${b}<i>y</i> = ${a*b*m}`, `${b}<i>x</i> - ${a*m}<i>y</i> = ${a*b*m}`]); },
      () => { const [a,b,c] = getEl([[3,4,5],[6,8,10],[5,12,13]]); const k=R(2,5); const d = c*k; return g(`In the <i>xy</i>-plane, the graph of ${b}<i>x</i> + ${a}<i>y</i> = ${a*b*k} intersects the <i>x</i>-axis at point <i>A</i> and the <i>y</i>-axis at point <i>B</i>. What is the length of segment <i>AB</i>?`, Math.sqrt((a*k)*(a*k) + (b*k)*(b*k))); },
      () => { const a=R(2,7), b=R(3,8), x0=R(2,6), y0=R(3,7); const c = a*x0 - b*y0; return grid(`In the <i>xy</i>-plane, the line ${a}<i>x</i> - ${b}<i>y</i> = ${c} is reflected across the <i>y</i>-axis. If the reflected line passes through the point (-${x0}, <i>k</i>), what is the value of <i>k</i>?`, y0); },
      () => { const p1=R(12,24), p2=R(15,30), tot=p1*R(8,15) + p2*R(6,12); const g1=gcd(p1,p2); return g(`A cargo ship loads <i>x</i> standard containers weighing ${p1} tons each and <i>y</i> heavy containers weighing ${p2} tons each, for a combined cargo weight of ${tot} tons. In the <i>xy</i>-plane, what is the slope of the line representing this relationship?`, `-<f>${p1/g1}/${p2/g1}</f>`, [`-<f>${p1/g1}/${p2/g1}</f>`, `<f>${p1/g1}/${p2/g1}</f>`, `-<f>${p2/g1}/${p1/g1}</f>`, `-${tot}`]); },
      () => { const m=R(2,6), b=R(4,12); const k = m*3 + b; return g(`In the <i>xy</i>-plane, the points (0, ${b}), (3, <i>k</i>), and (6, ${6*m+b}) lie on the same line. What is the value of <i>k</i>?`, k); },
      () => { const a=R(3,8), b=R(4,11,a), c=R(15,50); return g(`Line <i>p</i> is defined by ${a}<i>x</i> + ${b}<i>y</i> = ${c}. Line <i>q</i> is perpendicular to line <i>p</i> in the <i>xy</i>-plane. What is the slope of line <i>q</i>?`, `<f>${b}/${a}</f>`, [`<f>${b}/${a}</f>`, `-<f>${b}/${a}</f>`, `<f>${a}/${b}</f>`, `-<f>${a}/${b}</f>`]); },
      () => { const h=R(3,9), k=R(4,12); return g(`In the <i>xy</i>-plane, a vertical line passes through (${h}, ${k}) and a horizontal line passes through (-${h}, ${2*k}). At what point (<i>x</i>, <i>y</i>) do these two lines intersect?`, `(${h}, ${2*k})`, [`(${h}, ${2*k})`, `(-${h}, ${k})`, `(${h}, ${k})`, `(0, ${2*k})`]); },
      () => { const a=R(2,5), b=R(3,7), k=R(3,8); const c = a*k + b*(k+2); return g(`If the ordered pair (<i>k</i>, <i>k</i> + 2) lies on the graph of ${a}<i>x</i> + ${b}<i>y</i> = ${c} in the <i>xy</i>-plane, what is the value of <i>k</i>?`, k); },
      () => { const m=R(2,5), x1=R(2,6), y1=R(3,9); const b = y1 - m*x1; const yAt10 = m*10 + b; return g(`In the <i>xy</i>-plane, line <i>m</i> passes through (${x1}, ${y1}) and is parallel to the line ${m*2}<i>x</i> - 2<i>y</i> = 19. What is the <i>y</i>-coordinate of the point on line <i>m</i> with <i>x</i>-coordinate 10?`, yAt10); },
      () => { const xInt=R(3,7), yInt=R(2,6); const gr=svg(`<line x1="${tX(-3)}" y1="${tY(yInt*(1+3/xInt))}" x2="${tX(xInt+2)}" y2="${tY(-yInt*2/xInt)}" stroke="#e74c3c" stroke-width="3"/><circle cx="${tX(xInt)}" cy="${tY(0)}" r="4" fill="#0f2b4a"/><circle cx="${tX(0)}" cy="${tY(yInt)}" r="4" fill="#0f2b4a"/>`); return grid(`${gr}The line shown in the <i>xy</i>-plane above has equation <i>ax</i> + <i>by</i> = ${xInt*yInt}, where <i>a</i> and <i>b</i> are constants. What is the value of <i>a</i> + <i>b</i>?`, xInt + yInt); },
      () => { const a=R(4,10), b=R(3,9), k=R(2,6); return g(`The graph of <f><i>x</i>/${a}</f> - <f><i>y</i>/${b}</f> = ${k} in the <i>xy</i>-plane has an <i>x</i>-intercept at (<i>p</i>, 0) and a <i>y</i>-intercept at (0, <i>q</i>). What is the value of <i>p</i> + <i>q</i>?`, a*k - b*k); },
      () => { const r1=R(4,8), r2=R(10,16), tot=r1*15 + r2*10; return g(`An athlete burns ${r1} calories per minute walking and ${r2} calories per minute rowing. The equation ${r1}<i>w</i> + ${r2}<i>r</i> = ${tot} represents the combinations of walking for <i>w</i> minutes and rowing for <i>r</i> minutes that burn ${tot} calories. If the athlete rows for 10 minutes, how many minutes must they walk to burn ${tot} calories?`, 15); },
      () => { const a=R(3,8), b=R(2,7), c=a*b*R(2,5); return g(`In the <i>xy</i>-plane, the line ${a}<i>x</i> + ${b}<i>y</i> = ${c} is translated 4 units to the right. What is the <i>x</i>-coordinate of the <i>x</i>-intercept of the translated line?`, c/a + 4); },
      () => { const k=R(3,9), m=R(2,6); return grid(`In the <i>xy</i>-plane, the line <i>kx</i> - 3<i>y</i> = 12 and the line 4<i>x</i> - 6<i>y</i> = 15 are parallel. What is the value of <i>k</i>?`, 2); },
      () => { const a=R(2,6), b=R(3,8); const x0=b*2, y0=a*2; return g(`A line passes through the origin (0, 0) and has a slope of <f>${a}/${b}</f>. If the point (<i>t</i>, ${a*6}) lies on this line, what is the value of <i>t</i>?`, b*6); },
      () => { const x1=2, y1=4, x2=8, y2=12; const mx=5, my=8; // slope of segment = 8/6 = 4/3 -> perp slope = -3/4. 3x + 4y = 15 + 32 = 47
        return g(`In the <i>xy</i>-plane, segment <i>AB</i> has endpoints <i>A</i>(2, 4) and <i>B</i>(8, 12). Which equation defines the perpendicular bisector of segment <i>AB</i>?`, `3<i>x</i> + 4<i>y</i> = 47`, [`3<i>x</i> + 4<i>y</i> = 47`, `4<i>x</i> - 3<i>y</i> = -4`, `3<i>x</i> - 4<i>y</i> = -17`, `4<i>x</i> + 3<i>y</i> = 44`]); },
      () => { const a=R(3,9), b=R(4,12), c=R(20,60); const g1=gcd(a,b); return g(`If ${a}<i>x</i> + ${b}<i>y</i> = ${c}, what is the rate of change of <i>y</i> with respect to <i>x</i>?`, `-<f>${a/g1}/${b/g1}</f>`, [`-<f>${a/g1}/${b/g1}</f>`, `<f>${a/g1}/${b/g1}</f>`, `-<f>${b/g1}/${a/g1}</f>`, `<f>${c}/${b}</f>`]); }
    ],
    // === Topic 3: Systems of linear equations ===
    [
      () => { const a=R(3,8), b=R(4,9), k=R(3,6), c=R(10,25); const p=a*k, q=b*k, d=c*k + R(4,15); return g(`${a}<i>x</i> - ${b}<i>y</i> = ${c}<br><i>px</i> - ${q}<i>y</i> = ${d}<br><br>In the system of equations above, <i>p</i> is a constant. If the system has no solution, what is the value of <i>p</i> + ${b}?`, String(p + b), [String(p + b), String(p), String(a + q), String(p - b)]); },
      () => { const a=R(3,8), b=R(4,9), c=R(20,50); return g(`How many solutions does the system ${a}x + ${b}y = ${c} and ${a*3}x + ${b*3}y = ${c*3} have?`, "Infinitely many", ["Infinitely many", "Exactly one", "Zero", "Exactly two"]); },
      () => { const a=R(3,8), b=R(4,9), c=R(20,50); return g(`How many solutions does the system ${a}x + ${b}y = ${c} and ${a*2}x + ${b*2}y = ${c*2+7} have?`, "Zero", ["Zero", "Exactly one", "Infinitely many", "Exactly two"]); },
      () => { const A=R(20,60), C=R(30,80), ap=(R(120,250)/10).toFixed(2), cp=(R(60,110)/10).toFixed(2); return g(`A cinema sold ${A+C} tickets. Adult tickets are $${ap}, child tickets are $${cp}. Total sales were $${(A*parseFloat(ap)+C*parseFloat(cp)).toFixed(2)}. How many adult tickets were sold?`, A); },
      () => { const m1=R(2,5), m2=R(-5,-2), x=R(2,8), y=R(5,15), b1=y-m1*x, b2=y-m2*x; return g(`The lines y = ${m1}x + ${b1} and y = ${m2}x + ${b2} intersect at the point (x, y). What is the value of y?`, y, [y, x, b1, b2]); },
      () => { const u=R(2,6), v=R(3,7), a=R(2,5), b=R(3,6); const c1=a*u + b*v, c2=b*u - a*v; return g(`<f>${a}/<i>x</i></f> + <f>${b}/<i>y</i></f> = ${c1}<br><f>${b}/<i>x</i></f> - <f>${a}/<i>y</i></f> = ${c2}<br><br>If (<i>x</i>, <i>y</i>) is the solution to the system of equations above, what is the value of <f>1/<i>x</i></f> + <f>1/<i>y</i></f>?`, String(u + v), [String(u + v), String(u * v), `<f>1/${u+v}</f>`, String(Math.abs(u - v))]); },
      () => { const m=R(3,8), c=R(15,40); return g(`Find the value of k if the system ${m}x + y = ${c} and ${m*4}x + 4y = k has infinitely many solutions.`, c*4, [c*4, c, c/4, c+4]); },
      () => { const vPlane=R(420,540,20), vWind=R(30,70,10), t=R(3,6); const dWith=(vPlane+vWind)*t, dAgainst=(vPlane-vWind)*t; return g(`An aircraft flying with a constant tailwind travels ${dWith} miles in ${t} hours. On the return flight along the same route against the same wind, the aircraft travels ${dAgainst} miles in ${t} hours. What is the speed of the aircraft in still air, in miles per hour?`, String(vPlane), [String(vPlane), String(vPlane + vWind), String(vPlane - vWind), String(vWind * 2)]); },
      // 9. SVG-график: найти x-координату (или сумму координат) точки пересечения двух прямых по графику
      () => {
        const ix = R(-3, 3, 0), iy = R(-3, 3, 0);
        const m1 = 1, b1 = iy - m1 * ix;
        const m2 = -1, b2 = iy - m2 * ix;
        const graph = svg(`<line x1="${tX(-9)}" y1="${tY(m1*(-9)+b1)}" x2="${tX(9)}" y2="${tY(m1*9+b1)}" stroke="#22a381" stroke-width="3"/><line x1="${tX(-9)}" y1="${tY(m2*(-9)+b2)}" x2="${tX(9)}" y2="${tY(m2*9+b2)}" stroke="#2b7f9c" stroke-width="3"/><circle cx="${tX(ix)}" cy="${tY(iy)}" r="4.5" fill="#e74c3c"/>`);
        const ans = `(${ix}, ${iy})`;
        return g(`${graph}The graphs of two linear equations are shown in the <i>xy</i>-plane above, where each grid line represents 1 unit. What is the solution (<i>x</i>, <i>y</i>) to the system formed by these two equations?`, ans, [
          ans,
          `(${iy}, ${ix})`,
          `(${-ix}, ${-iy})`,
          `(0, ${b1})`
        ]);
      },
      // 10. SVG-график: две параллельные прямые на графике — сколько решений имеет система?
      () => {
        const m = getEl([-2, -1, 1, 2]), b1 = R(1, 4), b2 = R(-4, -1);
        const graph = svg(`<line x1="${tX(-8)}" y1="${tY(m*(-8)+b1)}" x2="${tX(8)}" y2="${tY(m*8+b1)}" stroke="#22a381" stroke-width="3"/><line x1="${tX(-8)}" y1="${tY(m*(-8)+b2)}" x2="${tX(8)}" y2="${tY(m*8+b2)}" stroke="#e74c3c" stroke-width="3"/>`);
        return g(`${graph}A system of two linear equations is graphed in the <i>xy</i>-plane above. How many solutions does the system have?`, "Zero", ["Zero", "Exactly one", "Exactly two", "Infinitely many"]);
      },
      // 11. Коронный трюк SAT: сложить два уравнения, чтобы сразу найти x + y
      () => {
        const a = R(3, 8), b = a + R(2, 5), k = a + b;
        const x = R(2, 9), y = R(3, 10);
        const c1 = a * x + b * y, c2 = b * x + a * y;
        return g(`${a}<i>x</i> + ${b}<i>y</i> = ${c1}<br>${b}<i>x</i> + ${a}<i>y</i> = ${c2}<br><br>If (<i>x</i>, <i>y</i>) is the solution to the given system of equations, what is the value of <i>x</i> + <i>y</i>?`, x + y);
      },
      // 12. Коронный трюк SAT: вычесть одно уравнение из другого, чтобы сразу найти выражение (ax + by)
      () => {
        const a = R(5, 12), b = R(4, 10), x = R(3, 8), y = R(2, 7);
        const c1 = a * x + b * y, c2 = (a - 1) * x + (b - 1) * y;
        return g(`${a}<i>x</i> + ${b}<i>y</i> = ${c1}<br>${a - 1}<i>x</i> + ${b - 1}<i>y</i> = ${c2}<br><br>If (<i>x</i>, <i>y</i>) is the solution to the system of equations above, what is the value of <i>x</i> + <i>y</i>?`, c1 - c2);
      },
      // 13. Параметр на No Solution (нет решений): kx - 3y = c1 и 4x - 5y = c2
      () => {
        const a2 = R(3, 9), b1 = R(2, 7), mult = R(2, 5), b2 = b1 * mult;
        const c1 = R(10, 30), c2 = c1 * mult + R(3, 11);
        const ans = `<f>${a2}/${mult}</f>`;
        return g(`<i>kx</i> - ${b1}<i>y</i> = ${c1}<br>${a2}<i>x</i> - ${b2}<i>y</i> = ${c2}<br><br>In the system of equations above, <i>k</i> is a constant and <i>x</i> and <i>y</i> are variables. For what value of <i>k</i> does the system of equations have no solution?`, ans, [
          ans,
          `<f>-${a2}/${mult}</f>`,
          `<f>${mult}/${a2}</f>`,
          String(a2 * mult)
        ]);
      },
      () => {
        const p = R(2, 5), q = R(3, 6);
        const m = R(3, 5), c = R(4, 9);
        const a = p * m, b = q * m, c2 = c * m;
        const ans = `<f>${p}/${q}</f>`;
        return g(`<i>ax</i> + <i>by</i> = ${c}<br>${a}<i>x</i> + ${b}<i>y</i> = ${c2}<br><br>In the given system of equations, <i>a</i> and <i>b</i> are constants. If the system has infinitely many solutions, what is the value of <b><i>a</i>/<i>b</i></b>?`, ans, [
          ans,
          `<f>${q}/${p}</f>`,
          `<f>-${p}/${q}</f>`,
          String(m)
        ]);
      },
      // 15. HTML-таблица: даны значения двух функций f(x) и g(x), найти точку пересечения
      () => {
        const ix = R(2, 5), m1 = R(2, 5), m2 = R(-4, -1), iy = R(6, 15);
        const b1 = iy - m1 * ix, b2 = iy - m2 * ix;
        const xs = [1, 2, 3, 4, 5];
        const rows = xs.map(x => `<tr><td style="padding:4px 8px;border:1px solid var(--line)">${x}</td><td style="padding:4px 8px;border:1px solid var(--line)">${m1*x+b1}</td><td style="padding:4px 8px;border:1px solid var(--line)">${m2*x+b2}</td></tr>`).join('');
        const tbl = `<table style="margin:12px auto;border-collapse:collapse;text-align:center;width:260px;border:1px solid var(--line)"><tr style="background:var(--panel2)"><th style="padding:6px;border:1px solid var(--line)"><i>x</i></th><th style="padding:6px;border:1px solid var(--line)"><i>f</i>(<i>x</i>)</th><th style="padding:6px;border:1px solid var(--line)"><i>g</i>(<i>x</i>)</th></tr>${rows}</table>`;
        return grid(`${tbl}The table above shows values for the linear functions <i>f</i> and <i>g</i>. If the graphs of <i>y</i> = <i>f</i>(<i>x</i>) and <i>y</i> = <i>g</i>(<i>x</i>) intersect at the point (<i>a</i>, <i>b</i>) in the <i>xy</i>-plane, what is the value of <i>a</i> + <i>b</i>?`, ix + iy);
      },
      // 16. Составление системы уравнений из контекста (перевод текста в систему)
      () => {
        const S = [
          { i1: 'novel', i2: 'magazine', v1: '<i>n</i>', v2: '<i>m</i>', w1: 14, w2: 5 },
          { i1: 'hardcover book', i2: 'paperback book', v1: '<i>h</i>', v2: '<i>p</i>', w1: 18, w2: 7 },
          { i1: 'large box', i2: 'small box', v1: 'L', v2: '<i>s</i>', w1: 25, w2: 10 }
        ];
        const s = getEl(S), c1 = R(8, 20), c2 = R(10, 25), totItems = c1 + c2, totWeight = c1 * s.w1 + c2 * s.w2;
        const ans = `${s.v1} + ${s.v2} = ${totItems} and ${s.w1}${s.v1} + ${s.w2}${s.v2} = ${totWeight}`;
        return g(`Each ${s.i1} weighs ${s.w1} ounces, and each ${s.i2} weighs ${s.w2} ounces. A shipping crate contains a total of ${totItems} items (${s.v1} ${s.i1}s and ${s.v2} ${s.i2}s) with a combined weight of ${totWeight} ounces. Which system of equations represents this situation?`, ans, [
          ans,
          `${s.v1} + ${s.v2} = ${totWeight} and ${s.w1}${s.v1} + ${s.w2}${s.v2} = ${totItems}`,
          `${s.w2}${s.v1} + ${s.w1}${s.v2} = ${totWeight} and ${s.v1} + ${s.v2} = ${totItems}`,
          `${s.v1} = ${s.w1}${s.v2} and ${s.v1} + ${s.v2} = ${totItems}`
        ]);
      },
      // 17. Задачи на смеси растворов (Saline / Acid solution mixture) — классика Module 2
      () => {
        const p1 = 10, p2 = 30, v1 = R(2, 8) * 10, v2 = R(2, 8) * 10;
        const totV = v1 + v2;
        const totSalt = (p1 * v1 + p2 * v2) / 100;
        return g(`A chemist mixes <i>x</i> milliliters of a ${p1}% saline solution with <i>y</i> milliliters of a ${p2}% saline solution to create ${totV} milliliters of a mixture that contains ${totSalt} milliliters of pure salt. What is the value of <i>y</i>?`, v2);
      },
      // 18. Задачи на скорость по ветру и против ветра (Boat in current / Plane in wind)
      () => {
        const vPlane = R(180, 320, 10), vWind = R(20, 50, 5);
        const t = R(2, 4);
        const dWith = (vPlane + vWind) * t, dAgainst = (vPlane - vWind) * t;
        return g(`An airplane flies ${dWith} miles in ${t} hours when flying with a tailwind, and flies ${dAgainst} miles in ${t} hours when flying against the same headwind. What is the speed of the airplane in still air, in miles per hour?`, vPlane);
      },
      // 19. Нестандартная подстановка: дано y = kx и ax + by = c, найти x
      () => {
        const k = R(2, 5), a = R(2, 6), b = R(2, 5), x = R(3, 10);
        const y = k * x, c = a * x + b * y;
        return g(`<i>y</i> = ${k}<i>x</i><br>${a}<i>x</i> + ${b}<i>y</i> = ${c}<br><br>What is the value of <i>x</i> in the solution (<i>x</i>, <i>y</i>) to the given system of equations?`, x);
      },
      // 20. Найти произведение xy из решения системы
      () => {
        const x = R(3, 9), y = R(2, 8), a = R(2, 5);
        const c1 = a * x + y, c2 = x - y;
        return grid(`${a}<i>x</i> + <i>y</i> = ${c1}<br><i>x</i> - <i>y</i> = ${c2}<br><br>If (<i>x</i>, <i>y</i>) is the solution to the given system of equations, what is the value of <i>xy</i>?`, x * y);
      },
      // 21. Дробная система: x/a + y/b = c1 и x/a - y/b = c2
      () => {
        const a = R(2, 6), b = R(3, 7, a), u = R(3, 8), v = R(1, u - 1);
        const x = a * u, y = b * v;
        const c1 = u + v, c2 = u - v;
        return g(`<f><i>x</i>/${a}</f> + <f><i>y</i>/${b}</f> = ${c1}<br><f><i>x</i>/${a}</f> - <f><i>y</i>/${b}</f> = ${c2}<br><br>If (<i>x</i>, <i>y</i>) is the solution to the system of equations above, what is the value of <i>x</i>?`, x);
      },
      // 22. Система, где нужно найти разность (x - y) без нахождения каждого по отдельности
      () => {
        const a = R(6, 14), b = a - R(2, 4), diff = a - b;
        const x = R(5, 15), y = R(2, 10);
        const c1 = a * x - b * y, c2 = b * x - a * y;
        // (a+b)x - (a+b)y = c1 + c2
        const sumAB = a + b, rhs1 = a * x - b * y, rhs2 = b * x - a * y;
        return g(`${a}<i>x</i> - ${b}<i>y</i> = ${rhs1}<br>${b}<i>x</i> - ${a}<i>y</i> = ${rhs2}<br><br>Based on the system of equations above, what is the value of <i>x</i> - <i>y</i>?`, x - y);
      },
      // 23. Точка пересечения лежит на оси x (значит y = 0): найти параметр k
      () => {
        const xInt = R(3, 9), a1 = R(2, 6), b1 = R(3, 8), c1 = a1 * xInt;
        const k = R(3, 10), b2 = R(4, 11), c2 = k * xInt;
        return g(`${a1}<i>x</i> + ${b1}<i>y</i> = ${c1}<br><i>kx</i> - ${b2}<i>y</i> = ${c2}<br><br>In the xy-plane, the graphs of the two equations above intersect at a point on the <i>x</i>-axis. What is the value of the constant <i>k</i>?`, k);
      },
      // 24. Точка пересечения лежит на оси y (значит x = 0): найти параметр k
      () => {
        const yInt = R(2, 8), a1 = R(3, 9), b1 = R(2, 5), c1 = b1 * yInt;
        const a2 = R(4, 10), k = R(3, 9), c2 = k * yInt;
        return grid(`${a1}<i>x</i> + ${b1}<i>y</i> = ${c1}<br>${a2}<i>x</i> + <i>ky</i> = ${c2}<br><br>In the <i>xy</i>-plane, the graphs of the two equations above intersect at a point on the <i>y</i>-axis. What is the value of the constant <i>k</i>?`, k);
      },
      // 25. Сравнение коэффициентов в скобках: a(x + y) + b(x - y) = c
      () => {
        const u = R(4, 12), v = R(2, 9); // u = x+y, v = x-y
        const a = R(2, 5), b = R(3, 6);
        const c1 = a * u + b * v;
        return g(`If <i>x</i> - <i>y</i> = ${v} and ${a}(<i>x</i> + <i>y</i>) + ${b}(<i>x</i> - <i>y</i>) = ${c1}, what is the value of <i>x</i> + <i>y</i>?`, u);
      },
      // 26. Геометрическая система: периметр прямоугольника и связь длины с шириной
      () => {
        const w = R(6, 18), k = R(2, 4), d = R(3, 9), l = k * w + d;
        const per = 2 * (l + w);
        return g(`The perimeter of a rectangular garden is ${per} feet. The length of the garden is ${d} feet more than ${k} times its width. What is the length, in feet, of the garden?`, l);
      },
      // 27. Текстовая система: баллы за правильные ответы (+a) и штраф за неправильные (-b)
      () => {
        const right = R(15, 25), wrong = R(3, 8), totQ = right + wrong;
        const ptsR = R(4, 6), ptsW = R(1, 2);
        const score = right * ptsR - wrong * ptsW;
        return g(`On a trivia quiz with ${totQ} questions, a player earns ${ptsR} points for each correct answer and loses ${ptsW} point(s) for each incorrect answer. If the player answered all ${totQ} questions and scored a total of ${score} points, how many questions did the player answer correctly?`, right);
      },
      // 28. Условие единственного решения (Exactly one solution): какое условие на параметр k?
      () => {
        const a = R(3, 9), b = R(2, 7, a), mult = R(2, 4);
        const kForbidden = a * mult, b2 = b * mult;
        const ans = `<i>k</i> ≠ ${kForbidden}`;
        return g(`${a}<i>x</i> + ${b}<i>y</i> = 10<br><i>kx</i> + ${b2}<i>y</i> = 25<br><br>In the given system of equations, <i>k</i> is a constant. The system has exactly one solution. Which of the following must be true?`, ans, [
          ans,
          `<i>k</i> = ${kForbidden}`,
          `<i>k</i> = ${a}`,
          `<i>k</i> ≠ 25`
        ]);
      },
      // 29. Система с тремя выражениями, равными друг другу: ax + y = bx + y = c
      () => {
        const a = R(3, 8), b = R(2, 7), x = R(2, 9), y = R(4, 12);
        const c1 = a * x + b * y, c2 = a * x - b * y;
        return grid(`${a}<i>x</i> + ${b}<i>y</i> = ${c1}<br>${a}<i>x</i> - ${b}<i>y</i> = ${c2}<br><br>If (<i>x</i>, <i>y</i>) is the solution to the given system, what is the value of ${a}<i>x</i>?`, a * x);
      },
      // 30. Две таблицы/тарифных плана: через сколько месяцев сумма сравняется, и чему равна эта сумма?
      () => {
        const m = R(4, 10), r1 = R(25, 45, 5), r2 = r1 - R(10, 20, 5);
        const fee2 = R(40, 100, 10), tot = fee2 + r2 * m, fee1 = tot - r1 * m;
        return g(`Gym A charges a $${fee1} initiation fee plus $${r1} per month. Gym B charges a $${fee2} initiation fee plus $${r2} per month. After <i>m</i> months, the total amount paid to Gym A equals the total amount paid to Gym B. What is that equal total amount, in dollars?`, tot);
      },
      () => { const ix=R(-4,4,0), iy=R(-4,4,0); const m1=2, b1=iy-m1*ix, m2=-1, b2=iy-m2*ix; const gr=svg(`<line x1="${tX(-8)}" y1="${tY(m1*(-8)+b1)}" x2="${tX(8)}" y2="${tY(m1*8+b1)}" stroke="#22a381" stroke-width="3"/><line x1="${tX(-8)}" y1="${tY(m2*(-8)+b2)}" x2="${tX(8)}" y2="${tY(m2*8+b2)}" stroke="#e74c3c" stroke-width="3"/><circle cx="${tX(ix)}" cy="${tY(iy)}" r="4.5" fill="#0f2b4a"/>`); return g(`${gr}The system of two linear equations graphed in the <i>xy</i>-plane above has solution (<i>x</i>, <i>y</i>). What is the value of 2<i>x</i> + <i>y</i>?`, 2*ix + iy); },
      () => { const a=R(4,9), b=R(2,6), k=R(3,5); const c1=R(10,25), c2=c1*k; return g(`${a}<i>x</i> - ${b}<i>y</i> = ${c1}<br><i>px</i> - ${b*k}<i>y</i> = ${c2}<br><br>In the given system of equations, <i>p</i> is a constant. If the system has infinitely many solutions, what is the value of <i>p</i>?`, a*k); },
      () => { const a=R(5,12), b=R(3,8), x=R(2,7), y=R(3,9); const c1 = a*x + b*y, c2 = b*x + a*y; return grid(`${a}<i>x</i> + ${b}<i>y</i> = ${c1}<br>${b}<i>x</i> + ${a}<i>y</i> = ${c2}<br><br>For the solution (<i>x</i>, <i>y</i>) to the system above, what is the value of (${a - b})<i>x</i> - (${a - b})<i>y</i>?`, c1 - c2); },
      () => { const u=R(2,6), v=R(3,8); const c1 = 3*u + 2*v, c2 = 5*u - 2*v; return g(`<f>3/<i>x</i></f> + <f>2/<i>y</i></f> = ${c1}<br><f>5/<i>x</i></f> - <f>2/<i>y</i></f> = ${c2}<br><br>In the system of equations above, what is the value of <f>1/<i>x</i></f>?`, u); },
      () => { const m1=R(2,5), b=R(4,9); // y = m1*x, y = -m1*x + 2*b -> intersect at (b/m1, b), y-int at (0,0) and (0, 2b). Area = (1/2)*(2b)*(b/m1)
        const base=R(4,10)*2, ix=R(3,7); return g(`In the <i>xy</i>-plane, the lines <i>x</i> = 0, <i>y</i> = 2<i>x</i>, and <i>y</i> = -2<i>x</i> + ${4*ix} bound a triangle. What is the area of this triangle?`, 2*ix*ix); },
      () => { const x=R(3,8), y=R(4,9), z=R(5,12); const s1=x+y, s2=y+z, s3=x+z; return g(`<i>x</i> + <i>y</i> = ${s1}<br><i>y</i> + <i>z</i> = ${s2}<br><i>x</i> + <i>z</i> = ${s3}<br><br>Based on the system of three equations above, what is the value of <i>x</i> + <i>y</i> + <i>z</i>?`, x + y + z); },
      () => { const p1=12, p2=18, q1=R(10,25), q2=R(10,25); const rev1 = p1*q1 + p2*q2, rev2 = p2*q1 + p1*q2; const tbl=`<table style="margin:10px auto;border-collapse:collapse;text-align:center;width:270px;border:1px solid var(--line)"><tr style="background:var(--panel2)"><th style="padding:5px;border:1px solid var(--line)">Day</th><th style="padding:5px;border:1px solid var(--line)">Child ($12)</th><th style="padding:5px;border:1px solid var(--line)">Adult ($18)</th><th style="padding:5px;border:1px solid var(--line)">Revenue</th></tr><tr><td style="padding:5px;border:1px solid var(--line)">Fri</td><td style="padding:5px;border:1px solid var(--line)"><i>x</i></td><td style="padding:5px;border:1px solid var(--line)"><i>y</i></td><td style="padding:5px;border:1px solid var(--line)">$${rev1}</td></tr><tr><td style="padding:5px;border:1px solid var(--line)">Sat</td><td style="padding:5px;border:1px solid var(--line)"><i>y</i></td><td style="padding:5px;border:1px solid var(--line)"><i>x</i></td><td style="padding:5px;border:1px solid var(--line)">$${rev2}</td></tr></table>`; return grid(`${tbl}A planetarium sold <i>x</i> child tickets and <i>y</i> adult tickets on Friday, and reversed those quantities on Saturday, as shown in the table. What is the value of <i>x</i> + <i>y</i>?`, q1 + q2); },
      () => { const a=R(3,8), b=R(4,9), k=R(2,5); return g(`${a}<i>x</i> + ${b}<i>y</i> = 14<br><i>cx</i> + ${b*k}<i>y</i> = ${14*k + 5}<br><br>For what value of the constant <i>c</i> does the system of equations have no solution?`, String(a*k), [String(a*k), String(-a*k), `<f>${a}/${k}</f>`, String(b*k)]); },
      () => { const vBoat=R(14,26), vCur=R(3,7), t=R(2,5); const dDown=(vBoat+vCur)*t, dUp=(vBoat-vCur)*t; return g(`A riverboat travels ${dDown} miles downstream in ${t} hours and travels ${dUp} miles upstream in the same ${t} hours. What is the speed of the river current, in miles per hour?`, vCur); },
      () => { const a=R(3,7), b=R(2,6), x=R(4,10), y=R(3,9); const c1=a*x+b*y, c2=x-y; return g(`If ${a}<i>x</i> + ${b}<i>y</i> = ${c1} and <i>x</i> - <i>y</i> = ${c2}, what is the value of (${a+1})<i>x</i> + (${b-1})<i>y</i>?`, c1 + c2); },
      () => { const k=R(3,9), m=R(4,11); const x=R(2,6), y=R(3,8); return g(`In the <i>xy</i>-plane, the lines <i>ax</i> + 2<i>y</i> = ${k*x + 2*y} and 3<i>x</i> + <i>by</i> = ${3*x + m*y} intersect at the point (${x}, ${y}). What is the value of <i>a</i> + <i>b</i>?`, k + m); },
      () => { const c1=20, c2=50, totVol=300, targetConc=35; // 50-50 split -> 150 mL each
        const v2 = R(2,8)*30, v1 = v2; const tot = v1 + v2; return grid(`A pharmacist combines <i>x</i> milliliters of a 20% saline solution with <i>y</i> milliliters of a 50% saline solution to produce ${tot} milliliters of a 35% saline solution. What is the value of <i>x</i>?`, v1); },
      () => { const a=R(2,6), b=R(3,7), c=R(10,30); const mult=R(2,4); return g(`If 2(${a}<i>x</i> - ${b}<i>y</i>) = ${c}, what is the value of ${a*mult}<i>x</i> - ${b*mult}<i>y</i>?`, (c/2)*mult); },
      () => { const s=R(15,35), d=R(3,11); const x = s + d, y = s - d; return g(`The sum of two numbers is ${x+y}, and half of their difference is ${d}. What is the greater of the two numbers?`, x); },
      () => { const a=R(3,8), b=R(4,11); return g(`In the system of equations ${a}<i>x</i> - ${b}<i>y</i> = 8 and ${2*a}<i>x</i> - ${2*b}<i>y</i> = <i>k</i>, for what value of <i>k</i> does the graph of the system in the <i>xy</i>-plane consist of a single line?`, "16", ["16", "8", "4", "0"]); },
      () => { const x=R(4,12), y=R(5,15); const p = 3*x + 2*y, q = 2*x + 3*y; return g(`If 3<i>x</i> + 2<i>y</i> = ${p} and 2<i>x</i> + 3<i>y</i> = ${q}, what is the value of 5(<i>x</i> + <i>y</i>)?`, p + q); },
      () => { const a=R(2,5), b=R(3,7), k=R(4,9); return grid(`<f><i>x</i> + <i>y</i>/${a}</f> = ${k}<br><f><i>x</i> - <i>y</i>/${b}</f> = 2<br><br>Based on the system of equations above, what is the value of <i>x</i>?`, (a*k + 2*b)/2); },
      () => { const n5=R(8,20), n10=R(6,18); const totCount=n5+n10, totVal=5*n5+10*n10; return g(`A cash register contains ${totCount} bills consisting only of $5 bills and $10 bills. If the total value of the bills is $${totVal}, how many $10 bills are in the register?`, n10); },
      () => { const m1=R(2,6), m2=-R(2,6), yInt=R(5,20); return g(`In the <i>xy</i>-plane, what is the point of intersection of the lines <i>y</i> = ${m1}<i>x</i> + ${yInt} and <i>y</i> = ${m2}<i>x</i> + ${yInt}?`, `(0, ${yInt})`, [`(0, ${yInt})`, `(${yInt}, 0)`, `(${m1}, ${m2})`, `(1, ${m1 + yInt})`]); },
      () => { const a=R(3,7), b=R(4,9), x=R(2,6), y=R(3,8); const c1=a*x+b*y, c2=a*x-b*y; return g(`${a}<i>x</i> + ${b}<i>y</i> = ${c1}<br>${a}<i>x</i> - ${b}<i>y</i> = ${c2}<br><br>If (<i>x</i>, <i>y</i>) is the solution to the system above, what is the value of ${b}<i>y</i>?`, b*y); }
    ],
    // === Topic 4: Linear inequalities ===
    [
      () => { const m1=R(2,4), b1=R(3,8), m2=-R(1,3), b2=R(18,30); const xMax = Math.floor((b2 - b1)/(m1 - m2)); const yAtX = m1*xMax + b1; return g(`<i>y</i> ≥ ${m1}<i>x</i> + ${b1}<br><i>y</i> ≤ ${m2}<i>x</i> + ${b2}<br><br>In the <i>xy</i>-plane, if (<i>x</i>, <i>y</i>) lies in the solution region of the system of inequalities above, what is the maximum possible integer value of <i>x</i>? (Hint: Graph both inequalities in Desmos to inspect the vertex.)`, String(xMax), [String(xMax), String(xMax + 1), String(xMax - 1), String(yAtX)]); },
      () => { const h=R(4,10)*2, b=R(6,14)*2; const area = (b * h) / 2; return g(`In the <i>xy</i>-plane, a triangular region is bounded by the inequalities <i>y</i> ≥ 0, <i>y</i> ≤ <f>${h}/${b/2}</f><i>x</i>, and <i>y</i> ≤ -<f>${h}/${b/2}</f>(<i>x</i> - ${b}). What is the area of this bounded region in the <i>xy</i>-plane?`, String(area), [String(area), String(area * 2), String(b * h), String(area / 2)]); },
      () => { const cost=(R(180, 450)/10).toFixed(2), max=R(5, 12), budget=(parseFloat(cost)*max + R(10, parseFloat(cost)*10 - 1)/10).toFixed(2); return g(`Concert t-shirts cost $${cost} each. With a budget of $${budget}, what is the maximum number of shirts you can buy?`, max); },
      () => { const a=R(3,6), c=R(12,28), d=R(4,9); const minX = c - d, maxX = c + d; const sumEnds = 2*c; return g(`If |${a}<i>x</i> - ${a*c}| ≤ ${a*d}, and the minimum and maximum possible values of <i>x</i> are <i>m</i> and <i>M</i> respectively, what is the value of <i>M</i>² - <i>m</i>²?`, String(maxX*maxX - minX*minX), [String(maxX*maxX - minX*minX), String(2*d), String(2*c), String((maxX - minX)*(maxX - minX))]); },
      () => { const xMin=R(2,5), xMax=xMin+R(4,7), yMin=R(3,6), yMax=yMin+R(4,8), a=R(3,7), b=R(2,6); const maxVal = a*xMax - b*yMin; return g(`Suppose ${xMin} ≤ <i>x</i> ≤ ${xMax} and ${yMin} ≤ <i>y</i> ≤ ${yMax}. What is the difference between the maximum possible value and the minimum possible value of the expression ${a}<i>x</i> - ${b}<i>y</i>?`, String((a*xMax - b*yMin) - (a*xMin - b*yMax)), [String((a*xMax - b*yMin) - (a*xMin - b*yMax)), String(a*xMax - b*yMin), String(a*(xMax-xMin)), String(b*(yMax-yMin))]); },
      () => { const m=R(2,5), b=R(4,12), k=R(3,9); return g(`In the <i>xy</i>-plane, the system of inequalities <i>y</i> &gt; ${m}<i>x</i> + ${b} and <i>y</i> &lt; -<i>x</i> - ${k} has solutions in which quadrants?`, "Quadrants II and III only", ["Quadrants II and III only", "Quadrants I, II, and III", "Quadrants II, III, and IV", "Quadrants I and II only"]); },
      // 7. Двойные (compound) неравенства: найти сумму или количество целых решений
      () => {
        const a = R(2, 5), b = R(3, 10), low = R(-5, 2), range = R(6, 12);
        const high = low + range;
        // a*x + b between a*low + b and a*high + b
        const lVal = a * low + b, hVal = a * high + b;
        return g(`If ${lVal} < ${a}<i>x</i> + ${b} ≤ ${hVal}, what is the greatest integer value of <i>x</i> that satisfies the inequality?`, high);
      },
      // 8. Наименьшее целое решение для составного линейного неравенства
      () => {
        const a = R(2, 6), b = R(5, 15), x0 = R(4, 12);
        const limit = a * x0 - b + 1;
        return g(`What is the smallest integer value of <i>x</i> such that ${a}<i>x</i> - ${b} ≥ ${limit}?`, x0);
      },
      // 9. Текстовая задача: бюджет на поездки на такси (фиксированная плата + стоимость за милю)
      () => {
        const base = R(3, 7), perMile = R(2, 5), budget = R(35, 75);
        const maxMiles = Math.floor((budget - base) / perMile);
        return grid(`A taxi service charges a flat pick-up fee of $${base} plus $${perMile} for each mile traveled. If a passenger has a maximum budget of $${budget} and does not tip, what is the greatest whole number of miles they can travel?`, maxMiles);
      },
      // 10. Проверка точки (x, y) в системе неравенств с двумя переменными
      () => {
        const m1 = R(1, 3), b1 = R(1, 5), m2 = -R(1, 3), b2 = R(10, 18);
        const testX = R(1, 4), testY = R(6, 12);
        // y > m1*x + b1 and y < m2*x + b2
        const cond1 = testY > m1 * testX + b1;
        const cond2 = testY < m2 * testX + b2;
        const ans = (cond1 && cond2) ? "Yes" : "No";
        return g(`In the <i>xy</i>-plane, does the point (${testX}, ${testY}) satisfy the system of inequalities <i>y</i> > ${m1}<i>x</i> + ${b1} and <i>y</i> < ${m2}<i>x</i> + ${b2}?`, ans, [
          ans,
          ans === "Yes" ? "No" : "Yes",
          "Only the first inequality is satisfied",
          "Only the second inequality is satisfied"
        ]);
      },
      // 11. Нахождение минимального целого количества упаковок/предметов (округление вверх)
      () => {
        const itemCost = R(12, 28), bulkFee = R(45, 95), target = R(250, 500, 50);
        const minItems = Math.ceil((target - bulkFee) / itemCost);
        return g(`A catering company has fixed kitchen overhead costs of $${bulkFee} and spends $${itemCost} per guest to prepare a banquet meal. If the total event budget is at least $${target}, what is the minimum whole number of guests the company must serve?`, minItems);
      },
      // 12. Неравенство с дробными коэффициентами: найти диапазон
      () => {
        const d = R(2, 5), num = R(3, 8), x0 = R(10, 30) * d;
        const rhs = (num / d) * x0;
        return g(`What is the greatest integer <i>x</i> that satisfies <f>${num}/${d}</f><i>x</i> ≤ ${rhs}?`, x0);
      },
      // 13. Сумма наибольшего и наименьшего целого решения в диапазоне
      () => {
        const low = R(-3, 3), high = low + R(6, 12);
        // inequality: low <= x <= high
        return g(`How many integers <i>x</i> satisfy the compound inequality ${low} ≤ <i>x</i> < ${high}?`, high - low);
      },
      // 14. Выражение через другое неравенство: если ax > b, то каково минимальное целое для cx?
      () => {
        const a = R(3, 7), b = R(12, 35);
        const minX = Math.floor(b / a) + 1;
        return grid(`If ${a}<i>x</i> > ${b} and <i>x</i> is an integer, what is the minimum possible value of <i>x</i>?`, minX);
      },
      // 15. Максимальное количество часов работы по тарифу с учетом налогов/комиссий
      () => {
        const hourly = R(18, 35), taxRate = 0.2, netTarget = R(400, 800, 50);
        // hourly * h * (1 - 0.2) >= netTarget -> hourly * 0.8 * h >= netTarget
        const netHourly = hourly * 0.8;
        const minHours = Math.ceil(netTarget / netHourly);
        return g(`An independent contractor earns $${hourly} per hour before a 20% self-employment tax deduction. What is the minimum whole number of hours the contractor must work to net at least $${netTarget} after taxes?`, minHours);
      },
      // 16. Линейное неравенство с отрицательным коэффициентом (проверка смены знака)
      () => {
        const a = R(2, 7), b = R(10, 30), x0 = R(2, 8);
        // -a*x + b >= -a*x0 + b -> -a*x >= -a*x0 -> x <= x0
        const rhs = -a * x0 + b;
        return g(`What is the greatest integer <i>x</i> that satisfies -${a}<i>x</i> + ${b} ≥ ${rhs}?`, x0);
      },
      // 17. Периметр треугольника или прямоугольника ограничен сверху
      () => {
        const width = R(5, 12), maxPerim = R(60, 100, 2);
        // 2(length + width) <= maxPerim -> length + width <= maxPerim/2 -> length <= maxPerim/2 - width
        const maxLen = Math.floor(maxPerim / 2) - width;
        return g(`A rectangle has a fixed width of ${width} centimeters. If its perimeter must be at most ${maxPerim} centimeters, what is the maximum possible integer length of the rectangle, in centimeters?`, maxLen);
      },
      // 18. Сравнение двух тарифных планов через неравенство (при каком количестве минут план А дешевле)
      () => {
        const feeA = R(10, 25), rateA = R(5, 12);
        const feeB = R(30, 50), rateB = R(2, 4);
        // feeA + rateA * m < feeB + rateB * m -> (rateA - rateB) * m < feeB - feeA
        const threshold = Math.floor((feeB - feeA) / (rateA - rateB));
        return grid(`Plan A costs a $${feeA} monthly fee plus $${rateA} per gigabyte. Plan B costs a $${feeB} monthly fee plus $${rateB} per gigabyte. What is the maximum whole number of gigabytes you can use in a month for Plan A to remain the cheaper option?`, threshold);
      },
      // 19. Неравенство с модулем (или абсолютным значением на базовом уровне SAT): |x - a| <= b
      () => {
        const center = R(5, 20), radius = R(3, 9);
        const low = center - radius, high = center + radius;
        return g(`If |<i>x</i> - ${center}| ≤ ${radius}, what is the sum of the minimum and maximum possible integer values of <i>x</i>?`, low + high);
      },
      // 20. Задача про средний балл (GPA / Test average): сколько нужно набрать на последнем экзамене
      () => {
        const tests = 4, targetAvg = R(80, 90);
        const currentSum = tests * (targetAvg - R(3, 7));
        const needed = targetAvg * (tests + 1) - currentSum;
        return g(`A student has an average score of ${Math.round(currentSum/tests)} across their first ${tests} math tests. What is the minimum integer score the student must earn on the 5th test to achieve an average of at least ${targetAvg} overall?`, needed);
      },
      // 21. Ограничение вместимости лифта или грузовика (weight limits)
      () => {
        const boxWt = R(35, 65), personWt = R(140, 190), maxCap = R(1500, 2200, 100);
        const persons = R(4, 7);
        const maxBoxes = Math.floor((maxCap - persons * personWt) / boxWt);
        return g(`An elevator has a maximum safety weight capacity of ${maxCap} pounds. If ${persons} adult passengers with an average weight of ${personWt} pounds board the elevator, what is the maximum whole number of ${boxWt}-pound supply boxes that can also be safely loaded?`, maxBoxes);
      },
      // 22. Нахождение наибольшего целого решения для неравенства с дробями
      () => {
        const den = R(3, 8), num = R(2, 5), x0 = R(5, 15);
        // (num/den)*x < num/den * x0 + 2 -> find max integer x
        const maxInt = x0 + Math.floor((den * 2) / num) - 1;
        return grid(`What is the greatest integer <i>x</i> that satisfies <f>${num}/${den}</f><i>x</i> < ${ (num/den)*x0 + 1 }?`, Math.floor((( (num/den)*x0 + 1 ) * den) / num) - 1);
      },
      // 23. Интерпретация закрашенной области системы неравенств в xy-plane
      () => {
        const m = R(1, 3), b = R(2, 8);
        const ans = `The region below the solid line <i>y</i> = ${m}<i>x</i> + ${b}`;
        return g(`In the <i>xy</i>-plane, which of the following describes the solution set to the inequality <i>y</i> ≤ ${m}<i>x</i> + ${b}?`, ans, [
          ans,
          `The region above the dashed line <i>y</i> = ${m}<i>x</i> + ${b}`,
          `The half-plane strictly below the dashed line <i>y</i> = ${m}<i>x</i> + ${b}`,
          `A single line segment connecting the intercepts on the coordinate axes`
        ]);
      },
      // 24. Неравенство с двумя неизвестными в реальном контексте (покупка фруктов)
      () => {
        const p1 = R(2, 4), p2 = R(3, 6), budget = R(30, 60);
        // p1*x + p2*y <= budget, if y = 4, max x?
        const yFixed = R(2, 5);
        const maxX = Math.floor((budget - p2 * yFixed) / p1);
        return g(`Apples cost $${p1} per pound and oranges cost $${p2} per pound. With a strict budget of $${budget}, if a shopper purchases exactly ${yFixed} pounds of oranges, what is the maximum whole number of pounds of apples they can buy?`, maxX);
      },
      // 25. Определение знака выражения по заданному неравенству
      () => {
        const a = R(2, 8), b = R(3, 12);
        // if a*x > b*y with positive x, y...
        return g(`If <i>a</i> > 0 and <i>a</i> < <i>b</i>, which of the following must be true for any real number <i>c</i> where <i>c</i> < 0?`, `<i>ac</i> > <i>bc</i>`, [
          `<i>ac</i> > <i>bc</i>`,
          `<i>a</i> + <i>c</i> > <i>b</i> + <i>c</i>`,
          `<f><i>c</i>/<i>a</i></f> > <f><i>c</i>/<i>b</i></f>`,
          `<i>a</i> - <i>c</i> > <i>b</i> - <i>c</i>`
        ]);
      },
      // 26. Минимальное количество рабочих дней для выполнения заказа
      () => {
        const ratePerDay = R(120, 250, 10), totalNeeded = R(1500, 3500, 100);
        const days = Math.ceil(totalNeeded / ratePerDay);
        return g(`A factory must manufacture at least ${totalNeeded} precision gears. If the production line yields ${ratePerDay} gears per standard workday, what is the minimum whole number of workdays required to fulfill the order?`, days);
      },
      // 27. Неравенство с квадратом (простейшее нацеленное на диапазон действительных чисел)
      () => {
        const n = R(3, 8);
        const sq = n * n;
        return g(`If <i>x</i>² ≤ ${sq} and <i>x</i> is an integer, what is the sum of all possible values of <i>x</i>?`, 0);
      },
      // 28. Максимально возможная ширина при фиксированной площади и мин/макс длине
      () => {
        const area = R(120, 300, 10), minLen = R(10, 18);
        const maxW = Math.floor(area / minLen);
        return grid(`A rectangular banner has an area of exactly ${area} square feet. If its length is required to be at least ${minLen} feet, what is the maximum possible integer width of the banner, in feet?`, maxW);
      },
      // 29. Запас прочности конструкций (нагрузка на балку)
      () => {
        const loadPerBeam = R(250, 400, 50), baseWeight = R(1200, 2000, 100), maxLoad = R(5000, 8000, 500);
        const maxBeams = Math.floor((maxLoad - baseWeight) / loadPerBeam);
        return g(`A structural platform weighs a base of ${baseWeight} pounds and can safely support a total weight of up to ${maxLoad} pounds. If each heavy machinery crate placed on the platform weighs ${loadPerBeam} pounds, what is the maximum whole number of crates that can be safely loaded?`, maxBeams);
      },
      // 30. Поиск диапазона для переменной в системе двух неравенств
      () => {
        const low1 = R(2, 6), high1 = low1 + R(4, 8);
        const low2 = R(1, 4), high2 = low2 + R(5, 10);
        // Overlap of low1 < x < high1 and low2 < x < high2
        const trueLow = Math.max(low1, low2);
        const trueHigh = Math.min(high1, high2);
        return g(`If ${low1} < <i>x</i> < ${high1} and ${low2} < <i>x</i> < ${high2}, what is the maximum possible integer value of <i>x</i> in the overlapping solution set?`, trueHigh - 1);
      },
      () => { const m1=1, b1=2, m2=-1, b2=4; const gr=svg(`<polygon points="${tX(1)},${tY(3)} ${tX(8)},${tY(10)} ${tX(8)},${tY(-4)}" fill="rgba(34,163,129,0.25)"/><line x1="${tX(-6)}" y1="${tY(-4)}" x2="${tX(8)}" y2="${tY(10)}" stroke="#22a381" stroke-width="2.5"/><line x1="${tX(-4)}" y1="${tY(8)}" x2="${tX(8)}" y2="${tY(-4)}" stroke="#e74c3c" stroke-width="2.5"/>`); return g(`${gr}The shaded region in the <i>xy</i>-plane above represents the solution set to a system of two inequalities: <i>y</i> ≤ <i>x</i> + 2 and <i>y</i> ≥ -<i>x</i> + 4. Which of the following points lies in the shaded solution region?`, "(5, 3)", ["(5, 3)", "(0, 0)", "(-2, 4)", "(1, 6)"]); },
      () => { const a=R(3,7), b=R(10,25), c=R(4,9); // y <= -a*x + b and y >= c*x + 2 -> in Q1, max y is b
        const yMax = R(12,28), m1=R(2,5), m2=R(2,5); return g(`<i>y</i> ≤ -${m1}<i>x</i> + ${yMax}<br><i>y</i> ≤ ${m2}<i>x</i> + ${yMax}<br><br>In the <i>xy</i>-plane, what is the maximum possible value of <i>y</i> for any point (<i>x</i>, <i>y</i>) that satisfies the system of inequalities above?`, yMax); },
      () => { const a=R(3,8), b=R(4,12), k=R(5,14); const lo = -a*k + b, hi = a*k + b; return grid(`If ${lo} ≤ -${a}<i>x</i> + ${b} ≤ ${hi}, what is the greatest possible integer value of <i>x</i>?`, k); },
      () => { const p=R(12,25), q=R(30,50), maxW=R(600,950,50), xFixed=R(10,18); const maxY = Math.floor((maxW - p*xFixed)/q); return g(`A freightdrone can carry a maximum payload of ${maxW} pounds. It is loaded with ${xFixed} medical kits weighing ${p} pounds each and <i>y</i> water canisters weighing ${q} pounds each. What is the maximum whole number of water canisters the drone can carry?`, maxY); },
      () => { const c=R(10,30), r=R(3,8); // |x - c| < r -> integers from c-r+1 to c+r-1 -> count = 2r - 1
        return g(`How many integers <i>x</i> satisfy the strict absolute value inequality |<i>x</i> - ${c}| < ${r}?`, 2*r - 1); },
      () => { const a=R(2,5), b=R(6,15); return g(`In the <i>xy</i>-plane, the solution set of the system of inequalities <i>y</i> > ${a}<i>x</i> + ${b} and <i>y</i> < -${a}<i>x</i> - ${b} lies entirely in which quadrants?`, "Quadrants II and III only", ["Quadrants II and III only", "Quadrants I and IV only", "Quadrant I only", "Quadrants I, II, and III"]); },
      () => { const rCost=R(15,30), sPrice=rCost+R(12,25), fixed=R(600,1500,100); const minN = Math.floor(fixed/(sPrice-rCost)) + 1; return g(`A craftsperson spends $${fixed} on workshop rent each month plus $${rCost} in materials for each chair built. The chairs sell for $${sPrice} each. What is the minimum whole number of chairs the craftsperson must build and sell in a month to make a strictly positive profit?`, minN); },
      () => { const a=R(3,7), b=R(4,9), x0=R(5,12); // a*x - b < k has largest integer x0 -> when x=x0 it holds, when x=x0+1 it fails -> k = a*(x0+1) - b
        const k = a*(x0+1) - b; return grid(`If ${x0} is the greatest integer <i>x</i> that satisfies the strict inequality ${a}<i>x</i> - ${b} < ${k}, what is the greatest integer that satisfies ${a}<i>x</i> - ${b} < ${k + 2*a}?`, x0 + 2); },
      () => { const a=R(2,6), b=R(3,8); const loX=R(2,5), hiX=loX+R(3,6), loY=R(1,4), hiY=loY+R(3,6); return g(`If ${loX} ≤ <i>x</i> ≤ ${hiX} and ${loY} ≤ <i>y</i> ≤ ${hiY}, what is the maximum possible value of ${a}<i>x</i> - ${b}<i>y</i>?`, a*hiX - b*loY); },
      () => { const tbl=`<table style="margin:10px auto;border-collapse:collapse;text-align:center;width:260px;border:1px solid var(--line)"><tr style="background:var(--panel2)"><th style="padding:5px;border:1px solid var(--line)">Nutrient</th><th style="padding:5px;border:1px solid var(--line)">Feed A (per kg)</th><th style="padding:5px;border:1px solid var(--line)">Feed B (per kg)</th></tr><tr><td style="padding:5px;border:1px solid var(--line)">Protein</td><td style="padding:5px;border:1px solid var(--line)">120 g</td><td style="padding:5px;border:1px solid var(--line)">80 g</td></tr><tr><td style="padding:5px;border:1px solid var(--line)">Fiber</td><td style="padding:5px;border:1px solid var(--line)">40 g</td><td style="padding:5px;border:1px solid var(--line)">90 g</td></tr></table>`; return g(`${tbl}A veterinarian prepares a mixture of <i>x</i> kilograms of Feed A and <i>y</i> kilograms of Feed B. The mixture must contain at least 2,400 grams of protein and at most 1,800 grams of fiber. Which system of inequalities represents this situation?`, `120<i>x</i> + 80<i>y</i> ≥ 2,400 and 40<i>x</i> + 90<i>y</i> ≤ 1,800`, [`120<i>x</i> + 80<i>y</i> ≥ 2,400 and 40<i>x</i> + 90<i>y</i> ≤ 1,800`, `120<i>x</i> + 40<i>y</i> ≥ 2,400 and 80<i>x</i> + 90<i>y</i> ≤ 1,800`, `120<i>x</i> + 80<i>y</i> ≤ 2,400 and 40<i>x</i> + 90<i>y</i> ≥ 1,800`, `160<i>x</i> + 170<i>y</i> ≥ 4,200`]); },
      () => { const d1=R(3,6), d2=R(2,5,d1), k=R(2,6); const lim = d1*d2*k; return g(`What is the smallest integer <i>x</i> that satisfies <f><i>x</i>/${d1}</f> + <f><i>x</i>/${d2}</f> > ${(d1+d2)*k}?`, lim + 1); },
      () => { const s1=R(8,15), s2=R(16,25); const minInt = s2 - s1 + 1, maxInt = s1 + s2 - 1; return g(`A non-degenerate triangle has two sides of lengths ${s1} centimeters and ${s2} centimeters. If the third side has an integer length of <i>x</i> centimeters, what is the difference between the maximum and minimum possible integer values of <i>x</i>?`, maxInt - minInt); },
      () => { const m=R(2,6), b=R(5,15), x0=R(3,8); const y0 = m*x0 + b + R(2,7); return grid(`In the <i>xy</i>-plane, the point (${x0}, ${y0}) lies in the solution set of the inequality <i>y</i> > ${m}<i>x</i> + <i>k</i>, where <i>k</i> is an integer constant. What is the greatest possible integer value of <i>k</i>?`, y0 - m*x0 - 1); },
      () => { const a=R(4,10), b=R(3,8), c=R(2,7); const xMax = R(5,12); const rhs = (a+b)*xMax - c; return g(`What is the greatest integer <i>x</i> that satisfies ${a}(<i>x</i> - 1) + ${b}<i>x</i> ≤ ${(a+b)*xMax - a}?`, xMax); },
      () => { const target=R(85,92), s1=target-4, s2=target-2, s3=target+1, s4=target-5; const minS5 = 5*target - (s1+s2+s3+s4); return g(`To earn an honors certificate, a student's mean score across 5 exams must be at least ${target}. On the first 4 exams, the student scored ${s1}, ${s2}, ${s3}, and ${s4}. What is the minimum score the student must earn on the 5th exam to receive the certificate?`, minS5); },
      () => { const k=R(3,8), m=R(10,30); return g(`Which of the following inequalities has the exact same solution set as -${k}<i>x</i> + ${m} < ${m + k*5}?`, `<i>x</i> > -5`, [`<i>x</i> > -5`, `<i>x</i> < -5`, `<i>x</i> > 5`, `<i>x</i> < 5`]); },
      () => { const p=R(15,35), q=R(40,80); return g(`If ${p} ≤ 3<i>x</i> + 6 ≤ ${q}, how many integer values of 3<i>x</i> satisfy the inequality?`, q - p + 1); },
      () => { const cap=R(20,40)*10, a=R(4,8), b=R(5,10); return g(`A concert venue has a maximum capacity of ${cap} people. Each band member brings ${a} guests, and each stagehand brings ${b} guests. If <i>m</i> band members and <i>s</i> stagehands attend along with all their guests, which inequality represents the capacity constraint?`, `${a+1}<i>m</i> + ${b+1}<i>s</i> ≤ ${cap}`, [`${a+1}<i>m</i> + ${b+1}<i>s</i> ≤ ${cap}`, `${a}<i>m</i> + ${b}<i>s</i> ≤ ${cap}`, `(${a} + ${b})(<i>m</i> + <i>s</i>) ≤ ${cap}`, `${a+1}<i>m</i> + ${b+1}<i>s</i> ≥ ${cap}`]); },
      () => { const a=R(2,5), b=R(6,18); return grid(`If <i>y</i> > ${a}<i>x</i> + ${b} and <i>y</i> < ${a*3}<i>x</i> - ${b}, what is the smallest integer value of <i>x</i> for which there exists a real number <i>y</i> satisfying both inequalities?`, Math.floor((2*b)/(2*a)) + 1); },
      () => { const w=R(6,14), minA=w*R(12,22), maxP=2*(w + R(25,35)); const minL = minA/w, maxL = maxP/2 - w; return g(`A rectangular solar panel has a fixed width of ${w} feet. Its area must be at least ${minA} square feet, and its perimeter must be at most ${maxP} feet. How many possible integer values are there for the length, in feet, of the solar panel?`, maxL - minL + 1); }
    ],
    // === Topic 5: Nonlinear functions ===
    [
      () => { const val=R(150, 450)*100, r=(R(75,95)/100).toFixed(2); return g(`The function y = ${val}(${r})ˣ estimates a vehicle's value x years after purchase. What was the initial value in dollars?`, val); },
      () => { const mult=R(250,850), rate=(R(105,145)/100).toFixed(2), d=R(5,15); return g(`The population is modeled by f(x) = ${mult}(${rate})^(x/${d}). The value increases by p% every ${d} years. Find p.`, Math.round((rate-1)*100)); },
      () => { const k=R(3,8), diff=R(5,15), y=R(8,20), x=k*y+diff; return g(`The product of two positive integers is ${x*y}. The first integer is ${diff} more than ${k} times the second. Find the smaller integer.`, y); },
      () => { const h=R(4,10), a=R(2,7), k=a*h*h; return grid(`The parabola h(x) = ${a}(x-${h})² - ${k} intersects the x-axis at (0,0) and (t,0). What is the value of t?`, 2*h); },
      () => { const b=R(15,45)*2, c=R(2000,5000), vX=b/2, min=vX*vX-b*vX+c; return g(`Find the minimum value of the function f(x) = x² - ${b}x + ${c}.`, min); },
      () => { const a=R(2,5), h=R(3,8), k=R(4,15), d=R(2,5); const yVal = a*d*d + k; return g(`The quadratic function <i>f</i> is defined by <i>f</i>(<i>x</i>) = ${a}(<i>x</i> - <i>h</i>)² + <i>k</i>, where <i>h</i> and <i>k</i> are constants. In the <i>xy</i>-plane, the graph of <i>f</i> passes through the points (${h - d}, ${yVal}) and (${h + d}, ${yVal}), and its minimum value is ${k}. What is the <i>y</i>-intercept of the graph of <i>f</i>?`, String(a*h*h + k), [String(a*h*h + k), String(k), String(a*h + k), String(yVal)]); },
      // 7. Средняя скорость изменения нелинейной функции (Average rate of change) на интервале
      () => {
        const a = R(2, 5), x1 = R(1, 3), x2 = x1 + R(2, 4);
        const y1 = a * x1 * x1, y2 = a * x2 * x2;
        const avgRate = (y2 - y1) / (x2 - x1);
        return g(`The function <i>f</i> is defined by <i>f</i>(<i>x</i>) = ${a}<i>x</i>². What is the average rate of change of <i>f</i> from <i>x</i> = ${x1} to <i>x</i> = ${x2}?`, avgRate);
      },
      // 8. Сдвиг экспоненциальной функции по горизонтали и вертикали: f(x - h) + k
      () => { const a=R(2,6), b=getEl([2,3]), h=R(1,3), k=R(2,8); return g(`The function <i>f</i> is defined by <i>f</i>(<i>x</i>) = ${a*Math.pow(b,h)}(${b})<sup><i>x</i> - ${h}</sup> + ${k}. What is the <i>y</i>-coordinate of the <i>y</i>-intercept of the graph of <i>y</i> = <i>f</i>(<i>x</i>) in the <i>xy</i>-plane?`, a + k); },
      // 9. Нахождение максимального значения квадратичной функции, заданной в факторной форме f(x) = -a(x - r1)(x - r2)
      () => {
        const a = R(2, 5), r1 = R(2, 6) * 2, r2 = r1 + R(2, 8) * 2;
        const vertexX = (r1 + r2) / 2;
        const maxVal = -a * (vertexX - r1) * (vertexX - r2);
        return grid(`The function <i>f</i> is defined by <i>f</i>(<i>x</i>) = -${a}(<i>x</i> - ${r1})(<i>x</i> - ${r2}). What is the maximum value of <i>f</i>?`, maxVal);
      },
      // 10. Экспоненциальный рост с удвоением: через сколько лет популяция достигнет значения
      () => {
        const init = R(200, 500, 50), tDouble = R(3, 7);
        const k = R(2, 4), target = init * Math.pow(2, k);
        const years = tDouble * k;
        return g(`A bacterial culture grows exponentially according to the model <i>P</i>(<i>t</i>) = ${init}(2)<sup><i>t</i>/${tDouble}</sup>, where <i>t</i> is time in hours. After how many hours will the population reach ${target}?`, years);
      },
      // 11. Сумма корней квадратного уравнения через коэффициенты (Vieta's formulas)
      () => {
        const sumRoots = R(6, 24, 2), prodRoots = R(8, 35);
        const b = sumRoots, c = prodRoots;
        return g(`The quadratic equation <i>x</i>² - ${b}<i>x</i> + ${c} = 0 has roots <i>r</i>₁ and <i>r</i>₂. What is the value of <i>r</i>₁ + <i>r</i>₂?`, sumRoots);
      },
      // 12. Произведение корней квадратного уравнения через свободный член
      () => { const a=R(2,5), b=R(10,30), q=R(3,12), c=a*q; return g(`The quadratic equation ${a}<i>x</i>² + ${b}<i>x</i> + ${c} = 0 has solutions <i>p</i> and <i>q</i>. What is the value of the product <i>pq</i>?`, q); },
      // 13. Область определения (Domain) квадратного корня: f(x) = sqrt(ax - b)
      () => {
        const a = R(2, 6), b = R(10, 40);
        const boundary = b / a;
        const ans = `<i>x</i> ≥ ${boundary}`;
        return g(`What is the domain of the function <i>f</i> defined by <i>f</i>(<i>x</i>) = √(${a}<i>x</i> - ${b})?`, ans, [
          ans,
          `<i>x</i> ≤ ${boundary}`,
          `<i>x</i> > ${boundary}`,
          `All real numbers`
        ]);
      },
      // 14. Недопустимое значение переменной (Domain restriction) для рациональной функции
      () => {
        const a = R(2, 6), root = R(3, 12);
        const ans = String(root);
        return grid(`The function <i>f</i> is defined by <i>f</i>(<i>x</i>) = <f><i>x</i> + ${R(2,9)}/${a}<i>x</i> - ${a*root}</f>. For what value of <i>x</i> is the function <i>f</i> undefined?`, ans);
      },
      // 15. Значение функции от выражения: дано f(x), найти f(2x) или f(x + k)
      () => {
        const a = R(2, 5), b = R(3, 9), c = R(1, 8), xVal = R(2, 5);
        // f(x) = ax^2 + bx + c. Find f(x + 2) expanded coefficient or value at xVal
        const ans = a * (xVal + 1) * (xVal + 1) + b * (xVal + 1) + c;
        return g(`The function <i>f</i> is defined by <i>f</i>(<i>x</i>) = ${a}<i>x</i>² + ${b}<i>x</i> + ${c}. What is the value of <i>f</i>(${xVal} + 1)?`, ans);
      },
      // 16. Определение знаков коэффициентов a, b, c по графику параболы (SVG)
      () => {
        const a = -1, h = 3, k = 4; // opens down, vertex at (3, 4) -> f(x) = -(x-3)^2 + 4 = -x^2 + 6x - 5
        const graph = svg(`<path d="M ${tX(-1)} ${tY(-16)} Q ${tX(3)} ${tY(8)} ${tX(7)} ${tY(-16)}" fill="none" stroke="#22a381" stroke-width="3"/><line x1="0" y1="${tY(0)}" x2="200" y2="${tY(0)}" stroke="#0f2b4a" stroke-width="2"/><line x1="${tX(0)}" y1="0" x2="${tX(0)}" y2="200" stroke="#0f2b4a" stroke-width="2"/>`);
        const ans = "<i>a</i> < 0, <i>b</i> > 0, <i>c</i> < 0";
        return g(`${graph}The graph of the quadratic function <i>f</i>(<i>x</i>) = <i>ax</i>² + <i>bx</i> + <i>c</i> is shown in the <i>xy</i>-plane above. Which of the following statements about the signs of <i>a</i>, <i>b</i>, and <i>c</i> must be true?`, ans, [
          ans,
          "<i>a</i> > 0, <i>b</i> < 0, <i>c</i> > 0",
          "<i>a</i> < 0, <i>b</i> < 0, <i>c</i> > 0",
          "<i>a</i> > 0, <i>b</i> > 0, <i>c</i> < 0"
        ]);
      },
      // 17. Экспоненциальный распад: период полураспада (Half-life)
      () => {
        const init = R(400, 900, 50), halfLife = R(3, 10);
        const k = R(2, 4), rem = init / Math.pow(2, k);
        const time = halfLife * k;
        return g(`The mass of a radioactive isotope decays according to the function <i>M</i>(<i>t</i>) = ${init}(0.5)<sup><i>t</i>/${halfLife}</sup>, where <i>t</i> is time in days. After how many days will the remaining mass be ${rem}?`, time);
      },
      // 18. Перевод процентов роста в основание экспоненты (Growth factor)
      () => {
        const p = R(3, 18);
        const factor = (1 + p / 100).toFixed(2);
        const ans = `<i>y</i> = 1000(${factor})<sup><i>t</i></sup>`;
        return g(`An investment of $1,000 grows at an annual interest rate of ${p}%, compounded annually. Which of the following equations best models the investment's value <i>y</i> after <i>t</i> years?`, ans, [
          ans,
          `<i>y</i> = 1000(1 + ${p}<i>t</i>)`,
          `<i>y</i> = 1000(${p / 100})<sup><i>t</i></sup>`,
          `<i>y</i> = 1000 + ${p}<sup><i>t</i></sup>`
        ]);
      },
      // 19. Дискриминант квадратичной функции: при каких c уравнение имеет два решения
      () => { const a=R(1,3), m=R(2,5), b=2*a*m, k=a*m*m; return g(`The equation ${a}<i>x</i>² + ${b}<i>x</i> + <i>c</i> = 0 has two distinct real solutions, where <i>c</i> is a constant. Which inequality must be true for <i>c</i>?`, `<i>c</i> < ${k}`, [`<i>c</i> < ${k}`, `<i>c</i> > ${k}`, `<i>c</i> = ${k}`, `<i>c</i> < ${-k}`]); },
      // 20. Нахождение координаты вершины параболы по заданному уравнению
      () => { const a=R(1,4), m=R(1,6), c=R(10,50), b=2*a*m; return g(`In the <i>xy</i>-plane, the vertex of the parabola <i>y</i> = ${a}<i>x</i>² + ${b}<i>x</i> + ${c} is (<i>h</i>, <i>k</i>). What is the value of <i>h</i> + <i>k</i>?`, -m + c - a*m*m); },
      // 21. Решение уравнения с квадратным корнем и проверкой на посторонние корни (Extraneous solution)
      () => {
        const a = R(3, 9), b = R(2, 8);
        // sqrt(x + a) = x - b -> x + a = (x - b)^2
        const xSol = a + b + 1; // подогнанный целый корень
        const constantTerm = xSol + a - (xSol - b) * (xSol - b); // проверка
        return grid(`What is the solution to the equation √(<font><i>x</i> + ${a}</font>) = <i>x</i> - ${b}?`, xSol);
      },
      // 22. Рациональная функция с горизонтальной асимптотой
      () => {
        const a = R(2, 7), b = R(3, 9);
        const ans = `<f>${a}/${b}</f>`;
        return g(`What is the equation of the horizontal asymptote of the graph of <i>y</i> = <f>${a}<i>x</i> + 15/${b}<i>x</i> - 4</f> in the <i>xy</i>-plane?`, `<i>y</i> = ${ans}`, [
          `<i>y</i> = ${ans}`,
          `<i>y</i> = <f>15/4</f>`,
          `<i>y</i> = 0`,
          `There is no horizontal asymptote`
        ]);
      },
      // 23. Разность значений квадратичной функции f(x2) - f(x1) при симметричных точках относительно вершины
      () => {
        const a = R(2, 5), vx = R(3, 8), c = R(5, 20);
        const offset = R(1, 3);
        const x1 = vx - offset, x2 = vx + offset;
        // Since symmetric around vertex, f(x1) == f(x2)
        return g(`The function <i>f</i> is defined by <i>f</i>(<i>x</i>) = ${a}(<i>x</i> - ${vx})² + ${c}. What is the value of <i>f</i>(${x1}) - <i>f</i>(${x2})?`, 0);
      },
      // 24. Перевод из одной формы квадратичной функции в другую (Vertex form to standard form coefficient b)
      () => {
        const a = R(3, 14), h = R(4, 18), k = R(10, 85);
        const bCoeff = -2 * a * h;
        return g(`The quadratic function <i>f</i> is given in vertex form by <i>f</i>(<i>x</i>) = ${a}(<i>x</i> - ${h})² + ${k}. When written in standard form <i>f</i>(<i>x</i>) = <i>ax</i>² + <i>bx</i> + <i>c</i>, what is the value of the coefficient <i>b</i>?`, bCoeff);
      },
      // 25. Bluebook Hard (image_2.png): Quadratic projectile vertex model launched from ground (0 ft), max height at t_m, find height at t_1
      () => {
        const a = getEl([3, 4, 5, 6, 8, 9, 12, 16]);
        const tm = R(8, 24);
        const hMax = a * tm * tm;
        const dt = R(2, Math.min(8, tm - 1));
        const t1 = tm + dt;
        const ans = hMax - a * dt * dt;
        return g(`A quadratic function models the height, in feet, of an object above the ground in terms of time, in seconds, after the object is launched. The model indicates the object launched from the ground (0 feet) and reaches its maximum height of ${hMax} feet above the ground ${tm} seconds after being launched. Based on the model, what is the height, in feet, of the object above the ground ${t1} seconds after being launched?`, String(ans), [
          String(ans),
          String(hMax - a * dt * (dt + 2)),
          String(hMax - a * (dt - 1) * (dt - 1)),
          String(Math.round(hMax * (2 * tm - t1) / tm))
        ]);
      },
      // 26. Bluebook Hard (image_2.png Grid variant): Quadratic projectile vertex model launched from ground, find height at t_1 (Grid-in)
      () => {
        const a = getEl([2, 4, 5, 8, 10, 16]);
        const tm = R(6, 22);
        const hMax = a * tm * tm;
        const dt = R(2, Math.min(7, tm - 1));
        const t1 = tm + dt;
        const ans = hMax - a * dt * dt;
        return g(`A quadratic function models the height, in feet, of an object above the ground in terms of time, in seconds, after the object is launched from the ground (0 feet). The object reaches its maximum height of ${hMax} feet above the ground ${tm} seconds after being launched. Based on the model, what is the height, in feet, of the object above the ground ${t1} seconds after being launched?`, ans);
      },
      // 27. Bluebook Hard (image_5.png): Rational cubic y = (x^3 + bx^2 + cx + d)/(x - p), y-intercept (0, K/p), x-intercepts r1, r2, find greatest w for (w, 0)
      () => {
        const r1 = R(2, 7), r2 = R(r1 + 1, 12), r3 = R(14, 38);
        const p = R(41, 89);
        const K = r1 * r2 * r3;
        const cCoeff = r1 * r2 + r1 * r3 + r2 * r3;
        return g(`<i>y</i> = <f><i>x</i>³ + <i>bx</i>² + ${cCoeff}<i>x</i> + <i>d</i>/<i>x</i> - ${p}</f><br><br>In the given equation, <i>b</i> and <i>d</i> are constants. In the <i>xy</i>-plane, the graph of the equation intersects the <i>y</i>-axis at (0, <f>${K}/${p}</f>) and intersects the <i>x</i>-axis when <i>x</i> = ${r1} and <i>x</i> = ${r2}. If the graph of the equation passes through the point (<i>w</i>, 0) in the <i>xy</i>-plane, what is the greatest possible value of <i>w</i>?`, String(r3), [
          String(r3),
          String(p),
          String(r2),
          String(r1 * r3)
        ]);
      },
      // 28. Bluebook Hard (image_9.png): Exponential function h(x) = a^x + b passing through (0, y0) and (2, y2), find ab
      () => {
        const a = R(2, 16), b = R(2, 25);
        const y0 = 1 + b, y2 = a * a + b;
        const ans = a * b;
        return g(`The function <i>h</i> is defined by <i>h</i>(<i>x</i>) = <i>a</i><sup><i>x</i></sup> + <i>b</i>, where <i>a</i> and <i>b</i> are positive constants. The graph of <i>y</i> = <i>h</i>(<i>x</i>) in the <i>xy</i>-plane passes through the points (0, ${y0}) and (2, ${y2}). What is the value of <i>ab</i>?`, String(ans), [
          String(ans),
          String(a * y0),
          String(a + b),
          String((a + 1) * b)
        ]);
      },
      // 29. Bluebook Hard (image_9.png Grid variant): Exponential function h(x) = a^x + b passing through (0, y0) and (2, y2), find ab (Grid-in)
      () => {
        const a = R(3, 18), b = R(3, 28);
        const y0 = 1 + b, y2 = a * a + b;
        return grid(`The function <i>h</i> is defined by <i>h</i>(<i>x</i>) = <i>a</i><sup><i>x</i></sup> + <i>b</i>, where <i>a</i> and <i>b</i> are positive constants. The graph of <i>y</i> = <i>h</i>(<i>x</i>) in the <i>xy</i>-plane passes through the points (0, ${y0}) and (2, ${y2}). What is the value of <i>ab</i>?`, a * b);
      },
      // 30. Bluebook Hard: Quadratic function f(x) = a(x - h)^2 + k passing through symmetric points, find vertex y-coordinate
      () => {
        const a = R(2, 9), h = R(4, 16), k = R(12, 75), d = R(3, 8);
        const x1 = h - d, x2 = h + d, yVal = a * d * d + k;
        return g(`In the <i>xy</i>-plane, the graph of the quadratic function <i>f</i>(<i>x</i>) = ${a}<i>x</i>² + <i>bx</i> + <i>c</i> passes through the points (${x1}, ${yVal}) and (${x2}, ${yVal}). If the minimum value of <i>f</i> is ${k}, what is the value of <i>f</i>(${h}) + ${h}?`, k + h);
      },
      () => { const h=R(-3,3), k=R(-5,-1), a=1; const gr=svgParabola(a, h, k, `(${h}, ${k})`); return g(`${gr}The graph of the quadratic function <i>f</i>(<i>x</i>) = (<i>x</i> - ${h})² ${k} is shown in the <i>xy</i>-plane above, with vertex (${h}, ${k}). What is the value of <i>f</i>(${h + 4})?`, 16 + k); },
      () => { const h=R(1,4), k=R(4,8); const gr=svgParabola(-1, h, k, `(${h}, ${k})`); return g(`${gr}The parabola shown in the <i>xy</i>-plane above has vertex (${h}, ${k}) and passes through (${h+2}, ${k-4}). What is the <i>y</i>-coordinate of the <i>y</i>-intercept of the parabola?`, -h*h + k); },
      () => { const a=R(2,5), r1=R(2,6), r2=r1+R(4,10,2); const vx=(r1+r2)/2, vy = a*(vx-r1)*(vx-r2); return grid(`The quadratic function <i>f</i> is defined by <i>f</i>(<i>x</i>) = ${a}(<i>x</i> - ${r1})(<i>x</i> - ${r2}). In the <i>xy</i>-plane, the vertex of the graph of <i>y</i> = <i>f</i>(<i>x</i>) is (<i>h</i>, <i>k</i>). What is the value of <i>k</i>?`, vy); },
      () => { const a=R(2,5), h=R(3,8), k=R(10,30); const tbl=`<table style="margin:10px auto;border-collapse:collapse;text-align:center;width:240px;border:1px solid var(--line)"><tr style="background:var(--panel2)"><th style="padding:5px;border:1px solid var(--line)"><i>x</i></th><th style="padding:5px;border:1px solid var(--line)"><i>f</i>(<i>x</i>)</th></tr><tr><td style="padding:5px;border:1px solid var(--line)">${h-2}</td><td style="padding:5px;border:1px solid var(--line)">${4*a+k}</td></tr><tr><td style="padding:5px;border:1px solid var(--line)">${h}</td><td style="padding:5px;border:1px solid var(--line)">${k}</td></tr><tr><td style="padding:5px;border:1px solid var(--line)">${h+2}</td><td style="padding:5px;border:1px solid var(--line)">${4*a+k}</td></tr></table>`; return g(`${tbl}The table above shows three values of <i>x</i> and their corresponding values for the quadratic function <i>f</i>. If the vertex of the parabola <i>y</i> = <i>f</i>(<i>x</i>) is (${h}, ${k}), what is the value of <i>f</i>(${h+3})?`, 9*a + k); },
      () => { const p0=R(3,9)*100, r=getEl([2,3]), d=R(4,8); return g(`A culture of phytoplankton grows according to the function <i>P</i>(<i>t</i>) = ${p0}(${r})<sup><i>t</i>/${d}</sup>, where <i>t</i> is measured in days. What is the ratio <f><i>P</i>(${3*d})/<i>P</i>(${d})</f>?`, r*r); },
      () => { const a=R(2,6), b=R(3,9); const x1=R(1,4), x2=x1+R(3,6); const avg = a*(x1+x2) + b; return g(`For the quadratic function <i>f</i>(<i>x</i>) = ${a}<i>x</i>² + ${b}<i>x</i> + 12, what is the average rate of change of <i>f</i> from <i>x</i> = ${x1} to <i>x</i> = ${x2}?`, avg); },
      () => { const h=R(3,9), k=R(4,14), a=R(2,6); return g(`In the <i>xy</i>-plane, the graph of <i>f</i>(<i>x</i>) = ${a}(<i>x</i> - ${h})² + ${k} is shifted 3 units to the right and 5 units down to form the graph of <i>y</i> = <i>g</i>(<i>x</i>). What is the vertex of the graph of <i>g</i>?`, `(${h+3}, ${k-5})`, [`(${h+3}, ${k-5})`, `(${h-3}, ${k-5})`, `(${h+3}, ${k+5})`, `(${h-3}, ${k+5})`]); },
      () => { const a=R(3,8), b=R(2,5), c=R(10,30); // f(x) = a*b^x - c. Horizontal asymptote is y = -c
        return grid(`In the <i>xy</i>-plane, the graph of the exponential function <i>f</i>(<i>x</i>) = ${a}(${b})<sup><i>x</i></sup> - ${c} approaches the horizontal asymptote <i>y</i> = <i>k</i> as <i>x</i> decreases without bound. What is the value of <i>k</i>?`, -c); },
      () => { const p=R(10,35), r=R(4,12); // R(x) = (100 - 2x)(20 + x) -> max at vertex
        const x1=R(4,10)*2, x2=x1+R(6,14)*2; const mid=(x1+x2)/2; return g(`A theater models its nightly ticket revenue <i>R</i>(<i>x</i>), in dollars, by the function <i>R</i>(<i>x</i>) = -15(<i>x</i> - ${x1})(<i>x</i> - ${x2}), where <i>x</i> is the ticket price in dollars. What ticket price <i>x</i> maximizes nightly revenue?`, mid); },
      () => { const a=R(2,5), c=R(3,9), x0=R(2,5); // f(x) = x^2 + a, g(x) = cx -> f(g(x0)) = (c*x0)^2 + a
        return g(`Let <i>f</i>(<i>x</i>) = <i>x</i>² + ${a} and <i>g</i>(<i>x</i>) = ${c}<i>x</i>. What is the value of <i>f</i>(<i>g</i>(${x0})) - <i>g</i>(<i>f</i>(${x0}))?`, (c*x0)*(c*x0) + a - c*(x0*x0 + a)); },
      () => { const a=R(2,6), h=R(4,11), d=R(3,8); const x1=h-d, x2=h+d; return g(`The quadratic function <i>g</i> is defined by <i>g</i>(<i>x</i>) = ${a}<i>x</i>² + <i>bx</i> + 19, where <i>b</i> is a constant. If <i>g</i>(${x1}) = <i>g</i>(${x2}), what is the value of <i>b</i>?`, -2*a*h); },
      () => { const v0=R(4,9)*1000, pct=getEl([15,20,25,30]); const mult=(1-pct/100).toFixed(2); return g(`The function <i>V</i>(<i>t</i>) = ${v0}(${mult})<sup><i>t</i>/3</sup> models the value, in dollars, of a piece of laboratory equipment <i>t</i> years after purchase. Which statement is the best interpretation of ${mult} in this context?`, `Every 3 years, the value of the equipment becomes ${100-pct}% of its value 3 years earlier.`, [`Every 3 years, the value of the equipment becomes ${100-pct}% of its value 3 years earlier.`, `Every year, the value of the equipment decreases by ${100-pct}%.`, `Every 3 years, the value of the equipment decreases by $${mult}.`, `After 3 years, the equipment is worth ${pct}% of its original value.`]); },
      () => { const r1=R(2,6), r2=R(7,12), a=R(2,5); const yInt = a * (-r1) * (-r2) * 3; return grid(`The cubic function <i>f</i> is defined by <i>f</i>(<i>x</i>) = ${a}(<i>x</i> - ${r1})(<i>x</i> - ${r2})(<i>x</i> - 3). What is the <i>y</i>-coordinate of the <i>y</i>-intercept of the graph of <i>y</i> = <i>f</i>(<i>x</i>)?`, -3*a*r1*r2); },
      () => { const k=R(4,12), m=R(3,9), x0=R(5,15); // f(x) = a/(x - h) + k -> vertical asymptote at x = h
        return g(`In the <i>xy</i>-plane, the graph of the rational function <i>f</i>(<i>x</i>) = <f>${m}<i>x</i> + 7/2<i>x</i> - ${2*x0}</f> has a vertical asymptote at the line <i>x</i> = <i>a</i>. What is the value of <i>a</i>?`, x0); },
      () => { const a=R(2,6), b=R(4,12), k=R(3,8); // f(x) = sqrt(a*x + b). Find x when f(x) = k -> a*x + b = k^2
        const ans = k*k - b; return g(`The function <i>f</i> is defined by <i>f</i>(<i>x</i>) = √(<i>x</i> + ${b}). For what value of <i>x</i> does <i>f</i>(<i>x</i>) = ${k}?`, ans); },
      () => { const a=R(2,5), b=R(3,7); // f(x) = a*(b^x). f(x+2) / f(x) = b^2
        return g(`For the exponential function <i>f</i>(<i>x</i>) = ${a}(${b})<sup><i>x</i></sup>, what is the value of <f><i>f</i>(<i>x</i> + 2)/<i>f</i>(<i>x</i>)</f> for any real number <i>x</i>?`, b*b); },
      () => { const h=R(4,10), w=2*h, areaMax = 2*h*h; // 3-sided fence: L + 2W = Perim -> max area = Perim^2 / 8
        const P = R(4,12)*4; const maxA = (P*P)/8; return grid(`A rancher has ${P} meters of fencing to enclose a rectangular pasture along a straight river bank, which requires no fencing along the river side. The area of the pasture as a function of its width <i>x</i> is <i>A</i>(<i>x</i>) = <i>x</i>(${P} - 2<i>x</i>). What is the maximum possible area, in square meters, of the pasture?`, maxA); },
      () => { const a=R(2,6), h=R(3,9), k=R(5,20); return g(`The quadratic function <i>f</i>(<i>x</i>) = -${a}(<i>x</i> - ${h})² + ${k} reaches its maximum value at <i>x</i> = <i>c</i>. What is the value of <i>f</i>(<i>c</i>) + <i>c</i>?`, String(k + h), [String(k + h), String(k - h), String(k), String(a + h + k)]); },
      () => { const b=R(2,4), y0=R(3,8); const y1=y0*b, y2=y1*b, y3=y2*b; const tbl=`<table style="margin:10px auto;border-collapse:collapse;text-align:center;width:230px;border:1px solid var(--line)"><tr style="background:var(--panel2)"><th style="padding:5px;border:1px solid var(--line)"><i>x</i></th><th style="padding:5px;border:1px solid var(--line)"><i>h</i>(<i>x</i>)</th></tr><tr><td style="padding:5px;border:1px solid var(--line)">0</td><td style="padding:5px;border:1px solid var(--line)">${y0}</td></tr><tr><td style="padding:5px;border:1px solid var(--line)">1</td><td style="padding:5px;border:1px solid var(--line)">${y1}</td></tr><tr><td style="padding:5px;border:1px solid var(--line)">2</td><td style="padding:5px;border:1px solid var(--line)">${y2}</td></tr></table>`; return g(`${tbl}The table above shows three values of the exponential function <i>h</i>(<i>x</i>) = <i>a</i>(<i>b</i>)<sup><i>x</i></sup>. What is the value of <i>h</i>(4)?`, y0 * Math.pow(b, 4)); },
      () => { const r1=R(3,8), r2=r1+R(2,6); // f(x) = x^2 - (r1+r2)x + r1*r2. Sum of zeros = r1+r2
        return g(`The graph of <i>f</i>(<i>x</i>) = 2<i>x</i>² - ${2*(r1+r2)}<i>x</i> + ${2*r1*r2} intersects the <i>x</i>-axis at (<i>p</i>, 0) and (<i>q</i>, 0). What is the value of <i>p</i> + <i>q</i>?`, r1 + r2); }
    ],
    // === Topic 6: Nonlinear equations in one variable ===
    [
      () => { const a=R(2,5), r=R(3,8); const k = 2*a*r, c = a*r*r; return g(`In the quadratic equation ${a}<i>x</i>² - <i>kx</i> + ${c + 12} = 12, <i>k</i> is a positive constant. If the equation has exactly one real solution, what is the value of <i>k</i>?`, String(k), [String(k), String(k/2), String(a*r), String(k*2)]); },
      () => { const b=R(7,15), c=R(3,11); const sumSq = b*b - 2*c; return g(`The quadratic equation <i>x</i>² - ${b}<i>x</i> + ${c} = 0 has two real solutions <i>r</i>₁ and <i>r</i>₂. Without solving for the individual roots, what is the exact value of <i>r</i>₁² + <i>r</i>₂²?`, String(sumSq), [String(sumSq), String(b*b), String(b*b + 2*c), String(b*b - c)]); },
      () => { const b=R(8,20), c=R(3,10); return g(`How many real solutions does the equation x² + ${b}x + ${c*40} = 0 have?`, "Zero", ["Zero", "One", "Two", "Infinitely many"]); },
      () => { const a=R(3,7), xValid=a*a + a; const b = a*a - a; return g(`What is the sum of all real solutions to the radical equation √(${2*a - 1}<i>x</i> - ${a*a - a}) = <i>x</i> - ${a}? (Be sure to check for extraneous solutions in Desmos!)`, String(a), [String(a), String(2*a), String(a*a), "0"]); },
      () => { const r1=R(2,5), r2=R(6,11); const S=r1+r2, P=r1*r2; return g(`If <i>p</i> and <i>q</i> are the solutions to the equation <i>x</i>² - ${S}<i>x</i> + ${P} = 0, what is the value of <f>1/<i>p</i></f> + <f>1/<i>q</i></f>?`, `<f>${S}/${P}</f>`, [`<f>${S}/${P}</f>`, `<f>${P}/${S}</f>`, `<f>1/${S}</f>`, String(S + P)]); },
      () => { const u1=R(2,4), u2=R(5,7); const A=u1*u1 + u2*u2, B=u1*u1 * u2*u2; return g(`<i>x</i>⁴ - ${A}<i>x</i>² + ${B} = 0<br><br>What is the positive difference between the greatest real solution and the least real solution to the quartic equation above?`, String(2*u2), [String(2*u2), String(u2 - u1), String(u2 + u1), String(2*u1)]); },
      () => { const a=R(2,5), h=R(3,8), k=R(5,19); const B = -2*a*h, C = a*h*h - k; return g(`When the quadratic expression ${a}<i>x</i>² ${B<0?'-':'+'} ${Math.abs(B)}<i>x</i> + ${C} is written in the equivalent completed-square form <i>a</i>(<i>x</i> - <i>h</i>)² - <i>k</i>, what is the value of <i>a</i> + <i>h</i> + <i>k</i>?`, String(a + h + k), [String(a + h + k), String(h + k), String(a*h + k), String(h - k)]); },
      // 8. Уравнение с абсолютной величиной: |ax - b| = c (положительный корень)
      () => { const a=R(2,5), m=R(2,8), n=R(1,9); return g(`What is the positive solution to the equation |${a}<i>x</i> - ${a*m}| = ${a*n}?`, m + n); },
      // 9. Радикальное уравнение
      () => { const a=R(3,8), b=R(4,10,a); const S = a + b; return g(`(<i>x</i> - ${a})(<i>x</i> + ${b}) = (<i>x</i> - ${a})(2<i>x</i> - ${a})<br><br>What is the sum of all distinct real solutions to the given equation?`, String(2*a + b), [String(2*a + b), String(a + b), String(a - b), String(2*a - b)]); },
      // 10. Рациональное уравнение, где один корень посторонний (обращает знаменатель в 0)
      () => { const r1=R(2,6), r2=-R(7,15); const ans = Math.max(r1, r2); return g(`What is the real solution to the equation <f>1/<i>x</i> - ${r1}</f> + <f>2/<i>x</i> - ${r2}</f> = <f>${r1 - r2 + 2}/(<i>x</i> - ${r1})(<i>x</i> - ${r2})</f>? (If there are two solutions, enter the larger one)`, ans); },
      // 11. Уравнение с дробным показателем степени: x^(a/b) = c
      () => { const b=R(2,5); return g(`If <i>x</i> > 0 and <i>x</i><sup>2/3</sup> = ${b*b}, what is the value of <i>x</i>?`, b*b*b); },
      // 12. Квадратное уравнение через замену (биквадратное): x^4 - s*x^2 + p = 0
      () => { const r1=R(2,4), r2=R(5,8); const s=r1*r1 + r2*r2, p=r1*r1 * r2*r2; const ans=r2; return grid(`If <i>x</i>⁴ - ${s}<i>x</i>² + ${p} = 0, what is the greatest real solution?`, ans); },
      // 13. Задачи о баллистике (Projectile motion): h(t) = -5t^2 + vt + h0 (время падения на землю)
      () => { const s=R(1,3), T=s+R(2,6); return g(`The height <i>h</i>, in meters, of a projectile above the ground <i>t</i> seconds after launch is modeled by <i>h</i>(<i>t</i>) = -5<i>t</i>² + ${5*(T-s)}<i>t</i> + ${5*T*s}. After how many seconds does the projectile hit the ground?`, T); },
      // 14. Дискриминант: при каком значении параметра k квадратное уравнение имеет ровно одно решение
      () => { const a=R(1,4), m=R(1,5), b=2*a*m, k=a*m*m; return g(`The equation ${a}<i>x</i>² + ${b}<i>x</i> + <i>k</i> = 0 has exactly one real solution, where <i>k</i> is a constant. What is the value of <i>k</i>?`, k); },
      // 15. Уравнение с радикалом: x - a*sqrt(x) = 0 (положительный корень)
      () => { const a=R(2,6); const validRoot = a*a; return g(`What is the positive real solution to the equation <i>x</i> - ${a}√<i>x</i> = 0?`, validRoot); },
      // 16. Нахождение суммы квадратов корней: r1^2 + r2^2
      () => { const r1=R(2,6), r2=R(3,7,r1); const sum=r1+r2, prod=r1*r2; return grid(`The quadratic equation <i>x</i>² - ${sum}<i>x</i> + ${prod} = 0 has solutions <i>r</i>₁ and <i>r</i>₂. What is the value of <i>r</i>₁² + <i>r</i>₂²?`, r1*r1 + r2*r2); },
      // 17. Рациональное уравнение с пропорцией (исправленное)
      () => { const k=R(3,7), x=R(3,10), b=(k-2)*x - k; return g(`What is the solution to the equation <f>2<i>x</i> + ${b}/<i>x</i> - 1</f> = ${k}?`, x); },
      // 18. Текстовая задача на площадь прямоугольника с нелинейным уравнением
      () => { const w=R(5,12), lenExtra=R(3,8), area=w*(w+lenExtra); return g(`The length of a rectangular rug is ${lenExtra} feet greater than its width. If the area of the rug is ${area} square feet, what is the width of the rug, in feet?`, w); },
      // 19. Разность корней квадратного уравнения |r2 - r1|
      () => { const r1=R(2,5), r2=r1+R(2,6); const sum=r1+r2, prod=r1*r2; const diff=r2-r1; return g(`The equation <i>x</i>² - ${sum}<i>x</i> + ${prod} = 0 has solutions <i>r</i>₁ and <i>r</i>₂, where <i>r</i>₂ > <i>r</i>₁. What is the value of <i>r</i>₂ - <i>r</i>₁?`, diff); },
      // 20. Уравнение с кубическим корнем ∛(x + a) = b
      () => { const b=R(2,5), a=R(1,15); const x=b*b*b - a; return grid(`What is the solution to the equation ∛(<i>x</i> + ${a}) = ${b}?`, x); },
      // 21. Нахождение параметра в уравнении после раскрытия квадрата
      () => { const a=R(2,8); const lhsB=2*a, lhsC=a*a; return g(`If (<i>x</i> + ${a})² = <i>x</i>² + ${lhsB}<i>x</i> + <i>c</i> for all values of <i>x</i>, what is the value of the constant <i>c</i>?`, lhsC); },
      // 22. Найти значение выражения x + 1/x из квадратного уравнения
      () => { const a=R(3,8); return g(`If <i>x</i>² - ${a}<i>x</i> + 1 = 0, what is the value of <i>x</i> + <f>1/<i>x</i></f>?`, a); },
      // 23. Замена переменной в квадратном уравнении: (x - shift)^2 - (r1+r2)(x - shift) + r1*r2 = 0 (исправленное)
      () => { const shift=R(1,4), r1=R(2,4), r2=R(5,8); return g(`What is the greater real solution to the equation (<i>x</i> - ${shift})² - ${r1+r2}(<i>x</i> - ${shift}) + ${r1*r2} = 0?`, shift + r2); },
      // 24. Уравнение с модулем, имеющее два решения (сумма решений)
      () => { const a=R(2,6), b=R(10,30); return grid(`What is the sum of all real solutions to the equation |<i>x</i> - ${a}| = ${b}?`, 2*a); },
      // 25. Найти коэффициент b в квадратном уравнении по известному корню и свободному члену
      () => { const root=R(2,7), otherRoot=R(8,14); const prod=root*otherRoot; return g(`The quadratic equation <i>x</i>² - <i>bx</i> + ${prod} = 0 has one solution at <i>x</i> = ${root}, where <i>b</i> is a constant. What is the value of <i>b</i>?`, root + otherRoot); },
      // 26. Радикальное уравнение с проверкой на посторонний корень (исправленное)
      () => { const k=R(3,8), c=k*k - k; return g(`What is the real solution to the equation √(<i>x</i> + ${c}) = <i>x</i>?`, k); },
      // 27. Составление квадратного уравнения по его корням
      () => { const r1=R(3,7), r2=R(8,14); const k = r1*r2; return g(`For what positive value of the constant <i>c</i> does the equation (<i>x</i> - ${r1})(<i>x</i> - ${r2}) = -<i>c</i> have exactly one real solution?`, `<f>${(r2-r1)*(r2-r1)}/4</f>`, [`<f>${(r2-r1)*(r2-r1)}/4</f>`, String((r2-r1)*(r2-r1)), `<f>${r1+r2}/2</f>`, String(r1*r2)]); },
      // 28. Максимальная высота баллистического снаряда h_max = c - b^2 / (4a)
      () => { const v=R(20,40)*2, h0=R(20,60,10); const maxH = h0 + (v*v)/20; return g(`The height of an object thrown upward is given by <i>h</i>(<i>t</i>) = -5<i>t</i>² + ${v}<i>t</i> + ${h0}. What is the maximum height, in meters, reached by the object?`, maxH); },
      // 29. Bluebook Hard (image_6.png): Parametric quadratic sum of solutions (2pa + 2qb)x^2 + (p^2 a^2 - q^2 b^2)x - cab = 0
      () => {
        const pairs = [[3, 5], [3, 7], [4, 7], [5, 7], [5, 9], [2, 7], [4, 9]];
        const [p, q] = getEl(pairs);
        const m = R(3, 14);
        const A1 = 2 * p, A2 = 2 * q;
        const B1 = p * p, B2 = q * q;
        const C = p * q * R(2, 5);
        const M1 = m * p, M2 = m * q;
        const den = 2 * m;
        const ans = `-<f>1/${den}</f>`;
        return g(`The given equation has two real solutions, where <i>a</i> and <i>b</i> are positive constants. The sum of the solutions to the given equation is <i>k</i>(${M1}<i>a</i> - ${M2}<i>b</i>), where <i>k</i> is a constant.<br><br>(${A1}<i>a</i> + ${A2}<i>b</i>)<i>x</i>² + (${B1}<i>a</i>² - ${B2}<i>b</i>²)<i>x</i> - ${C}<i>ab</i> = 0<br><br>What is the value of <i>k</i>?`, ans, [
          ans,
          `<f>1/${den}</f>`,
          `-<f>1/${m}</f>`,
          `-${den}`
        ]);
      },
      // 30. Bluebook Hard (image_5.png Grid variant): Rational cubic equation greatest x-intercept w
      () => {
        const r1 = R(2, 6), r2 = R(7, 13), r3 = R(15, 42);
        const p = R(45, 95);
        const K = r1 * r2 * r3;
        const cCoeff = r1 * r2 + r1 * r3 + r2 * r3;
        return grid(`<i>y</i> = <f><i>x</i>³ + <i>bx</i>² + ${cCoeff}<i>x</i> + <i>d</i>/<i>x</i> - ${p}</f><br><br>In the given equation, <i>b</i> and <i>d</i> are constants. In the <i>xy</i>-plane, the graph of the equation intersects the <i>y</i>-axis at (0, <f>${K}/${p}</f>) and intersects the <i>x</i>-axis when <i>x</i> = ${r1} and <i>x</i> = ${r2}. If the graph of the equation passes through the point (<i>w</i>, 0), what is the greatest possible value of <i>w</i>?`, r3);
      },
      () => { const a=R(2,5), m=R(3,8); const k = 2*a*m, c = a*m*m; return g(`${a}<i>x</i>² - <i>kx</i> + ${c} = 0<br><br>In the given equation, <i>k</i> is a positive constant. If the equation has exactly one real solution, what is the value of <i>k</i>?`, k); },
      () => { const r1=R(2,6), r2=R(3,7); // a*x^2 - b*x + c = 0 -> 1/r1 + 1/r2 = (r1+r2)/(r1*r2) = b/c
        const b = r1 + r2, c = r1 * r2; const g1 = gcd(b, c); return g(`If <i>p</i> and <i>q</i> are the two solutions to the quadratic equation 3<i>x</i>² - ${3*b}<i>x</i> + ${3*c} = 0, what is the value of <f>1/<i>p</i></f> + <f>1/<i>q</i></f>?`, `<f>${b/g1}/${c/g1}</f>`, [`<f>${b/g1}/${c/g1}</f>`, `<f>${c/g1}/${b/g1}</f>`, String(b), `<f>1/${c}</f>`]); },
      () => { const k=R(4,9), c=k*k - k; // sqrt(x + c) = x -> x^2 - x - c = 0 -> (x - k)(x + k - 1) = 0. Extraneous root is -(k-1)
        return g(`Consider the radical equation √(<i>x</i> + ${c}) = <i>x</i>. Squaring both sides yields a quadratic equation with two roots: one valid solution and one extraneous solution. What is the positive difference between the valid solution and the extraneous solution?`, 2*k - 1); },
      () => { const u1=R(2,5), u2=R(6,10), shift=R(3,8); const s=u1+u2, p=u1*u2; // let u = x - shift. u^2 - s*u + p = 0 -> x1+x2 = s + 2*shift
        return g(`(<i>x</i> - ${shift})² - ${s}(<i>x</i> - ${shift}) + ${p} = 0<br><br>What is the sum of the solutions to the given equation?`, s + 2*shift); },
      () => { const a=R(3,8), b=R(4,9), c=R(2,6); // (x - a)(x^2 - b^2) = 0 -> roots are a, b, -b. Sum of roots = a
        return grid(`(<i>x</i> - ${a})(<i>x</i>² - ${b*b}) = 0<br><br>What is the sum of all distinct real solutions to the given equation?`, a); },
      () => { const a=R(3,7), x=R(8,16); // a/(x-2) + a/(x+2) = 2*a*x / (x^2 - 4)
        const r=R(3,9); return g(`<f>${a}/<i>x</i> - ${r}</f> + <f>${a}/<i>x</i> + ${r}</f> = <f>${2*a*x}/<i>x</i>² - ${r*r}</f><br><br>If <i>x</i> > ${r}, what is the solution <i>x</i> to the given equation?`, x); },
      () => { const a=R(2,6), b=R(5,12); // |x^2 - b| = a -> four solutions: ±sqrt(b+a) and ±sqrt(b-a). Product of squares of solutions = (b+a)(b-a) = b^2 - a^2
        return g(`How many distinct real solutions does the equation |<i>x</i>² - ${b*b}| = ${a} have?`, 4); },
      () => { const w=R(6,14), l=w+R(4,10), border=R(2,4); const totA = (w + 2*border)*(l + 2*border); const fig=gSvg(220,145,`<rect x="25" y="20" width="170" height="105" fill="#d5f2ec" stroke="#0f2b4a" stroke-width="2.5"/><rect x="50" y="40" width="120" height="65" fill="#ffffff" stroke="#1f9d8a" stroke-width="2"/><text x="110" y="76" font-size="12" font-weight="bold" fill="#0f2b4a" text-anchor="middle">${w} × ${l}</text><text x="110" y="34" font-size="11" font-weight="bold" fill="#1f9d8a" text-anchor="middle">width = x</text>`); return g(`${fig}A rectangular garden measuring ${w} meters by ${l} meters is surrounded by a uniform gravel border of width <i>x</i> meters, as shown. If the combined area of the garden and the border is ${totA} square meters, what is the value of <i>x</i>?`, border); },
      () => { const s=R(5,12), p=R(3,10); // r1 + r2 = s, r1*r2 = p -> (r1 - r2)^2 = s^2 - 4p
        const r1=R(2,6), r2=r1+R(3,7); const sum=r1+r2, prod=r1*r2; return grid(`If <i>r</i>₁ and <i>r</i>₂ are the solutions to <i>x</i>² - ${sum}<i>x</i> + ${prod} = 0, what is the value of (<i>r</i>₁ - <i>r</i>₂)²?`, (r1 - r2)*(r1 - r2)); },
      () => { const a=R(2,5), b=R(3,8); // 2^(x^2 - a*x) = 2^(b)
        const r1=R(3,7), r2=-R(1,4); const sum=r1+r2, prod=r1*r2; return g(`If 3<sup><i>x</i>² - ${sum}<i>x</i></sup> = 3<sup>${-prod}</sup>, what is the sum of all real solutions for <i>x</i>?`, sum); },
      () => { const a=R(3,9), b=R(4,12); // x^3 - a*x^2 - b^2*x + a*b^2 = 0 -> (x - a)(x - b)(x + b) = 0 -> greatest root is max(a, b)
        return g(`<i>x</i>³ - ${a}<i>x</i>² - ${b*b}<i>x</i> + ${a*b*b} = 0<br><br>What is the greatest real solution to the polynomial equation above?`, Math.max(a, b)); },
      () => { const k=R(3,8), n=k*k; // x - (k + n/k)*sqrt(x) + n = 0 -> sqrt(x) = k -> x = k^2
        const s1=R(2,4), s2=R(5,7); const b=s1+s2, c=s1*s2; return g(`What is the greater real solution to the equation <i>x</i> - ${b}√<i>x</i> + ${c} = 0?`, s2*s2); },
      () => { const a=R(2,6), b=R(10,30); // ax^2 + bx + c = 0 has no real solutions if c > b^2 / (4a)
        const m=R(3,7), bVal=2*a*m, minInt = a*m*m + 1; return grid(`${a}<i>x</i>² - ${bVal}<i>x</i> + <i>c</i> = 0<br><br>In the given equation, <i>c</i> is an integer constant. What is the smallest integer value of <i>c</i> for which the equation has NO real solutions?`, minInt); },
      () => { const [leg1, leg2, hyp] = getEl([[5,12,13],[8,15,17],[7,24,25],[9,12,15]]); const diff = leg2 - leg1; const fig = svgRightTri(`x`, `x + ${diff}`, `${hyp}`); return g(`${fig}In the right triangle shown above, the legs have lengths <i>x</i> and <i>x</i> + ${diff}, and the hypotenuse has length ${hyp}. What is the value of <i>x</i>?`, leg1); },
      () => { const a=R(3,8), b=R(4,10); return g(`When the quadratic equation <i>x</i>² - ${2*a}<i>x</i> - ${b} = 0 is solved by completing the square, it can be written as (<i>x</i> - ${a})² = <i>k</i>. What is the value of <i>k</i>?`, String(a*a + b), [String(a*a + b), String(a*a - b), String(b - a*a), String(2*a + b)]); },
      () => { const r=R(3,8), a=R(2,6); // (x - r)/(x + a) = (x - r)*2 / (x + a) -> either x = r
        return g(`(2<i>x</i> - ${2*r})(<i>x</i> + ${a}) = (2<i>x</i> - ${2*r})(3<i>x</i> - ${a})<br><br>What is the sum of the two solutions to the given equation?`, r + a); },
      () => { const k=R(4,11); // x^2 + k*x = 0 -> roots 0 and -k
        const r1=R(3,9), r2=R(4,11); return g(`If (<i>x</i>² - ${r1*r1})(<i>x</i>² + ${r2*r2}) = 0, what is the positive real solution for <i>x</i>?`, r1); },
      () => { const a=R(3,8); // x - a/x = b -> x^2 - b*x - a = 0
        const x=R(4,10), k=R(2,5)*x; const rhs = x - k/x; return grid(`If <i>x</i> > 0 and <i>x</i> - <f>${k}/<i>x</i></f> = ${rhs}, what is the value of <i>x</i>?`, x); },
      () => { const a=R(2,5), b=R(4,9); // a*x^(3/2) = a*b^3 -> x = b^2
        return g(`If <i>x</i> > 0 and ${a}<i>x</i><sup>3/2</sup> = ${a*b*b*b}, what is the value of <i>x</i>?`, b*b); },
      () => { const r1=R(3,8), r2=R(4,10); // (x - r1)^2 = (x - r2)^2 -> x = (r1+r2)/2
        const p=R(2,6)*2, q=p+R(4,12)*2; return g(`What value of <i>x</i> satisfies the equation (<i>x</i> - ${p})² = (<i>x</i> - ${q})²?`, (p + q)/2); }
    ],
    // === Topic 7: Systems of nonlinear equations ===
    [
      () => { const m=R(2,6), x0=R(2,5), a=1; const b = m + 2*x0; const k = x0*x0 + m*x0; return g(`<i>y</i> = <i>x</i>² - ${b}<i>x</i> + ${k}<br><i>y</i> = -${m}<i>x</i><br><br>In the <i>xy</i>-plane, the line and the parabola in the system above are tangent at a single point (<i>x</i>₀, <i>y</i>₀). What is the value of <i>x</i>₀ - <i>y</i>₀?`, String(x0 + m*x0), [String(x0 + m*x0), String(x0 - m*x0), String(x0), String(k)]); },
      () => { const r=getEl([5,10,13,15]), d= (r===5?3:(r===10?6:(r===13?5:9))); const halfChord = Math.round(Math.sqrt(r*r - d*d)); return g(`In the <i>xy</i>-plane, the circle <i>x</i>² + <i>y</i>² = ${r*r} and the horizontal line <i>y</i> = ${d} intersect at points <i>A</i> and <i>B</i>. What is the length of chord <i>AB</i>?`, String(2*halfChord), [String(2*halfChord), String(halfChord), String(r*2), String(r + d)]); },
      () => { const x1=R(2,5), x2=R(6,9); const m = x1 + x2, c = x1 * x2; const y1 = x1*x1, y2 = x2*x2; return g(`<i>y</i> = <i>x</i>²<br><i>y</i> = ${m}<i>x</i> - ${c}<br><br>If (<i>x</i>₁, <i>y</i>₁) and (<i>x</i>₂, <i>y</i>₂) are the two solutions to the nonlinear system above, what is the value of <i>y</i>₁ + <i>y</i>₂?`, String(y1 + y2), [String(y1 + y2), String(x1 + x2), String(m*m), String(y2 - y1)]); },
      () => { const a=R(2,5), k=R(4,12); const c = k - a*a; return g(`<i>y</i> = <i>x</i>² + ${2*a}<i>x</i> + ${k}<br><i>y</i> = -<i>x</i>² - ${2*a}<i>x</i> + <i>c</i><br><br>In the system of equations above, <i>c</i> is a constant. If the system has exactly one real solution (<i>x</i>, <i>y</i>), what is the value of <i>c</i>?`, String(k - 2*a*a), [String(k - 2*a*a), String(k), String(k + 2*a*a), String(-k)]); },
      () => { const h=R(2,6), k=R(3,8), r=R(4,9); return g(`(<i>x</i> - ${h})² + (<i>y</i> - ${k})² = ${r*r}<br><i>y</i> - ${k} = <i>m</i>(<i>x</i> - ${h})<br><br>For any real constant <i>m</i>, at how many points in the <i>xy</i>-plane do the circle and the line in the system above intersect, and what is the distance between those intersection points?`, `2 points, distance ${2*r}`, [`2 points, distance ${2*r}`, `2 points, distance ${r}`, `1 point, distance 0`, `It depends on the slope m`]); },
      () => { const x=R(5,12), y=R(6,18); return g(`For the system x + y = ${x+y} and xy = ${x*y}, what is the larger value in the solution pair?`, Math.max(x,y), [Math.max(x,y), Math.min(x,y), x+y, x*y]); },
      () => { const c=R(10,30); return g(`If y = x² + ${c} and y = x - 8, how many real solutions are there?`, "Zero", ["Zero", "One", "Two", "Infinitely many"]); },
      // 8. Пересечение параболы y = x^2 и прямой y = mx + b (найти сумму x-координат точек пересечения)
      () => { const m=R(2,7), b=R(2,12); // x^2 - mx - b = 0 -> sum of x is m
        return g(`In the <i>xy</i>-plane, the graph of the line <i>y</i> = ${m}<i>x</i> + ${b} intersects the parabola <i>y</i> = <i>x</i>² at two points (<i>x</i>₁, <i>y</i>₁) and (<i>x</i>₂, <i>y</i>₂). What is the value of <i>x</i>₁ + <i>x</i>₂?`, m); },
      // 9. Произведение x-координат точек пересечения параболы y = x^2 и прямой y = mx + b
      () => { const m=R(2,6), b=R(6,20); // x^2 - mx - b = 0 -> prod of x is -b
        return g(`In the <i>xy</i>-plane, the graph of the line <i>y</i> = ${m}<i>x</i> + ${b} intersects the parabola <i>y</i> = <i>x</i>² at two points (<i>x</i>₁, <i>y</i>₁) and (<i>x</i>₂, <i>y</i>₂). What is the value of <i>x</i>₁<i>x</i>₂?`, -b); },
      // 10. Окружность x^2 + y^2 = r^2 и прямая y = k: сколько точек пересечения при |k| < r
      () => { const r=R(6,15), k=R(2, r-2);
        return g(`A circle in the <i>xy</i>-plane has the equation <i>x</i>² + <i>y</i>² = ${r*r}. The horizontal line <i>y</i> = ${k} intersects the circle at two points. What is the <i>x</i>-coordinate of the point with the positive <i>x</i>-coordinate?`, Math.sqrt(r*r - k*k)); },
      // 11. Система с параметром k: при каком значении k прямая касается параболы (ровно 1 решение)
      () => { const a=R(1,3), b=R(4,10); // y = ax^2, y = bx + c -> discriminant b^2 - 4ac = 0
        const c = -(b*b)/(4*a); // wait, let's make it clean integer: b is even, a=1 -> c = -b^2/4
        const bEven = R(2,6)*2, cVal = -(bEven*bEven)/4;
        return grid(`In the <i>xy</i>-plane, the line <i>y</i> = ${bEven}<i>x</i> + <i>c</i> intersects the parabola <i>y</i> = <i>x</i>² at exactly one point. What is the value of <i>c</i>?`, cVal); },
      // 12. Система из окружности и начала координат: расстояние до точки пересечения
      () => { const x=R(3,8), y=R(3,8); const rSq = x*x + y*y;
        return g(`If the circle <i>x</i>² + <i>y</i>² = ${rSq} and the line <i>y</i> = <f>${y}/${x}</f><i>x</i> intersect in the first quadrant at (<i>x</i>₀, <i>y</i>₀), what is the value of <i>x</i>₀²?`, x*x); },
      // 13. Система нелинейная с обратной пропорцией: y = c/x и y = x
      () => { const k=R(3,12); const ans=k; // x^2 = k^2 -> positive x = k
        return g(`If <i>y</i> = <f>${k*k}/<i>x</i></f> and <i>y</i> = <i>x</i> for <i>x</i> > 0, what is the value of <i>x</i>?`, ans); },
      // 14. Количество решений системы: парабола открытая вниз и горизонтальная линия ниже вершины
      () => { const topY=R(10,35);
        return g(`<i>y</i> = -<i>x</i>² + ${topY}<br><i>y</i> = -${R(5,15)}<br><br>How many real solutions (<i>x</i>, <i>y</i>) does the system of equations above have?`, 2); },
      // 15. Сумма y-координат точек пересечения параболы и прямой
      () => { const m=R(1,4), b=R(4,16); // x^2 - mx - b = 0. y1 + y2 = (mx1+b) + (mx2+b) = m(x1+x2) + 2b = m^2 + 2b
        const sumY = m*m + 2*b;
        return grid(`The line <i>y</i> = ${m}<i>x</i> + ${b} intersects the parabola <i>y</i> = <i>x</i>² at two points (<i>x</i>₁, <i>y</i>₁) and (<i>x</i>₂, <i>y</i>₂). What is the value of <i>y</i>₁ + <i>y</i>₂?`, sumY); },
      // 16. Система из двух парабол: y = x^2 + a и y = -x^2 + b
      () => { const a=R(2,8), b=R(20,40); // x^2 + a = -x^2 + b -> 2x^2 = b - a -> x^2 = (b-a)/2
        const halfDiff = (b - a)/2; const xPos = Math.sqrt(halfDiff);
        return g(`<i>y</i> = <i>x</i>² + ${a}<br><i>y</i> = -<i>x</i>² + ${b}<br><br>If (<i>x</i>, <i>y</i>) is a solution to the system above and <i>x</i> > 0, what is the value of <i>x</i>²?`, halfDiff); },
      // 17. Экспонента и прямая: y = 2^x и y = k, найти x
      () => { const p=R(3,7); const val = Math.pow(2, p);
        return g(`If <i>y</i> = 2<sup><i>x</i></sup> and <i>y</i> = ${val}, what is the value of <i>x</i>?`, p); },
      // 18. Система с кубической функцией и прямой: y = x^3 и y = kx
      () => { const m=R(4,16); const xPos = Math.sqrt(m); // x^3 = mx -> x(x^2 - m) = 0 -> x = sqrt(m)
        return g(`<i>y</i> = <i>x</i>³<br><i>y</i> = ${m}<i>x</i><br><br>For how many positive values of <i>x</i> do the graphs of the equations above intersect in the <i>xy</i>-plane?`, 1); }, // x=0 is origin, x=sqrt(m) is 1 positive
      // 19. Окружность смещенная от центра: (x-h)^2 + y^2 = r^2 пересечение с осью y
      () => { const [a,b,c]=getEl(TR); return grid(`In the <i>xy</i>-plane, the circle (<i>x</i> - ${a})² + <i>y</i>² = ${c*c} intersects the <i>y</i>-axis at two points. What is the positive <i>y</i>-coordinate of these intersection points?`, b); },
      // 20. Найти расстояние между двумя точками пересечения прямой и окружности
      () => { const r=R(5,10); // x^2 + y^2 = r^2 and y = 0 -> intersects at (-r,0) and (r,0), distance = 2r
        return g(`The circle <i>x</i>² + <i>y</i>² = ${r*r} is intersected by the line <i>y</i> = 0 at two points. What is the distance between these two points of intersection?`, 2*r); },
      // 21. Система уравнения окружности и прямой под углом
      () => { const r=R(5,10); // x^2 + y^2 = r^2, y = x -> 2x^2 = r^2 -> x = r / sqrt(2)... let's make it simpler: x^2 + y^2 = 50, y = 7x -> 50x^2 = 50 -> x=1
        const k=R(2,5), cSq = k*k + 1; const total = cSq * R(4,9);
        return g(`If <i>x</i>² + <i>y</i>² = ${total} and <i>y</i> = ${k}<i>x</i> for <i>x</i> > 0, what is the value of <i>x</i>²?`, total / (k*k + 1)); },
      // 22. Парабола и вертикальная линия (x = c)
      () => { const c=R(-6,6,0), a=R(2,5), b=R(3,9); const yVal = a*c*c + b*c + R(2,10);
        return g(`<i>y</i> = ${a}<i>x</i>² + ${b}<i>x</i> + ${yVal - a*c*c - b*c}<br><i>x</i> = ${c}<br><br>What is the <i>y</i>-coordinate of the intersection point (<i>x</i>, <i>y</i>) for the system above?`, yVal); },
      // 23. Радикальная функция и горизонтальная линия: sqrt(x) = k
      () => { const k=R(4,12); return grid(`If √<i>x</i> = ${k} and <i>y</i> = √<i>x</i>, what is the value of <i>y</i>²?`, k*k); },
      // 24. Система с абсолютной величиной и параболой: y = |x| и y = x^2
      () => { // x^2 = |x| -> x^2 - x = 0 (for x>=0) -> x = 0, x = 1. Number of positive intersections = 1
        return g(`<i>y</i> = |<i>x</i>|<br><i>y</i> = <i>x</i>²<br><br>At how many points in the <i>xy</i>-plane do the graphs of the two equations above intersect?`, 3); }, // x=-1, 0, 1 -> 3 points!
      // 25. Произведение координат точки пересечения двух ветвей
      () => { const a=R(2,5); return g(`If <i>y</i> = <i>x</i>² and <i>y</i> = <f>${a*a*a*a}/<i>x</i>²</f> for <i>x</i> > 0, what is the value of <i>x</i>?`, a*a); }, // x^2 = a^4/x^2 -> x^4 = a^4 -> x = a
      // 26. Найти минимальное расстояние от начала координат до точек пересечения параболы и прямой
      () => { const shift=R(4,10); return g(`In the <i>xy</i>-plane, the parabola <i>y</i> = <i>x</i>² - ${shift*shift} intersects the <i>x</i>-axis at two points. What is the distance between these two intersection points?`, 2*shift); },
      // 27. Система из трех переменных / уравнений: x^2 + y^2 = r^2, z = 5
      () => { const m=R(2,6), x0=R(2,5), a=1; const b = m + 2*x0; const k = x0*x0 + m*x0; return g(`<i>y</i> = <i>x</i>² - ${b}<i>x</i> + ${k}<br><i>y</i> = -${m}<i>x</i><br><br>In the <i>xy</i>-plane, the line and the parabola in the system above are tangent at a single point (<i>x</i>₀, <i>y</i>₀). What is the value of <i>x</i>₀ - <i>y</i>₀?`, String(x0 + m*x0), [String(x0 + m*x0), String(x0 - m*x0), String(x0), String(k)]); },
      // 28. Количество решений системы: две параболы, направленные навстречу друг другу
      () => { return grid(`<i>y</i> = <i>x</i>² + 5<br><i>y</i> = -<i>x</i>² - 5<br><br>How many real solutions (<i>x</i>, <i>y</i>) does the system of equations above have?`, 0); },
      // 29. Найти сумму координат (x + y) для единственной точки касания прямой и параболы
      () => { const m=4, b=-4; // y = x^2, y = 4x - 4 -> x^2 - 4x + 4 = 0 -> (x-2)^2 = 0 -> x=2, y=4. Sum = 6
        return g(`In the <i>xy</i>-plane, the line <i>y</i> = 4<i>x</i> - 4 is tangent to the parabola <i>y</i> = <i>x</i>² at the point (<i>x</i>, <i>y</i>). What is the value of <i>x</i> + <i>y</i>?`, 6); },
      // 30. Система с обратной пропорцией: y = a/x и y = b/x^2 (найти x)
      () => { const a=R(10,30), scale=R(2,5); const xVal = scale; const b = a * xVal; // a/x = b/x^2 -> ax = b -> x = b/a
        return g(`If <f>${a}/<i>x</i></f> = <f>${b}/<i>x</i>²</f> for <i>x</i> ≠ 0, what is the value of <i>x</i>?`, b / a); },
      () => { const h=1, k=-2; const gr=svg(`<polyline fill="none" stroke="#22a381" stroke-width="3" points="${Array.from({length:33},(_,i)=>{const px=-3+i*0.25,py=(px-1)*(px-1)-2;return tX(px)+','+tY(py)}).join(' ')}"/><line x1="${tX(-5)}" y1="${tY(-6)}" x2="${tX(6)}" y2="${tY(5)}" stroke="#e74c3c" stroke-width="2.5"/><circle cx="${tX(0)}" cy="${tY(-1)}" r="4" fill="#0f2b4a"/><circle cx="${tX(3)}" cy="${tY(2)}" r="4" fill="#0f2b4a"/>`); return g(`${gr}In the <i>xy</i>-plane above, the parabola <i>y</i> = (<i>x</i> - 1)² - 2 and the line <i>y</i> = <i>x</i> - 1 intersect at the points (0, -1) and (<i>a</i>, <i>b</i>), where <i>a</i> > 0. What is the value of <i>a</i> + <i>b</i>?`, 5); },
      () => { const [a,b,c] = getEl([[3,4,5],[6,8,10],[5,12,13]]); // circle x^2 + y^2 = c^2 and line x = a -> y = ±b, chord length = 2b
        return grid(`In the <i>xy</i>-plane, the vertical line <i>x</i> = ${a} intersects the circle <i>x</i>² + <i>y</i>² = ${c*c} at two points, <i>P</i> and <i>Q</i>. What is the length of segment <i>PQ</i>?`, 2*b); },
      () => { const m=R(2,6)*2, a=1; // y = x^2 + k and y = m*x -> x^2 - m*x + k = 0 -> tangent when m^2 - 4k = 0 -> k = (m/2)^2
        const half = m/2, k = half*half; return g(`<i>y</i> = <i>x</i>² + <i>k</i><br><i>y</i> = ${m}<i>x</i><br><br>In the given system of equations, <i>k</i> is a constant. If the system has exactly one real solution (<i>x</i>, <i>y</i>), what is the value of <i>k</i>?`, k); },
      () => { const s=R(6,15), p=R(5,20); // x + y = s and x*y = p -> x^2 + y^2 = s^2 - 2p
        return g(`If <i>x</i> + <i>y</i> = ${s} and <i>xy</i> = ${p}, what is the value of <i>x</i>² + <i>y</i>²?`, s*s - 2*p); },
      () => { const d=R(4,11), p=R(6,24); // x - y = d and xy = p -> (x + y)^2 = (x - y)^2 + 4xy = d^2 + 4p
        return g(`If <i>x</i> - <i>y</i> = ${d} and <i>xy</i> = ${p}, what is the value of (<i>x</i> + <i>y</i>)²?`, d*d + 4*p); },
      () => { const a=R(2,5), b=R(3,8); // y = x^2 - a*x and y = b*x -> x^2 - (a+b)x = 0 -> x = 0 and x = a+b
        const x2 = a + b, y2 = b * x2; return grid(`In the <i>xy</i>-plane, the graphs of <i>y</i> = <i>x</i>² - ${a}<i>x</i> and <i>y</i> = ${b}<i>x</i> intersect at the origin (0, 0) and at the point (<i>p</i>, <i>q</i>), where <i>p</i> > 0. What is the value of <i>p</i>?`, x2); },
      () => { const r1=R(2,5), r2=R(3,6); // y = x^2 + b1*x + c1 and y = x^2 + b2*x + c2 -> linear difference!
        const xSol=R(3,9), m1=R(2,5), m2=m1+R(2,4), c1=R(10,30), c2=c1 - (m2-m1)*xSol; return g(`<i>y</i> = 2<i>x</i>² + ${m1}<i>x</i> + ${c1}<br><i>y</i> = 2<i>x</i>² + ${m2}<i>x</i> + ${c2}<br><br>If (<i>x</i>, <i>y</i>) is the unique solution to the system of equations above, what is the value of <i>x</i>?`, xSol); },
      () => { const k=R(3,8); // y = x^2 - k^2 and y = -(x^2 - k^2) -> intersect at (-k, 0) and (k, 0)
        return g(`In the <i>xy</i>-plane, the graphs of <i>y</i> = <i>x</i>² - ${k*k} and <i>y</i> = -<i>x</i>² + ${k*k} intersect at two points. What is the distance between these two points?`, 2*k); },
      () => { const a=R(2,6), b=R(3,7); // x^2 - y^2 = a*b and x - y = a -> x + y = b
        return g(`If <i>x</i>² - <i>y</i>² = ${a*b} and <i>x</i> - <i>y</i> = ${a}, what is the value of <i>x</i> + <i>y</i>?`, b); },
      () => { const u=R(3,7)*2, v=R(2,5)*2; const x=(u+v)/2, y=(u-v)/2; // x^2 - y^2 = u*v and x + y = u -> x = (u+v)/2
        return grid(`If <i>x</i>² - <i>y</i>² = ${u*v} and <i>x</i> + <i>y</i> = ${u}, what is the value of <i>x</i>?`, x); },
      () => { const r=R(4,10), h=R(5,12); // (x - h)^2 + y^2 = r^2 and y = r -> tangent at (h, r)
        return g(`In the <i>xy</i>-plane, the circle (<i>x</i> - ${h})² + <i>y</i>² = ${r*r} and the horizontal line <i>y</i> = ${r} intersect at exactly one point. What are the coordinates of this point?`, `(${h}, ${r})`, [`(${h}, ${r})`, `(0, ${r})`, `(${r}, ${h})`, `(-${h}, ${r})`]); },
      () => { const c=R(5,15); // y = x^2 + c and y = 2x - 3 -> x^2 - 2x + (c+3) = 0 -> discriminant = 4 - 4(c+3) < 0 -> 0 solutions
        return g(`<i>y</i> = <i>x</i>² + ${c}<br><i>y</i> = 2<i>x</i> - 3<br><br>How many real solutions (<i>x</i>, <i>y</i>) does the given system of equations have?`, "Zero", ["Zero", "Exactly one", "Exactly two", "Infinitely many"]); },
      () => { const a=R(2,5), b=R(4,9); // y = a*x^2 and y = a*b^2 -> x = ±b -> rectangle or triangle with origin (0,0), (-b, ab^2), (b, ab^2) has area = (1/2)*(2b)*(ab^2) = a*b^3
        return g(`In the <i>xy</i>-plane, the line <i>y</i> = ${a*b*b} intersects the parabola <i>y</i> = ${a}<i>x</i>² at points <i>A</i> and <i>B</i>. If <i>O</i> is the origin (0, 0), what is the area of triangle <i>AOB</i>?`, a*b*b*b); },
      () => { const x1=1, x2=4; // y = x^2 + 2 and y = 5x - 2 -> x^2 - 5x + 4 = 0 -> x=1 (y=3), x=4 (y=18). Midpoint y = (3+18)/2
        const r1=R(1,4)*2, r2=r1+R(2,5)*2; const m = r1+r2, b = -r1*r2; const y1 = r1*r1, y2 = r2*r2; return g(`In the <i>xy</i>-plane, the line <i>y</i> = ${m}<i>x</i> - ${r1*r2} intersects the parabola <i>y</i> = <i>x</i>² at two points. What is the <i>x</i>-coordinate of the midpoint of the line segment connecting these two intersection points?`, (r1 + r2)/2); },
      () => { const k=R(3,8); // x*y = k^2 and y = x -> (k, k) and (-k, -k)
        return g(`In the <i>xy</i>-plane, the hyperbola <i>xy</i> = ${k*k} and the line <i>y</i> = <i>x</i> intersect at two points: (<i>a</i>, <i>b</i>) in Quadrant I and (<i>c</i>, <i>d</i>) in Quadrant III. What is the value of <i>a</i> - <i>c</i>?`, 2*k); },
      () => { const a=R(2,6), k=R(3,9); // y = |x - a| and y = k -> x = a + k and x = a - k -> sum of x = 2a
        return grid(`<i>y</i> = |<i>x</i> - ${a}|<br><i>y</i> = ${k}<br><br>The system of equations above has two solutions, (<i>x</i>₁, <i>y</i>₁) and (<i>x</i>₂, <i>y</i>₂). What is the value of <i>x</i>₁ + <i>x</i>₂?`, 2*a); },
      () => { const p=R(3,7), q=R(4,9); // x^2 + y = p and x + y = p -> x^2 - x = 0 -> x=0 or x=1
        return g(`<i>x</i>² + <i>y</i> = ${p}<br><i>x</i> + <i>y</i> = ${p}<br><br>If (<i>x</i>, <i>y</i>) is a solution to the system above and <i>x</i> > 0, what is the value of <i>y</i>?`, p - 1); },
      () => { const a=R(2,5), b=R(3,6); // 2^x = y and 2^(x+2) = y + 3*2^a -> 4y = y + 3*2^a -> y = 2^a
        const val = Math.pow(2, a); return g(`<i>y</i> = 2<sup><i>x</i></sup><br><i>y</i> + ${3*val} = 2<sup><i>x</i> + 2</sup><br><br>If (<i>x</i>, <i>y</i>) is the solution to the system above, what is the value of <i>y</i>?`, val); },
      () => { const r=R(5,12); // x^2 + y^2 = r^2 and x^2 - y^2 = r^2 -> 2x^2 = 2r^2 -> y = 0 -> 2 points: (r,0) and (-r,0)
        return g(`<i>x</i>² + <i>y</i>² = ${r*r}<br><i>x</i>² - <i>y</i>² = ${r*r}<br><br>How many real solutions (<i>x</i>, <i>y</i>) does the given system of equations have?`, 2); },
      () => { const m=R(2,6), c=R(5,15); // y = x^2 - m*x + c and y = m*x + c -> x^2 - 2mx = 0 -> x = 0 and x = 2m
        return grid(`In the <i>xy</i>-plane, the graphs of <i>y</i> = <i>x</i>² - ${m}<i>x</i> + ${c} and <i>y</i> = ${m}<i>x</i> + ${c} intersect at (0, ${c}) and (<i>a</i>, <i>b</i>), where <i>a</i> > 0. What is the value of <i>a</i>?`, 2*m); }
    ],
    // === Topic 8: Equivalent expressions ===
    [
      () => { const a=R(2,5), b=R(3,7), c=R(2,6), d=R(3,8); const B = a*d + b*c, C = b*d - a*c; return g(`If (${a}<i>x</i>² + ${b}<i>x</i> - ${a})(${c}<i>x</i> + ${d}) = ${a*c}<i>x</i>³ + <i>Bx</i>² + <i>Cx</i> - ${a*d} for all values of <i>x</i>, what is the value of <i>B</i> + <i>C</i>?`, String(B + C), [String(B + C), String(B - C), String(B), String(a*d + b*d)]); },
      () => { const a=R(3,7), p=R(2,6), q=R(3,8); const A = p + q, B = a*(p - q); return g(`For all <i>x</i> &gt; ${a}, the rational expression <f>${A}<i>x</i> + ${B}/<i>x</i>² - ${a*a}</f> is equivalent to <f><i>p</i>/<i>x</i> - ${a}</f> + <f><i>q</i>/<i>x</i> + ${a}</f>, where <i>p</i> and <i>q</i> are constants. What is the value of <i>p</i> · <i>q</i>?`, String(p*q), [String(p*q), String(p + q), String(A*a), String(Math.abs(p - q))]); },
      () => { const n=R(3,5), m=R(2,4), a=R(2,6), b=R(3,7); const num = a*m + b, den = n*m; return g(`For <i>x</i> &gt; 0, the expression <sup>${n}</sup>√(<i>x</i><sup>${a}</sup> · <sup>${m}</sup>√(<i>x</i><sup>${b}</sup>)) is equivalent to <i>x</i><sup><i>k</i></sup>. What is the value of the constant <i>k</i>?`, `<f>${num}/${den}</f>`, [`<f>${num}/${den}</f>`, `<f>${a+b}/${n+m}</f>`, `<f>${a*b}/${den}</f>`, `<f>${num}/${n}</f>`]); },
      () => { const k=R(4,9); const ans = k*k*k - 3*k; return g(`If <i>x</i> &gt; 0 and <i>x</i> + <f>1/<i>x</i></f> = ${k}, what is the exact value of <i>x</i>³ + <f>1/<i>x</i>³</f>?`, String(ans), [String(ans), String(k*k*k), String(k*k - 2), String(k*k*k + 3*k)]); },
      () => { const a=R(2,5), b=R(3,8), c=R(2,7); const sumCoeff = Math.pow(a + b - c, 3); return g(`Let <i>P</i>(<i>x</i>) = (${a}<i>x</i>² + ${b}<i>x</i> - ${c})³. When <i>P</i>(<i>x</i>) is completely expanded as a polynomial in standard form, what is the sum of all its coefficients (including the constant term)?`, String(sumCoeff), [String(sumCoeff), String(-c*c*c), String(a*a*a), String(Math.pow(a+b+c, 3))]); },
      () => { const a=R(3,8), b=R(2,6); return g(`Which expression is equivalent to (${a}<i>x</i>² - ${b}<i>y</i>²)² + ${4*a*b}<i>x</i>²<i>y</i>²?`, `(${a}<i>x</i>² + ${b}<i>y</i>²)²`, [`(${a}<i>x</i>² + ${b}<i>y</i>²)²`, `${a*a}<i>x</i>⁴ + ${b*b}<i>y</i>⁴`, `(${a}<i>x</i> + ${b}<i>y</i>)⁴`, `(${a}<i>x</i>² - ${b}<i>y</i>²)²`]); },
      () => { const a=R(2,6), b=R(3,9); const qVal = R(2,5); const rem = a*b*b + qVal*b + 7; return g(`When the polynomial <i>P</i>(<i>x</i>) = ${a}<i>x</i>² + ${qVal}<i>x</i> + 7 is divided by (<i>x</i> - ${b}), the result can be written as ${a}<i>x</i> + ${a*b + qVal} + <f><i>R</i>/<i>x</i> - ${b}</f>. What is the value of the constant remainder <i>R</i>?`, String(rem), [String(rem), String(7), String(a*b*b - qVal*b + 7), String(a*b + qVal)]); },
      () => { const a=R(2,5), b=R(3,7); return g(`For all <i>x</i> &gt; ${b}, which of the following is equivalent to <f>1/<f>1/<i>x</i> - ${b}</f> - <f>1/<i>x</i> + ${a}</f></f>?`, `<f>(<i>x</i> - ${b})(<i>x</i> + ${a})/${a + b}</f>`, [`<f>(<i>x</i> - ${b})(<i>x</i> + ${a})/${a + b}</f>`, `<f>${a + b}/(<i>x</i> - ${b})(<i>x</i> + ${a})</f>`, `<i>x</i>² + ${a - b}<i>x</i> - ${a*b}`, `<f>1/${a + b}</f>`]); },
      // 9. Сложные степени: если 2^(3x) = 8^y, выразить связь или найти значение
      () => { const p=R(2,4), q=R(2,4); const base=R(2,3); const ans=p*q; return g(`If (${Math.pow(base,p)})<sup><i>x</i></sup> = ${base}<sup><i>y</i></sup> and <i>x</i> = ${q}, what is the value of <i>y</i>?`, ans); },
      // 10. Деление сложных степеней с переменными: (x^a * y^b)^c / (x^d * y^e)
      () => { const a=R(3,7), b=R(2,5), c=R(2,4); const d=R(1,2), e=R(1,2);
        const resA = a*c - d, resB = b*c - e;
        return g(`Which of the following is equivalent to <f>(<i>x</i><sup>${a}</sup><i>y</i><sup>${b}</sup>)<sup>${c}</sup>/<i>x</i><sup>${d}</sup><i>y</i><sup>${e}</sup></f>?`, `<i>x</i><sup>${resA}</sup><i>y</i><sup>${resB}</sup>`, [
          `<i>x</i><sup>${resA}</sup><i>y</i><sup>${resB}</sup>`,
          `<i>x</i><sup>${a*c*d}</sup><i>y</i><sup>${b*c*e}</sup>`,
          `<i>x</i><sup>${a*c - d}</sup><i>y</i><sup>${b*c + e}</sup>`,
          `<i>x</i><sup>${a+b}</sup><i>y</i><sup>${c+d}</sup>`
        ]); },
      // 11. Рациональные выражения (деление многочлена на многочлен): вид Q(x) + R/(x-a)
      () => { const m=R(2,5), b=R(1,6), rem=R(1,9);
        // (mx + b)(x - 2) + rem = mx^2 + (b-2m)x + (rem - 2b) -> let's format cleaner:
        const A = m, B = b - 2*m, C = rem - 2*b;
        return g(`When the polynomial <i>x</i>² + ${B}<i>x</i> + ${C} is divided by <i>x</i> - 2, the quotient is <i>x</i> + ${m} and the remainder is <i>R</i>. What is the value of <i>R</i>?`, rem); },
      // 12. Коэффициент при x в произведении трех скобок: (x + a)(x - b)(x + c)
      () => { const a=R(2,5), b=R(1,4), c=R(2,6); // coefficient of x is (a*c - a*b - b*c) ... wait, (x+a)(x-b)(x+c) -> x^3 + (a-b+c)x^2 + (ac - ab - bc)x - abc
        const coeffX = a*c - a*b - b*c;
        return g(`In the expansion of (<i>x</i> + ${a})(<i>x</i> - ${b})(<i>x</i> + ${c}), what is the coefficient of <i>x</i>?`, coeffX); },
      // 13. Эквивалентность многочленов (Method of undetermined coefficients): A(x+2) + B(x-3) = 5x + 5
      () => { const A=R(2,7), B=R(1,6); const targetA = A + B, targetB = 2*A - 3*B;
        return grid(`If <i>A</i>(<i>x</i> + 2) + <i>B</i>(<i>x</i> - 3) is equivalent to ${targetA}<i>x</i> + ${targetB}, where <i>A</i> and <i>B</i> are constants, what is the value of <i>A</i>?`, A); },
      // 14. Разность квадратов для сложных выражений: (ax)^2 - (by)^2
      () => { const a=R(2,4), b=R(2,4); const a2=a*a, b2=b*b;
        return g(`Which of the following is equivalent to ${a2}<i>x</i>² - ${b2}<i>y</i>²?`, `(${a}<i>x</i> - ${b}<i>y</i>)(${a}<i>x</i> + ${b}<i>y</i>)`, [
          `(${a}<i>x</i> - ${b}<i>y</i>)(${a}<i>x</i> + ${b}<i>y</i>)`,
          `(${a2}<i>x</i> - ${b2}<i>y</i>)(${a2}<i>x</i> + ${b2}<i>y</i>)`,
          `(${a}<i>x</i> - ${b}<i>y</i>)²`,
          `(${a}<i>x</i> + ${b}<i>y</i>)²`
        ]); },
      // 15. Упрощение дроби вынесением общего множителя: (ax^2 + bx) / cx
      () => { const c=R(2,4), a=c*R(1,4), b=c*R(1,5); return g(`If <i>x</i> > 0, the expression <f>${a}<i>x</i>² + ${b}<i>x</i>/${c}<i>x</i></f> is equivalent to <i>px</i> + <i>q</i>. What is the value of <i>p</i>?`, a/c); },
      // 16. Преобразование дроби с отрицательными степенями: (x^-1 + y^-1)^-1
      () => {
        return g(`Which of the following is equivalent to <f>1/<i>x</i> + 1/<i>y</i></f>⁻¹ for <i>x</i> > 0 and <i>y</i> > 0?`, `<f><i>xy</i>/<i>x</i> + <i>y</i></f>`, [
          `<f><i>xy</i>/<i>x</i> + <i>y</i></f>`,
          `<i>x</i> + <i>y</i>`,
          `<f>1/<i>xy</i></f>`,
          `<i>xy</i>`
        ]); },
      // 17. Степень в степени с отрицательным показателем
      () => { const a=R(2,5); const ans = Math.pow(a, 6);
        return g(`If (<i>x</i><sup>-${a}</sup>)<sup>-2</sup> = <i>x</i><sup><i>c</i></sup> and <i>x</i> > 1, what is the value of <i>c</i>?`, 2*a); },
      // 18. Сумма коэффициентов многочлена через подстановку x = 1
      () => { const a=R(2,4), b=R(1,3), c=R(2,5);
        // P(x) = (ax - b)^2 + c. Sum of coefficients is P(1)
        const sum = Math.pow(a - b, 2) + c;
        return g(`Let <i>P</i>(<i>x</i>) = (${a}<i>x</i> - ${b})² + ${c}. What is the sum of all the coefficients in the expanded form of <i>P</i>(<i>x</i>)?`, sum); },
      // 19. Выделение полного квадрата для нахождения минимума функции (Re-writing to reveal vertex)
        () => {
        const h = R(2, 7), k = R(3, 12);
        const b = -2 * h, cc = h * h + k;
        const sign = b < 0 ? `- ${Math.abs(b)}` : `+ ${b}`;
        return g(`The expression <i>x</i>² ${sign}<i>x</i> + ${cc} can be rewritten as (<i>x</i> - <i>h</i>)² + <i>k</i>, where <i>h</i> and <i>k</i> are constants. What is the value of <i>k</i>?`, k, [
          String(k), String(h), String(cc), String(-k)
        ]);
      },
      // 21. Упрощение радикалов в числителе через сопряженное выражение (Rationalizing denominator vibe / equivalent radical)
      () => { const p=R(3,6);
        return g(`Which of the following is equivalent to <f>√<i>x</i> · ∛<i>x</i></f>?`, `<i>x</i><sup>5/6</sup>`, [
          `<i>x</i><sup>5/6</sup>`,
          `<i>x</i><sup>1/6</sup>`,
          `<i>x</i><sup>3/2</sup>`,
          `<i>x</i><sup>6</sup>`
        ]); },
      // 22. Нахождение неизвестного параметра в тождестве с многочленами
      () => { const a=R(2,5), b=R(2,6); const target = a*b;
        return grid(`If (<i>ax</i> - 2)(3<i>x</i> + ${b}) = ${3*a}<i>x</i>² + ${a*b - 6}<i>x</i> - ${2*b} for all values of <i>x</i>, what is the value of <i>a</i>?`, a); },
      // 23. Эквивалентность с несколькими переменными: factoring by grouping
      () => { const a=R(2,5), b=R(2,5);
        return g(`Which of the following is equivalent to <i>x</i>² + ${a}<i>xy</i> + ${b}<i>x</i> + ${a*b}<i>y</i>?`, `(<i>x</i> + ${b})(<i>x</i> + ${a}<i>y</i>)`, [
          `(<i>x</i> + ${b})(<i>x</i> + ${a}<i>y</i>)`,
          `(<i>x</i> + ${a})(<i>x</i> + ${b}<i>y</i>)`,
          `(<i>x</i> + ${a}<i>x</i>)(<i>y</i> + ${b})`,
          `(<i>x</i> + ${a*b}<i>xy</i>)`
        ]); },
      // 24. Упрощение дробного выражения с разностью квадратов
      () => { const a=R(3,9);
        return g(`For <i>x</i> ≠ ${a}, the expression <f><i>x</i>² - ${a*a}/<i>x</i> - ${a}</f> is equivalent to <i>x</i> + <i>k</i>. What is the value of <i>k</i>?`, a); },
      // 25. Нахождение коэффициента при x^3 в произведении двух многочленов
      () => { const a=R(2,4), b=R(2,4); const c = 3 - a*b;
        return g(`In the expansion of (<i>x</i>² + ${a}<i>x</i> + 3)(<i>x</i>² - ${b}<i>x</i> + 1), what is the coefficient of <i>x</i>²?`, 1 + a*(-b) + 3); },
      // 26. Степень с отрицательным основанием и показателем
      () => { const k=R(2,4); const ans = Math.pow(-2, 2*k);
        return g(`What is the value of (-2)<sup>${2*k}</sup>?`, ans); },
      // 27. Вынесение за скобки общего множителя в сложной степени
      () => { const a=R(3,7);
        return g(`Which of the following is equivalent to 3<sup><i>x</i>+2</sup> + 3<sup><i>x</i></sup>?`, `10 · 3<sup><i>x</i></sup>`, [
          `10 · 3<sup><i>x</i></sup>`,
          `3<sup><i>2x+2</i></sup>`,
          `6 · 3<sup><i>x</i></sup>`,
          `9 · 3<sup><i>x</i></sup>`
        ]); },
      // 29. Квадрат суммы трех слагаемых: (x + y + z)^2 coefficient check
      () => { const a=R(2,4);
        return grid(`In the expansion of (<i>x</i> + <i>y</i> + ${a})², what is the coefficient of the term <i>xy</i>?`, 2); },
      // 30. Нахождение значения выражения через разность квадратов (a-b)(a+b)
      () => { const a=R(50,99), b=a-R(2,10); const ans = (a-b)*(a+b);
        return g(`What is the exact value of ${a}² - ${b}²?`, ans); },
      () => { const a=R(3,8), b=R(2,6); // (a*x + b)^2 - (a*x - b)^2 = 4*a*b*x
        return g(`For all real numbers <i>x</i>, the expression (${a}<i>x</i> + ${b})² - (${a}<i>x</i> - ${b})² is equivalent to <i>kx</i>, where <i>k</i> is a constant. What is the value of <i>k</i>?`, 4*a*b); },
      () => { const a=R(2,6), b=R(3,8,a); // a/(x - b) + a/(x + b) = 2ax / (x^2 - b^2)
        return g(`Which of the following is equivalent to <f>${a}/<i>x</i> - ${b}</f> + <f>${a}/<i>x</i> + ${b}</f> for <i>x</i> > ${b}?`, `<f>${2*a}<i>x</i>/<i>x</i>² - ${b*b}</f>`, [`<f>${2*a}<i>x</i>/<i>x</i>² - ${b*b}</f>`, `<f>${2*a}/<i>x</i>² - ${b*b}</f>`, `<f>${2*a}<i>x</i> - ${2*a*b}/<i>x</i>² - ${b*b}</f>`, `<f>${a}/<i>x</i></f>`]); },
      () => { const a=R(2,5), b=R(3,7); // (a*x + b)(a^2*x^2 - a*b*x + b^2) = a^3*x^3 + b^3
        return g(`When the expression (${a}<i>x</i> + ${b})(${a*a}<i>x</i>² - ${a*b}<i>x</i> + ${b*b}) is written in the form <i>cx</i>³ + <i>d</i>, where <i>c</i> and <i>d</i> are constants, what is the value of <i>c</i> + <i>d</i>?`, a*a*a + b*b*b); },
      () => { const p=R(3,7), q=R(2,5); // x^(p/q) * x^(2p/q) = x^(3p/q)
        return g(`For <i>x</i> > 0, which expression is equivalent to <sup>${q}</sup>√(<i>x</i><sup>${p}</sup>) · <sup>${q}</sup>√(<i>x</i><sup>${2*p}</sup>)?`, `<i>x</i><sup>${3*p}/${q}</sup>`, [`<i>x</i><sup>${3*p}/${q}</sup>`, `<i>x</i><sup>${2*p*p}/${q*q}</sup>`, `<i>x</i><sup>${3*p}/${2*q}</sup>`, `<i>x</i><sup>${p}/${q}</sup>`]); },
      () => { const a=R(3,8), r=R(4,12); // (2x + a) + r/(x - 3) = (2x^2 + (a-6)x + (r - 3a))/(x - 3)
        const B = a - 6, C = r - 3*a; return grid(`For <i>x</i> ≠ 3, the rational expression <f>2<i>x</i>² + ${B >= 0 ? '+ ' + B : '- ' + Math.abs(B)}<i>x</i> ${C >= 0 ? '+ ' + C : '- ' + Math.abs(C)}/<i>x</i> - 3</f> can be rewritten as 2<i>x</i> + ${a} + <f><i>R</i>/<i>x</i> - 3</f>, where <i>R</i> is a constant. What is the value of <i>R</i>?`, r); },
      () => { const k=R(4,11); // x + 1/x = k -> x^2 + 1/x^2 = k^2 - 2
        return g(`If <i>x</i> + <f>1/<i>x</i></f> = ${k}, what is the value of <i>x</i>² + <f>1/<i>x</i>²</f>?`, k*k - 2); },
      () => { const a=R(2,5), b=R(3,6), c=R(2,5); // (a*x^2 + b*x - c)(2*x - 3) -> coeff of x^2 is -3a + 2b
        return g(`In the polynomial expansion of (${a}<i>x</i>² + ${b}<i>x</i> - ${c})(2<i>x</i> - 3), what is the coefficient of <i>x</i>²?`, -3*a + 2*b); },
      () => { const a=R(3,8), b=R(2,6); // x^4 - a^4 = (x^2 + a^2)(x - a)(x + a)
        return g(`Which of the following is a factor of the polynomial <i>x</i>⁴ - ${Math.pow(a,4)}?`, `<i>x</i>² + ${a*a}`, [`<i>x</i>² + ${a*a}`, `<i>x</i>² + ${a}`, `<i>x</i> - ${a*a}`, `(<i>x</i> + ${a})³`]); },
      () => { const a=R(2,5), h=R(3,7), k=R(4,15); // a*x^2 - 2*a*h*x + (a*h^2 + k) = a(x - h)^2 + k
        const B = 2*a*h, C = a*h*h + k; return g(`The expression ${a}<i>x</i>² - ${B}<i>x</i> + ${C} can be rewritten in the equivalent form <i>a</i>(<i>x</i> - <i>h</i>)² + <i>k</i>, where <i>a</i>, <i>h</i>, and <i>k</i> are constants. What is the value of <i>h</i> + <i>k</i>?`, h + k); },
      () => { const a=R(2,6), b=R(3,8); // (A/(x-1)) + (B/(x+2)) = ((A+B)x + (2A - B)) / ((x-1)(x+2))
        const m = a + b, n = 2*a - b; return grid(`For <i>x</i> ∉ {1, -2}, <f><i>A</i>/<i>x</i> - 1</f> + <f><i>B</i>/<i>x</i> + 2</f> = <f>${m}<i>x</i> + (${n})/(<i>x</i> - 1)(<i>x</i> + 2)</f>, where <i>A</i> and <i>B</i> are constants. What is the value of <i>A</i> + <i>B</i>?`, m); },
      () => { const a=R(2,5), b=R(3,7); // (x^a * y^(-b))^(-2) = x^(-2a) * y^(2b) = y^(2b) / x^(2a)
        return g(`For all nonzero <i>x</i> and <i>y</i>, which expression is equivalent to (<i>x</i><sup>${a}</sup><i>y</i><sup>-${b}</sup>)<sup>-2</sup>?`, `<f><i>y</i><sup>${2*b}</sup>/<i>x</i><sup>${2*a}</sup></f>`, [`<f><i>y</i><sup>${2*b}</sup>/<i>x</i><sup>${2*a}</sup></f>`, `<f><i>x</i><sup>${2*a}</sup>/<i>y</i><sup>${2*b}</sup></f>`, `-2<i>x</i><sup>${a}</sup><i>y</i><sup>-${b}</sup>`, `<i>x</i><sup>${a-2}</sup><i>y</i><sup>-${b-2}</sup>`]); },
      () => { const a=R(3,7), b=R(2,5); // (a*x + b)^3 -> coefficient of x^2 is 3*a^2*b
        return g(`When the expression (${a}<i>x</i> + ${b})³ is expanded and written in the form <i>px</i>³ + <i>qx</i>² + <i>rx</i> + <i>s</i>, what is the value of the coefficient <i>q</i>?`, 3*a*a*b); },
      () => { const k=R(2,6); // (2^(x + k) - 2^x) / 2^x = 2^k - 1
        return g(`For all real numbers <i>x</i>, what is the value of the expression <f>2<sup><i>x</i> + ${k}</sup> - 2<sup><i>x</i></sup>/2<sup><i>x</i></sup></f>?`, Math.pow(2, k) - 1); },
      () => { const a=R(3,9), b=R(2,7,a); // (x^2 - a^2)/(x^2 + (b-a)x - ab) = (x + a)/(x + b)
        const diff = b - a, prod = a * b; const mid = diff >= 0 ? `+ ${diff}<i>x</i>` : `- ${Math.abs(diff)}<i>x</i>`; return g(`For <i>x</i> > ${a}, which of the following is equivalent to <f><i>x</i>² - ${a*a}/<i>x</i>² ${mid} - ${prod}</f>?`, `<f><i>x</i> + ${a}/<i>x</i> + ${b}</f>`, [`<f><i>x</i> + ${a}/<i>x</i> + ${b}</f>`, `<f><i>x</i> - ${a}/<i>x</i> + ${b}</f>`, `<f><i>x</i> + ${a}/<i>x</i> - ${b}</f>`, `<f>${a}/${b}</f>`]); },
      () => { const a=R(3,8), b=R(4,9); // a*x^2*y + b*x*y^2 = xy(ax + by). If xy = p and ax+by = q -> product = p*q
        const p=R(4,10), q=R(5,12); return g(`If <i>xy</i> = ${p} and ${a}<i>x</i> + ${b}<i>y</i> = ${q}, what is the value of ${a}<i>x</i>²<i>y</i> + ${b}<i>xy</i>²?`, p*q); },
      () => { const a=R(3,9); // 1 / (sqrt(a+1) - sqrt(a)) = sqrt(a+1) + sqrt(a)
        const n=R(2,7); const sq = n*n; return grid(`What is the value of (√${sq + 5} + √${sq})(√${sq + 5} - √${sq})?`, 5); },
      () => { const a=R(2,6), b=R(3,7), c=R(4,9); // L-shaped figure area as polynomial: (x+a)(x+b) - x^2 = (a+b)x + ab
        return g(`A large square of side length <i>x</i> + ${a} has a smaller square of side length <i>x</i> removed from one corner. The remaining area can be written as <i>kx</i> + <i>m</i>, where <i>k</i> and <i>m</i> are constants. What is the value of <i>k</i> + <i>m</i>?`, 2*a + a*a); },
      () => { const m=R(2,6), n=R(3,8); // (x^m)^n * x^4 = x^(mn+4)
        return g(`For <i>x</i> > 1, if <f>(<i>x</i><sup>${m}</sup>)<sup>${n}</sup> · <i>x</i>⁴/<i>x</i>²</f> = <i>x</i><sup><i>k</i></sup>, what is the value of <i>k</i>?`, m*n + 2); },
      () => { const a=R(2,5), b=R(3,8); // P(x) = x^3 - a*x^2 + b*x - 10. Remainder when divided by (x - 2) is P(2)
        const rem = 8 - 4*a + 2*b - 5; return g(`By the Polynomial Remainder Theorem, what is the remainder when <i>P</i>(<i>x</i>) = <i>x</i>³ - ${a}<i>x</i>² + ${b}<i>x</i> - 5 is divided by <i>x</i> - 2?`, rem); },
      () => { const a=R(2,6), b=R(3,7); // (ax + b)^2 + (bx - a)^2 = (a^2 + b^2)x^2 + (a^2 + b^2) = (a^2 + b^2)(x^2 + 1)
        const k = a*a + b*b; return grid(`For all real values of <i>x</i>, (${a}<i>x</i> + ${b})² + (${b}<i>x</i> - ${a})² = <i>k</i>(<i>x</i>² + 1), where <i>k</i> is a constant. What is the value of <i>k</i>?`, k); },
      () => { const a=R(3,8), b=R(2,5); return g(`Which of the following expressions is equivalent to <f>1/<f>1/${a}<i>x</i></f> + <f>1/${b}<i>x</i></f></f> for <i>x</i> > 0?`, `<f>${a*b}<i>x</i>/${a+b}</f>`, [`<f>${a*b}<i>x</i>/${a+b}</f>`, `(${a+b})<i>x</i>`, `<f>${a+b}/${a*b}<i>x</i></f>`, `<f><i>x</i>/${a+b}</f>`]); },
      () => { const a=R(2,6), b=R(3,8); // 9^x - 4^x = (3^x - 2^x)(3^x + 2^x)
        const u=R(4,9), v=R(10,20); return g(`If 3<sup><i>x</i></sup> - 2<sup><i>x</i></sup> = ${u} and 3<sup><i>x</i></sup> + 2<sup><i>x</i></sup> = ${v}, what is the value of 9<sup><i>x</i></sup> - 4<sup><i>x</i></sup>?`, u*v); }
    ],
    // === Topic 9: Ratios, rates, proportional relationships, units ===
    [
      () => { const k=R(2,4), vSmall=R(15,45); const vLarge = vSmall * k * k * k; return g(`Solid metal cylinder A and solid metal cylinder B are geometrically similar, and both are made of the same alloy. The surface area of cylinder B is ${k*k} times the surface area of cylinder A. If cylinder A has a mass of ${vSmall} grams, what is the mass, in grams, of cylinder B?`, String(vLarge), [String(vLarge), String(vSmall * k * k), String(vSmall * k), String(vSmall * Math.pow(k, 4))]); },
      () => { const d=R(2,8); const kgPerM3 = d * 1000; return g(`A newly synthesized ceramic composite has a density of ${d}.${R(1,9)} grams per cubic centimeter (g/cm³). Given that 1 kilogram = 1,000 grams and 1 meter = 100 centimeters, multiplying the density in g/cm³ by what factor converts it to kilograms per cubic meter (kg/m³)?`, "1,000", ["1,000", "100", "10,000", "0.001"]); },
      () => { const y0=R(4,12)*9; const ans = (y0 * 4) / 9; return g(`The positive quantity <i>y</i> is directly proportional to the square of <i>x</i> and inversely proportional to the square root of <i>z</i>. If <i>x</i> is doubled and <i>z</i> is multiplied by 9, by what factor is <i>y</i> multiplied?`, `<f>4/3</f>`, [`<f>4/3</f>`, `<f>2/3</f>`, `<f>4/9</f>`, `12`]); },
      () => { const v1=R(30,60,10), v2=v1*R(2,3); const harm = (2*v1*v2)/(v1+v2); return g(`A test vehicle drives from Station P to Station Q at a constant speed of ${v1} miles per hour and immediately returns from Station Q to Station P along the exact same route at a constant speed of ${v2} miles per hour. What is the vehicle's average speed, in miles per hour, for the entire round trip?`, String(harm), [String(harm), String((v1+v2)/2), String(v2 - v1), String(Math.sqrt(v1*v2).toFixed(1))]); },
      () => { const a=R(2,5), b=R(3,7), c=R(2,5), d=R(3,7); return g(`In an alloy mixture of copper, zinc, and nickel, the ratio of the mass of copper to zinc is ${a} : ${b}, and the ratio of the mass of zinc to nickel is ${c} : ${d}. If the alloy contains ${a*c*10} grams of copper, how many grams of nickel does it contain?`, String(b*d*10), [String(b*d*10), String(b*c*10), String(a*d*10), String((b+d)*10)]); },
      () => { const s=R(2,5)*100, a=R(3,8); const realAreaKm2 = (a * s * s) / 10000; return g(`On an architectural site blueprint, a scale of 1 centimeter = ${s} meters is used. If a solar array covers an area of ${a}00 square centimeters on the blueprint, what is the actual area of the solar array in square kilometers? (1 kilometer = 1,000 meters)`, String(realAreaKm2), [String(realAreaKm2), String(realAreaKm2 * 10), String(realAreaKm2 / 10), String((a * s) / 10)]); },
      () => { const t1=R(6,12), t2=t1*R(2,3); const both = (t1*t2)/(t1+t2); return g(`Pump A can fill a chemical reactor tank in ${t1} hours working alone, while Pump B can fill the same tank in ${t2} hours working alone. A drain valve at the bottom can empty the full tank in ${t1*t2} hours. If both pumps and the drain valve are accidentally left open simultaneously when the tank is empty, how many hours will it take to fill the tank?`, `<f>${t1*t2}/${t1+t2-1}</f>`, [`<f>${t1*t2}/${t1+t2-1}</f>`, `<f>${t1*t2}/${t1+t2+1}</f>`, `<f>${t1*t2}/${t1+t2}</f>`, String(t1 + t2)]); },
      () => {
        const a=R(3,9), b=R(2,8), multiplier=R(6,25), total=(a+b)*multiplier;
        return g(`An animal rescue shelter has a total of ${total} animals. The ratio of cats to dogs is ${a}:${b}. How many cats are at the shelter?`, a*multiplier);
      },
      // 9. Классическая ловушка SAT: перевод КВАДРАТНЫХ единиц (square yards to square feet, 1 yd = 3 ft -> 1 sq yd = 9 sq ft)
      () => {
        const sqYd = R(4, 25);
        const sqFt = sqYd * 9;
        return g(`A rectangular floor has an area of ${sqYd} square yards. What is the area of the floor, in square feet? (1 yard = 3 feet)`, sqFt);
      },
      // 10. Перевод КУБИЧЕСКИХ единиц (cubic meters to cubic centimeters / cubic feet to cubic inches)
      () => {
        const cubFt = R(2, 6), scale = R(2, 4);
        // 1 unit A = scale units B -> 1 cubic A = scale^3 cubic B
        const ans = cubFt * Math.pow(scale, 3);
        return g(`A storage container has a volume of ${cubFt} cubic meters. In a custom measurement system, 1 meter equals ${scale} rods. What is the volume of the container in cubic rods?`, ans);
      },
      // 11. Цепное отношение (Chained ratios): дано A:B и B:C, найти A:C или количество C
      () => {
        const a = R(2, 5), b1 = R(2, 4), mult = R(2, 3), b2 = b1 * mult, c = R(3, 7);
        // A:B = a:b1 = (a*mult):(b1*mult). B:C = b2:c. So A:B:C = (a*mult) : b2 : c
        const k = R(3, 8);
        const valA = a * mult * k, valC = c * k;
        return grid(`In a certain mixture, the ratio of ingredient A to ingredient B is ${a} to ${b1}, and the ratio of ingredient B to ingredient C is ${b2} to ${c}. If the mixture contains ${valA} grams of ingredient A, how many grams of ingredient C does it contain?`, valC);
      },
      // 12. Средняя скорость на всем маршруте туда-обратно (Average speed trap: 2*v1*v2 / (v1 + v2))
      () => {
        const pairs = [[30, 60, 40], [20, 30, 24], [40, 60, 48], [15, 30, 20], [60, 120, 80]];
        const [v1, v2, avg] = getEl(pairs);
        const dist = R(2, 5) * 60;
        return g(`A commuter drives ${dist} miles from home to work at an average speed of ${v1} miles per hour, and returns home along the exact same route at an average speed of ${v2} miles per hour. What is the average speed, in miles per hour, for the entire round trip?`, avg);
      },
      // 13. Совместная работа двух устройств (Combined work rate: 1/t1 + 1/t2 = 1/t)
      () => {
        const pairs = [[6, 12, 4], [10, 15, 6], [12, 24, 8], [20, 30, 12], [15, 30, 10]];
        const [t1, t2, both] = getEl(pairs);
        return g(`Pump A can fill a water tank in ${t1} hours, and Pump B can fill the same tank in ${t2} hours. Working together at their respective constant rates, how many hours will it take both pumps to fill the tank?`, both);
      },
      // 14. Двойной перевод единиц скорости (Dimensional analysis: feet per second to miles per hour or meters per sec to km per hour)
      () => {
        const mps = R(1,7)*5;
        const kmh = mps * 3.6;
        return g(`A sprinter runs at an average speed of ${mps} meters per second. What is this speed in kilometers per hour? (1 kilometer = 1,000 meters; 1 hour = 3,600 seconds)`, kmh);
      },
      // 15. Сдвиг отношения после добавления элементов (Dynamic ratio shift)
      () => {
        const a = R(2, 4), b = a + R(1, 3), k = R(4, 10);
        const origA = a * k, origB = b * k;
        const newA = origA + (b - a) * k; // делает количество равным origB (отношение 1:1)
        const added = (b - a) * k;
        return grid(`In a classroom, the ratio of boys to girls is ${a} to ${b}. Initially, there are ${origB} girls. How many more boys must join the class so that the ratio of boys to girls becomes 1 to 1?`, added);
      },
      // 16. Обратная пропорциональность (Inverse variation: x1*y1 = x2*y2)
      () => {
        const w1 = R(4, 10), d1 = R(6, 15);
        const totalWork = w1 * d1;
        // Pick w2 as a divisor or nice factor
        const mult = R(2, 3), w2 = w1 * mult, d2 = d1 / mult;
        const cleanD1 = R(2, 6) * mult;
        return g(`It takes ${w1} identical machines ${cleanD1} hours to complete a production batch. At this same rate, how many hours would it take ${w1 * mult} of these machines to complete the same batch?`, cleanD1 / mult);
      },
      // 17. Физическая плотность, масса и объем (Density = Mass / Volume)
      () => {
        const dens = R(3, 12), vol = R(15, 60, 5);
        const mass = dens * vol;
        return g(`A solid metal block has a density of ${dens} grams per cubic centimeter and a mass of ${mass} grams. What is the volume, in cubic centimeters, of the metal block?`, vol);
      },
      // 18. Масштаб карты и РЕАЛЬНАЯ ПЛОЩАДЬ (Map scale with area: scale squared)
      () => {
        const mapW = R(3, 7), mapL = R(4, 9), scale = R(2, 5);
        const realArea = (mapW * scale) * (mapL * scale);
        return g(`On a blueprint, a rectangular park measures ${mapW} inches by ${mapL} inches. If the scale of the blueprint is 1 inch = ${scale}0 yards, what is the actual area of the park, in square yards?`, realArea * 100);
      },
      // 19. Отношение частей в геометрии: углы треугольника в отношении a:b:c
      () => {
        const ratios = [[1, 2, 3], [2, 3, 4], [1, 3, 5], [2, 3, 5], [3, 4, 5]];
        const [a, b, c] = getEl(ratios);
        const sum = a + b + c;
        const largest = (180 / sum) * c;
        return grid(`The measures of the three interior angles of a triangle are in the ratio ${a}:${b}:${c}. What is the measure, in degrees, of the largest angle in the triangle?`, largest);
      },
      // 20. Стоимость через промежуточную валюту / обменный курс (Unit conversion chain)
      () => {
        const a = R(2, 5), b = R(3, 6), k = R(4, 10);
        // 1 Aureus = a Denarii, 1 Denarius = b Sestertii
        const sestertii = a * b * k;
        return g(`In an ancient currency system, 1 gold coin is worth ${a} silver coins, and 1 silver coin is worth ${b} bronze coins. How many gold coins are equivalent in value to ${sestertii} bronze coins?`, k);
      },
      // 21. Сравнение Unit Rates (Какой вариант выгоднее и насколько за единицу товара)
      () => {
        const ozA = 12, pA = R(3, 6) * 3; // price per oz = pA / 12
        const ozB = 16, pB = R(2, 5) * 4;
        const unitA = (pA / ozA).toFixed(2), unitB = (pB / ozB).toFixed(2);
        const qtyA = R(10, 20), costA = qtyA * R(4, 9);
        const qtyB = R(15, 25), costB = qtyB * R(3, 7);
        const diff = Math.abs(costA / qtyA - costB / qtyB);
        return g(`Store A sells ${qtyA} notebooks for $${costA}, and Store B sells ${qtyB} identical notebooks for $${costB}. What is the positive difference, in dollars, between the price per notebook at Store A and Store B?`, diff);
      },
      // 22. Таблица прямой пропорциональности: найти пропущенное значение
      () => {
        const k = R(3, 8), x1 = R(2, 5), x2 = R(6, 10), x3 = R(12, 18);
        const tbl = `<table style="margin:12px auto;border-collapse:collapse;text-align:center;width:240px;border:1px solid var(--line)"><tr style="background:var(--panel2)"><th style="padding:6px;border:1px solid var(--line)">Time (hours)</th><th style="padding:6px;border:1px solid var(--line)">Distance (miles)</th></tr><tr><td style="padding:4px 8px;border:1px solid var(--line)">${x1}</td><td style="padding:4px 8px;border:1px solid var(--line)">${x1*k}</td></tr><tr><td style="padding:4px 8px;border:1px solid var(--line)">${x2}</td><td style="padding:4px 8px;border:1px solid var(--line)">${x2*k}</td></tr><tr><td style="padding:4px 8px;border:1px solid var(--line)">${x3}</td><td style="padding:4px 8px;border:1px solid var(--line)"><i>d</i></td></tr></table>`;
        return g(`${tbl}The table above shows a proportional relationship between the time traveled and the distance covered by a drone moving at a constant speed. What is the value of <i>d</i>?`, x3 * k);
      },
      // 23. Пропорциональное масштабирование рецепта / химического раствора с дробными частями
      () => {
        const cFlour = R(2, 5), cookies = R(12, 24, 4), mult = R(3, 7);
        const targetCookies = cookies * mult;
        return grid(`A bakery recipe requires ${cFlour} cups of flour to make ${cookies} muffins. At this rate, how many cups of flour are required to make ${targetCookies} muffins?`, cFlour * mult);
      },
      // 24. Плотность населения (Population density: people per square mile)
      () => {
        const w = R(10, 30, 5), l = R(10, 40, 5), dens = R(15, 50, 5);
        const pop = w * l * dens;
        return g(`A rectangular wildlife reserve measures ${w} miles wide by ${l} miles long. If the reserve has a total population of ${pop} deer, what is the population density, in deer per square mile?`, dens);
      },
      // 25. Скорость вытекания жидкости (Flow rate: gallons per minute to hours)
      () => {
        const gpm = R(4, 15), hours = R(2, 6);
        const totalGal = gpm * 60 * hours;
        return g(`Water flows through a pipe at a constant rate of ${gpm} gallons per minute. At this rate, how many gallons of water will flow through the pipe in ${hours} hours?`, totalGal);
      },
      // 26. Разделение суммы в заданном отношении: на сколько большая доля превышает меньшую
      () => {
        const a = R(2, 5), b = a + R(2, 5), k = R(10, 30);
        const total = (a + b) * k;
        const diff = (b - a) * k;
        return g(`Two business partners divide a profit of $${total} in the ratio ${a}:${b}. By how many dollars does the larger share exceed the smaller share?`, diff);
      },
      // 27. Прямая пропорциональность с квадратом переменной: y varies directly with x^2
      () => {
        const k = R(2, 6), x1 = R(2, 4), x2 = R(5, 8);
        const y1 = k * x1 * x1, y2 = k * x2 * x2;
        return grid(`The variable <i>y</i> is directly proportional to <i>x</i>². If <i>y</i> = ${y1} when <i>x</i> = ${x1}, what is the value of <i>y</i> when <i>x</i> = ${x2}?`, y2);
      },
      // 28. Конвертация с буквенными параметрами (Symbolic unit conversion — вопрос с выбором ответа)
      () => {
        const r = R(15, 45);
        const ans = `<f>60<i>k</i>/1000</f>`;
        return g(`A conveyor belt moves at a constant speed of <i>k</i> meters per minute. Which of the following expressions represents the speed of the conveyor belt in kilometers per hour? (1 kilometer = 1,000 meters)`, ans, [
          ans,
          `<f>1000<i>k</i>/60</f>`,
          `60,000<i>k</i>`,
          `<f><i>k</i>/60,000</f>`
        ]);
      },
      // 29. Bluebook Hard (image_10.png): Average rate of change of speed across two time intervals
      () => {
        const t1 = getEl([4, 5, 8, 10]);
        const dt2 = getEl([4, 5, 8, 10, 20]);
        const t2 = t1 + dt2;
        const v1 = R(10, 42);
        const v2 = v1 + R(12, 54);
        const diff = Number(Math.abs((v1 / t1) - ((v2 - v1) / dt2)).toFixed(2));
        return g(`During the first ${t1.toFixed(2)} seconds after a car started moving, its speed increased to ${v1.toFixed(1)} meters per second. From ${t1.toFixed(2)} seconds to ${t2.toFixed(1)} seconds after the car started moving, its speed increased from ${v1.toFixed(1)} meters per second to ${v2.toFixed(1)} meters per second. To the nearest hundredth, what is the positive difference between the average rate of change of the speed of the car, in meters per second per second, during the first ${t1.toFixed(2)} seconds and the average rate of change of the speed of the car from ${t1.toFixed(2)} seconds to ${t2.toFixed(1)} seconds?`, diff);
      },
      // 30. Задача на догонялки (Catch-up rate problem / Relative speed)
      () => {
        const v1 = R(40, 55, 5), diffV = R(10, 20, 5), v2 = v1 + diffV;
        const headStartHours = R(1, 3), distGap = v1 * headStartHours;
        const catchUpTime = distGap / diffV;
        // Подгоним так, чтобы делилось нацело:
        const tCatch = R(2, 5), vSlow = diffV * R(2, 4), vFast = vSlow + diffV;
        const gapMiles = diffV * tCatch;
        return g(`Train A leaves a station traveling at a constant speed of ${vSlow} miles per hour. Later, Train B leaves the same station on a parallel track traveling in the same direction at ${vFast} miles per hour. If Train A is ${gapMiles} miles ahead when Train B departs, how many hours will it take Train B to catch up to Train A?`, tCatch);
      },
      () => { const t1=getEl([12,15,20,30]), t2=getEl([20,30,60]); // 3 pipes or 2 pipes + leak: Pump A fills in 12h, Pump B fills in 20h, Drain C empties in 15h -> 1/12 + 1/20 - 1/15 = (5+3-4)/60 = 4/60 = 1/15 -> 15 hours!
        const configs = [[12,20,15,15],[6,12,4,12],[10,15,6,30],[8,24,6,12]]; const [a,b,c,ans] = getEl(configs);
        return g(`Supply Pipe A can fill an empty chemical vat in ${a} hours, and Supply Pipe B can fill the same vat in ${b} hours. However, an open drainage valve at the bottom of the vat can empty a full vat in ${c} hours. If both supply pipes and the drainage valve are opened simultaneously when the vat is empty, how many hours will it take to completely fill the vat?`, ans); },
      () => { const scale=R(2,5)*10; const mapArea=R(6,18); // 1 cm : scale m -> 1 cm^2 = scale^2 m^2
        return grid(`On an architectural site plan, the scale is 1 centimeter = ${scale} meters. If a solar array covers an area of ${mapArea} square centimeters on the site plan, what is the actual area of the solar array, in square meters?`, mapArea * scale * scale); },
      () => { const k=R(2,4), vSmall=R(8,25); // 3D scale factor 1:k -> volume ratio 1:k^3
        return g(`A scale model of a marble statue is built at a linear scale ratio of 1:${k}. If the scale model requires ${vSmall} cubic inches of marble, how many cubic inches of marble are required for the full-size statue?`, vSmall * k * k * k); },
      () => { const d=R(4,9), v=R(20,50,10); // density in g/cm^3 -> convert to kg/m^3 (multiply by 1000). Wait: 1 g/cm^3 = 1000 kg/m^3
        const gPerCm3 = (R(12,45)/10).toFixed(1); return g(`A mineral sample has a density of ${gPerCm3} grams per cubic centimeter. What is this density expressed in kilograms per cubic meter? (1 kilogram = 1,000 grams; 1 meter = 100 centimeters)`, parseFloat(gPerCm3) * 1000); },
      () => { const k=R(3,8), r=getEl([2,3]); const I0 = k * r * r; // inverse square law: I = P / d^2. If d triples, I divides by 9
        return g(`The intensity <i>I</i> of a radio signal, in watts per square meter, is inversely proportional to the square of the distance <i>d</i> from the transmitter. If the intensity is ${I0} watts per square meter at a distance of 2 kilometers, what is the intensity, in watts per square meter, at a distance of ${2*r} kilometers?`, k); },
      () => { const a=R(2,5), b=R(3,7), c=R(4,9); // A:B = a:b, B:C = b:c, C:D = c:d -> total distributed
        const k=R(4,10), tot=(a+b+c)*k; return grid(`Three research departments—Biology, Chemistry, and Physics—share a grant of $${tot} thousand in the ratio ${a}:${b}:${c}. How many thousands of dollars does the department with the largest share receive?`, Math.max(a,b,c)*k); },
      () => { const d1=120, v1=40, d2=180, v2=60; // total dist = 300, total time = 3 + 3 = 6 -> avg speed = 50
        const t1=R(2,4), s1=R(30,50,10), t2=R(2,4), s2=R(60,80,10); const totD = t1*s1 + t2*s2, totT = t1 + t2;
        const cleanT = 5, dist1 = 2*40, dist2 = 3*60; return g(`A freight train travels ${dist1} miles at a constant speed of 40 miles per hour and then travels an additional ${dist2} miles at a constant speed of 60 miles per hour. What is the train's average speed, in miles per hour, for the entire ${dist1+dist2}-mile trip?`, (dist1+dist2)/5); },
      () => { const l=400, v1=R(6,9), v2=10-v1+5; // Circular track of 400m: running in opposite directions, meet every L/(v1+v2)
        const s1=R(4,7), s2=R(3,6), sumV=s1+s2, track=sumV*R(30,60,10); return g(`Two sprinters start at the same point on a circular track that is ${track} meters in circumference and run in <b>opposite</b> directions at constant speeds of ${s1} meters per second and ${s2} meters per second. After how many seconds will they meet for the first time?`, track / sumV); },
      () => { const gVal=R(15,35), k=R(4,8); // Gear A has gVal teeth and turns at k*30 rpm; Gear B has gVal*k teeth -> rpm = 30
        const tA=R(12,24), mult=R(2,4), tB=tA*mult, rpmB=R(30,90,10), rpmA=rpmB*mult;
        return g(`In a mechanical clockwork, Gear A has ${tA} teeth and meshes directly with Gear B, which has ${tB} teeth. If Gear A rotates at ${rpmA} revolutions per minute, how many revolutions per minute does Gear B make?`, rpmB); },
      () => { const f1=R(2,5), d1=R(10,20,5); // Force of spring F = k*x. Work or comparing two springs
        const x1=R(3,6), k=R(12,25), F1=k*x1, x2=R(7,12); return grid(`By Hooke's law, the force required to stretch a spring is directly proportional to the extension distance beyond its natural length. If a force of ${F1} newtons stretches a spring from its natural length of 10 centimeters to a total length of ${10+x1} centimeters, what force, in newtons, is required to stretch the same spring to a total length of ${10+x2} centimeters?`, k*x2); },
      () => { const flowLpm=R(15,45,5); // Liters per minute -> cubic meters per day (1 m^3 = 1000 L, 1 day = 1440 min)
        const lpm = getEl([25, 50, 75, 100]); const m3PerDay = (lpm * 1440) / 1000;
        return g(`An artesian spring discharges water at a constant rate of ${lpm} liters per minute. What is this discharge rate in cubic meters per day? (1 cubic meter = 1,000 liters; 1 day = 1,440 minutes)`, m3PerDay); },
      () => { const a=R(3,5), b=a+2, k=R(6,15); // Ratio of A to B is a:b. After transferring k items from B to A, they are equal! Initial B - A = 2k -> (b-a)*u = 2k -> u = k, total = (a+b)*k
        return g(`The ratio of books on Shelf A to books on Shelf B is ${a}:${b}. If ${k} books are moved from Shelf B to Shelf A, the two shelves will have the exact same number of books. How many books are on the two shelves combined?`, (a + b) * k); },
      () => { const w=R(4,8), d=R(6,10), p=R(15,30); // Worker-days problem: w workers build p panels in d days. How many days for 2*w workers to build 3*p panels? -> d * 3 / 2
        const days = R(4,10)*2; return g(`A crew of ${w} solar technicians can install ${p} solar arrays in ${days} days working at a constant rate. At this same individual rate, how many days will it take a crew of ${2*w} technicians to install ${3*p} solar arrays?`, (days * 3) / 2); },
      () => { const cPerSqFt = R(4,9), sqYd = R(10,30); // Price is per sq ft, area given in sq yd (1 sq yd = 9 sq ft)
        return grid(`Flooring tiles cost $${cPerSqFt} per square foot. How much will it cost, in dollars, to tile a rectangular lobby that has an area of ${sqYd} square yards? (1 yard = 3 feet)`, cPerSqFt * sqYd * 9); },
      () => { const ppm=R(15,45), kgWater=R(200,600,100); // parts per million
        return g(`A municipal water reservoir contains dissolved fluoride at a concentration of ${ppm} parts per million (meaning ${ppm} milligrams of fluoride per kilogram of water). How many <b>grams</b> of fluoride are present in ${kgWater * 1000} kilograms of this water? (1 gram = 1,000 milligrams)`, ppm * kgWater); },
      () => { const vTrain=R(20,35), lenTrain=R(150,300,50), lenBridge=vTrain*R(20,35) - lenTrain; const totTime = (lenTrain + lenBridge)/vTrain;
        return g(`A freight train that is ${lenTrain} meters long travels at a constant speed of ${vTrain} meters per second. How many seconds does it take for the train to completely cross a bridge that is ${lenBridge} meters long, measured from the moment the front of the locomotive enters the bridge to the moment the last car leaves the bridge?`, totTime); },
      () => { const a=R(2,5), b=R(3,7); // If 3a = 4b and 2b = 5c -> a/c = (4/3)*(5/2) = 10/3
        const p=R(2,5), q=R(3,7,p), r=R(2,5), s=R(3,7,r); const num=q*s, den=p*r, g1=gcd(num,den);
        return g(`If ${p}<i>x</i> = ${q}<i>y</i> and ${r}<i>y</i> = ${s}<i>z</i> for positive numbers <i>x</i>, <i>y</i>, and <i>z</i>, what is the ratio of <i>x</i> to <i>z</i>?`, `<f>${num/g1}/${den/g1}</f>`, [`<f>${num/g1}/${den/g1}</f>`, `<f>${den/g1}/${num/g1}</f>`, `<f>${p*s}/${q*r}</f>`, `<f>${q+s}/${p+r}</f>`]); },
      () => { const mph=R(3,9)*15; // 60 mph = 88 ft/s
        const n=R(1,4); const speedMph = 15 * n, speedFps = 22 * n;
        return g(`A falcon dives at a speed of ${speedMph} miles per hour. What is this speed in feet per second? (1 mile = 5,280 feet; 1 hour = 3,600 seconds)`, speedFps); },
      () => { const a=R(3,7), b=R(4,9); // Ohm's law / electric power P = V^2 / R
        const R1=R(4,12), k=R(2,4), P0=R(5,15)*k*k; return grid(`In an electrical circuit with constant voltage, power <i>P</i> is inversely proportional to resistance <i>R</i>. If the circuit dissipates ${P0} watts when the resistance is ${R1} ohms, how many watts does it dissipate when the resistance is increased to ${R1*k} ohms?`, P0 / k); },
      () => { const c1=R(3,7), c2=R(8,14), w1=R(4,9), w2=R(4,9); // Weighted average cost per pound of coffee blend
        const p1=12, p2=20, m1=R(3,7)*3, m2=m1/3; // (12*3k + 20*k)/(4k) = 56/4 = 14
        return g(`A roaster blends ${m1} pounds of Colombian coffee beans costing $12 per pound with ${m2} pounds of Ethiopian coffee beans costing $20 per pound. What is the cost per pound, in dollars, of the resulting ${m1+m2}-pound blend?`, 14); }
    ],
    // === Topic 10: Percentages ===
    [
      () => { const p=getEl([20,25,40,50]), q=getEl([10,20,25]); const mult = (1 + p/100) * (1 - q/100); const net = Math.round((mult - 1)*1000)/10; return g(`The value of a tech portfolio increased by ${p}% during the first quarter and then decreased by ${q}% during the second quarter. What was the net percent change in the portfolio's value over the two quarters?`, `${net >= 0 ? '+' : ''}${net}%`, [`${net >= 0 ? '+' : ''}${net}%`, `${p - q >= 0 ? '+' : ''}${p - q}%`, `+${p + q}%`, `${-(p - q)}%`]); },
      () => { const p=getEl([20,25,50]), q=getEl([20,25,40]); const k = ((1 + p/100) * (1 - q/100) * 100); return g(`The positive number <i>a</i> is ${p}% greater than the positive number <i>b</i>, and <i>b</i> is ${q}% less than the positive number <i>c</i>. The number <i>a</i> is what percent of <i>c</i>?`, `${Math.round(k*10)/10}%`, [`${Math.round(k*10)/10}%`, `${100 + p - q}%`, `${100 - p + q}%`, `${Math.round((100/(k/100))*10)/10}%`]); },
      () => { const w=R(20,50,10), target=R(60,80,5); const initWater=90, finalWater=100-target; return g(`Freshly harvested mushrooms are 90% water by weight, and dried mushrooms are ${finalWater}% water by weight. How many kilograms of fresh mushrooms are needed to produce ${10} kilograms of dried mushrooms?`, String(target), [String(target), String(100 - finalWater), String(target / 2), "90"]); },
      () => { const p1=R(15,35,5), p2=R(65,85,5), m=R(40,60,5); const tot=200; const v1 = tot * (p2 - m) / (p2 - p1); return g(`Chemists mix <i>x</i> liters of a ${p1}% saline solution with <i>y</i> liters of a ${p2}% saline solution to obtain ${tot} liters of a ${m}% saline solution. What is the ratio of <i>x</i> to <i>y</i>?`, `${p2 - m} : ${m - p1}`, [`${p2 - m} : ${m - p1}`, `${m - p1} : ${p2 - m}`, `${p1} : ${p2}`, `${p2} : ${p1}`]); },
      () => { const d1=20, d2=10, tax=8; const mult = (0.8 * 0.9 * 1.08).toFixed(4); return g(`An electronics retailer reduces the original price <i>P</i> of a monitor by 20%, then applies an additional 10% loyalty discount to the reduced price, and finally adds an 8% sales tax to the discounted total. Which expression gives the final amount paid in terms of <i>P</i>?`, `${mult}<i>P</i>`, [`${mult}<i>P</i>`, `0.78<i>P</i>`, `0.756<i>P</i>`, `0.80<i>P</i>`]); },
      () => { const p=(R(15,75)/10).toFixed(1); return g(`A city's population grows by ${p}% annually. What decimal factor should you multiply the current population by to find next year's population?`, 1+parseFloat(p)/100); },
      () => { const p1=15, p2=25, n=200; return g(`A $${n} jacket is discounted by ${p1}%, and then an additional ${p2}% clearance discount is applied to the sale price. What is the final price?`, n*(1-p1/100)*(1-p2/100)); },
      () => { const a=R(2,5)*10; const b = 100 - a; return g(`In a university senate, ${a}% of the members are tenured faculty and the remaining ${b}% are non-tenured. If 75% of the tenured faculty and 25% of the non-tenured faculty vote in favor of a resolution, what percent of all members who voted in favor are tenured faculty?`, `<f>${3*a}/${2*a + 100}</f> × 100%`, [`<f>${3*a}/${2*a + 100}</f> × 100%`, `${0.75*a}%`, `${0.75*a + 0.25*b}%`, `<f>${a}/${a + b}</f> × 100%`]); },
      // 9. Главная ловушка SAT: если A на p% больше B, то на сколько процентов B меньше A?
      () => {
        const pairs = [[25, 20], [50, 33.3], [100, 50], [20, 16.7], [60, 37.5]];
        const [inc, dec] = getEl([[25, 20], [100, 50], [60, 37.5]]);
        return g(`The number <i>A</i> is ${inc}% greater than the positive number <i>B</i>. The number <i>B</i> is what percent less than <i>A</i>?`, dec);
      },
      // 10. Последовательное повышение на p% и снижение на p%: на сколько процентов изменилась величина?
      () => { const p = getEl([10, 20, 30, 40, 50]); const netLoss = (p * p) / 100; return grid(`The price of a stock increased by ${p}% in May and then decreased by ${p}% in June. The price at the end of June was <i>k</i>% less than the original price at the beginning of May. What is the value of <i>k</i>?`, netLoss); },
      // 11. Изменение площади прямоугольника при изменении длины и ширины в процентах
      () => {
        const incL = getEl([10, 20, 30, 40, 50]), decW = getEl([10, 20, 30]);
        const factor = (1 + incL / 100) * (1 - decW / 100);
        const netPct = Math.round(Math.abs(factor - 1) * 100);
        const dir = factor >= 1 ? "increased" : "decreased";
        return g(`The length of a rectangle is increased by ${incL}% and its width is decreased by ${decW}%. As a result, the area of the rectangle ${dir} by <i>k</i>%. What is the value of <i>k</i>?`, netPct);
      },
      // 12. Цепочка процентов: A — это p% от B, а B — это q% от C. Сколько процентов от C составляет A?
      () => {
        const p = R(2, 8) * 10, q = R(2, 9) * 10;
        const ans = (p * q) / 100;
        return g(`If <i>a</i> is ${p}% of <i>b</i>, and <i>b</i> is ${q}% of <i>c</i>, where <i>c</i> > 0, then <i>a</i> is what percent of <i>c</i>?`, ans);
      },
      // 13. Алгебраическая интерпретация скидки и налога: 0.80(1.07x)
      () => {
        const disc = R(15, 35, 5), tax = R(5, 9);
        const multD = (1 - disc / 100).toFixed(2), multT = (1 + tax / 100).toFixed(2);
        const ans = `${multD}(${multT}<i>p</i>)`;
        return g(`A customer buys a winter coat originally priced at <i>p</i> dollars. The store applies a ${disc}% discount to the original price, and then charges a ${tax}% sales tax on the discounted price. Which of the following expressions represents the final amount the customer pays, in dollars?`, ans, [
          ans,
          `${ (1 - disc/100 + tax/100).toFixed(2) }<i>p</i>`,
          `${ (disc/100).toFixed(2) }(${ (tax/100).toFixed(2) }<i>p</i>)`,
          `(1 - 0.${disc} - 0.0${tax})<i>p</i>`
        ]);
      },
      // 14. Обратная задача на изменение площади квадрата/круга: сторона выросла на p%, на сколько % выросла площадь?
      () => {
        const p = getEl([10, 20, 30, 40, 50]);
        const areaInc = Math.round(((1 + p / 100) * (1 + p / 100) - 1) * 100);
        return g(`If the length of each side of a square is increased by ${p}%, by what percent does the area of the square increase?`, areaInc);
      },
      // 15. Алгебраическая связь: p% от x равно q% от y, найти отношение x/y
      () => {
        const p = R(2, 5) * 10, q = R(6, 9) * 10;
        // (p/100)x = (q/100)y -> x/y = q/p
        const gVal = (a, b) => b === 0 ? a : gVal(b, a % b);
        const div = gVal(q, p);
        const ans = `<f>${q/div}/${p/div}</f>`;
        return g(`If ${p}% of <i>x</i> is equal to ${q}% of <i>y</i>, where <i>x</i> > 0 and <i>y</i> > 0, what is the value of <b><i>x</i>/<i>y</i></b>?`, ans, [
          ans,
          `<f>${p/div}/${q/div}</f>`,
          String((q - p) / 10),
          `<f>${p * q}/100</f>`
        ]);
      },
      // 16. Проценты больше 100%: p% от числа равно A, найти k% от этого же числа
      () => {
        const x = R(4, 15) * 10, p1 = R(2, 4) * 10, p2 = R(12, 25) * 10;
        const val1 = (p1 / 100) * x, val2 = (p2 / 100) * x;
        return grid(`If ${p1}% of a positive number <i>n</i> is ${val1}, what is ${p2}% of <i>n</i>?`, val2);
      },
      // 17. Вычисление исходного значения ДО повышения на p% (Reverse percent increase)
      () => {
        const orig = R(15, 60) * 10, p = getEl([10, 20, 25, 40, 50]);
        const after = orig * (1 + p / 100);
        return g(`After a ${p}% increase in salary, an engineer now earns $${after} per week. What was the engineer's weekly salary, in dollars, before the increase?`, orig);
      },
      // 18. HTML-таблица опроса: какой процент от подгруппы выбрал конкретный вариант
      () => {
        const a1 = R(12, 28) * 2, a2 = 60 - a1;
        const b1 = R(10, 20) * 2, b2 = 40 - b1;
        const totYes = a1 + b1, totNo = a2 + b2;
        const tbl = `<table style="margin:12px auto;border-collapse:collapse;text-align:center;width:280px;border:1px solid var(--line)"><tr style="background:var(--panel2)"><th style="padding:6px;border:1px solid var(--line)">Group</th><th style="padding:6px;border:1px solid var(--line)">Agree</th><th style="padding:6px;border:1px solid var(--line)">Disagree</th><th style="padding:6px;border:1px solid var(--line)">Total</th></tr><tr><td style="padding:4px 8px;border:1px solid var(--line)">Juniors</td><td style="padding:4px 8px;border:1px solid var(--line)">${a1}</td><td style="padding:4px 8px;border:1px solid var(--line)">${a2}</td><td style="padding:4px 8px;border:1px solid var(--line)">60</td></tr><tr><td style="padding:4px 8px;border:1px solid var(--line)">Seniors</td><td style="padding:4px 8px;border:1px solid var(--line)">${b1}</td><td style="padding:4px 8px;border:1px solid var(--line)">${b2}</td><td style="padding:4px 8px;border:1px solid var(--line)">40</td></tr><tr style="font-weight:bold"><td style="padding:4px 8px;border:1px solid var(--line)">Total</td><td style="padding:4px 8px;border:1px solid var(--line)">${totYes}</td><td style="padding:4px 8px;border:1px solid var(--line)">${totNo}</td><td style="padding:4px 8px;border:1px solid var(--line)">100</td></tr></table>`;
        const pct = (b1 / 40) * 100;
        return g(`${tbl}The table above summarizes the results of a survey of 100 high school students. What percent of the <b>Seniors</b> surveyed agreed with the statement?`, pct);
      },
      // 19. Зарплата с базовой ставкой и комиссией в процентах от продаж
      () => { const base = R(4, 9) * 100, comm = getEl([5, 8, 10, 12]), sales = R(2, 8) * 1000; const totalPay = base + (sales * comm) / 100; return g(`A salesperson earns a weekly base salary of $${base} plus a ${comm}% commission on all sales made during the week. If the salesperson made $${sales} in sales this week, what was their total weekly pay, in dollars?`, totalPay); },
      // 20. Изменение дроби: числитель вырос на p%, знаменатель уменьшился на q%
      () => {
        // e.g. x increases by 20% (1.2x), y decreases by 20% (0.8y) -> 1.2/0.8 = 1.5 -> +50%
        const configs = [
          { inc: 20, dec: 20, net: 50 },
          { inc: 50, dec: 25, net: 100 },
          { inc: 40, dec: 30, net: 100 },
          { inc: 10, dec: 50, net: 120 },
          { inc: 26, dec: 10, net: 40 }
        ];
        const c = getEl(configs);
        return grid(`In the fraction <b><i>x</i>/<i>y</i></b>, where <i>x</i> and <i>y</i> are positive numbers, if <i>x</i> is increased by ${c.inc}% and <i>y</i> is decreased by ${c.dec}%, the value of the resulting fraction is what percent greater than the original fraction <b><i>x</i>/<i>y</i></b>?`, c.net);
      },
      // 21. Сплавы и растворы: сколько граммов чистого вещества в смеси двух сплавов
      () => {
        const m1 = R(2, 6) * 50, p1 = R(10, 30, 10);
        const m2 = R(2, 6) * 50, p2 = R(40, 70, 10);
        const totCopper = (m1 * p1) / 100 + (m2 * p2) / 100;
        return g(`A metallurgist melts together ${m1} grams of an alloy that is ${p1}% copper by weight with ${m2} grams of a second alloy that is ${p2}% copper by weight. How many grams of copper are in the resulting mixture?`, totCopper);
      },
      // 22. Испарение воды из раствора (Evaporation / Concentration change — Hard SAT)
      () => {
        const salt = R(15, 45, 5), origConc = 10; // origTotal = salt * 10
        const origMass = salt * 10;
        const newConc = 25; // newTotal = salt * 4
        const newMass = salt * 4;
        const evaporated = origMass - newMass;
        return g(`A ${origMass}-gram saline solution initially contains ${origConc}% salt by mass. After some pure water evaporates from the container, the remaining solution is ${newConc}% salt by mass. How many grams of water evaporated?`, evaporated);
      },
      // 23. Сравнение в стиле SAT: "a is p% greater than b" -> a = (1 + p/100)b, тогда чему равен k*a в процентах от b?
      () => {
        const p = R(10, 60, 10), k = R(2, 4);
        const factor = k * (100 + p);
        return g(`The positive number <i>a</i> is ${p}% greater than the positive number <i>b</i>. The value of ${k}<i>a</i> is what percent of <i>b</i>?`, factor);
      },
      // 24. Процент от процента в текстовой задаче (Двухступенчатая фильтрация группы)
      () => {
        const total = R(4, 12) * 100, pClub = getEl([30, 40, 50, 60]), pOfficers = getEl([10, 20, 25]);
        const ans = total * (pClub / 100) * (pOfficers / 100);
        return grid(`At a high school with ${total} students, ${pClub}% of the students participate in the robotics club. Of the students in the robotics club, ${pOfficers}% are seniors. How many seniors at the high school are in the robotics club?`, ans);
      },
      // 25. Маленькие и дробные проценты (например, 0.5% от партии)
      () => {
        const batch = R(2, 9) * 1000, pct = getEl([0.2, 0.5, 0.8, 1.5]);
        const defective = batch * (pct / 100);
        return g(`A factory produces a batch of ${batch} glass bottles, and exactly ${pct}% of the bottles fail the quality inspection. How many bottles failed the inspection?`, defective);
      },
      // 26. Процентная скидка в долларах vs в процентах: найти финальный процент скидки от исходной цены
      () => {
        const p1 = getEl([20, 30, 40, 50]), p2 = getEl([10, 20, 30]);
        const remFactor = (1 - p1 / 100) * (1 - p2 / 100);
        const totalDiscPct = Math.round((1 - remFactor) * 100);
        return g(`During a holiday sale, a furniture store reduces the price of a sofa by ${p1}%. A customer with a membership card receives an additional ${p2}% off the already reduced sale price. The final price paid by the member represents a total discount of what percent off the original price?`, totalDiscPct);
      },
      // 27. Взвешенный процент (Weighted percentage across two groups)
      () => {
        const g1 = 40, p1 = R(20, 60, 10);
        const g2 = 60, p2 = R(30, 80, 10);
        const overallPct = (g1 * p1 + g2 * p2) / 100;
        return g(`A company has two offices: Office A has ${g1} employees and Office B has ${g2} employees. If ${p1}% of the employees in Office A and ${p2}% of the employees in Office B commute by train, what percent of all employees across both offices commute by train?`, overallPct);
      },
      // 28. Нахождение процента прибыли / наценки (Markup & Profit Margin)
      () => {
        const cost = R(40, 120, 20), markupPct = getEl([50, 75, 100, 125]), coupon = R(10, 30, 5);
        const retail = cost * (1 + markupPct / 100);
        const profit = retail - coupon - cost;
        return grid(`A retailer buys a backpack from a wholesaler for $${cost} and marks up the price by ${markupPct}% for retail sale. If a customer buys the backpack using a $${coupon}-off coupon, what is the retailer's profit, in dollars, on the sale?`, profit);
      },
      // 29. Сложный процент за 2 года (Compound interest over 2 years)
      () => {
        const P = R(1, 5) * 1000, r = 10;
        const after2 = P * 1.21;
        return g(`An account earns ${r}% annual interest compounded annually. If $${P} is initially deposited into the account and no further deposits or withdrawals are made, what will be the total balance in the account, in dollars, after 2 years?`, after2);
      },
      // 30. Интерпретация множителя (1 - p/100) в экспоненциальной/процентной формуле
      () => {
        const decPct = R(12, 38);
        const mult = (1 - decPct / 100).toFixed(2);
        return g(`The value of a piece of industrial equipment <i>t</i> years after purchase is modeled by the expression 45,000(${mult})<sup><i>t</i></sup>. According to the model, by what percent does the value of the equipment decrease each year?`, decPct);
      },
      () => { const berries=R(2,8)*100; // Classic 99% -> 98% water potato/berry paradox! Initial dry mass = 1% of berries = berries/100. After drying to 98% water, dry mass is 2% of new weight -> new weight = berries / 2
        return g(`A shipment of ${berries} kilograms of fresh mushrooms is initially 99% water by weight. After sitting in a warm warehouse, some water evaporates until the mushrooms are 98% water by weight. What is the new total weight, in kilograms, of the mushrooms?`, berries / 2); },
      () => { const p=getEl([10,20,25,50]); // Price increases by p%, by what % must consumption decrease to keep expenditure unchanged? -> p / (100 + p) * 100
        const [inc, dec] = getEl([[25, 20], [100, 50], [60, 37.5]]);
        return grid(`If the unit price of aviation fuel increases by ${inc}%, by what percent must an airline reduce its fuel consumption so that its total spending on fuel remains unchanged?`, dec); },
      () => { const p=getEl([10,20]); // Volume of cube when edge increases by 10% -> 1.1^3 = 1.331 -> 33.1%; or 20% -> 1.2^3 = 1.728 -> 72.8%
        const [edgePct, volPct] = getEl([[10, 33.1], [20, 72.8], [50, 237.5]]);
        return g(`If the length of each edge of a cube is increased by ${edgePct}%, by what percent does the volume of the cube increase?`, volPct); },
      () => { const margin=getEl([20,25,40,50]), rev=R(4,12)*100; // Profit margin on revenue vs markup on cost!
        const cost=R(4,10)*100, markup=getEl([25,50,100]); const sell = cost*(1 + markup/100); const profPctOfRev = ((sell - cost)/sell)*100;
        const [mk, pm] = getEl([[25, 20], [50, 33.3], [100, 50], [60, 37.5]]);
        return g(`A boutique buys coats at a wholesale cost of <i>C</i> dollars each and marks up the price by ${mk}% to set the retail price. The profit on each coat sold at retail represents what percent of the <b>retail price</b>?`, pm); },
      () => { const TP=R(40,80,10), FP=R(10,30,10); const totPos = TP + FP, ppv = (TP / totPos)*100; // Clean numbers: TP=60, FP=20 -> 75%; TP=70, FP=30 -> 70%; TP=80, FP=20 -> 80%
        const [tp, fp] = getEl([[60,20],[70,30],[80,20],[45,15],[90,10]]);
        const tbl=`<table style="margin:10px auto;border-collapse:collapse;text-align:center;width:270px;border:1px solid var(--line)"><tr style="background:var(--panel2)"><th style="padding:5px;border:1px solid var(--line)">Status</th><th style="padding:5px;border:1px solid var(--line)">Test Positive</th><th style="padding:5px;border:1px solid var(--line)">Test Negative</th></tr><tr><td style="padding:5px;border:1px solid var(--line)">Has Virus</td><td style="padding:5px;border:1px solid var(--line)">${tp}</td><td style="padding:5px;border:1px solid var(--line)">5</td></tr><tr><td style="padding:5px;border:1px solid var(--line)">No Virus</td><td style="padding:5px;border:1px solid var(--line)">${fp}</td><td style="padding:5px;border:1px solid var(--line)">900</td></tr></table>`;
        return g(`${tbl}The table above shows the results of a diagnostic test administered to ${tp+fp+905} patients. Of the patients who tested <b>positive</b>, what percent actually have the virus?`, (tp/(tp+fp))*100); },
      () => { const p1=getEl([10,20,25]), p2=getEl([20,40,50]), p3=getEl([10,20]); // 3-step multiplier: x * (1+p1/100) * (1-p2/100)
        const orig=1000, inc=20, dec=25; // 1000 * 1.2 * 0.75 = 900 -> 10% decrease
        const [a,b,net] = getEl([[20,25,10],[25,20,0],[50,40,10],[40,50,30]]);
        return grid(`A stock portfolio's value increases by ${a}% during the first quarter and then decreases by ${b}% during the second quarter. The value at the end of the second quarter is what percent less than the initial value at the start of the first quarter?`, net); },
      () => { const p=R(15,45,5), q=R(20,60,10); // p% of (q% of x) = k -> find x
        const x = R(2,8)*1000; const val = (p/100)*(q/100)*x;
        return g(`If ${p}% of ${q}% of a positive number <i>n</i> is equal to ${val}, what is the value of <i>n</i>?`, x); },
      () => { const rNom=getEl([8,12,16,20]); // Semiannual compounding: (1 + r/200)^2 - 1
        const half = rNom/2; const eff = Number(((1 + half/100)*(1 + half/100) - 1)*100).toFixed(2);
        return g(`A certificate of deposit offers a nominal annual interest rate of ${rNom}%, compounded semiannually (Meaning ${half}% interest is applied every 6 months). What is the effective annual percentage yield (the total percent increase over 1 full year)?`, Number(eff)); },
      () => { const a=R(2,6)*10, b=R(3,8)*10; // (a% of x) + (b% of 2x) = (a + 2b)% of x
        return g(`For any positive number <i>x</i>, the sum of ${a}% of <i>x</i> and ${b}% of 2<i>x</i> is equal to <i>k</i>% of <i>x</i>. What is the value of <i>k</i>?`, a + 2*b); },
      () => { const bracket1=50000, r1=10, r2=25, extra=R(2,8)*10000; const totTax = bracket1*(r1/100) + extra*(r2/100);
        return grid(`In a graduated income tax system, the first $50,000 of annual income is taxed at 10%, and all income above $50,000 is taxed at 25%. If a resident paid a total of $${totTax} in income tax, what was the resident's total annual income, in dollars?`, bracket1 + extra); },
      () => { const v1=R(2,5)*100, c1=R(15,35,5), vAdd=v1; // Adding pure water (0%) or pure acid (100%): add v1 mL of pure water to v1 mL of c1% solution -> concentration halves!
        return g(`A beaker contains ${v1} milliliters of a ${c1}% saline solution. If ${v1} milliliters of pure water (0% salt) are added to the beaker, what is the salt concentration, as a percent, of the resulting mixture?`, c1 / 2); },
      () => { const rInc=getEl([20,50]), hDec=getEl([25,50]); // Cylinder volume V = pi*r^2*h: r increases by 50% (1.5^2 = 2.25), h decreases by 20% (0.8) -> 2.25 * 0.8 = 1.8 -> +80%!
        const configs = [[50, 20, 80], [20, 25, 8], [50, 60, -10]]; const [ri, hd, net] = getEl([[50, 20, 80], [20, 25, 8]]);
        return g(`If the radius of a right circular cylinder is increased by ${ri}% and its height is decreased by ${hd}%, by what percent does the volume of the cylinder increase?`, net); },
      () => { const tot=R(5,12)*100, pMen=40, pWomen=60; const mVote=R(50,80,10), wVote=R(40,70,10); const overall = (pMen*mVote + pWomen*wVote)/100;
        return g(`In a town council election, 40% of the voters were under age 35 and 60% were age 35 or older. If ${mVote}% of the voters under age 35 and ${wVote}% of the voters age 35 or older voted for Measure A, what percent of all voters cast their ballot for Measure A?`, overall); },
      () => { const p=R(12,28); const mult = (1 + p/100).toFixed(2);
        return g(`The population of a coastal city increased by ${p}% from 2010 to 2015, and then increased by ${p}% again from 2015 to 2020. If the population in 2020 was <i>P</i>, which expression represents the city's population in 2010?`, `<f><i>P</i>/(${mult})²</f>`, [`<f><i>P</i>/(${mult})²</f>`, `<i>P</i>(1 - 0.${p})²`, `<f><i>P</i>/${(1 + 2*p/100).toFixed(2)}</f>`, `<i>P</i>(${mult})²`]); },
      () => { const a=R(2,5), b=R(4,8); // x is 25% of y, y is 60% of z -> z is what % of x?
        const [p1, p2, inv] = getEl([[25, 80, 500], [50, 50, 400], [40, 50, 500], [80, 50, 250]]);
        return grid(`If <i>x</i> is ${p1}% of <i>y</i> and <i>y</i> is ${p2}% of <i>z</i>, where <i>x</i>, <i>y</i>, and <i>z</i> are positive numbers, then <i>z</i> is what percent of <i>x</i>?`, inv); },
      () => { const orig=R(4,9)*100, final=orig*0.81; // two equal successive % discounts -> (1 - r)^2 = 0.81 -> r = 10%
        const [fRatio, rAns] = getEl([[0.81, 10], [0.64, 20], [0.49, 30], [0.25, 50]]);
        const pInit = R(2,6)*100, pEnd = pInit * fRatio;
        return g(`An item originally priced at $${pInit} undergoes two successive discounts of <i>r</i>% each, bringing its final price down to $${pEnd}. What is the value of <i>r</i>?`, rAns); },
      () => { const p1=R(18,32), p2=p1+R(9,18); // Percentage points vs relative percent increase! From 20% to 25% is 5 percentage points, which is a 25% relative increase
        const [oldP, newP, relInc] = getEl([[20, 25, 25], [25, 30, 20], [40, 50, 25], [16, 20, 25], [50, 65, 30]]);
        return g(`The share of renewable energy in a state's power grid rose from ${oldP}% in 2015 to ${newP}% in 2025 (an increase of ${newP - oldP} percentage points). What was the <b>relative percent increase</b> in the share of renewable energy over this decade?`, relInc); },
      () => { const disc=20, targetGain=20; // Bought at 20% off list price L (0.8L). Sold to make 25% profit on cost (0.8L * 1.25 = 1.0L), or 50% profit on cost (0.8L * 1.5 = 1.2L -> 20% above list price)
        return g(`A dealer purchases a vintage watch at a 20% discount off its original list price. The dealer then sells the watch for 50% more than the price the dealer paid. The dealer's selling price is what percent greater than the original list price?`, 20); },
      () => { const fixed=R(2,5)*1000, pct=R(4,9), totEarn=fixed + pct*R(3,8)*100; const sales = ((totEarn - fixed)*100)/pct;
        return grid(`A real estate agent receives a monthly base retainer of $${fixed} plus a ${pct}% commission on all property sales exceeding $100,000. In a month where the agent's total earnings were $${totEarn}, what was the agent's total dollar volume of property sales?`, 100000 + sales); },
      () => { const n=R(2,6)*100, pDefA=2, pDefB=5; const mA=R(3,6)*100, mB=R(2,5)*100; const totDef = (mA*pDefA + mB*pDefB)/100;
        return g(`Machine A produces ${mA} bolts with a 2% defect rate, and Machine B produces ${mB} bolts with a 5% defect rate. How many total defective bolts are produced by the two machines combined?`, totDef); }
    ],
    // === Topic 11: One-variable data ===
    [
      () => { const n1=R(10,20), m1=R(70,82), n2=R(15,25), m2=R(84,94); const m3=R(75,90), n3=R(5,15); const totSum = n1*m1 + n2*m2 + n3*m3; const totN = n1 + n2 + n3; return g(`A research study combined three independent cohorts. Cohort A had ${n1} participants with a mean score of ${m1}; Cohort B had ${n2} participants with a mean score of ${m2}; and Cohort C had <i>k</i> participants with a mean score of ${m3}. If the sum of the scores of all ${totN} participants across the three cohorts was ${totSum}, what is the value of <i>k</i>?`, String(n3), [String(n3), String(n3 + 5), String(Math.round((m1+m2+m3)/3)), String(n1 + n2 - n3)]); },
      () => { const a=R(10,20), d=R(3,7); return g(`Data Set X consists of the 5 integers ${a}, ${a+d}, ${a+2*d}, ${a+3*d}, and ${a+4*d}. Data Set Y is formed by multiplying each value in Data Set X by 3 and then subtracting 8. How do the standard deviation and median of Data Set Y compare to those of Data Set X?`, `The standard deviation is 3 times as large, and the median is ${3*(a+2*d)-8}.`, [`The standard deviation is 3 times as large, and the median is ${3*(a+2*d)-8}.`, `The standard deviation is 3 times as large minus 8, and the median is ${3*(a+2*d)-8}.`, `Both the standard deviation and the median are multiplied by 3.`, `The standard deviation is unchanged, and the median is ${3*(a+2*d)-8}.`]); },
      () => { const n=9, curMean=R(24,42), newMean=curMean+R(3,6); const added = 10*newMean - 9*curMean; return g(`A dataset of 9 distinct positive integers has a mean of ${curMean} and a median of ${curMean - 1}. When a 10th integer <i>x</i> is appended to the dataset, the mean increases to ${newMean}. What is the value of <i>x</i>?`, String(added), [String(added), String(newMean), String(added - curMean), String(curMean + 10)]); },
      () => { const q1=R(22,38), iqr=R(14,28); const q3=q1+iqr; return g(`In a box plot summarizing 120 test scores, the first quartile (Q1) is ${q1}, the median is ${q1 + Math.floor(iqr*0.4)}, and the interquartile range (IQR) is ${iqr}. Using the standard 1.5 × IQR rule, any score strictly greater than Q3 + 1.5(IQR) is classified as a high outlier. What is the high-outlier threshold for this distribution?`, String(q3 + 1.5*iqr), [String(q3 + 1.5*iqr), String(q1 + 1.5*iqr), String(q3 + iqr), String(q3 - 1.5*iqr)]); },
      () => { const med=R(15,30); return g(`A sorted list of 7 integers is given as: 8, 11, 14, ${med}, 29, 34, and <i>k</i>, where <i>k</i> &gt; 34. If the mean of these 7 integers is equal to their median (${med}), what must be the value of <i>k</i>?`, String(7*med - (8+11+14+med+29+34)), traps(7*med - (8+11+14+med+29+34))); },
      () => { const f1=R(4,8), f2=R(6,10), f3=R(5,9); const N = f1 + f2 + f3 + 1; return g(`In a frequency table of integer scores {10, 20, 30, 40}, the frequencies of 10, 20, and 30 are ${f1}, ${f2}, and ${f3}, respectively, and the frequency of 40 is <i>m</i>. What is the largest integer value of <i>m</i> for which the median of the entire dataset remains 20?`, String(f1 + f2 - f3 - 1), [String(f1 + f2 - f3 - 1), String(f1 + f2 - f3), String(f1 + f2), String(f2)]); },
      () => { const a=R(20,40); return g(`If an extreme outlier of ${a+200} is added to the dataset ${a}, ${a+2}, ${a+4}, which statistic changes the most?`, "Mean", ["Mean", "Median", "Mode", "Range changes less than mean"]); },
      () => { const n1=R(10,20), m1=R(70,82), n2=R(15,25), m2=R(84,94); const m3=R(75,90), n3=R(5,15); const totSum = n1*m1 + n2*m2 + n3*m3; const totN = n1 + n2 + n3; return g(`A research study combined three independent cohorts. Cohort A had ${n1} participants with a mean score of ${m1}; Cohort B had ${n2} participants with a mean score of ${m2}; and Cohort C had <i>k</i> participants with a mean score of ${m3}. If the sum of the scores of all ${totN} participants across the three cohorts was ${totSum}, what is the value of <i>k</i>?`, String(n3), [String(n3), String(n3 + 5), String(Math.round((m1+m2+m3)/3)), String(n1 + n2 - n3)]); },
      // 9. Классическая ловушка SAT: если ко всем числам прибавить константу k, как изменится Standard Deviation? (Никак! Ответ 0 или не изменится)
      () => {
        const sd = R(3, 12), k = R(10, 50, 5);
        return g(`A data set of 25 measurements has a mean of 40 and a standard deviation of ${sd}. If ${k} is added to each measurement in the data set, what is the standard deviation of the new data set?`, sd);
      },
      // 10. Умножение всех элементов выборки на k: во сколько раз меняется Standard Deviation и Range
      () => {
        const sd = R(2, 7), mult = R(2, 5);
        return g(`A data set has a standard deviation of ${sd}. If every value in the data set is multiplied by ${mult}, what is the standard deviation of the resulting data set?`, sd * mult);
      },
      // 11. Сравнение Standard Deviation двух наборов данных без вычислений (по разбросу от среднего)
      () => {
        const m = R(20, 50, 10), d1 = R(1, 3), d2 = R(6, 12);
        const setA = `${m - 2*d1}, ${m - d1}, ${m}, ${m + d1}, ${m + 2*d1}`;
        const setB = `${m - 2*d2}, ${m - d2}, ${m}, ${m + d2}, ${m + 2*d2}`;
        const ans = "The standard deviation of Data Set A is less than the standard deviation of Data Set B.";
        return g(`Data Set A: ${setA}<br>Data Set B: ${setB}<br><br>Which of the following statements correctly compares the standard deviations of the two data sets above?`, ans, [
          ans,
          "The standard deviation of Data Set A is greater than the standard deviation of Data Set B.",
          "The standard deviations of both data sets are equal because their means are equal.",
          "There is not enough information to compare the standard deviations."
        ]);
      },
      // 12. HTML-таблица частот (Frequency table): найти МЕДИАНУ (ловушка на подсчет позиций)
      () => {
        // Total = 15 items (median is the 8th item)
        const v1 = R(10, 15), v2 = v1 + 1, v3 = v1 + 2, v4 = v1 + 3;
        const f1 = 3, f2 = 4, f3 = 5, f4 = 3; // cum: 3, 7, 12, 15 -> 8th item is in v3!
        const tbl = `<table style="margin:12px auto;border-collapse:collapse;text-align:center;width:220px;border:1px solid var(--line)"><tr style="background:var(--panel2)"><th style="padding:6px;border:1px solid var(--line)">Value</th><th style="padding:6px;border:1px solid var(--line)">Frequency</th></tr><tr><td style="padding:4px;border:1px solid var(--line)">${v1}</td><td style="padding:4px;border:1px solid var(--line)">${f1}</td></tr><tr><td style="padding:4px;border:1px solid var(--line)">${v2}</td><td style="padding:4px;border:1px solid var(--line)">${f2}</td></tr><tr><td style="padding:4px;border:1px solid var(--line)">${v3}</td><td style="padding:4px;border:1px solid var(--line)">${f3}</td></tr><tr><td style="padding:4px;border:1px solid var(--line)">${v4}</td><td style="padding:4px;border:1px solid var(--line)">${f4}</td></tr></table>`;
        return g(`${tbl}The frequency table above summarizes a data set of 15 values. What is the median of the data set?`, v3);
      },
      // 13. HTML-таблица частот (Frequency table): найти СРЕДНЕЕ (Mean)
      () => {
        const f1 = 2, f2 = 3, f3 = 5; // total = 10
        const v1 = 10, v2 = 20, v3 = R(3, 6) * 10;
        const mean = (v1 * f1 + v2 * f2 + v3 * f3) / 10;
        const tbl = `<table style="margin:12px auto;border-collapse:collapse;text-align:center;width:220px;border:1px solid var(--line)"><tr style="background:var(--panel2)"><th style="padding:6px;border:1px solid var(--line)">Score</th><th style="padding:6px;border:1px solid var(--line)">Frequency</th></tr><tr><td style="padding:4px;border:1px solid var(--line)">${v1}</td><td style="padding:4px;border:1px solid var(--line)">${f1}</td></tr><tr><td style="padding:4px;border:1px solid var(--line)">${v2}</td><td style="padding:4px;border:1px solid var(--line)">${f2}</td></tr><tr><td style="padding:4px;border:1px solid var(--line)">${v3}</td><td style="padding:4px;border:1px solid var(--line)">${f3}</td></tr></table>`;
        return grid(`${tbl}The table above shows the distribution of scores for 10 students on a quiz. What is the mean score of these 10 students?`, mean);
      },
      // 14. Нечетримое/четное количество элементов: медиана четного набора данных (среднее двух центральных)
      () => {
        const a = R(10, 25), b = a + R(3, 7), c = b + R(2, 8, 2), d = c + R(4, 10);
        // Sorted: a, b, c, d -> median is (b + c)/2
        const med = (b + c) / 2;
        return g(`What is the median of the 4 numbers: ${c}, ${a}, ${d}, ${b}?`, med);
      },
      // 15. Взвешенное среднее (Weighted Mean) двух классов разного размера
      () => {
        const n1 = 10, n2 = 15; // total = 25
        const m1 = R(70, 80, 5), m2 = m1 + 5; // (10*m1 + 15*(m1+5))/25 = m1 + 3
        const overallMean = (n1 * m1 + n2 * m2) / 25;
        return g(`Class A has ${n1} students with a mean test score of ${m1}, and Class B has ${n2} students with a mean test score of ${m2}. When the scores of both classes are combined, what is the mean score of all 25 students?`, overallMean);
      },
      // 16. Interquartile Range (IQR = Q3 - Q1) из 5-числовой сводки (Box Plot parameters)
      () => {
        const min = R(10, 20), q1 = min + R(8, 15), med = q1 + R(5, 12), q3 = med + R(8, 18), max = q3 + R(10, 25);
        return g(`A data set is summarized by a box plot with a minimum value of ${min}, a first quartile (<i>Q</i>₁) of ${q1}, a median of ${med}, a third quartile (<i>Q</i>₃) of ${q3}, and a maximum value of ${max}. What is the interquartile range (IQR) of the data set?`, q3 - q1);
      },
      // 17. Эффект удаления максимального выброса: сравнение изменения Mean и Median
      () => {
        const base = R(10, 30);
        const list = `${base}, ${base+1}, ${base+2}, ${base+3}, ${base+4}, ${base+5}, ${base+80}`;
        const ans = "The mean will decrease more than the median.";
        return g(`Consider the data set of 7 values: ${list}. If the outlier value of ${base+80} is removed from the data set, which of the following accurately describes the effect on the mean and the median?`, ans, [
          ans,
          "The median will decrease more than the mean.",
          "Both the mean and the median will remain unchanged.",
          "The mean will increase while the median decreases."
        ]);
      },
      // 18. Нахождение пропущенного числа в упорядоченном списке по заданному Range
      () => {
        const min = R(12, 35), rng = R(40, 75);
        const max = min + rng;
        return grid(`The 5 numbers ${min}, ${min+8}, ${min+19}, ${min+31}, and <i>x</i> are arranged in ascending order. If the range of the 5 numbers is ${rng}, what is the value of <i>x</i>?`, max);
      },
      // 19. Как новое число меняет среднее: чтобы поднять среднее с m1 до m2
      () => {
        const n = R(4, 7), m1 = R(70, 84, 2), m2 = m1 + 2;
        const needed = (n + 1) * m2 - n * m1;
        return g(`The mean of ${n} numbers is ${m1}. What number must be added to this data set so that the mean of the ${n + 1} numbers becomes ${m2}?`, needed);
      },
      // 20. Исправление ошибки в данных (Data entry error correction — хит SAT!)
      () => {
        const n = 10, oldMean = R(45, 75), wrongVal = R(20, 40), rightVal = wrongVal + R(2, 6) * 10;
        const newMean = oldMean + (rightVal - wrongVal) / n;
        return g(`A researcher calculated the mean of ${n} measurements to be ${oldMean}. Later, she discovered that one measurement was mistakenly recorded as ${wrongVal} instead of its actual value of ${rightVal}. After correcting this error, what is the true mean of the ${n} measurements?`, newMean);
      },
      // 21. Сравнение Mean и Median при равенстве суммы: симметричный набор данных
      () => {
        const c = R(25, 60), d1 = R(2, 5), d2 = R(7, 14);
        // c - d2, c - d1, c, c + d1, c + d2 -> symmetric! Mean = Median = c
        return g(`For the symmetric data set ${c - d2}, ${c - d1}, ${c}, ${c + d1}, ${c + d2}, what is the positive difference between the mean and the median of the data set?`, 0);
      },
      // 22. Нахождение неизвестного числа x, если Mean равен Median
      () => {
        const a = R(10, 20), b = a + R(4, 10);
        // Set: a, b, x where a < b < x. Median is b. Mean is (a + b + x)/3 = b -> x = 2b - a
        const x = 2 * b - a;
        return grid(`The three numbers ${a}, ${b}, and <i>x</i> are listed in ascending order (${a} < ${b} < <i>x</i>). If the mean of these three numbers is equal to their median, what is the value of <i>x</i>?`, x);
      },
      // 23. Промах/смещение в вычислении медианы при добавлении двух чисел по краям
      () => {
        const med = R(30, 70), low = R(1, 10), high = R(90, 120);
        return g(`A data set of 11 integers has a median of ${med}, a minimum of 15, and a maximum of 85. If two new values, ${low} and ${high}, are added to the data set, what is the median of the new 13-value data set?`, med);
      },
      // 24. SVG-гистограмма / столбчатая диаграмма (Bar chart / Dot plot): найти медиану по картинке
      () => {
        // Values 1, 2, 3, 4 with heights 2, 5, 3, 1 -> Total = 11, 6th value is 2!
        const f1 = 2, f2 = 5, f3 = 3, f4 = 1;
        const chart = `<svg viewBox="0 0 220 130" style="width:100%;max-width:240px;display:block;margin:0 auto 12px;background:#fff;border-radius:8px;border:1px solid #cbd5e1"><line x1="35" y1="105" x2="200" y2="105" stroke="#0f2b4a" stroke-width="2"/><line x1="35" y1="15" x2="35" y2="105" stroke="#0f2b4a" stroke-width="2"/><rect x="50" y="${105 - f1*15}" width="24" height="${f1*15}" fill="#22a381"/><text x="62" y="120" font-size="11" text-anchor="middle" fill="#333">1</text><text x="62" y="${100 - f1*15}" font-size="10" text-anchor="middle" fill="#0f2b4a">${f1}</text><rect x="88" y="${105 - f2*15}" width="24" height="${f2*15}" fill="#22a381"/><text x="100" y="120" font-size="11" text-anchor="middle" fill="#333">2</text><text x="100" y="${100 - f2*15}" font-size="10" text-anchor="middle" fill="#0f2b4a">${f2}</text><rect x="126" y="${105 - f3*15}" width="24" height="${f3*15}" fill="#22a381"/><text x="138" y="120" font-size="11" text-anchor="middle" fill="#333">3</text><text x="138" y="${100 - f3*15}" font-size="10" text-anchor="middle" fill="#0f2b4a">${f3}</text><rect x="164" y="${105 - f4*15}" width="24" height="${f4*15}" fill="#22a381"/><text x="176" y="120" font-size="11" text-anchor="middle" fill="#333">4</text><text x="176" y="${100 - f4*15}" font-size="10" text-anchor="middle" fill="#0f2b4a">${f4}</text></svg>`;
        return g(`${chart}The bar graph above shows the number of books read last month by 11 students (values 1 through 4, with frequencies shown above each bar). What is the median number of books read by these 11 students?`, 2);
      },
      // 25. SVG Box Plot: найти Range или IQR по визуальному графику ящика с усами
      () => {
        const min = 10, q1 = 25, med = 40, q3 = 65, max = 90;
        // Scale 0..100 to x: 20..200 (1.8px per unit)
        const sx = v => 20 + v * 1.8;
        const boxSvg = `<svg viewBox="0 0 220 90" style="width:100%;max-width:260px;display:block;margin:0 auto 12px;background:#fff;border-radius:8px;border:1px solid #cbd5e1"><line x1="20" y1="65" x2="200" y2="65" stroke="#64748b" stroke-width="1.5"/><line x1="${sx(min)}" y1="25" x2="${sx(min)}" y2="45" stroke="#0f2b4a" stroke-width="2"/><line x1="${sx(max)}" y1="25" x2="${sx(max)}" y2="45" stroke="#0f2b4a" stroke-width="2"/><line x1="${sx(min)}" y1="35" x2="${sx(q1)}" y2="35" stroke="#0f2b4a" stroke-width="2"/><line x1="${sx(q3)}" y1="35" x2="${sx(max)}" y2="35" stroke="#0f2b4a" stroke-width="2"/><rect x="${sx(q1)}" y="22" width="${sx(q3)-sx(q1)}" height="26" fill="#e2f5f0" stroke="#22a381" stroke-width="2"/><line x1="${sx(med)}" y1="22" x2="${sx(med)}" y2="48" stroke="#0f2b4a" stroke-width="2.5"/><text x="${sx(min)}" y="80" font-size="9" text-anchor="middle" fill="#333">${min}</text><text x="${sx(q1)}" y="80" font-size="9" text-anchor="middle" fill="#333">${q1}</text><text x="${sx(med)}" y="80" font-size="9" text-anchor="middle" fill="#333">${med}</text><text x="${sx(q3)}" y="80" font-size="9" text-anchor="middle" fill="#333">${q3}</text><text x="${sx(max)}" y="80" font-size="9" text-anchor="middle" fill="#333">${max}</text></svg>`;
        return g(`${boxSvg}Based on the box plot above, what is the interquartile range (IQR) of the data set?`, q3 - q1);
      },
      // 26. Нахождение неизвестной частоты k в таблице, если известно среднее значение
      () => {
        // Values 10 (freq 4) and 20 (freq k). Mean is 16 -> (40 + 20k)/(4 + k) = 16 -> 40 + 20k = 64 + 16k -> 4k = 24 -> k = 6
        const f1 = R(2, 6) * 2, k = f1 * 1.5; // (10*f1 + 20*1.5*f1)/(2.5*f1) = 40/2.5 = 16
        return grid(`In a data set, the value 10 appears ${f1} times and the value 20 appears <i>k</i> times. If the mean of the entire data set is 16, what is the value of <i>k</i>?`, k);
      },
      // 27. Форма распределения (Skewness): сравнение Mean и Median при правом/левом хвосте
      () => {
        const ans = "The mean is greater than the median.";
        return g(`A distribution of house prices in a city is strongly skewed to the right (positively skewed) due to a small number of multi-million-dollar mansions. Which of the following statements is most likely true about the mean and median house prices in this city?`, ans, [
          ans,
          "The mean is less than the median.",
          "The mean and the median are exactly equal.",
          "The standard deviation of the prices is zero."
        ]);
      },
      // 28. Минимальное/максимальное возможное значение для сохранения той же медианы
      () => {
        // Data set: 12, 15, 19, 24, 30 (median is 19). If 6th number x is added and new median is 17 -> (15 + 19)/2 = 17, so x <= 15!
        const a = 10, b = 16, c = 22, d = 28, e = 35; // median of 6 items is average of 3rd and 4th
        // If new median is (b + c)/2 = 19, then x must be <= b (16)
        return g(`A data set consists of the 5 numbers: ${a}, ${b}, ${c}, ${d}, and ${e}. When a 6th number <i>x</i> is added to the data set, the median of the 6 numbers becomes ${(b + c) / 2}. What is the greatest possible value of <i>x</i>?`, b);
      },
      // 29. Изменение размаха (Range) при добавлении элемента внутри текущего диапазона
      () => {
        const min = R(15, 25), max = R(75, 95), inside = R(35, 65);
        return g(`A data set of 20 numbers has a minimum value of ${min} and a maximum value of ${max}. If a 21st number equal to ${inside} is added to the data set, what is the range of the new data set?`, max - min);
      },
      // 30. Удаление элемента, равного среднему арифметическому (Mean stays the same!)
      () => {
        const n = R(8, 16), m = R(30, 65);
        return g(`A data set of ${n} numbers has a mean of ${m}. If one number equal to ${m} is removed from the data set, what is the mean of the remaining ${n - 1} numbers?`, m);
      },
      () => { const k=R(4,9); // Frequency table with algebraic frequency k and given mean
        const f1=4, f2=6; // values 10 (f=4), 20 (f=6), 30 (f=k). Mean = 22 -> (40 + 120 + 30k)/(10 + k) = 22 -> 160 + 30k = 220 + 22k -> 8k = 60... let's make mean = 25 -> (160 + 30k) = 250 + 25k -> 5k = 90 -> k = 18!
        const tbl=`<table style="margin:10px auto;border-collapse:collapse;text-align:center;width:230px;border:1px solid var(--line)"><tr style="background:var(--panel2)"><th style="padding:5px;border:1px solid var(--line)">Value</th><th style="padding:5px;border:1px solid var(--line)">Frequency</th></tr><tr><td style="padding:4px;border:1px solid var(--line)">10</td><td style="padding:4px;border:1px solid var(--line)">4</td></tr><tr><td style="padding:4px;border:1px solid var(--line)">20</td><td style="padding:4px;border:1px solid var(--line)">6</td></tr><tr><td style="padding:4px;border:1px solid var(--line)">30</td><td style="padding:4px;border:1px solid var(--line)"><i>k</i></td></tr></table>`;
        return grid(`${tbl}The frequency table above summarizes a data set of 10 + <i>k</i> values. If the mean of the data set is 25, what is the value of <i>k</i>?`, 18); },
      () => { // Maximum possible value of k in frequency table so that median remains in a given bin
        const f1=5, f2=8; // Values: 1 (freq 5), 2 (freq 8), 3 (freq k). For median to be 2, total N = 13 + k. Even/odd: if k = 12, N = 25, 13th item is the last '2' (median=2). If k = 13, N = 26, 13th is 2 and 14th is 3 (median=2.5). So max integer k is 12!
        const a=R(4,9), b=R(6,12); const maxK = a + b - 1;
        const tbl=`<table style="margin:10px auto;border-collapse:collapse;text-align:center;width:230px;border:1px solid var(--line)"><tr style="background:var(--panel2)"><th style="padding:5px;border:1px solid var(--line)">Score</th><th style="padding:5px;border:1px solid var(--line)">Frequency</th></tr><tr><td style="padding:4px;border:1px solid var(--line)">10</td><td style="padding:4px;border:1px solid var(--line)">${a}</td></tr><tr><td style="padding:4px;border:1px solid var(--line)">20</td><td style="padding:4px;border:1px solid var(--line)">${b}</td></tr><tr><td style="padding:4px;border:1px solid var(--line)">30</td><td style="padding:4px;border:1px solid var(--line)"><i>k</i></td></tr></table>`;
        return g(`${tbl}In the frequency table above, <i>k</i> is a positive integer. What is the greatest possible integer value of <i>k</i> for which the median score of the data set is 20?`, maxK); },
      () => { const sx = v => 20 + v * 1.8; const min1=10, q1_1=25, med1=40, q3_1=55, max1=80; const min2=15, q1_2=30, med2=50, q3_2=75, max2=90;
        const fig = `<svg viewBox="0 0 230 125" style="width:100%;max-width:270px;display:block;margin:0 auto 10px;background:#fff;border-radius:8px;border:1px solid #cbd5e1"><text x="12" y="34" font-size="10" font-weight="bold" fill="#0f2b4a">A</text><line x1="${sx(min1)}" y1="30" x2="${sx(q1_1)}" y2="30" stroke="#0f2b4a" stroke-width="2"/><line x1="${sx(q3_1)}" y1="30" x2="${sx(max1)}" y2="30" stroke="#0f2b4a" stroke-width="2"/><rect x="${sx(q1_1)}" y="20" width="${sx(q3_1)-sx(q1_1)}" height="20" fill="#e2f5f0" stroke="#22a381" stroke-width="2"/><line x1="${sx(med1)}" y1="20" x2="${sx(med1)}" y2="40" stroke="#0f2b4a" stroke-width="2.5"/><text x="12" y="79" font-size="10" font-weight="bold" fill="#0f2b4a">B</text><line x1="${sx(min2)}" y1="75" x2="${sx(q1_2)}" y2="75" stroke="#0f2b4a" stroke-width="2"/><line x1="${sx(q3_2)}" y1="75" x2="${sx(max2)}" y2="75" stroke="#0f2b4a" stroke-width="2"/><rect x="${sx(q1_2)}" y="65" width="${sx(q3_2)-sx(q1_2)}" height="20" fill="#fef3c7" stroke="#d97706" stroke-width="2"/><line x1="${sx(med2)}" y1="65" x2="${sx(med2)}" y2="85" stroke="#0f2b4a" stroke-width="2.5"/><line x1="20" y1="100" x2="200" y2="100" stroke="#64748b" stroke-width="1.5"/>${[10,30,50,70,90].map(v=>`<text x="${sx(v)}" y="114" font-size="9" text-anchor="middle" fill="#333">${v}</text>`).join('')}</svg>`;
        return g(`${fig}The double box plot above summarizes two data sets, A and B. What is the positive difference between the interquartile range (IQR) of Data Set B and the interquartile range (IQR) of Data Set A?`, (q3_2 - q1_2) - (q3_1 - q1_1)); },
      () => { const sd = R(4,11), m = R(3,6), b = R(10,40); // Linear transformation y = m*x + b -> new SD = m*sd, new mean = m*mean + b
        return g(`Each value <i>x</i> in a data set with a standard deviation of ${sd} is transformed using the linear equation <i>y</i> = -${m}<i>x</i> + ${b} to create a new data set of <i>y</i>-values. What is the standard deviation of the new data set of <i>y</i>-values?`, m * sd); },
      () => { const m=R(30,60), d=R(4,9); // Set A: {m-2d, m-d, m, m+d, m+2d}. If we add Two values equal to m, SD decreases!
        return g(`Data Set X consists of the 5 values: ${m-2*d}, ${m-d}, ${m}, ${m+d}, and ${m+2*d}. Data Set Y is formed by adding two additional values, both equal to ${m}, to Data Set X. Which statement correctly compares the mean and standard deviation of Data Set Y to those of Data Set X?`, "The mean is the same, and the standard deviation of Data Set Y is less than that of Data Set X.", ["The mean is the same, and the standard deviation of Data Set Y is less than that of Data Set X.", "The mean is the same, and the standard deviation of Data Set Y is greater than that of Data Set X.", "Both the mean and the standard deviation are the same for both data sets.", "The mean of Data Set Y is greater, and the standard deviation is the same."]); },
      () => { const n=27; // Histogram with 27 values -> median is 14th value. Bins: 0-9 (4), 10-19 (7), 20-29 (9), 30-39 (7) -> 14th value falls in 20-29! Any value in 20-29 is possible, values outside are NOT.
        const f1=4, f2=7, f3=9, f4=5; // total = 25, 13th is in 20-29
        return g(`A histogram summarizes 25 integer test scores grouped into four intervals: 60–69 (4 students), 70–79 (7 students), 80–89 (9 students), and 90–99 (5 students). Which of the following could be the median test score of the 25 students?`, "84", ["84", "78", "69", "91"]); },
      () => { const n1=12, m1=R(60,75,5), n2=18, m2=m1+10; // Combined mean of 30 items = (12*m1 + 18*(m1+10))/30 = m1 + 6
        return grid(`Group 1 consists of 12 observations with a mean of ${m1}, and Group 2 consists of 18 observations with a mean of ${m2}. What is the mean of all 30 observations when the two groups are combined?`, m1 + 6); },
      () => { const q1=R(25,40), q3=q1+R(12,24,2); const iqr=q3-q1, upperFence = q3 + 1.5*iqr;
        return g(`Under the 1.5 × IQR rule, a data value is classified as a high outlier if it is strictly greater than <i>Q</i>₃ + 1.5(IQR). For a data set with first quartile <i>Q</i>₁ = ${q1} and third quartile <i>Q</i>₃ = ${q3}, what is the threshold value above which any observation is considered a high outlier?`, upperFence); },
      () => { const a=12, b=15, c=19, d=24, e=30; // 5 integers: mean = 20, median = 19. We add 6th integer x so that new mean = new median
        // Wait: 4 integers: 10, 14, 20, x (where x > 20). Median is (14+20)/2 = 17. For mean to equal 17: (44 + x)/4 = 17 -> x = 24!
        const n1=R(8,14), n2=n1+R(4,8,2), n3=n2+R(4,8,2); const med=(n2+n3)/2, x = 4*med - (n1+n2+n3);
        return g(`Four integers are listed in ascending order: ${n1}, ${n2}, ${n3}, and <i>x</i>. If the mean of these four integers is equal to their median, what is the value of <i>x</i>?`, x); },
      () => { const n=R(6,10), m=R(40,70), out=m + n*R(5,12); // n numbers have mean m. When outlier 'out' is removed, what is the new mean of n-1 numbers?
        const N=9, meanAll=R(40,60), removed=meanAll + 8*R(3,7); const newMean = (N*meanAll - removed)/(N-1);
        return g(`A data set of 9 numbers has a mean of ${meanAll}. When the single largest number, ${removed}, is removed from the data set, what is the mean of the remaining 8 numbers?`, newMean); },
      () => { const stem = `<div style="font-family:monospace;background:var(--panel2);padding:10px 16px;border-radius:10px;width:fit-content;margin:10px auto;border:1px solid var(--line)"><b>Stem | Leaf</b><br>2 &nbsp;&nbsp;&nbsp;| 1 &nbsp;4 &nbsp;8<br>3 &nbsp;&nbsp;&nbsp;| 0 &nbsp;3 &nbsp;5 &nbsp;9<br>4 &nbsp;&nbsp;&nbsp;| 2 &nbsp;6<br><small style="font-family:sans-serif;color:var(--mut)">Key: 2 | 1 represents 21</small></div>`;
        // 9 values: 21, 24, 28, 30, 33, 35, 39, 42, 46 -> median is 5th = 33, range is 46 - 21 = 25. Sum of median + range = 58
        return grid(`${stem}The stem-and-leaf plot above displays 9 data values. What is the sum of the median and the range of this data set?`, 33 + 25); },
      () => { const a=R(10,20), d=R(3,8); // Dot plot symmetry: 5 dots at a, 8 dots at a+d, 12 dots at a+2d, 8 dots at a+3d, 5 dots at a+4d -> Mean - Median = 0
        return g(`A symmetric dot plot consists of 5 dots at ${a}, 8 dots at ${a+d}, 12 dots at ${a+2*d}, 8 dots at ${a+3*d}, and 5 dots at ${a+4*d}. What is the value of the mean of this data set?`, a + 2*d); },
      () => { const tot=R(4,8)*100; // Box plot quarters: 25% of data lies between Q1 and Median, 50% between Q1 and Q3, 75% above Q1
        return g(`A box plot summarizes the reaction times of ${tot} distinct test subjects, with no two subjects having the exact same reaction time. How many of the subjects had a reaction time between the first quartile (<i>Q</i>₁) and the third quartile (<i>Q</i>₃)?`, tot / 2); },
      () => { const n=5, med=R(20,40), min=R(10,15), max=R(50,70); // 5 distinct positive integers have min, median, max -> what is the greatest possible mean? a1=min, a2=med-1, a3=med, a4=max-1, a5=max
        const sumMax = min + (med - 1) + med + (max - 1) + max;
        return g(`A data set consists of 5 <b>distinct</b> integers with a minimum of 10, a median of 20, and a maximum of 40. What is the greatest possible sum of the 5 integers?`, 10 + 19 + 20 + 39 + 40); },
      () => { const m=R(50,80), s=R(4,10); const z=R(2,3); return grid(`On a standardized aptitude test, scores are normally distributed with a mean of ${m} and a standard deviation of ${s}. A student's <i>z</i>-score is defined as <f>score - mean/standard deviation</f>. What test score corresponds to a <i>z</i>-score of ${z}.5?`, m + 2.5*s); },
      () => { const a=R(15,30), b=a+R(5,10), c=b+R(5,10); // Set {a, a, b, c, c} -> if we increase both c's by 5, median stays b, mean increases by 2
        const inc=R(2,6)*5; return g(`Consider the 5-number data set: ${a}, ${a+2}, ${b}, ${c}, ${c+4}. If the two largest numbers in the data set are each increased by ${inc}, by how much does the mean of the 5-number data set increase?`, (2*inc)/5); },
      () => { const f1=3, f2=7, f3=6, f4=4; // Total = 20. Relative frequency of f3 is 6/20 = 30%
        return g(`In a frequency distribution of 20 water samples, 3 samples had pH 6.5, 7 samples had pH 7.0, 6 samples had pH 7.5, and 4 samples had pH 8.0. What is the median pH of the 20 water samples?`, 7.25); },
      () => { const r=R(20,50), k=R(3,8); // Range of x is r. What is the range of y = k*x - 15? -> k*r
        return g(`A data set of 50 temperature readings has a range of ${r}. If each reading <i>x</i> is converted using the formula <i>y</i> = ${k}<i>x</i> - 19, what is the range of the converted <i>y</i>-values?`, k * r); },
      () => { const m1=R(20,40), m2=m1+R(10,20); // Equal group sizes: mean of medians vs combined mean
        const n=R(10,25), d=R(4,12); return grid(`Data Set A and Data Set B each contain ${n} integers. Every integer in Data Set B is obtained by multiplying the corresponding integer in Data Set A by 3 and subtracting ${d}. If the median of Data Set A is ${m1}, what is the median of Data Set B?`, 3*m1 - d); },
      () => { const sum4 = R(280,340), targetMean = R(75,85); const x = 6*targetMean - sum4; // sum of 5 and 6th
        const s5 = R(350,420), m6 = R(75,85); return g(`The sum of the first 5 measurements in an experiment is ${s5}. What must the 6th measurement be so that the mean of all 6 measurements is ${m6}?`, 6*m6 - s5); }
    ],
    // === Topic 12: Two-variable data and scatterplots ===
    [
      () => { const a=R(2,4), b=R(3,8), c=R(10,25); const y1=a*1+b*1+c, y2=a*4+b*2+c, y3=a*9+b*3+c, y5=a*25+b*5+c; return g(`A quadratic regression model <i>y</i> = <i>ax</i>² + <i>bx</i> + <i>c</i> fits the data points (1, ${y1}), (2, ${y2}), and (3, ${y3}) exactly. Using this model (or quadratic regression in Desmos), what is the predicted value of <i>y</i> when <i>x</i> = 5?`, String(y5), [String(y5), String(a*16+b*4+c), String(y3 + 2*(y3-y2)), String(y5 - b)]); },
      () => { const m=R(4,12); return g(`In the model y = ${m}x + 25, what does the coefficient ${m} represent?`, "The predicted increase in y for each 1 unit increase in x", ["The predicted increase in y for each 1 unit increase in x", "The y-intercept", "The correlation coefficient", "The residual error"]); },
      () => { const m=R(3,7), b=R(12,28), x0=R(4,9), res=R(5,14)*(Math.random()<0.5?1:-1); const pred=m*x0+b, obs=pred+res; return g(`For a bivariate dataset, the line of best fit is <i>ŷ</i> = ${m}<i>x</i> + ${b}. At <i>x</i> = ${x0}, the residual (observed minus predicted) is ${res}. What is the actual observed value of <i>y</i> at <i>x</i> = ${x0}?`, String(obs), [String(obs), String(pred - res), String(pred), String(obs + b)]); },
      () => { const b=R(25,85); return g(`In the regression equation y = 4.5x + ${b}, what does ${b} represent?`, "The predicted value of y when x is 0", ["The predicted value of y when x is 0", "The slope of the trend line", "The maximum possible value", "The margin of error"]); },
      () => { const a=R(40,90,10), r=getEl([1.5, 2, 2.5]); const y2 = a*r*r, y4 = a*Math.pow(r,4); return g(`An exponential curve of best fit <i>y</i> = <i>a</i> · <i>b</i><sup><i>x</i></sup> passes through (0, ${a}) and (2, ${y2}) on a scatterplot. What residual is associated with an observed data point at (4, ${y4 + 18})?`, "18", ["18", "-18", String(y4), "9"]); },
      () => { return g(`A scatterplot shows points tightly clustering along a line that goes down from left to right. What kind of correlation is this?`, "Strong negative", ["Strong negative", "Strong positive", "Zero correlation", "Undefined"]); },
      () => { const m=R(4,9), b=R(15,35), dx=R(3,7); return g(`In a linear regression model <i>ŷ</i> = ${m}<i>x</i> + ${b}, if <i>x</i> is measured in hours and <i>ŷ</i> is measured in kilometers, what is the predicted difference in <i>ŷ</i> between two observations whose <i>x</i>-values differ by ${dx} hours and 30 minutes?`, String(m*(dx + 0.5)), [String(m*(dx + 0.5)), String(m*dx + b), String(m*dx), String(m*(dx + 0.3))]); },
      // 8. SVG Scatterplot + Line of Best Fit: сколько точек лежат ВЫШЕ линии наилучшего соответствия (Actual > Predicted)
      () => {
        // Line y = x (from -8,-8 to 8,8). Let's plot 7 points: some above, some below
        const pts = [[-6, -3], [-4, -6], [-2, 2], [0, -3], [2, 5], [4, 1], [6, 8]]; // Above (y > x): (-6,-3), (-2,2), (2,5), (6,8) -> 4 points!
        const circles = pts.map(([px, py]) => `<circle cx="${tX(px)}" cy="${tY(py)}" r="4" fill="#0f2b4a"/>`).join('');
        const graph = svg(`<line x1="${tX(-9)}" y1="${tY(-9)}" x2="${tX(9)}" y2="${tY(9)}" stroke="#22a381" stroke-width="2.5"/>${circles}`);
        return g(`${graph}The scatterplot above shows 7 data points along with a line of best fit. For how many of the 7 data points is the actual <i>y</i>-value greater than the <i>y</i>-value predicted by the line of best fit?`, 4);
      },
      // 9. SVG Scatterplot: найти наибольшую положительную невязку (vertical distance above the line)
      () => {
        const jump = R(3, 6);
        // Line y = 0.5x + 1 -> from (-8, -3) to (8, 5). Point at x = 2 has predicted y = 2, actual y = 2 + jump
        const pts = [[-6, -2], [-4, -2], [-2, 1], [0, 0], [2, 2 + jump], [4, 2], [6, 4]];
        const circles = pts.map(([px, py]) => `<circle cx="${tX(px)}" cy="${tY(py)}" r="4" fill="#e74c3c"/>`).join('');
        const graph = svg(`<line x1="${tX(-8)}" y1="${tY(-3)}" x2="${tX(8)}" y2="${tY(5)}" stroke="#2b7f9c" stroke-width="2.5"/>${circles}`);
        return g(`${graph}The scatterplot above shows a data set and its line of best fit in the <i>xy</i>-plane, where each grid line represents 1 unit. What is the vertical distance (residual) for the data point at <i>x</i> = 2?`, jump);
      },
      // 10. Обратная задача на Residual: дана модель y = mx + b и residual при x = x0, найти реальное (observed) значение y
      () => {
        const m = R(3, 7), b = R(10, 25), x0 = R(4, 10), res = R(-8, 9, 0);
        const pred = m * x0 + b, actual = pred + res;
        return g(`A line of best fit has the equation <i>y</i> = ${m}<i>x</i> + ${b}. For a data point with <i>x</i> = ${x0}, the residual (observed minus predicted) is ${res}. What is the actual observed <i>y</i>-value for this data point?`, actual);
      },
      // 11. Отрицательный Residual: точка лежит ниже линии тренда
      () => {
        const m = R(2, 6), b = R(15, 35), x0 = R(3, 8), diff = R(4, 12);
        const pred = m * x0 + b, obs = pred - diff;
        return grid(`For a certain scatterplot, the line of best fit is <i>y</i> = ${m}<i>x</i> + ${b}. One data point in the scatterplot has coordinates (${x0}, ${obs}). What is the residual for this data point? (Note: Residual = Observed - Predicted)`, -diff);
      },
      // 12. Нахождение x, при котором предсказанное значение равно заданному числу (Solving for x from line of best fit)
      () => {
        const m = R(4, 9), b = R(12, 30), xTarget = R(6, 15);
        const yTarget = m * xTarget + b;
        return g(`A researcher uses the linear model <i>y</i> = ${m}<i>x</i> + ${b} to predict a plant's height <i>y</i>, in centimeters, after <i>x</i> weeks of growth. According to the model, after how many weeks is the plant predicted to reach a height of ${yTarget} centimeters?`, xTarget);
      },
      // 13. Оценка уравнения Line of Best Fit по двум точкам, лежащим на линии тренда
      () => {
        const m = R(2, 5), b = R(10, 30), x1 = 2, x2 = 6;
        const y1 = m * x1 + b, y2 = m * x2 + b;
        const ans = `<i>y</i> = ${m}<i>x</i> + ${b}`;
        return g(`A line of best fit for a scatterplot passes through the points (${x1}, ${y1}) and (${x2}, ${y2}). Which of the following equations represents this line of best fit?`, ans, [
          ans,
          `<i>y</i> = ${m}<i>x</i> + ${y1}`,
          `<i>y</i> = ${b}<i>x</i> + ${m}`,
          `<i>y</i> = ${m + 2}<i>x</i> + ${b - 4}`
        ]);
      },
      // 14. Интерпретация отрицательного наклона (Negative slope in context)
      () => {
        const m = (R(15, 45) / 10).toFixed(1), b = R(70, 95);
        const ans = `A predicted decrease of ${m} degrees Fahrenheit for each 1,000-foot increase in elevation`;
        return g(`The equation <i>T</i> = ${b} - ${m}<i>h</i> models the predicted temperature <i>T</i>, in degrees Fahrenheit, at an elevation of <i>h</i> thousand feet above sea level. What does the number ${m} represent in this model?`, ans, [
          ans,
          `The predicted temperature at sea level (<i>h</i> = 0)`,
          `A predicted increase of ${m} thousand feet for each 1-degree decrease in temperature`,
          `The minimum possible temperature at the mountain peak`
        ]);
      },
      // 15. Экспоненциальная кривая наилучшего соответствия (Exponential curve of best fit)
      () => {
        const a = R(10, 30), r = getEl([2, 3]), x = R(2, 4);
        const pred = a * Math.pow(r, x);
        return g(`A scatterplot of bacterial growth is modeled by the exponential curve of best fit <i>y</i> = ${a}(${r})<sup><i>x</i></sup>, where <i>x</i> is time in hours and <i>y</i> is the number of bacteria in thousands. What is the predicted number of bacteria, in thousands, at <i>x</i> = ${x} hours?`, pred);
      },
      // 16. Квадратичная кривая наилучшего соответствия (Quadratic curve of best fit): вершина/максимум
      () => {
        const a = R(2, 5), h = R(4, 9), k = R(50, 120);
        return g(`A company models its monthly profit <i>P</i>, in thousands of dollars, as a function of the item price <i>x</i>, in dollars, using the quadratic curve of best fit <i>P</i>(<i>x</i>) = -${a}(<i>x</i> - ${h})² + ${k}. According to the model, what item price <i>x</i>, in dollars, yields the maximum predicted monthly profit?`, h);
      },
      // 17. Коэффициент корреляции Пирсона r: выбор наиболее подходящего значения
      () => {
        const ans = "-0.92";
        return g(`A scatterplot shows a strong, linear, negative association between two variables <i>x</i> and <i>y</i>. Which of the following is the most plausible value for the correlation coefficient <i>r</i> of this data set?`, ans, [
          ans,
          "0.92",
          "-0.14",
          "-1.85"
        ]);
      },
      // 18. HTML Two-Way Table: найти пропущенное значение на пересечении строки и столбца
      () => {
        const a1 = R(15, 30), a2 = R(20, 35), row1 = a1 + a2;
        const b1 = R(18, 32), b2 = R(12, 28), row2 = b1 + b2;
        const col1 = a1 + b1, col2 = a2 + b2, grand = row1 + row2;
        const tbl = `<table style="margin:12px auto;border-collapse:collapse;text-align:center;width:280px;border:1px solid var(--line)"><tr style="background:var(--panel2)"><th style="padding:6px;border:1px solid var(--line)"></th><th style="padding:6px;border:1px solid var(--line)">Gas</th><th style="padding:6px;border:1px solid var(--line)">Electric</th><th style="padding:6px;border:1px solid var(--line)">Total</th></tr><tr><td style="padding:4px 8px;border:1px solid var(--line)">Sedan</td><td style="padding:4px 8px;border:1px solid var(--line)">${a1}</td><td style="padding:4px 8px;border:1px solid var(--line)"><i>k</i></td><td style="padding:4px 8px;border:1px solid var(--line)">${row1}</td></tr><tr><td style="padding:4px 8px;border:1px solid var(--line)">SUV</td><td style="padding:4px 8px;border:1px solid var(--line)">${b1}</td><td style="padding:4px 8px;border:1px solid var(--line)">${b2}</td><td style="padding:4px 8px;border:1px solid var(--line)">${row2}</td></tr><tr style="font-weight:bold"><td style="padding:4px 8px;border:1px solid var(--line)">Total</td><td style="padding:4px 8px;border:1px solid var(--line)">${col1}</td><td style="padding:4px 8px;border:1px solid var(--line)">${col2}</td><td style="padding:4px 8px;border:1px solid var(--line)">${grand}</td></tr></table>`;
        return grid(`${tbl}The two-way table above categorizes ${grand} vehicles at a dealership by body style and engine type. What is the value of <i>k</i>?`, a2);
      },
      // 19. HTML Two-Way Table: относительная частота (процент от конкретного столбца/строки)
      () => {
        const gA = R(12, 28), bA = 40 - gA;
        const gB = R(15, 45), bB = 60 - gB;
        const tbl = `<table style="margin:12px auto;border-collapse:collapse;text-align:center;width:280px;border:1px solid var(--line)"><tr style="background:var(--panel2)"><th style="padding:6px;border:1px solid var(--line)">Course</th><th style="padding:6px;border:1px solid var(--line)">Grade 10</th><th style="padding:6px;border:1px solid var(--line)">Grade 11</th><th style="padding:6px;border:1px solid var(--line)">Total</th></tr><tr><td style="padding:4px 8px;border:1px solid var(--line)">Biology</td><td style="padding:4px 8px;border:1px solid var(--line)">${gA}</td><td style="padding:4px 8px;border:1px solid var(--line)">${gB}</td><td style="padding:4px 8px;border:1px solid var(--line)">${gA+gB}</td></tr><tr><td style="padding:4px 8px;border:1px solid var(--line)">Chemistry</td><td style="padding:4px 8px;border:1px solid var(--line)">${bA}</td><td style="padding:4px 8px;border:1px solid var(--line)">${bB}</td><td style="padding:4px 8px;border:1px solid var(--line)">${bA+bB}</td></tr><tr style="font-weight:bold"><td style="padding:4px 8px;border:1px solid var(--line)">Total</td><td style="padding:4px 8px;border:1px solid var(--line)">40</td><td style="padding:4px 8px;border:1px solid var(--line)">60</td><td style="padding:4px 8px;border:1px solid var(--line)">100</td></tr></table>`;
        return g(`${tbl}Based on the two-way table above, what percentage of the <b>Grade 10</b> students are enrolled in Biology?`, (gA / 40) * 100);
      },
      // 20. Сравнение предсказаний двух разных линейных моделей при одном и том же x
      () => {
        const m1 = R(4, 8), b1 = R(10, 20), m2 = R(2, 3), b2 = R(25, 40), x = R(5, 10);
        const diff = Math.abs((m1 * x + b1) - (m2 * x + b2));
        return g(`Model A predicts a value using <i>y</i> = ${m1}<i>x</i> + ${b1}, and Model B predicts a value using <i>y</i> = ${m2}<i>x</i> + ${b2}. At <i>x</i> = ${x}, what is the positive difference between the value predicted by Model A and the value predicted by Model B?`, diff);
      },
      // 21. Средняя скорость изменения по таблице двумерных данных (Average rate of change from table)
      () => {
        const x1 = 2, x2 = 6, y1 = R(15, 30), rate = R(4, 11), y2 = y1 + rate * (x2 - x1);
        const yMid = y1 + rate * 2 - R(1, 3);
        const tbl = `<table style="margin:12px auto;border-collapse:collapse;text-align:center;width:220px;border:1px solid var(--line)"><tr style="background:var(--panel2)"><th style="padding:6px;border:1px solid var(--line)">Day (<i>t</i>)</th><th style="padding:6px;border:1px solid var(--line)">Mass (g)</th></tr><tr><td style="padding:4px;border:1px solid var(--line)">${x1}</td><td style="padding:4px;border:1px solid var(--line)">${y1}</td></tr><tr><td style="padding:4px;border:1px solid var(--line)">4</td><td style="padding:4px;border:1px solid var(--line)">${yMid}</td></tr><tr><td style="padding:4px;border:1px solid var(--line)">${x2}</td><td style="padding:4px;border:1px solid var(--line)">${y2}</td></tr></table>`;
        return g(`${tbl}The table above shows the mass of a crystal sample measured on different days. What is the average rate of change of the mass, in grams per day, from Day ${x1} to Day ${x2}?`, rate);
      },
      // 22. Линейная vs Экспоненциальная модель по таблице: распознавание типа зависимости
      () => {
        const a = R(3, 7), r = 2;
        const tbl = `<i>x</i> = 1, <i>y</i> = ${a*2}; <i>x</i> = 2, <i>y</i> = ${a*4}; <i>x</i> = 3, <i>y</i> = ${a*8}; <i>x</i> = 4, <i>y</i> = ${a*16}`;
        const ans = "Exponential, because <i>y</i> increases by a constant factor for each 1-unit increase in <i>x</i>";
        return g(`Consider the two-variable data points: (${tbl}). Which type of model best fits this data, and why?`, ans, [
          ans,
          "Linear, because <i>y</i> increases by a constant amount for each 1-unit increase in <i>x</i>",
          "Exponential, because <i>y</i> decreases by a constant percentage for each 1-unit increase in <i>x</i>",
          "Quadratic, because the second differences are zero"
        ]);
      },
      // 23. Отношение в таблице 2x2 при условии одинаковой пропорции (Independence / Equal ratios in two-way table)
      () => {
        const a = R(10, 25), b = a * R(2, 3), mult = R(2, 4);
        const c = a * mult, d = b * mult;
        return grid(`In a two-way table comparing two independent groups (Group 1 and Group 2) across two outcomes (Yes and No), Group 1 has ${a} "Yes" responses and ${b} "No" responses. If Group 2 has the exact same ratio of "Yes" to "No" responses and has ${c} "Yes" responses, how many "No" responses does Group 2 have?`, d);
      },
      // 24. Процент ошибки предсказания (Percent error of prediction relative to predicted or observed value)
      () => {
        const pred = R(4, 10) * 10, pctOver = getEl([10, 20, 25, 30]);
        const obs = pred * (1 + pctOver / 100);
        return g(`A regression model predicted that a store would sell ${pred} units of a product, but the store actually sold ${obs} units. The actual sales exceeded the predicted sales by what percent of the predicted sales?`, pctOver);
      },
      // 25. Свойство графика невязок (Residual Plot): как понять, что линейная модель подходит хорошо?
      () => {
        const ans = "The points in the residual plot are randomly scattered above and below the horizontal axis with no clear pattern.";
        return g(`After fitting a linear regression model to a two-variable data set, a statistician creates a residual plot. Which of the following features of the residual plot indicates that the linear model is an appropriate fit for the data?`, ans, [
          ans,
          "The points in the residual plot form a distinct U-shaped parabolic curve.",
          "All points in the residual plot have positive residuals.",
          "The points in the residual plot form a straight line with a positive slope."
        ]);
      },
      // 26. Перевод единиц измерения в уравнении регрессии (Scaling variables in regression)
      () => {
        const m = R(3, 8), b = R(10, 30);
        // y = m*x + b where x is in hours. If t is in minutes (x = t/60), slope with respect to hours -> if x is in days and we change to hours...
        // Let's do: y is in meters, y = mx + b. If we convert y to centimeters (multiply by 100), new y-intercept is 100b
        return g(`A line of best fit <i>y</i> = ${m}<i>x</i> + ${b} predicts the length <i>y</i>, in meters, of a glacier after <i>x</i> years. If the equation is rewritten to predict the length in centimeters (1 meter = 100 centimeters), what will be the new slope of the line of best fit?`, m * 100);
      },
      // 27. Сумма невязок для набора точек относительно заданной линии
      () => {
        const m = 2, b = 5;
        // Points: (1, 8) -> pred 7, res +1; (2, 6) -> pred 9, res -3; (3, 15) -> pred 11, res +4. Sum of residuals = 1 - 3 + 4 = 2
        const r1 = R(2, 6), r2 = -R(1, 5), r3 = R(3, 7);
        const y1 = (m * 1 + b) + r1, y2 = (m * 2 + b) + r2, y3 = (m * 3 + b) + r3;
        return g(`Three data points are given: (1, ${y1}), (2, ${y2}), and (3, ${y3}). Using the linear model <i>y</i> = ${m}<i>x</i> + ${b}, what is the sum of the residuals (observed minus predicted) for these three points?`, r1 + r2 + r3);
      },
      // 28. Нахождение точки пересечения двух линий тренда (год, когда два показателя сравняются)
      () => {
        const t = R(4, 12), r1 = R(5, 9), r2 = R(2, 4);
        const b1 = R(20, 40), b2 = b1 + (r1 - r2) * t;
        return grid(`For City A, population growth is modeled by the line of best fit <i>y</i> = ${r1}<i>x</i> + ${b1}, and for City B, it is modeled by <i>y</i> = ${r2}<i>x</i> + ${b2}, where <i>x</i> is the number of years since 2020 and <i>y</i> is the population in thousands. According to these models, how many years after 2020 will the two cities have the same predicted population?`, t);
      },
      // 29. Предсказание по квадратичной таблице данных (Symmetric quadratic table)
      () => {
        const a = R(2, 4), c = R(5, 15);
        // y = a*x^2 + c for x = 0, 1, 2, 3 -> find y at x = 4
        const y0 = c, y1 = a + c, y2 = 4 * a + c, y3 = 9 * a + c, y4 = 16 * a + c;
        return g(`In a physics experiment, the distance <i>d</i>, in meters, traveled by a rolling ball after <i>t</i> seconds is recorded as follows: (0, ${y0}), (1, ${y1}), (2, ${y2}), and (3, ${y3}). Based on this quadratic pattern, what is the predicted distance <i>d</i>, in meters, at <i>t</i> = 4 seconds?`, y4);
      },
      // 30. Точка средних (Centroid (x_bar, y_bar)) всегда лежит на линии наилучшего соответствия (Least-squares regression property)
      () => {
        const meanX = R(5, 12), m = R(3, 7), b = R(8, 25);
        const meanY = m * meanX + b;
        return g(`A least-squares regression line (line of best fit) for a data set has the equation <i>y</i> = ${m}<i>x</i> + <i>b</i>. It is known that the line passes through the point of averages (<i>x̄</i>, <i>ȳ</i>). If the mean of the <i>x</i>-values is ${meanX} and the mean of the <i>y</i>-values is ${meanY}, what is the value of the constant <i>b</i>?`, b);
      },
      () => { const gr=svg(`<line x1="0" y1="100" x2="200" y2="100" stroke="#0f2b4a" stroke-width="2"/>${[[-7,-4],[-5,-1],[-2,3],[0,4],[2,3],[5,-1],[7,-5]].map(([px,py])=>`<circle cx="${tX(px)}" cy="${tY(py)}" r="4" fill="#e74c3c"/>`).join('')}`); return g(`${gr}A researcher fitted a linear regression model to a data set and plotted the residuals (observed minus predicted) against <i>x</i>, as shown in the residual plot above. Based on this residual plot, which conclusion is justified?`, "A nonlinear (quadratic) model would be more appropriate because the residuals follow a clear curved pattern.", ["A nonlinear (quadratic) model would be more appropriate because the residuals follow a clear curved pattern.", "The linear model is an ideal fit because the sum of the residuals is approximately zero.", "There is no association between the two variables.", "The slope of the original linear regression line must be negative."]); },
      () => { const x1=1, y1=12, x2=4, y2=96; // Exponential table: y = a * b^x -> y2/y1 = b^3 = 8 -> b = 2, a = 6 -> y(5) = 6 * 32 = 192
        const a=R(2,6), b=getEl([2,3]); const tbl=`<table style="margin:10px auto;border-collapse:collapse;text-align:center;width:230px;border:1px solid var(--line)"><tr style="background:var(--panel2)"><th style="padding:5px;border:1px solid var(--line)"><i>x</i></th><th style="padding:5px;border:1px solid var(--line)"><i>y</i></th></tr><tr><td style="padding:4px;border:1px solid var(--line)">1</td><td style="padding:4px;border:1px solid var(--line)">${a*b}</td></tr><tr><td style="padding:4px;border:1px solid var(--line)">2</td><td style="padding:4px;border:1px solid var(--line)">${a*b*b}</td></tr><tr><td style="padding:4px;border:1px solid var(--line)">3</td><td style="padding:4px;border:1px solid var(--line)">${a*b*b*b}</td></tr></table>`;
        return g(`${tbl}The table above shows three data points from an exponential curve of best fit of the form <i>y</i> = <i>a</i>(<i>b</i>)<sup><i>x</i></sup>. What is the predicted value of <i>y</i> when <i>x</i> = 0?`, a); },
      () => { const m=R(3,8), b=R(10,30), x0=R(4,9), obs=m*x0+b - R(5,14); const pred = m*x0 + b;
        return grid(`For a data set, the line of best fit is <i>y</i> = ${m}<i>x</i> + ${b}. At <i>x</i> = ${x0}, the observed data value is ${obs}. What is the absolute value of the residual for this data point?`, pred - obs); },
      () => { const r = -0.88, r2 = Number((r*r).toFixed(4)); // R^2 = 0.80^2 = 0.64 (64%) or -0.90 -> 81%
        const [corr, pct] = getEl([["-0.90", 81], ["-0.80", 64], ["0.70", 49], ["-0.95", 90.25]]);
        return g(`A linear regression between vehicle weight <i>x</i> and fuel efficiency <i>y</i> yields a correlation coefficient of <i>r</i> = ${corr}. The coefficient of determination, <i>r</i>², represents the proportion of variation in <i>y</i> explained by the linear relationship with <i>x</i>. What percentage of the variation in fuel efficiency is explained by vehicle weight?`, pct); },
      () => { const m=R(2,5), b=R(10,25); // Line of best fit in log-linear or transformed scale: log10(y) = 0.5x + 1 -> when x=2, log10(y) = 2 -> y = 100
        const k=R(1,3), x=2; const expVal = k; return g(`To linearize an exponential data set, a scientist plots log₁₀(<i>y</i>) against <i>x</i> and obtains the line of best fit log₁₀(<i>y</i>) = 0.5<i>x</i> + ${k - 1}. Based on this model, what is the predicted value of <i>y</i> when <i>x</i> = 2?`, Math.pow(10, k)); },
      () => { // Two-way table with row & column constraints: find missing joint cell
        const tot=200, row1=120, col1=90, neither=35; // row2 = 80, in row2 & col2 = 35 -> in row2 & col1 = 80 - 35 = 45 -> in row1 & col1 = 90 - 45 = 45
        const r1=R(100,140,10), c1=R(80,110,10), r2c2=R(20,40,5); const r2=200-r1, r2c1=r2-r2c2, r1c1=c1-r2c1;
        return g(`A survey of 200 commuters classified them by whether they use a transit pass and whether they bike to work. In total, ${r1} commuters use a transit pass, and ${c1} commuters bike to work. If ${r2c2} commuters neither use a transit pass nor bike to work, how many commuters both use a transit pass AND bike to work?`, r1c1); },
      () => { const m1=1.5, b1=10; const pts=[[-6,3],[-4,2],[-2,9],[0,8],[2,15],[4,14],[6,21]]; // Line y = 1.5x + 10 -> at x=-6(pred 1, obs 3), x=-4(pred 4, obs 2), x=-2(pred 7, obs 9), x=0(pred 10, obs 8), x=2(pred 13, obs 15), x=4(pred 16, obs 14), x=6(pred 19, obs 21)
        const x0=R(2,6), pred=3*x0+10, res1=R(3,8), res2=-R(2,7);
        return grid(`In a scatterplot, two data points have the same <i>x</i>-coordinate of <i>x</i> = ${x0}. The first point has a residual of +${res1} and the second point has a residual of ${res2} with respect to the line of best fit. What is the vertical distance between these two data points?`, res1 - res2); },
      () => { const m=R(4,9), b=R(15,35), dx=R(3,7); return g(`According to a line of best fit <i>y</i> = -${m}<i>x</i> + ${b}, when <i>x</i> increases by ${dx} units, the predicted value of <i>y</i> decreases by how many units?`, m * dx); },
      () => { const xBar=R(6,14), yBar=R(30,60), x1=xBar+R(2,5), m=R(3,7); const y1 = yBar + m*(x1 - xBar);
        return g(`For a bivariate data set, the mean of <i>x</i> is ${xBar} and the mean of <i>y</i> is ${yBar}. The least-squares regression line passes through the centroid (${xBar}, ${yBar}) and also passes through the point (${x1}, ${y1}). What is the slope of the least-squares regression line?`, m); },
      () => { // Simpson's Paradox / Aggregated vs Stratified Two-Way Table
        const a=18, b=20, c=42, d=60; // Hospital A: 18/20 = 90% mild, 42/60 = 70% severe -> total 60/80 = 75%
        return g(`In a two-way study of 80 patients at Clinic A, 18 out of 20 mild cases recovered and 42 out of 60 severe cases recovered. What was the overall recovery percentage across all 80 patients at Clinic A?`, 75); },
      () => { const a=R(2,5), b=R(3,8), c=R(10,25); // Quadratic regression y = a*x^2 - b*x + c -> residual at x = 3
        const x0=3, pred = a*9 - b*3 + c, obs = pred + R(4,11);
        return grid(`A quadratic curve of best fit is given by <i>y</i> = ${a}<i>x</i>² - ${b}<i>x</i> + ${c}. If an actual data point in the scatterplot is (3, ${obs}), what is the residual (observed minus predicted) for this point?`, obs - pred); },
      () => { const m=R(3,7), b=R(12,30); // Converting x from kilometers to meters (1 km = 1000 m): slope divides by 1000, y-intercept stays b!
        return g(`A regression model <i>y</i> = ${m}<i>x</i> + ${b} predicts the fare <i>y</i>, in dollars, for a ride of distance <i>x</i>, in kilometers. If the variable <i>x</i> is re-expressed in meters (1 kilometer = 1,000 meters), what is the <i>y</i>-intercept of the new regression equation?`, b); },
      () => { // Relative frequency difference between two rows in a two-way table
        const r1a=36, r1tot=60; // 60%
        const r2a=18, r2tot=40; // 45% -> diff = 15 percentage points
        const tbl=`<table style="margin:10px auto;border-collapse:collapse;text-align:center;width:270px;border:1px solid var(--line)"><tr style="background:var(--panel2)"><th style="padding:5px;border:1px solid var(--line)">Region</th><th style="padding:5px;border:1px solid var(--line)">Solar</th><th style="padding:5px;border:1px solid var(--line)">Wind</th><th style="padding:5px;border:1px solid var(--line)">Total</th></tr><tr><td style="padding:5px;border:1px solid var(--line)">South</td><td style="padding:5px;border:1px solid var(--line)">36</td><td style="padding:5px;border:1px solid var(--line)">24</td><td style="padding:5px;border:1px solid var(--line)">60</td></tr><tr><td style="padding:5px;border:1px solid var(--line)">North</td><td style="padding:5px;border:1px solid var(--line)">18</td><td style="padding:5px;border:1px solid var(--line)">22</td><td style="padding:5px;border:1px solid var(--line)">40</td></tr></table>`;
        return g(`${tbl}Based on the table above, the percentage of South projects that are Solar is how many percentage points greater than the percentage of North projects that are Solar?`, 15); },
      () => { const x1=10, y1=80, x2=30, y2=50; // Linear interpolation at x = 20 -> 65
        const a=R(20,40,10), b=a+20, ya=R(40,60), yb=ya+R(20,40,4); const midY=(ya+yb)/2;
        return g(`A line of best fit passes through the points (${a}, ${ya}) and (${b}, ${yb}). What value of <i>y</i> does the line predict when <i>x</i> = ${(a+b)/2}?`, midY); },
      () => { // Outlier leverage effect on slope of line of best fit
        const gr=svg(`${[[-7,-6],[-5,-4],[-3,-2],[-1,0],[1,2],[3,4]].map(([px,py])=>`<circle cx="${tX(px)}" cy="${tY(py)}" r="4" fill="#22a381"/>`).join('')}<circle cx="${tX(7)}" cy="${tY(-7)}" r="5" fill="#e74c3c"/><text x="${tX(7)-12}" y="${tY(-7)-8}" font-size="11" font-weight="bold" fill="#e74c3c">P</text>`);
        return g(`${gr}In the scatterplot above, six points lie near a line with positive slope, while one high-leverage outlier <i>P</i> lies in the lower-right corner. If point <i>P</i> is removed from the data set, how will the slope of the line of best fit change?`, "The slope of the line of best fit will increase.", ["The slope of the line of best fit will increase.", "The slope of the line of best fit will decrease.", "The slope will remain unchanged, and only the y-intercept will decrease.", "The correlation coefficient r will become closer to 0."]); },
      () => { const m=R(3,8), b=R(10,25); // Sum of residuals of least squares line is always 0! If 4 residuals are +3, -5, +1, +4 (sum = +3), then 5th residual must be -3
        const r1=R(2,6), r2=-R(3,7), r3=R(1,5), r4=R(2,6); const r5 = -(r1+r2+r3+r4);
        return grid(`For any ordinary least-squares regression line, the sum of all residuals is equal to 0. In a data set of 5 points, four of the points have residuals of ${r1}, ${r2}, ${r3}, and ${r4}. What is the residual of the 5th point?`, r5); },
      () => { const a=R(15,35), b=R(20,40), k=R(2,4); // Independence in 2x2 table: a/b = c/d -> d = b*k
        const c = a*k, d = b*k; return g(`In a 2-by-2 contingency table with rows R1 and R2 and columns C1 and C2, row R1 has ${a} observations in C1 and ${b} observations in C2. If the row and column variables are strictly independent (so the ratio of C1 to C2 is identical in both rows) and row R2 has ${c} observations in C1, how many observations does row R2 have in C2?`, d); },
      () => { const p0=R(40,80), r=0.5, h=R(3,6); // Half-life scatterplot model: y = p0*(0.5)^(t/h)
        return g(`A scatterplot of chemical concentration <i>C</i>, in milligrams per liter, versus time <i>t</i>, in hours, is modeled by <i>C</i>(<i>t</i>) = ${p0}(0.5)<sup><i>t</i>/${h}</sup>. What is the predicted concentration at <i>t</i> = ${2*h} hours?`, p0 / 4); },
      () => { const m1=R(3,7), b1=R(40,80), m2=R(2,5), b2=R(10,25); // Total of two linear trends: T(x) = (m1 - m2)x + (b1 + b2)
        const x=R(4,10); return g(`In a county, the number of landline phones (in thousands) is modeled by <i>L</i>(<i>t</i>) = -${m2}<i>t</i> + ${b1}, and the number of fiber-optic lines (in thousands) is modeled by <i>F</i>(<i>t</i>) = ${m1}<i>t</i> + ${b2}, where <i>t</i> is years since 2020. What is the predicted combined total of landline and fiber-optic lines (in thousands) at <i>t</i> = ${x}?`, (m1 - m2)*x + b1 + b2); },
      () => { const x0=R(4,9), m=2.5, b=12; const pred = m*x0 + b;
        return grid(`A line of best fit has slope 2.5 and passes through (0, 12). If a data point (${x0}, <i>y</i>₀) lies exactly on the line of best fit, what is the value of <i>y</i>₀?`, pred); }
    ],
    // === Topic 13: Probability ===
    [
      () => { const r=R(4,8), b=R(5,9); const tot=r+b; const gDiv = (x,y)=>y?gDiv(y,x%y):x; const num = r*(r-1), den = tot*(tot-1), gd = gDiv(num, den); return g(`A quality-control crate contains ${r} defective microchips and ${b} functional microchips. If 2 microchips are selected at random one after the other without replacement, what is the probability that both selected microchips are defective?`, `<f>${num/gd}/${den/gd}</f>`, [`<f>${num/gd}/${den/gd}</f>`, `<f>${r*r}/${tot*tot}</f>`, `<f>${2*r}/${tot}</f>`, `<f>${r*b}/${den}</f>`]); },
      () => { const tp=R(40,70), fp=R(10,25), fn=R(5,15), tn=R(120,200); const totPosTest = tp + fp; return g(`In a clinical screening of ${tp+fp+fn+tn} patients, ${tp+fn} actually have Condition X and ${fp+tn} do not. Among those with Condition X, ${tp} test positive; among those without Condition X, ${fp} test false-positive. Given that a randomly selected patient tests positive, what is the probability that the patient actually has Condition X?`, `<f>${tp}/${totPosTest}</f>`, [`<f>${tp}/${totPosTest}</f>`, `<f>${tp}/${tp+fn}</f>`, `<f>${tp}/${tp+fp+fn+tn}</f>`, `<f>${fp}/${totPosTest}</f>`]); },
      () => { const pA=R(3,6)/10, pB=R(4,7)/10; const union = +(pA + pB - pA*pB).toFixed(2); return g(`Events A and B are independent events in a sample space with P(A) = ${pA} and P(B) = ${pB}. What is the probability that at least one of the two events occurs, P(A ∪ B)?`, String(union), [String(union), String(+(pA + pB).toFixed(2)), String(+(pA * pB).toFixed(2)), String(+(1 - union).toFixed(2))]); },
      () => { const a=R(15,30), b=R(20,35), both=R(6,12), none=R(8,18); const tot = a + b - both + none; return g(`In a group of ${tot} software engineers, ${a} code in Python, ${b} code in Rust, and ${both} code in both languages. If one engineer is selected at random from those who code in at least one of the two languages, what is the probability that the engineer codes in Python ONLY?`, `<f>${a - both}/${a + b - both}</f>`, [`<f>${a - both}/${a + b - both}</f>`, `<f>${a}/${tot}</f>`, `<f>${a - both}/${tot}</f>`, `<f>${both}/${a + b - both}</f>`]); },
      () => { const r=R(4,8), b=R(5,9); const tot=r+b; const gDiv = (x,y)=>y?gDiv(y,x%y):x; const num = r*(r-1), den = tot*(tot-1), gd = gDiv(num, den); return g(`A quality-control crate contains ${r} defective microchips and ${b} functional microchips. If 2 microchips are selected at random one after the other without replacement, what is the probability that both selected microchips are defective?`, `<f>${num/gd}/${den/gd}</f>`, [`<f>${num/gd}/${den/gd}</f>`, `<f>${r*r}/${tot*tot}</f>`, `<f>${2*r}/${tot}</f>`, `<f>${r*b}/${den}</f>`]); },
      () => { const tp=R(40,70), fp=R(10,25), fn=R(5,15), tn=R(120,200); const totPosTest = tp + fp; return g(`In a clinical screening of ${tp+fp+fn+tn} patients, ${tp+fn} actually have Condition X and ${fp+tn} do not. Among those with Condition X, ${tp} test positive; among those without Condition X, ${fp} test false-positive. Given that a randomly selected patient tests positive, what is the probability that the patient actually has Condition X?`, `<f>${tp}/${totPosTest}</f>`, [`<f>${tp}/${totPosTest}</f>`, `<f>${tp}/${tp+fn}</f>`, `<f>${tp}/${tp+fp+fn+tn}</f>`, `<f>${fp}/${totPosTest}</f>`]); },
      // 7. HTML Two-Way Table: Условная вероятность по СТРОКЕ (Given row A, what is the probability of column B?)
      () => {
        const a1 = R(12, 24), a2 = R(16, 26), row1 = a1 + a2;
        const b1 = R(15, 30), b2 = R(10, 25), row2 = b1 + b2;
        const col1 = a1 + b1, col2 = a2 + b2, grand = row1 + row2;
        const tbl = `<table style="margin:12px auto;border-collapse:collapse;text-align:center;width:280px;border:1px solid var(--line)"><tr style="background:var(--panel2)"><th style="padding:6px;border:1px solid var(--line)"></th><th style="padding:6px;border:1px solid var(--line)">Morning</th><th style="padding:6px;border:1px solid var(--line)">Evening</th><th style="padding:6px;border:1px solid var(--line)">Total</th></tr><tr><td style="padding:4px 8px;border:1px solid var(--line)">Cardio</td><td style="padding:4px 8px;border:1px solid var(--line)">${a1}</td><td style="padding:4px 8px;border:1px solid var(--line)">${a2}</td><td style="padding:4px 8px;border:1px solid var(--line)">${row1}</td></tr><tr><td style="padding:4px 8px;border:1px solid var(--line)">Weights</td><td style="padding:4px 8px;border:1px solid var(--line)">${b1}</td><td style="padding:4px 8px;border:1px solid var(--line)">${b2}</td><td style="padding:4px 8px;border:1px solid var(--line)">${row2}</td></tr><tr style="font-weight:bold"><td style="padding:4px 8px;border:1px solid var(--line)">Total</td><td style="padding:4px 8px;border:1px solid var(--line)">${col1}</td><td style="padding:4px 8px;border:1px solid var(--line)">${col2}</td><td style="padding:4px 8px;border:1px solid var(--line)">${grand}</td></tr></table>`;
        const ans = `<f>${a1}/${row1}</f>`;
        return g(`${tbl}The table above summarizes the workout preferences of ${grand} gym members. If a member who prefers <b>Cardio</b> is selected at random, what is the probability that the member prefers working out in the <b>Morning</b>?`, ans, [
          ans,
          `<f>${a1}/${col1}</f>`,
          `<f>${a1}/${grand}</f>`,
          `<f>${row1}/${grand}</f>`
        ]);
      },
      // 8. HTML Two-Way Table: Условная вероятность по СТОЛБЦУ (Given column B, what is the probability of row A?)
      () => {
        const a1 = R(10, 22), a2 = R(14, 28), row1 = a1 + a2;
        const b1 = R(18, 32), b2 = R(12, 24), row2 = b1 + b2;
        const col1 = a1 + b1, col2 = a2 + b2, grand = row1 + row2;
        const tbl = `<table style="margin:12px auto;border-collapse:collapse;text-align:center;width:280px;border:1px solid var(--line)"><tr style="background:var(--panel2)"><th style="padding:6px;border:1px solid var(--line)">Grade</th><th style="padding:6px;border:1px solid var(--line)">French</th><th style="padding:6px;border:1px solid var(--line)">Spanish</th><th style="padding:6px;border:1px solid var(--line)">Total</th></tr><tr><td style="padding:4px 8px;border:1px solid var(--line)">9th Grade</td><td style="padding:4px 8px;border:1px solid var(--line)">${a1}</td><td style="padding:4px 8px;border:1px solid var(--line)">${a2}</td><td style="padding:4px 8px;border:1px solid var(--line)">${row1}</td></tr><tr><td style="padding:4px 8px;border:1px solid var(--line)">10th Grade</td><td style="padding:4px 8px;border:1px solid var(--line)">${b1}</td><td style="padding:4px 8px;border:1px solid var(--line)">${b2}</td><td style="padding:4px 8px;border:1px solid var(--line)">${row2}</td></tr><tr style="font-weight:bold"><td style="padding:4px 8px;border:1px solid var(--line)">Total</td><td style="padding:4px 8px;border:1px solid var(--line)">${col1}</td><td style="padding:4px 8px;border:1px solid var(--line)">${col2}</td><td style="padding:4px 8px;border:1px solid var(--line)">${grand}</td></tr></table>`;
        const ans = `<f>${b2}/${col2}</f>`;
        return g(`${tbl}Based on the table above, if a student taking <b>Spanish</b> is chosen at random, what is the probability that the student is in the <b>10th Grade</b>?`, ans, [
          ans,
          `<f>${b2}/${row2}</f>`,
          `<f>${b2}/${grand}</f>`,
          `<f>${col2}/${grand}</f>`
        ]);
      },
      // 9. HTML Two-Way Table: Объединение категорий ("Either A or B" across rows/columns)
      () => {
        const a1 = 15, a2 = 25, b1 = 20, b2 = 40; // grand = 100
        // Either Row 1 (40) OR Col 1 (35) -> a1 + a2 + b1 = 60
        const tbl = `<table style="margin:12px auto;border-collapse:collapse;text-align:center;width:280px;border:1px solid var(--line)"><tr style="background:var(--panel2)"><th style="padding:6px;border:1px solid var(--line)"></th><th style="padding:6px;border:1px solid var(--line)">Laptop</th><th style="padding:6px;border:1px solid var(--line)">Tablet</th><th style="padding:6px;border:1px solid var(--line)">Total</th></tr><tr><td style="padding:4px 8px;border:1px solid var(--line)">Undergraduate</td><td style="padding:4px 8px;border:1px solid var(--line)">${a1}</td><td style="padding:4px 8px;border:1px solid var(--line)">${a2}</td><td style="padding:4px 8px;border:1px solid var(--line)">40</td></tr><tr><td style="padding:4px 8px;border:1px solid var(--line)">Graduate</td><td style="padding:4px 8px;border:1px solid var(--line)">${b1}</td><td style="padding:4px 8px;border:1px solid var(--line)">${b2}</td><td style="padding:4px 8px;border:1px solid var(--line)">60</td></tr><tr style="font-weight:bold"><td style="padding:4px 8px;border:1px solid var(--line)">Total</td><td style="padding:4px 8px;border:1px solid var(--line)">35</td><td style="padding:4px 8px;border:1px solid var(--line)">65</td><td style="padding:4px 8px;border:1px solid var(--line)">100</td></tr></table>`;
        return g(`${tbl}The table above shows the primary device used by 100 university students. If one of these 100 students is selected at random, what is the probability (expressed as a decimal) that the student is either an <b>Undergraduate</b> or uses a <b>Laptop</b> (or both)?`, (a1 + a2 + b1) / 100);
      },
      // 10. Обратная задача на вероятность (Reverse probability): сколько шаров нужно ДОБАВИТЬ, чтобы вероятность стала равна p/q
      () => {
        const gCount = R(6, 15), rCount = R(10, 24, 2);
        // Target probability of green = 1/2 -> need green to equal red! So add (rCount - gCount)
        const red = gCount + R(4, 14);
        const added = red - gCount;
        return g(`A jar contains ${gCount} green tokens and ${red} red tokens. How many additional green tokens must be added to the jar so that the probability of randomly drawing a green token is <f>1/2</f>?`, added);
      },
      // 11. Усложненная обратная задача с параметром: вероятность = 2/3 или 3/4
      () => {
        const blue = R(4, 10), targetMult = R(2, 3);
        // Want P(red) = targetMult / (targetMult + 1) -> red = blue * targetMult
        const curRed = R(2, blue), neededRed = blue * targetMult - curRed;
        const ansNum = targetMult, ansDen = targetMult + 1;
        return g(`A box contains ${blue} white balls and ${curRed} black balls. How many more black balls must be added to the box so that the probability of randomly selecting a black ball is <f>${ansNum}/${ansDen}</f>?`, neededRed);
      },
      // 12. Вытягивание БЕЗ возвращения (Drawing without replacement — классика Module 2)
      () => {
        const gold = R(3, 6), silver = 10 - gold; // total = 10, then 9 (total denominator = 90)
        const num = gold * (gold - 1), den = 90;
        const gVal = (a, b) => b === 0 ? a : gVal(b, a % b);
        const d = gVal(num, den);
        const ans = `<f>${num/d}/${den/d}</f>`;
        return g(`A pouch contains ${gold} gold coins and ${silver} silver coins. If two coins are drawn at random one after the other <b>without replacement</b>, what is the probability that both coins drawn are gold?`, ans, [
          ans,
          `<f>${gold*gold}/100</f>`,
          `<f>${gold}/10</f>`,
          `<f>${2*gold}/19</f>`
        ]);
      },
      // 13. Диаграмма Венна / Пересекающиеся множества: P(A or B) = P(A) + P(B) - P(A and B)
      () => {
        const tot = 100, nA = R(35, 55), nB = R(30, 50), both = R(10, 20);
        const either = nA + nB - both;
        return grid(`In a group of ${tot} tourists, ${nA} speak German, ${nB} speak Italian, and ${both} speak both German and Italian. If a tourist is selected at random from the group, what is the probability (as a decimal) that the tourist speaks German or Italian (or both)?`, either / 100);
      },
      // 14. Пересекающиеся множества: вероятность "Ни А, ни Б" (Neither A nor B)
      () => {
        const tot = 50, nA = R(18, 25), nB = R(15, 22), both = R(5, 10);
        const neither = tot - (nA + nB - both);
        return g(`Among ${tot} high school seniors, ${nA} are in the band, ${nB} are in the choir, and ${both} are in both the band and the choir. If one senior is chosen at random, what is the probability (as a decimal) that the student is in <b>neither</b> the band nor the choir?`, neither / tot);
      },
      // 15. Независимые события в серии: P(A and B) = P(A) * P(B)
      () => {
        const p1 = getEl([0.2, 0.3, 0.4, 0.5]), p2 = getEl([0.4, 0.5, 0.6, 0.8]);
        const ans = Number((p1 * p2).toFixed(2));
        return g(`The probability that it rains on Saturday is ${p1}, and the probability that it rains on Sunday is ${p2}. Assuming the weather on the two days is independent, what is the probability that it rains on both Saturday and Sunday?`, ans);
      },
      // 16. Ловушка "At least one" (Хотя бы один успех = 1 - P(ни одного))
      () => {
        const pFail = getEl([0.2, 0.3, 0.4, 0.5]);
        const pSuccess = Number((1 - pFail).toFixed(1));
        const atLeastOne = Number((1 - pFail * pFail).toFixed(2));
        return g(`A basketball player has a probability of ${pSuccess} of making any given free throw. If the player takes 2 independent free throws, what is the probability that the player makes <b>at least one</b> of the two shots?`, atLeastOne);
      },
      // 17. SVG Геометрическая вероятность: квадрат внутри большего квадрата (Target area probability)
      () => {
        const bigS = 10, smallS = getEl([4, 5, 6, 8]);
        const prob = (smallS * smallS) / (bigS * bigS);
        const offset = (100 - smallS * 10) / 2 + 20;
        const geoSvg = `<svg viewBox="0 0 140 140" style="width:130px;height:130px;display:block;margin:0 auto 12px"><rect x="20" y="20" width="100" height="100" fill="#f1f5f9" stroke="#0f2b4a" stroke-width="2"/><rect x="${offset}" y="${offset}" width="${smallS*10}" height="${smallS*10}" fill="#22a381" fill-opacity="0.35" stroke="#22a381" stroke-width="2"/><text x="70" y="135" font-size="11" text-anchor="middle" fill="#0f2b4a">Side = ${bigS}</text></svg>`;
        return grid(`${geoSvg}A square dartboard has a side length of ${bigS} inches, and a shaded inner square has a side length of ${smallS} inches, as shown above. If a dart hits a random point on the board, what is the probability (as a decimal) that it lands inside the shaded square?`, prob);
      },
      // 18. Геометрическая вероятность на числовом отрезке (Number line segment probability)
      () => {
        const A = 0, D = R(12, 24, 4), lenBC = D / 4;
        const B = R(2, D - lenBC - 2), C = B + lenBC;
        return g(`Points <i>A</i>, <i>B</i>, <i>C</i>, and <i>D</i> lie on a number line at coordinates ${A}, ${B}, ${C}, and ${D}, respectively. If a point is chosen at random on segment <i>AD</i>, what is the probability (as a decimal) that the point lies on segment <i>BC</i>?`, lenBC / D);
      },
      // 19. Ожидаемое количество (Expected value / Expected count in repeated trials)
      () => {
        const pNum = R(2, 5), pDen = 8, trials = R(10, 30) * 8;
        const expected = (pNum / pDen) * trials;
        return g(`A spinner has a probability of <f>${pNum}/${pDen}</f> of landing on the yellow sector on any given spin. If the spinner is spun ${trials} times, what is the expected number of times it will land on the yellow sector?`, expected);
      },
      // 20. Четыре несовместных исхода в таблице вероятностей: найти пропущенную вероятность
      () => {
        const p1 = 0.15, p2 = 0.25, p3 = R(2, 4) / 10;
        const p4 = Number((1 - (p1 + p2 + p3)).toFixed(2));
        const tbl = `<table style="margin:12px auto;border-collapse:collapse;text-align:center;width:240px;border:1px solid var(--line)"><tr style="background:var(--panel2)"><th style="padding:6px;border:1px solid var(--line)">Outcome</th><th style="padding:6px;border:1px solid var(--line)">Probability</th></tr><tr><td style="padding:4px;border:1px solid var(--line)">A</td><td style="padding:4px;border:1px solid var(--line)">${p1}</td></tr><tr><td style="padding:4px;border:1px solid var(--line)">B</td><td style="padding:4px;border:1px solid var(--line)">${p2}</td></tr><tr><td style="padding:4px;border:1px solid var(--line)">C</td><td style="padding:4px;border:1px solid var(--line)">${p3}</td></tr><tr><td style="padding:4px;border:1px solid var(--line)">D</td><td style="padding:4px;border:1px solid var(--line)"><i>k</i></td></tr></table>`;
        return g(`${tbl}The table above gives the probability distribution for a random experiment with four mutually exclusive outcomes (A, B, C, and D). What is the value of <i>k</i>?`, p4);
      },
      // 21. Делимость и кратность при случайном выборе числа от 1 до N
      () => {
        const n = getEl([20, 25, 40, 50]), div = getEl([3, 4, 6, 7]);
        const count = Math.floor(n / div);
        return grid(`An integer is chosen at random from the integers 1 to ${n}, inclusive. What is the probability (expressed as a decimal) that the chosen integer is a multiple of ${div}?`, count / n);
      },
      // 22. Вероятность кратности A ИЛИ B на диапазоне 1..20
      () => {
        // From 1 to 20: multiples of 4 (4,8,12,16,20 -> 5) or multiples of 5 (5,10,15,20 -> 4). Overlap is 20 (1). Total = 5 + 4 - 1 = 8. Prob = 8/20 = 0.4
        return g(`If an integer is selected at random from 1 to 20, inclusive, what is the probability (as a decimal) that the selected integer is a multiple of 4 or a multiple of 5?`, 0.4);
      },
      // 23. Условная вероятность в медицине/контроле качества (False positive / True positive table vibe)
      () => {
        const tot = 200, def = 20, good = 180;
        const defDetected = 18, goodFlagged = 6; // Total flagged = 24. Given flagged, prob it is actually defective = 18/24 = 0.75
        return g(`In a batch of ${tot} batteries, ${def} are defective and ${good} are working properly. An automated scanner flags ${defDetected} of the defective batteries and mistakenly flags ${goodFlagged} of the working batteries. If a battery is chosen at random from those <b>flagged by the scanner</b>, what is the probability (as a decimal) that it is actually defective?`, 0.75);
      },
      // 24. Сумма цифр или бросок двух кубиков (Rolling two 6-sided dice)
      () => {
        const targets = [
          { sum: 7, ways: 6, ans: "<f>1/6</f>" },
          { sum: 6, ways: 5, ans: "<f>5/36</f>" },
          { sum: 8, ways: 5, ans: "<f>5/36</f>" },
          { sum: 9, ways: 4, ans: "<f>1/9</f>" },
          { sum: 11, ways: 2, ans: "<f>1/18</f>" }
        ];
        const t = getEl(targets);
        return g(`Two fair 6-sided dice, each numbered 1 through 6, are rolled simultaneously. What is the probability that the sum of the two numbers rolled is equal to ${t.sum}?`, t.ans, [
          t.ans,
          `<f>1/12</f>`,
          `<f>${t.sum}/36</f>`,
          `<f>1/36</f>`
        ]);
      },
      // 25. Нахождение количества элементов по известной вероятности и общему числу
      () => {
        const total = R(12, 30) * 5, pNum = R(1, 4), pDen = 5;
        const red = (total * pNum) / pDen, blue = total - red;
        return g(`A box contains a total of ${total} pens, all of which are either red or blue. If the probability of randomly selecting a red pen is <f>${pNum}/${pDen}</f>, how many <b>blue</b> pens are in the box?`, blue);
      },
      // 26. Условная вероятность при отбрасывании категории (Selecting from remaining items)
      () => {
        const r = R(8, 15), b = R(10, 20), gCount = R(12, 25);
        // Given it is NOT green, what is the prob it is red? -> r / (r + b)
        const ans = `<f>${r}/${r + b}</f>`;
        return g(`A basket contains ${r} red apples, ${b} yellow apples, and ${gCount} green apples. An apple is chosen at random from the basket. Given that the chosen apple is <b>not green</b>, what is the probability that it is red?`, ans, [
          ans,
          `<f>${r}/${r + b + gCount}</f>`,
          `<f>${r}/${gCount}</f>`,
          `<f>${r + b}/${r + b + gCount}</f>`
        ]);
      },
      // 27. Дерево вероятностей (Two-stage conditional probability)
      () => {
        // Bag A (chosen with prob 0.5) has 30% red; Bag B (chosen with prob 0.5) has 70% red
        const p1 = R(1, 4) * 10, p2 = R(5, 9) * 10;
        const overall = (0.5 * (p1 / 100) + 0.5 * (p2 / 100)).toFixed(2);
        return grid(`Box A contains ${p1}% defective bolts, and Box B contains ${p2}% defective bolts. A worker chooses one of the two boxes at random (with equal probability) and then selects one bolt at random from that box. What is the probability (as a decimal) that the selected bolt is defective?`, Number(overall));
      },
      // 28. Вытягивание без возвращения: вероятность РАЗНЫХ цветов за 2 шага
      () => {
        // 3 red, 2 blue (total 5). P(1st red, 2nd blue) = (3/5)*(2/4) = 6/20 = 0.3. P(different colors in 2 draws) = 2 * 0.3 = 0.6
        return g(`A bag contains 3 red marbles and 2 blue marbles. Two marbles are drawn at random without replacement. What is the probability (as a decimal) that the two marbles drawn are of <b>different</b> colors?`, 0.6);
      },
      // 29. Связь отношения шансов (Ratio of A to B) и вероятности P(A)
      () => {
        const a = R(2, 7), b = 10 - a;
        return g(`In a raffle jar, the ratio of winning tickets to losing tickets is ${a} to ${b}. If one ticket is drawn at random, what is the probability (as a decimal) that it is a winning ticket?`, a / 10);
      },
      // 30. Пропущенная ячейка в таблице 2x2 по известной условной вероятности
      () => {
        const rowTot = R(4, 9) * 10, pct = getEl([20, 30, 40, 50, 60, 70, 80]);
        const cell = (rowTot * pct) / 100;
        return g(`In a survey table of voters, there are ${rowTot} independent voters in total. If the probability that a randomly selected independent voter supports Proposition X is ${pct / 100}, how many independent voters in the survey support Proposition X?`, cell);
      },
      () => { // Conditional probability across 3x3 table restricting to union of two rows
        const a1=16, a2=14, b1=19, b2=21, c1=10, c2=20;
        const tbl=`<table style="margin:10px auto;border-collapse:collapse;text-align:center;width:270px;border:1px solid var(--line)"><tr style="background:var(--panel2)"><th style="padding:5px;border:1px solid var(--line)">Shift</th><th style="padding:5px;border:1px solid var(--line)">Full-Time</th><th style="padding:5px;border:1px solid var(--line)">Part-Time</th><th style="padding:5px;border:1px solid var(--line)">Total</th></tr><tr><td style="padding:4px;border:1px solid var(--line)">Morning</td><td style="padding:4px;border:1px solid var(--line)">${a1}</td><td style="padding:4px;border:1px solid var(--line)">${a2}</td><td style="padding:4px;border:1px solid var(--line)">30</td></tr><tr><td style="padding:4px;border:1px solid var(--line)">Afternoon</td><td style="padding:4px;border:1px solid var(--line)">${b1}</td><td style="padding:4px;border:1px solid var(--line)">${b2}</td><td style="padding:4px;border:1px solid var(--line)">40</td></tr><tr><td style="padding:4px;border:1px solid var(--line)">Night</td><td style="padding:4px;border:1px solid var(--line)">${c1}</td><td style="padding:4px;border:1px solid var(--line)">${c2}</td><td style="padding:4px;border:1px solid var(--line)">30</td></tr></table>`;
        return grid(`${tbl}The table above classifies 100 hospital nurses by shift and employment status. If a nurse is selected at random from those working either the <b>Morning</b> or <b>Afternoon</b> shift, what is the probability (as a decimal) that the selected nurse is <b>Part-Time</b>?`, ((a2 + b2) / 70)); },
      () => { // Geometric probability: circle inscribed in a square, or concentric circles (annulus)
        const rIn=R(2,5), rOut=rIn*2; // Area of inner circle = pi*rIn^2, outer = 4*pi*rIn^2 -> prob of landing in outer ring (annulus) = 3/4 = 0.75!
        const fig = gSvg(160, 150, `<circle cx="80" cy="75" r="56" fill="#d5f2ec" stroke="#0f2b4a" stroke-width="2.5"/><circle cx="80" cy="75" r="28" fill="#ffffff" stroke="#1f9d8a" stroke-width="2"/><text x="80" y="79" font-size="11" font-weight="bold" fill="#0f2b4a" text-anchor="middle">r = ${rIn}</text><text x="80" y="34" font-size="11" font-weight="bold" fill="#1f9d8a" text-anchor="middle">R = ${rOut}</text>`);
        return g(`${fig}A circular target consists of an inner white bullseye of radius ${rIn} inches surrounded by a shaded outer ring with outer radius ${rOut} inches, as shown. If a dart hits a random point on the circular target, what is the probability (as a decimal) that it lands in the <b>shaded outer ring</b>?`, 0.75); },
      () => { // Bayes' theorem / Diagnostic sensitivity & specificity
        // 1000 people: 5% have condition (50 people), 95% do not (950). Test is 90% sensitive (45 true pos) and has 5% false positive rate... let's make denominator 100: 40 true pos + 60 false pos = 100 total pos -> 40/100 = 0.4
        return g(`In a screening of 1,000 patients, 50 patients actually have Condition X and 950 do not. A rapid test correctly identifies 80% of patients who have Condition X (true positives), but also mistakenly gives a positive result for 60 of the patients who do not have Condition X (false positives). If a patient is selected at random from all those who tested <b>positive</b>, what is the probability (as a decimal) that the patient actually has Condition X?`, 0.4); },
      () => { // Drawing 2 without replacement: sum of numbers is even (both odd or both even)
        // Cards 1, 2, 3, 4, 5 (3 odd, 2 even). Total pairs = 5*4 = 20. Both odd = 3*2 = 6; both even = 2*1 = 2 -> total = 8/20 = 0.4
        return g(`Five cards numbered 1, 2, 3, 4, and 5 are placed in a hat. If two cards are drawn at random without replacement, what is the probability (as a decimal) that the sum of the two numbers drawn is an <b>even</b> number?`, 0.4); },
      () => { // 3 independent components in parallel: works if AT LEAST ONE works -> 1 - pFail^3
        const pFail = getEl([0.1, 0.2, 0.5]); const pWork = Number((1 - Math.pow(pFail, 3)).toFixed(3));
        return grid(`A spacecraft navigation system has 3 independent backup computers. Each computer has a probability of ${pFail} of failing during a mission. The navigation system succeeds as long as <b>at least one</b> of the 3 computers does not fail. What is the probability that the navigation system succeeds?`, pWork); },
      () => { // Algebraic missing count in bag: R red, 2R+k blue, prob of red is 1/4 -> R / (3R + k) = 1/4 -> 4R = 3R + k -> R = k
        const k=R(6,18); return g(`A bag contains <i>x</i> red tokens and 2<i>x</i> + ${k} blue tokens. If the probability of randomly selecting a red token from the bag is <f>1/4</f>, what is the value of <i>x</i>?`, k); },
      () => { // Three-set or Two-set conditional probability from Venn diagram: Given A, what is prob of B?
        const onlyA=R(12,24), both=R(8,16), onlyB=R(15,30); const totA = onlyA + both; const g1=gcd(both, totA);
        const fig = gSvg(210, 125, `<circle cx="80" cy="62" r="46" fill="rgba(34,163,129,0.18)" stroke="#22a381" stroke-width="2.2"/><circle cx="130" cy="62" r="46" fill="rgba(43,127,156,0.18)" stroke="#2b7f9c" stroke-width="2.2"/><text x="58" y="66" font-size="13" font-weight="bold" fill="#0f2b4a" text-anchor="middle">${onlyA}</text><text x="105" y="66" font-size="13" font-weight="bold" fill="#e74c3c" text-anchor="middle">${both}</text><text x="152" y="66" font-size="13" font-weight="bold" fill="#0f2b4a" text-anchor="middle">${onlyB}</text><text x="55" y="24" font-size="11" font-weight="bold" fill="#22a381">Club A</text><text x="145" y="24" font-size="11" font-weight="bold" fill="#2b7f9c">Club B</text>`, false);
        return g(`${fig}The Venn diagram above shows the number of students in Club A and Club B. If a student is selected at random from those in <b>Club A</b>, what is the probability that the student is also in Club B?`, `<f>${both/g1}/${totA/g1}</f>`, [`<f>${both/g1}/${totA/g1}</f>`, `<f>${both}/${onlyA+both+onlyB}</f>`, `<f>${both}/${onlyB+both}</f>`, `<f>${onlyA}/${totA}</f>`]); },
      () => { // Expected value of a game / insurance policy
        const win1=100, p1=0.1, win2=20, p2=0.3; // E = 10 + 6 = 16
        const a=R(4,9)*10, b=R(1,3)*10; const ev = a*0.1 + b*0.4;
        return g(`In a carnival game, a player has a 0.10 probability of winning $${a}, a 0.40 probability of winning $${b}, and a 0.50 probability of winning $0. What is the expected value, in dollars, of a single play of this game?`, ev); },
      () => { // Removing items to reach a target probability
        const r=R(10,20), b=R(25,40); // Remove x blue so that r / (r + b - x) = 0.5 -> b - x = r -> x = b - r
        return g(`A crate contains ${r} ripe mangoes and ${b} unripe mangoes. How many <b>unripe</b> mangoes must be removed from the crate so that the probability of randomly selecting a ripe mango from the remaining fruit is 0.5?`, b - r); },
      () => { // Conditional probability in two-way table where one row is given in algebraic ratio
        const k=R(8,20); // Row 1 has k and 3k -> P(Col 1 | Row 1) = 1/4 = 0.25
        return grid(`In a clinical study, the number of patients in Group A who experienced side effects was one-third the number of patients in Group A who did not experience side effects. If a patient is selected at random from Group A, what is the probability (as a decimal) that the patient experienced side effects?`, 0.25); },
      () => { // At least one defective in 2 draws without replacement: 10 items, 2 defective -> 1 - (8/10)*(7/9) = 1 - 56/90 = 34/90 = 17/45
        // Let's use 5 items, 2 defective: 2 draws without replacement -> P(at least 1 def) = 1 - (3/5)*(2/4) = 1 - 6/20 = 0.7!
        return g(`A small box contains 5 transistors, 2 of which are defective and 3 of which are functional. If 2 transistors are selected at random <b>without replacement</b>, what is the probability (as a decimal) that <b>at least one</b> of the selected transistors is defective?`, 0.7); },
      () => { // Probability of picking a perfect square from 1 to N
        const N = getEl([25, 40, 50, 80, 100]); const sqCount = Math.floor(Math.sqrt(N));
        return g(`If an integer is chosen at random from the integers 1 to ${N}, inclusive, what is the probability (as a decimal) that the chosen integer is a perfect square?`, sqCount / N); },
      () => { // Mutually exclusive events with algebraic probabilities: p, 2p, 3p, 0.16 -> 6p = 0.84 -> p = 0.14
        const rem = getEl([0.16, 0.22, 0.28, 0.34]); const p = Number(((1 - rem)/6).toFixed(2));
        return g(`A sample space consists of 4 mutually exclusive outcomes: A, B, C, and D. If <i>P</i>(A) = <i>p</i>, <i>P</i>(B) = 2<i>p</i>, <i>P</i>(C) = 3<i>p</i>, and <i>P</i>(D) = ${rem}, what is the value of <i>P</i>(B)?`, Number((2*p).toFixed(2))); },
      () => { // Independent events A and B: P(A union B) = P(A) + P(B) - P(A)P(B)
        const pA=0.4, pB=0.5; // 0.4 + 0.5 - 0.2 = 0.7
        const [a, b, u] = getEl([[0.4, 0.5, 0.7], [0.2, 0.5, 0.6], [0.3, 0.4, 0.58], [0.5, 0.6, 0.8]]);
        return grid(`Events <i>A</i> and <i>B</i> are independent, with <i>P</i>(<i>A</i>) = ${a} and <i>P</i>(<i>B</i>) = ${b}. What is the probability that at least one of the two events occurs, <i>P</i>(<i>A</i> or <i>B</i>)?`, u); },
      () => { // Two-way table: difference between two conditional probabilities P(A|R1) - P(A|R2)
        const r1a=32, r1=40; // 0.8
        const r2a=15, r2=50; // 0.3 -> diff = 0.5
        return g(`In a study of 90 commuters, 32 of the 40 train commuters arrived on time, while 15 of the 50 bus commuters arrived on time. What is the positive difference between the probability that a randomly selected train commuter arrived on time and the probability that a randomly selected bus commuter arrived on time?`, 0.5); },
      () => { // Rolling a die and flipping a coin: compound probability
        return g(`A fair 6-sided die (numbered 1 to 6) is rolled once and a fair coin is flipped once. What is the probability of rolling a prime number (2, 3, or 5) AND getting heads on the coin?`, `<f>1/4</f>`, [`<f>1/4</f>`, `<f>1/2</f>`, `<f>1/6</f>`, `<f>1/3</f>`]); },
      () => { // Geometric probability: right triangle inside a rectangle
        const w=R(6,12), h=R(4,10); // Triangle with base w/2 and height h has area (1/4)wh -> prob = 0.25
        return g(`A rectangle has length ${w} and width ${h}. A triangle is drawn inside the rectangle such that its base is half the length of the rectangle and its height equals the full width of the rectangle. If a point is chosen at random inside the rectangle, what is the probability (as a decimal) that the point lies inside the triangle?`, 0.25); },
      () => { // Three draws without replacement: all 3 are non-defective
        // 6 items, 4 good, 2 bad -> (4/6)*(3/5)*(2/4) = 24/120 = 0.2
        return g(`A shelf holds 6 milk cartons, of which 4 are fresh and 2 are expired. If a customer selects 3 cartons at random <b>without replacement</b>, what is the probability (as a decimal) that all 3 selected cartons are fresh?`, 0.2); },
      () => { // Finding total N in a 2-way table given conditional probability and cell count
        const cell=R(12,30), p=0.4; const colTot = cell / p;
        return grid(`In a two-way table summarizing student athletes, there are ${cell} varsity swimmers who are seniors. If the probability that a randomly selected varsity swimmer is a senior is 0.4, how many total varsity swimmers are in the table?`, colTot); },
      () => { // Complement of compound event: not both heads in 3 coin tosses = 7/8 = 0.875
        return g(`A fair coin is flipped 3 times. What is the probability (as a decimal) that the coin does <b>not</b> land on heads all 3 times?`, 0.875); }
    ],
    // === Topic 14: Inference from sample statistics and margin of error ===
    [
      () => { const p=R(45,75), e=(R(25,55)/10).toFixed(1); return g(`A poll estimates a candidate's support at ${p}% with a margin of error of ±${e}%. What is the lower bound of the confidence interval?`, (p-parseFloat(e)).toFixed(1)); },
      () => { const N=R(4,9)*10000, p=R(38,62), e=R(2,5); const diff = Math.round(N * (2*e/100)); return g(`A city has ${N.toLocaleString()} registered voters. A random sample of 1,200 registered voters shows that ${p}% favor a transit bond, with an associated margin of error of ±${e}% at the 95% confidence level. What is the difference between the maximum and minimum plausible number of registered voters in the city who favor the bond?`, String(diff), [String(diff), String(diff/2), String(Math.round(N*(p/100))), String(Math.round(N*((p+e)/100)))]); },
      () => { const n=R(800,1500), p=R(40,60); return g(`In a random sample of ${n} voters, ${p}% support a new bill. What is the best point estimate for the population percentage?`, p); },
      () => { return g(`Which sample size is most likely to produce a smaller margin of error, assuming all else is equal?`, "A larger sample", ["A larger sample", "A smaller sample", "Sample size does not affect margin of error", "Cannot be determined"]); },
      () => { const n=R(200,500,50), k=getEl([2,3,4]), e=R(4,8)*k; return g(`A polling institute conducts a random survey of ${n} subscribers and obtains a margin of error of ±${e}%. If the institute wants to reduce the margin of error to ±${e/k}% while keeping the same confidence level, how many subscribers must be randomly sampled? (Recall that margin of error is inversely proportional to √<i>n</i>.)`, String(n * k * k), [String(n * k * k), String(n * k), String(n * 2 * k), String(Math.round(n / k))]); },
      () => { const tot=R(15000,35000,1000), p=R(25,45); return g(`A random sample indicates that ${p}% of residents own a bicycle. If the town's population is ${tot}, what is the expected total number of residents who own a bicycle?`, tot*p/100); },
      // 7. Нахождение верхней границы (Upper bound) доверительного интервала
      () => {
        const p = R(42, 68), e = (R(15, 45) / 10).toFixed(1);
        return grid(`A survey estimates that ${p}% of commuters prefer public transit, with a margin of error of ±${e}%. What is the upper bound of this confidence interval, as a percentage?`, (p + parseFloat(e)).toFixed(1));
      },
      // 8. Нахождение Margin of Error по известным границам доверительного интервала: (upper - lower) / 2
      () => {
        const p = R(40, 70), e = R(3, 8);
        const low = p - e, high = p + e;
        return g(`Based on a random sample, a researcher reports a confidence interval from ${low}% to ${high}% for the proportion of voters supporting a measure. What is the margin of error, in percentage points, for this estimate?`, e);
      },
      // 9. Масштабирование нижней границы на всю популяцию (Minimum plausible number in population)
      () => {
        const pop = R(2, 8) * 1000, p = R(40, 65, 5), e = R(2, 5);
        const minCount = pop * ((p - e) / 100);
        return g(`In a random sample of residents from a town of ${pop} people, ${p}% reported recycling regularly, with a margin of error of ±${e}%. Based on these results, what is the minimum plausible number of residents in the entire town who recycle regularly?`, minCount);
      },
      // 10. Масштабирование верхней границы на всю популяцию (Maximum plausible number in population)
      () => {
        const pop = R(3, 9) * 1000, p = R(30, 60, 5), e = R(3, 6);
        const maxCount = pop * ((p + e) / 100);
        return g(`A quality control inspector tests a random sample of microchips from a production batch of ${pop} microchips and estimates that ${p}% pass a stress test, with a margin of error of ±${e}%. What is the maximum plausible number of microchips in the entire batch that would pass the stress test?`, maxCount);
      },
      // 11. Размах правдоподобных значений в популяции (Difference between max and min plausible counts)
      () => {
        const pop = R(4, 10) * 1000, p = R(45, 65), e = R(2, 5);
        // Diff between (p+e)% and (p-e)% of pop is (2*e)% of pop
        const diff = pop * ((2 * e) / 100);
        return grid(`A poll of a city with ${pop} registered voters estimates that ${p}% favor a new park, with a margin of error of ±${e}%. What is the difference between the maximum and minimum plausible number of registered voters in the city who favor the new park?`, diff);
      },
      // 12. Проверка, попадает ли конкретное число в доверительный интервал (Plausible value check)
      () => {
        const pop = 1000, p = R(50, 65), e = R(3, 5);
        const low = (p - e) * 10, high = (p + e) * 10;
        const valid = R(low + 5, high - 5);
        const ans = String(valid);
        return g(`From a random sample of 100 trees in a forest of 1,000 trees, a botanist estimates that ${p}% are oak trees, with a margin of error of ±${e}%. Which of the following is a plausible value for the total number of oak trees in the entire forest?`, ans, [
          ans,
          String(low - R(25, 60)),
          String(high + R(25, 60)),
          String(e * 10)
        ]);
      },
      // 13. Классическая текстовая интерпретация Margin of Error (Формулировка College Board)
      () => {
        const mean = R(22, 38), me = R(2, 4);
        const low = mean - me, high = mean + me;
        const ans = `It is plausible that the true population mean is between ${low} and ${high} minutes.`;
        return g(`Based on a random sample of employees at a large corporation, the mean commute time is estimated to be ${mean} minutes, with an associated margin of error of ${me} minutes. Which of the following is the best interpretation of this result?`, ans, [
          ans,
          `Every employee at the corporation has a commute time between ${low} and ${high} minutes.`,
          `Exactly ${mean}% of employees have a commute time of ${me} minutes.`,
          `It is impossible for the true population mean to be less than ${low} minutes.`
        ]);
      },
      // 14. Закон квадратного корня для Margin of Error: во сколько раз увеличится выборка, чтобы уменьшить ME в k раз
      () => {
        const n = R(100, 300, 50), k = getEl([2, 3, 4]);
        const newN = n * k * k;
        return g(`A survey of ${n} randomly selected voters yields a margin of error of 6%. To reduce the margin of error to ${6 / k}% (while keeping the confidence level the same), how many voters must be randomly surveyed? (Note: Margin of error is inversely proportional to the square root of the sample size.)`, newN);
      },
      // 15. Обратная задача на квадратный корень: если выборку увеличили в k^2 раз, как изменится ME?
      () => {
        const k = getEl([2, 3, 4]), oldME = k * R(2, 4);
        const newME = oldME / k;
        return g(`Researcher A selects a random sample of <i>n</i> adults and obtains a margin of error of ${oldME}%. Researcher B selects a random sample of ${k * k}<i>n</i> adults from the same population using the same confidence level. What will be Researcher B's margin of error, in percent?`, newME);
      },
      // 16. Ловушка Scope of Inference (На какую популяцию можно обобщать результат?)
      () => {
        const ans = "All 11th-grade students at Lincoln High School";
        return g(`A school counselor selects a random sample of 60 11th-grade students at Lincoln High School and finds that 75% plan to take a summer course. To which of the following populations can the counselor validly generalize this result?`, ans, [
          ans,
          "All students in grades 9 through 12 at Lincoln High School",
          "All 11th-grade students in the entire state",
          "Only the 60 students who were surveyed in the sample"
        ]);
      },
      // 17. Сравнение 4 разных опросов: какой имеет наименьший Margin of Error?
      () => {
        const s1 = R(150, 300, 50), s2 = s1 + 200, s3 = s2 + 300, s4 = s3 + 500;
        const ans = `Poll D (sample size of ${s4})`;
        return g(`Four independent polls were conducted to estimate the proportion of city residents who support a new library, all using a 95% confidence level. Which poll is expected to have the smallest margin of error?`, ans, [
          ans,
          `Poll A (sample size of ${s1})`,
          `Poll B (sample size of ${s2})`,
          `Poll C (sample size of ${s3})`
        ]);
      },
      // 18. Пропорциональный пересчет из выборки в популяцию по абсолютным числам (Sample count to Population count)
      () => {
        const sample = R(40, 80, 10), fav = R(10, sample - 10), mult = R(20, 50, 10);
        const pop = sample * mult, expected = fav * mult;
        return g(`In a random sample of ${sample} subscribers to a streaming service, ${fav} reported watching documentaries every week. If the service has ${pop} total subscribers, what is the best estimate for the total number of subscribers who watch documentaries every week?`, expected);
      },
      // 19. HTML-таблица с категориями в выборке: оценка суммы двух категорий во всей популяции
      () => {
        const cA = R(12, 22), cB = R(15, 25), cC = 50 - cA - cB; // sample = 50
        const mult = R(15, 40, 5), pop = 50 * mult;
        const tbl = `<table style="margin:12px auto;border-collapse:collapse;text-align:center;width:240px;border:1px solid var(--line)"><tr style="background:var(--panel2)"><th style="padding:6px;border:1px solid var(--line)">Genre</th><th style="padding:6px;border:1px solid var(--line)">Students</th></tr><tr><td style="padding:4px;border:1px solid var(--line)">Sci-Fi</td><td style="padding:4px;border:1px solid var(--line)">${cA}</td></tr><tr><td style="padding:4px;border:1px solid var(--line)">Mystery</td><td style="padding:4px;border:1px solid var(--line)">${cB}</td></tr><tr><td style="padding:4px;border:1px solid var(--line)">Biography</td><td style="padding:4px;border:1px solid var(--line)">${cC}</td></tr></table>`;
        return grid(`${tbl}A librarian surveyed a random sample of 50 students about their favorite book genre, as shown in the table above. Based on this sample, out of all ${pop} students in the school, how many are expected to prefer either <b>Sci-Fi</b> or <b>Mystery</b>?`, (cA + cB) * mult);
      },
      // 20. HTML-таблица из нескольких выборок (Multiple random samples): среднее точечных оценок
      () => {
        const s1 = R(18, 26), s2 = s1 + 4, s3 = s1 - 2, s4 = s1 + 6;
        // Mean of the 4 samples = s1 + 2 ( out of 100 per sample, scale to 2000 -> * 20 )
        const avgSample = s1 + 2, mult = R(10, 30, 5), pop = 100 * mult;
        const tbl = `<table style="margin:12px auto;border-collapse:collapse;text-align:center;width:240px;border:1px solid var(--line)"><tr style="background:var(--panel2)"><th style="padding:6px;border:1px solid var(--line)">Sample</th><th style="padding:6px;border:1px solid var(--line)">Defective Items (out of 100)</th></tr><tr><td style="padding:4px;border:1px solid var(--line)">1</td><td style="padding:4px;border:1px solid var(--line)">${s1}</td></tr><tr><td style="padding:4px;border:1px solid var(--line)">2</td><td style="padding:4px;border:1px solid var(--line)">${s2}</td></tr><tr><td style="padding:4px;border:1px solid var(--line)">3</td><td style="padding:4px;border:1px solid var(--line)">${s3}</td></tr><tr><td style="padding:4px;border:1px solid var(--line)">4</td><td style="padding:4px;border:1px solid var(--line)">${s4}</td></tr></table>`;
        return g(`${tbl}Four separate random samples of 100 items each were inspected from a warehouse containing ${pop} items. Using the mean proportion across all four samples, what is the best estimate for the total number of defective items in the warehouse?`, avgSample * mult);
      },
      // 21. Сравнение двух кандидатов с перекрывающимися доверительными интервалами (Too close to call!)
      () => {
        const pA = 51, pB = 49, me = 4;
        const ans = "The poll is inconclusive because the confidence intervals for both candidates overlap.";
        return g(`In a pre-election poll of a two-candidate race, Candidate A receives ${pA}% support and Candidate B receives ${pB}% support, with a margin of error of ±${me}% for each estimate. Which conclusion is best supported by these findings?`, ans, [
          ans,
          "Candidate A is guaranteed to win the election by at least 2%.",
          "Candidate B has no chance of winning the election.",
          "The poll was biased because the margin of error is greater than 2%."
        ]);
      },
      // 22. Доверительный интервал для среднего веса/длины (Confidence interval for population mean -> total weight)
      () => {
        const nBoxes = R(20, 50, 10), meanW = R(30, 50), meW = R(2, 5);
        const maxTotal = nBoxes * (meanW + meW);
        return g(`Based on a random sample, the mean weight of a shipping crate is estimated to be ${meanW} pounds, with a margin of error of ±${meW} pounds. For a shipment of ${nBoxes} crates, what is the maximum plausible total weight, in pounds, based on the upper bound of the mean estimate?`, maxTotal);
      },
      // 23. Смещенная выборка (Sampling bias): почему оценка неверна даже при огромном размере выборки
      () => {
        const ans = "The sample is biased because patrons surveyed at a fitness center are more likely to exercise regularly than the general town population.";
        return g(`To estimate the proportion of residents in a town who exercise at least three times a week, a researcher surveys 1,500 people entering a local fitness center on Monday morning. Why might the resulting estimate be unreliable?`, ans, [
          ans,
          "The sample size of 1,500 is too small to make any valid inference.",
          "The margin of error increases when surveys are conducted on Mondays.",
          "Random sampling requires interviewing every resident in the town."
        ]);
      },
      // 24. Зависимость ширины интервала от уровня доверия (95% vs 99% confidence level)
      () => {
        const ans = "The 99% confidence interval will be wider (have a larger margin of error) than the 95% confidence interval.";
        return g(`Using the exact same random sample data, a statistician constructs both a 95% confidence interval and a 99% confidence interval for a population mean. How do the two intervals compare?`, ans, [
          ans,
          "The 99% confidence interval will be narrower (have a smaller margin of error) than the 95% confidence interval.",
          "Both intervals will have the exact same width, but different midpoints.",
          "The 95% confidence interval is guaranteed to contain 95% of all individual data points."
        ]);
      },
      // 25. Влияние размера генеральной совокупности (Population size N does NOT affect margin of error!)
      () => {
        const ans = "Both polls have approximately the same margin of error because they used the same sample size.";
        return g(`Poll 1 surveys a random sample of 1,000 adults from a city of 100,000 people. Poll 2 surveys a random sample of 1,000 adults from a country of 50,000,000 people. Assuming both polls use a 95% confidence level, how do their margins of error compare?`, ans, [
          ans,
          "Poll 2 has a much larger margin of error because the country's population is 500 times larger.",
          "Poll 1 has a larger margin of error because a larger percentage of the population was sampled.",
          "Neither poll has a margin of error because 1,000 is a round number."
        ]);
      },
      // 26. Оценка количества НЕ поддерживающих (Complement proportion inference)
      () => {
        const sample = 200, yes = R(110, 160, 10), pop = R(4, 12) * 1000;
        const noPct = (sample - yes) / sample;
        const expectedNo = pop * noPct;
        return g(`In a random sample of ${sample} customers at a grocery store, ${yes} stated that they bring reusable bags. If the store serves ${pop} customers in a week, what is the expected number of customers who do <b>not</b> bring reusable bags?`, expectedNo);
      },
      // 27. Нахождение размера популяции по точечной оценке и ожидаемому числу (Reverse inference for N)
      () => {
        const p = getEl([20, 25, 40, 50, 75]), pop = R(12, 40) * 100;
        const expected = pop * (p / 100);
        return grid(`Based on a random sample, a biologist estimates that ${p}% of the fish in a lake are bass. Using this estimate, the biologist calculates that there are ${expected} bass in the lake. What is the estimated total number of fish of all species in the lake?`, pop);
      },
      // 28. Вывод методом захвата-повторного отлова (Mark and recapture / Tagging inference)
      () => { const k=R(5,10), s2=k*R(5,12), t=R(4,9)*10; return g(`To estimate the deer population in a reserve, wildlife biologists captured, tagged, and released ${t} deer. Later, they captured a random sample of ${s2} deer and found that ${k} of them had tags. Based on this ratio, what is the estimated total deer population in the reserve?`, t*s2/k); },
      // 29. Доля элементов вне порога в выборке -> перенос на партию
      () => {
        // List of 8 sample values, count how many are > threshold, scale to 400
        const thresh = 50;
        // Let's make 3 out of 8 values strictly greater than 50
        const vals = [42, 48, 55, 39, 61, 49, 58, 44]; // 55, 61, 58 -> 3 out of 8
        const batch = R(2, 6) * 80;
        const expected = (3 / 8) * batch;
        return g(`A random sample of 8 apples from an orchard crate had the following weights, in grams: 42, 48, 55, 39, 61, 49, 58, and 44. Apples weighing more than ${thresh} grams are classified as "extra-large." Based on this sample, how many apples in a shipment of ${batch} apples are expected to be classified as "extra-large"?`, expected);
      },
      // 30. Интервал в абсолютных числах -> перевод обратно в процент погрешности (Absolute interval to % Margin of Error)
      () => {
        const pop = 2000, p = R(40, 60), e = R(3, 7);
        const lowCount = pop * ((p - e) / 100), highCount = pop * ((p + e) / 100);
        return g(`Based on a random sample of students at a university with ${pop} students, it is estimated that between ${lowCount} and ${highCount} students work a part-time job. What is the margin of error, in percentage points, of the sample percentage estimate?`, e);
      },
      () => { const pop=R(4,9)*1000, p=R(40,65,5), me=R(2,5); const lo=pop*((p-me)/100), hi=pop*((p+me)/100); const mid=pop*(p/100);
        return grid(`Based on a random sample of voters in a district of ${pop} registered voters, a political analyst estimates that between ${lo} and ${hi} voters support a transit bond. What was the point estimate (as a percentage) from the random sample?`, p); },
      () => { const n=R(2,5)*100, me=R(4,8); // If sample size quadruples (4n), ME is cut in half (me/2)
        return g(`A random sample of ${n} subscribers yields an estimated proportion with a margin of error of ${me} percentage points at the 95% confidence level. If the sample size is increased to ${4*n} subscribers (keeping the confidence level at 95%), what will the new margin of error be, in percentage points?`, me / 2); },
      () => { // Stratified population inference from table of strata
        const popA=2000, pctA=R(30,60,10), popB=3000, pctB=R(40,70,10); const est = popA*(pctA/100) + popB*(pctB/100);
        const tbl=`<table style="margin:10px auto;border-collapse:collapse;text-align:center;width:270px;border:1px solid var(--line)"><tr style="background:var(--panel2)"><th style="padding:5px;border:1px solid var(--line)">Campus</th><th style="padding:5px;border:1px solid var(--line)">Total Students</th><th style="padding:5px;border:1px solid var(--line)">Sample % Commuting</th></tr><tr><td style="padding:5px;border:1px solid var(--line)">North</td><td style="padding:5px;border:1px solid var(--line)">2,000</td><td style="padding:5px;border:1px solid var(--line)">${pctA}%</td></tr><tr><td style="padding:5px;border:1px solid var(--line)">South</td><td style="padding:5px;border:1px solid var(--line)">3,000</td><td style="padding:5px;border:1px solid var(--line)">${pctB}%</td></tr></table>`;
        return g(`${tbl}A university took separate random samples of students at its North and South campuses, as shown in the table above. Based on these estimates, how many total students across both campuses combined are expected to commute?`, est); },
      () => { const mean=R(45,75), me=R(3,7); // Plausible value outside vs inside interval
        return g(`A marine biologist estimates the mean carapace length of adult sea turtles in a sanctuary to be ${mean} centimeters, with a margin of error of ±${me} centimeters at the 95% confidence level. Which of the following values is <b>outside</b> the plausible interval for the true population mean carapace length?`, String(mean + me + 3), [String(mean + me + 3), String(mean - me + 1), String(mean + me - 1), String(mean)]); },
      () => { const n=200, def=R(6,16), batch=R(3,8)*1000; const mePct = 1.5; // point estimate + ME upper bound
        const est = (def/n)*batch; return g(`In a random sample of 200 light bulbs from a production run of ${batch} bulbs, ${def} bulbs were found to have filament defects. Based on this sample, what is the best point estimate for the number of non-defective (working) bulbs in the entire production run?`, batch - est); },
      () => { // Confidence interval width = 2 * ME
        const lo=R(32,48), hi=lo+R(6,14,2); const width=hi-lo, me=width/2;
        return grid(`A 95% confidence interval for the mean daily water consumption per household in a city is (${lo} gallons, ${hi} gallons). What is the margin of error, in gallons, of this estimate?`, me); },
      () => { // Comparing two independent populations with non-overlapping intervals
        const m1=72, me1=3, m2=61, me2=4; // Interval 1: [69, 75], Interval 2: [57, 65] -> min plausible diff = 69 - 65 = 4
        return g(`In a study comparing two battery designs, Battery A had a sample mean lifespan of 72 hours with a margin of error of ±3 hours (interval 69 to 75), and Battery B had a sample mean lifespan of 61 hours with a margin of error of ±4 hours (interval 57 to 65). Based on these intervals, what is the minimum plausible difference (Battery A minus Battery B), in hours, between the two population means?`, 69 - 65); },
      () => { // Repeating 95% confidence intervals 100 times -> how many expected to capture true parameter?
        const k=R(2,6)*20; return g(`If ${k} independent researchers each select a separate random sample of the same size from a population and each constructs a 95% confidence interval for the population mean, how many of the ${k} intervals are expected, in theory, to contain the true population mean?`, k * 0.95); },
      () => { // Capture-recapture with margin of error or two samples
        const tagged=R(4,9)*10, recap=R(5,10)*10, markedInRecap=R(10,20,5); const pop = (tagged * recap) / markedInRecap;
        return g(`Biologists tagged and released 80 sea otters in a bay. One month later, they observed a random sample of 60 sea otters in the bay and counted 12 with tags. Based on this sample proportion, what is the estimated total sea otter population in the bay?`, 400); },
      () => { // Sample standard deviation s effect on Margin of Error: ME = z * s / sqrt(n)
        return g(`The margin of error for a confidence interval of a population mean is given by the formula <f><i>z</i> · <i>s</i>/√<i>n</i></f>, where <i>s</i> is the sample standard deviation and <i>n</i> is the sample size. If two samples have the same size <i>n</i> and use the same confidence level <i>z</i>, how does the sample with greater variability (larger <i>s</i>) affect the margin of error?`, "It produces a larger margin of error and a wider confidence interval.", ["It produces a larger margin of error and a wider confidence interval.", "It produces a smaller margin of error and a narrower confidence interval.", "Sample variability s has no effect on the margin of error.", "It shifts the midpoint of the confidence interval upward."]); },
      () => { const pop=5000, p=R(24,44,4), me=3; // Difference between point estimate count and lower bound count = pop * (me/100)
        return grid(`In a town of 5,000 households, a random sample estimates that ${p}% own solar panels, with a margin of error of ±${me}%. By how many households does the point estimate for the town exceed the minimum plausible number of households with solar panels?`, 5000 * (me / 100)); },
      () => { // Sampling frame mismatch ( generalizes only to the sampled subpopulation )
        return g(`A university library surveys a random sample of 250 students who visited the physical library building during finals week to estimate student satisfaction with online database access. Which statement best identifies the limitation of generalizing this result to all students at the university?`, "Students who visit the physical building during finals week may differ systematically from students who access the library exclusively online.", ["Students who visit the physical building during finals week may differ systematically from students who access the library exclusively online.", "A sample size of 250 is too small to calculate a sample proportion.", "Finals week lasts only seven days, which increases the standard deviation.", "The survey did not include faculty members from other universities."]); },
      () => { const n1=100, me1=9; // To reduce ME from 9% to 3% (factor of 3), sample size must increase by 3^2 = 9 -> 900 -> how many ADDITIONAL subjects needed? 900 - 100 = 800!
        return g(`A pilot survey of 100 randomly selected customers yields a margin of error of 9%. How many <b>additional</b> customers must be randomly sampled (at the same confidence level) to reduce the margin of error to 3%?`, 800); },
      () => { const samp=R(4,8)*50, count=samp*0.3, pop=R(2,5)*10000;
        return g(`In a random sample of ${samp} registered nurses in a state with ${pop} registered nurses, ${count} reported working shifts longer than 10 hours. Based on this sample, how many registered nurses in the state are estimated to work shifts of 10 hours or less?`, pop * 0.7); },
      () => { // Margin of error in absolute units vs percentage of mean
        const mean=200, me=10; // ME is 5% of the sample mean
        const m=R(2,6)*100, pct=R(3,8); const absMe = m*(pct/100);
        return g(`A forestry survey estimates the mean height of mature redwoods in a grove to be ${m} feet, with a margin of error equal to ${pct}% of the estimated mean. What is the upper bound of the confidence interval for the mean height, in feet?`, m + absMe); },
      () => { // Weighted sample inference where two classrooms were sampled at different rates
        const N1=400, p1=0.5, N2=600, p2=0.8; // total expected = 200 + 480 = 680 -> overall % = 680/1000 = 68%
        return grid(`A factory has 400 day-shift workers and 600 night-shift workers. A random sample of day-shift workers estimates that 50% prefer a 4-day workweek, and a random sample of night-shift workers estimates that 80% prefer a 4-day workweek. What percent of all 1,000 workers at the factory are estimated to prefer a 4-day workweek?`, 68); },
      () => { // Identifying which confidence level (90%, 95%, 99%) produced which interval from the same data
        return g(`From a single random sample of voters, a pollster calculates three confidence intervals for the proportion supporting Candidate X: Interval I is (47%, 53%), Interval II is (46%, 54%), and Interval III is (44%, 56%). The three intervals correspond to confidence levels of 90%, 95%, and 99%, not necessarily in that order. Which interval corresponds to the 99% confidence level?`, "Interval III (44%, 56%), because higher confidence requires a wider interval.", ["Interval III (44%, 56%), because higher confidence requires a wider interval.", "Interval I (47%, 53%), because 99% confidence is the most precise.", "Interval II (46%, 54%), because it is the median interval.", "It is impossible to determine without knowing the total population size."]); },
      () => { const lo=R(120,180), hi=lo+R(30,60,10); const nItems=10; // Interval for 1 item is (lo, hi) grams -> interval for midpoint * 10
        return g(`Based on a random sample, the 95% confidence interval for the mean mass of a single avocado from an orchard is ${lo} grams to ${hi} grams. What is the point estimate (sample mean), in grams, for the mass of a single avocado?`, (lo + hi)/2); },
      () => { const p=R(55,75), me=R(2,4); // Is 50% plausible? Since p - me >= 51% > 50%, majority is supported!
        return g(`In a referendum poll of 1,200 randomly selected likely voters, 58% stated they will vote "Yes," with a margin of error of ±3% at the 95% confidence level. Does this poll provide convincing statistical evidence that a majority (more than 50%) of all likely voters support the referendum?`, "Yes, because the entire plausible interval (55% to 61%) is strictly above 50%.", ["Yes, because the entire plausible interval (55% to 61%) is strictly above 50%.", "No, because 3% of the voters might change their minds before election day.", "No, because a sample of 1,200 voters is less than 10% of the city's population.", "Yes, but only if the margin of error is reduced to 0%."]); },
      () => { const tot=R(3,8)*1000, sSize=250, sCount=R(50,150,25); const prop = sCount/sSize;
        return g(`Out of a random sample of 250 trees in a regional park containing ${tot} trees, ${sCount} trees showed signs of bark beetle infestation. Based on this sample, how many trees in the entire regional park are estimated to be infested?`, prop * tot); }
    ],
    // === Topic 15: Evaluating statistical claims ===
    [
      () => g(`A study finds a strong correlation between drinking coffee and longevity. Does this mean drinking coffee causes people to live longer?`, "Not necessarily; correlation does not imply causation", ["Not necessarily; correlation does not imply causation", "Yes, the data proves a direct cause", "No, they are completely unrelated", "Only if the sample size is small"]),
      () => g(`Which type of study design is best suited to allow researchers to draw causal conclusions?`, "Randomized controlled experiment", ["Randomized controlled experiment", "Observational study", "Voluntary response survey", "Online poll"]),
      () => g(`A gym surveys only its morning members about general exercise habits. What is the primary issue with this?`, "The sample is biased and not representative", ["The sample is biased and not representative", "The sample is perfectly random", "It proves causation", "There are no issues"]),
      () => g(`How can researchers get the most reliable estimate of a population parameter?`, "By using a large, randomly selected sample", ["By using a large, randomly selected sample", "By using a small, randomly selected sample", "By using a large, biased sample", "By asking volunteers"]),
      () => g(`A study's confidence intervals for two groups overlap heavily. What is the most reasonable conclusion?`, "The difference between the groups may not be statistically significant", ["The difference between the groups may not be statistically significant", "The groups are completely identical", "The difference is massive", "One variable causes the other"]),
      () => {
        const n = R(100, 300, 50);
        const ans = "The supplement causes improved sleep for the volunteers in the study, but the results cannot be generalized to all adults.";
        return g(`A researcher recruited ${n} adult volunteers who reported trouble sleeping. Half of the volunteers were randomly assigned to take a new herbal supplement, and the other half were assigned to take an identical-looking placebo. Those who took the supplement slept significantly longer. Which conclusion is best supported by this study?`, ans, [
          ans,
          "The supplement causes improved sleep for all adults in the general population.",
          "No causal conclusion can be drawn because the participants were volunteers.",
          "There is a positive correlation, but it is impossible to tell whether the supplement caused the improvement for the participants."
        ]);
      },
      // 7. Случайная выборка из популяции, но БЕЗ случайного распределения по группам (Observational study: Generalization YES, Causation NO!)
      () => {
        const n = R(400, 900, 100);
        const ans = "There is a positive association between playing chess and math grades among students in the district, but a causal relationship cannot be established.";
        return g(`An education researcher selected a random sample of ${n} high school students from a large school district. The researcher found that students who regularly play chess had significantly higher math grades than students who do not play chess. Which conclusion is most appropriate?`, ans, [
          ans,
          "Playing chess causes high school students in the district to earn higher math grades.",
          `The results apply only to the ${n} students in the sample and cannot be generalized to the school district.`,
          "Students with high math grades should be required to play chess."
        ]);
      },
      // 8. Идеальный дизайн (И Random Selection, И Random Assignment -> и Causation, и Generalization!)
      () => {
        const n = R(200, 500, 50);
        const ans = "The new fertilizer causes an increase in tomato yield, and this conclusion can be generalized to all tomato plants on the farm.";
        return g(`An agricultural scientist randomly selected ${n} tomato plants from a large commercial farm. Half of the selected plants were randomly assigned to receive a new fertilizer, while the other half received the standard fertilizer. The plants receiving the new fertilizer produced significantly more tomatoes. Which conclusion is valid?`, ans, [
          ans,
          "The new fertilizer is associated with higher yield, but it cannot be concluded that the fertilizer caused the increase.",
          `The causal conclusion applies only to the ${n} plants tested and cannot be generalized to the rest of the farm.`,
          "The experiment is invalid because all plants were from the same farm."
        ]);
      },
      // 9. Скрытая переменная (Confounding variable) в наблюдательном исследовании
      () => {
        const ans = "Daily temperature is a confounding variable that causes both ice cream sales and swimming pool attendance to increase.";
        return g(`City records over a 12-month period show a strong positive linear association between weekly ice cream sales and weekly attendance at public swimming pools. Which of the following best explains this association?`, ans, [
          ans,
          "Eating ice cream causes people to visit public swimming pools.",
          "Swimming at public pools causes a direct increase in city ice cream sales.",
          "The sample size of 12 months is too small to observe a real correlation."
        ]);
      },
      // 10. Для чего нужно случайное распределение (Purpose of Random Assignment in experiments)
      () => {
        const ans = "To ensure that the treatment and control groups are roughly equivalent in baseline characteristics before the treatment begins";
        return g(`In a clinical trial testing a new blood pressure medication, why do researchers use random assignment to place participants into either the treatment group or the control group?`, ans, [
          ans,
          "To ensure that the sample of participants is representative of the entire national population",
          "To guarantee that every participant experiences the exact same reduction in blood pressure",
          "To eliminate the need for a control group or placebo"
        ]);
      },
      // 11. Для чего нужен случайный отбор из популяции (Purpose of Random Selection in surveys/studies)
      () => {
        const ans = "To obtain a sample that is representative of the target population so results can be generalized";
        return g(`When conducting a statistical survey of a city's residents, what is the primary purpose of selecting participants at random from the entire city population?`, ans, [
          ans,
          "To prove a cause-and-effect relationship between two variables",
          "To ensure that all participants give the exact same answer to the survey questions",
          "To reduce the total number of people who need to be contacted to zero"
        ]);
      },
      // 12. Предвзятость формулировки вопроса (Leading / Biased question wording)
      () => {
        const ans = '"Do you support or oppose the proposed city ordinance to expand bike lanes?"';
        return g(`A city council wants to gauge unbiased public opinion on a proposal to convert parking spaces into bike lanes. Which of the following survey questions is least likely to introduce bias?`, ans, [
          ans,
          '"Don\'t you agree that dangerous traffic congestion would be reduced by building safe bike lanes?"',
          '"Should the city waste taxpayer money eliminating valuable parking spaces for unneeded bike lanes?"',
          '"Why do you think bike lanes are beneficial for our community\'s environment?"'
        ]);
      },
      // 13. Ошибка добровольного отклика (Voluntary response bias — отзывы в интернете / звонки на радио)
      () => {
        const ans = "Voluntary response bias, because customers with strong negative or positive experiences are much more likely to respond";
        return g(`An airline sends an optional email survey to all passengers after a flight, and 4% of the passengers choose to respond. Based on these responses, the airline concludes that 65% of all passengers are dissatisfied with legroom. What is the main flaw in this conclusion?`, ans, [
          ans,
          "The airline contacted all passengers instead of taking a small sample",
          "Email surveys automatically prove causation rather than correlation",
          "A 4% response rate is mathematically impossible to calculate"
        ]);
      },
      // 14. Недостаточный охват популяции (Undercoverage bias — опрос только по стационарным телефонам или в одном месте)
      () => {
        const ans = "The sampling method excludes residents who use only cell phones or do not have a landline, creating undercoverage bias.";
        return g(`To estimate the proportion of residents in a county who support a school bond, a polling organization randomly dials numbers from a directory of landline telephones at 2:00 PM on a Tuesday. Why is this sampling method flawed?`, ans, [
          ans,
          "Dialing phone numbers at random constitutes an experiment rather than an observational study.",
          "Randomly dialing landline numbers guarantees a 100% response rate.",
          "School bonds can only be evaluated using a double-blind clinical trial."
        ]);
      },
      // 15. Эффект плацебо и двойное слепое исследование (Double-blind experiment)
      () => {
        const ans = "Neither the participants nor the researchers evaluating them know which participants received the active treatment and which received the placebo.";
        return g(`In medical research, what does it mean for a randomized clinical trial to be "double-blind"?`, ans, [
          ans,
          "Participants are tested twice before being assigned to a treatment group.",
          "Two different active medications are tested simultaneously without a control group.",
          "The researchers do not know the hypothesis of their own study."
        ]);
      },
      // 16. Стратифицированная случайная выборка (Stratified random sampling): выбор лучшего метода опроса школы
      () => {
        const ans = "Randomly select 25 students from each of the four grade levels (9th, 10th, 11th, and 12th)";
        return g(`A high school principal wants to survey 100 students to estimate the opinion of the entire student body on a new dress code, ensuring that all four grade levels (which are equal in size) are equally represented. Which sampling method is best?`, ans, [
          ans,
          "Survey the first 100 students who arrive at the school library on Monday morning",
          "Randomly select 100 students from the 12th-grade honor roll list",
          "Place a stack of 100 survey forms in the cafeteria and ask interested students to fill them out"
        ]);
      },
      // 17. Численная задача (grid) на стратифицированную выборку (Proportional stratified sample)
      () => {
        const f = R(3, 6) * 100, s = R(2, 5) * 100, j = R(2, 5) * 100, sr = R(2, 4) * 100;
        const tot = f + s + j + sr;
        const sampleSize = 100;
        const fInSample = (f / tot) * sampleSize; // wait, let's make tot = 1000 so it's always a clean integer!
        const fresh = R(2, 4) * 100, other = 1000 - fresh, samp = R(1, 3) * 50;
        const ans = (fresh / 1000) * samp;
        return g(`A university has 1,000 residential students, of whom ${fresh} are freshmen and ${other} are upperclassmen. A researcher wants to select a stratified random sample of ${samp} students such that the proportion of freshmen in the sample matches the proportion of freshmen in the residential population. How many freshmen should be randomly selected for the sample?`, ans);
      },
      // 18. Численная задача (grid) на оценку чистого эффекта в эксперименте (Treatment Effect = Treatment Mean - Control Mean)
      () => {
        const total = R(6, 12) * 20, half = total / 2;
        const treatImp = R(14, 26), ctrlImp = R(4, 10);
        const netEffect = treatImp - ctrlImp;
        return g(`In a randomized controlled experiment, ${total} patients were randomly divided into two equal groups of ${half}. Group A received an experimental therapy and showed a mean score improvement of ${treatImp} points. Group B received a placebo and showed a mean score improvement of ${ctrlImp} points. What is the net treatment effect (the difference in mean improvement between Group A and Group B), in points?`, netEffect);
      },
      // 19. HTML-таблица результатов эксперимента: разница в доле выздоровевших (Risk difference / Rate comparison)
      () => {
        const n = 200, recA = R(130, 170, 10), recB = R(60, 100, 10);
        const pA = (recA / n) * 100, pB = (recB / n) * 100;
        const tbl = `<table style="margin:12px auto;border-collapse:collapse;text-align:center;width:280px;border:1px solid var(--line)"><tr style="background:var(--panel2)"><th style="padding:6px;border:1px solid var(--line)">Group</th><th style="padding:6px;border:1px solid var(--line)">Improved</th><th style="padding:6px;border:1px solid var(--line)">No Change</th><th style="padding:6px;border:1px solid var(--line)">Total</th></tr><tr><td style="padding:4px 8px;border:1px solid var(--line)">Treatment</td><td style="padding:4px 8px;border:1px solid var(--line)">${recA}</td><td style="padding:4px 8px;border:1px solid var(--line)">${n - recA}</td><td style="padding:4px 8px;border:1px solid var(--line)">${n}</td></tr><tr><td style="padding:4px 8px;border:1px solid var(--line)">Control (Placebo)</td><td style="padding:4px 8px;border:1px solid var(--line)">${recB}</td><td style="padding:4px 8px;border:1px solid var(--line)">${n - recB}</td><td style="padding:4px 8px;border:1px solid var(--line)">${n}</td></tr></table>`;
        return g(`${tbl}The table above shows the results of a randomized controlled trial with 400 participants (${n} per group). The percentage of participants who improved in the Treatment group is how many percentage points greater than the percentage who improved in the Control group?`, pA - pB);
      },
      // 20. Ловушка отсутствия контрольной группы (Lack of a control group)
      () => {
        const n = R(40, 90);
        const ans = "There was no control group, so it is impossible to know how much the plants would have grown without the music.";
        return g(`A student played classical music for ${n} bean plants for 3 hours a day over 4 weeks. At the end of the 4 weeks, all ${n} plants had grown at least 15 centimeters tall. The student concluded that classical music causes bean plants to grow tall. Why is this conclusion flawed?`, ans, [
          ans,
          `A sample of ${n} plants is too large for an experiment.`,
          "The student measured height in centimeters instead of inches.",
          "Bean plants only respond to rock music in controlled trials."
        ]);
      },
      // 21. Блочный дизайн / Парный эксперимент (Matched pairs / Block design)
      () => {
        const ans = "Randomly assign one plots' half to the new seed and the other half to the old seed within each of the 10 soil zones";
        return g(`An agricultural researcher wants to compare two varieties of wheat across 10 fields that vary significantly in soil moisture from north to south. Which experimental design best accounts for the variation in soil moisture?`, ans, [
          ans,
          "Plant the new seed in the 5 northernmost fields and the old seed in the 5 southernmost fields",
          "Allow the farm workers to choose which seed to plant in each field",
          "Test both seeds only in the single driest field"
        ]);
      },
      // 22. Почему в некоторых случаях проводят Observational Study вместо Experiment (Этика и практичность)
      () => {
        const ans = "It would be unethical to randomly assign human participants to smoke cigarettes.";
        return g(`To investigate the link between smoking cigarettes and lung disease, medical researchers use long-term observational studies rather than randomized controlled experiments. What is the primary reason for this choice?`, ans, [
          ans,
          "Observational studies are better at proving direct causation than randomized experiments.",
          "Randomized experiments can only be conducted on sample sizes of fewer than 20 people.",
          "Observational studies never have confounding variables."
        ]);
      },
      // 23. Ошибка выжившего (Survivorship bias)
      () => {
        const ans = "The survey suffers from survivorship bias because it excludes businesses that failed during their first five years.";
        return g(`A business magazine surveys 200 restaurant owners whose restaurants have been open for at least 5 years and finds that 85% of them did not write a formal business plan before opening. The magazine concludes that skipping a business plan increases a restaurant's chance of success. What is the primary flaw in this reasoning?`, ans, [
          ans,
          "A sample size of 200 restaurants is too large to analyze.",
          "The survey was conducted by a business magazine instead of a culinary school.",
          "85% is less than the required 95% confidence level."
        ]);
      },
      () => { const a1=10, a2=90, b1=30, b2=70; // Relative risk vs absolute risk difference! Group A: 10/100 = 10%, Group B: 30/100 = 30%. Relative risk is 3 times as likely, absolute difference is 20 percentage points
        return grid(`In a clinical trial, 10 out of 100 patients in the treatment group developed a headache, compared to 30 out of 100 patients in the placebo group. The incidence rate in the placebo group (30%) is how many <b>times</b> the incidence rate in the treatment group (10%)?`, 3); },
      () => { return g(`A medical researcher wants to test whether a new nasal spray reduces the duration of the common cold. The researcher recruits 400 adult volunteers currently experiencing cold symptoms and randomly assigns 200 to use the active nasal spray and 200 to use a saline placebo spray. Which statement correctly evaluates the scope of conclusions from this study?`, "It can establish whether the spray causes a reduction in cold duration for the volunteers, but may not generalize to all adults because the participants were not randomly sampled from the population.", ["It can establish whether the spray causes a reduction in cold duration for the volunteers, but may not generalize to all adults because the participants were not randomly sampled from the population.", "It can generalize the average cold duration to all adults worldwide, but cannot establish causation because volunteers were used.", "It can neither establish causation nor generalize to any group because 400 participants is too small.", "It proves both causation and universal generalization to all age groups, including children."]); },
      () => { return g(`An economist observes that across 50 cities, cities with a higher number of firefighters per capita also have a higher annual dollar amount of property damage from fires. The economist concludes that hiring more firefighters causes more fire damage. What is the primary flaw in this conclusion?`, "It overlooks a confounding variable: larger or denser cities with more fire hazards require both more firefighters and experience more total fire damage.", ["It overlooks a confounding variable: larger or denser cities with more fire hazards require both more firefighters and experience more total fire damage.", "The economist failed to calculate the median number of firefighters across the 50 cities.", "Observational studies of 50 cities always prove reverse causation.", "Property damage should be measured in square meters rather than dollars."]); },
      () => { return g(`In a study of a new physical therapy regimen for knee pain, patients who chose to attend all 12 therapy sessions reported a 60% reduction in pain, whereas patients who dropped out after 2 sessions reported only a 10% reduction. Why is it invalid to conclude solely from this comparison that attending all 12 sessions caused the 50-percentage-point improvement?`, "Self-selection and attrition bias: patients whose knees were already healing rapidly may have been more motivated to stay in the program than patients experiencing severe pain.", ["Self-selection and attrition bias: patients whose knees were already healing rapidly may have been more motivated to stay in the program than patients experiencing severe pain.", "A 60% reduction in pain is mathematically smaller than a 10% reduction.", "Knee pain can only be measured using blood biomarkers rather than patient surveys.", "The researchers should have excluded all patients who attended 12 sessions."]); },
      () => { return g(`A software company tests two versions of a checkout button (Blue vs. Green) by randomly showing Version A to half of the 10,000 visitors to its website on Tuesday and Version B to the other half. Visitors who saw the Green button completed purchases at a 4.8% rate, compared to 3.1% for the Blue button (<i>p</i> < 0.001). Which conclusion is most appropriate?`, "Changing the button color from Blue to Green caused a statistically significant increase in the purchase completion rate among visitors to the website that day.", ["Changing the button color from Blue to Green caused a statistically significant increase in the purchase completion rate among visitors to the website that day.", "The difference between 4.8% and 3.1% is due entirely to random chance because p < 0.001.", "Green buttons will increase sales by 1.7% for all physical brick-and-mortar retail stores.", "Because visitors were not informed of the experiment in advance, the data cannot establish causation."]); },
      () => { return g(`A nutritionist surveys a random sample of 2,000 adults and finds that those who eat dark chocolate at least three times a week have lower average blood pressure than those who never eat dark chocolate. Why can the nutritionist NOT conclude that eating dark chocolate causes lower blood pressure?`, "Because participants were not randomly assigned to eat or avoid dark chocolate, lifestyle or dietary confounding variables may explain the difference.", ["Because participants were not randomly assigned to eat or avoid dark chocolate, lifestyle or dietary confounding variables may explain the difference.", "Because a sample of 2,000 adults is too small to detect a correlation.", "Because blood pressure varies throughout the day, making observational averages meaningless.", "Because random sampling from a population prevents researchers from identifying correlations."]); },
      () => { // Truncated Y-axis misleading graph (with SVG bar chart starting at y = 90%)
        const fig = gSvg(210, 125, `<line x1="40" y1="100" x2="190" y2="100" stroke="#0f2b4a" stroke-width="2"/><line x1="40" y1="15" x2="40" y2="100" stroke="#0f2b4a" stroke-width="2"/><text x="34" y="102" font-size="9" text-anchor="end" fill="#e74c3c" font-weight="bold">90%</text><text x="34" y="60" font-size="9" text-anchor="end" fill="#0f2b4a">95%</text><text x="34" y="20" font-size="9" text-anchor="end" fill="#0f2b4a">100%</text><rect x="65" y="84" width="32" height="16" fill="#94a3b8"/><text x="81" y="114" font-size="10" text-anchor="middle" fill="#0f2b4a">Brand X</text><text x="81" y="79" font-size="9" text-anchor="middle" fill="#0f2b4a">92%</text><rect x="125" y="36" width="32" height="64" fill="#22a381"/><text x="141" y="114" font-size="10" text-anchor="middle" fill="#0f2b4a">Brand Y</text><text x="141" y="31" font-size="9" text-anchor="middle" fill="#22a381" font-weight="bold">98%</text>`, false);
        return g(`${fig}An advertisement displays the bar graph above and claims that "Brand Y is four times as reliable as Brand X!" Why is this visual claim misleading?`, "Because the vertical axis starts at 90% instead of 0%, a 6-percentage-point difference (98% vs. 92%) is visually exaggerated to make the bar four times as tall.", ["Because the vertical axis starts at 90% instead of 0%, a 6-percentage-point difference (98% vs. 92%) is visually exaggerated to make the bar four times as tall.", "Because Brand X actually has a higher reliability percentage than Brand Y.", "Because bar graphs can only be used to display categorical counts, not percentages.", "Because the horizontal axis does not include a third competitor brand."]); },
      () => { // Simpson's Paradox evaluation
        const tbl=`<table style="margin:10px auto;border-collapse:collapse;text-align:center;width:290px;border:1px solid var(--line)"><tr style="background:var(--panel2)"><th style="padding:4px;border:1px solid var(--line)">Case Severity</th><th style="padding:4px;border:1px solid var(--line)">Hospital A Success</th><th style="padding:4px;border:1px solid var(--line)">Hospital B Success</th></tr><tr><td style="padding:4px;border:1px solid var(--line)">Mild Cases</td><td style="padding:4px;border:1px solid var(--line)">95/100 (95%)</td><td style="padding:4px;border:1px solid var(--line)">360/400 (90%)</td></tr><tr><td style="padding:4px;border:1px solid var(--line)">Severe Cases</td><td style="padding:4px;border:1px solid var(--line)">320/400 (80%)</td><td style="padding:4px;border:1px solid var(--line)">70/100 (70%)</td></tr><tr style="font-weight:bold"><td style="padding:4px;border:1px solid var(--line)">Combined</td><td style="padding:4px;border:1px solid var(--line)">415/500 (83%)</td><td style="padding:4px;border:1px solid var(--line)">430/500 (86%)</td></tr></table>`;
        return g(`${tbl}A health magazine cites the combined row in the table above to claim that Hospital B provides superior surgical care overall (86% vs. 83%). How does the stratified data in the table refute this claim?`, "Hospital A actually achieves a higher success rate than Hospital B for both mild cases (95% vs. 90%) and severe cases (80% vs. 70%); Hospital A's combined rate is lower only because it treats four times as many severe cases.", ["Hospital A actually achieves a higher success rate than Hospital B for both mild cases (95% vs. 90%) and severe cases (80% vs. 70%); Hospital A's combined rate is lower only because it treats four times as many severe cases.", "Hospital B treated more total patients (500) than Hospital A (500).", "The combined percentages (83% and 86%) were calculated by averaging 95% and 80%.", "Mild cases should be excluded when evaluating hospital surgical outcomes."]); },
      () => { // Placebo effect & blinding necessity
        return g(`In a study testing whether a new energy drink improves typing speed, Group 1 was told they were drinking a high-caffeine performance enhancer, while Group 2 was told they were drinking plain water. In reality, both groups drank the exact same decaffeinated juice, yet Group 1 typed 12% faster. Which concept best explains this outcome?`, "The placebo effect, in which participants' expectations of a treatment's efficacy alter their actual performance.", ["The placebo effect, in which participants' expectations of a treatment's efficacy alter their actual performance.", "Nonresponse bias, in which slower typists refused to participate in Group 1.", "Undercoverage bias caused by testing only two groups of typists.", "Double-blinding, which prevented the researchers from measuring typing speed accurately."]); },
      () => { // Ecological fallacy (inferring individual behavior from group-level averages)
        return g(`A sociologist finds that across 30 school districts, districts with higher average household income have higher average student math scores. The sociologist concludes that within any given classroom, a student from a wealthier family is guaranteed to outscore a student from a lower-income family. What statistical error does this conclusion commit?`, "It confuses a group-level correlation across districts with a deterministic rule for every individual student.", ["It confuses a group-level correlation across districts with a deterministic rule for every individual student.", "It uses household income instead of property tax revenue as the independent variable.", "It relies on a sample of 30 school districts rather than a census of 5 districts.", "It assumes that math scores and household income have a negative correlation."]); },
      () => { // Recall bias in retrospective self-report studies
        return g(`To investigate whether cell phone usage is linked to migraines, researchers asked 100 chronic migraine sufferers and 100 healthy controls to estimate how many minutes per day they had held a phone to their ear five years ago. Why might this data collection method introduce systematic bias?`, "Recall bias: individuals suffering from chronic migraines may search their memories more intensely and overestimate past phone usage compared to healthy controls.", ["Recall bias: individuals suffering from chronic migraines may search their memories more intensely and overestimate past phone usage compared to healthy controls.", "Random assignment bias: participants were randomly assigned to develop migraines five years ago.", "Survivorship bias: cell phones from five years ago emitted lower radio frequencies.", "Placebo bias: healthy controls were given fake cell phones during the interview."]); },
      () => { // Cluster sampling vs Simple Random Sampling
        return g(`A state department of education wants to survey 1,000 high school teachers across 500 high schools. Instead of selecting 1,000 teachers at random from a statewide list, the department randomly selects 25 high schools and surveys all 40 teachers at each of those 25 schools. What is this sampling method called?`, "Cluster random sampling", ["Cluster random sampling", "Voluntary response sampling", "Convenience sampling at a single location", "Double-blind experimental assignment"]); },
      () => { // Hawthorne effect in workplace observation
        return g(`An industrial psychologist stations observers with clipboards on a factory floor for one week to time how fast assembly workers package electronics. During that week, packaging speed increases by 18%, but returns to baseline the week after the observers leave. What is the most likely explanation for the temporary increase?`, "Workers altered their behavior and worked faster simply because they knew they were being actively observed.", ["Workers altered their behavior and worked faster simply because they knew they were being actively observed.", "The clipboards emitted electromagnetic waves that sped up the assembly conveyor belt.", "The sample of workers changed completely between the first and second week.", "A 18% increase is within the 0% margin of error for observational studies."]); },
      () => { // Base rate fallacy / Misinterpreting raw counts without population denominators
        const rawA=300, rawB=100; // Say 300 accidents involve right-handed drivers and 100 involve left-handed drivers -> doesn't mean right-handed drivers are more dangerous if 90% of drivers are right-handed!
        return g(`Traffic records in a city show that 85% of car accidents involve drivers wearing eyeglasses or contact lenses, while only 15% involve drivers with uncorrected vision. A commentator concludes that corrective lenses make drivers more likely to crash. What critical information is missing to evaluate this claim?`, "The proportion of all drivers in the city who wear eyeglasses or contact lenses.", ["The proportion of all drivers in the city who wear eyeglasses or contact lenses.", "The brand of eyeglasses worn by the drivers in the 15% group.", "The median age of pedestrians who do not drive cars in the city.", "Whether the traffic records were stored digitally or on paper."]); },
      () => { // Statistical significance (p-value) interpretation
        return g(`In a randomized trial comparing a new fertilizer to a control, crops treated with the new fertilizer yielded 8% more grain, with a <i>p</i>-value of 0.01 (below the standard threshold of 0.05). What does a <i>p</i>-value of 0.01 mean in this context?`, "If the fertilizer actually had no effect, there would be only a 1% probability of observing a yield difference of 8% or more by random chance alone.", ["If the fertilizer actually had no effect, there would be only a 1% probability of observing a yield difference of 8% or more by random chance alone.", "There is a 99% probability that the researchers made a calculation error.", "The fertilizer increases yield for only 1% of the plants in the field.", "The margin of error of the yield increase is exactly ±0.01%."]); },
      () => { // Nonresponse bias in mail/phone surveys with low response rate
        const sent=10000, replied=350;
        return g(`A neighborhood association mails 10,000 questionnaires to city residents asking whether property taxes should be raised to build a dog park. Only 350 questionnaires are mailed back, with 88% in favor. Why should the city council be cautious about concluding that 88% of all residents support the tax increase?`, "Nonresponse bias: the 3.5% of residents who took the time to mail back the survey likely include a disproportionately high share of passionate dog owners.", ["Nonresponse bias: the 3.5% of residents who took the time to mail back the survey likely include a disproportionately high share of passionate dog owners.", "A sample of 350 responses is mathematically too small to calculate a percentage.", "Mailing 10,000 questionnaires violates the rules of observational studies.", "88% is too close to 50% to determine a majority."]); },
      () => { // Reverse causation (Directionality problem in cross-sectional correlation)
        return g(`A cross-sectional survey of office workers finds a positive correlation between the number of ergonomic seat cushions a worker owns and the severity of the worker's lower-back pain. A blogger claims this proves that ergonomic cushions cause lower-back pain. Which alternative explanation is most plausible?`, "Reverse causation: workers who already suffer from severe lower-back pain are much more likely to purchase ergonomic seat cushions for relief.", ["Reverse causation: workers who already suffer from severe lower-back pain are much more likely to purchase ergonomic seat cushions for relief.", "Ergonomic seat cushions are only sold to workers who do not have lower-back pain.", "A positive correlation means that owning more cushions is associated with less back pain.", "The survey included too many office workers from different companies."]); },
      () => { // Matched-pairs experimental design (within-subject control)
        return g(`To test the durability of two brands of running shoe soles (Brand X and Brand Y), a researcher outfits 50 marathon runners with a Brand X sole on one foot and a Brand Y sole on the other foot (randomly assigning which foot gets which brand for each runner). Why is this matched-pairs design superior to assigning 25 runners to wear Brand X on both feet and 25 runners to wear Brand Y on both feet?`, "It eliminates variability between individual runners (such as body weight, running gait, and mileage) because each runner serves as their own control.", ["It eliminates variability between individual runners (such as body weight, running gait, and mileage) because each runner serves as their own control.", "It doubles the number of marathon runners needed for the study from 50 to 100.", "It guarantees that Brand X and Brand Y will wear down at the exact same rate.", "It allows the researcher to generalize the results to cycling shoes as well."]); },
      () => { // Regression to the mean fallacy
        return g(`After a basketball player scores a career-high 48 points in a game (far above her season average of 18 points), she appears on the cover of a sports magazine. In her very next game, she scores 20 points. Fans claim that appearing on the magazine cover "jinxed" her performance. Which statistical phenomenon best explains why her score dropped in the next game?`, "Regression to the mean: an extreme outlier performance is naturally likely to be followed by a performance closer to the player's true average.", ["Regression to the mean: an extreme outlier performance is naturally likely to be followed by a performance closer to the player's true average.", "Sampling bias: the fans only watched the second game.", "Extrapolation error: 20 points is lower than her season average of 18 points.", "Confounding by the opposing team's uniform color."]); },
      () => { // Percentage vs raw number in growing population
        const y1Pop=10000, y1Pct=12, y2Pop=20000, y2Pct=9; // 12% of 10k = 1,200; 9% of 20k = 1,800 -> rate dropped from 12% to 9%, but total count rose from 1,200 to 1,800!
        return g(`In 2010, a town had a population of 10,000 and an unemployment rate of 12%. By 2020, the town's population had grown to 20,000 and its unemployment rate had fallen to 9%. Even though the unemployment percentage rate decreased, by how many people did the actual <b>number</b> of unemployed residents increase from 2010 to 2020?`, 1800 - 1200); },
      () => { // Evaluating generalizability across species/environments
        return g(`In a controlled laboratory study, mice fed a diet supplemented with high doses of synthetic Compound Z lived 15% longer than control mice fed a standard diet. A health company immediately advertises Compound Z pills as proven to extend human lifespan by 15%. Which critique of the advertisement is most valid?`, "Results from high-dose trials in laboratory mice do not automatically translate to the same physiological effects or safety profile in humans.", ["Results from high-dose trials in laboratory mice do not automatically translate to the same physiological effects or safety profile in humans.", "The laboratory study lacked a control group of mice.", "A 15% increase in lifespan is a negative correlation.", "Randomly assigning mice to two diets prevents researchers from testing causation in mice."]); },
      () => { // Social desirability bias in self-reported behavior
        return g(`When dental hygienists ask patients face-to-face, "Do you floss your teeth every single day as recommended?", 72% of patients answer "Yes." However, anonymous pharmacy sales data and plaque exams indicate that fewer than 25% of patients actually floss daily. What type of bias explains the 72% figure?`, "Social desirability bias: respondents overreport admirable behaviors when questioned directly by an authority figure.", ["Social desirability bias: respondents overreport admirable behaviors when questioned directly by an authority figure.", "Placebo bias: patients believe that talking to a hygienist cleans their teeth.", "Survivorship bias: only patients without teeth visit dental hygienists.", "Random sampling error due to using anonymous pharmacy records."]); },
      () => { // Numerical calculation of relative risk reduction (RRR) vs absolute risk reduction (ARR)
        // Control failure rate = 8%, Treatment failure rate = 2%. Absolute reduction = 6 percentage points; Relative reduction = (8 - 2)/8 = 75%!
        return g(`In a randomized trial of a rust-preventative coating, 8% of untreated steel beams developed rust over one year, compared to only 2% of treated steel beams. While the absolute reduction in rust incidence is 6 percentage points, what is the <b>relative percent reduction</b> in rust incidence achieved by the coating? (Note: Relative reduction = <f>Control Rate - Treatment Rate/Control Rate</f> × 100%)`, 75); },
      () => { // Identifying the experimental unit and sample size
        return g(`To test two reading curricula, a researcher randomly assigns 6 classrooms (each containing 25 students) to Curriculum A and 6 classrooms (each containing 25 students) to Curriculum B. At the end of the year, the researcher calculates the average score of each classroom. Why do statisticians caution against treating this as 300 independent observations?`, "Because students within the same classroom share the same teacher and environment, their outcomes are not independent; the true experimental unit is the classroom (12 classrooms total).", ["Because students within the same classroom share the same teacher and environment, their outcomes are not independent; the true experimental unit is the classroom (12 classrooms total).", "Because 6 multiplied by 25 equals 120 rather than 150.", "Because random assignment can only be applied to observational studies.", "Because reading scores cannot be averaged across a classroom."]); },
      () => { // Funding/Conflict of Interest & Replication
        return g(`A small study of 18 athletes funded by a sports-drink manufacturer reports that drinking Brand Z reduces marathon recovery time by 40%. Before athletic trainers adopt Brand Z as standard protocol, which follow-up step is most important according to scientific best practices?`, "Independent replication of the study using a larger sample size and a double-blind placebo control.", ["Independent replication of the study using a larger sample size and a double-blind placebo control.", "Surveying the 18 athletes' family members about their favorite beverage flavors.", "Decreasing the sample size to 5 athletes to eliminate margin of error.", "Repeating the study without a control group so all athletes benefit from Brand Z."]); },
      () => { // Extrapolation danger in statistical claims
        return g(`Based on data showing that children's vocabulary size increases linearly by approximately 900 words per year between ages 4 and 12, a columnist claims that a 90-year-old adult must know at least 80,000 more words than a 10-year-old child. What is the flaw in this claim?`, "It relies on extreme linear extrapolation far beyond the age range (4 to 12) for which the linear growth rate was observed.", ["It relies on extreme linear extrapolation far beyond the age range (4 to 12) for which the linear growth rate was observed.", "It underestimates 900 multiplied by 80.", "It assumes that 4-year-old children know zero words.", "It confuses vocabulary size with reading speed."]); },
      () => { // Cherry-picking time windows in trend claims
        return g(`A company's stock price was $100 in January, $95 in February, $90 in March, $40 in April (during a brief 2-day market crash), and $60 in May. In June, management boasts that "our stock has surged 50% since April!" Why is this statistical claim misleading?`, "It cherry-picks an anomalous low point (April's $40 trough) as the baseline, masking the fact that the stock is still down 40% from its January level of $100.", ["It cherry-picks an anomalous low point (April's $40 trough) as the baseline, masking the fact that the stock is still down 40% from its January level of $100.", "An increase from $40 to $60 is a 20% increase rather than a 50% increase.", "Stock prices cannot be measured on a monthly basis.", "January has more days than April, which skews the average."]); }
    ],
    // === Topic 16: Area and volume ===
    [
      // 1. Bluebook Hard (image_4.png): Right circular cone slant height from volume V*pi and base area B*pi (with SVG cone)
      () => {
        const triples = [[3,4,5],[5,12,13],[8,15,17],[7,24,25],[9,12,15],[15,36,39],[12,16,20],[10,24,26],[20,48,52],[18,24,30],[24,32,40]];
        const [r0, h0, l0] = getEl(triples);
        const k = R(1, 4);
        const r = r0 * k, h = h0 * 3 * k; // ensure divisible by 3
        const [R_val, H_val, L_val] = [r0 * 3 * k, h0 * 3 * k, l0 * 3 * k];
        const B_val = R_val * R_val;
        const V_val = (B_val * H_val) / 3;
        const fig = svgCone(`r`, `h`, `l = ?`);
        return g(`${fig}A right circular cone has a volume of ${V_val.toLocaleString()}π cubic centimeters and the area of its base is ${B_val.toLocaleString()}π square centimeters. What is the slant height, in centimeters, of this cone?`, String(L_val), [
          String(L_val),
          String(R_val),
          String(H_val),
          String(R_val + H_val)
        ]);
      },
      // 2. Bluebook Hard (image_7.png): Open-top cube box (without a lid) edge in cm -> surface area in square meters (with SVG open-top box)
      () => {
        const s = R(12, 88) * 2; // even cm from 24 to 176 so 5*(s/100)^2 has at most 2 decimal places!
        const areaSqM = Number((5 * (s / 100) * (s / 100)).toFixed(2));
        const fig = svgBox(`${s} cm`, `${s} cm`, `${s} cm`, true);
        return g(`${fig}The length of each edge of a box is ${s} centimeters. Each side of the box is in the shape of a square. The box does not have a lid. What is the exterior surface area, in square <u>meters</u>, of this box without a lid? (1 meter = 100 centimeters)`, areaSqM);
      },
      // 3. Bluebook Hard (image_4.png Grid variant): Cone slant height from volume and base area (Grid-in with SVG)
      () => {
        const triples = [[3,4,5],[5,12,13],[8,15,17],[7,24,25]];
        const [r0, h0, l0] = getEl(triples);
        const k = R(1, 5);
        const R_val = r0 * 3 * k, H_val = h0 * 3 * k, L_val = l0 * 3 * k;
        const B_val = R_val * R_val, V_val = (B_val * H_val) / 3;
        const fig = svgCone(`Base = ${B_val}π`, `V = ${V_val}π`, `l = ?`);
        return g(`${fig}A right circular cone has a volume of ${V_val}π cubic centimeters and the area of its base is ${B_val}π square centimeters. What is the slant height, in centimeters, of this cone?`, L_val);
      },
      // 4. Cylinder volume with SVG figure and wide random range
      () => { const r=R(4,22), h=R(10,45); const fig = svgCyl(`r = ${r}`, `h = ${h}`); return g(`${fig}What is the volume of the right circular cylinder shown above, with radius ${r} and height ${h}?`, `${r*r*h}π`, [`${r*r*h}π`, `${2*r*h}π`, `${r*h}π`, `${Math.round(r*r*h/3)}π`]); },
      // 5. Cone volume with SVG figure and wide random range
      () => { const r=R(4,18), h=R(4,25)*3; const fig = svgCone(`r = ${r}`, `h = ${h}`, ``); return g(`${fig}The volume of the right circular cone shown is <i>V</i> = <f>1/3</f>π<i>r</i>²<i>h</i>. If <i>r</i> = ${r} and <i>h</i> = ${h}, then <i>V</i> = <i>k</i>π. What is the value of <i>k</i>?`, r*r*h/3); },
      // 6. Rectangular prism volume with SVG figure
      () => { const l=R(8,32), w=R(6,24), h=R(10,35); const fig = svgBox(`l = ${l}`, `w = ${w}`, `h = ${h}`, false); return grid(`${fig}A rectangular prism has dimensions ${l} by ${w} by ${h}, as shown. What is its volume?`, l*w*h); },
      // 7. Cube surface area with SVG figure
      () => { const s=R(6,28); const fig = svgBox(`${s}`, `${s}`, `${s}`, false); return g(`${fig}What is the total exterior surface area of a closed cube with edge length ${s}?`, 6*s*s); },
      // 8. Square pyramid volume from slant height and base side with SVG figure
      () => { const [s, h, slant] = getEl([[6, 4, 5], [12, 8, 10], [18, 12, 15], [12, 5, 13], [24, 16, 20], [24, 10, 26]]); const fig = svgPyramid(`s = ${s}`, `h`, `l = ${slant}`); return g(`${fig}A right square pyramid has a square base with side length ${s} meters and a slant height of ${slant} meters, as shown. What is the volume, in cubic meters, of the pyramid?`, (s*s*h)/3); },
      // 9. SVG-чертеж: круг, вписанный в квадрат — найти площадь закрашенной области (r^2(4 - pi))
      () => {
        const r = R(3, 10), s = 2 * r;
        const sqArea = s * s, cirArea = r * r;
        const fig = `<svg viewBox="0 0 140 140" style="width:130px;height:130px;display:block;margin:0 auto 12px"><rect x="20" y="20" width="100" height="100" fill="#22a381" fill-opacity="0.35" stroke="#0f2b4a" stroke-width="2"/><circle cx="70" cy="70" r="50" fill="#ffffff" stroke="#0f2b4a" stroke-width="2"/><line x1="70" y1="70" x2="120" y2="70" stroke="#e74c3c" stroke-width="2"/><text x="95" y="64" font-size="11" text-anchor="middle" fill="#e74c3c"><i>r</i> = ${r}</text></svg>`;
        const ans = `${sqArea} - ${cirArea}π`;
        return g(`${fig}In the figure above, a circle with radius ${r} is inscribed in a square. What is the area of the shaded region (the corners outside the circle)?`, ans, [
          ans,
          `${sqArea} - ${2 * r}π`,
          `${cirArea}π - ${sqArea}`,
          `${cirArea} - ${r}π`
        ]);
      },
      // 10. SVG-чертеж: дорожка постоянной ширины вокруг прямоугольного сада (Frame / Walkway area)
      () => {
        const l = R(10, 20), w = R(6, 12), d = R(2, 4);
        const outerA = (l + 2 * d) * (w + 2 * d), innerA = l * w;
        const walkwayArea = outerA - innerA;
        const fig = `<svg viewBox="0 0 180 120" style="width:165px;height:110px;display:block;margin:0 auto 12px"><rect x="15" y="15" width="150" height="90" fill="#2b7f9c" fill-opacity="0.3" stroke="#0f2b4a" stroke-width="2"/><rect x="35" y="30" width="110" height="60" fill="#ffffff" stroke="#0f2b4a" stroke-width="2"/><text x="90" y="64" font-size="11" text-anchor="middle" fill="#0f2b4a">${l} × ${w}</text><text x="90" y="26" font-size="10" text-anchor="middle" fill="#0f2b4a">width = ${d}</text></svg>`;
        return g(`${fig}A rectangular pool measuring ${l} meters by ${w} meters is surrounded on all sides by a concrete walkway of uniform width ${d} meters, as shown above. What is the area, in square meters, of the concrete walkway alone?`, walkwayArea);
      },
      // 11. Масштабирование 3D-фигур: дано отношение площадей поверхности k^2, найти объем большего тела (k^3)
      () => {
        const k = R(2, 4), vSmall = R(5, 20);
        const vLarge = vSmall * k * k * k;
        return grid(`Two right circular cylinders are similar. The ratio of the surface area of the smaller cylinder to the surface area of the larger cylinder is 1:${k * k}. If the volume of the smaller cylinder is ${vSmall} cubic centimeters, what is the volume, in cubic centimeters, of the larger cylinder?`, vLarge);
      },
      // 12. Несимметричное масштабирование цилиндра (Cylinder scaling trap): радиус * a, высота / b
      () => {
        const mR = getEl([2, 3, 4]), divH = getEl([2, 4]);
        const vInit = divH * R(10, 30);
        const vNew = (vInit * mR * mR) / divH;
        return g(`Cylinder A has a volume of ${vInit} cubic inches. Cylinder B has a radius that is ${mR} times the radius of Cylinder A, and a height that is <f>1/${divH}</f> the height of Cylinder A. What is the volume, in cubic inches, of Cylinder B?`, vNew);
      },
      // 13. Правильная четырехугольная пирамида (Square Pyramid): даны сторона основания и высота -> найти объем
      () => {
        const s = R(2, 6) * 3, h = R(4, 15);
        const vol = (s * s * h) / 3;
        return g(`A right square pyramid has a square base with a side length of ${s} centimeters and a vertical height of ${h} centimeters. What is the volume, in cubic centimeters, of the pyramid?`, vol);
      },
      // 14. Hard SAT: Пирамида с известной апофемой (Slant height) и стороной основания -> найти объем через Пифагора!
      () => {
        // Pythagorean triples for (s/2, h, slant): (3, 4, 5), (6, 8, 10), (5, 12, 13), (9, 12, 15)
        const triples = [[6, 4, 5], [12, 8, 10], [18, 12, 15], [12, 5, 13]]; // [side s (divisible by 3 for volume!), height h, slant l]
        const [s, h, slant] = getEl(triples);
        const vol = (s * s * h) / 3;
        return g(`A right square pyramid has a base side length of ${s} meters and a slant height (the height of each triangular lateral face) of ${slant} meters. What is the volume, in cubic meters, of the pyramid?`, vol);
      },
      // 15. Объем шара / сферы: V = (4/3)*pi*r^3
      () => {
        const r = R(1, 4) * 3; // divisible by 3 so (4/3)*r^3 is a clean integer
        const k = (4 * r * r * r) / 3;
        return grid(`The volume of a sphere with radius ${r} inches is equal to <i>k</i>π cubic inches. What is the value of <i>k</i>?`, k);
      },
      // 16. Переплавка / сохранение объема: шар переплавили в цилиндр (или воду перелили из сферы в цилиндр)
      () => {
        const r = R(1, 3) * 3; // sphere radius = r, cylinder radius = r -> (4/3)*pi*r^3 = pi*r^2*h -> h = (4/3)*r
        const h = (4 * r) / 3;
        return g(`A solid metal sphere with a radius of ${r} centimeters is melted down and recast into a solid right circular cylinder with the same radius of ${r} centimeters. Assuming no metal is lost, what is the height, in centimeters, of the cylinder?`, h);
      },
      // 17. Закон Архимеда: сколько шариков/кубиков нужно бросить в цилиндр, чтобы вода поднялась на H
      () => {
        const rCyl = R(4, 8), rCone = rCyl, hCone = R(3, 9) * 3;
        // One cone volume = (1/3)*pi*r^2*hCone. Water level rise in cylinder of same radius = hCone / 3
        const rise = hCone / 3;
        return g(`A cylindrical tank with a radius of ${rCyl} inches contains water. A solid metal cone with the same radius of ${rCyl} inches and a height of ${hCone} inches is completely submerged in the water. By how many inches does the water level in the cylindrical tank rise?`, rise);
      },
      // 18. Составное 3D-тело (Composite solid): силосная башня из цилиндра и конуса сверху
      () => {
        const r = R(2, 6), hCyl = R(8, 20), hCone = R(1, 5) * 3;
        const k = r * r * hCyl + (r * r * hCone) / 3;
        return g(`A grain silo consists of a right circular cylinder with a radius of ${r} meters and a height of ${hCyl} meters, topped by a right circular cone with the same radius of ${r} meters and a height of ${hCone} meters. The total volume of the silo is <i>k</i>π cubic meters. What is the value of <i>k</i>?`, k);
      },
      // 19. Полая металлическая труба (Hollow pipe / Annular cylinder): объем стенок
      () => {
        const rIn = R(2, 6), thick = R(1, 3), rOut = rIn + thick, len = R(10, 30);
        const k = (rOut * rOut - rIn * rIn) * len;
        return grid(`A cylindrical metal pipe has an inner radius of ${rIn} centimeters, an outer radius of ${rOut} centimeters, and a length of ${len} centimeters. The volume of metal used to make the pipe is <i>k</i>π cubic centimeters. What is the value of <i>k</i>?`, k);
      },
      // 20. Полная площадь поверхности закрытого цилиндра (Total Surface Area = 2*pi*r^2 + 2*pi*r*h)
      () => {
        const r = R(3, 9), h = R(6, 18);
        const k = 2 * r * r + 2 * r * h;
        return g(`A closed right circular cylinder (including both circular bases) has a radius of ${r} feet and a height of ${h} feet. Its total surface area is <i>k</i>π square feet. What is the value of <i>k</i>?`, k);
      },
      // 21. Коронная задача Module 2: даны площади трех смежных граней параллелепипеда (xy, yz, xz), найти объем xyz!
      () => {
        const x = R(2, 6), y = R(3, 7), z = R(4, 8);
        const a1 = x * y, a2 = y * z, a3 = x * z;
        const vol = x * y * z;
        return g(`A rectangular prism has three adjacent faces with areas of ${a1}, ${a2}, and ${a3} square inches. What is the volume, in cubic inches, of the rectangular prism?`, vol);
      },
      // 22. Пространственная диагональ куба или параллелепипеда (3D Space Diagonal = sqrt(l^2 + w^2 + h^2))
      () => {
        // 3D Pythagorean quadruples: (3, 4, 12 -> 13), (2, 3, 6 -> 7), (4, 6, 12 -> 14), (6, 8, 24 -> 26), (1, 4, 8 -> 9)
        const [l, w, h, d] = getEl([[3, 4, 12, 13], [2, 3, 6, 7], [4, 6, 12, 14], [6, 8, 24, 26]]);
        return g(`What is the length, in inches, of the longest straight rod that can fit completely inside a rectangular box with interior dimensions ${l} inches by ${w} inches by ${h} inches?`, d);
      },
      // 23. Площадь равностороннего треугольника или правильного шестиугольника (Equilateral triangle area)
      () => {
        const s = R(2, 10) * 2;
        const k = (s * s) / 4;
        const ans = `${k}√3`;
        return g(`What is the area of an equilateral triangle with a side length of ${s} centimeters?`, ans, [
          ans,
          `${k * 2}√3`,
          `${s * s}√3`,
          `${k}√2`
        ]);
      },
      // 24. Прямая призма с нестандартным основанием (Trapezoidal or triangular prism volume = Base Area * length)
      () => {
        const b1 = R(4, 10), b2 = b1 + R(4, 10, 2), hTrap = R(4, 10), len = R(8, 20);
        const baseArea = ((b1 + b2) / 2) * hTrap;
        const vol = baseArea * len;
        return grid(`A water trough is in the shape of a right prism whose cross-sectional base is a trapezoid with parallel bases of ${b1} feet and ${b2} feet and a height of ${hTrap} feet. If the trough is ${len} feet long, what is its maximum volume, in cubic feet?`, vol);
      },
      // 25. Связь площади квадрата и длины его диагонали: Area = d^2 / 2
      () => {
        const d = R(4, 16, 2);
        const area = (d * d) / 2;
        return g(`If the diagonal of a square has a length of ${d} centimeters, what is the area, in square centimeters, of the square?`, area);
      },
      // 26. Нахождение радиуса основания конуса по известному объему и высоте
      () => {
        const r = R(3, 11), h = R(2, 7) * 3;
        const vCoeff = (r * r * h) / 3;
        return g(`A right circular cone has a volume of ${vCoeff}π cubic meters and a height of ${h} meters. What is the radius, in meters, of the base of the cone?`, r);
      },
      // 27. Нахождение ребра куба, у которого численно равны объем и площадь поверхности (s^3 = 6s^2 -> s = 6) или кратное соотношение
      () => {
        const k = R(1, 5); // Volume = k * Surface Area -> s^3 = 6*k*s^2 -> s = 6k
        const s = 6 * k;
        return g(`The volume of a cube, in cubic inches, is numerically equal to ${k} times its total surface area, in square inches. What is the edge length, in inches, of the cube?`, s);
      },
      // 28. Вырезание углов из прямоугольного листа и сгибание в открытую коробку (Open-top box volume)
      () => {
        const L = R(12, 24), W = R(10, 18), cut = R(2, 3);
        const boxL = L - 2 * cut, boxW = W - 2 * cut, boxH = cut;
        const vol = boxL * boxW * boxH;
        return grid(`An open-top rectangular box is made by cutting squares of side length ${cut} inches from each of the four corners of a ${L}-inch by ${W}-inch piece of cardboard and folding up the sides. What is the volume, in cubic inches, of the resulting box?`, vol);
      },
      // 29. Площадь ромба через его диагонали: Area = (d1 * d2) / 2
      () => {
        const d1 = R(6, 20, 2), d2 = R(8, 24, 2);
        return g(`A rhombus has diagonals of lengths ${d1} centimeters and ${d2} centimeters. What is the area, in square centimeters, of the rhombus?`, (d1 * d2) / 2);
      },
      // 30. Скорость наполнения 3D-резервуара (Volume + Rate + Density/Cost)
      () => {
        const l = R(4, 10), w = R(3, 8), h = R(2, 6);
        const vol = l * w * h;
        const rate = getEl([2, 3, 4, 6]); // make sure vol is divisible or pick clean dimensions
        const cleanL = rate * R(2, 4), cleanVol = cleanL * w * h;
        const time = cleanVol / rate;
        return g(`A rectangular aquarium has interior dimensions of ${cleanL} feet long, ${w} feet wide, and ${h} feet deep. If an empty aquarium is filled with water from a hose at a constant rate of ${rate} cubic feet per minute, how many minutes will it take to completely fill the aquarium?`, time);
      },
      () => { const b1=R(6,12), b2=b1+R(4,10,2), h=R(4,9), l=R(8,18); const vol = ((b1+b2)/2)*h*l; const fig = svgTrapPrism(`b₁ = ${b1}`, `b₂ = ${b2}`, `h = ${h}`, `l = ${l}`);
        return g(`${fig}The right trapezoidal prism shown above has parallel bases of lengths ${b1} meters and ${b2} meters, a perpendicular height of ${h} meters, and a length of ${l} meters. What is the volume, in cubic meters, of the prism?`, vol); },
      () => { const [r, h, l] = getEl([[3,4,5],[6,8,10],[5,12,13],[8,15,17]]); // Total surface area of closed cone = pi*r^2 + pi*r*l = pi*r*(r+l)
        const k=R(1,4), R_v=r*k, H_v=h*k, L_v=l*k; const ansK = R_v*R_v + R_v*L_v; const fig = svgCone(`r = ${R_v}`, `h = ${H_v}`, `l = ?`);
        return grid(`${fig}The right circular cone shown above has a base radius of ${R_v} centimeters and a vertical height of ${H_v} centimeters. The total surface area of the cone (including its circular base) is <i>k</i>π square centimeters, where <i>AT</i> = π<i>r</i>² + π<i>rl</i>. What is the value of <i>k</i>?`, ansK); },
      () => { const r=R(1,4)*3, hCyl=R(6,15); // Cylinder topped with a hemisphere: V = pi*r^2*h + (2/3)*pi*r^3
        const k = r*r*hCyl + (2*r*r*r)/3; const fig = svgCyl(`r = ${r}`, `h = ${hCyl}`);
        return g(`${fig}An observatory structure consists of a right circular cylinder of radius ${r} meters and height ${hCyl} meters (shown above) topped by a hemisphere of the exact same radius ${r} meters. The combined volume of the cylinder and hemisphere is <i>k</i>π cubic meters. What is the value of <i>k</i>?`, k); },
      () => { const [sHalf, h, slant] = getEl([[3,4,5],[6,8,10],[5,12,13],[8,15,17]]); const s = 2*sHalf; // Total surface area of right square pyramid = s^2 + 2*s*slant
        const totSA = s*s + 2*s*slant; const fig = svgPyramid(`s = ${s}`, `h = ${h}`, `l = ?`);
        return g(`${fig}The right square pyramid shown above has a square base of side length ${s} inches and a vertical height of ${h} inches. What is the <b>total surface area</b> (the area of the square base plus the area of all 4 triangular lateral faces), in square inches, of the pyramid?`, totSA); },
      () => { const r=R(3,9); // Sphere inscribed in a cylinder of radius r and height 2r: V_cyl = 2*pi*r^3, V_sphere = (4/3)*pi*r^3 -> empty space = (2/3)*pi*r^3. Ratio of sphere to cylinder is always 2/3!
        const R_v = R(1,5)*3; const diffK = (2*R_v*R_v*R_v)/3; const fig = svgCyl(`r = ${R_v}`, `h = ${2*R_v}`);
        return g(`${fig}A solid sphere of radius ${R_v} centimeters fits snugly inside a right circular cylinder of radius ${R_v} centimeters and height ${2*R_v} centimeters, touching the top, bottom, and sides. The volume of the empty space inside the cylinder not occupied by the sphere is <i>k</i>π cubic centimeters. What is the value of <i>k</i>?`, diffK); },
      () => { // Frustum of a pyramid or cone (Big cone minus small top cone using similarity 1:2 -> V_frustum = (7/8)*V_big)
        const rBig=R(2,5)*2, hBig=R(2,5)*6; // rSmall = rBig/2, hSmall = hBig/2 -> V_big = (1/3)*pi*rBig^2*hBig, V_small = V_big / 8 -> frustum = (7/8)*V_big
        const vBigK = (rBig*rBig*hBig)/3, frustumK = (7 * vBigK) / 8;
        return grid(`A right circular cone with base radius ${rBig} cm and height ${hBig} cm is sliced parallel to its base exactly halfway up its height (at ${hBig/2} cm), removing a smaller top cone of radius ${rBig/2} cm and height ${hBig/2} cm. The volume of the remaining bottom frustum is <i>k</i>π cubic centimeters. What is the value of <i>k</i>?`, frustumK); },
      () => { // Sector rolled into a cone: sector of radius L and angle theta -> cone slant height = L, base circumference 2*pi*r = (theta/360)*2*pi*L -> r = L*(theta/360)
        const [r, h, l] = getEl([[3,4,5],[6,8,10],[9,12,15]]); const deg = (r / l) * 360; const fig = svgCircleSector(`R = ${l}`, `${deg}°`);
        return g(`${fig}The shaded circular sector shown above has a radius of ${l} centimeters and a central angle of ${deg}°. When the two straight radial edges of the sector are joined together without overlap to form the lateral surface of a right circular cone (with slant height ${l} cm), what is the radius, in centimeters, of the circular base of the resulting cone?`, r); },
      () => { // Cylinder rolled from a rectangle of length 2*pi*r and height h
        const r=R(3,9), h=R(8,20);
        return g(`A rectangular sheet of metal measures ${2*r}π inches wide by ${h} inches tall. If the sheet is rolled up so that the two ${h}-inch edges meet without overlapping to form a right circular cylinder of height ${h} inches, what is the volume of the cylinder, divided by π?`, r*r*h); },
      () => { // L-shaped room floor area / volume with SVG
        const W=R(12,20), H=R(10,16), cutW=R(4,8), cutH=R(4,7); const area = W*H - cutW*cutH;
        const fig = gSvg(210, 145, `<polygon points="30,20 130,20 130,65 180,65 180,125 30,125" fill="#e8f7f4" stroke="#0f2b4a" stroke-width="2.5"/><text x="80" y="16" font-size="11" font-weight="bold" fill="#0f2b4a" text-anchor="middle">${W - cutW}</text><text x="155" y="60" font-size="11" font-weight="bold" fill="#e74c3c" text-anchor="middle">${cutW}</text><text x="22" y="75" font-size="11" font-weight="bold" fill="#0f2b4a" text-anchor="end">${H}</text><text x="188" y="98" font-size="11" font-weight="bold" fill="#1f9d8a">${H - cutH}</text>`);
        return g(`${fig}The L-shaped floor plan shown above has an overall width of ${W} meters and an overall height of ${H} meters, with a ${cutW}-meter by ${cutH}-meter rectangular corner removed. What is the area, in square meters, of the L-shaped floor?`, area); },
      () => { // Cube inscribed in a sphere: space diagonal of cube s*sqrt(3) = diameter 2R of sphere!
        const s=R(4,14); const d2 = 3*s*s; // R^2 = 3*s^2/4 -> Surface area of sphere = 4*pi*R^2 = 3*pi*s^2!
        const fig = svgBox(`${s}`, `${s}`, `${s}`, false);
        return grid(`${fig}A cube with edge length ${s} centimeters is inscribed inside a sphere so that all 8 vertices of the cube touch the inner surface of the sphere. Since the space diagonal of the cube (${s}√3 cm) equals the diameter of the sphere, the surface area of the sphere (4π<i>R</i>²) is equal to <i>k</i>π square centimeters. What is the value of <i>k</i>?`, 3*s*s); },
      () => { // Two similar cones/pyramids: given surface areas ratio a^2 : b^2, find volume!
        const a=2, b=3, k=R(2,6); const v1 = 8 * k, v2 = 27 * k;
        return g(`Two similar right circular cones have total surface areas in the ratio 4:9. If the smaller cone has a volume of ${v1}π cubic inches, what is the volume, divided by π, of the larger cone?`, v2); },
      () => { // Regular hexagon area from side length s: 6 equilateral triangles = 6 * (sqrt(3)/4)*s^2 = (3*sqrt(3)/2)*s^2
        const s=R(2,8)*2; const coeff = (3*s*s)/2;
        const fig = gSvg(170, 150, `<polygon points="85,18 140,48 140,102 85,132 30,102 30,48" fill="#f0fbf8" stroke="#0f2b4a" stroke-width="2.5"/><line x1="85" y1="75" x2="140" y2="48" stroke="#1f9d8a" stroke-width="1.8" stroke-dasharray="4,3"/><line x1="85" y1="75" x2="140" y2="102" stroke="#1f9d8a" stroke-width="1.8" stroke-dasharray="4,3"/><circle cx="85" cy="75" r="3" fill="#0f2b4a"/><text x="148" y="79" font-size="12" font-weight="bold" fill="#0f2b4a">${s}</text>`);
        return g(`${fig}A regular hexagon has a side length of ${s} centimeters, as shown above. By dividing the hexagon into 6 congruent equilateral triangles meeting at the center, what is the total area, in square centimeters, of the regular hexagon?`, `${coeff}√3`, [`${coeff}√3`, `${s*s}√3`, `${coeff/3}√3`, `${2*s*s}√3`]); },
      () => { // Rectangular tank tilted or partially filled: transferring water from rectangular prism to another
        const l1=R(8,16), w1=R(6,12), hWater=R(4,9); const l2=l1/2, w2=w1/2; // Since base area of tank 2 is 1/4 of tank 1, height is 4 * hWater!
        const L1=R(4,9)*2, W1=R(3,7)*2, H1=R(3,8);
        return g(`A rectangular tank with a base measuring ${L1} feet by ${W1} feet is filled with water to a depth of ${H1} feet. If all of this water is poured into a second, narrower rectangular tank whose base measures ${L1/2} feet by ${W1/2} feet, what will be the depth, in feet, of the water in the second tank?`, 4 * H1); },
      () => { // Painting a room (4 walls + ceiling, excluding floor and windows)
        const l=R(12,20), w=R(10,16), h=R(8,12), winArea=R(20,45); const paintArea = 2*(l+w)*h + l*w - winArea;
        return g(`A rectangular room measures ${l} feet long, ${w} feet wide, and ${h} feet high. A painter plans to paint the 4 vertical walls and the ceiling (but <b>not</b> the floor). If the walls contain doors and windows with a combined area of ${winArea} square feet that will not be painted, what is the total area, in square feet, that will be painted?`, paintArea); },
      () => { // Mass of a hollow spherical shell or cylinder given density
        const r=R(2,5), h=R(5,12), dens=R(3,8); // Cylinder volume = pi*r^2*h -> if mass = dens * V = k*pi grams, find k
        return grid(`A solid titanium rod is shaped like a right circular cylinder with a diameter of ${2*r} centimeters and a length of ${h} centimeters. If the titanium has a density of ${dens} grams per cubic centimeter, the total mass of the rod is <i>k</i>π grams. What is the value of <i>k</i>?`, r*r*h*dens); },
      () => { // Coordinate geometry polygon area (Triangle with vertices on grid)
        const b=R(4,10), h=R(4,10); const gr=svg(`<polygon points="${tX(-3)},${tY(-2)} ${tX(-3+b)},${tY(-2)} ${tX(1)},${tY(-2+h)}" fill="rgba(34,163,129,0.25)" stroke="#0f2b4a" stroke-width="2.5"/><circle cx="${tX(-3)}" cy="${tY(-2)}" r="4" fill="#e74c3c"/><circle cx="${tX(-3+b)}" cy="${tY(-2)}" r="4" fill="#e74c3c"/><circle cx="${tX(1)}" cy="${tY(-2+h)}" r="4" fill="#e74c3c"/>`);
        return g(`${gr}In the <i>xy</i>-plane above, a triangle has vertices at (-3, -2), (${-3+b}, -2), and (1, ${-2+h}). What is the area, in square units, of the triangle?`, (b*h)/2); },
      () => { // Diagonal of a face vs space diagonal of a cube -> finding volume from face diagonal d = s*sqrt(2)
        const s=R(3,10); const fig = svgBox(`s`, `s`, `s`, false);
        return g(`${fig}Each of the 6 square faces of a cube has a face diagonal of length ${s}√2 centimeters. What is the volume, in cubic centimeters, of the cube?`, s*s*s); },
      () => { // Isosceles trapezoid area where legs and bases are given (must use Pythagorean theorem to find height!)
        // Use triple (3,4,5) or (5,12,13) or (6,8,10): top base b1, bottom base b2 = b1 + 2*a, leg = c -> height = b!
        const [a, h, leg] = getEl([[3,4,5],[6,8,10],[5,12,13]]); const b1=R(6,16), b2=b1+2*a; const area = ((b1+b2)/2)*h;
        const fig = gSvg(230, 140, `<polygon points="35,115 195,115 160,35 70,35" fill="#f0fbf8" stroke="#0f2b4a" stroke-width="2.5"/><line x1="70" y1="35" x2="70" y2="115" stroke="#1f9d8a" stroke-width="2" stroke-dasharray="4,3"/><rect x="70" y="105" width="10" height="10" fill="none" stroke="#1f9d8a" stroke-width="1.5"/><text x="115" y="28" font-size="12" font-weight="bold" fill="#0f2b4a" text-anchor="middle">${b1}</text><text x="115" y="132" font-size="12" font-weight="bold" fill="#0f2b4a" text-anchor="middle">${b2}</text><text x="42" y="72" font-size="12" font-weight="bold" fill="#e74c3c" text-anchor="end">${leg}</text><text x="188" y="72" font-size="12" font-weight="bold" fill="#e74c3c">${leg}</text>`);
        return g(`${fig}The isosceles trapezoid shown above has parallel bases of lengths ${b1} cm and ${b2} cm, and non-parallel legs each of length ${leg} cm. What is the area, in square centimeters, of the trapezoid?`, area); },
      () => { // Melted cones: how many small cones of radius r and height h can be formed by melting a cylinder of radius 2r and height 3h?
        // V_cyl = pi*(4r^2)*(3h) = 12*pi*r^2*h. V_cone = (1/3)*pi*r^2*h -> ratio = 12 / (1/3) = 36!
        const mR=R(2,3), mH=R(2,4); const count = 3 * mR * mR * mH;
        return grid(`A solid metal cylinder with radius ${mR}<i>r</i> and height ${mH}<i>h</i> is melted down and recast into identical solid right circular cones, each with radius <i>r</i> and height <i>h</i>. How many of these cones can be made from the cylinder?`, count); },
      () => { // Area of a shaded triangle inscribed in a rectangle
        const W=R(10,18), H=R(8,14); // Rectangle W*H, triangle has base W and height H -> area = W*H/2
        const fig = gSvg(210, 135, `<rect x="30" y="20" width="150" height="90" fill="#ffffff" stroke="#0f2b4a" stroke-width="2.5"/><polygon points="30,110 180,110 95,20" fill="rgba(34,163,129,0.3)" stroke="#1f9d8a" stroke-width="2.2"/><text x="105" y="126" font-size="12" font-weight="bold" fill="#0f2b4a" text-anchor="middle">${W}</text><text x="190" y="68" font-size="12" font-weight="bold" fill="#0f2b4a">${H}</text>`);
        return g(`${fig}In the figure above, the vertices of the shaded triangle lie on the base and the top edge of a rectangle with width ${W} and height ${H}. What is the area of the unshaded region inside the rectangle?`, (W*H)/2); }
    ],
    // === Topic 17: Lines, angles, triangles ===
    [
      // 1. Bluebook Hard (image_8.png): Perimeter of a right isosceles triangle is P + P*sqrt(2), find hypotenuse (with SVG)
      () => {
        const P = R(12, 140) * 2;
        const fig = svgRightTri(`x`, `x`, `c = ?`, `45°`, `45°`);
        return g(`${fig}The perimeter of a right isosceles triangle is ${P} + ${P}√2. What is the length of the hypotenuse?`, P);
      },
      // 2. Bluebook Hard (image_8.png MCQ variant): Perimeter of right isosceles triangle is P + P*sqrt(2), find leg or hypotenuse
      () => {
        const P = R(14, 130) * 2;
        const fig = svgRightTri(`x`, `x`, `c`, `45°`, `45°`);
        return g(`${fig}The perimeter of a right isosceles triangle is ${P} + ${P}√2. What is the length of one of its legs?`, `${P/2}√2`, [
          `${P/2}√2`,
          String(P),
          String(P/2),
          `${P}√2`
        ]);
      },
      // 3. Parallel lines cut by a transversal with SVG figure and algebraic angles
      () => {
        const x = R(8, 28), a = R(2, 5), b = R(10, 35);
        const acute = R(42, 78), obtuse = 180 - acute;
        const fig = svgParallelTrans(`${obtuse}°`, `x°`);
        return g(`${fig}In the figure above, lines <i>l</i> and <i>m</i> are parallel. What is the value of <i>x</i>?`, acute);
      },
      // 4. Isosceles triangle vertex angle with SVG figure
      () => {
        const a = R(22, 76) * 2;
        const fig = svgSimSplit(`s`, ``, `s`, ``, ``, ``);
        return g(`The vertex angle of an isosceles triangle measures ${a}°. What is the measure, in degrees, of one of the two congruent base angles?`, (180 - a) / 2);
      },
      () => { const s1=R(8,18), s2=R(10,24); return g(`A triangle has sides of length ${s1} and ${s2}. The third side must be strictly between which two values?`, `${s2-s1} and ${s1+s2}`, [`${s2-s1} and ${s1+s2}`, `0 and ${s1+s2}`, `${s1} and ${s2}`, `1 and 100`]); },
      () => { const k=R(3,7), a=R(4,8), b=R(5,9), c=R(6,12); return grid(`A triangle has sides ${a}, ${b}, and ${c}. A similar triangle has its longest side equal to ${c*k}. What is the length of its shortest side?`, a*k); },
      // 7. Внешний угол треугольника (Exterior Angle Theorem) с SVG
      () => {
        const in1 = R(32, 78), in2 = R(38, 84);
        const ext = in1 + in2;
        const fig = svgExtAngle(`${in1}°`, `${in2}°`, `x°`);
        return g(`${fig}In the triangle shown above, two remote interior angles measure ${in1}° and ${in2}°. What is the measure, in degrees, of the exterior angle <i>x</i>°?`, ext);
      },
      // 8. Внешний угол с алгебраическими выражениями с SVG
      () => {
        const x = R(7, 26);
        const c1 = R(12, 45);
        const in1 = 3 * x, in2 = 2 * x + c1;
        const ext = in1 + in2;
        const fig = svgExtAngle(`3x°`, `(2x + ${c1})°`, `${ext}°`);
        return g(`${fig}In the figure above, an exterior angle of a triangle measures ${ext}° and its two remote interior angles measure 3<i>x</i>° and (2<i>x</i> + ${c1})°. What is the value of <i>x</i>?`, x);
      },
      // 9. Параллельные прямые и секущая (Parallel lines cut by a transversal) с SVG
      () => {
        const obtuse = R(102, 156);
        const acute = 180 - obtuse;
        const fig = svgParallelTrans(`y°`, `${acute}°`);
        return g(`${fig}In the figure above, lines <i>l</i> and <i>m</i> are parallel and are intersected by a transversal line. If the acute angle shown measures ${acute}°, what is the value of <i>y</i>?`, obtuse);
      },
      // 10. Сумма углов многоугольника (Polygon Angle Sum Theorem: (n - 2) * 180)
      () => {
        const sides = getEl([5, 6, 7, 8, 10]); // Pentagon, Hexagon, Heptagon, Octagon, Decagon
        const sumAngles = (sides - 2) * 180;
        return grid(`What is the sum, in degrees, of the interior angle measures of a convex ${sides === 5 ? 'pentagon' : sides === 6 ? 'hexagon' : sides === 8 ? 'octagon' : sides + '-gon'}?`, sumAngles);
      },
      // 11. Нахождение количества возможных целых значений для третьей стороны (Integer perimeter range)
      () => {
        const s1 = R(7, 12), s2 = R(10, 16);
        const minS = s2 - s1 + 1, maxS = s1 + s2 - 1;
        const count = maxS - minS + 1;
        return g(`Two sides of a triangle have lengths ${s1} and ${s2}. If the third side has an integer length <i>x</i>, how many possible integer values can <i>x</i> take?`, count);
      },
      // 12. Прямоугольный треугольник 30°-60°-90°: найти катет напротив 30° по гипотенузе
      () => {
        const hyp = R(6, 20, 2);
        const shortLeg = hyp / 2;
        return g(`A right triangle has a hypotenuse of length ${hyp} centimeters, and one of its acute angles measures 30°. What is the length, in centimeters, of the leg opposite the 30° angle?`, shortLeg);
      },
      // 13. Прямоугольный треугольник 30°-60°-90°: найти длинный катет напротив 60°
      () => {
        const shortLeg = R(3, 9);
        const ans = `${shortLeg}√3`;
        return g(`In a 30°-60°-90° right triangle, the length of the shorter leg is ${shortLeg} centimeters. What is the length of the longer leg?`, ans, [
          ans,
          `${shortLeg * 2}√3`,
          `${shortLeg}√2`,
          `${shortLeg * 3}`
        ]);
      },
      // 14. Равнобедренный прямоугольный треугольник 45°-45°-90°: по гипотенузе найти катет
      () => {
        const leg = R(4, 12);
        const hyp = leg * Math.sqrt(2);
        const ans = `${leg}√2`;
        return g(`An isosceles right triangle has legs of length ${leg} inches each. What is the exact length of the hypotenuse?`, ans, [
          ans,
          `${leg * 2}`,
          `${leg}√3`,
          `${leg * 2}√2`
        ]);
      },
      // 15. Hard SAT: Отношение площадей подобных треугольников (Square of scale factor!)
      () => {
        const k = R(2, 5), areaSmall = R(12, 30);
        const areaLarge = areaSmall * k * k;
        return g(`Triangle A and Triangle B are similar, with the ratio of the length of each side of Triangle A to the corresponding side of Triangle B being 1:${k}. If the area of Triangle A is ${areaSmall} square inches, what is the area, in square inches, of Triangle B?`, areaLarge);
      },
      // 16. Обратная задача на площади подобных фигур: дано отношение площадей, найти отношение периметров (scale factor k)
      () => {
        const k = R(2, 4), ratioArea = k * k;
        return grid(`Two similar polygons have areas in the ratio 1:${ratioArea}. If the perimeter of the smaller polygon is ${R(15, 30)} centimeters, what is the perimeter of the larger polygon? `, 20 * k);
      },
      // 17. Свойства углов равнобедренного треугольника в сложной конфигурации (Два равных угла у основания)
      () => {
        const baseAngle = R(50, 70);
        const vertexAngle = 180 - 2 * baseAngle;
        return g(`In an isosceles triangle, the two base angles are congruent. If each base angle measures ${baseAngle}°, what is the measure, in degrees, of the vertex angle?`, vertexAngle);
      },
      // 18. Сумма внешних углов любого выпуклого многоугольника всегда равна 360°
      () => {
        const sides = getEl([5, 7, 9, 12, 15]);
        return g(`What is the sum, in degrees, of the exterior angles (one at each vertex) of any convex ${sides}-sided polygon?`, 360);
      },
      // 19. Теорема Фалеса / Пропорциональные отрезки в треугольнике (Midsegment theorem)
      () => {
        const base = R(16, 32, 2);
        const midsegment = base / 2;
        return g(`A line segment connects the midpoints of two sides of a triangle. If the length of the third side (the base) is ${base} inches, what is the length, in inches, of this midsegment?`, midsegment);
      },
      // 20. Координатная геометрия: расстояние между двумя точками на плоскости (Pythagorean distance)
      () => {
        // Points: (1, 2) and (1 + dx, 2 + dy) where dx, dy form a Pythagorean triple (3,4,5), (5,12,13), (6,8,10)
        const triples = [[3, 4, 5], [5, 12, 13], [6, 8, 10], [9, 12, 15]];
        const [dx, dy, dist] = getEl(triples);
        const x1 = R(1, 5), y1 = R(1, 5);
        return grid(`In the <i>xy</i>-plane, what is the distance between the points (${x1}, ${y1}) and (${x1 + dx}, ${y1 + dy})?`, dist);
      },
      // 21. Координатная геометрия: координаты середины отрезка (Midpoint formula)
      () => {
        const x1 = R(-6, 4, 2), x2 = x1 + R(4, 10, 2);
        const y1 = R(-6, 4, 2), y2 = y1 + R(4, 10, 2);
        const midX = (x1 + x2) / 2, midY = (y1 + y2) / 2;
        return g(`In the <i>xy</i>-plane, what is the <i>x</i>-coordinate of the midpoint of the line segment with endpoints (${x1}, ${y1}) and (${x2}, ${y2})?`, midX);
      },
      // 22. Нахождение периметра прямоугольного треугольника по двум катетам
      () => {
        const triples = [[3, 4, 5], [5, 12, 13], [6, 8, 10], [9, 12, 15]];
        const [a, b, c] = getEl(triples);
        const perim = a + b + c;
        return g(`A right triangle has legs of length ${a} and ${b} centimeters. What is the total perimeter, in centimeters, of the triangle?`, perim);
      },
      // 23. Высота прямоугольного треугольника к гипотенузе (Geometric Mean Theorem)
      () => {
        // Let's use a standard clean problem: Area = (1/2)*a*b = (1/2)*hyp * height -> height = (a*b)/hyp
        const [a, b, c] = [6, 8, 10];
        const height = (a * b) / c;
        return g(`In a right triangle with legs of length 6 and 8 centimeters and a hypotenuse of length 10 centimeters, what is the length, in centimeters, of the altitude drawn to the hypotenuse?`, height);
      },
      // 24. Угол между часовой и минутной стрелкой часов (или геометрический поворот)
      () => {
        const hours = R(2, 5);
        const angle = hours * 30; // 360 deg / 12 hours = 30 deg per hour
        return grid(`At exactly ${hours}:00, what is the measure, in degrees, of the smaller angle formed by the hour hand and the minute hand on a standard clock face?`, angle);
      },
      // 25. Сложная задача Module 2: соотношение площадей частей внутри треугольника при делении медианой
      () => {
        const totalArea = R(40, 100, 10);
        const halfArea = totalArea / 2;
        return g(`A triangle has a total area of ${totalArea} square centimeters. A median is drawn from one vertex to the midpoint of the opposite side, dividing the triangle into two smaller triangles. What is the area, in square centimeters, of either of the two smaller triangles?`, halfArea);
      },
      // 26. Вписанный угол в окружность опирается на диаметр (Thales's theorem: angle inscribed in a semicircle is 90°)
      () => {
        return g(`A triangle is inscribed in a circle such that one of its sides is a diameter of the circle. What is the measure, in degrees, of the angle opposite to that diameter?`, 90);
      },
      // 27. Соотношение сторон в треугольнике по углам (Largest side opposite largest angle)
      () => {
        const ans = "Side BC (opposite the 80° angle)";
        return g(`Triangle ABC has angle measures of ∠A = 50°, ∠B = 50°, and ∠C = 80°. Which of the following sides of the triangle is the longest?`, ans, [
          ans,
          "Side AB (opposite the 50° angle)",
          "Side AC (opposite the 50° angle)",
          "All three sides are equal in length"
        ]);
      },
      // 28. Теорема о пропорциональных отрезках (Triangle Proportionality / Side-Splitter Theorem) с SVG
      () => {
        const a1 = R(5, 18), mult = R(2, 6), b1 = a1 * mult, c1 = R(6, 22), x = c1 * mult;
        const fig = svgSimSplit(`${a1}`, `${b1}`, `${c1}`, `x`, ``, ``);
        return g(`${fig}In triangle <i>ABC</i> above, segment <i>DE</i> is parallel to base <i>BC</i>. If <i>AD</i> = ${a1}, <i>DB</i> = ${b1}, and <i>AE</i> = ${c1}, what is the length of segment <i>EC</i> (labeled <i>x</i>)?`, x);
      },
      // 29. Свойства правильного шестиугольника (Regular hexagon split into 6 equilateral triangles)
      () => {
        const side = R(4, 12);
        const perimeter = 6 * side;
        return grid(`A regular hexagon has a side length of ${side} centimeters. What is the total perimeter, in centimeters, of the hexagon?`, perimeter);
      },
      // 30. Максимально сложный Hard SAT: Нахождение периметра сложной составной фигуры из двух треугольников
      () => {
        // Shared leg = 12 (from 9-12-15 and 5-12-13 triangles)
        // Triangle 1: legs 9, 12 -> hyp 15. Triangle 2: legs 12, 5 -> hyp 13. Outer perimeter = 9 + 5 + 15 + 13 = 42
        const shared = 12, l1 = 9, l2 = 5, h1 = 15, h2 = 13;
        const outerPerim = l1 + l2 + h1 + h2;
        return g(`Two right triangles share a common leg of length ${shared} centimeters. The other leg of the first triangle is ${l1} centimeters, and the other leg of the second triangle is ${l2} centimeters. What is the total perimeter, in centimeters, of the outer boundary formed by combining the two triangles along their shared leg?`, outerPerim);
      },
      () => { // Altitude to hypotenuse geometric mean: CD^2 = AD * DB
        const pairs = [[4, 9, 6], [4, 16, 8], [9, 16, 12], [2, 8, 4], [3, 12, 6], [5, 20, 10]]; const [ad, db, cd] = getEl(pairs);
        const fig = svgRightAlt(`AD = ${ad}`, `DB = ${db}`, `h = ?`);
        return g(`${fig}In right triangle <i>ABC</i> above, ∠<i>C</i> is a right angle and <i>CD</i> is the altitude to hypotenuse <i>AB</i>. If <i>AD</i> = ${ad} and <i>DB</i> = ${db}, what is the length of altitude <i>CD</i>?`, cd); },
      () => { // Leg geometric mean in right triangle with altitude: AC^2 = AD * AB
        const [ad, ab, ac] = getEl([[4, 9, 6], [4, 25, 10], [9, 25, 15], [3, 12, 6], [5, 20, 10]]); const db = ab - ad;
        const fig = svgRightAlt(`${ad}`, `${db}`, ``, `AC = ?`, ``);
        return g(`${fig}In right triangle <i>ABC</i> above, ∠<i>C</i> is a right angle and <i>CD</i> is perpendicular to hypotenuse <i>AB</i>. If <i>AD</i> = ${ad} and <i>DB</i> = ${db}, what is the length of leg <i>AC</i>?`, ac); },
      () => { // Similar triangles with parallel line DE: given DE/BC = k, find area of trapezoid DBCE!
        const k=R(2,3); // AD:AB = 1:k -> Area(ADE) : Area(ABC) = 1 : k^2 -> Area(trapezoid DBCE) = (k^2 - 1) * Area(ADE)
        const aTop = R(6,18), ratio = getEl([2, 3]); const aTrap = aTop * (ratio*ratio - 1);
        const fig = svgSimSplit(`1`, `${ratio-1}`, ``, ``, `D — E`, `B ———— C`);
        return grid(`${fig}In triangle <i>ABC</i> above, segment <i>DE</i> is parallel to base <i>BC</i>, and the ratio of <i>AD</i> to <i>AB</i> is 1:${ratio}. If the area of small triangle <i>ADE</i> is ${aTop} square centimeters, what is the area, in square centimeters, of trapezoid <i>DBCE</i>?`, aTrap); },
      () => { // Hourglass / Bowtie similar triangles across parallel lines
        const topB=R(4,9), mult=R(2,4), botB=topB*mult, topLeg=R(3,8), botLeg=topLeg*mult;
        const fig = gSvg(220, 165, `<line x1="45" y1="30" x2="175" y2="30" stroke="#0f2b4a" stroke-width="2.5"/><line x1="25" y1="135" x2="195" y2="135" stroke="#0f2b4a" stroke-width="2.5"/><line x1="45" y1="30" x2="195" y2="135" stroke="#1f9d8a" stroke-width="2.2"/><line x1="175" y1="30" x2="25" y2="135" stroke="#1f9d8a" stroke-width="2.2"/><text x="110" y="23" font-size="12" font-weight="bold" fill="#0f2b4a" text-anchor="middle">AB = ${topB}</text><text x="110" y="152" font-size="12" font-weight="bold" fill="#0f2b4a" text-anchor="middle">CD = ${botB}</text><text x="72" y="60" font-size="11.5" font-weight="bold" fill="#e74c3c" text-anchor="end">${topLeg}</text><text x="155" y="102" font-size="12" font-weight="bold" fill="#e74c3c">x</text>`);
        return g(`${fig}In the figure above, segment <i>AB</i> is parallel to segment <i>CD</i>, and segments <i>AD</i> and <i>BC</i> intersect at point <i>E</i>. If <i>AB</i> = ${topB}, <i>CD</i> = ${botB}, and <i>AE</i> = ${topLeg}, what is the total length of segment <i>AD</i> (which equals <i>AE</i> + <i>ED</i>)?`, topLeg + botLeg); },
      () => { // Angle bisector theorem in a triangle: BD / DC = AB / AC
        const ab=R(3,7)*2, ac=R(4,9)*2, k=gcd(ab,ac); const u=ab/k, v=ac/k, mult=R(2,5); const bd=u*mult, dc=v*mult, bc=bd+dc;
        return g(`In triangle <i>ABC</i>, the angle bisector of ∠<i>A</i> intersects side <i>BC</i> at point <i>D</i>. By the Angle Bisector Theorem, <f><i>BD</i>/<i>DC</i></f> = <f><i>AB</i>/<i>AC</i></f>. If <i>AB</i> = ${ab}, <i>AC</i> = ${ac}, and the total length of side <i>BC</i> is ${bc}, what is the length of segment <i>BD</i>?`, bd); },
      () => { // Parallel lines with "M-angle" / Crook problem (two parallel lines and a bent transversal in the middle)
        const a1=R(28,54), a2=R(32,58); const midAng = a1 + a2;
        const fig = gSvg(230, 155, `<line x1="25" y1="28" x2="205" y2="28" stroke="#0f2b4a" stroke-width="2.5"/><line x1="25" y1="128" x2="205" y2="128" stroke="#0f2b4a" stroke-width="2.5"/><polyline points="75,28 140,78 85,128" fill="none" stroke="#1f9d8a" stroke-width="2.5"/><text x="108" y="44" font-size="11.5" font-weight="bold" fill="#1f9d8a">${a1}°</text><text x="115" y="122" font-size="11.5" font-weight="bold" fill="#1f9d8a">${a2}°</text><text x="118" y="82" font-size="12.5" font-weight="bold" fill="#e74c3c" text-anchor="end">x°</text>`);
        return g(`${fig}In the figure above, the top and bottom horizontal lines are parallel. What is the value of <i>x</i>?`, midAng); },
      () => { // Regular polygon interior angle measure: (n - 2)*180 / n
        const [name, n, intAng] = getEl([["pentagon", 5, 108], ["hexagon", 6, 120], ["octagon", 8, 135], ["decagon", 10, 144], ["dodecagon", 12, 150]]);
        return grid(`What is the measure, in degrees, of each interior angle of a regular ${name} (${n} congruent sides and ${n} congruent interior angles)?`, intAng); },
      () => { // Regular polygon number of sides from exterior angle: 360 / ext
        const ext = getEl([15, 18, 20, 24, 30, 36, 40, 45]); const n = 360 / ext;
        return g(`Each exterior angle of a regular polygon measures ${ext}°. How many sides does this regular polygon have?`, n); },
      () => { // Centroid (intersection of medians) divides each median in a 2:1 ratio
        const shortPart=R(4,14); const fullMedian = 3 * shortPart;
        return g(`In triangle <i>ABC</i>, the three medians intersect at the centroid <i>G</i>. If the distance from vertex <i>A</i> to the centroid <i>G</i> is ${2*shortPart} centimeters, what is the total length, in centimeters, of the median drawn from vertex <i>A</i> to the midpoint of side <i>BC</i>?`, fullMedian); },
      () => { // Overlapping right triangles sharing an acute angle
        const [a,b,c] = getEl([[3,4,5],[5,12,13],[8,15,17]]); const k1=2, k2=5;
        const fig = svgSimSplit(`${a*k1}`, `${a*(k2-k1)}`, `${c*k1}`, ``, `${b*k1}`, `x`);
        return g(`${fig}In the figure above, segment <i>DE</i> is parallel to base <i>BC</i>. If <i>AD</i> = ${a*k1}, <i>DB</i> = ${a*(k2-k1)}, and <i>DE</i> = ${b*k1}, what is the length of base <i>BC</i> (labeled <i>x</i>)?`, b*k2); },
      () => { // Isosceles triangle chain: AB = BD = DC, find angle!
        // Let angle C = c. Since BD = DC, angle DBC = c, so exterior angle ADB = 2c. Since AB = BD, angle BAD = 2c. If we ask for angle ABD = 180 - 4c
        const c = R(22, 38); const angABD = 180 - 4*c;
        return grid(`In triangle <i>ABC</i>, point <i>D</i> lies on side <i>AC</i> such that <i>AB</i> = <i>BD</i> = <i>DC</i>. If ∠<i>C</i> = ${c}°, what is the measure, in degrees, of ∠<i>ABD</i>?`, angABD); },
      () => { // Parallelogram consecutive angles: A + B = 180
        const x=R(12,28), a=3, b=2, c1=180 - 5*x;
        return g(`In parallelogram <i>ABCD</i>, angle <i>A</i> and angle <i>B</i> are consecutive interior angles. If ∠<i>A</i> = (3<i>x</i> + ${c1})° and ∠<i>B</i> = 2<i>x</i>°, what is the measure, in degrees, of angle <i>B</i>?`, 2*x); },
      () => { // Rhombus perimeter from diagonals (diagonals are perpendicular bisectors!)
        const [a,b,c] = getEl([[3,4,5],[5,12,13],[8,15,17],[6,8,10]]); const d1=2*a, d2=2*b, perim=4*c;
        return g(`The diagonals of a rhombus have lengths of ${d1} centimeters and ${d2} centimeters. Since the diagonals of a rhombus are perpendicular bisectors of each other, what is the perimeter, in centimeters, of the rhombus?`, perim); },
      () => { // Triangle inequality with algebraic side lengths: sides 2x, 3x, and 20 -> 3x - 2x < 20 -> x < 20, and 2x + 3x > 20 -> x > 4
        const c=R(3,8)*5; const minInt = c/5 + 1, maxInt = c - 1;
        return g(`A non-degenerate triangle has side lengths of 2<i>x</i>, 3<i>x</i>, and ${c}. If <i>x</i> is an integer, what is the smallest possible value of <i>x</i>?`, minInt); },
      () => { // Vertical angles and linear pair system: 3x + y = 180 and 2x - y = 20
        const x=R(25,45), y=180 - 3*x; const diff = 2*x - y;
        return grid(`Two lines intersect to form four angles. Two adjacent supplementary angles measure 3<i>x</i>° and <i>y</i>°, and one of the vertical angles opposite to the 3<i>x</i>° angle measures (2<i>x</i> + ${x})°. What is the value of <i>y</i>?`, y); },
      () => { // Sum of two remote interior angles in a star or crossed-triangle configuration
        const a=R(35,65), b=R(40,60), c=R(25,45); // Boomerang / Concave quadrilateral: exterior reflex angle at dent = a + b + c
        return g(`In a concave ("boomerang"-shaped) quadrilateral <i>ABCD</i>, the three interior acute angles at vertices <i>A</i>, <i>B</i>, and <i>C</i> measure ${a}°, ${b}°, and ${c}°, respectively. What is the measure, in degrees, of the exterior acute/obtuse angle formed at the indented vertex <i>D</i> (which equals ∠<i>A</i> + ∠<i>B</i> + ∠<i>C</i>)?`, a + b + c); },
      () => { // Shadow similarity problem with person walking away from a lamppost
        const lampH=R(15,25), personH=5, dist=R(8,20); // s / (s + dist) = personH / lampH -> (lampH - personH)*s = personH*dist
        const k=R(2,5), pH=6, lH=6*(k+1), d=R(3,9)*k; const shadow = d / k;
        return g(`A streetlight is ${lH} feet tall. A person who is ${pH} feet tall stands ${d} feet away from the base of the streetlight. How many feet long is the shadow cast by the person on the level ground?`, shadow); },
      () => { // Midpoint coordinates backwards: given endpoint A and midpoint M, find endpoint B
        const ax=R(-8,4), ay=R(-6,5), mx=R(2,10), my=R(3,11); const bx = 2*mx - ax, by = 2*my - ay;
        return g(`In the <i>xy</i>-plane, point <i>M</i>(${mx}, ${my}) is the midpoint of line segment <i>AB</i>. If point <i>A</i> has coordinates (${ax}, ${ay}), what is the sum of the <i>x</i>- and <i>y</i>-coordinates of point <i>B</i>?`, bx + by); },
      () => { // Ratio of segments along a line (Collinear point dividing segment in ratio a:b)
        const x1=2, y1=3, k=R(2,5), dx=R(2,4), dy=R(2,5); const x2 = x1 + (k+1)*dx, y2 = y1 + (k+1)*dy; const px = x1 + dx, py = y1 + dy;
        return grid(`In the <i>xy</i>-plane, point <i>P</i> lies on line segment <i>AB</i> between <i>A</i>(${x1}, ${y1}) and <i>B</i>(${x2}, ${y2}) such that the ratio of <i>AP</i> to <i>PB</i> is 1:${k}. What is the <i>x</i>-coordinate of point <i>P</i>?`, px); },
      () => { // Equilateral triangle altitude h = s*sqrt(3)/2 -> perimeter from altitude
        const halfS=R(4,15); const s=2*halfS, perim=3*s;
        return g(`An equilateral triangle has an altitude (height) of length ${halfS}√3 centimeters. What is the perimeter, in centimeters, of the equilateral triangle?`, perim); }
    ],
    // === Topic 18: Right triangles and trigonometry ===
    [
      // 1. Bluebook Hard (image.png exact style): Right triangle ABC with hypotenuse c and angle C = 30° or 60°, find tan A, sin A, or cos A
      () => {
        const hyp = R(32, 240) * 2;
        const variant = R(0, 2);
        if (variant === 0) {
          const fig = svgRightTri(``, ``, `${hyp}`, `30°`, ``);
          return g(`${fig}In the right triangle shown, what is the value of tan <i>A</i>?`, `√3`, [
            `√3`,
            `<f>√3/3</f>`,
            `<f>1/2</f>`,
            `${hyp/2}√3`
          ]);
        } else if (variant === 1) {
          const fig = svgRightTri(``, ``, `${hyp}`, `30°`, ``);
          return g(`${fig}In the right triangle shown, what is the value of cos <i>A</i>?`, 0.5);
        } else {
          const fig = svgRightTri(``, ``, `${hyp}`, `60°`, ``);
          return g(`${fig}In the right triangle shown, what is the value of tan <i>A</i>?`, `<f>√3/3</f>`, [
            `<f>√3/3</f>`,
            `√3`,
            `<f>√3/2</f>`,
            `${hyp/2}`
          ]);
        }
      },
      // 2. Bluebook Hard (image_3.png exact style): For two acute angles Q and R, cos Q = sin R, Q = ax + b, R = cx + d, find x
      () => {
        const a = R(1, 5), c = R(2, 7), x = R(6, 32);
        const sumAngles = (a + c) * x;
        // Make b + d = 90 - (a+c)*x; pick x, a, c so (a+c)*x < 82
        const aC = getEl([[1, 4], [1, 3], [2, 3], [1, 5], [2, 5], [3, 4]]);
        const A = aC[0], C = aC[1];
        const X = R(5, Math.floor(80 / (A + C)));
        const rem = 90 - (A + C) * X;
        const B = R(3, rem - 2), D = rem - B;
        const termA = A === 1 ? `<i>x</i> + ${B}` : `${A}<i>x</i> + ${B}`;
        const termC = `${C}<i>x</i> + ${D}`;
        return g(`For two acute angles, ∠<i>Q</i> and ∠<i>R</i>, cos <i>Q</i> = sin <i>R</i>. The measures, in degrees, of ∠<i>Q</i> and ∠<i>R</i> are ${termA} and ${termC}, respectively. What is the value of <i>x</i>?`, String(X), [
          String(X),
          String(X - 4),
          String(X + 18),
          String(90 - X)
        ]);
      },
      // 3. Bluebook Hard (image_3.png Grid variant): cos Q = sin R with linear expressions in x (Grid-in)
      () => {
        const [A, C] = getEl([[1, 4], [2, 3], [1, 5], [3, 5], [2, 7]]);
        const X = R(4, Math.floor(82 / (A + C)));
        const rem = 90 - (A + C) * X;
        const B = R(2, rem - 2), D = rem - B;
        const termA = A === 1 ? `<i>x</i> + ${B}` : `${A}<i>x</i> + ${B}`;
        return g(`For two acute angles, ∠<i>Q</i> and ∠<i>R</i>, cos <i>Q</i> = sin <i>R</i>. The measures, in degrees, of ∠<i>Q</i> and ∠<i>R</i> are ${termA} and ${C}<i>x</i> + ${D}, respectively. What is the value of <i>x</i>?`, X);
      },
      // 4. Bluebook Hard (image_8.png): Right isosceles triangle perimeter P + P*sqrt(2), find hypotenuse (with SVG)
      () => {
        const P = R(16, 150) * 2;
        const fig = svgRightTri(`s`, `s`, `c = ?`, `45°`, `45°`);
        return g(`${fig}The perimeter of a right isosceles triangle is ${P} + ${P}√2. What is the length of the hypotenuse?`, P);
      },
      () => {
        const S = [
            {name: "triangular garden", unit: "meters"},
            {name: "triangular park", unit: "meters"},
            {name: "triangular sign", unit: "centimeters"},
            {name: "triangular ramp", unit: "meters"}
        ];
        const s = getEl(S);
        const triples = [[3, 4, 5], [5, 12, 13], [6, 8, 10], [9, 12, 15], [8, 15, 17], [15, 20, 25]];
        const [a, b, c] = getEl(triples);
        const askHypotenuse = Math.random() < 0.5;
        if (askHypotenuse) {
            return g(`A ${s.name} is shaped like a right triangle. One leg has a length of ${a} ${s.unit}, and the other leg has a length of ${b} ${s.unit}. What is the length, in ${s.unit}, of the hypotenuse?`, c, [c, a + b, c + 1, Math.abs(a-b)]);
        } else {
            return g(`A ${s.name} is shaped like a right triangle. The hypotenuse has a length of ${c} ${s.unit}, and one leg has a length of ${a} ${s.unit}. What is the length, in ${s.unit}, of the other leg?`, b, [b, c - a, c + a, c + 1]);
        }
      },
      ()=>{
        const triples = [
            [3, 5, 4],
            [5, 13, 12],
            [7, 25, 24],
            [8, 17, 15],
            [20, 29, 21],
            [28, 53, 45],
            [33, 65, 56],
            [16, 34, 30]
        ];
        const [a,b,c] = getEl(triples);
        const scale = R(2, 20) / 10;
        const leg = Math.random() < 0.5 ? a : b;
        const hyp = c;
        const other = leg === a ? b : a;
        const A = (leg * scale).toFixed(1);
        const H = (hyp * scale).toFixed(1);
        const ans = (other * scale).toFixed(1);
        const questions = [
          `One leg of a right triangle has a length of ${A} centimeters. The hypotenuse has a length of ${H} centimeters. What is the length of the other leg, in centimeters?`,
          `A right triangle has a hypotenuse of ${H} meters and one leg of ${A} meters. Find the length of its other leg, in meters.`,
          `The hypotenuse of a right triangle is ${H} units long. One leg is ${A} units long. What is the length of the remaining leg?`,
          `A right triangular ramp has a hypotenuse of ${H} feet and one leg of ${A} feet. How long is the other leg?`
        ];
        const question = getEl(questions);
        const wrong = [
            (leg * scale).toFixed(1),
            (hyp * scale + leg * scale).toFixed(1),
            (other * scale + 2).toFixed(1)
        ];

        return g(
            question,
            ans,
            [ans, ...wrong]
        );
    },

      () => { const a=R(5,20), c=R(25,45); return grid(`A right triangle has a hypotenuse of ${c} and a leg of ${a}. What is the square of the other leg's length?`, c*c-a*a); },
      () => { const [a,b,c]=getEl([[3,4,5],[5,12,13],[8,15,17],[7,24,25]]); const k=R(3,6), P=(a+b+c)*k;
        return g(`Triangle ABC is a right triangle with legs of length ${a} and ${b}. Triangle DEF is similar to triangle ABC, and the shorter leg of triangle DEF has length ${a*k}. What is the perimeter of triangle DEF?`, String(P), fill(P,[(a+b)*k, a*k+b+c, a+b+c+k])); },

      // 9: sin -> tan with SVG right triangle and wide scaling
      () => { const [a,b,c]=getEl([[3,4,5],[5,12,13],[8,15,17],[7,24,25],[20,21,29]]); const k=R(2,9);
        const fig = svgRightTri(`${a*k}`, ``, `${c*k}`, `θ`, ``);
        return g(`${fig}In the right triangle shown above, θ is an acute angle and sin(θ) = <f>${a}/${c}</f>. What is the value of tan(θ)?`, `<f>${a}/${b}</f>`, [`<f>${a}/${b}</f>`,`<f>${b}/${a}</f>`,`<f>${b}/${c}</f>`,`<f>${c}/${b}</f>`]); },

      // 10: равнобедренный прямоугольный, катет
      () => { const s=R(3,12);
        return g(`An isosceles right triangle has a hypotenuse of length ${s}√2. What is the length of one of its legs?`, String(s), [String(s), `${s}√2`, String(2*s), `${2*s}√2`]); },

      // 11: равнобедренный прямоугольный, площадь
      () => { const s=R(2,8)*2;
        return g(`An isosceles right triangle has a hypotenuse of length ${s}√2. What is the area of the triangle?`, s*s/2); },

      // 12: площадь по гипотенузе и катету
      () => { const [a,b,c]=getEl([[3,4,5],[5,12,13],[8,15,17],[7,24,25]]); const A=a*b/2;
        return g(`A right triangle has a hypotenuse of length ${c} and one leg of length ${a}. What is the area of the triangle?`, String(A), fill(A,[a*b, a+b+c, a*c/2])); },

      // 13: лестница у стены
      () => { const [a,b,c]=getEl([[3,4,5],[5,12,13],[8,15,17]]); const k=R(1,3);
        return g(`A ${c*k}-foot ladder leans against a vertical wall on level ground. The base of the ladder is ${a*k} feet from the wall. How many feet above the ground does the top of the ladder touch the wall?`, String(b*k), fill(b*k,[(c-a)*k, (c+a)*k, (a+b)*k])); },

      // 14: расстояние между точками
      () => { const [a,b,c]=getEl([[3,4,5],[5,12,13],[8,15,17],[6,8,10]]); const x=R(-6,6), y=R(-6,6), sx=Math.random()<.5?1:-1, sy=Math.random()<.5?1:-1;
        return g(`In the xy-plane, what is the distance between the points (${x}, ${y}) and (${x+sx*a}, ${y+sy*b})?`, String(c), fill(c,[a+b, Math.abs(a-b), c*c])); },

      // 15: прямоугольник по диагонали и стороне
      () => { const [a,b,c]=getEl([[3,4,5],[5,12,13],[8,15,17],[6,8,10],[9,12,15]]);
        return g(`A rectangle has a diagonal of length ${c} and a width of ${a}. What is the area of the rectangle?`, String(a*b), fill(a*b,[a*c, b*c, 2*(a+b)])); },

      // 16: диагональ квадрата
      () => { const s=R(3,12);
        return g(`A square has an area of ${s*s} square units. What is the length of its diagonal, in units?`, `${s}√2`, [`${s}√2`, String(s), String(2*s), `${s*s}√2`]); },

      // 17: cos в треугольнике ABC with SVG diagram and wide scaling
      () => { const [a,b,c]=getEl([[3,4,5],[5,12,13],[8,15,17],[7,24,25]]); const k=R(2,12); const ang=getEl(["A","C"]); const n=ang==="A"?a:b, o=ang==="A"?b:a;
        const fig = svgRightTri(`${a*k}`, `${b*k}`, `${c*k}`, ``, ``);
        return g(`${fig}In right triangle <i>ABC</i> shown above, angle <i>B</i> is a right angle, <i>AB</i> = ${a*k}, <i>BC</i> = ${b*k}, and <i>AC</i> = ${c*k}. What is the value of cos(<i>${ang}</i>)?`, `<f>${n}/${c}</f>`, [`<f>${n}/${c}</f>`,`<f>${o}/${c}</f>`,`<f>${n}/${o}</f>`,`<f>${c}/${n}</f>`]); },

      // 18: sin(ax) = cos(bx)
      () => { const [a,b]=getEl([[2,3],[3,2],[1,4],[4,1],[2,4],[4,2],[1,5],[5,1],[3,3],[1,2],[2,1]]); const x=90/(a+b);
        return g(`If sin(${a}x°) = cos(${b}x°), where ${a}x and ${b}x are both acute angles, what is the value of x?`, String(x), fill(x,[2*x, 90-x, Math.round(x/2)])); },

      // 19: радианы -> градусы
      () => { const [k,d]=getEl([[1,6],[1,4],[1,3],[2,3],[3,4],[5,6],[1,2],[5,4],[3,2],[7,6]]); const deg=180*k/d;
        return g(`An angle measures ${k===1?'':k}π/${d} radians. What is the measure of the angle, in degrees?`, String(deg), fill(deg,[360-deg, deg+30, deg-30, Math.round(deg/2)])); },

      // 20: tan A -> гипотенуза with SVG diagram and wide scaling
      () => { const [a,b,c]=getEl([[3,4,5],[5,12,13],[8,15,17],[7,24,25]]); const k=R(3,14);
        const fig = svgRightTri(`${b*k}`, ``, `?`, ``, `A`);
        return g(`${fig}In right triangle <i>ABC</i> shown above, angle <i>B</i> is a right angle, tan(<i>A</i>) = <f>${a}/${b}</f>, and <i>AB</i> = ${b*k}. What is the length of hypotenuse <i>AC</i>?`, String(c*k), fill(c*k,[a*k, (a+b)*k, c+k])); },

      // 21: тень и угол солнца (45° или 60°)
      () => { const a=R(8,30);
        return Math.random()<0.5
          ? g(`A tree casts a shadow ${a} feet long on level ground when the angle of elevation of the sun is 45°. What is the height of the tree, in feet?`, String(a), [String(a), String(2*a), `${a}√2`, `${a}√3`])
          : g(`A tree casts a shadow ${a} feet long on level ground when the angle of elevation of the sun is 60°. What is the height of the tree, in feet?`, `${a}√3`, [`${a}√3`, String(a), `${a}√2`, `${a}√3/3`]); },

      // 22: катеты в отношении, периметр
      () => { const [a,b,c]=getEl([[3,4,5],[5,12,13],[8,15,17]]); const k=R(2,9), P=(a+b+c)*k;
        return g(`The legs of a right triangle are in the ratio ${a}:${b}, and its hypotenuse has length ${c*k}. What is the perimeter of the triangle?`, String(P), fill(P,[(a+b)*k, 2*c*k, P+k])); },

      // 23: вписанный в окружность прямоугольный треугольник
      () => { const [a,b,c]=getEl([[6,8,10],[10,24,26],[12,16,20],[16,30,34]]); const r=c/2;
        return g(`A right triangle with legs of length ${a} and ${b} is inscribed in a circle. What is the area of the circle, in terms of π?`, `${r*r}π`, [`${r*r}π`, `${r}π`, `${c}π`, `${c*c}π`]); },

      // 24: высота к гипотенузе
      () => { const [a,b,c]=getEl([[3,4,5],[5,12,13],[8,15,17],[7,24,25]]);
        return g(`A right triangle has legs of length ${a} and ${b}. What is the length of the altitude drawn from the right angle to the hypotenuse?`, `<f>${a*b}/${c}</f>`, [`<f>${a*b}/${c}</f>`, `<f>${a+b}/${c}</f>`, `<f>${c}/${a+b}</f>`, `<f>${a*b}/${a+b}</f>`]); },

      // 25: периметр равнобедренного по основанию и высоте
      () => { const [a,b,c]=getEl([[3,4,5],[5,12,13],[8,15,17],[6,8,10]]); const P=2*a+2*c;
        return g(`An isosceles triangle has a base of length ${2*a} and a height of ${b} drawn to that base. What is the perimeter of the triangle?`, String(P), fill(P,[2*a+c, a+2*c, 2*a+2*b])); },

      // 26: два путника (север и восток)
      () => { const [a,b,c]=getEl([[3,4,5],[5,12,13],[8,15,17]]); const k=R(1,3);
        return g(`Two hikers start at the same point. One walks ${a*k} kilometers due north, and the other walks ${b*k} kilometers due east. How far apart, in kilometers, are the hikers at the end?`, String(c*k), fill(c*k,[(a+b)*k, (b-a)*k, c*k+k])); },

      // 27: sin A = cos B
      () => { const [a,b,c]=getEl([[3,4,5],[5,12,13],[8,15,17],[7,24,25]]);
        return g(`In triangle ABC, angle C is a right angle and sin(A) = ${a}/${c}. What is the value of cos(B)?`, `<f>${a}/${c}</f>`, [`<f>${a}/${c}</f>`,`<f>${b}/${c}</f>`,`<f>${a}/${b}</f>`,`<f>${b}/${a}</f>`]); },

      // 28: cos² через sin
      () => { const [a,b,c]=getEl([[3,4,5],[5,12,13],[8,15,17],[7,24,25]]);
        return g(`If θ is an acute angle and sin(θ) = ${a}/${c}, what is the value of cos²(θ)?`, `<f>${b*b}/${c*c}</f>`, [`<f>${b*b}/${c*c}</f>`,`<f>${b}/${c}</f>`,`<f>${a*a}/${c*c}</f>`,`<f>${c*c-a}/${c*c}</f>`]); },

      // 29: человек и дерево (подобие)
      () => { const h=R(4,6), s=R(3,5), k=R(3,8);
        return g(`A ${h}-foot-tall person casts a ${s}-foot shadow. At the same time, a tree casts a ${s*k}-foot shadow. What is the height of the tree, in feet?`, String(h*k), fill(h*k,[s*k, (h+s)*k, h+s*k])); },

      // 30: площадь и катет -> гипотенуза
      () => { const [a,b,c]=getEl([[3,4,5],[5,12,13],[8,15,17],[7,24,25],[20,21,29]]);
        return g(`A right triangle has an area of ${a*b/2} and one leg of length ${a}. What is the length of the hypotenuse?`, String(c), fill(c,[a+b, b, a*b/2])); },
      () => { // Two angles of elevation from two points or top/bottom of building (Double right triangle with SVG)
        const d=R(12,30), h1=d, h2=d*3; // Using 45° and tan(theta2)
        const base=R(6,15)*2, tanA=0.5, tanB=1.5; const diffH = base*(tanB - tanA);
        const fig = gSvg(235, 165, `<polygon points="35,135 195,135 195,25" fill="#f0fbf8" stroke="#0f2b4a" stroke-width="2.5"/><line x1="35" y1="135" x2="195" y2="85" stroke="#1f9d8a" stroke-width="2.2"/><rect x="183" y="123" width="12" height="12" fill="none" stroke="#0f2b4a" stroke-width="1.8"/><text x="22" y="142" font-size="12" font-weight="bold" fill="#0f2b4a">P</text><text x="202" y="142" font-size="12" font-weight="bold" fill="#0f2b4a">B</text><text x="202" y="88" font-size="12" font-weight="bold" fill="#1f9d8a">C</text><text x="202" y="26" font-size="12" font-weight="bold" fill="#e74c3c">A</text><text x="115" y="152" font-size="12" font-weight="bold" fill="#0f2b4a" text-anchor="middle">${base}</text>`);
        return g(`${fig}In the figure above, a flagpole <i>AC</i> stands atop a building <i>BC</i>. From a point <i>P</i> on level ground ${base} meters from the base <i>B</i>, the tangent of the angle of elevation to the roof <i>C</i> is 0.5, and the tangent of the angle of elevation to the top of the flagpole <i>A</i> is 1.5. What is the height <i>AC</i>, in meters, of the flagpole alone?`, diffH); },
      () => { // Altitude to hypotenuse in right triangle ABC: cos(BCD) = sin(A) or tan(BCD) = tan(A)!
        // Wait: in right triangle ABC with right angle at C and altitude CD to AB: angle ACD = angle B, and angle BCD = angle A!
        const [a,b,c] = getEl([[3,4,5],[5,12,13],[8,15,17],[7,24,25]]); const k=R(2,6);
        const fig = svgRightAlt(``, ``, ``, `${b*k}`, `${a*k}`);
        return g(`${fig}In right triangle <i>ABC</i> above, ∠<i>ACB</i> is a right angle, segment <i>CD</i> is the altitude to hypotenuse <i>AB</i>, <i>AC</i> = ${b*k}, and <i>BC</i> = ${a*k}. What is the value of sin(∠<i>BCD</i>)?`, `<f>${a}/${c}</f>`, [`<f>${a}/${c}</f>`, `<f>${b}/${c}</f>`, `<f>${a}/${b}</f>`, `<f>${b}/${a}</f>`]); },
      () => { // Unit circle trigonometry in Quadrant II or IV: given sin or cos and quadrant, find tan
        const [a,b,c] = getEl([[3,4,5],[5,12,13],[8,15,17]]);
        return g(`In the <i>xy</i>-plane, an angle θ in standard position has its terminal ray in Quadrant II (where <f>π/2</f> < θ < π). If sin(θ) = <f>${a}/${c}</f>, what is the value of cos(θ)?`, `-<f>${b}/${c}</f>`, [`-<f>${b}/${c}</f>`, `<f>${b}/${c}</f>`, `-<f>${a}/${b}</f>`, `-<f>${c}/${b}</f>`]); },
      () => { // Co-function identity in radians: sin(pi/2 - x) = cos(x)
        const [a,b,c] = getEl([[3,4,5],[5,12,13],[8,15,17],[7,24,25]]);
        return g(`If cos(<i>x</i>) = <f>${a}/${c}</f>, what is the value of sin(<f>π/2</f> - <i>x</i>)?`, `<f>${a}/${c}</f>`, [`<f>${a}/${c}</f>`, `<f>${b}/${c}</f>`, `-<f>${a}/${c}</f>`, `<f>${c}/${a}</f>`]); },
      () => { // Supplementary angles trig: sin(180° - x) = sin(x), cos(180° - x) = -cos(x)
        const [a,b,c] = getEl([[3,4,5],[5,12,13],[8,15,17]]);
        return g(`In triangle <i>ABC</i>, angle <i>A</i>, angle <i>B</i>, and angle <i>C</i> are the three interior angles. If∠<i>C</i> = 90° and sin(<i>A</i>) = <f>${a}/${c}</f>, what is the value of cos(<i>A</i>) - sin(<i>B</i>)?`, "0", ["0", `<f>${2*b}/${c}</f>`, `<f>${a - b}/${c}</f>`, "1"]); },
      () => { // Area of a non-right triangle using trig: Area = (1/2)*a*b*sin(C)
        const s1=R(6,16,2), s2=R(8,20,2); // Angle = 30° -> sin(30°) = 0.5 -> Area = s1*s2/4
        const area = (s1*s2)/4;
        return g(`In triangle <i>DEF</i>, side <i>DE</i> has length ${s1} centimeters, side <i>DF</i> has length ${s2} centimeters, and the included angle ∠<i>D</i> measures 30°. What is the area, in square centimeters, of triangle <i>DEF</i>?`, area); },
      () => { // Finding sin(A) + cos(B) in a right triangle where A + B = 90° -> sin(A) = cos(B) -> sum = 2*sin(A)
        const [a,b,c] = getEl([[3,4,5],[5,12,13],[8,15,17]]);
        return g(`In right triangle <i>PQR</i>, ∠<i>R</i> = 90° and sin(<i>P</i>) + cos(<i>Q</i>) = <f>${2*a}/${c}</f>. What is the value of tan(<i>P</i>)?`, `<f>${a}/${b}</f>`, [`<f>${a}/${b}</f>`, `<f>${b}/${a}</f>`, `<f>${a}/${c}</f>`, `<f>${b}/${c}</f>`]); },
      () => { // 30-60-90 and 45-45-90 joined along a common altitude h!
        const h=R(4,12); // In 45-45-90, base1 = h. In 30-60-90 (with 30° at base), hyp = 2h, base2 = h*sqrt(3). Ask for hyp + base1 = 3h!
        const fig = gSvg(240, 155, `<polygon points="30,130 210,130 140,35" fill="#f0fbf8" stroke="#0f2b4a" stroke-width="2.5"/><line x1="140" y1="35" x2="140" y2="130" stroke="#1f9d8a" stroke-width="2.2"/><rect x="140" y="118" width="11" height="11" fill="none" stroke="#1f9d8a" stroke-width="1.6"/><text x="58" y="124" font-size="11.5" font-weight="bold" fill="#1f9d8a">30°</text><text x="180" y="124" font-size="11.5" font-weight="bold" fill="#e74c3c">45°</text><text x="134" y="88" font-size="12" font-weight="bold" fill="#0f2b4a" text-anchor="end">${h}</text><text x="140" y="26" font-size="12" font-weight="bold" fill="#0f2b4a" text-anchor="middle">A</text><text x="20" y="138" font-size="12" font-weight="bold" fill="#0f2b4a">B</text><text x="218" y="138" font-size="12" font-weight="bold" fill="#0f2b4a">C</text><text x="140" y="146" font-size="12" font-weight="bold" fill="#1f9d8a" text-anchor="middle">D</text>`);
        return grid(`${fig}In triangle <i>ABC</i> above, altitude <i>AD</i> has length ${h}, ∠<i>B</i> = 30°, and ∠<i>C</i> = 45°. What is the sum of the lengths of side <i>AB</i> and segment <i>DC</i>?`, 3*h); },
      () => { // Slope of a line in the xy-plane equals tan(theta) where theta is angle with positive x-axis
        const [a,b,c] = getEl([[3,4,5],[5,12,13],[8,15,17]]); const x0=b*R(2,5), y0=a*(x0/b);
        return g(`In the <i>xy</i>-plane, a ray from the origin (0, 0) passes through the point (${b*3}, ${a*3}) in the first quadrant and forms an acute angle θ with the positive <i>x</i>-axis. What is the value of sin(θ)?`, `<f>${a}/${c}</f>`, [`<f>${a}/${c}</f>`, `<f>${b}/${c}</f>`, `<f>${a}/${b}</f>`, `<f>${b}/${a}</f>`]); },
      () => { // Pythagorean identity with algebraic expression: 5*sin^2(x) + 5*cos^2(x)
        const k=R(6,25), c=R(10,40);
        return g(`For any real angle θ, what is the value of the expression ${k}sin²(θ) + ${c} + ${k}cos²(θ)?`, k + c); },
      () => { // Given tan(x) = a/b, find (a*sin(x) + b*cos(x)) / (a*sin(x) - b*cos(x)) or similar linear combination
        const [a,b,c] = getEl([[3,4,5],[5,12,13],[8,15,17]]); // sin = a/c, cos = b/c -> c*(sin + cos) = a + b
        return g(`If θ is an acute angle such that tan(θ) = <f>${a}/${b}</f>, what is the value of ${c}sin(θ) + ${c}cos(θ)?`, a + b); },
      () => { // Inscribed regular hexagon or equilateral triangle in a circle of radius R
        const r=R(4,12); // Chord subtending 60° has length r; chord subtending 120° has length r*sqrt(3)
        return g(`An equilateral triangle is inscribed in a circle of radius ${r} centimeters. What is the side length, in centimeters, of the equilateral triangle?`, `${r}√3`, [`${r}√3`, `${2*r}`, `${r}√2`, `<f>${r}√3/2</f>`]); },
      () => { // Right triangle perimeter and area given -> find hypotenuse
        // Triple (3,4,5)*k -> perim = 12k, area = 6k^2, hyp = 5k
        const k=R(2,7); const a=3*k, b=4*k, c=5*k; const sumLegs = a+b, area = (a*b)/2;
        return g(`A right triangle has an area of ${area} square meters, and the sum of the lengths of its two legs is ${sumLegs} meters. What is the length, in meters, of the triangle's hypotenuse?`, c); },
      () => { // Cosine of obtuse angle in isosceles triangle
        const [a,b,c] = getEl([[3,4,5],[5,12,13],[8,15,17]]); const k=R(2,5); // Isosceles triangle with legs c*k and base 2*a*k -> altitude to base is b*k!
        const fig = svgSimSplit(`${c*k}`, ``, `${c*k}`, ``, ``, `${2*a*k}`);
        return g(`An isosceles triangle has two congruent sides of length ${c*k} and a base of length ${2*a*k}. If θ is one of the two congruent base angles, what is the value of sin(θ)?`, `<f>${b}/${c}</f>`, [`<f>${b}/${c}</f>`, `<f>${a}/${c}</f>`, `<f>${b}/${a}</f>`, `<f>${2*a}/${c}</f>`]); },
      () => { // Radian periodicity: cos(2*pi*n + pi/3) = 0.5
        const n=R(2,6); const num = 6*n + 1;
        return grid(`What is the exact value of cos(<f>${num}π/3</f>)?`, 0.5); },
      () => { // 3D Right triangle inside a cylinder: longest rod in a cylinder of radius r and height h -> sqrt((2r)^2 + h^2)
        const [a,b,c] = getEl([[3,4,5],[5,12,13],[8,15,17]]); const k=R(1,3); const r=a*k, d=2*r, h=2*b*k, diag=2*c*k;
        const fig = svgCyl(`r = ${r}`, `h = ${h}`);
        return g(`${fig}The right circular cylinder shown above has a radius of ${r} centimeters and a height of ${h} centimeters. What is the length, in centimeters, of the longest straight rigid rod that can fit completely inside the cylinder?`, diag); },
      () => { // Complementary angles in radians: sin(pi/k) = cos(pi/2 - pi/k)
        const k=getEl([5, 6, 7, 8, 10, 12]); const num = k - 2, den = 2 * k; const g1 = gcd(num, den);
        return g(`If sin(<f>π/${k}</f>) = cos(<f><i>a</i>π/${den/g1}</f>), where 0 < <f><i>a</i>π/${den/g1}</f> < <f>π/2</f>, what is the value of <i>a</i>?`, String(num/g1), [String(num/g1), String(k - 1), "1", String(k)]); },
      () => { // Folding a corner of a rectangle or paper strip
        const [a,b,c] = getEl([[3,4,5],[5,12,13],[8,15,17]]); const k=R(2,5);
        return g(`In right triangle <i>XYZ</i>, ∠<i>Y</i> = 90°, <i>XY</i> = ${a*k}, and tan(<i>X</i>) = <f>${b}/${a}</f>. What is the perimeter of triangle <i>XYZ</i>?`, (a+b+c)*k); },
      () => { // Similar right triangles on coordinate axes
        const xInt=R(3,6)*3, yInt=R(3,6)*4;
        return g(`In right triangle <i>ABC</i>, angle <i>C</i> is a right angle and sin(<i>A</i>) = <f>2/3</f>. What is the value of cos(<i>A</i>)?`, `<f>√5/3</f>`, [`<f>√5/3</f>`, `<f>1/3</f>`, `<f>2/3</f>`, `<f>√13/3</f>`]); },
      () => { // Guy wire attached to a tower: 2 wires on opposite sides forming 30° and 60° angles with ground
        const h=R(4,12)*3; // Wire 1 at 30° has length 2h; Wire 2 at 60° has length 2h/sqrt(3). Or distance between anchor points on ground: h*sqrt(3) + h/sqrt(3) = 4h/sqrt(3) -> if h = k*sqrt(3), distance is 4k!
        const k=R(5,18); return g(`A vertical radio tower of height ${k}√3 meters is braced by two straight guy wires anchored to the level ground on opposite sides of the tower. One wire makes a 30° angle with the ground, and the other wire makes a 60° angle with the ground. What is the total horizontal distance, in meters, between the two ground anchor points?`, 4*k); }
    ],
    // === Topic 19: Circles ===
    [
      () => { const h=R(2,6), k=R(3,7), dx=3, dy=4, r=5; const x0=h+dx, y0=k+dy; const mTan = `-<f>${dx}/${dy}</f>`; return g(`In the <i>xy</i>-plane, a circle is defined by (<i>x</i> - ${h})² + (<i>y</i> - ${k})² = 25. Point <i>P</i>(${x0}, ${y0}) lies on the circle. What is the slope of the line that is tangent to the circle at point <i>P</i>?`, `-<f>3/4</f>`, [`-<f>3/4</f>`, `<f>4/3</f>`, `<f>3/4</f>`, `-<f>4/3</f>`]); },
      () => { const h=R(3,8), k=R(4,9), r=R(6,13); const C = r*r - h*h - k*k; return g(`<i>x</i>² + <i>y</i>² - ${2*h}<i>x</i> + ${2*k}<i>y</i> = ${C}<br><br>The equation above represents a circle in the <i>xy</i>-plane with center (<i>a</i>, <i>b</i>) and radius <i>r</i>. What is the value of <i>a</i> - <i>b</i> + <i>r</i>?`, String(h - (-k) + r), [String(h + k + r), String(h - k + r), String(h + k + r*r), String(-h + k + r)]); },
      () => { const r=R(8,36), deg=R(4,15)*10; const fig = svgCircleSector(`r = ${r}`, `${deg}°`); return g(`${fig}In the circle shown above, what is the arc length of the shaded sector with a central angle of ${deg}° and a radius of ${r}?`, `<f>${deg*r}/180</f>π`, [`<f>${deg*r}/180</f>π`, `<f>${deg}/360</f>π`, `${deg*r}π`, `<f>${deg*r*r}/360</f>π`]); },
      () => { const r=R(6,15), num=R(2,5), den=R(7,11); return g(`In a circle with radius ${r}, a central angle of <i>θ</i> radians intercepts an arc of length <f>${num}π/${den}</f> · ${r}, which bounds a sector of area <i>A</i>. What fraction of the total area of the circle is the area of this sector?`, `<f>${num}/${2*den}</f>`, [`<f>${num}/${2*den}</f>`, `<f>${num}/${den}</f>`, `<f>${2*num}/${den}</f>`, `<f>${num*r}/${2*den}</f>`]); },
      () => { const a=R(3,7), b=R(15,35); const xVal = Math.round((180 - 2*b)/(2*a)); const realB = 180 - 2*a*xVal; return g(`Quadrilateral <i>ABCD</i> is inscribed in a circle. Angle <i>A</i> measures (${a}<i>x</i> + 10)° and the opposite angle <i>C</i> measures (${a}<i>x</i> + ${170 - 2*a*xVal})°. What is the measure, in degrees, of angle <i>A</i>?`, String(a*xVal + 10), [String(a*xVal + 10), String(xVal), String(180 - (a*xVal + 10)), String(90 - xVal)]); },
      () => { const r=R(6,28), deg=R(5,16)*10; const fig = svgCircleSector(`r = ${r}`, `${deg}°`); return g(`${fig}In the circle shown above, what is the area of the shaded sector with a central angle of ${deg}° and a radius of ${r}?`, `<f>${deg*r*r}/360</f>π`, [`<f>${deg*r*r}/360</f>π`, `<f>${deg*r}/180</f>π`, `${r*r}π`, `<f>${deg}/360</f>π`]); },
      () => { const r1=R(4,9), r2=R(10,16); return g(`Circle A has equation (<i>x</i> + ${r1})² + (<i>y</i> - ${r2})² = ${r1*r1} in the <i>xy</i>-plane. Which of the following statements is true about Circle A?`, "It is tangent to the y-axis and does not intersect the x-axis.", ["It is tangent to the y-axis and does not intersect the x-axis.", "It is tangent to the x-axis and does not intersect the y-axis.", "It is tangent to both the x-axis and the y-axis.", "It passes through the origin (0, 0)."]); },
      () => { const h=R(2,5)*(Math.random()<.5?1:-1), k=R(6,9)*(Math.random()<.5?1:-1), r=R(3,9);
        return g(`Which of the following is an equation of the circle in the xy-plane with center (${h}, ${k}) and radius ${r}?`, eqC(h,k,r*r), opts(eqC(h,k,r*r),[eqC(-h,-k,r*r), eqC(h,k,r), eqC(k,h,r*r), eqC(-h,k,r*r)])); },

      // 9: радиус из общего вида (выделение полного квадрата)
      () => { const h=R(1,5), k=R(1,5), r=R(7,12), N=r*r-h*h-k*k;
        return g(`The equation x² + y² − ${2*h}x + ${2*k}y = ${N} represents a circle in the xy-plane. What is the radius of the circle?`, String(r), fill(r,[r*r, N, h+k])); },

      // 10: центр из общего вида
      () => { const h=R(1,6), k=R(1,6), r=R(7,12), N=r*r-h*h-k*k;
        return g(`The equation x² + y² − ${2*h}x + ${2*k}y = ${N} represents a circle in the xy-plane. What is the center of the circle?`, `(${h}, -${k})`, opts(`(${h}, -${k})`,[`(${h}, ${k})`,`(-${h}, ${k})`,`(${2*h}, -${2*k})`,`(-${h}, -${k})`])); },

      // 11: центр по концам диаметра
      () => { const h=R(1,8), k=R(1,8), a=R(2,6), b=R(2,6);
        return g(`The endpoints of a diameter of a circle are (${h-a}, ${k-b}) and (${h+a}, ${k+b}). What is the center of the circle?`, `(${h}, ${k})`, opts(`(${h}, ${k})`,[`(${a}, ${b})`,`(${2*h}, ${2*k})`,`(${h+a}, ${k+b})`,`(${h-a}, ${k-b})`])); },

      // 12: площадь по концам диаметра
      () => { const [a,b,c]=getEl([[6,8,10],[10,24,26],[12,16,20],[16,30,34],[18,24,30]]), r=c/2, x=R(-5,5), y=R(-5,5);
        return g(`The endpoints of a diameter of a circle are (${x}, ${y}) and (${x+a}, ${y+b}). What is the area of the circle, in terms of π?`, `${r*r}π`, opts(`${r*r}π`,[`${r}π`,`${c}π`,`${c*c}π`])); },

      // 13: радиус по точке на окружности
      () => { const [a,b,c]=getEl(TR), h=R(1,7), k=R(1,7);
        return g(`In the xy-plane, a circle has center (${h}, ${k}) and passes through the point (${h+a}, ${k+b}). What is the radius of the circle?`, String(c), fill(c,[a+b, Math.abs(a-b), c*c])); },

      // 14: точка внутри / на / вне окружности
      () => { const [a,b,c]=getEl(TR), t=R(0,2), r=t===0?c:(t===1?c+R(1,3):c-R(1,2));
        const ans=t===0?"On the circle":(t===1?"Inside the circle":"Outside the circle");
        return g(`In the xy-plane, a circle has its center at the origin and a radius of ${r}. How does the point (${a}, ${b}) lie relative to the circle?`, ans, ["On the circle","Inside the circle","Outside the circle","Cannot be determined"]); },

      // 15: наклон касательной
      () => { const a=R(2,5), b=R(6,9);
        return g(`In the xy-plane, a circle has its center at the origin and passes through the point (${a}, ${b}). What is the slope of the line tangent to the circle at (${a}, ${b})?`, `-<f>${a}/${b}</f>`, [`-<f>${a}/${b}</f>`,`<f>${a}/${b}</f>`,`<f>${b}/${a}</f>`,`-<f>${b}/${a}</f>`]); },

      // 16: длина касательной из внешней точки с SVG
      () => { const [a0,b0,c0]=getEl(TR); const k=R(2,8), a=a0*k, b=b0*k, c=c0*k;
        const fig = svgCircleTangent(`r = ${a}`, `?`, `${c}`);
        return g(`${fig}In the figure above, point <i>P</i> is ${c} units from the center <i>O</i> of a circle with radius ${a}. Segment <i>PT</i> is tangent to the circle at point <i>T</i>. What is the length of <i>PT</i>?`, String(b), fill(b,[c-a, a+c, c*c-a*a])); },

      // 17: вписанный угол по дуге
      () => { const x=R(5,17)*10;
        return g(`In a circle, arc AB measures ${x}°. Point C is on the circle, on the major arc. What is the measure of inscribed angle ACB, in degrees?`, String(x/2), fill(x/2,[x, 2*x, 360-x])); },

      // 18: дуга по вписанному углу
      () => { const t=R(20,80);
        return g(`In a circle, inscribed angle ABC intercepts arc AC and measures ${t}°. What is the measure of arc AC, in degrees?`, String(2*t), fill(2*t,[t, 180-t, 360-2*t])); },

      // 19: угол, опирающийся на диаметр
      () => { const x=R(15,40);
        return g(`Segment AB is a diameter of a circle, and point C lies on the circle. If angle CAB measures ${x}°, what is the measure of angle ABC, in degrees?`, String(90-x), fill(90-x,[x, 180-x, 90+x])); },

      // 20: хорда и расстояние от центра с SVG
      () => { const [a0,b0,c0]=getEl(TR); const k=R(2,7), a=a0*k, b=b0*k, c=c0*k;
        const fig = svgCircleChord(`r = ${c}`, `${a}`, ` chord = ?`);
        return g(`${fig}In the circle shown above, the radius is ${c} units and a chord is ${a} units from the center <i>O</i>. What is the total length of the chord?`, String(2*b), fill(2*b,[b, 2*(c-a), 2*c])); },

      // 21: длина окружности по площади
      () => { const r=R(3,12);
        return g(`The area of a circle is ${r*r}π. What is the circumference of the circle?`, `${2*r}π`, opts(`${2*r}π`,[`${r}π`,`${r*r}π`,`${4*r}π`,`${2*r*r}π`])); },

      // 22: площадь по длине окружности
      () => { const r=R(3,12);
        return g(`The circumference of a circle is ${2*r}π. What is the area of the circle?`, `${r*r}π`, opts(`${r*r}π`,[`${r}π`,`${2*r}π`,`${4*r*r}π`,`${r*r*r}π`])); },

      // 23: площадь кольца
      () => { const sm=R(2,8), big=sm+R(2,6);
        return g(`Two concentric circles have radii ${big} and ${sm}. What is the area of the region between the circles, in terms of π?`, `${big*big-sm*sm}π`, opts(`${big*big-sm*sm}π`,[`${(big-sm)**2}π`,`${big*big+sm*sm}π`,`${big-sm}π`,`${2*(big-sm)}π`])); },

      // 24: площадь сектора по длине дуги
      () => { const s=R(2,9)*2, r=R(4,12);
        return g(`A sector of a circle has a radius of ${r} and an arc length of ${s}. What is the area of the sector?`, String(r*s/2), fill(r*s/2,[r*s, s, r+s])); },

      // 25: градусы -> радианы
      () => { const d=getEl([30,45,60,90,120,135,150,210,240,270,300,315]), g2=gcd(d,180), k=d/g2, n=180/g2;
        return g(`What is the radian measure of an angle that measures ${d}°?`, `<f>${k}/${n}</f>π`, opts(`<f>${k}/${n}</f>π`,[`<f>${n}/${k}</f>π`,`<f>${d}/360</f>π`,`<f>${d}/90</f>π`,`${d}π`])); },

      // 26: длина дуги по длине окружности
      () => { const C=R(2,9)*12, d=getEl([30,60,90,120,150,180]), ans=C*d/360;
        return g(`A circle has a circumference of ${C}. What is the length of an arc of the circle that has a central angle of ${d}°?`, String(ans), fill(ans,[C*d/180, C/d, 360/d])); },

      // 27: прямая и окружность — число точек пересечения
      () => { const r=R(3,9), t=R(0,2), k=t===0?R(0,r-1):(t===1?r:r+R(1,4)), ans=t===0?"2":(t===1?"1":"0");
        return g(`How many points of intersection do the graphs of x² + y² = ${r*r} and y = ${k} have in the xy-plane?`, ans, ["0","1","2","4"]); },

      // 28: касающиеся окружности
      () => { const r1=R(3,9), r2=r1+R(2,6);
        return Math.random()<.5
          ? g(`Two circles with radii ${r1} and ${r2} are externally tangent. What is the distance between their centers?`, String(r1+r2), fill(r1+r2,[r2-r1, r1*r2, 2*(r1+r2)]))
          : g(`A circle with radius ${r1} is internally tangent to a larger circle with radius ${r2}. What is the distance between their centers?`, String(r2-r1), fill(r2-r1,[r1+r2, r1*r2, r2])); },

      // 29: колесо и пройденное расстояние
      () => { const r=R(6,15), n=R(3,12);
        return g(`A bicycle wheel has a radius of ${r} inches. If the wheel makes ${n} complete revolutions along a straight path, how many inches does it travel, in terms of π?`, `${2*r*n}π`, opts(`${2*r*n}π`,[`${r*n}π`,`${r*r*n}π`,`${2*r*r*n}π`,`${4*r*n}π`])); },

      // 30: вписанная в квадрат окружность
      () => { const r=R(2,9), s=2*r;
        return g(`A circle is inscribed in a square with a perimeter of ${4*s}. What is the area of the circle, in terms of π?`, `${r*r}π`, opts(`${r*r}π`,[`${s*s}π`,`${r}π`,`${s}π`,`${2*r*r}π`])); },
      () => { // Inscribed quadrilateral in a circle: opposite angles are supplementary (sum to 180°)!
        const x=R(14,32), a=3, b=2, c1=180 - 5*x; const angA = 3*x + c1, angC = 2*x; const angB = R(75,115);
        const fig = svgInscribedQuad(`${angA}°`, `${angB}°`, `2x°`, ``);
        return g(`${fig}In the figure above, quadrilateral <i>ABCD</i> is inscribed in a circle. If ∠<i>A</i> = ${angA}° and ∠<i>C</i> = 2<i>x</i>°, what is the value of <i>x</i>?`, x); },
      () => { // Two tangents from an external point P to a circle: ∠TOP + ∠T'OP... or ∠T + ∠O + ∠T' + ∠P = 360 -> ∠O + ∠P = 180°!
        const angP = R(36, 78); const angO = 180 - angP;
        const fig = svgCircleTangent(`r`, ``, ``);
        return g(`${fig}Lines <i>PA</i> and <i>PB</i> are both tangent to a circle with center <i>O</i> at points <i>A</i> and <i>B</i>, respectively. If the angle between the two tangent segments, ∠<i>APB</i>, measures ${angP}°, what is the measure, in degrees, of central angle ∠<i>AOB</i>?`, angO); },
      () => { // Completing the square with leading coefficients: 2x^2 + 2y^2 - 8x + 12y = c
        const a=R(2,4), h=R(2,6), k=R(2,6), r=R(5,10); const rhs = a*(r*r - h*h - k*k);
        return g(`${a}<i>x</i>² + ${a}<i>y</i>² - ${2*a*h}<i>x</i> + ${2*a*k}<i>y</i> = ${rhs}<br><br>The equation above represents a circle in the <i>xy</i>-plane. What is the radius of the circle?`, r); },
      () => { // Sector area with central angle in RADIANS: A = (1/2) * r^2 * theta
        const r=R(4,12)*2, num=R(2,5), den=4; const areaCoeff = (r*r*num)/(2*den);
        const fig = svgCircleSector(`r = ${r}`, `${num}π/${den} rad`);
        return grid(`${fig}In the circle shown above, the radius is ${r} centimeters and the shaded sector has a central angle of <f>${num}π/${den}</f> radians. The area of the shaded sector is <i>k</i>π square centimeters. What is the value of <i>k</i>?`, areaCoeff); },
      () => { // Arc length with central angle in RADIANS: s = r * theta
        const r=R(6,18), num=R(2,7), den=3; const sCoeff = (r*num)/den; // make r divisible by 3
        const cleanR = R(2,7)*3; const ans = cleanR * num / 3;
        return g(`A circle has a radius of ${cleanR} inches. An arc of this circle subtends a central angle of <f>${num}π/3</f> radians. If the length of the arc is <i>k</i>π inches, what is the value of <i>k</i>?`, ans); },
      () => { // Intersecting chords theorem (Power of a Point inside a circle): AE * EB = CE * ED
        const a=R(3,8), b=R(6,12), c=R(2,4); const prod = a*b; // make c divide prod cleanly: let c = 3, a = 6, b = R(4,10) -> d = 2*b
        const ce=R(2,5), mult=R(2,5), ae=ce*mult, eb=R(3,8), ed=mult*eb;
        return g(`Inside a circle, chord <i>AB</i> and chord <i>CD</i> intersect at point <i>E</i>. By the Intersecting Chords Theorem, <i>AE</i> · <i>EB</i> = <i>CE</i> · <i>ED</i>. If <i>AE</i> = ${ae}, <i>EB</i> = ${eb}, and <i>CE</i> = ${ce}, what is the length of segment <i>ED</i>?`, ed); },
      () => { // Circle tangent to the x-axis or y-axis: if center is (h, k) and tangent to x-axis, then r = |k|!
        const h=R(-9,9,0), k=R(4,14);
        return g(`In the <i>xy</i>-plane, a circle has its center at (${h}, -${k}) and is tangent to the <i>x</i>-axis. If the equation of the circle is (<i>x</i> - ${h})² + (<i>y</i> + ${k})² = <i>c</i>, what is the value of <i>c</i>?`, k*k); },
      () => { // Maximum y-coordinate on a circle (x - h)^2 + (y - k)^2 = r^2 -> k + r
        const h=R(2,9), k=R(5,18), r=R(6,15);
        return grid(`In the <i>xy</i>-plane, a circle is defined by the equation <i>x</i>² + <i>y</i>² - ${2*h}<i>x</i> - ${2*k}<i>y</i> = ${r*r - h*h - k*k}. What is the greatest possible value of <i>y</i> for any point (<i>x</i>, <i>y</i>) on this circle?`, k + r); },
      () => { // Shifting a circle in the xy-plane and finding the new center or equation
        const h=R(3,9), k=R(4,10), r=R(5,12), dx=R(3,8), dy=R(4,9);
        const newH = h - dx, newK = k + dy;
        return g(`In the <i>xy</i>-plane, the circle (<i>x</i> - ${h})² + (<i>y</i> - ${k})² = ${r*r} is translated ${dx} units to the left and ${dy} units up. What is the center of the translated circle?`, `(${newH}, ${newK})`, [`(${newH}, ${newK})`, `(${h+dx}, ${k-dy})`, `(${h+dx}, ${k+dy})`, `(${newH}, ${k-dy})`]); },
      () => { // Two parallel chords or chord length from equation of circle and line
        const h=R(2,6), k=R(3,7), [a,b,c] = getEl([[3,4,5],[6,8,10],[5,12,13]]); // Circle (x-h)^2 + (y-k)^2 = c^2, horizontal line y = k + a -> (x-h)^2 = b^2 -> chord length = 2b!
        const fig = svgCircleChord(`r = ${c}`, `${a}`, `PQ = ?`);
        return g(`${fig}In the <i>xy</i>-plane, a circle with equation (<i>x</i> - ${h})² + (<i>y</i> - ${k})² = ${c*c} is intersected by the horizontal line <i>y</i> = ${k + a} at points <i>P</i> and <i>Q</i>. What is the length of chord <i>PQ</i>?`, 2*b); },
      () => { // Inscribed angle vs Central angle subtending the same arc: Central = 2 * Inscribed
        const insc = R(24, 68); const diff = insc; // Central - Inscribed = 2*insc - insc = insc
        return g(`In a circle with center <i>O</i>, central angle ∠<i>AOB</i> and inscribed angle ∠<i>ACB</i> both intercept the same minor arc <i>AB</i>. If the sum of the measures of ∠<i>AOB</i> and ∠<i>ACB</i> is ${3*insc}°, what is the measure, in degrees, of central angle ∠<i>AOB</i>?`, 2*insc); },
      () => { // Tangent-secant theorem from external point P: PT^2 = PA * PB
        const pa=R(3,6), mult=R(3,5), pb=pa*mult*mult, pt=pa*mult; // PA * PB = pa^2 * mult^2 -> PT = pa * mult
        const fig = svgCircleTangent(``, `PT = ?`, ``);
        return g(`${fig}From a point <i>P</i> outside a circle, a tangent segment <i>PT</i> touches the circle at <i>T</i>, and a secant line from <i>P</i> intersects the circle at points <i>A</i> and <i>B</i>. By the Tangent-Secant Theorem, <i>PT</i>² = <i>PA</i> · <i>PB</i>. If <i>PA</i> = ${pa} and <i>AB</i> = ${pb - pa} (so that <i>PB</i> = ${pb}), what is the length of tangent segment <i>PT</i>?`, pt); },
      () => { // Area of a circular segment (Quarter-circle sector minus isosceles right triangle: (pi/4 - 1/2)*r^2)
        const r=R(4,12)*2; const triArea = (r*r)/2, secCoeff = (r*r)/4;
        const fig = svgCircleSector(`r = ${r}`, `90°`);
        return g(`${fig}In a circle of radius ${r}, a 90° central angle defines a quarter-circle sector. If a straight chord is drawn connecting the two endpoints of the 90° arc, what is the area of the circular segment bounded by the chord and the arc?`, `${secCoeff}π - ${triArea}`, [`${secCoeff}π - ${triArea}`, `${secCoeff}π - ${r*r}`, `${r*r}π - ${triArea}`, `${2*secCoeff}π - ${triArea}`]); },
      () => { // Ratio of arc length to circumference equals ratio of sector area to total area
        const totA = R(12,30)*6, deg = getEl([60, 120, 240, 300]); const secA = (deg/360)*totA;
        return grid(`A circle has a total area of ${totA} square centimeters. What is the area, in square centimeters, of a sector of this circle whose arc length is <f>${deg/60}/6</f> of the circle's circumference?`, secA); },
      () => { // Finding the constant k for which x^2 + y^2 + ax + by + k = 0 has a given radius r
        const h=R(3,8), k=R(4,9), r=R(5,11); const c = h*h + k*k - r*r;
        return g(`In the <i>xy</i>-plane, the graph of <i>x</i>² + <i>y</i>² - ${2*h}<i>x</i> + ${2*k}<i>y</i> + <i>c</i> = 0 is a circle with radius ${r}. What is the value of the constant <i>c</i>?`, c); },
      () => { // Distance from origin (0,0) to the nearest point on a circle centered at (a, b) with radius r: sqrt(a^2+b^2) - r
        const [a,b,c] = getEl([[6,8,10],[5,12,13],[8,15,17],[9,12,15]]); const r = R(2, c - 2);
        return g(`In the <i>xy</i>-plane, a circle has equation (<i>x</i> - ${a})² + (<i>y</i> - ${b})² = ${r*r}. What is the shortest distance from the origin (0, 0) to a point on the circle?`, c - r); },
      () => { // Square inscribed in a circle of radius r -> area of square is 2*r^2!
        const r=R(4,15);
        return g(`A square is inscribed in a circle of radius ${r} centimeters (so all four vertices of the square lie on the circle). What is the area, in square centimeters, of the inscribed square?`, 2*r*r); },
      () => { // Equation of tangent line to (x - h)^2 + (y - k)^2 = r^2 at (h + a, k + b)
        const [a,b,c] = getEl([[3,4,5],[5,12,13]]); const h=2, k=1; const px=h+a, py=k+b; // Radial slope = b/a -> tangent slope = -a/b. Wait: let's ask for the y-intercept or slope
        return g(`In the <i>xy</i>-plane, a circle with center (${h}, ${k}) passes through the point (${px}, ${py}). What is the slope of the line tangent to the circle at the point (${px}, ${py})?`, `-<f>${a}/${b}</f>`, [`-<f>${a}/${b}</f>`, `<f>${b}/${a}</f>`, `-<f>${b}/${a}</f>`, `<f>${a}/${b}</f>`]); },
      () => { // Belt / Pulley or track around two semicircles and a rectangle (Stadium / Running track perimeter)
        const r=R(10,30), L=R(50,120); // Straight sides = 2*L, two semicircular ends = 2*pi*r
        return g(`An athletic running track consists of a rectangle of length ${L} meters and width ${2*r} meters with a semicircle of radius ${r} meters attached to each of its two shorter ends. What is the total perimeter, in meters, of the outer boundary of the running track?`, `${2*L} + ${2*r}π`, [`${2*L} + ${2*r}π`, `${2*L} + ${r*r}π`, `${2*L + 4*r} + ${2*r}π`, `${L} + ${r}π`]); },
      () => { // Three mutually externally tangent circles of radii r1, r2, r3 -> perimeter of triangle formed by their centers is 2*(r1 + r2 + r3)!
        const r1=R(3,8), r2=R(4,9), r3=R(5,12);
        return grid(`Three circles with radii ${r1}, ${r2}, and ${r3} centimeters are mutually externally tangent to one another (each circle touches the other two). What is the perimeter, in centimeters, of the triangle formed by connecting the centers of the three circles?`, 2*(r1 + r2 + r3)); }
    ]
  ];
})();const TIERS = {
  0:  {easy:[9,10,11,12,13,15,16,17,20,25], hard:[1,2,3,4,5,7,14,18,19,23,28,29,30]},
  1:  {easy:[1,2,3,4,11,12,13,19,20,21,22], hard:[7,10,23,24,25,26,27,29,30]},
  2:  {easy:[1,2,4,5,6,11,15,20,21,26], hard:[9,10,14,18,27,28,29,30]},
  3:  {easy:[1,6,8,10,19,20,26,29], hard:[9,11,12,13,14,15,17,23,24,28]},
  4:  {easy:[1,2,3,4,5,6,13,14,26,28], hard:[7,16,18,19,20,22,25]},
  5:  {easy:[1,6,11,14,15,23], hard:[3,4,8,9,16,19,20,21,22,25,26,27,28,29,30]},
  6:  {easy:[1,2,4,5,6,9,20,21,27], hard:[10,12,13,15,17,22,26,28,29,30]},
  7:  {easy:[1,4,13,17,20,22,23,27], hard:[8,9,10,11,12,15,24,29]},
  8:  {easy:[1,2,3,4,5,6,7,8,25], hard:[11,12,13,16,18,19,20,22,26,27]},
  9:  {easy:[1,2,3,4,5,6,7,8,22,23,24], hard:[9,10,11,12,13,15,18,27,28,29,30]},
  10: {easy:[1,2,3,4,6,25], hard:[9,10,11,15,19,20,22,23,26]},
  11: {easy:[1,2,3,4,5,6,7,8,14,16,21,29], hard:[12,19,20,22,23,24,25,26,28]},
  12: {easy:[1,2,3,4,5,6,7,18], hard:[8,9,16,22,25,26,29,30]},
  13: {easy:[1,2,3,4,5,6,18,20,21,29,30], hard:[7,8,9,11,12,16,17,23,27,28]},
  14: {easy:[1,2,3,4,5,7,8,17], hard:[11,14,15,20,21,25,28,30]},
  15: {easy:[1,2,3,4,11,12,13,15,17,18,19], hard:[6,7,8,9,20,21,23]},
  16: {easy:[6,7,13,15,25,29,30], hard:[1,2,3,4,5,8,9,10,11,12,14,18,19,21,22,27]},
  17: {easy:[4,5,6,10,12,17,18,19,21,22,24,26,29], hard:[1,2,3,7,8,9,15,16,23,28,30]},
  18: {easy:[5,10,13,14,19,26,29], hard:[1,2,3,4,8,9,17,18,20,23,24,28,30]},
  19: {easy:[1,2,4,5,7,8,11,13,17,18,19,21,22], hard:[3,6,9,10,12,15,16,20,23,24]}
};
const tierOf = (ti, idx) => {            // idx начинается с 1 (1..50)
  const t = TIERS[ti];
  if (!t) return idx > 30 ? 3 : 2;
  if (idx > 30) return (idx % 4 === 0) ? 2 : 3; // Новые задачи 31..50 — сложные (tier 3) и средне-сложные (tier 2) из SAT Bluebook
  return t.easy.includes(idx) ? 1 : t.hard.includes(idx) ? 3 : 2;
};
const safeGen = gen => {
  let last = null;
  for (let i = 0; i < 60; i++) {
    try {
      const x = gen();
      if (!x || !x.q) continue;
      last = x;
      if (/NaN|\$\{/.test(x.q)) continue;
      if (x.isGrid) {
        const n = Number(x.a);
        if (!isFinite(n) || Math.abs(n * 100 - Math.round(n * 100)) > 1e-6) continue;
      } else if (!x.opts || new Set(x.opts).size < 4) continue;
      return x;
    } catch (e) {}
  }
  return last;
};
var _mathDecks = {};
function _nextMathGenFromDeck(ti, tier) {
  const G = MATH_GENS[ti] || MATH_GENS[0];
  const key = ti + '_' + (tier || 'all');
  if (!_mathDecks[key] || !_mathDecks[key].length) {
    const hardIdx = [], medIdx = [], easyIdx = [];
    for (let k = 0; k < G.length; k++) {
      const tr = tierOf(ti, k + 1);
      if (tr === 3) hardIdx.push(k);
      else if (tr === 2) medIdx.push(k);
      else easyIdx.push(k);
    }
    let ordered;
    if (tier === 'boss' || tier === 'hard' || tier === 3) {
      ordered = [...shuffle(hardIdx), ...shuffle(medIdx), ...shuffle(easyIdx)];
    } else if (tier === 'medium' || tier === 2) {
      ordered = [...shuffle(medIdx), ...shuffle(hardIdx), ...shuffle(easyIdx)];
    } else if (tier === 'easy' || tier === 1) {
      ordered = [...shuffle(easyIdx), ...shuffle(medIdx), ...shuffle(hardIdx)];
    } else {
      // bank / all: shuffle all 50 patterns with hard/med mixed throughout, zero duplicates!
      ordered = shuffle(G.map((_, idx) => idx));
    }
    // Reverse so .pop() pulls from the front of `ordered`
    _mathDecks[key] = ordered.reverse();
  }
  const genIdx = _mathDecks[key].pop();
  return G[genIdx] || G[0];
}
function getMathQ(ti, tier, i) {
  const nz = x => /^-?\d+\.\d{5,}$/.test(x) ? String(+(+x).toFixed(4)) : x;
  const G = MATH_GENS[ti] || MATH_GENS[0];
  const gen = _nextMathGenFromDeck(ti, tier);
  const q = safeGen(gen) || safeGen(G[(i || 0) % G.length]) || safeGen(G[0]);
  const ans = nz(String(q.a)); let o = [];
  if (!q.isGrid) {
    o = [...new Set((q.opts || []).map(x => nz(String(x))))];
    if (!o.includes(ans)) o.push(ans);
    while (o.length < 4) o.push(isFinite(ans) ? String(+ans + o.length) : ans + ' (' + o.length + ')');
    if (o.length > 4) o = shuffle(o.filter(x => x !== ans)).slice(0, 3).concat(ans);
    o = shuffle(o);
  }
  return { q: q.q, ans, opts: o, isGrid: !!q.isGrid };
}
function fmtAns(a){a=String(a);var n=Number(a);return(isFinite(n)&&/^-?[\d.]+$/.test(a))?String(+n.toFixed(4)):a}
var GENERATORS=MATH_GENS;

 function num(s){s=String(s).trim().replace(/[−–]/g,'-').replace(/,/g,'');
 var m=s.match(/^(-?\d+(?:\.\d+)?|-?\.\d+)\s*\/\s*(-?\d+(?:\.\d+)?)$/);if(m)return +m[1]/+m[2];
 return /^-?(\d+\.?\d*|\.\d+)$/.test(s)?parseFloat(s):NaN}
function same(u,a){u=String(u).trim();a=String(a).trim();if(u.toLowerCase()===a.toLowerCase())return true;
 var x=num(u),y=num(a),tol=((a.split('.')[1]||'').length>=3)?0.001:1e-6;
 return isFinite(x)&&isFinite(y)&&Math.abs(x-y)<=tol}
