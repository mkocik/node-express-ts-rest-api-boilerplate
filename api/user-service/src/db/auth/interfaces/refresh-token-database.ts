import {RefreshToken} from "../../../models/refresh-token";
import {UUID} from "../../../common/UUID";

export interface RefreshTokenDatabase {
    create(token: RefreshToken): Promise<RefreshToken>
    revoke(id: UUID | undefined, ip: string): Promise<void>
    revokeForToken(accessToken: string | undefined, ip: string): Promise<void>
    get(token: string): Promise<RefreshToken | null>
}
