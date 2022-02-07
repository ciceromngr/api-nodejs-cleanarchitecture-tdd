const request = require('supertest');
const MongoHelper = require('../../infra/helpers/mongo-helper');
const app = require('../../main/config/app')
const bcrypt = require('bcrypt')
let userModel

describe('LoginRouter', () => {

    beforeAll(async() => {
        await MongoHelper.connect(process.env.MONGO_URL)
        userModel = await MongoHelper.getCollection('users')
    })

    beforeEach(async() => {
        await userModel.deleteMany()
    })

    afterAll(async() => {
        await MongoHelper.disconnect()
    })

    it('should return 200 when valid credentials are provider', async() => {
        await userModel.insertOne({
            email: 'valid_email@mail.com',
            password: bcrypt.hashSync('hashed_password', 10)
        })
        await request(app)
            .post('/api/login')
            .send({
                email: 'valid_email@mail.com',
                password: 'hashed_password'
            })
            .expect(200)
    })

    it('should return 401 when invalid credentials are provider', async() => {
        await request(app)
            .post('/api/login')
            .send({
                email: 'valid_email@mail.com',
                password: 'hashed_password'
            })
            .expect(401)
    })
})