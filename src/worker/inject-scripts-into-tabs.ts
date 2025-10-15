type ContentScript = NonNullable<
  chrome.runtime.Manifest["content_scripts"]
>[number];

const injectScriptsIntoTab = async (
  tab: chrome.tabs.Tab,
  files: string[] | undefined
): Promise<void> => {
  if (!tab.id || !files) return;

  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files,
    });
    console.log("Injected into:", tab.url);
  } catch (err) {
    console.warn("Could not inject into", tab.url, err);
  }
};

const handleContentScript = async (
  aContentScript: ContentScript
): Promise<void> => {
  const matches = aContentScript.matches || [];
  const tabs = await chrome.tabs.query({ url: matches });

  for (const tab of tabs) {
    await injectScriptsIntoTab(tab, aContentScript.js);
  }
};

export const injectContentScriptIntoAlreadyOpenedPages =
  async (): Promise<void> => {
    const manifest = chrome.runtime.getManifest();
    const contentScripts = manifest.content_scripts || [];

    for (const contentScript of contentScripts) {
      handleContentScript(contentScript);
    }
  };
