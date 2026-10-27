'use strict';
/* Konbat Pwovèb — retrouve la fin du proverbe créole */
JK.header('Konbat Pwovèb','💬');
runQuiz({key:'pw',title:'Konbat Pwovèb',n:6,time:20,
  build:r=>JK.shuffle(PWOVEB,r).map(p=>{
    const others=JK.shuffle(PWOVEB.filter(x=>x!==p),r).slice(0,3).map(x=>x.b);
    const opts=JK.shuffle([p.b,...others],r);
    return {q:`« ${JK.esc(p.a)} … »`,opts:opts.map(JK.esc),ok:opts.indexOf(p.b),expl:`« ${JK.esc(p.a)} ${JK.esc(p.b)} » ${JK.esc(p.fr)}`};
  })});
