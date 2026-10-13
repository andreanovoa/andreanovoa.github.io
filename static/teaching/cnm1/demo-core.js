"use strict";
/* ---------- CNM1 demo core: shared by the standalone demos (same behaviour as the Class 2 pages) ----------
   Load after theme.css (end of <body>), before the page script.
   Colour roles (Okabe-Ito, as in the slides and notes): curve = function/model, orange = key element
   (current step, iterate, answer), teal = exact values/roots/converged, grey = guides and past steps. */
const $=id=>document.getElementById(id);
const num=id=>parseFloat($(id).value);
const COL={};
function readPalette(){const cs=getComputedStyle(document.documentElement);
  for(const k of ['bg','navy','curve','orange','teal','yellow','grey','soft'])COL[k]=cs.getPropertyValue('--'+k).trim();}
readPalette();
/* follow the site's light/dark toggle and accent (theme.js updates <html> on 'storage' events) */
const THEME_CBS=[];
function onThemeChange(cb){THEME_CBS.push(cb);}
new MutationObserver(()=>{readPalette();THEME_CBS.forEach(f=>f());})
  .observe(document.documentElement,{attributes:true,attributeFilter:['class','data-accent']});
/* tell the class page (module-demos.js) that the height changed */
(function(){if(window.parent===window)return;let queued=false;
  const post=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;
    try{window.parent.postMessage({type:'module-demo-resize'},location.origin);}catch(e){}});};
  new ResizeObserver(post).observe(document.documentElement);window.addEventListener('load',post);})();

/* erf / erfc: Abramowitz & Stegun 7.1.26 (|error| < 1.5e-7) */
function erf(x){const s=x<0?-1:1;x=Math.abs(x);const t=1/(1+0.3275911*x);
  const y=1-((((1.061405429*t-1.453152027)*t+1.421413741)*t-0.284496736)*t+0.254829592)*t*Math.exp(-x*x);return s*y;}
function erfc(x){return 1-erf(x);}

/* ---------- safe expression parser (whitelist + recursive descent, no eval) ---------- */
const FUNCS={sin:Math.sin,cos:Math.cos,tan:Math.tan,exp:Math.exp,log:Math.log,sqrt:Math.sqrt,abs:Math.abs,erfc:erfc,atan:Math.atan};
function compileExpr(src){
  const s=String(src).toLowerCase().replace(/\*\*/g,'^');
  if(!s.trim()) throw new Error('Type an expression in x');
  if(/[^0-9a-z+\-*\/^(). ]/.test(s)) throw new Error('Allowed: numbers, x, + − * / ^ ( ) and sin cos tan atan exp log sqrt abs erfc pi');
  for(const w of (s.match(/[a-z]+/g)||[])) if(w!=='x'&&w!=='pi'&&!(w in FUNCS)) throw new Error('Unknown name "'+w+'"');
  const toks=s.match(/\d+\.?\d*|\.\d+|[a-z]+|[+\-*\/^()]/g)||[];
  if(toks.join('')!==s.replace(/\s+/g,'')) throw new Error('Could not read the expression');
  let i=0;const peek=()=>toks[i],next=()=>toks[i++];
  const isNum=t=>t!==undefined&&/^[\d.]/.test(t),isName=t=>t!==undefined&&/^[a-z]/.test(t);
  function expr(){let a=term();while(peek()==='+'||peek()==='-'){const op=next(),l=a,r=term();a=op==='+'?(x=>l(x)+r(x)):(x=>l(x)-r(x));}return a;}
  function term(){let a=unary();for(;;){const t=peek();let op;
      if(t==='*'||t==='/')op=next();else if(isNum(t)||isName(t)||t==='(')op='*';else break;
      const l=a,r=unary();a=op==='*'?(x=>l(x)*r(x)):(x=>l(x)/r(x));}return a;}
  function unary(){if(peek()==='-'){next();const a=unary();return x=>-a(x);}if(peek()==='+'){next();return unary();}return power();}
  function power(){const a=primary();if(peek()==='^'){next();const b=unary();return x=>Math.pow(a(x),b(x));}return a;}
  function primary(){const t=next();
    if(t===undefined)throw new Error('Expression ends too early');
    if(isNum(t)){const v=parseFloat(t);return()=>v;}
    if(t==='x')return x=>x;
    if(t==='pi')return()=>Math.PI;
    if(t in FUNCS){if(next()!=='(')throw new Error(t+' needs brackets, e.g. '+t+'(x)');const a=expr();if(next()!==')')throw new Error('Missing )');const fn=FUNCS[t];return x=>fn(a(x));}
    if(t==='('){const a=expr();if(next()!==')')throw new Error('Missing )');return a;}
    throw new Error('Unexpected "'+t+'"');}
  const f=expr();if(i<toks.length)throw new Error('Unexpected "'+toks[i]+'"');
  f(1.234);return f;
}
const numD=f=>x=>{const h=1e-5*Math.max(1,Math.abs(x));return(f(x+h)-f(x-h))/(2*h);};
const numD2=f=>x=>{const h=1e-4*Math.max(1,Math.abs(x));return(f(x+h)-2*f(x)+f(x-h))/(h*h);};

