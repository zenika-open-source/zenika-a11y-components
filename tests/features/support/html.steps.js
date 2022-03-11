import { Given, When, Then } from '@cucumber/cucumber'
import { expect } from '@playwright/test'

// GIVEN STEPS ----------------------------------------------------------------
async function setDialogPage() {
  await this.page.goto(`http://localhost:8888/tests/features/support/html/dialog.html`)
  await this.page.waitForLoadState('load')
}

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

// WHEN STEPS -----------------------------------------------------------------
async function activateTheButton() {
  await this.button.click()
}

async function activateItsCloseButton() {
  await this.dialog.locator('button.closeDialog').click()
}

async function pressKey(key) {
  await this.page.press('body', key)
}

async function circleFocusInDialog(key) {
  let inner
  let outer
  this.focusOutsideDialog = false

  do {
    await this.page.press('body', key)
    ;[outer, inner] = await this.dialog.evaluate((node) => {
      return [
        node === document.activeElement || document.body === document.activeElement,
        node.contains(document.activeElement),
      ]
    })
    this.focusOutsideDialog = !outer && !inner
  } while (outer === false && this.focusOutsideDialog === false)
}

async function giveFocusOutsideDialog() {
  this.button = await this.page.locator('button.openDialog1').first()
  await this.button.evaluate((node) => node.focus())
}

// THEN STEPS -----------------------------------------------------------------
async function isDialogClosed() {
  const dialogContainer  = this.dialog.locator('..')
  await expect(dialogContainer).toBeHidden()
  await expect(dialogContainer).toHaveCSS('display', 'none')
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

async function isFocusInsideDialog() {
  expect(this.focusOutsideDialog).toBe(false)
}

// GHERKIN Binding ------------------------------------------------------------
Given('a page with some dialog boxes',               setDialogPage)
Given('a button that open a Dialog box',             setAButtonToOpenADialog)
Given('an open Dialog box',                          setAnOpenDialog)
Given('an element that had the focus',               setAnElementWithFocus)
Given('a button that open another Dialog box',       setAButtonToOpenAnotherDialog)
Given('an open Dialog box, which now has the focus', setOpenDialogAfterFocus)

When('I activate the button',                        activateTheButton)
When('I activate its closing button',                activateItsCloseButton)
When('I hit the {string} key',                       pressKey)
When('I close the Dialog box',                       activateItsCloseButton)
When('I circle through the focusable elements with the {string} key', circleFocusInDialog)
When('I try to give the focus to an element outside the Dialog box',  giveFocusOutsideDialog)

Then('a Dialog box is opened',                       isADialogOpen)
Then('the( open) Dialog box is closed',              isDialogClosed)
Then('the element regain the focus',                 isButtonFocused)
Then('the Dialog box has the focus',                 isDialogFocused)
Then('the Dialog box is readable by screen readers', isDialogReadable)
Then('a different Dialog box is opened',             isADifferentDialogOpen)
Then('the focus is always inside the Dialog box',    isFocusInsideDialog)
Then('the focus remain unchanged',                   isDialogFocused)
