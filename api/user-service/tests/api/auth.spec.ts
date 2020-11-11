import {Collection, Db} from "mongodb";
import {dbConnector, SERVICE_URL} from "../auth-api.config";
import chai, {assert, expect} from "chai";
import {
    loginAndGetPlainAccessToken,
    validateErrorArray,
    validateErrorObj,
    wait
} from "../test-util";
import chaiHttp from "chai-http";
import {Password} from "../../src/common/password";
import {Role} from "../../src/common/role";

chai.use(chaiHttp);

describe('Authentication test suite', () => {
    let _refreshTokens: Collection,
        _loginAttempts: Collection,
        _users: Collection;

    before(async () => {
        const db: Db = await dbConnector();
        _refreshTokens = db.collection("refresh_tokens");
        _loginAttempts = db.collection("login_attempts");
        _users = db.collection("users");
    });

    beforeEach(async () => {
        await _refreshTokens.deleteMany({});
        await _loginAttempts.deleteMany({});
        await _users.deleteMany({});
    });

    describe('login method', () => {
        it('it should return 422 on lack of parameters', async () => {
            const res = await chai.request(SERVICE_URL).post('/login')

            validateErrorArray(res, 2)
            expect(res.body.errors.map((x: any) => x.param)).to.eql(['email', 'password'])
        });

        it('it should fail on logging in with non-existing email', async () => {
            const res = await chai.request(SERVICE_URL).post('/login').send({email: 'test@example.com', password: '123'})

            validateErrorObj(res, 'Error: Authentication failed');

            await wait();
            expect(await _loginAttempts.findOne({email: 'test@example.com'})).to.exist;
        });

        it('it should fail on logging in with user without password set', async () => {
            await _users.insertOne({
                _id: '123',
                firstName: 'Bruce',
                email: 'bruce.lee@example.it',
                lastName: 'Lee'
            });

            const res = await chai.request(SERVICE_URL).post('/login').send({email: 'bruce.lee@example.it', password: '123'})

            validateErrorObj(res, 'Error: Authentication failed');

            await wait();
            expect(await _loginAttempts.findOne({email: 'bruce.lee@example.it'})).to.exist;
        });

        it('it should fail on logging in with wrong credentials', async () => {
            await _users.insertOne({
                _id: '123',
                firstName: 'Bruce',
                email: 'bruce.lee@example.it',
                lastName: 'Lee',
                password: (await Password.of('qwerty')).getHash()
            });

            const res = await chai.request(SERVICE_URL).post('/login').send({email: 'bruce.lee@example.it', password: '123'})

            validateErrorObj(res, 'Error: Authentication failed');

            await wait();
            expect(await _loginAttempts.findOne({email: 'bruce.lee@example.it'})).to.exist;
        });

        it('it should successfully log in', async () => {
            await _users.insertOne({
                _id: '123',
                firstName: 'Bruce',
                email: 'bruce.lee@example.it',
                lastName: 'Lee',
                password: (await Password.of('qwerty')).getHash()
            });

            const res = await chai.request(SERVICE_URL).post('/login').send({email: 'bruce.lee@example.it', password: 'qwerty'})

            assert.equal(res.status, 200)
            expect(res.body).to.be.an('object')
            assert.equal(res.body.success, true)
            expect(res.body.data).to.have.property('accessToken');
            expect(res.body.data).to.have.property('refreshToken');
            expect((await _refreshTokens.findOne({userId: '123'}))).to.not.be.null;

            await wait();
            expect(await _loginAttempts.findOne({email: 'bruce.lee@example.it'})).to.exist;
        });
    });

    describe('refreshToken method', () => {
        it('it should return 422 on lack of parameters', async () => {
            const res = await chai.request(SERVICE_URL).post('/token')

            validateErrorArray(res, 2)
            expect(res.body.errors.map((x: any) => x.param)).to.eql(['accessToken', 'refreshToken'])
        });

        it('it should fail while sending wrong access token', async () => {
            const res = await chai.request(SERVICE_URL).post('/token').send({accessToken: 'test', refreshToken: '123'})

            validateErrorObj(res, 'Error: Authentication failed');
        });

        it('it should fail while sending revoked refresh token', async () => {
            await _users.insertOne({
                _id: '123',
                firstName: 'Bruce',
                email: 'bruce.lee@example.it',
                lastName: 'Lee'
            });

            await _refreshTokens.insertOne({
                _id: '123',
                userId: '123',
                token: 'test_token',
                expires: Date.now() + 1000,
                revokedAt: Date.now()
            });

            const res = await chai.request(SERVICE_URL).post('/token').send({accessToken: loginAndGetPlainAccessToken('123', Role.DEFAULT), refreshToken: 'test_token'})

            validateErrorObj(res, 'Error: Authentication failed');
        });

        it('it should fail while sending refresh token with not matching user id to access token', async () => {
            await _users.insertOne({
                _id: '123',
                firstName: 'Bruce',
                email: 'bruce.lee@example.it',
                lastName: 'Lee'
            });

            await _refreshTokens.insertOne({
                _id: '123',
                userId: '456',
                token: 'test_token',
                expires: Date.now() + 1000
            });

            const res = await chai.request(SERVICE_URL).post('/token').send({accessToken: loginAndGetPlainAccessToken('123', Role.DEFAULT), refreshToken: 'test_token'})

            validateErrorObj(res, 'Error: Authentication failed');
        });

        it('it should fail while sending expired refresh token', async () => {
            await _users.insertOne({
                _id: '123',
                firstName: 'Bruce',
                email: 'bruce.lee@example.it',
                lastName: 'Lee'
            });

            await _refreshTokens.insertOne({
                _id: '123',
                userId: '123',
                token: 'test_token',
                expires: Date.now() - 1000
            });

            const res = await chai.request(SERVICE_URL).post('/token').send({accessToken: loginAndGetPlainAccessToken('123', Role.DEFAULT), refreshToken: 'test_token'})

            validateErrorObj(res, 'Error: Authentication failed');
        });

        it('it should properly refresh access token', async () => {
            await _users.insertOne({
                _id: '123',
                firstName: 'Bruce',
                email: 'bruce.lee@example.it',
                lastName: 'Lee'
            });

            /* will be searching using this date, as token is the same after calling logIn 2 times */
            const firstRefreshTokenExpiration = Date.now() + 1000;
            await _refreshTokens.insertOne({
                _id: '123',
                userId: '123',
                token: 'test_token',
                expires: firstRefreshTokenExpiration
            });

            const res = await chai.request(SERVICE_URL).post('/token').send({accessToken: loginAndGetPlainAccessToken('123', Role.DEFAULT), refreshToken: 'test_token'})

            assert.equal(res.status, 200)
            expect(res.body).to.be.an('object')
            assert.equal(res.body.success, true)
            expect(res.body.data).to.have.property('accessToken');
            expect(res.body.data).to.have.property('refreshToken');
            expect((await _refreshTokens.findOne({expires: firstRefreshTokenExpiration})).revokedAt).to.not.be.undefined;
            expect((await _refreshTokens.findOne({expires: { $gt: firstRefreshTokenExpiration }})).revokedAt).to.be.undefined;
        });
    });

    describe('logout method', () => {
        it('it should return 401 on unauthorized user', async () => {
            const res = await chai.request(SERVICE_URL).post('/logout');

            assert.equal(res.status, 401)
            assert.equal(res.body.success, false)
        });

        it('it should return 401 on wrong token sent', async () => {
            const res = await chai.request(SERVICE_URL).post('/logout').set('Authorization', 'Bearer 123');

            assert.equal(res.status, 401)
            assert.equal(res.body.success, false)
        });

        it('it should properly logout user', async () => {
            const accessToken = loginAndGetPlainAccessToken('acc_token', Role.DEFAULT);
            await _refreshTokens.insertOne({
                _id: '123',
                userId: '123',
                token: 'test_token',
                expires: Date.now() + 1000,
                forAccessToken: accessToken
            });

            const res = await chai.request(SERVICE_URL).post('/logout').set('Authorization', 'Bearer ' + accessToken);

            assert.equal(res.status, 204)
            expect((await _refreshTokens.findOne({_id: '123'})).revokedAt).to.not.be.undefined;
        });
    });
});
