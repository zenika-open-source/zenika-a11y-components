import { trapFocus, releaseFocus } from '../_lib/focus.js';

// We can have only one dialog box open at a given time
let OPEN_DIALOG = null;

// Safari needs an explicite tick to properly reflow the dialog display
const tick = () => new Promise(setTimeout);

// MAIN API -------------------------------------------------------------------

/** Class providing the API to manage a dialog box */
export default class Dialog {
  /**
   * Create a dialog box API for the given node
   * @param {HTMLElement} node
   */
  constructor(node) {
    this.node = node;
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
   * Close the dialog box
   * @returns {Promise<Dialog>}
   */
  async close() {
    await Dialog.close()

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

  /**
   * The name of the CSS class that indicates a dialog is open.
   * @type {string}
   */
  static DIALOG_CLASS_OPEN = 'dialog--open'
}

// Let's make sure that "Escape" close any open dialog
document.addEventListener('keyup', (evt) => {
  if (evt.key === 'Escape') {
    Dialog.close()
  }
})
