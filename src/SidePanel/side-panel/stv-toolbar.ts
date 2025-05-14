import { css, html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import moonIcon from "#assets/images/moon-icon.svg?url&no-inline";
import sunIcon from "#assets/images/sun-icon.svg?url&no-inline";
import { commonStyle } from "../shared-styles/common.style";
import { Theme } from "#shared/theme-colors";
import { allLocales } from "../localization/generated/config";
import { localization } from "../localization";

const tagName = "stv-toolbar" as const;

@customElement(tagName)
export class StvToolbar extends LitElement {
  public static styles = [
    commonStyle,
    css`
      .toolbar-wrapper {
        padding: 6px 0 3px 14px;
      }

      .toolbar svg,
      .toolbar img,
      .toolbar .hard-try {
        width: 1.4em;
        height: 1.4em;
        color: var(--text-color);
        border: 1px solid red;
      }
      .toolbar .hard-try {
        background-image: var(--toolbar-icon-url);
        background-size: contain;
        background-repeat: no-repeat;
        border: 1px solid blue;
      }
    `,
  ];

  @property({ type: String })
  public theme!: Theme;

  private get themeIcon(): string {
    return this.theme === "dark"
      ? `${sunIcon}#entire-sun-icon`
      : `${moonIcon}#entire-moon-icon`;
  }

  private dispatchToggleTheme(): void {
    const event = new Event("toggle-theme", {
      bubbles: true,
      cancelable: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  protected render(): TemplateResult {
    return html`
      <div class="toolbar-wrapper shadow-sm">
        <div class="toolbar">
          <button @click=${this.dispatchToggleTheme} class="btn-icon">
            <svg>
              <use href=${this.themeIcon}></use>
            </svg>
            <img src=${this.themeIcon} />
            <div class="hard-try"></div>
          </button>
          ${this.renderLanguageSelector()}
        </div>
      </div>
    `;
  }
  private changeLocal(ev: Event): void {
    const typedTarget = ev.target as HTMLSelectElement;
    localization.setLocale(typedTarget.value);
  }

  private renderLanguageSelector(): TemplateResult {
    return html`<select @change=${this.changeLocal}>
      ${allLocales.map(
        (locale) => html` <option value=${locale}>${locale}</option> `
      )}
    </select>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: StvToolbar;
  }
}
