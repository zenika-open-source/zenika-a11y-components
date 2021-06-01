/**
 * Retreive the ID of a DOM node
 *
 * If the DOM node doesn't have an ID, it is provided one an it is retruned
 *
 * @param {Element} node The node from wich we want an ID
 * @returns {string} The ID of the element
 */
export function id(node) {
  if (!(node instanceof Element)) {
    throw new Error(`Expect an Element, got ${node?.constructor?.name}`)
  }

  if (!node.id) {
    node.id
      = Math.floor((Math.random() * 26) + 10).toString(36)
      + Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(36)
  }

  return node.id
}

/**
 * Turn a template string into a DOM fragment or DOM node
 *
 * If the DocumentFragment contain only one Node, only the node is returned
 *
 * @returns {Node|DocumentFragment}
 */
export function html(strings, ...keys) {
  const str = strings.map((substr, i) => substr + (keys[i] || '')).join('')
  const fragment = document.createRange().createContextualFragment(str)
  return fragment.childNodes.length === 1 ? fragment.childNodes[0] : fragment
}

/**
 * Get the first node matching the given selector
 * @param {string} what The selector that should match an element
 * @param {Element} [where] The element that should contain the element we are looking for
 * @returns {Element|null}
 */
export function $(what, where = document.body) {
  return where.querySelector(what)
}

/**
 * Get all nodes matching the given selector
 * @param {string} what The selector that should match the elements
 * @param {Element} where The element that should contain the elements we are looking for
 * @returns {Array<Element>}
 */
export function $$(what, where = document.body) {
  return Array.from(where.querySelectorAll(what) || [])
}

/**
 * Get the element matching the given id
 * @param {string} who The id of the element we are looking for
 * @returns {Element|null}
 */
export function $id(who) {
  return document.getElementById(who)
}

/**
 * Get the first element carrying the given class name
 * @param {string} what The class that the element should carry
 * @param {Element} where The element that should contain the element we are looking for
 * @returns {Element|null}
 */
export function $cls(what, where = document.body) {
  return $$cls(what, where)[0] || null
}

/**
 * Get all the elements carrying the given class name
 * @param {string} what The class that the elements should carry
 * @param {Element} where The element that should contain the elements we are looking for
 * @returns {Array<Element>}
 */
export function $$cls(what, where = document.body) {
  return Array.from(where.getElementsByClassName(what) || [])
}
