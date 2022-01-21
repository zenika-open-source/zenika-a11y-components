/* global process */
import playwright  from 'playwright'
import { AfterAll, After, BeforeAll, Before }  from '@cucumber/cucumber'

// PLAYWRIGHT BROWSER LAUNCH CONFIGURATION ------------------------------------
// See: https://playwright.dev/docs/api/class-browsertype#browser-type-launch
const browserOptions = {
  slowMo: process.env.DEBUG ? 2500 : 0,
  headless: !process.env.DEBUG,
}

const firefoxOptions = {
  args: [
    '--use-fake-ui-for-media-stream',
    '--use-fake-device-for-media-stream'
  ],
  firefoxUserPrefs: {
    'media.navigator.streams.fake': true,
    'media.navigator.permission.disabled': true,
  },
}

// CUCUMBER HOOKS -------------------------------------------------------------
let browser

BeforeAll(async () => {
  const navigator = process.env.BROWSER || 'firefox'
  const isFirefox = navigator === 'firefox'

  browser = await playwright[navigator].launch({
    ...browserOptions,
    ...(isFirefox && firefoxOptions)
  })
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
