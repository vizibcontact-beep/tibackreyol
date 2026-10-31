'use strict';
/* Woulé yol — garde la yole ronde en équilibre en déplaçant l'équipage sur les bois dressés */
const $=id=>document.getElementById(id);
const COURSE=1200,TACKS=[400,800],CAPSIZE=38;
let cv,ctx,W=360,H=480,raf=0,last=0,run=false,daily=true;
let st;
const IMG={};
function loadImages(){return Promise.all(['decor','yole','yole2','crew1','bouee'].map(k=>new Promise(ok=>{const im=new Image();im.onload=()=>{IMG[k]=im;ok();};im.onerror=()=>ok();im.src='/jeux/img/yol/'+k+'.webp';})));}
function gusts(r){
  /* rafales : début (s), durée (s), force (0.5 à 1) */
  const g=[];let t=3;
  while(t<200){const d=2+r()*3.5;g.push({t,d,f:.5+r()*.5});t+=d+1.8+r()*4;}
  return g;
}
function reset(isDaily){
  daily=isDaily;const r=JK.rng(isDaily?'yol-'+JK.today():Math.random());
  st={t:0,a:0,w:0,c:0,dir:0,dist:0,side:1,G:gusts(r),wave:0,caps:0,down:0,msg:'',msgT:0,v:0,done:false,started:false};
}
function windAt(t){
  /* vent de base + rafale ; side = côté d'où vient le vent (change à chaque virement) */
  let g=0,warn=0;
  for(const x of st.G){
    if(t>=x.t&&t<x.t+x.d){const k=Math.min(1,(t-x.t)/.6,(x.t+x.d-t)/.6);g=Math.max(g,x.f*k);}
    else if(t<x.t&&x.t-t<1.6)warn=Math.max(warn,1-(x.t-t)/1.6);
  }
  return {W:st.side*(.75+.95*g),g,warn};
}
function step(dt){
  if(st.done)return;
  st.t+=dt;st.wave+=dt;
  if(st.down>0){st.down-=dt;st.a*=.9;st.w=0;if(st.down<=0){st.a=0;st.c=0;flash('C\'est reparti !');}return;}
  const {W:wd}=windAt(st.t);
  st.c=Math.max(-1.3,Math.min(1.3,st.c+st.dir*1.9*dt));
  const acc=42*(wd+st.c)-2.6*st.w-1.25*st.a+Math.sin(st.wave*1.7)*4;
  st.w+=acc*dt;st.a+=st.w*dt;
  if(Math.abs(st.a)>CAPSIZE){st.caps++;st.down=3;JK.bad();flash('Chaviré ! 🌊 −3 s');return;}
  const bal=Math.max(0,1-(st.a/30)**2);
  st.v=(10+9*Math.min(1,Math.abs(wd)/1.7))*bal;
  const before=st.dist;st.dist+=st.v*dt;
  for(const k of TACKS)if(before<k&&st.dist>=k){st.side*=-1;flash('Virement de bord ! Le vent change de côté');JK.beep([440,660]);}
  if(st.dist>=COURSE){st.dist=COURSE;st.done=true;finish();}
}
function flash(m){st.msg=m;st.msgT=2.2;}

