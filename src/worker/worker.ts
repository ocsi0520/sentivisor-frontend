import { MessageMediator } from "#shared/MessageMediator";
import { DisplayData } from "#shared/messages";
import { getActiveTab } from "#shared/utils";
import { Analyzer } from "./Analyzer";

console.log("worker has started");

const messageMediator = new MessageMediator();
const analyzer = new Analyzer();

let isSidePanelOpen = false;

function setupContextMenu() {
  chrome.contextMenus.create({
    id: "sentivisor",
    title: "Sentiment Analysis",
    contexts: ["page"],
  });
}

type UsualTab = chrome.tabs.Tab & { id: number; url: `http${string}` };

const isUsualTab = (tab: chrome.tabs.Tab): tab is UsualTab => {
  return (tab?.id != null && tab.url?.startsWith("http")) || false;
};

const parseActivateTab = async (): Promise<void> => {
  const activeTab = await getActiveTab();
  if (isUsualTab(activeTab))
    messageMediator.send("parse", undefined, activeTab.id);
  else if (isSidePanelOpen) {
    messageMediator.send("display", { type: "inner-page" });
  }
};

// Listen for tab switches (when a tab is activated)
chrome.tabs.onActivated.addListener(parseActivateTab);

// Listen for side panel closure (when the side panel is closed)
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "sidepanel") {
    console.log("Sidepanel opened.");
    isSidePanelOpen = true;
    port.onDisconnect.addListener(() => {
      isSidePanelOpen = false;
      console.log("Sidepanel closed.");
    });
    // __QUESTION__ why do we need to send a parse if the content.ts anyway starts a parse
    parseActivateTab();
  }
});

// Chrome bug workaround
chrome.runtime.onInstalled.addListener(async (details) => {
  // Run only on installation, not on updates
  if (details.reason !== "install") return;

  // Retrieve extension information
  const extensionInfo = await chrome.management.getSelf();
  // Check if the URL contains 'sentivisor.com'
  // __QUESTION__ do we really need to check whether its our extension?
  //  I don't think anyway got onInstalled event for any other extension
  if (!extensionInfo.homepageUrl?.includes("sentivisor.com")) return;

  console.log("onInstalled triggered for Sentivisor extension.");

  // Run necessary actions during installation
  chrome.tabs.create({
    url: chrome.runtime.getURL("src/consent/consent.html"),
  });
  setupContextMenu();
});

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

messageMediator.listen("analyze", async (message, _sender, sendResponse) => {
  // TODO: get tabid, so when we switch while fetching, we won't show it to the wrong tab
  let displayData: DisplayData;
  try {
    const evaluation = await analyzer.analyze(message);
    displayData = { type: "displayable", emotionScores: evaluation };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    displayData = { type: "error", errorMessage };
  }
  void sendScoresToDisplay(displayData);
  sendResponse(displayData);
});

const sendScoresToDisplay = async (
  displayableData: DisplayData
): Promise<void> => {
  const activeTab = await getActiveTab();
  if (isUsualTab(activeTab))
    messageMediator.send("display", displayableData, activeTab.id);
  // TODO: separate events which goes to content (sends with tabId)
  //  and events which goes to either worker or to sidepanel
  //  maybe those can be separated as well
  if (isSidePanelOpen) messageMediator.send("display", displayableData); // this goes to sidepanel
};

messageMediator.listen("debug", (debugMessage) => {
  console.log("service worker:", debugMessage);
  messageMediator.send("debug", "I got the message: " + debugMessage);
});
