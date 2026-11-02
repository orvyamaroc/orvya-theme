// Construit dist/orvya.min.css et dist/orvya.min.js, le design de la boutique ORVYA charge par le code du head EasyOrders.
//
// La feuille de style de la maquette (../orvya-redesign-preview.html) est reprise TELLE QUELLE, sans retaper une seule
// valeur : chaque regle est seulement limitee aux elements ORVYA (prefixe « .ov »), pour ne jamais toucher le theme
// EasyOrders par accident. Ensuite viennent src/orvya.css (raccords avec la boutique) et src/orvya.js (comportements).
//
// Utilisation : node build.js   (outils terser, csso et css-tree repris de ../head-code/node_modules)
const fs = require('fs');
const path = require('path');
const NM = path.join(__dirname, '..', 'head-code', 'node_modules');
const csstree = require(path.join(NM, 'css-tree'));
const csso = require(path.join(NM, 'csso'));
const { minify } = require(path.join(NM, 'terser'));

const MOCKUP = path.join(__dirname, '..', 'orvya-redesign-preview.html');
const ROOT = '.ov';

// Regles de la maquette qui n'ont pas de sens sur la boutique (outils de revue, produits de demonstration, transitions
// de l'application a page unique) : non reprises.
const DROP = [/^\.review/, /^\.switch/, /^\.placeholder-note/, /^\.demo-flag/, /\.badge--demo/, /^#header/, /^main\b/, /^\.skip\b/, /^html$/];

function scopeSelector(sel) {
  sel = sel.trim();
  if (DROP.some(re => re.test(sel)) || /.review(?!s)/.test(sel)) return null;
  if (sel === ':root') return sel;
  if (sel === 'body') return ROOT;                                   // fond, couleur et police de base : sur nos blocs seulement
  if (/^(\*|\*::before|\*::after)$/.test(sel)) return sel === '*' ? `${ROOT},${ROOT} *` : `${ROOT} ${sel}`;
  // etats de page : body.is-locked, body.has-sticky... et html.rm -> classes sur <html> (hors de React)
  let m = sel.match(/^body\.([\w-]+)(.*)$/);
  if (m) return m[1] === 'is-locked' ? `html.ov-locked` : (m[2].trim() ? `html.ov-${m[1]} ${ROOT} ${m[2].trim()}` : `html.ov-${m[1]}`);
  m = sel.match(/^html\.rm(.*)$/);
  if (m) return `html.ov-rm ${ROOT}${m[1].trim() ? ' ' + m[1].trim() : ''}`;
  return `${ROOT} ${sel}`;
}

function scopeMockupCss(css) {
  const ast = csstree.parse(css);
  const names = new Set();
  csstree.walk(ast, { visit: 'Atrule', enter(n) { if (n.name === 'keyframes') names.add(csstree.generate(n.prelude)); } });
  csstree.walk(ast, {
    visit: 'Rule',
    enter(node, item, list) {
      if (this.atrule && /keyframes/.test(this.atrule.name)) return;
      const sels = csstree.generate(node.prelude).split(/,(?![^(]*\))/);
      if (sels.some(s => /::view-transition/.test(s))) { list.remove(item); return; }
      const out = sels.map(scopeSelector).filter(Boolean);
      if (!out.length) { list.remove(item); return; }
      node.prelude = csstree.parse(out.join(','), { context: 'selectorList' });
    }
  });
  // animations : noms prefixes « ov- » pour ne jamais remplacer celles du theme (spin, rise...)
  csstree.walk(ast, {
    enter(node) {
      if (node.type === 'Atrule' && node.name === 'keyframes') node.prelude = csstree.parse('ov-' + csstree.generate(node.prelude), { context: 'atrulePrelude', atrule: 'keyframes' });
      if (node.type === 'Declaration' && /^(animation|animation-name)$/.test(node.property)) {
        csstree.walk(node.value, { visit: 'Identifier', enter(id) { if (names.has(id.name)) id.name = 'ov-' + id.name; } });
      }
    }
  });
  // @media vides apres suppression
  csstree.walk(ast, { visit: 'Atrule', enter(n, item, list) { if (n.block && n.block.children && n.block.children.isEmpty && list) list.remove(item); } });
  return csstree.generate(ast);
}

(async () => {
  const html = fs.readFileSync(MOCKUP, 'utf8');
  const mockCss = html.match(/<style>([\s\S]*?)<\/style>/)[1];
  const own = fs.readFileSync(path.join(__dirname, 'src', 'orvya.css'), 'utf8');
  const css = csso.minify(scopeMockupCss(mockCss) + '\n' + own, { restructure: false, comments: false }).css;
  fs.writeFileSync(path.join(__dirname, 'dist', 'orvya.min.css'), css);
  const js = await minify(fs.readFileSync(path.join(__dirname, 'src', 'orvya.js'), 'utf8'), { compress: { passes: 2 }, mangle: true, format: { comments: false } });
  fs.writeFileSync(path.join(__dirname, 'dist', 'orvya.min.js'), js.code);
  const kb = s => (Buffer.byteLength(s) / 1024).toFixed(1) + ' Ko';
  console.log('orvya.min.css', kb(css), '| orvya.min.js', kb(js.code));
})().catch(e => { console.error('ECHEC :', e.message); process.exit(1); });
