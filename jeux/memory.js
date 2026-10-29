'use strict';
/* Mémory Ti moun — retrouve les paires image / mot créole */
const $=id=>document.getElementById(id);
const VOC=[
 ['🐶','chyen','chien'],['🐱','chat','chat'],['🐔','poul','poule'],['🐷','kochon','cochon'],['🐐','kabrit','cabri'],['🐟','pwason','poisson'],
 ['🦀','krab','crabe'],['🐢','tòti','tortue'],['🐦','zwazo','oiseau'],['🦎','zanoli','anolis'],['🐮','bèf','bœuf'],['🐴','chwal','cheval'],
 ['🦟','maringwen','moustique'],['🐜','fonmi','fourmi'],['🥭','mango','mangue'],['🍌','fig','banane'],['🥥','koko','noix de coco'],['🍊','zoranj','orange'],
 ['🍋','sitwon','citron'],['🍍','zannanna','ananas'],['🌶️','piman','piment'],['🥑','zaboka','avocat'],['☀️','solèy','soleil'],['🌧️','lapli','pluie'],
 ['🌙','lalin','lune'],['⭐','zétwal','étoile'],['🌊','lanmè','mer'],['🌳','pyé-bwa','arbre'],['🌺','flè','fleur'],['🥁','tanbou','tambour'],
 ['⛵','bato','bateau'],['👟','soulyé','chaussure'],['🔪','kouto','couteau'],['🥄','kiyè','cuillère'],['🍽️','zasyèt','assiette'],['🐝','myèl','abeille']
];
const LEVELS={easy:{n:6,cols:3,label:'Ti moun',mix:false},normal:{n:8,cols:4,label:'Normal',mix:true},hard:{n:10,cols:4,label:'Difficile',mix:true}};
let level=(()=>{try{return localStorage.getItem('jk_mem_lvl')||'normal';}catch(e){return 'normal';}})();
let cards=[],open=[],found=0,moves=0,t0=0,timer=null,daily=true,busy=false;

function start(isDaily){
  daily=isDaily;$('end').hidden=true;clearInterval(timer);
  const L=LEVELS[level];const r=JK.rng(isDaily?'mem-'+level+'-'+JK.today():Math.random());
  const pick=JK.shuffle(VOC,r).slice(0,L.n);
  cards=JK.shuffle(pick.flatMap((v,i)=>[{p:i,img:true,v},{p:i,img:!L.mix,v}]),r);
  open=[];found=0;moves=0;t0=0;busy=false;$('timer').textContent='0:00';
  const sv=JK.load('mem_'+level,{});
  $('seg').querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.l===level));
  if(isDaily&&sv.day===JK.today()&&sv.done){moves=sv.moves;return end(true,sv.s);}
  render();
}
function face(c){return c.img?`<span class="em">${c.v[0]}</span>${LEVELS[level].mix?'':`<small>${JK.esc(c.v[1])}</small>`}`:`<span class="wd">${JK.esc(c.v[1])}</span>`;}
function render(){
  const L=LEVELS[level];
  $('play').innerHTML=`<div class="qz-top"><span>${daily?'Défi du jour · '+L.label:'Partie libre · '+L.label}</span><span>${moves} coup${moves>1?'s':''}</span></div>
    <div class="mem-grid" style="grid-template-columns:repeat(${L.cols},1fr)">${cards.map((c,i)=>`<button type="button" class="mem-card ${c.done?'done':''} ${c.up||c.done?'up':''}" data-i="${i}" aria-label="${c.up||c.done?(c.img?c.v[2]:c.v[1]):'Carte cachée'}"><span class="back" aria-hidden="true">🌴</span><span class="front">${face(c)}</span></button>`).join('')}</div>
    <div id="found"></div>`;
  $('play').querySelectorAll('.mem-card').forEach(b=>b.onclick=()=>flip(+b.dataset.i));
}
function tick(){const s=Math.round((Date.now()-t0)/1000);$('timer').textContent=`${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;}
function flip(i){
  const c=cards[i];if(busy||c.up||c.done)return;
  if(!t0){t0=Date.now();timer=setInterval(tick,500);}
  c.up=true;open.push(c);render();
  if(open.length<2)return;
  moves++;const [a,b]=open;
  if(a.p===b.p){a.done=b.done=true;a.up=b.up=false;open=[];found++;JK.good();render();
    $('found').innerHTML=`<p class="qz-expl" style="text-align:center"><b>${a.v[0]} ${JK.esc(a.v[1])}</b> = ${JK.esc(a.v[2])}</p>`;
    if(found===LEVELS[level].n){clearInterval(timer);const s=Math.round((Date.now()-t0)/1000);JK.win();setTimeout(()=>end(false,s),600);}
  }else{busy=true;JK.bad();setTimeout(()=>{a.up=b.up=false;open=[];busy=false;render();},900);}
}
function end(restored,s){
  const L=LEVELS[level],tm=`${Math.floor(s/60)} min ${String(s%60).padStart(2,'0')} s`;
  if(daily&&!restored){JK.record('mem_'+level,true,null);JK.save('mem_'+level,{day:JK.today(),done:true,moves,s});}
  const perfect=moves<=L.n+2;
  const txt=`Mémory Ti moun du ${JK.today().split('-').reverse().slice(0,2).join('/')} (${L.label}) — ${L.n} paires en ${moves} coups, ${tm} 🃏\n${location.origin}${location.pathname}`;
  $('play').innerHTML='';$('end').hidden=false;
  $('end').innerHTML=`<h2>${perfect?'Ou ni an bon mémwè ! 🧠':'Bravo ! 🎉'}</h2><p>${L.n} paires trouvées en <b>${moves} coups</b> et <b>${tm}</b>.</p>
    ${daily?JK.statsHtml('mem_'+level,{won:'terminées'}):''}
    <div class="cta">${daily?'<button class="btn" id="share" type="button">Partager</button>':''}<button class="btn ghost" id="again" type="button">Nouvelle partie</button></div>`;
  if(daily)$('share').onclick=()=>JK.share(txt);
  $('again').onclick=()=>start(false);
  if(daily)JK.board('mem_'+level,{score:Math.max(0,10000-moves*100-s),xp:{easy:4,normal:6,hard:8}[level],detail:`${moves} coups · ${tm}`});
}
JK.header('Mémory Ti moun','🃏');
$('seg').innerHTML=Object.entries(LEVELS).map(([k,l])=>`<button type="button" data-l="${k}">${l.label}</button>`).join('');
$('seg').querySelectorAll('button').forEach(b=>b.onclick=()=>{level=b.dataset.l;try{localStorage.setItem('jk_mem_lvl',level);}catch(e){}start(true);});
start(true);
