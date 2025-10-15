export type Mutable<T> = {
  -readonly [Key in keyof T]: T[Key];
};

export const getActiveTab = async (
  tabs: typeof chrome.tabs
): Promise<chrome.tabs.Tab> => {
  const [activeTab] = await tabs.query({
    active: true,
    currentWindow: true,
  });
  return activeTab;
};

export type UsualTab = chrome.tabs.Tab & { id: number; url: `http${string}` };
export const isUsualTab = (tab: chrome.tabs.Tab): tab is UsualTab => {
  return (tab?.id != null && tab.url?.startsWith("http")) || false;
};
