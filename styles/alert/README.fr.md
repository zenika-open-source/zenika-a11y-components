# Alerte

Une alerte est une information qui est portée à l'attention de l'utilisateur. Elle n'interrompt pas nécessairement son workflow mais elle est suffisamment mise en avant pour s'assurer qu'il reçois immédiatement l'information. Dans les exemples communs d'alerte on retrouve les notifications réseau ou les erreurs de saisie de formulaire.

Si l'information doit avoir un impact sur le workflow de l'utilisateur, l'alerte mettra le workflow en pause jusqu'à ce que l'utilisateur valide l'information. Dans ce genre de cas, on matérialise souvent l'alerte sous la forme d'un boite modal (souvent de manière plus agressive qu'une simple boite de dialogue).

## Design de base

Du point de vue du design il y a assez peux de règles formel pour ce qui touche aux alertes. Tant qu'elles sont bien perçus par l'utilisateur (au minimum, il faut qu'elles soient visuellement présentent dans le viewport), n'importe quoi peut faire l'affaire. Ceci dit, on peut dégager trois motifs de conception des alertes :


### Alerte de flux

Une alerte de flux est généralement un block de texte mis directement dans le flux du contenu courant et mis en évidence d'une manière ou d'une autre. L'exemple le plus communs ce sont les erreurs de saisie des formulaires.

En terme de design, ces genre alerte doit être géré de manière a maximiser la captation d'attention de l'utilisateur. Cela requiert de créer un design alternatif suffisamment différentiant par rapport au design courant tout en s'assurant que l'alerte soit positionnée a un endroit qui permettra de capter l'attention de l'utilisateur au bon moment. Sur ce dernier point, la question est : l'alerte doit-elle être positionné avant ou après le point d'interaction de l'utilisateur. Ça va essentiellement dépendre de la nature de l'alerte, cependant, on peut prendre comme principe directeur que, si l'alerte à peu de conséquence (c-à-d, que si l'utilisateur de la perçois pas, ça n'aura pas de conséquence) on peut la placer avant le point d'interaction de l'utilisateur. A l'inverse, si l'alerte fournis une information importante, qui peut requérir une action utilisateur, alors on fera en sorte de la positionner après le point d'interaction de l'utilisateur.

Par exemple, les erreurs de formulaire vont requérir une action de la part de l'utilisateur. Ainsi, on les positionnera à deux endroits différent selon le contexte (potentiellement au deux endroit si on le juge nécessaire) :

 - Chaque erreur individuel sera positionnée immédiatement après le champs en erreur (c'est l'emplacement préféré si la validation se fait en temps-réel). De cette manière l'erreur est immédiatement perceptible par l'utilisateur ce qui lui offre une opportunité de la corriger immédiatement.
 - Toutes les erreurs sont regroupées au début du formulaire (c'est généralement ce qui est fait quand on valide les erreurs à la soumission du formulaire, ce qui permettra à l'utilisateur de repasser dans le formulaire pour corriger les erreurs). Dans ce cas, assurez vous que les erreurs sont bien affichées dans le viewport (attention aux formulaires long). Si ce n'est pas le cas, vous pouvez doubler ces erreur avec des erreur local (comme au point précédent) ou bien vous pouvez donner le focus à la boite d'alerte des erreurs

> **Note:** _Souvenez vous que [les erreurs ne doivent pas être mise qu'avec de la couleur](https://www.w3.org/WAI/WCAG21/Techniques/failures/F81). C'est une bonne pratique d'identifier une boite d'alerte avec du texte (ce texte pouvant être remplacé visuellement par une icone). D'un point de vue technique les alerte peuvent avoir un libellé accessible qui sera fournis aux lecteurs d'écran, n'hésitez pas à mettre en scène ce libellé._


### Alerte hors flux

Les alertes hors flux sont généralement le résultat d'un évènement indépendant des interactions utilisateur. L'exemple le plus courant ce sont les notifications réseau.

On matérialise ça généralement par une boite qui vient se positionner au-dessus du contenu courant dans le coin en haut à droite (ou en haut à gauche pour les contenus <abbr title="Right To Left">RTL</abbr>). S'il n'y a rien de spécial pour designer ce genre de boite, il faut tout de même prendre quelques points en considération :

 - Assurez-vous que ces boites ne viennent pas se positionner au dessus d'élément avec lesquels l'utilisateur interagit. Cela peut requérir d'avoir des designs ou des positionnements alternatif selon les cas.
 - Assurez-vous que ces boites s'empileront correctement les unes au dessus des autres. Cela peut arriver si plusieurs boites apparaissent simultanément ou si l'utilisateur ne les masques pas (_souvenez-vous que [la suppression d'une information basé sur le temps peut poser de sérieux problèmes](https://www.w3.org/WAI/WCAG21/Understanding/timing-adjustable.html) d'accessibilité, évitez donc de faire ça_). Attention à de ne pas oublier comment l'utilisateur va interagir avec cet empilement de boite.


### Boite d'alerte modale

Du strict point de vu du design, les boites d'alerte modales sont exactement la même chose que [les boites de dialogue](../dialog/README.md). Cependant, dans la mesure ou elles sont sensés interrompre le workflow de l'utilisateur, on va leur attribuer un design légèrement différent pour les différencier des boites de dialogue ordinaires.

Dans la plupart des cas, ces boites d'alerte modales sont utiliser pour demander quelque chose à l'utilisateur qui peut avoir une influence majeur sur sont workflow. Pour cette raison, il est nécessaire de faire attention au design nécessaire au recueil de la décision de l'utilisateur (en particulier le contenu de l'alerte et les éventuellement boutons de validation ou d'annulation de l'alerte).


## CSS

Dans notre implémentation, nous définissons trois design d'alerte :

  1. `.alert` qui représente notre design de base pour les alerte de flux;
  2. `.alert--notification` un modificateur pour identifier les alertes hors flux (une notification aura les deux classes `.alert` et `.alert--notification`)
  3. `.dialog--alert`, un modificateur ajouté à n'importe quelle [boite de dialogue](../dialog/README.fr.md) (en plus des autres classes des boites de dialogue), et `.dialog__main--alert`, un modificateur ajouté aux classes du conteneur principal de la boite de dialogue.

> **Note:** _Nous n'allons pas dans ce niveau de détail (pour l'instant), mais n'hésitez pas à créer des sous-catégorie d'alerte pour touts vos besoins, des trucs comme `.alert--important`, `.alert--warning`, `.alert--info`, `.alert--notification--compact`, etc._


```css
:root {
  /* On utilise des propriétés personnalisées CSS pour facilitér la
     personnalisation de notre boite de dialogue. Cependant vous
     devriez simplement surcharger les selecteurs `.alert`,
     `.alert--notifiation` and `.dialog__main--alert` dans votre propre
     feuille de style. */
  --alert-border: 1px solid #900; /* une ligne rouge sombre */
  --alert-background: #EF0000;    /* rose claire */
  --alert-position-start: 1rem;   /* position vertical */
  --alert-position-end: 1rem;     /* position horizontal */
}

/* ALERTE DE FLUX ---------------------------------------------------------- */

.alert {
  display: none;

  border: var(--alert-border);
  background: var(--alert-background);
}

.alert--open {
  /* Les alerte ouverte sont de simple block par defaut, n'hesitez pas à
     surcharger ce selecteur pour utiliser n'importe quel type de siplay
     selon vos besoins. */
  display: block;
}

/* ALERTE HORS FLUX -------------------------------------------------------- */

.alert--notification {
  /* Une notification doit se positionner par dessus le contenu courrant tout
     en restant dans le viewport, quelque soit la position de scroll de la
     page principale */
  position: absolute;

  /* Par defaut on présume que le contenu est en LTR. Dans ce cas, la
     notification sera placé dans le coin en haut à droite du viewport */
  top: var(--alert-position-start);
  right: var(--alert-position-end);
}

[dir="rtl"] .alert--notification {
  /* Si la notification est affiché dans un environnement RTL, la notification
     sera placé dans le coin en haut à gauche du viewport */
  left: var(--alert-position-end);
  right: auto;
}

/* BOITE D'ALERTE MODALE --------------------------------------------------- */

.dialog__main--alert {
  /* On enrichie le style des boites de dialogue ordinaires
     avec les spécificité des boites d'alerte.*/
  border: var(--alert-border);
  background: var(--alert-background);
}
```


## Effets spéciaux

Certains effets (comme une transition douce quand on affiche/masque l'alerte) peuvent requérir une ou plusieurs classes CSS supplémentaires pour être réalisé. Comme d'habitude avec CSS, soyez créatifs. La façon la plus simple de gérer cette question est d'utiliser l'API JavaScript pour ajouter une classe CSS sur l'alerte pour étendre nos possibilités.

```js
new AlertNotification(node).open().then((alert) => {
  // Lorsque cette class est appliquée, nous sommes sur que le navigateur à
  // réalisé un reflow suite au changement de display de l'alerte. C'est
  // necessaire pour pouvoir appliquer une éventuelle transition CSS.
  node.classList.add('notificationIsOpen')

  // On lie le comportement de fermeture à l'évènement `transitionend`.
  // De cette manière, la classe `alert-open` sera suprimée une fois que
  // la transition demarrée par la suppression de la class `notificationIsOpen`
  // sera terminée.
  node.addEventListener('click', () => {
    node.addEventListener(
      'transitionend',
      () => alert.close(),
      { once: true }
    )

    node.classList.remove('notificationIsOpen')
  }, { once: true })
})
```

```css
.alert--notification {
  transform: translateX(110%);
  transition: transform 800ms;
}

.alert--notification.notificationIsOpen {
  /* La façon la plus simple de créer un effet
     slid-in/slide-out sur les notifications */
  transform: translateX(0);
}
```
