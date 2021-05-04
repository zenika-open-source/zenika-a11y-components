# Alert

An alert is an information that is brought to the attention of the user. It doesn't necessary interrupt the user workflow but it is assertive enough to make sure the information is passed to the user immediately. A good example of that is a network notification or a form validation error.

If the information should impact the user workflow, the alert can put the user workflow on hold until the user acknowledge the alert. In that case it is usually materialize as an alert dialog box (which is more assertive than a regular dialog box.)

## Design

Detail for the design of alert is available in the style [README.md](../../styles/alert/README.md)

An alert can be put anywhere in the DOM tree. However if the alert is related to a user action, it is best to include the alert as close as possible from where the user is interacting. Careful to not mess with the tab order or the predictability of the user action. Be cautious with the following WCAG success criteria:

- [1.3.2 Meaningful Sequence — Level A](https://www.w3.org/WAI/WCAG21/Understanding/meaningful-sequence.html)
- [2.4.3 Focus Order — Level A](https://www.w3.org/WAI/WCAG21/Understanding/focus-order.html)

Also be carful to not dismiss alert to fast. The user must have enough time to figure out the information of the alert. It is considered best practice to cancel out alert only on user interaction (avoid time based cancelation).

If the alert are not inline within the document but present as dialog box or notification pop-in, they MUST be inserted as a direct child of the `<body>` element (see [Dialog box](../dialog/README.md) for details).

## Structure

### Inline alert

```html
<div role="alert">
  <!-- Alert content must be set here -->
</div>
```

Specification for the use of ARIA attributes are defined in [WAI-ARIA Authoring Practices 1.2](https://w3c.github.io/aria-practices/#alert)

### Alert dialog

```html
<div role="alertdialog" class="dialog"
  aria-modal="true"
  aria-label="Alert"
  aria-describedby="foo"
  tabindex="0">

  <section class="dialog__main">
    <div id="foo" class="dialog__content">
      <!-- Alert content must be set here -->
    </div>

    <button class="dialog__close">Close the modal box</button>
  </section>
</div>
```

Alert dialog behave like a any [Dialog](../dialog/README.md) but it use the role `alertdialog` instead of `dialog`, and because it is more assertive it **MUST** define an `aria-describedby` attribute that refers to the alert message.

> **Note:** _Because the use of `aria-describedby` is so important, if you do not provide the id for the alert message content, the `AriaDialog` will generate a unique Id to handle the linking automatically (this can be convenient if you have multiple alert dialog boxes and that you don't want to deal with ids' uniqueness yourself). In the same logic, if the `.dialog__content` element doesn't exist, it will be created automatically and append as the first child of the main section._

Specification for the use of ARIA attributes are defined in [WAI-ARIA Authoring Practices 1.2](https://w3c.github.io/aria-practices/#alertdialog)

## Controls

JavaScript is used to control alert box in two ways:

 1. **Inline alert**
    For inline alert it's only a matter of opening and closing the box, which is nothing but toggle a CSS class on the alert DOM node. Also, the JS API provide a convenient way to directly inject some HTML content into the alert box itself and make sure that this content is presented to the user correctly (Some screen readers needs to hear the `DOMContentLoaded` event before presenting alert to the user).
 2. **Alert dialog**
    Alert dialog box behave exactly like a regular dialog, hence `AlertDialog` inherit from `Dialog`.

### API

 - `new Alert(HTMLElement: node)`: Create a new alert API for the given node.
 - `Alert::open(string: message): Promise<Alert>`: _Open_ the alert box (fill the content of the box with message, apply CSS class `alert--open`). The async API allows to apply some post open treatment (for example, to apply an open CSS effect to smoothly show the alert, very useful to animate notification layers)
 - `Alert::close(boolean: keepContent): Promise<Alert>`: _Close_ the alert box (remove the CSS class `alert--open`, remove the alert box content if the `keepContent` parameter isn't true). The async API allows to apply some post close treatment (for example, to remove the dialog box from the DOM)

 - `new AlertDialog(HTMLElement: node)`: Create a new alert dialog API for the given node.
 - `AlertDialog::open(string: message): Promise<AlertDialog>`: _Open_ the alert box (fill the content of the box with message, apply CSS class `dialog--open`, and trap the focus). The async API allows to apply some post open treatment (for example, to apply an open CSS effect to smoothly show the alert box)
 - `AlertDialog::close(boolean: keepContent): Promise<AlertDialog>`: _Close_ the alert box (remove the CSS class `dialog--open`, remove the alert box content if the `keepContent` parameter isn't true). The async API allows to apply some post close treatment (for example, to remove the dialog box from the DOM)
 - `AlertDialog.close(boolean: keepContent): Promise` close any open dialog and clear its content if it was an `AlertDialog` and `keepContent` was set to true.
