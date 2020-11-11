import {ResponseBuilder} from "@api-template/api-service";
import {Request, Response} from 'express';
import service from "../service";
import {Email} from "../common/email";
import {UserService} from "../application/user.service";
import {AuthenticationService} from "../application/authentication.service";
import {getToken} from "../middlewares/auth.middleware";
import {Role} from "../common/role";

export class AuthController {
    public login = async (req: Request, res: Response): Promise<any> => {
        const [accessToken, refreshToken] = await this.getAuthService().login(
            Email.of(req.body.email),
            req.body.password,
            req.ip,
            Role.DEFAULT,
            this.getUserService().getDatabase()
        )

        res.status(200).send(new ResponseBuilder({
            accessToken: accessToken,
            refreshToken: refreshToken
        }));
    }

    public refreshToken = async (req: Request, res: Response): Promise<any> => {
        const [accessToken, refreshToken] = await this.getAuthService().refreshToken(req.body.accessToken, req.body.refreshToken, req.ip)

        res.status(200).send(new ResponseBuilder({
            accessToken: accessToken,
            refreshToken: refreshToken
        }));
    }

    public logout = async (req: Request, res: Response): Promise<any> => {
        // @ts-ignore header already checked in the auth middleware
        await this.getAuthService().logout(getToken(req.headers.authorization), req.ip)
        res.status(204).send();
    }

    private getUserService(): UserService {
        return service.appServices.get(UserService.getType()) as UserService;
    }

    private getAuthService(): AuthenticationService {
        return service.appServices.get(AuthenticationService.getType()) as AuthenticationService;
    }
}