/* ---------- Dessin ---------- */
function draw(){
  const w=W,h=H,{W:wd,warn,g}=windAt(st.t);
  const HZ=h*.375; /* ligne d'horizon du décor */
  if(IMG.decor)ctx.drawImage(IMG.decor,0,0,w,h);else{ctx.fillStyle='#1C8FB8';ctx.fillRect(0,0,w,h);}
  /* rafale : eau plus sombre du côté du vent */
  if(g>0||warn>0){const s=st.side,al=Math.max(g*.42,warn*.28);const gr=ctx.createLinearGradient(s>0?0:w,0,s>0?w*.65:w*.35,0);gr.addColorStop(0,`rgba(4,40,70,${al})`);gr.addColorStop(1,'rgba(4,40,70,0)');ctx.fillStyle=gr;ctx.fillRect(0,HZ,w,h-HZ);}
  /* reflets qui défilent (impression de vitesse) */
  ctx.strokeStyle='rgba(255,255,255,.28)';ctx.lineWidth=1.6;
  for(let y=0;y<9;y++){const yy=HZ+10+y*y*5.2,sp=(1+y*.5),off=(st.dist*sp*1.8)%80;ctx.beginPath();
    for(let x=-80;x<w+80;x+=80){const X=x+((y*37)%80)+(y%2?off:-off);ctx.moveTo(X,yy);ctx.quadraticCurveTo(X+6+y,yy-2-y*.3,X+12+y*2,yy);}ctx.stroke();}
  /* yole adverse au loin */
  if(IMG.yole2){const rh=h*.10,rw=rh*IMG.yole2.width/IMG.yole2.height,rx=w*(.5+.34*Math.sin(st.t/7+1)),ry=HZ+h*.075+Math.sin(st.wave*1.3)*1.5;
    ctx.save();ctx.translate(rx,ry);ctx.rotate(Math.sin(st.wave*.9)*.05);ctx.drawImage(IMG.yole2,-rw/2,-rh,rw,rh);ctx.restore();}
  /* bouée qui approche */
  const nextK=[...TACKS,COURSE].find(k=>k>st.dist)||COURSE,prev=[0,...TACKS].filter(k=>k<=st.dist).pop()||0;
  const pr=(st.dist-prev)/(nextK-prev);
  if(IMG.bouee){const bh=8+pr*pr*h*.16,bw=bh*IMG.bouee.width/IMG.bouee.height,bx=w*(.5+.36*st.side*(.55+pr*.5)),by=HZ+6+pr*pr*h*.30+Math.sin(st.wave*2)*1.5;
    ctx.drawImage(IMG.bouee,bx-bw/2,by-bh,bw,bh);if(nextK===COURSE&&pr>.2){ctx.fillStyle='#F7C23C';ctx.font='800 12px Figtree, sans-serif';ctx.textAlign='center';ctx.fillText('ARRIVÉE',bx,by-bh-4);}}
  /* la yole (vue de l'arrière) : pivot au niveau de l'eau */
  const Y=IMG.yole,sc=h*.80/900,PX=348,PY=770,bob=Math.sin(st.wave*1.7)*2;
  ctx.save();ctx.translate(w/2,h*.87+bob);ctx.rotate(st.a*Math.PI/180);ctx.scale(sc,sc);
  if(Y)ctx.drawImage(Y,-PX,-PY);
  /* équipage sur les bois dressés */
  const cx=st.c*205;
  for(let i=0;i<4;i++){
    const x=cx+(i-1.5)*46,foot=(632-PY)+Math.min(1,Math.abs(x)/338)*42,im=IMG.crew1;if(!im)continue;
    const ch=138,cw=ch*im.width/im.height;ctx.save();ctx.translate(x,foot);if(st.c<0)ctx.scale(-1,1);ctx.rotate(-st.c*.12);ctx.drawImage(im,-cw/2,-ch,cw,ch);ctx.restore();}
  ctx.restore();
  /* écume */
  ctx.fillStyle='rgba(255,255,255,.55)';ctx.beginPath();ctx.ellipse(w/2,h*.87+bob+6,60+st.v*2.2,6,0,0,7);ctx.fill();
  /* HUD : inclinaison */
  const mx=w/2,my=28,R=120;
  ctx.fillStyle='rgba(12,38,46,.72)';roundRect(mx-R-14,8,2*R+28,44,12);ctx.fill();
  ctx.fillStyle='#2FA36B';ctx.fillRect(mx-R*.3,my,R*.6,8);
  ctx.fillStyle='#F7C23C';ctx.fillRect(mx-R*.7,my,R*.4,8);ctx.fillRect(mx+R*.3,my,R*.4,8);
  ctx.fillStyle='#E2483D';ctx.fillRect(mx-R,my,R*.3,8);ctx.fillRect(mx+R*.7,my,R*.3,8);
  const px=mx+Math.max(-1,Math.min(1,st.a/CAPSIZE))*R;ctx.fillStyle='#fff';ctx.beginPath();ctx.moveTo(px,my-4);ctx.lineTo(px-6,my-12);ctx.lineTo(px+6,my-12);ctx.fill();
  ctx.font='700 11px Figtree, sans-serif';ctx.textAlign='center';ctx.fillStyle='#C9D7D9';ctx.fillText('ÉQUILIBRE',mx,my+22);
  /* progression */
  ctx.fillStyle='rgba(12,38,46,.72)';roundRect(10,h-30,w-20,20,10);ctx.fill();
  ctx.fillStyle='#F7C23C';roundRect(12,h-28,(w-24)*st.dist/COURSE,16,8);ctx.fill();
  ctx.fillStyle='#fff';ctx.font='700 12px Figtree, sans-serif';ctx.fillText(`${Math.round(st.dist)} / ${COURSE} m · ${fmt(st.t)} · ${Math.round(st.v*.6)} nœuds`,w/2,h-16);
  /* vent / rafale */
  ctx.font='800 15px Figtree, sans-serif';
  if(warn>0&&g<.1){ctx.fillStyle=`rgba(255,255,255,${.5+warn*.5})`;ctx.fillText(st.side>0?'💨 Rafale à gauche !':'Rafale à droite ! 💨',w/2,76);}
  else if(g>.1){ctx.fillStyle='#F7C23C';ctx.fillText(st.side>0?'💨💨 RAFALE':'RAFALE 💨💨',w/2,76);}
  if(st.msgT>0){st.msgT-=1/60;ctx.fillStyle='rgba(12,38,46,.85)';roundRect(w/2-150,h*.5-24,300,40,12);ctx.fill();ctx.fillStyle='#fff';ctx.font='800 15px Figtree, sans-serif';ctx.fillText(st.msg,w/2,h*.5+2);}
  if(!st.started){ctx.fillStyle='rgba(12,38,46,.82)';roundRect(w/2-150,h*.44,300,70,14);ctx.fill();ctx.fillStyle='#fff';ctx.font='800 17px Figtree, sans-serif';ctx.fillText('Touche ◀ ou ▶ pour partir',w/2,h*.44+30);ctx.font='600 13px Figtree, sans-serif';ctx.fillText('Le vent penche la yole : envoie l\'équipage de l\'autre côté',w/2,h*.44+52);}
}
function roundRect(x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();}
function fmt(s){return `${Math.floor(s/60)}:${(s%60).toFixed(1).padStart(4,'0')}`;}
function loop(ts){
  const dt=Math.min(.05,(ts-(last||ts))/1000);last=ts;
  if(st.started&&!st.done)step(dt);
  draw();
  if(run)raf=requestAnimationFrame(loop);
}
function startLoop(){if(run)return;run=true;last=0;raf=requestAnimationFrame(loop);}
function stopLoop(){run=false;cancelAnimationFrame(raf);}
function setDir(d){st.dir=d;if(d&&!st.started&&!st.done){st.started=true;}}

