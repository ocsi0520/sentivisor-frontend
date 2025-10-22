import { LitElement, html, css, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { commonStyle } from "./shared-styles/common.style";
import { localized, msg } from "@lit/localize";
import { container } from "tsyringe";
import { CHROME_GLOBAL_VARIABLE } from "./dependency-injection/dom-symbols";

const tagName = "stv-ask-for-consent" as const;

@localized()
@customElement(tagName)
export class StvAskForConsent extends LitElement {
  public static styles = [
    commonStyle,
    css`
      :host {
        display: block;
        width: 100vw;
        height: 100vh;
        background-color: var(--background-color);
      }
      p,
      button {
        padding: 4px;
        margin: 8px;
      }

      button {
        background-color: var(--background-color);
        border-radius: 8px;
        border: 1px solid var(--text-color);
      }
    `,
  ];

  private chromeInstance: typeof chrome = container.resolve(CHROME_GLOBAL_VARIABLE);

  private async displayConsentPage(): Promise<void> {
    // https://stackoverflow.com/questions/25225964/is-there-a-way-to-focus-on-a-specific-tab-in-chrome-via-plugin

    const consentPageURL = this.chromeInstance.runtime.getURL("src/consent/consent.html");
    const [alreadyOpenedConsentTab] = await this.chromeInstance.tabs.query({
      /*
        url string | string[] optional
        Match tabs against one or more URL patterns. Fragment identifiers are not matched.
        This property is ignored if the extension does not have the "tabs" permission.
      */
      url: consentPageURL,
    });
    if (!alreadyOpenedConsentTab || !alreadyOpenedConsentTab.id)
      this.chromeInstance.tabs.create({ url: consentPageURL });
    else this.chromeInstance.tabs.update(alreadyOpenedConsentTab.id, { active: true });
  }

  protected render(): TemplateResult {
    return html`
      <div>
        <p>
          ${msg("Please add consent so we can grant you the functionalities.")}
        </p>
        <button @click=${this.displayConsentPage}>
          ${msg("Open consent page")}
        </button>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: StvAskForConsent;
  }
}
