'use strict';

/* ---------- Normalisation & correspondance ---------- */
const STOP=new Set(['le','la','les','l','de','du','des','d','a','au','aux','en','et','the','di','o']); // di, o : « du », « aux » en créole
/* Mots de lieux écrits en créole → forme française (Mòn Vè = Morne Vert, Lans Noire = Anse Noire…) */
const WMAP={mon:'morne',morn:'morne',rivye:'riviere',rivie:'riviere',larivye:'riviere',larivie:'riviere',lans:'anse',lanse:'anse',
  plaj:'plage',laplaj:'plage',kaskad:'cascade',pwent:'pointe',pwint:'pointe',zilet:'ilet',ilé:'ilet',ile:'ilet',sen:'saint',sent:'sainte',st:'saint',ste:'sainte',
  so:'saut',kaskade:'cascade',chit:'chute',chout:'chute',pwant:'pointe',montany:'montagne',montay:'montagne',mòn:'morne',
  abitasyon:'habitation',abitasion:'habitation',bitasyon:'habitation',katedral:'cathedrale',legliz:'eglise',liglis:'eglise',lopital:'hopital',gwo:'gros',gran:'grand',kaz:'case'};
function norm(s,extra,keep,sp){
  s=String(s).toLowerCase().replace(/œ/g,'oe').replace(/æ/g,'ae').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
  const ws=s.split(' ').map(w=>WMAP[w]||w);
  // premier mot mal tapé mais proche d'un mot à ignorer du thème (« Ans Noire », « Bai du Robert »)
  if(extra&&ws.length>1&&ws[0].length>=3&&!extra.has(ws[0])&&[...extra].some(x=>x.length>=4&&lev(ws[0],x)<=1))ws.shift();
  return ws
    .filter(w=>w&&(!STOP.has(w)||(keep&&keep.has(w)))&&!(extra&&extra.has(w)))
    .map(w=>w.length>4&&w.endsWith('s')?w.slice(0,-1):w).join(sp?' ':'');
}
function lev(a,b){
  if(Math.abs(a.length-b.length)>2)return 9;
  let p=Array.from({length:b.length+1},(_,i)=>i);
  for(let i=1;i<=a.length;i++){const c=[i];for(let j=1;j<=b.length;j++)c[j]=Math.min(p[j]+1,c[j-1]+1,p[j-1]+(a[i-1]===b[j-1]?0:1));p=c;}
  return p[b.length];
}
let PREP={},EXTRA={};
function prep(i){
  if(PREP[i])return PREP[i];
  const th=THEMES[i],SYN={anse:['lans','lanse','ans'],baie:['be','bay','labe'],plage:['plaj','laplaj'],ilet:['zilet','ile']},extra=th.stop?new Set(th.stop.flatMap(x=>[x,...(SYN[x]||[])])):null,keep=th.keep?new Set(th.keep):null;
  const added=(EXTRA[i]||[]).map(x=>'*'.repeat(Math.max(0,Math.min(3,x.pts||1)-1))+x.name+((x.alias||[]).length?'|'+x.alias.join(','):''));
  return PREP[i]={idx:i,title:th.t,extra,keep,answers:[...th.a,...added].map(s=>{let pts=1;while(s[0]==='*'){pts++;s=s.slice(1);}
    const [name,al]=s.split('|');const keys=[name,...(al?al.split(','):[])].map(k=>norm(k,extra,keep)).filter(Boolean);
    const fl=x=>String(x).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9|]/g,'');
    return {name,pts,keys:[...new Set(keys)],pkeys:[...new Set(keys.map(k=>phon(k)))],wkeys:[...new Set([name,...(al?al.split(','):[])].map(k=>phon(norm(k,extra,keep,1),1)).filter(Boolean))],flat:'|'+[name,...(al?al.split(','):[])].map(fl).join('|')+'|'};})};
}
/* Clé « sonore » : deux orthographes qui se prononcent pareil (français ou créole) donnent la même clé.
   Ex. : Compère / Konpè, Colombo / Kolonbo, chatrou / chatwou, manger / manjé, piment / piman. */
function phon(k,multi){
  let s=' '+k+' ';
  s=s.replace(/tch/g,'tj').replace(/ch/g,'§').replace(/sh/g,'§').replace(/ph/g,'f').replace(/th/g,'t')
   .replace(/qu/g,'k').replace(/ck/g,'k').replace(/c(?=[eiy])/g,'s').replace(/c/g,'k').replace(/(?<=[aeiou])x(?= )/g,'').replace(/x/g,'ks')
   .replace(/gu(?=[eiy])/g,'g').replace(/g(?=[eiy])/g,'j').replace(/h/g,'')
   .replace(/eau/g,'o').replace(/au/g,'o').replace(/oi/g,'wa').replace(/ou/g,'w').replace(/eu/g,'e').replace(/ill/g,'y').replace(/u/g,'i')
   .replace(/r(?=[ow])/g,'w')
   .replace(/[ae]i(?=[^nm])/g,'e').replace(/y/g,'i')
   .replace(/m(?=[pb])/g,'n').replace(/(?:ain|ein|im(?=[^aeiouw])|in(?=[^aeiouw]))/g,'IN')
   .replace(/(?:an|en|am(?=[^aeiouw])|em(?=[^aeiouw]))(?=[^aeiouw])/g,'AN')
   .replace(/z/g,'s').replace(/(.)\1+/g,'$1');
  if(multi){s=s.replace(/was(?= )/g,'wa');for(let j=0;j<4;j++)s=s.replace(/(\S+?)(er|ez|et|es|e|t|d)(?= )/g,(m,a)=>a.length>=3?a:m);} // mot par mot : lettres muettes de fin (« tortue verte » = « torti vèt »)
  else s=s.replace(/(er|ez|et|es|e|t|d)(?= )/g,'');
  s=s.replace(/(.)\1+/g,'$1').toLowerCase().replace(/\s+/g,'');
  return s||k;
}
function findAnswer(input,th){
  const n=norm(input,th.extra,th.keep);if(!n)return null;
  for(let i=0;i<th.answers.length;i++)if(th.answers[i].keys.includes(n))return i;
  // 0) une seule lettre de différence avec une seule réponse (« Sucier » → Sucrier)
  if(n.length>=5){const h=th.answers.map((a,i)=>a.keys.some(k=>k.length>=5&&lev(n,k)<=1)?i:-1).filter(i=>i>=0);if(h.length===1)return h[0];}
  // 1) même prononciation (orthographe française ou créole différente)
  const pn=phon(n);
  const hits=th.answers.map((a,i)=>a.pkeys.includes(pn)?i:-1).filter(i=>i>=0);
  if(hits.length===1&&pn.length>=3)return hits[0];
  // 1 bis) même prononciation, mot par mot (« torti vèt » = Tortue verte, « so babin » = Saut Babin)
  const wn=phon(norm(input,th.extra,th.keep,1),1);
  if(!hits.length&&wn.length>=3){const h=th.answers.map((a,i)=>a.wkeys.includes(wn)?i:-1).filter(i=>i>=0);if(h.length===1)return h[0];}
  // 2) petites fautes de frappe, sur l'orthographe et sur la prononciation
  const tol=n.length>=10?2:n.length>=5?1:0;if(!tol)return null;
  let best=null,bd=9,tie=false;
  th.answers.forEach((a,i)=>{
    let d=9;
    a.keys.forEach(k=>{if(k.length>=5)d=Math.min(d,lev(n,k));});
    if(pn.length>=6)a.pkeys.forEach(k=>{if(k.length>=6&&lev(pn,k)<=1)d=Math.min(d,1);});
    if(d<=tol){if(d<bd){bd=d;best=i;tie=false;}else if(d===bd&&best!==i)tie=true;}
  });
  if(best!==null&&!tie)return best;
  // 3) mots collés ou séparés autrement (« AnseNoire », « Morne Rouge »)
  const flat=x=>String(x).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'');
  const fi=flat(input);if(fi.length>=6){const h=th.answers.map((a,i)=>a.flat&&a.flat.includes('|'+fi+'|')?i:-1).filter(i=>i>=0);if(h.length===1)return h[0];}
  return null;
}

/* ---------- Avatars : personnages des contes et légendes des Antilles ---------- */
const AVATARS={
 lapen:{n:'Konpè Lapen',bg:'#3DB57F'},zamba:{n:'Konpè Zamba',bg:'#8FA3AE'},tig:{n:'Konpè Tig',bg:'#C8582B'},
 manmandlo:{n:'Manman Dlo',bg:'#1B8A8A'},tijan:{n:'Ti-Jean',bg:'#F2B93B'},soukougnan:{n:'Soukougnan',bg:'#3A2466'},
 djables:{n:'La Diablesse',bg:'#C0283F'},mokozonbi:{n:'Moko Zonbi',bg:'#6D52C0'},chouval:{n:'Chouval twa pat',bg:'#4A2A16'},
 zonbi:{n:'Zonbi',bg:'#2F5E6A'},manibe:{n:'Bèt a Man Ibé',bg:'#1F3A5E'},lapofig:{n:'Mariann Lapofig',bg:'#E3D29E'},
 vaval:{n:'Vaval',bg:'#C13FBF'},diabrouj:{n:'Diab Rouj',bg:'#E03A28'},bwabwa:{n:'Bwa Bwa',bg:'#C9D63A'},
 maskilili:{n:'Maskilili',bg:'#2E8B45'},touloulou:{n:'Touloulou',bg:'#2D55B0'},mounmo:{n:'Moun Mò',bg:'#474A9E'}
};
const AVKEYS=Object.keys(AVATARS);
const avKey=k=>AVATARS[k]?k:'lapen';
function avatar(k,size){k=avKey(k);const a=AVATARS[k];return `<span class="av" style="background:${a.bg};${size?`width:${size}px;height:${size}px`:''}"><img src="avatars/${k}.jpg" alt="${a.n}" loading="lazy" width="256" height="256"></span>`;}

/* ---------- Niveaux ---------- */
const LEVELS=[[0,'Ti Kalbas'],[100,'Zandoli'],[300,'Mabouya'],[600,'Manikou'],[1000,'Konpè Lapen'],[1600,'Ti-Jean'],[2500,'Majò'],[4000,'Mèt Kont'],[6000,'Gran Moun'],[9000,'Gran Mèt Kréyol']];
function levelOf(xp){xp=xp||0;let i=0;while(i<LEVELS.length-1&&xp>=LEVELS[i+1][0])i++;
  const next=LEVELS[i+1];return {i,name:LEVELS[i][1],min:LEVELS[i][0],next:next?next[0]:null,nextName:next?next[1]:null,pct:next?Math.min(100,Math.round((xp-LEVELS[i][0])/(next[0]-LEVELS[i][0])*100)):100};}
const XP_WIN=20,XP_TIE=10,XP_PLAY=5,COMBO_EVERY=5,COMBO_BONUS=2;

/* ---------- Utilitaires ---------- */
const $app=document.getElementById('app');
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const ptsLabel=p=>`<span class="pts p${p}">+${p}</span>`;
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
function activeThemes(terrs){return THEMES.map((t,i)=>i).filter(i=>!THEMES[i].off&&!THEMES[i].kid&&(!terrs||THEMES[i].terr==='AN'||terrs.includes(THEMES[i].terr)));}
function kidThemes(){return THEMES.map((t,i)=>i).filter(i=>!THEMES[i].off&&(THEMES[i].kid||KID_EXTRA.includes(THEMES[i].t)));}
const KID_EXTRA=["Fruits qu'on trouve aux Antilles","Mots créoles du quotidien (en créole)"];
function pickThemes(terrs,kid){
  if(kid)return shuffle(kidThemes()).slice(0,ROUNDS);
  terrs=(terrs&&terrs.length)?terrs:(settings.terr||['MQ']);
  const act=activeThemes(terrs),loc=shuffle(act.filter(i=>THEMES[i].terr!=='AN')),com=shuffle(act.filter(i=>THEMES[i].terr==='AN'));
  const pick=loc.slice(0,3);
  for(const i of [...com,...loc.slice(3)]){if(pick.length>=ROUNDS)break;pick.push(i);}
  return shuffle(pick);
}
function terrChips(){return `<div class="terrs" role="group" aria-label="Territoires">${TERRS.map(([k,n])=>`<button type="button" class="terr" data-terr="${k}" aria-pressed="${(settings.terr||[]).includes(k)}">${n}</button>`).join('')}</div>`;}
function bindTerr(onChange){
  $app.querySelectorAll('[data-terr]').forEach(b=>b.onclick=()=>{
    const k=b.dataset.terr;let t=(settings.terr||[]).slice();
    t=t.includes(k)?t.filter(x=>x!==k):[...t,k];if(!t.length){toast('Choisis au moins un territoire.');return;}
    settings.terr=t;saveSettings();$app.querySelectorAll('[data-terr]').forEach(x=>x.setAttribute('aria-pressed',t.includes(x.dataset.terr)));if(onChange)onChange();
  });
}
const byId=id=>document.getElementById(id);
let settings={count:2,names:['Joueur 1','Joueur 2'],dur:60,terr:['MQ'],sound:true};
try{const s=JSON.parse(localStorage.getItem('tibackreyol')||'null');if(s)settings={...settings,...s};}catch(e){}
function saveSettings(){try{localStorage.setItem('tibackreyol',JSON.stringify(settings));}catch(e){}}
let tick=null, unsubs=[];
function cleanup(){clearInterval(tick);tick=null;unsubs.forEach(f=>{try{f()}catch(e){}});unsubs=[];}
function winnerOf(list){
  if(list.length<2)return null;
  const s=list.slice().sort((a,b)=>b.score-a.score||b.count-a.count);
  if(s[0].score===s[1].score&&s[0].count===s[1].count)return 'tie';
  return s[0];
}
function copyText(txt,btn,label){
  const done=()=>{if(btn){const o=btn.textContent;btn.textContent=label||'Copié !';setTimeout(()=>btn.textContent=o,1800);}};
  try{navigator.clipboard.writeText(txt).then(done,()=>fallbackCopy(txt,btn));}catch(e){fallbackCopy(txt,btn);}
}
function fallbackCopy(txt,btn){const box=document.createElement('input');box.value=txt;box.type='text';box.style.marginTop='8px';box.readOnly=true;(btn&&btn.parentNode||$app).appendChild(box);box.select();}

/* ---------- Onglets ---------- */
const TABS=[['jouer','Jouer'],['defi','Défi du jour'],['enligne','En ligne'],['amis','Amis'],['classement','Classement'],['regles','Règlement'],['compte','Connexion'],['legal','Mentions légales']];
let tab='jouer',IS_OWNER=false;
function renderTabs(){
  const tabs=IS_OWNER?[...TABS,['admin','Admin'+(pendingReports().length?` (${pendingReports().length})`:'')]]:TABS;
  byId('tabs').innerHTML=tabs.map(([k,l])=>`<button type="button" data-tab="${k}" ${k===tab?'aria-current="page"':''}>${l}${k==='amis'&&pendingIn().length?` (${pendingIn().length})`:''}${k==='enligne'&&openInvites().length?` (${openInvites().length})`:''}</button>`).join('');
  document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>go(b.dataset.tab));
}
function go(t){
  cleanup();tab=t;CURRENT=null;PLAYING=false;SUMMARY=false;renderTabs();window.scrollTo(0,0);
  ({jouer:showSetup,defi:showDaily,admin:showAdmin,enligne:showOnline,amis:showFriends,classement:showRanking,regles:showRules,compte:showAccount,legal:showLegal})[t]();
}
byId('mepill').onclick=()=>go('compte');

