/* Surligne les données chiffrées d’un texte HTML (nombre + unité, €, %, °…), en dehors des balises déjà surlignées, des formules et des figures. */
'use strict';
const U = '(?:€|euros?|%|°C|°|km\\/h|m\\/s|Mbit\\/s|Mo|Go|cm[²³]?|mm[²³]?|km[²³]?|m[²³]|dm[²³]?|kg|mg|g|cL|mL|dL|L|litres?|heures?|h|min|minutes?|secondes?|s|jours?|mois|ans|cartes?|tomes?|badges?|pochettes?|pages?|épisodes?|séances?|places?|élèves|lots?|piles?)';
const RE = new RegExp('(\\d+(?:[  ]\\d{3})*(?:,\\d+)?)([  ]?' + U + ')(?![A-Za-zÀ-ÿ²³/])', 'g');
module.exports = h => {
  let skip = 0;
  return String(h).split(/(<[^>]*>)/).map(t => {
    if (t[0] === '<') { const m = /^<(\/?)(mark|svg|style|sup|span class="(?:kx|fx)")/.exec(t); if (m) skip += m[1] ? -1 : 1; return t; }
    return skip > 0 ? t : t.replace(RE, (x, n, u) => `<mark class="hl">${n}${u}</mark>`);
  }).join('');
};
