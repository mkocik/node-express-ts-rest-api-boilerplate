import {UUID} from "../../common/UUID";
import {RefreshTokenDatabase} from "./interfaces/refresh-token-database";
import {RefreshToken} from "../../models/refresh-token";
import {RefreshTokenDbModel} from "./interfaces/refresh-token-db-model";

export class RefreshTokenInMemoryDb implements RefreshTokenDatabase {
    private readonly _refreshTokens: RefreshTokenDbModel[] = [];

    async create(token: RefreshToken): Promise<RefreshToken> {
        token.id = UUID.create();
        this._refreshTokens.push(token.mapModelToDb());
        return Promise.resolve(token);
    }

    async get(token: string): Promise<RefreshToken | null> {
        const res: RefreshTokenDbModel | undefined = this._refreshTokens.find(x => x.token === token);
        return res ? RefreshToken.ofDBModel(res) : null;
    }

    async revoke(id: UUID | undefined, ip: string): Promise<void> {
        const res: RefreshTokenDbModel | undefined = this._refreshTokens.find(x => x.id === id?.getValue());
        if (res) {
            res.revokedByIp = ip;
            res.revokedAt = Date.now();
        }
    }

    async revokeForToken(accessToken: string | undefined, ip: string): Promise<void> {
        const res: RefreshTokenDbModel | undefined = this._refreshTokens.find(x => x.forAccessToken === accessToken);
        if (res) {
            res.revokedByIp = ip;
            res.revokedAt = Date.now();
        }
    }
}
