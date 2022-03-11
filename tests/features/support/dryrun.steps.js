import assert from 'assert'
import { Given, Then } from '@cucumber/cucumber'

Given('I access the {string} homepage', async function access(folder) {
  await this.page.goto(`http://localhost:8888/tests/${folder}`)
  await this.page.waitForLoadState('load')
})

Then('I see the homepage', async function checkHomePagee() {
  const title = await this.page.$eval('title', (node) => node.textContent)

  assert.ok(title)
})
