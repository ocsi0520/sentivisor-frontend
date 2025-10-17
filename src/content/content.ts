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
import { DisplayableData, DisplayData, TabInfo } from "#shared/messages";

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
// TODO: make getEvaluation cached until it resolves as non-displayable
const getEvaluation = async (): Promise<DisplayData> => {
  if (await isConsentDeclined())
    return { type: "error", errorMessage: "Consent is not accepted." };
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
  const tabInfo: TabInfo = await messageMediator.send("getTabInfo", undefined);

  messageMediator.send("sendEvaluation", {
    ...tabInfo,
    displayData: { type: "loading" },
  });
  const emotionAnalysis = await getEvaluation();
  messageMediator.send("sendEvaluation", {
    ...tabInfo,
    displayData: emotionAnalysis,
  });

  if (emotionAnalysis.type !== "displayable") return;
  sentivisor.handleEmotionAnalysis(emotionAnalysis.emotionScores);
};
runOnce();
