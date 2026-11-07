const fs=require('fs'),os=require('os'),path=require('path');
const D=process.argv[2]; const dir=`/home/claude/${D}/shared/`;
// copie du dossier shared avec un num() instrumenté
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'sh-')); fs.cpSync(dir,tmp,{recursive:true});
let s=fs.readFileSync(tmp+'/mech.js','utf8');
s=s.replace(/const num = \(t, v, d, u\) =>/, "const num0 = (t, v, d, u) =>");
s=s.replace(/(const num0 = [^\n]*\n)/, "$1  const num = (t, v, d, u) => { const r = num0(t, v, d, u); if (Math.abs(v - rnd(v, d)) > 1e-9) r.inexact = true; return r; };\n");
fs.writeFileSync(tmp+'/mech.js',s);
const { MCVT } = require(tmp+'/train.js'); require(tmp+'/mech.js');
const seen={}; const ROUND=/arrondi|arrondis|environ|au (dixième|centième|millième|degré|entier)|à (0|1)|valeur approchée/i;
for(const k of Object.keys(MCVT.MECH)){const [c,i]=k.split('.');
 for(let sd=1;sd<=1500;sd++){ const m=MCVT.mech(c,+i,sd*104729);
  m.items.forEach(it=>{ if(!it.inexact) return; const t=it.t.replace(/<[^>]*>/g,''); if(ROUND.test(t)) return;
    const key=k+' | '+t.replace(/\d+([,.]\d+)?/g,'#'); if(!seen[key]) seen[key]={n:0,ex:t+'  =>  '+it.a}; seen[key].n++; }); } }
const ks=Object.keys(seen); console.log('=== ',D,':',ks.length,'gabarits à résultat non exact SANS consigne d’arrondi');
ks.forEach(k=>console.log(' -',k.split(' | ')[0],'×'+seen[k].n,'·',seen[k].ex.slice(0,170)));
