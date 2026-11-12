const path=require('path');const S=path.join(__dirname,'..');const DATA=require(path.join(S,'content/index.js'))(()=>{});const {MCVT}=require(path.join(S,'shared/train.js'));require(path.join(S,'shared/mech.js'));
const seedOf=s=>{let h=2166136261;for(const ch of s){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0};const st=h=>String(h||'').replace(/<svg[\s\S]*?<\/svg>/g,'[figure]').replace(/data-a="[^"]*"/g,'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
const c=DATA.find(x=>x.id===process.argv[2]);
c.notions.forEach((n,i)=>console.log(`N${i+1} ${n.titre} :: ${st(n.decouvre.txt)}`));
c.entraine.filter(e=>!e.niv).forEach(e=>{const g=MCVT.tr(e.gen,seedOf(c.id+'-'+e.id));console.log(`\nEX ${e.id} n${e.lc} « ${g.titre} » ${st(g.consigne)} || ${st(g.support)} || R: ${g.items.map(i=>i.k+'='+i.a).join(' ; ')}`)});
c.probs.forEach(p=>console.log(`\nPB ${p.id} n${p.lc} « ${p.titre} » ${st(p.intro).slice(0,600)} || ${p.qs.map(q=>q.l+' '+st(q.t)+' → '+st(q.a)).join(' | ')}`));
console.log('\nRESOLU',st(c.resolus[0].enonce));