/* ---------- formatting ---------- */
function fmt(v,sig){sig=sig||6;
  if(v===null||v===undefined)return '';
  if(Number.isNaN(v))return 'undefined';
  if(!isFinite(v))return v>0?'∞':'−∞';
  if(v===0)return '0';
  const a=Math.abs(v);let s;
  if(a>=1e6||a<1e-4){s=v.toExponential(Math.max(1,Math.min(sig,6)-3)).replace(/\.?0+e/,'e').replace('e+','e');}
  else{s=v.toPrecision(sig);if(s.indexOf('.')>=0)s=s.replace(/0+$/,'').replace(/\.$/,'');}
  return s.replace(/-/g,'−');}
/* a × 10^b in HTML, for errors and tiny numbers */
function sci(v,sig){if(v===0)return '0';if(!isFinite(v))return fmt(v);const e=Math.floor(Math.log10(Math.abs(v)));
  if(e>=-3&&e<6)return fmt(v,sig||4);let m=v/Math.pow(10,e);let ms=(+m.toPrecision(sig||3)).toString();
  if(Math.abs(+ms)>=10){ms=(+ms/10).toString();return ms.replace('-','−')+' × 10<sup>'+String(e+1).replace('-','−')+'</sup>';}
  return ms.replace('-','−')+' × 10<sup>'+String(e).replace('-','−')+'</sup>';}
const P=v=>v<0?'('+fmt(v)+')':fmt(v);
const sb=(b,i)=>b+'<sub>'+i+'</sub>';
const ssub=(b,i)=>b+'<tspan dy="0.32em" font-size="72%">'+i+'</tspan><tspan dy="-0.32em"> </tspan>';

/* ---------- plotting (plain SVG) ---------- */
function niceStep(span,n){const raw=span/Math.max(1,n);const p=Math.pow(10,Math.floor(Math.log10(raw)));const m=raw/p;return(m<1.5?1:m<3?2:m<7?5:10)*p;}
function ticks(a,b,n){const st=niceStep(b-a,n);const out=[];for(let v=Math.ceil(a/st-1e-9)*st;v<=b+st*1e-9;v+=st)out.push(Math.abs(v)<st*1e-9?0:+v.toPrecision(12));return out;}
function autoY(fns,a,b,o){o=o||{};let v=[];
  for(const fn of fns)for(let i=0;i<=400;i++){const y=fn(a+(b-a)*i/400);if(isFinite(y))v.push(y);}
  if(o.extra)v.push(...o.extra.filter(isFinite));
  if(!v.length)return[-1,1];
  v.sort((p,q)=>p-q);let lo=v[0],hi=v[v.length-1];
  const p3=v[Math.floor(v.length*.03)],p97=v[Math.ceil(v.length*.97)-1];
  if(!o.noClip&&p97>p3&&hi-lo>6*(p97-p3)){lo=p3;hi=p97;}
  if(!o.noZero){lo=Math.min(lo,0);hi=Math.max(hi,0);}
  if(hi-lo<1e-12){lo-=1;hi+=1;}
  const pad=(hi-lo)*(o.pad==null?0.08:o.pad);return[lo-pad,hi+pad];}