/* ---------- Moteur d'une manche ---------- */
function playRound({who,label,th,dur,jokers,score,onFinish,last}){
  cleanup();PLAYING=true;
  const found=[],rejects=[],rejKeys=new Set();let end=Date.now()+dur*1000,total=dur,hints=[],pts=0,done=false;
  let combo=0,maxCombo=0,bonus=0,lastSec=null,recorded=false;const prevBest=bestFor(th.idx);
  $app.innerHTML=`
  <div class="hud">
    <div class="who">${esc(who)}<small>${esc(label)}</small></div>
    <div class="timer" id="timer"><svg viewBox="0 0 78 78"><circle cx="39" cy="39" r="33" fill="none" stroke="var(--card)" stroke-width="7"/><circle id="arc" cx="39" cy="39" r="33" fill="none" stroke="var(--gold)" stroke-width="7" stroke-linecap="round" stroke-dasharray="207.3" stroke-dashoffset="0"/></svg><div class="t" id="tt">${dur}</div></div>
    <div class="score"><span id="sc">${score}</span><small>points</small></div>
  </div>
  <div class="theme-card"><div class="combo" id="combo" aria-live="polite"></div><h3 style="color:var(--gold)">${last?'Dernière manche · ':''}Thème</h3><h2>${esc(th.title)}</h2><p class="count"><span id="nf">0</span> / ${th.answers.length} trouvées</p></div>
  <form class="entry" id="f" autocomplete="off"><input type="text" id="in" placeholder="Tape une réponse…" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="send"><button class="btn" type="submit">OK</button></form>
  <div class="feedback" id="fb" aria-live="polite"></div>
  <div class="jokers">
    <button class="joker" id="jt" type="button" ${jokers.time?'':'disabled'}>+15 s <small>(${jokers.time})</small></button>
    <button class="joker" id="jh" type="button" ${jokers.hint?'':'disabled'}>Indice <small>(${jokers.hint})</small></button>
    <button class="joker" id="jstop" type="button">Terminer la manche</button>
  </div>
  <div id="hints" class="hint"></div>
  <section class="panel"><h3>Tes réponses</h3><div class="found" id="found"></div></section>`;
  const $in=byId('in'),$fb=byId('fb'),$found=byId('found');
  $in.focus();
  const render=()=>{
    byId('nf').textContent=found.length;byId('sc').textContent=score+pts;
    $found.innerHTML=found.length?found.slice().reverse().map(i=>{const a=th.answers[i];return `<span class="chip">${esc(a.name)} ${ptsLabel(a.pts)}</span>`;}).join(''):'<span class="empty">Rien pour l\'instant. Lance-toi !</span>';
    byId('hints').innerHTML=hints.filter(i=>!found.includes(i)).map(i=>esc(mask(th.answers[i].name))).join('<br>');
  };
  const say=(msg,cls)=>{$fb.textContent=msg;$fb.className='feedback '+cls;};
  byId('f').onsubmit=e=>{
    e.preventDefault();const v=$in.value.trim();if(!v||done)return;
    const i=findAnswer(v,th);
    if(i===null){if(combo>=3)SFX.breakStreak();else SFX.bad();combo=0;showCombo();const rk=norm(v,th.extra);if(rk&&!rejKeys.has(rk)){rejKeys.add(rk);rejects.push(v.slice(0,40));}say(`« ${v} » : pas dans la liste`,'bad');$in.classList.remove('shake');void $in.offsetWidth;$in.classList.add('shake');}
    else if(found.includes(i)){SFX.dup();say(`${th.answers[i].name} : déjà trouvé`,'dup');}
    else{found.push(i);const a=th.answers[i];pts+=a.pts;combo++;maxCombo=Math.max(maxCombo,combo);
      const cb=combo%COMBO_EVERY===0?COMBO_BONUS:0;pts+=cb;bonus+=cb;
      SFX.good(a.pts,combo);showCombo();
      say(`${a.name} ! +${a.pts}${a.pts===3?' · très rare':a.pts===2?' · rare':''}${cb?` · bonus combo +${cb}`:''}`,'ok');render();
      if(!recorded&&prevBest>=3&&found.length===prevBest+1){recorded=true;setTimeout(()=>{if(!done){SFX.record();flashCombo('🏆 Nouveau record !','rec');}},450);}
      if(found.length===th.answers.length)finish();}
    $in.value='';$in.focus();
  };
  byId('jt').onclick=function(){if(!jokers.time||done)return;jokers.time--;end+=15000;total+=15;this.disabled=true;this.querySelector('small').textContent='(0)';say('+15 secondes !','ok');$in.focus();};
  byId('jh').onclick=function(){
    if(!jokers.hint||done)return;const left=th.answers.map((a,i)=>i).filter(i=>!found.includes(i)&&!hints.includes(i));if(!left.length)return;
    jokers.hint--;hints.push(left[Math.floor(Math.random()*left.length)]);this.querySelector('small').textContent=`(${jokers.hint})`;if(!jokers.hint)this.disabled=true;render();$in.focus();};
  byId('jstop').onclick=()=>finish();
  function showCombo(){const el=byId('combo');if(!el)return;
    if(combo>=5){el.textContent=`🔥 COMBO x${combo} !${combo%COMBO_EVERY===0?` +${COMBO_BONUS}`:''}`;el.className='combo on'+(combo>=8?' hot':'');void el.offsetWidth;el.classList.add('bump');}
    else if(!el.classList.contains('rec')){el.textContent='';el.className='combo';}}
  function flashCombo(txt,cls){const el=byId('combo');if(!el)return;el.textContent=txt;el.className='combo on '+cls;
    setTimeout(()=>{if(el.classList.contains(cls)){el.className='combo';showCombo();}},2200);}
  function finish(){if(done)return;done=true;PLAYING=false;clearInterval(tick);tick=null;SFX.end();saveBest(th.idx,found.length);onFinish(found.slice(),pts,rejects.slice(),{maxCombo,bonus});}
  if(last)SFX.suspense();
  const $tt=byId('tt'),$arc=byId('arc'),$timer=byId('timer');
  tick=setInterval(()=>{
    const left=Math.max(0,(end-Date.now())/1000);
    $tt.textContent=Math.ceil(left);$arc.setAttribute('stroke-dashoffset',207.3*(1-left/total));
    $timer.classList.toggle('low',left<=10);$arc.setAttribute('stroke',left<=10?'var(--red)':'var(--gold)');
    const sec=Math.ceil(left);if(sec!==lastSec){lastSec=sec;if(sec>0&&sec<=(last?10:5))SFX.tick(sec,last);}
    if(left<=0)finish();
  },200);
  render();
}
function mask(name){return [...name].map((c,i)=>i<2||/[\s'\-]/.test(c)?c:'_').join('');}
function answersTable(th,cols){
  const order=th.answers.map((a,i)=>i).sort((x,y)=>{const fx=cols.some(c=>c.found&&c.found.includes(x)),fy=cols.some(c=>c.found&&c.found.includes(y));return (fy-fx)||(th.answers[y].pts-th.answers[x].pts);});
  return `<div class="scroll"><table class="tbl"><thead><tr><th>Réponse</th><th>Pts</th>${cols.map(c=>`<th class="c">${esc(c.name.slice(0,9))}</th>`).join('')}</tr></thead>
  <tbody>${order.map(i=>{const a=th.answers[i],any=cols.some(c=>c.found&&c.found.includes(i));return `<tr class="${any?'':'miss'}"><td>${esc(a.name)}</td><td>${ptsLabel(a.pts)}</td>${cols.map(c=>`<td class="c">${c.found&&c.found.includes(i)?'<span class="tick">✓</span>':'<span class="dash">·</span>'}</td>`).join('')}</tr>`;}).join('')}</tbody></table></div>`;
}

/* =================== JOUER (même téléphone) =================== */
let G=null,PLAYING=false,SUMMARY=false;
function showSetup(){
  $app.innerHTML=`
  <section class="panel">
    <h2>Le petit bac 100 % Antillais</h2>
    <p class="muted">5 manches, un thème par manche. Tape un maximum de réponses avant la fin du chrono. Le barème et la liste des thèmes sont dans l'onglet Règlement.</p>
  </section>
  <section class="panel">
    <h3>Partie sur ce téléphone</h3>
    <div class="row"><div class="seg" role="group" aria-label="Nombre de joueurs">
      <button type="button" id="c1" aria-pressed="${settings.count===1}">Solo</button>
      <button type="button" id="c2" aria-pressed="${settings.count===2}">2 joueurs</button></div>
      <span class="muted" style="font-size:13px">${settings.count===2?'Chacun son tour sur le même téléphone':'Bats ton propre record'}</span></div>
    <div class="row">
      <label class="fld grow">Joueur 1<input type="text" id="n0" maxlength="16" value="${esc(settings.names[0])}"></label>
      ${settings.count===2?`<label class="fld grow">Joueur 2<input type="text" id="n1" maxlength="16" value="${esc(settings.names[1])}"></label>`:''}
    </div>
    <h3>Public</h3>
    <div class="seg" role="group" aria-label="Public"><button type="button" id="kid0" aria-pressed="${!settings.kid}">Tout public</button><button type="button" id="kid1" aria-pressed="${!!settings.kid}">Mode Ti moun</button></div>
    ${settings.kid?`<p class="muted" style="font-size:13px">Pour les enfants : ${kidThemes().length} thèmes simples (couleurs, chiffres et corps en créole, animaux, plage, contes, carnaval…), 3 indices par partie.</p>`:`<h3>Territoires</h3>
    ${terrChips()}
    <p class="muted" style="font-size:13px" id="tcount"></p>`}
    <h3>Durée d'une manche</h3>
    <div class="seg" role="group" aria-label="Durée">${[45,60,90].map(d=>`<button type="button" data-d="${d}" aria-pressed="${settings.dur===d}">${d} s</button>`).join('')}</div>
    <div class="row"><button class="btn ghost sm" id="snd" type="button">${settings.sound?'Sons : activés':'Sons : coupés'}</button></div>
    <button class="btn wide" id="go" type="button">Lancer la partie</button>
    <p class="foot">Les parties sur un même téléphone ne comptent pas pour le classement.</p>
    <div class="sep" role="separator"></div>
    <h3>Jouer à distance</h3>
    <p class="muted">Défie un ami sur son propre téléphone, en direct ou chacun à son rythme, et grimpe au classement.</p>
    <div class="row"><button class="btn ghost grow" id="toOnline" type="button">En ligne</button><button class="btn ghost grow" id="toFriends" type="button">Mes amis</button></div>
  </section>
  <section class="panel">
    <h3>Défi du jour</h3>
    <p class="muted">Un nouveau thème chaque jour, le même pour tout le monde, avec son classement et son proverbe créole.</p>
    <button class="btn ghost" id="toDaily" type="button">Relever le défi du jour</button>
  </section>
  ${installPanel()}`;
  const paintThemes=()=>{const act=activeThemes(settings.terr);if(!byId('tcount'))return;byId('tcount').textContent=`${act.length} thèmes : ceux des territoires choisis, plus les thèmes communs aux Antilles et à la Guyane.`;};
  paintThemes();bindTerr(paintThemes);
  byId('snd').onclick=function(){settings.sound=!settings.sound;saveSettings();this.textContent=settings.sound?'Sons : activés':'Sons : coupés';if(settings.sound)SFX.good(1,3);};
  const readNames=()=>{settings.names[0]=(byId('n0').value.trim()||'Joueur 1');const n1=byId('n1');if(n1)settings.names[1]=n1.value.trim()||'Joueur 2';};
  byId('kid0').onclick=()=>{readNames();settings.kid=false;saveSettings();showSetup();};
  byId('kid1').onclick=()=>{readNames();settings.kid=true;saveSettings();showSetup();};
  byId('c1').onclick=()=>{readNames();settings.count=1;saveSettings();showSetup();};
  byId('c2').onclick=()=>{readNames();settings.count=2;saveSettings();showSetup();};
  $app.querySelectorAll('[data-d]').forEach(b=>b.onclick=()=>{readNames();settings.dur=+b.dataset.d;saveSettings();showSetup();});
  byId('go').onclick=()=>{readNames();saveSettings();newLocalGame();};
  byId('toOnline').onclick=()=>go('enligne');byId('toDaily').onclick=()=>go('defi');bindInstall();
  byId('toFriends').onclick=()=>go('amis');
}
function newLocalGame(){
  const kid=!!settings.kid;
  G={kid,players:settings.names.slice(0,settings.count).map(name=>({name,score:0,count:0,jokers:{time:1,hint:kid?3:2}})),themes:pickThemes(settings.terr,kid),round:0,turn:0,dur:settings.dur};
  G.found=G.themes.map(()=>G.players.map(()=>[]));G.rej=G.themes.map(()=>G.players.map(()=>[]));G.roundPts=G.themes.map(()=>G.players.map(()=>0));
  localIntro();
}
function localIntro(){
  cleanup();
  const p=G.players[G.turn],th=prep(G.themes[G.round]),multi=G.players.length>1;
  $app.innerHTML=`
  <section class="panel center pass">
    ${multi?`<h3>Passe le téléphone à</h3><p class="big">${esc(p.name)}</p>`:`<h3>Manche ${G.round+1} sur ${ROUNDS}</h3>`}
    <div class="theme-card" style="width:100%"><h3 style="color:var(--gold)">Manche ${G.round+1} · Thème</h3><h2>${esc(th.title)}</h2><p class="count">${th.answers.length} réponses à trouver · ${G.dur} secondes</p></div>
    <button class="btn wide" id="ready" type="button">Je suis prêt·e, go !</button>
  </section>
  <div class="scoreline">${G.players.map(q=>`<div class="sc"><span class="n">${esc(q.name)}</span><span class="v">${q.score}</span><span class="d">points</span></div>`).join('')}</div>`;
  byId('ready').onclick=()=>playRound({who:p.name,label:`Manche ${G.round+1}/${ROUNDS}`,th,dur:G.dur,last:G.round===ROUNDS-1,jokers:p.jokers,score:p.score,
    onFinish:(found,pts,rej)=>{recordStats(G.themes[G.round],found);G.found[G.round][G.turn]=found;G.rej[G.round][G.turn]=rej;G.roundPts[G.round][G.turn]=pts;p.score+=pts;p.count+=found.length;
      if(G.turn<G.players.length-1){G.turn++;localIntro();}else localRoundResult();}});
}
function localRoundResult(){
  const th=prep(G.themes[G.round]),F=G.found[G.round],last=G.round===ROUNDS-1;
  $app.innerHTML=`
  <section class="panel"><h3>Fin de la manche ${G.round+1}</h3><h2>${esc(th.title)}</h2>
    <div class="scoreline">${G.players.map((p,k)=>`<div class="sc"><span class="n">${esc(p.name)}</span><span class="v">+${G.roundPts[G.round][k]}</span><span class="d">${F[k].length} réponse${F[k].length>1?'s':''} · total ${p.score}</span></div>`).join('')}</div>
  </section>
  ${anecBlock(G.themes[G.round])}
  ${reportBlock(G.themes[G.round],[].concat(...G.rej[G.round]))}
  <section class="panel"><h3>Toutes les réponses</h3>${answersTable(th,G.players.map((p,k)=>({name:p.name,found:F[k]})))}</section>
  <button class="btn wide" id="nx" type="button">${last?'Voir le classement final':'Manche suivante'}</button>`;
  bindReports();
  byId('nx').onclick=()=>{if(last)localFinal();else{G.round++;G.turn=0;localIntro();}};
  window.scrollTo(0,0);
}
function localFinal(){
  const multi=G.players.length>1,w=winnerOf(G.players);
  const headline=!multi?`${G.players[0].score} points`:w==='tie'?'Match nul !':`${esc(w.name)} gagne !`;
  $app.innerHTML=`
  <section class="panel center pass"><h3>${multi?'Résultat':'Ton score'}</h3><p class="big">${headline}</p>
    <p class="muted">${multi?G.players.map(p=>`${esc(p.name)} : ${p.score} pts`).join(' · '):`${G.players[0].count} bonnes réponses sur ${ROUNDS} thèmes`}</p></section>
  <section class="panel"><h3>Détail par manche</h3>
  <div class="scroll"><table class="tbl"><thead><tr><th>Thème</th>${G.players.map(p=>`<th class="num">${esc(p.name.slice(0,9))}</th>`).join('')}</tr></thead>
  <tbody>${G.themes.map((t,r)=>`<tr><td>${esc(THEMES[t].t)}</td>${G.players.map((p,k)=>`<td class="num">${G.roundPts[r][k]}</td>`).join('')}</tr>`).join('')}
  <tr><td><b>Total</b></td>${G.players.map(p=>`<td class="num"><b>${p.score}</b></td>`).join('')}</tr></tbody></table></div></section>
  <div class="row"><button class="btn grow" id="again" type="button">Revanche (nouveaux thèmes)</button><button class="btn ghost grow" id="home" type="button">Changer les joueurs</button></div>`;
  byId('again').onclick=newLocalGame;byId('home').onclick=showSetup;
  window.scrollTo(0,0);
  if(!multi||w!=='tie'){SFX.win();confetti();}
}


/* =================== « OU TÉ SAV SA ? » =================== */
function anecBlock(t){
  const list=ANEC[t];if(!list||!list.length)return '';
  const a=list[Math.floor(Math.random()*list.length)];
  return `<section class="panel anec"><h3>Ou té sav sa ?</h3><p>${esc(a)}</p></section>`;
}

/* =================== DÉFI : outils =================== */
function todayKey(){return new Date(Date.now()-4*3600e3).toISOString().slice(0,10);} // heure des Antilles (UTC-4)
function hashStr(str){let h=2166136261;for(const c of str){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
function dailyTheme(d){const act=activeThemes(null);return act[hashStr('tibac'+d)%act.length];}
function dailyProverb(d){return PROVERBS[hashStr('pwovèb'+d)%PROVERBS.length];}


/* =================== CONNEXION AU SERVEUR (Supabase) =================== */
const CFG=window.TIBAC_CONFIG||{};
const CONFIGURED=!!(CFG.SUPABASE_URL&&CFG.SUPABASE_ANON_KEY&&!/VOTRE|XXXX/.test(CFG.SUPABASE_URL+CFG.SUPABASE_ANON_KEY));
const SB=(CONFIGURED&&window.supabase)?window.supabase.createClient(CFG.SUPABASE_URL,CFG.SUPABASE_ANON_KEY):null;
let SESSION=null,UID=null,READY=false,RECOVERY=false;
let MEP=null,MEPLOADED=false,FRIENDSHIPS=[],MYMATCHES=[],INVITES=[],TOP=[],TOPW=[],PCACHE={},PFETCH={};
let MYREPORTS=[],ALLREPORTS=[],MYDAILY=null,MYDAILY_LOADED=false,EARNED=null;
let CURRENT=null,PENDING_CODE=null,AWARDING={},CELEBRATED={};
{const h=(location.hash||'').replace('#','').toUpperCase();if(h==='DEFI'||h==='AMIS'){tab=h.toLowerCase();history.replaceState(null,'',location.pathname);}else if(/^[A-Z0-9]{5}$/.test(h))PENDING_CODE=h;
 else{try{const k=localStorage.getItem('tibac_pending');if(k&&/^[A-Z0-9]{5}$/.test(k))PENDING_CODE=k;}catch(e){}}}
const URLAUTH=location.hash+location.search;
const FROM_EMAIL=/access_token=|type=signup|type=email|type=magiclink/.test(URLAUTH);
const LINK_ERROR=/error_code=|error_description=/.test(URLAUTH)?(/expired/i.test(decodeURIComponent(URLAUTH))?'Ce lien a expiré. Connecte-toi ou demande un nouvel e-mail.':'Ce lien n\'est plus valable. Connecte-toi avec ton e-mail et ton mot de passe.'):null;
let WELCOMED=false;
function rememberPending(){try{if(PENDING_CODE)localStorage.setItem('tibac_pending',PENDING_CODE);}catch(e){}}
function forgetPending(){try{localStorage.removeItem('tibac_pending');}catch(e){}}

const hasProfile=()=>!!(MEP&&MEP.pseudo);
const myPseudo=()=>(MEP&&MEP.pseudo)||'Joueur';
const myAvatar=()=>(MEP&&MEP.avatar)||'lapen';
function pairId(a,b){return [a,b].sort().join('__');}
function likeEsc(s){return String(s).replace(/[\\%_]/g,m=>'\\'+m);}
function withUid(p){return p?{...p,uid:p.id}:p;}
function player(uid){
  if(uid===UID&&MEP)return MEP;
  if(PCACHE[uid])return PCACHE[uid];
  if(SB&&uid&&!PFETCH[uid]){PFETCH[uid]=1;SB.from('profiles').select('id,pseudo,avatar,xp').eq('id',uid).maybeSingle().then(({data})=>{PCACHE[uid]=withUid(data)||{uid,pseudo:'Joueur supprimé',avatar:'zonbi',xp:0};refreshAll();});}
  return null;
}
function friendOf(f){return f.user_a===UID?f.user_b:f.user_a;}
function friendsList(){return FRIENDSHIPS.filter(f=>f.status==='accepted').map(friendOf);}
function pendingIn(){return FRIENDSHIPS.filter(f=>f.status==='pending'&&f.to_id===UID);}
function pendingOut(){return FRIENDSHIPS.filter(f=>f.status==='pending'&&f.from_id===UID);}
function paintPill(){
  byId('mename').textContent=hasProfile()?myPseudo():(SESSION?'Mon profil':'Connexion');
  const k=avKey(myAvatar());byId('meav').style.background=AVATARS[k].bg;byId('meav').innerHTML=hasProfile()?`<img src="avatars/${k}.jpg" alt="">`:'';
}
function dbMsg(e){
  const c=e&&(e.code||e.status);
  if(c==='23505')return 'Cet élément existe déjà.';
  if(c==='42501'||c===401||c===403)return "Action refusée : vérifie que tu es bien connecté·e.";
  if(!navigator.onLine)return 'Pas de connexion internet. Réessaie quand tu seras connecté·e.';
  return 'La connexion au serveur a échoué. Réessaie dans un instant.';
}
async function q(p){const {data,error}=await p;if(error)throw error;return data;}

/* ---------- Chargements ---------- */
/* Dernière activité (sert au nettoyage des comptes inactifs depuis 2 ans) */
function touchSeen(){if(!MEP||!SB)return;const last=Date.parse(MEP.last_seen||0)||0;if(Date.now()-last<12*3600e3)return;
  const now=new Date().toISOString();SB.from('profiles').update({last_seen:now}).eq('id',UID).then(()=>{MEP.last_seen=now;},()=>{});}
async function loadProfile(){if(!UID){MEP=null;MEPLOADED=true;return;}
  try{MEP=withUid(await q(SB.from('profiles').select('*').eq('id',UID).maybeSingle()));}catch(e){}
  MEPLOADED=true;paintPill();checkBadges();}
async function loadFriends(){if(!UID){FRIENDSHIPS=[];return;}try{FRIENDSHIPS=await q(SB.from('friendships').select('*'));}catch(e){}}
async function loadMatches(){
  if(!UID){MYMATCHES=[];return;}
  try{
    const ms=await q(SB.from('matches').select('*').contains('players',[UID]).order('created_at',{ascending:false}).limit(40));
    const codes=ms.map(m=>m.code);let plays=[];
    if(codes.length)plays=await q(SB.from('plays').select('code,user_id,r,score,found_count').in('code',codes));
    ms.forEach(m=>{m.progress={};plays.filter(p=>p.code===m.code).forEach(p=>{m.progress[p.user_id]={r:p.r,score:p.score,count:p.found_count};});});
    MYMATCHES=ms.filter(m=>!(m.hidden||[]).includes(UID));
  }catch(e){}
}
async function loadTop(){try{TOP=(await q(SB.from('profiles').select('id,pseudo,avatar,xp,week_xp,week_key').order('xp',{ascending:false}).limit(200))).map(withUid);TOP.forEach(p=>PCACHE[p.uid]=p);}catch(e){}
  try{TOPW=(await q(SB.from('profiles').select('id,pseudo,avatar,xp,week_xp,week_key').eq('week_key',weekKey()).gt('week_xp',0).order('week_xp',{ascending:false}).limit(200))).map(withUid);TOPW.forEach(p=>PCACHE[p.uid]=p);}catch(e){}}
async function loadExtras(){try{const rows=await q(SB.from('extras').select('*').order('id'));EXTRA={};rows.forEach(r=>{(EXTRA[r.theme]=EXTRA[r.theme]||[]).push(r);});PREP={};}catch(e){}}
async function loadMyReports(){if(!UID){MYREPORTS=[];return;}try{MYREPORTS=await q(SB.from('reports').select('theme,answer,status').eq('user_id',UID));}catch(e){}}
async function loadAllReports(){if(!IS_OWNER)return;try{ALLREPORTS=await q(SB.from('reports').select('id,user_id,theme,answer,status').eq('status','new').limit(1000));}catch(e){}}
async function loadMyDaily(){if(!UID){MYDAILY=null;MYDAILY_LOADED=true;return;}try{MYDAILY=await q(SB.from('dailyscores').select('*').eq('user_id',UID).maybeSingle());}catch(e){}MYDAILY_LOADED=true;}

const DEB={};
function later(key,fn){clearTimeout(DEB[key]);DEB[key]=setTimeout(async()=>{await fn();renderTabs();refreshAll();},350);}
let CHANNEL=null;
function subscribeRealtime(){
  if(!SB||CHANNEL)return;
  CHANNEL=SB.channel('tibac-live')
   .on('postgres_changes',{event:'*',schema:'public',table:'profiles'},p=>{const id=(p.new&&p.new.id)||(p.old&&p.old.id);if(id===UID)later('me',loadProfile);if(p.new&&p.new.id)PCACHE[p.new.id]=withUid(p.new);later('top',loadTop);})
   .on('postgres_changes',{event:'*',schema:'public',table:'friendships'},()=>later('fr',loadFriends))
   .on('postgres_changes',{event:'*',schema:'public',table:'matches'},p=>{later('ma',async()=>{await loadMatches();await loadInvites();});const c=(p.new&&p.new.code)||(p.old&&p.old.code);if(CURRENT&&c===CURRENT)reloadCurrent();})
   .on('postgres_changes',{event:'*',schema:'public',table:'plays'},p=>{later('ma',loadMatches);const c=(p.new&&p.new.code)||(p.old&&p.old.code);if(CURRENT&&c===CURRENT)reloadCurrent();})
   .on('postgres_changes',{event:'*',schema:'public',table:'dailyscores'},()=>{later('da',async()=>{await loadMyDaily();await loadDailyList();});})
   .on('postgres_changes',{event:'*',schema:'public',table:'extras'},()=>later('ex',loadExtras))
   .on('postgres_changes',{event:'*',schema:'public',table:'reports'},()=>later('rp',async()=>{await loadMyReports();await loadAllReports();}))
   .subscribe();
}
async function loadAll(){
  await Promise.all([loadProfile(),loadFriends(),loadMatches(),loadInvites(),loadTop(),loadExtras(),loadMyReports(),loadMyDaily(),loadMySub()]);
  touchSeen();
  IS_OWNER=false;if(UID){try{IS_OWNER=!!(await q(SB.rpc('is_admin')));}catch(e){}}
  await loadAllReports();
}
async function onSession(session){
  SESSION=session;const newUid=session?session.user.id:null;
  if(newUid!==UID){UID=newUid;MEP=null;MEPLOADED=false;MYDAILY_LOADED=false;EARNED=null;await loadAll();}
  READY=true;paintPill();renderTabs();
  if(session&&!WELCOMED&&(FROM_EMAIL||JUST_VERIFIED)){
    WELCOMED=true;JUST_VERIFIED=false;
    if(FROM_EMAIL)history.replaceState(null,'',location.pathname);
    if(!hasProfile()){tab='compte';toast('Adresse confirmée, tu es connecté·e ! Choisis maintenant ton pseudo.');}
    else toast(`Bon retour, ${myPseudo()} !`);
  }
  if(!PLAYING&&!CURRENT&&!SUMMARY)go(tab);
  handlePending();
}
(async()=>{
  if(!SB){READY=true;MEPLOADED=true;MYDAILY_LOADED=true;renderTabs();if(tab!=='jouer')go(tab);return;}
  SB.auth.onAuthStateChange((event,session)=>{
    if(event==='PASSWORD_RECOVERY'){RECOVERY=true;SESSION=session;go('compte');return;}
    if(event==='SIGNED_IN'||event==='SIGNED_OUT'||event==='USER_UPDATED')onSession(session);
  });
  const {data}=await SB.auth.getSession();
  if(LINK_ERROR&&!data.session){history.replaceState(null,'',location.pathname);tab='compte';setTimeout(()=>toast(LINK_ERROR),300);}
  await onSession(data.session);
  subscribeRealtime();
})();

function refreshAll(){
  if(PLAYING||CURRENT||SUMMARY)return;
  if(tab==='enligne'){if(byId('mlist'))renderMatchList();else showOnline();}
  if(tab==='amis'){if(byId('flist'))renderFriendLists();else showFriends();}
  if(tab==='classement'){if(byId('rank'))renderRank();else showRanking();}
  if(tab==='compte'){if(byId('stats'))renderStats();else if(!byId('ps')&&!byId('em'))showAccount();}
  if(tab==='defi'){if(byId('dstate'))renderDaily();else showDaily();}
  if(tab==='admin'){if(byId('adm'))renderAdmin();else showAdmin();}
}
async function handlePending(){
  if(!PENDING_CODE||!READY||!SB)return;
  if(!SESSION||!hasProfile()){if(tab!=='compte')go('compte');return;}
  const code=PENDING_CODE;PENDING_CODE=null;forgetPending();history.replaceState(null,'',location.pathname);
  try{const r=await joinMatch(code);if(r){go('enligne');const e=byId('jerr');if(e)e.textContent=r;}else openMatch(code);}catch(e){go('enligne');}
}
function needAuth(){
  if(!SB){$app.innerHTML=`<section class="panel"><h2>Mode en ligne pas encore configuré</h2><p class="muted">Le jeu en ligne a besoin d'être relié à sa base de données (fichier config.js). En attendant, le mode « Jouer » fonctionne sur ce téléphone.</p></section>`;return true;}
  if(!READY||(SESSION&&!MEPLOADED)){$app.innerHTML=`<section class="panel center pass"><p class="muted">Connexion…</p></section>`;return true;}
  if(!SESSION){$app.innerHTML=`<section class="panel"><h2>Connecte-toi pour jouer en ligne</h2><p class="muted">Un compte gratuit te permet d'affronter tes amis, de relever le défi du jour et d'apparaître au classement.</p><button class="btn" id="toAcc" type="button">Se connecter ou créer un compte</button></section>`;byId('toAcc').onclick=()=>go('compte');return true;}
  if(!hasProfile()){$app.innerHTML=`<section class="panel"><h2>Crée ton profil de joueur</h2><p class="muted">Choisis un pseudo et un personnage pour jouer en ligne, ajouter des amis et apparaître au classement.</p><button class="btn" id="toAcc" type="button">Créer mon profil</button></section>`;byId('toAcc').onclick=()=>go('compte');return true;}
  return false;
}

/* =================== CONNEXION / PROFIL =================== */
let PICK=null,AUTHMODE='login';
function showAccount(){
  if(!SB){needAuth();return;}
  if(!READY){$app.innerHTML=`<section class="panel center pass"><p class="muted">Connexion…</p></section>`;return;}
  if(RECOVERY){return showNewPassword();}
  if(!SESSION){return showLogin();}
  if(!MEPLOADED){$app.innerHTML=`<section class="panel center pass"><p class="muted">Chargement de ton profil…</p></section>`;return;}
  PICK=avKey(PICK||myAvatar());
  const lv=levelOf(MEP&&MEP.xp);
  $app.innerHTML=`
  ${PENDING_CODE?`<p class="notice">Crée ton profil pour rejoindre la partie <b>${esc(PENDING_CODE)}</b>.</p>`:''}
  <section class="panel">
    <h3>${hasProfile()?'Mon profil':'Créer mon profil'}</h3>
    ${hasProfile()?`<div class="hero-me">${avatar(myAvatar(),64)}<div><h2 style="font-size:24px">${esc(myPseudo())}</h2><p class="muted" style="font-size:14px">Niveau ${lv.i+1} · ${esc(lv.name)} · ${MEP.xp||0} pts</p></div></div>
      <div class="bar" aria-hidden="true"><i style="width:${lv.pct}%"></i></div><p class="muted" style="font-size:13px">${lv.next!==null?`Encore ${lv.next-(MEP.xp||0)} pts pour devenir ${esc(lv.nextName)}`:'Niveau maximum atteint'}</p>`:''}
    <label class="fld">Pseudo (unique, 3 à 16 caractères). C'est avec lui que tes amis te trouvent.<input type="text" id="ps" maxlength="16" autocomplete="nickname" placeholder="Ex. : TiLapen972" value="${esc(hasProfile()?myPseudo():'')}"></label>
    <h3>Ton personnage</h3>
    <div class="avgrid">${AVKEYS.map(k=>`<button type="button" class="avopt" data-av="${k}" aria-pressed="${k===PICK}">${avatar(k)}<span>${AVATARS[k].n}</span></button>`).join('')}</div>
    <div class="row"><button class="btn" id="save" type="button">${hasProfile()?'Enregistrer':'Créer mon profil'}</button><span id="saved" aria-live="polite"></span></div>
  </section>
  ${hasProfile()?`<section class="panel"><h3>Mes statistiques en ligne</h3><div class="stats" id="stats"></div></section>
  <section class="panel"><h3>Mes badges · ${earnedBadges().length} / ${BADGES.length}</h3>${badgeGrid()}</section>`:''}
  ${pushPanel()}
  <section class="panel"><h3>Mon compte</h3>
    <p class="muted" style="font-size:14px">Connecté·e avec <b id="myemail"></b></p>
    <div class="row"><button class="btn ghost" id="logout" type="button">Se déconnecter</button><button class="btn ghost" id="delacc" type="button">Supprimer mon compte</button></div>
    <div id="delbox"></div>
  </section>`;
  byId('myemail').textContent=SESSION.user.email||'';
  $app.querySelectorAll('[data-av]').forEach(b=>b.onclick=()=>{PICK=b.dataset.av;$app.querySelectorAll('[data-av]').forEach(x=>x.setAttribute('aria-pressed',x===b));});
  byId('save').onclick=async function(){
    const msg=byId('saved');const p=byId('ps').value.trim();
    if(!/^[A-Za-zÀ-ÿ0-9 _\-]{3,16}$/.test(p)){msg.className='bad';msg.textContent='3 à 16 caractères : lettres, chiffres, espace, - ou _.';return;}
    this.disabled=true;msg.className='muted';msg.textContent='Enregistrement…';
    const r=await saveProfile(p,PICK);
    if(r){msg.className='bad';msg.textContent=r;this.disabled=false;return;}
    if(PENDING_CODE)handlePending();else{showAccount();const m2=byId('saved');if(m2){m2.className='ok';m2.textContent='Profil enregistré';}}
  };
  bindPush();
  byId('logout').onclick=async()=>{await disablePush();await SB.auth.signOut();go('jouer');};
  byId('delacc').onclick=()=>{byId('delbox').innerHTML=`<p class="notice">Ton profil, tes amis, tes parties et tes scores seront définitivement supprimés.</p><div class="row"><button class="btn red" id="delyes" type="button">Oui, supprimer définitivement</button><button class="btn ghost" id="delno" type="button">Annuler</button></div>`;
    byId('delno').onclick=()=>{byId('delbox').innerHTML='';};
    byId('delyes').onclick=async function(){this.disabled=true;try{await disablePush();await q(SB.rpc('delete_my_account'));await SB.auth.signOut();toast('Ton compte a été supprimé.');go('jouer');}catch(e){this.disabled=false;byId('delbox').insertAdjacentHTML('beforeend',`<p class="bad">${esc(dbMsg(e))}</p>`);}};};
  renderStats();
}
function showLogin(){
  const signup=AUTHMODE==='signup';
  $app.innerHTML=`
  ${PENDING_CODE?`<p class="notice">Connecte-toi pour rejoindre la partie <b>${esc(PENDING_CODE)}</b>.</p>`:''}
  <section class="panel">
    <div class="seg" role="group" aria-label="Connexion"><button type="button" data-am="login" aria-pressed="${!signup}">Se connecter</button><button type="button" data-am="signup" aria-pressed="${signup}">Créer un compte</button></div>
    <form id="authf" class="panel" style="padding:0;border:0;background:none" autocomplete="on">
      <label class="fld">Adresse e-mail<input type="text" id="em" inputmode="email" autocomplete="email" autocapitalize="off" spellcheck="false" placeholder="toi@exemple.com"></label>
      <label class="fld">Mot de passe${signup?' (8 caractères minimum)':''}<input type="password" id="pw" autocomplete="${signup?'new-password':'current-password'}" class="pw"></label>
      <button class="btn wide" type="submit" id="authgo">${signup?'Créer mon compte':'Se connecter'}</button>
      <p id="amsg" aria-live="polite"></p>
    </form>
    ${signup?'':'<button class="btn ghost sm" id="forgot" type="button">Mot de passe oublié ?</button>'}
  </section>
  <section class="panel"><h3>Pourquoi un compte ?</h3><p class="muted" style="font-size:14px">Il sert à jouer en ligne avec tes amis, à garder tes points, tes badges et ton niveau d'un téléphone à l'autre, et à apparaître au classement. Les parties sur un seul téléphone restent possibles sans compte.</p></section>`;
  $app.querySelectorAll('[data-am]').forEach(b=>b.onclick=()=>{AUTHMODE=b.dataset.am;showLogin();});
  const msg=byId('amsg');
  byId('authf').onsubmit=async e=>{
    e.preventDefault();const em=byId('em').value.trim(),pw=byId('pw').value;
    if(!/^\S+@\S+\.\S+$/.test(em)){msg.className='bad';msg.textContent='Adresse e-mail invalide.';return;}
    if(pw.length<(signup?8:1)){msg.className='bad';msg.textContent=signup?'Le mot de passe doit faire au moins 8 caractères.':'Saisis ton mot de passe.';return;}
    byId('authgo').disabled=true;msg.className='muted';msg.textContent='Un instant…';
    if(signup){
      rememberPending();
      const {data,error}=await SB.auth.signUp({email:em,password:pw,options:{emailRedirectTo:location.origin+location.pathname}});
      if(error){msg.className='bad';msg.textContent=authMsg(error);byId('authgo').disabled=false;return;}
      if(!data.session){showVerify(em);}
    }else{
      const {error}=await SB.auth.signInWithPassword({email:em,password:pw});
      if(error){msg.className='bad';msg.textContent=authMsg(error);byId('authgo').disabled=false;}
    }
  };
  const fg=byId('forgot');if(fg)fg.onclick=async()=>{
    const em=byId('em').value.trim();if(!/^\S+@\S+\.\S+$/.test(em)){msg.className='bad';msg.textContent='Saisis d\'abord ton adresse e-mail ci-dessus.';return;}
    const {error}=await SB.auth.resetPasswordForEmail(em,{redirectTo:location.origin+location.pathname});
    msg.className=error?'bad':'ok';msg.textContent=error?authMsg(error):'Si un compte existe avec cette adresse, un e-mail pour choisir un nouveau mot de passe vient d\'être envoyé.';
  };
}
let JUST_VERIFIED=false;
function showVerify(em){
  $app.innerHTML=`<section class="panel"><h2>Confirme ton adresse</h2>
    <p class="muted">Un e-mail vient d'être envoyé à <b id="vem"></b>. Regarde aussi dans les spams.</p>
    <p><b>Solution 1 :</b> clique sur le lien de l'e-mail. Tu seras connecté·e automatiquement.</p>
    <form id="otpf" class="panel" style="padding:0;border:0;background:none" autocomplete="off">
      <label class="fld"><span><b>Solution 2 :</b> si l'e-mail contient un code, tape-le ici et reste dans l'appli.</span><input type="text" id="otp" inputmode="numeric" autocomplete="one-time-code" maxlength="10" placeholder="123456" class="code"></label>
      <button class="btn wide" type="submit" id="otpgo">Valider le code</button>
      <p id="omsg" aria-live="polite"></p>
    </form>
    <div class="row"><button class="btn ghost sm" id="resend" type="button">Renvoyer l'e-mail</button><button class="btn ghost sm" id="golog" type="button">J'ai confirmé, me connecter</button></div>
  </section>`;
  byId('vem').textContent=em;
  const m=byId('omsg');
  byId('otpf').onsubmit=async e=>{e.preventDefault();const t=byId('otp').value.replace(/\s/g,'');
    if(!/^\d{6,10}$/.test(t)){m.className='bad';m.textContent='Le code est composé de chiffres.';return;}
    byId('otpgo').disabled=true;m.className='muted';m.textContent='Vérification…';
    let r=await SB.auth.verifyOtp({email:em,token:t,type:'signup'});
    if(r.error)r=await SB.auth.verifyOtp({email:em,token:t,type:'email'});
    if(r.error){m.className='bad';m.textContent=/expired/i.test(r.error.message)?'Ce code a expiré : demande un nouvel e-mail.':'Code incorrect. Vérifie-le et réessaie.';byId('otpgo').disabled=false;return;}
    JUST_VERIFIED=true;WELCOMED=false;};
  byId('resend').onclick=async function(){this.disabled=true;const {error}=await SB.auth.resend({type:'signup',email:em,options:{emailRedirectTo:location.origin+location.pathname}});
    m.className=error?'bad':'ok';m.textContent=error?authMsg(error):'Nouvel e-mail envoyé.';setTimeout(()=>{this.disabled=false;},30000);};
  byId('golog').onclick=()=>{AUTHMODE='login';showLogin();const e2=byId('em');if(e2)e2.value=em;};
}
function authMsg(e){
  const m=String(e&&e.message||'').toLowerCase();
  if(m.includes('invalid login'))return 'E-mail ou mot de passe incorrect.';
  if(m.includes('not confirmed'))return 'Confirme d\'abord ton adresse avec l\'e-mail reçu à l\'inscription.';
  if(m.includes('already registered'))return 'Un compte existe déjà avec cette adresse. Connecte-toi.';
  if(m.includes('rate limit')||m.includes('security purposes'))return 'Trop de tentatives. Patiente une minute avant de réessayer.';
  if(m.includes('password'))return 'Mot de passe refusé : choisis-en un plus long ou plus varié.';
  return 'Une erreur est survenue. Vérifie ta connexion et réessaie.';
}
function showNewPassword(){
  $app.innerHTML=`<section class="panel"><h2>Choisis un nouveau mot de passe</h2>
  <form id="npf" class="panel" style="padding:0;border:0;background:none"><label class="fld">Nouveau mot de passe (8 caractères minimum)<input type="password" id="npw" autocomplete="new-password" class="pw"></label>
  <button class="btn" type="submit">Enregistrer</button><p id="nmsg" aria-live="polite"></p></form></section>`;
  byId('npf').onsubmit=async e=>{e.preventDefault();const pw=byId('npw').value,m=byId('nmsg');
    if(pw.length<8){m.className='bad';m.textContent='8 caractères minimum.';return;}
    const {error}=await SB.auth.updateUser({password:pw});
    if(error){m.className='bad';m.textContent=authMsg(error);return;}
    RECOVERY=false;toast('Mot de passe modifié.');go('compte');};
}
async function saveProfile(p,av){
  const row={pseudo:p,avatar:av,updated_at:new Date().toISOString()};
  const {error}=MEP?await SB.from('profiles').update(row).eq('id',UID):await SB.from('profiles').insert({id:UID,...row});
  if(error)return error.code==='23505'?'Ce pseudo est déjà pris. Essaie une variante.':dbMsg(error);
  await loadProfile();paintPill();return null;
}
function progOf(m,id){return (m.progress&&m.progress[id])||{r:0,score:0,count:0};}
function renderStats(){
  const el=byId('stats');if(!el||!MEP)return;
  el.innerHTML=`<div class="stat"><b>${MEP.games||0}</b><span>parties terminées</span></div><div class="stat"><b>${MEP.wins||0}</b><span>victoires</span></div><div class="stat"><b>${friendsList().length}</b><span>amis</span></div>`;
}
/* Semaine de classement : du lundi au dimanche, heure des Antilles */
function weekKey(){const d=new Date(Date.now()-4*3600e3);d.setUTCDate(d.getUTCDate()-((d.getUTCDay()+6)%7));return d.toISOString().slice(0,10);}
function weekPts(p){return p&&p.week_key===weekKey()?(p.week_xp||0):0;}
function weekUpd(add){return {week_key:weekKey(),week_xp:weekPts(MEP)+add};}
function recordStats(t,found){
  if(!SB||!UID)return;const th=prep(t);
  SB.rpc('record_answers',{p_theme:t,p_names:found.map(i=>th.answers[i]&&th.answers[i].name).filter(Boolean)}).then(()=>{},()=>{});
}
async function recordRound(t,found,pts,more){
  recordStats(t,found);
  if(!MEP||!SB)return;
  const th=prep(t),perfect=found.length===th.answers.length?1:0,r3=found.filter(i=>th.answers[i]&&th.answers[i].pts===3).length;
  const best={...(MEP.best||{})};best[t]=Math.max(best[t]||0,found.length);
  const now=new Date().toISOString();
  const upd={xp:(MEP.xp||0)+pts,...weekUpd(pts),perfect:(MEP.perfect||0)+perfect,rare3:(MEP.rare3||0)+r3,best,updated_at:now,last_seen:now,...(more||{})};
  await q(SB.from('profiles').update(upd).eq('id',UID));
  MEP={...MEP,...upd};checkBadges();
}
function afterRound({title,t,found,pts,rej,btn,next,meta,share}){
  cleanup();SUMMARY=true;window.scrollTo(0,0);
  const th=prep(t),bn=(meta&&meta.bonus)||0,mc=(meta&&meta.maxCombo)||0;
  $app.innerHTML=`
  <section class="panel center pass"><h3>${esc(title)}</h3><p class="big">+${pts}</p><p class="muted">${esc(th.title)} · ${found.length} / ${th.answers.length} réponses${bn?` · dont bonus combo +${bn}`:''}${mc>=3?` · meilleure série x${mc}`:''}</p>
    ${share?`<button class="btn" id="shr" type="button">Partager mon score</button>`:''}</section>
  ${anecBlock(t)}
  ${reportBlock(t,rej)}
  <section class="panel"><h3>Toutes les réponses</h3>${answersTable(th,[{name:'Toi',found}])}</section>
  <button class="btn wide" id="nx" type="button">${esc(btn)}</button>`;
  bindReports();byId('nx').onclick=next;
  if(share)byId('shr').onclick=function(){shareScore(share,this);};
}
/* Partage façon Wordle : un carré par réponse trouvée, couleur selon les points */
function shareGrid(th,found){
  const sq={1:'🟩',2:'🟨',3:'🟪'},cells=found.map(i=>sq[(th.answers[i]||{}).pts]||'🟩');
  const rows=[];for(let k=0;k<Math.min(cells.length,30);k+=10)rows.push(cells.slice(k,k+10).join(''));
  if(cells.length>30)rows[rows.length-1]+=` +${cells.length-30}`;
  return rows.join('\n')||'⬜';
}
function dailyShareText(d,th,found,pts,meta){
  const dd=d.slice(8,10)+'/'+d.slice(5,7);
  return `Ti Bac Kréyol 🌴 Défi du ${dd}\nThème : ${th.title}\n${found.length} réponse${found.length>1?'s':''} · ${pts} pts\n${shareGrid(th,found)}${meta&&meta.maxCombo>=3?`\n🔥 Combo x${meta.maxCombo}`:''}\n${location.origin}${location.pathname}#defi`;
}
async function shareScore(txt,btn){
  if(navigator.share){try{await navigator.share({text:txt});return;}catch(e){if(e&&e.name==='AbortError')return;}}
  copyText(txt,btn,'Copié ! Colle-le sur WhatsApp');
}

/* =================== AMIS =================== */
function showFriends(){
  if(needAuth())return;
  $app.innerHTML=`
  <section class="panel">
    <h3>Ajouter un ami</h3>
    <p class="muted" style="font-size:14px">Ton pseudo : <b style="color:var(--gold)">${esc(myPseudo())}</b>. Donne-le à tes amis pour qu'ils t'ajoutent.</p>
    <div class="entry"><input type="text" id="fp" maxlength="16" placeholder="Pseudo de ton ami"><button class="btn" id="fadd" type="button">Ajouter</button></div>
    <p id="fmsg" aria-live="polite"></p>
  </section>
  <section class="panel" id="reqbox"><h3>Demandes reçues</h3><div class="plist" id="reqin"></div></section>
  <section class="panel"><h3>Mes amis</h3><div class="plist" id="flist"></div><div id="sentbox"></div></section>`;
  byId('fadd').onclick=async function(){
    const msg=byId('fmsg'),p=byId('fp').value.trim();if(!p)return;
    this.disabled=true;msg.className='muted';msg.textContent='Recherche…';
    try{const r=await addFriend(p);msg.className=r.ok?'ok':'bad';msg.textContent=r.msg;if(r.ok)byId('fp').value='';}catch(e){msg.className='bad';msg.textContent=dbMsg(e);}
    this.disabled=false;
  };
  renderFriendLists();
}
async function addFriend(p){
  if(p.length<3)return {msg:'Pseudo trop court.'};
  if(p.toLowerCase()===myPseudo().toLowerCase())return {msg:'C\'est ton propre pseudo !'};
  const other=await q(SB.from('profiles').select('id,pseudo,avatar,xp').ilike('pseudo',likeEsc(p)).maybeSingle());
  if(!other)return {msg:`Aucun joueur ne s'appelle « ${p} ».`};
  PCACHE[other.id]=withUid(other);
  const id=pairId(UID,other.id),f=FRIENDSHIPS.find(x=>x.id===id)||await q(SB.from('friendships').select('*').eq('id',id).maybeSingle());
  if(f){
    if(f.status==='accepted')return {msg:'Vous êtes déjà amis.'};
    if(f.to_id===UID){await q(SB.from('friendships').update({status:'accepted'}).eq('id',id));await loadFriends();renderFriendLists();return {ok:1,msg:'Demande acceptée : vous êtes amis !'};}
    return {msg:'Demande déjà envoyée, en attente de réponse.'};
  }
  const [a,b]=[UID,other.id].sort();
  await q(SB.from('friendships').insert({id,user_a:a,user_b:b,from_id:UID,to_id:other.id}));
  notify({kind:'friend',to:other.id});
  await loadFriends();renderFriendLists();
  return {ok:1,msg:'Demande d\'ami envoyée.'};
}
function prow(uid,{rank,acts,me,val}={}){
  const p=player(uid)||{pseudo:'…',avatar:'zonbi',xp:0};const lv=levelOf(p.xp);
  return `<div class="prow ${acts&&rank===undefined?'f':''} ${me?'me':''}">${rank!==undefined?`<span class="rk">${rank}</span>`:''}${avatar(p.avatar,40)}
    <div class="nm"><b>${esc(p.pseudo)}${me?' (toi)':''}</b><small>${esc(lv.name)} · niv. ${lv.i+1}</small></div>
    ${acts?`<div class="acts">${acts}</div>`:`<span class="xp">${val!==undefined?val:(p.xp||0)}</span>`}</div>`;
}
function renderFriendLists(){
  const inEl=byId('reqin'),fl=byId('flist');if(!fl)return;
  const pin=pendingIn();byId('reqbox').hidden=!pin.length;
  inEl.innerHTML=pin.map(f=>prow(f.from_id,{acts:`<button class="btn sm" data-acc="${esc(f.id)}" type="button">Accepter</button><button class="btn ghost sm" data-ref="${esc(f.id)}" type="button">Refuser</button>`})).join('');
  const fr=friendsList();
  fl.innerHTML=fr.length?fr.map(u=>prow(u,{acts:`<button class="btn sm" data-ch="${esc(u)}" data-mode="live" type="button">Défier en direct</button><button class="btn ghost sm" data-ch="${esc(u)}" data-mode="async" type="button">En différé</button>`})).join('')
    :'<p class="empty">Pas encore d\'amis. Ajoute-les avec leur pseudo.</p>';
  const po=pendingOut();
  byId('sentbox').innerHTML=po.length?`<p class="foot" style="text-align:left">En attente : ${po.map(f=>esc((player(f.to_id)||{pseudo:'…'}).pseudo)).join(', ')}</p>`:'';
  $app.querySelectorAll('[data-acc]').forEach(b=>b.onclick=async()=>{b.disabled=true;try{await q(SB.from('friendships').update({status:'accepted'}).eq('id',b.dataset.acc));await loadFriends();renderTabs();renderFriendLists();checkBadges();}catch(e){b.disabled=false;}});
  $app.querySelectorAll('[data-ref]').forEach(b=>b.onclick=async()=>{b.disabled=true;try{await q(SB.from('friendships').delete().eq('id',b.dataset.ref));await loadFriends();renderTabs();renderFriendLists();}catch(e){b.disabled=false;}});
  $app.querySelectorAll('[data-ch]').forEach(b=>b.onclick=async()=>{b.disabled=true;try{const c=await createMatch(b.dataset.mode,settings.dur,[b.dataset.ch],2);openMatch(c);}catch(e){b.disabled=false;toast(dbMsg(e));}});
}

/* =================== CLASSEMENT =================== */
let RANKMODE='monde';
function showRanking(){
  const lv=levelOf(MEP&&MEP.xp);
  if(!SB){needAuth();return;}
  if(SESSION&&hasProfile()&&RANKMODE==='monde'&&friendsList().length)RANKMODE='amis';
  $app.innerHTML=`
  <section class="panel">
    <div class="row" style="justify-content:space-between"><h2>Classement</h2>
    <div class="seg" role="group" aria-label="Classement"><button type="button" data-rm="amis" aria-pressed="${RANKMODE==='amis'}">Mes amis</button><button type="button" data-rm="semaine" aria-pressed="${RANKMODE==='semaine'}">Semaine</button><button type="button" data-rm="monde" aria-pressed="${RANKMODE==='monde'}">Mondial</button></div></div>
    <p class="muted" style="font-size:13px" id="rkhint"></p>
    <div class="plist" id="rank"></div>
    <p class="foot">Points de classement : les points marqués en ligne et au défi du jour, plus ${XP_WIN} par victoire, ${XP_TIE} par match nul et ${XP_PLAY} par défaite.</p>
  </section>
  <section class="panel"><h3>Les niveaux</h3>
    <div class="ladder">${LEVELS.map(([min,n],i)=>`<div class="lad ${hasProfile()&&i===lv.i?'cur':''} ${hasProfile()&&i<=lv.i?'got':''}"><b>${i+1}. ${esc(n)}</b><span>dès ${min} pts</span></div>`).join('')}</div>
  </section>`;
  $app.querySelectorAll('[data-rm]').forEach(b=>b.onclick=()=>{RANKMODE=b.dataset.rm;$app.querySelectorAll('[data-rm]').forEach(x=>x.setAttribute('aria-pressed',x===b));renderRank();});
  renderRank();
}
function renderRank(){
  const el=byId('rank');if(!el)return;
  const hint=byId('rkhint');if(hint)hint.textContent=RANKMODE==='semaine'?`Points marqués depuis lundi ${new Date(weekKey()+'T12:00:00').toLocaleDateString('fr-FR',{day:'numeric',month:'long'})}. Remise à zéro chaque lundi à minuit, heure des Antilles.`:RANKMODE==='amis'?'Tous tes points depuis ton inscription, comparés à ceux de tes amis.':'Tous les joueurs, tous les points depuis l\'inscription.';
  if(RANKMODE==='semaine'){
    const list=TOPW.filter(p=>p.pseudo&&weekPts(p)>0).sort((a,b)=>weekPts(b)-weekPts(a));const myIdx=list.findIndex(p=>p.uid===UID);
    el.innerHTML=list.slice(0,100).map((p,i)=>prow(p.uid,{rank:i+1,me:p.uid===UID,val:weekPts(p)})).join('')
      +(hasProfile()&&(myIdx===-1||myIdx>=100)?`<p class="foot">…</p>${prow(UID,{rank:myIdx===-1?'—':myIdx+1,me:true,val:weekPts(MEP)})}`:'')
      +(list.length?'':'<p class="empty">Personne n\'a encore marqué de points cette semaine. À toi de prendre la tête !</p>');
    return;
  }
  if(RANKMODE==='amis'){
    if(!SESSION||!hasProfile()){el.innerHTML='<p class="empty">Connecte-toi et crée ton profil pour te comparer à tes amis.</p>';return;}
    const ids=[UID,...friendsList()];
    const list=ids.map(u=>({u,p:player(u)})).sort((a,b)=>((b.p&&b.p.xp)||0)-((a.p&&a.p.xp)||0));
    el.innerHTML=list.map((x,i)=>prow(x.u,{rank:i+1,me:x.u===UID})).join('')+(ids.length<2?'<p class="empty">Ajoute des amis pour vous comparer.</p>':'');
  }else{
    const list=TOP.filter(p=>p.pseudo);const myIdx=list.findIndex(p=>p.uid===UID);
    el.innerHTML=list.slice(0,100).map((p,i)=>prow(p.uid,{rank:i+1,me:p.uid===UID})).join('')
      +(hasProfile()&&(myIdx===-1||myIdx>=100)?`<p class="foot">…</p>${prow(UID,{rank:myIdx===-1?'—':myIdx+1,me:true})}`:'')
      +(list.length?'':'<p class="empty">Le classement est vide pour l\'instant. Joue une partie en ligne pour y entrer.</p>');
  }
}

/* =================== EN LIGNE =================== */
const MAXP=5;
function openInvites(){return INVITES.filter(m=>!m.started&&(m.players||[]).length<(m.max_players||2)&&!(m.players||[]).includes(UID)&&!(m.declined||[]).includes(UID));}
async function loadInvites(){if(!UID){INVITES=[];return;}try{INVITES=await q(SB.from('matches').select('*').contains('invites',[UID]).eq('started',false).order('created_at',{ascending:false}).limit(20));}catch(e){}}

function showOnline(){
  if(needAuth())return;
  const fr=friendsList();
  $app.innerHTML=`
  <section class="panel" id="invbox"><h3>Invitations reçues</h3><div class="plist" id="invs"></div></section>
  <section class="panel" id="rndbox">
    <h3>Adversaire au hasard</h3>
    <p class="muted" style="font-size:14px">Affronte un joueur de ton niveau (<b>${esc(levelOf(MEP&&MEP.xp).name)}</b>), n'importe où dans le monde. Partie en différé : ${ROUNDS} manches de ${settings.dur} s sur les thèmes de tous les territoires.</p>
    <button class="btn wide" id="rnd" type="button">🎲 Trouver un adversaire de mon niveau</button>
    <p class="foot" id="rndinfo" style="text-align:left"></p>
    <p class="bad" id="rerr" aria-live="polite"></p>
  </section>
  <section class="panel">
    <h3>Créer une partie</h3>
    <div class="seg" role="group" aria-label="Mode"><button type="button" data-m="live" aria-pressed="true">En direct</button><button type="button" data-m="async" aria-pressed="false">En différé</button></div>
    <p class="muted" id="mdesc" style="font-size:14px"></p>
    <h3>Nombre de joueurs</h3>
    <div class="seg" role="group" aria-label="Nombre de joueurs">${[2,3,4,5].map(n=>`<button type="button" data-np="${n}" aria-pressed="${n===2}">${n}</button>`).join('')}</div>
    <h3>Durée d'une manche</h3>
    <div class="seg" role="group" aria-label="Durée">${[45,60,90].map(d=>`<button type="button" data-od="${d}" aria-pressed="${settings.dur===d}">${d} s</button>`).join('')}</div>
    <h3>Territoires</h3>
    ${terrChips()}
    ${fr.length?`<h3>Inviter des amis <span class="muted" id="invcount" style="text-transform:none;letter-spacing:0"></span></h3>
    <div class="terrs">${fr.map(u=>{const p=player(u)||{pseudo:'…'};return `<button type="button" class="terr" data-fi="${esc(u)}" aria-pressed="false">${esc(p.pseudo)}</button>`;}).join('')}</div>`:''}
    <p class="foot" style="text-align:left">Tu pourras aussi partager un code ou un lien pour compléter les places libres.</p>
    <button class="btn wide" id="create" type="button">Créer la partie</button>
    <p class="bad" id="cerr" aria-live="polite"></p>
  </section>
  <section class="panel">
    <h3>Rejoindre avec un code</h3>
    <div class="entry"><input type="text" class="code" id="jc" maxlength="5" placeholder="CODE" autocapitalize="characters"><button class="btn" id="join" type="button">Rejoindre</button></div>
    <p class="bad" id="jerr" aria-live="polite"></p>
  </section>
  <section class="panel"><h3>Mes parties</h3><div class="mlist" id="mlist"></div><p class="foot" id="mhint" style="text-align:left" hidden>Appui long sur une partie pour la supprimer.</p></section>`;
  let mode='live',dur=settings.dur,np=2;const picked=new Set();
  const desc={live:'Vous jouez les manches ensemble : la partie démarre quand le créateur la lance, puis chaque manche s\'ouvre quand tout le monde a fini la précédente.',async:'Chacun joue ses 5 manches quand il veut. Le classement final s\'affiche quand tout le monde a terminé.'};
  const md=byId('mdesc');md.textContent=desc[mode];
  const paintInv=()=>{const c=byId('invcount');if(c)c.textContent=`· ${picked.size} / ${np-1}`;$app.querySelectorAll('[data-fi]').forEach(x=>x.setAttribute('aria-pressed',picked.has(x.dataset.fi)));};
  $app.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{mode=b.dataset.m;$app.querySelectorAll('[data-m]').forEach(x=>x.setAttribute('aria-pressed',x===b));md.textContent=desc[mode];});
  $app.querySelectorAll('[data-np]').forEach(b=>b.onclick=()=>{np=+b.dataset.np;$app.querySelectorAll('[data-np]').forEach(x=>x.setAttribute('aria-pressed',x===b));while(picked.size>np-1)picked.delete([...picked].pop());paintInv();});
  $app.querySelectorAll('[data-od]').forEach(b=>b.onclick=()=>{dur=+b.dataset.od;$app.querySelectorAll('[data-od]').forEach(x=>x.setAttribute('aria-pressed',x===b));});
  $app.querySelectorAll('[data-fi]').forEach(b=>b.onclick=()=>{const u=b.dataset.fi;if(picked.has(u))picked.delete(u);else{if(picked.size>=np-1){toast(`Partie à ${np} joueurs : ${np-1} invité${np>2?'s':''} maximum. Augmente le nombre de joueurs.`);return;}picked.add(u);}paintInv();});
  paintInv();bindTerr();
  byId('rnd').onclick=async function(){this.disabled=true;byId('rerr').textContent='';
    try{const code=await findRandom();if(code)openMatch(code);else this.disabled=false;}catch(e){byId('rerr').textContent=dbMsg(e);this.disabled=false;}};
  SB.rpc('random_waiting').then(({data})=>{const el=byId('rndinfo');if(el&&typeof data==='number')el.textContent=data?`${data} joueur${data>1?'s attendent':' attend'} un adversaire en ce moment.`:'Personne n\'attend pour l\'instant : ta partie sera proposée au prochain joueur de ton niveau.';},()=>{});
  byId('create').onclick=async function(){this.disabled=true;try{const code=await createMatch(mode,dur,[...picked],np);openMatch(code);}catch(e){byId('cerr').textContent=dbMsg(e);this.disabled=false;}};
  byId('join').onclick=async function(){const code=byId('jc').value.trim().toUpperCase(),err=byId('jerr');
    if(code.length!==5){err.textContent='Le code fait 5 caractères.';return;}
    this.disabled=true;try{const r=await joinMatch(code);if(r)err.textContent=r;else openMatch(code);}catch(e){err.textContent=dbMsg(e);}this.disabled=false;};
  renderMatchList();
}
/* Adversaire au hasard : rejoint une partie en attente d'un joueur de niveau proche, sinon en crée une */
async function findRandom(){
  const all=TERRS.map(x=>x[0]);
  const r=await q(SB.rpc('find_random_match',{p_pseudo:myPseudo(),p_avatar:myAvatar(),p_themes:pickThemes(all),p_dur:settings.dur,p_terr:all}));
  if(!r||r.error){byId('rerr').textContent=(r&&r.error)||'Réessaie dans un instant.';return null;}
  if(r.joined){notify({kind:'joined',code:r.code});toast(`Adversaire trouvé : ${r.opponent} (${levelOf(r.xp).name}) !`);}
  else toast('Personne de ton niveau n\'attend pour l\'instant. Joue tes manches : le prochain joueur de ton niveau rejoindra ta partie.');
  await loadMatches();renderTabs();return r.code;
}
async function createMatch(mode,dur,invites,maxp){
  invites=(invites||[]).filter(u=>u&&u!==UID);
  maxp=Math.max(2,Math.min(MAXP,maxp||invites.length+1,MAXP));if(invites.length>maxp-1)invites=invites.slice(0,maxp-1);
  for(let k=0;k<5;k++){
    const code=genCode();
    const {error}=await SB.from('matches').insert({code,host:UID,mode,dur,terr:settings.terr,themes:pickThemes(settings.terr),players:[UID],max_players:maxp,invites,
      invite:invites.length===1?invites[0]:null,pseudos:{[UID]:myPseudo()},avatars:{[UID]:myAvatar()}});
    if(!error){if(invites.length)notify({kind:'invite',code});await loadMatches();return code;}
    if(error.code!=='23505')throw error;
  }
  throw new Error('code');
}
function rankList(list){
  const s=list.slice().sort((a,b)=>b.score-a.score||b.count-a.count);
  s.forEach((x,i)=>{x.rank=(i>0&&x.score===s[i-1].score&&x.count===s[i-1].count)?s[i-1].rank:i+1;});
  return s;
}
function myResult(ranked){
  const me=ranked.find(x=>x.id===UID);if(!me)return null;
  const top=ranked.filter(x=>x.rank===1).length;
  return me.rank===1?(top>1?'tie':'win'):'loss';
}
function matchStatus(m){
  const ps=m.players||[],me=progOf(m,UID),maxp=m.max_players||2,others=ps.filter(x=>x!==UID);
  const done=m.started&&ps.length>=1&&ps.every(u=>progOf(m,u).r>=ROUNDS);
  if(done){const r=rankList(ps.map(u=>({id:u,score:progOf(m,u).score,count:progOf(m,u).count||0})));const mine=r.find(x=>x.id===UID);const top=r.filter(x=>x.rank===1).length;
    return {k:'done',txt:mine.rank===1?(top>1?'Égalité en tête':'Gagnée'):`${mine.rank}${mine.rank===1?'re':'e'} place`};}
  if(!m.started&&m.mode==='live')return {k:'wait',txt:`Salle d'attente · ${ps.length}/${maxp}`};
  if(m.random&&!m.started&&me.r>=ROUNDS)return {k:'wait',txt:'Recherche d\'un adversaire'};
  if(me.r>=ROUNDS)return {k:'wait',txt:m.started?'Les autres jouent encore':'Inscriptions ouvertes'};
  if(m.mode==='live'&&others.some(u=>progOf(m,u).r<me.r))return {k:'wait',txt:'Les autres terminent la manche'};
  return {k:'turn',txt:'À toi de jouer'};
}
function renderMatchList(){
  const el=byId('mlist');if(!el)return;
  const inv=openInvites(),ib=byId('invbox');
  if(ib){ib.hidden=!inv.length;byId('invs').innerHTML=inv.map(m=>{const h=m.host;return `<div class="prow f">${avatar((m.avatars||{})[h],40)}<div class="nm"><b>${esc((m.pseudos||{})[h]||'Un ami')}</b><small>t'invite · ${m.mode==='live'?'en direct':'en différé'} · ${(m.players||[]).length}/${m.max_players||2} joueurs · ${m.dur} s</small></div><div class="acts"><button class="btn sm" data-ia="${esc(m.code)}" type="button">Rejoindre</button><button class="btn ghost sm" data-ir="${esc(m.code)}" type="button">Refuser</button></div></div>`;}).join('');
    $app.querySelectorAll('[data-ia]').forEach(b=>b.onclick=async()=>{b.disabled=true;try{const r=await joinMatch(b.dataset.ia);if(!r)openMatch(b.dataset.ia);else{toast(r);b.disabled=false;await loadInvites();renderMatchList();}}catch(e){b.disabled=false;}});
    $app.querySelectorAll('[data-ir]').forEach(b=>b.onclick=async()=>{b.disabled=true;try{await q(SB.rpc('decline_invite',{p_code:b.dataset.ir}));await loadInvites();renderTabs();renderMatchList();}catch(e){b.disabled=false;}});}
  if(!MYMATCHES.length){el.innerHTML='<p class="empty">Aucune partie pour l\'instant. Crée-en une, défie tes amis ou rejoins une partie avec son code.</p>';return;}
  el.innerHTML=MYMATCHES.map(m=>{const others=(m.players||[]).filter(x=>x!==UID),st=matchStatus(m),a=progOf(m,UID);
    const names=others.length?others.map(u=>(m.pseudos||{})[u]||'Joueur').join(', '):m.random?'un adversaire au hasard (recherche en cours)':'personne pour l\'instant';
    const best=others.length?Math.max(...others.map(u=>progOf(m,u).score)):null;
    return `<button class="mitem" type="button" data-code="${esc(m.code)}"><span class="t1">avec ${esc(names)}<span class="badge b-${st.k}">${st.txt}</span></span>
    <span class="sc2">${a.score}${best!==null?`<small class="muted" style="display:block;font-size:11px">meilleur adv. ${best}</small>`:''}</span>
    <span class="t2">${m.random?'🎲 Au hasard · ':''}${m.mode==='live'?'En direct':'En différé'} · ${(m.players||[]).length}/${m.max_players||2} joueurs${m.terr&&m.terr.length?' · '+esc(m.terr.map(x=>TERR_NAME[x]).join(', ')):''} · code ${esc(m.code)} · manche ${Math.min(a.r+1,ROUNDS)}/${ROUNDS}</span></button>`;}).join('');
  el.querySelectorAll('[data-code]').forEach(b=>bindLongPress(b,()=>matchSheet(MYMATCHES.find(m=>m.code===b.dataset.code)),()=>openMatch(b.dataset.code)));
  const h=byId('mhint');if(h)h.hidden=false;
}
/* ---------- Supprimer une partie (appui long) ---------- */
function bindLongPress(el,onLong,onTap){
  let t=null,sx=0,sy=0,fired=false;
  const clear=()=>{clearTimeout(t);t=null;el.classList.remove('pressing');};
  const long=()=>{fired=true;clear();try{navigator.vibrate&&navigator.vibrate(25);}catch(e){}onLong();};
  el.addEventListener('pointerdown',e=>{if(e.button>0)return;fired=false;sx=e.clientX;sy=e.clientY;el.classList.add('pressing');t=setTimeout(long,550);});
  el.addEventListener('pointermove',e=>{if(t&&(Math.abs(e.clientX-sx)>10||Math.abs(e.clientY-sy)>10))clear();});
  ['pointerup','pointerleave','pointercancel'].forEach(ev=>el.addEventListener(ev,clear));
  el.addEventListener('contextmenu',e=>{e.preventDefault();if(!fired)long();});
  el.addEventListener('click',e=>{if(fired){e.preventDefault();fired=false;return;}onTap();});
  el.addEventListener('keydown',e=>{if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();onLong();}});
}
function leaveKind(m){
  const ps=m.players||[];
  if(ps.length<=1)return 'delete';
  if(m.started&&ps.every(u=>progOf(m,u).r>=ROUNDS))return 'hide';
  return 'abandon';
}
function matchSheet(m){
  if(!m)return;
  const k=leaveKind(m),others=(m.players||[]).filter(x=>x!==UID).map(u=>(m.pseudos||{})[u]||'Joueur');
  const T={
    delete:['Supprimer la partie',`La partie ${m.code} et tes manches seront supprimées définitivement.${(m.invites||[]).length?' Les invitations envoyées seront annulées.':''}`,'Supprimer'],
    hide:['Retirer de ma liste','La partie disparaît de ta liste. Tes points, tes victoires et ton classement sont conservés.','Retirer'],
    abandon:['Abandonner la partie',`La partie est en cours avec ${others.join(', ')}. Tes manches seront retirées et les autres joueurs continueront sans toi. Tu ne recevras pas de bonus de fin de partie.`,'Abandonner']
  }[k];
  const bg=document.createElement('div');bg.className='sheet-bg';
  bg.innerHTML=`<section class="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-t"><h2 id="sheet-t">${esc(T[0])}</h2><p class="muted">${esc(T[1])}</p>
    <div class="row"><button class="btn red grow" id="sheet-ok" type="button">${esc(T[2])}</button><button class="btn ghost grow" id="sheet-no" type="button">Annuler</button></div><p class="bad" id="sheet-err" aria-live="polite"></p></section>`;
  document.body.appendChild(bg);
  const close=()=>{bg.remove();document.removeEventListener('keydown',esc_);};
  const esc_=e=>{if(e.key==='Escape')close();};
  document.addEventListener('keydown',esc_);
  bg.addEventListener('click',e=>{if(e.target===bg)close();});
  byId('sheet-no').onclick=close;byId('sheet-no').focus();
  byId('sheet-ok').onclick=async function(){
    this.disabled=true;
    try{const r=await q(SB.rpc('leave_match',{p_code:m.code}));if(r){byId('sheet-err').textContent=r;this.disabled=false;return;}
      close();MYMATCHES=MYMATCHES.filter(x=>x.code!==m.code);renderMatchList();
      toast(k==='abandon'?'Tu as quitté la partie.':k==='hide'?'Partie retirée de ta liste.':'Partie supprimée.');
      await loadMatches();await loadInvites();renderTabs();renderMatchList();}
    catch(e){byId('sheet-err').textContent=dbMsg(e);this.disabled=false;}
  };
}
function shareText(code){return `Viens jouer avec moi à Ti Bac Kréyol ! Code de la partie : ${code} — ${shareLink(code)}`;}
function renderMatch(code,M,P){
  if(!M){$app.innerHTML=`<section class="panel"><h2>Partie introuvable</h2><p class="muted">Le code ${esc(code)} ne correspond à aucune partie.</p><button class="btn ghost" id="back" type="button">Retour</button></section>`;byId('back').onclick=()=>go('enligne');return;}
  const maxp=M.max_players||2,isHost=M.host===UID;
  const players=M.players.map(u=>{const p=P[u]||{rounds:{}};return {id:u,name:(M.pseudos||{})[u]||'Joueur',av:(M.avatars||{})[u]||'zonbi',r:Object.keys(p.rounds||{}).length,score:sumPts(p),count:countFound(p),p};});
  const me=players.find(x=>x.id===UID)||{r:0,score:0,count:0,p:{rounds:{}}},others=players.filter(x=>x.id!==UID);
  const myR=me.r,mine=me.p;
  const finished=M.started&&players.length>=1&&players.every(x=>x.r>=ROUNDS);
  const ranked=rankList(players);
  const hostName=(M.pseudos||{})[M.host]||'le créateur';
  let action='';
  if(finished){
    const res=myResult(ranked);const winners=ranked.filter(x=>x.rank===1);
    awardMatch(code,res);
    if(!CELEBRATED[code]){CELEBRATED[code]=1;if(res!=='loss'){setTimeout(()=>{SFX.win();confetti();},200);}else SFX.lose();}
    const myRank=ranked.find(x=>x.id===UID).rank;
    action=`<section class="panel center pass"><h3>Partie terminée</h3><p class="big">${res==='win'?'Tu gagnes !':res==='tie'?'Égalité en tête !':esc(winners.map(w=>w.name).join(' et '))+(winners.length>1?' gagnent':' gagne')}</p>
      <p class="muted">${res==='loss'?`Tu termines ${myRank}${myRank===1?'re':'e'} sur ${players.length}. `:''}+${res==='win'?XP_WIN:res==='tie'?XP_TIE:XP_PLAY} pts de bonus au classement</p><button class="btn" id="rematch" type="button">Revanche</button></section>`;
  }else if(!M.started&&M.mode==='live'){
    action=`<section class="panel center"><h3>Salle d'attente · ${players.length}/${maxp} joueurs</h3>
      ${isHost?`<p class="muted">Lance la partie quand tout le monde est là${players.length<maxp?' : les places restantes seront fermées':''}.</p><button class="btn wide" id="startm" type="button" ${players.length<2?'disabled':''}>Lancer la partie${players.length<2?' (2 joueurs minimum)':` à ${players.length}`}</button>`
      :`<p class="muted">En attente que ${esc(hostName)} lance la partie.</p>`}</section>`;
  }else if(myR>=ROUNDS){
    const left=others.filter(x=>x.r<ROUNDS);
    action=`<section class="panel center"><h3>Tu as fini tes ${ROUNDS} manches</h3><p class="muted">${M.random&&!M.started?'On cherche un adversaire de ton niveau : il jouera les mêmes thèmes.':!M.started?`Les inscriptions sont encore ouvertes (${players.length}/${maxp}).`:`En attente de ${esc(left.map(x=>x.name).join(', '))}.`} Le classement final s'affichera ici automatiquement.</p></section>`;
  }else{
    const late=M.mode==='live'?others.filter(x=>x.r<myR):[];
    action=`<section class="panel center">${late.length?`<h3>Manche ${myR+1}</h3><p class="muted">${esc(late.map(x=>x.name).join(', '))} ${late.length>1?'terminent':'termine'} la manche ${myR}. La suivante s'ouvre dès que tout le monde a fini.</p>`
      :`<h3>Manche ${myR+1} sur ${ROUNDS}</h3><button class="btn wide" id="playnext" type="button">Jouer la manche ${myR+1}</button><p class="foot">Une manche commencée compte, même si tu quittes la page.</p>`}</section>`;
  }
  const randomPanel=(M.random&&!M.started)?`<section class="panel"><h3>🎲 Recherche d'un adversaire</h3><p class="muted" style="font-size:14px">Le prochain joueur de ton niveau (${esc(levelOf(MEP&&MEP.xp).name)}) qui cherche un adversaire rejoindra cette partie et jouera les mêmes thèmes. Tu peux jouer tes manches sans attendre${MYSUB?' : tu recevras une notification quand il arrive':''}.</p></section>`:'';
  const closeAsync=(!M.started&&M.mode==='async'&&isHost&&!M.random)?`<section class="panel"><h3>Inscriptions ouvertes · ${players.length}/${maxp}</h3><p class="muted" style="font-size:14px">Le classement final est calculé quand les inscriptions sont fermées et que chacun a joué ses ${ROUNDS} manches.</p><button class="btn ghost" id="startm" type="button" ${players.length<2?'disabled':''}>Fermer les inscriptions${players.length<2?' (2 joueurs minimum)':''}</button></section>`:'';
  const invitePanel=(!M.started&&players.length<maxp&&!M.random)?`<section class="panel"><h3>Invite des joueurs · ${maxp-players.length} place${maxp-players.length>1?'s':''} libre${maxp-players.length>1?'s':''}</h3><div class="codebox"><b>${esc(code)}</b><button class="btn sm" id="copycode" type="button">Copier le code</button></div>
    <div class="row"><button class="btn ghost grow" id="sharelink" type="button">Partager le lien d'invitation</button><button class="btn ghost grow" id="copymsg" type="button">Copier le message</button></div>
    <p class="muted" style="font-size:14px">Les joueurs ouvrent le lien, ou saisissent le code dans « En ligne ».${M.mode==='async'?' Tu peux commencer à jouer sans attendre.':''}</p></section>`:'';
  const cols=[me,...others];
  $app.innerHTML=`
  <div class="row" style="justify-content:space-between"><button class="btn ghost sm" id="back" type="button">← Mes parties</button><span class="muted" style="font-size:14px">${M.random?'🎲 Au hasard · ':''}${M.mode==='live'?'En direct':'En différé'} · ${players.length}/${maxp} joueurs · ${M.dur} s</span></div>
  ${invitePanel}${randomPanel}
  <div class="scoreline">${ranked.map(x=>`<div class="sc ${finished&&x.rank===1?'win':''} ${x.id===UID?'meb':''}"><div class="vs">${avatar(x.av,40)}<span class="n">${finished?`<b class="rkb">${x.rank}</b> `:''}${esc(x.name)}${x.id===UID?' (toi)':''}</span></div><span class="v">${x.score}</span><span class="d">${x.r}/${ROUNDS} manches</span></div>`).join('')}</div>
  ${action}
  ${closeAsync}
  <section class="panel"><h3>Manches</h3>
  <div class="scroll"><table class="tbl"><thead><tr><th>Thème</th>${cols.map(c=>`<th class="num">${c.id===UID?'Toi':esc(c.name.slice(0,7))}</th>`).join('')}<th></th></tr></thead><tbody>
  ${M.themes.map((ti,r)=>{const iPlayed=r<myR;
    return `<tr><td>${iPlayed?esc(THEMES[ti].t):`<span class="dash">Manche ${r+1} · thème caché</span>`}</td>
    ${cols.map(c=>{const played=r<c.r;return `<td class="num">${c.id===UID?(played?((mine.rounds[r]||{}).pts||0):'–'):(played?(iPlayed?((c.p.rounds[r]||{}).pts||0):'✓'):'–')}</td>`;}).join('')}
    <td>${iPlayed?`<button class="btn ghost sm" data-det="${r}" type="button">Réponses</button>`:''}</td></tr>`;}).join('')}
  </tbody></table></div>
  <p class="foot">Les réponses des autres joueurs s'affichent pour une manche une fois que tu l'as jouée.</p></section>
  <div id="detail"></div>`;
  byId('back').onclick=()=>go('enligne');
  const c1=byId('copycode');if(c1)c1.onclick=()=>copyText(code,c1);
  const c2=byId('sharelink');if(c2)c2.onclick=async()=>{
    if(navigator.share){try{await navigator.share({title:'Ti Bac Kréyol',text:`Viens jouer avec moi à Ti Bac Kréyol ! Code : ${code}`,url:shareLink(code)});return;}catch(e){if(e&&e.name==='AbortError')return;}}
    copyText(shareLink(code),c2,'Lien copié !');};
  const c3=byId('copymsg');if(c3)c3.onclick=()=>copyText(shareText(code),c3,'Message copié !');
  const sm=byId('startm');if(sm)sm.onclick=async()=>{sm.disabled=true;try{const r=await q(SB.rpc('start_match',{p_code:code}));if(r){toast(r);sm.disabled=false;}else{await fetchCurrent(code);renderMatch(code,CUR_M,CUR_P);}}catch(e){sm.disabled=false;toast(dbMsg(e));}};
  const pn=byId('playnext');if(pn)pn.onclick=()=>playOnline(code,M,mine,myR);
  const rm=byId('rematch');if(rm)rm.onclick=async()=>{rm.disabled=true;try{if(M.terr&&M.terr.length)settings.terr=M.terr;const c=await createMatch(M.mode,M.dur,others.map(x=>x.id),maxp);openMatch(c);}catch(e){rm.disabled=false;}};
  $app.querySelectorAll('[data-det]').forEach(b=>b.onclick=()=>{const r=+b.dataset.det,th=prep(M.themes[r]);
    const dcols=[{name:'Toi',found:(mine.rounds[r]||{}).found||[]},...others.filter(o=>r<o.r).map(o=>({name:o.name,found:(o.p.rounds[r]||{}).found||[]}))];
    const d=byId('detail');d.innerHTML=`<section class="panel"><h3>Manche ${r+1}</h3><h2>${esc(th.title)}</h2>${answersTable(th,dcols)}</section>`;d.scrollIntoView({behavior:'smooth'});});
}
function genCode(){const A='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';let s='';for(let i=0;i<5;i++)s+=A[Math.floor(Math.random()*A.length)];return s;}
async function joinMatch(code){
  const msg=await q(SB.rpc('join_match',{p_code:code,p_pseudo:myPseudo(),p_avatar:myAvatar()}));
  if(!msg){await loadMatches();await loadInvites();renderTabs();}
  return msg||null;
}
let CUR_M=null,CUR_P={};
async function fetchCurrent(code){
  const m=await q(SB.from('matches').select('*').eq('code',code).maybeSingle());
  const plays=m?await q(SB.from('plays').select('*').eq('code',code)):[];
  CUR_M=m;CUR_P={};plays.forEach(p=>{CUR_P[p.user_id]=p;});
}
function reloadCurrent(){const code=CURRENT;later('cur',async()=>{if(CURRENT!==code||PLAYING)return;try{await fetchCurrent(code);}catch(e){}if(CURRENT===code&&!PLAYING)renderMatch(code,CUR_M,CUR_P);});}
async function openMatch(code){
  cleanup();SUMMARY=false;tab='enligne';renderTabs();CURRENT=code;window.scrollTo(0,0);
  $app.innerHTML=`<section class="panel center pass"><p class="muted">Chargement de la partie ${esc(code)}…</p></section>`;
  try{await fetchCurrent(code);}catch(e){$app.innerHTML=`<section class="panel"><p class="bad">${esc(dbMsg(e))}</p></section>`;return;}
  if(CURRENT===code)renderMatch(code,CUR_M,CUR_P);
}
function sumPts(p){return p?Object.values(p.rounds||{}).reduce((s,r)=>s+(r.pts||0),0):0;}
function countFound(p){return p?Object.values(p.rounds||{}).reduce((s,r)=>s+((r.found||[]).length),0):0;}
function shareLink(code){return `${location.origin}${location.pathname}#${code}`;}
async function awardMatch(code,res){
  if(!MEP||AWARDING[code]||(MEP.counted||[]).includes(code))return;
  AWARDING[code]=1;
  const bonus=res==='win'?XP_WIN:res==='tie'?XP_TIE:XP_PLAY;
  const upd={xp:(MEP.xp||0)+bonus,...weekUpd(bonus),games:(MEP.games||0)+1,wins:(MEP.wins||0)+(res==='win'?1:0),counted:[...(MEP.counted||[]),code].slice(-200)};
  try{await q(SB.from('profiles').update(upd).eq('id',UID));MEP={...MEP,...upd};checkBadges();}catch(e){AWARDING[code]=0;}
}
async function savePlay(code,rounds,jokers){
  const vals=Object.values(rounds);
  await q(SB.from('plays').upsert({code,user_id:UID,rounds,jokers,r:vals.length,score:vals.reduce((s,x)=>s+(x.pts||0),0),found_count:vals.reduce((s,x)=>s+((x.found||[]).length),0),updated_at:new Date().toISOString()}));
}
async function playOnline(code,M,mine,r){
  cleanup();
  const rounds={...(mine.rounds||{})};const jokers={...(mine.jokers||{time:1,hint:2})};
  rounds[r]={found:[],pts:0,done:false};
  try{await savePlay(code,rounds,jokers);}catch(e){$app.innerHTML=`<section class="panel"><p class="bad">${esc(dbMsg(e))}</p></section>`;return;}
  const th=prep(M.themes[r]),base=sumPts({rounds:mine.rounds});
  playRound({who:myPseudo(),label:`Manche ${r+1}/${ROUNDS} · en ligne`,th,dur:M.dur,last:r===ROUNDS-1,jokers,score:base,
    onFinish:async(found,pts,rej,meta)=>{
      rounds[r]={found,pts,done:true};
      $app.innerHTML=`<section class="panel center pass"><h3>Manche ${r+1} terminée</h3><p class="big">+${pts}</p><p class="muted">Enregistrement…</p></section>`;
      let saved=true;
      try{await savePlay(code,rounds,jokers);await recordRound(M.themes[r],found,pts);}catch(e){saved=false;}
      if(!saved)toast('Enregistrement impossible : vérifie ta connexion. Ta manche sera comptée à 0 si elle n\'est pas sauvegardée.');
      afterRound({title:`Manche ${r+1} terminée`,t:M.themes[r],found,pts,rej,meta,btn:'Retour à la partie',next:()=>openMatch(code)});
    }});
}

/* =================== SIGNALEMENTS =================== */
function reportBlock(t,rej){
  const uniq=[];const seen=new Set();(rej||[]).forEach(v=>{const k=norm(v,prep(t).extra);if(k&&!seen.has(k)){seen.add(k);uniq.push(v);}});
  if(!uniq.length)return '';
  const can=SB&&SESSION&&hasProfile();
  return `<section class="panel"><h3>Réponses refusées</h3>
  <p class="muted" style="font-size:14px">${can?'Tu penses qu\'une de ces réponses est correcte ? Signale-la : elle sera vérifiée et peut-être ajoutée au jeu.':'Connecte-toi (onglet Connexion) pour pouvoir signaler une réponse.'}</p>
  <div class="replist">${uniq.map(v=>{const done=MYREPORTS.some(r=>r.theme===t&&norm(r.answer,prep(t).extra)===norm(v,prep(t).extra));
    return `<div class="rep"><span>${esc(v)}</span>${can?`<button class="btn ghost sm" type="button" data-rep="${esc(v)}" data-rt="${t}" ${done?'disabled':''}>${done?'Signalée':'Signaler'}</button>`:''}</div>`;}).join('')}</div></section>`;
}
function bindReports(){
  $app.querySelectorAll('[data-rep]').forEach(b=>b.onclick=async()=>{
    b.disabled=true;b.textContent='Envoi…';
    try{const a=String(b.dataset.rep).slice(0,40),t=+b.dataset.rt;await q(SB.from('reports').insert({user_id:UID,theme:t,answer:a}));MYREPORTS.push({theme:t,answer:a,status:'new'});b.textContent='Signalée';}
    catch(e){b.textContent='Échec, réessaie';b.disabled=false;}
  });
}
function pendingReports(){
  const groups={};
  ALLREPORTS.forEach(it=>{
    if(it.status!=='new'||!THEMES[it.theme])return;
    const th=prep(it.theme),k=norm(it.answer,th.extra);
    if(th.answers.some(x=>x.keys.includes(k)))return;
    const key=it.theme+'|'+k;
    const g=(groups[key]=groups[key]||{t:it.theme,a:it.answer,key,k,ids:[],who:[]});g.ids.push(it.id);g.who.push(it.user_id);
  });
  return Object.values(groups).sort((x,y)=>y.ids.length-x.ids.length);
}

/* =================== DÉFI DU JOUR =================== */
let DAILY_LIST=[];
async function loadDailyList(){
  if(!SB)return;
  try{DAILY_LIST=await q(SB.from('dailyscores').select('*').eq('last',todayKey()).eq('done',true).order('last_pts',{ascending:false}).limit(100));}catch(e){}
}
function showDaily(){
  if(needAuth())return;
  if(!MYDAILY_LOADED){$app.innerHTML=`<section class="panel center pass"><p class="muted">Chargement du défi…</p></section>`;return;}
  const d=todayKey(),t=dailyTheme(d),pv=dailyProverb(d),th=prep(t);
  const dateFr=new Date(d+'T12:00:00').toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'});
  $app.innerHTML=`
  <section class="panel">
    <h3>Défi du ${esc(dateFr)}</h3>
    <div class="theme-card"><h3 style="color:var(--gold)">Thème du jour</h3><h2>${esc(th.title)}</h2><p class="count">${th.answers.length} réponses · 60 secondes · 1 indice · une seule tentative</p></div>
    <div id="dstate"></div>
  </section>
  <section class="panel proverb"><h3>Pwovèb jodi a</h3><p class="pv">${esc(pv[0])}</p><p class="muted">${esc(pv[1])}</p></section>
  <section class="panel"><h3>Classement du jour</h3><div class="plist" id="drank"></div>
    <p class="foot">Le défi change chaque jour à minuit, heure des Antilles. Les points du défi comptent pour ton niveau.</p></section>`;
  loadDailyList().then(renderDaily);
  renderDaily();
}
function renderDaily(){
  const st=byId('dstate');if(!st)return;
  const d=todayKey(),played=MYDAILY&&MYDAILY.last===d;
  if(!played){st.innerHTML=`<button class="btn wide" id="dplay" type="button">Relever le défi</button>`;byId('dplay').onclick=playDaily;}
  else if(!MYDAILY.done)st.innerHTML=`<p class="muted">Tu as commencé le défi d'aujourd'hui sans le terminer. Reviens demain pour un nouveau thème !</p>`;
  else{let sh=null;try{const o=JSON.parse(localStorage.getItem('tibac_share')||'null');if(o&&o.d===d)sh=o.txt;}catch(e){}
    if(!sh)sh=`Ti Bac Kréyol 🌴 Défi du ${d.slice(8,10)}/${d.slice(5,7)}\nThème : ${prep(dailyTheme(d)).title}\n${MYDAILY.last_found} réponses · ${MYDAILY.last_pts} pts\n${location.origin}${location.pathname}#defi`;
    st.innerHTML=`<div class="scoreline"><div class="sc"><span class="n">Ton score du jour</span><span class="v">${MYDAILY.last_pts}</span><span class="d">${MYDAILY.last_found} réponses · ${MYDAILY.count||1} défi${(MYDAILY.count||1)>1?'s':''} joué${(MYDAILY.count||1)>1?'s':''}</span></div></div>
    <button class="btn" id="dshare" type="button">Partager mon score</button>`;
    byId('dshare').onclick=function(){shareScore(sh,this);};}
  const el=byId('drank');if(!el)return;
  el.innerHTML=DAILY_LIST.length?DAILY_LIST.map((x,i)=>{const p=player(x.user_id)||{pseudo:'…',avatar:x.avatar,xp:0};
    return `<div class="prow ${x.user_id===UID?'me':''}"><span class="rk">${i+1}</span>${avatar(p.avatar||x.avatar,40)}<div class="nm"><b>${esc(p.pseudo||'Joueur')}${x.user_id===UID?' (toi)':''}</b><small>${x.last_found} réponses</small></div><span class="xp">${x.last_pts}</span></div>`;}).join('')
    :'<p class="empty">Personne n\'a encore joué aujourd\'hui. Sois le premier ou la première !</p>';
}
async function playDaily(){
  const d=todayKey(),t=dailyTheme(d),th=prep(t);
  const count=((MYDAILY&&MYDAILY.count)||0)+1;
  try{await q(SB.from('dailyscores').upsert({user_id:UID,avatar:myAvatar(),last:d,last_pts:0,last_found:0,count,done:false,updated_at:new Date().toISOString()}));MYDAILY={user_id:UID,last:d,last_pts:0,last_found:0,count,done:false};}
  catch(e){$app.innerHTML=`<section class="panel"><p class="bad">${esc(dbMsg(e))}</p></section>`;return;}
  playRound({who:myPseudo(),label:'Défi du jour',th,dur:60,jokers:{time:0,hint:1},score:0,
    onFinish:async(found,pts,rej,meta)=>{
      const share=dailyShareText(d,th,found,pts,meta);try{localStorage.setItem('tibac_share',JSON.stringify({d,txt:share}));}catch(e){}
      $app.innerHTML=`<section class="panel center pass"><h3>Défi terminé</h3><p class="big">+${pts}</p><p class="muted">Enregistrement…</p></section>`;
      try{await q(SB.from('dailyscores').update({last_pts:pts,last_found:found.length,done:true,updated_at:new Date().toISOString()}).eq('user_id',UID));
        MYDAILY={...MYDAILY,last_pts:pts,last_found:found.length,done:true};await recordRound(t,found,pts,{daily:count});}catch(e){toast(dbMsg(e));}
      afterRound({title:'Défi du jour terminé',t,found,pts,rej,meta,share,btn:'Voir le classement du jour',next:()=>go('defi')});
    }});
}

/* =================== ADMIN =================== */
function showAdmin(){
  if(!IS_OWNER){$app.innerHTML=`<section class="panel"><p class="muted">Cet espace est réservé à l'éditrice du jeu.</p></section>`;return;}
  $app.innerHTML=`
  <section class="panel"><h2>Espace admin</h2><p class="muted">Visible uniquement par toi. Les réponses que tu ajoutes ici sont acceptées tout de suite dans toutes les parties.</p></section>
  <section class="panel"><h3>Signalements à traiter</h3><div id="adm" class="plist"></div></section>
  <section class="panel"><h3>Ajouter une réponse</h3>
    <label class="fld">Thème<select id="at">${activeThemes(null).map(i=>`<option value="${i}">${esc(THEMES[i].t)}${THEMES[i].terr!=='AN'?' ('+esc(TERR_NAME[THEMES[i].terr])+')':''}</option>`).join('')}</select></label>
    <div class="row"><label class="fld grow">Réponse<input type="text" id="aa" maxlength="40" placeholder="Ex. : Anse Noire"></label>
    <label class="fld grow">Variantes acceptées (séparées par des virgules)<input type="text" id="av" maxlength="120" placeholder="Ex. : anse nwè"></label></div>
    <div class="row"><div class="seg" role="group" aria-label="Points"><button type="button" data-ap="1" aria-pressed="true">1 pt</button><button type="button" data-ap="2" aria-pressed="false">2 pts</button><button type="button" data-ap="3" aria-pressed="false">3 pts</button></div>
    <button class="btn" id="aadd" type="button">Ajouter</button><span id="amsg" aria-live="polite"></span></div>
  </section>
  <section class="panel"><h3>Réponses ajoutées</h3><div id="aextras"></div></section>
  <section class="panel"><h3>Statistiques des réponses</h3>
    <p class="muted" style="font-size:14px">Pour chaque thème : combien de fois chaque réponse est trouvée. Les points suggérés se basent sur ce taux (40 % ou plus : 1 pt ; 10 à 39 % : 2 pts ; moins de 10 % : 3 pts), à partir de ${STAT_MIN} manches jouées.</p>
    <label class="fld">Thème<select id="sth"><option value="">Chargement…</option></select></label>
    <div id="sbox"></div><p class="foot" id="purge"></p></section>`;
  loadStats();
  let pts=1;
  $app.querySelectorAll('[data-ap]').forEach(b=>b.onclick=()=>{pts=+b.dataset.ap;$app.querySelectorAll('[data-ap]').forEach(x=>x.setAttribute('aria-pressed',x===b));});
  byId('aadd').onclick=async()=>{
    const t=+byId('at').value,a=byId('aa').value.trim(),msg=byId('amsg');
    const alias=byId('av').value.split(',').map(x=>x.trim()).filter(Boolean);
    const r=await addExtra(t,a,pts,alias);msg.className=r.ok?'ok':'bad';msg.textContent=r.msg;if(r.ok){byId('aa').value='';byId('av').value='';}
  };
  renderAdmin();
}
function cleanAnswer(a){return String(a).replace(/[|,*]/g,' ').replace(/\s+/g,' ').trim().slice(0,40);}
async function addExtra(t,a,pts,alias,ids){
  a=cleanAnswer(a);if(a.length<2)return {msg:'Réponse trop courte.'};
  const th=prep(t),k=norm(a,th.extra);
  if(th.answers.some(x=>x.keys.includes(k)))return {msg:'Cette réponse est déjà acceptée.'};
  try{await q(SB.from('extras').insert({theme:t,name:a,pts,alias:(alias||[]).map(cleanAnswer).filter(Boolean)}));}catch(e){return {msg:dbMsg(e)};}
  const toMark=ids||pendingReports().filter(g=>g.t===t&&g.k===k).flatMap(g=>g.ids);
  if(toMark.length){try{await q(SB.from('reports').update({status:'ok',treated_at:new Date().toISOString()}).in('id',toMark));}catch(e){}}
  await loadExtras();await loadAllReports();renderTabs();renderAdmin();
  return {ok:1,msg:`« ${a} » ajoutée (${pts} pt${pts>1?'s':''}).`};
}
function renderAdmin(){
  const el=byId('adm');if(!el)return;
  const pend=pendingReports();
  el.innerHTML=pend.length?pend.map((g,i)=>`<div class="prow f"><span class="av" style="display:grid;place-items:center;background:var(--card2);font-family:var(--mono);font-weight:700;color:var(--gold)">${g.ids.length}</span>
    <div class="nm"><b>${esc(g.a)}</b><small>${esc(THEMES[g.t].t)} · signalé par ${esc([...new Set(g.who.map(u=>(player(u)||{pseudo:'…'}).pseudo))].join(', '))}</small></div>
    <div class="acts"><button class="btn sm" data-ok="${i}" data-p="1" type="button">+1</button><button class="btn sm" data-ok="${i}" data-p="2" type="button">+2</button><button class="btn sm" data-ok="${i}" data-p="3" type="button">+3</button><button class="btn ghost sm" data-no="${i}" type="button">Rejeter</button></div></div>`).join('')
    :'<p class="empty">Aucun signalement en attente.</p>';
  el.querySelectorAll('[data-ok]').forEach(b=>b.onclick=async()=>{b.disabled=true;const g=pend[+b.dataset.ok];const r=await addExtra(g.t,g.a,+b.dataset.p,[],g.ids);toast(r.msg);});
  el.querySelectorAll('[data-no]').forEach(b=>b.onclick=async()=>{b.disabled=true;const g=pend[+b.dataset.no];try{await q(SB.from('reports').update({status:'no',treated_at:new Date().toISOString()}).in('id',g.ids));await loadAllReports();renderTabs();renderAdmin();}catch(e){b.disabled=false;}});
  const ex=byId('aextras');if(!ex)return;
  const rows=[];Object.keys(EXTRA).forEach(t=>(EXTRA[t]||[]).forEach(x=>rows.push({t:+t,x})));
  ex.innerHTML=rows.length?`<div class="scroll"><table class="tbl"><thead><tr><th>Réponse</th><th>Thème</th><th>Pts</th><th></th></tr></thead><tbody>${rows.map((r,i)=>`<tr><td>${esc(r.x.name)}${(r.x.alias||[]).length?`<br><small class="muted">${esc(r.x.alias.join(', '))}</small>`:''}</td><td>${esc((THEMES[r.t]||{t:'?'}).t)}</td><td>${ptsLabel(r.x.pts)}</td><td><button class="btn ghost sm" data-del="${i}" type="button">Retirer</button></td></tr>`).join('')}</tbody></table></div>`
    :'<p class="empty">Aucune réponse ajoutée pour l\'instant.</p>';
  ex.querySelectorAll('[data-del]').forEach(b=>b.onclick=async()=>{b.disabled=true;const r=rows[+b.dataset.del];try{await q(SB.from('extras').delete().eq('id',r.x.id));await loadExtras();renderAdmin();}catch(e){b.disabled=false;}});
}

/* Statistiques (admin) */
const STAT_MIN=10;let STATS=null;
async function loadStats(){
  try{const [ts,lg]=await Promise.all([q(SB.from('theme_stats').select('*')),q(SB.from('maintenance_log').select('at,result').order('at',{ascending:false}).limit(1))]);
    STATS={rounds:Object.fromEntries(ts.map(r=>[r.theme,r.rounds])),found:{}};
    const pg=byId('purge');if(pg&&lg[0]){const r=lg[0].result||{};pg.textContent=`Dernier nettoyage automatique : ${new Date(lg[0].at).toLocaleString('fr-FR')} · ${r.comptes||0} compte(s), ${r.parties||0} partie(s), ${r.defis||0} score(s) du jour, ${r.signalements||0} signalement(s) supprimés.`;}
  }catch(e){STATS={rounds:{},found:{}};}
  const sel=byId('sth');if(!sel)return;
  const all=THEMES.map((t,i)=>i).filter(i=>!THEMES[i].off).sort((a,b)=>(STATS.rounds[b]||0)-(STATS.rounds[a]||0));
  sel.innerHTML=all.map(i=>`<option value="${i}">${esc(THEMES[i].t)} · ${STATS.rounds[i]||0} manche${(STATS.rounds[i]||0)>1?'s':''}</option>`).join('');
  sel.onchange=renderStatsTable;renderStatsTable();
}
function suggestPts(rate){return rate>=0.4?1:rate>=0.1?2:3;}
async function renderStatsTable(){
  const box=byId('sbox'),sel=byId('sth');if(!box||!sel||!STATS)return;
  const t=+sel.value,th=prep(t),n=STATS.rounds[t]||0;
  if(!n){box.innerHTML='<p class="empty">Ce thème n\'a pas encore été joué.</p>';return;}
  if(!STATS.found[t]){box.innerHTML='<p class="muted">Chargement…</p>';
    try{const as=await q(SB.from('answer_stats').select('name,found').eq('theme',t).limit(1000));STATS.found[t]=Object.fromEntries(as.map(r=>[r.name,r.found]));}catch(e){STATS.found[t]={};}
    if(+sel.value!==t)return;}
  const f=STATS.found[t];
  const rows=th.answers.map(a=>({a,c:f[a.name]||0,rate:(f[a.name]||0)/n})).sort((x,y)=>y.rate-x.rate);
  const enough=n>=STAT_MIN,diff=enough?rows.filter(r=>suggestPts(r.rate)!==r.a.pts).length:0,never=rows.filter(r=>!r.c).length;
  box.innerHTML=`<p class="muted" style="font-size:14px">${n} manche${n>1?'s':''} jouée${n>1?'s':''} · ${never} réponse${never>1?'s':''} jamais trouvée${never>1?'s':''}${enough?` · ${diff} réponse${diff>1?'s':''} dont les points pourraient changer (surlignées)`:` · encore ${STAT_MIN-n} manche${STAT_MIN-n>1?'s':''} avant de suggérer des points`}</p>
  <div class="scroll"><table class="tbl"><thead><tr><th>Réponse</th><th class="num">Trouvée</th><th>Pts</th>${enough?'<th>Suggéré</th>':''}</tr></thead><tbody>
  ${rows.map(r=>{const sg=suggestPts(r.rate),chg=enough&&sg!==r.a.pts;return `<tr class="${r.c?'':'miss'} ${chg?'chg':''}"><td>${esc(r.a.name)}</td><td class="num">${Math.round(r.rate*100)} %<br><small class="muted">${r.c} fois</small></td><td>${ptsLabel(r.a.pts)}</td>${enough?`<td>${chg?ptsLabel(sg):'<span class="dash">=</span>'}</td>`:''}</tr>`;}).join('')}</tbody></table></div>
  <div class="row"><button class="btn ghost sm" id="scopy" type="button">Copier ce tableau</button></div>`;
  byId('scopy').onclick=function(){copyText([`${th.title} (${n} manches)`,...rows.map(r=>`${r.a.name}\t${Math.round(r.rate*100)} %\t${r.a.pts} pt(s)${enough&&suggestPts(r.rate)!==r.a.pts?`\t→ ${suggestPts(r.rate)} pt(s)`:''}`)].join('\n'),this,'Tableau copié');};
}

/* =================== NOTIFICATIONS =================== */
const VAPID_PUBLIC=CFG.VAPID_PUBLIC||'BFBJao_wWea2059-JIdFbfR3mLqWs6RxtHtEdG4PohThMNJ8PYSWphBbFyRzLHT0QEd2jJ1TKRujuXks099aHgo';
const PUSH_OK=('serviceWorker' in navigator)&&('PushManager' in window)&&('Notification' in window);
let MYSUB=null;
function b64ToBytes(b){const p='='.repeat((4-b.length%4)%4);const s=atob((b+p).replace(/-/g,'+').replace(/_/g,'/'));return Uint8Array.from([...s].map(c=>c.charCodeAt(0)));}
async function currentPush(){if(!PUSH_OK)return null;try{const reg=await navigator.serviceWorker.ready;return await reg.pushManager.getSubscription();}catch(e){return null;}}
async function loadMySub(){MYSUB=null;const sub=await currentPush();if(!sub||!UID)return;
  try{MYSUB=await q(SB.from('push_subs').select('daily,invites').eq('endpoint',sub.endpoint).maybeSingle());}catch(e){}}
async function enablePush(daily,invites){
  if(Notification.permission==='denied')throw new Error('refus');
  const perm=await Notification.requestPermission();if(perm!=='granted')throw new Error('refus');
  const reg=await navigator.serviceWorker.ready;
  let sub=await reg.pushManager.getSubscription();
  if(!sub)sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:b64ToBytes(VAPID_PUBLIC)});
  const j=sub.toJSON();
  await q(SB.rpc('save_push_sub',{p_endpoint:j.endpoint,p_p256dh:j.keys.p256dh,p_auth:j.keys.auth,p_daily:daily,p_invites:invites}));
  MYSUB={daily,invites};
}
async function disablePush(){const sub=await currentPush();if(sub){try{await q(SB.from('push_subs').delete().eq('endpoint',sub.endpoint));}catch(e){}try{await sub.unsubscribe();}catch(e){}}MYSUB=null;}
function notify(body){if(!SB||!SESSION)return;SB.functions.invoke('notify',{body}).catch(()=>{});}
function pushPanel(){
  if(!hasProfile())return '';
  const ios=/iphone|ipad|ipod/i.test(navigator.userAgent);
  let inner;
  if(!PUSH_OK)inner=ios&&!isStandalone()?'<p class="muted" style="font-size:14px">Sur iPhone, installe d\'abord le jeu sur l\'écran d\'accueil (Partager → « Sur l\'écran d\'accueil »), puis ouvre-le depuis l\'icône pour activer les notifications.</p>':'<p class="muted" style="font-size:14px">Ce navigateur ne permet pas les notifications. Essaie avec Chrome, ou installe le jeu sur l\'écran d\'accueil.</p>';
  else if(Notification.permission==='denied')inner='<p class="muted" style="font-size:14px">Les notifications sont bloquées pour ce site. Autorise-les dans les réglages du navigateur ou du téléphone, puis reviens ici.</p>';
  else if(!MYSUB)inner=`<p class="muted" style="font-size:14px">Reçois un rappel quand ton défi du jour t'attend (vers 17 h 30 si tu ne l'as pas encore joué), et une alerte quand un ami t'invite à une partie ou t'envoie une demande.</p><div class="row"><button class="btn" id="pon" type="button">Activer les notifications</button><span id="pmsg" aria-live="polite"></span></div>`;
  else inner=`<label class="chk"><input type="checkbox" id="pdaily" ${MYSUB.daily?'checked':''}> Rappel du défi du jour</label>
    <label class="chk"><input type="checkbox" id="pinv" ${MYSUB.invites?'checked':''}> Invitations et demandes d'amis</label>
    <div class="row"><button class="btn ghost sm" id="ptest" type="button">M'envoyer un essai</button><button class="btn ghost sm" id="poff" type="button">Désactiver sur ce téléphone</button><span id="pmsg" aria-live="polite"></span></div>`;
  return `<section class="panel"><h3>Notifications sur ce téléphone</h3>${inner}</section>`;
}
function bindPush(){
  const msg=t=>{const m=byId('pmsg');if(m){m.className='muted';m.textContent=t;}};
  const on=byId('pon');if(on)on.onclick=async function(){this.disabled=true;msg('Activation…');try{await enablePush(true,true);showAccount();toast('Notifications activées.');}catch(e){this.disabled=false;msg(e&&e.message==='refus'?'Autorisation refusée par le téléphone.':'Activation impossible pour l\'instant.');}};
  const upd=async()=>{const d=byId('pdaily').checked,i=byId('pinv').checked;const sub=await currentPush();if(!sub)return;try{await q(SB.from('push_subs').update({daily:d,invites:i}).eq('endpoint',sub.endpoint));MYSUB={daily:d,invites:i};msg('Enregistré');}catch(e){msg(dbMsg(e));}};
  const pd=byId('pdaily');if(pd){pd.onchange=upd;byId('pinv').onchange=upd;}
  const off=byId('poff');if(off)off.onclick=async function(){this.disabled=true;await disablePush();showAccount();};
  const tst=byId('ptest');if(tst)tst.onclick=async function(){this.disabled=true;msg('Envoi…');try{const {data}=await SB.functions.invoke('notify',{body:{kind:'test'}});msg(data&&data.sent?'Envoyé ! Regarde tes notifications.':'Rien n\'est parti : désactive puis réactive les notifications.');}catch(e){msg('Envoi impossible.');}this.disabled=false;};
}

/* =================== INSTALLER L'APPLI =================== */
let INSTALL_EVT=null;
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();INSTALL_EVT=e;const b=byId('install');if(b)b.hidden=false;});
function isStandalone(){return (window.matchMedia&&matchMedia('(display-mode: standalone)').matches)||navigator.standalone===true;}
function installPanel(){
  if(isStandalone())return '';
  const ios=/iphone|ipad|ipod/i.test(navigator.userAgent);
  return `<section class="panel"><h3>Installer l'appli</h3>
  ${ios?'<p class="muted" style="font-size:14px">Sur iPhone : ouvre ce site dans Safari, touche le bouton Partager (le carré avec une flèche), puis « Sur l\'écran d\'accueil ».</p>'
  :'<p class="muted" style="font-size:14px">Ajoute Ti Bac Kréyol à l\'écran d\'accueil de ton téléphone pour l\'ouvrir comme une appli.</p><button class="btn ghost" id="install" type="button" '+(INSTALL_EVT?'':'hidden')+'>Installer sur ce téléphone</button><p class="foot" style="text-align:left">Si le bouton n\'apparaît pas : menu du navigateur (⋮), puis « Installer l\'application » ou « Ajouter à l\'écran d\'accueil ».</p>'}</section>`;
}
function bindInstall(){const b=byId('install');if(b)b.onclick=async()=>{if(!INSTALL_EVT)return;INSTALL_EVT.prompt();try{await INSTALL_EVT.userChoice;}catch(e){}INSTALL_EVT=null;b.hidden=true;};}

