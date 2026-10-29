'use strict';
/* Koko tonbé — le pendu créole : trouve le mot avant que tous les cocos tombent */
const $=id=>document.getElementById(id);
const LIVES=7,N_DAY=5;
const norm=w=>JK.plain(w).replace(/[^A-Z]/g,'');
let list=[],wi=0,W=null,used=new Set(),miss=0,score=0,marks=[],daily=true,lock=false;

function start(isDaily){
  daily=isDaily;$('end').hidden=true;
  const r=JK.rng(isDaily?'koko-'+JK.today():Math.random());
  list=JK.shuffle(MOTS,r).slice(0,isDaily?N_DAY:1);wi=0;score=0;marks=[];
  const sv=JK.load('kt',{});
  if(isDaily&&sv.day===JK.today()&&sv.done){score=sv.score;marks=sv.marks;return end(true);}
  next();
}
function next(){W=list[wi];used=new Set();miss=0;lock=false;render();}
function tree(){
  /* palmier + 7 cocos : chaque erreur en fait tomber un */
  const pos=[[86,58],[100,64],[114,58],[93,74],[107,74],[79,70],[121,70]];
  const k=pos.map(([x,y],i)=>i<LIVES-miss
    ?`<circle cx="${x}" cy="${y}" r="7" fill="#7A4E1E" stroke="#4A2C0C" stroke-width="2"/>`
    :`<circle cx="${40+i*20}" cy="182" r="7" fill="#7A4E1E" stroke="#4A2C0C" stroke-width="2" opacity=".8"/>`).join('');
  return `<svg viewBox="0 0 200 200" class="kt-tree" role="img" aria-label="${LIVES-miss} cocos encore dans l'arbre">
    <path d="M18 190 Q100 176 182 190 L182 200 L18 200Z" fill="#E8C98A"/>
    <path d="M104 190 C100 150 92 110 100 64" stroke="#8B5A2B" stroke-width="10" fill="none" stroke-linecap="round"/>
    <g fill="#2FA36B" stroke="#1E7A4C" stroke-width="2">
      <path d="M100 60 Q60 30 22 52 Q62 44 100 64Z"/><path d="M100 60 Q140 30 178 52 Q138 44 100 64Z"/>
      <path d="M100 60 Q70 70 40 104 Q74 76 100 64Z"/><path d="M100 60 Q130 70 160 104 Q126 76 100 64Z"/>
      <path d="M100 60 Q96 26 120 10 Q104 34 100 62Z"/></g>${k}</svg>`;
}
function render(){
  const letters=[...W[0]];
  const word=letters.map(c=>{const p=norm(c);if(!p)return `<span class="sp">${JK.esc(c)}</span>`;return `<span class="${used.has(p)?'on':''}">${used.has(p)||lock?JK.esc(c.toUpperCase()):''}</span>`;}).join('');
  $('play').innerHTML=`<div class="qz-top"><span>${daily?`Mot ${wi+1} / ${list.length}`:'Partie libre'}</span><span>⭐ <b>${score}</b> pts</span></div>
    <div class="kt-box">${tree()}<div><p class="muted" style="margin:0">Comment dit-on en créole…</p><p class="kt-fr">« ${JK.esc(W[1])} » ?</p></div></div>
    <div class="kt-word" aria-live="polite">${word}</div><div id="after"></div>`;
  keyboard();
}
function keyboard(){
  const L=['AZERTYUIOP','QSDFGHJKLM','WXCVBN'];const ans=new Set([...norm(W[0])]);
  $('kb').innerHTML=lock?'':L.map(l=>`<div>${[...l].map(c=>`<button data-k="${c}" type="button" ${used.has(c)?'disabled':''} class="${used.has(c)?(ans.has(c)?'ok':'no'):''}">${c}</button>`).join('')}</div>`).join('');
}
function type(c){
  if(lock||used.has(c))return;used.add(c);
  const ans=norm(W[0]);
  if(ans.includes(c)){JK.good();if([...ans].every(x=>used.has(x)))return finishWord(true);}
  else{miss++;JK.bad();if(miss>=LIVES)return finishWord(false);}
  render();
}
function finishWord(won){
  lock=true;const pts=won?LIVES-miss+3:0;score+=pts;marks.push(won?LIVES-miss:-1);
  if(won)JK.win();
  render();
  $('after').innerHTML=`<p class="qz-expl"><b>${won?`✅ Bravo ! +${pts} pts`:'🥥 Tous les cocos sont tombés…'}</b> ${JK.esc(W[0])} = ${JK.esc(W[1])}.</p>
    <button class="btn wide" id="next" type="button">${daily&&wi+1<list.length?'Mot suivant':daily?'Voir mon score':'Un autre mot'}</button>`;
  $('next').onclick=()=>{if(!daily)return start(false);wi++;if(wi<list.length)next();else end(false);};
  $('next').focus();
}
function end(restored){
  const max=N_DAY*(LIVES+3),good=marks.filter(m=>m>=0).length;
  if(!restored){JK.record('kt',good>=3,good);JK.save('kt',{day:JK.today(),done:true,score,marks});}
  const em=marks.map(m=>m<0?'🟥':m>=6?'🥥':m>=3?'🟩':'🟨').join('');
  const txt=`Koko tonbé du ${JK.today().split('-').reverse().slice(0,2).join('/')} — ${good}/${N_DAY} mots · ${score} pts\n${em}\n${location.origin}${location.pathname}`;
  $('play').innerHTML='';$('kb').innerHTML='';$('end').hidden=false;
  $('end').innerHTML=`<h2>${good===N_DAY?'Ou sé an chanpyon ! 🏆':good>=3?'Bien joué ! 🎉':'Ou ké fè miyò dèmen ! 💪'}</h2>
    <p style="font-size:18px"><b>${good} / ${N_DAY}</b> mots trouvés · <b>${score}</b> points</p><p style="font-size:22px;letter-spacing:2px">${em}</p>
    ${JK.statsHtml('kt',{won:'réussies'})}<p class="muted" style="text-align:center">Nouveaux mots dans ${JK.untilTomorrow()}</p>
    <div class="cta"><button class="btn" id="share" type="button">Partager</button><button class="btn ghost" id="again" type="button">Jouer un mot au hasard</button></div>`;
  $('share').onclick=()=>JK.share(txt);
  $('again').onclick=()=>start(false);
  JK.board('kt',{score,xp:Math.round(score/max*10),detail:`${good}/${N_DAY} · ${score} pts`});
}
JK.header('Koko tonbé','🥥');
$('kb').onclick=e=>{const b=e.target.closest('[data-k]');if(b)type(b.dataset.k);};
document.addEventListener('keydown',e=>{if(e.ctrlKey||e.metaKey||e.altKey)return;const k=JK.plain(e.key);if(/^[A-Z]$/.test(k)){e.preventDefault();type(k);}});
start(true);
