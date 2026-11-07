const D=process.argv[2];const {MCVT}=require(`/home/claude/${D}/shared/train.js`);
const MC=require(`/home/claude/${D}/shared/gens.js`).MCVG;
const strip=h=>String(h||'').replace(/<[^>]*>/g,' ');
const ROUND=/arrondi|arrondis|arrondir|environ|au (dixième|centième|millième|degré|entier|centime)|à (0|1)|valeur approchée|unité près|près/i;
const num=a=>{const t=strip(a).replace(/[−–]/g,'-').replace(/(\d)[\s  ](?=\d{3}\b)/g,'$1').replace(/,/g,'.');const m=t.match(/-?\d+(?:\.\d+)?(?:\/\d+)?/g);if(!m)return NaN;const l=m[m.length-1];return l.includes('/')?+l.split('/')[0]/+l.split('/')[1]:+l;};
const seen={};
for(const id of Object.keys(MCVT.TR)) for(let s=1;s<=300;s++){ let e; try{e=MCVT.tr(id,s);}catch(x){continue}
  const ctx=strip(e.consigne)+' '+strip(e.support)+' '+(e.extra?strip(e.extra):'');
  e.items.forEach(it=>{ if(it.qcm||it.v==null) return; const av=num(it.a); if(!Number.isFinite(av)) return;
    // résultat affiché ≠ valeur exacte attendue -> arrondi implicite
    if(Math.abs(av-it.v)>1e-9 && Math.abs(av-it.v)<=(it.tol||1e-6)+1e-9){ const t=ctx+' '+strip(it.t||it.q||'');
      if(!ROUND.test(t)){ const key=id; if(!seen[key]) seen[key]={n:0,ex:(strip(e.consigne)).slice(0,110)+' ['+it.k+'] => '+strip(it.a).slice(0,60)+' (v='+it.v+')'}; seen[key].n++; } } }); }
const ks=Object.keys(seen);console.log('==',D,ks.length,'exercices avec réponse arrondie sans consigne d’arrondi');ks.slice(0,12).forEach(k=>console.log(' -',k,'×'+seen[k].n,seen[k].ex));
