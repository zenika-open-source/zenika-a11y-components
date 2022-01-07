# Boite de dialogue

Une boite de dialogue, ou boite modale, ou Pop-in, est un moyen de créer un workflow secondaire qui interrompe le workflow principale de la page. Ce workflow secondaire doit être terminé (ou abandonné) avant de pouvoir reprendre le workflow principale.

A cause de leur nature invasive, les boites de dialogue doivent êtres utilisées prudemment.

## Design de base

![](dialog.png)

Une boite de dialogue se définie fondamentalement par deux choses :

  1. Un masque d'arrière plan qui cache plus ou moins le contenu derrière la boite de dialogue;
  2. La boite de dialogue elle-même;

En général, le masque d'arrière plan est translucide et la boite de dialogue est opaque, mais tout est possible. Par exemple, il est possible de ne pas avoir de masque d'arrière plan mais une simple ombre porté de la boite de dialogue. On peu aussi imaginer une boite de dialogue qui recouvre tout le viewport (dans ce cas, même si c'est techniquement possible, ça peut être compliqué pour l'utilisateur qui pourrait avoir du mal à identifier l'objectif de l'interface graphique).

Le contenu de la boite de dialogue est libre mais on a généralement au moins un bouton pour fermer la boite de dialogue (ça peut être un simple bouton avec un libellé explicite ou une croix de fermeture dans le coin haut-droite de la boite, sans oublier l'internationalisation des interfaces pour les langages <abbr title="Right-To-Left" lang="en">RTL</abbr>).

## CSS

Dans notre implémentation nous définissons deux pré-requis :

`.dialog` qui est le conteneur principal de notre boite de dialogue. On l'utilisera pour définir le masque d'arrière plan. `[role="dialog"]` est le conteneur qui matérialise la boite de dialogue visuelle.

En plus de cela, JavaScript va gérer le changement de quelques attributs et classes qui vont représenter la séquence d'ouverture et de fermeture de la boite. Cette séquence se matérialisera au travers des sélecteurs suivant.

La séquence de fermeture suit ces étapes :

1. `.dialog`: La boite de dialogue est visible.
2. `.dialog.hidden`: La boite de dialogue passe en mode caché (_soft hide: La boite n'est plus visible mais elle est peu toujours être restituée par les lecteurs d'écran_).
3. **Attente de la fin des transitions CSS.**
4. `.dialog[hidden].hidden`: La boite de dialogue passe en mode masqué (_hard hide: la boite de dialogue n'est plus visible et ne peut plus être restitué par les lecteurs d'écran_).

La séquence de d'ouverture suit ces étapes :

1. `.dialog[hidden].hidden`: La boite de dialogue est masqué (_hard hide: la boite de dialogue n'est pas visible et ne peut pas être restitué par les lecteurs d'écran_).
2. `.dialog.hidden`: La boite de dialogue passe en mode caché (_soft hide: La boite n'est toujours pas visible mais elle est peu être restitué par les lecteurs d'écran_).
3. **Attente du rendu de l'élément par le navigateur.**
4. `.dialog`: La boite de dialogue devient visible. (_Elle commence à devenir visible et peut être rendu par les lecteurs d'écran._)
5. **Attente de la fin des transitions CSS, s'il y en a.**

> **NOTE:** _Le sélecteur `.hidden` n'est pas défini par défaut. Si vous voulez réaliser une transition douce, voyez l'exemple ci-après pour comprendre comment définir ce sélecteur pour vos besoins._

```css
/* L'élement `.dialog` représente la couche de superposition complète de la
 * boite de dialogue. Il contient toujours un élément `[role="dialog"]`.
 * L'enrobage de `[role="dialog"]` par `.dialog` est fait automatiquement
 * par JavaScript */
.dialog {
  /**
   * Une boite de dialogue doit être positionné et, dans ce cas, c'est fait par
   * l'intermédiaire de JavaScript. JavaScript prend le controle des propriétés
   * `position`, `top`, `left`, `width` et height`. Faites attention si vous
   * voulez surcharger ces propriétés pour ce selecteur.
   *
   * De même, souvenez-vous que JS peut créer ou déplacer des élément `.dialog`
   * n'importe ou. Ainsi, si vous créer des sélecteurs qui inclus `.dialog`, ne
   * partez jamais du principe que `.dialog` a un parent. Considérez le
   * toujours comme un sélecteur racine.
   */
  position: fixed;

  /* Il n'y a pas de règle absolue icin mais généralement, la boite de
   * dialogue  visuelle `[role="dialog"]` est centrée à l'interieur de
   * sa couche de superposition. */
  display: flex;
  align-items: center;
  justify-content: center;

  /* C'est comme ça qu'on materialise le cache d'arrière plan.
   * N'hésitez pas à le surcharger avec votre propre couleur/effet. */
  background: #CCCCCCCC; /* translucent grey */
}

/**
 * L'attribut `[hidden]` indique que la boite modales est totalement fermée
 * (invisiblle et illisible par les lecteurs d'écran). Il est possible de
 * définir la class `.hidden` pour réaliser un masquage doux (_soft hide_:
 * invisible mais quand même lisible par les lecteurs d'écran) même si nous
 * ne définissons aucun état par défaut pour ça ici.
 */
.dialog[hidden] {
  display: none;
}

[role="dialog"] {
  /**
   * Ces comme ça que l'on materialise l'arrière plan de la modal de dialogue,
   * n'hésitez pas à surcharger ça avec votre propre couleur/effet. En règle
   * général, les couleurs de texte et d'arrière plan devrais être les mêmes
   * que celle de votre document et dans tous les cas faite attention à créer
   * des cas spécifiques pour les _media queries_ `prefers-color-scheme`
   * et `prefers-contrast`
   */
  background: white; /* solid white */
}

/**
 * Les boites de dialogue qui ne sont pas encore enveloppées par un conteneur
 * `.dialog` sont cachées par défaut jusqu'à ce que JS s'en soit occupé.
 */
:not(.dialog) > [role="dialog"] {
  display: none;
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
body.dialogIsOpen > :not(.dialog) {
  filter: blur(2px);
}

/* Exemple d'un transition douce sur une boite de dialogue. JS va gérer le
changement de la class `.hidden`, à vous de définir ce que "hidden" signifie. */
.dialog {
  opacity: 1; /* Apparition progressive à l'ouverture */
  transition: opacity 500ms; /* Durée de la transition */
}

.dialog [role="dialog"] {
  transform: scale(1); /* Effet de zoom à l'ouverture */
  transition: transform 500ms; /* Durée de la transition */
}

.dialog.hidden {
  opacity: 0; /* Disparition progressive à l'ouverture */
}

.dialog.hidden [role="dialog"] {
  transform: scale(.8); /* Effet de dé-zoom à la fermeture */
}
```
