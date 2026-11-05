'use strict';
/* Portail Jeu Kréyol (page d'accueil de jeukreyol.fr) */
const PT_GAMES=[
 {k:'tibac',href:'/tibac.html',name:'Ti Bac Kréyol',c:'k11',key:'tibac'},
 {k:'mo',href:'/jeux/mo.html',name:'Kréyol Mo',c:'k1',key:'mo'},
 {k:'yol',href:'/jeux/yol.html',name:'Woulé yol',c:'k2',key:'yol',isNew:1},
 {k:'vf',href:'/jeux/vraifaux.html',name:'Vré ou fo ?',c:'k3',key:'vf'},
 {k:'km',href:'/jeux/kimoun.html',name:'Ki moun ?',c:'k4',key:'km'},
 {k:'mele',href:'/jeux/mele.html',name:'Mo mélé',c:'k5',key:['mele_easy','mele_normal','mele_hard']},
 {k:'lk',href:'/jeux/lakarte.html',name:'Lakarté',c:'k6',key:['lk_MQ','lk_GP','lk_GF']},
 {k:'pw',href:'/jeux/pwoveb.html',name:'Konbat Pwovèb',c:'k7',key:'pw'},
 {k:'kt',href:'/jeux/koko.html',name:'Koko tonbé',c:'k10',key:'kt',isNew:1},
 {k:'mem',href:'/jeux/memory.html',name:'Mémory Ti moun',c:'k9',key:['mem_easy','mem_normal','mem_hard'],isNew:1},
 {k:'wari',href:'/jeux/wari.html',name:'Wari',c:'k8',key:null,isNew:1}
];
/* Niveaux : les mêmes que dans Ti Bac */
const PT_LEVELS=[[0,'Ti Kalbas'],[100,'Zandoli'],[300,'Mabouya'],[600,'Manikou'],[1000,'Konpè Lapen'],[1600,'Ti-Jean'],[2500,'Majò'],[4000,'Mèt Kont'],[6000,'Gran Moun'],[9000,'Gran Mèt Kréyol']];
function ptLevel(xp){xp=xp||0;let i=0;while(i<PT_LEVELS.length-1&&xp>=PT_LEVELS[i+1][0])i++;const cur=PT_LEVELS[i],nx=PT_LEVELS[i+1];
  return {n:i+1,name:cur[1],pct:nx?Math.round((xp-cur[0])/(nx[0]-cur[0])*100):100,next:nx&&nx[1],left:nx?nx[0]-xp:0};}
function tibacDone(){try{const s=JSON.parse(localStorage.getItem('tibac_share')||'null');return !!(s&&s.d===JK.today());}catch(e){return false;}}
function isDone(g){if(g.key==='tibac')return tibacDone();return g.key?[].concat(g.key).some(JK.doneToday):false;}
function tile(g){
  const done=isDone(g);
  return `<a class="gt ${g.c}" href="${g.href}" aria-label="${JK.esc(g.name)}${done?' (défi du jour fait)':''}">${done?'<span class="ok" aria-hidden="true">✓</span>':g.isNew?'<span class="nw" aria-hidden="true">NOUVEAU</span>':''}${g.k==='tibac'?'<span class="mascot"><img src="/icons/icon-192.png" alt="" width="192" height="192"></span>':(JK_ICONS[g.k]||'')}<span class="nm">${JK.esc(g.name)}</span></a>`;
}
function renderGrid(){
  const daily=PT_GAMES.filter(g=>g.key),n=daily.filter(isDone).length;
  document.getElementById('dailyh').textContent=n?`Tes jeux · ${n} / ${daily.length} défis du jour faits`:'Tes jeux · un nouveau défi chaque jour';
  document.getElementById('grid').innerHTML=PT_GAMES.map(tile).join('');
  document.getElementById('grid').removeAttribute('aria-busy');
}
const avImg=k=>`/avatars/${encodeURIComponent((k||'lapen').replace(/[^a-z]/g,''))}.jpg`;
async function renderMe(){
  const box=document.getElementById('me'),chip=document.getElementById('chip');
  const T=JK.title(),sk=JK.streak();
  const guest=()=>{chip.outerHTML=`<a class="btn sm" id="chip" href="/tibac.html#compte">Connexion</a>`;
    box.innerHTML=`<div class="pt-join"><span style="font-size:30px" aria-hidden="true">🏆</span><p><b>Crée ton compte gratuit</b> : un seul compte pour tous les jeux, avec classements, amis, parties en ligne et ton niveau.</p><a class="btn sm" href="/tibac.html#compte">S'inscrire</a></div>`;};
  const sb=await JK.sb();let session=null;
  if(sb){try{session=(await sb.auth.getSession()).data.session;}catch(e){}}
  if(!session)return guest();
  let p=null;try{p=(await sb.from('profiles').select('pseudo,avatar,xp').eq('id',session.user.id).maybeSingle()).data;}catch(e){}
  if(!p||!p.pseudo)return guest();
  const L=ptLevel(p.xp);
  chip.outerHTML=`<a class="pt-chip" id="chip" href="/tibac.html#compte"><img src="${avImg(p.avatar)}" alt=""><span>${JK.esc(p.pseudo)}</span></a>`;
  box.innerHTML=`<a class="pt-me" href="/tibac.html#compte"><img class="av" src="${avImg(p.avatar)}" alt=""><div><small>Niveau ${L.n} · ${JK.esc(L.name)} · ${T.cur[2]} ${JK.esc(T.cur[1])}</small><b>Bonjou ${JK.esc(p.pseudo)} !</b>
    <div class="bar" role="progressbar" aria-label="${L.next?`Progression vers le niveau ${L.next}`:'Niveau maximum'}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${L.pct}"><i style="width:${L.pct}%"></i></div>
    <small>${L.next?`Encore ${L.left} points pour devenir ${JK.esc(L.next)}`:'Tu as atteint le plus haut niveau !'}</small></div>
    <div class="fire"><div aria-hidden="true">🔥</div>${sk} j<span class="sr-only"> de série</span></div></a>`;
}
document.body.classList.add('has-nav');
renderGrid();
renderMe();
document.addEventListener('visibilitychange',()=>{if(!document.hidden)renderGrid();});
setTimeout(()=>{if(JK.consent())JK.installBar();JK.audienceBar();},800);
