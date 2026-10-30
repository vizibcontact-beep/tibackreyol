'use strict';
/* Vré ou fo ? — 10 affirmations, 12 secondes chacune.
   Défi du jour équilibré entre Martinique, Guadeloupe, Guyane et culture commune ;
   en partie libre, on peut choisir un territoire. */
const TAGS={
  MQ:/Martiniq|Pelée|Saint-Pierre|Fort-de-France|Fort-Royal|Césaire|Lézarde|Trois-Îlets|Schœlcher|Diamant|bèlè|danmyé|Carbet|22 mai|Chamoiseau|moqueur|amazone de la Martinique|trigonocéphale|manicou/i,
  GP:/Guadeloupe|Soufrière|Saintes|Marie-Galante|Désirade|gwoka|Pointe-à-Pitre|Abymes|Basse-Terre|Grande-Terre|Rivière Salée|27 mai|pic de la Guadeloupe|Matouba/i,
  GF:/Guyane|Cayenne|Kourou|Maroni|Oyapock|hoazin|tortue luth|Dreyfus|10 juin|Saint-Laurent/i};
const tags=x=>Object.keys(TAGS).filter(k=>TAGS[k].test(x.s+' '+x.e));
const TER_NAMES={all:'Tout',MQ:'Martinique',GP:'Guadeloupe',GF:'Guyane'};
let TER='all';
function balanced(r){
  const used=new Set(),out=[];
  const take=(list,n)=>{for(const x of JK.shuffle(list,r)){if(n<=0)break;if(used.has(x))continue;used.add(x);out.push(x);n--;}};
  take(VF.filter(x=>tags(x).includes('MQ')),3);take(VF.filter(x=>tags(x).includes('GP')),3);
  take(VF.filter(x=>tags(x).includes('GF')),2);take(VF.filter(x=>!tags(x).length),2);take(VF,10-out.length);
  return JK.shuffle(out,r);
}
JK.header('Vré ou fo ?','✅');
const QZ=runQuiz({key:'vf',title:'Vré ou fo ?',n:10,time:12,
  build:(r,daily)=>(daily||TER==='all'?balanced(r):JK.shuffle(VF.filter(x=>tags(x).includes(TER)),r))
    .map(x=>({q:JK.esc(x.s),opts:['👍 Vré','👎 Fo'],two:true,ok:x.v?0:1,expl:JK.esc(x.e)}))});
const seg=document.getElementById('terr');
seg.innerHTML=Object.entries(TER_NAMES).map(([k,n])=>`<button type="button" data-t="${k}" aria-pressed="${k===TER}">${n}</button>`).join('');
seg.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{TER=b.dataset.t;seg.querySelectorAll('[data-t]').forEach(x=>x.setAttribute('aria-pressed',x===b));QZ.start(false);});
