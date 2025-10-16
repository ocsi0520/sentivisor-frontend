import { LitElement, html, css, TemplateResult } from "lit";
import { customElement, state, property } from "lit/decorators.js";
import type { DisplayData, SendEvaluationEvent } from "#shared/messages";
import { commonStyle, structuralStyles } from "../shared-styles/common.style";
import type { Theme } from "#shared/theme-colors";
import type { DisplayChangeEvent } from "../debug-score-seed";
import { container } from "tsyringe";
import { MessageMediator, Unsubscribe } from "#shared/MessageMediator";
import { getActiveTab, isUsualTab } from "#shared/utils";
import { CHROME_GLOBAL_VARIABLE } from "../dependency-injection/dom-symbols";

const tagName = "stv-side-panel" as const;
@customElement(tagName)
export class StvSidePanel extends LitElement {
  // Styles are applied to the shadow root and scoped to this element
  public static styles = [
    structuralStyles,
    commonStyle,
    css`
      :host {
        all: initial;
        font-family: Arial, sans-serif;
        display: block;
        min-height: 100vh;
        background-color: var(--background-color);
        padding-bottom: 16px;
        box-sizing: border-box;
      }

      :host() * {
        color: var(--text-color);
        fill: var(--text-color);
      }
    `,
  ];

  @property()
  public theme!: Theme;

  @state()
  private displayData?: DisplayData;

  private messageMediator = container.resolve(MessageMediator);
  private chromeInstance: typeof chrome = container.resolve(
    CHROME_GLOBAL_VARIABLE
  );
  private sendEvaluationUnsubscribe?: Unsubscribe;

  private messageListener = async (
    evaluationResponse: SendEvaluationEvent["message"]
  ): Promise<void> => {
    const activeTab = await getActiveTab(this.chromeInstance.tabs);
    if (
      activeTab.id !== evaluationResponse.tabId ||
      activeTab.windowId !== evaluationResponse.windowId
    )
      return;

    this.displayData = evaluationResponse.displayData;
  };

  private handleDisplayFromDebug = (ev: DisplayChangeEvent): void => {
    this.displayData = ev.detail || undefined;
  };

  private handleTabChange = async (
    activeInfo: chrome.tabs.TabActiveInfo
  ): Promise<void> => {
    const tab = await this.chromeInstance.tabs.get(activeInfo.tabId);
    if (isUsualTab(tab))
      this.messageMediator.send(
        "getEvaluation",
        { tabId: tab.id, windowId: tab.windowId },
        tab.id
      );
    else this.displayData = { type: "inner-page" };
  };

  public async connectedCallback(): Promise<void> {
    super.connectedCallback();
    this.sendEvaluationUnsubscribe = this.messageMediator.listen(
      "sendEvaluation",
      this.messageListener
    );
    // Listen for tab switches (when a tab is activated)
    this.chromeInstance.tabs.onActivated.addListener(this.handleTabChange);

    const activeTab = await getActiveTab(this.chromeInstance.tabs);
    this.handleTabChange({
      tabId: activeTab.id!,
      windowId: activeTab.windowId,
    });
  }

  public disconnectedCallback(): void {
    this.sendEvaluationUnsubscribe?.();
    this.chromeInstance.tabs.onActivated.removeListener(this.handleTabChange);
    super.disconnectedCallback();
  }

  public render(): TemplateResult {
    return html`
      <debug-score-seed @display-change=${this.handleDisplayFromDebug}>
      </debug-score-seed>
      <stv-toolbar .theme=${this.theme}></stv-toolbar>
      <stv-display-data
        .theme=${this.theme}
        .displayData=${this.displayData}
      ></stv-display-data>
      <stv-settings></stv-settings>
      <stv-user-black-list></stv-user-black-list>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: StvSidePanel;
  }
}