const cl=v=>Math.max(-1e5,Math.min(1e5,v));
const lg=v=>Math.log10(v);
class Plot{
  constructor(svg){this.svg=svg;}
  /* o.log: log y; o.logx: log x; o.hfrac: height factor; o.h: fixed height (px) */
  begin(xr,yr,o){o=o||{};
    const w=Math.max(260,Math.round(this.svg.parentElement.clientWidth||800));
    const small=w<600;this.small=small;
    const hmax=Math.max(320,window.innerHeight*0.62);
    let h=Math.round(Math.min(hmax,Math.max(250,w*(small?0.85:0.6))));
    if(o.hfrac)h=Math.round(Math.max(170,h*o.hfrac));if(o.h)h=o.h;
    this.W=w;this.H=h;this.fs=small?15:18;
    this.m={l:small?50:70,r:small?12:22,t:12,b:small?34:44};
    if(o.ml)this.m.l=o.ml;
    this.pw=w-this.m.l-this.m.r;this.ph=h-this.m.t-this.m.b;
    this.log=!!o.log;this.logx=!!o.logx;
    this.x0=this.logx?lg(xr[0]):xr[0];this.x1=this.logx?lg(xr[1]):xr[1];
    this.y0=this.log?lg(yr[0]):yr[0];this.y1=this.log?lg(yr[1]):yr[1];
    this.L={back:[],under:[],mid:[],top:[],front:[]};return this;}
  /* current view in data units */
  get xr(){return this.logx?[10**this.x0,10**this.x1]:[this.x0,this.x1];}
  get yr(){return this.log?[10**this.y0,10**this.y1]:[this.y0,this.y1];}
  X(x){if(this.logx)x=lg(x);return +cl(this.m.l+(x-this.x0)/(this.x1-this.x0)*this.pw).toFixed(2);}
  Y(y){if(this.log)y=lg(y);return +cl(this.m.t+(this.y1-y)/(this.y1-this.y0)*this.ph).toFixed(2);}
  /* inverse maps (pixels -> data) */
  dx(px){const v=this.x0+(px-this.m.l)/this.pw*(this.x1-this.x0);return this.logx?10**v:v;}
  dy(py){const v=this.y1-(py-this.m.t)/this.ph*(this.y1-this.y0);return this.log?10**v:v;}
  st(s){s=s||{};return `stroke="${s.c||COL.navy}" stroke-width="${s.w||3}" fill="none" stroke-linecap="round" stroke-linejoin="round"${s.dash?` stroke-dasharray="${s.dash}"`:''}${s.op!=null?` opacity="${s.op}"`:''}`;}
  seg(x1,y1,x2,y2,s,layer){if(![x1,y1,x2,y2].every(isFinite))return;this.L[layer||'mid'].push(`<line x1="${this.X(x1)}" y1="${this.Y(y1)}" x2="${this.X(x2)}" y2="${this.Y(y2)}" ${this.st(s)}/>`);}
  vline(x,s,layer){const X=this.X(x);this.L[layer||'mid'].push(`<line x1="${X}" y1="${this.m.t}" x2="${X}" y2="${this.m.t+this.ph}" ${this.st(s)}/>`);}
  hline(y,s,layer){const Y=this.Y(y);this.L[layer||'mid'].push(`<line x1="${this.m.l}" y1="${Y}" x2="${this.m.l+this.pw}" y2="${Y}" ${this.st(s)}/>`);}
  path(pts,s,layer){let d='',pen=false;for(const p of pts){if(!p||!isFinite(p[0])||!isFinite(p[1])){pen=false;continue;}d+=(pen?'L':'M')+this.X(p[0])+' '+this.Y(p[1]);pen=true;}
    if(d)this.L[layer||'mid'].push(`<path d="${d}" ${this.st(s)}/>`);}
  /* filled polygon in data coordinates */
  area(pts,fill,op,stroke,layer){const q=pts.filter(p=>p&&isFinite(p[0])&&isFinite(p[1]));if(q.length<3)return;
    const d=q.map((p,i)=>(i?'L':'M')+this.X(p[0])+' '+this.Y(p[1])).join('')+'Z';
    this.L[layer||'under'].push(`<path d="${d}" fill="${fill}" fill-opacity="${op}"${stroke?` stroke="${stroke}" stroke-width="1.5" stroke-opacity=".8"`:''}/>`);}
  curve(fn,s,xa,xb){const n=Math.max(300,Math.round(this.pw*1.5)),span=this.y1-this.y0,lo=this.y0-4*span,hi=this.y1+4*span;const pts=[];let prev=null;
    const a=xa==null?this.x0:(this.logx?lg(xa):xa),b=xb==null?this.x1:(this.logx?lg(xb):xb);
    for(let i=0;i<=n;i++){const u=a+(b-a)*i/n,x=this.logx?10**u:u;let y=fn(x);
      if(!isFinite(y)||(this.log&&!(y>0))){pts.push(null);prev=null;continue;}
      const yy=this.log?lg(y):y;
      if(prev!==null&&((prev>this.y1&&yy<this.y0)||(prev<this.y0&&yy>this.y1)))pts.push(null);
      prev=yy;const yc=Math.max(lo,Math.min(hi,yy));pts.push([x,this.log?10**yc:yc]);}
    this.path(pts,s);}
  line(x1,y1,x2,y2,s,layer){/* infinite line through two points, clipped to plot */
    if(x1===x2){this.vline(x1,s,layer);return;}const m=(y2-y1)/(x2-x1);
    this.seg(this.x0,y1+m*(this.x0-x1),this.x1,y1+m*(this.x1-x1),s,layer);}
  dot(x,y,r,fill,layer,stroke){if(!isFinite(x)||!isFinite(y))return;this.L[layer||'top'].push(`<circle cx="${this.X(x)}" cy="${this.Y(y)}" r="${r}" fill="${fill}" stroke="${stroke||COL.bg}" stroke-width="2.5"/>`);}
  ring(x,y,r,c,layer){if(!isFinite(x)||!isFinite(y))return;this.L[layer||'top'].push(`<circle cx="${this.X(x)}" cy="${this.Y(y)}" r="${r}" fill="${COL.bg}" stroke="${c}" stroke-width="3"/>`);}
  band(xa,xb,fill,op){const a=this.X(Math.min(xa,xb)),b=this.X(Math.max(xa,xb));this.L.under.push(`<rect x="${a}" y="${this.m.t}" width="${Math.max(0,b-a)}" height="${this.ph}" fill="${fill}" opacity="${op}"/>`);}
  text(x,y,t,o){o=o||{};let X=this.X(x)+(o.dx||0),Y=this.Y(y)+(o.dy||0);
    const pad=o.anchor==='start'||o.anchor==='end'?4:18;
    X=Math.max(this.m.l+pad,Math.min(this.m.l+this.pw-pad,X));Y=Math.max(this.m.t+this.fs,Math.min(this.m.t+this.ph-6,Y));
    this.ptext(X,Y,t,o);}
  /* text in pixel coordinates, with a halo in the background colour so it stays legible in both themes */
  ptext(X,Y,t,o){o=o||{};this.L.front.push(`<text x="${X}" y="${Y}" fill="${o.c||COL.navy}" font-size="${o.size||this.fs}" font-weight="${o.weight||650}" text-anchor="${o.anchor||'middle'}" stroke="${COL.bg}" stroke-width="5" stroke-linejoin="round" paint-order="stroke">${t}</text>`);}
  pill(X,Y,t,fill){const w=Math.max(30,t.replace(/<[^>]+>/g,'').length*10+18),h=this.small?24:28;
    this.L.front.push(`<rect x="${X-w/2}" y="${Y}" width="${w}" height="${h}" rx="${h/2}" fill="${fill}"/><text x="${X}" y="${Y+h/2+this.fs*0.36}" fill="${COL.bg}" font-size="${this.fs}" font-weight="800" text-anchor="middle">${t}</text>`);}
  axisLabels(list,dy){if(!list.length)return;const yl=Math.max(this.m.t+this.fs+40,Math.min(this.m.t+this.ph-6,this.Y(0)+(dy||32)));
    const idx=list.map((q,i)=>i).sort((i,j)=>list[i][0]-list[j][0]);
    const XS=spread(idx.map(i=>this.X(list[i][0])),this.small?26:32,this.m.l+14,this.m.l+this.pw-14);
    idx.forEach((i,j)=>this.ptext(XS[j],yl,list[i][1],{c:list[i][2],weight:800}));}
  logTicks(a,b,maxN){const lo=Math.ceil(a-1e-9),hi=Math.floor(b+1e-9),stp=Math.max(1,Math.ceil((hi-lo+1)/maxN));const t=[];for(let e=hi;e>=lo;e-=stp)t.push(e);return t;}
  axes(o){o=o||{};const m=this.m,pw=this.pw,ph=this.ph,B=this.L.back,fs=this.fs;
    const pow=e=>`10<tspan dy="-0.55em" font-size="70%">${String(e).replace('-','−')}</tspan>`;
    const xt=this.logx?this.logTicks(this.x0,this.x1,this.small?5:8):(o.xticks||ticks(this.x0,this.x1,Math.max(3,Math.round(pw/(this.small?70:100)))));
    for(const v of xt){const X=this.logx?this.X(10**v):this.X(v);if(X<m.l-0.5||X>m.l+pw+0.5)continue;
      B.push(`<line x1="${X}" y1="${m.t}" x2="${X}" y2="${m.t+ph}" stroke="${COL.grey}" stroke-width="1" opacity=".45"/>`);
      B.push(`<text x="${X}" y="${m.t+ph+fs+8}" fill="${COL.navy}" font-size="${fs}" text-anchor="middle">${this.logx?pow(v):(o.xfmt?o.xfmt(v):fmt(v,4))}</text>`);}
    const yt=this.log?this.logTicks(this.y0,this.y1,this.small?5:8):ticks(this.y0,this.y1,Math.max(3,Math.round(ph/(this.small?55:70))));
    for(const v of yt){const Y=this.log?this.Y(10**v):this.Y(v);if(Y<m.t-0.5||Y>m.t+ph+0.5)continue;
      B.push(`<line x1="${m.l}" y1="${Y}" x2="${m.l+pw}" y2="${Y}" stroke="${COL.grey}" stroke-width="1" opacity=".45"/>`);
      B.push(`<text x="${m.l-8}" y="${Y+fs*0.35}" fill="${COL.navy}" font-size="${fs}" text-anchor="end">${this.log?pow(v):(o.yfmt?o.yfmt(v):fmt(v,4))}</text>`);}
    B.push(`<rect x="${m.l}" y="${m.t}" width="${pw}" height="${ph}" fill="none" stroke="${COL.grey}" stroke-width="1.5"/>`);
    if(!this.log&&!o.noXaxis&&this.y0<0&&this.y1>0){const Y=this.Y(0);B.push(`<line x1="${m.l}" y1="${Y}" x2="${m.l+pw}" y2="${Y}" stroke="${COL.navy}" stroke-width="2.5"/>`);}
    if(!this.logx&&!o.noYaxis&&this.x0<0&&this.x1>0){const X=this.X(0);B.push(`<line x1="${X}" y1="${m.t}" x2="${X}" y2="${m.t+ph}" stroke="${COL.navy}" stroke-width="2.5"/>`);}
    if(o.xlabel)this.ptext(m.l+pw-6,m.t+ph-10,o.xlabel,{anchor:'end',weight:600});
    if(o.ylabel)this.ptext(m.l+10,m.t+fs+6,o.ylabel,{anchor:'start',weight:600});}
  end(){const m=this.m,L=this.L,id=this.svg.id+'-clip';
    this.svg.setAttribute('viewBox',`0 0 ${this.W} ${this.H}`);this.svg.setAttribute('width',this.W);this.svg.setAttribute('height',this.H);
    this.svg.innerHTML=`<defs><clipPath id="${id}"><rect x="${m.l}" y="${m.t}" width="${this.pw}" height="${this.ph}"/></clipPath></defs><g>${L.back.join('')}</g><g clip-path="url(#${id})">${L.under.join('')}${L.mid.join('')}${L.top.join('')}</g><g>${L.front.join('')}</g>`;}
}
/* spread sorted pixel positions so neighbours are at least `gap` apart (keeps order) */
function spread(xs,gap,lo,hi){const o=xs.slice();
  for(let it=0;it<50;it++){let moved=false;
    for(let i=1;i<o.length;i++){const d=o[i]-o[i-1];if(d<gap-0.5){const s=(gap-d)/2;o[i-1]-=s;o[i]+=s;moved=true;}}
    for(let i=0;i<o.length;i++){if(o[i]<lo+i*gap)o[i]=lo+i*gap;const r=hi-(o.length-1-i)*gap;if(o[i]>r)o[i]=r;}
    if(!moved)break;}
  return o;}
