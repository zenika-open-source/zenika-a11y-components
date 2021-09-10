/**
 * As much as possible we will use DOM native attributes to reflect the state of
 * our elements and CSS will use the attribute selector `[…]` to handle the
 * appropriate look and feel. However some special cases are easier to handle
 * through a simple class name:
 *
 *  - When no native attribute exist to express the element state
 *  - When no native attribute allows to express element semantic
 *
 * So in order to ease customization, those classes name will live in that centralized module
 *
 * @typedef {Object<string, string>} CSSClasses
 */
export default {
  /**
   * Necessary to express a "soft" hide (when an element is visually
   * hidden but still perceivable by screen reader). This is especially
   * useful when transitioning from a "hard" hide (`display:none`) to
   * a fully visible element
   *
   * Basically, to be fully accessible, a show/hide full sequence has to be:
   *
   * 1. The element isn't in the DOM
   * 2. The element is in the DOM, but is hidden "hard" (`display:none` or attribute `hidden`)
   * 3. The element is in the DOM, but is hidden "soft" (not visible, but readable by screenreaders)
   * 4. The element is in the DOM and visible
   *
   * If you want to apply a CSS transition it can only be done between step 3 and 4
   * so we need a dedicated CSS class to materialized step 3.
   *
   * @property {string}
   */
  HIDE: 'hidden',

  /**
   * An overlay element is something put on top of other content. There is no
   * normalized combination of attribute to identify such element so we use that
   * class name as a generic way to identify overlays.
   *
   * @property {string}
   */
  OVERLAY: 'overlay',

  /**
   * A dialogue box (`[role='dialog']`) is always put inside an overlay
   * that must be identified as such with this class name.
   *
   * @property {string}
   */
  DIALOG_OVERLAY: 'dialog'
}
