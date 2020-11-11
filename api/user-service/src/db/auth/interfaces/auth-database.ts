import {Email} from "../../../common/email";
import {UserAuthModel} from "../../../models/interfaces/user-auth.model";

export interface AuthDatabase {
    emailExists(email: Email): Promise<boolean>
    getByEmail(email: Email): Promise<UserAuthModel | null>
}
