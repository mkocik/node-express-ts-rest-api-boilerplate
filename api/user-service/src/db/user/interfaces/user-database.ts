import {User} from "../../../models/user";
import {Email} from "../../../common/email";
import {AuthDatabase} from "../../auth/interfaces/auth-database";

export interface UserDatabase extends AuthDatabase {
    isEmailUnique(email: Email): Promise<boolean>
    create(user: User): Promise<User>
}
