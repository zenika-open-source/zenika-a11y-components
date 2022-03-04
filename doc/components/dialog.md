# Dialog box

A dialog box, aka Modal box or Pop-in, is a way to create a secondary workflow that interrupt the main page workflow. This secondary workflow must be completed (or aborted) before being able to resume the main workflow.

Because of their disruptiveness, dialog boxes must be used with care.

> **NOTE:** _If you intent to simply display a message that needs to be formally acknowledge, you should better use an Alert Dialog box which is more assertive to the users._


## Behaviors

Dialog boxes are expected to follow some known behaviors.

Formal testable beaviors are available in the [`dialog.feature`](../../tests/features/dialog.feature) file.

> **Normative documentation:** _The behaviors for Dialog boxes are formally specified in: [WAI-ARIA Authoring Practices 1.2)](https://www.w3.org/TR/wai-aria-practices-1.2/#dialog_modal)_

### Opening and closing

There is no rules regarding how a dialog box can be open. That said, once it is open the following behaviors are expected:

 - When a dialog box is open, any previously opened dialog box is closed. In other words, only one dialog box can be open at a time.
   > **Note:** _Beyond accessibility concerned, It is usualy considered bad UX design to have a dialog box openning a new dialog box._
 - When a dialog box is open, it can be closed by hitting the <key>Escape</key> key.

Even if it isn't specified anywhere, it is expected for a dialog box to contain an interactive element to close it. It is usually either, a regular "close" button at the bottom of the dialog box, or a graphic button (like a cross) in one of the upper corner of the dialog box.

### Focus management

A dialog box is a focus trap, which means:

 - When a dialob box is open, it gains the focus.
 - When a dialog box is open, all focus changed are trapped inside the dialog box. In other words, it is not possible to give the focus to something outside the dialog box until it is closed.
 - When a dialog box is closed, the element that has the focus before it is open regain the focus.


## Implementations

We currently provide implementations for:

  - [Raw HTML/JS](../../html/dialog/README.md)

We also provide [a basic set of styles](../../styles/dialog/README.md) to be used as a basis for more refine design work:

  - [Raw CSS](../../styles/dialog/dialog.css)
