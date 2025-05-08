import { BlackListStorage } from "#shared/black-list-storage/BlackListStorage";
import { NoActSupervisor } from "./NoActSupervisor";
import { Supervisor } from "./Supervisor";
import { SupervisionMode } from "#shared/supervisor/supervision-mode";
import { SupervisorStorage } from "#shared/supervisor/SupervisorStorage";
import { InterveneSupervisor } from "./content-intervene/InterveneSupervisor";
import { ModalIntervener } from "./content-intervene/modal/ModalIntervener";
import { TemplateStringTranslator } from "./content-intervene/translation/TemplateStringTranslator";
import { IconIntervener } from "./content-intervene/icon/IconIntervener";
import { MessageMediator } from "#shared/MessageMediator";

export class SupervisorProvider {
  private static WARNING_HARMFULNESS_THRESHOLD = 0.8;
  constructor(
    private supervisorStorage: SupervisorStorage,
    private blacklistStorage: BlackListStorage
  ) {}

  public async provide(): Promise<Supervisor> {
    const supervisionMode = await this.supervisorStorage.getVisionMode();
    switch (supervisionMode) {
      case SupervisionMode.off:
      case SupervisionMode.collect:
        return new NoActSupervisor();

      case SupervisionMode.inform:
        return this.createSupervisorForInformMode();
      case SupervisionMode.warning:
        return this.createModalSupervisor(true);
      case SupervisionMode.strict:
        return this.createModalSupervisor(false);
      default:
        throw new Error("invalid super vision number");
    }
  }
  public createSupervisorForInformMode(): Supervisor {
    return new InterveneSupervisor(
      new IconIntervener(window.document),
      this.blacklistStorage,
      new MessageMediator(),
      window
    );
  }
  private createModalSupervisor(isAllowedToContinue: boolean): Supervisor {
    return new InterveneSupervisor(
      new ModalIntervener(
        window.document,
        new TemplateStringTranslator(),
        isAllowedToContinue
      ),
      this.blacklistStorage,
      new MessageMediator(),
      window,
      SupervisorProvider.WARNING_HARMFULNESS_THRESHOLD
    );
  }
}