/* =================== BADGES =================== */
const BADGES=[
 {k:'debut',n:'Premier pas',d:'Terminer une partie en ligne',ok:s=>s.games>=1},
 {k:'win1',n:'Première victoire',d:'Gagner une partie en ligne',ok:s=>s.wins>=1},
 {k:'win10',n:'10 victoires',d:'Gagner 10 parties en ligne',ok:s=>s.wins>=10},
 {k:'win50',n:'Gran konbatan',d:'Gagner 50 parties en ligne',ok:s=>s.wins>=50},
 {k:'perfect',n:'Premier sans-faute',d:'Trouver toutes les réponses d\'une manche',ok:s=>s.perfect>=1},
 {k:'communes',n:'Maître des communes',d:'Trouver 25 communes de Martinique en une manche',ok:s=>(s.best[0]||0)>=25},
 {k:'karukera',n:'Karukera',d:'Trouver 20 communes de Guadeloupe en une manche',ok:s=>(s.best[12]||0)>=20},
 {k:'lagwiyann',n:'Lagwiyann',d:'Trouver 15 communes de Guyane en une manche',ok:s=>(s.best[13]||0)>=15},
 {k:'mangrove',n:'Gardien de la mangrove',d:'Trouver 10 espèces de la mangrove en une manche',ok:s=>(s.best[21]||0)>=10},
 {k:'rare1',n:'Dénicheur',d:'Trouver une réponse très rare',ok:s=>s.rare3>=1},
 {k:'rare25',n:'Chasseur de raretés',d:'Trouver 25 réponses très rares',ok:s=>s.rare3>=25},
 {k:'daily7',n:'Fidèle au défi',d:'Jouer 7 défis du jour',ok:s=>s.daily>=7},
 {k:'daily30',n:'Tout-bonnement fidèle',d:'Jouer 30 défis du jour',ok:s=>s.daily>=30},
 {k:'friends5',n:'Bon zanmi',d:'Avoir 5 amis',ok:s=>s.friends>=5},
 {k:'metkont',n:'Mèt Kont',d:'Atteindre 4 000 points de classement',ok:s=>s.xp>=4000}
];
function badgeStats(){const m=MEP||{};return {games:m.games||0,wins:m.wins||0,perfect:m.perfect||0,rare3:m.rare3||0,best:m.best||{},daily:m.daily||0,xp:m.xp||0,friends:friendsList().length};}
function earnedBadges(){if(!MEP)return [];const s=badgeStats();return BADGES.filter(b=>b.ok(s)).map(b=>b.k);}
function checkBadges(){
  const now=earnedBadges();
  if(EARNED!==null){now.filter(k=>!EARNED.includes(k)).forEach(k=>toast(`Nouveau badge : ${BADGES.find(b=>b.k===k).n} !`));}
  EARNED=now;
}
function toast(msg){const t=document.createElement('div');t.className='toast';t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),4200);}
function badgeGrid(){
  const got=earnedBadges();
  return `<div class="badges">${BADGES.map(b=>{const g=got.includes(b.k);return `<div class="badge2 ${g?'got':''}"><span class="medal" aria-hidden="true">${g?'★':'☆'}</span><b>${esc(b.n)}</b><span>${esc(b.d)}</span></div>`;}).join('')}</div>`;
}


