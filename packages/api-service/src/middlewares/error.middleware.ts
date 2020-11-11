import * as httpStatus from 'http-status'
import {ResponseBuilder} from "../..";

// handle not found errors
export const notFound = (req: any, res: any, next: any) => {
    if (!res.finished) {
        res.sendStatus(httpStatus.NOT_FOUND)
        res.json(new ResponseBuilder().err('Requested Resource Not Found'))
        res.end()
    }
}

// handle internal server errors
export const internalServerError = (err: any, req: any, res: any, next: any) => {
    if (!res.finished) {
        res.sendStatus(err.status || httpStatus.INTERNAL_SERVER_ERROR)
        res.json(new ResponseBuilder().err(err.message).setMeta(err.extra))
        res.end()
    }
}
