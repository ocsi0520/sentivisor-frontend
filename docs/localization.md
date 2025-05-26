# Localization

At first iteration we wanted to focus only on English, as this is one of the most widely spoken languages in the world, not to mention that is the language that we also know. 😁 \
However, we wanted to make it easy to add more languages later.

## Side Panel Localization

For [side panel](./side-panel-unit.md) we used Lit's [i18n](https://lit.dev/docs/localization/overview/) system, which is the most straightforward approach.

It's worth to note that in order to build the application, first we need to generate the localization files for the side panel. You can find the instructions in the [build guide](./build-process/build-entire-app.md#missing-localization-files).

It's also good to know that **we used [runtime mode](https://lit.dev/docs/localization/overview/#runtime-mode)**, meaning the user can switch between languages at runtime, and it will be reflected in the side panel.

The opposite would be [transform mode](https://lit.dev/docs/localization/overview/#transform-mode), where the strings are replaced at build time. For each localized component for each locale a separate *.js* file is generated. As a result in order to switch between languages, the user [would need to reload](https://lit.dev/docs/localization/transform-mode/#switching-locales) the entire page, and load the new locale's scripts.

## Other Units Localization

Nevertheless, for [consent](./consent-unit.md) and [content](./content-unit.md) units the choice was not that trivial.

Currently for consent there's no localization in place.

For content we used a [custom string replacement solution](../src/content/Supervisor/content-intervene/translation/TemplateStringTranslator.ts). Obviously ugly, technical debt, but - the usual excuse - we were short on time, and this was the quickest solution to implement.

There are also some unanswered questions, like how do we:
- share the common phrases between units?
- ensure that the user can switch between languages at runtime and it will be reflected in all units?
- enforce to have the same available languages in all units on type-level? There are two sources of truth: [allowed-languages.ts](../src/shared/allowed-languages.ts) as shared and [lit-localize.json](../src/SidePanel/lit-localize.json) for side panel. *lit-localize.json* is the source of truth for generating the localization files for side panel, but as it belongs to lit, it can't be used in the other units. On the other hand it is the entry point for the side panel's i18n system.

To answer these questions, we would have needed more time for investigation and implementation.
Nonetheless, I found the built-in i18n system of [WebExtensions](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Internationalization) to be a good candidate for the solution.
