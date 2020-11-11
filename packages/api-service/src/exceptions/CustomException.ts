import {UNPROCESSABLE_ENTITY} from 'http-status'

export class CustomException extends Error {
    public ERROR_CODE: number = UNPROCESSABLE_ENTITY;

    constructor(msg: string) {
        super(msg);
    }
}
