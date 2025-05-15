# Content

Content unit is the part that
- extracts the content of the website
- based on the [analyzer](./worker-unit.md#analyzer)'s evaluation and on the [supervision mode](./shared-unit.md#supervisionmode) it might change the website's content

## Extraction

First of all we used a very naive approach for the first iteration, namely we considered all websites as [immutable and static](./worker-unit.md#the-naive-approach-for-analyzing-websites).

The implementation of extraction reflected this approach: `document.body.innerText`.
Why did we choose innerText and not textContent?
For that [read this first](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent#differences_from_innertext).

To put it in a nutshell, we wanted to extract only those texts which are visible for the user:
- in the viewport
- not hidden by CSS, JS or html attribute

### Guard-clauses for extraction

Before we even try to extract anything from the website, we need to check [whether we can parse](../src/content/content.ts?plane1#L35) the website:
- Is the website [blacklisted](./shared-unit.md#blackliststorage)?
- Has the user given [consent](./consent-unit.md) to the data collection?
- Is the [supervision mode off](./shared-unit.md#supervisionmode)?
- Is the language that the website uses [supported by the extension](./shared-unit.md#miscellaneous)?

## Action based on the evaluation

The action consists of two steps.
First we need to consider whether the website is harmful or not. If it is, then we need to decide what to do with it.

### Consultant

A [consultant](../src/content/Consultant/Consultant.ts) is responsible for deciding whether the website is harmful or not based on the evaluation of the website.

The consultant later on can be affected by the user's preferences, but currently we only have a [DefaultConsultant](../src/content/Consultant/DefaultConsultant.ts).

### Supervisor

[Supervisor](../src/content/Supervisor/Supervisor.ts) is the one who receives the information from the consultant and acts based on it.

With the [SupervisionMode](./shared-unit.md#supervisionmode) the user can select the type of act one needs.
- [NoActSupervisor](../src/content/Supervisor/NoActSupervisor.ts) - does not do anything
- [InterveneSupervisor](../src/content/Supervisor/content-intervene/InterveneSupervisor.ts) - in some way intervenes in the website's content
  - It can inform the user with a simple emoji
  - It can block the website with a modal with the possibility to dismiss the modal
  - It can block the website with a modal without the possibility to dismiss the modal

The injected DOM from the InterveneSupervisor is encapsulated in [shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM), so it does not affect the website's original content.