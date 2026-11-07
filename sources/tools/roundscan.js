const D=process.argv[2];const {MCVT}=require(`/home/claude/${D}/shared/train.js`); require(`/home/claude/${D}/shared/mech.js`);
const seen={};
for(const k of Object.keys(MCVT.MECH)){const [c,i]=k.split('.');
 for(let s=1;s<=300;s++){const m=MCVT.mech(c,+i,s*104729);
  m.items.forEach(it=>{ if(it.tol==null) return; const t=it.t.replace(/<[^>]*>/g,'');
    if(!/arrondi|arrondis|environ|au (dixième|centième|millième|degré|entier)|à (0|1)/i.test(t)){ const key=k+' | '+t.replace(/\d+([,.]\d+)?/g,'#'); if(!seen[key]) seen[key]={n:0,ex:t+'  =>  '+it.a}; seen[key].n++; } }); } }
const ks=Object.keys(seen); console.log(D,ks.length,'gabarits avec tolérance mais sans consigne d’arrondi');
ks.slice(0,15).forEach(k=>console.log(' -',k.split(' | ')[0],'×'+seen[k].n,'·',seen[k].ex.slice(0,150)));
