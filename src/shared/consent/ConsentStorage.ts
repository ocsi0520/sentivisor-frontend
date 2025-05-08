type ConsentStoragePart = {
  consent?: boolean;
};

export class ConsentStorage {
  private static CONSENT_KEY = "consent" as const;
  public async setConsent(isAccepted: boolean): Promise<void> {
    const newStorageValue: ConsentStoragePart = {
      [ConsentStorage.CONSENT_KEY]: isAccepted,
    };
    await chrome.storage.local.set<ConsentStoragePart>(newStorageValue);
  }

  public async getConsent(): Promise<boolean> {
    const { consent } = await chrome.storage.local.get<ConsentStoragePart>(
      ConsentStorage.CONSENT_KEY
    );

    return consent || false;
  }
}
