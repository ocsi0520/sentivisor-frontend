import { BlackListStorage } from "#shared/black-list-storage/BlackListStorage";
import { getPrimaryDomain } from "../../contentUtils";
import { MessageMediator } from "#shared/MessageMediator";
import { HarmfulnessEvaluation } from "../../HarmfulnessEvaluation";
import { Supervisor } from "../Supervisor";
import { Intervener } from "./Intervener";

// TODO: type-safe event name strings with ModalIntervener
export class InterveneSupervisor implements Supervisor {
  constructor(
    private intervener: Intervener,
    private blacklistStorage: BlackListStorage,
    private messageMediator: MessageMediator,
    private window: Window,
    // if no threshold is set we all the time act
    private harmfulnessThreshold = 0
  ) {}

  public async act(
    harmfulnessEvaluation: HarmfulnessEvaluation
  ): Promise<void> {
    if (harmfulnessEvaluation.harmfulnessScore <= this.harmfulnessThreshold)
      return;

    const shadowHost = this.intervener.getShadowHost(harmfulnessEvaluation);

    shadowHost.addEventListener("add-to-blacklist", async (): Promise<void> => {
      this.blacklistStorage.addDomain(getPrimaryDomain());
      // TODO: this should be an aspect (aspect-oriented programming) to BlackListStorage
      this.messageMediator.send("blackListChange", undefined);
      shadowHost.remove();
    });
    shadowHost.addEventListener("navigate-away", () => {
      this.window.location.href = "https://www.google.com";
    });
    shadowHost.addEventListener("dispose", () => {
      shadowHost.remove();
    });
    // TODO: check whether beforeend or afterbegin
    this.window.document.body.insertAdjacentElement("beforeend", shadowHost);
  }
}
