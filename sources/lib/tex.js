/* Formules : rendu KaTeX à la construction (aucun script de rendu dans l’appli ni dans le PDF).
   - \( … \) dans un texte → formule ;
   - les formules encadrées FX('…') des chapitres 1 à 7 sont remplacées par leur écriture mathématique (table FXTEX). */
'use strict';
const katex = require('katex');
const R = String.raw;
const FXTEX = {
  // chapitre 1
  'quantité × t ÷ 100': R`\text{quantité}\times\dfrac{t}{100}`,
  'partie ÷ total': R`\dfrac{\text{partie}}{\text{total}}`,
  '× (1 + t ÷ 100)': R`\times\left(1+\dfrac{t}{100}\right)`,
  '× (1 − t ÷ 100)': R`\times\left(1-\dfrac{t}{100}\right)`,
  't = (V<sub>1</sub> − V<sub>0</sub>) ÷ V<sub>0</sub>': R`t=\dfrac{V_1-V_0}{V_0}`,
  'CM = CM<sub>1</sub> × CM<sub>2</sub>': R`\text{CM}=\text{CM}_1\times\text{CM}_2`,
  'V<sub>0</sub> = V<sub>1</sub> ÷ CM': R`V_0=\dfrac{V_1}{\text{CM}}`,
  'TVA = prix HT × taux': R`\text{TVA}=\text{prix HT}\times\text{taux}`,
  'TTC = HT × (1 + taux)': R`\text{TTC}=\text{HT}\times(1+\text{taux})`,
  'HT = TTC ÷ (1 + taux)': R`\text{HT}=\dfrac{\text{TTC}}{1+\text{taux}}`,
  'marge = prix de vente HT − coût d’achat HT': R`\text{marge}=\text{prix de vente HT}-\text{coût d’achat HT}`,
  'taux de marge = marge ÷ coût d’achat': R`\text{taux de marge}=\dfrac{\text{marge}}{\text{coût d’achat}}`,
  'taux de marque = marge ÷ prix de vente HT': R`\text{taux de marque}=\dfrac{\text{marge}}{\text{prix de vente HT}}`,
  // chapitre 2
  'fréquence = effectif ÷ effectif total': R`\text{fréquence}=\dfrac{\text{effectif}}{\text{effectif total}}`,
  'angle = fréquence × 360°': R`\text{angle}=\text{fréquence}\times 360^\circ`,
  'moyenne = somme des valeurs ÷ effectif total': R`\bar{x}=\dfrac{\text{somme des valeurs}}{\text{effectif total}}`,
  '(n<sub>1</sub>x<sub>1</sub> + n<sub>2</sub>x<sub>2</sub> + …) ÷ N': R`\bar{x}=\dfrac{n_1x_1+n_2x_2+\dots}{N}`,
  'Q<sub>1</sub>': R`Q_1`, 'Q<sub>3</sub>': R`Q_3`,
  'étendue = max − min': R`\text{étendue}=\max-\min`,
  'écart interquartile = Q<sub>3</sub> − Q<sub>1</sub>': R`\text{écart interquartile}=Q_3-Q_1`,
  'écart type σ': R`\text{écart type }\sigma`,
  // chapitre 3
  '[a ; b]': R`[\,a\,;\,b\,]`, ']a ; b[': R`]\,a\,;\,b\,[`, '[a ; +∞[': R`[\,a\,;\,+\infty\,[`, ']−∞ ; b[': R`]\,-\infty\,;\,b\,[`,
  // chapitre 4
  'montant brut = quantité × prix unitaire HT': R`\text{montant brut}=\text{quantité}\times\text{prix unitaire HT}`,
  'I = C × t × n': R`I=C\times t\times n`,
  'valeur acquise A = C + I': R`\text{valeur acquise } A=C+I`,
  't = I ÷ (C × n)': R`t=\dfrac{I}{C\times n}`,
  'n = I ÷ (C × t)': R`n=\dfrac{I}{C\times t}`,
  // chapitre 5
  'f(x)': R`f(x)`, 'f(x) = ax': R`f(x)=ax`, 'f(x) = ax + b': R`f(x)=ax+b`, 'a': R`a`, 'b': R`b`, 'f(x) = x²': R`f(x)=x^2`, 'f(x) = c': R`f(x)=c`,
  // chapitre 6
  'P(A) = issues favorables ÷ issues possibles': R`P(A)=\dfrac{\text{nombre d’issues favorables}}{\text{nombre d’issues possibles}}`,
  'P(Ā) = 1 − P(A)': R`P(\overline{A})=1-P(A)`,
  'fréquence = nombre de réalisations ÷ nombre d’essais': R`f=\dfrac{\text{nombre de réalisations}}{\text{nombre d’essais}}`,
  // chapitre 7
  'V = L × l × h': R`V=L\times l\times h`, 'V = a³': R`V=a^3`, 'V = π × r² × h': R`V=\pi\times r^2\times h`, '1 dm³ = 1 L': R`1\ \text{dm}^3=1\ \text{L}`,
  'A = L × l': R`\mathcal{A}=L\times l`, 'A = base × hauteur ÷ 2': R`\mathcal{A}=\dfrac{\text{base}\times\text{hauteur}}{2}`, 'A = π × r²': R`\mathcal{A}=\pi\times r^2`,
  'périmètre = 2 × π × r': R`\text{périmètre}=2\times\pi\times r`, 'hypoténuse² = côté² + côté²': R`\text{hypoténuse}^2=\text{côté}^2+\text{côté}^2`,
  'AM ÷ AB = AN ÷ AC = MN ÷ BC': R`\dfrac{AM}{AB}=\dfrac{AN}{AC}=\dfrac{MN}{BC}`, 'k': R`k`, 'k²': R`k^2`, 'k³': R`k^3`,
  '(MN) parallèle à (BC)': R`(MN)\parallel(BC)`
};
/* formules des fiches du glossaire (champ « formule ») */
const WTEX = {
  't = (V₁ − V₀) ÷ V₀': R`t=\dfrac{V_1-V_0}{V_0}`,
  'x̄ = (x₁ + x₂ + …) ÷ N': R`\bar{x}=\dfrac{x_1+x_2+\dots}{N}`,
  'TTC = HT × (1 + taux)': R`\text{TTC}=\text{HT}\times(1+\text{taux})`,
  'I = C × t × n': R`I=C\times t\times n`, 'A = C + I': R`A=C+I`
};
const plain = h => h.replace(/<sub>(.*?)<\/sub>/g, '$1').replace(/<[^>]+>/g, '');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
/* lecture à voix haute : écriture simple de la formule */
const speakOf = tex => tex.replace(/\\dfrac\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g, '($1) divisé par ($2)').replace(/\\text\{([^}]*)\}/g, '$1').replace(/\\times/g, ' fois ').replace(/\\left|\\right|\\,|\\ |\\mathcal|\\bar|\\overline/g, ' ').replace(/[{}\\]/g, ' ').replace(/\^2/g, ' au carré').replace(/\^3/g, ' au cube').replace(/_(\w)/g, ' $1').replace(/\s+/g, ' ').trim();
const kx = (tex, display = false) => `<span class="kx" role="img" aria-label="${esc(speakOf(tex))}" data-t="${esc(speakOf(tex))}">${katex.renderToString(tex, { throwOnError: true, output: 'html', strict: false, displayMode: display })}</span>`;
let used = 0;
function texify(s) {
  if (typeof s !== 'string') return s;
  let o = s.replace(/<span class="fx">([\s\S]*?)<\/span>/g, (m, inner) => { const t = FXTEX[inner]; if (!t) return m; used++; return `<span class="fx">${kx(t)}</span>`; });
  o = o.replace(/\\\[([\s\S]+?)\\\]/g, (m, t) => { used++; return kx(t, true); }).replace(/\\\(([\s\S]+?)\\\)/g, (m, t) => { used++; return kx(t); });
  return o;
}
const deep = v => typeof v === 'string' ? texify(v) : Array.isArray(v) ? v.map(deep) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, k === 'formule' && WTEX[x] ? `<span class="fx">${kx(WTEX[x])}</span>` : deep(x)])) : v;
/* feuille de style KaTeX + uniquement les polices utilisées, embarquées (pas de CDN) */
function css() {
  const fs = require('fs'), path = require('path'), dir = path.dirname(require.resolve('katex/dist/katex.min.css'));
  let c = fs.readFileSync(path.join(dir, 'katex.min.css'), 'utf8');
  const keep = ['Main-Regular', 'Main-Bold', 'Main-Italic', 'Math-Italic', 'Size1-Regular', 'Size2-Regular', 'AMS-Regular', 'Caligraphic-Regular'];
  c = c.replace(/@font-face\{[^}]*\}/g, ff => { const m = ff.match(/KaTeX_([A-Za-z0-9]+)-([A-Za-z]+)\.woff2/); const name = m && `${m[1]}-${m[2]}`; if (!m || !keep.includes(name)) return '';
    const b64 = fs.readFileSync(path.join(dir, 'fonts', `KaTeX_${name}.woff2`)).toString('base64');
    return ff.replace(/src:[^;}]*/, `src:url(data:font/woff2;base64,${b64}) format("woff2")`); });
  return c + `\n.katex{font-size:1.06em}.katex .text,.katex .text .mord{font-family:'Andika','Noto Color Emoji','DejaVu Sans',sans-serif!important}.fx .katex{font-size:1em}.kx{display:inline-block}`;
}
module.exports = { texify, deep, kx, css, FXTEX, stats: () => used };
