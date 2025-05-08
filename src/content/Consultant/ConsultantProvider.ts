import { Consultant } from "./Consultant";
import { DefaultConsultant } from "./DefaultConsultant";

export class ConsultantProvider {
  public provideConsultant(): Consultant {
    return new DefaultConsultant();
  }
}
