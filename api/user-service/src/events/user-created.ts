import {DomainEvent} from "@api-template/domain-event-publisher";
import {Email} from "../common/email";

export class UserCreated implements DomainEvent {
    email: Email

    constructor(email: Email) {
        this.email = email;
    }
}
