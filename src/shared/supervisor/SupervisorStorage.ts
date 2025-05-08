import { isValidSupervisionMode, SupervisionMode } from "./supervision-mode";

type SupervisorStoragePart = {
  supervisionMode: SupervisionMode;
};

export class SupervisorStorage {
  private static SUPERVISION_MODE_KEY = "supervisionMode" as const;
  public async setVisionMode(visionMode: SupervisionMode): Promise<void> {
    await chrome.storage.local.set({
      [SupervisorStorage.SUPERVISION_MODE_KEY]: visionMode,
    });
  }

  public async getVisionMode(): Promise<SupervisionMode> {
    const { supervisionMode } =
      await chrome.storage.local.get<SupervisorStoragePart>(
        SupervisorStorage.SUPERVISION_MODE_KEY
      );

    return isValidSupervisionMode(supervisionMode)
      ? supervisionMode
      : SupervisionMode.off;
  }
}
