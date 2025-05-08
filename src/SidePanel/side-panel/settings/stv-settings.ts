import { css, html, LitElement, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { commonStyle } from "../../shared-styles/common.style";

const tagName = "stv-settings" as const;

@customElement(tagName)
export class StvSettings extends LitElement {
  public static styles = [
    commonStyle,
    css`
      .card {
        margin-top: 1rem;
      }
    `,
  ];

  protected render(): TemplateResult {
    return html`
      <div class="card shadow-sm">
        <!-- TODO: do modal -->
        <!-- <div id="modal" style="display:none;">
          <div id="modalContent">
            <p>This is a modal window.</p>
            <button id="closeModal">Close</button>
          </div>
        </div> -->
        <!-- <h4 class="card-title">Settings</h4> !-->
        <stv-supervision-selector></stv-supervision-selector>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: StvSettings;
  }
}
