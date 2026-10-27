'use strict';
/* Moteur de quiz commun : Vré ou fo ? et Konbat Pwovèb
   cfg = {key, title, n, time, build(rng) -> [{q, opts:[...], ok:index, expl, two}], share(label)} */
function runQuiz(cfg){
  const $=id=>document.getElementById(id);
  let Q=[],i=0,score=0,marks=[],timer=null,left=0,daily=true,locked=false;
  function start(isDaily){
    daily=isDaily;const r=JK.rng(isDaily?cfg.key+'-'+JK.today():Math.random());
    Q=cfg.build(r).slice(0,cfg.n);i=0;score=0;marks=[];$('end').hidden=true;$('play').hidden=false;
    const sv=JK.load(cfg.key,{});
    if(isDaily&&sv.day===JK.today()&&sv.done){score=sv.score;marks=sv.marks;return end(true);}
    show();
  }
  function show(){
    locked=false;const q=Q[i];
    $('play').innerHTML=`<div class="qz-top"><span>Question ${i+1} / ${Q.length}</span><span>⭐ ${score} pts</span></div>
      <div class="qz-bar" aria-hidden="true"><i id="tbar" style="width:100%"></i></div>
      <div class="qz-card"><p class="q">${q.q}</p></div>
      <div class="${q.two?'qz-two':'qz-opts'}" id="opts">${q.opts.map((o,k)=>`<button class="btn ${q.two?'':'ghost'}" type="button" data-k="${k}" ${q.two&&k===1?'style="background:var(--red);color:#fff;box-shadow:0 4px 0 #9E2A20"':''}>${o}</button>`).join('')}</div>
      <div id="after"></div>`;
    $('opts').querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>answer(+b.dataset.k));
    left=cfg.time;clearInterval(timer);const t0=Date.now();
    timer=setInterval(()=>{left=cfg.time-(Date.now()-t0)/1000;const bar=$('tbar');if(bar)bar.style.width=Math.max(0,left/cfg.time*100)+'%';if(left<=0)answer(-1);},100);
  }
  function answer(k){
    if(locked)return;locked=true;clearInterval(timer);const q=Q[i];const good=k===q.ok;
    const pts=good?10+Math.max(0,Math.round(left)):0;score+=pts;marks.push(good?1:0);
    if(good)JK.good();else JK.bad();
    $('opts').querySelectorAll('[data-k]').forEach(b=>{const n=+b.dataset.k;b.disabled=true;b.style.opacity=1;if(n===q.ok)b.classList.add('right');else if(n===k)b.classList.add('wrong');});
    $('after').innerHTML=`<p class="qz-expl"><b>${k<0?'⏰ Temps écoulé ! ':good?`✅ Bravo ! +${pts} pts. `:'❌ Raté. '}</b>${q.expl}</p>
      <button class="btn wide" id="next" type="button">${i+1<Q.length?'Question suivante':'Voir mon score'}</button>`;
    $('next').onclick=()=>{i++;if(i<Q.length)show();else end(false);};$('next').focus();
  }
  function end(restored){
    $('play').hidden=true;const good=marks.filter(Boolean).length;
    if(daily&&!restored){JK.record(cfg.key,good>=Math.ceil(Q.length/2),good);JK.save(cfg.key,{day:JK.today(),done:true,score,marks});}
    if(good===Q.length&&!restored)JK.win();
    const txt=`${cfg.title} du ${JK.today().split('-').reverse().slice(0,2).join('/')} — ${good}/${Q.length} · ${score} pts\n${marks.map(m=>m?'🟩':'🟥').join('')}\n${location.origin}${location.pathname}`;
    $('end').hidden=false;
    $('end').innerHTML=`<h2>${good===Q.length?'Parfait ! 🏆':good>=Q.length*.7?'Très bien ! 🎉':good>=Q.length/2?'Pas mal ! 👍':'Ou ké fè miyò dèmen ! 💪'}</h2>
      <p style="font-size:18px"><b>${good} / ${Q.length}</b> bonnes réponses · <b>${score}</b> points</p><p style="font-size:22px;letter-spacing:2px">${marks.map(m=>m?'🟩':'🟥').join('')}</p>
      ${daily?JK.statsHtml(cfg.key,{won:'réussies'})+`<p class="muted" style="text-align:center">Nouvelle série dans ${JK.untilTomorrow()}</p>`:''}
      <div class="cta">${daily?'<button class="btn" id="share" type="button">Partager</button>':''}<button class="btn ghost" id="again" type="button">${daily?'Rejouer (série au hasard)':'Encore une série'}</button></div>`;
    if(daily)$('share').onclick=()=>JK.share(txt);
    $('again').onclick=()=>start(false);
    if(daily)JK.board(cfg.key,{score,xp:Math.round(good/Q.length*10),detail:`${good}/${Q.length} · ${score} pts`});
  }
  start(true);
}
