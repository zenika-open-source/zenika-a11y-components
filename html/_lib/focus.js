// Focus trap state -----------------------------------------------------------
let FOCUS_TRAP = null
let FOCUS_DIRECTION = 'first'

// Get focus direction out of keyboard events ---------------------------------
document.addEventListener('keydown', (e) => e.key === 'Tab'
  && (FOCUS_DIRECTION = (e.shiftKey && 'last') || 'first'))
document.addEventListener('keyup', (e) => e.key === 'Tab'
  && (FOCUS_DIRECTION = 'first'))

// Utils ----------------------------------------------------------------------
/** Try to focus a child on a given node.
 *
 * @param {HTMLElement} node
 *   The parent where to focus a child
 * @param {`first`|`last`} firstOrLast
 *   The child to focus, either the first or the last focusable one
 * @returns {boolean}
 */
function focusChild(node, firstOrLast) {
  const children = Array.from(node.children)

  if (firstOrLast === 'last') {
    children.reverse()
  }

  return children.some((child) => (
    child.focus()
    || document.activeElement === child
    || focusChild(child, firstOrLast)
  ))
}

// Main API -------------------------------------------------------------------
/** Release the focus from the current trap
 * @param {boolean} restoreOriginalFocus
 */
export function release(restoreOriginalFocus) {
  FOCUS_TRAP?.release(restoreOriginalFocus)
}

/** Trap the focus inside a given node
 *
 * @param {HTMLElement} node The node where to trap the focus
 */
export function trap(node) {
  if (FOCUS_TRAP) {
    throw new Error('The focus is already trapped, you must release it first')
  }

  const originalFocus = document.activeElement
  const originalTabIndex = node.tabIndex
  node.tabIndex = 0
  node.focus()

  const focusin = (e) => (
    !node.contains(e.target)
    && (focusChild(node, FOCUS_DIRECTION) || node.focus())
  )

  document.addEventListener('focus', focusin, true)

  FOCUS_TRAP = {
    release(restoreOriginalFocus) {
      node.tabIndex = originalTabIndex
      document.removeEventListener('focus', focusin, true)

      if (restoreOriginalFocus) {
        originalFocus.focus()
      }

      FOCUS_TRAP = null
    }
  }
}
