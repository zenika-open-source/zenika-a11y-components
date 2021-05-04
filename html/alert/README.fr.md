# Alerte

Une alerte est une information importante porté à l'attention de l'utilisateur. Elle n'interrompe pas nécessairement sont workflow mais elle est fermement mise en avant pour être sur que l'utilisateur reçoit l'information immédiatement. Un bon exemple de ça serait une notification réseaux ou une erreur de validation de formulaire.

Si l'information doit avoir un impact sur le workflow de l'utilisateur, l'alerte peut mettre le déroulement du workflow en pause jusqu'à ce que l'utilisateur confirme la lecture de l'alerte. Dans ce cas, on va généralement matérialiser l'alerte sous la forme d'une boite de dialogue (qui sera tout de même présenté de manière un peu plus agressive à l'utilisateur)

## Design

Le détail du design des alertez est disponible dans le [README.fr.md](../../styles/alert/README.fr.md) dédié aux styles.

Une alerte peut être incluse n'importe ou dans le DOM. Cependant, si l'alerte est lié à une action utilisateur, il est conseillé d'inclure cette alerte au plus proche de l'endroit ou interagit l'utilisateur. Attention tout de même de ne pas altérer l'ordre des tabulations ou la prédictibilité des actions utilisateur. Soyez vigilant vis à vis des critères WCAG suivant :

- [1.3.2 Meaningful Sequence — Level A](https://www.w3.org/WAI/WCAG21/Understanding/meaningful-sequence.html)
- [2.4.3 Focus Order — Level A](https://www.w3.org/WAI/WCAG21/Understanding/focus-order.html)

Faites également attention de ne pas supprimer les alerte trop vite. L'utilisateur doit avoir assez de temps pour digérer les informations de l'alerte. On considère que c'est une bonne pratique de ne supprimer les alertes qu'après une action utilisateur (éviter la suppression automatique des alerte après un certain temps).

Si les alertes ne sont pas inclus dans le flux du document mais présentées sous la forme de boites de dialogues ou de pop-in de notification, elles DOIVENT être des enfants direct de l'élément `<body>` (voir les [boites de dialogue](../dialog/README.md) pour plus de détails).

## Structure

### Alertes simple

```html
<div role="alert">
  <!-- Le contenu de l'alerte doit être placé ici -->
</div>
```

L'usage des attributs ARIA est définie dans la spécification [WAI-ARIA Authoring Practices 1.2 (en)](https://w3c.github.io/aria-practices/#alert)

### Boites d'alerte

```html
<div role="alertdialog" class="dialog"
  aria-modal="true"
  aria-label="Alert"
  aria-describedby="foo"
  tabindex="0">

  <section class="dialog__main">
    <div id="foo" class="dialog__content">
      <!-- Le contenu de l'alerte doit être placé ici -->
    </div>

    <button class="dialog__close">Close the modal box</button>
  </section>
</div>
```

Les boites d'alerte se comporte comme n'importe quel [boite de dialogue](../dialog/README.fr.md) mais utilise le rôle `alertdialog` à la place de `dialog`, et parce que ce genre de boite à un contenu plus pressant elle doit comporter un attribut `aria-describedby` qui fera référence au contenu de l'alerte.

> **Note:** _L'utilisation de `aria-describedby` est si important que si vous ne définissez pas d'ID sur le contenu de l'alerte, `AriaDialog` en générera un automatiquement pour faire l'association (ça peut être pratique si vous gérez plusieurs boites d'alerte et que vous ne voulez pas vous embêter a géré l'unicité des ID vous même). De la même façon, si l'élément `.dialog__content` n'existe pas, il sera créer et ajouté comme premier enfant de la section principale de la boite de dialogue._

L'usage des attributs ARIA est définie dans la spécification [WAI-ARIA Authoring Practices 1.2 (en)](https://w3c.github.io/aria-practices/#alertdialog)

## Controls

JavaScript est utilisé pour controlé les alertes de deux façons:

 1. **Alerte simple**
    Pour les alerte simple il s'agit simplement d'ouvrir et fermer les alertes, ce qui consiste simplement a l'ajout/suppression d'une class CSS sur le nœud DOM concerné. L'API JS fournis également un moyen simple d'injecter directement n'importe quel contenu HTML dans l'alerte tout en s'assurant qu'il sera bien restitué à l'utilisateur (Certains lecteurs d'écran ont besoin d'entendre l'évènement `DOMContentLoaded` pour pouvoir restituer une alerte à l'utilisateur).
 2. **Boites d'alerte**
    Les boites de d'alerte ce comporte exactement comme des boites de dialogue normal, c'est pourquoi `AlertDialog` hérite de `Dialog`.

### API

 - `new Alert(HTMLElement: node)`: Créer une nouvelle API de gestion d'alerte pour le nœud donné.
 - `Alert::open(string: message): Promise<Alert>`: _Ouvre_ l'alerte (en remplissant le contenu de l'alerte avec `message`, et en appliquant la classe CSS `alert--open`). La nature asynchrone de l'API permet d'appliquer des post-traitement suite à l'ouverture (par exemple, en appliquant un effet d'ouverture CSS à l'alerte, ce qui est très utile pour animer une notification entrante).
 - `Alert::close(boolean: keepContent): Promise<Alert>`: _Ferme_ l'alerte (en supprimant la classe CSS `alert--open`, et en supprimant le contenu de l'alerte si le paramètre `keepContent` n'est pas vraie). La nature asynchrone de l'API permet d'appliquer des post-traitement suite à la fermeture (par exemple, pour supprimer les nœuds DOM de la boite de dialogue).

 - `new AlertDialog(HTMLElement: node)`: Créer une nouvelle API de boite d'alerte pour le nœud donné.
 - `AlertDialog::open(string: message): Promise<AlertDialog>`: _Ouvre_ l'alerte (en remplissant le contenu de l'alerte avec `message`, en appliquant la classe CSS `dialog--open` et en capturant le focus). La nature asynchrone de l'API permet d'appliquer des post-traitement suite à l'ouverture (par exemple, en appliquant un effet d'ouverture CSS à la boite d'alerte).
 - `AlertDialog::close(boolean: keepContent): Promise<AlertDialog>`: _Ferme_ la boite d'alerte (en supprimant la class CSS `dialog--open`, en supprimant le contenue de la boite d'alerte si le paramètre `keepContent` n'est pas vrai, et en libérant le focus). La nature asynchrone de l'API permet d'appliquer des post-traitement suite à la fermeture (par exemple, pour supprimer les nœuds DOM de la boite de dialogue).
 - `AlertDialog.close(boolean: keepContent): Promise` Ferme n'importe quelle boite de dialogue et supprime son contenu s'il s'agissait d'une `AlertDialog` et que  `keepContent` était vrai.