/* direct labels at the ends of lines: nudged apart vertically so they never overlap */
function endLabels(p,labels,o){o=o||{};const yMin=p.m.t+p.fs+4,yMax=p.m.t+p.ph-8,gap=p.fs+6,w=o.w||150;
  labels.forEach(L=>{L.Y=Math.max(yMin,Math.min(yMax,L.Y+p.fs*0.35));L.right=L.X>p.m.l+p.pw-w;L.X=L.right?L.X-12:L.X+12;});
  labels.sort((u,v)=>v.Y-u.Y);
  for(let i=0;i<labels.length;i++)for(let j=0;j<i;j++){const u=labels[j],v=labels[i];if(Math.abs(u.X-v.X)<w&&Math.abs(u.Y-v.Y)<gap)v.Y=u.Y-gap;}
  for(const L of labels)p.ptext(L.X,Math.max(yMin,L.Y),L.t,{anchor:L.right?'end':'start',c:L.c,weight:800});}

/* ---------- UI helpers ---------- */
function setStatus(kind,html,id){const s=$(id||'status');s.className='status '+(kind||'');s.innerHTML=html||'&nbsp;';}
function setFormula(html,id){$(id||'formula').innerHTML=html||'&nbsp;';}
function renderTable(id,head,rows,cur,o){o=o||{};const t=$(id);
  t.innerHTML=(head&&head.length?'<thead><tr>'+head.map(h=>'<th>'+h+'</th>').join('')+'</tr></thead>':'')+'<tbody>'+rows.map((r,i)=>'<tr'+(i===cur?' class="cur"':'')+'>'+r.map((c,j)=>{const cls=o.cellClass?o.cellClass(i,j):'';return '<td'+(cls?` class="${cls}"`:'')+'>'+c+'</td>';}).join('')+'</tr>').join('')+'</tbody>';
  const row=t.querySelector('tr.cur')||t.querySelector('td.new'),w=t.parentElement;
  if(row&&w.scrollHeight>w.clientHeight){const r=row.tagName==='TD'?row.parentElement:row,top=r.offsetTop,hh=t.tHead?t.tHead.offsetHeight:0;
    if(top-hh<w.scrollTop)w.scrollTop=top-hh;else if(top+r.offsetHeight>w.scrollTop+w.clientHeight)w.scrollTop=top+r.offsetHeight-w.clientHeight;}}
