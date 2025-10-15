import { LitElement, html, TemplateResult } from "lit";
import { customElement, query, state } from "lit/decorators.js";
import { EmotionScores } from "#shared/emotion-scores";
import { commonStyle, structuralStyles } from "./shared-styles/common.style";
import { container } from "tsyringe";
import { MessageMediator, Unsubscribe } from "#shared/MessageMediator";
import { BlackListStorage } from "#shared/black-list-storage/BlackListStorage";
import { getActiveTab } from "#shared/utils";
import { ConsentStorage } from "#shared/consent/ConsentStorage";
import { DisplayData } from "#shared/messages";
import { CHROME_GLOBAL_VARIABLE } from "./dependency-injection/dom-symbols";

const tagName = "debug-score-seed" as const;

export type DisplayChangeEvent = CustomEvent<DisplayData | undefined>;

@customElement(tagName)
export class DebugScoreSeed extends LitElement {
  public static styles = [structuralStyles, commonStyle];

  private messageMediator = container.resolve(MessageMediator);
  private blackListService = container.resolve(BlackListStorage);
  private consentService = container.resolve(ConsentStorage);

  @state()
  private isConsentAccepted?: boolean;

  @query("input", true)
  private debugInput!: HTMLInputElement;

  private chromeInstance = container.resolve<typeof chrome>(
    CHROME_GLOBAL_VARIABLE
  );

  private clearScores(): void {
    this.dispatchChangeEventWith(undefined);
  }

  private randomizeScores(): void {
    const newScores: EmotionScores = {
      joy: Math.random() * 100,
      fear: Math.random() * 100,
      surprise: Math.random() * 100,
      sadness: Math.random() * 100,
      disgust: Math.random() * 100,
      anger: Math.random() * 100,
    };
    this.dispatchChangeEventWith({
      type: "displayable",
      emotionScores: newScores,
    });
  }

  private dispatchChangeEventWith(
    newDisplayableData: DisplayData | undefined
  ): void {
    const event: DisplayChangeEvent = new CustomEvent("display-change", {
      bubbles: false,
      cancelable: true,
      composed: true,
      detail: newDisplayableData,
    });
    this.dispatchEvent(event);
  }

  private async loadScoresForCurrentSite(): Promise<void> {
    // TODO: parse --> analyze --> display
    // <-- parse <-- analyze (should return EmotionScores)
    const activeTab = await getActiveTab();
    this.messageMediator.send("parse", undefined, activeTab.id);
  }

  private async clearBlackList(): Promise<void> {
    await this.blackListService.removeAll();
    this.messageMediator.send("blackListChange", undefined);
  }

  private async loadConsent(): Promise<void> {
    this.isConsentAccepted = await this.consentService.getConsent();
  }

  private openConsentPage(): void {
    this.chromeInstance.tabs.create({
      url: this.chromeInstance.runtime.getURL("src/consent/consent.html"),
    });
  }

  private displayBlackListed(): void {
    this.dispatchChangeEventWith({ type: "black-listed" });
  }

  private displayOffSupervisionMode(): void {
    this.dispatchChangeEventWith({ type: "off-supervision-mode" });
  }

  private displayInnerPage(): void {
    this.dispatchChangeEventWith({ type: "inner-page" });
  }

  private displayUnsupportedLanguage(): void {
    this.dispatchChangeEventWith({ type: "unsupported-language" });
  }

  private displayError(): void {
    this.dispatchChangeEventWith({
      type: "error",
      errorMessage: "Internal System error.",
    });
  }

  private renderScoreSeeders(): TemplateResult {
    return html`
      <div>
        <button @click=${this.clearScores}>Clear Scores</button>
        <button @click=${this.randomizeScores}>Randomize Scores</button>
        <button @click=${this.loadScoresForCurrentSite}>
          show current website
        </button>
      </div>
    `;
  }

  private renderNonParsableSeeders(): TemplateResult {
    return html`
      <div>
        <button @click=${this.displayBlackListed}>
          display black listed content
        </button>
        <button @click=${this.displayOffSupervisionMode}>
          display off supervision mode
        </button>
        <button @click=${this.displayInnerPage}>display inner page</button>
        <button @click=${this.displayUnsupportedLanguage}>
          unsupported-language
        </button>
        <button @click=${this.displayError}>display error</button>
      </div>
    `;
  }

  private renderConsentDebuggers(): TemplateResult {
    return html`
      <button @click=${this.loadConsent}>fetch consent</button>
      <button @click=${this.openConsentPage}>open consent page</button>
      <p>
        consent
        ${this.isConsentAccepted === undefined ? "N/A" : this.isConsentAccepted}
      </p>
    `;
  }

  private sendDebugMessage(): void {
    this.messageMediator.send("debug", this.debugInput.value);
  }

  protected render(): TemplateResult {
    return html`
      <div class="shadow-sm d-flex align-items-center">
        <button @click=${this.sendDebugMessage}>Send debug message</button>
        <input />
      </div>
      <div class="shadow-sm d-flex align-items-center">
        ${this.renderScoreSeeders()} ${this.renderNonParsableSeeders()}
      </div>
      <div class="shadow-sm d-flex align-items-center">
        <button @click=${this.clearBlackList}>
          clear all BlackListed item
        </button>
        ${this.renderConsentDebuggers()}
      </div>
    `;
  }

  private unsubscribeDebugMessage?: Unsubscribe;

  public connectedCallback(): void {
    super.connectedCallback();
    this.unsubscribeDebugMessage = this.messageMediator.listen(
      "debug",
      console.log
    );
  }

  public disconnectedCallback(): void {
    this.unsubscribeDebugMessage?.();
    super.disconnectedCallback();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: DebugScoreSeed;
  }
}
