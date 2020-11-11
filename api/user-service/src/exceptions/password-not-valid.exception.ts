import {CustomException} from "@api-template/api-service";

export class PasswordNotValidException extends CustomException {
    constructor() {
        super("Password not valid");
    }
}
