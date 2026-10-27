'use strict';
/* Ki moun ? — deviner une personnalité grâce à 4 indices */
const $=id=>document.getElementById(id);
const key=s=>JK.plain(s).toLowerCase().replace(/[^a-z]/g,'');
function lev(a,b){if(Math.abs(a.length-b.length)>2)return 9;let p=[...Array(b.length+1).keys()];for(let i=1;i<=a.length;i++){const c=[i];for(let j=1;j<=b.length;j++)c[j]=Math.min(p[j]+1,c[j-1]+1,p[j-1]+(a[i-1]===b[j-1]?0:1));p=c;}return p[b.length];}
function matches(input,p){
  const k=key(input);if(k.length<3)return false;
  const keys=[p.n,...p.al,p.n.split(' ').slice(-1)[0]].map(key);
  return keys.some(x=>x===k||(k.length>=6&&lev(k,x)<=(k.length>=10?2:1)));
}
const ORDER=JK.shuffle(KIMOUN.map((_,i)=>i),JK.rng('ki-moun'));
let P,shown=1,tries=[],daily=true,over=false,total=JK.load('km_free',{pts:0,n:0});
function start(isDaily){
  daily=isDaily;over=false;tries=[];shown=1;$('end').hidden=true;
  if(isDaily){const n=ORDER.length;P=KIMOUN[ORDER[((JK.dayNumber()%n)+n)%n]];
    const sv=JK.load('km',{});if(sv.day===JK.today()){shown=sv.shown;tries=sv.tries||[];if(sv.over){render();return end(true,sv.won);}}}
  else P=JK.pick(KIMOUN.filter(x=>x!==P));
  render();
}
function persist(won){if(daily)JK.save('km',{day:JK.today(),shown,tries,over,won});}
function render(){
  $('play').innerHTML=`<p class="muted" style="font-weight:700">${daily?'Personnalité du jour':'Partie libre'} · ${5-shown} point${5-shown>1?'s':''} en jeu</p>
    ${P.c.map((c,i)=>i<shown||over?`<div class="clue"><b>${i+1}</b><span>${JK.esc(c)}</span></div>`:`<div class="clue hide"><b>${i+1}</b><span>Indice caché</span></div>`).join('')}
    ${over?'':`<form id="gf" class="entry" autocomplete="off"><input type="text" id="gi" placeholder="Ton idée (nom ou prénom + nom)" aria-label="Ta réponse" autocapitalize="words"><button class="btn" type="submit">Valider</button></form>
    <div class="row">${shown<4?'<button class="btn ghost sm" id="more" type="button">Indice suivant (−1 point)</button>':''}<button class="btn ghost sm" id="give" type="button">Je donne ma langue au chat</button></div>
    ${tries.length?`<p class="muted" style="font-size:14px">Déjà essayé : ${tries.map(JK.esc).join(', ')}</p>`:''}`}`;
  if(over)return;
  $('gf').onsubmit=e=>{e.preventDefault();guess($('gi').value);};
  if($('more'))$('more').onclick=()=>{shown++;persist();render();$('gi').focus();};
  $('give').onclick=()=>{over=true;persist(false);render();end(false,false);};
  setTimeout(()=>$('gi')&&$('gi').focus(),50);
}
function guess(v){
  if(!v.trim())return;
  if(matches(v,P)){over=true;JK.win();persist(true);render();return end(false,true);}
  tries.push(v.trim());JK.bad();
  if(shown<4)shown++;else{over=true;persist(false);render();return end(false,false);}
  persist();render();JK.toast('Non… voici un nouvel indice !');
}
function end(restored,won){
  const pts=won?5-shown:0;
  if(daily&&!restored)JK.record('km',won,won?shown:'x');
  if(!daily&&!restored){total.pts+=pts;total.n++;JK.save('km_free',total);}
  const txt=`Ki moun ? du ${JK.today().split('-').reverse().slice(0,2).join('/')} — ${won?`trouvé au ${shown}ᵉ indice 🕵🏾`:'pas trouvé 😅'}\n${'🟥'.repeat(won?shown-1:4)}${won?'🟩':''}\n${location.origin}${location.pathname}`;
  $('end').hidden=false;
  $('end').innerHTML=`<h2>${won?(shown===1?'Fò ! Du premier coup ! 🔥':'Trouvé ! 🎉'):'C\'était…'}</h2><p style="font-size:22px;font-family:var(--display);color:var(--gold)">${JK.esc(P.n)}</p>
    ${won?`<p><b>+${pts} point${pts>1?'s':''}</b></p>`:''}
    ${daily?JK.statsHtml('km',{won:'trouvés'})+`<p class="muted" style="text-align:center">Prochaine personnalité dans ${JK.untilTomorrow()}</p>`:`<p class="muted">Parties libres : ${total.n} · ${total.pts} points au total</p>`}
    <div class="cta">${daily?'<button class="btn" id="share" type="button">Partager</button>':''}<button class="btn ghost" id="again" type="button">Une autre personnalité</button></div>`;
  if(daily)$('share').onclick=()=>JK.share(txt);
  $('again').onclick=()=>start(false);
  if(daily)JK.board('km',{score:pts,xp:won?pts*2+2:1,detail:won?`${shown}ᵉ indice`:'pas trouvé'});
}
JK.header('Ki moun ?','🕵🏾');
start(true);
