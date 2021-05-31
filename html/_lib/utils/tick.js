/**
 * Wait for a full run of the event loop
 *
 * Some browser, like Safari, can require a full run of the event loop to
 * update (reflow or repaint) the page, which can be necessary to perform
 * some effects like transitionning a CSS value after a change of an element
 * display property.
 */
export const tick = () => new Promise(setTimeout)
