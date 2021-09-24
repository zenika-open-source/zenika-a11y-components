# Generic components

Generic components are classes that embed some commons behaviors that will be
shared among various accessible components. Those generic components are not
meant to be used standalone, but as base classes to be extended. That said they
are not abstract classes and can be used out of the box if you wish.

# Overlays

An overlay is a piece of UI that is displayed on top of some page content.
This class provide the basic mechanics to handled showing, hiding
and positioning such UI component.

Because positioning such an element is critical, JS is taking over CSS to
handle it. What it means is that it can set directly the following CSS
properties:

 - `position` (either `fixed`, by default, or `absolute`)
 - `top`
 - `left`
 - `width` (only for auto positioning over a specific element)
 - `height` (only for auto positioning over a specific element)

If, for design purpose, we want to shift the position, it is required to use
CSS transformation (which is also better for performance). If it's very
problematic, it is still possible to release JS control over all those property
by using the keyword `auto` on all the following property:

 - `overlay.isFixed = "auto"` will unset `node.style.position`
 - `overlay.x = "auto"` will unset `node.style.left`
 - `overlay.y = "auto"` will unset `node.style.top`
 - `overlay.width = "auto"` will unset `node.style.width`
 - `overlay.height = "auto"` will unset `node.style.height`

> **Note:** Remember that positioning is highly sensitive to stacking context
> so, for fixed overlays, make sure they are close to the top of the DOM tree
> (ideally, a direct child of the body element); for absolute overlay, you
> have to be careful about how to compute their position. see: https://developer.mozilla.org/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context

> **Note:** _Overlay sizing and positioning is layout intensive. Using it too
> often can harm your application performances. Use with care!
> See: https://gist.github.com/paulirish/5d52fb081b3570c81e3a
