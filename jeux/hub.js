'use strict';
/* Jeu Kréyol — la boîte à jeux */
const GAMES=[
 {href:'/',ico:'🌴',name:'Ti Bac Kréyol',txt:'Le petit bac de la culture antillaise, seul, à deux ou en ligne.',key:null},
 {href:'/jeux/mo.html',ico:'🔤',name:'Kréyol Mo',txt:'Le mot créole du jour, à deviner en 6 essais.',key:'mo'},
 {href:'/jeux/mele.html',ico:'🔎',name:'Mo mélé',txt:'Retrouve les mots cachés dans la grille.',key:['mele_easy','mele_normal','mele_hard']},
 {href:'/jeux/vraifaux.html',ico:'✅',name:'Vré ou fo ?',txt:'Vrai ou faux sur les Antilles et la Guyane, contre la montre.',key:'vf'},
 {href:'/jeux/pwoveb.html',ico:'💬',name:'Konbat Pwovèb',txt:'Complète les proverbes créoles et trouve leur sens.',key:'pw'},
 {href:'/jeux/kimoun.html',ico:'🕵🏾',name:'Ki moun ?',txt:'Devine la personnalité grâce aux indices.',key:'km'},
 {href:'/jeux/lakarte.html',ico:'🗺️',name:'Lakarté',txt:'Place les communes sur la carte.',key:['lk_MQ','lk_GP','lk_GF']}
];
const done=k=>k&&[].concat(k).some(x=>JK.doneToday(x));
document.getElementById('games').innerHTML=GAMES.map(g=>g.soon?`<div class="game" aria-disabled="true" style="opacity:.55"><span class="tag">Bientôt</span><span class="ico" aria-hidden="true">${g.ico}</span><b>${g.name}</b><span>${g.txt}</span></div>`
 :`<a class="game" href="${g.href}"><span class="tag ${done(g.key)?'ok':''}">${done(g.key)?'✓ Fait aujourd\'hui':g.key?'Défi du jour':'Jouer'}</span><span class="ico" aria-hidden="true">${g.ico}</span><b>${g.name}</b><span>${g.txt}</span></a>`).join('');
JK.header('','');
