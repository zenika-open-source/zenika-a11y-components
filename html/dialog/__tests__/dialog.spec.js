import { jest } from '@jest/globals' // https://jestjs.io/docs/ecmascript-modules
import jestAxe from 'jest-axe'
import userEvent from '@testing-library/user-event'
import { tick } from '../../_lib/utils'
import Dialog from '../dialog'

const event = userEvent.default
const { axe } = jestAxe
jest.spyOn(console, 'error').mockImplementation(() => {})

describe('Dialog', () => {
  let node

  beforeEach(() => {
    document.body.innerHTML = `
      <div aria-label="A nice label for testing">
        <strong>Will move</strong> into an overlay
      </div>`

    node = document.body.firstElementChild
  })

  test('new Dialog(node) // With NO aria-label', () => {
    node.removeAttribute('aria-label')
    const dialog = new Dialog(node)

    expect(dialog).toBeInstanceOf(Dialog)
    expect(dialog.dialog).toBe(node)
    expect(dialog.node).toMatchSnapshot()

    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('Dialog box MUST have an accessible label'),
      expect.anything(),
      expect.anything(),
      expect.anything(),
      expect.anything()
    )
  })

  test('new Dialog(node[aria-label])', async () => {
    const dialog = new Dialog(node)

    expect(dialog).toBeInstanceOf(Dialog)
    expect(dialog.node).toMatchSnapshot()
    expect(await axe(node)).toHaveNoViolations()
    expect(await axe(dialog.node)).toHaveNoViolations()
  })

  test('Dialog::show()', async () => {
    const dialog = new Dialog(node)
    await dialog.show()

    expect(dialog.node).toMatchSnapshot()
    expect(await axe(node)).toHaveNoViolations()
    expect(await axe(dialog.node)).toHaveNoViolations()
  })

  test('Dialog::hide()', async () => {
    const dialog = new Dialog(node)
    await dialog.show()
    await dialog.hide()

    expect(dialog.node).toMatchSnapshot()
    expect(await axe(node)).toHaveNoViolations()
    expect(await axe(dialog.node)).toHaveNoViolations()
  })

  test('Dialog.close()', async () => {
    const dialog = new Dialog(node)
    await dialog.show()
    await Dialog.close()

    expect(dialog.node).toMatchSnapshot()
    expect(await axe(node)).toHaveNoViolations()
    expect(await axe(dialog.node)).toHaveNoViolations()
  })

  test('Dialog.getOpen()', async () => {
    expect(Dialog.getOpen()).toBe(null)

    const dialog = new Dialog(node)
    await dialog.show()

    expect(Dialog.getOpen()).toBe(dialog)

    await dialog.hide()

    expect(Dialog.getOpen()).toBe(null)
  })

  test('Keyboard ESC close dialog boxes', async () => {
    const dialog = new Dialog(node)
    await dialog.show()

    event.keyboard('{esc}')
    await tick()

    expect(dialog.node).toMatchSnapshot()
    expect(await axe(node)).toHaveNoViolations()
    expect(await axe(dialog.node)).toHaveNoViolations()
  })
})
