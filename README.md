# Signons — Apprendre la LSF

Application web pour apprendre la **Langue des Signes Française**. Elle tourne entièrement dans le
navigateur, sans compte ni serveur, et fonctionne hors ligne une fois chargée (PWA installable sur mobile).

## Fonctionnalités

- **Leçons** : ce qu'est la LSF, les 5 paramètres d'un signe, grammaire de base (ordre temps → lieu →
  personnages → action, ligne du temps, espace de signation, questions), dactylologie, culture et histoire
  sourdes. Chaque leçon se termine par un quiz.
- **Alphabet dactylologique** :
  - *Apprendre* : les 26 lettres avec une description de la configuration de la main ;
  - *Miroir* : la caméra s'affiche en miroir pour vérifier sa main (rien n'est enregistré ni envoyé) ;
  - *Épeler* : un mot (ou votre prénom) défile lettre par lettre à vitesse réglable ;
  - *Quiz* : retrouver la lettre à partir de sa description.
- **Vocabulaire** : ~110 mots en 10 thèmes (salutations, famille, questions, nombres, temps, émotions…),
  chacun relié à sa vidéo sur le dictionnaire [Elix](https://dico.elix-lsf.fr).
- **Révisions espacées** (méthode Leitner, 5 boîtes) : on signe de mémoire, on vérifie en vidéo, on
  s'auto-évalue ; les signes bien connus reviennent de moins en moins souvent.
- **Suivi** : série de jours, points d'expérience, leçons terminées, signes maîtrisés (stockés en local).

## Lancer l'application

Aucune installation n'est nécessaire, il suffit d'un serveur de fichiers statiques :

```sh
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

Pour la publier, n'importe quel hébergement statique convient (GitHub Pages, Netlify…). La caméra du mode
miroir nécessite HTTPS (ou `localhost`).

## Structure

```
index.html            page unique
css/styles.css        styles (thème clair / sombre, responsive)
js/data.js            contenu : leçons, alphabet, vocabulaire
js/app.js             routage, quiz, révisions, mode miroir
sw.js                 cache hors ligne
manifest.webmanifest  installation comme application
```

Pour ajouter du vocabulaire, il suffit de compléter `themes` dans `js/data.js`.

## Limites

Les signes ne s'apprennent bien qu'en mouvement : l'application renvoie vers les vidéos d'Elix plutôt que
de décrire les signes par écrit. Les descriptions de l'alphabet sont indicatives et doivent être vérifiées
en vidéo. Rien ne remplace un cours avec une personne sourde.
