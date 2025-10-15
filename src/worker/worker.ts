import { MessageMediator } from "#shared/MessageMediator";
import { DisplayableData, ErrorDisplayData } from "#shared/messages";
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

messageMediator.listen("analyze", async (message, _sender, sendResponse) => {
  let displayData: DisplayableData | ErrorDisplayData;
  try {
    const evaluation = await analyzer.analyze(message);
    displayData = { type: "displayable", emotionScores: evaluation };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    displayData = { type: "error", errorMessage };
  }
  console.log("the thing that we are going to send back is", displayData);
  // TODO: this does not work for some reason;
  console.log("sendResponse", sendResponse);
  sendResponse(displayData);
});

messageMediator.listen("debug", (debugMessage) => {
  console.log("service worker:", debugMessage);
  messageMediator.send("debug", "I got the message: " + debugMessage);
});
