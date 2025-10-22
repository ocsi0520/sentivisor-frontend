import { css, html, LitElement, TemplateResult } from "lit";
import { localized, msg } from "@lit/localize";
import { customElement, property } from "lit/decorators.js";
import { commonStyle } from "../../shared-styles/common.style";
import { ExceptionDisplayData } from "#shared/messages/display";
import unsupportedLanguageIcon from "#assets/images/evaluation-exceptions/unsupported-language.svg?no-inline";
import computerFailIcon from "#assets/images/evaluation-exceptions/computer-fail.svg?no-inline";
import contractDenyIcon from "#assets/images/evaluation-exceptions/contract-deny.svg?no-inline";
import gearSetupIcon from "#assets/images/evaluation-exceptions/gears-setup.svg?no-inline";
import offRoundedIcon from "#assets/images/evaluation-exceptions/off-rounded.svg?no-inline";

const tagName = "stv-exception-display" as const;

@localized()
@customElement(tagName)
export class StvDisplayData extends LitElement {
  public static styles = [
    commonStyle,
    css`
      .exception-wrapper {
        display: flex;
        gap: 8px;
        align-items: stretch;
        justify-content: stretch;
        padding-block: 8px;
      }

      div.image-wrapper,
      p {
        flex: 1 1 0;
        color: var(--text-color);
      }
      div.image-wrapper {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      svg {
        height: 100%;
        max-width: 100%;
        width: auto;
        position: absolute;
      }
      p {
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        min-height: 64px;
      }
    `,
  ];

  private static contentByType: Record<
    ExceptionDisplayData["type"],
    { imgUrl: string; content: () => string }
  > = {
    "inner-page": {
      imgUrl: gearSetupIcon,
      content: () =>
        msg("Currently you are viewing a settings page of your browser."),
    },
    "black-listed": {
      imgUrl: contractDenyIcon,
      content: () => msg("This page is on your blacklist."),
    },
    "off-supervision-mode": {
      imgUrl: offRoundedIcon,
      content: () =>
        msg(
          "Supervision mode is set to off. Change it if you want to evaluate sites."
        ),
    },
    "unsupported-language": {
      imgUrl: unsupportedLanguageIcon,
      content: () =>
        msg("The language of this website is currently not supported."),
    },
    error: {
      imgUrl: computerFailIcon,
      content: () => msg("Something went wrong."),
    },
  };

  @property({ type: Object })
  public displayData!: ExceptionDisplayData;

  protected render(): TemplateResult {
    return this.renderGeneralException(
      this.displayData.type === "error"
        ? this.displayData.errorMessage
        : undefined
    );
  }

  private renderGeneralException(extraContent?: string): TemplateResult {
    const { imgUrl, content } =
      StvDisplayData.contentByType[this.displayData.type];
    return html`
      <div class="card shadow-sm">
        <div class="exception-wrapper">
          <div class="image-wrapper">
            <svg><use href="${imgUrl}"></use></svg>
          </div>
          <p>${content()} ${extraContent}</p>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: StvDisplayData;
  }
}
