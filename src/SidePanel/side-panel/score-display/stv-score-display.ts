import { container } from "tsyringe";
import { css, html, LitElement, PropertyValues, TemplateResult } from "lit";
import { LocaleStatusEventDetail, localized } from "@lit/localize";
import { customElement, property, query } from "lit/decorators.js";
import { commonStyle } from "../../shared-styles/common.style";
import { ChartDrawer } from "./ChartDrawer";
import { EmotionScores } from "#shared/emotion-scores";
import { Theme } from "#shared/theme-colors";
import { WINDOW_SYMBOL } from "../../dependency-injection/dom-symbols";

// TODO: rename to stv-display-score
const tagName = "stv-score-display" as const;

@localized()
@customElement(tagName)
export class StvScoreDisplay extends LitElement {
  public static styles = [
    commonStyle,
    css`
      canvas {
        display: block;
      }
      stv-loading-indicator {
        margin: 0 auto;
      }
      * {
        color: var(--text-color);
      }
      .card{
        margin-top: 1rem;
      }
    `,
  ];

  private window = container.resolve<Window>(WINDOW_SYMBOL);

  public connectedCallback(): void {
    super.connectedCallback();
    this.window.addEventListener(
      "lit-localize-status",
      this.handleLocaleChange
    );
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    this.window.removeEventListener(
      "lit-localize-status",
      this.handleLocaleChange
    );
  }

  @property({ type: Object })
  public scores!: EmotionScores;

  @property({ type: String })
  public theme!: Theme;

  private chartDrawer = container.resolve(ChartDrawer);

  // TODO: maybe this can be true from now on
  @query("canvas", false)
  private scoresCanvas!: HTMLCanvasElement;

  public updated(changedProperties: PropertyValues<this>): void {
    const hasAnyChartRelatedChange =
      changedProperties.has("theme") || changedProperties.has("scores");

    if (hasAnyChartRelatedChange)
      this.chartDrawer.drawSentimentChart(this.scoresCanvas, this.scores);
  }

  protected render(): TemplateResult {
    return html`<canvas></canvas>`;
  }

  private handleLocaleChange = (
    event: CustomEvent<LocaleStatusEventDetail>
  ): void => {
    if (event.detail.status === "ready")
      this.chartDrawer.drawSentimentChart(this.scoresCanvas, this.scores);
  };
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: StvScoreDisplay;
  }
}
