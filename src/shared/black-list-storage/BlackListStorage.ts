export class BlackListStorage {
  public async removeAll(): Promise<void> {
    await this.saveBlacklist([]);
  }
  private static STORAGE_KEY = "blacklist";

  public async addDomain(domain: string): Promise<void> {
    const currentList = await this.getBlacklist();
    if (!currentList.includes(domain)) {
      currentList.push(domain);
      await this.saveBlacklist(currentList);
    }
  }

  public async removeDomain(domain: string): Promise<void> {
    const currentList = await this.getBlacklist();
    const updatedList = currentList.filter((item) => item !== domain);
    await this.saveBlacklist(updatedList);
  }

  public async isDomainBlacklisted(domain: string): Promise<boolean> {
    const currentList = await this.getBlacklist();
    return currentList.includes(domain);
  }

  public async getBlacklist(): Promise<string[]> {
    // TODO: investigate get method
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(BlackListStorage.STORAGE_KEY, (result) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(result[BlackListStorage.STORAGE_KEY] || []);
        }
      });
    });
  }

  private async saveBlacklist(blacklist: string[]): Promise<void> {
    await chrome.storage.local.set({
      [BlackListStorage.STORAGE_KEY]: blacklist,
    });
  }
}
