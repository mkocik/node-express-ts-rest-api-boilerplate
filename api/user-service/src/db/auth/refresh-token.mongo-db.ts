import mongoose, {Model} from "mongoose";
import {UUID} from "../../common/UUID";
import {RefreshTokenDbModel} from "./interfaces/refresh-token-db-model";
import {RefreshTokenDatabase} from "./interfaces/refresh-token-database";
import {RefreshToken} from "../../models/refresh-token";

const refreshTokenSchema = new mongoose.Schema({
        _id: {
            type: String, default: function genUUID() {
                return UUID.create().getValue()
            }
        },
        userId: String,
        token: String,
        expires: Number,
        createdByIp: String,
        revokedAt: Number,
        revokedByIp: String,
        forAccessToken: String
    },
    {
        timestamps: true
    });

export class RefreshTokenMongoDb implements RefreshTokenDatabase {
    private readonly _refreshTokenDB: Model<RefreshTokenDbModel>;

    constructor() {
        this._refreshTokenDB = mongoose.model<RefreshTokenDbModel>('refresh_token', refreshTokenSchema);
    }

    async create(token: RefreshToken): Promise<RefreshToken> {
        const created: RefreshTokenDbModel = await this._refreshTokenDB.create(token.mapModelToDb());
        return RefreshToken.ofDBModel(created);
    }

    async get(token: string): Promise<RefreshToken | null> {
        const refreshToken: RefreshTokenDbModel | null = await this._refreshTokenDB.findOne({token: token});
        return RefreshToken.ofNullableDBModel(refreshToken);
    }

    async revoke(id: UUID | undefined, ip: string): Promise<void> {
        await this._refreshTokenDB.findByIdAndUpdate(id?.getValue(), {revokedAt: Date.now(), revokedByIp: ip})
    }

    async revokeForToken(accessToken: string | undefined, ip: string): Promise<void> {
        await this._refreshTokenDB.findOneAndUpdate({forAccessToken: accessToken}, {revokedAt: Date.now(), revokedByIp: ip})
    }
}
