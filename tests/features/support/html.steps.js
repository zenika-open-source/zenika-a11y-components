import { Given, When, Then } from '@cucumber/cucumber'
import { expect } from '@playwright/test'

// UTILS ----------------------------------------------------------------------
async function loadDialogPage() {
  await this.page.goto(`http://localhost:8888/tests/features/support/html/dialog.html`)
  await this.page.waitForLoadState('load')
}

// STEPS Definition -----------------------------------------------------------
async function setAButtonToOpenADialog() {
  this.button = this.page.locator('button.openDialog1').first()
}

async function setAButtonToOpenAnotherDialog() {
  this.button = this.page.locator('[role="dialog"] button.openDialog2')
}

async function setAnElementWithFocus() {
  this.button = this.page.locator('a.openDialog1')
  await this.button.focus()
  await expect(this.button).toBeFocused()
}

async function setOpenDialogAfterFocus() {
  await this.button.press('Enter')
  this.dialog = this.page.locator('[role="dialog"]').first()
  await expect(this.dialog).toBeVisible()
  await expect(this.dialog).toBeFocused()
}

async function setAnOpenDialog() {
  await this.page.click('button.openDialog1')

  this.dialog = await this.page.locator('[role="dialog"]').first()
  await expect(this.dialog).toBeVisible()
}

async function activateTheButton() {
  await this.button.click()
}

async function activateItsCloseButton() {
  await this.dialog.locator('button.closeDialog').click()
}

async function pressKey(key) {
  await this.page.press('body', key)
}

async function isDialogClosed() {
  await expect(this.dialog).toBeHidden()
  await expect(this.dialog).toHaveCSS('display', 'none')
}

async function isADialogOpen() {
  this.dialog = await this.page.locator('[role="dialog"]').first()
  await expect(this.dialog).toBeVisible()
}

async function isDialogFocused() {
  await expect(this.dialog).toBeFocused()
}

async function isDialogReadable() {
  await expect(this.dialog).toHaveAttribute('role', 'dialog')
  await expect(this.dialog).toHaveAttribute('aria-modal', 'true')
  await expect(this.dialog).toHaveAttribute('aria-label', /.+/)
}

async function isADifferentDialogOpen() {
  this.dialog = this.page.locator('[role="dialog"]').nth(1)
  await expect(this.dialog).toBeVisible()
}

async function isButtonFocused() {
  await expect(this.button).toBeFocused()
}

// GHERKIN Binding ------------------------------------------------------------
Given('a page with some dialog boxes',                loadDialogPage)
Given('a button that open a Dialog box',              setAButtonToOpenADialog)
Given('an open Dialog box',                           setAnOpenDialog)
Given('an element that had the focus',                setAnElementWithFocus)
Given('a button that open another Dialog box',        setAButtonToOpenAnotherDialog)
Given('an open Dialog box, which now have the focus', setOpenDialogAfterFocus)

When('I activate the button',        activateTheButton)
When('I activate its close button',  activateItsCloseButton)
When('I hit the {string} key',       pressKey)
When('I close the Dialog box',       activateItsCloseButton)

Then('a Dialog box is open',                         isADialogOpen)
Then('the( open) Dialog box is closed',              isDialogClosed)
Then('the element regain the focus',                 isButtonFocused)
Then('the Dialog box has the focus',                 isDialogFocused)
Then('the Dialog box is readable by screen readers', isDialogReadable)
Then('a different Dialog box is open',               isADifferentDialogOpen)
