# Side Panel Unit

This is the part where the user can change settings and set preferences, such as setting [supervision mode](./shared-unit.md#supervisionmode), alter [black list](./shared-unit.md#blackliststorage), [switch between themes](./shared-unit.md#themes-shared-across-ui-units). \
Currently this is the place of checking summary of the current website as well.

However, the summaries were planned to be moved to a separate [extension page](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Anatomy_of_a_WebExtension#extension_pages).

## Tech Stack

Some memo about the techs we used here, why we used them and why we didn't use them elsewhere.

### Lit

A not-well-known but robust library called [Lit](https://lit.dev/) is used for the side panel.
The reasons to use Lit are:
- **Lightweight**: 5 KB altogether.
- **Fast**: Basically it consists of wrappers for native browser APIs.
- **Flat learning curve**: No big magic behind. No [rendering engines](https://docs.angular.lat/guide/ivy), no [virtual DOM](https://legacy.reactjs.org/docs/faq-internals.html), no custom [fileformats](https://vuejs.org/guide/scaling-up/sfc.html) which need to have [custom plugins](https://vue-loader.vuejs.org/guide/#manual-setup) to be built, nothing.
- **Future-proof**: This is all I need to say: [Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components). \
  To elaborate on this a bit, a cite from Lit's landing page:
  > Web components work anywhere you use HTML, with any framework or none at all.
  
### Why no Lit elsewhere

Worker is excluded as it does not have any DOM-related tasks. \
Content is explained in its [own documentation](./content-unit.md#tech-stack) but to put it in a nutshell, we don't want to litter the visited website's content with extra packages (loading time + conflict). \
Consent is too small to import anything other than [MessageMediator](./shared-unit.md#messagemediator) and [ConsentStorage](./shared-unit.md#consentstorage).

### Dependency Injection: TSyringe

One of the things that I love about Angular is the [Dependency Injection](https://angular.dev/guide/di/dependency-injection) (DI) system.
Unfortunately their DI is not written in a reusable way.

However, I found a DI library which has similar API, and is supported by a big company as well. It is [TSyringe](https://github.com/microsoft/tsyringe) by Microsoft.

It's fully written in TypeScript, open-source & MIT-licensed, well documented. Perfectly compatible with Lit. So we didn't need anything else.

### Why no DI elsewhere

This is similar to the usage of Lit. Content - no littering, consent - too small. For worker actually we could use it and to tell you the truth, we should use it. The reason again: we didn't spend the time on it.

### Chart drawing with chart.js

[chart.js](https://www.chartjs.org/) wasn't picked by me. However, I believe it was a good choice. Fairly simple and documented.
We used [polar area chart](https://www.chartjs.org/docs/latest/samples/other-charts/polar-area.html) to [show the emotion scores](../src/SidePanel/side-panel/score-display/ChartProvider.ts?plane1#L62) of a website.

Worth to note that the chart must be explicitly updated every time:
- the [data changes](../src/SidePanel/side-panel/score-display/stv-score-display.ts?plane1#L67)
- the [theme changes](../src/SidePanel/side-panel/score-display/stv-score-display.ts?plane1#L67)
- the [locale changes](../src/SidePanel/side-panel/score-display/stv-score-display.ts?plane1#L77)

TODO:
- score-display
  - chart-drawer

### Localization

TODO

## Shared components across side panel

TODO