/* =================== SONS & CONFETTIS =================== */
let AC=null;
function ac(){if(!settings.sound)return null;try{if(!AC)AC=new (window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();}catch(e){AC=null;}return AC;}
function tone(freq,start,dur,type,vol){const c=ac();if(!c)return;try{const o=c.createOscillator(),g=c.createGain(),t0=c.currentTime+start;
  o.type=type||'sine';o.frequency.setValueAtTime(freq,t0);g.gain.setValueAtTime(0.0001,t0);g.gain.exponentialRampToValueAtTime(vol||0.14,t0+0.015);g.gain.exponentialRampToValueAtTime(0.0001,t0+dur);
  o.connect(g);g.connect(c.destination);o.start(t0);o.stop(t0+dur+0.05);}catch(e){}}
/* Gamme pentatonique : chaque combo démarre plus haut, la mélodie monte. */
const SCALE=[523,587,659,784,880,1047,1175,1319,1568,1760,2093,2349];
function sparkle(start){[2637,3136,3520,4186].forEach((f,i)=>tone(f,start+i*0.035,0.12,'sine',0.045));}
const SFX={
  good(p,c){c=c||1;p=p||1;const n=Math.min(c,5),base=Math.min(c-1,SCALE.length-n);
    for(let k=0;k<n;k++)tone(SCALE[base+k],k*0.065,0.16,'triangle',0.12);
    let t=n*0.065;
    if(p>=2){tone(SCALE[Math.min(base+n+1,SCALE.length-1)]*2,t,0.2,'sine',0.07);t+=0.06;}
    if(p>=3){[1568,1976,2349].forEach(f=>tone(f,t,0.35,'sine',0.05));t+=0.05;}
    if(c>=5)sparkle(t+0.03);},
  bad(){const c=ac();if(!c)return;try{const o=c.createOscillator(),g=c.createGain(),t0=c.currentTime;
    o.type='sine';o.frequency.setValueAtTime(150,t0);o.frequency.exponentialRampToValueAtTime(75,t0+0.16);
    g.gain.setValueAtTime(0.0001,t0);g.gain.exponentialRampToValueAtTime(0.22,t0+0.01);g.gain.exponentialRampToValueAtTime(0.0001,t0+0.2);
    o.connect(g);g.connect(c.destination);o.start(t0);o.stop(t0+0.25);}catch(e){}},
  breakStreak(){[784,659,523,392].forEach((f,i)=>tone(f,i*0.07,0.14,'triangle',0.08));setTimeout(()=>SFX.bad(),300);},
  dup(){tone(440,0,0.1,'sine',0.08);tone(440,0.13,0.1,'sine',0.08);},
  tick(sec,last){const f=last?(sec<=3?1320:990):880;tone(f,0,0.06,'square',last?0.05:0.03);},
  suspense(){for(let k=0;k<14;k++)tone(98+k*4,k*0.06,0.08,'triangle',0.03+k*0.006);tone(196,0.9,0.4,'triangle',0.12);tone(294,0.9,0.4,'sine',0.08);},
  record(){[784,988,1175,1568].forEach((f,i)=>tone(f,i*0.1,0.2,'triangle',0.13));[1568,1976,2349].forEach(f=>tone(f,0.42,0.6,'sine',0.06));sparkle(0.5);},
  end(){[523,659,784].forEach((f,i)=>tone(f,i*0.12,0.25,'triangle',0.12));},
  win(){[523,659,784,1047,784,1047].forEach((f,i)=>tone(f,i*0.11,i===5?0.5:0.18,'triangle',0.14));},
  lose(){[392,349,330,262].forEach((f,i)=>tone(f,i*0.16,0.28,'sine',0.1));}
};
/* Meilleur nombre de réponses par thème (compte en ligne + ce téléphone) */
function localBest(){try{return JSON.parse(localStorage.getItem('tibac_best')||'{}')||{};}catch(e){return {};}}
function bestFor(t){const a=(typeof MEP!=='undefined'&&MEP&&MEP.best&&MEP.best[t])||0;return Math.max(a,localBest()[t]||0);}
function saveBest(t,n){try{const b=localBest();if(n>(b[t]||0)){b[t]=n;localStorage.setItem('tibac_best',JSON.stringify(b));}}catch(e){}}
function confetti(){
  if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const cv=document.createElement('canvas');cv.className='confetti';document.body.appendChild(cv);
  const ctx=cv.getContext&&cv.getContext('2d'),dpr=window.devicePixelRatio||1;if(!ctx){cv.remove();return;}
  const size=()=>{cv.width=innerWidth*dpr;cv.height=innerHeight*dpr;};size();
  const cols=['#E4483B','#F6B930','#3DB57F','#3E8FD6','#B993F4','#F6F1E4'];
  const P=Array.from({length:160},(_,i)=>{const left=i%2===0;return {x:(left?0.1:0.9)*cv.width,y:cv.height*0.75,vx:(left?1:-1)*(3+Math.random()*9)*dpr,vy:-(10+Math.random()*12)*dpr,
    w:(6+Math.random()*6)*dpr,h:(3+Math.random()*5)*dpr,r:Math.random()*6,vr:(Math.random()-.5)*0.4,c:cols[i%cols.length]};});
  const t0=performance.now();
  (function frame(t){const el=t-t0;ctx.clearRect(0,0,cv.width,cv.height);
    P.forEach(p=>{p.vy+=0.35*dpr;p.vx*=0.99;p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.r);ctx.globalAlpha=Math.max(0,1-el/3800);ctx.fillStyle=p.c;ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);ctx.restore();});
    if(el<3800)requestAnimationFrame(frame);else cv.remove();})(t0);
}

