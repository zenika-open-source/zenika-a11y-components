/**
 * A simple Promise that wait for document readyness.
 *
 * Because JS module are defered, we need to be carefule and wait for
 * `DOMContentLoaded` to be fired before accessing the DOM.
 */
export const ready = new Promise((resolve) => {
  function isReady() {
    window.removeEventListener('DOMContentLoaded', isReady)
    resolve()
  }

  window.addEventListener('DOMContentLoaded', isReady)

  if (
    document.readyState === 'interactive'
    || document.readyState === 'complete'
  ) {
    isReady()
  }
})

/**
 * Wait for a full run of the event loop
 *
 * Some browser, like Safari, can require a full run of the event loop to
 * update (reflow or repaint) the page, which can be necessary to perform
 * some effects like transitionning a CSS value after a change of an element
 * display property.
 * @returns {Promise}
 */
export const tick = () => new Promise(requestAnimationFrame)

/**
 * Wait for roughly a given amount of milliseconds
 *
 * @param {number} ms The number of milliseconds to wait
 * @returns {Promise}
 */
export const wait = (ms) => new Promise((done) => setTimeout(done, ms))
