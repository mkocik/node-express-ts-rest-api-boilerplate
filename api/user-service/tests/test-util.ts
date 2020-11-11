import {Role} from "../src/common/role";
import {JwtToken} from "../src/common/jwt-token";
import {UUID} from "../src/common/UUID";
import {assert, expect} from "chai";

export function loginAndGetAccessToken(id: string, role: Role): string {
    return 'Bearer ' + loginAndGetPlainAccessToken(id, role);
}

export function loginAndGetPlainAccessToken(id: string, role: Role): string {
    return JwtToken.loginAndGetAccessToken(UUID.of(id), role).getToken();
}

export function validateErrorObj(res: any, msg: string) {
    assert.equal(res.status, 422)
    expect(res.body).to.be.an('object')
    assert.equal(res.body.success, false)
    assert.equal(res.body.message, msg)
}

export function validateErrorArray(res: any, length: number) {
    assert.equal(res.status, 422)
    expect(res.body).to.be.an('object')
    assert.equal(res.body.success, false)
    expect(res.body.errors).to.be.an('array')
    assert.equal(res.body.errors.length, length)
}

/* function used to wait eg. for operation's side-effect, like actions made after publishing the event */
export async function wait(ms: number = 10) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
