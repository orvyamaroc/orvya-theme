/* ORVYA — design « L'heure dorée » sur la boutique EasyOrders (copie fidele de la maquette orvya-redesign-preview.html).
 *
 * Charge par le code du head EasyOrders (script defer : il s'execute une fois le HTML lu, avant le reste de l'application).
 *
 * Regle React (voir head-code) : rien n'est ajoute DANS l'application (#__next) avant qu'elle ait repris la page.
 *   [div.ov.ov-top : annonce, en-tete, page de la maquette]  [#__next : la boutique EasyOrders]  [div.ov : suite de page, pied, tiroirs]
 * Chaque page de la maquette est dessinee ici (accueil, collection, fiche produit, recherche, favoris, panier, pages d'aide, 404) ;
 * le contenu du theme est masque mais reste vivant en dessous : les vrais boutons EasyOrders font l'ajout au panier, la commande,
 * les avis. La page de commande garde le vrai formulaire EasyOrders (envoi, villes, verification anti-robot), habille comme la maquette.
 * Les produits viennent de l'API publique de la boutique : un nouveau produit apparait tout seul.
 */
(function () {
  'use strict';
  var d = document, w = window, root = d.documentElement;
  if (w.__ovTheme || location.pathname.indexOf('/home-builder') === 0 || (/[?&]ov=0/.test(location.search) && !w.__ovTest)) return;
  w.__ovTheme = 1;
  var next = d.getElementById('__next');
  if (!next || !d.body) return;

  /* ---------- 1. Donnees fixes (textes de la maquette) ---------- */
  var API = 'https://api.easy-orders.net/api/v1/';
  var CDN = OVS.CDN, WA = OVS.WA, WA_TRACK = OVS.WA_TRACK, LOGO = OVS.LOGO, CATS = OVS.CATS, ORDER = OVS.ORDER, PAGES = OVS.PAGES, I = OVS.I;
  var ASSETS = w.OV_ASSETS || (d.currentScript && d.currentScript.src || '').replace(/dist\/orvya\.min\.js.*$/, 'assets/');
  var INTRO = {
    bijoux: 'Bagues, colliers, bracelets et boucles d’oreilles en acier inoxydable à finition dorée.',
    bagues: 'Des bagues fines, à porter seules ou à accumuler.',
    colliers: 'Chaînes délicates et pendentifs qui illuminent le décolleté.',
    bracelets: 'Chaînes fines et détails lumineux pour le poignet.',
    'boucles-oreilles': 'Créoles et boucles serties pour éclairer le visage.'
  };
  /* point du bijou sur chaque photo (vue « Détail » de la fiche produit), repris de la maquette */
  var CROP = { 'bague-solitaire-doree': ['50%', '58%'], 'collier-pendentif-zircon': ['42%', '74%'], 'creoles-dorees-zircons': ['57%', '61%'], 'bracelet-chaine-perlee-doree': ['56%', '60%'] };
  var FAQ = [
    ['Quels sont les délais de livraison ?', 'Après confirmation de votre commande par téléphone, votre bijou vous parvient en 2 à 4 jours ouvrés selon votre ville. La livraison est offerte partout au Maroc.'],
    ['Comment se fait le paiement ?', 'En espèces, à la livraison. Aucun paiement à l’avance.'],
    ['Puis-je ouvrir le colis avant de payer ?', 'Bien sûr. Ouvrez votre colis et découvrez votre bijou avant de régler.'],
    ['Comment entretenir mes bijoux ?', 'Rangez-les à l’abri de l’humidité et évitez le contact direct avec le parfum et les crèmes pour préserver leur éclat. Une question ? Écrivez-nous sur WhatsApp.'],
    ['Puis-je échanger ou retourner un bijou ?', 'Oui, sous 7 jours après réception, si le bijou est non porté, non endommagé et dans son emballage d’origine. Pour des raisons d’hygiène, les boucles d’oreilles ne sont ni reprises ni échangées, sauf défaut de fabrication.'],
    ['Mes bijoux sont-ils garantis ?', 'Oui, 2 ans. Si la finition dorée se dégrade dans des conditions d’utilisation normales, nous échangeons votre bijou gratuitement.']
  ];
  var PRICE_LABEL = { lt150: 'Moins de 150 MAD', '150-170': '150 à 170 MAD', gt170: 'Plus de 170 MAD' };
  var TAG_LABEL = { zircon: 'Zircon', perles: 'Perles' };

  /* ---------- 2. Utilitaires (repris de la maquette) ---------- */
  var reduceMq = w.matchMedia('(prefers-reduced-motion: reduce)');
  function reduced() { return reduceMq.matches; }
  if (reduced()) root.classList.add('ov-rm');
  function $(s, r) { return (r || d).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function fmt(n) { return Number(n).toLocaleString('fr-FR') + ' MAD'; }
  function norm(s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’']/g, ' '); }
  function plural(n, one, many) { return n + ' ' + (n > 1 ? many : one); }
  function img(src, alt, cls, extra) { return '<img src="' + src + '" alt="' + esc(alt) + '" class="fade-img ' + (cls || '') + '" loading="lazy" decoding="async" ' + (extra || '') + '>'; }
  function el(html) { var t = d.createElement('template'); t.innerHTML = html.trim(); return t.content.firstChild; }
  /* Titre decoupe en mots (animation « mots qui montent ») ; les mots entre [[ ]] passent en italique */
  function split(s) {
    var it = false, n = 0;
    return s.split(' ').map(function (tok) {
      var x = tok;
      if (x.indexOf('[[') === 0) { it = true; x = x.slice(2); }
      var end = /\]\]$/.test(x); if (end) x = x.slice(0, -2);
      var h = it ? '<em>' + x + '</em>' : x;
      if (end) it = false;
      return '<span class="w"><span style="--wi:' + (n++) + '">' + h + '</span></span>';
    }).join(' ');
  }
  function path() { return location.pathname.replace(/\/+$/, '') || '/'; }
  function nextData() { try { return w.__ovND || (w.__ovND = JSON.parse(d.getElementById('__NEXT_DATA__').textContent)); } catch (e) { return null; } }
  function waitFor(fn, ms) {
    return new Promise(function (res) {
      var t0 = Date.now();
      (function loop() { var v = fn(); if (v || Date.now() - t0 > ms) return res(v); setTimeout(loop, 60); })();
    });
  }
  function crumbs(list) {
    return '<nav class="crumbs" aria-label="Fil d’Ariane">' + list.map(function (c, i) { return i < list.length - 1 ? '<a href="' + c[1] + '">' + c[0] + '</a><span aria-hidden="true">/</span>' : '<span aria-current="page">' + c[0] + '</span>'; }).join('') + '</nav>';
  }
  function textOf(html) { var t = d.createElement('template'); t.innerHTML = html || ''; return t.content; }

  /* ---------- 3. En-tete et bandeau (maquette, liens de la boutique) ---------- */
  var top = d.getElementById('ov-top');
  if (!top) { top = el(OVS.top()); d.body.insertBefore(top, next); }
  root.classList.add('ov-on');
  var header = $('#ov-header', top);

  /* ---------- 4. Gabarits (maquette) ---------- */
  function trustItems() {
    return [[I.truck, 'Livraison offerte', 'Partout au Maroc'], [I.cash, 'Paiement à la livraison', 'En espèces, aucun paiement à l’avance'],
      [I.box, 'Ouvrez avant de payer', 'Vérifiez votre bijou à la réception'], [I.swap, 'Échange sous 7 jours', '<a class="link-u" href="' + PAGES.retours + '">Voir les conditions</a>']];
  }
  function rail(items, label, cls) {
    return '<div class="rail-wrap" data-rail><div class="rail ' + (cls || '') + '" tabindex="0" role="region" aria-label="' + esc(label) + ' (faites défiler horizontalement)">' + items + '</div>' +
      '<div class="wrap rail-ctrl"><div class="rail-progress" aria-hidden="true"><i></i></div><div class="rail-btns"><button class="round-btn" data-dir="-1" aria-label="Précédent">' + I.left + '</button><button class="round-btn" data-dir="1" aria-label="Suivant">' + I.right + '</button></div></div></div>';
  }
  function acc(title, body, open) {
    return '<div class="acc' + (open ? ' is-open' : '') + '"><button class="acc__btn" aria-expanded="' + !!open + '">' + title + '<span class="acc__ico" aria-hidden="true"></span></button><div class="acc__panel"><div class="acc__inner"><div class="acc__content">' + body + '</div></div></div></div>';
  }
  function catCard(k, i, n) {
    return '<a class="cat-card" href="/collections/' + k + '" data-rv style="--i:' + i + '"><div class="arch" data-rv="arch" style="--i:' + i + '">' + img(CATS[k].img, CATS[k].name) + '</div><h3 class="cat-card__name">' + CATS[k].name + '</h3><span class="cat-card__meta" data-count="' + k + '">' + (n == null ? 'Découvrir' : plural(n, 'pièce', 'pièces')) + ' ' + I.arrow + '</span></a>';
  }
  function favOn(id) { return wishIds().indexOf(id) >= 0; }
  function card(p, i) {
    var on = favOn(p.id);
    return '<article class="card" data-rv style="--i:' + (i % 4) + '" data-fly-root>' +
      '<a class="card__media" href="/products/' + p.slug + '" tabindex="-1" aria-hidden="true">' + img(p.img, p.name, 'card__img') + '</a>' +
      '<button class="fav' + (on ? ' is-on' : '') + '" data-fav="' + p.id + '" aria-pressed="' + on + '" aria-label="' + (on ? 'Retirer des' : 'Ajouter aux') + ' favoris : ' + esc(p.name) + '">' + I.heart + '</button>' +
      '<button class="card__quick" data-add="' + p.slug + '" aria-label="Ajouter au panier : ' + esc(p.name) + '">' + I.bag + '<span>Ajouter au panier</span></button>' +
      '<div class="card__body"><p class="card__cat">' + esc(p.cat) + '</p><h3 class="card__name"><a href="/products/' + p.slug + '">' + esc(p.name) + '</a></h3><p class="card__price">' + fmt(p.price) + '</p></div></article>';
  }
  function skelCard() { return '<div aria-hidden="true"><div class="skel" style="aspect-ratio:4/5"></div><div class="skel" style="height:10px;width:40%;margin-top:16px"></div><div class="skel" style="height:16px;width:75%;margin-top:10px"></div><div class="skel" style="height:12px;width:30%;margin-top:10px"></div></div>'; }
  function catChips() { return '<div class="chips">' + ORDER.map(function (k) { return '<a class="chip" href="/collections/' + k + '">' + CATS[k].name + '</a>'; }).join('') + '</div>'; }
  function emptyCart() {
    return '<div class="empty" style="padding:48px 8px"><div class="empty__ico">' + I.bag + '</div><h2>Votre panier est vide</h2><p>Laissez-vous tenter par nos pièces signature.</p>' + catChips() + '</div>';
  }

  /* ---------- 5. Donnees de la boutique (API publique EasyOrders) ---------- */
  var dataP = null;
  function tagsOf(s) { s = norm(s); var t = []; if (s.indexOf('zircon') >= 0) t.push('zircon'); if (s.indexOf('perle') >= 0) t.push('perles'); return t; }
  function catOf(cats) {
    var c = (cats || []).filter(function (c) { return c.slug !== 'bijoux'; })[0];
    return { slug: c ? c.slug : '', name: c ? (CATS[c.slug] ? CATS[c.slug].name : c.name) : '' };
  }
  function data() {
    if (dataP) return dataP;
    function get(u) { return fetch(API + u, { credentials: 'omit' }).then(function (r) { if (!r.ok) throw r.status; return r.json(); }).then(function (j) { return Array.isArray(j) ? j : (j.data || []); }); }
    dataP = get('products?fields=id,name,price,sale_price,slug,thumb,position,hidden,created_at,description,categories&join=categories&limit=200&sort=position,desc').then(function (list) {
      return list.filter(function (p) { return !p.hidden; }).map(function (p, i) {
        var c = catOf(p.categories), txt = textOf(p.description).textContent;
        return { id: p.id, name: p.name, slug: p.slug, price: p.sale_price || p.price, img: p.thumb, catSlug: c.slug, cat: c.name, rank: i, date: p.created_at || '', descHtml: p.description || '', text: txt, tags: tagsOf(p.name + ' ' + txt) };
      });
    }).catch(function () { return []; });
    return dataP;
  }
  function bySlug(list, slug) { return list.filter(function (p) { return p.slug === slug; })[0]; }

  /* ---------- 6. Accueil (maquette) ---------- */
  var home = null;
  function homeRest() {
    return '' +
    '<section class="trust" aria-label="Nos engagements"><div class="wrap">' + trustItems().map(function (t, i) { return '<div class="trust__item" data-rv="fade" style="--i:' + i + '">' + t[0] + '<div>' + t[1] + '<small>' + t[2] + '</small></div></div>'; }).join('') + '</div></section>' +
    '<section class="section"><div class="wrap section-head"><div><p class="eyebrow" data-rv>Collections</p><h2 class="h2 split" data-rv>' + split('Trouvez votre [[pièce]]') + '</h2></div><a class="link-arrow" href="/collections/bijoux" data-rv="fade">Tout voir ' + I.arrow + '</a></div>' +
      rail(ORDER.map(function (k, i) { return catCard(k, i, null); }).join(''), 'Collections') + '</section>' +
    '<section class="section" style="padding-top:0"><div class="wrap section-head"><div><p class="eyebrow" data-rv>Pièces signature</p><h2 class="h2 split" data-rv>' + split('Nos essentiels [[dorés]]') + '</h2></div><a class="link-arrow" href="/collections/bijoux" data-rv="fade">Voir tout ' + I.arrow + '</a></div>' +
      '<div id="ov-signature">' + rail([0, 1, 2, 3].map(skelCard).join(''), 'Pièces signature') + '</div></section>' +
    '<section class="section" style="padding-top:0"><div class="wrap edito"><div class="edito__media"><div class="arch" data-rv="arch">' + img(CATS.colliers.img, 'Colliers dorés sur un drapé bordeaux', '', 'data-parallax="0.05"') + '</div><span class="edito__ornament" aria-hidden="true"></span></div>' +
      '<div><p class="eyebrow" data-rv>Pourquoi ORVYA</p><h2 class="h2 split" data-rv>' + split('L’élégance [[au quotidien]]') + '</h2><span class="filet" data-rv="line"></span>' +
      '<p class="lead" style="margin-top:24px" data-rv>Des pièces raffinées, dessinées pour sublimer chaque tenue, du matin au soir.</p><ul class="engagements">' +
      '<li data-rv style="--i:0">' + I.drop + '<div><strong>Acier inoxydable 316L</strong><span>Finition dorée qui résiste à l’eau.</span></div></li>' +
      '<li data-rv style="--i:1">' + I.shield + '<div><strong>Garantie 2 ans</strong><span>Échange gratuit si la finition se dégrade en usage normal.</span></div></li>' +
      '<li data-rv style="--i:2">' + I.box + '<div><strong>Ouvrez avant de payer</strong><span>Découvrez votre bijou et assurez-vous qu’il vous plaît avant de régler.</span></div></li></ul>' +
      '<a class="link-arrow" style="margin-top:28px" href="' + PAGES.garantie + '" data-rv="fade">Nos engagements ' + I.arrow + '</a></div></div></section>' +
    '<section class="gift section"><span class="gift__pattern" aria-hidden="true"></span><div class="wrap gift__grid"><div>' +
      '<p class="eyebrow" data-rv>L’art d’offrir</p><h2 class="h2 split" data-rv>' + split('Un bijou se porte [[comme une signature]]') + '</h2>' +
      '<p class="lead" style="margin-top:24px" data-rv>Offrez-le à celle qui compte, ou offrez-vous ce luxe discret.</p>' +
      '<a class="btn btn--light" style="margin-top:32px" href="/collections/bijoux" data-rv="fade">Trouver le cadeau idéal</a></div>' +
      '<div class="arch" data-rv="arch">' + img(CATS.bracelets.img, 'Bracelets dorés sur un coussin noir', '', 'data-parallax="0.05"') + '</div></div></section>' +
    '<section class="section"><div class="wrap" style="max-width:820px"><div class="center" style="margin-bottom:40px"><p class="eyebrow" data-rv>Vos questions</p><h2 class="h2 split" data-rv>' + split('Tout savoir avant [[de commander]]') + '</h2><span class="filet" data-rv="line"></span></div>' +
      '<div data-rv>' + FAQ.slice(0, 5).map(function (q) { return acc(q[0], '<p>' + q[1] + '</p>'); }).join('') + '</div>' +
      '<p class="center" style="margin-top:32px"><a class="link-arrow" href="' + PAGES.faq + '">Toutes les questions ' + I.arrow + '</a></p></div></section>' +
    '<section class="news section--tight"><div class="wrap center" style="max-width:720px"><p class="eyebrow" data-rv>Rejoignez l’univers ORVYA</p>' +
      '<h2 class="h2" style="margin-top:12px" data-rv>Soyez la première informée</h2><p class="muted" style="margin-top:12px" data-rv>Nos nouvelles collections et nos offres privées, directement dans votre boîte mail.</p>' +
      '<form class="news__form" id="ov-news" data-rv novalidate><label class="sr-only" for="ov-news-mail">Votre adresse e-mail</label><input class="input" id="ov-news-mail" type="email" placeholder="Votre adresse e-mail" autocomplete="email" required><button class="btn">S’inscrire</button></form>' +
      '<small>En vous inscrivant, vous acceptez notre <a class="link-u" href="' + PAGES.confidentialite + '">politique de confidentialité</a>. Désinscription possible à tout moment.</small></div></section>';
  }
  /* le hero est deja la si le code du head l'a pose (premier affichage rapide) : on complete avec le reste de l'accueil */
  function syncHome() {
    var on = path() === '/';
    root.classList.toggle('ov-home', on);
    if (on && !home) {
      home = d.getElementById('ov-main');
      if (!home) { home = el('<main class="ov-home" id="ov-main">' + OVS.hero() + '</main>'); top.appendChild(home); }
      home.insertAdjacentHTML('beforeend', homeRest());
      data().then(fillHome); afterRender();
    }
    if (home) home.hidden = !on;
  }
  function fillHome(list) {
    if (!home) return;
    ORDER.forEach(function (k) {
      var n = list.filter(function (p) { return p.catSlug === k; }).length, m = $('[data-count="' + k + '"]', home);
      if (m && list.length) m.innerHTML = plural(n, 'pièce', 'pièces') + ' ' + I.arrow;
    });
    var box = $('#ov-signature', home);
    if (list.length) { box.innerHTML = rail(list.map(card).join(''), 'Pièces signature'); afterRender(); }
  }

  /* ---------- 7. Collection et recherche (maquette, meme moteur de filtres) ---------- */
  var filters = { cats: [], price: '', tags: [], sort: 'reco' }, gridBase = null;
  function filtered(base) {
    var f = filters;
    var list = base.filter(function (p) { return (!f.cats.length || f.cats.indexOf(p.catSlug) >= 0) && (!f.tags.length || f.tags.every(function (t) { return p.tags.indexOf(t) >= 0; })); });
    if (f.price === 'lt150') list = list.filter(function (p) { return p.price < 150; });
    if (f.price === '150-170') list = list.filter(function (p) { return p.price >= 150 && p.price <= 170; });
    if (f.price === 'gt170') list = list.filter(function (p) { return p.price > 170; });
    var s = f.sort;
    return list.slice().sort(function (a, b) { return s === 'asc' ? a.price - b.price : s === 'desc' ? b.price - a.price : s === 'new' ? b.date.localeCompare(a.date) : a.rank - b.rank; });
  }
  function nFilters() { return filters.cats.length + filters.tags.length + (filters.price ? 1 : 0); }
  function toolbar(count) {
    var f = filters, n = nFilters();
    function o(v, t) { return '<option value="' + v + '"' + (f.sort === v ? ' selected' : '') + '>' + t + '</option>'; }
    return '<div class="toolbar"><span class="toolbar__count" id="ov-count">' + (count == null ? '&nbsp;' : plural(count, 'pièce', 'pièces')) + '</span><div class="toolbar__actions">' +
      '<button class="chip" data-open="ov-filters">' + I.filter + ' Filtrer' + (n ? ' (' + n + ')' : '') + '</button>' +
      '<label class="sort"><span class="sr-only">Trier par</span><select id="ov-sort">' + o('reco', 'Recommandés') + o('new', 'Nouveautés') + o('asc', 'Prix croissant') + o('desc', 'Prix décroissant') + '</select></label></div></div>';
  }
  function activeChips(lockedCat) {
    var f = filters, out = [];
    f.cats.filter(function (c) { return c !== lockedCat; }).forEach(function (c) { out.push('<button class="chip is-on" data-unfilter="cat:' + c + '">' + CATS[c].name + ' ' + I.close + '</button>'); });
    f.tags.forEach(function (t) { out.push('<button class="chip is-on" data-unfilter="tag:' + t + '">' + TAG_LABEL[t] + ' ' + I.close + '</button>'); });
    if (f.price) out.push('<button class="chip is-on" data-unfilter="price">' + PRICE_LABEL[f.price] + ' ' + I.close + '</button>');
    return out.join('');
  }
  function gridHTML(list) {
    if (!list) return '<div class="grid grid--4">' + [0, 1, 2, 3].map(skelCard).join('') + '</div>';
    if (!list.length) return '<div class="empty"><div class="empty__ico">' + I.search + '</div><h2>Aucun bijou ne correspond</h2><p>Essayez d’enlever un filtre : notre collection s’agrandit régulièrement.</p><button class="btn" data-filter-reset>Effacer les filtres</button></div>';
    return '<div class="grid grid--4">' + list.map(card).join('') + '</div>';
  }
  function vCollection(slug) {
    var c = CATS[slug];
    return '<div class="wrap"><div class="coll-hero"><div>' + crumbs([['Accueil', '/'], [c.name]]) +
      '<h1 class="split" data-rv>' + split(esc(c.name)) + '</h1><p class="lead" style="margin-top:16px" data-rv>' + INTRO[slug] + '</p></div>' +
      '<div class="arch" data-rv="arch">' + img(c.img, c.name) + '</div></div>' +
      '<div class="cat-tabs" role="navigation" aria-label="Catégories"><a class="chip' + (slug === 'bijoux' ? ' is-on' : '') + '" href="/collections/bijoux">Tout</a>' +
      ORDER.map(function (k) { return '<a class="chip' + (slug === k ? ' is-on' : '') + '" href="/collections/' + k + '">' + CATS[k].name + '</a>'; }).join('') + '</div>' +
      toolbar(null) + '<div class="active-filters" id="ov-active">' + activeChips(slug) + '</div><div id="ov-grid" data-base="' + slug + '">' + gridHTML(null) + '</div><div id="ov-coll-note"></div></div>' +
      '<div style="height:96px"></div>';
  }
  function fillCollection(slug, list) {
    gridBase = { kind: 'cat', slug: slug, all: list };
    refreshGrid();
    var base = currentBase();
    var note = $('#ov-coll-note');
    if (note && base.length < 3) {
      note.innerHTML = '<div class="coll-note"><div class="section-head"><div><p class="eyebrow">À découvrir aussi</p><h2 class="h2" style="font-size:2rem">Complétez votre <em>parure</em></h2></div></div><div class="grid grid--4">' +
        list.filter(function (p) { return p.catSlug !== slug; }).map(card).join('') + '</div></div>';
    }
    afterRender();
  }
  function searchBase(q, all) {
    var terms = norm(q).split(/\s+/).filter(Boolean);
    return all.filter(function (p) { return terms.length && terms.every(function (t) { return norm([p.name, p.cat, p.text, p.tags.join(' ')].join(' ')).indexOf(t) >= 0; }); });
  }
  function vSearch(q) {
    return '<div class="wrap" style="padding-top:24px">' + crumbs([['Accueil', '/'], ['Recherche']]) +
      '<p class="eyebrow">Résultats pour</p><h1 class="h2" style="margin:8px 0 24px">« ' + esc(q) + ' »</h1><div id="ov-search-zone">' + gridHTML(null) + '</div></div><div style="height:96px"></div>';
  }
  function fillSearch(q, all) {
    var zone = $('#ov-search-zone'); if (!zone) return;
    var base = searchBase(q, all);
    gridBase = { kind: 'search', q: q, all: all };
    zone.innerHTML = base.length
      ? toolbar(null) + '<div class="active-filters" id="ov-active">' + activeChips() + '</div><div id="ov-grid">' + gridHTML(null) + '</div>'
      : '<div class="empty"><div class="empty__ico">' + I.search + '</div><h2>Aucun résultat pour « ' + esc(q) + ' »</h2><p>Vérifiez l’orthographe ou essayez un autre mot. Vous pouvez aussi parcourir nos catégories :</p>' + catChips() +
        '<p style="margin-top:24px">Vous cherchez un modèle précis ? <a class="link-u" href="' + WA + '" target="_blank" rel="noopener">Demandez-nous sur WhatsApp</a></p></div>' +
        '<div class="section-head" style="margin-top:24px"><div><p class="eyebrow">Nos pièces signature</p></div></div><div class="grid grid--4">' + all.slice(0, 4).map(card).join('') + '</div>';
    if (base.length) refreshGrid();
    afterRender();
  }
  function currentBase() {
    if (!gridBase) return [];
    if (gridBase.kind === 'search') return searchBase(gridBase.q, gridBase.all);
    return gridBase.slug === 'bijoux' ? gridBase.all : gridBase.all.filter(function (p) { return p.catSlug === gridBase.slug; });
  }
  function lockedCat() { return gridBase && gridBase.kind === 'cat' && gridBase.slug !== 'bijoux' ? gridBase.slug : null; }
  function refreshGrid() {
    var zone = $('#ov-grid'); if (!zone || !gridBase) return;
    var list = filtered(currentBase());
    zone.innerHTML = gridHTML(list);
    var c = $('#ov-count'); if (c) c.textContent = plural(list.length, 'pièce', 'pièces');
    var af = $('#ov-active'); if (af) af.innerHTML = activeChips(lockedCat());
    var n = nFilters(), fb = $('.ov .toolbar [data-open="ov-filters"]'); if (fb) fb.innerHTML = I.filter + ' Filtrer' + (n ? ' (' + n + ')' : '');
    markLoaded(); initReveal();
  }
  function renderFilters() {
    var f = filters, base = currentBase(), body = $('#ov-filters-body'); if (!body) return;
    function count(fn) { return base.filter(fn).length; }
    body.innerHTML = (lockedCat() ? '' : '<fieldset><legend>Catégorie</legend>' + ORDER.map(function (k) { return '<label class="check"><input type="checkbox" name="cat" value="' + k + '"' + (f.cats.indexOf(k) >= 0 ? ' checked' : '') + '> ' + CATS[k].name + '<small>' + count(function (p) { return p.catSlug === k; }) + '</small></label>'; }).join('') + '</fieldset>') +
      '<fieldset><legend>Prix</legend>' + [['', 'Tous les prix'], ['lt150', 'Moins de 150 MAD'], ['150-170', '150 à 170 MAD'], ['gt170', 'Plus de 170 MAD']].map(function (o) { return '<label class="check"><input type="radio" name="price" value="' + o[0] + '"' + (f.price === o[0] ? ' checked' : '') + '> ' + o[1] + '</label>'; }).join('') + '</fieldset>' +
      '<fieldset><legend>Détail</legend>' + Object.keys(TAG_LABEL).map(function (t) { return '<label class="check"><input type="checkbox" name="tag" value="' + t + '"' + (f.tags.indexOf(t) >= 0 ? ' checked' : '') + '> ' + TAG_LABEL[t] + '<small>' + count(function (p) { return p.tags.indexOf(t) >= 0; }) + '</small></label>'; }).join('') + '</fieldset>' +
      '<fieldset><legend>Matière</legend><label class="check"><input type="checkbox" checked disabled> Acier inoxydable, finition dorée<small>' + base.length + '</small></label></fieldset>';
    applyLabel();
  }
  function applyLabel() { var b = $('#ov-filters-apply'); if (b) b.textContent = 'Voir ' + plural(filtered(currentBase()).length, 'résultat', 'résultats'); }

  /* ---------- 8. Fiche produit (maquette, donnees du produit de la boutique) ---------- */
  function parseDesc(html) {
    var paras = $$('p,li', textOf(html)).map(function (x) { return x.textContent.replace(/\s+/g, ' ').trim(); }).filter(Boolean);
    var bullet = /^[•·\-–]\s*/;
    return {
      desc: paras.filter(function (s) { return !bullet.test(s) && !/^paiement à la livraison/i.test(s); })[0] || '',
      details: paras.filter(function (s) { return bullet.test(s); }).map(function (s) { return s.replace(bullet, ''); })
    };
  }
  /* produit de la page : donnees du serveur (deja dans la page) ; sinon API (navigation dans l'application) */
  function productOf(slug) {
    var nd = nextData(), sp = nd && nd.props && nd.props.pageProps && nd.props.pageProps.product;
    function build(src, base) {
      var c = catOf(src.categories), extra = [];
      if (!src.categories && base) c = { slug: base.catSlug, name: base.cat };
      $$('#__next #product-id .p_gallery_container img, #__next #product-id .ab-gallery img').forEach(function (i) {
        var s = i.getAttribute('src'); if (s && /^https:/.test(s) && s !== src.thumb && extra.indexOf(s) < 0) extra.push(s);
      });
      var pd = parseDesc(src.description || (base && base.descHtml));
      return { id: src.id, name: src.name, slug: src.slug, price: src.sale_price || src.price, img: src.thumb, catSlug: c.slug, cat: c.name, extra: extra,
        desc: pd.desc, details: pd.details.length ? pd.details : ['Acier inoxydable 316L, finition dorée PVD', 'Résiste à l’eau'], variants: !!(src.variations && src.variations.length) };
    }
    if (sp && sp.slug === slug) return Promise.resolve(build(sp));
    return data().then(function (list) { var b = bySlug(list, slug); return b ? build({ id: b.id, name: b.name, slug: b.slug, price: b.price, thumb: b.img, description: b.descHtml }, b) : null; });
  }
  function vProduct(p) {
    var on = favOn(p.id), cr = CROP[p.slug] || ['50%', '55%'], earrings = p.catSlug === 'boucles-oreilles';
    var slides = [{ src: p.img, label: '', alt: p.name }, { src: p.img, label: 'Détail', alt: 'Détail : ' + p.name, crop: true }]
      .concat(p.extra.map(function (x) { return { src: x, label: 'Autre vue', alt: p.name + ', autre vue' }; }));
    var retours = earrings
      ? '<p>Échange ou retour sous 7 jours pour les bijoux non portés. <strong>Pour des raisons d’hygiène, les boucles d’oreilles ne sont ni reprises ni échangées, sauf défaut de fabrication.</strong></p>'
      : '<p>Échange ou retour possible sous 7 jours après réception, à condition que le bijou soit non porté, non endommagé et dans son emballage d’origine.</p>';
    var cat = p.catSlug && CATS[p.catSlug] ? [[CATS[p.catSlug].name, '/collections/' + p.catSlug]] : [];
    return '<div class="wrap">' + crumbs([['Accueil', '/']].concat(cat, [[esc(p.name)]])) +
      '<div class="pdp" data-fly-root><div class="gallery" data-gallery><div class="g-track" tabindex="0" aria-label="Photos du produit">' +
      slides.map(function (s, i) {
        return '<div class="g-slide' + (s.crop ? ' crop' : '') + '" style="--cx:' + cr[0] + ';--cy:' + cr[1] + '" data-zoom><img src="' + s.src + '" alt="' + esc(s.alt) + '" class="fade-img' + (i === 0 ? ' pdp-main' : '') + '" ' +
          (i === 0 ? 'fetchpriority="high"' : 'loading="lazy"') + ' decoding="async">' + (s.label ? '<span class="g-tag">' + s.label + '</span>' : '') + '</div>';
      }).join('') + '</div>' +
      '<button class="fav g-fav' + (on ? ' is-on' : '') + '" data-fav="' + p.id + '" aria-pressed="' + on + '" aria-label="' + (on ? 'Retirer des' : 'Ajouter aux') + ' favoris">' + I.heart + '</button>' +
      '<div class="g-dots" role="tablist" aria-label="Choisir une photo">' + slides.map(function (s, i) { return '<button role="tab" aria-label="Photo ' + (i + 1) + '" class="' + (i === 0 ? 'is-on' : '') + '" data-goto="' + i + '"></button>'; }).join('') + '</div>' +
      '<div class="g-thumbs">' + slides.map(function (s, i) { return '<button class="' + (i === 0 ? 'is-on' : '') + (s.crop ? ' crop' : '') + '" style="--cx:' + cr[0] + ';--cy:' + cr[1] + '" data-goto="' + i + '" aria-label="Voir la photo ' + (i + 1) + '"><img src="' + s.src + '" alt="" loading="lazy"></button>'; }).join('') + '</div></div>' +
      '<div class="pdp__info"><p class="eyebrow">' + esc(p.cat) + '</p><h1 class="pdp__title">' + esc(p.name) + '</h1>' +
      '<div class="pdp__price"><span class="price">' + fmt(p.price) + '</span><small>Livraison offerte</small></div>' +
      '<p class="pdp__desc">' + esc(p.desc) + '</p><div class="pdp__meta"><span>' + I.drop + ' Résiste à l’eau</span><span>' + I.shield + ' Garantie 2 ans</span></div>' +
      '<div class="pdp__buy" id="ov-buy"><div class="qty" role="group" aria-label="Quantité"><button data-step="-1" aria-label="Diminuer la quantité">' + I.minus + '</button><output id="ov-qty" aria-live="polite">1</output><button data-step="1" aria-label="Augmenter la quantité">' + I.plus + '</button></div>' +
      '<button class="btn btn--ghost" data-padd="' + p.slug + '"><span class="btn__label">Ajouter au panier</span><span class="btn__spin" aria-hidden="true"><span class="spinner"></span></span><span class="btn__done" aria-hidden="true">' + I.check + ' Ajouté</span></button>' +
      '<button class="btn btn--full" data-buy="' + p.slug + '">Commander maintenant</button><p class="pdp__note">Commande confirmée par téléphone · Livraison en 2 à 4 jours ouvrés</p></div>' +
      (earrings ? '<p class="pdp__alert">Pour des raisons d’hygiène, les boucles d’oreilles ne sont ni reprises ni échangées, sauf défaut de fabrication.</p>' : '') +
      '<div class="assure pdp__assure"><div>' + I.truck + '<p><strong>Livraison offerte</strong><span>Partout au Maroc</span></p></div><div>' + I.cash + '<p><strong>Paiement à la livraison</strong><span>En espèces</span></p></div>' +
      '<div>' + I.box + '<p><strong>Ouvrez avant de payer</strong><span>Vérifiez à la réception</span></p></div><div>' + I.shield + '<p><strong>Garantie 2 ans</strong><span>Sur la finition dorée</span></p></div></div>' +
      '<div class="pdp__accs">' + acc('Détails', '<ul>' + p.details.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>', true) +
      acc('Entretien &amp; conseils', '<p>Pour préserver l’éclat de votre bijou, rangez-le à l’abri de l’humidité et évitez le contact direct avec le parfum et les crèmes.</p><p>Une hésitation sur un modèle ? <a class="link-u" href="' + WA + '" target="_blank" rel="noopener">Écrivez-nous sur WhatsApp</a>, nous vous conseillons avec plaisir.</p>') +
      acc('Livraison &amp; retours', '<p>Nous confirmons votre commande par téléphone avant l’expédition. Votre bijou vous parvient en 2 à 4 jours ouvrés selon votre ville. Livraison offerte partout au Maroc, paiement en espèces à la livraison.</p>' + retours) +
      acc('Garantie', '<p>Garantie 2 ans : si la finition dorée se dégrade dans des conditions d’utilisation normales, nous échangeons votre bijou gratuitement. La garantie ne couvre pas le contact avec les parfums et produits chimiques, ni les dommages accidentels.</p>') +
      '</div></div></div></div>';
  }
  /* « Vous aimerez aussi » : apres les avis de la boutique (qui restent ceux d'EasyOrders), avant le pied de page */
  function vRelated(list, p) {
    var rel = list.filter(function (x) { return x.id !== p.id; });
    if (!rel.length) return '';
    return '<section class="section" style="padding-top:var(--s-7)"><div class="wrap section-head"><div><p class="eyebrow">Vous aimerez aussi</p><h2 class="h2" style="font-size:2.25rem">À porter <em>ensemble</em></h2></div></div>' + rail(rel.map(card).join(''), 'Vous aimerez aussi') + '</section>';
  }
  var stickyBox = null, stickyTick = false;
  function initProduct(p) {
    var g = $('.ov [data-gallery]'); if (!g) return;
    var track = $('.g-track', g), slides = $$('.g-slide', g), btns = $$('[data-goto]', g);
    function setOn(i) { btns.forEach(function (b) { b.classList.toggle('is-on', +b.getAttribute('data-goto') === i); }); }
    track.addEventListener('scroll', function () { setOn(Math.round(track.scrollLeft / track.clientWidth)); }, { passive: true });
    btns.forEach(function (b) { b.onclick = function () { track.scrollTo({ left: +b.getAttribute('data-goto') * track.clientWidth, behavior: reduced() ? 'auto' : 'smooth' }); }; });
    track.addEventListener('keydown', function (e) {
      var i = Math.round(track.scrollLeft / track.clientWidth);
      if (e.key === 'ArrowRight') track.scrollTo({ left: Math.min(slides.length - 1, i + 1) * track.clientWidth, behavior: 'smooth' });
      if (e.key === 'ArrowLeft') track.scrollTo({ left: Math.max(0, i - 1) * track.clientWidth, behavior: 'smooth' });
    });
    /* zoom a la souris (desactive au toucher pour ne pas gener le glissement) */
    slides.forEach(function (s) {
      s.addEventListener('pointermove', function (e) { if (e.pointerType !== 'mouse') return; var r = s.getBoundingClientRect(); s.style.setProperty('--zx', ((e.clientX - r.left) / r.width * 100) + '%'); s.style.setProperty('--zy', ((e.clientY - r.top) / r.height * 100) + '%'); });
      s.addEventListener('click', function () { if (w.matchMedia('(pointer:fine)').matches) s.classList.toggle('is-zoom'); });
      s.addEventListener('pointerleave', function () { s.classList.remove('is-zoom'); });
    });
    /* barre collante : visible quand les boutons d'achat sortent de l'ecran */
    var sb = $('#ov-sticky');
    if (sb) sb.innerHTML = '<img src="' + p.img + '" alt=""><div class="sticky-buy__txt"><strong>' + esc(p.name) + '</strong><span>' + fmt(p.price) + ' · Livraison offerte</span></div><button class="btn" data-buy="' + p.slug + '">Commander</button>';
    stickyBox = $('#ov-buy'); updateSticky();
  }
  function updateSticky() {
    if (!stickyBox) return;
    var show = stickyBox.getBoundingClientRect().bottom < 0, sb = $('#ov-sticky');
    if (!sb || show === sb.classList.contains('is-on')) return;
    sb.classList.toggle('is-on', show); sb.setAttribute('aria-hidden', String(!show));
    root.classList.toggle('ov-has-sticky', show);
  }
  function hideSticky() { stickyBox = null; var sb = $('#ov-sticky'); if (sb) sb.classList.remove('is-on'); root.classList.remove('ov-has-sticky'); }
  /* avis de la boutique : section EasyOrders gardee, habillee comme la maquette ; sans avis, le texte de la maquette */
  function syncReviews() {
    var r = $('#__next #ab-reviews'); if (!r) return;
    var v = $('.ab-reviews-score-value', r), list = $('.ab-reviews-list', r);
    var empty = (!v || !parseFloat(v.textContent)) && (!list || !list.children.length);
    root.classList.toggle('ov-rev-empty', empty);
  }

  /* ---------- 9. Favoris, panier (page), pages d'aide, 404 ---------- */
  function vFavorites(items) {
    return '<div class="wrap" style="padding-top:24px">' + crumbs([['Accueil', '/'], ['Favoris']]) + '<h1 class="h2" style="margin-bottom:32px">Mes favoris</h1>' +
      (items.length ? '<div class="grid grid--4" id="ov-fav-grid">' + items.map(card).join('') + '</div>'
        : '<div class="empty"><div class="empty__ico">' + I.heart + '</div><h2>Aucun favori pour l’instant</h2><p>Touchez le cœur sur un bijou pour le retrouver ici.</p><a class="btn" href="/collections/bijoux">Découvrir la collection</a></div>') +
      '</div><div style="height:96px"></div>';
  }
  function favItems(list) {
    return wish().map(function (w0) {
      var id = w0 && (w0.id || w0.product_id), p = list.filter(function (x) { return x.id === id; })[0];
      return p || (w0 && w0.slug ? { id: id, slug: w0.slug, name: w0.name, price: w0.price, img: w0.thumb, cat: '' } : null);
    }).filter(Boolean);
  }
  function vCart() { return '<div class="wrap" style="padding-top:24px">' + crumbs([['Accueil', '/'], ['Panier']]) + '<h1 class="h2">Votre panier</h1><div class="cart-page" id="ov-cart-page">' + cartPageInner() + '</div></div>'; }
  function cartPageInner() {
    if (!cart || !cart.length) return '<div style="grid-column:1/-1">' + emptyCart() + '</div>';
    return '<div>' + cart.map(lineHTML).join('') + '</div><aside class="summary"><h2>Récapitulatif</h2>' + summaryRows() + '<a class="btn btn--full" style="margin-top:24px" href="/checkout" data-checkout>Passer la commande</a>' + miniAssure() + '</aside>';
  }
  var INFO_SLUG = { 'shipping-policy': 'livraison', 'refund-policy': 'retours', garantie: 'garantie', 'privacy-policy': 'confidentialite', 'terms-and-conditions': 'conditions', faq: 'faq', contact: 'contact' };
  var INFO = {
    contact: { t: 'Nous contacter', h: '<h1>Nous contacter</h1><p class="lead">Une question sur un bijou, une commande ou un échange ? Nous répondons sur WhatsApp.</p><div class="contact-cards">' +
      '<a class="contact-card" href="' + WA + '" target="_blank" rel="noopener">' + I.wa + '<div><strong>WhatsApp</strong><span>+212 6 56 12 77 78</span></div></a>' +
      '<a class="contact-card" href="https://www.instagram.com/orvya.ma/" target="_blank" rel="noopener">' + I.heart + '<div><strong>Instagram</strong><span>@orvya.ma</span></div></a>' +
      '<a class="contact-card" href="https://www.facebook.com/orvya.official" target="_blank" rel="noopener">' + I.phone + '<div><strong>Facebook</strong><span>orvya.official</span></div></a>' +
      '<a class="contact-card" href="https://www.tiktok.com/@orvya.official" target="_blank" rel="noopener">' + I.star + '<div><strong>TikTok</strong><span>@orvya.official</span></div></a></div>' },
    faq: { t: 'Questions fréquentes', h: '<h1>Questions fréquentes</h1><p class="lead" style="margin-bottom:32px">Livraison, paiement, échanges, entretien : l’essentiel en un coup d’œil.</p>' + FAQ.map(function (q, i) { return acc(q[0], '<p>' + q[1] + '</p>', i === 0); }).join('') +
      '<p style="margin-top:32px">Vous ne trouvez pas votre réponse ? <a class="link-u" href="' + WA + '" target="_blank" rel="noopener">Écrivez-nous sur WhatsApp</a>.</p>' },
    livraison: { t: 'Livraison', h: '<h1>Livraison</h1><p class="lead">Livraison offerte partout au Maroc. Vous payez le livreur en espèces, à la réception.</p>' +
      '<div class="facts"><div><strong>24–48 h</strong><span>Préparation après confirmation par téléphone</span></div><div><strong>24–48 h</strong><span>Grandes villes, après expédition</span></div><div><strong>2–4 j</strong><span>Autres villes et zones rurales (jours ouvrés)</span></div></div>' +
      '<h2>Comment ça se passe</h2><ul><li>Votre commande est préparée sous 24 à 48 h après confirmation par téléphone.</li><li>Grandes villes (Casablanca, Rabat, Marrakech, Tanger, Fès, Agadir) : 24 à 48 h après expédition.</li><li>Autres villes et zones rurales : 2 à 4 jours ouvrés.</li><li>Un numéro de suivi vous est communiqué par SMS ou WhatsApp dès l’expédition.</li></ul>' +
      '<h2>Paiement et ouverture du colis</h2><p>Vous payez le livreur en espèces à la réception. Aucun paiement n’est demandé au moment de la commande. Vous pouvez ouvrir et vérifier votre colis avant de payer.</p>' },
    retours: { t: 'Retours & échanges', h: '<h1>Retours &amp; échanges</h1><p class="lead">Vous disposez de 7 jours après réception pour demander un échange ou un remboursement.</p>' +
      '<h2>Conditions</h2><ul><li>L’article doit être non porté, non endommagé et dans son emballage d’origine.</li><li>Pour des raisons d’hygiène, les boucles d’oreilles ne sont ni reprises ni échangées, sauf défaut de fabrication.</li><li>Article défectueux ou erreur de commande : nous prenons en charge les frais de retour et vous renvoyons le bon article ou vous remboursons intégralement.</li></ul>' +
      '<h2>Comment procéder</h2><p>Contactez-nous sur <a class="link-u" href="' + WA + '" target="_blank" rel="noopener">WhatsApp</a> avec votre numéro de commande et une photo de l’article, sous 7 jours après réception. Le remboursement est effectué sous 7 jours ouvrés après réception et vérification du retour.</p>' },
    garantie: { t: 'Garantie', h: '<h1>Garantie 2 ans</h1><p class="lead">Si la finition dorée se dégrade dans des conditions d’utilisation normales, nous échangeons votre bijou gratuitement.</p>' +
      '<h2>Comment en bénéficier</h2><p>Contactez-nous sur <a class="link-u" href="' + WA + '" target="_blank" rel="noopener">WhatsApp</a> avec votre numéro de commande et une photo de l’article.</p>' +
      '<h2>Ce que la garantie ne couvre pas</h2><ul><li>Le contact avec les parfums et les produits chimiques.</li><li>Les dommages accidentels.</li></ul>' },
    confidentialite: { t: 'Confidentialité', h: '<h1>Politique de confidentialité</h1><p class="lead">ORVYA ne collecte que les informations nécessaires au traitement et à la livraison de votre commande : nom, numéro de téléphone, adresse et ville.</p>' +
      '<h2>Utilisation des données</h2><ul><li>Confirmer votre commande par téléphone ou WhatsApp.</li><li>Préparer et livrer votre colis via notre transporteur.</li><li>Vous informer du suivi de votre commande.</li></ul>' +
      '<p style="margin-top:16px">Nous ne vendons ni ne louons vos données à des tiers. Elles sont transmises uniquement au transporteur chargé de votre livraison.</p>' +
      '<h2>Cookies et mesure d’audience</h2><p>Notre site utilise des cookies ainsi que des outils de mesure d’audience et de publicité (tels que Meta Pixel, TikTok Pixel ou Google Analytics) afin d’améliorer l’expérience d’achat et la pertinence de nos annonces.</p>' +
      '<h2>Paiement</h2><p>Aucune donnée bancaire n’est collectée : le paiement se fait exclusivement à la livraison, en espèces.</p><h2>Vos droits</h2><p>Pour toute demande d’accès, de correction ou de suppression de vos données, contactez-nous sur WhatsApp.</p>' },
    conditions: { t: 'Conditions d’utilisation', h: '<h1>Conditions d’utilisation</h1><p class="lead">En passant commande sur notre site, vous acceptez les conditions suivantes.</p>' +
      '<h2>Commandes</h2><p>Toute commande est confirmée par téléphone ou WhatsApp avant expédition. Une commande restée sans réponse après trois tentatives d’appel peut être annulée.</p>' +
      '<h2>Prix</h2><p>Les prix sont affichés en dirhams marocains (MAD), toutes taxes comprises. La livraison est offerte partout au Maroc.</p>' +
      '<h2>Paiement</h2><p>Le règlement s’effectue en espèces, directement au livreur, à la réception du colis.</p>' +
      '<h2>Produits</h2><p>Nos bijoux sont en acier inoxydable 316L, finition dorée PVD. Les photographies sont fidèles aux articles ; de légères variations de teinte peuvent apparaître selon l’écran.</p>' +
      '<h2>Entretien</h2><p>Nos bijoux résistent à l’eau. Nous recommandons néanmoins d’éviter le contact direct avec les parfums et les produits chimiques.</p>' +
      '<h2>Annulation</h2><p>Vous pouvez annuler votre commande sans frais tant qu’elle n’a pas été expédiée.</p>' }
  };
  var INFO_ORDER = ['contact', 'faq', 'livraison', 'retours', 'garantie', 'confidentialite', 'conditions'];
  function vInfo(storeSlug) {
    var k = INFO_SLUG[storeSlug], pg = INFO[k];
    if (!pg) {
      /* autre page creee dans EasyOrders : son titre et son texte, dans la mise en page de la maquette */
      var nd = nextData(), sp = nd && nd.props && nd.props.pageProps && nd.props.pageProps.page;
      if (!sp || sp.slug !== storeSlug) return null;
      pg = { t: esc(sp.title), h: '<h1>' + esc(sp.title) + '</h1>' + (sp.content || '') };
    }
    var slugOf = {}; Object.keys(INFO_SLUG).forEach(function (s) { slugOf[INFO_SLUG[s]] = s; });
    return '<div class="wrap" style="padding-top:24px">' + crumbs([['Accueil', '/'], [pg.t]]) + '<div class="info"><nav class="info-nav" aria-label="Pages d’aide">' +
      INFO_ORDER.map(function (x) { var on = x === k; return '<a class="chip' + (on ? ' is-on' : '') + '" href="/pages/' + slugOf[x] + '"' + (on ? ' aria-current="page"' : '') + '>' + INFO[x].t + '</a>'; }).join('') +
      '</nav><article class="prose" data-rv="fade">' + pg.h + '</article></div></div>';
  }
  function vNotFound() {
    return '<div class="wrap"><div class="empty" style="padding-block:120px"><div class="empty__ico" style="font:400 1.5rem/1 var(--f-display)">404</div>' +
      '<h2>Cette page s’est égarée</h2><p>Le lien est peut-être ancien. Reprenez depuis nos collections.</p><a class="btn" href="/collections/bijoux">Voir tous les bijoux</a></div></div>';
  }

  /* ---------- 10. Suite de page, pied de page, menu, recherche, tiroirs, voile, messages (hors de l'application) ---------- */
  function linkList(items) { return '<ul>' + items.map(function (h) { return '<li><a href="' + h[1] + '"' + (/^https:/.test(h[1]) ? ' target="_blank" rel="noopener"' : '') + '>' + h[0] + '</a></li>'; }).join('') + '</ul>'; }
  function mountEnd() {
    if ($('#ov-footer')) return;
    var arrowLink = function (k, i) { return '<a href="/collections/' + k + '" style="--i:' + i + '">' + CATS[k].name + ' ' + I.arrow + '</a>'; };
    var end = el('<div class="ov ov-end"><div id="ov-after"></div>' +
      '<footer class="footer" id="ov-footer"><div class="wrap"><div class="footer__grid">' +
        '<div class="footer__brand"><img src="' + ASSETS + 'orvya-logo-gold-transparent-800.png" alt="ORVYA" width="101" height="34" loading="lazy">' +
          '<p>Bijoux en acier inoxydable à finition dorée. Livraison offerte partout au Maroc, paiement à la livraison.</p><div class="socials">' +
          '<a href="https://www.instagram.com/orvya.ma/" target="_blank" rel="noopener" aria-label="Instagram">' + I.ig + '</a>' +
          '<a href="https://www.facebook.com/orvya.official" target="_blank" rel="noopener" aria-label="Facebook">' + I.fb + '</a>' +
          '<a href="https://www.tiktok.com/@orvya.official" target="_blank" rel="noopener" aria-label="TikTok">' + I.tt + '</a>' +
          '<a href="' + WA + '" target="_blank" rel="noopener" aria-label="WhatsApp">' + I.wa + '</a></div></div>' +
        '<div><h4>Boutique</h4>' + linkList([['Tous les bijoux', '/collections/bijoux']].concat(ORDER.map(function (k) { return [CATS[k].name, '/collections/' + k]; }))) + '</div>' +
        '<div><h4>Aide</h4>' + linkList([['Livraison', PAGES.livraison], ['Retours &amp; échanges', PAGES.retours], ['Garantie', PAGES.garantie], ['Questions fréquentes', PAGES.faq], ['Suivre ma commande', WA_TRACK]]) + '</div>' +
        '<div><h4>ORVYA</h4>' + linkList([['Nous contacter', PAGES.contact], ['Politique de confidentialité', PAGES.confidentialite], ['Conditions d’utilisation', PAGES.conditions]]) + '</div>' +
      '</div><div class="footer__base"><span>© ' + new Date().getFullYear() + ' ORVYA · Paiement en espèces à la livraison</span><span>Acier inoxydable 316L, finition dorée PVD</span></div></div></footer>' +
      '<div class="drawer drawer--left" id="ov-menu" role="dialog" aria-modal="true" aria-label="Menu" aria-hidden="true"><div class="drawer__head">' +
        '<img src="' + LOGO + '" alt="ORVYA" style="height:26px;width:auto"><button class="icon-btn" data-close aria-label="Fermer le menu">' + I.close + '</button></div>' +
        '<div class="drawer__body"><nav class="mnav__main stagger" aria-label="Catégories"><a href="/collections/bijoux" style="--i:0">Tous les bijoux ' + I.arrow + '</a>' + ORDER.map(function (k, i) { return arrowLink(k, i + 1); }).join('') + '</nav>' +
        '<div class="mnav__sub stagger"><a href="/wishlist" style="--i:5">Mes favoris</a><a href="' + WA_TRACK + '" target="_blank" rel="noopener" style="--i:6">Suivre ma commande</a><a href="' + PAGES.livraison + '" style="--i:7">Livraison</a><a href="' + PAGES.retours + '" style="--i:8">Retours &amp; échanges</a><a href="' + PAGES.faq + '" style="--i:9">Questions fréquentes</a><a href="' + PAGES.garantie + '" style="--i:10">Garantie</a></div>' +
        '<div class="mnav__wa stagger"><a class="btn btn--ghost btn--full" style="--i:11" href="' + WA + '" target="_blank" rel="noopener">Écrivez-nous sur WhatsApp</a></div></div></div>' +
      '<div class="drawer drawer--right" id="ov-cart" role="dialog" aria-modal="true" aria-labelledby="ov-cart-title" aria-hidden="true"><div class="drawer__head"><h2 class="drawer__title" id="ov-cart-title">Votre panier</h2>' +
        '<button class="icon-btn" data-close aria-label="Fermer le panier">' + I.close + '</button></div><div class="drawer__body" id="ov-cart-body"></div><div class="drawer__foot" id="ov-cart-foot"></div></div>' +
      '<div class="drawer drawer--right" id="ov-filters" role="dialog" aria-modal="true" aria-labelledby="ov-filters-title" aria-hidden="true"><div class="drawer__head"><h2 class="drawer__title" id="ov-filters-title">Filtrer</h2>' +
        '<button class="icon-btn" data-close aria-label="Fermer les filtres">' + I.close + '</button></div><div class="drawer__body filters" id="ov-filters-body"></div>' +
        '<div class="drawer__foot" style="display:grid;grid-template-columns:1fr 1.6fr;gap:8px"><button class="btn btn--ghost" data-filter-reset>Effacer</button><button class="btn" data-close id="ov-filters-apply">Voir les résultats</button></div></div>' +
      '<div class="search" id="ov-search" role="dialog" aria-modal="true" aria-label="Recherche" aria-hidden="true"><div class="wrap"><form class="search__bar" id="ov-search-form" role="search" action="/search">' + I.search +
        '<label class="sr-only" for="ov-search-input">Rechercher un bijou</label><input class="search__input" id="ov-search-input" name="q" type="search" placeholder="Bague, collier, zircon…" autocomplete="off" enterkeyhint="search">' +
        '<button type="button" class="icon-btn" data-close aria-label="Fermer la recherche">' + I.close + '</button></form><div class="search__body" id="ov-search-body"></div></div></div>' +
      '<div class="veil" id="ov-veil"></div><div class="sticky-buy" id="ov-sticky" aria-hidden="true"></div><div class="toasts" id="ov-toasts" aria-live="polite" aria-atomic="false"></div></div>');
    d.body.appendChild(end);
    $('#ov-veil').addEventListener('click', function () { closeAll(); });
    $('#ov-search-input').addEventListener('input', function (e) { clearTimeout(sTimer); sTimer = setTimeout(function () { renderSearch(e.target.value); }, 120); });
    $('#ov-filters-body').addEventListener('change', function (e) {
      var t = e.target, f = filters, body = $('#ov-filters-body');
      if (t.name === 'cat') f.cats = $$('input[name=cat]:checked', body).map(function (i) { return i.value; });
      if (t.name === 'tag') f.tags = $$('input[name=tag]:checked', body).map(function (i) { return i.value; });
      if (t.name === 'price') f.price = t.value;
      refreshGrid(); applyLabel();
    });
    syncCounts();
  }
  mountEnd();

  /* ---------- 11. Tiroirs (maquette) ---------- */
  var openEl = null, lastFocus = null, sTimer;
  function open(id) {
    if (openEl) closeAll(true);
    var x = $('#' + id); if (!x) return;
    lastFocus = d.activeElement; openEl = x;
    if (id === 'ov-filters') renderFilters();
    if (id === 'ov-cart') { renderCart(); refreshCart(); }
    x.classList.add('is-open'); x.setAttribute('aria-hidden', 'false');
    $('#ov-veil').classList.add('is-on'); root.classList.add('ov-locked');
    $$('[aria-controls="' + id + '"]').forEach(function (b) { b.setAttribute('aria-expanded', 'true'); });
    setTimeout(function () { var f = id === 'ov-search' ? $('#ov-search-input') : x.querySelector('button,[href],input,select'); if (f) f.focus({ preventScroll: true }); }, id === 'ov-search' ? 60 : 120);
    if (id === 'ov-search') renderSearch($('#ov-search-input').value);
  }
  function closeAll(silent) {
    if (!openEl) return;
    var id = openEl.id;
    openEl.classList.remove('is-open'); openEl.setAttribute('aria-hidden', 'true');
    $$('[aria-controls="' + id + '"]').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
    $('#ov-veil').classList.remove('is-on'); root.classList.remove('ov-locked');
    openEl = null;
    if (!silent && lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  d.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && openEl) { closeAll(); return; }
    if (e.key === 'Tab' && openEl) {
      var f = $$('a[href],button:not([disabled]),input:not([type=hidden]),select,textarea,[tabindex="0"]', openEl).filter(function (x) { return x.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && d.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && d.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  /* message en bas de l'ecran ; action = lien (chaine) ou fonction */
  function toast(msg, action, act) {
    var box = $('#ov-toasts'); if (!box) return;
    var t = d.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status');
    t.innerHTML = I.check + '<span>' + msg + '</span>' + (action ? (typeof act === 'function' ? '<button>' + action + '</button>' : '<a href="' + act + '">' + action + '</a>') : '');
    function kill() { t.classList.add('out'); setTimeout(function () { t.remove(); }, 300); }
    if (typeof act === 'function') t.querySelector('button').onclick = function () { act(); kill(); };
    box.appendChild(t);
    setTimeout(kill, action ? 5000 : 3200);
  }

  /* ---------- 12. Recherche (panneau de la maquette) ---------- */
  function sItem(p, i, terms) {
    var name = esc(p.name);
    terms.forEach(function (t) { var k = norm(p.name).indexOf(t); if (k >= 0) { var raw = p.name.slice(k, k + t.length); name = name.replace(esc(raw), '<mark>' + esc(raw) + '</mark>'); } });
    return '<a class="s-item" style="--i:' + i + '" href="/products/' + p.slug + '">' + img(p.img, '') + '<span><span class="card__cat" style="display:block">' + esc(p.cat) + '</span><span style="font:500 1.15rem/1.2 var(--f-display)">' + name + '</span></span><span class="price" style="font-size:14px">' + fmt(p.price) + '</span></a>';
  }
  function renderSearch(q) {
    var body = $('#ov-search-body'); if (!body) return;
    data().then(function (list) {
      var terms = norm(q).split(/\s+/).filter(Boolean);
      if (!terms.length) {
        body.innerHTML = '<p class="eyebrow" style="margin-bottom:12px">Suggestions</p><div class="chips">' + ORDER.map(function (k) { return '<a class="chip" href="/collections/' + k + '">' + CATS[k].name + '</a>'; }).join('') +
          '<button class="chip" data-suggest="zircon">Zircon</button><button class="chip" data-suggest="perles">Perles</button></div>' +
          (list.length ? '<p class="eyebrow" style="margin:28px 0 4px">Pièces signature</p><div class="s-results">' + list.slice(0, 4).map(function (p, i) { return sItem(p, i, []); }).join('') + '</div>' : '');
        markLoaded(); return;
      }
      var res = searchBase(q, list);
      body.innerHTML = res.length
        ? '<p class="eyebrow" style="margin-bottom:4px">' + plural(res.length, 'résultat', 'résultats') + '</p><div class="s-results">' + res.map(function (p, i) { return sItem(p, i, terms); }).join('') + '</div><a class="link-arrow" style="margin-top:20px" href="/search?q=' + encodeURIComponent(q) + '">Voir tous les résultats ' + I.arrow + '</a>'
        : '<p style="padding:12px 0">Aucun bijou ne correspond à « ' + esc(q) + ' ». Essayez « collier », « zircon » ou « bague ».</p>';
      markLoaded();
    });
  }

  /* ---------- 13. Panier : celui de la boutique EasyOrders ----------
     Lecture : API publique (articles du visiteur, sans attendre l'application).
     Changements : les vrais boutons du panier EasyOrders (tiroir du theme, invisible), un a la fois, pour que la boutique,
     ses statistiques et le pixel restent exacts. L'affichage suit tout de suite, comme dans la maquette. */
  var cart = null, cartP = null, queue = Promise.resolve(), pending = {};
  function hydrated() { return w.orvyaHydrated ? w.orvyaHydrated() : !!$('.ab-footer-grid'); }
  /* l'application est en pause sur l'accueil (vitesse) : on la demarre si besoin */
  function whenApp(fn) {
    if (hydrated()) return fn();
    if (w.orvyaBoot) try { w.orvyaBoot(); } catch (e) {}
    var t0 = Date.now(), iv = setInterval(function () { if (hydrated() || Date.now() - t0 > 10000) { clearInterval(iv); fn(); } }, 80);
  }
  function app() { return new Promise(function (r) { whenApp(r); }); }
  function guest() { try { return JSON.parse(localStorage.getItem('guest-id')).state.guestId; } catch (e) { return ''; } }
  function refreshCart() {
    var g = guest();
    if (!g) { cart = cart || []; renderCart(); return Promise.resolve(cart); }
    cartP = Promise.all([fetch(API + 'cart-items/guest?guest_id=' + encodeURIComponent(g) + '&limit=100', { credentials: 'omit' }).then(function (r) { return r.ok ? r.json() : []; }), data()]).then(function (res) {
      var items = Array.isArray(res[0]) ? res[0] : (res[0].data || []), list = res[1];
      cart = items.filter(function (x) { return x.in_cart !== false && x.product; }).map(function (x) {
        var b = bySlug(list, x.product.slug) || {};
        return { slug: x.product.slug, id: x.product_id, name: x.product.name, price: x.price || x.product.price, qty: x.quantity, img: x.product.thumb, cat: b.cat || '' };
      }).filter(function (l) { return !pending[l.slug]; });
      renderCart(); return cart;
    }).catch(function () { cart = cart || []; renderCart(); return cart; });
    return cartP;
  }
  function cartQty() { return (cart || []).reduce(function (n, l) { return n + l.qty; }, 0); }
  function cartTotal() { return (cart || []).reduce(function (n, l) { return n + l.price * l.qty; }, 0); }
  function lineHTML(l) {
    return '<div class="line" data-line="' + l.slug + '"><a class="line__img" href="/products/' + l.slug + '">' + img(l.img, l.name) + '</a><div><p class="line__cat">' + esc(l.cat) + '</p>' +
      '<a class="line__name" href="/products/' + l.slug + '">' + esc(l.name) + '</a><div class="line__row"><div class="qty qty--sm" role="group" aria-label="Quantité de ' + esc(l.name) + '">' +
      '<button data-qty="' + l.slug + '" data-d="-1" aria-label="Diminuer">' + I.minus + '</button><output>' + l.qty + '</output><button data-qty="' + l.slug + '" data-d="1" aria-label="Augmenter">' + I.plus + '</button></div>' +
      '<button class="line__rm" data-remove="' + l.slug + '">Retirer</button></div></div><p class="line__price">' + fmt(l.price * l.qty) + '</p></div>';
  }
  function summaryRows() {
    var t = cartTotal();
    return '<div class="sum-row"><span>Sous-total</span><span>' + fmt(t) + '</span></div><div class="sum-row"><span>Livraison</span><span class="free">Offerte</span></div><div class="sum-row sum-row--total"><span>Total</span><span>' + fmt(t) + '</span></div>';
  }
  function miniAssure() { return '<div class="mini-assure"><span>' + I.cash + ' Paiement en espèces à la livraison</span><span>' + I.box + ' Ouvrez votre colis avant de payer</span><span>' + I.phone + ' Commande confirmée par téléphone</span></div>'; }
  function renderCart() {
    var n = cartQty();
    countBadge('ov-cart-count', n);
    var title = $('#ov-cart-title'), body = $('#ov-cart-body'), foot = $('#ov-cart-foot');
    if (title) title.textContent = n ? 'Votre panier (' + n + ')' : 'Votre panier';
    if (body && cart) {
      body.innerHTML = n ? '<div class="free-bar">' + I.truck + ' Livraison offerte sur votre commande</div>' + cart.map(lineHTML).join('') : emptyCart();
      foot.style.display = n ? '' : 'none';
      foot.innerHTML = n ? '<div class="sum-row sum-row--total" style="border:0;margin:0;padding-top:0"><span>Total <small class="muted" style="font-weight:400">· livraison offerte</small></span><span>' + fmt(cartTotal()) + '</span></div>' +
        '<a class="btn btn--full" style="margin-top:12px" href="/checkout" data-checkout>Passer la commande</a><p class="muted" style="display:flex;justify-content:space-between;gap:12px;margin-top:12px;font-size:12.5px"><span>Paiement à la livraison</span><a class="link-u" href="/cart">Voir le panier</a></p>' : '';
    }
    var page = $('#ov-cart-page'); if (page) page.innerHTML = cartPageInner();
    var sum = $('#ov-co-sum'); if (sum) sum.outerHTML = coSummary(sum.classList.contains('is-open'));
    root.style.setProperty('--ov-total', '"' + fmt(cartTotal()) + '"');
    markLoaded();
  }
  /* un geste sur le vrai panier EasyOrders : ouvrir son tiroir (invisible), toucher le bouton de la ligne, attendre, refermer */
  function themeCart(slug, act) {
    queue = queue.then(function () {
      return app().then(function () {
        if (!$('[data-cart="root"]')) { var b = $('#__next .cart-btn'); if (b) b.click(); }
        return waitFor(function () { return $$('[data-cart="item"]').filter(function (li) { var a = li.querySelector('a[href]'); return a && a.getAttribute('href') === '/products/' + slug; })[0]; }, 5000);
      }).then(function (li) {
        if (!li) return;
        var q = $('[data-cart="item-quantity"]', li), before = q ? q.textContent : '';
        var btn = $('[data-cart="item-' + act + '"]', li); if (btn) btn.click();
        return waitFor(function () { return !li.isConnected || (q && q.textContent !== before); }, 5000);
      }).then(function () { var c = $('[data-cart="close-button"]'); if (c) c.click(); return new Promise(function (r) { setTimeout(r, 250); }); });
    }).catch(function () {});
    return queue;
  }
  function setQty(slug, dlt) {
    var l = (cart || []).filter(function (x) { return x.slug === slug; })[0]; if (!l) return;
    var q = Math.max(1, Math.min(9, l.qty + dlt)); if (q === l.qty) return;
    l.qty = q; renderCart();
    themeCart(slug, dlt > 0 ? 'increase' : 'decrease').then(refreshCart);
  }
  /* « Retirer » : la ligne part tout de suite ; « Annuler » pendant 5 s ; le retrait est fait dans la boutique ensuite
     (ou tout de suite si la cliente passe a la commande) */
  function removeLine(slug) {
    var idx = -1; (cart || []).forEach(function (x, i) { if (x.slug === slug) idx = i; }); if (idx < 0) return;
    var removed = cart[idx], rows = $$('.ov [data-line="' + slug + '"]');
    function done() { cart = cart.filter(function (x) { return x.slug !== slug; }); renderCart(); }
    if (rows.length && !reduced()) { rows.forEach(function (r) { r.classList.add('is-leaving'); }); setTimeout(done, 280); } else done();
    var job = { timer: setTimeout(commit, 5000) };
    pending[slug] = job;
    function commit() { if (pending[slug] !== job) return; clearTimeout(job.timer); delete pending[slug]; job.p = themeCart(slug, 'remove').then(refreshCart); }
    job.commit = commit;
    toast(esc(removed.name) + ' retiré du panier', 'Annuler', function () {
      if (pending[slug] !== job) return; clearTimeout(job.timer); delete pending[slug];
      cart.splice(Math.min(idx, cart.length), 0, removed); renderCart();
    });
  }
  function flushRemovals() { Object.keys(pending).forEach(function (s) { pending[s].commit(); }); return queue; }
  /* l'image du produit « vole » jusqu'au panier (transform + opacity uniquement) */
  function flyToCart(fromImg) {
    if (reduced() || !fromImg) return;
    var a = fromImg.getBoundingClientRect(), b = $('#ov-cart-btn').getBoundingClientRect();
    if (!a.width) return;
    var f = d.createElement('img'); f.src = fromImg.currentSrc || fromImg.src; f.className = 'flyer'; f.alt = '';
    var wd = Math.min(a.width, 180), h = wd * 1.25;
    f.style.left = (a.left + (a.width - wd) / 2) + 'px'; f.style.top = (a.top + (a.height - h) / 2) + 'px'; f.style.width = wd + 'px'; f.style.height = h + 'px';
    var holder = $('.ov-end'); holder.appendChild(f);
    var dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2);
    f.animate([{ transform: 'translate(0,0) scale(1)', opacity: 1 }, { transform: 'translate(' + dx * 0.55 + 'px,' + (dy * 0.35 - 60) + 'px) scale(.55)', opacity: 0.95, offset: 0.55 }, { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(.12)', opacity: 0.2 }],
      { duration: 820, easing: 'cubic-bezier(.5,0,.3,1)' }).onfinish = function () { f.remove(); };
  }
  /* le theme ouvre parfois son tiroir apres un ajout : il est invisible, on le referme */
  function closeThemeCart() { return waitFor(function () { return $('[data-cart="close-button"]'); }, 1500).then(function (c) { if (c) c.click(); }); }
  /* bouton d'ajout rapide d'une carte du theme pour ce produit (grilles et suggestions masquees de la boutique) */
  function themeQuick(slug) {
    var links = $$('#__next a[href="/products/' + slug + '"]');
    for (var i = 0; i < links.length; i++) {
      var c = links[i].matches('.ab-pgrid-card') ? links[i] : links[i].closest('.ab-pgrid-card, li, article, [class*="card"]');
      var b = c && c.querySelector('.ab-card-cart-btn, .ab-desktop-quick-btn');
      if (b) return b;
    }
    return null;
  }
  /* quantite du vrai formulaire de la fiche produit, reglee avec ses boutons + et - */
  function setThemeQty(n) {
    var box = $('#__next #product-id .quantity_btn_container'); if (!box) return Promise.resolve();
    var btns = $$('button', box), inc = btns[0], dec = btns[btns.length - 1], tries = 0;
    function val() { var i = box.querySelector('input'); return +(i ? i.value : (box.textContent.match(/\d+/) || ['1'])[0]) || 1; }
    return new Promise(function (res) {
      (function step() {
        var cur = val(); if (cur === n || tries++ > 20) return res();
        (cur < n ? inc : dec).click();
        setTimeout(function () { if (tries === 1 && (val() - cur) * (n - cur) < 0) { var t = inc; inc = dec; dec = t; } step(); }, 40);
      })();
    });
  }
  function themePdpBtn(re) { return $$('#__next #product-id button').filter(function (b) { return re.test(b.textContent) && !b.closest('.ab-pgrid-card'); })[0]; }
  function added(name) {
    var before = cartQty();
    closeThemeCart();
    return waitFor(function () { return false; }, 400).then(refreshCart).then(function () {
      if (cartQty() === before) return new Promise(function (r) { setTimeout(r, 900); }).then(refreshCart);
    }).then(function () { toast(esc(name) + ' ajouté au panier', 'Voir', function () { open('ov-cart'); }); });
  }

  /* ---------- 14. Favoris : la liste d'envies de la boutique (navigateur, page /wishlist), meme format que le theme ---------- */
  function countBadge(id, n) { var c = $('#' + id); if (!c) return; var was = c.textContent; c.textContent = n; c.classList.toggle('is-on', n > 0); if (String(n) !== was && n > 0 && !reduced()) { c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump'); } }
  function wish() { try { return (JSON.parse(localStorage.getItem('wish-list')) || {}).state.wishListProducts || []; } catch (e) { return []; } }
  function wishIds() { return wish().map(function (p) { return p && (p.id || p.product_id); }); }
  function syncCounts() { countBadge('ov-fav-count', wish().length); if (cart) countBadge('ov-cart-count', cartQty()); }
  function toggleFav(id, btn) {
    data().then(function (list) {
      var raw = null, p = list.filter(function (x) { return x.id === id; })[0];
      try { raw = JSON.parse(localStorage.getItem('wish-list')); } catch (e) {}
      if (!raw || !raw.state) raw = { state: { wishListProducts: [] }, version: 0 };
      var arr = raw.state.wishListProducts || [], at = -1;
      arr.forEach(function (x, i) { if (x && x.id === id) at = i; });
      var on = at < 0;
      if (on) { if (!p) return; arr.push({ id: p.id, slug: p.slug, name: p.name, price: p.price, thumb: p.img, images: [] }); } else arr.splice(at, 1);
      raw.state.wishListProducts = arr;
      try { localStorage.setItem('wish-list', JSON.stringify(raw)); } catch (e) { return; }
      syncFav(); syncCounts();
      btn.classList.remove('pop'); void btn.offsetWidth; if (on) btn.classList.add('pop');
      toast(on ? 'Ajouté à vos favoris' : 'Retiré de vos favoris', on ? 'Voir' : '', '/wishlist');
      if (!on && curView === 'favorites') { var c = btn.closest('.card'); if (c) { c.style.transition = 'opacity .3s, transform .3s'; c.style.opacity = 0; c.style.transform = 'scale(.96)'; } setTimeout(function () { render(true); }, 300); }
    });
  }
  function syncFav() {
    var ids = wishIds();
    $$('.ov [data-fav]').forEach(function (b) { var on = ids.indexOf(b.getAttribute('data-fav')) >= 0; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on); });
  }

  /* ---------- 15. Clics (delegation, comme la maquette) ---------- */
  d.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('.ov button, .ov a');
    if (!t) return;
    var A = function (k) { return t.getAttribute(k); };
    if (t.tagName === 'A' && openEl && A('href') && !/^https?:/.test(A('href'))) closeAll(true);
    if (t.hasAttribute('data-checkout')) { if (Object.keys(pending).length) { e.preventDefault(); flushRemovals().then(function () { location.href = '/checkout'; }); } return; }
    if (A('data-fav')) { e.preventDefault(); toggleFav(A('data-fav'), t); return; }
    if (A('data-open')) { e.preventDefault(); open(A('data-open')); return; }
    if (t.hasAttribute('data-close')) { e.preventDefault(); closeAll(); return; }
    if (A('data-suggest')) { var si = $('#ov-search-input'); si.value = A('data-suggest'); renderSearch(si.value); return; }
    if (t.classList.contains('acc__btn')) { var a = t.parentElement, on = a.classList.toggle('is-open'); t.setAttribute('aria-expanded', on); return; }
    if (A('data-step')) { var o = $('#ov-qty'); o.textContent = Math.max(1, Math.min(9, +o.textContent + +A('data-step'))); return; }
    if (A('data-qty')) { setQty(A('data-qty'), +A('data-d')); return; }
    if (A('data-remove')) { removeLine(A('data-remove')); return; }
    if (t.hasAttribute('data-filter-reset')) { filters = { cats: [], price: '', tags: [], sort: filters.sort }; refreshGrid(); if (openEl && openEl.id === 'ov-filters') renderFilters(); return; }
    if (A('data-unfilter')) { var kv = A('data-unfilter').split(':'), f = filters; if (kv[0] === 'cat') f.cats = f.cats.filter(function (x) { return x !== kv[1]; }); if (kv[0] === 'tag') f.tags = f.tags.filter(function (x) { return x !== kv[1]; }); if (kv[0] === 'price') f.price = ''; refreshGrid(); return; }
    /* fiche produit : « Ajouter au panier » = le vrai bouton de la boutique, avec la quantite choisie */
    if (A('data-padd')) {
      e.preventDefault();
      if (t.classList.contains('is-loading')) return;
      var qty = +$('#ov-qty').textContent, src = $('.ov .pdp-main');
      t.classList.add('is-loading');
      app().then(function () { return setThemeQty(qty); }).then(function () {
        var b = themePdpBtn(/ajouter au panier/i);
        if (!b) { t.classList.remove('is-loading'); location.reload(); return; }
        b.click();
        t.classList.remove('is-loading'); t.classList.add('is-done'); flyToCart(src);
        setTimeout(function () { t.classList.remove('is-done'); }, 1600);
        added($('.ov .pdp__title').textContent);
      });
      return;
    }
    /* « Commander maintenant » : le vrai bouton d'achat de la boutique (il ajoute et ouvre la commande) */
    if (A('data-buy')) {
      e.preventDefault();
      var q2 = $('#ov-qty') ? +$('#ov-qty').textContent : 1;
      t.classList.add('is-loading');
      app().then(function () { return setThemeQty(q2); }).then(function () {
        var b = themePdpBtn(/acheter|commander/i);
        if (b) b.click(); else location.href = '/checkout';
        setTimeout(function () { t.classList.remove('is-loading'); }, 2500);
      });
      return;
    }
    /* carte produit : ajout rapide par le bouton de la carte du theme (masquee) ; sans carte du theme sur la page, la fiche s'ouvre */
    if (A('data-add')) {
      e.preventDefault();
      var slug = A('data-add'), from = t.closest('[data-fly-root]'), fimg = from && from.querySelector('.card__img');
      app().then(function () {
        var b = themeQuick(slug);
        if (!b) { location.href = '/products/' + slug; return; }
        b.click(); flyToCart(fimg);
        t.classList.add('is-done'); var old = t.innerHTML; t.innerHTML = I.check + '<span>Ajouté</span>';
        setTimeout(function () { t.classList.remove('is-done'); t.innerHTML = old; }, 1400);
        var nm = from && from.querySelector('.card__name'); added(nm ? nm.textContent : 'Article');
      });
    }
  });
  d.addEventListener('change', function (e) { if (e.target.id === 'ov-sort') { filters.sort = e.target.value; refreshGrid(); } });
  /* inscription a la lettre : le formulaire de la boutique (section masquee) fait l'envoi */
  d.addEventListener('submit', function (e) {
    if (e.target.id !== 'ov-news') return;
    e.preventDefault();
    var mail = $('#ov-news-mail').value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) { $('#ov-news-mail').focus(); return; }
    whenApp(function () {
      var f = $('#__next form.newsletter-luxe__form'), inp = f && $('input', f);
      if (!inp) { toast('Inscription momentanément indisponible'); return; }
      var setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
      setter.call(inp, mail); inp.dispatchEvent(new Event('input', { bubbles: true }));
      (f.requestSubmit ? f.requestSubmit() : $('button', f).click());
      $('#ov-news-mail').value = ''; toast('Merci, vous êtes inscrite.');
    });
  });

  /* ---------- 16. Mouvement (maquette) ---------- */
  d.addEventListener('load', function (e) { if (e.target.tagName === 'IMG' && e.target.closest && e.target.closest('.ov')) e.target.classList.add('is-loaded'); }, true);
  d.addEventListener('error', function (e) { if (e.target.tagName === 'IMG' && e.target.closest && e.target.closest('.ov')) e.target.classList.add('is-loaded'); }, true);
  function markLoaded() { $$('.ov img.fade-img').forEach(function (i) { if (i.complete && i.naturalWidth) i.classList.add('is-loaded'); }); }
  var io;
  function initReveal() {
    var els = $$('.ov [data-rv]:not(.is-in)');
    if (reduced() || !('IntersectionObserver' in w)) { els.forEach(function (x) { x.classList.add('is-in'); }); return; }
    io = io || new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('is-in'); io.unobserve(x.target); } }); }, { rootMargin: '0px 0px -8% 0px', threshold: .12 });
    els.forEach(function (x) { io.observe(x); });
  }
  var pEls = [], ticking = false;
  function lowPower() { return (navigator.connection && navigator.connection.saveData) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2); }
  function initParallax() { pEls = reduced() || lowPower() ? [] : $$('.ov [data-parallax]'); pEls.forEach(function (x) { x.style.willChange = 'transform'; }); onScrollFrame(); }
  function onScrollFrame() {
    var vh = innerHeight;
    pEls.forEach(function (x) {
      var r = x.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh || !r.height) return;
      var lim = r.height * 0.055, off = Math.max(-lim, Math.min(lim, (r.top + r.height / 2 - vh / 2) * parseFloat(x.getAttribute('data-parallax'))));
      x.style.transform = 'translate3d(0,' + off.toFixed(1) + 'px,0) scale(1.14)';
    });
    ticking = false;
  }
  var lastY = 0;
  addEventListener('scroll', function () {
    var y = scrollY;
    header.classList.toggle('is-scrolled', y > 8);
    if (y > 260 && y > lastY + 4 && !openEl) { header.classList.add('is-hidden'); root.classList.add('ov-header-hidden'); }
    else if (y < lastY - 4 || y < 260) { header.classList.remove('is-hidden'); root.classList.remove('ov-header-hidden'); }
    lastY = y;
    if (!ticking && pEls.length) { ticking = true; requestAnimationFrame(onScrollFrame); }
    if (stickyBox && !stickyTick) { stickyTick = true; requestAnimationFrame(function () { stickyTick = false; updateSticky(); }); }
  }, { passive: true });
  function initRails() {
    $$('.ov [data-rail]').forEach(function (wr) {
      if (wr._init) return; wr._init = true;
      var r = $('.rail', wr), prev = $('[data-dir="-1"]', wr), nxt = $('[data-dir="1"]', wr), bar = $('.rail-progress i', wr);
      function step() { return r.firstElementChild ? r.firstElementChild.getBoundingClientRect().width + 16 : 300; }
      function sync() {
        var max = r.scrollWidth - r.clientWidth, vis = r.clientWidth / r.scrollWidth;
        bar.style.setProperty('--p', Math.min(1, vis + (max > 0 ? r.scrollLeft / max : 1) * (1 - vis)).toFixed(3));
        prev.disabled = r.scrollLeft < 4; nxt.disabled = r.scrollLeft > max - 4;
        $('.rail-ctrl', wr).style.display = max < 4 ? 'none' : '';
      }
      function go(k) { r.scrollBy({ left: k * step(), behavior: reduced() ? 'auto' : 'smooth' }); }
      prev.onclick = function () { go(-1); }; nxt.onclick = function () { go(1); };
      r.addEventListener('scroll', function () { requestAnimationFrame(sync); }, { passive: true });
      r.addEventListener('keydown', function (e) { if (e.target !== r) return; if (e.key === 'ArrowRight') { e.preventDefault(); go(1); } if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); } });
      var moved = 0;
      r.addEventListener('dragstart', function (e) { e.preventDefault(); });
      r.addEventListener('pointerdown', function (e) {
        if (e.pointerType !== 'mouse' || e.button !== 0) return;
        var sx = e.clientX, sl = r.scrollLeft; moved = 0;
        function mv(ev) { var dx = ev.clientX - sx; moved = Math.max(moved, Math.abs(dx)); if (moved > 4) { r.classList.add('is-dragging'); r.scrollLeft = sl - dx; } }
        function up() {
          removeEventListener('pointermove', mv); removeEventListener('pointerup', up);
          if (r.classList.contains('is-dragging')) { r.classList.remove('is-dragging'); var i = Math.round(r.scrollLeft / step()); r.scrollTo({ left: i * step(), behavior: reduced() ? 'auto' : 'smooth' }); }
        }
        addEventListener('pointermove', mv); addEventListener('pointerup', up);
      });
      r.addEventListener('click', function (e) { if (moved > 4) { e.preventDefault(); e.stopPropagation(); moved = 0; } }, true);
      if (w.ResizeObserver) new ResizeObserver(sync).observe(r);
      sync();
    });
  }
  function afterRender() { markLoaded(); initReveal(); initRails(); initParallax(); syncFav(); }

  /* ---------- 17. Page de commande : le vrai formulaire EasyOrders, dans la mise en page de la maquette ----------
     Rien n'est ajoute avant que l'application ait repris la page (regle React) ; nos blocs sont places a cote de ses
     champs, jamais a leur place, et remis si l'application redessine le formulaire. */
  function coSummary(isOpen) {
    var n = cartQty();
    return '<div class="ov ov-dc" id="ov-co-sum-wrap"><div class="co ov-dc"><aside class="summary co-sum' + (isOpen ? ' is-open' : '') + '" id="ov-co-sum">' +
      '<button class="co-sum-toggle" type="button" aria-expanded="' + !!isOpen + '"><span>Afficher le récapitulatif · ' + plural(n, 'article', 'articles') + '</span>' + I.chev + '</button>' +
      '<div class="co-sum__panel"><div><h2>Votre commande</h2>' + (cart || []).map(function (l) {
        return '<div class="co-line"><div class="co-line__img">' + img(l.img, l.name) + '<b>' + l.qty + '</b></div><div><p style="font:500 1.1rem/1.2 var(--f-display)">' + esc(l.name) + '</p><p class="muted" style="font-size:12.5px">' + esc(l.cat) + '</p></div><span>' + fmt(l.price * l.qty) + '</span></div>';
      }).join('') + '<div style="margin-top:12px">' + summaryRows() + '</div>' + miniAssure() + '</div></div></aside></div></div>';
  }
  var coObs = null;
  function decorateCheckout() {
    if (curView !== 'checkout') return;
    var form = $('#__next form#checkout-form'), box = $('#__next .checkout_container');
    if (!form || !box) return;
    root.classList.add('ov-co-ready');
    if (!$('#ov-co-sum-wrap', box)) { var s = $('#ov-co-sum-wrap'); if (s) s.remove(); box.insertAdjacentHTML('beforeend', coSummary(false)); }
    if (!$('#ov-co-head', form)) form.insertAdjacentHTML('afterbegin', '<div class="ov ov-dc" id="ov-co-head"><div class="co ov-dc"><div class="steps"><span>Panier</span><i></i><b>Coordonnées</b><i></i><span>Confirmation</span></div>' +
      '<h2>Vos coordonnées</h2><p class="muted" style="margin:-8px 0 24px;font-size:14px">Nous vous appelons pour confirmer la commande avant l’expédition.</p></div></div>');
    var btnBox = $('#checkout-button', form);
    if (btnBox && !$('#ov-co-pay', form)) btnBox.insertAdjacentHTML('beforebegin', '<div class="ov ov-dc" id="ov-co-pay"><div class="co ov-dc"><h2 style="margin-top:40px">Paiement</h2>' +
      '<div class="pay-opt"><span class="dot" aria-hidden="true"></span><div><strong>Paiement en espèces à la livraison</strong><span>Vous ouvrez le colis, vérifiez votre bijou, puis payez le livreur.</span></div></div>' +
      '<div class="sum-row" style="margin-top:20px"><span>Livraison</span><span class="free" style="color:var(--ok);font-weight:500">Offerte · 2 à 4 jours ouvrés</span></div></div></div>');
    var ph = { phone: '06 12 34 56 78', address: 'Quartier, rue, numéro' };
    Object.keys(ph).forEach(function (k) { var i = form.querySelector('[name="' + k + '"]'); if (i && !i.getAttribute('placeholder')) i.setAttribute('placeholder', ph[k]); });
    markLoaded();
    if (!coObs) { coObs = new MutationObserver(function () { if (!$('#ov-co-head') || !$('#ov-co-pay') || !$('#ov-co-sum-wrap')) decorateCheckout(); }); coObs.observe(next, { childList: true, subtree: true }); }
  }
  function initCheckout() {
    refreshCart().then(function (items) {
      if (curView !== 'checkout') return;
      if (!items.length) { root.classList.add('ov-co-empty'); mountPage('<div class="wrap">' + emptyCart() + '</div>'); return; }
      root.classList.remove('ov-co-empty');
      app().then(function () { return waitFor(function () { return $('#__next form#checkout-form'); }, 10000); }).then(decorateCheckout);
    });
  }
  d.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('#ov-co-sum .co-sum-toggle'); if (!t) return;
    var s = $('#ov-co-sum'); s.classList.toggle('is-open'); t.setAttribute('aria-expanded', s.classList.contains('is-open'));
  });

  /* ---------- 18. Routeur : quelle page de la maquette pour quelle adresse de la boutique ---------- */
  var page = null, curView = '', curKey = '', VIEWS = ['collection', 'product', 'search', 'favorites', 'info', 'cart', '404'];
  function viewOf() {
    var p = path();
    if (p === '/') return 'home';
    if (p.indexOf('/checkout') === 0) return 'checkout';
    var v = OVS.view(p);
    var nd = nextData(), pg = (w.next && w.next.router && w.next.router.pathname) || (nd && nd.page);
    if (!v && pg === '/_error' && !/^\/(thanks|order)/.test(p)) return '404';
    return v || 'theme';
  }
  function mountPage(html, after) {
    if (!page) { page = el('<main class="ov-page" id="ov-page" tabindex="-1"></main>'); top.appendChild(page); }
    page.innerHTML = html; page.hidden = false;
    var af = $('#ov-after'); if (af) af.innerHTML = after || '';
    root.classList.add('ov-page-ready');
    afterRender();
  }
  function render(keepScroll) {
    var v = curView, p = path(), seg = decodeURIComponent(p.split('/')[2] || '');
    if (v === 'collection') { mountPage(vCollection(seg)); data().then(function (list) { if (curView === v) fillCollection(seg, list); }); }
    else if (v === 'search') { var q = new URLSearchParams(location.search).get('q') || ''; mountPage(vSearch(q)); data().then(function (list) { if (curView === v) fillSearch(q, list); }); }
    else if (v === 'favorites') { mountPage(vFavorites(favItems([]))); data().then(function (list) { if (curView === v) { page.innerHTML = vFavorites(favItems(list)); afterRender(); } }); }
    else if (v === 'cart') { mountPage(vCart()); refreshCart(); }
    else if (v === 'info') { var h = vInfo(seg); if (h) mountPage(h); else { curView = '404'; root.classList.add('ov-v-404'); mountPage(vNotFound()); } }
    else if (v === '404') mountPage(vNotFound());
    else if (v === 'product') {
      productOf(seg).then(function (pr) {
        if (curView !== v) return;
        if (!pr || pr.variants) { root.classList.remove('ov-view', 'ov-v-product'); if (page) page.hidden = true; return; }   /* produit a options : la fiche du theme */
        mountPage(vProduct(pr)); initProduct(pr);
        data().then(function (list) { if (curView === v) { $('#ov-after').innerHTML = vRelated(list, pr); afterRender(); } });
        waitFor(function () { return $('#__next #ab-reviews .ab-reviews-score-value'); }, 15000).then(syncReviews);
      });
    }
    if (!keepScroll) scrollTo(0, 0);
  }
  function syncView() {
    var v = viewOf(), key = v + '|' + path() + '|' + location.search;
    if (key === curKey) return;
    var first = !curKey;
    curKey = key; curView = v;
    VIEWS.forEach(function (x) { root.classList.toggle('ov-v-' + x, x === v); });
    root.classList.toggle('ov-view', VIEWS.indexOf(v) >= 0);
    root.classList.toggle('ov-is-checkout', v === 'checkout');
    root.classList.remove('ov-co-ready', 'ov-co-empty', 'ov-rev-empty', 'ov-page-ready');
    filters = { cats: [], price: '', tags: [], sort: 'reco' }; gridBase = null;
    hideSticky();
    if (page) page.hidden = true;
    var af = $('#ov-after'); if (af) af.innerHTML = '';
    syncHome();
    if (VIEWS.indexOf(v) >= 0) render(first);
    if (v === 'checkout') initCheckout();
    var slug = (path().match(/^\/collections\/([^\/]+)/) || [])[1] || '';
    $$('.ov .nav a[data-nav]').forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('data-nav') === slug); });
  }

  /* ---------- 19. Suivi de la page (navigation de l'application sans rechargement) ---------- */
  var tick = 0, lastCount = null;
  function watch() {
    tick = 0;
    syncView();
    /* le compteur du theme a bouge (ajout fait par la boutique elle-meme) : on relit le panier */
    var c = $('#__next #header-cart-count'), n = c ? c.getAttribute('data-count-value') || c.textContent : null;
    if (n !== lastCount) { if (lastCount !== null) refreshCart(); lastCount = n; }
    if (curView === 'product' && $('#__next #ab-reviews')) syncReviews();
    syncCounts();
  }
  new MutationObserver(function () { if (!tick) tick = setTimeout(watch, 120); }).observe(d.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-count-value'] });
  addEventListener('storage', function (e) { if (e.key === 'wish-list') { syncCounts(); syncFav(); } });
  addEventListener('popstate', function () { setTimeout(watch, 0); });
  watch();
  afterRender();
  /* panier du visiteur : lu quand la page est posee (ne passe pas avant la photo principale) */
  (w.requestIdleCallback || function (f) { setTimeout(f, 1200); })(function () { if (!cart) refreshCart(); }, { timeout: 2500 });
})();
