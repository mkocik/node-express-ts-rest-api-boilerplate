import {UserDatabase} from "./interfaces/user-database";
import {User} from "../../models/user";
import {Email} from "../../common/email";
import mongoose, {Model} from "mongoose";
import {UserDbModel} from "./interfaces/user-db-model";
import {UUID} from "../../common/UUID";
import {UserAuthModel} from "../../models/interfaces/user-auth.model";

const userSchema = new mongoose.Schema({
        _id: {
            type: String, default: function genUUID() {
                return UUID.create().getValue()
            }
        },
        firstName: String,
        lastName: String,
        email: {type: String, unique: true},
        password: String
    },
    {
        timestamps: true
    });

export class UserMongoDb implements UserDatabase {
    private readonly _userDB: Model<UserDbModel>;

    constructor() {
        this._userDB = mongoose.model<UserDbModel>('user', userSchema);
    }

    async create(user: User): Promise<User> {
        const createdUser: UserDbModel = await this._userDB.create(user.mapModelToDb());
        return User.ofDBModel(createdUser);
    }

    async isEmailUnique(email: Email): Promise<boolean> {
        return !await this._userDB.findOne({email: email.getValue()});
    }

    async emailExists(email: Email): Promise<boolean> {
        return !!await this._userDB.findOne({email: email.getValue()});
    }

    async getByEmail(email: Email): Promise<UserAuthModel | null> {
        const user = await this._userDB.findOne({email: email.getValue()});
        return User.ofNullableDBModel(user);
    }
}
