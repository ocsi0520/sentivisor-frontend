import {
  LitElement,
  html,
  css,
  TemplateResult,
  nothing,
  PropertyValues,
} from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { SearchEvent } from "./search-event";
import { localized, msg } from "@lit/localize";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import filterIcon from "#assets/images/filter.svg?raw";
import { commonStyle } from "../shared-styles/common.style";

const tagName = "stv-search-field" as const;

@localized()
@customElement(tagName)
export class StvSearchField extends LitElement {
  public static styles = [
    commonStyle,
    css`
    :host {
      display: block;
      padding-left: 10px;
    }
    div {
      display: flex;
      gap: 4px;
    }
    input {
      flex: 1 1 0;
      background: transparent;
      border: none;
      border-bottom: 1px solid;
      color: var(--text-color);
      padding: 0 0 2px 0;
      outline: none;
    }
    .filter-icon{
      width: 16px;
      height: 16px;
      background-color: transparent;
      border: none;
      cursor: pointer;
    }
  `];

  private currentInputValue = "";

  /**
   * true = no "Search button" but search event is emitted in every input
   * false = has "Search button" which emits search event
   */
  @property({ type: Boolean })
  public continuousSearch: boolean = false;

  @query("input")
  private searchInput!: HTMLInputElement;

  public connectedCallback(): void {
    super.connectedCallback();
    const eventToSearch = this.continuousSearch ? "input" : "change";
    requestAnimationFrame(() => {
      this.searchInput.addEventListener(eventToSearch, this.handleInputChange);
    });
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    const eventToSearch = this.continuousSearch ? "input" : "change";
    this.searchInput.removeEventListener(eventToSearch, this.handleInputChange);
  }

  public updated(changedProperties: PropertyValues<this>): void {
    const oldValueOfContinuousSearch =
      changedProperties.get("continuousSearch");
    const hasContinuousSearchChanged =
      changedProperties.has("continuousSearch") &&
      oldValueOfContinuousSearch !== undefined; // initial change

    if (!hasContinuousSearchChanged) return;

    const oldEventName = oldValueOfContinuousSearch ? "input" : "change";
    const newEventName = oldEventName === "input" ? "change" : "input";

    this.searchInput.removeEventListener(oldEventName, this.handleInputChange);
    this.searchInput.addEventListener(newEventName, this.handleInputChange);
  }

  protected render(): TemplateResult {
    return html`
      <div style="width:96.5%">
        <input placeholder="Start typing to filter..." />
        <div class="filter-icon">${unsafeSVG(filterIcon)}</div>        
        ${this.continuousSearch
        ? nothing
        : html`<button @click=${this.emitSearchEvent}>
              ${msg("Search")}
            </button>`}
      </div>
    `;
  }

  private handleInputChange = (ev: Event): void => {
    this.currentInputValue = (ev.target as HTMLInputElement).value;
    if (this.continuousSearch) this.emitSearchEvent();
  };

  private emitSearchEvent(): void {
    const searchEvent: SearchEvent = new CustomEvent("search", {
      bubbles: false,
      composed: true,
      detail: this.currentInputValue,
    });
    this.dispatchEvent(searchEvent);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: StvSearchField;
  }
}
