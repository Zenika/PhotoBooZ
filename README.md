# PhotoBooz by Zenika


Pour lancer le client (prise de photo) :

```sh
npm install
npm run serve
```

Ouvrir dans Firefox http://localhost:8888


Fonctionnalités :
* Remplacement d'une couleur dans la vidéo pour la rendre transparente (cliquer dessus)
* Barre de tolérance pour la couleur (si fond pas uniforme)
* Choix de l'image de fond
* Photo prise au bout de 5 secondes


Pour lancer le serveur (sauvegarde des photos et stream de la dernière photo prise) :

```sh
cd pictureServer
npm install
node .
```

Ouvrir dans un navigateur http://localhost:8081 pour voir la dernière photo prise (mise à jour automatiquement par SSE).