function finish(){
  stopLoop();draw();
  const s=st.t,tm=`${Math.floor(s/60)} min ${(s%60).toFixed(1).replace('.',',')} s`;
  const sv=JK.load('yol',{});
  const first=daily&&sv.day!==JK.today();
  if(daily){JK.record('yol',st.caps===0,null);if(first||s<(sv.best||1e9))JK.save('yol',{day:JK.today(),best:first?s:Math.min(s,sv.best),caps:st.caps});}
  JK.win();
  const txt=`Woulé yol du ${JK.today().split('-').reverse().slice(0,2).join('/')} — ${COURSE} m en ${tm} ⛵${st.caps?` (${st.caps} chavirage${st.caps>1?'s':''})`:''}\n${location.origin}${location.pathname}`;
  $('end').hidden=false;
  $('end').innerHTML=`<h2>${st.caps===0&&s<85?'Yole championne ! 🏆':st.caps===0?'Arrivée sans chavirer ! 🎉':'Arrivée ! 🌊'}</h2>
    <p style="font-size:18px">${COURSE} m en <b>${tm}</b>${st.caps?` · ${st.caps} chavirage${st.caps>1?'s':''}`:''}</p>
    ${daily?JK.statsHtml('yol',{won:'sans chavirer'})+(first?'':'<p class="muted" style="text-align:center">Seule ta première course du jour compte pour le classement.</p>'):''}
    <div class="cta">${daily?'<button class="btn" id="share" type="button">Partager</button>':''}<button class="btn ghost" id="again" type="button">Nouvelle course (vent au hasard)</button></div>`;
  if(daily)$('share').onclick=()=>JK.share(txt);
  $('again').onclick=()=>{$('end').hidden=true;reset(false);startLoop();window.scrollTo({top:0,behavior:'smooth'});};
  if(daily)JK.board('yol',{score:Math.max(0,36000-Math.round(s*10)),xp:Math.max(3,Math.min(10,Math.round(10-(s-75)/8))),detail:tm.replace(' min ',':').replace(' s','')});
}
function setup(){
  cv=$('cv');ctx=cv.getContext('2d');
  const fit=()=>{const r=cv.getBoundingClientRect(),d=window.devicePixelRatio||1;W=r.width;H=r.width*4/3;cv.style.height=H+'px';cv.width=W*d;cv.height=H*d;ctx.setTransform(d,0,0,d,0,0);};
  fit();window.addEventListener('resize',fit);
  const hold=(el,d)=>{el.addEventListener('pointerdown',e=>{e.preventDefault();setDir(d);});['pointerup','pointerleave','pointercancel'].forEach(ev=>el.addEventListener(ev,()=>{if(st.dir===d)setDir(0);}));};
  hold($('left'),-1);hold($('right'),1);
  cv.addEventListener('pointerdown',e=>{const r=cv.getBoundingClientRect();setDir(e.clientX-r.left<r.width/2?-1:1);});
  ['pointerup','pointerleave','pointercancel'].forEach(ev=>cv.addEventListener(ev,()=>setDir(0)));
  document.addEventListener('keydown',e=>{if(e.repeat)return;if(e.key==='ArrowLeft'||e.key==='q'||e.key==='Q'){e.preventDefault();setDir(-1);}if(e.key==='ArrowRight'||e.key==='d'||e.key==='D'){e.preventDefault();setDir(1);}});
  document.addEventListener('keyup',e=>{if(['ArrowLeft','ArrowRight','q','Q','d','D'].includes(e.key))setDir(0);});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){stopLoop();}else if(!st.done)startLoop();});
}
JK.header('Woulé yol','⛵');
setup();
const sv=JK.load('yol',{});
if(sv.day===JK.today())$('daynote').textContent=`Ta course du jour : ${Math.floor(sv.best/60)} min ${(sv.best%60).toFixed(1).replace('.',',')} s. Tu peux rejouer pour t'entraîner (seule la première compte).`;
reset(true);startLoop();loadImages();
