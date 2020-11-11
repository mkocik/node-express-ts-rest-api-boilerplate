import mongoose, {Model} from "mongoose";
import {UUID} from "../../common/UUID";
import {LoginAttemptDbModel} from "./interfaces/login-attempt-db-model";
import {LoginAttemptDatabase} from "./interfaces/login-attempt-database";
import {Email} from "../../common/email";

const loginAttemptSchema = new mongoose.Schema({
        _id: {
            type: String, default: function genUUID() {
                return UUID.create().getValue()
            }
        },
        email: String
    },
    {
        timestamps: true
    });

export class LoginAttemptMongoDb implements LoginAttemptDatabase {
    private readonly _loginAttemptConstructor: Model<LoginAttemptDbModel>;

    constructor() {
        this._loginAttemptConstructor = mongoose.model<LoginAttemptDbModel>('login_attempt', loginAttemptSchema);
    }

    async create(email: Email): Promise<void> {
        const loginAttempt = new this._loginAttemptConstructor({email: email.getValue()});
        loginAttempt.save();
    }
}
