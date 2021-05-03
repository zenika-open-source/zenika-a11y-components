# Boite de dialogue

Une boite de dialogue, ou boite modale, ou Pop-in, est un moyen de créer un workflow secondaire qui interrompe le workflow principale de la page. Ce workflow secondaire doit être terminé (ou abandonné) avant de pouvoir reprendre le workflow principale.

A cause de leur nature invasive, les boites de dialogue doivent être utilisé prudemment.

## Design

Le détail du design des boites de dialogue est disponible dans le [README.fr.md](../../styles/dialog/README.fr.md) dédié aux styles.

Dans la mesure ou les boites de dialogue sont systématiquement positionné au dessus du contenu principal, elles DOIVENT être des enfants direct de l'élément `<body>`.

## Structure

```html
<div role="dialog" class="dialog"
  aria-label="Libellé de ma boite modale"
  aria-modal="true"
  tabindex="0">

  <section class="dialog__main">
    <!-- Le contenu de la boite de dialogue doit être inséré ici -->

    <button class="dialog__close">Fermer la boite modale</button>
  </section>
</div>
```

L'usage des attributs ARIA est définie dans la spécification [WAI-ARIA Authoring Practices 1.2 (en)](https://w3c.github.io/aria-practices/#dialog_modal)

Le principal élément `div[role="dialog"]` est celui qui sera positionné et qu'on utilisera pour définir un arrière plan qui couvrira le contenu principal de la page. L'élément `<section>` contiendra tout le contenu visible de la boite de dialogue. De cette façon on peut personnalisé l'apparence de notre boite de dialogue pour créer n'importe quel type de dialogue.

## Contrôles

JavaScript est utilisé pour contrôler les boites de dialogue de deux façons :

 1. **Afficher et masquer la boite de dialogue.**
    Comme d'habitude, l'effet d'affichage et masquage d'un élément est géré via CSS, ainsi, JavaScript va simplement ajouter/supprimer une class CSS sur l'élément porteur de la boite de dialogue. Le vraie sujet c'est la gestion du focus : Quand la boite de dialogue apparait elle doit prendre le focus, et quand elle disparait l'éléments qui avait le focus avant l'ouverture de la boite doit reprendre le focus. JavaScript doit se souvenir de cet éléments et doit gérer l'état du focus. JavaScript est également utilisé pour s'assurer que la boite de dialogue pourra être fermé via l'utilisation du clavier (avec la touche `Escape`) en plus de tous les boutons de contrôle.
 2. **Enfermer le focus dans la boite de dialogue.**
    Quand une boite de dialogue est ouverte, le focus doit rester à l'intérieur de la boite. Ainsi, JavaScript doit s'assurer qu'aucun élément à l'extérieur de la boite de dialogue ne prendra jamais le focus tant qu'elle est ouverte.

### API

 - `new Dialog(HTMLElement: node)`: Créer une nouvelle API de boite de dialogue pour le nœud fournis.
 - `open(HTMLElement: node): Promise`: _Affiche_ la boite de dialogue (en ajoutant la class CSS `dialog--open`, en donnant le focus à la boite de dialogue, et en enfermant le focus). La nature asynchrone de l'API permet d'appliquer des post-traitement suite à l'ouverture (par exemple, en appliquant un effet d'ouverture CSS à la boite de dialogue).
 - `close(HTMLElement: node): Promise`: _Masque_ la boite de dialogue (en supprimant la class CSS `dialog--open`, en libérant le focus, et en redonnant le focus à l'élément qui l'avait avant l'ouverture de la boite de dialogue). La nature asynchrone de l'API permet d'appliquer des post-traitement suite à la fermeture (par exemple, pour supprimer les nœuds DOM de la boite de dialogue).
