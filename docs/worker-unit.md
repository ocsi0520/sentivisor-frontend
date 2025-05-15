# Worker

Worker is the background part of the application.
This part is responsible for receiving the analyzable content, sending it to the backend and receiving the evaluation result, then broadcasting it to the content and side panel.

This part is also responsible for listening for tab changes and sending the signal to the content to parse the current website.

## Analyzer

[Analyzer](../src/worker/Analyzer.ts) is the class that is responsible for sending the analyzable content to the backend and receiving the evaluation result.

## A huge misconception: cache

We started with a naive concept: all websites are stable and static, meaning:
- when it's loaded, it has the full content already which won't change
- when we refresh or come back to it later, it will be the same \
  additional: cache is in-memory, meaning it's present until the browser is closed, \
  so we could still handle changes properly for not-so-volatile websites

We knew that this is false, but we wanted to tackle first classic websites and later on we could handle the more complex [SPAs](https://en.wikipedia.org/wiki/Single-page_application).


The thing is that even classic websites are not that stable and we can't use cache for them.
Even though it's - let's say a WordPress - classic website and not a SPA, it's still mutable at the time when the user is actively browsing.

Just consider that you have a blog website www.example-blog.com. You open this website 5 times in different tabs. It's definitely not guaranteed that meanwhile you are opening it for the 5th time you'll have the very same content (i.e. a blog was deleted or a new blog was published). Maybe 95% of the content will remain the same, but you still have 5% difference.

One of the biggest challenges in this project is to find out whether a piece of text is already analyzed or not. The cache implementation **is still in the code but it's absolutely wrong approach** and IMHO this information cannot be decided on the frontend side, especially not by the URL.
