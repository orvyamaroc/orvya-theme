/* ORVYA — design « L'heure dorée » sur la boutique EasyOrders (copie fidele de la maquette orvya-redesign-preview.html).
 *
 * Charge par le code du head EasyOrders (script bloquant, juste apres la feuille de style) : il s'execute pendant la lecture
 * de la page, avant le reste du contenu, donc l'en-tete et l'accueil de la maquette sont la des le premier affichage.
 *
 * Regle React (voir head-code) : rien n'est ajoute DANS l'application (#__next). Nos blocs sont places a cote :
 *   body > [div.ov.ov-top : annonce, en-tete, accueil]  [#__next : la boutique EasyOrders]  [div.ov : pied de page, tiroirs]
 * Le theme reste en dessous pour tout ce qui compte : panier, commande, liste d'envies, recherche.
 * Les produits et collections viennent de l'API publique de la boutique : un nouveau produit apparait tout seul.
 */
(function () {
  'use strict';
  var d = document, w = window, root = d.documentElement;
  if (w.__ovTheme || location.pathname.indexOf('/home-builder') === 0 || /[?&]ov=0/.test(location.search)) return;
  w.__ovTheme = 1;
  var next = d.getElementById('__next');
  if (!next || !d.body) return;

  /* ---------- 1. Donnees fixes ---------- */
  var API = 'https://api.easy-orders.net/api/v1/';
  var CDN = 'https://files.easy-orders.net/';
  var ASSETS = w.OV_ASSETS || (d.currentScript && d.currentScript.src || '').replace(/dist\/orvya\.min\.js.*$/, 'assets/');
  var WA = 'https://wa.me/212656127778';
  var WA_TRACK = WA + '?text=' + encodeURIComponent('Bonjour, je souhaite suivre ma commande.');
  var LOGO = CDN + '1791664966379343969.webp';
  var CATS = {
    bijoux: { name: 'Tous les bijoux', img: CDN + '1791668681520009646.webp' },
    bagues: { name: 'Bagues', img: CDN + '1791667646678676581.webp' },
    colliers: { name: 'Colliers', img: CDN + '1791667697388840139.webp' },
    bracelets: { name: 'Bracelets', img: CDN + '1791667736419850997.webp' },
    'boucles-oreilles': { name: 'Boucles d’oreilles', img: CDN + '1791667773890855965.webp' }
  };
  var ORDER = ['bagues', 'colliers', 'bracelets', 'boucles-oreilles'];
  var PAGES = { livraison: '/pages/shipping-policy', retours: '/pages/refund-policy', garantie: '/pages/garantie', confidentialite: '/pages/privacy-policy', conditions: '/pages/terms-and-conditions' };
  var FAQ = [
    ['Quels sont les délais de livraison ?', 'Après confirmation de votre commande par téléphone, votre bijou vous parvient en 2 à 4 jours ouvrés selon votre ville. La livraison est offerte partout au Maroc.'],
    ['Comment se fait le paiement ?', 'En espèces, à la livraison. Aucun paiement à l’avance.'],
    ['Puis-je ouvrir le colis avant de payer ?', 'Bien sûr. Ouvrez votre colis et découvrez votre bijou avant de régler.'],
    ['Comment entretenir mes bijoux ?', 'Rangez-les à l’abri de l’humidité et évitez le contact direct avec le parfum et les crèmes pour préserver leur éclat. Une question ? Écrivez-nous sur WhatsApp.'],
    ['Puis-je échanger ou retourner un bijou ?', 'Oui, sous 7 jours après réception, si le bijou est non porté, non endommagé et dans son emballage d’origine. Pour des raisons d’hygiène, les boucles d’oreilles ne sont ni reprises ni échangées, sauf défaut de fabrication.'],
    ['Mes bijoux sont-ils garantis ?', 'Oui, 2 ans. Si la finition dorée se dégrade dans des conditions d’utilisation normales, nous échangeons votre bijou gratuitement.']
  ];
  var I = {
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    left: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M15 6l-6 6 6 6"/></svg>',
    right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M9 6l6 6-6 6"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0112 7.3a4.3 4.3 0 017.5 2.5C19.5 15.4 12 20 12 20z"/></svg>',
    bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M5 8h14l-1.2 12H6.2L5 8z"/><path d="M9 8V6.5a3 3 0 016 0V8"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="17.5" r="1.6"/><circle cx="17" cy="17.5" r="1.6"/></svg>',
    cash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="3" y="6.5" width="18" height="11" rx="1"/><circle cx="12" cy="12" r="2.6"/><path d="M6.5 9.5v5M17.5 9.5v5"/></svg>',
    box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M3.5 8L12 4l8.5 4v8L12 20l-8.5-4z"/><path d="M3.5 8L12 12l8.5-4M12 12v8"/></svg>',
    swap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M4 9h14l-3.5-3.5M20 15H6l3.5 3.5"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M12 3l7 3v5.5c0 4.4-3 7.7-7 9.5-4-1.8-7-5.1-7-9.5V6z"/><path d="M9 12l2 2 4-4"/></svg>',
    drop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M12 3.5s6 6.6 6 10.7a6 6 0 01-12 0C6 10.1 12 3.5 12 3.5z"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    chev: '<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M2 4.5l4 4 4-4"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M3 7h18M3 12h18M3 17h12"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="12" cy="8.5" r="3.8"/><path d="M4.5 20c1.2-3.6 4-5.5 7.5-5.5s6.3 1.9 7.5 5.5"/></svg>',
    ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3.5" y="3.5" width="17" height="17" rx="4.5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r=".6" fill="currentColor"/></svg>',
    fb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 8.5h2.5V5H14a3.5 3.5 0 00-3.5 3.5V11H8v3.5h2.5V21H14v-6.5h2.5L17 11h-3V9a.5.5 0 01.5-.5z"/></svg>',
    tt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 3v11.5a3.5 3.5 0 11-3-3.46M14 3c.5 2.6 2.3 4.4 5 4.6"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 20l1.2-3.8A8 8 0 1112 20a8 8 0 01-4-1.1L4 20z"/><path d="M9 8.8c0 3 2.3 6 5.6 6.4l1-1.3-1.8-1-1 .8c-1-.4-2-1.4-2.4-2.4l.8-1-1-1.8-1.2 1z"/></svg>'
  };

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

  /* ---------- 3. En-tete et bandeau (maquette, liens de la boutique) ---------- */
  var navLinks = '<a href="/collections/bijoux" data-nav="bijoux">Tous les bijoux</a>' + ORDER.map(function (k) { return '<a href="/collections/' + k + '" data-nav="' + k + '">' + CATS[k].name + '</a>'; }).join('');
  var help = [['Livraison', PAGES.livraison], ['Retours &amp; échanges', PAGES.retours], ['Garantie', PAGES.garantie], ['Questions fréquentes', '/#ov-faq'], ['Suivre ma commande', WA_TRACK], ['Nous contacter', WA]];
  var top = el('<div class="ov ov-top">' +
    '<div class="annonce" role="region" aria-label="Informations de livraison"><div class="wrap">' +
      '<span>Livraison offerte<span class="annonce__plus"> partout au Maroc</span></span><span class="annonce__sep" aria-hidden="true"></span>' +
      '<span>Paiement à la livraison</span><span class="annonce__sep annonce__plus" aria-hidden="true"></span>' +
      '<span class="annonce__plus">Ouvrez votre colis avant de payer</span></div></div>' +
    '<header class="header" id="ov-header"><div class="wrap header__bar">' +
      '<div class="header__left"><button class="icon-btn menu-btn" data-open="ov-menu" aria-label="Ouvrir le menu" aria-controls="ov-menu" aria-expanded="false">' + I.menu + '</button>' +
      '<button class="icon-btn search-btn" data-open="ov-search" aria-label="Rechercher">' + I.search + '</button></div>' +
      '<a class="logo" href="/" aria-label="ORVYA, accueil"><img src="' + LOGO + '" alt="ORVYA" width="89" height="30"></a>' +
      '<nav class="nav" aria-label="Navigation principale">' + navLinks +
        '<div class="nav__drop"><button aria-haspopup="true">Aide ' + I.chev + '</button><div class="dropdown" role="menu">' +
        help.map(function (h) { return '<a href="' + h[1] + '" role="menuitem"' + (/^https:/.test(h[1]) ? ' target="_blank" rel="noopener"' : '') + '>' + h[0] + '</a>'; }).join('') + '</div></div></nav>' +
      '<div class="header__right">' +
        '<button class="icon-btn hide-sm" data-open="ov-search" aria-label="Rechercher">' + I.search + '</button>' +
        '<a class="icon-btn hide-sm" href="' + WA_TRACK + '" target="_blank" rel="noopener" aria-label="Suivre ma commande">' + I.user + '</a>' +
        '<a class="icon-btn" href="/wishlist" aria-label="Mes favoris">' + I.heart + '<span class="count" id="ov-fav-count">0</span></a>' +
        '<button class="icon-btn" id="ov-cart-btn" aria-label="Ouvrir le panier">' + I.bag + '<span class="count" id="ov-cart-count">0</span></button>' +
      '</div></div></header></div>');
  d.body.insertBefore(top, next);
  root.classList.add('ov-on');
  var header = $('#ov-header', top);

  /* ---------- 4. Accueil (maquette, produits et collections de la boutique) ---------- */
  var home = null;
  function trustItems() {
    return [[I.truck, 'Livraison offerte', 'Partout au Maroc'], [I.cash, 'Paiement à la livraison', 'En espèces, aucun paiement à l’avance'],
      [I.box, 'Ouvrez avant de payer', 'Vérifiez votre bijou à la réception'], [I.swap, 'Échange sous 7 jours', '<a class="link-u" href="' + PAGES.retours + '">Voir les conditions</a>']];
  }
  function rail(items, label, cls) {
    return '<div class="rail-wrap" data-rail><div class="rail ' + (cls || '') + '" tabindex="0" role="region" aria-label="' + esc(label) + ' (faites défiler horizontalement)">' + items + '</div>' +
      '<div class="wrap rail-ctrl"><div class="rail-progress" aria-hidden="true"><i></i></div><div class="rail-btns"><button class="round-btn" data-dir="-1" aria-label="Précédent">' + I.left + '</button><button class="round-btn" data-dir="1" aria-label="Suivant">' + I.right + '</button></div></div></div>';
  }
  function acc(title, body) {
    return '<div class="acc"><button class="acc__btn" aria-expanded="false">' + title + '<span class="acc__ico" aria-hidden="true"></span></button><div class="acc__panel"><div class="acc__inner"><div class="acc__content">' + body + '</div></div></div></div>';
  }
  function catCard(k, i, n) {
    return '<a class="cat-card" href="/collections/' + k + '" data-rv style="--i:' + i + '"><div class="arch" data-rv="arch" style="--i:' + i + '">' + img(CATS[k].img, CATS[k].name) + '</div><h3 class="cat-card__name">' + CATS[k].name + '</h3><span class="cat-card__meta" data-count="' + k + '">' + (n == null ? 'Découvrir' : plural(n, 'pièce', 'pièces')) + ' ' + I.arrow + '</span></a>';
  }
  function card(p, i) {
    return '<article class="card" data-rv style="--i:' + (i % 4) + '">' +
      '<a class="card__media" href="/products/' + p.slug + '" tabindex="-1" aria-hidden="true">' + img(p.img, p.name, 'card__img') + '</a>' +
      '<button class="fav" data-fav="' + p.id + '" aria-pressed="false" aria-label="Ajouter aux favoris : ' + esc(p.name) + '">' + I.heart + '</button>' +
      '<button class="card__quick" data-add="' + p.id + '" data-href="/products/' + p.slug + '" aria-label="Ajouter au panier : ' + esc(p.name) + '">' + I.bag + '<span>Ajouter au panier</span></button>' +
      '<div class="card__body"><p class="card__cat">' + esc(p.cat) + '</p><h3 class="card__name"><a href="/products/' + p.slug + '">' + esc(p.name) + '</a></h3><p class="card__price">' + fmt(p.price) + '</p></div></article>';
  }
  function skelCard() { return '<div aria-hidden="true"><div class="skel" style="aspect-ratio:4/5"></div><div class="skel" style="height:10px;width:40%;margin-top:16px"></div><div class="skel" style="height:16px;width:75%;margin-top:10px"></div><div class="skel" style="height:12px;width:30%;margin-top:10px"></div></div>'; }

  function homeHTML() {
    return '<main class="ov-home" id="ov-main">' +
    '<section class="hero"><div class="wrap hero__grid"><div class="hero__text">' +
      '<p class="eyebrow hero-in" style="--d:0">Acier inoxydable · finition dorée</p>' +
      '<h1 class="display hero-in" style="--d:1">L’éclat qui<br><em>vous ressemble</em></h1>' +
      '<p class="lead hero-in" style="--d:2">Des pièces fines, pensées pour sublimer chaque instant, du matin au soir.</p>' +
      '<div class="hero__cta hero-in" style="--d:3"><a class="btn" href="/collections/bijoux">Découvrir la collection</a><a class="link-u" href="' + PAGES.livraison + '">Livraison offerte · Paiement à la livraison</a></div></div>' +
      '<div class="hero__media hero-in-media"><div class="arch"><img src="' + CDN + '1791667426966739316.webp" alt="Femme portant un collier et des bagues dorés sur une robe bordeaux" fetchpriority="high" decoding="async" data-parallax="0.06"></div></div></div></section>' +
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
    '<section class="section" id="ov-faq"><div class="wrap" style="max-width:820px"><div class="center" style="margin-bottom:40px"><p class="eyebrow" data-rv>Vos questions</p><h2 class="h2 split" data-rv>' + split('Tout savoir avant [[de commander]]') + '</h2><span class="filet" data-rv="line"></span></div>' +
      '<div data-rv>' + FAQ.slice(0, 5).map(function (q) { return acc(q[0], '<p>' + q[1] + '</p>'); }).join('') + '</div>' +
      '<p class="center" style="margin-top:32px"><a class="link-arrow" href="#ov-faq" data-faq-all>Toutes les questions ' + I.arrow + '</a></p></div></section>' +
    '<section class="news section--tight"><div class="wrap center" style="max-width:720px"><p class="eyebrow" data-rv>Rejoignez l’univers ORVYA</p>' +
      '<h2 class="h2" style="margin-top:12px" data-rv>Soyez la première informée</h2><p class="muted" style="margin-top:12px" data-rv>Nos nouvelles collections et nos offres privées, directement dans votre boîte mail.</p>' +
      '<form class="news__form" id="ov-news" data-rv novalidate><label class="sr-only" for="ov-news-mail">Votre adresse e-mail</label><input class="input" id="ov-news-mail" type="email" placeholder="Votre adresse e-mail" autocomplete="email" required><button class="btn">S’inscrire</button></form>' +
      '<small>En vous inscrivant, vous acceptez notre <a class="link-u" href="' + PAGES.confidentialite + '">politique de confidentialité</a>. Désinscription possible à tout moment.</small></div></section>' +
    '</main>';
  }
  function syncHome() {
    var on = path() === '/';
    root.classList.toggle('ov-home', on);
    if (on && !home) { home = el(homeHTML()); top.appendChild(home); data().then(fillHome); afterRender(); }
    if (home) home.hidden = !on;
  }
  syncHome();

  /* ---------- 5. Donnees de la boutique (API publique EasyOrders) ---------- */
  var dataP = null;
  function data() {
    if (dataP) return dataP;
    function get(u) { return fetch(API + u, { credentials: 'omit' }).then(function (r) { if (!r.ok) throw r.status; return r.json(); }).then(function (j) { return Array.isArray(j) ? j : (j.data || []); }); }
    dataP = get('products?fields=id,name,price,sale_price,slug,thumb,position,hidden,categories&join=categories&limit=200&sort=position,desc').then(function (list) {
      return list.filter(function (p) { return !p.hidden; }).map(function (p) {
        var c = (p.categories || []).filter(function (c) { return c.slug !== 'bijoux'; })[0];
        return { id: p.id, name: p.name, slug: p.slug, price: p.sale_price || p.price, img: p.thumb, catSlug: c ? c.slug : '', cat: c ? (CATS[c.slug] ? CATS[c.slug].name : c.name) : '' };
      });
    }).catch(function () { return []; });
    return dataP;
  }
  function fillHome(list) {
    if (!home) return;
    ORDER.forEach(function (k) {
      var n = list.filter(function (p) { return p.catSlug === k; }).length, m = $('[data-count="' + k + '"]', home);
      if (m && list.length) m.innerHTML = plural(n, 'pièce', 'pièces') + ' ' + I.arrow;
    });
    var box = $('#ov-signature', home);
    if (list.length) { box.innerHTML = rail(list.map(card).join(''), 'Pièces signature'); afterRender(); syncFav(); }
  }

  /* ---------- 6. Pied de page, menu, recherche, voile, messages (fin de page, hors de l'application) ---------- */
  function linkList(items) { return '<ul>' + items.map(function (h) { return '<li><a href="' + h[1] + '"' + (/^https:/.test(h[1]) ? ' target="_blank" rel="noopener"' : '') + '>' + h[0] + '</a></li>'; }).join('') + '</ul>'; }
  function mountEnd() {
    if ($('#ov-footer')) return;
    var arrowLink = function (k, i) { return '<a href="/collections/' + k + '" style="--i:' + i + '">' + CATS[k].name + ' ' + I.arrow + '</a>'; };
    var end = el('<div class="ov ov-end">' +
      '<footer class="footer" id="ov-footer"><div class="wrap"><div class="footer__grid">' +
        '<div class="footer__brand"><img src="' + ASSETS + 'orvya-logo-gold-transparent-800.png" alt="ORVYA" width="101" height="34" loading="lazy">' +
          '<p>Bijoux en acier inoxydable à finition dorée. Livraison offerte partout au Maroc, paiement à la livraison.</p><div class="socials">' +
          '<a href="https://www.instagram.com/orvya.ma/" target="_blank" rel="noopener" aria-label="Instagram">' + I.ig + '</a>' +
          '<a href="https://www.facebook.com/orvya.official" target="_blank" rel="noopener" aria-label="Facebook">' + I.fb + '</a>' +
          '<a href="https://www.tiktok.com/@orvya.official" target="_blank" rel="noopener" aria-label="TikTok">' + I.tt + '</a>' +
          '<a href="' + WA + '" target="_blank" rel="noopener" aria-label="WhatsApp">' + I.wa + '</a></div></div>' +
        '<div><h4>Boutique</h4>' + linkList([['Tous les bijoux', '/collections/bijoux']].concat(ORDER.map(function (k) { return [CATS[k].name, '/collections/' + k]; }))) + '</div>' +
        '<div><h4>Aide</h4>' + linkList([['Livraison', PAGES.livraison], ['Retours &amp; échanges', PAGES.retours], ['Garantie', PAGES.garantie], ['Questions fréquentes', '/#ov-faq'], ['Suivre ma commande', WA_TRACK]]) + '</div>' +
        '<div><h4>ORVYA</h4>' + linkList([['Nous contacter', WA], ['Politique de confidentialité', PAGES.confidentialite], ['Conditions d’utilisation', PAGES.conditions]]) + '</div>' +
      '</div><div class="footer__base"><span>© ' + new Date().getFullYear() + ' ORVYA · Paiement en espèces à la livraison</span><span>Acier inoxydable 316L, finition dorée PVD</span></div></div></footer>' +
      '<div class="drawer drawer--left" id="ov-menu" role="dialog" aria-modal="true" aria-label="Menu" aria-hidden="true"><div class="drawer__head">' +
        '<img src="' + LOGO + '" alt="ORVYA" style="height:26px;width:auto"><button class="icon-btn" data-close aria-label="Fermer le menu">' + I.close + '</button></div>' +
        '<div class="drawer__body"><nav class="mnav__main stagger" aria-label="Catégories"><a href="/collections/bijoux" style="--i:0">Tous les bijoux ' + I.arrow + '</a>' + ORDER.map(function (k, i) { return arrowLink(k, i + 1); }).join('') + '</nav>' +
        '<div class="mnav__sub stagger"><a href="/wishlist" style="--i:5">Mes favoris</a><a href="' + WA_TRACK + '" target="_blank" rel="noopener" style="--i:6">Suivre ma commande</a><a href="' + PAGES.livraison + '" style="--i:7">Livraison</a><a href="' + PAGES.retours + '" style="--i:8">Retours &amp; échanges</a><a href="/#ov-faq" style="--i:9">Questions fréquentes</a><a href="' + PAGES.garantie + '" style="--i:10">Garantie</a></div>' +
        '<div class="mnav__wa stagger"><a class="btn btn--ghost btn--full" style="--i:11" href="' + WA + '" target="_blank" rel="noopener">Écrivez-nous sur WhatsApp</a></div></div></div>' +
      '<div class="search" id="ov-search" role="dialog" aria-modal="true" aria-label="Recherche" aria-hidden="true"><div class="wrap"><form class="search__bar" id="ov-search-form" role="search" action="/search">' + I.search +
        '<label class="sr-only" for="ov-search-input">Rechercher un bijou</label><input class="search__input" id="ov-search-input" name="q" type="search" placeholder="Bague, collier, zircon…" autocomplete="off" enterkeyhint="search">' +
        '<button type="button" class="icon-btn" data-close aria-label="Fermer la recherche">' + I.close + '</button></form><div class="search__body" id="ov-search-body"></div></div></div>' +
      '<div class="veil" id="ov-veil"></div><div class="toasts" id="ov-toasts" aria-live="polite" aria-atomic="false"></div></div>');
    d.body.appendChild(end);
    $('#ov-veil').addEventListener('click', function () { closeAll(); });
    $('#ov-search-input').addEventListener('input', function (e) { clearTimeout(sTimer); sTimer = setTimeout(function () { renderSearch(e.target.value); }, 120); });
    syncCounts();
  }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', mountEnd); else mountEnd();

  /* ---------- 7. Tiroirs (maquette) ---------- */
  var openEl = null, lastFocus = null, sTimer;
  function open(id) {
    if (openEl) closeAll(true);
    var x = $('#' + id); if (!x) return;
    lastFocus = d.activeElement; openEl = x;
    x.classList.add('is-open'); x.setAttribute('aria-hidden', 'false');
    $('#ov-veil').classList.add('is-on'); root.classList.add('ov-locked');
    $$('[aria-controls="' + id + '"]').forEach(function (b) { b.setAttribute('aria-expanded', 'true'); });
    setTimeout(function () { var f = id === 'ov-search' ? $('#ov-search-input') : x.querySelector('button,[href],input'); if (f) f.focus({ preventScroll: true }); }, id === 'ov-search' ? 60 : 120);
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
  function toast(msg, action, href) {
    var box = $('#ov-toasts'); if (!box) return;
    var t = d.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status');
    t.innerHTML = I.check + '<span>' + msg + '</span>' + (action ? '<a href="' + href + '">' + action + '</a>' : '');
    box.appendChild(t);
    setTimeout(function () { t.classList.add('out'); setTimeout(function () { t.remove(); }, 300); }, action ? 5000 : 3200);
  }

  /* ---------- 8. Recherche (maquette, produits de la boutique) ---------- */
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
        return;
      }
      var res = list.filter(function (p) { var h = norm(p.name + ' ' + p.cat); return terms.every(function (t) { return h.indexOf(t) >= 0; }); });
      body.innerHTML = res.length
        ? '<p class="eyebrow" style="margin-bottom:4px">' + plural(res.length, 'résultat', 'résultats') + '</p><div class="s-results">' + res.map(function (p, i) { return sItem(p, i, terms); }).join('') + '</div><a class="link-arrow" style="margin-top:20px" href="/search?q=' + encodeURIComponent(q) + '">Voir tous les résultats ' + I.arrow + '</a>'
        : '<p style="padding:12px 0">Aucun bijou ne correspond à « ' + esc(q) + ' ». Essayez « collier », « zircon » ou « bague ».</p>';
    });
  }

  /* ---------- 9. Panier et favoris : ceux de la boutique EasyOrders ---------- */
  function hydrated() { return w.orvyaHydrated ? w.orvyaHydrated() : !!$('.ab-footer-grid'); }
  /* l'application est en pause sur l'accueil (vitesse) : on la demarre si besoin, puis on clique son bouton */
  function whenApp(fn) {
    if (hydrated()) return fn();
    if (w.orvyaBoot) try { w.orvyaBoot(); } catch (e) {}
    var t0 = Date.now(), iv = setInterval(function () { if (hydrated() || Date.now() - t0 > 8000) { clearInterval(iv); fn(); } }, 80);
  }
  function openCart() { whenApp(function () { var b = $('#__next .cart-btn'); if (b) b.click(); }); }
  function countBadge(id, n) { var c = $('#' + id); if (!c) return; var was = c.textContent; c.textContent = n; c.classList.toggle('is-on', n > 0); if (String(n) !== was && n > 0 && !reduced()) { c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump'); } }
  function wish() { try { return (JSON.parse(localStorage.getItem('wish-list')) || {}).state.wishListProducts || []; } catch (e) { return []; } }
  function syncCounts() {
    var c = $('#__next #header-cart-count');
    countBadge('ov-cart-count', c ? (+c.getAttribute('data-count-value') || +c.textContent || 0) : 0);
    countBadge('ov-fav-count', wish().length);
  }
  /* favoris = la liste d'envies de la boutique (enregistree dans le navigateur, page /wishlist), meme format que le theme */
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
    });
  }
  function syncFav() {
    var ids = wish().map(function (p) { return p && (p.id || p.product_id); });
    $$('.ov [data-fav]').forEach(function (b) { var on = ids.indexOf(b.getAttribute('data-fav')) >= 0; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on); });
  }

  /* ---------- 10. Clics (delegation, comme la maquette) ---------- */
  d.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('.ov [data-open],.ov [data-close],.ov .acc__btn,.ov [data-add],.ov [data-fav],.ov [data-suggest],.ov [data-faq-all],#ov-cart-btn');
    if (!t) return;
    if (t.hasAttribute('data-fav')) { e.preventDefault(); toggleFav(t.getAttribute('data-fav'), t); return; }
    /* la boutique n'a pas encore de page « Questions frequentes » : toutes les questions s'affichent ici */
    if (t.hasAttribute('data-faq-all')) { e.preventDefault(); var list = t.closest('.wrap').querySelector('[data-rv] .acc').parentElement; FAQ.slice(list.children.length).forEach(function (q) { list.insertAdjacentHTML('beforeend', acc(q[0], '<p>' + q[1] + '</p>')); }); t.parentElement.hidden = true; return; }
    if (t.id === 'ov-cart-btn') { e.preventDefault(); closeAll(true); openCart(); return; }
    if (t.hasAttribute('data-open')) { e.preventDefault(); open(t.getAttribute('data-open')); return; }
    if (t.hasAttribute('data-close')) { e.preventDefault(); closeAll(); return; }
    if (t.hasAttribute('data-suggest')) { var i = $('#ov-search-input'); i.value = t.getAttribute('data-suggest'); renderSearch(i.value); return; }
    if (t.classList.contains('acc__btn')) { var a = t.parentElement, on = a.classList.toggle('is-open'); t.setAttribute('aria-expanded', on); return; }
    /* « Ajouter au panier » : le bouton d'ajout rapide de la carte du theme (masquee) fait l'ajout, dans le vrai panier ;
       sans carte du theme sur la page, la fiche produit s'ouvre */
    if (t.hasAttribute('data-add')) {
      e.preventDefault();
      var href = t.getAttribute('data-href');
      whenApp(function () {
        var b = $('#__next a.ab-pgrid-card[href="' + href + '"] .ab-card-cart-btn');
        if (!b) { location.href = href; return; }
        b.click(); t.classList.add('is-done'); setTimeout(function () { t.classList.remove('is-done'); }, 1600);
      });
    }
  });
  /* liens internes : fermer le tiroir ouvert */
  d.addEventListener('click', function (e) { var a = e.target.closest && e.target.closest('.ov a[href]'); if (a && openEl) closeAll(true); }, true);
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

  /* ---------- 11. Mouvement (maquette) ---------- */
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
  function afterRender() { markLoaded(); initReveal(); initRails(); initParallax(); }

  /* ---------- 12. Suivi de la page (navigation de l'application sans rechargement) ---------- */
  var lastPath = null, tick = 0;
  function watch() {
    tick = 0;
    var p = path();
    if (p !== lastPath) {
      lastPath = p; syncHome(); closeAll(true);
      var slug = (p.match(/^\/collections\/([^\/]+)/) || [])[1] || '';
      $$('.ov .nav a[data-nav]').forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('data-nav') === slug); });
    }
    syncCounts();
  }
  new MutationObserver(function () { if (!tick) tick = setTimeout(watch, 120); }).observe(d.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-count-value'] });
  addEventListener('storage', function (e) { if (e.key === 'wish-list') { syncCounts(); syncFav(); } });
  watch();
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', afterRender); else afterRender();
})();
