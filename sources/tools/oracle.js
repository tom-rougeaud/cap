const P='/home/claude/mcv3/shared/'; const { MCVT } = require(P+'train.js'); require(P+'mech.js');
const num=s=>+String(s).replace(/[−–]/g,'-').replace(/(\d)[\s  ](?=\d{3}\b)/g,'$1').replace(',','.');
const strip=t=>t.replace(/<[^>]*>/g,'');
const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
const fam=[
 [/médiane de la série ([\d ;]+)\./,(m)=>{const a=m[1].split(';').map(num).sort((x,y)=>x-y),n=a.length;return n%2?a[(n-1)/2]:(a[n/2-1]+a[n/2])/2}],
 [/étendue de la série ([\d ;]+)\./,(m)=>{const a=m[1].split(';').map(num);return Math.max(...a)-Math.min(...a)}],
 [/moyenne des nombres ([\d ;]+)\./,(m)=>{const a=m[1].split(';').map(num);return a.reduce((x,y)=>x+y,0)/a.length},0.05+1e-9],
 [/Calcule (\d+) % de (\d+)\./,(m)=>+m[1]*+m[2]/100],
 [/PGCD \(plus grand diviseur commun\) de (\d+) et (\d+)/,(m)=>gcd(+m[1],+m[2])],
 [/plus grand diviseur commun de (\d+) et (\d+)/,(m)=>gcd(+m[1],+m[2])],
 [/Résous l’équation (\d+)x \+ (\d+) = (\d+)\./,(m)=>(+m[3]-+m[2])/+m[1]],
 [/Calcule la longueur BC \(l’hypoténuse\)\./,null],
 [/On a AB = (\d+) cm et AC = (\d+) cm\. Calcule la longueur BC/,(m)=>Math.hypot(+m[1],+m[2]),0.05+1e-9],
 [/Convertis (\d+) km\/h en m\/s/,(m)=>+m[1]/3.6],
 [/Calcule le volume d’un cylindre de rayon (\d+) cm et de hauteur (\d+) cm/,(m)=>Math.PI*m[1]*m[1]*m[2],0.05+1e-9],
 [/Calcule le volume d’un cône de rayon (\d+) cm et de hauteur (\d+) cm/,(m)=>Math.PI*m[1]*m[1]*m[2]/3,0.05+1e-9],
 [/volume d’une boule de rayon (\d+) cm/,(m)=>4/3*Math.PI*m[1]**3,0.05+1e-9],
 [/aire d’une sphère de rayon (\d+) cm/,(m)=>4*Math.PI*m[1]**2,0.05+1e-9],
 [/Calcule (\d+)\/(\d+) \+ (\d+)\/(\d+)\./,(m)=>m[1]/m[2]+m[3]/m[4]],
 [/Calcule (\d+)\/(\d+) − (\d+)\/(\d+)\./,(m)=>m[1]/m[2]-m[3]/m[4]],
 [/Simplifie la fraction (\d+)\/(\d+)/,(m)=>m[1]/m[2]],
 [/Une voiture roule à la vitesse constante de (\d+) km\/h pendant (\d+) h/,(m)=>m[1]*m[2]],
];
const cnt={},bad=[];let tot=0;
for(const k of Object.keys(MCVT.MECH)){const [c,i]=k.split('.');
 for(let s=1;s<=2000;s++){const m=MCVT.mech(c,+i,s*7919);
  m.items.forEach(it=>{ if(it.v==null) return; const t=strip(it.t);
   fam.forEach(([re,fn,tol],ix)=>{ if(!fn) return; const mm=re.exec(t); if(!mm) return; tot++; cnt[ix]=(cnt[ix]||0)+1;
     const exp=fn(mm); const tl=Math.max(it.tol||0,tol||0,1e-6); if(Math.abs(exp-it.v)>tl){ bad.push([k,t.slice(0,80),exp,it.v,it.a]); } }); }); } }
console.log('items vérifiés par un calcul indépendant :',tot,'· écarts :',bad.length,'· familles couvertes :',Object.keys(cnt).length);
bad.slice(0,8).forEach(b=>console.log(b));
