import {UUID} from "../common/UUID";
import {Email} from "../common/email";
import {UserDbModel} from "../db/user/interfaces/user-db-model";
import {Password} from "../common/password";
import {UserAuthModel} from "./interfaces/user-auth.model";
import {Request} from 'express';

/**
 * @swagger
 *  components:
 *    schemas:
 *      User:
 *        type: object
 *        required:
 *          - email
 *          - firstName
 *          - lastName
 *          - password
 *        properties:
 *          id:
 *            type: string
 *          email:
 *            type: string
 *          password:
 *            type: string
 *          firstName:
 *            type: string
 *          lastName:
 *            type: string
 *        example:
 *           email: john.doe@example.com
 *           firstName: John
 *           lastName: Doe
 *           password: qwerty
 */
export class User implements UserAuthModel {
    id: UUID | undefined;
    firstName: string;
    lastName: string;
    email: Email;
    password: Password;

    static async of(req: Request): Promise<User> {
        const body = req.body;
        return new User(body.firstName, body.lastName, Email.of(body.email), await Password.of(body.password));
    }

    public static ofDBModel(model: UserDbModel): User {
        const user = new User(model.firstName, model.lastName, Email.of(model.email), Password.ofHash(model.password));
        user.id = UUID.of(model._id);

        return user
    }

    public static ofNullableDBModel(model: UserDbModel | null): User | null {
        if (!model) return model;
        return User.ofDBModel(model);
    }

    public mapModelToDb(): UserDbModel {
        return {
            _id: this.id?.getValue(), email: this.email.getValue(),
            firstName: this.firstName, lastName: this.lastName
        } as UserDbModel
    }

    constructor(firstName: string, lastName: string, email: Email, password: Password) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
    }

    /* method called while sending the model as API response */
    public toJSON(): any {
        return {
            email: this.email.getValue(),
            firstName: this.firstName,
            lastName: this.lastName,
            id: this.id?.getValue()
        }
    }

    getPassword(): Password | undefined {
        return this.password;
    }

    getId(): UUID | undefined {
        return this.id;
    }
}
