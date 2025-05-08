export type Mutable<T> = {
  -readonly [Key in keyof T]: T[Key];
};

export const getActiveTab = async (): Promise<chrome.tabs.Tab> => {
  const [activeTab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  return activeTab;
};
