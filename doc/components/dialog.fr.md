# Boite de dialogue

Une boite de dialogue, ou boite modale, ou Pop-in, est un moyen de créer un workflow secondaire qui interrompe le workflow principale de la page. Ce workflow secondaire doit être terminé (ou abandonné) avant de pouvoir reprendre le workflow principale.

A cause de leur nature invasive, les boites de dialogue doivent êtres utilisées prudemment.

> **NOTE:** _Si vous voulez juste afficher un message qui a besoin d'être validé formellement, vous devriez plutôt utiliser une boite d'alerte qui sera restitué de manière plus efficace à l'utilisateur._


## Comportements

Les boites de dialogue on un certain nombre de comportements qu'elles doivent suivre.

La description complète de leurs comportements et disponible sous forme de tests formels dans le fichier [`dialog.feature`](../../tests/features/dialog.feature)

> **Documentation normative :** _Le comportement des boites de dialogue est formellement spécifié dans la spécification_ [WAI-ARIA Authoring Practices 1.2 (en)](https://www.w3.org/TR/wai-aria-practices-1.2/#dialog_modal).

### Ouverture et fermeture

Il n'y a pas de règle sur la façon d'ouvrir une boite de dialogue. Ceci dit, une fois qu'elle est ouverte, on attend les comportements suivants :

 - Quand une boite de dialogue est ouverte, toute autre boite de dialogue qui était ouverte est alors fermée. En d'autre termes, une seul boite de dialogue peut être ouverte à la fois.
   > **Note:** _Au delà des questions d'accessibilité, on considère souvent qu'ouvrir une nouvelle boite de dialogue depuis une boite de dialogue existante est une mauvaise pratique d'UX Design._
 - Quand une boite de dialogue est ouverte, on peut la refermer en appuyant sur la touche <key>Escape</key>.

Même si ce n'est spécifié nulle part, on s'attend à ce qu'une boite de dialogue contienne un élément interactif pour la fermer. Il s'agit généralement soit d'un simple bouton "Fermer" en bas de la boite de dialogue, soit d'un bouton graphique (comme une croix) dans un des coins supérieur de la boite de dialogue.

### Gestion du focus

Une boite de dialogue est un piège à focus, ce qui signifie que :

 - Quand une boite de dialogue est ouverte, elle gagne le focus.
 - Quand une boite de dialogue est ouverte, tous les changements de focus sont circoncis à la boite de dialogue. En d'autre termes, il n'est pas possible de donner le focus à une élément en dehors de la boite de dialogue tant qu'elle est ouverte.
 - Quand une boite de dialogue est fermée, l'élément qui avait le focus avant qu'elle ne soit ouverte récupère le focus.


## Implémentations

Pour le moment, nous fournissons un implémentation pour :

  - [HTML/JS](../../html/dialog/README.md)

Nous fournissons également [un jeu de styles minimal](../../styles/dialog/README.fr.md) qui peut servir de base pour créer un design plus raffiné :

  - [CSS](../../styles/dialog/dialog.css)
