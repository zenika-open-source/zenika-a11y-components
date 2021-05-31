# Boite de dialogue

Une boite de dialogue, ou boite modale, ou Pop-in, est un moyen de créer un workflow secondaire qui interrompe le workflow principale de la page. Ce workflow secondaire doit être terminé (ou abandonné) avant de pouvoir reprendre le workflow principale.

A cause de leur nature invasive, les boites de dialogue doivent être utilisé prudemment.

## Design de base

![](dialog.png)

Une boite de dialogue se définie fondamentalement par deux choses :

  1. Un masque d'arrière plan qui cache plus ou moins le contenu derrière la boite de dialogue;
  2. La boite de dialogue elle-même;

En général, le masque d'arrière plan est translucide et la boite de dialogue est opaque, mais tout est possible. Par exemple, il est possible de ne pas avoir de masque d'arrière plan mais une simple ombre porté de la boite de dialogue. Un autre exemple c'est lorsque la boite de dialogue recouvre tout le viewport (dans ce cas, même si c'est techniquement ok, ça peut être compliqué pour l'utilisateur qui pourrait avoir du mal à identifié l'objectif de l'interface graphique).

Le contenu de la boite de dialogue est libre mais d'habitude on a un titre, un contenu principal et au moins un bouton pour fermer la boite de dialogue (ça peut être un simple bouton avec un libellé explicite ou une croix de fermeture dans le coins haut-droit de la boite, ou parfois dans le coins haut-gauche pour les langages <abbr title="Right-To-Left" lang="en">RTL</abbr>).

## CSS

Dans notre implémentation nous définissons deux pré-requis :

`.dialog` qui est le conteneur principal de notre boite de dialogue. On l'utilisera pour définir le masque d'arrière plan. `.dialog__main` est le conteneur qui matérialise la boite de dialogue visuelle.

```css
:root {
  /* On utilise des propriétés personnalisées CSS pour faciliter la
     personnalisation de notre boite de dialogue. Cependant vous
     devriez simplement surcharger les selecteurs `.dialog`,
     `.dialog--open` and `.dialog__main` dans votre propre feuille
     de style. */
  --dialog-backdrop: #CCCCCCCC; /* gris translucide */
  --dialog-background: white;   /* blanc opaque */
}

.dialog {
  /* Une boite de dialogue doit être positionné par dessus le contenu principal
     et être dans le viewport quelque soit la position de scoll de la page
     principale. */
  position: fixed;
  z-index: 1;

  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  /* Par défaut, une boite de dialogue est invisible
     et doit se comporter comme si elle n'existe pas. */
  display: none;

  /* C'est comme ça qu'on materialise le masque d'arrière plan */
  background: var(--dialog-backdrop);
}

/* Modificateur qui indique que la boite de dialogue est ouverte */
.dialog--open {
  /* Il n'y a pas de règle immuable ici mais d'habitude
     on centre la boite de dialogue dans le viewport */
  display: flex;
  align-items: center;
  justify-content: center;
}

/* C'est la boite de dialogue visuel */
.dialog__main {
  /* Tout est possible, mais à minima on s'attend
     à avoir un arrière plan opaque. */
  background: var(--dialog-background);
}
```

## Effets spéciaux

Certains effets (comme un effet de flou en arrière plan ou une transition douce quand on affiche/masque la boite de dialogue) peuvent requérir une ou plusieurs classes CSS supplémentaires pour être réalisé. Comme d'habitude avec CSS, soyez créatifs. La façon la plus simple de gérer cette question est d'utiliser l'API JavaScript pour ajouter une classe CSS sur le body pour étendre nos possibilités.

```js
new Dialog(node).open().then(() => {
  // Lorsque cette class est appliquée, nous sommes sur que le navigateur à
  // réalisé un reflow suite au changement de display de la boite de dialogue.
  // C'est necessaire pour pouvoir appliquer une éventuelle transition CSS.
  document.body.classList.add('dialogIsOpen')
})
```

```css
/* Exemple d'un flou en arrière plan */
body.dialogIsOpen > :not(.dialog--open) {
  filter: blur(2px);
}

/* Exemple d'un effet de transition visuel de la boite de dialogue */
.dialog__main {
  opacity: 0;
  transform: scale(.9);
  transition: all 500ms;
}

.dialogIsOpen .dialog--open > .dialog__main {
  opacity: 1;
  transform: scale(1);
}
```
