'use strict';
/* Jeu Kréyol — outils communs à tous les petits jeux */
const JK={
  /* Date du jour, heure des Antilles (UTC-4), pour les défis quotidiens */
  today(){return new Date(Date.now()-4*3600e3).toISOString().slice(0,10);},
  dayNumber(){return Math.floor((Date.parse(JK.today())-Date.parse('2026-11-01'))/864e5);},
  /* Générateur pseudo-aléatoire reproductible (même grille pour tout le monde le même jour) */
  rng(seed){let h=1779033703^String(seed).length;for(const c of String(seed)){h=Math.imul(h^c.charCodeAt(0),3432918353);h=h<<13|h>>>19;}
    return ()=>{h=Math.imul(h^h>>>16,2246822507);h=Math.imul(h^h>>>13,3266489909);h^=h>>>16;return (h>>>0)/4294967296;};},
  shuffle(a,r=Math.random){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;},
  pick(a,r=Math.random){return a[Math.floor(r()*a.length)];},
  /* Sans accents, en majuscules (pour comparer les mots) */
  plain(s){return String(s).normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/œ/gi,'oe').toUpperCase();},
  esc(s){return String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));},
  /* Sauvegarde locale, par jeu */
  load(game,def){try{return Object.assign({},def,JSON.parse(localStorage.getItem('jk_'+game)||'{}'));}catch(e){return Object.assign({},def);}},
  save(game,v){try{localStorage.setItem('jk_'+game,JSON.stringify(v));}catch(e){}},
  /* Statistiques communes : parties, victoires, série de jours */
  stats(game){return JK.load(game+'_stats',{played:0,won:0,streak:0,best:0,last:null,dist:{}});},
  record(game,won,extra){
    const s=JK.stats(game),d=JK.today();
    if(s.last===d)return s;
    const yest=new Date(Date.parse(d)-864e5).toISOString().slice(0,10);
    s.played++;if(won){s.won++;s.streak=s.last===yest&&s.lastWon?s.streak+1:1;s.best=Math.max(s.best,s.streak);}else s.streak=0;
    s.last=d;s.lastWon=!!won;if(extra!=null)s.dist[extra]=(s.dist[extra]||0)+1;
    JK.save(game+'_stats',s);return s;
  },
  doneToday(game){return JK.stats(game).last===JK.today();},
  /* Petits messages */
  toast(t){const d=document.createElement('div');d.className='toast';d.setAttribute('role','status');d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),2600);},
  /* Partage (téléphone) ou copie */
  async share(text,btn){
    if(navigator.share){try{await navigator.share({text});return;}catch(e){if(e&&e.name==='AbortError')return;}}
    try{await navigator.clipboard.writeText(text);JK.toast('Résultat copié : colle-le où tu veux !');}catch(e){prompt('Copie ton résultat :',text);}
  },
  /* Sons très simples, coupables */
  sound:(()=>{try{return localStorage.getItem('jk_sound')!=='off';}catch(e){return true;}})(),
  _ac:null,
  beep(freqs,dur=.09,type='triangle'){
    if(!JK.sound)return;try{JK._ac=JK._ac||new (window.AudioContext||window.webkitAudioContext)();const ac=JK._ac;let t=ac.currentTime;
      [].concat(freqs).forEach(f=>{const o=ac.createOscillator(),g=ac.createGain();o.type=type;o.frequency.value=f;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.18,t+.01);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g).connect(ac.destination);o.start(t);o.stop(t+dur+.02);t+=dur*.9;});}catch(e){}
  },
  good(){JK.beep([660,880]);},bad(){JK.beep([220],.16,'sine');},win(){JK.beep([523,659,784,1047],.12);},
  toggleSound(btn){JK.sound=!JK.sound;try{localStorage.setItem('jk_sound',JK.sound?'on':'off');}catch(e){}if(btn)btn.textContent=JK.sound?'🔊':'🔇';},
  /* En-tête commun */
  header(title,emoji){
    const top=document.createElement('div');top.className='top';
    top.innerHTML=`<div class="madras" aria-hidden="true"></div><div class="topin"><div class="brandrow">
      <a class="logo" href="/jeux/" style="color:inherit;text-decoration:none">Jeu <span>Kréyol</span></a>
      <div class="row" style="gap:6px"><button class="btn ghost sm" id="jksnd" type="button" aria-label="Son">${JK.sound?'🔊':'🔇'}</button><a class="btn ghost sm" href="/jeux/">Tous les jeux</a></div></div>
      ${title?`<p class="jk-title">${emoji?emoji+' ':''}${JK.esc(title)}</p>`:''}</div>`;
    document.body.prepend(top);
    top.querySelector('#jksnd').onclick=function(){JK.toggleSound(this);};
    const f=document.createElement('footer');f.className='foot-links';
    f.innerHTML='<a href="/jeux/">Tous les jeux</a><a href="/">Ti Bac Kréyol</a><a href="/confidentialite.html">Confidentialité</a><a href="/cgu.html">Conditions d\'utilisation</a><a href="mailto:vizib.contact@gmail.com">Contact</a>';
    document.body.appendChild(f);
  },
  /* Temps avant le prochain défi */
  untilTomorrow(){const now=Date.now()-4*3600e3,next=Date.parse(JK.today())+864e5;const m=Math.max(0,Math.round((next-now)/60000));return `${Math.floor(m/60)} h ${String(m%60).padStart(2,'0')}`;},
  statsHtml(game,labels){const s=JK.stats(game);
    return `<div class="jk-stats"><div><b>${s.played}</b><span>parties</span></div><div><b>${s.played?Math.round(s.won/s.played*100):0} %</b><span>${labels&&labels.won||'réussies'}</span></div><div><b>${s.streak}</b><span>série en cours</span></div><div><b>${s.best}</b><span>meilleure série</span></div></div>`;}
  ,
  /* ---------- Compte Ti Bac et classement du jour ---------- */
  _sbp:null,
  _script(src){return new Promise((ok,ko)=>{const s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=ko;document.head.appendChild(s);});},
  sb(){
    if(!JK._sbp)JK._sbp=(async()=>{try{
      if(!window.supabase)await JK._script('/vendor/supabase.js');
      if(!window.TIBAC_CONFIG)await JK._script('/config.js');
      const c=window.TIBAC_CONFIG||{};if(!c.SUPABASE_URL||!window.supabase)return null;
      return window.supabase.createClient(c.SUPABASE_URL,c.SUPABASE_ANON_KEY);
    }catch(e){return null;}})();
    return JK._sbp;
  },
  /* r = {score, xp, detail} ; à appeler une fois le panneau de fin affiché (défi du jour uniquement) */
  async board(game,r){
    const end=document.getElementById('end');if(!end)return;
    const el=document.createElement('div');el.className='jk-board';el.innerHTML='<h3>🏆 Classement du jour</h3><p class="muted">Chargement…</p>';
    const cta=end.querySelector('.cta');cta?end.insertBefore(el,cta):end.appendChild(el);
    const sb=await JK.sb();
    if(!sb){el.innerHTML='<h3>🏆 Classement du jour</h3><p class="muted">Classement indisponible pour le moment (pas de connexion ?).</p>';return;}
    let session=null;try{session=(await sb.auth.getSession()).data.session;}catch(e){}
    let info='';
    const sentKey='sent_'+game,sent=JK.load(sentKey,{});
    if(session&&r&&sent.day!==JK.today()){
      try{const {data,error}=await sb.rpc('jk_submit',{p_game:game,p_score:Math.round(r.score||0),p_xp:Math.round(r.xp||0),p_detail:String(r.detail||'').slice(0,120)});
        if(!error&&data&&!data.error){JK.save(sentKey,{day:JK.today(),res:data});sent.day=JK.today();sent.res=data;}}catch(e){}
    }
    if(session&&sent.res){const d=sent.res;info=`<p class="jk-gain">${d.xp>0?`<b>+${d.xp} point${d.xp>1?'s':''}</b> ajouté${d.xp>1?'s':''} à ton niveau Ti Bac · `:''}Tu es <b>${d.rank}<sup>${d.rank===1?'er':'e'}</sup></b> sur ${d.players} joueur${d.players>1?'s':''} aujourd'hui</p>`;}
    else if(!session)info=`<p class="jk-gain"><a href="/#compte">Connecte-toi sur Ti Bac Kréyol</a> pour apparaître au classement et gagner des points pour ton niveau (même compte).</p>`;
    let rows=[];try{const {data}=await sb.rpc('jk_top',{p_game:game});rows=data||[];}catch(e){}
    const medal=i=>['🥇','🥈','🥉'][i]||(i+1)+'.';
    el.innerHTML=`<h3>🏆 Classement du jour</h3>${info}${rows.length?`<ol class="jk-top">${rows.map((x,i)=>`<li class="${x.me?'me':''}"><span class="rk">${medal(i)}</span><span class="nm">${JK.esc(x.pseudo)}${x.me?' (toi)':''}</span><span class="sc">${JK.esc(x.detail||x.score)}</span></li>`).join('')}</ol>`:'<p class="muted">Personne encore aujourd\'hui : sois le premier !</p>'}`;
  }
};
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}));
