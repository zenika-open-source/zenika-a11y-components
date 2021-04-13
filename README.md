# Welcome to zenika-a11y-components 👋
<!-- ![Version](https://img.shields.io/badge/version-0.0.0-blue.svg?cacheSeconds=2592000) -->
<!-- [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#) -->

> The Zenika A11Y Component project provide a very basic and versatile design toolkit that can fit in any project. It put accessibility and usability first and is a perfect starting point to build up more complex design systems or to fit into existing ones.


## Why this project

At Zenika we have the opportunity to work on many different environments and we are often confront to the same requests and issues. When it comes to front-end development, the diversity of technical environments and functional requirements is extreme. Because of that, we have a unique perspective and some knowledge to share. Through this project we intent to centralize our knowledge by creating **a simple design toolkit** that contain all _our best practices regarding web design and front-end development_.

It is a simple way to make sure that the good work we are doing with a given framework or tool can be replicated with another one without reinventing the wheel each time. It's also a good way to normalize and document all our best practices regarding the development and the design of UI component. To some extend _it's a form of a knowledge base dedicated to our future colleagues and the whole web community_.

For all of our components we intent to :
 - Document their functional and technical requirements.
 - Design them in a way that allow to use them as a standalone design system or as a companionship to any existing design systems.
 - Implement them for as many framework as possible.
 - Ensure that their are fully compliant to WCAG 2.1 AA out of the box.
 - Test them extensively (including real-life screen reader usage).

This design toolkit is a foundational work made to demonstrate Zenika exceptional skills regarding web design and front-end development.


## Source of inspiration

### Technical baseline

- [ARIA Practices 1.1](https://www.w3.org/TR/wai-aria-practices-1.1/)
- https://a11ysupport.io/


### Similar projects

- [Headless UI](https://headlessui.dev/)
- [Scott O'Hara's Accessible Components](https://github.com/scottaohara/accessible_components)
- [Inclusive Components](https://inclusive-components.design/)
- [BBC GEL](https://bbc.github.io/gel/)
- [Deque Code Library](https://dequeuniversity.com/library/)
- [A11Y Style Guide](https://a11y-style-guide.com/style-guide/)
- [eBay MIND Patterns](http://ebay.github.io/mindpatterns/)


### Articles worth reading

- [Building an Accessibility Library](https://medium.com/indeed-design/building-an-accessibility-library-e134e9012c17), by Stephanie Hagadorn.
- [Design Systems Trends and Best Practices](https://www.netguru.com/blog/key-design-systems-trends-and-best-practices), by Adam Zielonko.
- [Translating Design Wireframes Into Accessible HTML/CSS](https://www.smashingmagazine.com/2020/07/design-wireframes-accessible-html-css/), by Harris Schneiderman,
- [Weaving Web Accessibility With Usability](https://www.smashingmagazine.com/2020/11/weaving-web-accessibility-usability/), by Uri Paz
- [Good, Better, Best: Untangling The Complex World Of Accessible Patterns](https://www.smashingmagazine.com/2021/03/good-better-best-untangling-complex-world-accessible-patterns/), by Carie Fisher
- [Designing for Screen Reader Compatibility](https://webaim.org/techniques/screenreader/), by WebAIM
- [Getting Started with Web Accessibility in Vue](https://medium.com/@emilymears/getting-started-with-web-accessibility-in-vue-17e2c4ea0842), by Emily Mears


### Noticeable design systems

- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Google's Material](https://material.io/) (and their [accessibility guidelines](https://material.io/design/usability/accessibility.html#understanding-accessibility))
- [Salesforce's Lightning](https://www.lightningdesignsystem.com/) (and their [accessibility guidelines](https://www.lightningdesignsystem.com/accessibility/overview/))
- [GitHub's Primer](https://primer.style/) (and their [accessibility guidelines](https://primer.style/design/accessibility/accessibility-at-github))
- [Ant Design](https://ant.design/)
- [Clarity](https://clarity.design)
- [Atlassian Design](https://atlassian.design/) (and their [accessibility guidelines](https://atlassian.design/foundations/accessibility))
- [Microsoft's Fluent UI](https://www.microsoft.com/design/fluent/#/web)
- [IBM's Carbon](https://www.carbondesignsystem.com/) (and their [accessibility guidelines](https://www.carbondesignsystem.com/guidelines/accessibility/overview/))
- [Auth0's Cosmos](https://auth0-cosmos.vercel.app/#/)
- [Shopify's Polaris](https://polaris.shopify.com/) (and their [accessibility guidelines](https://polaris.shopify.com/foundations/accessibility))
- [UK Government Design System](https://design-system.service.gov.uk/)
- [US Government Design System](https://designsystem.digital.gov/)
- [French Government Design System](https://gouvfr.atlassian.net/wiki/spaces/DB/overview?homepageId=145359476)


### Tools

- **CSS tools and frameworks**
  - [Bootstrap](https://getbootstrap.com/)
  - [Pure.css](https://purecss.io/)
  - [Foundation](https://get.foundation/)
  - [Bulma](https://bulma.io/)
  - [Tailwind CSS](https://tailwindcss.com/)
  - Pré-processor: [Sass](https://sass-lang.com/), [Stylus](https://stylus-lang.com/), [LESS](http://lesscss.org/).
  - Other tools: [PostCSS](https://postcss.org/), [Styled Components](https://styled-components.com), [JSS](https://cssinjs.org)
- **JS libs and frameworks**
  - [React](https://reactjs.org/) and their [accessibility guideline](https://reactjs.org/docs/accessibility.html)
    - [Reach UI](https://reach.tech/)
    - [Chakra UI](https://chakra-ui.com/)
    - [Reakit](https://reakit.io/)
  - [VueJS](https://vuejs.org/)
    - [vuetensils](https://vuetensils.stegosource.com/)
  - [Angular](https://angular.io/) and their [accessibility guideline](https://angular.io/guide/accessibility)
  - [Svelte](https://svelte.dev/)
  - [Ember](https://emberjs.com/) and their [accessibility guidelines](https://guides.emberjs.com/release/accessibility/)
  - [ELM](https://elm-lang.org/)
  - [LitElement](https://lit-element.polymer-project.org/) ([Polymer](https://www.polymer-project.org/))
  - [AMP](https://amp.dev/)
- **A11Y Linter and testing tools**
  - [Axe core](https://github.com/dequelabs/axe-core)
    - [Jest Axe](https://github.com/nickcolley/jest-axe)
  - [WAVE](https://wave.webaim.org/)
  - [ARC](https://www.tpgi.com/arc-platform/api/)
  - [Codelyzer](http://codelyzer.com/) (_TypeScript, Angular_)
  - [HTML CodeSniffer](http://squizlabs.github.io/HTML_CodeSniffer/)
  - [eslint-plugin-jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y) (_JSX, React_)
  - [eslint-plugin-lit-a11y](https://github.com/open-wc/open-wc/tree/master/packages/eslint-plugin-lit-a11y) (_Web Components, Polymer, Lit-HTML_)
  - [stylelint-a11y](https://github.com/YozhikM/stylelint-a11y)
  - [@storybook/addon-a11y](https://www.npmjs.com/package/@storybook/addon-a11y) ([StoryBook](https://storybook.js.org/))
