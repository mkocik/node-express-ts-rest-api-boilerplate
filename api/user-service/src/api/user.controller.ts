import {ResponseBuilder} from "@api-template/api-service";
import {Request, Response} from 'express';
import service from "../service";
import {UserService} from "../application/user.service";
import {User} from "../models/user";

export class UserController {
    public create = async (req: Request, res: Response): Promise<any> => {
        const user: User = await User.of(req)
        const result: User = await this.getService().create(user)

        res.status(201).send(new ResponseBuilder(result).setMessage('User created'))
    }

    private getService(): UserService {
        return service.appServices.get(UserService.getType()) as UserService;
    }
}