function fillSelect(id,list){$(id).innerHTML=list.map(p=>`<option value="${p.id}">${p.label}</option>`).join('');}
/* number box + slider pair */
function linkSlider(numId,rangeId,cb,constrain=()=>{}){const n=$(numId),r=$(rangeId);
  n.addEventListener('input',()=>{const v=parseFloat(n.value);if(isFinite(v)){constrain();r.value=n.value;cb();}});
  n.addEventListener('keydown',e=>{if(e.key==='Enter')n.blur();});
  r.addEventListener('input',()=>{n.value=+(+r.value).toFixed(6);constrain();r.value=n.value;cb();});
  r.addEventListener('change',()=>r.blur());}
function setSliderRange(rangeId,lo,hi,st){const r=$(rangeId);st=st||niceStep(hi-lo,200);r.min=Math.floor(lo/st)*st;r.max=Math.ceil(hi/st)*st;r.step=st;}
function setVal(numId,v){$(numId).value=+(+v).toFixed(6);const r=$(numId+'R');if(r)r.value=v;}
function onSelectChange(id,cb){$(id).addEventListener('change',()=>{$(id).blur();cb();});}
function onNumber(id,cb){$(id).addEventListener('input',()=>{if(isFinite(num(id)))cb();});$(id).addEventListener('keydown',e=>{if(e.key==='Enter')e.target.blur();});}
function debounce(fn,ms){let t=null;return()=>{clearTimeout(t);t=setTimeout(fn,ms);};}

