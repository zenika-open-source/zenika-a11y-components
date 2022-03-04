# Running tests

All Tests are simply run with the command:

```bash
npm test
```

However you can be a little more fine grain with the following commands:

```bash
# Run linter only
npm run test:lint

# Run unit/integration tests only
npm run test:unit

# Run end-to-end tests only
npm run test:e2e
```

## Writing end to end scenarios

End to end tests are defined using the [Gherkin language](https://cucumber.io/docs/gherkin/reference/) inside `*.feature` files (within the `tests/features` folder)

Under the hood we use [CucumberJS](https://github.com/cucumber/cucumber-js/#readme) to run the tests and we use [Playwright](https://playwright.dev/docs/intro) to perform real browser interaction.

If you need to create new steps, you must set them inside a `tests/features/support/*.steps.js` file.

We currently have two steps file:

 - `generic.steps.js` for all reusable steps, no matter the implementation of the components.
 - `html.steps.js` craft for testing components, assuming a raw HTML/JS implementation.

In the future we expect to have more steps files, at least one for each framework we want to support.

## Writing tests with JEST

Writing tests for any JS code has to be made with [Jest](https://jestjs.io)

We added a few extensions to Jest to makes our life easier

 - [`jest-extended`](https://github.com/jest-community/jest-extended#readme) to have more nicer matchers
 - [`jest-dom`](https://github.com/testing-library/jest-dom#readme) and [`user-event`](https://testing-library.com/docs/ecosystem-user-event) to make testing of DOM stuff easier
 - [`jest-axe`](https://github.com/nickcolley/jest-axe#readme) because we obviously want to check for minimal accessibility requirements on our components

That said, [we are using Jest in ESM mode](https://jestjs.io/docs/ecmascript-modules) which requires to be careful as it requires some tweaking to work smoothly. Basically if you want to access the `jest` object in your test files you need to import it manually:

```js
import { jest } from '@jest/globals'
```

For both `user-event` and `jest-axe` the import isn't straightforward (_because building tools yada yada…_) so you need to do a two step import:

```js
import jestAxe from 'jest-axe'
import userEvent from 'user-event'

const { axe, configureAxe } = jestAxe // toHaveNoViolations is already set
const {
  clear, click, deselectOptions, dbClick, hover, keyboard,
  past, selectOptions, tab, type, unhover, upload
} = userEvent.default
```
