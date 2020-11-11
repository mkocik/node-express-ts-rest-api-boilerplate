import {Request, Response} from 'express'
import {validationResult} from 'express-validator'
import {INTERNAL_SERVER_ERROR, UNPROCESSABLE_ENTITY, NOT_FOUND} from 'http-status'
import {ResponseBuilder} from "../..";

enum ValidationErrors {
    VALUE_DOES_NOT_EXIST = 'Value does not exist',
}

const CUSTOM_STATUS_CODES_MAPPING: any = {
    [ValidationErrors.VALUE_DOES_NOT_EXIST]: NOT_FOUND,
}

export const route = (func: any) => {
    return (req: Request, res: Response, next: () => void) => {
        const errors: any = validationResult(req)

        /* validate custom status codes errors */
        for (const errorKey of Object.keys(CUSTOM_STATUS_CODES_MAPPING)) {
            const validationErrors: any = errors.array().filter((x: any) => x.msg === errorKey)
            if (validationErrors.length > 0) {
                return res
                    .status(CUSTOM_STATUS_CODES_MAPPING[errorKey])
                    .send(
                        new ResponseBuilder().err(
                            'Validation failed',
                            validationErrors
                        )
                    )
            }
        }

        /* validate all generic errors */
        if (!errors.isEmpty()) {
            return res
                .status(UNPROCESSABLE_ENTITY)
                .send(
                    new ResponseBuilder().err('Validation failed', errors.array())
                )
        }

        /* process function and catch internal server errors */
        func(req, res, next).catch((err: any) => {
            res
                .status(err.ERROR_CODE ? err.ERROR_CODE : INTERNAL_SERVER_ERROR)
                .send(new ResponseBuilder().err(err.toString()))
        })
    }
}
