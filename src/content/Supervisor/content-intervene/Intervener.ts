import { HarmfulnessEvaluation } from "../../HarmfulnessEvaluation";

export abstract class Intervener {
  constructor(protected document: Document) {}
  public getShadowHost(
    harmfulnessEvaluation: HarmfulnessEvaluation
  ): HTMLElement {
    const shadowHost = this.document.createElement("div");
    const shadowRoot = shadowHost.attachShadow({ mode: "closed" });
    shadowRoot.innerHTML = this.getShadowRootTemplate(harmfulnessEvaluation);

    this.addAdditionalChangesToShadowRootDom?.(shadowRoot);
    shadowRoot.adoptedStyleSheets.push(this.getStyleSheet());

    return shadowHost;
  }

  protected abstract getStyleSheet(): CSSStyleSheet;
  protected abstract getShadowRootTemplate(
    harmfulnessEvaluation: HarmfulnessEvaluation
  ): string;

  protected abstract addAdditionalChangesToShadowRootDom?(
    shadowRoot: ShadowRoot
  ): void;
}
