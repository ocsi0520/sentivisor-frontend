import { css, html, LitElement, TemplateResult } from "lit";
import { localized } from "@lit/localize";
import { customElement, property } from "lit/decorators.js";
import { commonStyle } from "../../shared-styles/common.style";
import { Theme } from "#shared/theme-colors";
import { DisplayData } from "#shared/messages";

const tagName = "stv-display-data" as const;

@localized()
@customElement(tagName)
export class StvDisplayData extends LitElement {
  public static styles = [
    commonStyle,
    css`
      canvas {
        display: block;
      }
      stv-loading-indicator {
        margin: 0 auto;
      }
    `,
  ];

  @property({ type: Object })
  public displayData: DisplayData | undefined;

  @property({ type: String })
  public theme!: Theme;

  protected render(): TemplateResult {
    return html`
      <div class="card shadow-sm">
        <h4 class="card-title">Sentiment Scores</h4>
        ${this.renderDisplayer()}
      </div>
    `;
  }

  private renderDisplayer(): TemplateResult {
    // TODO: proper components
    if (this.displayData === undefined)
      return html`<stv-loading-indicator></stv-loading-indicator>`;
    if (this.displayData.type === "black-listed")
      return html`<p>this is a blacklisted page</p>`;
    if (this.displayData.type === "off-supervision-mode")
      return html`<p>supervision mode is off</p>`;
    if (this.displayData.type === "inner-page")
      return html`<p>This is an inner page</p>`;

    return html`
      <stv-score-display
        .scores=${this.displayData.emotionScores}
        .theme=${this.theme}
      >
      </stv-score-display>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: StvDisplayData;
  }
}
