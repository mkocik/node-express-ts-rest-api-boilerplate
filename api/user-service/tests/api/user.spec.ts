import chai, {assert, expect} from "chai";
import chaiHttp from 'chai-http';
import 'mocha';
import {dbConnector, SERVICE_URL} from "../auth-api.config"
import {Collection, Db} from "mongodb";
import {Role} from "../../src/common/role";
import {loginAndGetAccessToken, validateErrorArray, validateErrorObj, wait} from "../test-util";

chai.use(chaiHttp);

describe('User test suite', () => {
    let _users: Collection;

    before(async () => {
        const db: Db = await dbConnector();
        _users = db.collection("users");
    });

    beforeEach(async () => {
        await _users.deleteMany({});
    });

    describe('Create method', () => {
        it('it should return 422 on lack of request params', async () => {
            const res = await chai.request(SERVICE_URL).post('/');

            validateErrorArray(res, 4)
            expect(res.body.errors.map((x: any) => x.param)).to.eql(['firstName', 'lastName', 'email', 'password'])
        });

        it('it should return 422 on wrong email', async () => {
            const res = await chai.request(SERVICE_URL).post('/').send({firstName: 'John', email: 'abc', lastName: 'Doe', 'password': 'qwe'})

            validateErrorObj(res, 'Error: Email is not valid');
        });

        it('it should return 422 on wrong password', async () => {
            const res = await chai.request(SERVICE_URL).post('/').send({firstName: 'John', email: 'tom.black@example.com', lastName: 'Doe', 'password': 'qwe'})
            validateErrorObj(res, 'Error: Password not valid');
        });

        it('it should return 422 on not unique email', async () => {
            await _users.insertOne({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com'
            });

            const res = await chai.request(SERVICE_URL).post('/').send({firstName: 'John', email: 'john.doe@example.com', lastName: 'Doe', 'password': 'qwerty'})
            validateErrorObj(res, 'Error: Email is not unique');
        });

        it('it should properly create user', async () => {
            const res = await chai.request(SERVICE_URL).post('/').send({firstName: 'John', email: 'john.doe@example.com', lastName: 'Doe', 'password': 'qwerty'})

            assert.equal(res.status, 201)
            expect(res.body).to.be.an('object')
            assert.equal(res.body.success, true)
            expect(res.body.data).to.contain({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com'
            })

            expect(await _users.findOne({_id: res.body.data.id})).to.exist;
            // todo check if the subscribers logic has been executed (eg sending email)
        });
    });
});
