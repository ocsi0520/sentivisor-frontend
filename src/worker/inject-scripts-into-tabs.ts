const getAllMatchers = (): Array<string> => {
  const manifest = chrome.runtime.getManifest();
  const allJoinedMatchers = (manifest.content_scripts || [])
    .map((aContentScript) => aContentScript.matches || [])
    .reduce((sum, matchesArray) => [...sum, ...matchesArray], []);
  return Array.from(new Set(allJoinedMatchers));
};

export const injectContentScriptIntoAlreadyOpenedPages =
  async (): Promise<void> => {
    const tabs = await chrome.tabs.query({ url: getAllMatchers() });
    return Promise.all(tabs.map((tab) => chrome.tabs.reload(tab.id!))).then(
      () => {}
    );
  };
