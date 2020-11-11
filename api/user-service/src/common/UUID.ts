import {v4 as uuid} from 'uuid';

export class UUID {
    private readonly value: string;

    public static create(): UUID {
        return new UUID(uuid());
    }

    public static of(id: string): UUID {
        return new UUID(id);
    }

    private constructor(id: string) {
        this.value = id;
    }

    public getValue() {
        return this.value;
    }
}
