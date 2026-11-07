const D=process.argv[2];const {MCVT}=require(`/home/claude/${D}/shared/train.js`); require(`/home/claude/${D}/shared/mech.js`);
const seen={};
for(const k of Object.keys(MCVT.MECH)){const [c,i]=k.split('.');
 for(let s=1;s<=1500;s++){const m=MCVT.mech(c,+i,s*104729);
  m.items.forEach(it=>{ if(it.v==null||it.v>=0) return; const t=it.t.replace(/<[^>]*>/g,'');
   if(/négatif|diminue|baisse|variation|taux d’évolution|rÃ©sultat|résultat|f\(|C\(|P\(|puissance|log|ln|Δ|−|marge sur|différence|u₁ − u₀|u₄ − u₃|ordonn|abscisse|coordonn|pente|solution/i.test(t)) return;
   const key=k+' | '+t.replace(/\d+([,.]\d+)?/g,'#'); if(!seen[key]) seen[key]={n:0,ex:t+' => '+it.a}; seen[key].n++; }); } }
const ks=Object.keys(seen); console.log('==',D,ks.length,'gabarits à réponse négative suspecte');
ks.forEach(k=>console.log(' -',k.split(' | ')[0],'×'+seen[k].n,seen[k].ex.slice(0,160)));
