(async () => {
  const src = chrome.runtime.getURL("assets/content.js");
  await import(src);
})();
