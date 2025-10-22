
export type TabInfo = { tabId: number; windowId: number; };

export type TabActivatedEvent = {
  message?: never;
  response: void;
};

export type GetTabInfoEvent = {
  message?: never;
  response: TabInfo;
};
