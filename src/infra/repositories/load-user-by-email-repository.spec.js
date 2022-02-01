const MongoHelper = require('../helpers/mongo-helper')
const LoadUserByEmailRepository = require('./load-user-by-email-repository')
let db

const makeSut = () => {
    const userModel = db.collection('users')
    const sut = new LoadUserByEmailRepository(userModel)
    return { sut, userModel }
}

describe('LoadUserByEmail Repository', () => {

    beforeAll(async() => {
        await MongoHelper.connect(process.env.MONGO_URL)
        db = await MongoHelper.getDb()
    });

    beforeEach(async() => {
        await db.collection('users').deleteMany();
    });

    afterAll(async() => {
        await MongoHelper.disconnect();
    });

    it('should return null if no user is found', async() => {
        const { sut } = makeSut()
        const user = await sut.load('invalid_email@mail.com')
        expect(user).toBeNull()
    })

    it('should return an user if user is found', async() => {
        const { sut, userModel } = makeSut()
        await userModel.insertOne({ email: 'valid_email@mail.com' });
        const user = await sut.load('valid_email@mail.com')
        expect(user.email).toBe('valid_email@mail.com')
    })
})