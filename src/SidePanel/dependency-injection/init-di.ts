import { container, Lifecycle } from "tsyringe";
import { BlackListStorage } from "#shared/black-list-storage/BlackListStorage";
import { MessageMediator } from "#shared/MessageMediator";
import { SupervisorStorage } from "#shared/supervisor/SupervisorStorage";
import {
  DOCUMENT_SYMBOL,
  LOCAL_STORAGE_SYMBOL,
  WINDOW_SYMBOL,
} from "./dom-symbols";
import { ConsentStorage } from "#shared/consent/ConsentStorage";

container.register(LOCAL_STORAGE_SYMBOL, { useValue: localStorage });
container.register(WINDOW_SYMBOL, { useValue: window });
container.register(DOCUMENT_SYMBOL, { useValue: document });

container.register(BlackListStorage, BlackListStorage, {
  lifecycle: Lifecycle.Singleton,
});
container.register(MessageMediator, MessageMediator, {
  lifecycle: Lifecycle.Singleton,
});
container.register(SupervisorStorage, SupervisorStorage, {
  lifecycle: Lifecycle.Singleton,
});
container.register(ConsentStorage, ConsentStorage, {
  lifecycle: Lifecycle.Singleton,
});
