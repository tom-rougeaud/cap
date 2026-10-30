/* Couverture « Maths et MCV · 2de » : composition graphique façon manuel d’éditeur.
   Mosaïque de tuiles (pictogrammes sobres du commerce et des maths) + bloc titre. Sans personnage.
   viewBox 840 × 1188 (1 unité = 0,25 mm). */
'use strict';
const NAVY = '#2B2D7C', YEL = '#FFC233', INK = '#1D2240', W = '#FFFFFF';
const K = { blue: '#1D5FC2', green: '#1E7F45', red: '#C2332A', orange: '#B05200', violet: '#7438C0', teal: '#08767C', gold: '#755C00', navy2: '#4446B8' };
const T = (x, y, s, fs, o = {}) => `<text x="${x}" y="${y}" font-family="Inter" font-size="${fs}" font-weight="${o.w || 800}" fill="${o.f || W}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.ls ? ` letter-spacing="${o.ls}"` : ''}>${s}</text>`;
const tile = (x, y, w, h, c, inner) => `<g transform="translate(${x} ${y})"><rect width="${w}" height="${h}" rx="26" fill="${c}"/>${inner(w, h)}</g>`;
const SW = 'stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" fill="none"';

function cover() {
  let s = `<svg viewBox="0 0 840 1188" xmlns="http://www.w3.org/2000/svg" class="cvsvg">`;
  s += `<rect width="840" height="1188" fill="#F3F5FB"/>`;
  // bandeau haut
  s += `<rect width="840" height="110" fill="${NAVY}"/>` + T(56, 68, 'MATHÉMATIQUES', 24, { f: YEL, ls: 6 }) + T(784, 68, 'Seconde professionnelle', 22, { a: 'end', w: 700 });
  const g = 16, X0 = 40, Y0 = 136, cw = (840 - 2 * X0 - 3 * g) / 4, ch = 150;
  const cx = i => X0 + i * (cw + g), cy = j => Y0 + j * (ch + g), sw = n => n * cw + (n - 1) * g, sh = n => n * ch + (n - 1) * g;
  // 1. grand graphique en barres + courbe (2 × 2)
  s += tile(cx(0), cy(0), sw(2), sh(2), K.blue, (w, h) => {
    let r = `<line x1="60" y1="${h - 60}" x2="${w - 40}" y2="${h - 60}" ${SW}/><line x1="60" y1="50" x2="60" y2="${h - 60}" ${SW}/>`;
    const v = [70, 110, 95, 150, 175, 210], st = (w - 130) / v.length, bw = st * .62;
    v.forEach((t, i) => { r += `<rect x="${(84 + i * st).toFixed(1)}" y="${h - 60 - t}" width="${bw.toFixed(1)}" height="${t}" rx="6" fill="${i === 5 ? YEL : '#9DB9EA'}"/>`; });
    r += `<polyline points="${v.map((t, i) => `${(84 + i * st + bw / 2).toFixed(1)},${h - 74 - t}`).join(' ')}" ${SW.replace('#fff', YEL)}/>`;
    v.forEach((t, i) => { r += `<circle cx="${(84 + i * st + bw / 2).toFixed(1)}" cy="${h - 74 - t}" r="8" fill="${YEL}"/>`; });
    r += T(90, 76, '+ 12 %', 34);
    return r;
  });
  // 2. étiquette − 30 %
  s += tile(cx(2), cy(0), cw, ch, K.red, (w, h) => `<path d="M22 ${h / 2}L58 40H${w - 18}V${h - 40}H58Z" fill="#fff"/><circle cx="52" cy="${h / 2}" r="8" fill="${K.red}"/>` + T(w - 30, h / 2 + 11, '−30 %', 30, { f: K.red, a: 'end' }));
  // 3. × 1,2
  s += tile(cx(3), cy(0), cw, ch, YEL, (w, h) => T(w / 2, h / 2 + 8, '× 1,2', 50, { f: NAVY, a: 'middle' }) + T(w / 2, h / 2 + 46, 'HT → TTC', 19, { f: NAVY, a: 'middle', w: 700 }));
  // 4. ticket de caisse
  s += tile(cx(2), cy(1), cw, ch, K.teal, (w, h) => { let r = `<path d="M${w / 2 - 50} 22h100v${h - 50}l-12.5 10l-12.5 -10l-12.5 10l-12.5 -10l-12.5 10l-12.5 -10l-12.5 10l-12.5 -10z" fill="#fff"/>`; [44, 60, 76].forEach(y => { r += `<line x1="${w / 2 - 36}" y1="${y}" x2="${w / 2 + 36}" y2="${y}" stroke="#A9B2D3" stroke-width="5" stroke-linecap="round"/>`; }); r += `<line x1="${w / 2 - 36}" y1="96" x2="${w / 2 + 36}" y2="96" stroke="${K.teal}" stroke-width="7" stroke-linecap="round"/>` + T(w / 2, 120, 'TVA', 16, { f: K.teal, a: 'middle' }); return r; });
  // 5. diagramme circulaire
  s += tile(cx(3), cy(1), cw, ch, K.violet, (w, h) => `<circle cx="${w / 2}" cy="${h / 2}" r="50" fill="#C9A2FF"/><path d="M${w / 2} ${h / 2}V${h / 2 - 50}A50 50 0 0 1 ${w / 2 + 47.6} ${h / 2 + 15.5}Z" fill="#fff"/><path d="M${w / 2} ${h / 2}L${w / 2 + 47.6} ${h / 2 + 15.5}A50 50 0 0 1 ${w / 2 + 6} ${h / 2 + 49.6}Z" fill="${YEL}"/>`);
  // 6. sac de courses
  s += tile(cx(0), cy(2), cw, ch, K.green, (w, h) => `<path d="M${w / 2 - 46} 52h92l10 78h-112z" fill="#fff"/><path d="M${w / 2 - 22} 60v-14a22 22 0 0 1 44 0v14" ${SW}/>` + T(w / 2, 110, '€', 34, { f: K.green, a: 'middle' }));
  // 7. boîte à moustaches
  s += tile(cx(1), cy(2), cw, ch, K.orange, (w, h) => `<line x1="28" y1="${h / 2}" x2="${w - 28}" y2="${h / 2}" ${SW}/><line x1="28" y1="${h / 2 - 18}" x2="28" y2="${h / 2 + 18}" ${SW}/><line x1="${w - 28}" y1="${h / 2 - 18}" x2="${w - 28}" y2="${h / 2 + 18}" ${SW}/><rect x="${w * .3}" y="${h / 2 - 28}" width="${w * .38}" height="56" rx="6" fill="#fff"/><line x1="${w * .44}" y1="${h / 2 - 28}" x2="${w * .44}" y2="${h / 2 + 28}" stroke="${K.orange}" stroke-width="7"/>` + T(w / 2, h - 18, 'Q1 · Me · Q3', 16, { a: 'middle', w: 700 }));
  // 8. code-barres
  s += tile(cx(2), cy(2), cw, ch, INK, (w, h) => { let r = '', x = 36; [6, 3, 9, 3, 6, 12, 3, 6, 3, 9, 6, 3, 12, 3, 6, 9, 3, 6]. forEach((b, i) => { if (i % 2 === 0) r += `<rect x="${x}" y="34" width="${b}" height="70" fill="#fff"/>`; x += b + 3; }); return r + T(w / 2, 130, '3 760 123 456 789', 15, { a: 'middle', w: 700, f: '#C9D1EA' }); });
  // 9. Σ
  s += tile(cx(3), cy(2), cw, ch, K.navy2, (w, h) => T(w / 2, h / 2 + 30, 'Σ', 92, { a: 'middle' }));
  // 10. courbe d’une fonction + repère (largeur 2)
  s += tile(cx(0), cy(3), sw(2), ch, '#fff', (w, h) => { let r = `<rect width="${w}" height="${h}" rx="26" fill="#fff" stroke="#DCE2F2" stroke-width="3"/><line x1="40" y1="${h - 34}" x2="${w - 30}" y2="${h - 34}" stroke="${INK}" stroke-width="4"/><line x1="70" y1="20" x2="70" y2="${h - 20}" stroke="${INK}" stroke-width="4"/>`; let d = ''; for (let i = 0; i <= 40; i++) { const t = i / 40, x = 70 + t * (w - 110), y = h - 34 - 90 * t * t; d += (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1); } r += `<path d="${d}" stroke="${K.blue}" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M70 ${h - 54}L${w - 40} ${h - 104}" stroke="${K.red}" stroke-width="6" stroke-dasharray="14 10" fill="none"/>` + T(90, 44, 'f(x) = ax²', 22, { f: INK }); return r; });
  // 11. pourcentage géant
  s += tile(cx(2), cy(3), sw(2), ch, YEL, (w, h) => T(60, h / 2 + 34, '%', 100, { f: NAVY }) + T(170, h / 2 - 6, 'taux, marges,', 26, { f: NAVY }) + T(170, h / 2 + 28, 'remises, TVA', 26, { f: NAVY }));

  // bloc titre
  const ty = cy(4) + 10;
  s += `<rect x="40" y="${ty}" width="760" height="${1188 - ty - 40}" rx="30" fill="${NAVY}"/>`;
  s += `<rect x="84" y="${ty + 34}" width="176" height="52" rx="26" fill="${YEL}"/>` + T(172, ty + 69, '2de Bac Pro', 24, { f: NAVY, a: 'middle' });
  s += T(84, ty + 168, 'Maths et MCV', 90, { ls: -2 });
  s += `<rect x="84" y="${ty + 192}" width="120" height="10" rx="5" fill="${YEL}"/>`;
  s += T(84, ty + 246, 'Métiers de la relation client', 32, { w: 700 });
  s += T(84, ty + 284, 'Commerce · Vente · Accueil', 24, { f: YEL, w: 700 });
  s += T(760, ty + 284, 'Tom Rougeaud · CC BY-NC 4.0', 15, { a: 'end', w: 700, f: '#C9D1EA' });
  return s + '</svg>';
}
module.exports = { cover };
