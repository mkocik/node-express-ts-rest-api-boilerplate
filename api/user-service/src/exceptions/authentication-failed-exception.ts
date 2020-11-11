import {CustomException} from "@api-template/api-service";

export class AuthenticationFailedException extends CustomException {
    constructor() {
        super("Authentication failed");
    }
}
