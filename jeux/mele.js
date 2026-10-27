'use strict';
/* Mo mélé — mots mêlés sur les thèmes de Ti Bac Kréyol */
const $=id=>document.getElementById(id);
const clean=s=>JK.plain(s).replace(/[^A-Z]/g,'');
const DIRS={easy:[[1,0],[0,1]],normal:[[1,0],[0,1],[1,1],[1,-1]],hard:[[1,0],[0,1],[1,1],[1,-1],[-1,0],[0,-1],[-1,-1],[-1,1]]};
const LEVELS={easy:{size:8,n:6,max:8,label:'Ti moun'},normal:{size:10,n:8,max:10,label:'Normal'},hard:{size:12,n:10,max:12,label:'Difficile'}};

function eligible(t,max){return [...new Set(t.a.map(s=>s.replace(/^\*+/,'').split('|')[0]))].filter(n=>{const c=clean(n);return c.length>=3&&c.length<=max;});}
function themesFor(level){
  const L=LEVELS[level];
  return THEMES.map((t,i)=>({t,i})).filter(({t})=>!t.off&&(level==='easy'?!!t.kid:!t.kid)&&eligible(t,L.max).length>=L.n+2);
}
/* Construit une grille ; renvoie null si les mots ne rentrent pas */
function build(words,size,dirs,r){
  const g=Array.from({length:size},()=>Array(size).fill(''));const placed=[];
  for(const w of words.slice().sort((a,b)=>clean(b).length-clean(a).length)){
    const c=clean(w);let ok=false;
    for(let k=0;k<300&&!ok;k++){
      const [dx,dy]=dirs[Math.floor(r()*dirs.length)];
      const x0=Math.floor(r()*size),y0=Math.floor(r()*size),x1=x0+dx*(c.length-1),y1=y0+dy*(c.length-1);
      if(x1<0||x1>=size||y1<0||y1>=size)continue;
      let fits=true;for(let i=0;i<c.length;i++){const ch=g[y0+dy*i][x0+dx*i];if(ch&&ch!==c[i]){fits=false;break;}}
      if(!fits)continue;
      for(let i=0;i<c.length;i++)g[y0+dy*i][x0+dx*i]=c[i];
      placed.push({w,c,x0,y0,dx,dy});ok=true;
    }
    if(!ok)return null;
  }
  const AL='AEIOUNRSTLKMPDBGZWYCHJVF';
  for(let y=0;y<size;y++)for(let x=0;x<size;x++)if(!g[y][x])g[y][x]=AL[Math.floor(r()*AL.length)];
  return {g,placed};
}
let S=null,timer=null,daily=true,level='normal';
function newGame(isDaily,lv){
  daily=isDaily;level=lv||level;const L=LEVELS[level];
  const r=JK.rng(isDaily?'mele-'+JK.today()+'-'+level:Math.random());
  const ths=themesFor(level);const th=ths[Math.floor(r()*ths.length)];
  let res=null,words;
  for(let k=0;k<30&&!res;k++){words=JK.shuffle(eligible(th.t,L.max),r).slice(0,L.n);res=build(words,L.size,DIRS[level],r);}
  S={title:th.t.t,size:L.size,g:res.g,placed:res.placed,found:new Set(),t0:Date.now(),done:false};
  const saved=JK.load('mele',{});
  if(isDaily&&saved.key===JK.today()+level){S.found=new Set(saved.found||[]);S.t0=Date.now()-(saved.elapsed||0)*1000;if(saved.done)S.done=true;}
  render();clearInterval(timer);if(!S.done)timer=setInterval(tick,1000);tick();
  if(S.done)end(true);
}
function persist(){if(daily)JK.save('mele',{key:JK.today()+level,found:[...S.found],elapsed:Math.round((Date.now()-S.t0)/1000),done:S.done});}
function tick(){const s=Math.round(((S.done&&S.end?S.end:Date.now())-S.t0)/1000);$('timer').textContent=`${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;}
function render(){
  $('mtitle').textContent=S.title;
  $('mlevel').innerHTML=Object.entries(LEVELS).map(([k,v])=>`<button type="button" data-lv="${k}" aria-pressed="${k===level}">${v.label}</button>`).join('');
  $('mlevel').querySelectorAll('[data-lv]').forEach(b=>b.onclick=()=>{$('end').hidden=true;newGame(daily,b.dataset.lv);});
  $('mmode').textContent=daily?'Grille du jour':'Grille au hasard';
  const grid=$('grid');grid.style.gridTemplateColumns=`repeat(${S.size},1fr)`;
  grid.innerHTML=S.g.map((row,y)=>row.map((ch,x)=>`<span data-x="${x}" data-y="${y}">${ch}</span>`).join('')).join('');
  paintFound();
}
function cells(p){const out=[];const c=p.c||'';for(let i=0;i<(p.len||c.length);i++)out.push([p.x0+p.dx*i,p.y0+p.dy*i]);return out;}
function cellEl(x,y){return $('grid').children[y*S.size+x];}
function paintFound(){
  [...$('grid').children].forEach(s=>s.classList.remove('found'));
  S.placed.filter(p=>S.found.has(p.c)).forEach(p=>cells(p).forEach(([x,y])=>cellEl(x,y).classList.add('found')));
  $('words').innerHTML=S.placed.map(p=>`<span class="${S.found.has(p.c)?'found':''}">${JK.esc(p.w)}</span>`).join('');
  $('count').textContent=`${S.found.size} / ${S.placed.length}`;
}
/* Sélection au doigt ou à la souris */
let sel=null;
function at(e){const el=document.elementFromPoint(e.clientX,e.clientY);return el&&el.dataset&&el.dataset.x!=null?[+el.dataset.x,+el.dataset.y]:null;}
function line(a,b){const dx=Math.sign(b[0]-a[0]),dy=Math.sign(b[1]-a[1]),lx=Math.abs(b[0]-a[0]),ly=Math.abs(b[1]-a[1]);
  if(lx&&ly&&lx!==ly)return null;const n=Math.max(lx,ly)+1;return {x0:a[0],y0:a[1],dx,dy,len:n};}
function showSel(){[...$('grid').children].forEach(s=>s.classList.remove('sel'));if(sel&&sel.ln)cells(sel.ln).forEach(([x,y])=>cellEl(x,y).classList.add('sel'));}
function bindGrid(){
  const g=$('grid');
  g.addEventListener('pointerdown',e=>{if(S.done)return;const p=at(e);if(!p)return;e.preventDefault();sel={a:p,ln:{x0:p[0],y0:p[1],dx:0,dy:0,len:1}};showSel();});
  window.addEventListener('pointermove',e=>{if(!sel)return;const p=at(e);if(!p)return;const ln=line(sel.a,p);if(ln){sel.ln=ln;showSel();}});
  window.addEventListener('pointerup',()=>{if(!sel)return;const word=cells(sel.ln).map(([x,y])=>S.g[y][x]).join('');sel=null;showSel();check(word);});
}
function check(word){
  if(word.length<3)return;
  const rev=[...word].reverse().join('');
  const p=S.placed.find(p=>!S.found.has(p.c)&&(p.c===word||p.c===rev));
  if(p){S.found.add(p.c);JK.good();paintFound();persist();if(S.found.size===S.placed.length){S.done=true;S.end=Date.now();clearInterval(timer);tick();persist();JK.win();end(false);}}
}
function end(restored){
  const s=Math.round(((S.end||Date.now())-S.t0)/1000);const tm=`${Math.floor(s/60)} min ${String(s%60).padStart(2,'0')} s`;
  if(daily&&!restored)JK.record('mele_'+level,true);
  const txt=`Mo mélé du ${JK.today().split('-').reverse().slice(0,2).join('/')} (${LEVELS[level].label}) — ${S.placed.length} mots en ${tm} ⏱️\nThème : ${S.title}\nhttps://tibackreyol.vercel.app/jeux/mele.html`;
  $('end').hidden=false;
  $('end').innerHTML=`<h2>Bravo ! 🎉</h2><p>Tous les mots trouvés en <b>${tm}</b>.</p>${daily?JK.statsHtml('mele_'+level,{won:'terminées'}):''}
  <div class="cta">${daily?'<button class="btn" id="share" type="button">Partager</button>':''}<button class="btn ghost" id="again" type="button">Une autre grille</button></div>`;
  if(daily)$('share').onclick=()=>JK.share(txt);
  $('again').onclick=()=>{$('end').hidden=true;newGame(false);};
  if(daily)JK.board('mele_'+level,{score:Math.max(0,36000-s),xp:{easy:4,normal:6,hard:8}[level],detail:tm});
}
JK.header('Mo mélé','🔎');
bindGrid();
$('newg').onclick=()=>{$('end').hidden=true;newGame(false);};
newGame(true,'normal');
