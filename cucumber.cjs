/* global module */
const formatOptions = {
  snippetInterface: 'async-await'
}

const format = `
  --format html:tests/report.html
  --format progress-bar
  --format-options '${JSON.stringify(formatOptions)}'
  --publish-quiet
`

module.exports = {
  default: `${format}`
}
