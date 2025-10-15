import { css, html, LitElement, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { commonStyle } from "../shared-styles/common.style";
import { ThemeColors, themes } from "#shared/theme-colors";
import { container } from "tsyringe";
import { CHROME_GLOBAL_VARIABLE } from "../dependency-injection/dom-symbols";

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

  private chromeInstance: typeof chrome = container.resolve(
    CHROME_GLOBAL_VARIABLE
  );

  private get themeIcon(): string {
    const toolbarIconKey: keyof ThemeColors = "--toolbar-icon-name";
    const themeIconCssVariable = this.computedStyleMap().get(toolbarIconKey);

    const themeIconName =
      themeIconCssVariable?.toString() || themes.dark[toolbarIconKey];
    const themeIconAbsolutePath = `images/theme-icons/${themeIconName}`;

    const filePath = this.chromeInstance.runtime.getURL(themeIconAbsolutePath);
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
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: StvToolbar;
  }
}
