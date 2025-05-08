/// <reference lib="DOM" />
export const dispatchDispose = (eventSource: EventTarget): void => {
  const disposeEvent = new Event("dispose", {
    bubbles: true,
    cancelable: false,
    composed: true,
  });
  eventSource.dispatchEvent(disposeEvent);
};

export const getDisposeDispatcher = (): ((event: Event) => void) => {
  return (event: Event) => {
    if (!event.target) throw new Error("no event source");
    dispatchDispose(event.target);
  };
};
