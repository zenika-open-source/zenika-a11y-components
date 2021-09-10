import css from '../css.js'
import { tick, wait } from './timming.js'

const MAX_TRANSITION_DURATION = 1000 // 1s
const MIN_TRANSITION_DURATION = 10 // 0.01s

// UTILS ------------------------------------------------------------------------------------------
function awaitTransition(node, timeout = 1000) {
  return Promise.race([
    wait(timeout),
    new Promise((done) => (
      node.addEventListener('transitionend', done, { once: true })
    ))
  ])
}

function isIntersecting(node, target = null) {
  return new Promise((done) => {
    if (
      node === document.documentElement // We consider the root element to be always intersecting
      || node === document.body // We consider the body to be always intersecting
    ) {
      done(true)
      return
    }

    const observer = new IntersectionObserver((entries) => {
      observer.unobserve(node)
      done(entries[0].intersectionRatio > 0.8) // Must "see" 80% of the element to be true
    }, { root: target })
    observer.observe(node)
  })
}

// MAIN API ---------------------------------------------------------------------------------------

/**
 * @typedef {object} ShouldBeVisibleReason
 * @property {boolean} isInDocumentBody
 *   An element can only be visible if it is part of the document body.
 *   An element inside a document fragment can't be visible.
 * @property {boolean} isDisplayed
 *   An element can be visible only if its CSS `display` property is different than `none`
 * @property {boolean} isVisible
 *   An element can be visible only if its CSS `visibility` property is different than `hidden`
 * @property {boolean} isOpaque
 *   An element can be visible only if its CSS `opacity` property is greater than `0`
 * @property {boolean} isWideEnough
 *   An element can be visible only if computed bounding box width is greater than `0`
 * @property {boolean} isHighEnough
 *   An element can be visible only if computed bounding box height is greater than `0`
 * @property {boolean} isInViewport
 *   An element can only be visible if it's inside the viewport (at least 80% of it)
 * @property {boolean} isInParentVisibleScrollingArea
 *   An element can only be visible if it's in the visible part of
 *   the scrolling area of all its parents (at least 80% of it)
 * @property {boolean} isInsideDisplayedParent
 *   An element can be visible only if all its parents are themselves displayed
 * @property {boolean} isInsideVisibleParent
 *   An element can be visible only if all its parents are themselves visible
 * @property {boolean} isInsideOpaqueParent
 *   An element can be visible only if all its parents are themselves opaque
 * @property {boolean} isInsideWideEnoughParent
 *   An element can be visible only if all its parents are themselves wide enough
 * @property {boolean} isInsideHighEnoughParent
 *   An element can be visible only if all its parents are themselves high enough
 */

/**
 * Check if the provided node should be visible
 *
 * Note this is only a hint, not an absolute certainty. Even if we check for
 * the obvious reason a DOM node should be visible, some weird CSS properties
 * combination can fully hide the element.
 *
 * @param {Element} node The DOM node we want to check for audibility
 * @returns {Promise<[boolean, ShouldBeVisibleReason]>}
 */
export async function shouldBeVisible(node) {
  const isInDocumentBody = document.body.contains(node)

  const style = window.getComputedStyle(node)
  const rect  = node.getBoundingClientRect()
  const isDisplayed  = style.display !== 'none'
  const isVisible    = style.visibility !== 'hidden'
  const isOpaque     = style.opacity > 0
  const isWideEnough = rect.width > 0
  const isHighEnough = rect.height > 0
  const isInViewport = await isIntersecting(node)

  let parent = node.parentNode
  let isInParentVisibleScrollingArea = await isIntersecting(node, parent)

  let isInsideDisplayedParent  = true
  let isInsideVisibleParent    = true
  let isInsideOpaqueParent     = true
  let isInsideWideEnoughParent = true
  let isInsideHighEnoughParent = true

  while (parent && parent instanceof Element) {
    const parentStyle = window.getComputedStyle(node)
    const parentRect  = node.getBoundingClientRect()

    isInsideDisplayedParent  = isInsideDisplayedParent  && parentStyle.display !== 'none'
    isInsideVisibleParent    = isInsideVisibleParent    && parentStyle.visibility !== 'hidden'
    isInsideOpaqueParent     = isInsideOpaqueParent     && parentStyle.opacity > 0
    isInsideWideEnoughParent = isInsideWideEnoughParent && parentRect.width > 0
    isInsideHighEnoughParent = isInsideHighEnoughParent && parentRect.height > 0
    isInParentVisibleScrollingArea
      =  isInParentVisibleScrollingArea
      && await isIntersecting(parent, parent.parentNode)

    parent = parent.parentNode

    // It can be expensive to walk up the parent tree so
    // we release the JS event loop on a regular basis
    await tick()
  }

  return [
    (
      isInDocumentBody
      && isDisplayed
      && isVisible
      && isOpaque
      && isWideEnough
      && isHighEnough
      && isInViewport
      && isInsideDisplayedParent
      && isInsideVisibleParent
      && isInsideOpaqueParent
      && isInsideWideEnoughParent
      && isInsideHighEnoughParent
      && isInParentVisibleScrollingArea
    ), {
      isInDocumentBody,
      isDisplayed,
      isVisible,
      isOpaque,
      isWideEnough,
      isHighEnough,
      isInViewport,
      isInsideDisplayedParent,
      isInsideVisibleParent,
      isInsideOpaqueParent,
      isInsideWideEnoughParent,
      isInsideHighEnoughParent,
      isInParentVisibleScrollingArea
    }
  ]
}

