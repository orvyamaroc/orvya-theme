# ORVYA — design de la boutique

Design « L'heure dorée » de [www.orvya.ma](https://www.orvya.ma) (boutique EasyOrders), copie fidèle de la maquette `orvya-redesign-preview.html`.

- `dist/orvya.min.css` et `dist/orvya.min.js` : les fichiers chargés par le code du head EasyOrders, via jsDelivr :
  `https://cdn.jsdelivr.net/gh/orvyamaroc/orvya-theme@<version>/dist/orvya.min.css`
- `src/` : les sources commentées. `node build.js` reconstruit `dist/` (la feuille de style de la maquette est reprise telle quelle, limitée aux blocs ORVYA).
- `assets/` : images servies avec le design (logo doré du pied de page).

Chaque mise en ligne porte un numéro de version (étiquette git `v1.0.0`, `v1.0.1`…) ; le code du head EasyOrders pointe vers une version précise, pour que les visiteurs ne reçoivent jamais un fichier à moitié mis à jour.
