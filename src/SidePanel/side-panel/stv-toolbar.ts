import { css, html, LitElement, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { commonStyle } from "../shared-styles/common.style";
import { allLocales } from "../localization/generated/config";
import { localization } from "../localization";
import { ThemeColors, themes } from "#shared/theme-colors";

const tagName = "stv-toolbar" as const;

@customElement(tagName)
export class StvToolbar extends LitElement {
  public static styles = [
    commonStyle,
    css`
      .toolbar-wrapper {
        padding: 6px 0 3px 14px;
      }

      .toolbar svg {
        width: 1.4em;
        height: 1.4em;
        color: var(--text-color);
      }
    `,
  ];

  private get themeIcon(): string {
    const toolbarIconKey: keyof ThemeColors = "--toolbar-icon-name";
    const themeIconCssVariable = this.computedStyleMap().get(toolbarIconKey);

    const themeIconName =
      themeIconCssVariable?.toString() || themes.dark[toolbarIconKey];
    const themeIconAbsolutePath = `images/theme-icons/${themeIconName}`;

    // TODO: inject chrome.runtime
    const filePath = chrome.runtime.getURL(themeIconAbsolutePath);
    return filePath;
  }

  private dispatchToggleTheme(): void {
    const event = new Event("toggle-theme", {
      bubbles: true,
      cancelable: true,
      composed: true,
    });
    this.dispatchEvent(event);
    this.requestUpdate();
  }

  protected render(): TemplateResult {
    return html`
      <div class="toolbar-wrapper shadow-sm">
        <div class="toolbar">
          <button @click=${this.dispatchToggleTheme} class="btn-icon">
            <svg><use href=${this.themeIcon}></use></svg>
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