/* =================== RÈGLEMENT =================== */
function showRules(){
  $app.innerHTML=`<section class="panel"><h2>Règlement du jeu</h2><div class="prose">
  <section><span class="art">ARTICLE 1</span><h4>Objet</h4><p>Ti Bac Kréyol est un jeu de listes sur la culture de la Martinique et des Antilles. Le but est de citer, pour chaque thème, le plus grand nombre de réponses correctes avant la fin du temps imparti.</p></section>
  <section><span class="art">ARTICLE 2</span><h4>Déroulement d'une partie</h4><ul><li>Une partie compte ${ROUNDS} manches.</li><li>Avant la partie, on choisit un ou plusieurs territoires : Martinique, Guadeloupe, Guyane, Saint-Martin, Saint-Barthélemy.</li><li>Chaque manche porte sur un thème tiré au sort parmi ceux des territoires choisis et les thèmes communs aux Antilles et à la Guyane (${activeThemes(null).length} thèmes en tout). Un thème n'apparaît qu'une fois par partie.</li><li>La durée d'une manche est de 45, 60 ou 90 secondes, choisie à la création de la partie.</li><li>La manche s'arrête à la fin du chrono, quand toutes les réponses ont été trouvées, ou quand le joueur choisit de la terminer.</li></ul></section>
  <section><span class="art">ARTICLE 3</span><h4>Barème</h4><p>Les réponses rares rapportent plus.</p>
    <div class="rules">
      <div class="rule"><b>${ptsLabel(1)} Classique</b><span>Fort-de-France, mangue, colombo…</span></div>
      <div class="rule"><b>${ptsLabel(2)} Rare</b><span>Case-Pilote, quénette, souskaï…</span></div>
      <div class="rule"><b>${ptsLabel(3)} Très rare</b><span>Macouba, icaque, Kolo Barst…</span></div>
    </div><ul><li>Réponse classique : 1 point.</li><li>Réponse rare : 2 points.</li><li>Réponse très rare : 3 points.</li><li>Une réponse déjà trouvée ou absente de la liste ne rapporte rien et n'enlève aucun point.</li><li>Bonus combo : toutes les ${COMBO_EVERY} bonnes réponses d'affilée, sans erreur entre elles, +${COMBO_BONUS} points (à ${COMBO_EVERY}, ${COMBO_EVERY*2}, ${COMBO_EVERY*3}…). Une réponse absente de la liste remet la série à zéro ; une réponse déjà trouvée ne la casse pas.</li></ul></section>
  <section><span class="art">ARTICLE 3 BIS</span><h4>Les thèmes</h4><p>${activeThemes(null).length} thèmes, classés par territoire. Au moment de lancer une partie, le jeu tire au sort parmi les thèmes des territoires choisis et les thèmes communs.</p>
    ${[['AN','Communs aux Antilles et à la Guyane'],...TERRS].map(([k,n])=>{const list=activeThemes(null).filter(i=>THEMES[i].terr===k);return list.length?`<h5 class="tgh">${esc(n)} · ${list.length}</h5><div class="themes">${list.map(i=>`<span>${esc(THEMES[i].t)}</span>`).join('')}</div>`:'';}).join('')}</section>
  <section><span class="art">ARTICLE 4</span><h4>Réponses acceptées</h4><p>Seules les réponses figurant dans la liste officielle du thème sont comptées. Les majuscules, les accents, les articles (le, la, les…) et les petites fautes de frappe sont tolérés. Les orthographes qui se prononcent de la même façon sont acceptées, en français comme en créole : k ou c ou qu, w ou ou, é ou er, an ou en, lettres doublées, lettres muettes en fin de mot (par exemple Kolonbo pour Colombo, konpè Lapen pour Compère Lapin, chatwou pour chatrou, piman pour piment). Quand une réponse pourrait correspondre à deux réponses différentes de la liste, elle n'est pas comptée.</p></section>
  <section><span class="art">ARTICLE 5</span><h4>Jokers</h4><ul><li>+15 secondes : prolonge une manche de 15 secondes. Un seul par partie.</li><li>Indice : affiche les deux premières lettres et la longueur d'une réponse non trouvée. Deux par partie.</li></ul></section>
  <section><span class="art">ARTICLE 6</span><h4>Modes de jeu</h4><ul><li>Solo : un joueur tente de faire le meilleur score.</li><li>2 joueurs sur le même téléphone : chacun joue le même thème à son tour.</li><li>Mode Ti moun : pour les enfants, sur le même téléphone. Les thèmes sont simples (couleurs, chiffres et corps en créole, animaux, plage, contes, carnaval, jeux, métiers, fruits, mots du quotidien), les réponses sont acceptées en français ou en créole, et chaque joueur a 3 indices.</li><li>En ligne, de 2 à 5 joueurs, chacun sur son téléphone. Le créateur choisit le nombre de places et peut inviter plusieurs amis ; les places libres se complètent avec le code ou le lien d'invitation.</li><li>En ligne, en direct : les joueurs se retrouvent dans une salle d'attente, puis le créateur lance la partie (2 joueurs minimum). Chaque manche s'ouvre quand tout le monde a terminé la précédente.</li><li>En ligne, adversaire au hasard : le jeu propose un duel en différé avec un joueur de même niveau, ou d'un niveau d'écart, dans le classement mondial. Si personne n'attend, la partie est créée et le prochain joueur de ce niveau la rejoint ; après 24 heures d'attente, elle peut être proposée à un joueur de n'importe quel niveau. Les thèmes sont tirés parmi tous les territoires.</li><li>En ligne, en différé : chacun joue ses ${ROUNDS} manches quand il le souhaite. Le créateur ferme les inscriptions quand il le souhaite ; le classement final s'affiche quand tout le monde a terminé.</li><li>Appui long sur une partie dans « Mes parties » pour la supprimer. Une partie terminée est seulement retirée de ta liste (tes points sont conservés). Si la partie est en cours, tu l'abandonnes : tes manches sont retirées et les autres joueurs continuent sans toi. Si un seul joueur reste, il termine seul.</li><li>Une partie se ferme automatiquement quand toutes les places sont prises. Après le lancement ou la fermeture des inscriptions, plus personne ne peut la rejoindre.</li><li>On rejoint une partie en ligne avec son code à 5 caractères, son lien d'invitation, ou une invitation reçue d'un ami.</li></ul></section>
  <section><span class="art">ARTICLE 7</span><h4>Fin de partie et égalité</h4><p>Les joueurs sont classés selon leur total de points à l'issue des ${ROUNDS} manches. En cas d'égalité de points, le joueur qui a trouvé le plus de réponses passe devant. Si l'égalité persiste, les joueurs partagent la même place. Bonus de classement : ${XP_WIN} points pour le vainqueur, ${XP_TIE} points en cas de première place partagée, ${XP_PLAY} points pour les autres participants.</p></section>
  <section><span class="art">ARTICLE 8</span><h4>Profil, pseudo et amis</h4><ul><li>Pour jouer en ligne, chaque joueur crée un compte gratuit (adresse e-mail et mot de passe), puis un profil avec un pseudo unique et un personnage des contes créoles.</li><li>Le pseudo doit rester correct : pas d'insulte, pas d'usurpation d'identité. L'éditeur peut modifier ou supprimer un pseudo inapproprié.</li><li>On ajoute un ami en saisissant son pseudo. L'amitié est confirmée quand l'autre joueur accepte la demande.</li></ul></section>
  <section><span class="art">ARTICLE 9</span><h4>Classement et niveaux</h4><ul><li>Seules les parties en ligne et le défi du jour comptent pour le classement.</li><li>Points de classement : tous les points marqués en ligne, plus ${XP_WIN} points par victoire, ${XP_TIE} par match nul et ${XP_PLAY} par défaite.</li><li>Trois classements : entre amis, de la semaine et mondial (tous les joueurs). Le classement de la semaine compte les points marqués depuis le lundi ; il repart de zéro chaque lundi à minuit, heure des Antilles.</li><li>Niveaux : ${LEVELS.map(([m,n])=>`${n} (${m})`).join(', ')}.</li></ul></section>
  <section><span class="art">ARTICLE 10</span><h4>Défi du jour</h4><ul><li>Chaque jour, un thème est tiré au sort et proposé à tous les joueurs. Il change à minuit, heure des Antilles.</li><li>Une seule tentative par jour, de 60 secondes, avec un indice. Une tentative commencée compte, même si elle n'est pas terminée.</li><li>Un classement du jour réunit tous les participants. Les points du défi s'ajoutent aux points de classement.</li><li>À la fin du défi, le bouton « Partager mon score » prépare un message à envoyer à ses proches, sans dévoiler les réponses : un carré vert par réponse à 1 point, jaune à 2 points, violet à 3 points.</li><li>Les joueurs qui ont activé les notifications reçoivent un rappel vers 17 h 30 s'ils n'ont pas encore joué le défi du jour.</li></ul></section>
  <section><span class="art">ARTICLE 11</span><h4>Badges</h4><p>Des badges récompensent certains exploits : ${BADGES.map(b=>`${esc(b.n)} (${esc(b.d.toLowerCase())})`).join(', ')}.</p></section>
  <section><span class="art">ARTICLE 12</span><h4>Fair-play</h4><ul><li>Les recherches sur internet, les livres et l'aide d'une autre personne sont interdits pendant une manche.</li><li>En ligne, une manche commencée est comptée même si le joueur quitte la page.</li><li>Le thème d'une manche en ligne reste caché tant que le joueur ne l'a pas jouée.</li></ul></section>
  <section><span class="art">ARTICLE 13</span><h4>Signaler une réponse</h4><p>Les listes de réponses peuvent contenir des oublis ou des erreurs. À la fin de chaque manche, le joueur peut signaler une réponse refusée qu'il pense correcte. L'éditrice examine chaque signalement et décide de l'ajouter ou non, avec le nombre de points qu'elle juge juste. Une réponse ajoutée est acceptée dans les parties suivantes ; les résultats déjà enregistrés ne sont pas modifiés.</p></section>
  </div></section>`;
}


