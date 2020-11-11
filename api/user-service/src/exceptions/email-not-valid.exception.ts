import {CustomException} from "@api-template/api-service";

export class EmailNotValidException extends CustomException {
    constructor() {
        super("Email is not valid");
    }
}
