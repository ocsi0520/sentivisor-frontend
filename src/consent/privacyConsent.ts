import { ConsentStorage } from "#shared/consent/ConsentStorage";
import { MessageMediator } from "#shared/MessageMediator";
const consentStorage = new ConsentStorage();
const messageMediator = new MessageMediator();

document.getElementById("accept")!.addEventListener("click", async () => {
  await consentStorage.setConsent(true);
  messageMediator.send("consentChange", true);
  document.getElementById("consent-container")!.style.display = "none";
  document.getElementById("thank-you-container")!.style.display = "block";
});

document.getElementById("decline")!.addEventListener("click", async () => {
  await consentStorage.setConsent(false);
  messageMediator.send("consentChange", false);
  // we need a setTimeout with 100ms, otherwise the window is closed before
  // the message could make it to sidepanel (in case it is open)
  setTimeout(() => { window.close(); }, 100);
});

document.getElementById("continue")!.addEventListener("click", () => {
  window.close();
});