/* ---------- step / back / reset / play controller with keyboard (clicker friendly) ----------
   render(k, zoomK): k is the step shown; zoomK eases towards k when "Zoom in with iterations" is ticked. */
function Stepper(render){
  const S={k:0,last:0,timer:null,delay:1500,zoomK:0,zoomTimer:null,zoomFrame:null};const pb=$('btnPlay');
  const zoomBox=$('zoomWithIterations'),zoomOn=()=>!!(zoomBox&&zoomBox.checked);
  S.show=()=>render(S.k,S.zoomK);
  S.set=k=>{S.k=Math.max(0,Math.min(S.last,k));clearTimeout(S.zoomTimer);S.zoomTimer=null;if(S.zoomFrame)cancelAnimationFrame(S.zoomFrame);S.zoomFrame=null;
    if(!zoomOn()||S.k<=S.zoomK)S.zoomK=S.k;
    render(S.k,S.zoomK);
    if(zoomOn()&&S.k>S.zoomK){const target=S.k;S.zoomTimer=setTimeout(()=>{if(!zoomOn()||S.k!==target)return;
      const start=S.zoomK,started=performance.now(),duration=700;
      const animate=now=>{if(!zoomOn()||S.k!==target){S.zoomFrame=null;return;}
        const t=Math.min(1,(now-started)/duration),ease=t*t*(3-2*t);S.zoomK=start+(target-start)*ease;render(S.k,S.zoomK);
        if(t<1)S.zoomFrame=requestAnimationFrame(animate);else S.zoomFrame=null;};
      S.zoomFrame=requestAnimationFrame(animate);},600);}};
  S.pause=()=>{if(S.timer)clearInterval(S.timer);S.timer=null;pb.textContent='Play';};
  S.step=()=>{if(S.k<S.last)S.set(S.k+1);};
  S.back=()=>{S.pause();S.set(S.k-1);};
  S.reset=()=>{S.pause();S.set(0);};
  S.end=()=>{S.pause();S.set(S.last);};
  S.toggle=()=>{if(S.timer){S.pause();return;}if(S.k>=S.last)S.set(0);pb.textContent='Pause';
    S.timer=setInterval(()=>{S.set(S.k+1);if(S.k>=S.last)S.pause();},S.delay);};
  $('btnStep').onclick=()=>{S.pause();S.step();};
  $('btnBack').onclick=S.back;$('btnReset').onclick=S.reset;pb.onclick=S.toggle;
  if($('btnEnd'))$('btnEnd').onclick=S.end;
  document.addEventListener('keydown',e=>{if(e.ctrlKey||e.metaKey||e.altKey)return;
    const t=e.target,tag=t&&t.tagName,k=e.key;
    const inField=tag==='INPUT'||tag==='SELECT'||tag==='TEXTAREA';
    if(inField&&k==='Escape'){t.blur();return;}
    if(inField&&!(k==='PageDown'||k==='PageUp'))return;
    if(k==='ArrowRight'||k==='PageDown'){e.preventDefault();S.pause();S.step();}
    else if(k==='ArrowLeft'||k==='PageUp'){e.preventDefault();S.back();}
    else if(k==='r'||k==='R'||k==='Home'){e.preventDefault();S.reset();}
    else if(k==='p'||k==='P'){e.preventDefault();S.toggle();}
    else if(k==='End'){e.preventDefault();S.end();}});
  let rt=null;window.addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(S.show,80);});
  onThemeChange(()=>S.show());
  return S;}

