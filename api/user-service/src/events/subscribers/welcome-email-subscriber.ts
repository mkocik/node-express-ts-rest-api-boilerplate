import {DomainEvent, DomainEventSubscriber} from "@api-template/domain-event-publisher";
import {UserCreated} from "../user-created";

export class WelcomeEmailSubscriber implements DomainEventSubscriber {
    handle(event: UserCreated): void {
        // todo send email
    }

    canHandle(event: DomainEvent): boolean {
        return event instanceof UserCreated;
    }
}
