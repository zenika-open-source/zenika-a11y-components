const highlight = [
  'font: italic 1em monospace',
  'background: #00000018',
  'padding: .1em .2em',
  'border-radius: .3em'
].join(';')

export function format(strings, ...keys) {
  return [
    strings.map((s, i) => [s, keys[i]]).flat().join('%c').trim().replace(/\n */g,'\n'),
    ...Array(keys.length).fill([highlight, '']).flat()
  ]
}

export function log(...args) {
  console.log(...format(...args))
}

log.error = (...args) => console.error(...format(...args));
log.warn = (...args) => console.warn(...format(...args));
log.info = (...args) => console.info(...format(...args));
