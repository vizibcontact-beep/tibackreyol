'use strict';
/* Kréyol Mo — le mot créole du jour, en 6 essais */
const MOTS=[
 ['Bonjou','bonjour'],['Bonswa','bonsoir'],['Mèsi','merci'],['Manjé','manger, la nourriture'],['Lanmè','la mer'],['Lapli','la pluie'],
 ['Solèy','le soleil'],['Zanmi','un ami, une amie'],['Manman','maman'],['Timoun','un enfant'],['Travay','le travail'],['Dòmi','dormir'],
 ['Lajan','l\'argent'],['Zwazo','un oiseau'],['Kochon','un cochon'],['Chyen','un chien'],['Tonton','un oncle'],['Matant','une tante'],
 ['Lékol','l\'école'],['Jòdi','aujourd\'hui'],['Dèmen','demain'],['Gadé','regarder'],['Kouté','écouter'],['Anmwé','au secours !'],
 ['Kouri','courir'],['Anpil','beaucoup'],['Rivé','arriver'],['Soti','sortir'],['Lari','la rue'],['Poul','une poule'],
 ['Diri','le riz'],['Piman','le piment'],['Sitwon','le citron'],['Zaboka','l\'avocat (le fruit)'],['Vyann','la viande'],['Pwason','le poisson'],
 ['Kafé','le café'],['Zépis','les épices'],['Zonyon','l\'oignon'],['Siwo','le sirop'],['Kabrit','le cabri, la chèvre'],['Lanbi','le lambi'],
 ['Dachin','le madère (taro), un tubercule'],['Lalin','la lune'],['Zétwal','une étoile'],['Ravin','une ravine'],['Wòch','une roche, une pierre'],
 ['Syèl','le ciel'],['Loraj','l\'orage'],['Siklòn','un cyclone'],['Zéklè','un éclair'],['Krab','un crabe'],['Vaval','le roi du carnaval'],
 ['Tanbou','le tambour'],['Kostim','un costume'],['Diab','le diable'],['Zòrèy','l\'oreille'],['Lanmen','la main'],['Chivé','les cheveux'],
 ['Jounou','le genou'],['Zépòl','l\'épaule'],['Bouch','la bouche'],['Dwèt','le doigt'],['Lang','la langue'],['Vant','le ventre'],
 ['Zong','l\'ongle'],['Wouj','rouge'],['Blan','blanc'],['Mawon','marron'],['Zoranj','orange (la couleur ou le fruit)'],['Vyolèt','violet'],
 ['Senk','cinq']
];
const TRIES=6;
const norm=w=>JK.plain(w).replace(/[^A-Z]/g,'');
const ORDER=JK.shuffle(MOTS.map((_,i)=>i),JK.rng('kreyol-mo'));
function dailyWord(){const n=ORDER.length;return MOTS[ORDER[((JK.dayNumber()%n)+n)%n]];}

const $=id=>document.getElementById(id);
let W,ANS,LEN,rows=[],cur='',done=false,daily=true;

