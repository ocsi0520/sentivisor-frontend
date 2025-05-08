import { LitElement, html, css, TemplateResult, nothing } from "lit";
import { customElement, query, state } from "lit/decorators.js";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import questionMarkIcon from "#assets/images/question-mark.svg?raw";
import { commonStyle } from "../../shared-styles/common.style";
import { computePosition, flip, offset } from "@floating-ui/dom";

const tagName = "stv-prompter" as const;

@customElement(tagName)
export class StvPrompter extends LitElement {
  public static styles = [
    commonStyle,
    css`
      :host {
      }
      svg {
        color: var(--text-color);
      }
      .modal-background {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(0, 0, 0, 0.6);
      }
      .modal-wrapper {
        min-height: 100px;
        width: 90vw;
        border: 2px solid red;
      }
      .tooltip {
        display: none;
        position: absolute;
        width: max-content;
        top: 0;
        left: 0;
      }
    `,
  ];

  @query("button")
  private iconButton!: HTMLButtonElement;

  @query(".tooltip")
  private tooltip!: HTMLElement;

  @state()
  private isModalOpen = false;

  private toggleModal(event: Event): void {
    event.stopPropagation();
    this.isModalOpen = !this.isModalOpen;
  }

  protected render(): TemplateResult {
    return html`
      <button
        @mouseleave=${this.hideTooltip}
        @mouseenter=${this.showTooltip}
        @click=${this.toggleModal}
        class="btn-icon modal-reference"
      >
        ${unsafeSVG(questionMarkIcon)}
      </button>
      ${this.renderTooltip()} ${this.renderModal()}
    `;
  }

  private renderTooltip(): TemplateResult {
    return html`<div class="tooltip"><slot name="tooltip"></slot></div>`;
  }

  private async showTooltip(): Promise<void> {
    // TODO: gets wrong position, most probably the config is not good
    const response = await computePosition(this.iconButton, this.tooltip, {
      middleware: [flip(), offset({ mainAxis: 100, crossAxis: -100 })],
      placement: "top-start",
      strategy: "absolute",
    });
    Object.assign(this.tooltip.style, {
      left: `${response.x}px`,
      top: `${response.y}px`,
      display: "block",
    });
  }

  private hideTooltip(): void {
    this.tooltip.style.display = "none";
  }

  private renderModal(): TemplateResult | typeof nothing {
    if (!this.isModalOpen) return nothing;

    return html`
      <div class="modal-background">
        <div class="modal-wrapper">
          <slot @dispose=${this.toggleModal} name="modal"></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: StvPrompter;
  }
}
