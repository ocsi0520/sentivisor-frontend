import { css, html, LitElement, TemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js";
import {
  commonStyle,
  structuralStyles,
} from "../../shared-styles/common.style";
import { container } from "tsyringe";
import { BlackListStorage } from "#shared/black-list-storage/BlackListStorage";
import { localized, msg } from "@lit/localize";
import { SearchEvent } from "../../shared/search-event";
import { MessageMediator, Unsubscribe } from "#shared/MessageMediator";
import { getActiveTab } from "#shared/utils";
import { getDisposeDispatcher } from "#shared/ui-related/dispose-event";
import { CHROME_GLOBAL_VARIABLE } from "../../dependency-injection/dom-symbols";

const tagName = "stv-user-black-list" as const;

// TODO: currently from this component we don't emit blackListChange event

@localized()
@customElement(tagName)
export class StvUserBlackList extends LitElement {
  public static styles = [
    commonStyle,
    structuralStyles,
    css`
      stv-loading-indicator {
        margin: 0 auto;
      }
      * {
        color: var(--text-color);
      }
      .card {
        margin-top: 1rem;
      }
      .card-content {
        padding-left: 10px;
        width: 97.2%;
      }
      ul {
        padding-left: 10px;
        margin: 10px 0;
      }
      svg {
        width: 16px;
        height: 16px;
      }

      div[slot="tooltip"] {
        background-color: lightblue;
        color: rebeccapurple;
      }
    `,
  ];

  private messageMediator = container.resolve(MessageMediator);

  private blackListService = container.resolve(BlackListStorage);

  private chromeInstance = container.resolve<typeof chrome>(
    CHROME_GLOBAL_VARIABLE
  );

  @state()
  private userBlackList: Array<string> | undefined;

  @state()
  private searchTerm: string = "";
  private async addCurrentDomain(): Promise<void> {
    this.userBlackList = undefined;
    const activeTab = await getActiveTab(this.chromeInstance.tabs);
    const primaryDomain = await this.messageMediator.send(
      "getPrimaryDomain",
      undefined,
      activeTab.id
    );
    await this.blackListService.addDomain(primaryDomain);
    await this.loadList();
  }

  private get filteredList(): Array<string> | undefined {
    if (!this.userBlackList) return undefined;

    if (!this.searchTerm) return this.userBlackList;

    return this.userBlackList.filter((listItem) =>
      listItem.includes(this.searchTerm)
    );
  }

  private unsubscribe?: Unsubscribe;

  public async connectedCallback(): Promise<void> {
    super.connectedCallback();
    this.unsubscribe = this.messageMediator.listen(
      "blackListChange",
      async () => {
        this.userBlackList = undefined;
        await this.loadList();
      }
    );
    await this.loadList();
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    this.unsubscribe?.();
  }

  protected render(): TemplateResult {
    return html`
      <div class="card shadow-sm">
        <div class="d-flex align-items-center card-content">
          <div class="w-50 text-start">
            <p>${msg("Ignored Domains")}</p>
          </div>
          <div class="w-50 text-end">
            <stv-prompter>
              <div slot="tooltip">
                <p>These are the domains which we should not evaluate.</p>
              </div>
              <div slot="modal">
                <p>This should be a modal content</p>
                <button @click=${getDisposeDispatcher()}>Close this</button>
              </div>
            </stv-prompter>
          </div>
        </div>
        ${this.renderListSection()}
      </div>
    `;
  }

  private renderListSection(): TemplateResult {
    return this.userBlackList
      ? this.renderList()
      : this.renderLoadingIndicator();
  }

  private renderLoadingIndicator(): TemplateResult {
    return html`<stv-loading-indicator></stv-loading-indicator>`;
  }

  private renderList(): TemplateResult {
    return html`
      <!-- TODO: make attribute for continuousSearch -->
      <stv-search-field
        .continuousSearch=${true}
        @search=${this.setSearchTerm}
      ></stv-search-field>
      <ul>
        ${this.filteredList!.map((listItem) => this.renderListItem(listItem))}
      </ul>
      <button @click=${this.addCurrentDomain}>
        ${msg("Add current domain")}
      </button>
    `;
  }

  private renderListItem(blackListItem: string): TemplateResult {
    return html`<stv-user-black-list-item
      .item=${blackListItem}
      @remove-item=${() => this.removeItem(blackListItem)}
    ></stv-user-black-list-item>`;
  }

  private setSearchTerm(ev: SearchEvent): void {
    this.searchTerm = ev.detail;
  }

  private async removeItem(blackListItem: string): Promise<void> {
    this.userBlackList = undefined;
    await this.blackListService.removeDomain(blackListItem);
    await this.loadList();
  }

  private async loadList(): Promise<void> {
    this.userBlackList = Array.from(await this.blackListService.getBlacklist());
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: StvUserBlackList;
  }
}
