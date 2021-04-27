// Some useful selectors that can be adjusted to accomodate
// some other HTML markup and CSS class names.
const DIALOG_SELECTOR = 'body > div[role="dialog"][aria-modal="true"]'
const DIALOG_CLASS_OPEN = 'dialog--open'
const DIALOG_SELECTOR_LAST_BUTTON = '.dialog__actions > button:last-of-type'

// In memory storage for the last focus element before a modal is open
let previousFocusNode;

// Our trap focus helper
function trapFocus(evt) {
  const dialog = document.querySelector(`${DIALOG_SELECTOR}.${DIALOG_CLASS_OPEN}`);

  if (!dialog.contains(evt.target)) {
    evt.stopPropagation()
    evt.preventDefault()

    if (evt.relatedTarget === dialog) {
      // This is the simplest way to loop back to the last button of the modal
      // when the modal itself loose focus to something outside the modal
      dialog.querySelector(DIALOG_SELECTOR_LAST_BUTTON).focus()
    } else {
      dialog.focus()
    }
  }
}

// Let's make sure that "Escape" close any open dialog
document.addEventListener('keyup', (evt) => {
  if (evt.key === 'Escape') {
    const dialog = document.querySelector(`${DIALOG_SELECTOR}.${DIALOG_CLASS_OPEN}`)

    if (dialog) {
      close(dialog)
    }
  }
})

// MAIN API -------------------------------------------------------------------

/**
 * Close the modal handled by the provided node
 * @param {HTMLElement} node
 * @returns {Promise}
 */
export function close(node) {
  if (!node.matches(DIALOG_SELECTOR)) {
    throw new Error('This DOM node cannot be used as a dialog box')
  }

  node.classList.remove(DIALOG_CLASS_OPEN)

  document.removeEventListener('focusin', trapFocus)

  if (previousFocusNode) {
    previousFocusNode.focus();
    previousFocusNode = null;
  }

  // Safari needs an explicite tick to properly reflow the dialog display
  return new Promise(resolve => setTimeout(resolve, 0))
}

/**
 * Open the modal handled by the provided node
 * @param {HTMLElement} node
 * @returns {Promise}
 */
export function open (node) {
  if (!node.matches(DIALOG_SELECTOR)) {
    throw new Error('This DOM node cannot be used as a dialog box')
  }

  const dialog = document.querySelector(`${DIALOG_SELECTOR}.${DIALOG_CLASS_OPEN}`)

  // We must have only one dialog box open at the same time
  if (dialog) {
    close(dialog)
  }

  previousFocusNode = document.activeElement

  node.classList.add(DIALOG_CLASS_OPEN)
  node.focus()
  document.addEventListener('focusin', trapFocus)

  // Safari needs an explicite tick to properly reflow the dialog display
  return new Promise(resolve => setTimeout(resolve, 0))
}
