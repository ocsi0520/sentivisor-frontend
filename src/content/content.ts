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

const parseContent = async () => {
  if (await isConsentDeclined()) return;

  if (await isSupervisionOff()) {
    messageMediator.send("display", { type: "off-supervision-mode" });
    return;
  }
  if (await isCurrentPageBlackListed()) {
    messageMediator.send("display", { type: "black-listed" });
    return;
  }

  const allTexts: string = document.body.innerText;
  const lang: string = checkLanguage(allTexts);
  if (!isAllowedLanguage(lang)) return;

  const url = `${location.origin}${location.pathname}`;
  messageMediator.send("analyze", { language: lang, text: allTexts, url });
};

messageMediator.listen("display", (emotionAnalysis) => {
  if (emotionAnalysis.type !== "displayable" || emotionAnalysis.alreadyHandled)
    return;

  sentivisor.handleEmotionAnalysis(emotionAnalysis.emotionScores);
});
messageMediator.listen("parse", parseContent);

messageMediator.listen("getPrimaryDomain", (_msg, _sender, sendResponse) => {
  sendResponse(getPrimaryDomain());
});

parseContent();
