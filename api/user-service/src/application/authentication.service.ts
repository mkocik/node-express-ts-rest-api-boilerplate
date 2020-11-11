import {DomainEventPublisher} from "@api-template/domain-event-publisher";
import {Email} from "../common/email";
import {AuthenticationFailedException} from "../exceptions/authentication-failed-exception";
import {AuthDatabase} from "../db/auth/interfaces/auth-database";
import {UserAuthModel} from "../models/interfaces/user-auth.model";
import {RefreshTokenDatabase} from "../db/auth/interfaces/refresh-token-database";
import {RefreshToken} from "../models/refresh-token";
import {LoginAttemptDatabase} from "../db/login-attempts/interfaces/login-attempt-database";
import {JwtToken} from "../common/jwt-token";
import {UUID} from "../common/UUID";
import {Role} from "../common/role";

export class AuthenticationService {
    private readonly refreshTokenDatabase: RefreshTokenDatabase;
    private readonly loginAttemptsDatabase: LoginAttemptDatabase;
    private readonly publisher: DomainEventPublisher;

    public static getType() {
        return "AUTHENTICATION_SERVICE";
    }

    public constructor(refreshTokenDatabase: RefreshTokenDatabase, loginAttemptsDatabase: LoginAttemptDatabase, publisher: DomainEventPublisher) {
        this.refreshTokenDatabase = refreshTokenDatabase;
        this.loginAttemptsDatabase = loginAttemptsDatabase;
        this.publisher = publisher;
    }

    public async logout(token: string, ip: string) {
        await this.refreshTokenDatabase.revokeForToken(token, ip);
    }

    public async refreshToken(accToken: string, refToken: string, ip: string): Promise<[JwtToken, RefreshToken]> {
        const refreshToken: RefreshToken | null = await this.refreshTokenDatabase.get(refToken)
        const accTokenDecoded = JwtToken.decode(accToken);
        if (this.isRefreshTokenInvalid(refreshToken, accTokenDecoded)) {
            throw new AuthenticationFailedException();
        }

        await this.refreshTokenDatabase.revoke(refreshToken?.id, ip)
        return await this.generateTokens(UUID.of(accTokenDecoded.id), ip, Role[accTokenDecoded.role as keyof typeof Role]);
    }

    public async login(email: Email, password: string, ip: string, role: Role, db: AuthDatabase): Promise<[JwtToken, RefreshToken]> {
        this.createLoginAttempt(email);

        const user: UserAuthModel | null = await db.getByEmail(email);
        await this.validateUserAuth(user, password);

        // @ts-ignore - user is populated from DB so we're certain that id is set
        const userId: UUID = user.getId();
        return await this.generateTokens(userId, ip, role);
    }

    public async generateTokens(userId: UUID, ip: string, role: Role): Promise<[JwtToken, RefreshToken]> {
        const accessToken: JwtToken = JwtToken.loginAndGetAccessToken(userId, role);
        const refreshToken: RefreshToken = await this.refreshTokenDatabase.create(RefreshToken.create(userId, ip, accessToken.getToken()))

        return [accessToken, refreshToken]
    }

    private isRefreshTokenInvalid(refreshToken: RefreshToken | null, accTokenDecoded: { id: string; role: string; exp: number }) {
        return !refreshToken || !accTokenDecoded || refreshToken.token.getRevokedAt() || accTokenDecoded.id !== refreshToken.userId.getValue() || refreshToken.token.getExpires() < Date.now();
    }

    private createLoginAttempt(email: Email): void {
        this.loginAttemptsDatabase.create(email);
    }

    private async validateUserAuth(user: UserAuthModel | null, password: string): Promise<void> {
        if (!user || !user.getPassword() || !user.getPassword()?.getHash() || !await user.getPassword()?.compare(password)) {
            throw new AuthenticationFailedException();
        }
    }
}
