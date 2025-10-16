import { checkLanguage } from "./contentUtils";
import { Sentivisor } from "./sentivisor";
import { MessageMediator } from "#shared/MessageMediator";
import { isAllowedLanguage } from "#shared/allowed-languages";
import { BlackListStorage } from "#shared/black-list-storage/BlackListStorage";
import { SupervisorStorage } from "#shared/supervisor/SupervisorStorage";
import { getPrimaryDomain } from "./contentUtils";
import { ConsultantProvider } from "./Consultant/ConsultantProvider";
import { SupervisorProvider } from "./Supervisor/SupervisorProvider";
import { SupervisionMode } from "#shared/supervisor/supervision-mode";
import { ConsentStorage } from "#shared/consent/ConsentStorage";
import { DisplayableData, DisplayData } from "#shared/messages";

declare global {
  interface Window {
    __SENTIVISOR_CONTENT_GUARD_FLAG__: boolean;
  }
}

function run() {
  if (window.__SENTIVISOR_CONTENT_GUARD_FLAG__) {
    console.log("BINGOOOO");
    return;
  }

  window.__SENTIVISOR_CONTENT_GUARD_FLAG__ = true;

  const blackListStorage = new BlackListStorage();
  const supervisorStorage = new SupervisorStorage();
  const messageMediator = new MessageMediator();
  const consentStorage = new ConsentStorage();
  const sentivisor = new Sentivisor(
    new ConsultantProvider(),
    new SupervisorProvider(supervisorStorage, blackListStorage)
  );

  const isCurrentPageBlackListed = (): Promise<boolean> => {
    const primaryDomain = getPrimaryDomain();
    return blackListStorage.isDomainBlacklisted(primaryDomain);
  };

  const isSupervisionOff = async (): Promise<boolean> => {
    return (await supervisorStorage.getVisionMode()) === SupervisionMode.off;
  };

  const isConsentDeclined = async (): Promise<boolean> => {
    return !(await consentStorage.getConsent());
  };

  let cachedEvaluation: DisplayableData | undefined = undefined;

  const getEvaluation = async (): Promise<DisplayData> => {
    // TODO: handle this
    if (await isConsentDeclined()) {
      console.log("should not parse things");
      // return
    }

    if (await isSupervisionOff()) return { type: "off-supervision-mode" };
    if (await isCurrentPageBlackListed()) return { type: "black-listed" };

    const allTexts: string = document.body.innerText;
    const lang: string = checkLanguage(allTexts);

    if (!isAllowedLanguage(lang)) return { type: "unsupported-language" };

    const url = `${location.origin}${location.pathname}`;

    const emotionAnalysis =
      cachedEvaluation ||
      (await messageMediator.send("analyze", {
        language: lang,
        text: allTexts,
        url,
      }));

    if (emotionAnalysis.type === "displayable")
      cachedEvaluation = emotionAnalysis;

    return emotionAnalysis!;
  };

  messageMediator.listen("getPrimaryDomain", (_msg, _sender, sendResponse) => {
    sendResponse(getPrimaryDomain());
  });

  messageMediator.listen("getEvaluation", async (tabInfo) => {
    messageMediator.send("sendEvaluation", {
      displayData: await getEvaluation(),
      ...tabInfo,
    });
  });

  const runOnce = async (): Promise<void> => {
    const alreadyCalledSentivisor = Boolean(cachedEvaluation);
    if (alreadyCalledSentivisor) return;
    const emotionAnalysis = await getEvaluation();
    // TODO: push to sidepanel

    if (emotionAnalysis.type !== "displayable") return;
    sentivisor.handleEmotionAnalysis(emotionAnalysis.emotionScores);
  };
  runOnce();
}

run();
