import { LitElement, html, css, TemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js";
import { themes, Theme } from "#shared/theme-colors";
import { LOCAL_STORAGE_SYMBOL } from "./dependency-injection/dom-symbols";
import { container } from "tsyringe";
import { MessageMediator, Unsubscribe } from "#shared/MessageMediator";
import { ConsentStorage } from "#shared/consent/ConsentStorage";

const tagName = "stv-root" as const;

@customElement(tagName)
export class StvRoot extends LitElement {
  public static styles = css`
    :host {
      all: initial;
      font-family: Arial, sans-serif;
      display: content;
    }

    .loading-wrapper {
      width: 100vw;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      --size: 80vmin;
      background-color: var(--background-color);
    }
  `;

  @state()
  private consent: boolean | undefined;

  @state()
  private theme!: Theme;

  private messageMediator = container.resolve(MessageMediator);

  private consentStorage = container.resolve(ConsentStorage);
  private unsubscribe?: Unsubscribe;

  private handleConsentChange = (consentStatus: boolean): void => {
    this.consent = consentStatus;
  };

  public connectedCallback(): void {
    super.connectedCallback();
    this.initTheme();
    this.unsubscribe = this.messageMediator.listen(
      "consentChange",
      this.handleConsentChange
    );
    this.loadConsentStatus();
  }

  private async loadConsentStatus(): Promise<void> {
    this.handleConsentChange(await this.consentStorage.getConsent());
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();

    this.unsubscribe?.();
  }

  private storage: Storage = container.resolve(LOCAL_STORAGE_SYMBOL);

  private initTheme(): void {
    this.theme = (this.storage.getItem("theme") as Theme) || "light";
    this.loadVariablesFromCurrentTheme();
  }

  private toggleTheme(): void {
    const newTheme: Theme = this.theme === "dark" ? "light" : "dark";
    this.storage.setItem("theme", newTheme);
    this.theme = newTheme;
    this.loadVariablesFromCurrentTheme();
  }

  private loadVariablesFromCurrentTheme(): void {
    Object.entries(themes[this.theme]).forEach(([cssVariableName, cssValue]) =>
      this.style.setProperty(cssVariableName, cssValue)
    );
  }

  public render(): TemplateResult {
    if (this.consent === undefined)
      return html`<div class="loading-wrapper">
        <stv-loading-indicator></stv-loading-indicator>
      </div>`;

    if (this.consent === false)
      return html` <stv-ask-for-consent></stv-ask-for-consent> `;

    return html`
      <stv-side-panel
        .theme=${this.theme}
        @toggle-theme=${this.toggleTheme}
      ></stv-side-panel>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: StvRoot;
  }
}
