import {PasswordNotValidException} from "../exceptions/password-not-valid.exception";
import {hash, compare} from "bcrypt";

export class Password {
    private static SALT_ROUNDS: number = 10;
    private static MIN_PASS_LENGTH: number = 6;
    private readonly value: string;

    public static async of(pass: string): Promise<Password> {
        if (Password.isValidPassword(pass)) {
            return await Password.create(pass);
        }
        throw new PasswordNotValidException();
    }

    public async compare(pass: string): Promise<boolean> {
        return await compare(pass, this.getHash())
    }

    public static ofHash(hash: string): Password {
        return new Password(hash);
    }

    private static isValidPassword(pass: string): boolean {
        return pass.length >= Password.MIN_PASS_LENGTH;
    }

    private static async create(pass: string) {
        const passHash = await hash(pass, Password.SALT_ROUNDS);
        return new Password(passHash)
    }

    private constructor(hash: string = '') {
        this.value = hash;
    }

    public getHash() {
        return this.value;
    }
}
