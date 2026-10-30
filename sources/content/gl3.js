/* CAP Maths — glossaire visuel : un schéma exact par mot (viewBox 288 × 120), une définition, une phrase d’usage. */
'use strict';
const { MCVP } = require('../shared/g1.js');
const { esc } = require('../lib/visu');
const gp = (o, f) => { const g = MCVP.plot({ W: 288, H: 120, ml: 36, mr: 10, mt: 10, mb: 24, fs: 10, lx: 1, ly: 1, ...o }); return g.wrap(g.base + f(g)); };
const sv = (body, lab) => `<svg viewBox="0 0 288 120" class="pic" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(lab)}">${body}</svg>`;
const t = (x, y, s, o = {}) => MCVP.T(x, y, s, { fs: 12, ...o });
const box = (x, y, w, h, cls = 'k2') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" class="${cls} ks" stroke-width="1.8"/>`;
const W = (id, mot, pic, def, phrase, o = {}) => ({ id, mot, pic, def, phrase, ...o });
module.exports = id => require('./gl_' + id)({ gp, sv, t, box, W, MCVP });
