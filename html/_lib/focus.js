const FOCUS_TRAP = new WeakMap()

/**
 * Try to focus the first focusable children of a given node
 *
 * If the direction is set to `first` we try to focus the first children available down to the last
 * If the direction is set to `last` we try to focus the last children available up to the first
 *
 * If no children is focusable, return `false`.
 *
 * @param {HTMLElement} node The root node where we want to focus a children
 * @param {string} [direction] The direction to get the focus, either `first` (default) or `last`
 * @return {boolean}
 */
export function focusChild(node, direction = 'first') {
  console.log('looking:', direction)
  let children = Array.from(node.children)

  console.log(children[0])

  if (direction === 'last') {
    children = children.reverse()
  }

  console.log(children[0])


  for (let child of children) {
    child.focus()
    console.log(document.activeElement)
    if (document.activeElement === child) {
      return true
    } else if (focusChild(child, direction)) {
      return true
    }
  }

  return false;
}

/**
 * Lock the focus inside the given node (only children from that node can get the focus)
 * @param {HTMLElement} node
 */
export function trapFocus(node) {
  const data = {
    origin: document.activeElement,
    onfocusin(evt) {
      if (!node.contains(evt.target)) {
        if (evt.relatedTarget === node) {
          focusChild(node, 'last')
        } else {
          focusChild(node, 'first')
        }
      }
    }
  }

  FOCUS_TRAP.set(node, data)

  node.focus()
  document.addEventListener('focusin', data.onfocusin)
}

/**
 * Release a focus trap from the given node (the focus can now be set outside that node)
 * @param {HTMLElement} node
 */
export function releaseFocus(node) {
  if (!FOCUS_TRAP.has(node)) {
    return
  }

  const data = FOCUS_TRAP.get(node)

  document.removeEventListener('focusin', data.onfocusin)

  if (data.origin) {
    data.origin.focus()
  }

  FOCUS_TRAP.delete(node)
}
