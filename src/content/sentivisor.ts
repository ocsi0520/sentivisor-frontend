import { EmotionScores } from "#shared/emotion-scores";
import { ConsultantProvider } from "./Consultant/ConsultantProvider";
import { SupervisorProvider } from "./Supervisor/SupervisorProvider";

export class Sentivisor {
  constructor(
    private consultantProvider: ConsultantProvider,
    private superVisorProvider: SupervisorProvider
  ) {}

  public async handleEmotionAnalysis(
    sentimentData: EmotionScores
  ): Promise<void> {
    const selectedConsultant = this.consultantProvider.provideConsultant();
    const evaluationResult = await selectedConsultant.evaluate(sentimentData);

    const selectedSupervisor = await this.superVisorProvider.provide();
    await selectedSupervisor.act(evaluationResult);
  }
}
