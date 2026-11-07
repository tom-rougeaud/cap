const fs=require('fs'); const D=process.argv[2]; const P=`/home/claude/${D}/shared/`;
const { MCVT } = require(P+'train.js'); require(P+'mech.js'); const M=require(P+'gens.js').MCVG;
const src=fs.readFileSync(`/home/claude/${D}/app/app3.js`,'utf8');
const grab=name=>{ const i=src.indexOf('const '+name+' ='); let j=src.indexOf('\n  const ',i+5); const k=src.indexOf('\n  document.addEventListener',i); const end=Math.min(...[j,k].filter(x=>x>0)); return src.slice(i,end); };
const code=['mnorm','mnums','notIrr','mechJudge'].map(grab).join('\n');
const judge=new Function('M',code+'\nreturn mechJudge;')(M);
const fnv=s=>{let h=2166136261;for(const ch of s){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0};
let n=0,bad=0,shown=0,wrongAcc=0;
for(const k of Object.keys(MCVT.MECH)){ const [c,i]=k.split('.');
  for(let s=0;s<1500;s++){ const seed=s==0?fnv(`${c}-m${i}`):(s*2654435761>>>0)%1e9; const m=MCVT.mech(c,+i,seed);
    if(m.items.length!==4){bad++;console.log('✗ nb items',k,seed,m.items.length);}
    m.items.forEach(it=>{ n++;
      const typed=it.vs?it.vs.join(' ; '):it.irr?it.a:it.v!=null?String(it.v).replace('.',','):it.a;
      const r=judge(it,typed);
      if(r==='ko'){ bad++; if(shown++<6) console.log('✗ refusée',k,seed,it.t.slice(0,90),'| a=',it.a,'| tapé=',typed); }
      if(it.v!=null&&!it.vs){ const w=String(it.v+(Math.abs(it.v)<1?0.5:Math.max(1,Math.abs(it.v)*.1))).replace('.',','); if(judge(it,w)==='ok'){wrongAcc++; if(shown++<6) console.log('✗ fausse acceptée',k,seed,it.t.slice(0,80),it.a,w);} }
    }); } }
console.log(D,'· séries',Object.keys(MCVT.MECH).length,'· items',n,'· bonne réponse refusée',bad,'· fausses acceptées',wrongAcc);
