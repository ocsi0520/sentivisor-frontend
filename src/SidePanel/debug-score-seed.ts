import { LitElement, html, TemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js";
import { EmotionScores } from "#shared/emotion-scores";
import { commonStyle, structuralStyles } from "./shared-styles/common.style";
import { container } from "tsyringe";
import { MessageMediator } from "#shared/MessageMediator";
import { BlackListStorage } from "#shared/black-list-storage/BlackListStorage";
import { getActiveTab } from "#shared/utils";
import { ConsentStorage } from "#shared/consent/ConsentStorage";
import { DisplayData } from "#shared/messages";

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
      alreadyHandled: false,
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
    chrome.tabs.create({
      url: chrome.runtime.getURL("src/consent/consent.html"),
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

  public render(): TemplateResult {
    return html`
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
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: DebugScoreSeed;
  }
}
