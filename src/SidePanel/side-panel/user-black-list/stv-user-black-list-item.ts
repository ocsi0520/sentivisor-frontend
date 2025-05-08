import { css, html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { commonStyle } from "../../shared-styles/common.style";
import { localized } from "@lit/localize";

const tagName = "stv-user-black-list-item" as const;

@localized()
@customElement(tagName)
export class StvUserBlackList extends LitElement {
  public static styles = [
    commonStyle,
    css`
      li {
        display: flex;
        justify-content: space-between;
        align-items:center;
        width: 98.2%;
        font-size: 14px;
      }
      * {
        color: var(--text-color);
      }
      .stv-remove-blacklist-item{
        border:none;
        color:red;
        font-weight:800;
        background:transparent;
        font-size: 1.4em;
        cursor:pointer;
      }
      li:hover{
        background-color:grey;
      }
      button{
        font-size:16px;
      }
    `,
  ];

  @property({ type: String })
  private item!: string;

  protected render(): TemplateResult {
    return html`
      <li>
        ${this.item}
        <button @click=${this.dispatchRemoveItem} class="stv-remove-blacklist-item">×</button>
      </li>
    `;
  }

  private dispatchRemoveItem(): void {
    const removeEvent = new Event("remove-item", {
      bubbles: false,
      composed: true,
    });
    this.dispatchEvent(removeEvent);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: StvUserBlackList;
  }
}
