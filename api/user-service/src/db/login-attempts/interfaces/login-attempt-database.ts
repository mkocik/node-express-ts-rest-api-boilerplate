import {Email} from "../../../common/email";

export interface LoginAttemptDatabase {
    create(email: Email): Promise<void>
}
