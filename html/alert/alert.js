import { dom, ready, tick } from '../_lib/utils.js'
import Dialog from '../dialog/dialog.js'

export class Alert {
  constructor(node) {
    this.node = node
    this.node.setAttribute('role', 'alert')
    this.node.classList.add(Alert.ALERT_CLASS_ROOT)
  }

  /**
   * Open the alert box
   *
   * Remember that screen readers will present an alert in two cases:
   *  - It has some content and its display is changed from `none` to something else
   *  - It is already displayed but its content changes
   *
   * @param {string} [message] The (HTML) content of the alert to present to the user
   * @returns {Promise<Alert>}
   */
  async open(message) {
    // Some screen readers do not present the alert if it is
    // displayed before the DOMContentLoaded event
    await ready

    if (typeof message === 'string') {
      this.node.innerHTML = message
    }

    if (message instanceof Node) {
      this.node.appendChild(message)
    }

    this.node.classList.add(Alert.ALERT_CLASS_OPEN)

    await tick()
    return this
  }

  /**
   * Close the alert box
   *
   * By default we remove the alert box children from the DOM. This is a
   * convinent way to let author use the `[role="alert"]:empty` pseudo-class
   * to deal with the alert display. Hover, for performance reason we suggest
   * to keep the DOM content and rather use the `Alert.ALERT_CLASS_OPEN` CSS
   * class to deal with the alert display.
   *
   * Be carful that clearing out the alert content won't be notify to the user,
   * regardless of the alert display state.
   *
   * @param {boolean} [keepContent]
   *   Indicate if the alert box content should be kept in the DOM (default: false)
   * @returns {Promise<Alert>}
   */
  async close(keepContent = false) {
    this.node.classList.remove(Alert.ALERT_CLASS_OPEN)

    if (!keepContent) {
      this.node.innerHTML = ''
    }

    await tick()
    return this
  }

  /**
   * The name of the CSS class that identify an alert.
   * @type {string}
   */
  static ALERT_CLASS_ROOT = 'alert'

  /**
   * The name of the CSS class that indicates an alert is open.
   * @type {string}
   */
  static ALERT_CLASS_OPEN = 'alert--open'
}

export class AlertNotification extends Alert {
  constructor(node) {
    super(node)

    this.node.classList.add(AlertNotification.ALERT_CLASS_ROOT)
  }

  /**
   * The name of the CSS class that identify an alert.
   * @type {string}
   */
  static ALERT_CLASS_ROOT = 'alert--notification'
}

export class AlertDialog extends Dialog {
  constructor(node) {
    super(node)

    this.node.setAttribute('role', 'alertdialog')
    this.node.classList.add(AlertDialog.DIALOG_CLASS_ROOT)

    const mainNode = dom.$cls(Dialog.DIALOG_CLASS_MAIN, this.node)
    mainNode.classList.add(AlertDialog.DIALOG_CLASS_MAIN)

    this.contentNode = dom.$cls(Dialog.DIALOG_CLASS_CONTENT, mainNode)

    if (!this.contentNode) {
      this.contentNode = (dom.html`<div class="${Dialog.DIALOG_CLASS_CONTENT}"></div>`).firstElementChild
      mainNode.prepend(this.contentNode)
    }

    this.node.setAttribute('aria-describedby', dom.id(this.contentNode))
  }

  /**
   * Open the alert dialog box
   * @param {string} [message] The (HTML) content of the alert to present to the user
   * @returns {Promise<Alert>}
   */
  async open(message) {
    // Some screen readers do not present the alert if it is
    // displayed before the DOMContentLoaded event
    await ready

    if (typeof message === 'string') {
      this.contentNode.innerHTML = message
    }

    if (message instanceof Node) {
      this.contentNode.appendChild(message)
    }

    await super.open()
    return this
  }

  /**
   * Close the dialog box (if it is the one open)
   * @param {boolean} [keepContent]
   *   Indicate if the alert dialog content should be kept in the DOM (default: false)
   * @returns {Promise<AlertDialog>}
   */
  async close(keepContent = false) {
    if (Dialog.getOpen() === this) {
      await AlertDialog.close(keepContent)
    }

    return this
  }

  /**
   * Close any open dialog box
   * @param {boolean} [keepContent]
   *   Indicate if the alert dialog content should be kept in the DOM (default: false)
   * @returns {Promise}
   */
  static async close(keepContent = false) {
    const dialog = Dialog.getOpen()

    await Dialog.close()

    if (!keepContent) {
      if (dialog instanceof AlertDialog) {
        dialog.contentNode.innerHTML = ''
      }
    }
  }

  /**
   * The name of the CSS class that identify an alert dialog box.
   * @type {string}
   */
  static DIALOG_CLASS_ROOT = 'dialog--alert'

  /**
   * The name of the CSS class that identify the main area of the dialog box.
   * @type {string}
   */
  static DIALOG_CLASS_MAIN = 'dialog__main--alert'
}