/* ---------- drag to pan, scroll to zoom ----------
   view = {xr, yr} in data units (null = automatic). opts.onDown(e, data) may claim the pointer (e.g. to drag a point);
   opts.lockY keeps the y range automatic; opts.onView(view) is called after every change. */
function enablePanZoom(plot,view,redraw,opts){opts=opts||{};const svg=plot.svg;let drag=null;
  const zoomOff=()=>{const z=$('zoomWithIterations');if(z)z.checked=false;};
  const px=e=>{const r=svg.getBoundingClientRect();return{x:(e.clientX-r.left)*plot.W/r.width,y:(e.clientY-r.top)*plot.H/r.height};};
  const inside=q=>q.x>=plot.m.l&&q.x<=plot.m.l+plot.pw&&q.y>=plot.m.t&&q.y<=plot.m.t+plot.ph;
  const unx=v=>plot.logx?10**v:v,uny=v=>plot.log?10**v:v;
  const commit=(x0,x1,y0,y1)=>{view.xr=[unx(x0),unx(x1)];if(!opts.lockY)view.yr=[uny(y0),uny(y1)];if(opts.onView)opts.onView(view);redraw();};
  svg.addEventListener('pointerdown',e=>{const q=px(e);if(!inside(q))return;
    if(opts.onDown&&opts.onDown(e,{x:plot.dx(q.x),y:plot.dy(q.y),px:q.x,py:q.y}))return;
    zoomOff();drag={id:e.pointerId,x:e.clientX,y:e.clientY,x0:plot.x0,x1:plot.x1,y0:plot.y0,y1:plot.y1};svg.setPointerCapture(e.pointerId);});
  svg.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;
    const r=svg.getBoundingClientRect(),dx=(e.clientX-drag.x)*plot.W/r.width,dy=(e.clientY-drag.y)*plot.H/r.height;
    const sx=-dx/plot.pw*(drag.x1-drag.x0),sy=dy/plot.ph*(drag.y1-drag.y0);
    commit(drag.x0+sx,drag.x1+sx,drag.y0+sy,drag.y1+sy);});
  for(const type of ['pointerup','pointercancel'])svg.addEventListener(type,e=>{if(drag&&drag.id===e.pointerId)drag=null;});
  svg.addEventListener('wheel',e=>{const q=px(e);if(!inside(q))return;e.preventDefault();zoomOff();
    const fx=(q.x-plot.m.l)/plot.pw,fy=(plot.m.t+plot.ph-q.y)/plot.ph,factor=e.deltaY<0?0.85:1/0.85;
    const z=(a,b,f)=>{const c=a+f*(b-a),s=(b-a)*factor;return[c-f*s,c+(1-f)*s];};
    const X=z(plot.x0,plot.x1,fx),Y=z(plot.y0,plot.y1,fy);commit(X[0],X[1],Y[0],Y[1]);},{passive:false});}
/* Reset view button and zoom checkbox (call once per page) */
function bindViewControls(views,redraw){const reset=()=>{for(const v of views){v.xr=null;v.yr=null;}};
  if($('btnResetView'))$('btnResetView').addEventListener('click',()=>{const z=$('zoomWithIterations');if(z)z.checked=false;reset();redraw();});
  if($('zoomWithIterations'))$('zoomWithIterations').addEventListener('change',()=>{reset();redraw(true);});
  return reset;}
/* ---------- end shared core ---------- */
