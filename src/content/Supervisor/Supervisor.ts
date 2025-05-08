import { HarmfulnessEvaluation } from "../HarmfulnessEvaluation";

export interface Supervisor {
  act(harmfulnessEvaluation: HarmfulnessEvaluation): Promise<void>;
}
