import { MessageMap } from "./messages";

type ACallback<EventName extends keyof MessageMap> = (
  message: MessageMap[EventName]["message"],
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: MessageMap[EventName]["response"]) => void
) => void;

type GeneralListener = (
  message: any,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
) => void;

type WrappedMessage<EventName extends keyof MessageMap> = {
  eventName: EventName;
  messageContent: MessageMap[EventName]["message"];
};

export type Unsubscribe = () => void;

export class MessageMediator {
  public listen<EventName extends keyof MessageMap>(
    eventName: EventName,
    cb: ACallback<EventName>
  ): Unsubscribe {
    const cbWithWrappedFilter: GeneralListener = (
      message,
      sender,
      sendResponse
    ) => {
      const parsedMessage: WrappedMessage<EventName> = JSON.parse(message);
      if (parsedMessage.eventName === eventName)
        cb(parsedMessage.messageContent, sender, sendResponse);
    };
    chrome.runtime.onMessage.addListener(cbWithWrappedFilter);

    return () => chrome.runtime.onMessage.removeListener(cbWithWrappedFilter);
  }

  // TODO: tabId should be the first but still optional
  // this needs to be done with overloading
  public send<EventName extends keyof MessageMap>(
    eventName: EventName,
    message: MessageMap[EventName]["message"],
    tabId?: number
  ): Promise<MessageMap[EventName]["response"]> {
    const wrappedMessage: WrappedMessage<EventName> = {
      eventName: eventName,
      messageContent: message,
    };
    const sendableData = JSON.stringify(wrappedMessage);
    if (tabId === undefined) return chrome.runtime.sendMessage(sendableData);
    else return chrome.tabs.sendMessage(tabId, sendableData);
  }
}
