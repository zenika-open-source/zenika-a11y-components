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
