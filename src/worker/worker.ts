import { MessageMediator } from "#shared/MessageMediator";
import { AnalyzableContent } from "#shared/messages/analyze";
import { DisplayableData, ErrorDisplayData } from "#shared/messages/display";
import { Analyzer } from "./Analyzer";
import { injectContentScriptIntoAlreadyOpenedPages } from "./inject-scripts-into-tabs";

const messageMediator = new MessageMediator();
const analyzer = new Analyzer();

const setupContextMenu = (): void => {
  chrome.contextMenus.create({
    id: "sentivisor",
    title: "Sentiment Analysis",
    contexts: ["page"],
  });
};

const openConsentPage = (): void => {
  chrome.tabs.create({
    url: chrome.runtime.getURL("src/consent/consent.html"),
  });
};

// Chrome bug workaround
chrome.runtime.onInstalled.addListener(async (details) => {
  // Retrieve extension information
  const extensionInfo = await chrome.management.getSelf();
  // Check if the URL contains 'sentivisor.com'
  // __QUESTION__ do we really need to check whether its our extension?
  //  I don't think anyway got onInstalled event for any other extension
  if (!extensionInfo.homepageUrl?.includes("sentivisor.com")) return;

  console.log("onInstalled triggered for Sentivisor extension.");

  await injectContentScriptIntoAlreadyOpenedPages();

  // Run only on installation, not on updates
  if (details.reason !== "install") return;
  openConsentPage();
  setupContextMenu();
});

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

const getAnalysis = async (
  analyzableContent: AnalyzableContent
): Promise<DisplayableData | ErrorDisplayData> => {
  try {
    const evaluation = await analyzer.analyze(analyzableContent);
    return { type: "displayable", emotionScores: evaluation };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    return { type: "error", errorMessage };
  }
};

// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessage#sending_an_asynchronous_response_using_sendresponse
// no async key on listeners
messageMediator.listen("analyze", (message, _sender, sendResponse) => {
  getAnalysis(message).then(sendResponse);
  return true;
});

messageMediator.listen("getTabInfo", (_message, sender, sendResponse) => {
  sendResponse({ tabId: sender.tab!.id!, windowId: sender.tab!.windowId });
});

messageMediator.listen("debug", (debugMessage, _sender, sendResponse) => {
  console.log("service worker:", debugMessage);
  new Promise((resolve) => setTimeout(resolve, 2_000)).then(() =>
    sendResponse("I got the message: " + debugMessage)
  );
  return true;
});
