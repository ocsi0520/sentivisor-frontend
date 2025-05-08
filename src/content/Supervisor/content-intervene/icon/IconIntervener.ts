import { Intervener } from "../Intervener";
import RawTemplate from "./IconIntervenerTemplate.html?raw";
import RawStyles from "./IconIntervenerStyle.css?raw";
import { HarmfulnessEvaluation } from "../../../HarmfulnessEvaluation";
import { dispatchDispose } from "#shared/ui-related/dispose-event";

export class IconIntervener extends Intervener {
  protected getStyleSheet(): CSSStyleSheet {
    const styleSheet = new CSSStyleSheet();
    styleSheet.replaceSync(RawStyles);
    return styleSheet;
  }

  protected getShadowRootTemplate({
    maxEmotion: mostVividEmotion,
  }: HarmfulnessEvaluation): string {
    const filePath = chrome.runtime.getURL(
      `images/emoticons/${mostVividEmotion}.png`
    );

    return RawTemplate.replace(
      "{{EMOTICON_URL}}",
      // TODO: inject chrome.runtime
      filePath
    );
  }

  protected addAdditionalChangesToShadowRootDom(shadowRoot: ShadowRoot) {
    const interveneWrapper =
      shadowRoot.querySelector<HTMLDivElement>(".intervene-wrapper");
    const emoticonWrapper = shadowRoot.querySelector<HTMLDivElement>(
      ".emotion-icon-wrapper"
    );

    if (!interveneWrapper) throw new Error("no intervene wrapper found");
    if (!emoticonWrapper) throw new Error("no emoticon wrapper found");

    const closeButton =
      shadowRoot.querySelector<HTMLButtonElement>("#stv-emotion-close");

    closeButton?.addEventListener("click", () => {
      dispatchDispose(closeButton);
    });

    let offsetX = 0;
    let offsetY = 0;

    // Handle dragstart event
    emoticonWrapper.addEventListener("dragstart", (ev) => {
      if (ev.clientX !== 0 && ev.clientY !== 0) {
        // Ensure clientX/Y is set
        offsetX = ev.clientX - emoticonWrapper.getBoundingClientRect().left;
        offsetY = ev.clientY - emoticonWrapper.getBoundingClientRect().top;
      }
    });

    // Handle drag event (to update position)
    interveneWrapper.addEventListener("dragover", (ev) => {
      emoticonWrapper.style.left = `${ev.clientX - offsetX}px`;
      emoticonWrapper.style.top = `${ev.clientY - offsetY}px`;
    });

    // Handle dragend event
    emoticonWrapper.addEventListener("dragend", (ev) => {
      // TODO:
      // - in case we move the icon outside of the window it should be put back
      // - recalculate positions to percent values of the screen because the responsiviness is lost

      emoticonWrapper.style.left = `${ev.clientX - offsetX}px`;
      emoticonWrapper.style.top = `${ev.clientY - offsetY}px`;
    });
  }
}
