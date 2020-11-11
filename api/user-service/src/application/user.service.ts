import {DomainEventPublisher} from "@api-template/domain-event-publisher";
import {UserDatabase} from "../db/user/interfaces/user-database";
import {EmailNotUniqueException} from "../exceptions/email-not-unique.exception";
import {User} from "../models/user";
import {UserCreated} from "../events/user-created";

export class UserService {
    private readonly userDatabase: UserDatabase;
    private readonly publisher: DomainEventPublisher;

    public static getType() {
        return "USER_SERVICE";
    }

    public getDatabase(): UserDatabase {
        return this.userDatabase;
    }

    public constructor(userDatabase: UserDatabase, publisher: DomainEventPublisher) {
        this.userDatabase = userDatabase;
        this.publisher = publisher;
    }

    public async create(user: User): Promise<User> {
        if (!await this.userDatabase.isEmailUnique(user.email)) {
            throw new EmailNotUniqueException();
        }

        return await this.createNewUser(user);
    }

    private async createNewUser(user: User): Promise<User> {
        const newPendingRegistration: User = await this.userDatabase.create(user);
        this.publisher.publish(new UserCreated(user.email));
        return newPendingRegistration;
    }
}
