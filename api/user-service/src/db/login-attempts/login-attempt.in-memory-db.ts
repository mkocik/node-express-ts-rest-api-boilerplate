import {LoginAttemptDbModel} from "./interfaces/login-attempt-db-model";
import {LoginAttemptDatabase} from "./interfaces/login-attempt-database";
import {Email} from "../../common/email";
import {UUID} from "../../common/UUID";

export class LoginAttemptInMemoryDb implements LoginAttemptDatabase {
    private readonly _loginAttempts: LoginAttemptDbModel[] = [];

    async create(email: Email): Promise<void> {
        this._loginAttempts.push({email: email.getValue(), id: UUID.create()} as LoginAttemptDbModel)
    }
}
