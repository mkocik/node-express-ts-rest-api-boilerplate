import {UUID} from "../common/UUID";
import {RefreshTokenDbModel} from "../db/auth/interfaces/refresh-token-db-model";
import {JwtToken} from "../common/jwt-token";

export class RefreshToken {
    id: UUID | undefined;
    userId: UUID;
    token: JwtToken;
    createdByIp: string;
    forAccessToken: string;

    public static create(userId: UUID, ip: string, accessToken: string): RefreshToken {
        return new RefreshToken(userId, JwtToken.create(), ip, accessToken)
    }

    public static ofDBModel(model: RefreshTokenDbModel): RefreshToken {
        const token = new RefreshToken(
            UUID.of(model.userId),
            new JwtToken(model.token, model.expires, model.revokedAt, model.revokedByIp),
            model.createdByIp, model.forAccessToken);
        token.id = UUID.of(model._id);

        return token
    }

    public static ofNullableDBModel(model: RefreshTokenDbModel | null): RefreshToken | null {
        if(!model) return model;

        return RefreshToken.ofDBModel(model);
    }

    public mapModelToDb(): RefreshTokenDbModel {
        return {
            _id: this.id?.getValue(),
            userId: this.userId.getValue(),
            token: this.token.getToken(),
            expires: this.token.getExpires(),
            createdByIp: this.createdByIp,
            revokedAt: this.token.getRevokedAt(),
            revokedByIp: this.token.getRevokedByIp(),
            forAccessToken: this.forAccessToken
        } as RefreshTokenDbModel
    }

    public constructor(userId: UUID, token: JwtToken, createdByIp: string, forAccessToken: string) {
        this.userId = userId;
        this.token = token;
        this.createdByIp = createdByIp;
        this.forAccessToken = forAccessToken;
    }

    /* method called while sending the model as API response */
    public toJSON(): any {
        return this.token
    }
}
