import {UserDatabase} from "./interfaces/user-database";
import {User} from "../../models/user";
import {Email} from "../../common/email";
import {UUID} from "../../common/UUID";
import {UserAuthModel} from "../../models/interfaces/user-auth.model";

export class UserInMemoryDatabase implements UserDatabase {
    private users: User[] = [];

    create(user: User): Promise<User> {
        user.id = UUID.create();
        this.users.push(user);

        return Promise.resolve(user);
    }

    isEmailUnique(email: Email): Promise<boolean> {
        return Promise.resolve(!this.users.find(x => x.email.getValue() === email.getValue()));
    }

    emailExists(email: Email): Promise<boolean> {
        return Promise.resolve(!!this.users.find(x => x.email.getValue() === email.getValue()));
    }

    getByEmail(email: Email): Promise<UserAuthModel | null> {
        const user: UserAuthModel | undefined = this.users.find(x => x.email.getValue() === email.getValue());
        return Promise.resolve(user ? user : null);
    }
}
