/* contrôle des tolérances de l'appli pour les évaluations (chapitres) et les CCF blancs : exact → 1e-9 ; arrondi annoncé → demi-unité du rang */
const chk=()=>{};
const D=require('../content')(chk), S=require('../content/ccf3')(chk);
const strip=t=>String(t||'').replace(/<[^>]*>/g,' ');
const RANK=[[/à l[’']unité|à l[’']entier|à l[’']unité près/i,0],[/au dixième/i,1],[/au centième|au centime/i,2],[/au millième/i,3]];
const rk=t=>{for(const [r,d] of RANK) if(r.test(t)) return d; return null};
const out=[];
const qs=[];
D.forEach(c=>{[...c.eval.auto,...c.eval.exos.flatMap(x=>x.qs)].forEach(q=>qs.push([c.id+' éval',q]))});
S.forEach(s=>{[...s.auto,...s.exos.flatMap(x=>x.qs)].forEach(q=>qs.push(['ccf '+s.id,q]))});
let n=0;
qs.forEach(([w,q],i)=>{ if(q.v==null) return; n++;
  const intro=''; const t=strip(q.t); const d=rk(t); const v=q.v;
  const dec=Math.abs(v*1000-Math.round(v*1000))<1e-6; // décimal exact ≤ 3 chiffres
  const exact=dec; const want = d!=null ? 0.5*Math.pow(10,-d)+1e-9 : (exact?1e-9:null);
  const tol=q.tol;
  let pb=null;
  if(d!=null){ if(Math.abs((q.tol||0)-want)>1e-6) pb='arrondi annoncé rang '+d+' : tol '+tol+' ≠ '+want; }
  else if(!exact){ pb='valeur non décimale sans arrondi annoncé (fraction ?) tol '+tol; }
  else if(tol>1e-6) pb='valeur exacte acceptée à '+tol+' près';
  if(pb) out.push([w,t.slice(0,90),v,pb]);
});
console.log('questions numériques :',n,'· à corriger :',out.length);
out.forEach(o=>console.log(o.join(' | ')));
