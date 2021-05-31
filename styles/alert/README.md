# Alert

An alert is an information that is brought to the attention of the user. It doesn't necessary interrupt the user workflow but it is assertive enough to make sure the information is passed to the user immediately. A good example of that is a network notification or a form validation error.

If the information should impact the user workflow, the alert can put the user workflow on hold until the user acknowledge the alert. In that case it is usually materialize as an alert dialog box (which is more assertive than a regular dialog box.)

## Basic design

From a design stand point, there is very few rules to design an alert. As long as it is well perceived by the user (at minimum, visually speaking, it must be set inside the current user viewport), almost everything works. That said we can see three kind of patterns regarding alerts:


### In-flow alert

An in-flow alert is usually a block of text, put right in the flow of content and highlight in some ways. The most common example for such alerts are form errors.

From a design point of view such alert must be handle in the way that maximize user awareness, which requires to provide a design that stand out from the current design and makes sure that the alert is in a position where the user will perceive it at the right time. For that last part the question is: Does the alert must be put in the next part of the user flow or in the previous part. It highly depends on the nature of the alert but as a rule of thumb, if the alert is of little consequences (meaning, the user can miss it without any consequences) it is safe to put it in the previous part of the flow. On the other hand, if the alert provide an information that must be perceived or act upon, it is necessary to put it in the next part of the flow.

For example, form errors must be act upon, so alert can be positioned in two places (not exclusive, both can be done at the same time):

 - Each individual error is put right after the field in error (usually when the error is catch in real time) so that the error is immediately perceived and the user is given a chance to immediately correct the error.
 - All error are summarized at the top of the form (usually when the error are checked at submit time, which will allow the user to go through the form to correct all the errors). In that case, makes sure the alert is in the viewport (carful with long forms), if its not the case, you should double it with a local individual error or give it the focus.

> **Note:** _Remember that [error must be highlighted with more than just color](https://www.w3.org/WAI/WCAG21/Techniques/failures/F81). It is considered best practice to identified alert box with some text (such text can be visualy replaced by an icon). From a technical point of view, alert can have an accessible label to be provided to Screen Readers, feel free to make that label visual._


### Out-of-flow alert

An out-of-flow alert is usually something resulting of an event occurring outside of the user flow. The most common example for such alerts are network notification.

It is usually a box put in the top-right corner of the viewport (_top-left in <abbr title="Right To Left">RTL</abbr> layout_), layering over the page content. If there aren't any hard constrain to design such a box, there are a few points to take into consideration:

 - Makes sure that the box positioning do not interfere with the user current workflow underneath. This could require to handle alternative design or positioning.
 - Makes sure to handle how multiple boxes will stack if many out-of-flow alert pop at the same time or aren't dismissed by the user (_remember, that [time based dismissal can be an accessibility issue](https://www.w3.org/WAI/WCAG21/Understanding/timing-adjustable.html)_ so its best to avoid it). Careful to not forget about how the user will interact with such stack.


### Modal alert box

From a design stand point a Modal Alert Box is the same beast as a regular [Dialog boxes](../dialog/README.md). However, as they're are meant to interrupt the user workflow, they usually had a slightly different design to highlight them from regular Dialog boxes.

In most cases, those Modal Alert Boxes are used to ask something to the user, or to highlight something that can disrupt the user workflow. Because of that it is key to carefully design the way you want the user to acknowledge the alert (the alert content, including some buttons to validate or cancel the alert).


## CSS

In our implementation, we define three kind of alert design:

  1. `.alert` is our basic inline design;
  2. `.alert--notification` is the extra modifier for notification (a notification will carry both `.alert` and `.alert--notification`)
  3. `.dialog--alert` is the extra modifier class set to any Alert [Dialog box](../dialog/README.md) (in addition to other dialog classes) and `.dialog__main--alert` is the extra modifier class set to the main container of the Alert Dialog box.

> **Note:** _We are not getting into that level of details (yet), but feel free to build up sub-categories for your alert if you wish. Stuff like `.alert--important`, `.alert--warning`, `.alert--info`, `.alert--notification--compact`, etc._


```css
:root {
  /* We use CSS custom properties to ease customizing our alert boxes.
     But you should simply overload the `.alert`, `.alert--notifiation` and
     `.dialog__main--alert` selectors in your own style sheet. */
  --alert-border: 1px solid #900; /* a dark red line */
  --alert-background: #EF0000;    /* light pink */
  --alert-position-start: 1rem;   /* Vertical positionning */
  --alert-position-end: 1rem;     /* Horizontal positionning */
}

/* IN FLOW ALERT ----------------------------------------------------------- */

.alert {
  display: none;

  border: var(--alert-border);
  background: var(--alert-background);
}

.alert--open {
  /* Open alert default to a regular blocks, feel free
    to overload this for any type of display that suits your needs */
  display: block;
}

/* OUT OF FLOW ALERT ------------------------------------------------------- */

.alert--notification {
  /* An alert notification box must be position on top of the content and
     in the viewport, regardeless of the scroll position of the main page */
  position: absolute;

  /* We Assume LTR content by default. In this case,
     our notification is put in the top-right corner of the viewport */
  top: var(--alert-position-start);
  right: var(--alert-position-end);
}

[dir="rtl"] .alert--notification {
  /* If the notifiation is displayed in an RTL environment,
     the notification is put in the top-left corner of the viewport */
  left: var(--alert-position-end);
  right: auto;
}

/* ALERT DIALOG BOX -------------------------------------------------------- */

.dialog__main--alert {
  /* We extend the style of regular Dialog box with the specificity of
     Alert Dialog boxes.*/
  border: var(--alert-border);
  background: var(--alert-background);
}
```


## Special effects

Some effects (such as a smooth transition when the alert display is changed) can require some extra CSS class to be done. As usual with CSS, feel free to be creative. The easiest way to deal with that is to use the JavaScript API to add some extra CSS class on the alert element.

```js
new AlertNotification(node).open().then((alert) => {
  // When this class is set, we are sure that the browser has performed
  // a reflow after the change of display state for the dialog box. This
  // is necessary to let us transition properties if we wish to.
  node.classList.add('notificationIsOpen')

  // We bound the close behavior to the `transitionend` event, so that the
  // `alert--open` class will be removed only once the transition started
  // with the removal of `notificationIsOpen` is done.
  node.addEventListener('click', () => {
    node.addEventListener(
      'transitionend',
      () => alert.close(),
      { once: true }
    )

    node.classList.remove('notificationIsOpen')
  }, { once: true })
})
```

```css
.alert--notification {
  transform: translateX(110%);
  transition: transform 800ms;
}

.alert--notification.notificationIsOpen {
  /* The simplest way to create a slid-in/slide-out effect on notification */
  transform: translateX(0);
}
```
