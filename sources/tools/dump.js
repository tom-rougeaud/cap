const D=process.argv[2];const {MCVT}=require(`/home/claude/${D}/shared/train.js`); require(`/home/claude/${D}/shared/mech.js`);
const fnv=s=>{let h=2166136261;for(const ch of s){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0};
for(const k of Object.keys(MCVT.MECH)){const [c,i]=k.split('.');const m=MCVT.mech(c,+i,fnv(c+'-m'+i));
 console.log('## '+k+' '+m.titre); m.items.forEach(x=>console.log('  '+x.k+') '+x.t.replace(/<[^>]*>/g,'').replace(/\\\(|\\\)/g,'')+'  =>  '+x.a.replace(/<[^>]*>/g,'')));}
