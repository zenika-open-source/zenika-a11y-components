import { dom, log, tick } from '../_lib/utils.js'
import { trapFocus, releaseFocus } from '../_lib/focus.js'

// We can have only one dialog box open at a given time
let OPEN_DIALOG = null

// MAIN API -------------------------------------------------------------------

/** Class providing the API to manage a dialog box */
export default class Dialog {
  /**
   * Create a dialog box API for the given node
   * @param {Element} node
   */
  constructor(node) {
    this.node = node
    this.node.setAttribute('role', 'dialog')
    this.node.setAttribute('aria-modal', 'true')
    this.node.classList.add(Dialog.DIALOG_CLASS_ROOT)

    if (!dom.$cls(Dialog.DIALOG_CLASS_MAIN, this.node)) {
      const main = dom.html`<section class="${Dialog.DIALOG_CLASS_MAIN}"></section>`
      this.node.childNodes.forEach((child) => main.append(child))
      this.node.append(main)
    }

    if (
      !this.node.getAttribute('aria-label')
      && !this.node.getAttribute('aria-labelledby')
    ) {
      log.error`
        Dialog box MUST have an accessible label.
        Please provide one with ${'aria-label'} or ${'aria-labelledby'}.`
    }
  }

  /**
   * Open the dialog box
   * @returns {Promise<Dialog>}
   */
  async open() {
    if (!document.body.contains(this.node)) {
      throw new Error('The dialog box is no longer par of the document')
    }

    await Dialog.close()
    this.node.classList.add(Dialog.DIALOG_CLASS_OPEN)
    trapFocus(this.node)
    OPEN_DIALOG = this

    // Safari needs an explicite tick to properly reflow the dialog display
    await tick()

    return this
  }

  /**
   * Close the dialog box (if it is the one open)
   * @returns {Promise<Dialog>}
   */
  async close() {
    if (Dialog.getOpen() === this) {
      await Dialog.close()
    }

    return this
  }

  /**
   * Close any open dialog box
   * @returns {Promise}
   */
  static async close() {
    if (OPEN_DIALOG) {
      OPEN_DIALOG.node.classList.remove(Dialog.DIALOG_CLASS_OPEN)
      releaseFocus(OPEN_DIALOG.node)
      OPEN_DIALOG = null
    }

    // Safari needs an explicite tick to properly reflow the dialog display
    await tick()
  }

  /**
   * Provide access to the Dialog instance of the current open dialog box
   * @returns {(Dialog|null)}
   */
  static getOpen() {
    return OPEN_DIALOG
  }
}

/**
 * The name of the CSS class that identify a dialog box.
 * @type {string}
 */
Dialog.DIALOG_CLASS_ROOT = 'dialog'

/**
 * The name of the CSS class that indicates a dialog is open.
 * @type {string}
 */
Dialog.DIALOG_CLASS_OPEN = 'dialog--open'

/**
 * The name of the CSS class that identify the main area of the dialog box.
 * @type {string}
 */
Dialog.DIALOG_CLASS_MAIN = 'dialog__main'

/**
 * The name of the CSS class that identify the content of the dialog box.
 * @type {string}
 */
Dialog.DIALOG_CLASS_CONTENT = 'dialog__content'

// Let's make sure that "Escape" close any open dialog
document.addEventListener('keyup', (evt) => {
  if (evt.key === 'Escape') {
    Dialog.close()
  }
})
