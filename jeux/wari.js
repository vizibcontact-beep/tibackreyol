'use strict';
/* Wari (awalé) — 2 rangées de 6 trous, 4 graines par trou, contre l'ordinateur.
   Trous 0-5 = joueur (en bas, de gauche à droite), 6-11 = ordinateur (en haut, de droite à gauche).
   On sème dans le sens inverse des aiguilles d'une montre. */
const $=id=>document.getElementById(id);
const LEVELS={easy:{d:1,rand:.45,label:'Ti moun'},normal:{d:4,rand:0,label:'Normal'},hard:{d:7,rand:0,label:'Fò'}};
let level=(()=>{try{return localStorage.getItem('jk_wari_lvl')||'normal';}catch(e){return 'normal';}})();
let B,S,turn,busy,quiet,over,last=-1;
const mine=(i,p)=>p===0?i<6:i>=6;
const sideSum=(b,p)=>{let s=0;for(let i=p*6;i<p*6+6;i++)s+=b[i];return s;};

/* joue un coup ; renvoie {b, cap} sans modifier l'original */
function sow(b0,pit,p){
  const b=b0.slice();let n=b[pit],i=pit;b[pit]=0;
  while(n){i=(i+1)%12;if(i===pit)continue;b[i]++;n--;}
  let cap=0;const t=b.slice();let j=i;
  while(!mine(j,p)&&(t[j]===2||t[j]===3)){cap+=t[j];t[j]=0;j=(j+11)%12;if(mine(j,p))break;}
  /* grand chelem : on ne prend pas toutes les graines de l'adversaire */
  if(cap&&sideSum(t,1-p)===0)return {b,cap:0,last:i};
  return {b:cap?t:b,cap,last:i};
}
function legal(b,p){
  const m=[];for(let i=p*6;i<p*6+6;i++)if(b[i])m.push(i);
  if(sideSum(b,1-p)===0){const f=m.filter(i=>sideSum(sow(b,i,p).b,1-p)>0);return f;}
  return m;
}
/* IA : négamax avec élagage alpha-bêta */
function nega(b,s0,s1,p,d,a,be){
  const ms=legal(b,p);
  if(d===0||!ms.length||s0>=25||s1>=25){
    let e=s0-s1;
    if(!ms.length){const rest=b.reduce((x,y)=>x+y,0);if(sideSum(b,p)>0)e+=(p===0?rest:-rest);else e+=(p===0?-rest:rest);}
    if(s0>=25)e+=100;if(s1>=25)e-=100;return p===0?e:-e;}
  let best=-1e9;
  for(const m of ms){const r=sow(b,m,p);const v=-nega(r.b,p===0?s0+r.cap:s0,p===1?s1+r.cap:s1,1-p,d-1,-be,-a);
    if(v>best)best=v;if(v>a)a=v;if(a>=be)break;}
  return best;
}
function aiMove(){
  const L=LEVELS[level],ms=legal(B,1);
  if(Math.random()<L.rand)return JK.pick(ms);
  let best=-1e9,pick=[];
  for(const m of ms){const r=sow(B,m,1);const v=-nega(r.b,S[0],S[1]+r.cap,0,L.d-1,-1e9,1e9);
    if(v>best){best=v;pick=[m];}else if(v===best)pick.push(m);}
  return JK.pick(pick);
}
function start(){
  B=Array(12).fill(4);S=[0,0];turn=0;busy=false;quiet=0;over=false;last=-1;$('end').hidden=true;
  $('seg').querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.l===level));
  render('À toi de commencer : touche un de tes trous.');
}
function pitHtml(i){
  const n=B[i],seeds=Array.from({length:Math.min(n,16)},(_,k)=>`<i style="--a:${(k*137)%360}deg;--r:${k<1?0:k<7?11:19}px"></i>`).join('');
  const can=!over&&!busy&&turn===0&&i<6&&legal(B,0).includes(i);
  return `<button type="button" class="wr-pit ${i<6?'me':'ai'} ${can?'can':''} ${i===last?'last':''}" data-i="${i}" ${can?'':'disabled'} aria-label="Trou ${i<6?i+1:12-i}${i<6?'':' de l\'ordinateur'} : ${n} graine${n>1?'s':''}"><span class="sd">${seeds}</span><b>${n}</b></button>`;
}
function render(msg){
  $('play').innerHTML=`<div class="wr-score"><div><span>🤖 Ordinateur</span><b>${S[1]}</b></div><div><span>🙂 Toi</span><b>${S[0]}</b></div></div>
    <div class="wr-board"><div class="wr-row">${[11,10,9,8,7,6].map(pitHtml).join('')}</div><div class="wr-row">${[0,1,2,3,4,5].map(pitHtml).join('')}</div></div>
    <p class="wr-msg" aria-live="polite">${msg||''}</p>`;
  $('play').querySelectorAll('.wr-pit.can').forEach(b=>b.onclick=()=>move(+b.dataset.i));
}
const wait=ms=>new Promise(r=>setTimeout(r,ms));
async function move(pit){
  if(busy||over)return;busy=true;const p=turn;
  /* animation graine par graine */
  let n=B[pit],i=pit;B[pit]=0;last=pit;render(p===0?'Tu sèmes…':'L\'ordinateur sème…');
  const before=B.slice();before[pit]=n;
  while(n){i=(i+1)%12;if(i===pit)continue;B[i]++;n--;last=i;JK.beep([520+i*20],.04);render(p===0?'Tu sèmes…':'L\'ordinateur sème…');await wait(n>8?70:140);}
  const r=sow(before,pit,p);B=r.b;S[p]+=r.cap;
  if(r.cap){quiet=0;(p===0?JK.good:JK.bad)();}else quiet++;
  turn=1-p;
  const msg=r.cap?(p===0?`Bravo ! Tu prends ${r.cap} graines.`:`L'ordinateur prend ${r.cap} graines.`):'';
  if(checkEnd())return;
  busy=false;
  if(turn===1){render(msg||'L\'ordinateur réfléchit…');await wait(550);busy=false;move(aiMove());}
  else render(msg||'À toi !');
}
function checkEnd(){
  let why='';
  if(S[0]>=25||S[1]>=25||(S[0]===24&&S[1]===24))why='';
  else if(!legal(B,turn).length){
    /* le joueur ne peut pas nourrir l'adversaire : il ramasse les graines qui restent */
    const p=turn;const rest=B.reduce((a,b)=>a+b,0);S[sideSum(B,p)>0?p:1-p]+=rest;B=B.map(()=>0);why='Plus aucun coup possible : les graines restantes sont ramassées.';
  }else if(quiet>=60||B.reduce((a,b)=>a+b,0)<=3&&quiet>=20){
    S[0]+=sideSum(B,0);S[1]+=sideSum(B,1);B=B.map(()=>0);why='La partie tourne en rond : chacun ramasse les graines de son côté.';
  }else return false;
  over=true;busy=false;render(why);end(why);return true;
}
function end(why){
  const won=S[0]>S[1],tie=S[0]===S[1];
  JK.record('wari_'+level,won,null);
  if(won)JK.win();else JK.bad();
  const st=JK.load('wari_'+level+'_wl',{w:0,l:0,t:0});won?st.w++:tie?st.t++:st.l++;JK.save('wari_'+level+'_wl',st);
  $('end').hidden=false;
  $('end').innerHTML=`<h2>${won?'Ou genyen ! 🎉':tie?'Égalité ! 🤝':'L\'ordinateur gagne… 😅'}</h2>
    <p style="font-size:18px">Toi <b>${S[0]}</b> · Ordinateur <b>${S[1]}</b></p>${why?`<p class="muted">${why}</p>`:''}
    <p class="muted">Niveau ${LEVELS[level].label} : ${st.w} victoire${st.w>1?'s':''}, ${st.l} défaite${st.l>1?'s':''}${st.t?`, ${st.t} égalité${st.t>1?'s':''}`:''}.</p>
    <div class="cta"><button class="btn" id="again" type="button">Rejouer</button></div>`;
  $('again').onclick=start;
}
JK.header('Wari','🌰');
$('seg').innerHTML=Object.entries(LEVELS).map(([k,l])=>`<button type="button" data-l="${k}">${l.label}</button>`).join('');
$('seg').querySelectorAll('button').forEach(b=>b.onclick=()=>{if(busy)return;level=b.dataset.l;try{localStorage.setItem('jk_wari_lvl',level);}catch(e){}start();});
start();
