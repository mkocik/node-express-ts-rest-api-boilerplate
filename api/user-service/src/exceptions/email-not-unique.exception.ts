import {CustomException} from "@api-template/api-service";

export class EmailNotUniqueException extends CustomException {
    constructor() {
        super("Email is not unique");
    }
}
