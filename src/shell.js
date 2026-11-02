/* ORVYA — haut de page de la maquette (bandeau, en-tete, hero) : donnees et gabarits partages.
 *
 * Deux usages, un seul texte, donc jamais de difference entre les deux :
 *   1. build.js en tire dist/shell.html, colle tel quel dans le code du head EasyOrders : le haut de page est dans le
 *      HTML recu par le navigateur, il s'affiche (et la photo du hero se charge) sans attendre orvya.min.js (vitesse).
 *   2. orvya.js (meme fichier final) s'en sert si ce HTML statique n'est pas la (secours).
 */
var OVS = (function () {
  var CDN = 'https://files.easy-orders.net/';
  var WA = 'https://wa.me/212656127778';
  var S = {
    CDN: CDN,
    WA: WA,
    WA_TRACK: WA + '?text=' + encodeURIComponent('Bonjour, je souhaite suivre ma commande.'),
    LOGO: CDN + '1791664966379343969.webp',
    HERO: CDN + '1791667426966739316.webp',
    CATS: {
      bijoux: { name: 'Tous les bijoux', img: CDN + '1791668681520009646.webp' },
      bagues: { name: 'Bagues', img: CDN + '1791667646678676581.webp' },
      colliers: { name: 'Colliers', img: CDN + '1791667697388840139.webp' },
      bracelets: { name: 'Bracelets', img: CDN + '1791667736419850997.webp' },
      'boucles-oreilles': { name: 'Boucles d’oreilles', img: CDN + '1791667773890855965.webp' }
    },
    ORDER: ['bagues', 'colliers', 'bracelets', 'boucles-oreilles'],
    PAGES: { livraison: '/pages/shipping-policy', retours: '/pages/refund-policy', garantie: '/pages/garantie', confidentialite: '/pages/privacy-policy', conditions: '/pages/terms-and-conditions' },
    I: {
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
    }
  };
  var I = S.I, P = S.PAGES;
  function ext(h) { return /^https:/.test(h) ? ' target="_blank" rel="noopener"' : ''; }

  /* Bandeau + en-tete (div.ov-top, sans boite : l'en-tete reste colle en haut de toute la page) */
  S.top = function () {
    var help = [['Livraison', P.livraison], ['Retours &amp; échanges', P.retours], ['Garantie', P.garantie], ['Questions fréquentes', '/#ov-faq'], ['Suivre ma commande', S.WA_TRACK], ['Nous contacter', WA]];
    return '<div class="ov ov-top" id="ov-top">' +
      '<div class="annonce" role="region" aria-label="Informations de livraison"><div class="wrap">' +
        '<span>Livraison offerte<span class="annonce__plus"> partout au Maroc</span></span><span class="annonce__sep" aria-hidden="true"></span>' +
        '<span>Paiement à la livraison</span><span class="annonce__sep annonce__plus" aria-hidden="true"></span>' +
        '<span class="annonce__plus">Ouvrez votre colis avant de payer</span></div></div>' +
      '<header class="header" id="ov-header"><div class="wrap header__bar">' +
        '<div class="header__left"><button class="icon-btn menu-btn" data-open="ov-menu" aria-label="Ouvrir le menu" aria-controls="ov-menu" aria-expanded="false">' + I.menu + '</button>' +
        '<button class="icon-btn search-btn" data-open="ov-search" aria-label="Rechercher">' + I.search + '</button></div>' +
        '<a class="logo" href="/" aria-label="ORVYA, accueil"><img src="' + S.LOGO + '" alt="ORVYA" width="89" height="30"></a>' +
        '<nav class="nav" aria-label="Navigation principale"><a href="/collections/bijoux" data-nav="bijoux">Tous les bijoux</a>' +
          S.ORDER.map(function (k) { return '<a href="/collections/' + k + '" data-nav="' + k + '">' + S.CATS[k].name + '</a>'; }).join('') +
          '<div class="nav__drop"><button aria-haspopup="true">Aide ' + I.chev + '</button><div class="dropdown" role="menu">' +
          help.map(function (h) { return '<a href="' + h[1] + '" role="menuitem"' + ext(h[1]) + '>' + h[0] + '</a>'; }).join('') + '</div></div></nav>' +
        '<div class="header__right">' +
          '<button class="icon-btn hide-sm" data-open="ov-search" aria-label="Rechercher">' + I.search + '</button>' +
          '<a class="icon-btn hide-sm" href="' + S.WA_TRACK + '" target="_blank" rel="noopener" aria-label="Suivre ma commande">' + I.user + '</a>' +
          '<a class="icon-btn" href="/wishlist" aria-label="Mes favoris">' + I.heart + '<span class="count" id="ov-fav-count">0</span></a>' +
          '<button class="icon-btn" id="ov-cart-btn" aria-label="Ouvrir le panier">' + I.bag + '<span class="count" id="ov-cart-count">0</span></button>' +
        '</div></div></header></div>';
  };

  /* Hero de l'accueil (la photo est l'element le plus grand de l'ecran : elle doit etre dans le HTML recu) */
  S.hero = function () {
    return '<section class="hero"><div class="wrap hero__grid"><div class="hero__text">' +
      '<p class="eyebrow hero-in" style="--d:0">Acier inoxydable · finition dorée</p>' +
      '<h1 class="display hero-in" style="--d:1">L’éclat qui<br><em>vous ressemble</em></h1>' +
      '<p class="lead hero-in" style="--d:2">Des pièces fines, pensées pour sublimer chaque instant, du matin au soir.</p>' +
      '<div class="hero__cta hero-in" style="--d:3"><a class="btn" href="/collections/bijoux">Découvrir la collection</a><a class="link-u" href="' + P.livraison + '">Livraison offerte · Paiement à la livraison</a></div></div>' +
      '<div class="hero__media hero-in-media"><div class="arch"><img src="' + S.HERO + '" alt="Femme portant un collier et des bagues dorés sur une robe bordeaux" fetchpriority="high" decoding="async" data-parallax="0.06"></div></div></div></section>';
  };

  /* Ce qui part dans le code du head : en-tete pour toutes les pages ; hero pose tout de suite sur l'accueil
     (le gabarit <template> n'est pas affiche ailleurs). ?ov=0 et l'editeur de la page d'accueil gardent le theme seul. */
  S.staticShell = function () {
    return S.top() + '<template id="ov-hero-tpl"><main class="ov-home" id="ov-main">' + S.hero() + '</main></template>' +
      '<script>!function(){var d=document,r=d.documentElement,t=d.getElementById("ov-top"),p=location.pathname;' +
      'if(/[?&]ov=0/.test(location.search)||p.indexOf("/home-builder")===0){t.parentNode.removeChild(t);return}' +
      'r.classList.add("ov-on");if(p==="/"){r.classList.add("ov-home");t.appendChild(d.getElementById("ov-hero-tpl").content.cloneNode(true))}}();</script>';
  };
  return S;
})();
if (typeof module === 'object' && module.exports) module.exports = OVS;
