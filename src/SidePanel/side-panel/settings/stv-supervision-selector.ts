import { container } from "tsyringe";
import { css, html, LitElement, TemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js";
import {
  commonStyle,
  structuralStyles,
} from "../../shared-styles/common.style";
import { localized, msg } from "@lit/localize";
import {
  isValidSupervisionMode,
  SupervisionMode,
} from "#shared/supervisor/supervision-mode";
import { SupervisorStorage } from "#shared/supervisor/SupervisorStorage";
import { getDisposeDispatcher } from "#shared/ui-related/dispose-event";

const tagName = "stv-supervision-selector" as const;

@localized()
@customElement(tagName)
export class StvSupervisionSelector extends LitElement {
  public static styles = [
    commonStyle,
    structuralStyles,
    css`
      option {
        width: 16.67%;
      }

      input[type="range"] {
        cursor: pointer;
        -webkit-appearance: none;
        appearance: none;
        width: 90%;
        background: #dee2e6;
        border-radius: 6px;
        outline: none;
        transition: background 0.3s;
        height: 6px;
      }

      input[type="range"]:hover {
        background: #ced4da;
      }

      datalist {
        font-size: 13px;
        padding: 6px 0;
        display: flex;
        justify-content: space-between;
        color: var(--text-color);
        gap: 20px;
      }

      p {
        
        color: var(--text-color);
      }

      .form-range::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 10px;
        height: 20px;
        background: var(--text-color);
        cursor: pointer;
        margin-bottom: 14px;
        border-radius: 6px;
      }

      .form-range::-moz-range-thumb {
        appearance: none;
        margin-bottom: 14px;
        border-radius: 6px;
        width: 20px;
        height: 20px;
        background: var(--text-color);
        cursor: pointer;
      }
      div[slot="tooltip"],
      div[slot="modal"] {
        color: var(--text-color);
      }
      div[slot="modal"] {
        position: relative;
        padding: 8px 32px 16px 24px;
        font-size: 14px;
      }
      div[slot="modal"] li {
        font-size: 13px;
        line-height: 1.4em;
      }
      div[slot="modal"] ul {
        flex-direction: column;
        display: flex;
        gap: 14px;
        padding-inline-start: 20px;
      }
      div[slot="modal"] button {
        border: none;
        background-color: transparent;
        position: absolute;
        top: 10px;
        right: 10px;
        cursor: pointer;
      }
      div[slot="tooltip"] {
        color: var(--text-color);
        background-color: var(--background-color);
        border: 1px solid #888888;
        border-radius: 10px;
        padding: 6px;
        font-size: 13px;
      }
    `,
  ];

  private inputId = "stv-svs";
  private listId = "tickmarks";
  private supervisorStorage = container.resolve(SupervisorStorage);

  @state()
  private supervisionMode: SupervisionMode | undefined;

  // TODO: install @lit/task and make loading indicator properly
  public async connectedCallback(): Promise<void> {
    super.connectedCallback();
    this.supervisionMode =
      (await this.supervisorStorage.getVisionMode()) || SupervisionMode.off;
  }

  protected render(): TemplateResult {
    return html`${this.renderLabel()} ${this.renderInput()}`;
  }

  private renderLabel(): TemplateResult {
    return html`
      <div class="d-flex align-items-center">
        <div class="w-50 text-start">
          <p>Supervision mode</p>
        </div>
        <div class="w-50 text-end">
          <stv-prompter>
            <div slot="tooltip">
              <p>Controls how Sentivisor interacts with page content. 
              Choose a mode to see, warn, or block content. Click for full help.</p>
            </div>
            <div slot="modal" class="text-start">
              <h2>Supervision modes</h2>
              <p>The slider controls how Sentivisor interacts with web content. The settings are:</p>
              <ul>
                <li><strong>Off:</strong> The extension is completely passive; it does nothing to the web page content.</li>
                <li><strong>Collect:</strong> Analyzes the displayed content and shows sentiment scores in the side panel chart.</li>
                <li><strong>Inform:</strong> Discreetly shows an emoji on the page indicating the main emotional tone of the content.</li>
                <li><strong>Warning:</strong> Covers the content with a warning message; you decide whether to view the page.</li>
                <li><strong>Strict:</strong> Blocks the content completely if it is deemed harmful to mental health.</li>
              </ul>
              <button @click=${getDisposeDispatcher()}>X</button>
            </div>
          </stv-prompter>
        </div>
      </div>
    `;
  }

  private renderInput(): TemplateResult {
    if (this.supervisionMode === undefined)
      return html`<stv-loading-indicator></stv-loading-indicator>`;

    return html`
      <div class="text-center">
        <input
          type="range"
          class="form-range"
          list=${this.listId}
          min="0"
          max="4"
          step="1"
          value=${this.supervisionMode}
          id=${this.inputId}
          @input=${this.applyChange}
        />
        <datalist id=${this.listId}>
          <option label="${msg("off")}"></option>
          <option label="${msg("collect")}"></option>
          <option label="${msg("inform")}"></option>
          <option label="${msg("warning")}"></option>
          <option label="${msg("strict")}"></option>
        </datalist>
      </div>
    `;
  }

  private async applyChange(event: InputEvent): Promise<void> {
    const typedTarget = event.target as HTMLInputElement;
    const newSupervisionMode = Number(typedTarget.value);

    if (!isValidSupervisionMode(newSupervisionMode))
      throw new Error("invalid super vision mode");

    await this.supervisorStorage.setVisionMode(newSupervisionMode);
    this.supervisionMode = newSupervisionMode;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: StvSupervisionSelector;
  }
}
