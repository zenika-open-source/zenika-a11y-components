import css from '../_lib/css.js'
import { dom, log, hide } from '../_lib/utils.js'
import { trap, release } from '../_lib/focus.js'
import Overlay from '../_lib/components/Overlay.js'

// We can have only one dialog box open at a given time
/** @type {Dialog|null} */
let OPEN_DIALOG = null

// MAIN API -------------------------------------------------------------------

/** Class providing the API to manage a dialog box */
export default class Dialog extends Overlay {
  /** Create a dialog box API for the given node
   * @param {Element} node
   */
  constructor(node) {
    if (
      !node.getAttribute('aria-label')
      && !node.getAttribute('aria-labelledby')
    ) {
      // Should we throw ?
      log.error`
        Dialog box MUST have an accessible label.
        Please provide one with ${'aria-label'} or ${'aria-labelledby'}.`
    }

    super(dom.html`<div class="${css.DIALOG_OVERLAY}"></div>`)
    hide.setImmediateHideState(this.node) // sync hard hide, we are in a constructor

    this.dialog = node
    this.dialog.setAttribute('role', 'dialog')
    this.dialog.setAttribute('aria-modal', 'true')

    this.node.append(this.dialog)
    document.body.append(this.node)
  }

  /** Display the dialog box
   * @param {import('../_lib/utils.js').ShowOptions} [options]
   * @returns {Promise<Dialog>}
   */
  async show(options = {}) {
    await Dialog.close()
    await this.stickTo(window, { inbox: 'cover' })
    await super.show(options)
    trap(this.dialog)
    OPEN_DIALOG = this

    return this
  }

  /** Close the dialog box (if it is the one open)
   * @param {import('../_lib/utils.js').HideOptions} [options]
   * @returns {Promise<Dialog>}
   */
  async hide(options = {}) {
    if (Dialog.getOpen() === this) {
      release(true)
      await super.hide(options)
      OPEN_DIALOG = null
    }

    return this
  }

  /** Close any open dialog box
   * @param {import('../_lib/utils.js').HideOptions} [options]
   * @returns {Promise}
   */
  static async close(options = {}) {
    await Dialog.getOpen()?.hide(options)
  }

  /** Provide access to the Dialog instance of the current open dialog box
   * @returns {Dialog|null}
   */
  static getOpen() {
    return OPEN_DIALOG
  }
}

// Let's make sure that "Escape" close any open dialog
document.addEventListener('keyup', (evt) => {
  if (evt.key === 'Escape') {
    Dialog.close()
  }
})
