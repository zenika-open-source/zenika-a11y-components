# Dialog box

A dialog box, aka Modal box or Pop-in, is a way to create a secondary workflow that interrupt the main page workflow. This secondary workflow must be completed (or aborted) before being able to resume the main workflow.

Because of their disruptiveness, dialog boxes must be used with care.

## Design

Detail for the design of dialog box is available in the style [README.md](../../styles/dialog/README.md)

Because dialog boxes are always on top of the main content to create their own workflow area, they MUST be inserted as a direct child of the `<body>` element.

## Structure

```html
<div role="dialog" class="dialog"
  aria-label="My modal titles"
  aria-modal="true"
  tabindex="0">

  <section class="dialog__main">
    <!-- Dialog content must be set here -->

    <button class="dialog__close">Close the modal box</button>
  </section>
</div>
```

Specification for the use of ARIA attribute are defined in [WAI-ARIA Authoring Practices 1.2](https://w3c.github.io/aria-practices/#dialog_modal)

The main `div[role="dialog"]` is the one that will be positioned and that we'll use to set a background that will cover the main content of the page. The `<section>` will contain the whole dialog content. That way we can customize its appearance to create any type of dialog box.

## Controls

JavaScript is used to control dialogue box in two ways:

 1. **Showing and hiding the dialogue box.**
    As usual, the effects to show or hide an element are handled through CSS, so JS will only toggle a class on the dialog element. The real deal is to handle the focus properly: When the dialog appears it must take the focus and when the dialog box disappears, the elements which had the focus at the moment the dialog show up must take back the focus. JavaScript must remember and handle those focus states. JavaScript is also use to be sure  the Dialog box can be closed with the keyboard (with the `Escape` key) in addition to all the control buttons.
 2. **Trap the focus inside the dialog box.**
    When a dialog is open the focus must remain inside the dialog box so JavaScript has to handle this to be sure the focus is never given to an element outside the dialog box.

### API

 - `open(HTMLElement: node): Promise`: Take the node provided, test it and _open_ the dialog box (apply CSS class `dialog--open`, gives the focus to the dialog and trap the focus). The async API allows to apply some post open treatment (for example, to apply an open CSS effect to smoothly show the modal)
 - `close(HTMLElement: node): Promise`: Take the node provided, test it and _close_ the dialog box (remove the CSS class `dialog--open`, release the focus trap, gives back the focus to the element that had the focus before we open the dialog box). The async API allows to apply some post close treatment (for example, to remove the dialog box from the DOM)
