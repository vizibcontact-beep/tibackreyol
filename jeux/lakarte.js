'use strict';
/* Lakarté — place les communes sur la carte */
const $=id=>document.getElementById(id);
const PERKM={MQ:5,GP:3.5,GF:0.45};
const N=10;
let T=(()=>{try{return localStorage.getItem('jk_lk_terr')||'MQ';}catch(e){return 'MQ';}})();
let list=[],i=0,score=0,marks=[],daily=true,wait=false;
const svgNS='http://www.w3.org/2000/svg';
function start(isDaily){
  daily=isDaily;const C=CARTES[T];const r=JK.rng(isDaily?'lk-'+T+'-'+JK.today():Math.random());
  list=JK.shuffle(C.communes,r).slice(0,Math.min(N,C.communes.length));i=0;score=0;marks=[];$('end').hidden=true;
  const sv=JK.load('lk_'+T,{});
  if(isDaily&&sv.day===JK.today()&&sv.done){score=sv.score;marks=sv.marks;drawMap();return end(true);}
  drawMap();ask();
}
function drawMap(){
  const C=CARTES[T];
  $('play').innerHTML=`<div class="qz-top"><span id="prog"></span><span>⭐ <b id="sc">${score}</b> pts</span></div>
    <div class="qz-card" style="min-height:0;padding:12px 16px"><p class="q" id="ask" style="text-align:center"></p></div>
    <div class="map-box"><svg id="map" viewBox="0 0 ${C.w} ${C.h}" role="img" aria-label="Carte de ${C.name}">
      ${C.communes.map((c,k)=>`<path class="com" data-k="${k}" d="${c.d}"/>`).join('')}<g id="marks"></g></svg></div>
    <div id="after"></div>`;
  $('map').addEventListener('click',onTap);
}
function ask(){
  wait=false;$('prog').textContent=`Commune ${i+1} / ${list.length}`;$('ask').innerHTML=`Où se trouve <b style="color:var(--gold)">${JK.esc(list[i].n)}</b> ?`;
  $('marks').innerHTML='';$('after').innerHTML='';
  document.querySelectorAll('#map .com').forEach(p=>p.style.fill='');
}
function onTap(e){
  if(wait)return;const svg=$('map');const pt=svg.createSVGPoint();pt.x=e.clientX;pt.y=e.clientY;const p=pt.matrixTransform(svg.getScreenCTM().inverse());
  const C=CARTES[T],t=list[i];const k=C.communes.indexOf(t);const path=svg.querySelector(`[data-k="${k}"]`);
  let inside=false;try{const q=svg.createSVGPoint();q.x=p.x;q.y=p.y;inside=path.isPointInFill(q);}catch(err){}
  const km=Math.hypot(p.x-t.x,p.y-t.y)*C.km;
  const pts=inside?100:Math.max(0,Math.round(100-km*PERKM[T]));score+=pts;marks.push(pts);wait=true;
  if(pts>=80)JK.good();else JK.bad();
  path.style.fill='var(--red)';
  const r=C.w/90;
  $('marks').innerHTML=(inside?'':`<line class="line" x1="${p.x}" y1="${p.y}" x2="${t.x}" y2="${t.y}" style="stroke-width:${r/3}"/>`)+`<circle class="guess" cx="${p.x}" cy="${p.y}" r="${r}"/>`;
  $('sc').textContent=score;
  $('after').innerHTML=`<p class="qz-expl"><b>${inside?'🎯 En plein dedans ! +100 pts':`${km<1?'Moins d\'1 km':Math.round(km)+' km'} de la commune : +${pts} pts`}</b> ${JK.esc(t.n)} est en rouge sur la carte.</p>
    <button class="btn wide" id="next" type="button">${i+1<list.length?'Commune suivante':'Voir mon score'}</button>`;
  $('next').onclick=()=>{i++;if(i<list.length)ask();else end(false);};
}
function end(restored){
  const max=list.length*100;
  if(daily&&!restored){JK.record('lk_'+T,score>=max/2,null);JK.save('lk_'+T,{day:JK.today(),done:true,score,marks});}
  if(!restored&&score>=max*.8)JK.win();
  const em=marks.map(m=>m>=100?'🎯':m>=60?'🟩':m>=20?'🟨':'🟥').join('');
  const txt=`Lakarté ${CARTES[T].name} du ${JK.today().split('-').reverse().slice(0,2).join('/')} — ${score}/${max}\n${em}\n${location.origin}${location.pathname}`;
  $('play').querySelector('#after').innerHTML='';
  $('end').hidden=false;
  $('end').innerHTML=`<h2>${score>=max*.8?'Ou sé an GPS ! 🧭':score>=max/2?'Bien joué ! 🎉':'Ou ké konnèt péyi-a pi byen dèmen ! 💪'}</h2>
    <p style="font-size:18px"><b>${score}</b> / ${max} points</p><p style="font-size:22px;letter-spacing:2px">${em}</p>
    ${daily?JK.statsHtml('lk_'+T,{won:'réussies'}):''}
    <div class="cta">${daily?'<button class="btn" id="share" type="button">Partager</button>':''}<button class="btn ghost" id="again" type="button">Nouvelle partie</button></div>`;
  if(daily)$('share').onclick=()=>JK.share(txt);
  $('again').onclick=()=>start(false);
}
function terrButtons(){
  $('terr').innerHTML=Object.entries(CARTES).map(([k,c])=>`<button type="button" data-t="${k}" aria-pressed="${k===T}">${c.name}</button>`).join('');
  $('terr').querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{T=b.dataset.t;try{localStorage.setItem('jk_lk_terr',T);}catch(e){}terrButtons();start(true);});
}
JK.header('Lakarté','🗺️');
terrButtons();start(true);
