'use strict';
/* Vré ou fo ? — 10 affirmations, 12 secondes chacune */
JK.header('Vré ou fo ?','✅');
runQuiz({key:'vf',title:'Vré ou fo ?',n:10,time:12,
  build:r=>JK.shuffle(VF,r).map(x=>({q:JK.esc(x.s),opts:['👍 Vré','👎 Fo'],two:true,ok:x.v?0:1,expl:JK.esc(x.e)}))});
