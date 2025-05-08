import { EmotionScores } from "#shared/emotion-scores";
import { MessageMediator } from "#shared/MessageMediator";
import { AnalyzableContent, DisplayData } from "#shared/messages";
import { getActiveTab } from "#shared/utils";
import { AnalyzationIDGenerator } from "./AnalyzationIDGenerator";
import { Analyzer } from "./Analyzer";
import { EmotionScoresCache } from "./EmotionScoresCache";

const messageMediator = new MessageMediator();
const idGenerator = new AnalyzationIDGenerator();
const analyzationCache = new EmotionScoresCache(idGenerator);
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
chrome.runtime.onConnect.addListener(function (port) {
  if (port.name === "sidepanel") {
    console.log("Sidepanel opened.");
    isSidePanelOpen = true;
    port.onDisconnect.addListener(async () => {
      isSidePanelOpen = false;
      console.log("Sidepanel closed.");
    });
    parseActivateTab();
  }
});

// Chrome bug workaround
chrome.runtime.onInstalled.addListener((details) => {
  // Run only on installation, not on updates
  if (details.reason === "install") {
    // Retrieve extension information
    chrome.management.getSelf((extensionInfo) => {
      // Check if the URL contains 'sentivisor.com'
      if (extensionInfo.homepageUrl && extensionInfo.homepageUrl.includes("sentivisor.com")) {
        console.log("onInstalled triggered for Sentivisor extension.");

        // Run necessary actions during installation
        chrome.tabs.create({
          url: chrome.runtime.getURL("src/consent/consent.html"),
        });
        setupContextMenu();
      }
    });
  }
});

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

const handleCachedEvaluation = (
  cachedValue: EmotionScores,
  sendResponse: (response: DisplayData | undefined) => void
): void => {
  const displayableData: DisplayData = {
    alreadyHandled: true,
    type: "displayable",
    emotionScores: cachedValue,
  };
  void sendScoresToDisplay(displayableData);
  sendResponse(displayableData);
};

const handleNewEvaluation = async (
  message: AnalyzableContent,
  sendResponse: (response: DisplayData | undefined) => void
): Promise<void> => {
  const evaluation = await analyzer.analyze(message);
  await analyzationCache.setCache(message, evaluation);

  const displayableData: DisplayData = {
    alreadyHandled: false,
    type: "displayable",
    emotionScores: evaluation,
  };
  void sendScoresToDisplay(displayableData);
  sendResponse(displayableData);
};

messageMediator.listen("analyze", async (message, _sender, sendResponse) => {
  const cachedValue = await analyzationCache.getCacheFor(message);
  if (cachedValue) {
    handleCachedEvaluation(cachedValue, sendResponse);
  } else {
    handleNewEvaluation(message, sendResponse);
  }
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
