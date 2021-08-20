/* eslint-disable new-cap */
/* global process */
import playwright  from 'playwright'
import { AfterAll, After, BeforeAll, Before }  from '@cucumber/cucumber'

const browserOptions = {
  slowMo: 0,
  args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'],
  firefoxUserPrefs: {
    'media.navigator.streams.fake': true,
    'media.navigator.permission.disabled': true,
  },
}

let browser

BeforeAll(async () => {
  browser = await playwright[process.env.BROWSER || 'firefox'].launch(browserOptions)
})

Before(async function startContext() {
  this.context = await browser.newContext({})
  this.page = await this.context.newPage()
})

After(async function endContext() {
  await this.page?.close()
  await this.context?.close()
})

AfterAll(async () => {
  await browser.close()
})
