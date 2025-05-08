import { HarmfulnessEvaluation } from "../HarmfulnessEvaluation";
import { Supervisor } from "./Supervisor";

export class NoActSupervisor implements Supervisor {
  public act(_harmfulnessEvaluation: HarmfulnessEvaluation): Promise<void> {
    return Promise.resolve();
  }
}
