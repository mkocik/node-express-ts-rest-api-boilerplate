import {decode, sign} from "jsonwebtoken";
import {config} from "dotenv";
import {UUID} from "./UUID";
import {v4 as uuid} from 'uuid';
import {Role} from "./role";

config();

export class JwtToken {
    private readonly token: string;
    private readonly expires: number;
    private readonly revokedAt: number | undefined
    private readonly revokedByIp: string | undefined;

    constructor(token: string, expires: number, revokedAt: number | undefined = undefined, revokedByIp: string | undefined = undefined) {
        this.token = token;
        this.expires = expires;
        this.revokedAt = revokedAt;
        this.revokedByIp = revokedByIp;
    }

    public static decode(token: string): { id: string, role: string, exp: number } {
        return decode(token) as { id: string, role: string, exp: number };
    }

    public static loginAndGetAccessToken(id: UUID, role: Role): JwtToken {
        const token = sign({id: id.getValue(), role: role}, process.env.JWT_SECRET as string, {expiresIn: '15m'});
        const tokenDecoded = JwtToken.decode(token);

        return new JwtToken(token, tokenDecoded.exp);
    }

    /* expires in 24h by default (refresh-token lifespan) */
    public static create(expires: number = Date.now() + 24 * 60 * 60 * 1000): JwtToken {
        return new JwtToken(uuid(), expires);
    }

    public getToken(): string {
        return this.token;
    }

    public getExpires(): number {
        return this.expires;
    }

    public getRevokedAt(): number | undefined {
        return this.revokedAt;
    }

    public getRevokedByIp(): string | undefined {
        return this.revokedByIp;
    }

    /* method called while sending the model as API response */
    public toJSON(): any {
        return {
            token: this.token,
            expires: this.expires
        }
    }
}
