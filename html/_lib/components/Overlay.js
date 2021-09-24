import css from '../css.js'
import { tick, show, hide } from '../utils.js'

/**
 * @typedef {object} OverlayPosition
 * @property {`left`|`right`|`center`} [horizontal]
 *   The positionning of the overlay on the x-axis.
 * @property {`top`|`bottom`|`center`} [vertical]
 *   The positionning of the overlay on the y-axis.
 * @property {`outer`|`inner`|`cover`} [inbox]
 *   The insidness of positionning. If `cover`, the overlay will cover the
 *   entire target node, regardless of `horizontal` and `vertical` position
 */

export default class Overlay {
  /** Create a new Overlay manager
   * @param {HTMLElement} node The DOM node to be used as an overlay
   */
  constructor(node) {
    this.node = node
    this.node.classList.add(css.OVERLAY)
  }

  /** Position the overlay relative to the target node
   *
   * @param {Element|Document|Window} targetNode The target node to compute the position
   * @param {OverlayPosition} position The positionning definition
   */
  async stickTo(targetNode, position) {
    const box = targetNode?.getBoundingClientRect?.() || {
      x: 0,
      y: 0,
      width: window.innerWidth,
      height: window.innerHeight,
    }

    // Time to do some computation
    const isRight  = position.horizontal === 'right'
    const isCenter = position.horizontal === 'center'
    const isLeft   = !isRight && !isCenter  // Default value
    const isBottom = position.vertical   === 'bottom'
    const isMiddle = position.vertical   === 'center'
    const isTop    = !isBottom && !isMiddle // Default value
    const isInner  = position.inbox      === 'inner'
    const isCover  = position.inbox      === 'cover'
    const isOuter  = !isInner && !isCover   // Default value

    let x = box.x
    if (isMiddle && !isCover) { x += Math.round((box.width - this.width) / 2) }
    else if (isRight && isInner) { x += box.width - this.width }
    else if (isRight && isOuter) { x += box.width }
    else if (isLeft  && isOuter) { x -= this.width }

    let y = box.y
    if (isCenter && !isCover) { y += Math.round((box.height - this.height) / 2) }
    else if (isBottom && isInner) { y += box.height - this.height }
    else if (isBottom && isOuter) { y += box.height }
    else if (isTop    && isOuter) { y -= this.height }

    // Prepare browser next reflow
    this.isFixed = true
    this.x = x
    this.y = y

    if (isCover) {
      this.width = box.width
      this.height = box.height
    }

    await tick() // await reflow
  }

  /** Indicate the type of positionning
   * @type {boolean}
   */
  get isFixed() { return window.getComputedStyle(this.node).position === 'fixed' }
  set isFixed(value) {
    if (value === 'auto') {
      this.node.style.position = ''
    }

    this.node.style.position = (value && 'fixed') || 'absolute'
  }

  /** Get/Set the overlay x position (in pixels)
   * @type {number}
   */
  get x() { return parseFloat(window.getComputedStyle(this.node).left) || 0 }
  set x(value) {
    this.node.style.left = Number.isNaN(Number(value))
      ? ''
      : `${Math.max(0, value)}px`
  }

  /** Get/Set the overlay y position (in pixels)
   * @type {number}
   */
  get y() { return parseFloat(window.getComputedStyle(this.node).top) || 0 }
  set y(value) {
    this.node.style.top = Number.isNaN(Number(value))
      ? ''
      : `${Math.max(0, value)}px`
  }

  /** Get/Set the overlay width (in pixels)
   * @type {number}
   */
  get width() { return parseFloat(window.getComputedStyle(this.node).width) || 0 }
  set width(value) {
    this.node.style.width = Number.isNaN(Number(value))
      ? ''
      : `${Math.max(0, value)}px`
  }

  /** Get/Set the overlay height (in pixels)
   * @type {number}
   */
  get height() { return parseFloat(window.getComputedStyle(this.node).height) || 0 }
  set height(value) {
    this.node.style.height = Number.isNaN(Number(value))
      ? ''
      : `${Math.max(0, value)}px`
  }

  /** Show the overlay
   * @param {import('../utils/visibility.js').ShowOptions} [options]
   */
  async show(options = {}) {
    await show(this.node, options)
  }

  /** Hide the overlay
   * @param {import('../utils/visibility.js').HideOptions} [options]
   */
  async hide(options = {}) {
    await hide(this.node, options)
  }
}
