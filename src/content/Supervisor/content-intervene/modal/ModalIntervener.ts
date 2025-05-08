import { Intervener } from "../Intervener";
import RawTemplate from "./ModalIntervenerTemplate.html?raw";
import RawStyles from "./ModalIntervenerStyle.css?raw";
import { TemplateStringTranslator } from "../translation/TemplateStringTranslator";
import { HarmfulnessEvaluation } from "../../../HarmfulnessEvaluation";

export class ModalIntervener extends Intervener {
  constructor(
    document: Document,
    private translator: TemplateStringTranslator,
    private isAllowedToContinue: boolean
  ) {
    super(document);
  }

  protected getStyleSheet(): CSSStyleSheet {
    const randomIndex = Math.floor(Math.random() * 17) + 1;
    const imgNumber = String(randomIndex).padStart(4, "0");
    const fileName = `stv-background-${imgNumber}.jpg`;
    const filePath = chrome.runtime.getURL(`images/backgrounds/${fileName}`);

    const styleWithInjectedIcon = RawStyles.replace(
      "{{BACKGROUND_PATH}}",
      filePath
    );

    const styleSheet = new CSSStyleSheet();
    styleSheet.replaceSync(styleWithInjectedIcon);
    return styleSheet;
  }

  protected getShadowRootTemplate(
    harmfulnessEvaluation: HarmfulnessEvaluation
  ): string {
    const translatedTemplate = this.translator.translateTemplateString(
      RawTemplate,
      harmfulnessEvaluation
    );

    // TODO: inject chrome.runtime
    return translatedTemplate.replace(
      "{{ICON_PATH}}",
      chrome.runtime.getURL(`images/icon-32.png`)
    );
  }

  // TODO: type-safe event name strings with InterveneSupervisor
  protected addAdditionalChangesToShadowRootDom(shadowRoot: ShadowRoot): void {
    const eventMetaData: EventInit = { bubbles: false, composed: true };
    const [continueButton, addToBlacklistButton, navigateAwayButton] =
      Array.from(shadowRoot.querySelectorAll("button"));

    if (this.isAllowedToContinue)
      continueButton.onclick = () => {
        const allowEvent = new Event("dispose", eventMetaData);
        shadowRoot.dispatchEvent(allowEvent);
      };
    else continueButton.remove();

    addToBlacklistButton.onclick = () => {
      shadowRoot.dispatchEvent(new Event("add-to-blacklist", eventMetaData));
    };

    navigateAwayButton.onclick = () => {
      shadowRoot.dispatchEvent(new Event("navigate-away", eventMetaData));
    };
  }
}