/* =================== MENTIONS LÉGALES =================== */
function showLegal(){
  const MAIL='vizib.contact@gmail.com';
  $app.innerHTML=`<section class="panel"><h2>Mentions légales</h2>
  <div class="prose">
  <section><h4>Éditrice</h4><p>Ti Bac Kréyol est un projet édité par Maureen, à titre personnel et non professionnel.</p><p>Directrice de la publication : Maureen.</p><p>Contact : <span class="sel">${MAIL}</span> <button class="btn ghost sm" id="cpmail" type="button">Copier</button></p>
  <p class="muted" style="font-size:14px">Conformément à l'article 6, III, 2° de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique, l'éditrice, agissant à titre non professionnel, ne rend pas publiques ses coordonnées personnelles ; son identité est connue de l'hébergeur.</p></section>
  <section><h4>Hébergement</h4><p>Le site est hébergé par Vercel Inc. (vercel.com). Les comptes et les données de jeu sont hébergés par Supabase (supabase.com).</p></section>
  <section><h4>Propriété intellectuelle</h4><p>Le concept, la présentation, les illustrations des personnages, les textes et les listes de réponses de Ti Bac Kréyol sont la propriété de l'éditrice. Toute reproduction sans autorisation est interdite. Les personnages représentés sont issus des contes, légendes et carnavals traditionnels des Antilles et de la Guyane. Les noms de marques cités dans les thèmes appartiennent à leurs propriétaires et sont mentionnés à titre informatif, sans partenariat.</p></section>
  <section><h4>Contenus</h4><p>Les listes de réponses ont été établies à partir de connaissances générales sur les Antilles et la Guyane. Elles ne sont pas exhaustives et peuvent contenir des erreurs. Tout signalement est bienvenu, depuis le jeu ou à l'adresse de contact.</p></section>
  <section><h4>Données personnelles</h4><ul>
    <li>Données traitées : ton adresse e-mail (pour la connexion), un identifiant technique de compte, ton pseudo, ton personnage, ta liste d'amis et les demandes d'amis, tes résultats (réponses trouvées, points, points de la semaine, victoires, niveau, badges, scores du défi du jour), la date de ta dernière activité, les réponses que tu signales et, si tu actives les notifications, l'adresse technique d'envoi fournie par ton navigateur et tes choix de notifications. Ton mot de passe est chiffré et n'est jamais visible par l'éditrice.</li>
    <li>Visibilité : ton pseudo, ton personnage, ton niveau et tes points sont visibles par les autres joueurs, notamment dans les classements. Ton adresse e-mail n'est jamais affichée. Les réponses signalées ne sont visibles que par l'éditrice.</li>
    <li>Statistiques : pour ajuster les points des réponses, le jeu compte combien de fois chaque réponse est trouvée dans chaque thème. Ces compteurs sont anonymes : ils ne sont reliés à aucun joueur.</li>
    <li>Notifications : elles ne sont envoyées qu'aux joueurs qui les ont activées (rappel du défi du jour, invitations, demandes d'amis). On peut les couper à tout moment dans l'onglet Connexion ou dans les réglages du téléphone. Elles passent par le service de notification du navigateur (Google, Apple ou Mozilla).</li>
    <li>Finalité : faire fonctionner les comptes, les parties en ligne, le système d'amis, les classements et l'amélioration des listes. Aucune donnée n'est vendue ni utilisée à des fins publicitaires.</li>
    <li>Durées de conservation : le compte et le profil sont supprimés après 2 ans sans connexion, ou immédiatement sur demande ; les parties en ligne et les scores sont conservés 12 mois ; les réponses signalées sont conservées 12 mois après leur traitement. Ce nettoyage est fait automatiquement chaque nuit.</li>
    <li>Tu peux supprimer toi-même ton compte et toutes tes données depuis l'onglet Connexion (« Supprimer mon compte »).</li>
    <li>Conformément au RGPD, tu disposes d'un droit d'accès, de rectification, d'opposition et de suppression de tes données. Pour l'exercer, écris à ${MAIL}. Tu peux aussi adresser une réclamation à la CNIL (cnil.fr).</li>
  </ul></section>
  <section><h4>Stockage local</h4><p>Le jeu enregistre dans ton navigateur ta session de connexion et tes préférences (noms des joueurs, durée des manches, territoires choisis, sons), ton meilleur nombre de réponses par thème et ton dernier score du défi à partager, et garde une copie des fichiers du jeu pour s'ouvrir plus vite. Il n'utilise pas de cookies publicitaires ni de traceurs tiers.</p></section>
  <section><h4>Mise à jour</h4><p>Mentions mises à jour le 29 septembre 2026.</p></section>
  </div></section>`;
  byId('cpmail').onclick=function(){copyText(MAIL,this);};
}

/* =================== DÉMARRAGE =================== */
renderTabs();paintPill();
if(PENDING_CODE)tab='enligne';
go(tab);
if('serviceWorker' in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.register('sw.js').catch(()=>{});});}
