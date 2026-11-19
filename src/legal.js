/* ORVYA — pages d'information et pages juridiques (2026-11-19, audit juridique : ORVYA_AUDIT_JURIDIQUE_2026-11-19.md).
 *
 * Fichier a part (dist/orvya-legal.min.js) : il n'est charge que sur /pages/*, pour ne pas alourdir les autres pages.
 * orvya.js appelle window.OV_LEGAL(outils) et recoit { pages, order, slugs }.
 *
 * Textes fondes sur le droit marocain (vente au Maroc uniquement, decision de la proprietaire du 2026-11-19) :
 *   loi 31-08 (protection du consommateur), loi 53-05 / DOC art. 65-1 a 65-7 (contrat electronique),
 *   loi 09-08 et deliberation CNDP D-939-2025 (donnees personnelles, cookies).
 * Aucune information d'identite n'est inventee : tout champ inconnu (valeur null ci-dessous) s'affiche
 * « [À compléter : ...] » en surbrillance. Les remplir ici, reconstruire (node build.js), publier une nouvelle version.
 */
window.OV_LEGAL = function (h) {
  'use strict';
  var WA = h.WA, I = h.I, esc = h.esc, acc = h.acc, FAQ = h.FAQ;

  /* ---------- Informations du vendeur : A COMPLETER (null = inconnu, jamais invente) ---------- */
  var L = {
    marque: 'ORVYA',
    site: 'www.orvya.ma',
    vendeur: 'Nourddine Sbaai', // donne par le proprietaire le 2026-11-19
    statut: 'Personne physique (exploitant individuel)',
    adresse: 'El Oualfa, Haj Fateh, Casablanca', // telle que donnee le 2026-11-19 (sans numero de rue)
    email: 'orvya.ma@gmail.com',
    tel: '+212 6 56 12 77 78',
    telHref: 'tel:+212656127778',
    /* false = pas d'immatriculation a ce jour (proprietaire, 2026-11-19) : la ligne n'est pas affichee (jamais de faux numero).
       Des l'inscription (RC ou auto-entrepreneur), mettre les numeros ici. */
    immat: false,       // n° RC (et tribunal) ou n° d'inscription au registre national de l'auto-entrepreneur
    ifiscal: false,     // identifiant fiscal (IF)
    ice: false,         // identifiant commun de l'entreprise (ICE)
    directeur: 'Nourddine Sbaai', // l'exploitant individuel
    hebergeur: null,    // complement facultatif : denomination legale et adresse d'EasyOrders (a demander au support)
    cndp: null,         // n° des recepisses CNDP (fichier clients, cookies)
    cndpTransfert: null,// reference de l'autorisation CNDP de transfert a l'etranger
    horaires: null,     // horaires du service client
    maj: '19 novembre 2026'
  };
  function v(k, label) { return L[k] ? esc(L[k]) : '<mark class="ov-ph">[À compléter : ' + label + ']</mark>'; }
  var mail = L.email ? '<a class="link-u" href="mailto:' + esc(L.email) + '">' + esc(L.email) + '</a>' : v('email', 'e-mail professionnel');
  var wa = function (txt, label) { return '<a class="link-u" href="' + WA + (txt ? '?text=' + encodeURIComponent(txt) : '') + '" target="_blank" rel="noopener">' + (label || 'WhatsApp') + '</a>'; };
  var tel = '<a class="link-u" href="' + L.telHref + '">' + L.tel + '</a>';
  var P = h.PAGES;
  var link = function (k, t) { return '<a class="link-u" href="' + P[k] + '">' + t + '</a>'; };
  var maj = '<p class="ov-maj">Dernière mise à jour : ' + L.maj + '</p>';
  var ident = '<ul><li><strong>Exploitant :</strong> ' + v('vendeur', 'nom et prénom ou dénomination sociale') + '</li>' +
    '<li><strong>Statut juridique :</strong> ' + v('statut', 'statut juridique') + '</li>' +
    '<li><strong>Adresse :</strong> ' + v('adresse', 'adresse professionnelle') + '</li>' +
    '<li><strong>Téléphone et WhatsApp :</strong> ' + tel + '</li><li><strong>E-mail :</strong> ' + mail + '</li></ul>';

  /* numeros d'immatriculation : seulement ceux qui existent (false = aucun a ce jour, rien n'est affiche) */
  function immatBlock(open, close, item) {
    var rows = [['immat', 'Registre de commerce ou registre de l’auto-entrepreneur', 'numéro d’immatriculation'], ['ifiscal', 'Identifiant fiscal (IF)', 'IF'], ['ice', 'ICE', 'ICE']]
      .filter(function (r) { return L[r[0]] !== false; });
    return rows.length ? open + rows.map(function (r, i) { return item(r[1], v(r[0], r[2]), i); }).join('') + close : '';
  }
  var pages = {};

  /* ---------- Mentions legales ---------- */
  pages.mentions = { t: 'Mentions légales', title: 'Mentions légales', desc: 'Identité de l’exploitant du site ORVYA, coordonnées, hébergement et propriété intellectuelle.',
    h: '<h1>Mentions légales</h1><p class="lead">Le site ' + L.site + ' est une boutique en ligne de bijoux exploitée sous le nom commercial ORVYA.</p>' +
      '<h2>Exploitant du site</h2>' + ident +
      immatBlock('<h2>Immatriculation</h2><ul>', '</ul>', function (lab, val) { return '<li><strong>' + lab + ' :</strong> ' + val + '</li>'; }) +
      '<h2>Publication</h2><p><strong>Directeur de la publication :</strong> ' + v('directeur', 'nom et prénom') + '</p>' +
      '<h2>Hébergement</h2><p>La boutique est hébergée par la plateforme de commerce en ligne EasyOrders (<a class="link-u" href="https://www.easy-orders.net" target="_blank" rel="noopener">www.easy-orders.net</a>), qui conserve les pages, les produits et les commandes.' + (L.hebergeur ? ' ' + esc(L.hebergeur) + '.' : '') + '</p>' +
      '<p>Les fichiers de présentation du site (styles, scripts, images) sont diffusés par le réseau jsDelivr à partir du dépôt GitHub d’ORVYA.</p>' +
      '<h2>Propriété intellectuelle</h2><p>Le nom ORVYA, le logo, les textes, les photographies et la mise en page de ce site sont protégés. Toute reproduction, totale ou partielle, sans autorisation écrite préalable est interdite.</p>' +
      '<h2>Données personnelles et cookies</h2><p>Voir notre ' + link('confidentialite', 'politique de confidentialité') + ' et notre ' + link('cookies', 'politique cookies') + '.</p>' +
      '<h2>Nous écrire</h2><p>Pour toute question ou réclamation : ' + wa('Bonjour ORVYA, ', 'WhatsApp') + ', ' + mail + ', ou par courrier à l’adresse ci-dessus.</p>' + maj };

  /* ---------- Conditions generales de vente ---------- */
  pages.conditions = { t: 'Conditions générales de vente', title: 'Conditions générales de vente (CGV)', desc: 'Conditions générales de vente ORVYA : commande, prix, paiement à la livraison, livraison au Maroc, rétractation, garanties, réclamations.',
    h: '<h1>Conditions générales de vente</h1><p class="lead">Les présentes conditions s’appliquent à toute commande passée sur ' + L.site + '. Vous les acceptez expressément en cochant la case prévue avant de confirmer votre commande.</p>' +
      '<h2>1. Vendeur</h2>' + ident + immatBlock('<p>', '.</p>', function (lab, val, i) { return (i ? ' · ' : '') + lab + ' : ' + val; }) +
      '<h2>2. Champ d’application</h2><p>Ces conditions régissent les ventes conclues à distance entre ORVYA et toute personne physique agissant à des fins non professionnelles (le « client »), pour une livraison au Maroc. Elles sont consultables à tout moment depuis le pied de page du site et peuvent être enregistrées ou imprimées. Les conditions applicables sont celles en vigueur au jour de la commande.</p>' +
      '<h2>3. Produits</h2><p>Nos bijoux sont en acier inoxydable 316L, finition dorée PVD. Les caractéristiques essentielles de chaque bijou (matière, dimensions lorsqu’elles sont indiquées, prix) figurent sur sa fiche. Les photographies sont aussi fidèles que possible ; de légères différences de teinte peuvent apparaître selon l’écran. Les offres sont valables tant qu’elles sont visibles sur le site et dans la limite des stocks disponibles.</p>' +
      '<h2>4. Prix</h2><p>Les prix sont indiqués en dirhams marocains (MAD). Le prix affiché au moment de la commande est le prix final à payer : la livraison est offerte et aucun frais ne s’y ajoute. L’utilisation du site et de WhatsApp n’entraîne aucun coût autre que celui de votre connexion internet ou de votre forfait téléphonique.</p>' +
      '<h2>5. Commande</h2><p>La commande se passe en plusieurs étapes :</p><ol><li>Vous ajoutez un ou plusieurs bijoux au panier. Vous pouvez à tout moment modifier les quantités ou retirer un article.</li>' +
      '<li>Sur la page de commande, vous indiquez votre nom, votre téléphone, votre adresse et votre ville. Le récapitulatif affiche le détail des articles et le prix total : vous pouvez vérifier et corriger toutes ces informations.</li>' +
      '<li>Vous cochez la case d’acceptation des présentes conditions et de la politique de confidentialité, puis vous cliquez sur le bouton de confirmation.</li>' +
      '<li>Une page de confirmation s’affiche immédiatement avec le numéro et le récapitulatif de votre commande : elle vaut accusé de réception.</li>' +
      '<li>Nous vous appelons ou vous écrivons sur WhatsApp pour confirmer la commande et l’adresse avant l’expédition. Toute erreur peut encore être corrigée à ce moment-là.</li></ol>' +
      '<p>Une commande qui reste sans réponse après trois tentatives d’appel peut être annulée. Vous pouvez annuler gratuitement votre commande tant qu’elle n’a pas été expédiée. La commande est passée en langue française. ORVYA conserve les commandes dans son système de gestion : vous pouvez en obtenir une copie sur simple demande.</p>' +
      '<h2>6. Paiement</h2><p>Le paiement se fait uniquement en espèces, au livreur, à la réception du colis. Aucun paiement et aucune donnée bancaire ne sont demandés en ligne. Vous pouvez ouvrir le colis et vérifier votre bijou avant de payer.</p>' +
      '<h2>7. Livraison</h2><p>La livraison est assurée partout au Maroc, gratuitement, dans les conditions décrites sur la page ' + link('livraison', 'Livraison') + ' : en général 2 à 4 jours ouvrés après la confirmation, et au plus tard 30 jours après la confirmation de votre commande. Si un bijou n’est plus disponible, nous vous en informons et votre commande est annulée sans frais.</p>' +
      '<p>ORVYA est responsable de la bonne exécution de la commande, y compris lorsque la livraison est confiée à un transporteur. Un colis perdu ou abîmé pendant le transport est renvoyé ou remboursé par ORVYA.</p>' +
      '<h2>8. Droit de rétractation</h2><p>Vous disposez d’un délai de <strong>7 jours francs à compter de la réception</strong> de votre commande pour exercer votre droit de rétractation, sans avoir à vous justifier ni à payer de pénalités. Ce délai est porté à 30 jours si ORVYA ne vous a pas confirmé par écrit les informations prévues par la loi (articles 29 et 32 de la loi n° 31-08).</p>' +
      '<p>Pour l’exercer, il suffit de nous le dire par WhatsApp, par e-mail ou par courrier (voir la page ' + link('retours', 'Retours et remboursements') + '). Le bijou doit nous être renvoyé complet, non porté et dans son emballage d’origine ; pour les boucles d’oreilles, la protection d’hygiène doit être intacte. Les frais de retour restent à votre charge, sauf si l’article est défectueux, non conforme ou s’il y a eu une erreur de notre part.</p>' +
      '<p>ORVYA vous rembourse la totalité des sommes payées sans délai, et au plus tard dans les 15 jours suivant la date à laquelle vous avez exercé votre droit.</p>' +
      '<p>Le droit de rétractation ne s’applique pas aux bijoux confectionnés selon vos spécifications ou nettement personnalisés (par exemple une gravure), conformément à l’article 38 de la loi n° 31-08.</p>' +
      '<h2>9. Garanties</h2><p>Tous nos bijoux bénéficient de la <strong>garantie légale des défauts de la chose vendue</strong> (articles 549 à 575 du Dahir formant Code des obligations et des contrats, applicables en vertu de l’article 65 de la loi n° 31-08). Toute action fondée sur cette garantie doit être engagée dans l’année qui suit la livraison.</p>' +
      '<p>En plus de cette garantie légale, ORVYA offre une <strong>garantie commerciale de 2 ans</strong> sur la finition dorée, décrite sur la page ' + link('garantie', 'Garantie') + '.</p>' +
      '<h2>10. Réclamations</h2><p>Toute réclamation peut être adressée à ORVYA par WhatsApp (' + tel + '), par e-mail (' + mail + ') ou par courrier à l’adresse : ' + v('adresse', 'adresse professionnelle') + '. Nous accusons réception de votre réclamation et vous répondons dans les meilleurs délais. Ces moyens de contact ne sont soumis à aucune surtaxe.</p>' +
      '<h2>11. Responsabilité</h2><p>ORVYA n’est pas responsable de l’inexécution de la commande lorsqu’elle est due au client, au fait imprévisible et insurmontable d’un tiers ou à un cas de force majeure. Les bijoux doivent être utilisés et entretenus selon nos conseils (éviter le contact direct avec le parfum, les crèmes et les produits chimiques).</p>' +
      '<h2>12. Données personnelles</h2><p>Les informations fournies lors de la commande servent à la traiter et à la livrer. Leur utilisation et vos droits sont décrits dans la ' + link('confidentialite', 'politique de confidentialité') + '.</p>' +
      '<h2>13. Droit applicable et litiges</h2><p>Les présentes conditions sont soumises au droit marocain, notamment à la loi n° 31-08 édictant des mesures de protection du consommateur. En cas de litige, nous vous invitons à nous contacter d’abord pour trouver une solution amiable. À défaut, le tribunal compétent est, à votre choix, celui de votre domicile ou de votre lieu de résidence, ou celui du lieu du fait dommageable (article 202 de la loi n° 31-08).</p>' +
      '<h2>14. Clients résidant hors du Maroc</h2><p>ORVYA livre uniquement au Maroc. Si vous résidez dans un autre pays, les présentes conditions ne vous privent pas des protections impératives que vous accorde éventuellement la loi de votre pays de résidence.</p>' + maj };

  /* ---------- Livraison ---------- */
  pages.livraison = { t: 'Livraison', title: 'Livraison au Maroc', desc: 'Livraison offerte partout au Maroc, paiement en espèces à la livraison, délais, suivi et colis perdus.',
    h: '<h1>Livraison</h1><p class="lead">Livraison offerte partout au Maroc. Vous payez le livreur en espèces, à la réception.</p>' +
      '<div class="facts"><div><strong>24–48 h</strong><span>Préparation après confirmation par téléphone</span></div><div><strong>24–48 h</strong><span>Grandes villes, après expédition</span></div><div><strong>2–4 j</strong><span>Autres villes et zones rurales (jours ouvrés)</span></div></div>' +
      '<h2>Zones de livraison</h2><p>Nous livrons dans tout le Maroc. Nous ne livrons pas à l’étranger pour le moment.</p>' +
      '<h2>Délais</h2><ul><li>Votre commande est préparée sous 24 à 48 h après sa confirmation par téléphone ou WhatsApp.</li><li>Grandes villes (Casablanca, Rabat, Marrakech, Tanger, Fès, Agadir) : 24 à 48 h après l’expédition.</li><li>Autres villes et zones rurales : 2 à 4 jours ouvrés.</li></ul>' +
      '<p>Ces délais sont indicatifs. Dans tous les cas, votre commande est livrée au plus tard 30 jours après sa confirmation ; au-delà, vous pouvez l’annuler sans frais.</p>' +
      '<h2>Frais</h2><p>La livraison est offerte, sans minimum d’achat. Le prix affiché au panier est le prix final.</p>' +
      '<h2>Suivi</h2><p>Un numéro de suivi vous est communiqué par SMS ou WhatsApp dès l’expédition. Pour toute question : ' + wa('Bonjour, je souhaite suivre ma commande.', 'écrivez-nous sur WhatsApp') + '.</p>' +
      '<h2>Paiement et ouverture du colis</h2><p>Vous payez le livreur en espèces à la réception. Aucun paiement n’est demandé au moment de la commande. Vous pouvez ouvrir et vérifier votre colis avant de payer.</p>' +
      '<h2>Retard, colis abîmé ou perdu</h2><p>ORVYA reste responsable de votre colis jusqu’à sa remise. En cas de retard important, de colis abîmé ou perdu, contactez-nous : nous retrouvons le colis auprès du transporteur, nous vous renvoyons le bijou, ou nous annulons la commande. Si le colis paraît abîmé, vous pouvez le refuser au livreur.</p>' + maj };

  /* ---------- Retours et remboursements ---------- */
  var retourTxt = 'Bonjour ORVYA, je souhaite exercer mon droit de rétractation.\nCommande n° : \nBijou(x) concerné(s) : \nDate de réception : \nNom et prénom : \nVille : ';
  pages.retours = { t: 'Retours et remboursements', title: 'Retours, échanges et remboursements', desc: '7 jours pour changer d’avis : conditions de retour, procédure, frais, délai de remboursement ORVYA.',
    h: '<h1>Retours et remboursements</h1><p class="lead">Vous disposez de 7 jours après la réception de votre commande pour changer d’avis, sans avoir à vous justifier.</p>' +
      '<h2>Droit de rétractation (7 jours)</h2><ul><li>Délai : 7 jours francs à compter de la réception du colis (30 jours si nous ne vous avons pas remis la confirmation écrite prévue par la loi).</li>' +
      '<li>Le bijou doit être renvoyé complet, non porté, non endommagé et dans son emballage d’origine.</li>' +
      '<li>Boucles d’oreilles : elles sont reprises si elles n’ont pas été portées et si leur protection d’hygiène est intacte.</li>' +
      '<li>Exception : les bijoux personnalisés à votre demande (par exemple une gravure) ne peuvent pas être repris.</li></ul>' +
      '<h2>Comment procéder</h2><ol><li>Prévenez-nous dans le délai de 7 jours, par ' + wa(retourTxt, 'WhatsApp') + ', par e-mail (' + mail + ') ou par courrier, avec votre numéro de commande.</li>' +
      '<li>Nous vous indiquons comment renvoyer le bijou.</li><li>Dès que vous avez exercé votre droit, nous vous remboursons la totalité de la somme payée, par virement ou par un autre moyen convenu avec vous, au plus tard dans les 15 jours.</li></ol>' +
      '<p>Vous pouvez utiliser ce modèle (il s’ouvre déjà rempli dans WhatsApp) :</p><blockquote class="ov-model">Je vous notifie par la présente ma rétractation du contrat portant sur la vente du bijou ci-dessous.<br>Commande n° : …<br>Bijou(x) : …<br>Reçu le : …<br>Nom et prénom : …<br>Adresse : …<br>Date : …</blockquote>' +
      '<h2>Frais de retour</h2><p>Les frais de renvoi sont à votre charge en cas de simple changement d’avis. Ils sont pris en charge par ORVYA si le bijou est défectueux, non conforme à votre commande, ou en cas d’erreur de notre part.</p>' +
      '<h2>Échange</h2><p>Vous préférez un autre bijou ? Dans le même délai de 7 jours et aux mêmes conditions, nous pouvons l’échanger contre un autre modèle disponible.</p>' +
      '<h2>Bijou défectueux ou non conforme</h2><p>Signalez-le-nous avec une photo : nous vous renvoyons le bon article ou nous vous remboursons, frais de retour compris. Vous bénéficiez aussi des garanties décrites sur la page ' + link('garantie', 'Garantie') + '.</p>' + maj };

  /* ---------- Garantie ---------- */
  pages.garantie = { t: 'Garantie', title: 'Garantie 2 ans et garantie légale', desc: 'Garantie commerciale ORVYA de 2 ans sur la finition dorée et garantie légale des défauts de la chose vendue.',
    h: '<h1>Garantie 2 ans</h1><p class="lead">Si la finition dorée se dégrade dans des conditions d’utilisation normales, nous échangeons votre bijou gratuitement.</p>' +
      '<h2>Garantie légale (toujours applicable)</h2><p>Indépendamment de la garantie ORVYA, tous nos bijoux bénéficient de la garantie légale des défauts de la chose vendue (articles 549 à 575 du Code des obligations et des contrats, article 65 de la loi n° 31-08). Toute action fondée sur cette garantie doit être engagée dans l’année qui suit la livraison.</p>' +
      '<h2>Garantie commerciale ORVYA</h2><ul><li><strong>Garant :</strong> ' + v('vendeur', 'nom ou dénomination') + ', ' + v('adresse', 'adresse') + '.</li>' +
      '<li><strong>Objet :</strong> la finition dorée PVD de tous les bijoux vendus sur ' + L.site + '.</li>' +
      '<li><strong>Durée :</strong> 2 ans à compter de la livraison. Le temps pendant lequel le bijou est entre nos mains pour l’exécution de la garantie s’ajoute à cette durée.</li>' +
      '<li><strong>Engagement :</strong> si la finition se dégrade dans des conditions d’utilisation normales, nous échangeons le bijou contre un bijou identique, ou équivalent s’il n’est plus disponible.</li>' +
      '<li><strong>Frais :</strong> les frais d’envoi liés à la garantie sont à la charge d’ORVYA.</li></ul>' +
      '<h2>Comment en bénéficier</h2><p>Contactez-nous sur ' + wa('Bonjour ORVYA, je souhaite utiliser la garantie pour ma commande n° ', 'WhatsApp') + ' ou par e-mail (' + mail + ') avec votre numéro de commande et une photo du bijou.</p>' +
      '<h2>Ce que la garantie commerciale ne couvre pas</h2><ul><li>Le contact avec les parfums, les crèmes et les produits chimiques.</li><li>Les dommages accidentels (chocs, chaîne arrachée, pierre perdue après un choc).</li><li>L’usure normale ou une modification faite par un tiers.</li></ul>' + maj };

  /* ---------- Confidentialite ---------- */
  pages.confidentialite = { t: 'Confidentialité', title: 'Politique de confidentialité', desc: 'Données collectées par ORVYA, finalités, destinataires, durées de conservation et vos droits (loi 09-08).',
    h: '<h1>Politique de confidentialité</h1><p class="lead">ORVYA ne collecte que les informations nécessaires pour traiter, confirmer et livrer votre commande, et pour vous répondre. Nous ne vendons ni ne louons vos données.</p>' +
      '<h2>Responsable du traitement</h2>' + ident +
      /* recepisse CNDP : affiche seulement une fois la declaration faite (jamais de numero invente) */
      (L.cndp ? '<p>Déclaration auprès de la CNDP (Commission nationale de contrôle de la protection des données à caractère personnel) : récépissé n° ' + esc(L.cndp) + '.</p>' : '') +
      '<h2>Données collectées</h2><ul><li><strong>Commande :</strong> nom et prénom, numéro de téléphone, adresse, ville, bijoux commandés, montant, date et suivi de la commande.</li>' +
      '<li><strong>Échanges :</strong> messages envoyés par WhatsApp, par e-mail ou via le formulaire de contact (qui ouvre WhatsApp).</li>' +
      '<li><strong>Lettre d’information :</strong> votre adresse e-mail, si vous vous inscrivez.</li>' +
      '<li><strong>Navigation :</strong> données techniques (adresse IP, appareil, navigateur, pages consultées, site d’origine de la visite). Les traceurs de mesure d’audience et de publicité ne sont utilisés qu’avec votre accord : voir la ' + link('cookies', 'politique cookies') + '.</li></ul>' +
      '<p>Aucune donnée bancaire n’est collectée : le paiement se fait en espèces à la livraison.</p>' +
      '<h2>Pourquoi et sur quelle base</h2><ul><li>Traiter, confirmer, préparer et livrer votre commande, gérer les retours, la garantie et les réclamations : exécution du contrat de vente.</li>' +
      '<li>Tenir la comptabilité et répondre aux demandes des autorités : obligations légales.</li>' +
      '<li>Sécuriser le site et la page de commande (vérification anti-robot), éviter les fausses commandes : intérêt légitime d’ORVYA.</li>' +
      '<li>Vous envoyer notre lettre d’information, mesurer l’audience et mesurer l’efficacité de nos publicités : votre consentement, que vous pouvez retirer à tout moment.</li></ul>' +
      '<h2>Destinataires</h2><p>Vos données sont accessibles à ORVYA et, pour la part nécessaire à leur mission, à ses prestataires :</p><ul>' +
      '<li>EasyOrders : plateforme qui héberge la boutique et enregistre les commandes ;</li>' +
      '<li>Saleura : outil de gestion des commandes (confirmation, messages WhatsApp, création des envois) ;</li>' +
      '<li>les sociétés de livraison partenaires (notamment Sendit) : nom, téléphone, adresse et montant à encaisser ;</li>' +
      '<li>Google : script qui transmet les commandes de la boutique à l’outil de gestion ;</li>' +
      '<li>Meta Platforms : messagerie WhatsApp et, seulement avec votre accord, Meta Pixel ;</li>' +
      '<li>Cloudflare : vérification anti-robot sur la page de commande.</li></ul>' +
      '<h2>Transferts hors du Maroc</h2><p>Certains de ces prestataires traitent les données hors du Maroc (notamment Meta Platforms et Google, aux États-Unis). Ces transferts sont soumis à l’autorisation préalable de la CNDP (articles 43 et 44 de la loi n° 09-08).' + (L.cndpTransfert ? ' Référence de l’autorisation : ' + esc(L.cndpTransfert) + '.' : '') + '</p>' +
      '<h2>Durées de conservation</h2><ul><li>Commandes : pendant la durée de la commande, de la garantie et des réclamations (3 ans après la livraison), puis archivées le temps imposé par les obligations comptables (10 ans pour les pièces comptables).</li>' +
      '<li>Messages et demandes de contact : le temps de traiter la demande, puis 1 an au plus.</li><li>Lettre d’information : jusqu’à votre désinscription, ou 3 ans après notre dernier contact.</li>' +
      '<li>Données issues des cookies : 6 mois au plus. Votre choix sur les cookies est conservé 6 mois.</li></ul>' +
      '<h2>Vos droits</h2><p>Conformément à la loi n° 09-08, vous pouvez demander l’accès à vos données, leur rectification ou leur suppression, et vous opposer, pour des motifs légitimes, à leur traitement. Vous pouvez aussi vous opposer gratuitement et sans motif à toute prospection commerciale, et retirer votre consentement à tout moment (lien de désinscription, bouton « Gérer mes cookies »).</p>' +
      '<p>Pour exercer vos droits : ' + wa('Bonjour ORVYA, je souhaite exercer mes droits sur mes données personnelles : ', 'WhatsApp') + ', ' + mail + ' ou courrier à l’adresse ci-dessus. Une preuve d’identité peut vous être demandée. Si vous estimez que vos droits ne sont pas respectés, vous pouvez saisir la CNDP (<a class="link-u" href="https://www.cndp.ma" target="_blank" rel="noopener">www.cndp.ma</a>).</p>' +
      '<h2>Sécurité</h2><p>L’accès aux données est limité aux personnes et prestataires qui en ont besoin. Le site est servi en connexion chiffrée (HTTPS).</p>' + maj };

  /* ---------- Cookies ---------- */
  var row = function (a) { return '<tr><td>' + a.join('</td><td>') + '</td></tr>'; };
  var table = function (rows) { return '<div class="ov-tbl"><table><thead><tr><th>Nom</th><th>Fourni par</th><th>Rôle</th><th>Durée</th></tr></thead><tbody>' + rows.map(row).join('') + '</tbody></table></div>'; };
  pages.cookies = { t: 'Cookies', title: 'Politique cookies', desc: 'Cookies et traceurs utilisés sur orvya.ma, à quoi ils servent et comment accepter ou refuser.',
    h: '<h1>Politique cookies</h1><p class="lead">Un cookie, ou traceur, est un petit fichier enregistré sur votre téléphone ou votre ordinateur. Nous ne déposons les traceurs de mesure d’audience et de publicité qu’avec votre accord.</p>' +
      '<p><button class="btn btn--ghost" type="button" data-ov-consent>Gérer mes cookies</button></p>' +
      '<h2>Traceurs nécessaires (sans consentement)</h2><p>Ils font fonctionner la boutique : panier, favoris, devise, sécurité, mémorisation de votre choix. Ils ne peuvent pas être désactivés depuis le site.</p>' +
      table([['currency, store_id, theme_key', 'EasyOrders', 'Devise, boutique et affichage', 'Session'],
        ['guest-id, wish-list, compare-products', 'EasyOrders', 'Panier, favoris et comparaison (stockage local)', 'Jusqu’à suppression'],
        ['track-user-visit', 'EasyOrders', 'Pages vues et site d’origine de la visite, rattachés à la commande', 'Jusqu’à suppression'],
        ['orvya_consent', 'ORVYA', 'Mémorise votre choix sur les cookies', '6 mois'],
        ['Vérification anti-robot', 'Cloudflare', 'Protection de la page de commande', 'Session']]) +
      '<h2>Mesure d’audience (avec votre accord)</h2><p>Elle nous indique comment les visiteurs arrivent sur le site et quelles pages les intéressent, pour améliorer la boutique.</p>' +
      table([['saleura_visitor, saleura_session', 'Saleura', 'Identifiant de visite et source du trafic', '6 mois au plus / session']]) +
      '<h2>Publicité (avec votre accord)</h2><p>Elle mesure l’efficacité de nos publicités sur Facebook et Instagram et permet de vous montrer des annonces ORVYA.</p>' +
      table([['_fbp, lastExternalReferrer', 'Meta Platforms (Meta Pixel)', 'Mesure des visites et des commandes issues de nos publicités', '90 jours']]) +
      '<p>Meta peut aussi utiliser ses propres cookies sur ses domaines, selon sa politique : <a class="link-u" href="https://www.facebook.com/privacy/policies/cookies/" target="_blank" rel="noopener">politique cookies de Meta</a>.</p>' +
      '<h2>Réseaux sociaux</h2><p>Nos liens vers Instagram, Facebook, TikTok et WhatsApp sont de simples liens : ils ne déposent aucun traceur tant que vous ne cliquez pas.</p>' +
      '<h2>Votre choix</h2><p>Au premier passage, un bandeau vous permet d’accepter, de refuser ou de choisir par catégorie. Refuser est aussi simple qu’accepter. Votre choix est conservé 6 mois, puis redemandé. Vous pouvez le modifier à tout moment avec le bouton « Gérer mes cookies » ci-dessus ou dans le pied de page. Vous pouvez aussi supprimer les cookies dans les réglages de votre navigateur.</p>' +
      '<p>Plus d’informations sur vos données : ' + link('confidentialite', 'politique de confidentialité') + '.</p>' + maj };

  /* ---------- Contact ---------- */
  pages.contact = { t: 'Nous contacter', title: 'Nous contacter', desc: 'Contacter ORVYA : WhatsApp, e-mail, formulaire de contact et réseaux sociaux.',
    h: '<h1>Nous contacter</h1><p class="lead">Une question sur un bijou, une commande, un retour ou la garantie ? Écrivez-nous, nous vous répondons sur WhatsApp.</p>' +
      '<div class="contact-cards">' +
      '<a class="contact-card" href="' + WA + '" target="_blank" rel="noopener">' + I.wa + '<div><strong>WhatsApp</strong><span>' + L.tel + '</span></div></a>' +
      '<a class="contact-card" href="https://www.instagram.com/orvya.ma/" target="_blank" rel="noopener">' + I.heart + '<div><strong>Instagram</strong><span>@orvya.ma</span></div></a>' +
      '<a class="contact-card" href="https://www.facebook.com/orvya.official" target="_blank" rel="noopener">' + I.phone + '<div><strong>Facebook</strong><span>orvya.official</span></div></a>' +
      '<a class="contact-card" href="https://www.tiktok.com/@orvya.ma" target="_blank" rel="noopener">' + I.star + '<div><strong>TikTok</strong><span>@orvya.ma</span></div></a></div>' +
      '<h2>Écrivez-nous</h2><form class="ov-contact" id="ov-contact" novalidate>' +
      '<div class="field"><label for="ovc-name">Nom et prénom</label><input class="input" id="ovc-name" name="name" autocomplete="name" required><span class="field__err">Indiquez votre nom.</span></div>' +
      '<div class="field"><label for="ovc-order">Numéro de commande <small>(facultatif)</small></label><input class="input" id="ovc-order" name="order" inputmode="numeric"></div>' +
      '<div class="field"><label for="ovc-subject">Sujet</label><select class="input" id="ovc-subject" name="subject"><option>Question sur un bijou</option><option>Suivi de commande</option><option>Retour ou remboursement</option><option>Garantie</option><option>Données personnelles</option><option>Autre</option></select></div>' +
      '<div class="field"><label for="ovc-msg">Message</label><textarea class="input" id="ovc-msg" name="message" required></textarea><span class="field__err">Écrivez votre message.</span></div>' +
      '<button class="btn" type="submit">Envoyer sur WhatsApp</button><p class="ov-note">Le bouton ouvre WhatsApp avec votre message déjà rédigé : vous le relisez puis vous l’envoyez. Rien n’est enregistré sur le site. Voir la ' + link('confidentialite', 'politique de confidentialité') + '.</p></form>' +
      '<h2>Coordonnées</h2><ul><li><strong>E-mail :</strong> ' + mail + '</li><li><strong>Adresse :</strong> ' + v('adresse', 'adresse professionnelle') + '</li>' + (L.horaires ? '<li><strong>Horaires du service client :</strong> ' + esc(L.horaires) + '</li>' : '') + '</ul>' };

  /* ---------- Questions frequentes (memes questions que l'accueil) ---------- */
  pages.faq = { t: 'Questions fréquentes', title: 'Questions fréquentes', desc: 'Livraison, paiement à la livraison, retours, garantie et entretien des bijoux ORVYA.',
    h: '<h1>Questions fréquentes</h1><p class="lead" style="margin-bottom:32px">Livraison, paiement, retours, entretien : l’essentiel en un coup d’œil.</p>' + FAQ.map(function (q, i) { return acc(q[0], '<p>' + q[1] + '</p>', i === 0); }).join('') +
      '<p style="margin-top:32px">Vous ne trouvez pas votre réponse ? ' + wa('', 'Écrivez-nous sur WhatsApp') + '.</p>' };

  return {
    pages: pages,
    /* ordre du menu des pages d'aide */
    order: ['contact', 'faq', 'livraison', 'retours', 'garantie', 'conditions', 'mentions', 'confidentialite', 'cookies'],
    /* adresse EasyOrders (/pages/<slug>) -> page */
    slugs: { 'shipping-policy': 'livraison', 'refund-policy': 'retours', garantie: 'garantie', 'privacy-policy': 'confidentialite', 'terms-and-conditions': 'conditions', faq: 'faq', contact: 'contact', 'mentions-legales': 'mentions', cookies: 'cookies' }
  };
};