/**
 * @typedef {object} ShouldBeAudibleReason
 * @property {boolean} isInDocumentBody
 *   An element can only be audible if it is part of the document body.
 *   An element inside a document fragment shouldn't be audible.
 * @property {boolean} isNotAriaHidden
 *   An element with the `aria-hidden` attribute is **NOT** audible,
 *   so it shouldn't have that attribute to be audible.
 * @property {boolean} isNotHidden
 *   An element with the `hidden` attribute should NOT be audible,
 *   so it shouldn't have that attribute to be audible.
 * @property {boolean} isPerceivable
 *   An element is perceivable from an audio standpoint if it isn't
 *   hard hidden with CSS, which mean that at minimum its `display`
 *   style is not `none` and its `visibility` style is not `hidden`.
 * @property {boolean} isNotInsideAriaHiddenParent
 *   An element inside a parent with the `aria-hidden` attribute
 *   is NOT audible, so **NO** parent node up to the top of the DOM tree
 *   should have the `aria-hidden` attribute
 * @property {boolean} isNotInsideHiddenParent
 *   An element inside a parent with the `hidden` attribute should NOT
 *   be audible, so **NO** parent node up to the top of the DOM tree
 *   should have the `hidden` attribute
 * @property {boolean} isInsidePerceivableParent
 *   An element is perceivable from an audio standpoint if it isn't
 *   inside a parent that is hard hidden with CSS, which mean that at
 *   minimum all parent up to the top of the DOM tree have a `display`
 *   style that is not `none` and a `visibility` style that is not `hidden`.
 */

/**
 * Check if the provided node should be audible
 *
 * Note this is only a hint, not an absolute certainty. Even if we check for the
 * obvious reason a DOM node should not be audible, each browser/screenreader
 * combination as unique behaviors that can be hard to spot and we can end up in
 * cases that we could think a node is audible but it isn't in practice or vice versa.
 *
 * @param {Element} node The DOM node we want to check for audibility
 * @returns {Promise<[boolean, ShouldBeAudibleReason]>}
 */
export async function shouldBeAudible(node) {
  const isInDocumentBody = document.body.contains(node)
  const isNotAriaHidden = !node.getAttribute('aria-hidden')
  const isNotHidden = !node.getAttribute('hidden')

  const style = window.getComputedStyle(node)
  const isPerceivable
    =  style.display    !== 'none'
    && style.visibility !== 'hidden'

  let isNotInsideAriaHiddenParent = true
  let isNotInsideHiddenParent = true
  let isInsidePerceivableParent = true

  let parent = node.parentNode

  while (parent && parent instanceof Element) {
    const parentStyle = window.getComputedStyle(parent)
    isInsidePerceivableParent
      =  isInsidePerceivableParent
      && parentStyle.display !== 'none'
      && parentStyle.visibility !== 'hidden'

    isNotInsideAriaHiddenParent
      =  isNotInsideAriaHiddenParent
      && !parent.matches('[aria-hidden]')

    isNotInsideHiddenParent
      =  isNotInsideHiddenParent
      && !parent.matches('[hidden]')

    parent = parent.parentNode

    // It can be expensive to walk up the parent tree so
    // we release the JS event loop on a regular basis
    await tick()
  }

  return [
    (
      isInDocumentBody
      && isNotAriaHidden
      && isNotHidden
      && isPerceivable
      && isNotInsideAriaHiddenParent
      && isNotInsideHiddenParent
      && isInsidePerceivableParent
    ), {
      isInDocumentBody,
      isNotAriaHidden,
      isNotHidden,
      isPerceivable,
      isNotInsideAriaHiddenParent,
      isNotInsideHiddenParent,
      isInsidePerceivableParent
    }
  ]
}

