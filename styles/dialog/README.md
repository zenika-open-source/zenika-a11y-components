# Dialog box

A dialog box, aka Modal box or Pop-in, is a way to create a secondary workflow that interrupt the main page workflow. This secondary workflow must be completed (or aborted) before being able to resume the main workflow.

Because of their disruptiveness, dialog boxes must be used with care.

## Basic design

![](dialog.png)

A dialog box is fundamentally defined by two things:

  1. A backdrop that hide more or less the content behind the dialog box;
  2. The dialog box itself;

Usually the backdrop is translucent and the dialog box is opaque but everything is possible. For example, it's possible to have no backdrop but a drop shadow behind the dialog box. Another example is when the dialog box cover the whole viewport (in that case, even if it is technically okay, it can be confusing for the user that could misunderstand the purpose of the UI)

The content of the dialog box is free but usually we have at least one button to close the dialog (It can be either a button with an explicit label or a cross in the top-right corner, and remember about internationalization of UI for <abbr title="Right-To-Left">RTL</abbr> languages)

## CSS

In our implementation we define two requirements:

`.dialog` which is the main container for our dialog box. We will use it to define the backdrop. `[role="dialog"]` is the container that materialize our visual dialog box.

In addition, the JS manager is handling some attribute and class change to materialize the closing and opening sequences which results in the following reacher selectors.

The closing sequence is following those steps :

 1. `.dialog`: The dialog is fully visible.
 2. `.dialog.hidden`: The dialog is set in soft hide mode (_it is no longer visible, but can still be rendered by screen readers_)
 3. **Waiting until CSS transitions end**
 4. `.dialog[hidden].hidden`: The dialog is set in hard hide mode (_it is no longer visible and it cannot be rendered by screen readers_).

The opening sequence is following those steps :

 1. `.dialog[hidden].hidden`: The dialog is in hard hide mode (_it is not visible, and can't be rendered by screen readers_)
 2. `.dialog.hidden`: The dialog is set in soft hide mode (_it is still not visible, but can be rendered by screen readers_)
 3. **Waiting for the browser to preform the render of the element**
 4. `.dialog`: The dialog is fully visible. (_it start to be visible, and can be rendered by screen readers_)
 5. **Waiting until CSS transitions end, if any**

> **NOTE:** _The `.hidden` selector isn't defined by default. If you want to perform a soft transition, see the example below on how to define that selector for your own needs._

```css
/* The `.dialog` element represent the whole dialog overlay. It will always
 * contain a `[role="dialog"]` element. The wrapping of `[role="dialog"]` with
 * `.dialog` is done automatically with JS. */
.dialog {
  /**
   * A dialog box must be positioned and in this case, it is handled via JS.
   * JS is taking over the properties `position`, `top`, `left`, `width`
   * height`. Be careful if you want to overload those properties for this
   * selector.
   *
   * Also remember that JS can create or move `.dialog` element anywhere,
   * so never assume any parents while creating selectors with `.dialog`.
   * Always assume `.dialog` is a root selector.
   */
  position: fixed;

  /* There are no hard rules here, but usualy the visual dialog
   * `[role="dialog"]` box is centered inside its overlay */
  display: flex;
  align-items: center;
  justify-content: center;

  /* This is how we materialise the backdrop,
   * feel free to overload with your own color/effect */
  background: #CCCCCCCC; /* translucent grey */
}

/**
 * The `[hidden]` attribute indicate that the modal is fully closed (not visible
 * nor readable by screen reader). It is possible to use the class `.hidden`
 * to perform a soft hidding (invisible but still readable by screen reader)
 * even if we have no default behavior for this here.
 */
.dialog[hidden] {
  display: none;
}

[role="dialog"] {
  /**
   * This is how we materialise the modal background, feel free to overload
   * with your own color/effect. Usually, color and background should be the
   * same as those from your body and you should take care to create cases for
   * the `prefers-color-scheme` and `prefers-contrast` media queries.
   */
  background: white; /* solid white */
}

/**
 * Any dialog box that is not yet wrap inside a `.dialog` overlay
 * is hidden by default until it is properly wrapped with JS
 */
:not(.dialog) > [role="dialog"] {
  display: none;
}
```

## Special effects

Some effects (such as a blur on the backdrop or a smooth transition when the dialog display is changed) can require some extra CSS class to be done. As usual with CSS, feel free to be creative. The easiest way to deal with that is to use the JavaScript API to add an extra CSS class on the body to gain some opportunities.

```js
new Dialog(node).open().then(() => {
  // When this class is set, we are sure that the browser has performed
  // a reflow after the change of display state for the dialog box. This
  // is necessary to let us transition properties if we wish to.
  document.body.classList.add('dialogIsOpen')
})
```

```css
/* Example of a blur on the backdrop */
body.dialogIsOpen > :not(.dialog) {
  filter: blur(2px);
}

/* Example of a smooth effect on the visual dialog box
   JS will handle to switch the `.hidden` class, its up to
   you to define what "hidden" means */
.dialog {
  opacity: 1; /* fadein effect when opening */
  transition: opacity 500ms; /* Duration of fade */
}

.dialog [role="dialog"] {
  transform: scale(1); /* scale up effect when opening */
  transition: transform 500ms; /* Duration of scale */
}

.dialog.hidden {
  opacity: 0; /* fadeout effect when closing */
}

.dialog.hidden [role="dialog"] {
  transform: scale(.8); /* scale down effect when closing */
}
```
