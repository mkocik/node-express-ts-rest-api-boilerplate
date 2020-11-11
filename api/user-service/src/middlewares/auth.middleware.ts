import {Request, Response} from 'express';
import {verify} from "jsonwebtoken";
import {config} from "dotenv";
import {ResponseBuilder} from "@api-template/api-service";

config();

export function getToken(bearerToken: string) {
    return bearerToken.split("Bearer ").join("");
}

/**
 * @swagger
 *  components:
 *    securitySchemes:
 *      bearerAuth:
 *        type: http
 *        scheme: bearer
 *        bearerFormat: JWT
 */
export const auth = (func: any) => {
    return (req: Request, res: Response, next: () => void) => {
        try {
            if(req.headers.authorization && verify(getToken(req.headers.authorization), process.env.JWT_SECRET as string)) {
                return func(req, res, next)
            }
        } catch (e) {
            return res.status(401).send(new ResponseBuilder().err('Unauthorized'))
        }

        return res.status(401).send(new ResponseBuilder().err('Unauthorized'))
    }
}

