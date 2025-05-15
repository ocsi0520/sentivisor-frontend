# Content

Content unit is the part that
- extracts the content of the website
- based on the [analyzer](./worker-unit.md#analyzer)'s evaluation and on the [supervision mode](./shared-unit.md#supervisionmode) it changes the website's content

## Extraction

First of all we used a very naive approach for the first iteration, namely we considered all websites as [non-mutable and static](./worker-unit.md#the-naive-approach-for-analyzing-websites).

The implementation of extraction reflected this approach: `document.body.innerText`.
Why did we choose innerText and not textContent?
For that [read this first](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent#differences_from_innertext).

To put it in a nutshell, we wanted to extract only those texts which are visible for the user.

### Guard-clauses for extraction

Before we even try to extract anything from the website, we need to check [whether we can parse](../src/content/content.ts?plane1#L35) the website:
- is the website [blacklisted](./shared-unit.md#blackliststorage)?
- has the user given [consent](./consent-unit.md) to the data collection?
- is the [supervision mode off](./shared-unit.md#supervisionmode)?
- is the language that the website uses [supported by the extension](./shared-unit.md#miscellaneous)?

## Changing the content based on the evaluation