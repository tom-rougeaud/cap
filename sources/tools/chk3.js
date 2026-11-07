const P='/home/claude/mcvC/shared/';
const { MCVT } = require(P+'train.js'); require(P+'mech.js');
const MC = require(P+'gens.js').MCVG;
const gd=(a,b)=>b?gd(b,a%b):a;
const fmt=(x,d)=>{ let s=(d!=null?x.toFixed(d):String(Math.round(x*1e9)/1e9)); if(/e/.test(s)) s=x.toFixed(10).replace(/0+$/,'').replace(/\.$/,''); if(d==null&&s.includes('.')) s=s.replace(/0+$/,''); return s.replace('.',','); };
// valeur numérique lue dans la réponse affichée (dernier nombre ou fraction), décimaux à virgule, espaces fines
const readA=a=>{ const t=String(a).replace(/<[^>]*>/g,' ').replace(/[−–]/g,'-').replace(/(\d)[\s  ](?=\d{3}\b)/g,'$1').replace(/,/g,'.'); const m=t.match(/-?\d+(?:\.\d+)?(?:\s*\/\s*\d+)?/g)||[]; return m.map(x=>x.includes('/')?(+x.split('/')[0]/+x.split('/')[1]):+x); };
let n=0, bad=0, shown={};
const rep=(k,msg,it)=>{ bad++; shown[k]=(shown[k]||0)+1; if(shown[k]<=2) console.log('✗',k,msg,JSON.stringify({t:it.t,a:it.a,v:it.v,tol:it.tol,vs:it.vs}).slice(0,300)); };
function chk(where,it){ n++;
  if(it.qcm) return;
  if(it.v==null||!Number.isFinite(it.v)) return;
  const d=MC.dmaxOf(it.tol);
  let typed;
  if(it.irr){ const f=readA(it.a); typed=(String(it.a).match(/(\d+)\/(\d+)/)||[])[0]||fmt(it.v,d); } else typed=fmt(it.v,d);
  const v=MCVT.verdict(it,typed); if(!v.ok) rep(where.split(':')[0],'bonne réponse refusée ('+typed+')',it);
  // la correction affichée correspond à la valeur contrôlée
  const nums=readA(it.a); if(nums.length && !nums.some(x=>Math.abs(x-it.v)<=Math.max(it.tol||0,1e-6)+1e-9)) rep(where.split(':')[0],'correction affichée ≠ valeur contrôlée',it);
  // une réponse fausse est refusée
  const wrong=fmt(it.v+ (Math.abs(it.v)<1?0.5:Math.max(1,Math.abs(it.v)*0.1)),d); if(MCVT.verdict(it,wrong).ok) rep(where.split(':')[0],'réponse fausse acceptée ('+wrong+')',it);
}
for(const id of Object.keys(MCVT.TR)) for(let s=1;s<=400;s++){ const e=MCVT.tr(id,s); e.items.forEach(it=>chk(id+':'+s,it)); }
console.log('exercices visuels :',n,'items ·',bad,'anomalies');
let n2=n,b2=bad; n=0;bad=0;
for(const id of Object.keys(MCVT.DEP)) for(let s=1;s<=200;s++){ const e=MCVT.dep(id,s); e.qs.forEach(it=>chk('dep-'+id+':'+s,it)); }
console.log('points de départ :',n,'items ·',bad,'anomalies');