/**
 * @typedef {object} ShowOptions
 * @property {string} [softHideClassName]
 *   Define a custom name for the CSS class representing the soft hide state.
 *   By default we use the css.HIDE class, but it can be useful to walk the
 *   whole show process to deal with different custom soft hide states.
 * @property {string} [className]
 *   A class name that represent a specific visible state. This class name
 *   is set just before the `softHideClassName` to be removed from the element,
 *   this allow to ensure that CSS transition are define and run ASAP.
 * @property {boolean|number} [transition]
 *   Indicate if we must wait for a transition (true) or how long we must
 *   wait before resolving the show process. When set to `true` we are
 *   waiting up to 1s for a `transitionend` event on the node before resolving
 *   the show process. When set to a number greater than 10, we wait for the first
 *   to happen: a `transitionend` event on the element or the number of milliseconds
 *   provided. By default, we do not wait for any transition and the show process
 *   is resolved as soon as attributes and classNames are set properly.
 */

/**
 * show a DOM element
 *
 * @param {Element} node
 * @param {ShowOptions} options
 * @returns {Promise}
 */
export async function show(node, options = {}) {
  const softHideClassName = options.softHideClassName || css.HIDE

  // hard hide, we need to transition to soft hide first
  if (node.hidden) {
    node.classList.add(softHideClassName) // Just to be sure its here
    node.hidden = false
    node.removeAttribute('aria-hidden')
    await tick()
  }

  // soft hide, let's make it visible
  if (node.classList.contains(softHideClassName)) {
    // Custom "visible" class name
    if (options.className) {
      node.classList.add(options.className)
    }

    node.classList.remove(softHideClassName)

    if (options.transition) {
      await awaitTransition(
        node,
        options.transition > 1 ? options.transition : MAX_TRANSITION_DURATION
      )
    }
  }
}

/**
 * Synchronously set DOM state reflecting a show final state
 *
 * @param {Element} node
 * @param {ShowOptions} options
 */
show.setImmediateShowState = (node, options = {}) => {
  node.hidden = false
  node.removeAttribute('aria-hidden')
  node.classList.remove(options.softHideClassName || css.HIDE)

  if (options.className) {
    node.classList.add(options.className)
  }
}

/**
 * @typedef {object} HideOptions
 * @property {boolean} [soft]
 *   When set to `true`, we stop the hide process in the soft hide state
 * @property {string} [softHideClassName]
 *   Define a custom name for the CSS class representing the soft hide state.
 *   By default we use the css.HIDE class, but it can be useful to walk the
 *   whole hide process to deal with different custom soft hide states.
 * @property {boolean|number} [transition]
 *   Indicate if we must wait for a transition (true) or how long we must
 *   wait before transitioning the hide process from soft to hard. When
 *   set to `true` we are waiting up to 1s for a `transtionend` event on
 *   the node before moving to hard hide. When set to a number greater than 10,
 *   we wait for the first to happen: a transitionend event on the element
 *   or the number of milliseconds provided. By default, we do not wait for
 *   any transition and the hide process move from soft to hide immediately.
 *   NOTE: If soft is set to true and transition is defined, the hide process
 *   will resolved once the transition is completed.
 */

/** hide a DOM element
 * @param {Element} node
 * @param {HideOptions} options
 * @returns {Promise}
 */
export async function hide(node, options = {}) {
  node.classList.add(options.softHideClassName || css.HIDE)
  await tick()

  if (options.transition) {
    const timeout = Math.max(Number(options.transition) || 0, 0)
    await awaitTransition(
      node,
      timeout > MIN_TRANSITION_DURATION ? timeout : MAX_TRANSITION_DURATION
    )
  }

  if (options.soft) {
    return
  }

  node.setAttribute('aria-hidden', true)
  node.hidden = true
  await tick() // Browser reflow is forced before resolving the process
}

/**
 * Synchronously set DOM state reflecting a hide final state
 *
 * @param {Element} node
 * @param {HideOptions} options
 */
hide.setImmediateHideState = (node, options = {}) => {
  if (!options.soft) {
    node.hidden = true
    node.setAttribute('aria-hidden', true)
  }

  node.classList.add(options.softHideClassName || css.HIDE)
}
