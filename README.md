# PhotoBooz by Zenika

## Overview

Pour lancer l'appli :

```sh
npm install
npm start
```

L'application contient deux pages :

 * http://localhost:8081/camera Prise de photo avec la webcam (page "photomaton")
 * http://localhost:8081 Affichage des photos (page "slideshow")


## Fonctionnalités de la page photomaton

* Remplacement d'une couleur dans la vidéo pour la rendre transparente (cliquer sur le fond sur la vidéo, utile avec un fond vert)
* Barre de tolérance pour la couleur (si fond pas uniforme)
* Choix de l'image de fond
* Photo prise au bout de 5 secondes (le bouton photo devient inactif pendant ces 5 secondes, la photo est prise quand le bouton se réactive)

## Fonctionnalités de la page slideshow

* Affiche en grand format la dernière photo prise
* affiche les miniatures des 24 dernières photos prises
* Possibilité de cliquer sur une miniature pour la voir en grand format
* Possibilité de twitter la photo en mentionnant un utilisateur twitter. Renseigner l'utilisateur à mentionner dans le champ prévu à cet effet et cliquer sur le bouton. Le nom d'utilisateur eut être renseigné avec ou sans le @ au début. Il faut renseigner le fichier twitterKeys.js avec les tokens de sécurité du compte qui va twitter.

## Liste de choses à améliorer

* Robustesse de l'application (le slideshow ne devrait pas avoir besoin de se rafraichir toute les deux minutes comme actuellement)
* Retours à l'utilisateur en cas d'erreur (Quand on tweet une photo, il n'y a aucun message d'erreur ni de succès, et il est possible de cliquer plusieurs fois à la suite)
* Meilleur algo de remplacement du fond vert (il est assez compliqué de bien remplacer le fond, surtout quand l'éclairage craint un peu)
* Plus d'images de fond ! 
