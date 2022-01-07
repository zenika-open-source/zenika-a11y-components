# Dialog box

A dialog box, aka Modal box or Pop-in, is a way to create a secondary workflow that interrupt the main page workflow. This secondary workflow must be completed (or aborted) before being able to resume the main workflow.

Because of their disruptiveness, dialog boxes must be used with care.

> **NOTE:** _If you intent to simply display a message that needs to be
> formally acknowledge, you should better use an Alert Dialog box which
> is more assertive to the users._

## Design

Detail for the design of dialog box is available in the style [README.md](../../styles/dialog/README.md)

> **NOTE:** A dialog box can be defined anywhere in the DOM but, when it is
> initialized, it is moved inside a `body > div.overlay.dialog` node, so be
> careful with your CSS selectors (see below fo details).

## Structure

```html
<div role="dialog"
  aria-label="My modal titles"
  aria-modal="true"
  tabindex="0">

  <!-- Dialog content must be set here -->
</div>
```

Specification for the use of ARIA attributes are defined in [WAI-ARIA Authoring Practices 1.2](https://w3c.github.io/aria-practices/#dialog_modal)

The main `div[role="dialog"]` will contain the whole dialog content, which can be whatever HTML you wish.

Because dialog box needs to be put on top of all the content, it is easier to do this if it is a direct child of the `body` element. To make dialog box easier to style, regardless where de dialog box DOM node is defined, it will be moved when initialized. So once initialized, the dialog box DOM will looks like:

```html
<body>
  <!-- Whatever was already inside the body  -->

  <div class="overlay dialog hidden" hidden aria-hidden>
    <div role="dialog"
      aria-label="My modal titles"
      aria-modal="true"
      tabindex="0">

      <!-- Dialog content is still here -->
    </div>
  </div>
</body>
```

The `div.overlay.dialog` wrapper is here to let us customize the dialog backdrop and to help prevent unwanted pointer events reaching anything below that backdrop.

## Controls

The JavaScript `Dialog` class is used to control a dialog box in two ways:

 1. **Showing and hiding the dialogue box.**
    As usual, the effects to show or hide an element are handled through CSS, so JS will only toggle a class (`hidden`) on the overlay element. The real deal is to handle the focus properly: When the dialog appears it must take the focus and when the dialog box disappears, the elements which had the focus at the moment the dialog show up must take back the focus. JavaScript must remember and handle those focus states. JavaScript is also use to be sure  the Dialog box can be closed with the keyboard (with the `Escape` key) in addition to all the control buttons.
 2. **Trap the focus inside the dialog box.**
    When a dialog is open the focus must remain inside the dialog box so JavaScript has to handle this to be sure the focus is never given to an element outside the dialog box.

### API

 - `new Dialog(HTMLElement: node)`: Create a new dialog API to manage the given node. The only requirement for the node is to have an `aria-label` or `aria-labelledby` attribute (their content cannot be defined automatically).
 - `Dialog::show(): Promise<Dialog>`: _Open_ the dialog box (remove the class `hidden` on the overlay, gives the focus to the dialog and trap the focus). The async API allows to apply some post open treatment. The async opening sequence allows to use CSS transition to create open effects.
 - `Dialog::hide(): Promise<Dialog>`: _Close_ the dialog box (set the CSS class `hidden` on thee overlay, release the focus trap, gives back the focus to the element that had the focus before we open the dialog box). The async API allows to apply some post close treatment (for example, to remove the dialog box from the DOM)
 - `Dialog.close(): Promise`: Close the current open dialog box.
 - `Dialog.getOpen(): Dialog|null`: Give access to the current open dialog box.
