# Boite de dialogue

Une boite de dialogue, ou boite modale, ou Pop-in, est un moyen de créer un workflow secondaire qui interrompe le workflow principale de la page. Ce workflow secondaire doit être terminé (ou abandonné) avant de pouvoir reprendre le workflow principale.

A cause de leur nature invasive, les boites de dialogue doivent être utilisé prudemment.

> **NOTE:** _Si vous voulez juste afficher un message qui a besoin d'être
> validé formellement, vous devriez plutôt utiliser une boite d'alerte qui sera
> restitué de manière plus efficasse à l'utilisateur._

## Design

Le détail du design des boites de dialogue est disponible dans le [README.fr.md](../../styles/dialog/README.fr.md) dédié aux styles.

> **NOTE:** Une boite de dialogue peut être définie n'importe ou dans le DOM
> mais lorsqu'elle sera initialisé, elle sera déplacé dans un nœud
> `body > div.overlay.dialog`. Soyez donc prudent avec vos selecteurs CSS
> (plus de détail ci-après).

## Structure

```html
<div role="dialog"
  aria-label="Libellé de ma boite modale"
  aria-modal="true"
  tabindex="0">

  <!-- Le contenu de la boite de dialogue doit être inséré ici -->
</div>
```

L'usage des attributs ARIA est définie dans la spécification [WAI-ARIA Authoring Practices 1.2 (en)](https://w3c.github.io/aria-practices/#dialog_modal)

Le contenu de la boite de dialogue sera tout le HTML que vous placerez à l'interieur de l'élément `div[role="dialog"]`.

Les boites de dialogues devant être placées par dessus le contenu de la page, c'est plus facile à réaliser si la boite de dialogue est un enfant direct de l'élément `body`. Pour facilité l'application des styles, peut importe ou est définie la boite de dialogue, celle-ci sera déplacé au moment de sont initialisation. Une fois l'initialisation terminé, le DOM resemblera à ça :

```html
<body>
  <!-- le contenu qui été déjà présent dans le body reste inchangé  -->

  <div class="overlay dialog hidden" hidden aria-hidden>
    <div role="dialog"
      aria-label="My modal titles"
      aria-modal="true"
      tabindex="0">

      <!-- Le contenu de la boite de dialogue est toujours ici -->
    </div>
  </div>
</body>
```

L'enveloppe `div.overlay.dialog` est ici pour permettre de personnaliser l'arrière plan et éviter que des évènements de pointeur intempestif atteigne des éléments en arrière plan.

## Contrôles

La class JavaScript `Dialog` est utilisé pour contrôler les boites de dialogue de deux façons :

 1. **Afficher et masquer la boite de dialogue.**
    Comme d'habitude, l'effet d'affichage et masquage d'un élément est géré via CSS, ainsi, JavaScript va simplement ajouter/supprimer une class CSS (`hidden`) sur l'élément porteur de la boite de dialogue. Le vraie sujet c'est la gestion du focus : Quand la boite de dialogue apparait elle doit prendre le focus, et quand elle disparait l'éléments qui avait le focus avant l'ouverture de la boite doit reprendre le focus. JavaScript doit se souvenir de cet éléments et doit gérer l'état du focus. JavaScript est également utilisé pour s'assurer que la boite de dialogue pourra être fermé via l'utilisation du clavier (avec la touche `Escape`) en plus de tous les boutons de contrôle.
 2. **Enfermer le focus dans la boite de dialogue.**
    Quand une boite de dialogue est ouverte, le focus doit rester à l'intérieur de la boite. Ainsi, JavaScript doit s'assurer qu'aucun élément à l'extérieur de la boite de dialogue ne prendra jamais le focus tant qu'elle est ouverte.

### API

 - `new Dialog(HTMLElement: node)`: Créer une nouvelle API de boite de dialogue pour le nœud fournis. Le seul pré-requis c'est que le nœeud DOM possède un attribut `aria-label` ou `aria-labelledby` (leur contenu ne peut pas être créé automatiquement).
 - `Dialog::show(): Promise<Dialog>`: _Affiche_ la boite de dialogue (en supprimant la class CSS `hidden`, en donnant le focus à la boite de dialogue, et en enfermant le focus). La nature asynchrone de l'API permet d'appliquer des post-traitement suite à l'ouverture. La séquence d'ouverture asynchrone vous permet de facilement appliquer des effet de transition.
 - `Dialog::hide(): Promise<Dialog>`: _Masque_ la boite de dialogue (en ajouant la class CSS `hidden`, en libérant le focus, et en redonnant le focus à l'élément qui l'avait avant l'ouverture de la boite de dialogue). La nature asynchrone de l'API permet d'appliquer des post-traitement suite à la fermeture (par exemple, pour supprimer les nœuds DOM de la boite de dialogue).
 - `Dialog.close(): Promise`: Ferme la boite de dialogue courante.
 - `Dialog.getOpen(): Dialog|null`: Donne accès à la boite de dialogue courante.
