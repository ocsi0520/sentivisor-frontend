# Sentivisor Frontend

This is a currently on halt project which is most probably not going to be continued.
The aim was to create a chrome extension for [Sentivisor](https://sentivisor.com/).

Sentivisor is a product which constantly monitors your "daily dose of internet" and evaluates whether it's harmful for your mental health.
Personally speaking, this would be really advantageous at least for me, as I start my mornings with reading all kinds of news and finish my day with the same activity, and as a hobby I do it during my days as well 😅.

As a [browser extension](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions) the project consists of several parts.
- a reusable [shared](./docs/shared-unit.md) folder
- giving [consent](./docs/consent-unit.md)
- [side-panel](./docs/side-panel-unit.md) (which is basically the "options")
- [worker](./docs/worker-unit.md) (center/mediator of the application)
- [content](./docs/content-unit.md) (executor / DOM changer)

Each part is a standalone unit of the application (except the shared folder), therefore I made them as [separate typescript projects](https://www.typescriptlang.org/docs/handbook/project-references.html).

To get a grasp of the architecture, and understand why the units are made and separated like this, I recommend to read the [Anatomy of an extension](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Anatomy_of_a_WebExtension) article.

## Building

To build the application follow the [build guide](./docs/build-process/build-entire-app.md).
