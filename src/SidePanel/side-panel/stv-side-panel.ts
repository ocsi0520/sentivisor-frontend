import { LitElement, html, css, TemplateResult } from "lit";
import { customElement, state, property } from "lit/decorators.js";
import type { DisplayData } from "#shared/messages";
import { commonStyle, structuralStyles } from "../shared-styles/common.style";
import type { Theme } from "#shared/theme-colors";
import type { DisplayChangeEvent } from "../debug-score-seed";
import { container } from "tsyringe";
import { MessageMediator, Unsubscribe } from "#shared/MessageMediator";

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

  private messageMediator = container.resolve(MessageMediator);
  private unsubscribe?: Unsubscribe;

  private port: chrome.runtime.Port | undefined;
  private messageListener = (displayData: DisplayData): void => {
    this.displayData = displayData;
  };

  private handleDisplayFromDebug = (ev: DisplayChangeEvent): void => {
    this.displayData = ev.detail || undefined;
  };

  public connectedCallback(): void {
    super.connectedCallback();
    this.unsubscribe = this.messageMediator.listen(
      "display",
      this.messageListener
    );

    // TODO: extract chrome and inject it
    // why do we need this port? --- to see from worker if the sidepanel is opened and closed
    this.port = chrome.runtime.connect({ name: "sidepanel" });
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();

    this.unsubscribe?.();
    this.port?.disconnect();
  }

  @state()
  private displayData?: DisplayData;

  @property()
  private theme!: Theme;

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
