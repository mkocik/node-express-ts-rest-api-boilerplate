export interface DomainEvent {
}

export interface DomainEventSubscriber {
    handle(event: DomainEvent): void
    canHandle(event: DomainEvent): boolean
}


export interface DomainEventPublisher {
    publish(event: DomainEvent): void
    subscribe(subscriber: DomainEventSubscriber): void
}

export class ForwardDomainEventPublisher implements DomainEventPublisher {
    private subscribers: DomainEventSubscriber[] = [];

    subscribe(subscriber: DomainEventSubscriber) {
        this.subscribers.push(subscriber);
    }

    publish(event: DomainEvent): void {
        this.subscribers.forEach(async (subscriber) => subscriber.canHandle(event) ? await subscriber.handle(event) : null)
    }
}
