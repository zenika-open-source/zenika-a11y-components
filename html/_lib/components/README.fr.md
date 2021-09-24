# Composants génériques

Les composants génériques sont des classes qui définissent des comportement communs, partagés par plusieurs composant accessible. C'est composant génériques n'ont pas vocation à être utilisé directement, mais comme des classes que l'on étendra. Ceci dit, ce ne sont pas des classes abstraites et elles peuvent être utilisé de manière autonome si vous le voulez.

# Overlays

Un _overlay_ est un composant d'interface qui viens se positionner par dessus le contenu d'une page. Cette classe fournit les mécanismes nécessaires pour afficher, masquer et positionner ces éléments d'interface.

Le positionnement de ces éléments et si critique que JS va prendre le pas sur
CSS pour le gérer. En claire, il va pouvoir définir les valeurs des propriétés
CSS suivantes :

 - `position` (soit `fixed`, par défaut, soit `absolute`)
 - `top`
 - `left`
 - `width` (uniquement pour le positionnement automatique par dessus un élément spécifique)
 - `height` (uniquement pour le positionnement automatique par dessus un élément spécifique)

Si, pour les besoins du design on souhaite ajuster le positionnement, il faudra
utiliser les transformations CSS (ce qui est mieux pour les performances, de
toute façon). Si c'est véritablement problématique, il est toujours possible
d'annuler le contrôle de JavaScript en appliquant le mot clé `auto` aux
propriétés de l'objet _overlay_ suivantes :

 - `overlay.isFixed = "auto"` annulera `node.style.position`
 - `overlay.x = "auto"` annulera `node.style.left`
 - `overlay.y = "auto"` annulera `node.style.top`
 - `overlay.width = "auto"` annulera `node.style.width`
 - `overlay.height = "auto"` annulera `node.style.height`

> **Note:** N'oubliez pas que le positionnement est très sensible au _stacking
> context_. Ainsi, pour les _overlay_ fixe, assurez vous qu'ils sont le plus
> proche possible to sommet de l'arbre DOM (idéalement, des enfants direct de
> l'élément `body`)`. Pour les _overlay_ absolue, vous devrez faire attention à
> la façon dont le positionnement est calculé.
> Lisez: https://developer.mozilla.org/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context

> **Note:** Le positionnement et le dimensionnement des _overlay_ a un cout
>  non-négligeable pour les navigateurs. Les forcer à faire ces calculs trop
> souvent peut avoir des conséquences négatives sur les performances de vos
> applications.
> Lisez: https://gist.github.com/paulirish/5d52fb081b3570c81e3a