function grade(guess,ans){
  const res=Array(guess.length).fill('no'),left={};
  for(let i=0;i<ans.length;i++){if(guess[i]===ans[i])res[i]='ok';else left[ans[i]]=(left[ans[i]]||0)+1;}
  for(let i=0;i<guess.length;i++)if(res[i]!=='ok'&&left[guess[i]]){res[i]='in';left[guess[i]]--;}
  return res;
}
function start(isDaily){
  daily=isDaily;W=isDaily?dailyWord():JK.pick(MOTS);ANS=norm(W[0]);LEN=ANS.length;cur='';done=false;
  const st=JK.load('mo',{});
  rows=isDaily&&st.day===JK.today()?st.rows||[]:[];
  render();
  if(rows.length&&(rows[rows.length-1]===ANS||rows.length>=TRIES))finish(true);
}
function render(){
  const g=$('grid');g.innerHTML='';
  for(let r=0;r<TRIES;r++){
    const row=document.createElement('div');row.className='mo-row';row.style.gridTemplateColumns=`repeat(${LEN},1fr)`;
    const word=r<rows.length?rows[r]:r===rows.length?cur:'';const res=r<rows.length?grade(rows[r],ANS):null;
    for(let i=0;i<LEN;i++){const c=document.createElement('div');c.className='mo-cell'+(word[i]?' filled':'')+(res?' '+res[i]:'');c.textContent=word[i]||'';row.appendChild(c);}
    g.appendChild(row);
  }
  $('len').textContent=`${LEN} lettres · ${TRIES} essais`;
  paintKeys();
}
function paintKeys(){
  const best={};const rank={no:1,in:2,ok:3};
  rows.forEach(w=>grade(w,ANS).forEach((r,i)=>{if(!best[w[i]]||rank[r]>rank[best[w[i]]])best[w[i]]=r;}));
  document.querySelectorAll('.kb [data-k]').forEach(b=>{const k=b.dataset.k;b.className=(b.classList.contains('wide')?'wide ':'')+(best[k]||'');});
}
function type(k){
  if(done)return;
  if(k==='ENTER')return submit();
  if(k==='DEL'){cur=cur.slice(0,-1);return render();}
  if(/^[A-Z]$/.test(k)&&cur.length<LEN){cur+=k;render();}
}
function submit(){
  const row=$('grid').children[rows.length];
  if(cur.length<LEN){row.classList.remove('shake');void row.offsetWidth;row.classList.add('shake');JK.bad();JK.toast(`Il faut ${LEN} lettres.`);return;}
  rows.push(cur);cur='';
  if(daily)JK.save('mo',{day:JK.today(),rows});
  render();
  const r=$('grid').children[rows.length-1];[...r.children].forEach((c,i)=>{c.style.animationDelay=(i*90)+'ms';c.classList.add('flip');});
  if(rows[rows.length-1]===ANS){JK.win();setTimeout(()=>finish(false),LEN*90+300);}
  else if(rows.length>=TRIES){JK.bad();setTimeout(()=>finish(false),LEN*90+300);}
  else JK.good();
}
function finish(restored){
  done=true;const won=rows[rows.length-1]===ANS;
  if(daily&&!restored)JK.record('mo',won,won?rows.length:'x');
  const emo=rows.map(w=>grade(w,ANS).map(r=>r==='ok'?'🟩':r==='in'?'🟨':'⬛').join('')).join('\n');
  const txt=`Kréyol Mo ${JK.today().split('-').reverse().slice(0,2).join('/')} — ${won?rows.length:'X'}/${TRIES}\n${emo}\nhttps://tibackreyol.vercel.app/jeux/mo.html`;
  $('end').hidden=false;
  $('end').innerHTML=`<div class="mo-def"><span class="muted">${won?(rows.length<=2?'Mannifik ! 🔥':rows.length<=4?'Bravo ! 🎉':'Ouf, trouvé ! 😅'):'Dommage… le mot était :'}</span><b>${JK.esc(W[0])}</b><span>= ${JK.esc(W[1])}</span></div>
    ${daily?JK.statsHtml('mo',{won:'trouvés'})+`<p class="muted" style="text-align:center">Prochain mot dans ${JK.untilTomorrow()}</p>`:''}
    <div class="cta">${daily?'<button class="btn" id="share" type="button">Partager mon résultat</button>':''}<button class="btn ghost" id="again" type="button">${daily?'Jouer un mot au hasard':'Encore un mot'}</button></div>`;
  if(daily)$('share').onclick=()=>JK.share(txt);
  $('again').onclick=()=>{$('end').hidden=true;start(false);};
}
function keyboard(){
  const L=['AZERTYUIOP','QSDFGHJKLM','WXCVBN'];
  $('kb').innerHTML=L.map((l,i)=>`<div>${i===2?'<button class="wide" data-k="ENTER" type="button">Valider</button>':''}${[...l].map(c=>`<button data-k="${c}" type="button">${c}</button>`).join('')}${i===2?'<button class="wide" data-k="DEL" type="button" aria-label="Effacer">⌫</button>':''}</div>`).join('');
  $('kb').onclick=e=>{const b=e.target.closest('[data-k]');if(b)type(b.dataset.k);};
  document.addEventListener('keydown',e=>{if(e.ctrlKey||e.metaKey||e.altKey)return;const k=e.key==='Enter'?'ENTER':e.key==='Backspace'?'DEL':JK.plain(e.key);if(k==='ENTER'||k==='DEL'||/^[A-Z]$/.test(k)){e.preventDefault();type(k);}});
}
JK.header('Kréyol Mo','🔤');
keyboard();start(true);
