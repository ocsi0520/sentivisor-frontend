import { LitElement, html, css, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";

const tagName = "stv-loading-indicator";

@customElement(tagName)
export class StvLoadingIndicator extends LitElement {
  public static styles = css`
    :host {
      display: block;
      width: var(--size, 80px);
      height: var(--size, 80px);
    }
    .lds-ripple,
    .lds-ripple div {
      box-sizing: border-box;
    }
    .lds-ripple {
      display: inline-block;
      position: relative;
      width: 100%;
      height: 100%;
    }
    .lds-ripple div {
      position: absolute;
      border: calc(var(--size, 80px) / 10) solid var(--text-color);
      opacity: 1;
      border-radius: 50%;
      animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
    }
    .lds-ripple div:nth-child(2) {
      animation-delay: -0.5s;
    }
    @keyframes lds-ripple {
      0% {
        top: 45%;
        left: 45%;
        width: 10%;
        height: 10%;
        opacity: 0;
        border-width: 0;
      }
      4.9% {
        top: 45%;
        left: 45%;
        width: 10%;
        height: 10%;
        opacity: 0;
        border-width: 0;
      }
      5% {
        top: 45%;
        left: 45%;
        width: 10%;
        height: 10%;
        opacity: 1;
        border-width: 1px;
      }
      100% {
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        border-width: calc(var(--size, 80px) / 10);
      }
    }
  `;
  protected render(): TemplateResult {
    return html`<div class="lds-ripple">
      <div></div>
      <div></div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: StvLoadingIndicator;
  }
}
